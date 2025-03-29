import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  FaChalkboardTeacher, FaUserGraduate, FaBookOpen, FaTasks,
  FaPlay, FaCheckCircle, FaTimesCircle
} from "react-icons/fa";
import "./HelpTeachingPrograms.css"; 

const HelpTeachingPrograms = () => {
  const { id } = useParams(); // Get opportunity ID from URL
  const navigate = useNavigate();
  const [opportunity, setOpportunity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [startTeaching, setStartTeaching] = useState(false);
  const [selectedTask, setSelectedTask] = useState("");
  const [completedTasks, setCompletedTasks] = useState([]);
  const [email, setEmail] = useState(""); // Volunteer email
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  // Fetch opportunity details
  useEffect(() => {
    const fetchOpportunity = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/volunteer/opportunities/${id}`);
        if (!response.ok) throw new Error("Failed to fetch opportunity details.");
        
        const data = await response.json();
        setOpportunity(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOpportunity();
  }, [id]);

  useEffect(() => {
       const storedEmail = localStorage.getItem("email");
       if (storedEmail) setEmail(storedEmail);
     }, []);
   

  if (loading) return <p>Loading opportunity details...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!opportunity) return <p>No opportunity found.</p>;

  // Handle Task Selection
  const handleTaskSelection = (task) => {
    setSelectedTask(task);
  };

  // Mark Task as Completed
  const completeTask = () => {
    if (selectedTask && !completedTasks.includes(selectedTask)) {
      setCompletedTasks([...completedTasks, selectedTask]);
      setSelectedTask(""); // Reset after completion
    }
  };

  // Submit Volunteer Work
  const handleSubmit = async () => {
    if (completedTasks.length === 0) {
      alert("Please complete at least one task before submitting.");
      return;
    }

    setSubmitting(true);

    const submissionData = {
      opportunityId: id,
      email,
      surveyResponses: completedTasks.map(task => ({ task, status: "Completed" }))
    };

    try {
      const response = await fetch("http://localhost:5000/api/volunteer/submit-work", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submissionData),
      });

      if (!response.ok) throw new Error("Failed to submit work.");

      setSuccessMessage("✅ Your work has been successfully submitted!");
      setCompletedTasks([]); // Clear tasks after submission

      // Navigate back to opportunities page after delay
      setTimeout(() => {
        navigate("/opportunities");
      }, 2000);

    } catch (error) {
      alert("Error submitting your work. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="htp-container">
      {/* 📚 Introduction Section */}
      <div className="htp-intro">
        <h2><FaChalkboardTeacher className="htp-icon" /> {opportunity.title}</h2>
        <p>{opportunity.longDescription}</p>
        <p><strong>📅 Date:</strong> {opportunity.date ? new Date(opportunity.date).toDateString() : "Date not available"}</p>
        <p><strong>📖 Subjects:</strong> {opportunity.subjects?.join(", ") || "General Teaching"}</p>
      </div>

      {/* ✅ Volunteer Confirmation */}
      {!startTeaching ? (
        <div className="htp-confirmation-box">
          <p>Are you ready to assist in the teaching program?</p>
          <button className="htp-start-btn" onClick={() => setStartTeaching(true)}>
            <FaPlay className="htp-icon" /> Yes, Start Teaching
          </button>
          <button className="htp-cancel-btn" onClick={() => navigate("/opportunities")}>
            <FaTimesCircle className="htp-icon" /> Cancel
          </button>
        </div>
      ) : (
        <div className="htp-task-selection">
          <h3><FaTasks className="htp-icon" /> Select a Task</h3>
          <div className="htp-task-list">
            <button className={`htp-task-btn ${selectedTask === "Mentoring" ? "htp-active" : ""}`} 
                    onClick={() => handleTaskSelection("Mentoring")}>
              <FaUserGraduate className="htp-icon" /> Student Mentoring
            </button>
            <button className={`htp-task-btn ${selectedTask === "Assisting" ? "htp-active" : ""}`} 
                    onClick={() => handleTaskSelection("Assisting")}>
              <FaBookOpen className="htp-icon" /> Assisting in Teaching
            </button>
            <button className={`htp-task-btn ${selectedTask === "Organizing" ? "htp-active" : ""}`} 
                    onClick={() => handleTaskSelection("Organizing")}>
              <FaTasks className="htp-icon" /> Organizing Study Materials
            </button>
          </div>

          {/* 🚀 Task Completion */}
          {selectedTask && (
            <div className="htp-task-confirmation">
              <p>✅ Task Selected: <strong>{selectedTask}</strong></p>
              <button className="htp-complete-btn" onClick={completeTask}>
                <FaCheckCircle className="htp-icon" /> Mark as Completed
              </button>
            </div>
          )}

          {/* 📊 Completed Tasks Summary */}
          {completedTasks.length > 0 && (
            <div className="htp-completed-tasks">
              <h4>✔️ Completed Tasks:</h4>
              <ul>
                {completedTasks.map((task, index) => (
                  <li key={index}>{task}</li>
                ))}
              </ul>
              <button 
                className="htp-submit-btn" 
                onClick={handleSubmit} 
                disabled={submitting}
              >
                {submitting ? "Submitting..." : (
                  <>
                    <FaCheckCircle className="htp-icon" /> Confirm & Submit
                  </>
                )}
              </button>
            </div>
          )}

          {/* Success Message */}
          {successMessage && <p className="success-message">{successMessage}</p>}
        </div>
      )}
    </div>
  );
};

export default HelpTeachingPrograms;
