import React, { useState, useEffect } from "react";
import {
  FaShoppingCart,
  FaEye,
  FaEdit,
  FaTrash,
  FaChevronLeft,
  FaChevronRight,
  FaDownload,
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
      id: "訂單編號",
      customer_name: "客戶姓名",
      customer_email: "客戶信箱",
      customer_phone: "客戶電話",
      order_date: "訂單日期",
      order_items: "訂單項目數量",
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
      console.log("response : ", response.data);
      if (response.data.results) {
        const transformedData = response.data.results.map((order) => ({
          id: order.id,
          customer_name: order.user.name || "未知客戶",
          customer_email: order.user.email || "無信箱",
          customer_phone: order.user.phone || "無電話",
          order_date: order.order_date
            ? new Date(order.order_date).toLocaleDateString()
            : "N/A",
          order_items: order?.items?.length || 0,
          actions: (
            <div className="action-cell">
              <button
                className="action-btn view"
                onClick={() => handleViewOrder(order.id)}
                title="查看訂單"
              >
                <FaEye />
              </button>
              <button
                className="action-btn edit"
                onClick={() => handleEditOrder(order.id)}
                title="編輯訂單"
              >
                <FaEdit />
              </button>
              <button
                className="action-btn delete"
                onClick={() => handleShowDeleteModal(order.id)}
                title="刪除訂單"
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
      toast.error("載入訂單失敗");
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
    toast.success("訂單刪除成功");
    fetchOrders();
  };

  const handleDownload = async () => {
    try {
      toast.info("開始下載訂單數據...");
      
      const response = await api.get('/download/orders/', {
        responseType: 'blob'
      });
      
      // Create blob URL and download
      const blob = new Blob([response.data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      });
      
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      
      // Generate filename with current date/time
      const now = new Date();
      const timestamp = now.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}Z/, '');
      link.download = `orders_data_${timestamp}.xlsx`;
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      toast.success("訂單數據下載成功！");
    } catch (error) {
      console.error("Error downloading orders:", error);
      toast.error("下載訂單數據失敗");
    }
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
        <FaChevronLeft /> 上一頁
      </button>
      <span className="pagination-info">
        第 {page} 頁，共 {totalPages} 頁
      </span>
      {page < totalPages && (
        <button
          className="pagination-btn"
          onClick={handleNextPage}
          disabled={ordersData.isLoading}
        >
          下一頁 <FaChevronRight />
        </button>
      )}
    </div>
  );

  return (
    <>
      <div className="page-header">
        <button
          className="download-btn"
          onClick={handleDownload}
          disabled={ordersData.isLoading}
          title="下載訂單數據"
        >
          <FaDownload /> 下載數據
        </button>
      </div>
      
      <PageContent
        title="訂單"
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
        .page-header {
          display: flex;
          justify-content: flex-end;
          margin-bottom: 20px;
        }
        
        .download-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 20px;
          background: #28a745;
          color: white;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-size: 14px;
          font-weight: 500;
          transition: all 0.2s;
          white-space: nowrap;
        }
        
        .download-btn:hover:not(:disabled) {
          background: #218838;
          transform: translateY(-1px);
        }
        
        .download-btn:disabled {
          background: #6c757d;
          cursor: not-allowed;
          transform: none;
        }
        
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
