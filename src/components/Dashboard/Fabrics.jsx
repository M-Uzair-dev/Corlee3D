import React, { useState, useEffect } from "react";
import {
  FaBox,
  FaChevronLeft,
  FaChevronRight,
  FaDownload,
} from "react-icons/fa";
import PageContent from "./PageContent";
import { api } from "../../config/api";
import { toast } from "sonner";
import Edit from "../Edit";
import SearchFilter from "../UI/SearchFilter";
import { getFilterConfig } from "../../config/filterConfig";

const Fabrics = () => {
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [activeFilter, setActiveFilter] = useState(null);
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
  }, [page, activeFilter]);

  const fetchFabrics = async () => {
    try {
      setFabricsData((prev) => ({ ...prev, isLoading: true }));

      let apiUrl = `/fabrics/?page=${page}&page_size=${ITEMS_PER_PAGE}&sort_by=newest`;

      if (activeFilter) {
        apiUrl += `&${activeFilter.field}=${encodeURIComponent(
          activeFilter.value
        )}`;
      }

      const response = await api.get(apiUrl);
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

  const handleFilter = (filterData) => {
    setActiveFilter(filterData);
    setPage(1);
  };

  const handleClearFilter = () => {
    setActiveFilter(null);
    setPage(1);
  };

  const handleDownload = async () => {
    try {
      toast.info("開始下載布料數據...");

      const response = await api.get("/download/fabrics/", {
        responseType: "blob",
      });

      // Create blob URL and download
      const blob = new Blob([response.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;

      // Generate filename with current date/time
      const now = new Date();
      const timestamp = now
        .toISOString()
        .replace(/[-:]/g, "")
        .replace(/\.\d{3}Z/, "");
      link.download = `fabrics_data_${timestamp}.xlsx`;

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success("布料數據下載成功！");
    } catch (error) {
      console.error("Error downloading fabrics:", error);
      toast.error("下載布料數據失敗");
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
      <div className="fabrics-header">
        <div className="header-left">
          <h2 className="page-title">布料管理</h2>
        </div>
        <div className="header-center">
          <SearchFilter
            onFilter={handleFilter}
            onClear={handleClearFilter}
            disabled={fabricsData.isLoading}
            placeholder="輸入關鍵字搜尋..."
            keywordOnly={true}
          />
        </div>
        <div className="header-right">
          <button
            className="download-btn"
            onClick={handleDownload}
            disabled={fabricsData.isLoading}
            title="下載布料數據"
          >
            <FaDownload />
            <span className="btn-text">下載數據</span>
          </button>
        </div>
      </div>

      <PageContent
        title="布料"
        icon={<FaBox />}
        data={fabricsData}
        page="fabric"
        onDelete={handleDeleteSuccess}
        onBulkDelete={handleBulkDelete}
      />
      {totalPages > 1 && <Pagination />}

      <style jsx>{`
        .fabrics-header {
          display: grid;
          grid-template-columns: 1fr 2fr 1fr;
          align-items: center;
          gap: 24px;
          margin-bottom: 32px;
          padding: 20px 24px;
          background: #fff;
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
          border: 1px solid #e5e7eb;
        }

        .header-left {
          display: flex;
          align-items: center;
        }

        .page-title {
          margin: 0;
          font-size: 24px;
          font-weight: 600;
          color: #1f2937;
        }

        .header-center {
          display: flex;
          justify-content: center;
        }

        .header-right {
          display: flex;
          justify-content: flex-end;
        }

        .download-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 24px;
          background: linear-gradient(135deg, #059669, #047857);
          color: white;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-size: 14px;
          font-weight: 600;
          transition: all 0.3s ease;
          white-space: nowrap;
          box-shadow: 0 2px 4px rgba(5, 150, 105, 0.2);
        }

        .download-btn:hover:not(:disabled) {
          background: linear-gradient(135deg, #047857, #065f46);
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(5, 150, 105, 0.3);
        }

        .download-btn:active:not(:disabled) {
          transform: translateY(0);
        }

        .download-btn:disabled {
          background: #9ca3af;
          cursor: not-allowed;
          transform: none;
          box-shadow: none;
        }

        .btn-text {
          display: inline;
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

        /* Tablet Responsive */
        @media (max-width: 1024px) {
          .fabrics-header {
            grid-template-columns: 1fr;
            gap: 16px;
            text-align: center;
          }

          .header-left,
          .header-center,
          .header-right {
            justify-content: center;
          }

          .page-title {
            font-size: 20px;
          }
        }

        /* Mobile Responsive */
        @media (max-width: 768px) {
          .fabrics-header {
            padding: 16px 20px;
            margin-bottom: 24px;
            gap: 12px;
          }

          .page-title {
            font-size: 18px;
          }

          .download-btn {
            padding: 10px 20px;
            font-size: 13px;
          }
        }

        /* Small Mobile */
        @media (max-width: 480px) {
          .fabrics-header {
            padding: 12px 16px;
            border-radius: 8px;
          }

          .page-title {
            font-size: 16px;
          }

          .download-btn {
            padding: 8px 16px;
          }
        }
      `}</style>
    </>
  );
};

export default Fabrics;
