import React from "react";

const Modal = ({ isOpen, onClose, onConfirm, message }) => {
  return (
    <div className={`modal ${isOpen ? "open" : ""}`}>
      <div className="modal-content">
        <p>{message}</p>
        <button onClick={onConfirm}>Leave</button>
        <button onClick={onClose}>Stay</button>
      </div>
    </div>
  );
};

export default Modal;
