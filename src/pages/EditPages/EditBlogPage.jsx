import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../../config/api";
import { toast } from "sonner";
import LoadingSpinner from "../../components/UI/LoadingSpinner";
import MediaGallery from "../../components/MediaGalleryPopup";
import RichTextEditor from "../../components/UI/RichTextEditor";
import "./EditPages.css";

function EditBlogPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showMediaGallery, setShowMediaGallery] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    title_mandarin: "",
    content_mandarin: "",
    author: "",
    photo: null,
    category: "",
  });
  const [users, setUsers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    fetchBlogData();
    fetchUsers();
    fetchCategories();
  }, [id]);

  const fetchBlogData = async () => {
    try {
      setIsLoading(true);
      const response = await api.get(`/blogs/${id}/`);
      console.log("Fetched blog data:", response.data);

      // Find the user by username
      const userResponse = await api.get("/users/");
      const user = userResponse?.data?.results?.find(
        (u) => u.username === response.data.author_name
      );

      // Find the category by name
      const categoryResponse = await api.get("/blog-categories/");
      const category = categoryResponse?.data?.find(
        (c) => c.name === response.data.category_name
      );

      console.log("Found category:", category);

      setFormData({
        title: response.data.title || "",
        content: response.data.content || "",
        title_mandarin: response.data.title_mandarin || "",
        content_mandarin: response.data.content_mandarin || "",
        author: user?.id || "",
        photo: response.data.image_id || null,
        category: category?.id || "",
      });

      if (response.data.image_id) {
        setSelectedImage({
          id: response.data.image_id,
          file: response.data.photo_url,
        });
      }
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching blog:", error);
      toast.error("Failed to load blog");
      setErrorMessage("Failed to load blog. Please try again.");
      setIsLoading(false);
    }
  };

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

  const handleImageSelect = (image) => {
    setSelectedImage(image);
    setFormData((prev) => ({
      ...prev,
      photo: image.id,
    }));
    setShowMediaGallery(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage("");

    try {
      console.log("Submitting blog data:", formData);
      const response = await api.put(`/blogs/${id}/`, formData);
      console.log("Updated blog response:", response.data);
      toast.success("Blog updated successfully");
      navigate("/dashboard/blogs");
    } catch (error) {
      console.error("Error updating blog:", error);
      toast.error("Failed to update blog");
      setErrorMessage(
        error.response?.data?.message ||
          "Failed to update blog. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <LoadingSpinner text="載入⽂章中..." />;
  }

  return (
    <div className="dashboard-content-card edit-page-container">
      <div className="edit-page-header">
        <button
          className="back-button"
          onClick={() => navigate("/dashboard/blogs")}
        >
          ← 返回
        </button>
      </div>

      <h2 className="edit-heading">編輯⽂章</h2>

      {errorMessage && <div className="error-message">{errorMessage}</div>}

      <form onSubmit={handleSubmit} className="edit-form">
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
              onClick={() => setShowMediaGallery(true)}
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
            {isSubmitting ? "更新中..." : "更新⽂章"}
          </button>
        </div>
      </form>

      {isSubmitting && <LoadingSpinner text="更新⽂章中..." overlay />}

      <MediaGallery
        isOpen={showMediaGallery}
        setIsOpen={setShowMediaGallery}
        onSelectImage={handleImageSelect}
      />

      <style jsx>{`
        .edit-page-container {
          width: 100%;
          padding: 24px;
          box-sizing: border-box;
          overflow-x: hidden;
        }

        .edit-heading {
          color: #4285f4;
          margin-bottom: 24px;
        }

        .edit-form {
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
        select,
        textarea {
          padding: 10px 12px;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 14px;
          width: 100%;
          max-width: 100%;
          box-sizing: border-box;
        }

        textarea {
          resize: vertical;
          min-height: 200px;
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

        @media (max-width: 768px) {
          .edit-page-container {
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

export default EditBlogPage;
