import { IconLogo } from "./user-dashboard/components/Icons";
import UserProfileDropdown from "./user-dashboard/components/UserProfileDropdown";

const Header = () => {
  <menu className="navbar">
    <button className="menu-logo">
      <IconLogo />
    </button>
    <UserProfileDropdown />
  </menu>;
};

export default Header;
