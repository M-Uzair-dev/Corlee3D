import React, { useState, useCallback } from "react";
import { api } from "../config/api";
import { toast } from "sonner";

// Image compression settings
const MAX_IMAGE_SIZE = 1024 * 1024; // 1MB
const COMPRESSION_QUALITY = 0.6; // 60% quality

const ImageUploader = ({ onUploadSuccess }) => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [compressionProgress, setCompressionProgress] = useState(0);

  // Function to compress image if needed
  const compressImage = async (file) => {
    return new Promise((resolve) => {
      // If file is smaller than MAX_IMAGE_SIZE, return as is
      if (file.size <= MAX_IMAGE_SIZE) {
        resolve(file);
        return;
      }

      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');

          // Calculate new dimensions while maintaining aspect ratio
          let width = img.width;
          let height = img.height;
          const aspectRatio = width / height;

          // If width is larger, scale based on width
          if (width > height) {
            width = Math.min(width, 1920); // Max width 1920px
            height = width / aspectRatio;
          } else {
            // If height is larger, scale based on height
            height = Math.min(height, 1920); // Max height 1920px
            width = height * aspectRatio;
          }

          canvas.width = width;
          canvas.height = height;
          ctx.drawImage(img, 0, 0, width, height);

          canvas.toBlob(
            (blob) => {
              if (blob) {
                // Create a new file from the blob
                const compressedFile = new File([blob], file.name, {
                  type: 'image/jpeg',
                  lastModified: Date.now(),
                });
                resolve(compressedFile);
              } else {
                resolve(file); // Fallback to original if compression fails
              }
            },
            'image/jpeg',
            COMPRESSION_QUALITY
          );
        };
      };
    });
  };

  // Process files function (shared between drag & drop and file input)
  const processFiles = async (files) => {
    try {
      console.log("Processing files:", files.map(f => ({ name: f.name, size: f.size, type: f.type })));
      
      // Filter for image files only
      const imageFiles = Array.from(files).filter(file => file.type.startsWith('image/'));
      
      if (imageFiles.length === 0) {
        toast.error("Please select image files only");
        return;
      }

      if (files.length !== imageFiles.length) {
        toast.warning("Some files were skipped as they are not images");
      }

      // Compress images if needed
      const processedFiles = [];
      const totalFiles = imageFiles.length;
      
      for (let i = 0; i < imageFiles.length; i++) {
        const file = imageFiles[i];
        setCompressionProgress(Math.round((i / totalFiles) * 100));
        
        if (file.size > MAX_IMAGE_SIZE) {
          toast.info(`Optimizing ${file.name} for upload...`);
          const compressedFile = await compressImage(file);
          processedFiles.push(compressedFile);
        } else {
          processedFiles.push(file);
        }
      }
      
      setCompressionProgress(0);

      // Create previews for new files
      const newPreviewUrls = processedFiles.map(file => URL.createObjectURL(file));
      console.log("Created preview URLs:", newPreviewUrls);
      
      // Add new files to existing selection
      setSelectedFiles(prevFiles => [...prevFiles, ...processedFiles]);
      setPreviewUrls(prevUrls => [...prevUrls, ...newPreviewUrls]);
    } catch (err) {
      console.error("Error processing files:", err);
      toast.error("Error processing files: " + err.message);
    }
  };

  // Handle file selection from input
  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    processFiles(files);
    // Reset the file input
    event.target.value = '';
  };

  // Handle drag and drop events
  const handleDragEnter = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    processFiles(files);
  }, []);

  // Remove a selected file
  const handleRemoveFile = (index) => {
    setSelectedFiles(prevFiles => {
      const newFiles = [...prevFiles];
      newFiles.splice(index, 1);
      return newFiles;
    });

    setPreviewUrls(prevUrls => {
      // Revoke the URL for the removed preview
      URL.revokeObjectURL(prevUrls[index]);
      const newUrls = [...prevUrls];
      newUrls.splice(index, 1);
      return newUrls;
    });
  };

  // Handle the upload process
  const handleUpload = async (e) => {
    e.preventDefault();
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
      const formData = new FormData();
      selectedFiles.forEach(file => {
        formData.append('files[]', file);
      });

      // Increased timeout to 60 seconds
      const requestConfig = {
        headers: {
          "Content-Type": "multipart/form-data",
          "Accept": "application/json",
        },
        timeout: 60000, // 60 seconds timeout
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          console.log("Upload progress:", percentCompleted + "%");
        },
      };
      
      const response = await api.post("/multiple-media-uploads/", formData, requestConfig);
      const data = response.data;
      
      if (data && data.uploaded_files && data.uploaded_files.length > 0) {
        setUploadedImages(data.uploaded_files);
        toast.success(`Successfully uploaded ${data.uploaded_files.length} files`);
        
        if (onUploadSuccess && typeof onUploadSuccess === "function") {
          onUploadSuccess(data.uploaded_files);
        }
      } else {
        throw new Error("No files were uploaded successfully");
      }
    } catch (err) {
      console.error("Upload failed:", err);
      let errorMsg = "Upload failed: ";
      
      if (err.code === "ECONNABORTED") {
        errorMsg += "Upload timed out. Please try with fewer or smaller images.";
      } else {
        errorMsg += err.response?.data?.message || err.message;
      }
      
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
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
    <form 
      onSubmit={handleUpload} 
      className={`image-uploader ${isDragging ? 'dragging' : ''}`}
      onDragEnter={handleDragEnter}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <h3>Upload New Media</h3>

      {/* Drop zone */}
      <div className="drop-zone">
        <div className="drop-zone-content">
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          id="file-input"
            className="file-input"
        />
        <label htmlFor="file-input" className="file-input-label">
            {selectedFiles.length === 0 ? 'Choose Files' : 'Add More Files'}
        </label>
          <div className="drop-zone-text">
            or drag and drop images here
          </div>
        {selectedFiles.length > 0 && (
          <span className="file-name">{selectedFiles.length} files selected</span>
        )}
        </div>
      </div>

      {/* Image previews */}
      {previewUrls.length > 0 && (
        <div className="image-previews">
          <h4>Selected Files:</h4>
          <div className="preview-grid">
            {previewUrls.map((url, index) => (
              <div key={index} className="preview-item">
                <img src={url} alt={`Preview ${index + 1}`} />
                <button
                  type="button"
                  className="remove-file-button"
                  onClick={() => handleRemoveFile(index)}
                >
                  ×
                </button>
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

      {compressionProgress > 0 && (
        <div className="compression-progress">
          <div className="progress-bar">
            <div 
              className="progress-bar-fill" 
              style={{ width: `${compressionProgress}%` }}
            ></div>
          </div>
          <div className="progress-text">
            Optimizing images: {compressionProgress}%
          </div>
        </div>
      )}

      <style jsx>{`
        .image-uploader {
          padding: 20px;
          border-radius: 8px;
          background: #fff;
        }

        .image-uploader.dragging .drop-zone {
          border-color: #4285f4;
          background-color: rgba(66, 133, 244, 0.05);
        }

        .drop-zone {
          border: 2px dashed #ddd;
          border-radius: 8px;
          padding: 30px;
          text-align: center;
          transition: all 0.3s ease;
          margin-bottom: 20px;
        }

        .drop-zone:hover {
          border-color: #4285f4;
          background-color: rgba(66, 133, 244, 0.05);
        }

        .drop-zone-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
        }

        .drop-zone-text {
          color: #666;
          margin-top: 8px;
          font-size: 14px;
        }

        .file-input {
          display: none;
        }

        .file-input-label {
          background: #4285f4;
          color: white;
          padding: 10px 20px;
          border-radius: 4px;
          cursor: pointer;
          display: inline-block;
          transition: background-color 0.2s;
        }

        .file-input-label:hover {
          background: #3367d6;
        }

        .file-name {
          color: #666;
          font-size: 14px;
        }

        .preview-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
          gap: 16px;
          margin-top: 10px;
        }

        .preview-item {
          position: relative;
          border: 1px solid #ddd;
          border-radius: 4px;
          overflow: hidden;
          aspect-ratio: 1;
        }

        .preview-item img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .remove-file-button {
          position: absolute;
          top: 4px;
          right: 4px;
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
          padding: 0;
          line-height: 1;
        }

        .upload-actions {
          display: flex;
          gap: 10px;
          margin-top: 20px;
        }

        .upload-button {
          background: #34a853;
          color: white;
          border: none;
          padding: 10px 20px;
          border-radius: 4px;
          cursor: pointer;
          transition: background-color 0.2s;
        }

        .upload-button:hover {
          background: #2d8e47;
        }

        .upload-button:disabled {
          background: #ccc;
          cursor: not-allowed;
        }

        .cancel-button {
          background: #f1f1f1;
          border: none;
          padding: 10px 20px;
          border-radius: 4px;
          cursor: pointer;
        }

        .error-message {
          color: #ea4335;
          margin-top: 10px;
        }

        .upload-success {
          margin-top: 20px;
        }

        .upload-success-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
          gap: 16px;
          margin-top: 10px;
        }

        .upload-success-preview {
          border: 1px solid #ddd;
          border-radius: 4px;
          overflow: hidden;
          aspect-ratio: 1;
        }

        .upload-success-preview img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .reset-button {
          margin-top: 10px;
          background: #4285f4;
          color: white;
          border: none;
          padding: 10px 20px;
          border-radius: 4px;
          cursor: pointer;
        }

        .compression-progress {
          margin: 10px 0;
          padding: 10px;
          background: #f8f9fa;
          border-radius: 4px;
        }

        .progress-bar {
          width: 100%;
          height: 4px;
          background: #eee;
          border-radius: 2px;
          overflow: hidden;
        }

        .progress-bar-fill {
          height: 100%;
          background: #4285f4;
          transition: width 0.3s ease;
        }

        .progress-text {
          margin-top: 5px;
          font-size: 12px;
          color: #666;
          text-align: center;
        }
      `}</style>
    </form>
  );
};

export default ImageUploader;
