import React, { useState, useEffect } from "react";
import {
  FaEnvelope,
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

const ContactRequests = () => {
  const navigate = useNavigate();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [requestToDelete, setRequestToDelete] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [contactRequestsData, setContactRequestsData] = useState({
    fields: {
      request_type: "請求類型",
      subject: "主旨",
      company_name: "公司名稱",
      email: "信箱",
      status: "狀態",
    },
    data: [],
    isLoading: true,
    options: {
      create: false,
      edit: true,
      delete: true,
      view: true,
    },
  });

  const ITEMS_PER_PAGE = 8;

  useEffect(() => {
    fetchContactRequests();
  }, [page]);

  const fetchContactRequests = async () => {
    try {
      setContactRequestsData((prev) => ({ ...prev, isLoading: true }));
      console.log(
        "Fetching contact requests on url: ",
        `/contact-requests/all/?page=${page}&page_size=${ITEMS_PER_PAGE}`
      );
      const response = await api.get(
        `/contact-requests/all/?page=${page}&page_size=${ITEMS_PER_PAGE}&dashboard=true`
      );
      console.log("Contact requests response:", response.data);

      const transformedData = response.data.results.map((request) => ({
        id: request.id,
        request_type:
          request.request_type == "general"
            ? "一般詢問"
            : request.request_type == "product"
            ? "產品詢問"
            : request.request_type == "product_request"
            ? "產品請求"
            : "其他",
        subject: request.subject || "無主旨",
        company_name: request.company_name || "N/A",
        email: request.user.email || "N/A",
        status: request.status || "新請求",
        actions: (
          <div className="action-cell">
            <button
              className="action-btn view"
              onClick={() => handleViewRequest(request.id)}
              title="查看請求"
            >
              <FaEye />
            </button>
            <button
              className="action-btn edit"
              onClick={() => handleEditRequest(request.id)}
              title="編輯請求"
            >
              <FaEdit />
            </button>
            <button
              className="action-btn delete"
              onClick={() => handleShowDeleteModal(request.id)}
              title="刪除請求"
            >
              <FaTrash />
            </button>
          </div>
        ),
      }));

      setContactRequestsData((prev) => ({
        ...prev,
        data: transformedData,
        isLoading: false,
      }));
      setTotalPages(response.data.total_pages);
    } catch (error) {
      console.error("Error fetching contact requests:", error);
      toast.error("載入聯絡請求失敗");
      setContactRequestsData((prev) => ({ ...prev, isLoading: false }));
    }
  };

  const handleViewRequest = (id) => {
    navigate(`/dashboard/contact-requests/${id}`);
  };

  const handleEditRequest = (id) => {
    navigate(`/dashboard/contact-requests/edit/${id}`);
  };

  const handleShowDeleteModal = (id) => {
    setRequestToDelete(id);
    setShowDeleteModal(true);
  };

  const handleDeleteRequest = async () => {
    try {
      // The actual deletion is handled by the DeleteModal component
      // We just need to refresh the list after successful deletion
      fetchContactRequests();
    } catch (error) {
      console.error("Error handling request deletion:", error);
      toast.error("完成請求刪除失敗");
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

  // Create pagination UI component
  const Pagination = () => (
    <div className="pagination-controls">
      <button
        className="pagination-btn"
        onClick={handlePrevPage}
        disabled={page <= 1 || contactRequestsData.isLoading}
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
          disabled={contactRequestsData.isLoading}
        >
          下一頁 <FaChevronRight />
        </button>
      )}
    </div>
  );

  return (
    <>
      <PageContent
        title="聯絡請求"
        icon={<FaEnvelope />}
        data={contactRequestsData}
        page="contactRequest"
        onDelete={handleDeleteRequest}
        onRefresh={fetchContactRequests}
      />

      {totalPages > 1 && <Pagination />}

      <DeleteModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        itemId={requestToDelete}
        itemType="contactRequest"
        onDeleteSuccess={handleDeleteRequest}
      />

      <style jsx>{`
        .action-cell {
          display: flex;
          gap: 8px;
          justify-content: flex-start;
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
          gap: 8px;
          justify-content: center;
          align-items: center;
          margin-top: 20px;
        }

        .pagination-btn {
          background: none;
          border: 1px solid #ddd;
          border-radius: 4px;
          padding: 8px 12px;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 4px;
          transition: background-color 0.2s;
        }

        .pagination-btn:hover:not(:disabled) {
          background-color: #f5f5f5;
        }

        .pagination-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .pagination-info {
          font-size: 14px;
          color: #666;
        }
      `}</style>
    </>
  );
};

export default ContactRequests;
