import React, { useState, useRef, useEffect } from "react";
import Share from "./Share";
import "../Styles/ShareModal.css";

const ShareModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const modalRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <>
      <button
        className="open-share-modal-button"
        onClick={() => setIsOpen(true)}
      >
        اشتراک گذاری سند
      </button>

      {isOpen && (
        <div className="modal-overlay">
          <div className="modal-content" ref={modalRef}>
            <Share onClose={() => setIsOpen(false)} />
          </div>
        </div>
      )}
    </>
  );
};

export default ShareModal;
