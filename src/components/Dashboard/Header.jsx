import React from "react";
import { FaBell, FaCog } from "react-icons/fa";

const Header = ({ title }) => {
  return (
    <header className="header">
      <h2 className="header-title">{title}</h2>
      <div className="header-actions">
        <button className="header-action-btn">
          <FaBell />
        </button>
        <button className="header-action-btn">
          <FaCog />
        </button>
        <div className="header-user">UN</div>
      </div>
    </header>
  );
};

export default Header;
