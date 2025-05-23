import React, { useState, useEffect } from "react";
import { api } from "../../config/api";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import LoadingSpinner from "../../components/UI/LoadingSpinner";
import "./ViewPages.css";

function ViewOrderPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [orderData, setOrderData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  // Fetch order data
  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setIsLoading(true);
        const response = await api.get(`/orders/${id}/`);
        console.log("Order response:", response.data);
        const orderData = response.data;

        setOrderData({
          id: orderData.id,
          order_id: `ORDER-${orderData.id}`,
          order_date: orderData.order_date,
          user: orderData.user || {},
          items: orderData.items || [],
        });
      } catch (error) {
        console.error("Error fetching order:", error);
        toast.error("Failed to load order data");
        setErrorMessage("Could not fetch order data. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  // Function to get the matching color image URL
  const getMatchingColorImage = (fabric, itemColor) => {
    if (!fabric || !fabric.color_images) return null;

    // Find color image that matches the item color (case insensitive)
    const matchingColorImage = fabric.color_images.find(
      (img) => img.color && img.color.toLowerCase() === itemColor.toLowerCase()
    );

    // Return the primary image URL if found
    return matchingColorImage?.primary_image_url || null;
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
          <p>正在載入訂單資料...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-content-card view-page-container">
      <div className="view-page-header">
        <button
          className="back-button"
          onClick={() => navigate("/dashboard/orders")}
        >
          ← 返回訂單
        </button>
        <button
          className="edit-button"
          onClick={() => navigate(`/dashboard/orders/edit/${id}`)}
        >
          編輯訂單
        </button>
      </div>

      <h2 className="view-heading">訂單詳情</h2>

      {errorMessage && <div className="error-message">{errorMessage}</div>}

      <div className="order-summary">
        <div className="order-summary-item">
          <span>訂單編號：</span>
          <strong>{orderData?.order_id}</strong>
        </div>
        <div className="order-summary-item">
          <span>訂單日期：</span>
          <strong>
            {orderData?.order_date
              ? new Date(orderData.order_date).toLocaleDateString()
              : "未知"}
          </strong>
        </div>
      </div>

      {orderData.user && (
        <div className="view-section">
          <h3>客戶資訊</h3>
          <div className="customer-details">
            <div className="detail-row">
              <div className="detail-item">
                <span>姓名：</span>
                <p>
                  {orderData.user.name || orderData.user.username || "未提供"}
                </p>
              </div>
              <div className="detail-item">
                <span>公司：</span>
                <p>{orderData.user.company_name || "未提供"}</p>
              </div>
            </div>
            <div className="detail-row">
              <div className="detail-item">
                <span>信箱：</span>
                <p>{orderData.user.email || "未提供"}</p>
              </div>
              <div className="detail-item">
                <span>電話：</span>
                <p>
                  {orderData.user.phone ||
                    orderData.user.mobile_phone ||
                    "未提供"}
                </p>
              </div>
            </div>
            <div className="detail-item address">
              <span>地址：</span>
              <p>{orderData.user.address || "未提供"}</p>
            </div>
          </div>
        </div>
      )}

      {orderData.items && orderData.items.length > 0 && (
        <div className="view-section">
          <h3>訂單項目</h3>

          <div className="order-items-wrapper">
            <div className="order-items">
              <div className="order-items-scroll-container">
                <div className="items-header">
                  <div className="item-header-cell">產品</div>
                  <div className="item-header-cell">圖片</div>
                  <div className="item-header-cell">顏色</div>
                  <div className="item-header-cell">數量</div>
                </div>

                <div className="order-items-container">
                  {orderData.items.map((item, index) => {
                    const productName =
                      item.fabric?.title ||
                      item.fabric_name ||
                      `布料 #${item.fabric?.id || item.fabric_id}`;

                    const imageUrl = getMatchingColorImage(
                      item.fabric,
                      item.color
                    );

                    return (
                      <div key={index} className="item-row">
                        <div className="item-cell">{productName}</div>
                        <div className="item-cell">
                          {imageUrl ? (
                            <img
                              src={imageUrl}
                              alt={`${productName} - ${item.color}`}
                              className="item-image"
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src =
                                  "https://via.placeholder.com/80?text=無圖片";
                              }}
                            />
                          ) : (
                            <div className="no-image">無圖片</div>
                          )}
                        </div>
                        <div className="item-cell">{item.color}</div>
                        <div className="item-cell">{item.quantity}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="form-actions">
        <button
          type="button"
          className="secondary-button"
          onClick={() => navigate("/dashboard/orders")}
        >
          返回訂單
        </button>
        <button
          type="button"
          className="primary-button"
          onClick={() => navigate(`/dashboard/orders/edit/${id}`)}
        >
          編輯訂單
        </button>
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

        .order-summary {
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

        .order-summary-item {
          display: flex;
          flex-direction: column;
          min-width: 150px;
        }

        .order-summary-item span {
          font-size: 14px;
          color: #666;
          margin-bottom: 4px;
        }

        .order-summary-item strong {
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

        .customer-details {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .detail-row {
          display: flex;
          gap: 20px;
        }

        .detail-item {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .detail-item.address {
          flex: 2;
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

        .no-items {
          padding: 20px;
          text-align: center;
          background-color: #f5f5f5;
          border-radius: 4px;
          color: #666;
        }

        .order-items-wrapper {
          width: 100%;
          max-width: 100%;
          overflow: hidden;
          box-sizing: border-box;
        }

        .order-items {
          border: 1px solid #e0e0e0;
          border-radius: 8px;
          width: 100%;
          overflow: hidden;
          box-sizing: border-box;
        }

        .order-items-scroll-container {
          width: 100%;
          box-sizing: border-box;
        }

        .order-items-container {
          width: 100%;
          max-width: 100%;
          box-sizing: border-box;
        }

        .items-header {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr 1fr;
          background-color: #eef1f5;
          padding: 12px 16px;
          font-weight: 500;
          color: #333;
          border-bottom: 1px solid #e0e0e0;
        }

        .item-header-cell {
          font-size: 14px;
        }

        .item-row {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr 1fr;
          padding: 12px 16px;
          border-bottom: 1px solid #e0e0e0;
          align-items: center;
        }

        .item-row:last-child {
          border-bottom: none;
        }

        .item-cell {
          font-size: 14px;
          color: #333;
          display: flex;
          align-items: center;
          padding-right: 8px;
          min-width: 0;
          word-break: break-word;
        }

        .item-image {
          width: 80px;
          height: 80px;
          object-fit: cover;
          border-radius: 4px;
          border: 1px solid #ddd;
        }

        .no-image {
          width: 80px;
          height: 80px;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: #f5f5f5;
          border-radius: 4px;
          border: 1px solid #ddd;
          color: #999;
          font-size: 12px;
        }

        .form-actions {
          display: flex;
          justify-content: flex-end;
          gap: 16px;
          margin-top: 24px;
        }

        .secondary-button {
          background-color: #f1f1f1;
          color: #333;
          border: none;
          border-radius: 4px;
          padding: 10px 24px;
          font-size: 14px;
          cursor: pointer;
          transition: background-color 0.2s;
        }

        .secondary-button:hover {
          background-color: #e3e3e3;
        }

        .primary-button {
          background-color: #4285f4;
          color: white;
          border: none;
          border-radius: 4px;
          padding: 10px 24px;
          font-size: 14px;
          cursor: pointer;
          transition: background-color 0.2s;
        }

        .primary-button:hover {
          background-color: #3367d6;
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

        @media (max-width: 992px) {
          .order-items-scroll-container {
            overflow-x: auto;
            display: block;
            width: 100%;
            -webkit-overflow-scrolling: touch;
          }

          .items-header,
          .item-row {
            width: max-content;
            min-width: 600px;
          }

          .detail-row {
            flex-direction: column;
            gap: 16px;
          }
        }
      `}</style>
    </div>
  );
}

export default ViewOrderPage;
