import React, { useState, useEffect } from "react";
import "./Edit.css";

const Edit = ({
  data: initialData,
  heading,
  onSubmit,
  isLoading,
  errorMessage,
  isLoadingData,
  fieldErrors = {},
}) => {
  const [formData, setFormData] = useState({});
  const [validationErrors, setValidationErrors] = useState({});

  useEffect(() => {
    // Update form data when initialData changes
    if (initialData) {
      setFormData({ ...initialData });
    }
  }, [initialData]);

  useEffect(() => {
    // Update validation errors when fieldErrors from API changes
    if (Object.keys(fieldErrors).length > 0) {
      setValidationErrors(fieldErrors);
    }
  }, [fieldErrors]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Clear validation error for this field if it has a value now
    if (value.trim() && validationErrors[name]) {
      const updatedErrors = { ...validationErrors };
      delete updatedErrors[name];
      setValidationErrors(updatedErrors);
    }
  };

  const validateForm = () => {
    const errors = {};

    // Check for empty required fields
    Object.keys(formData).forEach((key) => {
      // Skip validation for boolean fields and ID fields
      if (typeof formData[key] === "boolean" || key === "id" || key === "_id") {
        return;
      }

      if (
        !formData[key] ||
        (typeof formData[key] === "string" && !formData[key].trim())
      ) {
        errors[key] = "此欄位為必填";
      }
    });

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      onSubmit(formData);
    }
  };

  // Generate input fields dynamically based on data keys
  const renderInputFields = () => {
    if (!formData) return null;

    return Object.keys(formData).map((key) => {
      // Skip rendering fields that are likely IDs or system fields
      if (
        key === "id" ||
        key === "_id" ||
        key === "createdAt" ||
        key === "updatedAt"
      ) {
        return null;
      }

      const fieldType =
        typeof formData[key] === "boolean"
          ? "checkbox"
          : typeof formData[key] === "number"
          ? "number"
          : "text";

      // Get error message - prioritize API field errors over client validation
      const errorMessage = validationErrors[key];

      return (
        <div className="input-field" key={key}>
          <label htmlFor={key}>
            {key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, " ")}
          </label>
          <input
            id={key}
            name={key}
            value={fieldType !== "checkbox" ? formData[key] || "" : undefined}
            checked={fieldType === "checkbox" ? !!formData[key] : undefined}
            onChange={handleChange}
            type={fieldType}
            className={errorMessage ? "input-error" : ""}
          />
          {errorMessage && <div className="field-error">{errorMessage}</div>}
        </div>
      );
    });
  };

  return (
    <div className="edit-container">
      <h2 className="edit-heading">{heading}</h2>

      {isLoadingData ? (
        <div className="loading-spinner-container">
          <div className="loading-spinner"></div>
          <p>載入資料中...</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          {errorMessage && <div className="error-message">{errorMessage}</div>}
          <div className="input-fields-container">{renderInputFields()}</div>

          <button type="submit" className="submit-button" disabled={isLoading}>
            {isLoading ? "儲存中..." : "儲存變更"}
          </button>
        </form>
      )}
    </div>
  );
};

export default Edit;
