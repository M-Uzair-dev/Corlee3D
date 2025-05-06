import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Edit from "../../components/Edit";
import { api } from "../../config/api";
import { toast } from "sonner"; // Assuming you use sonner for notifications
import { handleApiError } from "../../util/errorHandling";
import "./EditPages.css";

// Sample mock data for testing - will be replaced with API calls later
const mockData = {
  fabric: {
    title: "Premium Cotton",
    item_code: "FAB-2023-001",
    description: "High-quality cotton fabric for premium clothing",
    price: 24.99,
    is_hot_selling: true,
    product_category_name: "Cotton",
  },
  colorCategory: {
    name: "Pastel",
    description: "Soft, light colors with low saturation",
    hex_code: "#E8D3A9",
  },
  user: {
    name: "John Doe",
    email: "john.doe@example.com",
    phone_number: "+1 (555) 123-4567",
    company: "Acme Corp",
    role: "Customer",
  },
  fabricCategory: {
    name: "Cotton",
    description: "Natural fabric made from cotton plants",
  },
  blog: {
    title: "Trends in Sustainable Fabrics",
    content: "Sustainable fabrics are becoming increasingly popular...",
    author: "Jane Smith",
    publish_date: "2023-05-15",
    is_published: true,
  },
  order: {
    order_number: "ORD-2023-10254",
    customer_name: "Sarah Williams",
    product: "Premium Cotton Fabric",
    quantity: 15,
    total_price: 374.85,
    status: "Processing",
    order_date: "2023-06-22",
  },
  blogCategory: {
    name: "Fashion Trends",
    description: "Latest trends in fashion and textile industry",
    slug: "fashion-trends",
    is_active: true,
  },
  contactDetails: {
    address: "123 Fabric Street, Textile City",
    phone: "+1 (555) 987-6543",
    email: "contact@example.com",
    business_hours: "Monday to Friday, 9 AM - 5 PM",
    map_location: "40.7128° N, 74.0060° W",
  },
  contactRequest: {
    name: "Michael Brown",
    email: "michael@example.com",
    subject: "Product Inquiry",
    message: "I'd like to know more about your premium fabric collection...",
    date_submitted: "2023-07-10",
    status: "Pending",
  },
  event: {
    title: "Textile Industry Expo 2023",
    location: "San Francisco Convention Center",
    start_date: "2023-09-15",
    end_date: "2023-09-18",
    description:
      "Annual exhibition featuring the latest innovations in textile manufacturing and design",
    is_featured: true,
    registration_link: "https://example.com/events/textile-expo-2023",
    image_url: "https://example.com/images/events/textile-expo-2023.jpg",
  },
};

const EditPageTemplate = ({
  entityName,
  fetchEndpoint,
  updateEndpoint,
  redirectPath,
  entityType,
}) => {
  const [data, setData] = useState(null);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    // Simulate loading data
    setIsLoadingData(true);

    // For now, use mock data
    setTimeout(() => {
      setData(mockData[entityType] || {});
      setIsLoadingData(false);
    }, 1000);

    // Actual API fetch code (commented out for now)
    /*
    const fetchData = async () => {
      setIsLoadingData(true);
      setErrorMessage(null);
      setFieldErrors({});
      try {
        const response = await api.get(`${fetchEndpoint}/${id}`);
        setData(response.data);
      } catch (error) {
        setErrorMessage(`Failed to load ${entityName}: ${error.message}`);
        toast.error(`Error loading ${entityName}`);
      } finally {
        setIsLoadingData(false);
      }
    };

    fetchData();
    */
  }, [id, fetchEndpoint, entityName, entityType]);

  const handleSubmit = async (formData) => {
    setIsSubmitting(true);
    setErrorMessage(null);
    setFieldErrors({});

    // Simulate API call with timeout
    setTimeout(() => {
      toast.success(`${entityName} updated successfully`);
      setIsSubmitting(false);
      navigate(redirectPath);
    }, 1500);

    // Actual API update code (commented out for now)
    /*
    try {
      await api.put(`${updateEndpoint}/${id}`, formData);
      toast.success(`${entityName} updated successfully`);
      navigate(redirectPath);
    } catch (error) {
      handleApiError(error, entityName, setErrorMessage, setFieldErrors, true);
      toast.error(`Error updating ${entityName}`);
      setIsSubmitting(false);
    }
    */
  };

  return (
    <div className="dashboard-content-card edit-page-container">
      <div className="edit-page-header">
        <button className="back-button" onClick={() => navigate(redirectPath)}>
          ← Back to List
        </button>
      </div>

      <Edit
        data={data}
        heading={`Edit ${entityName}`}
        onSubmit={handleSubmit}
        isLoading={isSubmitting}
        isLoadingData={isLoadingData}
        errorMessage={errorMessage}
        fieldErrors={fieldErrors}
      />
    </div>
  );
};

export default EditPageTemplate;
