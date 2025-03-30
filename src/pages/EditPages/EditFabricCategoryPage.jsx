import React, { useState, useEffect } from "react";
import { api } from "../../config/api";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import MediaGalleryPopup from "../../components/MediaGalleryPopup";
import LoadingSpinner from "../../components/UI/LoadingSpinner";
import "./EditPages.css";

function EditFabricCategoryPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    image: null,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [imageDetails, setImageDetails] = useState(null);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [originalImageUrl, setOriginalImageUrl] = useState(null);
  const [imageWasChanged, setImageWasChanged] = useState(false);

  // Fetch category data
  useEffect(() => {
    const fetchCategory = async () => {
      try {
        setIsLoading(true);
        const response = await api.get(`/product-categories/${id}/`);
        const categoryData = response.data;

        setFormData({
          name: categoryData.name || "",
          description: categoryData.description || "",
          image: categoryData.image || null,
        });

        // Store image URL for display purposes
        if (categoryData.image_url) {
          setOriginalImageUrl(categoryData.image_url);
        }

        // If we have the image ID, fetch its details
        if (categoryData.image) {
          fetchImageDetails(categoryData.image);
        }
      } catch (error) {
        console.error("Error fetching fabric category:", error);
        toast.error("Failed to load fabric category data");
        setErrorMessage("Failed to load fabric category. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategory();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectImage = (imageId) => {
    setFormData((prev) => ({
      ...prev,
      image: imageId,
    }));
    fetchImageDetails(imageId);
    setImageWasChanged(true);
    setIsGalleryOpen(false);
  };

  const fetchImageDetails = async (imageId) => {
    if (!imageId) return;

    try {
      const response = await api.get(`/media/${imageId}/`);
      setImageDetails(response.data);
    } catch (error) {
      console.error(`Error fetching image details for ID ${imageId}:`, error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage("");

    try {
      if (!formData.name) {
        throw new Error("Category name is required");
      }

      // Only include fields that should be updated
      const payload = {
        name: formData.name,
        description: formData.description || "",
      };

      // Only include the image field if it was changed
      if (imageWasChanged) {
        payload.image = formData.image;
      }

      console.log("Updating with payload:", payload);
      await api.put(`/product-categories/${id}/`, payload);
      toast.success("Fabric category updated successfully!");
      navigate("/dashboard/fabric-categories");
    } catch (error) {
      console.error("Error updating fabric category:", error);
      setErrorMessage(
        error?.response?.data?.detail ||
          error.message ||
          "Failed to update fabric category. Please try again."
      );
      toast.error("Error updating fabric category");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div
        className="dashboard-content-card"
        style={{ position: "relative", minHeight: "300px" }}
      >
        <LoadingSpinner text="Loading fabric category data..." overlay />
      </div>
    );
  }

  return (
    <div className="dashboard-content-card edit-page-container">
      <div className="edit-page-header">
        <button
          className="back-button"
          onClick={() => navigate("/dashboard/fabric-categories")}
        >
          ← Back to Fabric Categories
        </button>
      </div>

      <h2 className="edit-heading">Edit Fabric Category</h2>

      {errorMessage && <div className="error-message">{errorMessage}</div>}

      <form onSubmit={handleSubmit} className="edit-form">
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
              placeholder="e.g., Cotton, Silk, Linen"
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows="4"
              placeholder="Enter category description (optional)"
            />
          </div>
        </div>

        <div className="form-section">
          <h3>Category Image</h3>
          <p className="section-info">
            Add an image to represent this category (optional)
          </p>

          <div className="image-preview-container">
            {formData.image && imageDetails ? (
              <div className="selected-image-container">
                <img
                  src={imageDetails.file_url}
                  alt="Category"
                  className="category-image"
                />
              </div>
            ) : originalImageUrl ? (
              <div className="selected-image-container">
                <img
                  src={originalImageUrl}
                  alt="Category"
                  className="category-image"
                />
              </div>
            ) : (
              <div className="no-image-container">
                <div className="no-image-placeholder">
                  <FolderIcon />
                  <span>No image selected</span>
                </div>
              </div>
            )}

            <button
              type="button"
              className="select-image-button"
              onClick={() => setIsGalleryOpen(true)}
            >
              {formData.image || originalImageUrl
                ? "Change Image"
                : "Select Image"}
            </button>
          </div>
        </div>

        <div className="form-actions">
          <button
            type="button"
            className="cancel-button"
            onClick={() => navigate("/dashboard/fabric-categories")}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="submit-button"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Updating..." : "Update Category"}
          </button>
        </div>
      </form>

      <MediaGalleryPopup
        isOpen={isGalleryOpen}
        setIsOpen={setIsGalleryOpen}
        onSelectImage={handleSelectImage}
      />

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

        input[type="text"],
        textarea {
          padding: 10px 12px;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 14px;
        }

        .image-preview-container {
          margin-top: 10px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 16px;
        }

        .selected-image-container {
          width: 200px;
          height: 200px;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .category-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .no-image-container {
          width: 200px;
          height: 200px;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: #f1f3f4;
          border: 1px dashed #ddd;
          border-radius: 8px;
        }

        .no-image-placeholder {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          color: #666;
        }

        .select-image-button {
          background-color: #f1f1f1;
          color: #333;
          border: none;
          border-radius: 4px;
          padding: 10px 20px;
          font-size: 14px;
          cursor: pointer;
          transition: background-color 0.2s;
        }

        .select-image-button:hover {
          background-color: #e3e3e3;
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
          padding: 40px 0;
          gap: 16px;
        }

        .loading-spinner {
          width: 40px;
          height: 40px;
          border: 4px solid #f3f3f3;
          border-top: 4px solid #4285f4;
          border-radius: 50%;
          animation: spin 1s linear infinite;
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

// Folder icon component
const FolderIcon = () => (
  <svg
    width="48"
    height="48"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M4 20C3.45 20 2.97917 19.8042 2.5875 19.4125C2.19583 19.0208 2 18.55 2 18V6C2 5.45 2.19583 4.97917 2.5875 4.5875C2.97917 4.19583 3.45 4 4 4H10L12 6H20C20.55 6 21.0208 6.19583 21.4125 6.5875C21.8042 6.97917 22 7.45 22 8V18C22 18.55 21.8042 19.0208 21.4125 19.4125C21.0208 19.8042 20.55 20 20 20H4Z"
      fill="#9AA0A6"
    />
  </svg>
);

export default EditFabricCategoryPage;
