import FabricInfoLayout from "../components/App/HomeScreen/FabricInfoLayout";
import BottomBar from "../components/App/BottomBar";
import { mockData } from "../util";
import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

function Home() {
  useEffect(() => {
    window.scrollTo(0, 0);
    AOS.init({
      duration: 800,
      once: true,
      easing: 'ease-out-cubic'
    });
  }, []);

  return (
    <>
      <div
        style={{
          background: "white",
        }}
        data-ignore="used only for top most containter width"
      >
        <FabricInfoLayout fabricInfoOptions={mockData.fabricInfoOptions} />
      </div>
      <BottomBar home={true} />
    </>
  );
}

export default Home;
