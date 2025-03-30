import React, { useState, useEffect } from "react";
import { FaUsers } from "react-icons/fa";
import PageContent from "./PageContent";
import { api } from "../../config/api";
import { toast } from "sonner";
import LoadingSpinner from "../UI/LoadingSpinner";

const Users = () => {
  const [usersData, setUsersData] = useState({
    fields: {
      id: "ID",
      name: "Name",
      email: "Email",
      company_name: "Company",
      phone: "Phone",
      is_staff: "Admin",
    },
    data: [],
    isLoading: true,
    options: {
      edit: true,
      delete: true,
      view: false,
    },
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setUsersData((prev) => ({ ...prev, isLoading: true }));
      const response = await api.get("/users/");
      console.log(response);
      if (response.data.results) {
        // Transform API data to match table structure
        const transformedData = response.data.results.map((user) => ({
          id: user.id,
          name: user.name || "Unnamed",
          email: user.email || "No email",
          company_name: user.company_name || "N/A",
          phone: user.phone || "N/A",
          is_staff: user.is_staff ? "Yes" : "No",
        }));

        setUsersData((prev) => ({
          ...prev,
          data: transformedData,
          isLoading: false,
        }));
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Failed to load users");
      setUsersData((prev) => ({ ...prev, isLoading: false }));
    }
  };

  const handleDeleteSuccess = () => {
    toast.success("User deleted successfully");
    // Refetch users to update the list
    fetchUsers();
  };

  return (
    <PageContent
      title="Users"
      icon={<FaUsers />}
      data={usersData}
      page="user"
      onDelete={handleDeleteSuccess}
    />
  );
};

export default Users;
