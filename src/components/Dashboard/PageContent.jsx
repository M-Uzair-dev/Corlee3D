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
      case "contactDetails":
        return `/dashboard/contact-details/create`;
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
                page === "order" || page === "contactRequest" ? false : true,
            }}
            page={page}
            onDelete={onDelete}
            onCreate={handleCreate}
            onEdit={onEdit}
            onView={onView}
          />
          {children}
        </div>
      ) : (
        <div className="empty-content">
          <div className="empty-icon">{icon}</div>
          <p className="empty-text">
            Content for {title} will be implemented here.
          </p>
          <button className="btn btn-secondary">Learn More</button>
        </div>
      )}
    </div>
  );
};

export default PageContent;
