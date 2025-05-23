import React, { useState, useEffect } from "react";
import { FaList } from "react-icons/fa";
import PageContent from "./PageContent";
import { api } from "../../config/api";
import { toast } from "sonner";

const BlogCategories = () => {
  const [categoriesData, setCategoriesData] = useState({
    fields: {
      id: "ID",
      name: "英文名稱",
      name_mandarin: "中文名稱",
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
          name: category.name || "未命名",
          name_mandarin: category.name_mandarin || "未命名",
        }));

        setCategoriesData((prev) => ({
          ...prev,
          data: transformedData,
          isLoading: false,
        }));
      }
    } catch (error) {
      console.error("Error fetching blog categories:", error);
      toast.error("載入文章分類失敗");
      setCategoriesData((prev) => ({ ...prev, isLoading: false }));
    }
  };

  const handleDeleteSuccess = (deletedId) => {
    toast.success("文章分類刪除成功");
    // Refetch categories to update the list
    fetchCategories();
  };

  return (
    <PageContent
      title="文章分類"
      icon={<FaList />}
      data={categoriesData}
      page="blogCategory"
      onDelete={handleDeleteSuccess}
    />
  );
};

export default BlogCategories;
