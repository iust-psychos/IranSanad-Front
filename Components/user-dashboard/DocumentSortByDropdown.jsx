import { Menu } from "@base-ui-components/react/menu";
import { IconDropDown } from "./Icons.jsx";

export default function DocumentSortByDropdown({ updateStateFunction }) {
  return (
    <Menu.Root openOnHover>
      <Menu.Trigger className="menu-button menu-sort">
        مرتب سازی بر اساس
        <IconDropDown />
      </Menu.Trigger>
      <Menu.Portal>
        <Menu.Positioner sideOffset={5}>
          <Menu.Popup className="user-dashboard-dropdown dropdown-menu">
            <Menu.Item
              className="user-dashboard-dropdown dropdown-item"
              onClick={() => updateStateFunction("last_seen_time")}
            >
              زمان آخرین بازدید
            </Menu.Item>
            <Menu.Item
              className="user-dashboard-dropdown dropdown-item"
              onClick={() => updateStateFunction("last_modified_time")}
            >
              زمان آخرین تغییر
            </Menu.Item>
          </Menu.Popup>
        </Menu.Positioner>
      </Menu.Portal>
    </Menu.Root>
  );
}
