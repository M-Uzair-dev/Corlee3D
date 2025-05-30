import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../../config/api";
import { toast } from "sonner";
import LoadingSpinner from "../../components/UI/LoadingSpinner";
import "./EditPages.css";

function EditContactRequestPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [formData, setFormData] = useState({
    request_type: "",
    subject: "",
    message: "",
    company_name: "",
    email: "",
    phone: "",
    current_status: "",
    name: "",
  });

  const requestTypes = [
    { value: "general", label: "General Inquiry" },
    { value: "product", label: "Product Inquiry" },
    { value: "product_request", label: "Product Request" },
  ];

  const statusOptions = [
    { value: "new", label: "New" },
    { value: "processing", label: "Processing" },
    { value: "dispatched", label: "Dispatched" },
    { value: "delivered", label: "Delivered" },
    { value: "cancelled", label: "Cancelled" },
    { value: "returned", label: "Returned" },
  ];

  useEffect(() => {
    fetchRequestData();
  }, [id]);

  const fetchRequestData = async () => {
    try {
      setIsLoading(true);
      const response = await api.get(`/contact-requests/all/${id}/`);
      console.log("Fetched contact request data:", response.data);
      const request = response.data;
      setFormData({
        request_type: request.request_type || "",
        subject: request.subject || "",
        message: request.message || "",
        company_name: request.company_name || request.user.company_name || "",
        email: request.email || request.user.email || "",
        phone: request.phone || request.user.phone || "",
        current_status: request.status || "new",
        name: request.name || request.user.name || "",
      });
    } catch (error) {
      console.error("Error fetching contact request:", error);
      toast.error("Failed to load contact request");
      setErrorMessage("Failed to load contact request. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

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
      // Transform the data to match backend expectations
      const dataToSend = {
        ...formData,
        status: formData.current_status,
      };
      delete dataToSend.current_status;

      console.log("Submitting contact request data:", dataToSend);
      const response = await api.put(`/contact-requests/${id}/`, dataToSend);
      console.log("Updated contact request response:", response.data);
      toast.success("Contact request updated successfully");
      navigate(`/dashboard/contact-requests/${id}`);
    } catch (error) {
      console.error("Error updating contact request:", error);
      toast.error("Failed to update contact request");
      setErrorMessage(
        error.response?.data?.message ||
          "Failed to update contact request. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <LoadingSpinner text="Loading contact request..." />;
  }

  return (
    <div className="dashboard-content-card edit-page-container">
      <div className="edit-page-header">
        <button
          className="back-button"
          onClick={() => navigate(`/dashboard/contact-requests/${id}`)}
        >
          ← 返回聯絡要求
        </button>
      </div>

      <h2 className="edit-heading">編輯聯絡要求</h2>

      {errorMessage && <div className="error-message">{errorMessage}</div>}

      <form onSubmit={handleSubmit} className="edit-form">
        <div className="form-section">
          <h3>要求詳細資料</h3>

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

          <div className="form-group">
            <label htmlFor="current_status">Status *</label>
            <select
              id="current_status"
              name="current_status"
              value={formData.current_status}
              onChange={handleInputChange}
              required
            >
              {statusOptions.map((status) => (
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-section">
          <h3>Contact Information</h3>

          <div className="form-group">
            <label htmlFor="name">Name *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name || ""}
              onChange={handleInputChange}
              required
              placeholder="Enter name"
            />
          </div>

          <div className="form-group">
            <label htmlFor="company_name">Company Name *</label>
            <input
              type="text"
              id="company_name"
              name="company_name"
              value={formData.company_name || ""}
              onChange={handleInputChange}
              required
              placeholder="Enter company name"
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email *</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email || ""}
              onChange={handleInputChange}
              required
              placeholder="Enter email address"
            />
          </div>

          <div className="form-group">
            <label htmlFor="phone">Phone *</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone || ""}
              onChange={handleInputChange}
              required
              placeholder="Enter phone number"
            />
          </div>
        </div>

        <div className="form-actions">
          <button
            type="button"
            className="cancel-button"
            onClick={() => navigate(`/dashboard/contact-requests/${id}`)}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="submit-button"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Updating..." : "Update Request"}
          </button>
        </div>
      </form>

      {isSubmitting && (
        <LoadingSpinner text="Updating contact request..." overlay />
      )}

      <style jsx>{`
        .edit-page-container {
          width: 100%;
          padding: 24px;
          box-sizing: border-box;
          overflow-x: hidden;
        }

        .edit-heading {
          color: #4285f4;
          margin-bottom: 24px;
        }

        .edit-form {
          display: flex;
          flex-direction: column;
          gap: 24px;
          width: 100%;
          max-width: 100%;
          box-sizing: border-box;
        }

        .form-section {
          background-color: #f9f9f9;
          border-radius: 8px;
          padding: 20px;
          margin-bottom: 20px;
          width: 100%;
          max-width: 100%;
          box-sizing: border-box;
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
          width: 100%;
          max-width: 100%;
          box-sizing: border-box;
        }

        label {
          font-weight: 500;
          margin-bottom: 8px;
          color: #333;
        }

        input[type="text"],
        input[type="email"],
        input[type="tel"],
        select,
        textarea {
          padding: 10px 12px;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 14px;
          width: 100%;
          max-width: 100%;
          box-sizing: border-box;
        }

        textarea {
          resize: vertical;
          min-height: 100px;
        }

        .form-actions {
          display: flex;
          justify-content: flex-end;
          gap: 16px;
          margin-top: 24px;
          width: 100%;
          max-width: 100%;
          box-sizing: border-box;
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

        @media (max-width: 768px) {
          .edit-page-container {
            padding: 16px;
          }

          .form-section {
            padding: 16px;
            margin-bottom: 16px;
          }

          .form-group {
            margin-bottom: 12px;
          }

          .form-actions {
            flex-direction: column;
            gap: 12px;
          }

          .cancel-button,
          .submit-button {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
}

export default EditContactRequestPage;
