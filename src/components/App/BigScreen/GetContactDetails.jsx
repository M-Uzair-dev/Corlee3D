import React, { useState } from "react";
import { TailSpin } from "react-loader-spinner";
import { api } from "../../../config/api";
import { toast } from "sonner";

const GetContactDetails = (props) => {
  const isMandarin = localStorage.getItem("isMandarin");
  const user = props.user;

  const [email, setEmail] = React.useState(user.email);
  const [phone, setPhone] = React.useState(user.phone);
  const [loading, setLoading] = useState(false);

  const update = async () => {
    try {
      if (email === "" || phone === "") {
        toast.error(
          isMandarin ? "請填寫所有欄位" : "Please fill all the fields"
        );
        return;
      }
      setLoading(true);
      console.log({
        email,
        phone,
      });
      const response = await api.patch("/user/", {
        email,
        phone,
      });
      console.log(response);
      if (response.status === 200) {
        toast.success(isMandarin ? "更新成功" : "Details updated successfully");
        props.setUser({ ...user, email: email, phone: phone });
        props.setGetUserDetails("");
      } else {
        toast.error(
          response.data[Object.keys(response.data)[0]] ||
            (isMandarin ? "發生錯誤" : "Something went wrong")
        );
        props.setGetUserDetails("");
      }
    } catch (e) {
      toast.error(
        e.data[Object.keys(response.data)[0]] ||
          (isMandarin ? "發生錯誤" : "Something went wrong")
      );
      props.setGetUserDetails("");
      setLoading(false);
    }
  };

  return (
    <div
      className="detailsdivwrapper"
      onClick={() => {
        props.setGetUserDetails("");
      }}
    >
      <div
        className="detailsdivmaincontainer"
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <div
          className="closeiconindetaisdiv"
          onClick={() => {
            props.setGetUserDetails("");
          }}
        >
          <svg
            width="29"
            height="29"
            viewBox="0 0 29 29"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect
              x="1.15993"
              y="1.15993"
              width="25.976"
              height="25.976"
              rx="12.988"
              stroke="#666666"
              stroke-width="2.31986"
            />
            <path
              d="M19.5203 8.78488C19.4414 8.70583 19.3477 8.64311 19.2446 8.60032C19.1414 8.55753 19.0308 8.53551 18.9192 8.53551C18.8075 8.53551 18.6969 8.55753 18.5938 8.60032C18.4906 8.64311 18.3969 8.70583 18.318 8.78488L14.1483 12.946L9.97865 8.77635C9.89971 8.6974 9.80599 8.63478 9.70284 8.59206C9.59969 8.54933 9.48914 8.52734 9.3775 8.52734C9.26586 8.52734 9.1553 8.54933 9.05216 8.59206C8.94901 8.63478 8.85529 8.6974 8.77635 8.77635C8.6974 8.85529 8.63478 8.94901 8.59206 9.05216C8.54933 9.1553 8.52734 9.26586 8.52734 9.3775C8.52734 9.48914 8.54933 9.59969 8.59206 9.70284C8.63478 9.80599 8.6974 9.89971 8.77635 9.97865L12.946 14.1483L8.77635 18.318C8.6974 18.397 8.63478 18.4907 8.59206 18.5938C8.54933 18.697 8.52734 18.8075 8.52734 18.9192C8.52734 19.0308 8.54933 19.1414 8.59206 19.2445C8.63478 19.3477 8.6974 19.4414 8.77635 19.5203C8.85529 19.5993 8.94901 19.6619 9.05216 19.7046C9.1553 19.7473 9.26586 19.7693 9.3775 19.7693C9.48914 19.7693 9.59969 19.7473 9.70284 19.7046C9.80599 19.6619 9.89971 19.5993 9.97865 19.5203L14.1483 15.3506L18.318 19.5203C18.397 19.5993 18.4907 19.6619 18.5938 19.7046C18.697 19.7473 18.8075 19.7693 18.9192 19.7693C19.0308 19.7693 19.1414 19.7473 19.2445 19.7046C19.3477 19.6619 19.4414 19.5993 19.5203 19.5203C19.5993 19.4414 19.6619 19.3477 19.7046 19.2445C19.7473 19.1414 19.7693 19.0308 19.7693 18.9192C19.7693 18.8075 19.7473 18.697 19.7046 18.5938C19.6619 18.4907 19.5993 18.397 19.5203 18.318L15.3506 14.1483L19.5203 9.97865C19.8443 9.65463 19.8443 9.1089 19.5203 8.78488Z"
              fill="#666666"
            />
          </svg>
        </div>
        <h1>{isMandarin ? "聯絡資訊" : "Contact Details"}</h1>
        <p>
          {isMandarin ? "更新您的聯絡詳細資料" : "Update Your contact details"}
        </p>
        <div className="inputs">
          <div className="oneinput">
            <label htmlFor="name">{isMandarin ? "電子郵件" : "Email"}</label>
            <input
              type="text"
              id="name"
              placeholder={isMandarin ? "電子郵件" : "Email"}
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
              }}
            />
          </div>
          <div className="oneinput">
            <label htmlFor="cname">
              {isMandarin ? "電話號碼" : "Phone number"}
            </label>
            <input
              type="text"
              id="cname"
              placeholder={isMandarin ? "電話號碼" : "Phone number"}
              value={phone}
              onChange={(e) => {
                setPhone(e.target.value);
              }}
            />
          </div>
        </div>
        <button
          className="buttoninupdatediv"
          onClick={update}
          style={
            loading || (email === user.email && phone === user.phone)
              ? { opacity: "0.5", cursor: "not-allowed" }
              : {}
          }
          disabled={loading || (email === user.email && phone === user.phone)}
        >
          {loading ? (
            <TailSpin
              visible={true}
              height="30"
              width="30"
              color="#fff"
              ariaLabel="tail-spin-loading"
              radius="1"
              wrapperStyle={{}}
              wrapperClass=""
            />
          ) : isMandarin ? (
            "更新"
          ) : (
            "Update"
          )}
        </button>
      </div>
    </div>
  );
};

export default GetContactDetails;
