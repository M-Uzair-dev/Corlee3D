import { useNavigate } from "react-router-dom";
import "./style.css";
import { useEffect, useState } from "react";
import { TailSpin } from "react-loader-spinner";
import arrow from "/pngegg.png";

function StylishProductDisplay(props) {
  const navigate = useNavigate();
  const isMandarin = localStorage.getItem("isMandarin");
  const [products, setProducts] = useState(props.products);
  function removeDuplicates(productsArray) {
    if (productsArray.length === 0) {
    } else {
      const uniqueIds = new Set();
      setProducts(
        productsArray.filter((item) => {
          if (!uniqueIds.has(item.id)) {
            uniqueIds.add(item.id);
            return true;
          }
          return false;
        })
      );
    }
  }

  useEffect(() => {
    if (props.products) {
      removeDuplicates(props.products);
    }
  }, [props.products]);

  return (
    <div
      className={
        props.product
          ? "product-related-container productrelatddiv"
          : "product-related-container"
      }
    >
      <div className="relatedproducts">
        <p>{isMandarin ? "相關產品" : "Related Products"}</p>
      </div>
      {props.loading ? (
        <div
          className="tailspin"
          style={{
            width: "100%",
            height: "70vh",
            display: "flex",
            alignItems: "center",
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
      ) : !products || products?.length === 0 ? (
        <h1
          style={{
            textAlign: "center",
            fontWeight: "500",
            width: "100%",
          }}
        >
          {isMandarin ? "沒有相關產品" : "No Related Products"}
        </h1>
      ) : (
        <div className="products">
          {products?.slice(0, 8).map((prod, index) => (
            <div
              className="product"
              onClick={() => navigate(`/product/${prod.id}`)}
              style={{ cursor: "pointer" }}
              key={prod.id} // Changed from index to prod.id for better key uniqueness
            >
              <div
                className="imagediv"
                style={{
                  backgroundImage: `url(${
                    prod.color_images[0]?.primary_image_url ||
                    "default-image-url"
                  })`,
                  backgroundSize: "cover",
                }}
              ></div>
              <div className="textdiv">
                <h2 className="english">{prod.item_code}</h2>
                <p >
                  <span className={`${isMandarin && prod.product_category_mandarin ? "" : "english"}`}>
                  {isMandarin && prod.product_category_mandarin
                    ? prod.product_category_mandarin
                    : prod.product_category}{" "}
                  </span>
                  <img className="arrow" src={arrow} alt="" />{" "}
                  <span className={`${isMandarin && prod.finish_mandarin ? "" : "english"}`}>
                    {isMandarin && prod.finish_mandarin
                      ? prod.finish_mandarin
                      : prod.finish ?? "No Finish Info"}
                  </span>
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default StylishProductDisplay;
