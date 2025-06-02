import React, { useState, useEffect } from "react";
import { FaBox, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import PageContent from "./PageContent";
import { api } from "../../config/api";
import { toast } from "sonner";
import Edit from "../Edit";

const Fabrics = () => {
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [fabricsData, setFabricsData] = useState({
    fields: {
      title: "標題",
      category: "商品種類",
      item_code: "商品編號",
      hot_selling: "熱銷商品",
      id: "ID",
    },
    data: [],
    isLoading: true,
    options: {
      create: true,
      edit: true,
      delete: true,
      view: true,
      bulkDelete: true,
    },
  });

  const ITEMS_PER_PAGE = 8;

  useEffect(() => {
    fetchFabrics();
  }, [page]);

  const fetchFabrics = async () => {
    try {
      setFabricsData((prev) => ({ ...prev, isLoading: true }));
      const response = await api.get(
        `/fabrics/?page=${page}&page_size=${ITEMS_PER_PAGE}&sort_by=newest`
      );
      console.log(response.data);
      if (response.data.results) {
        // Transform API data to match table structure
        const transformedData = response.data.results.map((fabric) => ({
          title: fabric.title || "未命名",
          category: fabric.product_category_name || "未分類",
          item_code: fabric.item_code || "無",
          hot_selling: fabric.is_hot_selling ? "是" : "否",
          id: fabric.id,
        }));

        // Calculate total pages based on count and items per page (8)
        const totalCount = response.data.count || 0;
        const calculatedTotalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

        setTotalPages(calculatedTotalPages);
        setFabricsData((prev) => ({
          ...prev,
          data: transformedData,
          isLoading: false,
        }));
      }
    } catch (error) {
      console.error("Error fetching fabrics:", error);
      toast.error("載入布料數據失敗");
      setFabricsData((prev) => ({ ...prev, isLoading: false }));
    }
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

  const handleDeleteSuccess = (deletedId) => {
    toast.success("布料刪除成功");
    // Refetch fabrics to update the list
    fetchFabrics();
  };

  const handleBulkDelete = async (selectedIds) => {
    try {
      console.log("Bulk deleting fabrics with IDs:", selectedIds);
      const response = await api.post("/fabrics/bulk-delete/", {
        fabric_ids: selectedIds,
      });
      console.log("Bulk delete response:", response.data);
      toast.success(`${selectedIds.length} 個布料刪除成功`);
      // Refetch fabrics to update the list
      fetchFabrics();
    } catch (error) {
      console.error("Error bulk deleting fabrics:", error);
      toast.error(error.response?.data?.error || "刪除所選布料失敗");
    }
  };

  // Create pagination UI component
  const Pagination = () => (
    <div className="pagination-controls">
      <button
        className="pagination-btn"
        onClick={handlePrevPage}
        disabled={page <= 1 || fabricsData.isLoading}
      >
        <FaChevronLeft /> 上一頁
      </button>
      <span className="pagination-info">
        第 {page} 頁，共 {totalPages} 頁
      </span>
      {page < totalPages && (
        <button
          className="pagination-btn"
          onClick={handleNextPage}
          disabled={fabricsData.isLoading}
        >
          下一頁 <FaChevronRight />
        </button>
      )}
    </div>
  );

  return (
    <>
      <PageContent
        title="布料"
        icon={<FaBox />}
        data={fabricsData}
        page="fabric"
        onDelete={handleDeleteSuccess}
        onBulkDelete={handleBulkDelete}
      />
      {totalPages > 1 && <Pagination />}
    </>
  );
};

export default Fabrics;
