import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  FaHandHoldingMedical, FaUserCheck, FaUserNurse, FaPills, FaHeartbeat, 
  FaPlay, FaCheckCircle, FaTimesCircle
} from "react-icons/fa";
import "./AssistHealthcareCamp.css";

const AssistHealthcareCamp = () => {
  const { id } = useParams(); // Get opportunity ID from URL
  const navigate = useNavigate();
  const [opportunity, setOpportunity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [startAssisting, setStartAssisting] = useState(false);
  const [selectedTask, setSelectedTask] = useState("");
  const [completedTasks, setCompletedTasks] = useState([]);
  const [email, setEmail] = useState(""); // Volunteer email
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

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
    <div className="assist-camps-container">
      {/* Header Section */}
      <div className="camp-header">
        <h2>
          <FaHandHoldingMedical className="icon" /> {opportunity.title}
        </h2>
        <p>{opportunity.longDescription}</p>
        <p><strong>Date:</strong> {opportunity.date ? new Date(opportunity.date).toDateString() : "Date not available"}</p>
      </div>

      {/* Volunteer Confirmation */}
      {!startAssisting ? (
        <div className="confirm-box">
          <p>Are you ready to assist in the medical camp?</p>
          <button className="confirm-btn" onClick={() => setStartAssisting(true)}>
            <FaPlay className="icon" /> Yes, Start Assisting
          </button>
          <button className="cancel-btn" onClick={() => navigate("/opportunities")}>
            <FaTimesCircle className="icon" /> Cancel
          </button>
        </div>
      ) : (
        <div className="camp-details">
          <h3>
            <FaHandHoldingMedical className="icon" /> Select a Task
          </h3>
          <div className="task-list">
            <button 
              className={`task-btn ${selectedTask === "Registration" ? "active" : ""}`} 
              onClick={() => handleTaskSelection("Registration")}
            >
              <FaUserCheck className="icon" /> Patient Registration
            </button>
            <button 
              className={`task-btn ${selectedTask === "Guidance" ? "active" : ""}`} 
              onClick={() => handleTaskSelection("Guidance")}
            >
              <FaUserNurse className="icon" /> Guiding Patients
            </button>
            <button 
              className={`task-btn ${selectedTask === "Medicine" ? "active" : ""}`} 
              onClick={() => handleTaskSelection("Medicine")}
            >
              <FaPills className="icon" /> Medicine Distribution
            </button>
            <button 
              className={`task-btn ${selectedTask === "Checkups" ? "active" : ""}`} 
              onClick={() => handleTaskSelection("Checkups")}
            >
              <FaHeartbeat className="icon" /> Basic Checkups
            </button>
          </div>

          {/* Task Confirmation */}
          {selectedTask && (
            <div className="task-confirmation">
              <p><strong>Task Selected:</strong> {selectedTask}</p>
              <button className="complete-btn" onClick={completeTask}>
                <FaCheckCircle className="icon" /> Mark as Completed
              </button>
            </div>
          )}

          {/* Completed Tasks Summary */}
          {completedTasks.length > 0 && (
            <div className="completed-tasks">
              <h4>Completed Tasks:</h4>
              <ul>
                {completedTasks.map((task, index) => (
                  <li key={index}>{task}</li>
                ))}
              </ul>
              <button 
                className="submit-btn" 
                onClick={handleSubmit} 
                disabled={submitting}
              >
                {submitting ? "Submitting..." : (
                  <>
                    <FaCheckCircle className="icon" /> Confirm & Submit
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

export default AssistHealthcareCamp;
