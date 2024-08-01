import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { api } from "../../../config/api";
import { useDebounce } from "./useDebounce";

const Productinbag = (props) => {
  const text = "->";
  const navigate = useNavigate();
  const [product, setProduct] = useState(props.product.fabric);
  const [loading, setLoading] = useState(false);
  const [size, setSiz] = useState(props.product.quantity);
  const [selectedColor, setSelectedColor] = useState(props.product.color);

  const debouncedData = useDebounce(
    {
      color: selectedColor,
      quantity: size,
    },
    300
  );

  const update = async () => {
    try {
      if (
        debouncedData.color === product.color &&
        debouncedData.color === size
      ) {
        return;
      }
      const res = await api.patch(
        `/cart-items/${props.product.id}`,
        debouncedData
      );
      // Uncomment and implement this if necessary
      // if (res.status === 200) {
      //   props.loadDatafc();
      // }
    } catch (error) {
      console.error(error);
    }
  };

  const prevDebouncedData = useRef(debouncedData); // Store previous debouncedData

  useEffect(() => {
    if (
      debouncedData.color !== prevDebouncedData.current.color ||
      debouncedData.quantity !== prevDebouncedData.current.quantity
    ) {
      update();
      prevDebouncedData.current = debouncedData; // Update reference
    }
  }, [debouncedData]);

  const deleteproduct = async () => {
    try {
      const response = await api.delete(`/cart-items/${props.product.id}/`);
      if (response.status === 204) {
        toast.success("Item removed successfully");
        props.loadDatafc();
        setLoading(false);
        props.setRefresh(Date.now());
      }
    } catch (e) {
      toast.error(e.message || "Something went wrong");
      setLoading(false);
    }
  };
  return (
    <div className="productinbag">
      <div className="productinbadimagediv">
        <div
          className="image"
          style={{
            backgroundImage: `url(${product.photo_url})`,
            backgroundSize: "cover",
            cursor: "pointer",
          }}
          onClick={() => navigate(`/product/${product.id}`)}
        ></div>
        <div className="detailsofimage">
          <div className="textinbagproduct">
            <p>{product.item_code}</p>
            <p>
              {product.product_category_name}{" "}
              <span
                style={{
                  textWrap: "no-wrap",
                  whiteSpace: "nowrap",
                  display: "inline-block",
                }}
              >
                {text}
              </span>{" "}
              {product.finish}
            </p>
          </div>
          <button
            style={
              loading
                ? { cursor: "pointer", backgroundColor: "grey" }
                : { cursor: "pointer" }
            }
            onClick={() => {
              setLoading(true);
              deleteproduct();
            }}
            disabled={loading}
          >
            <svg
              width="30"
              height="32"
              viewBox="0 0 30 32"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M28.2 5.81818H22.8V4.07273C22.8 2.99257 22.3575 1.95666 21.5699 1.19287C20.7822 0.42909 19.7139 0 18.6 0H11.4C10.2861 0 9.2178 0.42909 8.43015 1.19287C7.6425 1.95666 7.2 2.99257 7.2 4.07273V5.81818H1.8C1.32261 5.81818 0.864773 6.00208 0.527208 6.32941C0.189642 6.65675 0 7.10071 0 7.56364C0 8.02656 0.189642 8.47052 0.527208 8.79786C0.864773 9.1252 1.32261 9.30909 1.8 9.30909H2.4V29.0909C2.4 29.8624 2.71607 30.6024 3.27868 31.1479C3.84129 31.6935 4.60435 32 5.4 32H24.6C25.3957 32 26.1587 31.6935 26.7213 31.1479C27.2839 30.6024 27.6 29.8624 27.6 29.0909V9.30909H28.2C28.6774 9.30909 29.1352 9.1252 29.4728 8.79786C29.8104 8.47052 30 8.02656 30 7.56364C30 7.10071 29.8104 6.65675 29.4728 6.32941C29.1352 6.00208 28.6774 5.81818 28.2 5.81818ZM10.8 4.07273C10.8 3.91842 10.8632 3.77043 10.9757 3.66132C11.0883 3.55221 11.2409 3.49091 11.4 3.49091H18.6C18.7591 3.49091 18.9117 3.55221 19.0243 3.66132C19.1368 3.77043 19.2 3.91842 19.2 4.07273V5.81818H10.8V4.07273ZM24 28.5091H6V9.30909H24V28.5091ZM13.2 13.9636V23.2727C13.2 23.7356 13.0104 24.1796 12.6728 24.5069C12.3352 24.8343 11.8774 25.0182 11.4 25.0182C10.9226 25.0182 10.4648 24.8343 10.1272 24.5069C9.78964 24.1796 9.6 23.7356 9.6 23.2727V13.9636C9.6 13.5007 9.78964 13.0567 10.1272 12.7294C10.4648 12.4021 10.9226 12.2182 11.4 12.2182C11.8774 12.2182 12.3352 12.4021 12.6728 12.7294C13.0104 13.0567 13.2 13.5007 13.2 13.9636ZM20.4 13.9636V23.2727C20.4 23.7356 20.2104 24.1796 19.8728 24.5069C19.5352 24.8343 19.0774 25.0182 18.6 25.0182C18.1226 25.0182 17.6648 24.8343 17.3272 24.5069C16.9896 24.1796 16.8 23.7356 16.8 23.2727V13.9636C16.8 13.5007 16.9896 13.0567 17.3272 12.7294C17.6648 12.4021 18.1226 12.2182 18.6 12.2182C19.0774 12.2182 19.5352 12.4021 19.8728 12.7294C20.2104 13.0567 20.4 13.5007 20.4 13.9636Z"
                fill="#A41010"
              />
            </svg>
          </button>
        </div>
      </div>
      <div className="quantitydiv">
        <button
          onClick={() => {
            if (size - 10 >= 0) {
              const tempproduct = {
                ...props.product,
                quantity: size - 10,
              };
              let allProducts = props.allproducts;
              allProducts[props.index] = tempproduct;
              props.setProducts(allProducts);
              setSiz((prev) => prev - 10);
            }
          }}
        >
          -
        </button>
        {size}m
        <button
          onClick={() => {
            const tempproduct = {
              ...props.product,
              quantity: size + 10,
            };
            let allProducts = props.allproducts;
            allProducts[props.index] = tempproduct;
            props.setProducts(allProducts);
            setSiz((prev) => prev + 10);
          }}
        >
          +
        </button>
      </div>
      <div className="colordiv">
        {product.available_colors?.map((c, i) => (
          <div
            className="colors"
            style={
              selectedColor === c
                ? {
                    backgroundColor: c,
                    border: "2px solid rgba(0, 0, 0, 0.747) ",
                  }
                : { backgroundColor: c, border: "2px solid transparent" }
            }
            onClick={() => {
              const tempproduct = {
                ...props.product,
                color: c,
              };
              let allProducts = props.allproducts;
              allProducts[props.index] = tempproduct;
              props.setProducts(allProducts);
              setSelectedColor(c);
            }}
            key={i}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default Productinbag;
