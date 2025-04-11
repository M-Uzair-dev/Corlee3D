import React, { useState, useEffect } from "react";
import { FaBlog, FaEdit, FaTrash, FaEye } from "react-icons/fa";
import PageContent from "./PageContent";
import { api } from "../../config/api";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import DeleteModal from "../UI/DeleteModal";

const Blogs = () => {
  const navigate = useNavigate();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [blogToDelete, setBlogToDelete] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [blogData, setBlogData] = useState({
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

  useEffect(() => {
    fetchBlogs();
  }, [currentPage, pageSize]);

  const fetchBlogs = async () => {
    try {
      setBlogData((prev) => ({ ...prev, isLoading: true }));
      const response = await api.get(
        `/blogs/?page=${currentPage}&page_size=${pageSize}`
      );
      console.log("Blogs response:", response.data);

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

      setTotalCount(response.data.count);
      setBlogData((prev) => ({
        ...prev,
        data: transformedData,
        isLoading: false,
      }));
    } catch (error) {
      console.error("Error fetching blogs:", error);
      toast.error("Failed to load blogs");
      setBlogData((prev) => ({ ...prev, isLoading: false }));
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
    fetchBlogs();
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handlePageSizeChange = (newSize) => {
    setPageSize(newSize);
    setCurrentPage(1);
  };

  const handleCreate = () => {
    navigate("/dashboard/blogs/create");
  };

  return (
    <>
      <PageContent
        title="Blogs"
        icon={<FaBlog />}
        data={blogData}
        page="blogs"
        onRefresh={fetchBlogs}
        onCreate={handleCreate}
        onDelete={handleDeleteBlog}
        onEdit={handleEditBlog}
        onView={handleViewBlog}
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
      `}</style>
    </>
  );
};

export default Blogs;
