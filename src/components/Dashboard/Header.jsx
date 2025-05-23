import React, { useState } from "react";
import { FaSignOutAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const Header = ({ title }) => {
  const navigate = useNavigate();
  const [showConfirm, setShowConfirm] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("theUserIsAdmin");
    navigate("/");
  };

  const handleOverlayClick = (e) => {
    // Only close if the overlay itself is clicked, not its children
    if (e.target === e.currentTarget) {
      setShowConfirm(false);
    }
  };

  return (
    <header className="header">
      <h2 className="header-title">{title}</h2>
      <div className="header-actions">
        <button
          className="header-action-btn"
          onClick={() => setShowConfirm(true)}
        >
          <FaSignOutAlt />
        </button>
      </div>

      {showConfirm && (
        <div className="modal-overlay" onClick={handleOverlayClick}>
          <div className="modal">
            <div className="modal-content">
              <h3>確認登出</h3>
              <p>您確定要登出嗎？</p>
              <div className="modal-buttons">
                <button className="modal-button confirm" onClick={handleLogout}>
                  是的，登出
                </button>
                <button
                  className="modal-button cancel"
                  onClick={() => setShowConfirm(false)}
                >
                  取消
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem 2rem;
          background-color: #fff;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .header-title {
          margin: 0;
          font-size: 1.5rem;
          color: #333;
        }

        .header-actions {
          display: flex;
          gap: 1rem;
        }

        .header-action-btn {
          background: none;
          border: none;
          cursor: pointer;
          padding: 0.5rem;
          color: #666;
          transition: color 0.2s;
        }

        .header-action-btn:hover {
          color: #333;
        }

        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.5);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
        }

        .modal {
          background-color: white;
          border-radius: 8px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          width: 90%;
          max-width: 400px;
          animation: modalFadeIn 0.3s ease;
        }

        .modal-content {
          padding: 2rem;
          text-align: center;
        }

        .modal h3 {
          margin: 0 0 1rem;
          color: #333;
          font-size: 1.25rem;
        }

        .modal p {
          margin: 0 0 1.5rem;
          color: #666;
        }

        .modal-buttons {
          display: flex;
          gap: 1rem;
          justify-content: center;
        }

        .modal-button {
          padding: 0.5rem 1rem;
          border-radius: 4px;
          border: none;
          cursor: pointer;
          font-weight: 500;
          transition: all 0.2s;
        }

        .modal-button.confirm {
          background-color: #dc3545;
          color: white;
        }

        .modal-button.confirm:hover {
          background-color: #c82333;
        }

        .modal-button.cancel {
          background-color: #6c757d;
          color: white;
        }

        .modal-button.cancel:hover {
          background-color: #5a6268;
        }

        @keyframes modalFadeIn {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </header>
  );
};

export default Header;
