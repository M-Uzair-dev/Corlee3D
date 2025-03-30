import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../config/api";
import { toast } from "sonner";
import LoadingSpinner from "../../components/UI/LoadingSpinner";
import "./ViewPages.css";

function ViewContactDetailsPage() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [contactDetails, setContactDetails] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    fetchContactDetails();
  }, []);

  const fetchContactDetails = async () => {
    try {
      setIsLoading(true);
      const response = await api.get("/contact-details/");
      console.log("Contact details response:", response.data);
      setContactDetails(response.data);
    } catch (error) {
      console.error("Error fetching contact details:", error);
      toast.error("Failed to load contact details");
      setErrorMessage("Failed to load contact details. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div
        className="dashboard-content-card"
        style={{
          minHeight: "70vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
        }}
      >
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading contact details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-content-card view-page-container">
      <div className="view-page-header">
        <h2 className="view-heading">Contact Details</h2>
        <button
          className="edit-button"
          onClick={() => navigate("/dashboard/contact-details/edit")}
        >
          Edit Contact Details
        </button>
      </div>

      {errorMessage && <div className="error-message">{errorMessage}</div>}

      <div className="view-section">
        <h3>Contact Information</h3>
        <div className="view-grid">
          <div className="view-field">
            <label>Phone</label>
            <div className="input-style">
              {contactDetails?.phone || "Not specified"}
            </div>
          </div>
          <div className="view-field">
            <label>Email</label>
            <div className="input-style">
              {contactDetails?.email || "Not specified"}
            </div>
          </div>
          <div className="view-field">
            <label>Address</label>
            <div className="input-style">
              {contactDetails?.address || "Not specified"}
            </div>
          </div>
          <div className="view-field">
            <label>City</label>
            <div className="input-style">
              {contactDetails?.city || "Not specified"}
            </div>
          </div>
          <div className="view-field">
            <label>County</label>
            <div className="input-style">
              {contactDetails?.county || "Not specified"}
            </div>
          </div>
          <div className="view-field">
            <label>Postal Code</label>
            <div className="input-style">
              {contactDetails?.postal_code || "Not specified"}
            </div>
          </div>
          <div className="view-field">
            <label>Country</label>
            <div className="input-style">
              {contactDetails?.country || "Not specified"}
            </div>
          </div>
        </div>
      </div>

      <div className="view-section">
        <h3>Social Media</h3>
        <div className="view-grid">
          <div className="view-field">
            <label>Facebook</label>
            <div className="input-style">
              {contactDetails?.facebook ? (
                <a
                  href={contactDetails.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {contactDetails.facebook}
                </a>
              ) : (
                "Not specified"
              )}
            </div>
          </div>
          <div className="view-field">
            <label>Instagram</label>
            <div className="input-style">
              {contactDetails?.instagram ? (
                <a
                  href={contactDetails.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {contactDetails.instagram}
                </a>
              ) : (
                "Not specified"
              )}
            </div>
          </div>
          <div className="view-field">
            <label>WhatsApp</label>
            <div className="input-style">
              {contactDetails?.whatsapp || "Not specified"}
            </div>
          </div>
          <div className="view-field">
            <label>Line</label>
            <div className="input-style">
              {contactDetails?.line || "Not specified"}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .view-page-container {
          width: 100%;
          padding: 24px;
          box-sizing: border-box;
          overflow-x: hidden;
        }

        .view-page-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
        }

        .view-heading {
          color: #4285f4;
          margin: 0;
        }

        .edit-button {
          padding: 8px 16px;
          background-color: #4285f4;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 14px;
          transition: background-color 0.2s;
        }

        .edit-button:hover {
          background-color: #3367d6;
        }

        .view-section {
          background-color: #f9f9f9;
          border-radius: 8px;
          padding: 20px;
          margin-bottom: 20px;
        }

        .view-section h3 {
          margin-top: 0;
          margin-bottom: 16px;
          color: #333;
          font-size: 18px;
          font-weight: 500;
        }

        .view-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 20px;
        }

        .view-field {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .view-field label {
          font-weight: 500;
          color: #555;
        }

        .input-style {
          padding: 10px 12px;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 14px;
          background-color: #f5f5f5;
          color: #333;
          min-height: 38px;
          display: flex;
          align-items: center;
        }

        .input-style a {
          color: #4285f4;
          text-decoration: none;
        }

        .input-style a:hover {
          text-decoration: underline;
        }

        .error-message {
          background-color: #fdeded;
          color: #d32f2f;
          padding: 12px 16px;
          border-radius: 4px;
          margin-bottom: 16px;
          font-size: 14px;
        }

        @media (max-width: 768px) {
          .view-page-container {
            padding: 16px;
          }

          .view-section {
            padding: 16px;
          }

          .view-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}

export default ViewContactDetailsPage;
