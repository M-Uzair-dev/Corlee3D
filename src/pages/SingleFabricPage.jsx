import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { api } from "../config/api";
import { handleApiError, handleApiSuccess } from "../util/errorHandler";
import { normalizeCloudFrontUrl } from "../util";
import FabricModel from "../Screens/model";

const SingleFabricPage = () => {
  const { id } = useParams();
  const [fabric, setFabric] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userData, setUserData] = useState(null);
  const [userError, setUserError] = useState(null);

  useEffect(() => {
    fetchFabricData();
  }, [id]);

  const fetchFabricData = async () => {
    try {
      setLoading(true);
      setError(null);
      setUserError(null);

      // Fetch fabric data
      const fabricResponse = await api.get(`/fabrics/${id}/`);
      const fabricData = fabricResponse.data;

      // Normalize image URLs
      const normalizedImages = fabricData.images.map((image) => ({
        ...image,
        image: normalizeCloudFrontUrl(image.image),
      }));

      setFabric({
        ...fabricData,
        images: normalizedImages,
      });

      // Try to fetch user data, but don't block the page if it fails
      try {
        const userResponse = await api.get(`/user/${fabricData.user}/`);
        setUserData(userResponse.data);
      } catch (userError) {
        console.warn("Failed to fetch user data:", userError);
        setUserError("User information not available");
        // Don't set this as a critical error
      }

      setLoading(false);
    } catch (error) {
      console.error("Error fetching fabric data:", error);
      setError("Failed to load fabric details");
      setLoading(false);
      handleApiError(error, "Failed to load fabric details");
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading fabric details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <h2>Error Loading Fabric</h2>
        <div className="error-message">
          <p>{error}</p>
          <button onClick={fetchFabricData} className="retry-button">
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!fabric) {
    return (
      <div className="error-container">
        <h2>Fabric Not Found</h2>
        <p>The requested fabric could not be found.</p>
      </div>
    );
  }

  return (
    <div className="fabric-details-container">
      <div className="fabric-model-container">
        <FabricModel
          modelUrl={fabric.model_url}
          textureUrl={fabric.texture_url}
          scale={1}
          loadingText="Loading 3D model..."
        />
      </div>

      <div className="fabric-info">
        <h1>{fabric.name}</h1>
        <p className="description">{fabric.description}</p>

        {userError ? (
          <p className="user-error">User information not available</p>
        ) : (
          userData && (
            <div className="user-info">
              <h3>Created by: {userData.username}</h3>
              <p>Email: {userData.email}</p>
            </div>
          )
        )}

        <div className="image-gallery">
          {fabric.images.map((image, index) => (
            <div key={index} className="image-container">
              <img
                src={image.image}
                alt={`${fabric.name} - Image ${index + 1}`}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "/placeholder-image.jpg";
                }}
              />
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .fabric-details-container {
          display: flex;
          flex-direction: column;
          gap: 2rem;
          padding: 2rem;
        }

        .fabric-model-container {
          width: 100%;
          height: 500px;
          background: #f5f5f5;
          border-radius: 8px;
          overflow: hidden;
        }

        .fabric-info {
          padding: 1rem;
        }

        .description {
          margin: 1rem 0;
          color: #666;
        }

        .user-info {
          margin: 1rem 0;
          padding: 1rem;
          background: #f5f5f5;
          border-radius: 4px;
        }

        .user-error {
          color: #ff5252;
          font-style: italic;
        }

        .image-gallery {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 1rem;
          margin-top: 2rem;
        }

        .image-container {
          position: relative;
          padding-top: 100%;
          background: #f5f5f5;
          border-radius: 4px;
          overflow: hidden;
        }

        .image-container img {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .loading-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 400px;
        }

        .loading-spinner {
          border: 4px solid #f3f3f3;
          border-top: 4px solid #3498db;
          border-radius: 50%;
          width: 40px;
          height: 40px;
          animation: spin 1s linear infinite;
        }

        .error-container {
          padding: 2rem;
          text-align: center;
        }

        .error-message {
          margin-top: 1rem;
          padding: 1rem;
          background-color: #ffebee;
          border-radius: 4px;
          color: #c62828;
        }

        .retry-button {
          margin-top: 1rem;
          padding: 0.5rem 1rem;
          background-color: #2196f3;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }

        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
};

export default SingleFabricPage;
