import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { logo } from "../Constants/ImageConstants";
import { token, getUserImageAPI } from "@/Managers/NavbarManager";
import UserProfileDropdown from "../pages/UserDashboard/UserProfileDropdown";
import "@/styles/Navbar.css";
import axios from "axios";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const [profileImage, setProfileImage] = useState("");

  useEffect(() => {
    if (token) {
      axios
        .get(`${getUserImageAPI}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `JWT ${token}`,
          },
        })
        .then((response) => {
          setProfileImage(response.data.profile_image);
        })
        .catch((error) => console.log(error));
    }
  }, [token]);

  return (
    <nav className="navbar-global">
      <div className="navbar-global-logo">
        <Link to="/">
          <img
            className="navbar-global-logo-image"
            src={logo}
            alt="ایران سند"
          />
        </Link>
      </div>

      <div className="navbar-global-menu-toggle" onClick={toggleMenu}>
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
          {token ? (
            <UserProfileDropdown profile_image={profileImage} />
          ) : (
            <Link to="/login" className="nav-link">
              ثبت‌نام | ورود
            </Link>
          )}
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
