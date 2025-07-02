import React, { memo, useState, useCallback } from "react";
import "./style.css";

const GoogleMap = memo(() => {
  const [mapLoaded, setMapLoaded] = useState(false);

  const handleMapLoad = useCallback(() => {
    setMapLoaded(true);
  }, []);

  // Address: No. 489, Section 3, Jinma Rd, Changhua, Taiwan
  const address = "No. 489, Section 3, Jinma Rd, Changhua, Taiwan";
  const encodedAddress = encodeURIComponent(address);
  
  // Simple Google Maps embed URL (no API key required)
  const mapSrc = `https://www.google.com/maps?q=${encodedAddress}&output=embed`;

  return (
    <div className="map-container">
      <div className="map-wrapper">
        {!mapLoaded && (
          <div className="map-loading">
            <div className="loading-spinner"></div>
            <p>載入地圖中...</p>
          </div>
        )}
        <iframe
          src={mapSrc}
          className={`google-map ${mapLoaded ? 'loaded' : ''}`}
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="公司位置地圖 - No. 489, Section 3, Jinma Rd, Changhua, Taiwan"
          onLoad={handleMapLoad}
        />
        <div className="map-overlay">
          <div className="address-info">
            <h4>聯絡地址</h4>
            <p>{address}</p>
          </div>
        </div>
      </div>
    </div>
  );
});

function ImageContainer() {
  return (
    <div className="vertical-spacer">
      <GoogleMap />
    </div>
  );
}

export default memo(ImageContainer);
