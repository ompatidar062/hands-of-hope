const mongoose = require("mongoose");

const completedVolunteerWorkSchema = new mongoose.Schema({
  opportunityId: { type: String, required: true }, // Original opportunity ID
  title: { type: String, required: true },
  description: { type: String, required: true },
  longDescription: { type: String, required: true }, // ✅ Fixed: Ensure it's always present
  category: { type: String, required: true }, // Survey, Teaching, Healthcare Camp, etc.
  location: { type: String, required: true },
  date: { type: Date, default: null }, // Date of completion
  surveyCount: { type: Number, default: null }, // Number of surveys (if applicable)
  subjects: { type: [String], default: [] }, // Subjects for Teaching Programs
  email: { type: String, required: true, trim: true, lowercase: true }, // ❌ Removed unique constraint
  responses: [
    {
      responseData: Object, // Dynamic responses (depends on type of work)
    }
  ],
  createdAt: { type: Date, default: Date.now }, // Timestamp when work was completed
});

const CompletedVolunteerWork = mongoose.model("CompletedVolunteerWork", completedVolunteerWorkSchema);

module.exports = CompletedVolunteerWork;
