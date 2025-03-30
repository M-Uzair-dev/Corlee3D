import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { api } from "../../config/api";
import LoadingSpinner from "../../components/UI/LoadingSpinner";
import MediaGalleryPopup from "../../components/MediaGalleryPopup";
import "./EditPages.css";

function EditEventPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [originalImageId, setOriginalImageId] = useState(null);
  const [imageDetails, setImageDetails] = useState(null);

  // State to store form data
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    photo: null,
    location: "",
    url: "",
    email: "",
    phone: "",
  });

  useEffect(() => {
    fetchEvent();
  }, [id]);

  const fetchEvent = async () => {
    setIsLoading(true);
    setErrorMessage("");
    try {
      const response = await api.get(`/events/${id}/`);
      const eventData = response.data;
      console.log("Fetched event data:", eventData);

      // Set the form data
      setFormData({
        title: eventData.title || "",
        description: eventData.description || "",
        date: eventData.date || "",
        time: eventData.time || "",
        photo: eventData.photo || null,
        location: eventData.location || "",
        url: eventData.url || "",
        email: eventData.email || "",
        phone: eventData.phone || "",
      });

      // Store the original image ID for comparison when saving
      setOriginalImageId(eventData.photo);

      // If there's a photo or photo_url, set the image details
      if (eventData.photo) {
        await fetchImageDetails(eventData.photo);
      } else if (eventData.photo_url) {
        // If the API directly provides a photo_url, use it
        setImageDetails({ file: eventData.photo_url });
      }
    } catch (error) {
      console.error("Error fetching event:", error);
      setErrorMessage(
        error.response?.data?.detail ||
          error.response?.data?.message ||
          "Failed to load event details"
      );
      toast.error("Failed to load event details");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchImageDetails = async (imageId) => {
    if (!imageId) return;

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setErrorMessage("");

    try {
      // Check for required fields
      if (!formData.title || !formData.date || !formData.location) {
        throw new Error("Title, date, and location are required fields");
      }

      // Prepare payload for API, excluding photo if it hasn't changed
      const payload = {
        title: formData.title,
        description: formData.description,
        date: formData.date,
        time: formData.time,
        location: formData.location,
        url: formData.url,
        email: formData.email,
        phone: formData.phone,
      };

      // Only include photo if it changed from the original
      if (formData.photo !== originalImageId) {
        payload.photo = formData.photo;
      }
      if (payload.photo === null) {
        delete payload.photo;
      }
      console.log("Edit Event Page - Sending payload:", payload);
      // Update event
      await api.put(`/events/${id}/`, payload);
      toast.success("Event updated successfully");
      navigate("/dashboard/events");
    } catch (error) {
      console.error("Error updating event:", error);
      setErrorMessage(
        error.message ||
          error.response?.data?.message ||
          error.response?.data?.detail ||
          "Failed to update event"
      );
      toast.error("Failed to update event");
    } finally {
      setIsSaving(false);
    }
  };

  const openMediaGallery = () => {
    setIsGalleryOpen(true);
  };

  if (isLoading) {
    return (
      <div className="loading-container">
        <LoadingSpinner text="Loading event details..." />
      </div>
    );
  }

  return (
    <div className="dashboard-content-card edit-page-container">
      <div className="edit-page-header">
        <button
          className="back-button"
          onClick={() => navigate("/dashboard/events")}
        >
          ← Back to Events
        </button>
      </div>

      <h2 className="edit-heading">Edit Event</h2>

      {errorMessage && <div className="error-message">{errorMessage}</div>}

      <form onSubmit={handleSubmit} className="edit-form">
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
          <button type="submit" className="submit-button" disabled={isSaving}>
            {isSaving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>

      {isSaving && <LoadingSpinner text="Updating event..." overlay />}

      <MediaGalleryPopup
        isOpen={isGalleryOpen}
        setIsOpen={setIsGalleryOpen}
        onSelectImage={handleSelectImage}
      />

      <style jsx>{`
        .edit-page-container {
          padding: 24px;
        }

        .loading-container {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 300px;
          width: 100%;
          padding: 24px;
        }

        .edit-heading {
          font-size: 24px;
          font-weight: 600;
          margin-bottom: 24px;
          color: #4285f4;
        }

        .edit-form {
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

          .edit-page-container {
            padding: 16px;
          }
        }
      `}</style>
    </div>
  );
}

export default EditEventPage;
