import React, { useState, useEffect } from "react";
import { FaEnvelope, FaEye, FaEdit, FaTrash } from "react-icons/fa";
import PageContent from "./PageContent";
import { api } from "../../config/api";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import DeleteModal from "../UI/DeleteModal";

const PublicContactRequests = () => {
  const navigate = useNavigate();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [requestToDelete, setRequestToDelete] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [requestsData, setRequestsData] = useState({
    fields: {
      name: "Name",
      email: "Email",
      subject: "Subject",
      message: "Message",
      status: "Status",
      created_at: "Date",
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

  useEffect(() => {
    fetchRequests();
  }, [currentPage, pageSize]);

  const fetchRequests = async () => {
    try {
      setRequestsData((prev) => ({ ...prev, isLoading: true }));
      const response = await api.get(
        `/contact-requests/public/?page=${currentPage}&page_size=${pageSize}`
      );
      console.log("Public contact requests response:", response.data);

      const transformedData = response.data.results.map((request) => ({
        id: request.id,
        name: request.name || "Anonymous",
        email: request.email || "No email",
        subject: request.subject || "No subject",
        message: request.message || "No message",
        status: request.status || "Pending",
        created_at: request.created_at
          ? new Date(request.created_at).toLocaleString()
          : "Unknown",
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

      setTotalCount(response.data.count);
      setRequestsData((prev) => ({
        ...prev,
        data: transformedData,
        isLoading: false,
      }));
    } catch (error) {
      console.error("Error fetching public contact requests:", error);
      toast.error("Failed to load contact requests");
      setRequestsData((prev) => ({ ...prev, isLoading: false }));
    }
  };

  const handleViewRequest = (id) => {
    navigate(`/dashboard/contact-requests/public/${id}`);
  };

  const handleEditRequest = (id) => {
    navigate(`/dashboard/contact-requests/public/edit/${id}`);
  };

  const handleShowDeleteModal = (id) => {
    setRequestToDelete(id);
    setShowDeleteModal(true);
  };

  const handleDeleteRequest = () => {
    fetchRequests();
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
        title="Public Contact Requests"
        icon={<FaEnvelope />}
        data={requestsData}
        page="publicContactRequest"
        onDelete={handleDeleteRequest}
        onRefresh={fetchRequests}
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
        itemId={requestToDelete}
        itemType="publicContactRequest"
        onDeleteSuccess={handleDeleteRequest}
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

export default PublicContactRequests;
