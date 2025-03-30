import React, { useState } from "react";
import MediaGalleryPopup from "./MediaGalleryPopup";
import { api } from "../config/api";

const MediaSelectorExample = () => {
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [selectedImageId, setSelectedImageId] = useState(null);
  const [selectedImageUrl, setSelectedImageUrl] = useState(null);

  const handleOpenGallery = () => {
    setIsGalleryOpen(true);
  };

  const handleSelectImage = async (imageId) => {
    if (!imageId) return;

    try {
      // Fetch the image details using the API utility
      const response = await api.get(`/media/${imageId}/`);
      const imageData = response.data;

      setSelectedImageId(imageId);
      setSelectedImageUrl(imageData.file_url);
      setIsGalleryOpen(false);
    } catch (error) {
      console.error("Error fetching image details:", error);
    }
  };

  return (
    <div className="media-selector-example">
      <h1>Media Selector Example</h1>

      <div className="image-display">
        {selectedImageUrl ? (
          <div className="selected-image-container">
            <h2>Selected Image (ID: {selectedImageId})</h2>
            <img
              src={selectedImageUrl}
              alt="Selected media"
              className="selected-image"
            />
          </div>
        ) : (
          <div className="no-image-placeholder">
            <p>No image selected</p>
          </div>
        )}
      </div>

      <button className="open-gallery-button" onClick={handleOpenGallery}>
        {selectedImageId ? "Change Image" : "Select Image"}
      </button>

      <MediaGalleryPopup
        isOpen={isGalleryOpen}
        setIsOpen={setIsGalleryOpen}
        onSelectImage={handleSelectImage}
      />

      <style jsx>{`
        .media-selector-example {
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
        }

        .image-display {
          margin: 30px 0;
          border: 1px dashed #ccc;
          padding: 20px;
          border-radius: 8px;
          text-align: center;
          min-height: 300px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .no-image-placeholder {
          color: #999;
          font-size: 18px;
        }

        .selected-image {
          max-width: 100%;
          max-height: 400px;
          border-radius: 4px;
        }

        .open-gallery-button {
          background: #4285f4;
          color: white;
          border: none;
          padding: 12px 24px;
          font-size: 16px;
          border-radius: 4px;
          cursor: pointer;
        }

        .open-gallery-button:hover {
          background: #3367d6;
        }
      `}</style>
    </div>
  );
};

export default MediaSelectorExample;
