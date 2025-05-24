import { Select } from "@base-ui-components/react/select";

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
        ? props.selectionMap[id].split("px")[0]
        : defaultValue;
      break;
    default:
      break;
  }

  return (
    <Select.Root value={value} disabled={props?.disableMap[id]}>
      <Select.Trigger
        className="user-dashboard-dropdown dropdown-button"
        aria-label={label}
      >
        <Select.Value />
        <Select.Icon />
      </Select.Trigger>
      <Select.Portal>
        <Select.Positioner sideOffset={8}>
          <Select.ScrollUpArrow className="user-dashboard-dropdown scroll-arrow" />
          <Select.Popup className="user-dashboard-dropdown dropdown-menu">
            {items.map((item) => (
              <Select.Item
                key={item}
                value={item}
                className="user-dashboard-dropdown dropdown-item"
                onClick={() => props?.onAction(id, option, item)}
              >
                <Select.ItemText>{item}</Select.ItemText>
              </Select.Item>
            ))}
          </Select.Popup>

          <Select.ScrollDownArrow className="user-dashboard-dropdown scroll-arrow" />
        </Select.Positioner>
      </Select.Portal>
    </Select.Root>
  );
};
