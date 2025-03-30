import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Edit from "../../components/Edit";
import { api } from "../../config/api";
import { toast } from "sonner"; // Assuming you use sonner for notifications
import "./CreatePages.css";

const CreatePageTemplate = ({
  entityName,
  createEndpoint,
  redirectPath,
  initialData,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (formData) => {
    setIsSubmitting(true);
    setErrorMessage(null);

    // Simulate API call with timeout
    setTimeout(() => {
      toast.success(`${entityName} created successfully`);
      setIsSubmitting(false);
      navigate(redirectPath);
    }, 1500);

    // Actual API create code (commented out for now)
    /*
    try {
      await api.post(createEndpoint, formData);
      toast.success(`${entityName} created successfully`);
      navigate(redirectPath);
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.message;
      setErrorMessage(`Failed to create ${entityName}: ${errorMsg}`);
      toast.error(`Error creating ${entityName}`);
      setIsSubmitting(false);
    }
    */
  };

  return (
    <div className="dashboard-content-card create-page-container">
      <div className="create-page-header">
        <button className="back-button" onClick={() => navigate(redirectPath)}>
          ← Back to List
        </button>
      </div>

      <Edit
        data={initialData}
        heading={`Create New ${entityName}`}
        onSubmit={handleSubmit}
        isLoading={isSubmitting}
        isLoadingData={false}
        errorMessage={errorMessage}
      />
    </div>
  );
};

export default CreatePageTemplate;
