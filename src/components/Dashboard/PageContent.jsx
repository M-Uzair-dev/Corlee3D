import React from "react";
import Table from "./Table";
import { useNavigate } from "react-router-dom";

const PageContent = ({
  title,
  icon,
  data,
  children,
  page,
  onDelete,
  onCreate,
  onEdit,
  onView,
  onBulkDelete,
  currentPage = 1,
  totalPages = 1,
  onPageChange,
}) => {
  const navigate = useNavigate();

  const getCreateRoute = () => {
    switch (page) {
      case "fabric":
        return `/dashboard/fabrics/create`;
      case "colorCategory":
        return `/dashboard/color-categories/create`;
      case "fabricCategory":
        return `/dashboard/fabric-categories/create`;
      case "user":
        return `/dashboard/users/create`;
      case "blogs":
        return `/dashboard/blogs/create`;
      case "order":
        return `/dashboard/orders/create`;
      case "blogCategory":
        return `/dashboard/blog-categories/create`;
      case "contactRequest":
        return null;
      case "event":
        return `/dashboard/events/create`;
      default:
        return `/dashboard`;
    }
  };

  const handleCreate = () => {
    if (onCreate) {
      onCreate();
    } else {
      const route = getCreateRoute();
      if (route) {
        navigate(route);
      }
    }
  };

  return (
    <div className="dashboard-content">
      <div className="page-header">
        <h1 className="page-title">{title}</h1>
        <div className="page-actions"></div>
      </div>

      {data ? (
        <div className="content-card">
          <Table
            fields={data.fields}
            data={data.data}
            isLoading={data.isLoading}
            options={{
              ...data.options,
              create:
                page === "order" ||
                title === "Contact Details" ||
                title === "Contact Requests"
                  ? false
                  : true,
            }}
            page={page}
            onDelete={onDelete}
            onBulkDelete={onBulkDelete}
            onCreate={handleCreate}
            onEdit={onEdit}
            onView={onView}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={onPageChange}
          />
          {children}
        </div>
      ) : (
        <div className="empty-content">
          <div className="empty-icon">{icon}</div>
          <p className="empty-text">{title}的內容將在此處實現。</p>
          <button className="btn btn-secondary">了解更多</button>
        </div>
      )}
    </div>
  );
};

export default PageContent;
