import "./style.css";
import messages from "./messages.json";

function ElegantContentBlock() {
  const isMandarin = localStorage.getItem("isMandarin");
  return (
    <div className="text-container-flex-box">
      <p className="central-text-styler">
        {isMandarin
          ? "對我們⽽⾔，「永續經營」從來不只是⼝號，⽽是貫徹在產品、流程與夥伴關係中的核⼼信念。\n透過與在地⼯廠及供應商的緊密合作，柏家與共樂⼒提供整合性的布料開發服務，融合⾼機能與設計巧思，致⼒打造兼具⾼品質與環保精神的布料。"
          : "Sustainability isn’t just a word—it’s part of everything we do.\n\n At Corlee, we follow eco-friendly practices in our products, our processes, and how we work with people.\nThanks to our strong partnerships with local factories and suppliers, we offer integrated woven fabric solutions that combine advanced performance with thoughtful design."}
      </p>
      <div className="content-wrapper">
        <svg
          width="59"
          height="59"
          viewBox="0 0 59 59"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M29.4912 1.5C30.0453 1.50004 30.586 1.66985 31.041 1.98633C31.4393 2.26339 31.7551 2.64149 31.957 3.08008L32.0371 3.27148L38.1113 19.9971L38.3506 20.6562L39.0098 20.8955L55.7217 26.957L55.7305 26.96C56.2512 27.1452 56.7015 27.4884 57.0186 27.9414C57.3356 28.3945 57.5043 28.9351 57.5 29.4883V29.5117C57.5043 30.0649 57.3356 30.6055 57.0186 31.0586C56.7015 31.5116 56.2512 31.8548 55.7305 32.04L55.7207 32.0439L39.0059 38.124L38.3477 38.3633L38.1094 39.0215L32.0371 55.7285C31.8441 56.2485 31.4961 56.6971 31.041 57.0137C30.586 57.3302 30.0453 57.5 29.4912 57.5C28.937 57.5 28.3955 57.3303 27.9404 57.0137C27.5422 56.7366 27.2264 56.3585 27.0244 55.9199L26.9453 55.7285L20.8701 39.0029L20.6309 38.3438L19.9717 38.1045L3.26953 32.0459C2.75061 31.8529 2.30259 31.5065 1.98633 31.0518C1.66976 30.5964 1.5 30.0547 1.5 29.5C1.5 28.9453 1.66976 28.4036 1.98633 27.9482C2.30283 27.4931 2.75108 27.146 3.27051 26.9531L3.26953 26.9521L19.9912 20.876L20.6504 20.6367L20.8896 19.9775L26.9453 3.27148C27.1382 2.75156 27.4854 2.30293 27.9404 1.98633C28.3955 1.66973 28.937 1.5 29.4912 1.5Z"
            stroke="white"
            stroke-width="3"
          />
        </svg>
      </div>
    </div>
  );
}

export default ElegantContentBlock;
