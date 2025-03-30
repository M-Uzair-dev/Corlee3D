import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../../config/api";
import { toast } from "sonner";
import LoadingSpinner from "../../components/UI/LoadingSpinner";
import "./ViewPages.css";

function ViewContactRequestPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [requestData, setRequestData] = useState(null);

  useEffect(() => {
    fetchRequestData();
  }, [id]);

  const fetchRequestData = async () => {
    try {
      setIsLoading(true);
      const response = await api.get(`/contact-requests/${id}/`);
      setRequestData(response.data);
      console.log("response.data", response.data);
    } catch (error) {
      console.error("Error fetching contact request:", error);
      toast.error("Failed to load contact request details");
      setErrorMessage(
        "Could not fetch contact request data. Please try again later."
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div
        className="dashboard-content-card"
        style={{
          minHeight: "70vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
        }}
      >
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading contact request details...</p>
        </div>
      </div>
    );
  }

  if (!requestData) {
    return (
      <div className="dashboard-content-card">
        <div className="error-message">Contact request not found</div>
      </div>
    );
  }

  return (
    <div className="dashboard-content-card view-page-container">
      <div className="view-page-header">
        <button
          className="back-button"
          onClick={() => navigate("/dashboard/contact-requests")}
        >
          ← Back to Contact Requests
        </button>
        <button
          className="edit-button"
          onClick={() => navigate(`/dashboard/contact-requests/edit/${id}`)}
        >
          Edit Request
        </button>
      </div>

      <h2 className="view-heading">Contact Request Details</h2>

      {errorMessage && <div className="error-message">{errorMessage}</div>}

      <div className="request-summary">
        <div className="request-summary-item">
          <span>Request Number:</span>
          <strong>{requestData.request_number}</strong>
        </div>
        <div className="request-summary-item">
          <span>Request Type:</span>
          <strong>
            {requestData.request_type === "general"
              ? "General Inquiry"
              : requestData.request_type === "product"
              ? "Product Inquiry"
              : requestData.request_type === "product_request"
              ? "Product Request"
              : "Other"}
          </strong>
        </div>
        <div className="request-summary-item">
          <span>Status:</span>
          <strong>{requestData.status}</strong>
        </div>
        <div className="request-summary-item">
          <span>Created At:</span>
          <strong>{new Date(requestData.created_at).toLocaleString()}</strong>
        </div>
      </div>

      <div className="view-section">
        <h3>Request Information</h3>
        <div className="detail-row">
          <div className="detail-item">
            <span>Subject:</span>
            <p>{requestData.subject}</p>
          </div>
          <div className="detail-item">
            <span>Message:</span>
            <p>{requestData.message}</p>
          </div>
        </div>
      </div>

      {requestData.request_type === "product" && requestData.related_fabric && (
        <div className="view-section">
          <h3>Product Information</h3>
          <div className="product-details">
            <div className="detail-row">
              <div className="detail-item">
                <span>Product Title:</span>
                <p>{requestData.related_fabric.title}</p>
              </div>
              <div className="detail-item">
                <span>Item Code:</span>
                <p>{requestData.related_fabric.item_code}</p>
              </div>
            </div>
            <div className="detail-row">
              <div className="detail-item">
                <span>Category:</span>
                <p>{requestData.related_fabric.product_category_name}</p>
              </div>
              <div className="detail-item">
                <span>Composition:</span>
                <p>{requestData.related_fabric.composition}</p>
              </div>
            </div>
            <div className="detail-row">
              <div className="detail-item">
                <span>Weight:</span>
                <p>{requestData.related_fabric.weight}</p>
              </div>
              <div className="detail-item">
                <span>Finish:</span>
                <p>{requestData.related_fabric.finish}</p>
              </div>
            </div>
            {requestData.related_fabric.color_images &&
              requestData.related_fabric.color_images.length > 0 && (
                <div className="color-images">
                  <span>Color Images:</span>
                  <div className="color-images-grid">
                    {requestData.related_fabric.color_images.map(
                      (colorImage, index) => (
                        <div key={index} className="color-image-item">
                          <img
                            src={colorImage.primary_image_url}
                            alt={`Color ${index + 1}`}
                            className="color-image"
                          />
                        </div>
                      )
                    )}
                  </div>
                </div>
              )}
          </div>
        </div>
      )}

      <div className="view-section">
        <h3>Contact Information</h3>
        <div className="view-grid">
          <div className="view-field">
            <label>Name</label>
            <div className="input-style">
              {requestData.name || "Not specified"}
            </div>
          </div>
          <div className="view-field">
            <label>Company Name</label>
            <div className="input-style">
              {requestData.company_name || "Not specified"}
            </div>
          </div>
          <div className="view-field">
            <label>Email</label>
            <div className="input-style">
              {requestData.email || "Not specified"}
            </div>
          </div>
          <div className="view-field">
            <label>Phone</label>
            <div className="input-style">
              {requestData.phone || "Not specified"}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .view-page-container {
          max-width: 100%;
          width: 100%;
          overflow-x: hidden !important;
          box-sizing: border-box;
          padding: 24px;
        }

        .view-heading {
          color: #4285f4;
          margin-bottom: 24px;
        }

        .view-page-header {
          display: flex;
          justify-content: space-between;
          margin-bottom: 24px;
          width: 100%;
        }

        .back-button,
        .edit-button {
          padding: 8px 16px;
          border-radius: 4px;
          cursor: pointer;
          font-size: 14px;
          transition: background-color 0.2s;
          border: none;
        }

        .back-button {
          background-color: #f1f1f1;
          color: #333;
        }

        .back-button:hover {
          background-color: #e3e3e3;
        }

        .edit-button {
          background-color: #4285f4;
          color: white;
        }

        .edit-button:hover {
          background-color: #3367d6;
        }

        .request-summary {
          display: flex;
          flex-wrap: wrap;
          gap: 20px;
          background-color: #f1f3f4;
          padding: 16px;
          border-radius: 8px;
          margin-bottom: 24px;
          width: 100%;
          box-sizing: border-box;
        }

        .request-summary-item {
          display: flex;
          flex-direction: column;
          min-width: 150px;
        }

        .request-summary-item span {
          font-size: 14px;
          color: #666;
          margin-bottom: 4px;
        }

        .request-summary-item strong {
          font-size: 16px;
          color: #333;
        }

        .view-section {
          background-color: #f9f9f9;
          border-radius: 8px;
          padding: 20px;
          margin-bottom: 20px;
          width: 100%;
          max-width: 100%;
          box-sizing: border-box;
        }

        .view-section h3 {
          margin-top: 0;
          margin-bottom: 16px;
          color: #333;
          font-size: 18px;
          font-weight: 500;
        }

        .detail-row {
          display: flex;
          gap: 20px;
          margin-bottom: 16px;
        }

        .detail-item {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .detail-item span {
          font-weight: 500;
          color: #555;
        }

        .detail-item p {
          margin: 0;
          padding: 12px;
          background-color: #fff;
          border-radius: 4px;
          border: 1px solid #e0e0e0;
        }

        .product-details {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .color-images {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .color-images span {
          font-weight: 500;
          color: #555;
        }

        .color-images-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
          gap: 16px;
        }

        .color-image-item {
          aspect-ratio: 1;
          border-radius: 4px;
          overflow: hidden;
        }

        .color-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .error-message {
          background-color: #fdeded;
          color: #d32f2f;
          padding: 12px 16px;
          border-radius: 4px;
          margin-bottom: 16px;
          font-size: 14px;
        }

        .loading-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: 20px;
          width: 100%;
          gap: 16px;
        }

        .loading-spinner {
          width: 50px;
          height: 50px;
          border: 4px solid #f3f3f3;
          border-top: 4px solid #4285f4;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin: 0 auto;
        }

        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }

        @media (max-width: 768px) {
          .view-page-container {
            padding: 16px;
          }

          .view-section {
            padding: 16px;
          }

          .detail-row {
            flex-direction: column;
            gap: 16px;
          }

          .color-images-grid {
            grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
            gap: 12px;
          }
        }

        .input-style {
          padding: 10px 12px;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 14px;
          background-color: #f5f5f5;
          color: #333;
          min-height: 38px;
          display: flex;
          align-items: center;
        }

        .view-field label {
          font-weight: 500;
          color: #555;
          margin-bottom: 8px;
          display: block;
        }

        .view-field {
          margin-bottom: 16px;
        }
      `}</style>
    </div>
  );
}

export default ViewContactRequestPage;
