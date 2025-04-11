import React, { useState, useEffect } from "react";
import { FaBox, FaEdit, FaTrash } from "react-icons/fa";
import PageContent from "./PageContent";
import { api } from "../../config/api";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import DeleteModal from "../UI/DeleteModal";

const ProductCategories = () => {
  const navigate = useNavigate();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [categoriesData, setCategoriesData] = useState({
    fields: {
      name: "Category Name",
      description: "Description",
    },
    data: [],
    isLoading: true,
    options: {
      create: true,
      edit: true,
      delete: true,
    },
  });

  useEffect(() => {
    fetchCategories();
  }, [currentPage, pageSize]);

  const fetchCategories = async () => {
    try {
      setCategoriesData((prev) => ({ ...prev, isLoading: true }));
      const response = await api.get(
        `/product-categories/?page=${currentPage}&page_size=${pageSize}`
      );
      console.log("Categories response:", response.data);

      const transformedData = response.data.results.map((category) => ({
        id: category.id,
        name: category.name || "Unnamed Category",
        description: category.description || "No description",
        actions: (
          <div className="action-cell">
            <button
              className="action-btn edit"
              onClick={() => handleEditCategory(category.id)}
              title="Edit Category"
            >
              <FaEdit />
            </button>
            <button
              className="action-btn delete"
              onClick={() => handleShowDeleteModal(category.id)}
              title="Delete Category"
            >
              <FaTrash />
            </button>
          </div>
        ),
      }));

      setTotalCount(response.data.count);
      setCategoriesData((prev) => ({
        ...prev,
        data: transformedData,
        isLoading: false,
      }));
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
        title="Product Categories"
        icon={<FaBox />}
        data={categoriesData}
        page="productCategory"
        onDelete={handleDeleteCategory}
        onRefresh={fetchCategories}
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
      `}</style>
    </>
  );
};

export default ProductCategories;
