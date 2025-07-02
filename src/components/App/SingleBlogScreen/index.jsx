import { useEffect, useState, memo, useCallback, useMemo } from "react";
import { api } from "../../../config/api";
import Container from "../../UI/Container";
import DynamicContentDisplay from "./DynamicContentDisplay";
import ImageComponent from "./ImageComponent/Index";
import TechInfoBox from "./TechInfoBox";
import { TailSpin } from "react-loader-spinner";
import "./style.css";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

// Simple cache for blog data
const blogCache = new Map();

// Memoized components
const MemoizedDynamicContentDisplay = memo(DynamicContentDisplay);
const MemoizedImageComponent = memo(ImageComponent);
const MemoizedTechInfoBox = memo(TechInfoBox);

function SingleBlogComponent(props) {
  const isMandarin = localStorage.getItem("isMandarin");
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  
  // Memoize the blog ID to prevent unnecessary re-renders
  const blogId = useMemo(() => props.id, [props.id]);
  
  // Scroll to top only when component mounts or ID changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [blogId]);

  // Memoized error handler
  const handleError = useCallback((error) => {
    const errorMessage = error?.response?.data?.detail || error?.message || 
      (isMandarin ? "發生錯誤" : "Something went wrong");
    
    toast.error(errorMessage);
    setLoading(false);
    navigate("/");
  }, [isMandarin, navigate]);

  // Optimized blog loading with caching
  const loadblog = useCallback(async () => {
    if (!blogId) return;

    // Check cache first
    const cacheKey = `blog_${blogId}`;
    if (blogCache.has(cacheKey)) {
      setData(blogCache.get(cacheKey));
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await api.get(`/blogs/${blogId}`);
      
      if (response.status === 200 && response.data) {
        const blogData = response.data;
        // Cache the successful response
        blogCache.set(cacheKey, blogData);
        setData(blogData);
      } else {
        handleError(new Error(isMandarin ? "找不到博客" : "Blog not found"));
        return;
      }
    } catch (error) {
      console.error("Error loading blog:", error);
      handleError(error);
      return;
    } finally {
      setLoading(false);
    }
  }, [blogId, handleError, isMandarin]);

  // Load blog when ID changes
  useEffect(() => {
    loadblog();
  }, [loadblog]);

  // Memoized loading component
  const LoadingComponent = useMemo(() => (
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
  ), []);

  // Memoized content component
  const ContentComponent = useMemo(() => (
    <div className="main-content-container-sb">
      <div className="vertical-centered-column-layout-sb">
        <MemoizedTechInfoBox {...data} />
        <MemoizedImageComponent {...data} />
        <MemoizedDynamicContentDisplay {...data} />
      </div>
    </div>
  ), [data]);

  return (
    <Container>
      {loading ? LoadingComponent : ContentComponent}
    </Container>
  );
}

export default memo(SingleBlogComponent);
