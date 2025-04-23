import React, { useState, useRef } from "react";
import { Dialog } from "@base-ui-components/react/dialog";

export default function DocumentRenameModal({ open }) {
  const [confirmationOpen, setConfirmationOpen] = useState(false);
  const [textareaValue, setTextareaValue] = useState("");

  return (
    <Dialog.Root
      open={open}
      onOpenChange={(open) => {
        if (!open && textareaValue) {
          setConfirmationOpen(true);
        }
      }}
    >
      <Dialog.Trigger className={styles.Button}>Tweet</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Backdrop className={styles.Backdrop} />
        <Dialog.Popup className={styles.Popup}>
          <Dialog.Title className={styles.Title}>New tweet</Dialog.Title>
          <form
            className={styles.TextareaContainer}
            onSubmit={(event) => {
              event.preventDefault();
              setDialogOpen(false);
            }}
          >
            <textarea
              required
              className={styles.Textarea}
              placeholder="What’s on your mind?"
              value={textareaValue}
              onChange={(event) => setTextareaValue(event.target.value)}
            />
            <div className={styles.Actions}>
              <Dialog.Close className={styles.Button}>Cancel</Dialog.Close>
              <button type="submit" className={styles.Button}>
                Tweet
              </button>
            </div>
          </form>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
