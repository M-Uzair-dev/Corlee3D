import React, { useState, useEffect } from "react";
import {
  FaUsers,
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

const Users = () => {
  const navigate = useNavigate();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [usersData, setUsersData] = useState({
    fields: {
      username: "使用者名稱",
      name: "姓名",
      email: "信箱",
      phone: "電話號碼",
    },
    data: [],
    isLoading: true,
    options: {
      create: true,
      edit: true,
      delete: true,
    },
  });

  const ITEMS_PER_PAGE = 8;

  useEffect(() => {
    fetchUsers();
  }, [page]);

  const fetchUsers = async () => {
    try {
      setUsersData((prev) => ({ ...prev, isLoading: true }));
      const response = await api.get(
        `/users/?page=${page}&page_size=${ITEMS_PER_PAGE}`
      );
      console.log("Users response:", response.data);

      const transformedData = response.data.results.map((user) => ({
        id: user.id,
        username: user.username || "Unknown User",
        email: user.email || "No email",
        name: user.name || "No name",
        phone: user.phone || "No phone",
        actions: (
          <div className="action-cell">
            <button
              className="action-btn view"
              onClick={() => handleViewUser(user.id)}
              title="View User"
            >
              <FaEye />
            </button>
            <button
              className="action-btn edit"
              onClick={() => handleEditUser(user.id)}
              title="Edit User"
            >
              <FaEdit />
            </button>
            <button
              className="action-btn delete"
              onClick={() => handleShowDeleteModal(user.id)}
              title="Delete User"
            >
              <FaTrash />
            </button>
          </div>
        ),
      }));

      const totalCount = response.data.count || 0;
      const calculatedTotalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);
      setTotalPages(calculatedTotalPages);

      setUsersData((prev) => ({
        ...prev,
        data: transformedData,
        isLoading: false,
      }));
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("載入使用者失敗");
      setUsersData((prev) => ({ ...prev, isLoading: false }));
    }
  };

  const handleViewUser = (id) => {
    navigate(`/dashboard/users/${id}`);
  };

  const handleEditUser = (id) => {
    navigate(`/dashboard/users/edit/${id}`);
  };

  const handleShowDeleteModal = (id) => {
    setUserToDelete(id);
    setShowDeleteModal(true);
  };

  const handleDeleteUser = () => {
    fetchUsers();
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
        disabled={page <= 1 || usersData.isLoading}
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
          disabled={usersData.isLoading}
        >
          下一頁 <FaChevronRight />
        </button>
      )}
    </div>
  );

  return (
    <>
      <PageContent
        title="使用者"
        icon={<FaUsers />}
        data={usersData}
        page="user"
        onDelete={handleDeleteUser}
        onRefresh={fetchUsers}
      />
      {totalPages > 1 && <Pagination />}

      <DeleteModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        itemId={userToDelete}
        itemType="user"
        onDeleteSuccess={handleDeleteUser}
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

export default Users;
