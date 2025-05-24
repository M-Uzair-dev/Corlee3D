import React, { useState } from "react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { api } from "../../config/api";
import { handleApiError } from "../../util/errorHandling";
import "./CreatePages.css";

function CreateColorCategoryPage() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [formData, setFormData] = useState({
    display_name: "",
    display_name_mandarin: "",
    color: "#FF0000",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage("");
    setFieldErrors({});

    try {
      const response = await api.post("/color-categories/", formData);
      toast.success("Color category created successfully!");
      navigate("/dashboard/color-categories");
    } catch (error) {
      // Use the standardized error handling utility
      handleApiError(
        error,
        "Color Category",
        setErrorMessage,
        setFieldErrors,
        false
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
          ← 返回顏色分類
        </button>
      </div>

      <h2 className="create-heading">新增顏色分類</h2>

      {errorMessage && <div className="error-message">{errorMessage}</div>}

      <form onSubmit={handleSubmit} className="edit-form">
        <div className="form-section">
          <h3>顏色分類詳細資料</h3>

          <div className="form-group">
            <label htmlFor="display_name">Display Name</label>
            <input
              type="text"
              id="display_name"
              name="display_name"
              value={formData.display_name}
              onChange={handleInputChange}
              required
              placeholder="e.g., Navy Blue, Crimson Red"
              className={fieldErrors.display_name ? "input-error" : ""}
            />
            {fieldErrors.display_name && (
              <div className="field-error">{fieldErrors.display_name}</div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="display_name_mandarin">
              Display Name (Mandarin)
            </label>
            <input
              type="text"
              id="display_name_mandarin"
              name="display_name_mandarin"
              value={formData.display_name_mandarin}
              onChange={handleInputChange}
              placeholder="e.g., 海军蓝，深红色"
              className={fieldErrors.display_name_mandarin ? "input-error" : ""}
            />
            {fieldErrors.display_name_mandarin && (
              <div className="field-error">
                {fieldErrors.display_name_mandarin}
              </div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="color">Color Value *</label>
            <div className="color-picker-container">
              <input
                type="color"
                id="color"
                name="color"
                value={formData.color}
                onChange={handleInputChange}
                className={`color-picker ${
                  fieldErrors.color ? "input-error" : ""
                }`}
                required
              />
              <input
                type="text"
                value={formData.color}
                onChange={handleInputChange}
                name="color"
                placeholder="#RRGGBB"
                className={`color-text-input ${
                  fieldErrors.color ? "input-error" : ""
                }`}
              />
            </div>
            {fieldErrors.color && (
              <div className="field-error">{fieldErrors.color}</div>
            )}
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

        .field-error {
          color: #d32f2f;
          font-size: 12px;
          margin-top: 4px;
        }

        .input-error {
          border-color: #d32f2f !important;
        }
      `}</style>
    </div>
  );
}

export default CreateColorCategoryPage;
