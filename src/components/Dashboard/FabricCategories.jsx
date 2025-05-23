import React, { useState, useEffect } from "react";
import {
  FaFolder,
  FaListOl,
  FaSave,
  FaTimes,
  FaArrowUp,
  FaArrowDown,
} from "react-icons/fa";
import PageContent from "./PageContent";
import { api } from "../../config/api";
import { toast } from "sonner";
import LoadingSpinner from "../UI/LoadingSpinner";
import "./FabricCategories.css";

const FabricCategories = () => {
  const [categoriesData, setCategoriesData] = useState({
    fields: {
      id: "ID",
      name: "布種名稱",
      description: "描述",
      image_preview: "布種圖片",
    },
    data: [],
    isLoading: true,
    options: {
      edit: true,
      delete: true,
    },
  });

  const [reorderMode, setReorderMode] = useState(false);
  const [reorderedCategories, setReorderedCategories] = useState([]);
  const [savingOrder, setSavingOrder] = useState(false);

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
          name: category.name || "未命名",
          id: category.id,
          description: category.description || "無描述",
          order: category.order || 0,
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
          // Store the original image URL for reordering view
          image_url: category.image_url,
        }));

        setCategoriesData((prev) => ({
          ...prev,
          data: transformedData,
          isLoading: false,
        }));

        setReorderedCategories(transformedData);
      }
    } catch (error) {
      console.error("Error fetching fabric categories:", error);
      toast.error("載入布種失敗");
      setCategoriesData((prev) => ({ ...prev, isLoading: false }));
    }
  };

  const handleDeleteSuccess = (deletedId) => {
    toast.success("布種刪除成功");
    // Refetch categories to update the list
    fetchCategories();
  };

  // Arrow-based reordering methods
  const moveItem = (fromIndex, toIndex) => {
    const items = Array.from(reorderedCategories);
    const [movedItem] = items.splice(fromIndex, 1);
    items.splice(toIndex, 0, movedItem);

    setReorderedCategories(items);
  };

  const moveItemUp = (index) => {
    if (index > 0) {
      moveItem(index, index - 1);
    }
  };

  const moveItemDown = (index) => {
    if (index < reorderedCategories.length - 1) {
      moveItem(index, index + 1);
    }
  };

  const saveNewOrder = async () => {
    try {
      setSavingOrder(true);

      // Prepare data for the API
      const categories = reorderedCategories.map((category, index) => ({
        id: category.id,
        order: index,
      }));

      // Call the reorder API endpoint
      const response = await api.post("/product-categories/reorder/", {
        categories,
      });

      if (response.status === 200) {
        toast.success("布種排序成功");
        setReorderMode(false);
        fetchCategories(); // Refetch to get the latest order from the server
      }
    } catch (error) {
      console.error("Error saving category order:", error);
      toast.error("儲存布種排序失敗");
    } finally {
      setSavingOrder(false);
    }
  };

  const cancelReordering = () => {
    setReorderMode(false);
    // Reset to original order by refetching
    fetchCategories();
  };

  if (reorderMode) {
    return (
      <div className="reorder-container">
        <div className="reorder-header">
          <h1>重新排序布種</h1>
          <div className="reorder-actions">
            <button
              className="btn btn-secondary"
              onClick={cancelReordering}
              disabled={savingOrder}
            >
              <FaTimes /> 取消
            </button>
            <button
              className="btn btn-primary save-btn"
              onClick={saveNewOrder}
              disabled={savingOrder}
            >
              {savingOrder ? (
                <>
                  <LoadingSpinner small /> 儲存中...
                </>
              ) : (
                <>
                  <FaSave /> 儲存排序
                </>
              )}
            </button>
          </div>
        </div>

        <div className="reorder-instructions">
          <b>如何重新排序：</b>{" "}
          使用上下箭頭按鈕更改每個布種的位置。變更將不會被儲存，直到您點擊「儲存排序」。
        </div>

        <div className="categories-list">
          {reorderedCategories.map((category, index) => (
            <div key={String(category.id)} className="category-item">
              <div className="category-content">
                <div className="category-info">
                  <div className="category-name">{category.name}</div>
                  <div className="category-description">
                    {category.description}
                  </div>
                </div>
              </div>
              <div className="category-controls">
                <div className="category-actions">
                  <button
                    className="btn-move btn-move-up"
                    onClick={() => moveItemUp(index)}
                    disabled={index === 0}
                    title="上移"
                  >
                    <FaArrowUp />
                  </button>
                  <button
                    className="btn-move btn-move-down"
                    onClick={() => moveItemDown(index)}
                    disabled={index === reorderedCategories.length - 1}
                    title="下移"
                  >
                    <FaArrowDown />
                  </button>
                </div>
                <div className="category-position">
                  <span>{index + 1}</span> / {reorderedCategories.length}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="page-actions">
        <button
          className="btn btn-secondary reorder-btn"
          style={{ margin: "20px" }}
          onClick={() => setReorderMode(true)}
        >
          <FaListOl /> 重新排序布種
        </button>
      </div>
      <PageContent
        title="布種"
        icon={<FaFolder />}
        data={categoriesData}
        page="fabricCategory"
        onDelete={handleDeleteSuccess}
      />
    </>
  );
};

export default FabricCategories;
