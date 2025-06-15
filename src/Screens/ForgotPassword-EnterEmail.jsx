import { useEffect } from "react";
import FPEnterEmail from "../components/App/ForgotPasswordScreen-EnterEmail";
import Navbar from "../components/App/Navbar";
import BottomBar from "../components/App/BottomBar";

function ForgotPasswordEnterEmail() {
  useEffect(() => {
    window.scrollTo(0, 0);
  });
  return (
    <>
      <Navbar />
      <FPEnterEmail />
      <BottomBar />
    </>
  );
}

export default ForgotPasswordEnterEmail;
