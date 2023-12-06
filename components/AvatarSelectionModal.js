// AvatarSelectionModal.js
import React, { useState } from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import axios from "axios";

const AvatarSelectionModal = ({ onClose, onSelectAvatar, uname }) => {
  const [selectedAvatar, setSelectedAvatar] = useState(1); // Default selected avatar
  const { data: session } = useSession();

  const handleAvatarClick = (avatarIndex) => {
    setSelectedAvatar(avatarIndex);
  };

  const handleSaveAvatar = async () => {
    // Update the user's avatar using the Axios library
    try {
      const response = await axios.post(
        "/api/updateAvatar",
        {
          username: session.user.username,
          avatar: selectedAvatar.toString(),
        },
        { withCredentials: true }
      );

      if (response.status === 200) {
        const updatedUser = response.data;

        // Call the callback to inform the parent component about the avatar selection
        onSelectAvatar(updatedUser.avatar);

        // Close the modal
        onClose();
      } else {
        console.error("Error updating avatar:", response.statusText);
        // Handle the error, e.g., show an error message to the user
      }
    } catch (error) {
      console.error("Error updating avatar:", error);
      // Handle the error, e.g., show an error message to the user
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative z-50 rounded-lg bg-white p-8 shadow-lg">
        <h2 className="mb-10 text-center font-boom text-2xl font-bold text-black">
          Select Your Avatar
        </h2>

        <div className="grid grid-cols-3 gap-4">
          {/* Add your avatar images and customize the UI based on your design */}
          {[1, 2, 3, 4, 5, 6].map((avatarIndex) => (
            <div
              key={avatarIndex}
              className={`h-30 w-30 cursor-pointer rounded-full ${
                selectedAvatar === avatarIndex ? "border-4 border-red-500" : ""
              }`}
              onClick={() => handleAvatarClick(avatarIndex)}
            >
              {/* Display your avatar image here */}
              <Image
                src={`/avatars/${avatarIndex}.png`}
                alt={`Avatar ${avatarIndex}`}
                height={100}
                width={100}
                className="h-full w-full rounded-full object-cover"
              />
            </div>
          ))}
        </div>

        <div className="mt-6 flex justify-center font-boom">
          <button
            className="rounded bg-red-500 px-4 py-2 text-white hover:bg-blue-600"
            onClick={handleSaveAvatar}
          >
            Save
          </button>
          {/* <button
            className="ml-2 rounded bg-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-400"
            onClick={onClose}
          >
            Cancel
          </button> */}
        </div>
      </div>
    </div>
  );
};

export default AvatarSelectionModal;
