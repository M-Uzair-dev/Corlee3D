import React, { useEffect, useState } from "react";
import { Toaster } from "sonner";
import { api, setAuthToken } from "../config/api";
import { Outlet, useNavigate } from "react-router-dom";
const Token = () => {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  if (token) {
    setAuthToken(token);
  }

  const getinfo = async () => {
    const response = await api.get("/contact-details/");
    const data = response.data.results[0];
    if (response.status === 200) {
      localStorage.setItem("whatsapp", data.whatsapp);
      localStorage.setItem("postal_code", data.postal_code);
      localStorage.setItem("phone", data.phone);
      localStorage.setItem("longitude", data.longitude);
      localStorage.setItem("line", data.line);
      localStorage.setItem("latitude", data.latitude);
      localStorage.setItem("instagram", data.instagram);
      localStorage.setItem("facebook", data.facebook);
      localStorage.setItem("email", data.email);
      localStorage.setItem("country", data.country);
      localStorage.setItem("address", data.address);
    }
  };
  useEffect(() => {
    getinfo();
  }, []);
  const [emailNotVerified, setEmailNotVerified] = useState(false);

  const getUser = async () => {
    if (localStorage.getItem("token")) {
      const res = await api.get("/user/");
      if (res.status === 200) {
        if (!res.data.is_verified) {
          setEmailNotVerified(true);
        }
        if (!res.data.company_name) {
          navigate("/addCompanyDetails");
          localStorage.setItem("Company", "false");
        } else {
          localStorage.setItem("Company", "true");
        }
      }
    }
  };
  useEffect(() => {
    window.scrollTo(0, 0);
    getUser();
  }, []);

  return (
    <>
      <Toaster position="bottom-left" closeButton />
      {emailNotVerified && (
        <div className="noemailband">Verify your email address.</div>
      )}
      <Outlet />
    </>
  );
};

export default Token;
