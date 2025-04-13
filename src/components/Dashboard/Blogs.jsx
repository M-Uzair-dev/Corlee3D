import React, { useState, useEffect } from "react";
import {
  FaBlog,
  FaEdit,
  FaTrash,
  FaEye,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import PageContent from "./PageContent";
import { api } from "../../config/api";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import DeleteModal from "../UI/DeleteModal";

const Blogs = () => {
  const navigate = useNavigate();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [blogToDelete, setBlogToDelete] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [blogsData, setBlogsData] = useState({
    fields: {
      title: "Title",
      category: "Category",
      author: "Author",
      view_count: "Views",
      created_at: "Created At",
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
    fetchBlogs();
  }, [page]);

  const fetchBlogs = async () => {
    try {
      setBlogsData((prev) => ({ ...prev, isLoading: true }));
      const response = await api.get(
        `/blogs/?page=${page}&page_size=${ITEMS_PER_PAGE}`
      );

      if (response.data.results) {
        const transformedData = response.data.results.map((blog) => ({
          id: blog.id,
          title: blog.title || "Untitled",
          category: blog.category_name || "Uncategorized",
          author: blog.author_name || "Unknown Author",
          view_count: blog.view_count || 0,
          created_at: new Date(blog.created_at).toLocaleDateString(),
          actions: (
            <div className="action-cell">
              <button
                className="action-btn view"
                onClick={() => handleViewBlog(blog.id)}
                title="View Blog"
              >
                <FaEye />
              </button>
              <button
                className="action-btn edit"
                onClick={() => handleEditBlog(blog.id)}
                title="Edit Blog"
              >
                <FaEdit />
              </button>
              <button
                className="action-btn delete"
                onClick={() => handleShowDeleteModal(blog.id)}
                title="Delete Blog"
              >
                <FaTrash />
              </button>
            </div>
          ),
        }));

        const totalCount = response.data.count || 0;
        const calculatedTotalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);
        setTotalPages(calculatedTotalPages);

        setBlogsData((prev) => ({
          ...prev,
          data: transformedData,
          isLoading: false,
        }));
      }
    } catch (error) {
      console.error("Error fetching blogs:", error);
      toast.error("Failed to load blogs");
      setBlogsData((prev) => ({ ...prev, isLoading: false }));
    }
  };

  const handleViewBlog = (id) => {
    navigate(`/blog/${id}`);
  };

  const handleEditBlog = (id) => {
    navigate(`/dashboard/blogs/edit/${id}`);
  };

  const handleShowDeleteModal = (id) => {
    setBlogToDelete(id);
    setShowDeleteModal(true);
  };

  const handleDeleteBlog = () => {
    toast.success("Blog deleted successfully");
    fetchBlogs();
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

  const handleCreate = () => {
    navigate("/dashboard/blogs/create");
  };

  const Pagination = () => (
    <div className="pagination-controls">
      <button
        className="pagination-btn"
        onClick={handlePrevPage}
        disabled={page <= 1 || blogsData.isLoading}
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
          disabled={blogsData.isLoading}
        >
          Next <FaChevronRight />
        </button>
      )}
    </div>
  );

  return (
    <>
      <PageContent
        title="Blogs"
        icon={<FaBlog />}
        data={blogsData}
        page="blogs"
        onRefresh={fetchBlogs}
        onCreate={handleCreate}
        onDelete={handleDeleteBlog}
        onEdit={handleEditBlog}
        onView={handleViewBlog}
      />

      {totalPages > 1 && <Pagination />}

      <DeleteModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        itemId={blogToDelete}
        itemType="blog"
        onDeleteSuccess={handleDeleteBlog}
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

export default Blogs;
