import React, { useState, useEffect } from "react";
import "./Edit.css";

const Edit = ({
  data: initialData,
  heading,
  onSubmit,
  isLoading,
  errorMessage,
  isLoadingData,
}) => {
  const [formData, setFormData] = useState({});

  useEffect(() => {
    // Update form data when initialData changes
    if (initialData) {
      setFormData({ ...initialData });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  // Generate input fields dynamically based on data keys
  const renderInputFields = () => {
    if (!formData) return null;

    return Object.keys(formData).map((key) => (
      <div className="input-field" key={key}>
        <label htmlFor={key}>
          {key.charAt(0).toUpperCase() + key.slice(1)}
        </label>
        <input
          id={key}
          name={key}
          value={formData[key] || ""}
          onChange={handleChange}
          type={typeof formData[key] === "number" ? "number" : "text"}
        />
      </div>
    ));
  };

  return (
    <div className="edit-container">
      <h2 className="edit-heading">{heading}</h2>

      {isLoadingData ? (
        <div className="loading-spinner-container">
          <div className="loading-spinner"></div>
          <p>Loading data...</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="input-fields-container">{renderInputFields()}</div>
          {errorMessage && <div className="error-message">{errorMessage}</div>}
          <button type="submit" className="submit-button" disabled={isLoading}>
            {isLoading ? "Saving..." : "Save Changes"}
          </button>
        </form>
      )}
    </div>
  );
};

export default Edit;
