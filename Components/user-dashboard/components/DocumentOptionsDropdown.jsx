import { IconVerticalOptions } from "./Icons.jsx";
import { Menu } from "@base-ui-components/react/menu";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { deleteDocument } from "../../../Managers/user-dashboard-manager.js";
import { useDeleteDocument } from "../../../hooks/useDeleteDocument.js";
import DocumentRenameModal from "./DocumentRenameModal.jsx";
import { useState } from "react";

export default function DocumentOptionsDropdown({
  document,
  updateStateFunction,
}) {
  const [modalOpen, setModalOpen] = useState(false);
  const { mutate } = useDeleteDocument(updateStateFunction, document);

  const handleIgnoreClick = (e) => e.stopPropagation();

  return (
    <>
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
              <Menu.Item
                className="user-dashboard-dropdown dropdown-item"
                onClick={() => setModalOpen(true)}
              >
                تغییر نام
              </Menu.Item>
              <Menu.Item
                className="user-dashboard-dropdown dropdown-item"
                onClick={mutate}
              >
                حذف
              </Menu.Item>
              <Menu.Item className="user-dashboard-dropdown dropdown-item">
                <a
                  href={`/document/${document.doc_uuid}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  باز کردن در برگه جدید
                </a>
              </Menu.Item>
            </Menu.Popup>
          </Menu.Positioner>
        </Menu.Portal>
      </Menu.Root>
      <DocumentRenameModal
        open={modalOpen}
        setOpen={setModalOpen}
        document={document}
        updateStateFunction={updateStateFunction}
      />
    </>
  );
}
