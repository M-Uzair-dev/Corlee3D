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
  isBulkDelete = false,
  bulkCount = 0,
}) => {
  if (!isOpen) return null;

  // Get entity display name based on item type
  const getEntityDisplayName = () => {
    switch (itemType) {
      case "fabric":
        return isBulkDelete ? "布料" : "布料";
      case "colorCategory":
        return isBulkDelete ? "顏色" : "顏色";
      case "fabricCategory":
        return isBulkDelete ? "布種" : "布種";
      case "user":
        return isBulkDelete ? "使用者" : "使用者";
      case "blog":
        return isBulkDelete ? "文章" : "文章";
      case "order":
        return isBulkDelete ? "訂單" : "訂單";
      case "blogCategory":
        return isBulkDelete ? "文章分類" : "文章分類";
      case "contactDetails":
        return isBulkDelete ? "聯絡資訊" : "聯絡資訊";
      case "contactRequest":
        return isBulkDelete ? "聯絡請求" : "聯絡請求";
      case "event":
        return isBulkDelete ? "活動" : "活動";
      default:
        return isBulkDelete ? "項目" : "項目";
    }
  };

  // Get API endpoint based on item type
  const getDeleteEndpoint = () => {
    if (isBulkDelete) {
      switch (itemType) {
        case "fabric":
          return `/fabrics/bulk-delete/`;
        case "colorCategory":
          return `/color-categories/bulk-delete/`;
        case "fabricCategory":
          return `/product-categories/bulk-delete/`;
        case "user":
          return `/users/bulk-delete/`;
        case "blog":
          return `/blogs/bulk-delete/`;
        case "order":
          return `/orders/bulk-delete/`;
        case "blogCategory":
          return `/blog-categories/bulk-delete/`;
        case "contactDetails":
          return `/contact-details/bulk-delete/`;
        case "contactRequest":
          return `/contact-requests/bulk-delete/`;
        case "event":
          return `/events/bulk-delete/`;
        default:
          return "";
      }
    } else {
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
    }
  };

  const handleDelete = async () => {
    try {
      console.log("DeleteModal handleDelete called for itemId:", itemId);
      const endpoint = getDeleteEndpoint();
      if (!endpoint) {
        console.log("No endpoint found for itemType:", itemType);
        toast.error("無效的項目類型");
        onClose();
        return;
      }

      console.log("Sending delete request to endpoint:", endpoint);

      if (isBulkDelete) {
        // For bulk delete, send POST request with array of IDs
        const requestBody = { [`${itemType}_ids`]: itemId };
        await api.post(endpoint, requestBody);
        console.log("Bulk delete request successful for items:", itemId);
        toast.success(`${bulkCount} 個${getEntityDisplayName()}刪除成功`);
      } else {
        // For single delete, send DELETE request
        await api.delete(endpoint);
        console.log("Delete request successful for itemId:", itemId);
        toast.success(`${getEntityDisplayName()}刪除成功`);
      }

      onDeleteSuccess(itemId);
      onClose();
    } catch (error) {
      console.error("Error deleting item:", error);
      toast.error(
        error.response?.data?.error || `刪除${getEntityDisplayName()}失敗`
      );
      onClose();
    }
  };

  return (
    <div className="delete-modal-overlay">
      <div className="delete-modal">
        <div className="delete-modal-header">
          <h2>確認刪除</h2>
          <button className="close-button" onClick={onClose}>
            &times;
          </button>
        </div>
        <div className="delete-modal-body">
          {isBulkDelete ? (
            <>
              <p>
                您確定要刪除 {bulkCount} 個{getEntityDisplayName()}嗎？
              </p>
              <p className="delete-warning">此操作無法復原。</p>
            </>
          ) : (
            <>
              <p>您確定要刪除此{getEntityDisplayName()}嗎？</p>
              <p className="delete-warning">此操作無法復原。</p>
            </>
          )}
        </div>
        <div className="delete-modal-footer">
          <button className="cancel-button" onClick={onClose}>
            取消
          </button>
          <button className="delete-button" onClick={handleDelete}>
            刪除 {isBulkDelete ? `(${bulkCount})` : ""}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;
