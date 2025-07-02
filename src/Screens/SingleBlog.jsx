import { useEffect, memo, useMemo } from "react";
import BottomBar from "../components/App/BottomBar";
import Navbar from "../components/App/Navbar";
import SingleBlogComponent from "../components/App/SingleBlogScreen";
import { useParams } from "react-router-dom";

// Memoized components to prevent unnecessary re-renders
const MemoizedSingleBlogComponent = memo(SingleBlogComponent);
const MemoizedBottomBar = memo(BottomBar);
const MemoizedNavbar = memo(Navbar);

function SingleBlog() {
  const { id } = useParams();
  
  // Memoize the id to prevent unnecessary re-renders
  const memoizedId = useMemo(() => id, [id]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [memoizedId]); // Only scroll when id changes

  return (
    <>
      <MemoizedNavbar />
      <MemoizedSingleBlogComponent id={memoizedId} />
      <MemoizedBottomBar />
    </>
  );
}

export default memo(SingleBlog);
