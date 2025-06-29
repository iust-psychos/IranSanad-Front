import { IconLogo } from "@/pages/UserDashboard/components/Icons";
import UserProfileDropdown from "@/pages/UserDashboard/components/UserProfileDropdown";

const Header = () => {
  <menu className="navbar">
    <button className="menu-logo">
      <IconLogo />
    </button>
    <UserProfileDropdown />
  </menu>;
};

export default Header;
