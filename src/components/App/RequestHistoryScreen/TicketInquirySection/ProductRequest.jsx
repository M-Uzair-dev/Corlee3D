import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const ProductRequest = (props) => {
  const isMandarin = localStorage.getItem("isMandarin");
  const item = props.item;
  const [counter, setCounter] = useState(0);
  const navigate = useNavigate();
  const [images, setImages] = useState([]);
  const updateCounter = () => {
    const width = window.innerWidth;

    if (width < 438) {
      setCounter(5);
    } else if (width < 644) {
      setCounter(4);
    } else if (width < 870) {
      setCounter(3);
    } else if (width < 1100) {
      setCounter(2);
    } else if (width < 1320) {
      setCounter(1);
    } else {
      setCounter(0);
    }
  };
  useEffect(() => {
    updateCounter();
    window.addEventListener("resize", updateCounter);

    return () => window.removeEventListener("resize", updateCounter);
  }, []);
  useEffect(() => {
    const tempimages = item?.related_order?.items?.map((orderItem) => {
      const image = orderItem?.fabric?.color_images?.find(
        (colorImage) => colorImage.color === orderItem.color
      );
      return image ? image.primary_image_url : null;
    });
    console.log("tempimages", tempimages);
    setImages(tempimages.filter(Boolean)); // Filter out any null values
  }, [item]);

  return (
    <div
      className="productinquiry"
      style={{ cursor: "pointer" }}
      onClick={() => {
        navigate(`/user/productrequest/${item.id}`);
      }}
    >
      <div className="infotext">
        <p className="ticket">
          {isMandarin ? "票號" : "Ticket Number"} : {item.request_number}
        </p>
        <p className="inqtext">
          {isMandarin ? "產品請求" : "Products Request"}
        </p>
      </div>
      <div className="otherdata2">
        <div
          className="productimages"
          style={
            images.length >= 6 - counter
              ? { justifyContent: "space-between" }
              : { justifyContent: "flex-start" }
          }
        >
          {images.slice(0, 6 - counter)?.map((image, index) => (
            <div className="productimagediv">
              <div
                className="imageofproduct"
                key={index}
                style={{ backgroundImage: `url(${image})` }}
              >
                {images.length - 6 + counter > 0 && (
                  <p className="imagetext">+{images.length - 6 + counter}</p>
                )}
              </div>

              <div
                className={
                  images.length - 6 + counter > 0
                    ? "imagedetailsdiv hasoverflown"
                    : "imagedetailsdiv"
                }
              >
                <p className="ticketnumber">
                  {item?.related_order?.items[index]?.fabric?.item_code}
                </p>{" "}
                <p className="lengthofimagediv">
                  {item?.related_order?.items[index]?.quantity}yd
                </p>{" "}
              </div>
            </div>
          ))}
        </div>
      </div>{" "}
      <div className="datediv">
        <p className="datep">
          {isMandarin ? "日期" : "Date"} : {props.date}
        </p>
      </div>
    </div>
  );
};

export default ProductRequest;
