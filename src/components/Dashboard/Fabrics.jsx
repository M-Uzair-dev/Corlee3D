import React, { useState, useEffect } from "react";
import { FaBox, FaChevronLeft, FaChevronRight, FaDownload } from "react-icons/fa";
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
        apiUrl += `&${activeFilter.field}=${encodeURIComponent(activeFilter.value)}`;
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
      
      const response = await api.get('/download/fabrics/', {
        responseType: 'blob'
      });
      
      // Create blob URL and download
      const blob = new Blob([response.data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      });
      
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      
      // Generate filename with current date/time
      const now = new Date();
      const timestamp = now.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}Z/, '');
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
      <div className="page-header">
        <SearchFilter
          onFilter={handleFilter}
          onClear={handleClearFilter}
          disabled={fabricsData.isLoading}
          placeholder="輸入關鍵字搜尋..."
          keywordOnly={true}
        />
        <button
          className="download-btn"
          onClick={handleDownload}
          disabled={fabricsData.isLoading}
          title="下載布料數據"
        >
          <FaDownload /> 下載數據
        </button>
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
        .page-header {
          display: flex;
          align-items: flex-start;
          gap: 16px;
          margin-bottom: 20px;
        }
        
        .download-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 20px;
          background: #28a745;
          color: white;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-size: 14px;
          font-weight: 500;
          transition: all 0.2s;
          white-space: nowrap;
          margin-top: 16px;
        }
        
        .download-btn:hover:not(:disabled) {
          background: #218838;
          transform: translateY(-1px);
        }
        
        .download-btn:disabled {
          background: #6c757d;
          cursor: not-allowed;
          transform: none;
        }
        
        @media (max-width: 768px) {
          .page-header {
            flex-direction: column;
            align-items: stretch;
          }
          
          .download-btn {
            margin-top: 0;
          }
        }
      `}</style>
    </>
  );
};

export default Fabrics;
