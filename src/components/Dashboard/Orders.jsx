import React, { useState, useEffect } from "react";
import { FaShoppingCart, FaEye, FaEdit, FaTrash } from "react-icons/fa";
import PageContent from "./PageContent";
import { api } from "../../config/api";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import DeleteModal from "../UI/DeleteModal";

const Orders = () => {
  const navigate = useNavigate();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState(null);
  const [ordersData, setOrdersData] = useState({
    fields: {
      id: "number",
      order_date: "date",
      customer: "string",
      items_count: "number",
      actions: "actions",
    },
    data: [],
    isLoading: true,
    options: {
      edit: false,
      delete: false,
      view: false, // We'll handle custom actions
    },
  });

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setOrdersData((prev) => ({ ...prev, isLoading: true }));
      // Fetch orders from the orders endpoint
      const response = await api.get("/orders/");
      console.log("Orders response:", response.data);

      // Transform API response to match table structure
      const transformedData =
        response.data.results?.map((order) => {
          // Get total items count
          const itemsCount = order.items?.length || 0;

          // Format date
          const orderDate = new Date(order.order_date).toLocaleDateString();

          // Get customer info
          const customer = order.user
            ? `${order.user.name || order.user.username} (${
                order.user.company_name || "No Company"
              })`
            : "Unknown Customer";

          return {
            id: order.id,
            order_id: `ORDER-${order.id}`,
            order_date: orderDate,
            customer: customer,
            items_count: itemsCount,
            actions: (
              <div className="action-cell">
                <button
                  className="action-btn view"
                  onClick={() => handleViewOrder(order.id)}
                  title="View Order"
                >
                  <FaEye />
                </button>
                <button
                  className="action-btn edit"
                  onClick={() => handleEditOrder(order.id)}
                  title="Edit Order"
                >
                  <FaEdit />
                </button>
                <button
                  className="action-btn delete"
                  onClick={() => handleShowDeleteModal(order.id)}
                  title="Delete Order"
                >
                  <FaTrash />
                </button>
              </div>
            ),
          };
        }) || [];

      setOrdersData((prev) => ({
        ...prev,
        data: transformedData,
        isLoading: false,
      }));
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error("Failed to load orders");
      setOrdersData((prev) => ({ ...prev, isLoading: false }));
    }
  };

  const handleViewOrder = (id) => {
    navigate(`/dashboard/orders/${id}`);
  };

  const handleEditOrder = (id) => {
    navigate(`/dashboard/orders/edit/${id}`);
  };

  const handleShowDeleteModal = (id) => {
    setOrderToDelete(id);
    setShowDeleteModal(true);
  };

  const handleDeleteOrder = async (id) => {
    try {
      // The API call is now handled by DeleteModal component
      // We just need to refresh the orders list after successful deletion
      fetchOrders(); // Refresh orders list
    } catch (error) {
      console.error("Error handling order deletion:", error);
      toast.error("Failed to complete order deletion");
    }
  };

  return (
    <>
      <PageContent
        title="Orders"
        icon={<FaShoppingCart />}
        data={ordersData}
        page="order"
        onDelete={handleDeleteOrder}
        onRefresh={fetchOrders}
      />

      <DeleteModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        itemId={orderToDelete}
        itemType="order"
        onDeleteSuccess={handleDeleteOrder}
      />
    </>
  );
};

export default Orders;
