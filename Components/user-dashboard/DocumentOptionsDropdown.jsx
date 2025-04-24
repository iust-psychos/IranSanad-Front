import { IconVerticalOptions } from "./Icons.jsx";
import { Menu } from "@base-ui-components/react/menu";

export default function DocumentOptionsDropdown({
  document,
  updateStateFunction,
}) {
  return (
    <Menu.Root openOnHover>
      <Menu.Trigger>
        <IconVerticalOptions />
      </Menu.Trigger>
      <Menu.Portal>
        <Menu.Positioner sideOffset={8}>
          <Menu.Popup className="user-dashboard-dropdown dropdown-menu">
            <Menu.Item className="user-dashboard-dropdown dropdown-item">
              تغییر نام
            </Menu.Item>
            <Menu.Item className="user-dashboard-dropdown dropdown-item">
              حذف
            </Menu.Item>
            <Menu.Item className="user-dashboard-dropdown dropdown-item">
              باز کردن در برگه جدید
            </Menu.Item>
          </Menu.Popup>
        </Menu.Positioner>
      </Menu.Portal>
    </Menu.Root>
  );
}
