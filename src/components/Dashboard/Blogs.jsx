import React, { useState, useEffect, memo, useCallback, useMemo } from "react";
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
import SearchFilter from "../UI/SearchFilter";
import { getFilterConfig } from "../../config/filterConfig";

// Cache for blogs data to avoid redundant API calls
const blogsCache = new Map();

// Memoized action buttons component
const ActionButtons = memo(({ blog, onView, onEdit, onDelete }) => (
  <div className="action-cell">
    <button
      className="action-btn view"
      onClick={() => onView(blog.id)}
      title="View Blog"
    >
      <FaEye />
    </button>
    <button
      className="action-btn edit"
      onClick={() => onEdit(blog.id)}
      title="Edit Blog"
    >
      <FaEdit />
    </button>
    <button
      className="action-btn delete"
      onClick={() => onDelete(blog.id)}
      title="Delete Blog"
    >
      <FaTrash />
    </button>
  </div>
));

// Memoized pagination component
const Pagination = memo(({ page, totalPages, onPrevPage, onNextPage, isLoading }) => (
  <div className="pagination-controls">
    <button
      className="pagination-btn"
      onClick={onPrevPage}
      disabled={page <= 1 || isLoading}
    >
      <FaChevronLeft /> 上一頁
    </button>
    <span className="pagination-info">
      第 {page} 頁，共 {totalPages} 頁
    </span>
    {page < totalPages && (
      <button
        className="pagination-btn"
        onClick={onNextPage}
        disabled={isLoading}
      >
        下一頁 <FaChevronRight />
      </button>
    )}
  </div>
));

const Blogs = () => {
  const navigate = useNavigate();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [blogToDelete, setBlogToDelete] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [activeFilter, setActiveFilter] = useState(null);
  const [blogsData, setBlogsData] = useState({
    fields: {
      title: "標題",
      category: "分類",
      author: "作者",
      view_count: "瀏覽次數",
      created_at: "建立日期",
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

  // Memoized cache key
  const cacheKey = useMemo(() => {
    const filterKey = activeFilter ? `_${activeFilter.field}_${activeFilter.value}` : '';
    return `blogs_page_${page}_size_${ITEMS_PER_PAGE}${filterKey}`;
  }, [page, activeFilter]);

  // Memoized action handlers
  const handleViewBlog = useCallback((id) => {
    navigate(`/blog/${id}`);
  }, [navigate]);

  const handleEditBlog = useCallback((id) => {
    navigate(`/dashboard/blogs/edit/${id}`);
  }, [navigate]);

  const handleShowDeleteModal = useCallback((id) => {
    setBlogToDelete(id);
    setShowDeleteModal(true);
  }, []);

  const handleDeleteBlog = useCallback(() => {
    toast.success("文章刪除成功");
    // Clear cache and refetch
    blogsCache.clear();
    fetchBlogs();
  }, []);

  const handlePrevPage = useCallback(() => {
    if (page > 1) {
      setPage((prev) => prev - 1);
    }
  }, [page]);

  const handleNextPage = useCallback(() => {
    if (page < totalPages) {
      setPage((prev) => prev + 1);
    }
  }, [page, totalPages]);

  const handleCreate = useCallback(() => {
    navigate("/dashboard/blogs/create");
  }, [navigate]);

  const handleFilter = useCallback((filterData) => {
    setActiveFilter(filterData);
    setPage(1);
    blogsCache.clear();
  }, []);

  const handleClearFilter = useCallback(() => {
    setActiveFilter(null);
    setPage(1);
    blogsCache.clear();
  }, []);

  // Optimized fetch function with caching
  const fetchBlogs = useCallback(async () => {
    try {
      setBlogsData((prev) => ({ ...prev, isLoading: true }));

      // Check cache first
      if (blogsCache.has(cacheKey)) {
        const cachedData = blogsCache.get(cacheKey);
        setBlogsData((prev) => ({
          ...prev,
          data: cachedData.data,
          isLoading: false,
        }));
        setTotalPages(cachedData.totalPages);
        return;
      }

      let apiUrl = `/blogs/?page=${page}&page_size=${ITEMS_PER_PAGE}`;
      
      if (activeFilter) {
        apiUrl += `&${activeFilter.field}=${encodeURIComponent(activeFilter.value)}`;
      }
      
      const response = await api.get(apiUrl);

      if (response.data.results) {
        const transformedData = response.data.results.map((blog) => ({
          id: blog.id,
          title: blog.title || "Untitled",
          category: blog.category_name || "Uncategorized",
          author: blog.author_name || "Unknown Author",
          view_count: blog.view_count || 0,
          created_at: new Date(blog.created_at).toLocaleDateString(),
          actions: (
            <ActionButtons
              blog={blog}
              onView={handleViewBlog}
              onEdit={handleEditBlog}
              onDelete={handleShowDeleteModal}
            />
          ),
        }));

        const totalCount = response.data.count || 0;
        const calculatedTotalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);
        
        // Cache the result
        blogsCache.set(cacheKey, {
          data: transformedData,
          totalPages: calculatedTotalPages,
        });

        setTotalPages(calculatedTotalPages);
        setBlogsData((prev) => ({
          ...prev,
          data: transformedData,
          isLoading: false,
        }));
      }
    } catch (error) {
      console.error("Error fetching blogs:", error);
      toast.error("載入文章失敗");
      setBlogsData((prev) => ({ ...prev, isLoading: false }));
    }
  }, [page, activeFilter, cacheKey, handleViewBlog, handleEditBlog, handleShowDeleteModal]);

  useEffect(() => {
    fetchBlogs();
  }, [fetchBlogs]);

  // Memoized components
  const MemoizedSearchFilter = useMemo(() => (
    <SearchFilter
      filterFields={getFilterConfig('blogs')}
      onFilter={handleFilter}
      onClear={handleClearFilter}
      disabled={blogsData.isLoading}
      placeholder="輸入搜尋內容..."
    />
  ), [handleFilter, handleClearFilter, blogsData.isLoading]);

  const MemoizedPageContent = useMemo(() => (
    <PageContent
      title="文章"
      icon={<FaBlog />}
      data={blogsData}
      page="blogs"
      onRefresh={fetchBlogs}
      onCreate={handleCreate}
      onDelete={handleDeleteBlog}
      onEdit={handleEditBlog}
      onView={handleViewBlog}
    />
  ), [blogsData, fetchBlogs, handleCreate, handleDeleteBlog, handleEditBlog, handleViewBlog]);

  return (
    <>
      {MemoizedSearchFilter}
      
      {MemoizedPageContent}

      {totalPages > 1 && (
        <Pagination
          page={page}
          totalPages={totalPages}
          onPrevPage={handlePrevPage}
          onNextPage={handleNextPage}
          isLoading={blogsData.isLoading}
        />
      )}

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

export default memo(Blogs);
