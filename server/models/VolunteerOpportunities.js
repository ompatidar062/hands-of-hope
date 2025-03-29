const mongoose = require("mongoose");

const volunteerOpportunitySchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  longDescription: { type: String, required: true },
  category: { type: String, required: true },
  location: { type: String, required: true },
  date: { type: Date, default: null }, // Common date field for all types of work
  surveyCount: { type: Number, default: null }, // Number of surveys (only for Surveys)
  subjects: { type: [String], default: [] }, // Subjects (only for Teaching Programs)
  createdAt: { type: Date, default: Date.now }, // Timestamp for record creation
});

const VolunteerOpportunities = mongoose.model(
  "VolunteerOpportunities",
  volunteerOpportunitySchema
);


module.exports = VolunteerOpportunities;
