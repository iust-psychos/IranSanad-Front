import React, { useRef } from "react";
import { Dialog } from "@base-ui-components/react/dialog";

export default function HistoryModal({ open, setOpen }) {
  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Portal>
        <Dialog.Backdrop className="user-dashboard rename-modal backdrop" />
        <Dialog.Popup className="content-editor history-modal popup">
          <div className="sidebar-title"></div>
          <div className="sidebar-content"></div>
          <div className="navbar"></div>
          <div className="toolbar"></div>
          <div className="document"></div>
          {/* <Dialog.Close className="content-edit history-modal button button-cancel">
                لغو
              </Dialog.Close> */}
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
