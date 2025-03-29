const express = require("express");
const VolunteerOpportunities = require("../models/VolunteerOpportunities");
const CompletedVolunteerWork = require("../models/CompletedVolunteerWork");
const router = express.Router();

// Get MongoDB collection reference
const db = require("../config/db");

// // Add a new opportunity
// router.post("/", async (req, res) => {
//   try {
//     const opportunity = req.body;
//     await db.collection("volunteer_opportunities").insertOne(opportunity);
//     res.status(201).json({ message: "Opportunity added successfully" });
//   } catch (error) {
//     res.status(500).json({ error: "Failed to add opportunity" });
//   }
// });

// Get all opportunities
router.get("/opportunities", async (req, res) => {
    try {
      const opportunities = await VolunteerOpportunities.find();
      res.status(200).json(opportunities);
    } catch (error) {
      console.error("❌ Error fetching opportunities:", error.message);
      res.status(500).json({ error: "Failed to fetch opportunities" });
    }
  });


  // ✅ Route to Get a Single Opportunity by ID
router.get("/opportunities/:id", async (req, res) => {
  try {
    const opportunity = await VolunteerOpportunities.findById(req.params.id);
    if (!opportunity) {
      return res.status(404).json({ message: "Opportunity not found." });
    }
    res.json(opportunity);
  } catch (error) {
    res.status(500).json({ message: "Error fetching opportunity details." });
  }
});


router.post("/submit-work", async (req, res) => {
  try {
    const { email, opportunityId, surveyResponses } = req.body;

    // ✅ Ensure required fields exist
    if (!email || !opportunityId || !surveyResponses || !Array.isArray(surveyResponses) || surveyResponses.length === 0) {
      return res.status(400).json({ message: "Invalid request: Missing required fields or survey responses are empty" });
    }

    // ✅ Find the opportunity by ID
    const opportunity = await VolunteerOpportunities.findById(opportunityId);
    if (!opportunity) {
      return res.status(404).json({ message: "Opportunity not found" });
    }

    // ✅ Format the responses
    const formattedResponses = surveyResponses.map(response => ({
      responseData: response, // Store the full response object
    }));

    // ✅ Store in CompletedVolunteerWork
    const completedWork = new CompletedVolunteerWork({
      email,
      opportunityId,
      title: opportunity.title,
      description: opportunity.description,
      longDescription: opportunity.longDescription,
      category: opportunity.category,
      location: opportunity.location,
      date: opportunity.date,
      surveyCount: opportunity.surveyCount,
      subjects: opportunity.subjects,
      responses: formattedResponses,
    });

    await completedWork.save();

    // ✅ Remove from available opportunities
    await VolunteerOpportunities.findByIdAndDelete(opportunityId);

    // ✅ Final response - ensure only one response is sent
    return res.status(201).json({ message: "Work submitted successfully", completedWork });

  } catch (error) {
    console.error("Error in /submit-work:", error);

    // ✅ Ensure only one response is sent
    if (!res.headersSent) {
      return res.status(500).json({ message: "Server error", error: error.message });
    }
  }
});



router.get('/completed-works', async (req, res) => {
  try {
    const { email } = req.query; 
    if (!email) {
      return res.status(400).json({ 
        success: false,
        message: 'Email parameter is required' 
      });
    }

    const works = await CompletedVolunteerWork.find({ 
      email: email.toLowerCase() 
    }).sort({ date: -1 });

    res.json({ 
      success: true, 
      works 
    });
    
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching completed works',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});


module.exports = router;
