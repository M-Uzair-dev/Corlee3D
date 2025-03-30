import React, { useState, useEffect } from "react";
import { api } from "../../config/api";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import LoadingSpinner from "../../components/UI/LoadingSpinner";
import "./EditPages.css";

function EditUserPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    name: "",
    phone: "",
    company_name: "",
    is_staff: false,
    is_active: true,
  });
  const [originalData, setOriginalData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    fetchUserData();
  }, [id]);

  const fetchUserData = async () => {
    try {
      setIsLoading(true);
      const response = await api.get(`/users/${id}/`);
      const userData = response.data;

      setFormData({
        username: userData.username || "",
        email: userData.email || "",
        name: userData.name || "",
        phone: userData.phone || "",
        company_name: userData.company_name || "",
        is_staff: userData.is_staff || false,
        is_active: userData.is_active || true,
      });

      setOriginalData({
        username: userData.username || "",
        email: userData.email || "",
        name: userData.name || "",
        phone: userData.phone || "",
        company_name: userData.company_name || "",
        is_staff: userData.is_staff || false,
        is_active: userData.is_active || true,
      });
    } catch (error) {
      console.error("Error fetching user data:", error);
      toast.error("Failed to load user data");
      setErrorMessage("Could not fetch user data. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate required fields
    if (!formData.username || !formData.email || !formData.name) {
      setErrorMessage("Username, email, and name are required");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");

    try {
      // Only send fields that have changed
      const changedFields = {};
      Object.keys(formData).forEach((key) => {
        if (formData[key] !== originalData[key]) {
          changedFields[key] = formData[key];
        }
      });

      if (Object.keys(changedFields).length === 0) {
        toast.info("No changes detected");
        navigate("/dashboard/users");
        return;
      }

      const response = await api.patch(`/users/${id}/`, changedFields);
      toast.success("User updated successfully");
      navigate("/dashboard/users");
    } catch (error) {
      console.error("Error updating user:", error);
      setErrorMessage(
        error.response?.data?.message ||
          Object.values(error.response?.data || {})
            .flat()
            .join(", ") ||
          "Failed to update user"
      );
      toast.error("Failed to update user");
    } finally {
      setIsSubmitting(false);
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
        }}
      >
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading user data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-content-card edit-page-container">
      <div className="edit-page-header">
        <button
          className="back-button"
          onClick={() => navigate("/dashboard/users")}
        >
          ← Back to Users
        </button>
      </div>

      <h2 className="edit-heading">Edit User</h2>

      {errorMessage && <div className="error-message">{errorMessage}</div>}

      <form onSubmit={handleSubmit} className="edit-form">
        <div className="form-section">
          <h3>User Details</h3>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="username">Username *</label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                required
                placeholder="Enter username"
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email *</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                placeholder="Enter email"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="name">Full Name *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              placeholder="Enter full name"
            />
          </div>

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
            <label htmlFor="phone">Phone</label>
            <input
              type="text"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              placeholder="Enter phone number"
            />
          </div>

          <div className="form-row checkboxes">
            <div className="form-group checkbox-group">
              <input
                type="checkbox"
                id="is_staff"
                name="is_staff"
                checked={formData.is_staff}
                onChange={handleInputChange}
              />
              <label htmlFor="is_staff">Admin Access</label>
            </div>

            <div className="form-group checkbox-group">
              <input
                type="checkbox"
                id="is_active"
                name="is_active"
                checked={formData.is_active}
                onChange={handleInputChange}
              />
              <label htmlFor="is_active">Active Account</label>
            </div>
          </div>
        </div>

        <div className="form-actions">
          <button
            type="button"
            className="cancel-button"
            onClick={() => navigate("/dashboard/users")}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="submit-button"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Updating..." : "Update User"}
          </button>
        </div>
      </form>

      {isSubmitting && <LoadingSpinner text="Updating user..." overlay />}

      <style jsx>{`
        .edit-heading {
          color: #4285f4;
          margin-bottom: 24px;
        }

        .edit-form {
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

        .form-row {
          display: flex;
          gap: 16px;
          margin-bottom: 16px;
        }

        .form-row.checkboxes {
          margin-top: 16px;
        }

        @media (max-width: 768px) {
          .form-row {
            flex-direction: column;
            gap: 8px;
          }
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
        input[type="email"] {
          padding: 10px 12px;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 14px;
        }

        .checkbox-group {
          flex-direction: row;
          align-items: center;
          gap: 8px;
          margin-bottom: 0;
        }

        .checkbox-group label {
          margin-bottom: 0;
        }

        .form-actions {
          display: flex;
          justify-content: flex-end;
          gap: 16px;
          margin-top: 24px;
        }

        .cancel-button {
          background-color: #f1f1f1;
          color: #333;
          border: none;
          border-radius: 4px;
          padding: 10px 24px;
          font-size: 14px;
          cursor: pointer;
          transition: background-color 0.2s;
        }

        .cancel-button:hover {
          background-color: #e3e3e3;
        }

        .submit-button {
          background-color: #4285f4;
          color: white;
          border: none;
          border-radius: 4px;
          padding: 10px 24px;
          font-size: 14px;
          cursor: pointer;
          transition: background-color 0.2s;
        }

        .submit-button:hover {
          background-color: #3367d6;
        }

        .submit-button:disabled {
          background-color: #a8c7fa;
          cursor: not-allowed;
        }

        .error-message {
          background-color: #fdeded;
          color: #d32f2f;
          padding: 12px 16px;
          border-radius: 4px;
          margin-bottom: 16px;
          font-size: 14px;
        }

        .loading-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: 20px;
          width: 100%;
          gap: 16px;
        }

        .loading-spinner {
          width: 50px;
          height: 50px;
          border: 4px solid #f3f3f3;
          border-top: 4px solid #4285f4;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin: 0 auto;
        }

        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}

export default EditUserPage;
