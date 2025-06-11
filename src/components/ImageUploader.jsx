import React, { useState } from "react";
import { api } from "../config/api";
import { toast } from "sonner";

const ImageUploader = ({ onUploadSuccess }) => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Handle file selection
  const handleFileChange = (event) => {
    try {
      console.log("File selection started");
      const files = Array.from(event.target.files);
      console.log("Selected files:", files.map(f => ({ name: f.name, size: f.size, type: f.type })));
      
      setSelectedFiles(files);

      // Create previews
      const newPreviewUrls = files.map(file => URL.createObjectURL(file));
      console.log("Created preview URLs:", newPreviewUrls);
      
      setPreviewUrls(prevUrls => {
        // Clean up old preview URLs
        console.log("Cleaning up old preview URLs");
        prevUrls.forEach(url => URL.revokeObjectURL(url));
        return newPreviewUrls;
      });
    } catch (err) {
      console.error("Error in file selection:", err);
      toast.error("Error selecting files: " + err.message);
    }
  };

  // Handle the upload process
  const handleUpload = async (e) => {
    e.preventDefault(); // Prevent form submission
    console.log("Upload process started");
    
    if (selectedFiles.length === 0) {
      const errorMsg = "Please select files first";
      console.log("Upload error:", errorMsg);
      setError(errorMsg);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Create a FormData object to handle the file upload
      const formData = new FormData();
      
      // Log detailed file information before appending
      console.log("Files to upload:", selectedFiles.map(f => ({
        name: f.name,
        type: f.type,
        size: f.size,
        lastModified: f.lastModified
      })));

      selectedFiles.forEach(file => {
        formData.append('files[]', file);
        console.log("Appending file to FormData:", file.name);
      });

      // Log FormData entries to verify content
      console.log("FormData entries:");
      for (let pair of formData.entries()) {
        console.log("FormData entry -", "key:", pair[0], "value:", pair[1] instanceof File ? {
          name: pair[1].name,
          type: pair[1].type,
          size: pair[1].size
        } : pair[1]);
      }

      // Log request configuration
      const requestConfig = {
        headers: {
          "Content-Type": "multipart/form-data",
          "Accept": "application/json",
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          console.log("Upload progress:", percentCompleted + "%");
        },
      };
      console.log("Request configuration:", {
        url: "/multiple-media-uploads/",
        headers: requestConfig.headers
      });

      console.log("Sending request to /multiple-media-uploads/");
      console.log("API base URL:", api.defaults.baseURL);
      console.log("Full request URL:", api.defaults.baseURL + "/multiple-media-uploads/");
      
      const response = await api.post("/multiple-media-uploads/", formData, requestConfig);

      // Log detailed response information
      console.log("Response received");
      console.log("Response type:", typeof response);
      console.log("Upload response status:", response.status);
      console.log("Upload response headers:", response.headers);
      console.log("Upload response:", response);
      console.log("Upload response data:", response.data);
      
      const data = response.data;
      
      if (data && data.uploaded_files && data.uploaded_files.length > 0) {
        console.log("Successfully uploaded files:", data.uploaded_files);
        setUploadedImages(data.uploaded_files);
        toast.success(`Successfully uploaded ${data.uploaded_files.length} files`);
      } else {
        console.error("Upload response missing expected data structure:", data);
        throw new Error("No files were uploaded successfully");
      }

      setIsLoading(false);

      // Call the onUploadSuccess callback if provided
      if (onUploadSuccess && typeof onUploadSuccess === "function") {
        console.log("Calling onUploadSuccess with:", data.uploaded_files);
        onUploadSuccess(data.uploaded_files);
      }

      // Log any errors
      if (data.errors && data.errors.length > 0) {
        console.warn("Some files failed to upload:", data.errors);
        const errorMsg = `${data.errors.length} files failed to upload. Check console for details.`;
        setError(errorMsg);
        toast.error(errorMsg);
      }
    } catch (err) {
      console.error("Upload failed:", err);
      console.error("Error details:", {
        message: err.message,
        name: err.name,
        code: err.code,
        response: {
          data: err.response?.data,
          status: err.response?.status,
          headers: err.response?.headers,
          config: err.response?.config
        },
        request: err.request
      });
      
      const errorMsg = `Upload failed: ${err.response?.data?.message || err.message}`;
      setError(errorMsg);
      toast.error(errorMsg);
      setIsLoading(false);
    }
  };

  // Reset the uploader
  const handleReset = (e) => {
    e.preventDefault(); // Prevent form submission
    console.log("Resetting uploader state");
    
    setSelectedFiles([]);
    setPreviewUrls(prevUrls => {
      prevUrls.forEach(url => URL.revokeObjectURL(url));
      return [];
    });
    setUploadedImages([]);
    setError(null);
  };

  // Cleanup preview URLs when component unmounts
  React.useEffect(() => {
    return () => {
      console.log("Component unmounting, cleaning up preview URLs");
      previewUrls.forEach(url => URL.revokeObjectURL(url));
    };
  }, [previewUrls]);

  return (
    <form onSubmit={handleUpload} className="image-uploader">
      <h3>Upload New Media</h3>

      {/* File input */}
      <div className="file-input-container">
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          id="file-input"
          multiple
        />
        <label htmlFor="file-input" className="file-input-label">
          Choose Files
        </label>
        {selectedFiles.length > 0 && (
          <span className="file-name">{selectedFiles.length} files selected</span>
        )}
      </div>

      {/* Image previews */}
      {previewUrls.length > 0 && (
        <div className="image-previews">
          <h4>Previews:</h4>
          <div className="preview-grid">
            {previewUrls.map((url, index) => (
              <div key={index} className="preview-item">
                <img src={url} alt={`Preview ${index + 1}`} />
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="upload-actions">
        {/* Upload button */}
        <button
          type="submit"
          disabled={selectedFiles.length === 0 || isLoading}
          className="upload-button"
        >
          {isLoading ? "Uploading..." : "Upload Images"}
        </button>

        {selectedFiles.length > 0 && (
          <button onClick={handleReset} className="cancel-button" type="button">
            Cancel
          </button>
        )}
      </div>

      {/* Error message */}
      {error && <div className="error-message">{error}</div>}

      {/* Upload success */}
      {uploadedImages.length > 0 && (
        <div className="upload-success">
          <h4>Upload Successful!</h4>
          <div className="upload-success-grid">
            {uploadedImages.map((image, index) => (
              <div key={index} className="upload-success-preview">
                <img src={image.file_url} alt={`Uploaded ${index + 1}`} />
              </div>
            ))}
          </div>
          <button onClick={handleReset} className="reset-button" type="button">
            Upload More Images
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

        .preview-grid, .upload-success-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
          gap: 16px;
          margin: 16px 0;
        }

        .preview-item, .upload-success-preview {
          position: relative;
          aspect-ratio: 1;
          border-radius: 4px;
          overflow: hidden;
          border: 1px solid #eee;
        }

        .preview-item img, .upload-success-preview img {
          width: 100%;
          height: 100%;
          object-fit: cover;
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

        .upload-button:disabled {
          background: #ccc;
          cursor: not-allowed;
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

        .error-message {
          color: #ea4335;
          margin: 8px 0;
          font-size: 14px;
        }

        .upload-success {
          margin-top: 16px;
          padding: 16px;
          background: #f8f9fa;
          border-radius: 4px;
        }
      `}</style>
    </form>
  );
};

export default ImageUploader;
