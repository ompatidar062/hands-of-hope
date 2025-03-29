import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './CompletedTasks.css';

const CompletedTasks = () => {
  const [completedWorks, setCompletedWorks] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/volunteer/completed-works', {
          params: { email: localStorage.getItem('email') },
          withCredentials: true
        });
        setCompletedWorks(response.data.works);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div className="volunteer-loading">Loading your contributions...</div>;

  return (
    <div className="volunteer-contributions-container">
      <header className="volunteer-contributions-header">
        <h1 className="volunteer-title">Your Volunteer Contributions</h1>
        <button onClick={() => navigate('/dashboard/volunteer')} className="volunteer-back-btn">
          &larr; Back to Dashboard
        </button>
      </header>

      <div className="volunteer-contributions-list">
        {completedWorks.length === 0 ? (
          <div className="volunteer-empty-state">
            <p className="volunteer-empty-message">No completed volunteer work yet</p>
            <button onClick={() => navigate('/opportunities')} className="volunteer-cta-btn">
              Explore Opportunities
            </button>
          </div>
        ) : (
          completedWorks.map(work => (
            <div key={work._id} className={`volunteer-contribution-card ${work.category.includes('Survey') ? 'volunteer-survey-card' : 'volunteer-camp-card'}`}>
              <div className="volunteer-card-header">
                <h2 className="volunteer-work-title">{work.title}</h2>
                <span className={`volunteer-category-tag ${work.category.toLowerCase().includes('survey') ? 'volunteer-survey-tag' : 'volunteer-camp-tag'}`}>
                  {work.category}
                </span>
              </div>
              
              <div className="volunteer-card-body">
                <p className="volunteer-work-description">{work.longDescription}</p>
                
                <div className="volunteer-metadata-grid">
                  <div className="volunteer-metadata-item">
                    <span className="volunteer-metadata-label">Location:</span>
                    <span className="volunteer-metadata-value">{work.location}</span>
                  </div>
                  {work.date && (
                    <div className="volunteer-metadata-item">
                      <span className="volunteer-metadata-label">Date:</span>
                      <span className="volunteer-metadata-value">{new Date(work.date).toLocaleDateString()}</span>
                    </div>
                  )}
                  {work.surveyCount && (
                    <div className="volunteer-metadata-item">
                      <span className="volunteer-metadata-label">Surveys Completed:</span>
                      <span className="volunteer-metadata-value">{work.surveyCount}</span>
                    </div>
                  )}
                </div>

                {work.responses && work.responses.length > 0 && (
                  <div className="volunteer-responses-section">
                    <h3 className="volunteer-responses-title">Your {work.category.includes('Survey') ? 'Survey Responses' : 'Tasks Completed'}</h3>
                    <div className="volunteer-responses-grid">
                      {work.responses.map((response, index) => (
                        <div key={index} className="volunteer-response-card">
                          {Object.entries(response.responseData).map(([key, value]) => (
                            <div key={key} className="volunteer-response-item">
                              <strong className="volunteer-response-key">{key.replace(/([A-Z])/g, ' $1').trim()}:</strong>
                              <span className="volunteer-response-value">{value}</span>
                            </div>
                          ))}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CompletedTasks;