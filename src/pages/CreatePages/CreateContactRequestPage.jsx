import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../config/api";
import { toast } from "sonner";
import LoadingSpinner from "../../components/UI/LoadingSpinner";
import "./CreatePages.css";

function CreateContactRequestPage() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [formData, setFormData] = useState({
    request_type: "general",
    subject: "",
    message: "",
    company_name: "",
    phone: "",
  });

  const requestTypes = [
    { value: "general", label: "General Inquiry" },
    { value: "product", label: "Product Inquiry" },
    { value: "product_request", label: "Product Request" },
    { value: "other", label: "Other" },
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const response = await api.post("/contact-requests/", formData);
      toast.success("Contact request created successfully");
      navigate(`/dashboard/contact-requests/${response.data.id}`);
    } catch (error) {
      console.error("Error creating contact request:", error);
      toast.error("Failed to create contact request");
      setErrorMessage(
        error.response?.data?.message ||
          "Failed to create contact request. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="dashboard-content-card create-page-container">
      <div className="create-page-header">
        <button
          className="back-button"
          onClick={() => navigate("/dashboard/contact-requests")}
        >
          ← Back to Contact Requests
        </button>
      </div>

      <h2 className="create-heading">Create Contact Request</h2>

      {errorMessage && <div className="error-message">{errorMessage}</div>}

      <form onSubmit={handleSubmit} className="create-form">
        <div className="form-section">
          <h3>Request Details</h3>

          <div className="form-group">
            <label htmlFor="request_type">Request Type *</label>
            <select
              id="request_type"
              name="request_type"
              value={formData.request_type}
              onChange={handleInputChange}
              required
            >
              {requestTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="subject">Subject *</label>
            <input
              type="text"
              id="subject"
              name="subject"
              value={formData.subject}
              onChange={handleInputChange}
              required
              placeholder="Enter request subject"
            />
          </div>

          <div className="form-group">
            <label htmlFor="message">Message *</label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleInputChange}
              required
              rows="4"
              placeholder="Enter your message"
            />
          </div>
        </div>

        <div className="form-section">
          <h3>Contact Information</h3>

          <div className="form-group">
            <label htmlFor="company_name">Company Name</label>
            <input
              type="text"
              id="company_name"
              name="company_name"
              value={formData.company_name}
              onChange={handleInputChange}
              placeholder="Enter company name"
            />
          </div>

          <div className="form-group">
            <label htmlFor="phone">Phone Number</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              placeholder="Enter phone number"
            />
          </div>
        </div>

        <div className="form-actions">
          <button
            type="button"
            className="cancel-button"
            onClick={() => navigate("/dashboard/contact-requests")}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="submit-button"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Creating..." : "Create Request"}
          </button>
        </div>
      </form>

      {isSubmitting && (
        <LoadingSpinner text="Creating contact request..." overlay />
      )}

      <style jsx>{`
        .create-heading {
          color: #4285f4;
          margin-bottom: 24px;
        }

        .create-form {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .form-section {
          background-color: #f9f9f9;
          border-radius: 8px;
          padding: 20px;
          margin-bottom: 20px;
        }

        .form-section h3 {
          margin-top: 0;
          margin-bottom: 16px;
          color: #333;
          font-size: 18px;
          font-weight: 500;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          margin-bottom: 16px;
          flex: 1;
        }

        label {
          font-weight: 500;
          margin-bottom: 8px;
          color: #333;
        }

        input[type="text"],
        input[type="tel"],
        select,
        textarea {
          padding: 10px 12px;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 14px;
          width: 100%;
        }

        textarea {
          resize: vertical;
          min-height: 100px;
        }

        .form-actions {
          display: flex;
          justify-content: flex-end;
          gap: 16px;
        }

        .cancel-button,
        .submit-button {
          padding: 10px 20px;
          border-radius: 4px;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .cancel-button {
          background-color: #f5f5f5;
          border: 1px solid #ddd;
          color: #333;
        }

        .cancel-button:hover {
          background-color: #e0e0e0;
        }

        .submit-button {
          background-color: #4285f4;
          border: none;
          color: white;
        }

        .submit-button:hover {
          background-color: #3367d6;
        }

        .submit-button:disabled {
          background-color: #ccc;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
}

export default CreateContactRequestPage;
