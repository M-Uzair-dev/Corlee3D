import React, { useState, useEffect } from "react";
import { FaBlog, FaEdit, FaTrash, FaEye } from "react-icons/fa";
import PageContent from "./PageContent";
import { api } from "../../config/api";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const Blogs = () => {
  const navigate = useNavigate();
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
  }, []);

  const fetchBlogs = async () => {
    try {
      setBlogData((prev) => ({ ...prev, isLoading: true }));
      const response = await api.get("/blogs/");
      console.log("Blogs response:", response.data);

      const transformedData = response.data.results.map((blog) => ({
        id: blog.id,
        title: blog.title || "Untitled",
        category: blog.category_name || "Uncategorized",
        author: blog.author_name || "Unknown Author",
        view_count: blog.view_count || 0,
        created_at: new Date(blog.created_at).toLocaleDateString(),
      }));

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

  const handleDeleteBlog = async (id) => {
    console.log("handleDeleteBlog called with id:", id);
    try {
      // Just refresh the list since the item has already been deleted
      console.log("Refreshing blog list after deletion");
      await fetchBlogs();
    } catch (error) {
      console.error("Error refreshing blog list:", error);
      toast.error("Failed to refresh blog list");
    }
  };

  const handleCreate = () => {
    navigate("/dashboard/blogs/create");
  };

  return (
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
    />
  );
};

export default Blogs;
