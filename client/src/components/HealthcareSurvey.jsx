import React, { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate  } from "react-router-dom";
import {
  FaUser, FaNotesMedical, FaHospital, FaSyringe,
  FaWater, FaToilet, FaPlay, FaCheckCircle, FaTimesCircle,
  FaTrash, FaUndo
} from "react-icons/fa";
import "./Survey.css";

const INITIAL_FORM_STATE = {
  name: "", age: "", gender: "",
  commonDiseases: "", hospitalAvailability: "",
  vaccinated: "", sanitation: "", cleanWater: "",
};

const HealthcareSurvey = () => {
  const { id } = useParams();
  const [opportunity, setOpportunity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
    const navigate = useNavigate();
  const [startSurvey, setStartSurvey] = useState(false);
  const [responses, setResponses] = useState([]);
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [email, setEmail] = useState("");

  // Memoized storage keys with ID validation
  const STORAGE_KEYS = useMemo(() => {
    if (!id) return {};
    return {
      RESPONSES: `healthcare-${id}-responses`,
      DRAFT: `healthcare-${id}-draft`
    };
  }, [id]);

  // Define all handlers before effects
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddResponse = (e) => {
    e.preventDefault();
    setResponses(prev => [...prev, formData]);
    setFormData(INITIAL_FORM_STATE);
    localStorage.removeItem(STORAGE_KEYS.DRAFT);
  };

  const handleRemoveResponse = (index) => {
    setResponses(prev => prev.filter((_, i) => i !== index));
  };
  
useEffect(() => {
       const storedEmail = localStorage.getItem("email");
       if (storedEmail) setEmail(storedEmail);
     }, []);

  const handleSubmitAll = async () => {
    if (!opportunity || responses.length < opportunity.surveyCount) return;

    try {
      const response = await fetch("http://localhost:5000/api/volunteer/submit-work", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, // Replace with logged-in user's email
          opportunityId: id,
          surveyResponses: responses,}),
      });

      if (!response.ok) throw new Error("Failed to submit surveys.");
      
      alert("Survey submitted successfully!");
      setResponses([]);
      setStartSurvey(false);
      localStorage.removeItem(STORAGE_KEYS.RESPONSES);
      localStorage.removeItem(STORAGE_KEYS.DRAFT);
        navigate("/opportunities");
    } catch (error) {
      alert("Error submitting survey: " + error.message);
    }
  };

  // Fetch opportunity data
  useEffect(() => {
    let isMounted = true;
    const fetchOpportunity = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/volunteer/opportunities/${id}`);
        if (!response.ok) throw new Error("Failed to fetch opportunity details.");
        const data = await response.json();
        if (isMounted) setOpportunity(data);
      } catch (error) {
        if (isMounted) setError(error.message);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    
    if (id) fetchOpportunity();
    return () => { isMounted = false; };
  }, [id]);

  // Save data to localStorage
  useEffect(() => {
    if (!STORAGE_KEYS.RESPONSES || !dataLoaded) return;
    
    try {
      localStorage.setItem(STORAGE_KEYS.RESPONSES, JSON.stringify(responses));
      if (Object.values(formData).some(val => val !== "")) {
        localStorage.setItem(STORAGE_KEYS.DRAFT, JSON.stringify(formData));
      }
    } catch (error) {
      console.error("LocalStorage error:", error);
    }
  }, [responses, formData, STORAGE_KEYS, dataLoaded]);

  // Load persisted data
  useEffect(() => {
    if (!opportunity || !STORAGE_KEYS.RESPONSES) return;

    const loadData = () => {
      try {
        const savedResponses = localStorage.getItem(STORAGE_KEYS.RESPONSES);
        const savedDraft = localStorage.getItem(STORAGE_KEYS.DRAFT);

        if (savedResponses) {
          setResponses(JSON.parse(savedResponses));
        }
        if (savedDraft) {
          setFormData(JSON.parse(savedDraft));
        }
      } catch (error) {
        console.error("Error loading data:", error);
        localStorage.removeItem(STORAGE_KEYS.RESPONSES);
        localStorage.removeItem(STORAGE_KEYS.DRAFT);
      } finally {
        setDataLoaded(true);
      }
    };

    loadData();
  }, [opportunity, STORAGE_KEYS]);

  // Reset functionality
  const handleResetSurvey = () => {
    if (window.confirm("Are you sure you want to reset all progress? This cannot be undone!")) {
      localStorage.removeItem(STORAGE_KEYS.RESPONSES);
      localStorage.removeItem(STORAGE_KEYS.DRAFT);
      setResponses([]);
      setFormData(INITIAL_FORM_STATE);
      setStartSurvey(false);
      alert("Survey has been reset successfully!");
    }
  };

  // Loading and error states
  if (loading) return <div className="loading-state">Loading opportunity details...</div>;
  if (error) return <div className="error-state">Error: {error}</div>;
  if (!opportunity) return <div className="error-state">No opportunity found.</div>;
  if (!dataLoaded) return <div>Loading saved data...</div>;

  return (
    <div className="survey-container">
      {opportunity && (
        <>
          <div className="survey-intro">
            <h2>📋 {opportunity.title}</h2>
            <p>{opportunity.longDescription}</p>
            <p>📍 <strong>{opportunity.location}</strong></p>
          </div>

          {!startSurvey ? (
            <div className="confirmation-box">
              <p>Are you ready to begin the survey?</p>
              <button className="start-btn" onClick={() => setStartSurvey(true)}>
                <FaPlay className="icon" /> Yes, Start Survey
              </button>
              <button className="cancel-btn" onClick={() => navigate("/opportunities")}>
                <FaTimesCircle className="icon" /> Cancel
              </button>
            </div>
          ) : (
            <div className="survey-form">
              <div className="survey-counter">
                <h3>
                  📋 Progress: {responses.length}/{opportunity.surveyCount} surveys completed
                  <span className="remaining">({opportunity.surveyCount - responses.length} remaining)</span>
                </h3>
              </div>
              <h3>📝 Survey Form</h3>
              <form onSubmit={handleAddResponse}>
                {/* Form fields same as before */}
                <div className="form-group">
                  <label><FaUser className="icon" /> Name:</label>
                  <input type="text" name="name" value={formData.name} onChange={handleChange} required />
                </div>

                <div className="form-group-row">
                  <div className="form-group">
                    <label><FaUser className="icon" /> Age:</label>
                    <input type="number" name="age" value={formData.age} onChange={handleChange} required />
                  </div>
                  <div className="form-group">
                    <label><FaUser className="icon" /> Gender:</label>
                    <select name="gender" value={formData.gender} onChange={handleChange} required>
                      <option value="">Select</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label><FaNotesMedical className="icon" /> Common Diseases:</label>
                  <input type="text" name="commonDiseases" value={formData.commonDiseases} onChange={handleChange} />
                </div>

                <div className="form-group">
                  <label><FaHospital className="icon" /> Hospital Available?</label>
                  <select name="hospitalAvailability" value={formData.hospitalAvailability} onChange={handleChange} required>
                    <option value="">Select</option>
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                  </select>
                </div>

                <div className="form-group">
                  <label><FaSyringe className="icon" /> Vaccination Status:</label>
                  <select name="vaccinated" value={formData.vaccinated} onChange={handleChange} required>
                    <option value="">Select</option>
                    <option value="Fully Vaccinated">Fully Vaccinated</option>
                    <option value="Partially Vaccinated">Partially Vaccinated</option>
                    <option value="Not Vaccinated">Not Vaccinated</option>
                  </select>
                </div>

                <div className="form-group">
                  <label><FaToilet className="icon" /> Sanitation Facilities:</label>
                  <select name="sanitation" value={formData.sanitation} onChange={handleChange} required>
                    <option value="">Select</option>
                    <option value="Good">Good</option>
                    <option value="Average">Average</option>
                    <option value="Poor">Poor</option>
                  </select>
                </div>

                <div className="form-group">
                  <label><FaWater className="icon" /> Access to Clean Water?</label>
                  <select name="cleanWater" value={formData.cleanWater} onChange={handleChange} required>
                    <option value="">Select</option>
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                  </select>
                </div>

                <button type="submit" className="submit-btn">
                  <FaCheckCircle className="icon" /> Add Response
                </button>
              </form>

              {responses.length > 0 && (
                <div className="responses-list">
                  <h3>📊 Collected Responses ({responses.length}/{opportunity.surveyCount})</h3>
                  <ul>
                    {responses.map((response, index) => (
                      <li key={index}>
                        <span>{response.name} - {response.age} years</span>
                        <button className="remove-btn" onClick={() => handleRemoveResponse(index)}>
                          <FaTrash className="icon" /> Remove
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <button
                onClick={handleResetSurvey}
                className="reset-btn"
                style={{ marginTop: '1rem' }}
              >
                <FaUndo className="icon" /> Reset All Data
              </button>

              <button 
                className={`submit-all-btn ${responses.length >= opportunity.surveyCount ? "active" : "disabled"}`} 
                onClick={handleSubmitAll}
                disabled={responses.length < opportunity.surveyCount}
              >
                <FaCheckCircle className="icon" /> Submit Survey
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default HealthcareSurvey;