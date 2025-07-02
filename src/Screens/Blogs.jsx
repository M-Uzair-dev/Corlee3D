import { useEffect, memo } from "react";
import BlogsComponent from "../components/App/BlogsScreen";
import BottomBar from "../components/App/BottomBar";
import Navbar from "../components/App/Navbar";

// Memoized components to prevent unnecessary re-renders
const MemoizedBlogsComponent = memo(BlogsComponent);
const MemoizedBottomBar = memo(BottomBar);
const MemoizedNavbar = memo(Navbar);

function Blogs() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <MemoizedNavbar />
      <MemoizedBlogsComponent />
      <MemoizedBottomBar />
    </>
  );
}

export default memo(Blogs);
