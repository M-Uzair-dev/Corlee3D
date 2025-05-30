import { useNavigate } from "react-router-dom";
import { api } from "../../../../config/api";
import RequestHistorySection from "../RequestHistorySection";
import "./style.css";
import React, { useState, useEffect } from "react";
import Productinquiry from "./Productinquiry";
import ProductRequest from "./ProductRequest";
import GeneralInquiry from "./GeneralInquiry";
import { TailSpin } from "react-loader-spinner";

function TicketInquirySection({ ticketInquiriesData }) {
  const isMandarin = localStorage.getItem("isMandarin");
  const [data, setData] = useState([]);
  const [noData, setNoData] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  function formatDate(inputDate) {
    const date = new Date(inputDate);
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const dayOfWeek = days[date.getUTCDay()];
    const day = date.getUTCDate();
    const month = months[date.getUTCMonth()];
    const year = date.getUTCFullYear();
    return `${dayOfWeek} ${month} ${day} ${year}`;
  }

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await api.get("/contact-requests/");
      console.log("History Response :", response);
      if (response.status === 200) {
        if (response?.data?.results?.length > 0) {
          setData(response.data.results);
          setNoData(false);
          setLoading(false);
        } else {
          setNoData(true);
          setLoading(false);
        }
      } else {
        setNoData(true);
        setLoading(false);
      }
    } catch (e) {
      console.error(e);
      setLoading(false);
      // navigate("/");
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="request-history-container2">
      <RequestHistorySection />
      <div className="resultspage">
        {loading ? (
          <div
            className="spinner"
            style={{
              margin: "30px auto",
              width: "100%",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <TailSpin
              visible={true}
              height="60"
              width="60"
              color="#000"
              ariaLabel="tail-spin-loading"
              radius="1"
              wrapperStyle={{}}
              wrapperClass=""
            />
          </div>
        ) : noData ? (
          <div
            className="spinner"
            style={{
              margin: "30px auto",
              width: "100%",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <h3 style={{ textAlign: "center", fontSize: "20px" }}>
              {isMandarin ? "沒有歷史記錄" : "No history found"}
            </h3>
          </div>
        ) : (
          <>
            {" "}
            <div className="resultsfound">
              {isMandarin ? (
                <p>
                  {data?.length} {data?.length > 1 ? "個結果 " : "個結果 "}{" "}
                  已找到
                </p>
              ) : (
                <p>
                  {data?.length} {data?.length > 1 ? "results " : "result "}
                  found
                </p>
              )}
            </div>
            {data.map((item, index) =>
              item.request_type == "general" ? (
                <GeneralInquiry
                  key={index}
                  item={item}
                  date={formatDate(item.created_at)}
                />
              ) : item.request_type == "product" ? (
                <Productinquiry
                  key={index}
                  item={item}
                  date={formatDate(item.created_at)}
                />
              ) : (
                <ProductRequest
                  key={index}
                  item={item}
                  date={formatDate(item.created_at)}
                />
              )
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default TicketInquirySection;
