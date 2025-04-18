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
import { useNavigate } from "react-router-dom";
import DeleteModal from "../UI/DeleteModal";
import { handleApiError, handleApiSuccess } from "../../util/errorHandler";

const ContactRequests = () => {
  const navigate = useNavigate();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [requestToDelete, setRequestToDelete] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [contactRequestsData, setContactRequestsData] = useState({
    fields: {
      request_type: "Request Type",
      subject: "Subject",
      company_name: "Company Name",
      email: "Email",
      status: "Status",
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
      const response = await api.get(
        `/contact-requests/all/?page=${page}&page_size=${ITEMS_PER_PAGE}`
      );

      const transformedData = response.data.results.map((request) => ({
        id: request.id,
        request_type:
          request.request_type == "general"
            ? "General Inquiry"
            : request.request_type == "product"
            ? "Product Inquiry"
            : request.request_type == "product_request"
            ? "Product Request"
            : "Other",
        subject: request.subject || "No Subject",
        company_name: request.company_name || "N/A",
        email: request.user.email || "N/A",
        status: request.status || "New",
        actions: (
          <div className="action-cell">
            <button
              className="action-btn view"
              onClick={() => handleViewRequest(request.id)}
              title="View Request"
            >
              <FaEye />
            </button>
            <button
              className="action-btn edit"
              onClick={() => handleEditRequest(request.id)}
              title="Edit Request"
            >
              <FaEdit />
            </button>
            <button
              className="action-btn delete"
              onClick={() => handleShowDeleteModal(request.id)}
              title="Delete Request"
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
      handleApiError(error, "Failed to load contact requests");
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
      await api.delete(`/contact-requests/${requestToDelete}/`);
      handleApiSuccess("Contact request deleted successfully");
      fetchContactRequests();
    } catch (error) {
      handleApiError(error, "Failed to delete contact request");
    }
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  // Create pagination UI component
  const Pagination = () => (
    <div className="pagination-controls">
      <button
        className="pagination-btn"
        onClick={() => handlePageChange(page - 1)}
        disabled={page <= 1 || contactRequestsData.isLoading}
      >
        <FaChevronLeft /> Previous
      </button>
      <span className="pagination-info">
        Page {page} of {totalPages}
      </span>
      {page < totalPages && (
        <button
          className="pagination-btn"
          onClick={() => handlePageChange(page + 1)}
          disabled={contactRequestsData.isLoading}
        >
          Next <FaChevronRight />
        </button>
      )}
    </div>
  );

  return (
    <>
      <PageContent
        title="Contact Requests"
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
          justify-content: center;
          align-items: center;
          gap: 16px;
          margin-top: 20px;
          padding: 10px;
        }

        .pagination-btn {
          background: none;
          border: 1px solid #ddd;
          border-radius: 4px;
          padding: 8px 16px;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
          color: #333;
          transition: all 0.2s;
        }

        .pagination-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .pagination-btn:hover:not(:disabled) {
          background-color: #f5f5f5;
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
