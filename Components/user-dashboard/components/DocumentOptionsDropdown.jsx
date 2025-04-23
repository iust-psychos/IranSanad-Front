import { IconVerticalOptions } from "./Icons.jsx";
import { Menu } from "@base-ui-components/react/menu";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { deleteDocument } from "../../../Managers/user-dashboard-manager.js";
import { useDeleteDocument } from "../../../hooks/useDeleteDocument.js";

export default function DocumentOptionsDropdown({
  document,
  updateStateFunction,
}) {
  const { mutate } = useDeleteDocument(updateStateFunction, document);

  const handleIgnoreClick = (e) => e.stopPropagation();

  return (
    <Menu.Root openOnHover onClick={handleIgnoreClick}>
      <Menu.Trigger
        className="user-dashboard-dropdown dropdown-button"
        onClick={handleIgnoreClick}
      >
        <IconVerticalOptions />
      </Menu.Trigger>
      <Menu.Portal onClick={handleIgnoreClick}>
        <Menu.Positioner sideOffset={8} onClick={handleIgnoreClick}>
          <Menu.Popup
            className="user-dashboard-dropdown dropdown-menu"
            onClick={handleIgnoreClick}
          >
            <Menu.Item className="user-dashboard-dropdown dropdown-item">
              تغییر نام
            </Menu.Item>
            <Menu.Item
              className="user-dashboard-dropdown dropdown-item"
              onClick={mutate}
            >
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
