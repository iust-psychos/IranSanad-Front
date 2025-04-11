import { Menu } from "@base-ui-components/react/menu";
import DEFAULT_IMAGE from "../../src/Images/UserProfile/Default.png";
import { IconUserProfileClose } from "./Icons";

export default function UserProfileDropdown() {
  return (
    <Menu.Root>
      <Menu.Trigger className="menu-profile">
        <img src={DEFAULT_IMAGE} alt="عکس پروفایل" />
      </Menu.Trigger>
      <Menu.Portal>
        <Menu.Positioner sideOffset={6} align="end">
          <Menu.Popup className="user-dashboard-dropdown profile-dropdown">
            <menu className="user-dashboard-dropdown profile-dropdown-grid">
              <Menu.Item
                className="user-dashboard-dropdown profile-dropdown-close"
                closeOnClick
              >
                <IconUserProfileClose />
              </Menu.Item>
              <img src={DEFAULT_IMAGE} alt="عکس پروفایل" />
            </menu>
            <section className="user-dashboard-dropdown profile-dropdown-info">
              <p>علی صادقی</p>
              <p>ali.Sadeghy@example.com</p>
            </section>
            <menu className="user-dashboard-dropdown profile-dropdown-buttons">
              <button>تغییر مشخصات کاربری</button>
              <button>داشبورد کاربر</button>
              <button>خروج از حساب</button>
            </menu>
          </Menu.Popup>
        </Menu.Positioner>
      </Menu.Portal>
    </Menu.Root>
  );
}
