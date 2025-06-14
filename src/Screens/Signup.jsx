import { Navigate } from "react-router-dom";
import Navbar from "../components/App/Navbar";
import SignupComponent from "../components/App/SignupScreen";
import BottomBar from "../components/App/BottomBar";
import { useEffect } from "react";

function Signup() {
  useEffect(() => {
    window.scrollTo(0, 0);
  });
  const token = localStorage.getItem("token");
  return token ? (
    <Navigate to="/" />
  ) : (
    <>
      <Navbar />
      <SignupComponent />
      <BottomBar />
    </>
  );
}

export default Signup;
