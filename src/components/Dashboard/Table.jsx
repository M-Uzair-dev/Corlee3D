import React, { useState } from "react";
import {
  FaEdit,
  FaTrash,
  FaEye,
  FaPlus,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import DeleteModal from "../UI/DeleteModal";
import LoadingSpinner from "../UI/LoadingSpinner";

const Table = ({
  fields,
  data = [],
  isLoading,
  options,
  page,
  onDelete,
  onBulkDelete,
  currentPage = 1,
  totalPages = 1,
  onPageChange,
}) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [selectedItems, setSelectedItems] = useState([]);
  const [showBulkDeleteModal, setShowBulkDeleteModal] = useState(false);
  const columnNames = Object.keys(fields);
  const navigate = useNavigate();

  // Get the appropriate edit route based on page type
  const getEditRoute = (id) => {
    switch (page) {
      case "fabric":
        return `/dashboard/fabrics/edit/${id}`;
      case "colorCategory":
        return `/dashboard/color-categories/edit/${id}`;
      case "fabricCategory":
        return `/dashboard/fabric-categories/edit/${id}`;
      case "user":
        return `/dashboard/users/edit/${id}`;
      case "blogs":
        return `/dashboard/blogs/edit/${id}`;
      case "order":
        return `/dashboard/orders/edit/${id}`;
      case "blogCategory":
        return `/dashboard/blog-categories/edit/${id}`;
      case "contactDetails":
        return `/dashboard/contact-details/edit/${id}`;
      case "contactRequest":
        return `/dashboard/contact-requests/edit/${id}`;
      case "event":
        return `/dashboard/events/edit/${id}`;
      default:
        return `/dashboard`;
    }
  };

  // Get the appropriate create route based on page type
  const getCreateRoute = () => {
    switch (page) {
      case "fabric":
        return `/dashboard/fabrics/create`;
      case "colorCategory":
        return `/dashboard/color-categories/create`;
      case "fabricCategory":
        return `/dashboard/fabric-categories/create`;
      case "user":
        return `/dashboard/users/create`;
      case "blogs":
        return `/dashboard/blogs/create`;
      case "order":
        return `/dashboard/orders/create`;
      case "blogCategory":
        return `/dashboard/blog-categories/create`;
      case "contactRequest":
        return `/dashboard/contact-requests/create`;
      case "event":
        return `/dashboard/events/create`;
      default:
        return `/dashboard`;
    }
  };

  // Get entity name for display
  const getEntityDisplayName = () => {
    switch (page) {
      case "fabric":
        return "布料";
      case "colorCategory":
        return "顏色";
      case "fabricCategory":
        return "布種";
      case "user":
        return "使用者";
      case "blogs":
        return "文章";
      case "order":
        return "訂單";
      case "blogCategory":
        return "文章分類";
      case "contactDetails":
        return "聯絡資訊";
      case "contactRequest":
        return "聯絡請求";
      case "event":
        return "活動";
      default:
        return "項目";
    }
  };

  // Handle individual item selection
  const handleItemSelect = (itemId) => {
    setSelectedItems((prev) =>
      prev.includes(itemId)
        ? prev.filter((id) => id !== itemId)
        : [...prev, itemId]
    );
  };

  // Handle select all/deselect all
  const handleSelectAll = () => {
    if (selectedItems.length === data.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(data.map((item) => item.id));
    }
  };

  // Handle bulk delete
  const handleBulkDeleteClick = () => {
    if (selectedItems.length > 0) {
      setShowBulkDeleteModal(true);
    }
  };

  // Handle bulk delete success
  const handleBulkDeleteSuccess = () => {
    if (onBulkDelete) {
      onBulkDelete(selectedItems);
    }
    setSelectedItems([]);
    setShowBulkDeleteModal(false);
  };

  // Show delete modal for an item
  const handleDeleteClick = (item) => {
    setItemToDelete(item.id);
    setShowDeleteModal(true);
  };

  // Handle successful deletion
  const handleDeleteSuccess = (deletedId) => {
    if (onDelete) {
      onDelete(deletedId);
    }
  };

  // Render table headers based on field keys
  const renderHeaders = () => {
    return (
      <tr>
        {options?.bulkDelete && (
          <th>
            <input
              type="checkbox"
              checked={selectedItems.length === data.length && data.length > 0}
              onChange={handleSelectAll}
            />
          </th>
        )}
        {columnNames.map((column) => (
          <th key={column}>
            {column.charAt(0).toUpperCase() + column.slice(1)}
          </th>
        ))}
        {(options?.edit || options?.delete || options?.view) && (
          <th>Actions</th>
        )}
      </tr>
    );
  };

  // Render a cell based on field type
  const renderCell = (item, column) => {
    const fieldType = fields[column];
    const value = item[column];
    const displayLabel =
      fields[column] || column.charAt(0).toUpperCase() + column.slice(1);

    // Check if this column might contain image-related content
    const isImageColumn =
      column.toLowerCase().includes("image") ||
      column.toLowerCase().includes("photo") ||
      column.toLowerCase().includes("thumbnail") ||
      column.toLowerCase().includes("picture");

    switch (fieldType) {
      case "boolean":
        return (
          <td key={column} data-label={displayLabel}>
            <span
              className={`order-status ${
                value ? "status-completed" : "status-pending"
              }`}
            >
              {value ? "Yes" : "No"}
            </span>
          </td>
        );
      default:
        return (
          <td
            key={column}
            data-label={displayLabel}
            className={isImageColumn ? "table-image-cell" : ""}
          >
            {value}
          </td>
        );
    }
  };

  // Render actions cell
  const renderActions = (item) => {
    return (
      <td className="action-cell" data-label="Actions">
        {options?.view && (
          <button
            className="action-btn view"
            title="View"
            onClick={() => {
              if (page === "fabric") {
                navigate(`/product/${item.id}`);
              } else if (page === "blogs") {
                navigate(`/blog/${item.id}`);
              } else if (page === "order") {
                navigate(`/dashboard/orders/${item.id}`);
              } else if (page === "event") {
                navigate(`/dashboard/events/${item.id}`);
              } else if (page === "contactRequest") {
                navigate("/dashboard/contact-requests/" + item.id);
              }
            }}
          >
            <FaEye className="action-icon" />
          </button>
        )}
        {options?.edit && (
          <button
            className="action-btn edit"
            title="Edit"
            onClick={() => navigate(getEditRoute(item.id))}
          >
            <FaEdit className="action-icon" />
          </button>
        )}
        {options?.delete && (
          <button
            className="action-btn delete"
            title="Delete"
            onClick={() => handleDeleteClick(item)}
          >
            <FaTrash className="action-icon" />
          </button>
        )}
      </td>
    );
  };

  // Render loading state
  if (isLoading) {
    return (
      <div style={{ position: "relative", minHeight: "300px" }}>
        <LoadingSpinner text="正在載入數據..." overlay />
      </div>
    );
  }

  return (
    <>
      {options?.create && (
        <div className="table-header">
          <button
            className="create-button"
            onClick={() => navigate(getCreateRoute())}
          >
            <FaPlus /> 新增{getEntityDisplayName()}
          </button>
        </div>
      )}

      {/* Bulk Delete Button */}
      {options?.bulkDelete && selectedItems.length > 0 && (
        <div className="bulk-actions">
          <button
            className="bulk-delete-button"
            onClick={handleBulkDeleteClick}
          >
            <FaTrash /> 刪除所選項目 ({selectedItems.length})
          </button>
        </div>
      )}

      {/* Render empty state */}
      {!data || data.length === 0 ? (
        <p className="empty-table-message">沒有可用的數據。</p>
      ) : (
        <div className="table-responsive">
          <table className="data-table">
            <thead>{renderHeaders()}</thead>
            <tbody>
              {data.map((item, index) => (
                <tr key={index}>
                  {options?.bulkDelete && (
                    <td>
                      <input
                        type="checkbox"
                        checked={selectedItems.includes(item.id)}
                        onChange={() => handleItemSelect(item.id)}
                      />
                    </td>
                  )}
                  {columnNames.map((column) => renderCell(item, column))}
                  {(options?.edit || options?.delete || options?.view) &&
                    renderActions(item)}
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="pagination-controls">
              <button
                className="pagination-button"
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                <FaChevronLeft />
              </button>
              <span className="page-info">
                第 {currentPage} 頁，共 {totalPages} 頁
              </span>
              <button
                className="pagination-button"
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                <FaChevronRight />
              </button>
            </div>
          )}
        </div>
      )}

      {/* Delete Modal */}
      <DeleteModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        itemId={itemToDelete}
        itemType={page === "blogs" ? "blog" : page}
        onDeleteSuccess={handleDeleteSuccess}
      />

      {/* Bulk Delete Modal */}
      {options?.bulkDelete && (
        <DeleteModal
          isOpen={showBulkDeleteModal}
          onClose={() => setShowBulkDeleteModal(false)}
          itemId={selectedItems}
          itemType={page === "blogs" ? "blog" : page}
          onDeleteSuccess={handleBulkDeleteSuccess}
          isBulkDelete={true}
          bulkCount={selectedItems.length}
        />
      )}

      <style jsx>{`
        .table-header {
          display: flex;
          justify-content: flex-end;
          margin-bottom: 16px;
        }

        .create-button {
          background-color: #34a853;
          color: white;
          border: none;
          border-radius: 4px;
          padding: 8px 16px;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .create-button:hover {
          background-color: #2d9248;
        }

        .bulk-actions {
          display: flex;
          justify-content: flex-start;
          margin-bottom: 16px;
        }

        .bulk-delete-button {
          background-color: #dc3545;
          color: white;
          border: none;
          border-radius: 4px;
          padding: 8px 16px;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 14px;
        }

        .bulk-delete-button:hover {
          background-color: #c82333;
        }

        .pagination-controls {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 16px;
          margin-top: 20px;
          padding: 10px;
        }

        .pagination-button {
          background: none;
          border: 1px solid #ddd;
          border-radius: 4px;
          padding: 8px 12px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .pagination-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .pagination-button:hover:not(:disabled) {
          background-color: #f5f5f5;
        }

        .page-info {
          font-size: 14px;
          color: #666;
        }
      `}</style>
    </>
  );
};

export default Table;
