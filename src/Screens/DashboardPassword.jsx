import React, { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { toast } from "sonner";

const DashboardPassword = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.username === "admin" && formData.password === "admin") {
      localStorage.setItem("theUserIsAdmin", "ADMIN");
      navigate("/dashboard");
    } else {
      toast.error("Invalid credentials");
    }
  };

  return (
    <div className="password-screen">
      <div className="password-container">
        <div className="admin-icon">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
          </svg>
        </div>
        <h2>Admin Dashboard</h2>
        <p className="subtitle">Enter your credentials to access the dashboard</p>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <div className="input-container">
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
                placeholder=" "
              />
              <label htmlFor="username">Username</label>
            </div>
          </div>
          <div className="form-group">
            <div className="input-container">
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder=" "
              />
              <label htmlFor="password">Password</label>
            </div>
          </div>
          <button type="submit" className="submit-button">
            <span>Access Dashboard</span>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/>
            </svg>
          </button>
        </form>
      </div>

      <style jsx>{`
        @font-face {
          font-family: 'Artnoova';
          src: url('/font/Artnoova-Regular.eot');
          src: url('/font/Artnoova-Regular.eot?#iefix') format('embedded-opentype'),
               url('/font/Artnoova-Regular.woff2') format('woff2'),
               url('/font/Artnoova-Regular.woff') format('woff'),
               url('/font/Artnoova-Regular.ttf') format('truetype');
          font-weight: normal;
          font-style: normal;
        }

        @font-face {
          font-family: 'Artnoova';
          src: url('/font/Artnoova-Bold.eot');
          src: url('/font/Artnoova-Bold.eot?#iefix') format('embedded-opentype'),
               url('/font/Artnoova-Bold.woff2') format('woff2'),
               url('/font/Artnoova-Bold.woff') format('woff'),
               url('/font/Artnoova-Bold.ttf') format('truetype');
          font-weight: bold;
          font-style: normal;
        }

        .password-screen {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
          background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
          position: relative;
          overflow: hidden;
          font-family: 'Artnoova', sans-serif;
        }

        .password-screen::before {
          content: '';
          position: absolute;
          width: 200%;
          height: 200%;
          top: -50%;
          left: -50%;
          z-index: 0;
          background: radial-gradient(rgba(255,255,255,0.1) 8%, transparent 8%);
          background-position: 0 0;
          background-size: 16px 16px;
          animation: moveBackground 30s linear infinite;
        }

        @keyframes moveBackground {
          0% {
            transform: translate(0, 0);
          }
          100% {
            transform: translate(-64px, -64px);
          }
        }

        .password-container {
          background: rgba(255, 255, 255, 0.95);
          padding: 3rem;
          border-radius: 20px;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05);
          width: 100%;
          max-width: 420px;
          position: relative;
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          transform: translateY(0);
          transition: transform 0.3s ease;
          box-sizing: border-box;
        }

        .password-container:hover {
          transform: translateY(-5px);
        }

        .admin-icon {
          width: 80px;
          height: 80px;
          margin: 0 auto 1.5rem;
          color: #4f46e5;
          animation: float 6s ease-in-out infinite;
        }

        @keyframes float {
          0% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
          100% {
            transform: translateY(0px);
          }
        }

        h2 {
          text-align: center;
          margin-bottom: 0.5rem;
          color: #1a1a1a;
          font-size: 2rem;
          font-weight: bold;
          letter-spacing: -0.5px;
          font-family: 'Artnoova', sans-serif;
        }

        .subtitle {
          text-align: center;
          color: #666;
          margin-bottom: 2rem;
          font-size: 0.95rem;
        }

        .form-group {
          margin-bottom: 1.5rem;
        }

        .input-container {
          position: relative;
          margin-top: 0.5rem;
        }

        label {
          position: absolute;
          left: 16px;
          top: 50%;
          transform: translateY(-50%);
          background: white;
          padding: 0 0.25rem;
          color: #666;
          font-size: 0.95rem;
          transition: all 0.2s ease;
          pointer-events: none;
        }

        input {
          width: 100%;
          padding: 1rem;
          border: 2px solid #e5e7eb;
          border-radius: 12px;
          font-size: 1rem;
          transition: all 0.2s ease;
          background: transparent;
          color: #1a1a1a;
          box-sizing: border-box;
          font-family: 'Artnoova', sans-serif;
        }

        input:focus {
          border-color: #4f46e5;
          box-shadow: 0 0 0 4px rgba(79, 70, 229, 0.1);
          outline: none;
        }

        input:not(:placeholder-shown) + label,
        input:focus + label {
          top: 0;
          font-size: 0.85rem;
          color: #4f46e5;
        }

        .submit-button {
          width: 100%;
          padding: 1rem;
          background: #4f46e5;
          color: white;
          border: none;
          border-radius: 12px;
          font-size: 1rem;
          font-weight: bold;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          margin-top: 2rem;
          font-family: 'Artnoova', sans-serif;
        }

        .submit-button svg {
          width: 20px;
          height: 20px;
          transition: transform 0.2s ease;
        }

        .submit-button:hover {
          background: #4338ca;
          transform: translateY(-2px);
        }

        .submit-button:hover svg {
          transform: translateX(4px);
        }

        .submit-button:active {
          transform: translateY(0);
        }

        @media (max-width: 480px) {
          .password-container {
            padding: 2rem;
            margin: 1rem;
          }

          h2 {
            font-size: 1.75rem;
          }

          .admin-icon {
            width: 60px;
            height: 60px;
          }
        }
      `}</style>
    </div>
  );
};

export default DashboardPassword;
