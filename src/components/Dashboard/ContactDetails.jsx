import React, { useState, useEffect } from "react";
import { FaAddressCard, FaEdit } from "react-icons/fa";
import PageContent from "./PageContent";
import { api } from "../../config/api";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const ContactDetails = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [contactDetailsData, setContactDetailsData] = useState({
    fields: {
      phone: "電話",
      email: "信箱",
      address: "地址",
      address_mandarin: "地址（中文）",
      city: "城市",
      city_mandarin: "城市（中文）",
      county: "縣市",
      county_mandarin: "縣市（中文）",
      postal_code: "郵遞區號",
      country: "國家",
      country_mandarin: "國家（中文）",
      latitude: "緯度",
      longitude: "經度",
      facebook: "Facebook",
      instagram: "Instagram",
      whatsapp: "WhatsApp",
      line: "Line",
    },
    data: [],
    isLoading: true,
    options: {
      create: false,
      edit: true,
    },
  });

  const ITEMS_PER_PAGE = 8;

  useEffect(() => {
    fetchContactDetails();
  }, [page]);

  const fetchContactDetails = async () => {
    try {
      setContactDetailsData((prev) => ({ ...prev, isLoading: true }));
      const response = await api.get(
        `/contact-details/?page=${page}&page_size=${ITEMS_PER_PAGE}`
      );
      console.log("Contact details response:", response.data);

      const transformedData = response.data.results.map((item) => ({
        id: item.id,
        phone: item.phone || "未指定",
        email: item.email || "未指定",
        address: item.address || "未指定",
        city: item.city || "未指定",
        county: item.county || "未指定",
        postal_code: item.postal_code || "未指定",
        country: item.country || "未指定",
        latitude: item.latitude || "未指定",
        longitude: item.longitude || "未指定",
        facebook: item.facebook || "未指定",
        instagram: item.instagram || "未指定",
        whatsapp: item.whatsapp || "未指定",
        line: item.line || "未指定",
        address_mandarin: item.address_mandarin || "未指定",
        city_mandarin: item.city_mandarin || "未指定",
        county_mandarin: item.county_mandarin || "未指定",
        country_mandarin: item.country_mandarin || "未指定",

        actions: (
          <div className="action-cell">
            <button
              className="action-btn edit"
              onClick={() => handleEditContact(item.id)}
              title="編輯聯絡資訊"
            >
              <FaEdit />
            </button>
          </div>
        ),
      }));

      setContactDetailsData((prev) => ({
        ...prev,
        data: transformedData,
        isLoading: false,
      }));
    } catch (error) {
      console.error("Error fetching contact details:", error);
      toast.error("載入聯絡資訊失敗");
      setContactDetailsData((prev) => ({ ...prev, isLoading: false }));
    }
  };

  const handleEditContact = (id) => {
    navigate(`/dashboard/contact-details/edit/${id}`);
  };

  return (
    <PageContent
      title="聯絡資訊"
      icon={<FaAddressCard />}
      data={contactDetailsData}
      page="contactDetails"
      onRefresh={fetchContactDetails}
    />
  );
};

export default ContactDetails;
