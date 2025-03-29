import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // ✅ Added for navigation
import "./VolunteerOpportunities.css";
import { FaMapMarkerAlt } from "react-icons/fa"; 

const categories = {
  "All": "All",
  "Healthcare Surveys": "Healthcare-Surveys",
  "Education Surveys": "Education-Surveys",
  "Healthcare Camps": "Healthcare-Camps",
  "Teaching Programs": "Teaching-Programs"
};

const VolunteerOpportunities = () => {
  const [opportunities, setOpportunities] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const navigate = useNavigate(); // ✅ Hook for navigation

  // Fetch opportunities from backend
  useEffect(() => {
    const fetchOpportunities = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/volunteer/opportunities");
        const data = await response.json();
        setOpportunities(data);
      } catch (error) {
        console.error("Error fetching opportunities:", error);
      }
    };
    fetchOpportunities();
  }, []);

  // Filter opportunities based on selected category
  const filteredOpportunities =
    selectedCategory === "All"
      ? opportunities
      : opportunities.filter((opportunity) => opportunity.category === selectedCategory);

  // Handle View Details Click
  const handleViewDetails = (category, id) => {
    const formattedCategory = categories[category]; // Convert category to URL-friendly format
    navigate(`/opportunities/${formattedCategory}/${id}`);
  };

  return (
    <div className="volunteer-container">
      {/* Header */}
      <header className="volunteer-header">
        <h1>Find Volunteer Opportunities</h1>
        <p>Browse and select opportunities that match your skills and availability.</p>
      </header>

      {/* Category Tabs */}
      <div className="category-tabs">
        {Object.keys(categories).map((category) => (
          <button
            key={category}
            className={`category-tab ${selectedCategory === category ? "active" : ""}`}
            onClick={() => setSelectedCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Opportunity List */}
      <div className="opportunity-list">
        {filteredOpportunities.length > 0 ? (
          filteredOpportunities.map((opportunity) => (
            <div key={opportunity._id} className="opportunity-card">
              <h3>{opportunity.title}</h3>
              <p>{opportunity.description}</p>
              <p>
                <FaMapMarkerAlt className="icon" /> {opportunity.location}
              </p>
              <button 
                className="view-button" 
                onClick={() => handleViewDetails(opportunity.category, opportunity._id)}
              >
                View Details
              </button>
            </div>
          ))
        ) : (
          <p className="no-results">No opportunities available for this category.</p>
        )}
      </div>
    </div>
  );
};

export default VolunteerOpportunities;
