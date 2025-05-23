import { useState } from "react";
import { Dialog } from "@base-ui-components/react/dialog";
import "./content-editor.css";
import { IoMdClose } from "react-icons/io";
import {
  IoIosArrowRoundDown,
  IoIosArrowRoundUp,
  IoIosArrowBack,
  IoIosArrowDown,
} from "react-icons/io";
import { LuReplace, LuReplaceAll } from "react-icons/lu";

const FindReplaceModal = ({ editor, onClose, isOpen }) => {
  const [findText, setFindText] = useState("");
  const [replaceText, setReplaceText] = useState("");
  const [showReplace, setShowReplace] = useState(false);

  return (
    <Dialog.Root open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <Dialog.Portal>
        <Dialog.Backdrop />
        <Dialog.Popup className="FindReplaceModal-Popup">
          {/* توضیحات نمونه شاید با طول بیشتر نسبت به یک کلمه ... */}

          <div className="FindReplaceModal-Content">
            <div className="FindReplaceModal-SearchGroup">
              <input
                type="text"
                placeholder="جست و جو ..."
                className="FindReplaceModal-Input"
                value={findText}
                onChange={(e) => setFindText(e.target.value)}
              />
              <div className="FindReplaceModal-Actions">
                <span className="FindReplaceModal-Result"> موردی یافت نشد</span>
                <button className="FindReplaceModal-ActionButton">
                  <IoIosArrowRoundUp className="FindReplaceModal-Icon" />
                </button>
                <button className="FindReplaceModal-ActionButton">
                  <IoIosArrowRoundDown className="FindReplaceModal-Icon" />
                </button>
              </div>
            </div>

            <div className="FindReplaceModal-ToggleContainer">
              <button
                className="FindReplaceModal-ToggleButton"
                onClick={() => setShowReplace(!showReplace)}
                aria-expanded={showReplace}
              >
                <IoIosArrowBack className="FindReplaceModal-ToggleIcon" />
              </button>
            </div>

            {showReplace && (
              <div className="FindReplaceModal-ReplaceGroup">
                <input
                  type="text"
                  placeholder="جایگزینی با ..."
                  className="FindReplaceModal-Input"
                  value={replaceText}
                  onChange={(e) => setReplaceText(e.target.value)}
                />
                <div className="FindReplaceModal-Actions">
                  <button className="FindReplaceModal-ActionButton">
                    <LuReplace className="FindReplaceModal-Icon" />
                  </button>
                  <button className="FindReplaceModal-ActionButton">
                    <LuReplaceAll className="FindReplaceModal-Icon" />
                  </button>
                </div>
              </div>
            )}
          </div>

          <button className="FindReplaceModal-CloseButton" onClick={onClose}>
            <IoMdClose className="FindReplaceModal-Icon" />
          </button>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default FindReplaceModal;
