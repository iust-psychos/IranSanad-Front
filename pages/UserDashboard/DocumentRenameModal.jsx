import React, { useRef } from "react";
import { Dialog } from "@base-ui-components/react/dialog";
import { useRenameDocument } from "@/hooks/useRenameDocument";

export default function DocumentRenameModal({
  open,
  setOpen,
  document,
  updateStateFunction,
}) {
  const nameRef = useRef();
  const { mutate } = useRenameDocument(updateStateFunction, document);

  const handleSubmit = (e) => {
    e.preventDefault();
    const newName = nameRef.current?.value?.trim();
    if (newName && newName !== document.title) {
      mutate(newName);
    }
    setOpen(false);
  };

  const handleIgnoreClick = (e) => e.stopPropagation();

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Portal>
        <Dialog.Backdrop className="user-dashboard rename-modal backdrop" />
        <Dialog.Popup
          className="user-dashboard rename-modal popup"
          onClick={handleIgnoreClick}
        >
          <Dialog.Title
            className="user-dashboard rename-modal title"
            onClick={handleIgnoreClick}
          >
            تغییر نام سند
          </Dialog.Title>
          <Dialog.Description
            className="user-dashboard rename-modal description"
            onClick={handleIgnoreClick}
          >
            لطفا نام جدیدی برای سند وارد کنید:
          </Dialog.Description>
          <form
            className="user-dashboard rename-modal text-container"
            onSubmit={handleSubmit}
          >
            <input
              className="user-dashboard rename-modal text"
              type="text"
              defaultValue={document.title}
              ref={nameRef}
            />
            <div className="user-dashboard rename-modal actions">
              <button
                type="submit"
                className="user-dashboard rename-modal button button-confirm"
              >
                تایید
              </button>
              <Dialog.Close className="user-dashboard rename-modal button button-cancel">
                لغو
              </Dialog.Close>
            </div>
          </form>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
