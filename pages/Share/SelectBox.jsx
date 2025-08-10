import "./index.css";
import { Select } from "@base-ui-components/react/select";
import { HiChevronUpDown } from "react-icons/hi2";
import { FaCheck } from "react-icons/fa";

const SelectBox = ({
  body,
  permissionItem,
  handlePermissionChange,
  mode,
  userAccessLevel,
  setUserAccessLevel,
}) => {
  const renderSelectItem = (value, label) => (
    <Select.Item value={value} className="share-select-item">
      <Select.ItemText>{label}</Select.ItemText>
      <Select.ItemIndicator className="share-item-indicator">
        <FaCheck size={12} />
      </Select.ItemIndicator>
    </Select.Item>
  );

  const labelMap = {
    ReadOnly: "نظاره‌گر",
    Writer: "ویراستار",
    view: "مشاهده",
    edit: "ویرایش",
    restricted: "محدود",
    public: "عمومی",
  };

  const commonTriggerProps = {
    className: "share-select-trigger",
    children: (
      <>
        <Select.Value className="share-item-status-label">
          {(value) => labelMap[value] || value}
        </Select.Value>
        <HiChevronUpDown className="share-select-icon" />
      </>
    ),
  };

  const commonPortalProps = {
    children: (
      <>
        <Select.Backdrop />
        <Select.Positioner>
          <Select.Popup className="share-select-popup">
            {mode === "1" || mode === "3" ? (
              <>
                {renderSelectItem("ReadOnly", "نظاره‌گر")}
                {renderSelectItem("Writer", "ویراستار")}
              </>
            ) : (
              <>
                {renderSelectItem("view", "مشاهده")}
                {renderSelectItem("edit", "ویرایش")}
              </>
            )}
          </Select.Popup>
        </Select.Positioner>
      </>
    ),
  };

  if (mode === "1") {
    return (
      <Select.Root
        defaultValue={permissionItem.access_level}
        onValueChange={(value) =>
          handlePermissionChange(permissionItem.user.id, value)
        }
      >
        <Select.Trigger
          {...commonTriggerProps}
          data-testid={`permission-select-${permissionItem.user.id}`}
          placeholder={
            permissionItem.access_level === "ReadOnly" ? "نظاره‌گر" : "ویراستار"
          }
        />
        <Select.Portal container={body} {...commonPortalProps} />
      </Select.Root>
    );
  }

  return (
    <Select.Root value={userAccessLevel} onValueChange={setUserAccessLevel}>
      <Select.Trigger
        {...commonTriggerProps}
        placeholder={
          mode === "2"
            ? userAccessLevel === "view"
              ? "مشاهده"
              : "ویرایش"
            : userAccessLevel === "ReadOnly"
            ? "نظاره‌گر"
            : "ویراستار"
        }
      />
      <Select.Portal {...commonPortalProps} />
    </Select.Root>
  );
};

export default SelectBox;
