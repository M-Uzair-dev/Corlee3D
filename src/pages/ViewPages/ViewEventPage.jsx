import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../../config/api";
import { FaPhone, FaEnvelope, FaLink, FaEdit } from "react-icons/fa";
import LoadingSpinner from "../../components/UI/LoadingSpinner";
import { toast } from "sonner";
import "./ViewPages.css";

function ViewEventPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [eventData, setEventData] = useState(null);
  const [eventImage, setEventImage] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchEvent();
  }, [id]);

  const fetchEvent = async () => {
    setIsLoading(true);
    try {
      const response = await api.get(`/events/${id}/`);
      setEventData(response.data);
      console.log("Fetched event data:", response.data);

      // If the event has a photo or photo_url, fetch the image
      if (response.data.photo) {
        fetchEventImage(response.data.photo);
      } else if (response.data.photo_url) {
        // If the API directly provides a photo_url, use it
        setEventImage({ file: response.data.photo_url });
      }
    } catch (error) {
      console.error("Error fetching event:", error);
      setError("Failed to load event details");
      toast.error("Failed to load event details");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchEventImage = async (imageId) => {
    try {
      console.log("Fetching image with ID:", imageId);
      const response = await api.get(`/media/${imageId}/`);
      console.log("Image data:", response.data);
      setEventImage(response.data);
    } catch (error) {
      console.error("Error fetching event image:", error);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "No date specified";

    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (timeString) => {
    if (!timeString) return "";

    // If timeString is in HH:MM:SS format, convert to HH:MM AM/PM
    const timeParts = timeString.split(":");
    if (timeParts.length >= 2) {
      let hours = parseInt(timeParts[0], 10);
      const minutes = timeParts[1];
      const ampm = hours >= 12 ? "PM" : "AM";

      hours = hours % 12;
      hours = hours || 12; // Convert 0 to 12

      return `${hours}:${minutes} ${ampm}`;
    }

    return timeString;
  };

  if (isLoading) {
    return (
      <div className="loading-container">
        <LoadingSpinner text="Loading event details..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-content-card view-page-container">
        <div className="error-message">{error}</div>
        <button
          className="back-button"
          onClick={() => navigate("/dashboard/events")}
        >
          ← Back to Events
        </button>
      </div>
    );
  }

  if (!eventData) {
    return (
      <div className="dashboard-content-card view-page-container">
        <div className="error-message">Event not found</div>
        <button
          className="back-button"
          onClick={() => navigate("/dashboard/events")}
        >
          ← Back to Events
        </button>
      </div>
    );
  }

  return (
    <div className="dashboard-content-card view-page-container">
      <div className="view-page-header">
        <button
          className="back-button"
          onClick={() => navigate("/dashboard/events")}
        >
          ← Back to Events
        </button>
        <button
          className="edit-button"
          onClick={() => navigate(`/dashboard/events/edit/${id}`)}
        >
          <FaEdit /> Edit Event
        </button>
      </div>

      <div className="view-page-content">
        <div className="view-page-title">
          <h2>{eventData.title}</h2>
          <div className="event-datetime">
            {formatDate(eventData.date)}
            {eventData.time && ` at ${formatTime(eventData.time)}`}
          </div>
        </div>

        <div className="view-page-sections">
          <div className="view-page-section">
            <h3 className="section-title">Event Details</h3>

            <div className="event-details">
              {(eventImage?.file || eventData.photo_url) && (
                <div className="event-image-container">
                  <img
                    src={eventImage?.file || eventData.photo_url}
                    alt={eventData.title}
                    className="event-image"
                    onError={(e) => {
                      console.log("Image load error");
                      e.target.onerror = null;
                      e.target.src =
                        "https://via.placeholder.com/800x400?text=Image+Not+Available";
                    }}
                  />
                </div>
              )}

              <div className="event-info">
                <div className="info-item">
                  <strong>Location:</strong>
                  {eventData.location || "No location specified"}
                </div>

                {eventData.description && (
                  <div className="info-item description">
                    <strong>Description:</strong>
                    <div className="description-text">
                      {eventData.description}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="view-page-section">
            <h3 className="section-title">Contact Information</h3>

            <div className="contact-info">
              {eventData.email && (
                <div className="contact-item">
                  <FaEnvelope className="contact-icon" />
                  <a
                    href={`mailto:${eventData.email}`}
                    className="contact-link"
                  >
                    {eventData.email}
                  </a>
                </div>
              )}

              {eventData.phone && (
                <div className="contact-item">
                  <FaPhone className="contact-icon" />
                  <a href={`tel:${eventData.phone}`} className="contact-link">
                    {eventData.phone}
                  </a>
                </div>
              )}

              {eventData.url && (
                <div className="contact-item">
                  <FaLink className="contact-icon" />
                  <a
                    href={
                      eventData.url.startsWith("http")
                        ? eventData.url
                        : `https://${eventData.url}`
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="contact-link"
                  >
                    Event Website
                  </a>
                </div>
              )}

              {!eventData.email && !eventData.phone && !eventData.url && (
                <div className="no-contact-info">
                  No contact information provided
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .view-page-container {
          padding: 24px;
          width: 100%;
          box-sizing: border-box;
        }

        .loading-container {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 300px;
          width: 100%;
          padding: 24px;
        }

        .view-page-header {
          display: flex;
          justify-content: space-between;
          margin-bottom: 24px;
        }

        .back-button,
        .edit-button {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 8px 16px;
          background-color: #f1f1f1;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          color: #333;
          font-size: 14px;
          transition: background-color 0.2s;
        }

        .back-button:hover,
        .edit-button:hover {
          background-color: #e0e0e0;
        }

        .edit-button {
          background-color: #4285f4;
          color: white;
        }

        .edit-button:hover {
          background-color: #3367d6;
        }

        .view-page-title {
          margin-bottom: 24px;
          padding-bottom: 16px;
          border-bottom: 1px solid #eaeaea;
        }

        .view-page-title h2 {
          font-size: 28px;
          font-weight: 600;
          margin: 0 0 8px 0;
          color: #4285f4;
        }

        .event-datetime {
          font-size: 16px;
          color: #555;
        }

        .section-title {
          font-size: 18px;
          font-weight: 500;
          margin-top: 0;
          margin-bottom: 16px;
          color: #333;
        }

        .view-page-sections {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .view-page-section {
          background-color: #f9f9f9;
          border-radius: 8px;
          padding: 24px;
        }

        .event-details {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .event-image-container {
          width: 100%;
          max-height: 400px;
          overflow: hidden;
          border-radius: 8px;
          display: flex;
          justify-content: center;
          align-items: center;
          background-color: #f1f1f1;
        }

        .event-image {
          max-width: 100%;
          max-height: 400px;
          object-fit: contain;
        }

        .event-info {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .info-item {
          font-size: 15px;
          line-height: 1.5;
        }

        .info-item strong {
          font-weight: 600;
          margin-right: 8px;
        }

        .description {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .description-text {
          white-space: pre-line;
          line-height: 1.6;
        }

        .contact-info {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .contact-item {
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: 15px;
        }

        .contact-icon {
          color: #4285f4;
          font-size: 18px;
        }

        .contact-link {
          color: #4285f4;
          text-decoration: none;
          transition: color 0.2s;
        }

        .contact-link:hover {
          color: #2a56c6;
          text-decoration: underline;
        }

        .no-contact-info {
          color: #777;
          font-style: italic;
        }

        .error-message {
          background-color: #fdeded;
          color: #d32f2f;
          padding: 12px 16px;
          border-radius: 4px;
          margin-bottom: 16px;
          font-size: 14px;
        }

        @media (min-width: 768px) {
          .event-details {
            flex-direction: row;
            align-items: flex-start;
          }

          .event-image-container {
            flex: 0 0 40%;
            max-width: 40%;
          }

          .event-info {
            flex: 1;
          }
        }

        @media (max-width: 768px) {
          .view-page-section {
            padding: 16px;
          }

          .view-page-title h2 {
            font-size: 24px;
          }

          .view-page-container {
            padding: 16px;
          }
        }
      `}</style>
    </div>
  );
}

export default ViewEventPage;
