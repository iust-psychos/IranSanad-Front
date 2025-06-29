import { Menu } from "@base-ui-components/react/menu";

export default function MenubarDropdown({ mainLabel, items }) {
  return (
    <Menu.Root openOnHover modal={false}>
      <Menu.Trigger>{mainLabel}</Menu.Trigger>
      <Menu.Portal>
        <Menu.Positioner sideOffset={5} align="start">
          <Menu.Popup className="user-dashboard-dropdown dropdown-menu">
            {items.map(({ label, action }) => (
              <Menu.Item
                className="user-dashboard-dropdown dropdown-item"
                onClick={action}
              >
                {label}
              </Menu.Item>
            ))}
          </Menu.Popup>
        </Menu.Positioner>
      </Menu.Portal>
    </Menu.Root>
  );
}
