import React, { useState, useEffect } from "react";
import { FaList } from "react-icons/fa";
import PageContent from "./PageContent";
import { api } from "../../config/api";
import { toast } from "sonner";

const BlogCategories = () => {
  const [categoriesData, setCategoriesData] = useState({
    fields: {
      id: "ID",
      name: "Name",
    },
    data: [],
    isLoading: true,
    options: {
      edit: true,
      delete: true,
    },
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setCategoriesData((prev) => ({ ...prev, isLoading: true }));
      const response = await api.get("/blog-categories/");

      if (response.data) {
        // Transform API data to match table structure
        const transformedData = response.data.map((category) => ({
          id: category.id,
          name: category.name || "Unnamed",
        }));

        setCategoriesData((prev) => ({
          ...prev,
          data: transformedData,
          isLoading: false,
        }));
      }
    } catch (error) {
      console.error("Error fetching blog categories:", error);
      toast.error("Failed to load blog categories");
      setCategoriesData((prev) => ({ ...prev, isLoading: false }));
    }
  };

  const handleDeleteSuccess = (deletedId) => {
    toast.success("Blog category deleted successfully");
    // Refetch categories to update the list
    fetchCategories();
  };

  return (
    <PageContent
      title="Blog Categories"
      icon={<FaList />}
      data={categoriesData}
      page="blogCategory"
      onDelete={handleDeleteSuccess}
    />
  );
};

export default BlogCategories;
