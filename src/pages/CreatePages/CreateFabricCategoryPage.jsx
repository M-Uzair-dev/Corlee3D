import React, { useState } from "react";
import { api } from "../../config/api";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import MediaGalleryPopup from "../../components/MediaGalleryPopup";
import LoadingSpinner from "../../components/UI/LoadingSpinner";
import "./CreatePages.css";

function CreateFabricCategoryPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    name_mandarin: "",
    description_mandarin: "",
    image: null,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [imageDetails, setImageDetails] = useState(null);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);

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

      const payload = {
        name: formData.name,
        description: formData.description || "",
        name_mandarin: formData.name_mandarin || "",
        description_mandarin: formData.description_mandarin || "",
        image: formData.image,
      };

      console.log("Submitting payload:", payload);
      await api.post("/product-categories/", payload);
      toast.success("Fabric category created successfully!");
      navigate("/dashboard/fabric-categories");
    } catch (error) {
      console.error("Error creating fabric category:", error);
      setErrorMessage(
        error?.response?.data?.detail ||
          error.message ||
          "Failed to create fabric category. Please try again."
      );
      toast.error("Error creating fabric category");
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
          onClick={() => navigate("/dashboard/fabric-categories")}
        >
          ← 返回
        </button>
      </div>

      <h2 className="create-heading">新增布種</h2>

      {errorMessage && <div className="error-message">{errorMessage}</div>}

      <form onSubmit={handleSubmit} className="create-form">
        <div className="form-section">
          <h3>布種詳情</h3>

          <div className="form-group">
            <label htmlFor="name">布種名稱 *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="name_mandarin">布種名稱 (中⽂)</label>
            <input
              type="text"
              id="name_mandarin"
              name="name_mandarin"
              value={formData.name_mandarin}
              onChange={handleInputChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">描述</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows="4"
            />
          </div>

          <div className="form-group">
            <label htmlFor="description_mandarin">描述(中⽂)</label>
            <textarea
              id="description_mandarin"
              name="description_mandarin"
              value={formData.description_mandarin}
              onChange={handleInputChange}
              rows="4"
            />
          </div>
        </div>

        <div className="form-section">
          <h3>布種圖片</h3>
          <p className="section-info">新增布種的代表圖片（可選）</p>

          <div className="image-preview-container">
            {formData.image && imageDetails ? (
              <div className="selected-image-container">
                <img
                  src={imageDetails.file_url}
                  alt="Category"
                  className="category-image"
                />
              </div>
            ) : (
              <div className="no-image-container">
                <div className="no-image-placeholder">
                  <FolderIcon />
                  <span>尚未選擇圖片</span>
                </div>
              </div>
            )}

            <button
              type="button"
              className="select-image-button"
              onClick={() => setIsGalleryOpen(true)}
            >
              {formData.image ? "更換圖片" : "選擇圖片"}
            </button>
          </div>
        </div>

        <div className="form-actions">
          <button
            type="button"
            className="cancel-button"
            onClick={() => navigate("/dashboard/fabric-categories")}
          >
            取消
          </button>
          <button
            type="submit"
            className="submit-button"
            disabled={isSubmitting}
          >
            {isSubmitting ? "建立中..." : "建立布種"}
          </button>
        </div>
      </form>

      <MediaGalleryPopup
        isOpen={isGalleryOpen}
        setIsOpen={setIsGalleryOpen}
        onSelectImage={handleSelectImage}
      />

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

export default CreateFabricCategoryPage;
