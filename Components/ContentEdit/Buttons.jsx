import { Select, Menu } from "@base-ui-components/react";
import { IconDropDown } from "../user-dashboard/components/Icons";

export const IconButton = ({ id, label, Icon, ...props }) => (
  <button
    aria-label={label}
    onClick={() => props?.onAction(id)}
    disabled={props?.disableMap[id]}
    className={`icon-button ${props.className || ""} ${
      props.selectionMap[id] ? "active" : ""
    }`}
  >
    {Icon && <Icon {...props?.iconProps} />}
  </button>
);
export const IconDropdown = ({ id, label, icon, items, ...props }) => {
  <button
    key={id}
    aria-label={label}
    onClick={() => props.onAction(id)}
    disabled={props.disableMap[id]}
    className={`icon-dropdown ${props.className} ${
      props.selectionMap[id] ? "active" : null
    }`}
  >
    {icon}
  </button>;
};

export const IconButtonDropdown = ({ id, label, icon }) => {};

export const InputDropdown = ({ id, label, items, ...props }) => {};

export const Input = (id, label) => {};

export const Dropdown = ({
  id,
  label,
  items,
  defaultValue,
  option,
  ...props
}) => {
  let value;
  switch (option) {
    case "font-family":
      value = props.selectionMap[id]
        ? props.selectionMap[id].split(",")[0]
        : defaultValue;
      break;
    case "font-size":
      value = props.selectionMap[id]
        ? props.selectionMap[id].slice(0, -2)
        : defaultValue;
      break;
    default:
      break;
  }

  return (
    <Menu.Root disabled={props?.disableMap[id]}>
      <Menu.Trigger
        className={`content-editor-dropdown dropdown-button ${
          props.className || ""
        } ${props.selectionMap[id] ? "active" : ""}`}
      >
        <p>{value}</p>
        <IconDropDown />
      </Menu.Trigger>
      <Menu.Portal>
        <Menu.Positioner sideOffset={8}>
          <Menu.Popup className="content-editor-dropdown dropdown-menu">
            {items.map((item) => (
              <Menu.Item
                key={item}
                value={String(item)}
                className="content-editor-dropdown dropdown-item"
                onClick={() => props?.onAction(id, option, item)}
              >
                {item}
              </Menu.Item>
            ))}
          </Menu.Popup>
        </Menu.Positioner>
      </Menu.Portal>
    </Menu.Root>
  );
};
