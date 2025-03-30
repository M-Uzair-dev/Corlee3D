import React, { useState } from "react";
import { api } from "../../config/api";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import LoadingSpinner from "../../components/UI/LoadingSpinner";
import "./CreatePages.css";

function CreateUserPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    email: "",
    name: "",
    phone: "",
    company_name: "",
    is_staff: false,
    is_active: true,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

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
    if (
      !formData.username ||
      !formData.password ||
      !formData.email ||
      !formData.name
    ) {
      setErrorMessage("Username, password, email, and name are required");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const response = await api.post("/users/", formData);
      toast.success("User created successfully");
      navigate("/dashboard/users");
    } catch (error) {
      console.error("Error creating user:", error);
      setErrorMessage(
        error.response?.data?.message ||
          Object.values(error.response?.data || {})
            .flat()
            .join(", ") ||
          "Failed to create user"
      );
      toast.error("Failed to create user");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="dashboard-content-card create-page-container"
      style={{ position: "relative" }}
    >
      {isSubmitting && <LoadingSpinner text="Creating user..." overlay />}
      <div className="create-page-header">
        <button
          className="back-button"
          onClick={() => navigate("/dashboard/users")}
        >
          ← Back to Users
        </button>
      </div>

      <h2 className="create-heading">Create New User</h2>

      {errorMessage && <div className="error-message">{errorMessage}</div>}

      <form onSubmit={handleSubmit} className="create-form">
        <div className="form-section">
          <h3>Account Information</h3>

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
              <label htmlFor="password">Password *</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                required
                placeholder="Enter password"
              />
            </div>
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

        <div className="form-section">
          <h3>Contact Information</h3>

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

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="phone">Phone Number</label>
              <input
                type="text"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="Enter phone number"
              />
            </div>

            <div className="form-group">
              <label htmlFor="company_name">Company</label>
              <input
                type="text"
                id="company_name"
                name="company_name"
                value={formData.company_name}
                onChange={handleInputChange}
                placeholder="Enter company name"
              />
            </div>
          </div>
        </div>

        <div className="form-section">
          <h3>User Settings</h3>

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
            {isSubmitting ? "Creating..." : "Create User"}
          </button>
        </div>
      </form>

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
        input[type="email"],
        input[type="password"] {
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
          background-color: #34a853;
          color: white;
          border: none;
          border-radius: 4px;
          padding: 10px 24px;
          font-size: 14px;
          cursor: pointer;
          transition: background-color 0.2s;
        }

        .submit-button:hover {
          background-color: #2e8b46;
        }

        .submit-button:disabled {
          background-color: #a8d5b5;
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
      `}</style>
    </div>
  );
}

export default CreateUserPage;
