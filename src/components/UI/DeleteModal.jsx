import React from "react";
import { api } from "../../config/api";
import { toast } from "sonner";
import "./DeleteModal.css";

const DeleteModal = ({
  isOpen,
  onClose,
  itemId,
  itemType,
  onDeleteSuccess,
}) => {
  if (!isOpen) return null;

  // Get entity display name based on item type
  const getEntityDisplayName = () => {
    switch (itemType) {
      case "fabric":
        return "Fabric";
      case "colorCategory":
        return "Color Category";
      case "fabricCategory":
        return "Fabric Category";
      case "user":
        return "User";
      case "blog":
        return "Blog";
      case "order":
        return "Order";
      case "blogCategory":
        return "Blog Category";
      case "contactDetails":
        return "Contact Details";
      case "contactRequest":
        return "Contact Request";
      case "event":
        return "Event";
      default:
        return "Item";
    }
  };

  // Get API endpoint based on item type
  const getDeleteEndpoint = () => {
    switch (itemType) {
      case "fabric":
        return `/fabrics/${itemId}/delete/`;
      case "colorCategory":
        return `/color-categories/${itemId}/`;
      case "fabricCategory":
        return `/product-categories/${itemId}/`;
      case "user":
        return `/users/${itemId}/`;
      case "blog":
        return `/blogs/${itemId}/`;
      case "order":
        return `/orders/${itemId}/`;
      case "blogCategory":
        return `/blog-categories/${itemId}/`;
      case "contactDetails":
        return `/contact-details/${itemId}/`;
      case "contactRequest":
        return `/contact-requests/${itemId}/`;
      case "event":
        return `/events/${itemId}/`;
      default:
        return "";
    }
  };

  const handleDelete = async () => {
    try {
      console.log("DeleteModal handleDelete called for itemId:", itemId);
      const endpoint = getDeleteEndpoint();
      if (!endpoint) {
        console.log("No endpoint found for itemType:", itemType);
        toast.error("Invalid item type");
        onClose();
        return;
      }

      console.log("Sending delete request to endpoint:", endpoint);
      await api.delete(endpoint);
      console.log("Delete request successful for itemId:", itemId);
      toast.success(`${getEntityDisplayName()} deleted successfully`);
      onDeleteSuccess(itemId);
      onClose();
    } catch (error) {
      console.error("Error deleting item:", error);
      toast.error(
        error.response?.data?.error ||
          `Failed to delete ${getEntityDisplayName()}`
      );
      onClose();
    }
  };

  return (
    <div className="delete-modal-overlay">
      <div className="delete-modal">
        <div className="delete-modal-header">
          <h2>Confirm Delete</h2>
          <button className="close-button" onClick={onClose}>
            &times;
          </button>
        </div>
        <div className="delete-modal-body">
          <p>Are you sure you want to delete this {getEntityDisplayName()}?</p>
          <p className="delete-warning">This action cannot be undone.</p>
        </div>
        <div className="delete-modal-footer">
          <button className="cancel-button" onClick={onClose}>
            Cancel
          </button>
          <button className="delete-button" onClick={handleDelete}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;
