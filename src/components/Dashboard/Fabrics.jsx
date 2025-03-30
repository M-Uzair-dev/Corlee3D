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
      title: "string",
      category: "string",
      "Item Code": "string",
      "Hot Selling": "boolean",
    },
    data: [],
    isLoading: true,
    options: {
      edit: true,
      delete: true,
      view: true,
    },
  });

  const ITEMS_PER_PAGE = 8; // We're retrieving 8 items per page

  useEffect(() => {
    fetchFabrics();
  }, [page]);

  const fetchFabrics = async () => {
    try {
      setFabricsData((prev) => ({ ...prev, isLoading: true }));
      const response = await api.get(`/fabrics/?page=${page}`);
      console.log(response.data);
      if (response.data.results) {
        // Transform API data to match table structure
        const transformedData = response.data.results.map((fabric) => ({
          title: fabric.title || "Unnamed",
          category: fabric.product_category_name || "Uncategorized",
          "Item Code": fabric.item_code || "N/A",
          "Hot Selling": fabric.is_hot_selling || false,
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
      toast.error("Failed to load fabrics data");
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
    toast.success("Fabric deleted successfully");
    // Refetch fabrics to update the list
    fetchFabrics();
  };

  // Create pagination UI component
  const Pagination = () => (
    <div className="pagination-controls">
      <button
        className="pagination-btn"
        onClick={handlePrevPage}
        disabled={page <= 1 || fabricsData.isLoading}
      >
        <FaChevronLeft /> Previous
      </button>
      <span className="pagination-info">
        Page {page} of {totalPages}
      </span>
      {page < totalPages && (
        <button
          className="pagination-btn"
          onClick={handleNextPage}
          disabled={fabricsData.isLoading}
        >
          Next <FaChevronRight />
        </button>
      )}
    </div>
  );

  return (
    <>
      <PageContent
        title="Fabrics"
        icon={<FaBox />}
        data={fabricsData}
        page="fabric"
        onDelete={handleDeleteSuccess}
      />
      {totalPages > 1 && <Pagination />}
    </>
  );
};

export default Fabrics;
