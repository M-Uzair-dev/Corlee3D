import React, { useState } from "react";
import { api } from "../../config/api";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import LoadingSpinner from "../../components/UI/LoadingSpinner";
import "./CreatePages.css";

function CreateBlogCategoryPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

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
      if (!formData.name) {
        throw new Error("Category name is required");
      }

      await api.post("/blog-categories/", formData);
      toast.success("Blog category created successfully!");
      navigate("/dashboard/blog-categories");
    } catch (error) {
      console.error("Error creating blog category:", error);
      setErrorMessage(
        error?.response?.data?.detail ||
          error.message ||
          "Failed to create blog category. Please try again."
      );
      toast.error("Error creating blog category");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="dashboard-content-card create-page-container"
      style={{ position: "relative" }}
    >
      {isSubmitting && <LoadingSpinner text="Creating category..." overlay />}
      <div className="create-page-header">
        <button
          className="back-button"
          onClick={() => navigate("/dashboard/blog-categories")}
        >
          ← Back to Blog Categories
        </button>
      </div>

      <h2 className="create-heading">Create Blog Category</h2>

      {errorMessage && <div className="error-message">{errorMessage}</div>}

      <form onSubmit={handleSubmit} className="create-form">
        <div className="form-section">
          <h3>Category Details</h3>

          <div className="form-group">
            <label htmlFor="name">Category Name *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              placeholder="e.g., Fashion Trends, Industry News"
            />
          </div>
        </div>

        <div className="form-actions">
          <button
            type="button"
            className="cancel-button"
            onClick={() => navigate("/dashboard/blog-categories")}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="submit-button"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Creating..." : "Create Category"}
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

        input[type="text"] {
          padding: 10px 12px;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 14px;
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
      `}</style>
    </div>
  );
}

export default CreateBlogCategoryPage;
