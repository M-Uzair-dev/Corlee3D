import React, { useState, useEffect } from "react";
import { FaEnvelope, FaEye, FaEdit, FaTrash } from "react-icons/fa";
import PageContent from "./PageContent";
import { api } from "../../config/api";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import DeleteModal from "../UI/DeleteModal";

const ContactRequests = () => {
  const navigate = useNavigate();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [requestToDelete, setRequestToDelete] = useState(null);
  const [requestsData, setRequestsData] = useState({
    fields: {
      id: "ID",
      request_type: "Type",
      subject: "Subject",
      company_name: "Company",
      email: "Email",
      status: "Status",
      actions: "Actions",
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
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      setRequestsData((prev) => ({ ...prev, isLoading: true }));
      const response = await api.get("/contact-requests/public/");
      console.log("Contact requests response:", response.data);

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

      setRequestsData((prev) => ({
        ...prev,
        data: transformedData,
        isLoading: false,
      }));
    } catch (error) {
      console.error("Error fetching contact requests:", error);
      toast.error("Failed to load contact requests");
      setRequestsData((prev) => ({ ...prev, isLoading: false }));
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
      fetchRequests();
    } catch (error) {
      console.error("Error handling request deletion:", error);
      toast.error("Failed to complete request deletion");
    }
  };

  return (
    <>
      <PageContent
        title="Contact Requests"
        icon={<FaEnvelope />}
        data={requestsData}
        page="contactRequest"
        onDelete={handleDeleteRequest}
        onRefresh={fetchRequests}
      />

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
      `}</style>
    </>
  );
};

export default ContactRequests;
