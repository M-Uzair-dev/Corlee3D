import React, { useState, useEffect } from "react";
import {
  FaBox,
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

const ProductCategories = () => {
  const navigate = useNavigate();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [categoriesData, setCategoriesData] = useState({
    fields: {
      name: "Name",
      description: "Description",
      status: "Status",
    },
    data: [],
    isLoading: true,
    options: {
      create: true,
      edit: true,
      delete: true,
      view: true,
    },
  });

  const ITEMS_PER_PAGE = 8;

  useEffect(() => {
    fetchCategories();
  }, [page]);

  const fetchCategories = async () => {
    try {
      setCategoriesData((prev) => ({ ...prev, isLoading: true }));
      const response = await api.get(
        `/product-categories/?page=${page}&page_size=${ITEMS_PER_PAGE}`
      );

      if (response.data.results) {
        const transformedData = response.data.results.map((category) => ({
          id: category.id,
          name: category.name || "Unnamed",
          description: category.description || "No description",
          status: category.status || "Active",
        }));

        const totalCount = response.data.count || 0;
        const calculatedTotalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);
        setTotalPages(calculatedTotalPages);

        setCategoriesData((prev) => ({
          ...prev,
          data: transformedData,
          isLoading: false,
        }));
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast.error("Failed to load categories");
      setCategoriesData((prev) => ({ ...prev, isLoading: false }));
    }
  };

  const handleEditCategory = (id) => {
    navigate(`/dashboard/product-categories/edit/${id}`);
  };

  const handleShowDeleteModal = (id) => {
    setCategoryToDelete(id);
    setShowDeleteModal(true);
  };

  const handleDeleteCategory = () => {
    fetchCategories();
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

  const handleDeleteSuccess = () => {
    toast.success("Category deleted successfully");
    fetchCategories();
  };

  const Pagination = () => (
    <div className="pagination-controls">
      <button
        className="pagination-btn"
        onClick={handlePrevPage}
        disabled={page <= 1 || categoriesData.isLoading}
      >
        <FaChevronLeft /> Previous
      </button>
      <span className="pagination-info">
        Page {page} of {totalPages}
      </span>
      {page < totalPages && (
        <button
          className="pagination-btn"
          onClick={handleNextPage}
          disabled={categoriesData.isLoading}
        >
          Next <FaChevronRight />
        </button>
      )}
    </div>
  );

  return (
    <>
      <PageContent
        title="Product Categories"
        icon={<FaBox />}
        data={categoriesData}
        page="product-category"
        onDelete={handleDeleteSuccess}
      />
      {totalPages > 1 && <Pagination />}

      <DeleteModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        itemId={categoryToDelete}
        itemType="productCategory"
        onDeleteSuccess={handleDeleteCategory}
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

export default ProductCategories;
