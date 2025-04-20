import React, { useState, useEffect } from "react";
import ImageUploader from "./ImageUploader";
import { api } from "../config/api";
import { toast } from "sonner";

const MediaGalleryPopup = ({ isOpen, setIsOpen, onSelectImage }) => {
  const [images, setImages] = useState([]);
  const [selectedImageId, setSelectedImageId] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [pageSize] = useState(8); // Number of images per page
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [imageToDelete, setImageToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch images when the component mounts
  useEffect(() => {
    if (isOpen) {
      fetchImages(1);
    }
  }, [isOpen]);

  // Function to fetch images from the API
  const fetchImages = async (pageNum) => {
    if (!hasMore || isLoading) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await api.get(
        `/media/?page=${pageNum}&page_size=${pageSize}`
      );
      const data = response.data;
      console.log("MEDIA DATA", data);

      if (pageNum === 1) {
        setImages(data.results);
      } else {
        setImages((prev) => [...prev, ...data.results]);
      }

      setTotalCount(data.count);
      setHasMore(!!data.links.next);
      setCurrentPage(data.current_page);
      setIsLoading(false);
    } catch (err) {
      setError(`Failed to fetch images: ${err.message}`);
      setIsLoading(false);
    }
  };

  // Load more images
  const handleLoadMore = () => {
    if (hasMore && !isLoading) {
      fetchImages(currentPage + 1);
    }
  };

  // Handle image selection
  const handleImageSelect = (id) => {
    setSelectedImageId(id);
  };

  // Handle OK button click
  const handleConfirm = () => {
    if (selectedImageId) {
      onSelectImage(selectedImageId);
      setIsOpen(false);
    }
  };

  // Handle close button click
  const handleClose = () => {
    setIsOpen(false);
  };

  // Toggle upload section
  const toggleUploadSection = () => {
    setIsUploading(!isUploading);
  };

  // Refresh images after upload
  const handleUploadSuccess = () => {
    setIsUploading(false);
    setCurrentPage(1);
    setHasMore(true);
    fetchImages(1);
  };

  // Handle delete button click
  const handleDeleteClick = (e, imageId) => {
    e.stopPropagation(); // Prevent triggering image selection
    setImageToDelete(imageId);
    setShowDeleteModal(true);
  };

  // Handle delete confirmation
  const handleDeleteConfirm = async () => {
    if (!imageToDelete) return;

    setIsDeleting(true);
    try {
      const response = await api.delete(`/media/${imageToDelete}/delete/`);
      if (response.status === 204) {
        // Remove the deleted image from the list
        setImages(images.filter((img) => img.id !== imageToDelete));
        setTotalCount((prev) => prev - 1);
        toast.success("Image deleted successfully");
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.error || "Failed to delete image";
      toast.error(errorMessage);
    } finally {
      setIsDeleting(false);
      setShowDeleteModal(false);
      setImageToDelete(null);
    }
  };

  // Handle delete cancel
  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
    setImageToDelete(null);
  };

  // If the popup is not open, don't render anything
  if (!isOpen) return null;

  return (
    <div className="media-gallery-popup">
      <div className="media-gallery-overlay">
        <div className="media-gallery-content">
          <div className="media-gallery-header">
            <h2>Media Gallery</h2>
            <button className="close-button" onClick={handleClose}>
              ×
            </button>
          </div>

          <div className="media-gallery-actions">
            <button
              className="upload-toggle-button"
              onClick={toggleUploadSection}
            >
              {isUploading ? "Hide Upload" : "Upload New Image"}
            </button>
            <div className="image-count">
              {totalCount} image{totalCount !== 1 ? "s" : ""}
            </div>
          </div>

          {isUploading && (
            <div className="upload-section">
              <ImageUploader onUploadSuccess={handleUploadSuccess} />
            </div>
          )}

          {error && <div className="error-message">{error}</div>}

          <div className="media-gallery-grid">
            {images.map((image) => (
              <div
                key={image.id}
                className={`media-item ${
                  selectedImageId === image.id ? "selected" : ""
                }`}
                onClick={() => handleImageSelect(image.id)}
              >
                <img src={image.file_url} alt={`Image ${image.id}`} />
                <button
                  className="delete-button"
                  onClick={(e) => handleDeleteClick(e, image.id)}
                >
                  ×
                </button>
                {selectedImageId === image.id && (
                  <div className="selection-indicator">✓</div>
                )}
              </div>
            ))}
          </div>

          {isLoading && (
            <div className="loading-message">Loading images...</div>
          )}

          {hasMore && !isLoading && (
            <button className="load-more-button" onClick={handleLoadMore}>
              Load More
            </button>
          )}

          {/* Delete Confirmation Modal */}
          {showDeleteModal && (
            <div className="delete-modal-overlay">
              <div className="delete-modal">
                <h3>Delete Image</h3>
                <p>
                  Are you sure you want to delete this image? This action cannot
                  be undone.
                </p>
                <div className="delete-modal-buttons">
                  <button
                    className="cancel-button"
                    onClick={handleDeleteCancel}
                    disabled={isDeleting}
                  >
                    Cancel
                  </button>
                  <button
                    className="delete-confirm-button"
                    onClick={handleDeleteConfirm}
                    disabled={isDeleting}
                  >
                    {isDeleting ? "Deleting..." : "Delete"}
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="media-gallery-footer">
            <button className="cancel-button" onClick={handleClose}>
              Cancel
            </button>
            <button
              className="confirm-button"
              onClick={handleConfirm}
              disabled={!selectedImageId}
            >
              Select Image
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        .media-gallery-popup {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 1000;
        }

        .media-gallery-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: rgba(0, 0, 0, 0.7);
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .media-gallery-content {
          background-color: white;
          width: 90%;
          max-width: 1200px;
          height: 90%;
          border-radius: 8px;
          display: flex;
          flex-direction: column;
          overflow-y: auto;
        }

        .media-gallery-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px 20px;
          border-bottom: 1px solid #eee;
          position: sticky;
          top: 0;
          background-color: white;
          z-index: 5;
        }

        .close-button {
          background: transparent;
          border: none;
          font-size: 24px;
          cursor: pointer;
          color: #666;
        }

        .media-gallery-actions {
          padding: 10px 20px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid #eee;
          position: sticky;
          top: 57px;
          background-color: white;
          z-index: 5;
        }

        .upload-toggle-button {
          background: #4285f4;
          color: white;
          border: none;
          padding: 8px 16px;
          border-radius: 4px;
          cursor: pointer;
        }

        .media-gallery-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
          gap: 16px;
          padding: 20px;
        }

        .media-item {
          position: relative;
          border: 2px solid transparent;
          border-radius: 4px;
          overflow: hidden;
          cursor: pointer;
          aspect-ratio: 1;
          transition: all 0.2s;
        }

        .media-item img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .media-item.selected {
          border-color: #4285f4;
          box-shadow: 0 0 0 2px rgba(66, 133, 244, 0.5);
        }

        .selection-indicator {
          position: absolute;
          top: 8px;
          right: 8px;
          width: 24px;
          height: 24px;
          background: #4285f4;
          color: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .media-gallery-footer {
          padding: 16px 20px;
          border-top: 1px solid #eee;
          display: flex;
          justify-content: flex-end;
          gap: 12px;
          position: sticky;
          bottom: 0;
          background-color: white;
          z-index: 5;
        }

        .cancel-button {
          background: #f1f1f1;
          border: none;
          padding: 10px 20px;
          border-radius: 4px;
          cursor: pointer;
        }

        .confirm-button {
          background: #34a853;
          color: white;
          border: none;
          padding: 10px 20px;
          border-radius: 4px;
          cursor: pointer;
        }

        .confirm-button:disabled {
          background: #ccc;
          cursor: not-allowed;
        }

        .upload-section {
          padding: 20px;
          border-bottom: 1px solid #eee;
          background-color: #f9f9f9;
        }

        .error-message {
          color: #ea4335;
          padding: 10px 20px;
        }

        .loading-message {
          text-align: center;
          padding: 20px;
          color: #666;
        }

        .image-count {
          color: #666;
          font-size: 14px;
        }

        .load-more-button {
          display: block;
          margin: 0 auto 20px;
          background: #f1f1f1;
          border: none;
          padding: 10px 20px;
          border-radius: 4px;
          cursor: pointer;
          transition: background-color 0.2s;
        }

        .load-more-button:hover {
          background: #e8f0fe;
        }

        .delete-button {
          position: absolute;
          top: 8px;
          left: 8px;
          width: 24px;
          height: 24px;
          background: rgba(255, 0, 0, 0.8);
          color: white;
          border: none;
          border-radius: 50%;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
          opacity: 0;
          transition: opacity 0.2s;
          padding: 0;
          line-height: 1;
          aspect-ratio: 1;
        }

        .media-item:hover .delete-button {
          opacity: 1;
        }

        .delete-modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1001;
        }

        .delete-modal {
          background: white;
          padding: 20px;
          border-radius: 8px;
          width: 90%;
          max-width: 400px;
        }

        .delete-modal h3 {
          margin: 0 0 10px 0;
          color: #333;
        }

        .delete-modal p {
          margin: 0 0 20px 0;
          color: #666;
        }

        .delete-modal-buttons {
          display: flex;
          justify-content: flex-end;
          gap: 10px;
        }

        .delete-confirm-button {
          background: #dc3545;
          color: white;
          border: none;
          padding: 8px 16px;
          border-radius: 4px;
          cursor: pointer;
        }

        .delete-confirm-button:disabled {
          background: #ccc;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
};

export default MediaGalleryPopup;
