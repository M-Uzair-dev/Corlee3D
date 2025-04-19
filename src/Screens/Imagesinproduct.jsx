import React, { useState } from "react";
import { normalizeCloudFrontUrl } from "../util";

const ImageWithFallback = ({ src, alt, onClick, className }) => {
  const [error, setError] = useState(false);
  const [loaded, setLoaded] = useState(false);

  // Try to normalize the URL
  const normalizedSrc = (() => {
    try {
      return normalizeCloudFrontUrl(src);
    } catch (error) {
      console.error("Error normalizing image URL:", error);
      return src;
    }
  })();

  return (
    <div className={className} onClick={onClick}>
      <img
        src={normalizedSrc}
        alt={alt}
        onError={(e) => {
          console.error(`Failed to load image: ${normalizedSrc}`);
          e.target.src = "/placeholder-image.jpg";
          setError(true);
        }}
        onLoad={() => setLoaded(true)}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          cursor: "pointer",
          opacity: loaded ? 1 : 0,
          transition: "opacity 0.3s ease-in-out",
        }}
      />
      {!loaded && !error && (
        <div className="image-loading">
          <div className="loading-spinner"></div>
        </div>
      )}
    </div>
  );
};

const Imagesinproduct = ({ currentImages, setCurrentImages }) => {
  return (
    <div className="imagesinproductdiv">
      <div className="verticalimagesinproduct">
        <ImageWithFallback
          src={currentImages.aux_image1_url}
          alt="Auxiliary Image 1"
          className="image1inproductdivverticalimages"
          onClick={() => {
            const curr = currentImages.primary_image_url;
            const previous = currentImages.aux_image1_url;
            setCurrentImages((prev) => ({
              ...prev,
              primary_image_url: previous,
              aux_image1_url: curr,
            }));
          }}
        />
        <ImageWithFallback
          src={currentImages.aux_image2_url}
          alt="Auxiliary Image 2"
          className="image2inproductdivverticalimages"
          onClick={() => {
            const curr = currentImages.primary_image_url;
            const previous = currentImages.aux_image2_url;
            setCurrentImages((prev) => ({
              ...prev,
              primary_image_url: previous,
              aux_image2_url: curr,
            }));
          }}
        />
        <ImageWithFallback
          src={currentImages.aux_image3_url}
          alt="Auxiliary Image 3"
          className="image3inproductdivverticalimages"
          onClick={() => {
            const curr = currentImages.primary_image_url;
            const previous = currentImages.aux_image3_url;
            setCurrentImages((prev) => ({
              ...prev,
              primary_image_url: previous,
              aux_image3_url: curr,
            }));
          }}
        />
      </div>
      <ImageWithFallback
        src={currentImages.primary_image_url}
        alt="Primary Image"
        className="bigimage"
      />

      <style jsx>{`
        .imagesinproductdiv {
          display: flex;
          gap: 1rem;
          width: 100%;
          height: 100%;
        }

        .verticalimagesinproduct {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          width: 100px;
        }

        .image1inproductdivverticalimages,
        .image2inproductdivverticalimages,
        .image3inproductdivverticalimages {
          width: 100%;
          height: 100px;
          position: relative;
          border-radius: 4px;
          overflow: hidden;
          background: #f5f5f5;
        }

        .bigimage {
          flex: 1;
          height: 500px;
          position: relative;
          border-radius: 4px;
          overflow: hidden;
          background: #f5f5f5;
        }

        .image-loading {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #f5f5f5;
        }

        .loading-spinner {
          width: 30px;
          height: 30px;
          border: 3px solid #f3f3f3;
          border-top: 3px solid #3498db;
          border-radius: 50%;
          animation: spin 1s linear infinite;
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

export default Imagesinproduct;
