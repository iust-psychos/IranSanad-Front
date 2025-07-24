import { useState } from "react";
import { Link } from "react-router-dom";
import { useTheme } from "@/src/ThemeContext";
import { logo_light } from "../Constants/ImageConstants";
import "@/styles/Navbar.css";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { isDarkMode } = useTheme();

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <img className="navbar-logo-image" src={logo_light} alt="ایران سند" />
      </div>

      <div className="navbar-menu-toggle" onClick={toggleMenu}>
        ☰
      </div>

      <ul className={`nav-links ${menuOpen ? "open" : ""}`}>
        <li>
          <Link to="/" className="nav-link">
            خانه
          </Link>
        </li>
        <li>
          <Link to="/dashboard" className="nav-link">
            داشبورد
          </Link>
        </li>
        <li>
          <Link to="/pricing" className="nav-link">
            تعرفه‌ها
          </Link>
        </li>
        <li>
          <Link to="/login" className="nav-link">
            ثبت‌نام | ورود
          </Link>
        </li>
        <li>
          <button className="navbar-theme-btn" onClick={() => {}}>
            {isDarkMode ? "☀️" : "🌙"}
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
