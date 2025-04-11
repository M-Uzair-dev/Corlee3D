import React, { useState } from "react";
import { FaEdit, FaTrash, FaEye, FaPlus } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import DeleteModal from "../UI/DeleteModal";
import LoadingSpinner from "../UI/LoadingSpinner";

const Table = ({ fields, data = [], isLoading, options, page, onDelete }) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
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
        return "Fabric";
      case "colorCategory":
        return "Color Category";
      case "fabricCategory":
        return "Fabric Category";
      case "user":
        return "User";
      case "blogs":
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

    switch (fieldType) {
      case "boolean":
        return (
          <td key={column}>
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
        return <td key={column}>{value}</td>;
    }
  };

  // Render actions cell
  const renderActions = (item) => {
    return (
      <td className="action-cell">
        {options?.view && (
          <button
            className="action-btn view"
            title="View"
            onClick={() => {
              if (page === "fabric") {
                navigate(`/product/${item.id}`);
              } else if (page === "blogs") {
                navigate(`/blog/${item.id}`);
              }
            }}
          >
            <FaEye />
          </button>
        )}
        {options?.edit && (
          <button
            className="action-btn edit"
            title="Edit"
            onClick={() => navigate(getEditRoute(item.id))}
          >
            <FaEdit />
          </button>
        )}
        {options?.delete && (
          <button
            className="action-btn delete"
            title="Delete"
            onClick={() => handleDeleteClick(item)}
          >
            <FaTrash />
          </button>
        )}
      </td>
    );
  };

  // Render loading state
  if (isLoading) {
    return (
      <div style={{ position: "relative", minHeight: "300px" }}>
        <LoadingSpinner text="Loading data..." overlay />
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
            <FaPlus /> Create New {getEntityDisplayName()}
          </button>
        </div>
      )}

      {/* Render empty state */}
      {!data || data.length === 0 ? (
        <p className="empty-table-message">No data available.</p>
      ) : (
        <div className="table-responsive">
          <table className="data-table">
            <thead>{renderHeaders()}</thead>
            <tbody>
              {data.map((item, index) => (
                <tr key={index}>
                  {columnNames.map((column) => renderCell(item, column))}
                  {(options?.edit || options?.delete || options?.view) &&
                    renderActions(item)}
                </tr>
              ))}
            </tbody>
          </table>
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
          font-size: 14px;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
          transition: background-color 0.2s;
        }

        .create-button:hover {
          background-color: #2e8b46;
        }
      `}</style>
    </>
  );
};

export default Table;
