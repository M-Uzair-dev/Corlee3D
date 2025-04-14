import React, { useState, useEffect } from "react";
import { FaTags, FaFolder } from "react-icons/fa";
import PageContent from "./PageContent";
import { api } from "../../config/api";
import { toast } from "sonner";
import LoadingSpinner from "../UI/LoadingSpinner";

const FabricCategories = () => {
  const [categoriesData, setCategoriesData] = useState({
    fields: {
      id: "ID",
      name: "Name",
      description: "Description",
      image_preview: "Image",
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
      const response = await api.get("/product-categories/");
      console.log(response.data);

      if (response.data.results) {
        // Transform API data to match table structure
        const transformedData = response.data.results.map((category) => ({
          name: category.name || "Unnamed",
          id: category.id,
          description: category.description || "No description",
          image_preview: category.image_url ? (
            <div
              style={{
                width: "36px",
                height: "36px",
                overflow: "hidden",
                borderRadius: "4px",
                margin: "0 auto",
              }}
            >
              <img
                src={category.image_url}
                alt={category.name}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
            </div>
          ) : (
            <div
              style={{
                width: "36px",
                height: "36px",
                backgroundColor: "#f0f0f0",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto",
              }}
            >
              <FaFolder size={16} color="#aaa" />
            </div>
          ),
        }));

        setCategoriesData((prev) => ({
          ...prev,
          data: transformedData,
          isLoading: false,
        }));
      }
    } catch (error) {
      console.error("Error fetching fabric categories:", error);
      toast.error("Failed to load fabric categories");
      setCategoriesData((prev) => ({ ...prev, isLoading: false }));
    }
  };

  const handleDeleteSuccess = (deletedId) => {
    toast.success("Fabric category deleted successfully");
    // Refetch categories to update the list
    fetchCategories();
  };

  return (
    <PageContent
      title="Fabric Categories"
      icon={<FaFolder />}
      data={categoriesData}
      page="fabricCategory"
      onDelete={handleDeleteSuccess}
    />
  );
};

export default FabricCategories;
