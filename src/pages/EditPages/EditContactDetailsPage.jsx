import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../../config/api";
import { toast } from "sonner";
import LoadingSpinner from "../../components/UI/LoadingSpinner";
import "./EditPages.css";

function EditContactDetailsPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [formData, setFormData] = useState({
    phone: "",
    email: "",
    address: "",
    address_mandarin: "",
    city: "",
    city_mandarin: "",
    county: "",
    county_mandarin: "",
    postal_code: "",
    country: "",
    country_mandarin: "",
    latitude: "",
    longitude: "",
    facebook: "",
    instagram: "",
    whatsapp: "",
    line: "",
  });

  useEffect(() => {
    fetchContactDetails();
  }, [id]);

  const fetchContactDetails = async () => {
    try {
      setIsLoading(true);
      const response = await api.get("/contact-details/");
      console.log("Fetched contact details:", response.data);

      // Find the contact detail with matching ID
      const contactDetail = response.data.results.find(
        (item) => item.id === parseInt(id)
      );
      if (contactDetail) {
        setFormData(contactDetail);
      } else {
        toast.error("Contact details not found");
        navigate("/dashboard/contact-details");
      }
    } catch (error) {
      console.error("Error fetching contact details:", error);
      toast.error("Failed to load contact details");
      setErrorMessage("Failed to load contact details. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage("");

    try {
      console.log("Submitting contact details:", formData);
      const response = await api.put(`/contact-details/${id}/`, formData);
      console.log("Updated contact details response:", response.data);
      toast.success("Contact details updated successfully");
      navigate("/dashboard/contact-details");
    } catch (error) {
      console.error("Error updating contact details:", error);
      toast.error("Failed to update contact details");
      setErrorMessage(
        error.response?.data?.message ||
          "Failed to update contact details. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <LoadingSpinner text="Loading contact details..." />;
  }

  return (
    <div className="dashboard-content-card edit-page-container">
      <div className="edit-page-header">
        <button
          className="back-button"
          onClick={() => navigate("/dashboard/contact-details")}
        >
          ← Back to Contact Details
        </button>
      </div>

      <h2 className="edit-heading">Edit Contact Details</h2>

      {errorMessage && <div className="error-message">{errorMessage}</div>}

      <form onSubmit={handleSubmit} className="edit-form">
        <div className="form-section">
          <h3>Contact Information</h3>

          <div className="form-group">
            <label htmlFor="phone">Phone *</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              required
              placeholder="Enter phone number"
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email *</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              placeholder="Enter email address"
            />
          </div>

          <div className="form-group">
            <label htmlFor="address">Address (English) *</label>
            <input
              type="text"
              id="address"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              required
              placeholder="Enter address in English"
            />
          </div>

          <div className="form-group">
            <label htmlFor="address_mandarin">Address (Mandarin)</label>
            <input
              type="text"
              id="address_mandarin"
              name="address_mandarin"
              value={formData.address_mandarin}
              onChange={handleInputChange}
              placeholder="Enter address in Mandarin"
            />
          </div>

          <div className="form-group">
            <label htmlFor="city">City (English) *</label>
            <input
              type="text"
              id="city"
              name="city"
              value={formData.city}
              onChange={handleInputChange}
              required
              placeholder="Enter city in English"
            />
          </div>

          <div className="form-group">
            <label htmlFor="city_mandarin">City (Mandarin)</label>
            <input
              type="text"
              id="city_mandarin"
              name="city_mandarin"
              value={formData.city_mandarin}
              onChange={handleInputChange}
              placeholder="Enter city in Mandarin"
            />
          </div>

          <div className="form-group">
            <label htmlFor="county">County (English) *</label>
            <input
              type="text"
              id="county"
              name="county"
              value={formData.county}
              onChange={handleInputChange}
              required
              placeholder="Enter county in English"
            />
          </div>

          <div className="form-group">
            <label htmlFor="county_mandarin">County (Mandarin)</label>
            <input
              type="text"
              id="county_mandarin"
              name="county_mandarin"
              value={formData.county_mandarin}
              onChange={handleInputChange}
              placeholder="Enter county in Mandarin"
            />
          </div>

          <div className="form-group">
            <label htmlFor="postal_code">Postal Code *</label>
            <input
              type="text"
              id="postal_code"
              name="postal_code"
              value={formData.postal_code}
              onChange={handleInputChange}
              required
              placeholder="Enter postal code"
            />
          </div>

          <div className="form-group">
            <label htmlFor="country">Country (English) *</label>
            <input
              type="text"
              id="country"
              name="country"
              value={formData.country}
              onChange={handleInputChange}
              required
              placeholder="Enter country in English"
            />
          </div>

          <div className="form-group">
            <label htmlFor="country_mandarin">Country (Mandarin)</label>
            <input
              type="text"
              id="country_mandarin"
              name="country_mandarin"
              value={formData.country_mandarin}
              onChange={handleInputChange}
              placeholder="Enter country in Mandarin"
            />
          </div>

          <div className="form-group">
            <label htmlFor="latitude">Latitude</label>
            <input
              type="number"
              id="latitude"
              name="latitude"
              value={formData.latitude}
              onChange={handleInputChange}
              step="any"
              placeholder="Enter latitude"
            />
          </div>

          <div className="form-group">
            <label htmlFor="longitude">Longitude</label>
            <input
              type="number"
              id="longitude"
              name="longitude"
              value={formData.longitude}
              onChange={handleInputChange}
              step="any"
              placeholder="Enter longitude"
            />
          </div>
        </div>

        <div className="form-section">
          <h3>Social Media</h3>

          <div className="form-group">
            <label htmlFor="facebook">Facebook URL</label>
            <input
              type="url"
              id="facebook"
              name="facebook"
              value={formData.facebook}
              onChange={handleInputChange}
              placeholder="Enter Facebook URL"
            />
          </div>

          <div className="form-group">
            <label htmlFor="instagram">Instagram URL</label>
            <input
              type="url"
              id="instagram"
              name="instagram"
              value={formData.instagram}
              onChange={handleInputChange}
              placeholder="Enter Instagram URL"
            />
          </div>

          <div className="form-group">
            <label htmlFor="whatsapp">WhatsApp Number</label>
            <input
              type="tel"
              id="whatsapp"
              name="whatsapp"
              value={formData.whatsapp}
              onChange={handleInputChange}
              placeholder="Enter WhatsApp number"
            />
          </div>

          <div className="form-group">
            <label htmlFor="line">Line ID</label>
            <input
              type="text"
              id="line"
              name="line"
              value={formData.line}
              onChange={handleInputChange}
              placeholder="Enter Line ID"
            />
          </div>
        </div>

        <div className="form-actions">
          <button
            type="button"
            className="cancel-button"
            onClick={() => navigate("/dashboard/contact-details")}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="submit-button"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Updating..." : "Update Contact Details"}
          </button>
        </div>
      </form>

      {isSubmitting && (
        <LoadingSpinner text="Updating contact details..." overlay />
      )}

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
        input[type="email"],
        input[type="tel"],
        input[type="url"],
        input[type="number"] {
          padding: 10px 12px;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 14px;
          width: 100%;
          max-width: 100%;
          box-sizing: border-box;
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

export default EditContactDetailsPage;
