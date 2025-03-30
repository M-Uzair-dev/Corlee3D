import React, { useState } from "react";
import { api } from "../config/api";

const ImageUploader = ({ onUploadSuccess }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Handle file selection
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);

      // Create a preview
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle the upload process
  const handleUpload = async () => {
    if (!selectedFile) {
      setError("Please select a file first");
      return;
    }

    setIsLoading(true);
    setError(null);

    // Create a FormData object to handle the file upload
    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const response = await api.post("/media/create/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const data = response.data;
      setUploadedImage(data);
      setIsLoading(false);

      // Call the onUploadSuccess callback if provided
      if (onUploadSuccess && typeof onUploadSuccess === "function") {
        onUploadSuccess(data);
      }

      // You can use the media ID returned in the response
      console.log("Uploaded media ID:", data.id);
      console.log("Media URL:", data.file_url);
    } catch (err) {
      setError(`Upload failed: ${err.message}`);
      setIsLoading(false);
    }
  };

  // Reset the uploader
  const handleReset = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setUploadedImage(null);
    setError(null);
  };

  return (
    <div className="image-uploader">
      <h3>Upload New Media</h3>

      {/* File input */}
      <div className="file-input-container">
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          id="file-input"
        />
        <label htmlFor="file-input" className="file-input-label">
          Choose File
        </label>
        {selectedFile && <span className="file-name">{selectedFile.name}</span>}
      </div>

      {/* Image preview */}
      {previewUrl && (
        <div className="image-preview">
          <h4>Preview : </h4>
          <img src={previewUrl} alt="Preview" />
        </div>
      )}

      <div className="upload-actions">
        {/* Upload button */}
        <button
          onClick={handleUpload}
          disabled={!selectedFile || isLoading}
          className="upload-button"
        >
          {isLoading ? "Uploading..." : "Upload Image"}
        </button>

        {selectedFile && (
          <button onClick={handleReset} className="cancel-button">
            Cancel
          </button>
        )}
      </div>

      {/* Error message */}
      {error && <div className="error-message">{error}</div>}

      {/* Upload success */}
      {uploadedImage && (
        <div className="upload-success">
          <h4>Upload Successful!</h4>
          <div className="upload-success-preview">
            <img src={uploadedImage.file_url} alt="Uploaded" />
          </div>
          <button onClick={handleReset} className="reset-button">
            Upload Another Image
          </button>
        </div>
      )}

      {/* Updated CSS to match dashboard styling */}
      <style jsx>{`
        .image-uploader {
          width: 100%;
          margin: 0 auto;
          padding: 0;
        }

        h3 {
          margin-top: 0;
          margin-bottom: 16px;
          color: #333;
          font-weight: 500;
        }

        h4 {
          margin-top: 0;
          margin-bottom: 8px;
          color: #555;
          font-weight: 500;
        }

        .file-input-container {
          margin: 16px 0;
          display: flex;
          align-items: center;
          flex-wrap: wrap;
        }

        .file-input-label {
          background: #4285f4;
          color: white;
          padding: 8px 16px;
          border-radius: 4px;
          cursor: pointer;
          font-size: 14px;
          display: inline-block;
          transition: background-color 0.2s;
        }

        .file-input-label:hover {
          background: #3367d6;
        }

        .file-name {
          margin-left: 10px;
          font-size: 14px;
          color: #555;
          word-break: break-all;
          max-width: 250px;
          display: inline-block;
        }

        #file-input {
          display: none;
        }

        .upload-actions {
          display: flex;
          gap: 10px;
          margin: 16px 0;
        }

        .upload-button,
        .reset-button,
        .cancel-button {
          border: none;
          padding: 8px 16px;
          border-radius: 4px;
          cursor: pointer;
          font-size: 14px;
          transition: background-color 0.2s;
        }

        .upload-button {
          background: #34a853;
          color: white;
        }

        .upload-button:hover {
          background: #2e8b46;
        }

        .reset-button {
          background: #4285f4;
          color: white;
        }

        .reset-button:hover {
          background: #3367d6;
        }

        .cancel-button {
          background: #f1f1f1;
          color: #333;
        }

        .cancel-button:hover {
          background: #e4e4e4;
        }

        .upload-button:disabled {
          background: #ccc;
          cursor: not-allowed;
        }

        .error-message {
          color: #ea4335;
          margin: 10px 0;
          padding: 8px;
          background-color: rgba(234, 67, 53, 0.1);
          border-radius: 4px;
          font-size: 14px;
        }

        .image-preview {
          margin: 16px 0;
          justify-content: start !important;
          align-items: start !important;
          padding: 10px !important;
          gap: 10px !important;
        }

        .image-preview img {
          max-width: 100%;
          height: 100%;
          border-radius: 4px;
          border: 1px solid #eee;
        }

        .upload-success {
          margin: 16px 0;
          padding: 16px;
          background-color: rgba(52, 168, 83, 0.1);
          border-radius: 4px;
        }

        .upload-success-preview {
          margin: 10px 0;
        }

        .upload-success-preview img {
          max-width: 100%;
          max-height: 200px;
          border-radius: 4px;
          border: 1px solid #eee;
        }
      `}</style>
    </div>
  );
};

export default ImageUploader;
