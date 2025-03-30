import React, { useState, useEffect } from "react";
import { FaPalette } from "react-icons/fa";
import PageContent from "./PageContent";
import { api } from "../../config/api";
import { toast } from "sonner";

const ColorCategories = () => {
  const [colorData, setColorData] = useState({
    fields: {
      id: "ID",
      display_name: "Name",
      color: "Color",
      color_preview: "Preview",
    },
    data: [],
    isLoading: true,
    options: {
      edit: true,
      delete: true,
    },
  });

  useEffect(() => {
    fetchColors();
  }, []);

  const fetchColors = async () => {
    try {
      setColorData((prev) => ({ ...prev, isLoading: true }));
      const response = await api.get("/color-categories/");

      if (response.data) {
        // Transform API data to match table structure
        const transformedData = response.data.map((color) => ({
          id: color.id,
          display_name: color.display_name || "Unnamed",
          color: color.color || "#FFFFFF",
          color_preview: (
            <div
              style={{
                width: "24px",
                height: "24px",
                backgroundColor: color.color || "#FFFFFF",
                border: "1px solid #DDD",
                borderRadius: "4px",
                margin: "0 auto",
              }}
            />
          ),
        }));

        setColorData((prev) => ({
          ...prev,
          data: transformedData,
          isLoading: false,
        }));
      }
    } catch (error) {
      console.error("Error fetching color categories:", error);
      toast.error("Failed to load color categories");
      setColorData((prev) => ({ ...prev, isLoading: false }));
    }
  };

  const handleDeleteSuccess = (deletedId) => {
    toast.success("Color category deleted successfully");
    // Refetch colors to update the list
    fetchColors();
  };

  return (
    <PageContent
      title="Color Categories"
      icon={<FaPalette />}
      data={colorData}
      page="colorCategory"
      onDelete={handleDeleteSuccess}
    />
  );
};

export default ColorCategories;
