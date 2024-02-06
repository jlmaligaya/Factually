import React, { useState } from "react";
import axios from "axios";

export default function ChangePasswordModal({ onClose, username }) {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleChangePassword = async () => {
    setError(null);
    setIsLoading(true);
    try {
      const response = await axios.post("/api/changePassword", {
        currentPassword: oldPassword,
        newPassword: newPassword,
        userId: username,
      });
      console.log("Password updated successfully:", response.data);
      onClose(); // Close the modal after successful update
    } catch (error) {
      setError(error.response?.data?.message || "Failed to update password");
    }
    setIsLoading(false);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="font rounded-lg border-4 border-green-500 bg-white p-4 text-center font-ogoby text-xl">
        <p>Enter your old password:</p>
        <input
          type="password"
          value={oldPassword}
          onChange={(e) => {
            setOldPassword(e.target.value), setError(null);
          }}
          className="mt-2 border-2 border-gray-300 p-2"
        />
        <p>Enter your new password:</p>
        <input
          type="password"
          value={newPassword}
          onChange={(e) => {
            setNewPassword(e.target.value), setError(null);
          }}
          className="mt-2 border-2 border-gray-300 p-2"
        />
        {error && <p className="text-red-500">{error}</p>}
        <div className="mt-4 flex justify-center">
          <button
            className="mr-2 rounded-lg bg-green-500 px-4 py-2 text-white"
            onClick={handleChangePassword}
            disabled={!oldPassword || !newPassword || isLoading}
          >
            {isLoading ? "Updating..." : "Change Password"}
          </button>
          <button
            className="rounded-lg bg-gray-300 px-4 py-2 text-black"
            onClick={onClose}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
