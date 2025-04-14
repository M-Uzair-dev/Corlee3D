import React, { useState, useEffect } from "react";
import {
  FaShoppingCart,
  FaEye,
  FaEdit,
  FaTrash,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import PageContent from "./PageContent";
import { api } from "../../config/api";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import DeleteModal from "../UI/DeleteModal";

const Orders = () => {
  const navigate = useNavigate();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [ordersData, setOrdersData] = useState({
    fields: {
      id: "Order ID",
      customer_name: "Customer Name",
      customer_email: "Customer Email",
      customer_phone: "Customer Phone",
      order_date: "Order Date",
      order_items: "Order Items",
    },
    data: [],
    isLoading: true,
    options: {
      edit: true,
      delete: true,
      view: true,
    },
  });

  const ITEMS_PER_PAGE = 8;

  useEffect(() => {
    fetchOrders();
  }, [page]);

  const fetchOrders = async () => {
    try {
      setOrdersData((prev) => ({ ...prev, isLoading: true }));
      const response = await api.get(
        `/orders/?page=${page}&page_size=${ITEMS_PER_PAGE}`
      );
      console.log(response.data);
      if (response.data.results) {
        const transformedData = response.data.results.map((order) => ({
          id: order.id,
          customer_name: order.user.name || "Unknown Customer",
          customer_email: order.user.email || "No email",
          customer_phone: order.user.phone || "No phone",
          order_date: order.order_date
            ? new Date(order.created_at).toLocaleDateString()
            : "N/A",
          order_items: order?.items?.length || 0,
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

        const totalCount = response.data.count || 0;
        const calculatedTotalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);
        setTotalPages(calculatedTotalPages);

        setOrdersData((prev) => ({
          ...prev,
          data: transformedData,
          isLoading: false,
        }));
      }
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
    toast.success("Order deleted successfully");
    fetchOrders();
  };

  const handlePrevPage = () => {
    if (page > 1) {
      setPage((prev) => prev - 1);
    }
  };

  const handleNextPage = () => {
    if (page < totalPages) {
      setPage((prev) => prev + 1);
    }
  };

  const Pagination = () => (
    <div className="pagination-controls">
      <button
        className="pagination-btn"
        onClick={handlePrevPage}
        disabled={page <= 1 || ordersData.isLoading}
      >
        <FaChevronLeft /> Previous
      </button>
      <span className="pagination-info">
        Page {page} of {totalPages}
      </span>
      {page < totalPages && (
        <button
          className="pagination-btn"
          onClick={handleNextPage}
          disabled={ordersData.isLoading}
        >
          Next <FaChevronRight />
        </button>
      )}
    </div>
  );

  return (
    <>
      <PageContent
        title="Orders"
        icon={<FaShoppingCart />}
        data={ordersData}
        page="order"
        onDelete={handleDeleteOrder}
      />
      {totalPages > 1 && <Pagination />}

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

        .pagination-controls {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 16px;
          margin-top: 20px;
          padding: 10px;
        }

        .pagination-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 16px;
          border: 1px solid #ddd;
          border-radius: 4px;
          background: white;
          cursor: pointer;
          transition: all 0.2s;
        }

        .pagination-btn:hover:not(:disabled) {
          background: #f5f5f5;
          border-color: #ccc;
        }

        .pagination-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .pagination-info {
          color: #666;
          font-size: 14px;
        }
      `}</style>
    </>
  );
};

export default Orders;
