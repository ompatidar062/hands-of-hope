import React, { useEffect, useState } from "react";
import { FaSearch, FaTasks, FaCheckCircle } from "react-icons/fa"; // Icons
import { useNavigate } from "react-router-dom";
import "./VolunteerDashboard.css";

const VolunteerDashboard = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const storedName = localStorage.getItem("userName");
    if (storedName) setUserName(storedName);
  }, []);

  return (
    <div className="dashboard-container">
      {/* Welcome Section */}
      <div className="welcome-section">
        <h1>Welcome, {userName ? userName : "Volunteer"}! 👋</h1>
        <p>Ready to make an impact?</p>
        <p>Explore volunteering opportunities & track your progress.</p>
      </div>

      {/* Available Volunteer Opportunities */}
      <div className="opportunities-section">
        <h2>Available Volunteer Opportunities</h2>
        <div className="opportunities-grid">
          <OpportunityCard title="Conduct Healthcare Surveys" onClick={() => navigate("/opportunities")} />
          <OpportunityCard title="Conduct Education Surveys" onClick={() => navigate("/opportunities")} />
          <OpportunityCard title="Assist Healthcare Camps" onClick={() => navigate("/opportunities")} />
          <OpportunityCard title="Help in Teaching Programs" onClick={() => navigate("/opportunities")} />
        </div>
      </div>

      {/* Find More Opportunities */}
      <div className="center-button">
        <button className="find-more-button" onClick={() => navigate("/opportunities")}>
          <FaSearch className="icon" /> Find More Opportunities
        </button>
      </div>

      {/* Active & Completed Tasks */}
      <div className="task-row">
        <div className="task-section">
          <h2><FaCheckCircle className="icon" /> Completed Tasks</h2>
          <div className="center-button">
            <button className="progress-button" onClick={()=>navigate("/completed-tasks")}>
              Go to My Progress
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Reusable Opportunity Card Component
const OpportunityCard = ({ title, onClick }) => {
  return (
    <div className="opportunity-card">
      <h3>{title}</h3>
      <button className="view-button" onClick={onClick}>View</button>
    </div>
  );
};

export default VolunteerDashboard;
