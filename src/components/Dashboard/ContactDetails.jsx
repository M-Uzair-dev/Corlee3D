import React, { useState, useEffect } from "react";
import { FaAddressCard, FaEdit } from "react-icons/fa";
import PageContent from "./PageContent";
import { api } from "../../config/api";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const ContactDetails = () => {
  const navigate = useNavigate();
  const [contactData, setContactData] = useState({
    fields: {
      phone: "Phone",
      email: "Email",
      address: "Address",
      city: "City",
      county: "County",
      postal_code: "Postal Code",
      country: "Country",
      latitude: "Latitude",
      longitude: "Longitude",
      facebook: "Facebook",
      instagram: "Instagram",
      whatsapp: "WhatsApp",
      line: "Line",
      actions: "Actions",
    },
    data: [],
    isLoading: true,
    options: {
      create: false,
      edit: false,
      delete: false,
      view: false,
    },
  });

  useEffect(() => {
    fetchContactDetails();
  }, []);

  const fetchContactDetails = async () => {
    try {
      setContactData((prev) => ({ ...prev, isLoading: true }));
      const response = await api.get("/contact-details/");
      console.log("Contact details response:", response.data);

      const transformedData = response.data.results.map((item) => ({
        id: item.id,
        phone: item.phone || "Not specified",
        email: item.email || "Not specified",
        address: item.address || "Not specified",
        city: item.city || "Not specified",
        county: item.county || "Not specified",
        postal_code: item.postal_code || "Not specified",
        country: item.country || "Not specified",
        latitude: item.latitude || "Not specified",
        longitude: item.longitude || "Not specified",
        facebook: item.facebook || "Not specified",
        instagram: item.instagram || "Not specified",
        whatsapp: item.whatsapp || "Not specified",
        line: item.line || "Not specified",
        actions: (
          <div className="action-cell">
            <button
              className="action-btn edit"
              onClick={() => handleEditContact(item.id)}
              title="Edit Contact Details"
            >
              <FaEdit />
            </button>
          </div>
        ),
      }));

      setContactData((prev) => ({
        ...prev,
        data: transformedData,
        isLoading: false,
      }));
    } catch (error) {
      console.error("Error fetching contact details:", error);
      toast.error("Failed to load contact details");
      setContactData((prev) => ({ ...prev, isLoading: false }));
    }
  };

  const handleEditContact = (id) => {
    navigate(`/dashboard/contact-details/edit/${id}`);
  };

  return (
    <PageContent
      title="Contact Details"
      icon={<FaAddressCard />}
      data={contactData}
      page="contactDetails"
      onRefresh={fetchContactDetails}
    />
  );
};

export default ContactDetails;
