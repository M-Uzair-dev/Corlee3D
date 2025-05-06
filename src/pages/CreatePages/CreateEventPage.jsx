import React, { useState } from "react";
import { api } from "../../config/api";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import LoadingSpinner from "../../components/UI/LoadingSpinner";
import MediaGalleryPopup from "../../components/MediaGalleryPopup";
import "./CreatePages.css";

function CreateEventPage() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [imageDetails, setImageDetails] = useState(null);

  // State to store form data
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: new Date().toISOString().split("T")[0], // Today's date
    time: "12:00:00", // Default time
    photo: null, // ID of MediaUploads object
    location: "",
    url: "",
    email: "",
    phone: "",
    title_mandarin: "",
    description_mandarin: "",
    location_mandarin: "",
  });

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
      photo: imageId,
    }));
    fetchImageDetails(imageId);
  };

  const fetchImageDetails = async (imageId) => {
    try {
      console.log("Fetching image with ID:", imageId);
      const response = await api.get(`/media/${imageId}/`);
      console.log("Image data:", response.data);
      setImageDetails(response.data);
    } catch (error) {
      console.error("Error fetching image details:", error);
      toast.error("Failed to load image details");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");

    try {
      // Check for required fields
      if (!formData.title || !formData.date || !formData.location) {
        throw new Error("Title, date, and location are required fields");
      }

      // Prepare payload for API
      const payload = {
        title: formData.title,
        description: formData.description,
        date: formData.date,
        time: formData.time,
        photo: formData.photo, // ID of MediaUploads object
        location: formData.location,
        url: formData.url,
        email: formData.email,
        phone: formData.phone,
        title_mandarin: formData.title_mandarin,
        description_mandarin: formData.description_mandarin,
        location_mandarin: formData.location_mandarin,
      };

      console.log("Create Event Page - Sending payload:", payload);
      // Create event
      await api.post("/events/", payload);
      toast.success("Event created successfully");
      navigate("/dashboard/events");
    } catch (error) {
      console.error("Error creating event:", error);
      setErrorMessage(
        error.message ||
          error.response?.data?.message ||
          error.response?.data?.detail ||
          "Failed to create event"
      );
      toast.error("Failed to create event");
    } finally {
      setIsLoading(false);
    }
  };

  const openMediaGallery = () => {
    setIsGalleryOpen(true);
  };

  return (
    <div className="dashboard-content-card create-page-container">
      <div className="create-page-header">
        <button
          className="back-button"
          onClick={() => navigate("/dashboard/events")}
        >
          ← Back to Events
        </button>
      </div>

      <h2 className="create-heading">Create New Event</h2>

      {errorMessage && <div className="error-message">{errorMessage}</div>}

      <form onSubmit={handleSubmit} className="create-form">
        <div className="form-section">
          <h3 className="section-title">Event Details</h3>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="title">Event Title*</label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Enter event title"
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="title_mandarin">Event Title (Mandarin)</label>
              <input
                type="text"
                id="title_mandarin"
                name="title_mandarin"
                value={formData.title_mandarin}
                onChange={handleInputChange}
                placeholder="输入活动标题"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows="4"
                placeholder="Describe the event"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="description_mandarin">
                Description (Mandarin)
              </label>
              <textarea
                id="description_mandarin"
                name="description_mandarin"
                value={formData.description_mandarin}
                onChange={handleInputChange}
                rows="4"
                placeholder="描述活动"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="date">Event Date*</label>
              <input
                type="date"
                id="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="time">Event Time</label>
              <input
                type="time"
                id="time"
                name="time"
                value={formData.time}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="location">Location*</label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                placeholder="Enter event location"
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="location_mandarin">Location (Mandarin)</label>
              <input
                type="text"
                id="location_mandarin"
                name="location_mandarin"
                value={formData.location_mandarin}
                onChange={handleInputChange}
                placeholder="输入活动地点"
              />
            </div>
          </div>
        </div>

        <div className="form-section">
          <h3 className="section-title">Contact Information</h3>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="url">Event URL</label>
              <input
                type="url"
                id="url"
                name="url"
                value={formData.url}
                onChange={handleInputChange}
                placeholder="https://example.com/event"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="email">Contact Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="event@example.com"
              />
            </div>
            <div className="form-group">
              <label htmlFor="phone">Contact Phone</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="(123) 456-7890"
              />
            </div>
          </div>
        </div>

        <div className="form-section">
          <h3 className="section-title">Event Image</h3>

          <div className="image-selection">
            <div className="selected-image">
              {imageDetails ? (
                <img
                  src={imageDetails.file}
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
                <div className="no-image-placeholder">No image selected</div>
              )}
            </div>

            <button
              type="button"
              className="select-image-button"
              onClick={openMediaGallery}
            >
              {formData.photo ? "Change Image" : "Select Image"}
            </button>
          </div>
        </div>

        <div className="form-actions">
          <button
            type="button"
            className="cancel-button"
            onClick={() => navigate("/dashboard/events")}
          >
            Cancel
          </button>
          <button type="submit" className="submit-button" disabled={isLoading}>
            {isLoading ? "Creating..." : "Create Event"}
          </button>
        </div>
      </form>

      {isLoading && <LoadingSpinner text="Creating event..." overlay />}

      <MediaGalleryPopup
        isOpen={isGalleryOpen}
        setIsOpen={setIsGalleryOpen}
        onSelectImage={handleSelectImage}
      />

      <style jsx>{`
        .create-page-container {
          padding: 24px;
        }

        .create-heading {
          font-size: 24px;
          font-weight: 600;
          margin-bottom: 24px;
          color: #4285f4;
        }

        .create-form {
          display: flex;
          flex-direction: column;
          gap: 24px;
          width: 100%;
        }

        .form-section {
          background-color: #f9f9f9;
          border-radius: 8px;
          padding: 24px;
          width: 100%;
          box-sizing: border-box;
        }

        .section-title {
          margin-top: 0;
          margin-bottom: 16px;
          font-size: 18px;
          font-weight: 500;
          color: #333;
        }

        .form-row {
          display: flex;
          gap: 16px;
          margin-bottom: 16px;
          width: 100%;
        }

        .form-row:last-child {
          margin-bottom: 0;
        }

        .form-group {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        label {
          font-weight: 500;
          color: #555;
          font-size: 14px;
        }

        input,
        textarea,
        select {
          padding: 10px 12px;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 14px;
          width: 100%;
          box-sizing: border-box;
        }

        input:focus,
        textarea:focus,
        select:focus {
          outline: none;
          border-color: #4285f4;
          box-shadow: 0 0 0 2px rgba(66, 133, 244, 0.1);
        }

        .error-message {
          background-color: #fdeded;
          color: #d32f2f;
          padding: 12px 16px;
          border-radius: 4px;
          margin-bottom: 16px;
          font-size: 14px;
        }

        .image-selection {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .selected-image {
          width: 100%;
          height: 200px;
          border: 1px dashed #ccc;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          background-color: #f5f5f5;
        }

        .preview-image {
          max-width: 100%;
          max-height: 100%;
          object-fit: contain;
        }

        .no-image-placeholder {
          color: #999;
          font-size: 14px;
        }

        .select-image-button {
          align-self: flex-start;
          padding: 8px 16px;
          background-color: #f1f1f1;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          color: #333;
          font-size: 14px;
          transition: background-color 0.2s;
        }

        .select-image-button:hover {
          background-color: #e0e0e0;
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

        .submit-button:hover:not(:disabled) {
          background-color: #3367d6;
        }

        .submit-button:disabled {
          background-color: #79a9f5;
          cursor: not-allowed;
        }

        @media (max-width: 768px) {
          .form-row {
            flex-direction: column;
            gap: 16px;
          }

          .form-section {
            padding: 16px;
          }

          .create-page-container {
            padding: 16px;
          }
        }
      `}</style>
    </div>
  );
}

export default CreateEventPage;
