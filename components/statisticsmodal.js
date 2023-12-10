import React from "react";
import Main from "./summary";

function LeaderboardModal({ onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="fixed inset-0 bg-black opacity-50"
        onClick={onClose}
      ></div>
      <div className="w-4xl z-10 flex flex-col items-center justify-center rounded-md border-4 border-red-500 bg-white p-4 shadow-lg">
        <Main onClose={onClose} />
        <button
          className="w-1/2 rounded-lg border-2 border-black bg-red-500 px-4 py-2 text-center font-boom text-white hover:bg-red-600"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
}

export default LeaderboardModal;
