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
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [ordersData, setOrdersData] = useState({
    fields: {
      order_number: "Order Number",
      customer_name: "Customer Name",
      total_amount: "Total Amount",
      status: "Status",
      created_at: "Order Date",
    },
    data: [],
    isLoading: true,
    options: {
      create: true,
      edit: true,
      delete: true,
      view: true,
    },
  });

  useEffect(() => {
    fetchOrders();
  }, [currentPage, pageSize]);

  const fetchOrders = async () => {
    try {
      setOrdersData((prev) => ({ ...prev, isLoading: true }));
      const response = await api.get(
        `/orders/?page=${currentPage}&page_size=${pageSize}`
      );
      console.log("Orders response:", response.data);

      const transformedData = response.data.results.map((order) => ({
        id: order.id,
        order_number: order.order_number || "N/A",
        customer_name: order.customer_name || "Unknown Customer",
        total_amount: `$${order.total_amount?.toFixed(2) || "0.00"}`,
        status: order.status || "Pending",
        created_at: order.created_at
          ? new Date(order.created_at).toLocaleDateString()
          : "N/A",
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
      }));

      setTotalCount(response.data.count);
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

  const handleDeleteOrder = () => {
    fetchOrders();
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handlePageSizeChange = (newSize) => {
    setPageSize(newSize);
    setCurrentPage(1);
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
        pagination={{
          currentPage,
          pageSize,
          totalCount,
          onPageChange: handlePageChange,
          onPageSizeChange: handlePageSizeChange,
        }}
      />

      <DeleteModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        itemId={orderToDelete}
        itemType="order"
        onDeleteSuccess={handleDeleteOrder}
      />

      <style jsx>{`
        .action-cell {
          display: flex;
          gap: 8px;
          justify-content: center;
          align-items: center;
        }

        .action-btn {
          background: none;
          border: none;
          padding: 4px;
          cursor: pointer;
          color: #666;
          transition: color 0.2s;
        }

        .action-btn:hover {
          color: #333;
        }

        .action-btn.view:hover {
          color: #4285f4;
        }

        .action-btn.edit:hover {
          color: #fbbc05;
        }

        .action-btn.delete:hover {
          color: #ea4335;
        }
      `}</style>
    </>
  );
};

export default Orders;
