import { Menu } from "@base-ui-components/react";
import { IconDropDown } from "@/pages/UserDashboard/Icons";
import { useEffect, useState } from "react";

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
export const IconDropdown = ({
  id,
  label,
  items,
  defaultValue,
  selectionMap,
  disableMap = {},
  onAction,
  className,
}) => {
  const selected =
    items.find((item) => item.id === selectionMap[id]) ||
    items.find((item) => item.id === defaultValue);
  const [valueVisible, setValueVisible] = useState(selected);

  useEffect(() => {
    const updated =
      items.find((item) => item.id === selectionMap[id]) ||
      items.find((item) => item.id === defaultValue);
    setValueVisible(updated);
  }, [selectionMap, id, items, defaultValue]);

  return (
    <Menu.Root disabled={disableMap[id]}>
      <Menu.Trigger
        className={`content-editor-dropdown dropdown-button ${
          className || ""
        } ${selectionMap[id] ? "active" : ""}`}
        aria-label={label}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
          {valueVisible?.Icon && <valueVisible.Icon />}
          <span>{valueVisible?.label}</span>
        </div>
        <IconDropDown />
      </Menu.Trigger>

      <Menu.Portal>
        <Menu.Positioner sideOffset={8}>
          <Menu.Popup className="content-editor-dropdown dropdown-menu">
            {items.map((item) => (
              <Menu.Item
                key={item.id}
                value={item.id}
                className="content-editor-dropdown dropdown-item"
                onClick={() => onAction(item.id, "", valueVisible.id)}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.4rem",
                  }}
                >
                  {item.Icon && <item.Icon />}
                  <span>{item.label}</span>
                </div>
              </Menu.Item>
            ))}
          </Menu.Popup>
        </Menu.Positioner>
      </Menu.Portal>
    </Menu.Root>
  );
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
  const [valueVisible, setValueVisible] = useState(value);
  useEffect(() => setValueVisible(value), [value]);

  return (
    <Menu.Root disabled={props?.disableMap[id]}>
      <Menu.Trigger
        className={`content-editor-dropdown dropdown-button ${
          props.className || ""
        } ${props.selectionMap[id] ? "active" : ""}`}
      >
        <p>{valueVisible}</p>
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
