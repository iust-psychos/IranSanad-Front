import "@/styles/Share.css";
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
  return mode === "1" ? (
    <Select.Root
      defaultValue={permissionItem.access_level}
      onValueChange={(value) =>
        handlePermissionChange(permissionItem.user.id, value)
      }
    >
      <Select.Trigger
        className="share-select-trigger"
        data-testid={`permission-select-${permissionItem.user.id}`}
      >
        <Select.Value
          placeholder={
            permissionItem.access_level === "ReadOnly" ? "نظاره‌گر" : "ویراستار"
          }
          className="share-item-status-label"
        />
        <HiChevronUpDown className="share-select-icon" />
      </Select.Trigger>
      <Select.Portal container={body}>
        <Select.Backdrop />
        <Select.Positioner>
          <Select.Popup className="share-select-popup">
            <Select.Item value="ReadOnly" className="share-select-item">
              <Select.ItemText>نظاره‌گر</Select.ItemText>
              <Select.ItemIndicator className="share-item-indicator">
                <FaCheck size={12} />
              </Select.ItemIndicator>
            </Select.Item>
            <Select.Item value="Writer" className="share-select-item">
              <Select.ItemText>ویراستار</Select.ItemText>
              <Select.ItemIndicator className="share-item-indicator">
                <FaCheck size={12} />
              </Select.ItemIndicator>
            </Select.Item>
          </Select.Popup>
        </Select.Positioner>
      </Select.Portal>
    </Select.Root>
  ) : mode === "2" ? (
    <Select.Root value={userAccessLevel} onValueChange={setUserAccessLevel}>
      <Select.Trigger className="share-select-trigger">
        <Select.Value
          placeholder={userAccessLevel === "view" ? "مشاهده" : "ویرایش"}
          className="share-item-status-label"
        />
        <HiChevronUpDown className="share-select-icon" />
      </Select.Trigger>
      <Select.Portal>
        <Select.Backdrop />
        <Select.Positioner>
          <Select.Popup className="share-select-popup">
            <Select.Item value="view" className="share-select-item">
              <Select.ItemText>مشاهده</Select.ItemText>
              <Select.ItemIndicator className="share-item-indicator">
                <FaCheck size={12} />
              </Select.ItemIndicator>
            </Select.Item>
            <Select.Item value="edit" className="share-select-item">
              <Select.ItemText>ویرایش</Select.ItemText>
              <Select.ItemIndicator className="share-item-indicator">
                <FaCheck size={12} />
              </Select.ItemIndicator>
            </Select.Item>
          </Select.Popup>
        </Select.Positioner>
      </Select.Portal>
    </Select.Root>
  ) : (
    <Select.Root value={userAccessLevel} onValueChange={setUserAccessLevel}>
      <Select.Trigger className="share-select-trigger">
        <Select.Value
          placeholder={userAccessLevel === "view" ? "مشاهده" : "ویرایش"}
          className="share-item-status-label"
        />
        <HiChevronUpDown className="share-select-icon" />
      </Select.Trigger>
      <Select.Portal>
        <Select.Backdrop />
        <Select.Positioner>
          <Select.Popup className="share-select-popup">
            <Select.Item value="view" className="share-select-item">
              <Select.ItemText>مشاهده</Select.ItemText>
              <Select.ItemIndicator className="share-item-indicator">
                <FaCheck size={12} />
              </Select.ItemIndicator>
            </Select.Item>
            <Select.Item value="edit" className="share-select-item">
              <Select.ItemText>ویرایش</Select.ItemText>
              <Select.ItemIndicator className="share-item-indicator">
                <FaCheck size={12} />
              </Select.ItemIndicator>
            </Select.Item>
          </Select.Popup>
        </Select.Positioner>
      </Select.Portal>
    </Select.Root>
  );
};

export default SelectBox;
