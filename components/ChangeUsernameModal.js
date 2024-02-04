import React, { useState } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";

export default function ChangeUsernameModal({
  onClose,
  onChangeUsername,
  username,
}) {
  const [newUsername, setNewUsername] = useState("");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { data: session } = useSession();

  const handleChangeUsername = async () => {
    setError("");
    const trimmedUsername = newUsername.trim(); // Trim the new username
    if (!trimmedUsername) {
      setError("Please enter a new username.");
      return;
    }

    if (trimmedUsername === username) {
      setError("New username must be different from the current username.");
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post("/api/changeUsername", {
        newUsername: trimmedUsername, // Use trimmedUsername here
        username,
      });
      console.log("Username updated successfully:", response.data);
      session.user.username = trimmedUsername; // Update the username in the session
      onChangeUsername(trimmedUsername); // Call the onChangeUsername function
      onClose();
    } catch (error) {
      if (error.response?.data?.error === "Username already exists") {
        setError("Username already exists, please choose another one");
      } else {
        setError(error.response?.data?.message || "Failed to update username");
      }
    }
    session.user.username = trimmedUsername; // Update the username in the session
    onClose();
    setIsLoading(false);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="font rounded-lg border-4 border-blue-500 bg-white p-4 text-center font-ogoby text-xl">
        <p>Enter your new username:</p>
        <input
          type="text"
          value={newUsername}
          onChange={(e) => {
            setNewUsername(e.target.value), setError(null);
          }}
          className="mt-2 border-2 border-gray-300 p-2"
        />
        {error && <p className="text-red-500">{error}</p>}
        <div className="mt-4 flex justify-center">
          <button
            className="mr-2 rounded-lg bg-blue-500 px-4 py-2 text-white"
            onClick={handleChangeUsername}
            disabled={isLoading}
          >
            {isLoading ? "Updating..." : "Change Username"}
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
