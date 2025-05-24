import React, { useState, useEffect } from "react";
import { api } from "../../config/api";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import LoadingSpinner from "../../components/UI/LoadingSpinner";
import "./EditPages.css";

function EditOrderPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [orderData, setOrderData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [formData, setFormData] = useState({
    items: [],
  });

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

        setFormData({
          items:
            orderData.items?.map((item) => ({
              id: item.id,
              fabric: item.fabric?.id || item.fabric_id,
              fabric_name:
                item.fabric?.title ||
                `Fabric #${item.fabric?.id || item.fabric_id}`,
              color: item.color,
              quantity: item.quantity,
              // Find matching color image
              imageUrl: getMatchingColorImage(item.fabric, item.color),
            })) || [],
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

  // Handle quantity change for items
  const handleQuantityChange = (index, value) => {
    const newQuantity = parseInt(value) || 0;
    if (newQuantity < 1) return;

    setFormData((prev) => {
      const updatedItems = [...prev.items];
      updatedItems[index] = {
        ...updatedItems[index],
        quantity: newQuantity,
      };
      return {
        ...prev,
        items: updatedItems,
      };
    });
  };

  // Remove item from order
  const handleRemoveItem = (index) => {
    if (formData.items.length <= 1) {
      toast.error("Order must have at least one item");
      return;
    }

    setFormData((prev) => {
      const updatedItems = prev.items.filter((_, i) => i !== index);
      return {
        ...prev,
        items: updatedItems,
      };
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage("");

    try {
      // Prepare payload for order update according to required structure
      const payload = {
        user_id: orderData.user?.id,
        items: formData.items.map((item) => ({
          fabric: item.fabric, // Changed from fabric_id to fabric
          color: item.color,
          quantity: item.quantity,
        })),
      };

      // Update the order
      console.log("Payload:", payload);
      await api.patch(`/orders/${id}/`, payload);

      toast.success("Order updated successfully");
      navigate("/dashboard/orders");
    } catch (error) {
      console.error("Error updating order:", error);
      setErrorMessage(
        error.response?.data?.message ||
          Object.values(error.response?.data || {})
            .flat()
            .join(", ") ||
          "Failed to update order"
      );
      toast.error("Failed to update order");
    } finally {
      setIsSubmitting(false);
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
          <p>Loading order data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-content-card edit-page-container">
      <div className="edit-page-header">
        <button
          className="back-button"
          onClick={() => navigate("/dashboard/orders")}
        >
          ← 返回訂單
        </button>
      </div>

      <h2 className="edit-heading">編輯訂單</h2>

      {errorMessage && <div className="error-message">{errorMessage}</div>}

      <div className="order-summary">
        <div className="order-summary-item">
          <span>Order Number:</span>
          <strong>{orderData?.order_id}</strong>
        </div>
        <div className="order-summary-item">
          <span>Order Date:</span>
          <strong>
            {orderData?.order_date
              ? new Date(orderData.order_date).toLocaleDateString()
              : "Unknown"}
          </strong>
        </div>
        <div className="order-summary-item">
          <span>Customer:</span>
          <strong>
            {orderData?.user?.name || orderData?.user?.username || "Unknown"}
          </strong>
        </div>
        <div className="order-summary-item">
          <span>Company:</span>
          <strong>{orderData?.user?.company_name || "Not specified"}</strong>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="edit-form">
        {formData.items && formData.items.length > 0 && (
          <div className="form-section">
            <h3>Order Items</h3>
            <p className="order-edit-note">
              You can edit quantities or remove items from this order.
            </p>

            {formData.items.length === 0 ? (
              <div className="no-items">No items in this order</div>
            ) : (
              <div className="order-items-wrapper">
                <div className="order-items">
                  <div className="order-items-scroll-container">
                    <div className="items-header">
                      <div className="item-header-cell">Product</div>
                      <div className="item-header-cell">Image</div>
                      <div className="item-header-cell">Color</div>
                      <div className="item-header-cell">Quantity</div>
                      <div className="item-header-cell">Action</div>
                    </div>

                    <div className="order-items-container">
                      {formData.items.map((item, index) => (
                        <div key={index} className="item-row">
                          <div className="item-cell">{item.fabric_name}</div>
                          <div className="item-cell">
                            {item.imageUrl ? (
                              <img
                                src={item.imageUrl}
                                alt={`${item.fabric_name} - ${item.color}`}
                                className="item-image"
                                onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.src =
                                    "https://via.placeholder.com/80?text=No+Image";
                                }}
                              />
                            ) : (
                              <div className="no-image">No Image</div>
                            )}
                          </div>
                          <div className="item-cell">{item.color}</div>
                          <div className="item-cell">
                            <div className="quantity-control">
                              <button
                                type="button"
                                className="quantity-btn"
                                onClick={() =>
                                  handleQuantityChange(
                                    index,
                                    (item.quantity || 0) - 1
                                  )
                                }
                              >
                                -
                              </button>
                              <input
                                type="number"
                                value={item.quantity || 0}
                                onChange={(e) =>
                                  handleQuantityChange(index, e.target.value)
                                }
                                min="1"
                                className="quantity-input"
                              />
                              <button
                                type="button"
                                className="quantity-btn"
                                onClick={() =>
                                  handleQuantityChange(
                                    index,
                                    (item.quantity || 0) + 1
                                  )
                                }
                              >
                                +
                              </button>
                            </div>
                          </div>
                          <div className="item-cell">
                            <button
                              type="button"
                              className="remove-item-btn"
                              onClick={() => handleRemoveItem(index)}
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        <div className="form-actions">
          <button
            type="button"
            className="cancel-button"
            onClick={() => navigate("/dashboard/orders")}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="submit-button"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Updating..." : "Update Order"}
          </button>
        </div>
      </form>

      {isSubmitting && <LoadingSpinner text="Updating order..." overlay />}

      <style jsx>{`
        .edit-page-container {
          max-width: 100%;
          width: 100%;
          overflow-x: hidden !important;
          box-sizing: border-box;
          padding: 24px;
        }

        .edit-heading {
          color: #4285f4;
          margin-bottom: 24px;
        }

        .order-edit-note {
          margin-top: -8px;
          margin-bottom: 16px;
          color: #666;
          font-style: italic;
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
          grid-template-columns: 2fr 1fr 1fr 1fr 0.8fr;
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
          grid-template-columns: 2fr 1fr 1fr 1fr 0.8fr;
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

        .quantity-control {
          display: flex;
          align-items: center;
          width: 100px;
        }

        .quantity-btn {
          width: 30px;
          height: 30px;
          background-color: #f1f1f1;
          border: 1px solid #ddd;
          border-radius: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          font-size: 16px;
          font-weight: bold;
        }

        .quantity-input {
          width: 40px;
          height: 30px;
          border: 1px solid #ddd;
          text-align: center;
          margin: 0 4px;
          padding: 0;
        }

        .remove-item-btn {
          background-color: transparent;
          color: #d32f2f;
          border: none;
          padding: 4px;
          font-size: 12px;
          cursor: pointer;
          text-decoration: underline;
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

        .submit-button:hover {
          background-color: #3367d6;
        }

        .submit-button:disabled {
          background-color: #a8c7fa;
          cursor: not-allowed;
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
            min-width: 700px;
          }
        }
      `}</style>
    </div>
  );
}

export default EditOrderPage;
