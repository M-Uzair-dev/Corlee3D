import React, { useState } from "react";
import { api } from "../../config/api";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import "./CreatePages.css";

function CreateColorCategoryPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    display_name: "",
    color: "#FF0000",
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
      await api.post("/color-categories/", formData);
      toast.success("Color category created successfully!");
      navigate("/dashboard/color-categories");
    } catch (error) {
      console.error("Error creating color category:", error);
      setErrorMessage(
        error?.response?.data?.detail ||
          "Failed to create color category. Please try again."
      );
      toast.error("Error creating color category");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="dashboard-content-card create-page-container">
      <div className="create-page-header">
        <button
          className="back-button"
          onClick={() => navigate("/dashboard/color-categories")}
        >
          ← Back to Color Categories
        </button>
      </div>

      <h2 className="create-heading">Create Color Category</h2>

      {errorMessage && <div className="error-message">{errorMessage}</div>}

      <form onSubmit={handleSubmit} className="create-form">
        <div className="form-section">
          <h3>Color Category Details</h3>

          <div className="form-group">
            <label htmlFor="display_name">Display Name </label>
            <input
              type="text"
              id="display_name"
              name="display_name"
              value={formData.display_name}
              onChange={handleInputChange}
              required
              placeholder="e.g., Navy Blue, Crimson Red"
            />
          </div>

          <div className="form-group">
            <label htmlFor="color">Color Value </label>
            <div className="color-picker-container">
              <input
                type="color"
                id="color"
                name="color"
                value={formData.color}
                onChange={handleInputChange}
                className="color-picker"
                required
              />
              <input
                type="text"
                value={formData.color}
                onChange={handleInputChange}
                name="color"
                placeholder="#RRGGBB"
                className="color-text-input"
              />
            </div>
          </div>
        </div>

        <div className="form-section">
          <h3>Color Preview</h3>
          <p className="section-info">
            This is how your color will appear in the system
          </p>

          <div className="color-preview">
            <div
              className="color-sample"
              style={{ backgroundColor: formData.color }}
            ></div>
            <div className="color-name">
              {formData.display_name || "Color Name"}
            </div>
          </div>
        </div>

        <div className="form-actions">
          <button
            type="button"
            className="cancel-button"
            onClick={() => navigate("/dashboard/color-categories")}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="submit-button"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Creating..." : "Create Color Category"}
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

        .section-info {
          color: #666;
          font-size: 14px;
          margin-top: -8px;
          margin-bottom: 16px;
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

        .color-picker-container {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .color-picker {
          width: 50px;
          height: 40px;
          padding: 0;
          border: 1px solid #ddd;
          border-radius: 4px;
          cursor: pointer;
        }

        .color-text-input {
          flex: 1;
          padding: 10px 12px;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 14px;
        }

        .color-preview {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 20px;
          background-color: white;
          border: 1px solid #eee;
          border-radius: 6px;
        }

        .color-sample {
          width: 120px;
          height: 120px;
          border-radius: 8px;
          margin-bottom: 16px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .color-name {
          font-weight: 500;
          font-size: 16px;
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

export default CreateColorCategoryPage;
