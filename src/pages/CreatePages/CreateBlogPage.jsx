import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../config/api";
import { toast } from "sonner";
import LoadingSpinner from "../../components/UI/LoadingSpinner";
import MediaGalleryPopup from "../../components/MediaGalleryPopup";
import RichTextEditor from "../../components/UI/RichTextEditor";
import "./CreatePages.css";

function CreateBlogPage() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    title_mandarin: "",
    content_mandarin: "",
    author: "",
    photo: "",
    category: "",
  });
  const [users, setUsers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    fetchUsers();
    fetchCategories();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await api.get("/users/");
      setUsers(response.data.results || []);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Failed to load users");
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await api.get("/blog-categories/");
      console.log("Fetched categories:", response.data);
      setCategories(response.data || []);
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast.error("Failed to load categories");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleContentChange = (content) => {
    setFormData((prev) => ({
      ...prev,
      content,
    }));
  };

  const handleContentMandarinChange = (content) => {
    setFormData((prev) => ({
      ...prev,
      content_mandarin: content,
    }));
  };

  const handleSelectImage = async (imageId) => {
    if (imageId) {
      try {
        // Fetch the image details to get the URL
        const response = await api.get(`/media/${imageId}/`);
        setSelectedImage({
          id: imageId,
          file: response.data.file_url,
        });
        setFormData((prev) => ({
          ...prev,
          photo: imageId,
        }));
        setIsGalleryOpen(false);
      } catch (error) {
        console.error("Error fetching image details:", error);
        toast.error("Failed to load image details");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage("");

    try {
      console.log("Submitting blog data:", formData);
      const response = await api.post("/blogs/", formData);
      console.log("Created blog response:", response.data);
      toast.success("Blog created successfully");
      navigate("/dashboard/blogs");
    } catch (error) {
      console.error("Error creating blog:", error);
      toast.error("Failed to create blog");
      setErrorMessage(
        error.response?.data?.message ||
          "Failed to create blog. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="dashboard-content-card create-page-container">
      <div className="create-page-header">
        <button
          className="back-button"
          onClick={() => navigate("/dashboard/blogs")}
        >
          ← 返回
        </button>
      </div>

      <h2 className="create-heading">新增⽂章</h2>

      {errorMessage && <div className="error-message">{errorMessage}</div>}

      <form onSubmit={handleSubmit} className="create-form">
        <div className="form-section">
          <h3>⽂章資訊</h3>

          <div className="form-group">
            <label htmlFor="title">標題 *</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="title_mandarin">標題(中⽂)</label>
            <input
              type="text"
              id="title_mandarin"
              name="title_mandarin"
              value={formData.title_mandarin}
              onChange={handleInputChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="content">內⽂ *</label>
            <RichTextEditor
              value={formData.content}
              onChange={handleContentChange}
              placeholder="請輸入內文..."
            />
          </div>

          <div className="form-group">
            <label htmlFor="content_mandarin">內⽂(中⽂)</label>
            <RichTextEditor
              value={formData.content_mandarin}
              onChange={handleContentMandarinChange}
              placeholder="請輸入中文內文..."
            />
          </div>

          <div className="form-group">
            <label htmlFor="author">作者 *</label>
            <select
              id="author"
              name="author"
              value={formData.author}
              onChange={handleInputChange}
              required
            >
              <option value="">選擇作者</option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name || user.username}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="category">分類 *</label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              required
            >
              <option value="">選擇分類</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name_mandarin || category.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-section">
          <h3>封⾯</h3>
          <div className="image-selection">
            <div className="selected-image">
              {selectedImage ? (
                <img
                  src={selectedImage.file}
                  alt="Selected"
                  className="preview-image"
                  onError={(e) => {
                    console.log("Image load error");
                    e.target.onerror = null;
                    e.target.src =
                      "https://via.placeholder.com/800x400?text=Image+Not+Available";
                  }}
                />
              ) : (
                <div className="no-image-placeholder">尚未選擇圖片</div>
              )}
            </div>

            <button
              type="button"
              className="select-image-button"
              onClick={() => setIsGalleryOpen(true)}
            >
              {selectedImage ? "更換圖片" : "選擇圖片"}
            </button>
          </div>
        </div>

        <div className="form-actions">
          <button
            type="button"
            className="cancel-button"
            onClick={() => navigate("/dashboard/blogs")}
          >
            取消
          </button>
          <button
            type="submit"
            className="submit-button"
            disabled={isSubmitting}
          >
            {isSubmitting ? "建立中..." : "建立⽂章"}
          </button>
        </div>
      </form>

      {isSubmitting && <LoadingSpinner text="建立⽂章中..." overlay />}

      <MediaGalleryPopup
        isOpen={isGalleryOpen}
        setIsOpen={setIsGalleryOpen}
        onSelectImage={handleSelectImage}
      />

      <style jsx>{`
        .create-page-container {
          width: 100%;
          padding: 24px;
          box-sizing: border-box;
          overflow-x: hidden;
        }

        .create-heading {
          color: #4285f4;
          margin-bottom: 24px;
        }

        .create-form {
          display: flex;
          flex-direction: column;
          gap: 24px;
          width: 100%;
          max-width: 100%;
          box-sizing: border-box;
        }

        .form-section {
          background-color: #f9f9f9;
          border-radius: 8px;
          padding: 20px;
          margin-bottom: 20px;
          width: 100%;
          max-width: 100%;
          box-sizing: border-box;
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
          width: 100%;
          max-width: 100%;
          box-sizing: border-box;
        }

        label {
          font-weight: 500;
          margin-bottom: 8px;
          color: #333;
        }

        input[type="text"],
        select {
          padding: 10px 12px;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 14px;
          width: 100%;
          max-width: 100%;
          box-sizing: border-box;
        }

        .image-preview {
          margin: 10px 0;
          width: 200px;
          height: 200px;
          border: 1px solid #ddd;
          border-radius: 4px;
          overflow: hidden;
        }

        .preview-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .select-image-button {
          padding: 8px 16px;
          background-color: #f5f5f5;
          border: 1px solid #ddd;
          border-radius: 4px;
          cursor: pointer;
          font-size: 14px;
        }

        .select-image-button:hover {
          background-color: #e0e0e0;
        }

        .form-actions {
          display: flex;
          justify-content: flex-end;
          gap: 16px;
          margin-top: 24px;
          width: 100%;
          max-width: 100%;
          box-sizing: border-box;
        }

        .cancel-button,
        .submit-button {
          padding: 10px 20px;
          border-radius: 4px;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .cancel-button {
          background-color: #f5f5f5;
          border: 1px solid #ddd;
          color: #333;
        }

        .cancel-button:hover {
          background-color: #e0e0e0;
        }

        .submit-button {
          background-color: #4285f4;
          border: none;
          color: white;
        }

        .submit-button:hover {
          background-color: #3367d6;
        }

        .submit-button:disabled {
          background-color: #ccc;
          cursor: not-allowed;
        }

        /* Quill Editor Styles */
        :global(.ql-container) {
          min-height: 300px;
          font-size: 16px;
          line-height: 1.5;
        }

        :global(.ql-editor) {
          min-height: 300px;
        }

        :global(.ql-toolbar) {
          background-color: #f8f9fa;
          border-top-left-radius: 4px;
          border-top-right-radius: 4px;
        }

        :global(.ql-container) {
          border-bottom-left-radius: 4px;
          border-bottom-right-radius: 4px;
        }

        @media (max-width: 768px) {
          .create-page-container {
            padding: 16px;
          }

          .form-section {
            padding: 16px;
            margin-bottom: 16px;
          }

          .form-group {
            margin-bottom: 12px;
          }

          .form-actions {
            flex-direction: column;
            gap: 12px;
          }

          .cancel-button,
          .submit-button {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
}

export default CreateBlogPage;
