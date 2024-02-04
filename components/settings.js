import React, { useState, useEffect, useRef } from "react";
import { signOut } from "next-auth/react";
import Image from "next/image";
import AvatarSelectionModal from "./AvatarSelectionModal";
import ChangePasswordModal from "./ChangePasswordModal";
import ChangeUsernameModal from "./ChangeUsernameModal";
import axios from "axios";
import { useRouter } from "next/router";

export default function GameSettingsModal({
  isOpen,
  onClose,
  bgmVolume,
  sfxVolume,
  onBgmVolumeChange,
  onSfxVolumeChange,
  userFirstName,
  userAvatar,
  userRole,
}) {
  const router = useRouter();
  const [isChangeUsernameModalOpen, setIsChangeUsernameModalOpen] =
    useState(false);
  const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] =
    useState(false);

  const [localBgmVolume, setLocalBgmVolume] = useState(
    () => parseFloat(localStorage.getItem("bgmVolume")) || 0.5
  );
  const [localSfxVolume, setLocalSfxVolume] = useState(
    () => parseFloat(localStorage.getItem("sfxVolume")) || 0.5
  );

  // Change username function
  const handleChangeUsername = () => {
    setIsChangeUsernameModalOpen(true);
  };

  const handleChangePassword = () => {
    setIsChangePasswordModalOpen(true);
  };

  const logoutModalRef = useRef(null);

  useEffect(() => {
    setLocalBgmVolume(bgmVolume);
    setLocalSfxVolume(sfxVolume);
  }, [bgmVolume, sfxVolume]);

  useEffect(() => {
    // Update the avatar state when the user makes a selection
    if (userAvatar !== localAvatar) {
      setLocalAvatar(userAvatar);
    }
  }, [userAvatar]);

  const [localAvatar, setLocalAvatar] = useState(userAvatar);

  const [localName, setLocalName] = useState(userFirstName);

  const [isAvatarHovered, setIsAvatarHovered] = useState(false);
  const [isAvatarSelectionModalOpen, setIsAvatarSelectionModalOpen] =
    useState(false);

  const handleClose = () => {
    localStorage.setItem("bgmVolume", localBgmVolume.toString());
    localStorage.setItem("sfxVolume", localSfxVolume.toString());
    onClose();
  };

  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const handleLogout = () => {
    setIsLogoutModalOpen(true);
  };

  const confirmLogout = () => {
    setIsLogoutModalOpen(false);
    signOut(); // Perform the logout action
    router.push("/auth/signIn");
  };

  const cancelLogout = () => {
    setIsLogoutModalOpen(false);
  };

  return (
    <div
      className={`modal ${
        isOpen ? "modal-open" : "modal-closed"
      } font-boom text-black`}
    >
      <div className="w-xl h-4/12 flex flex-col items-center justify-center rounded-lg border-4 border-red-500 bg-white bg-contain bg-no-repeat p-4 text-black">
        {/* Close button as an "x" inside the game container */}
        <div className="flex w-full items-center justify-between">
          <button
            className="rounded-lg bg-red-500 px-4 py-2 text-white"
            onClick={handleClose}
          >
            X
          </button>
        </div>
        <h1 className="my-2 w-full border-4 border-red-400 bg-red-500 text-center font-boom text-white">
          SETTINGS
        </h1>
        <div className="flex gap-2">
          <div>
            <div className="relative flex flex-col items-center gap-2 text-center font-retropix text-white">
              {/* Placeholder for icon and account name using Tailwind CSS classes */}
              <div
                onMouseEnter={() => setIsAvatarHovered(true)}
                onMouseLeave={() => setIsAvatarHovered(false)}
              >
                {/* Display your avatar image here */}
                <Image
                  src={`/avatars/${localAvatar}.png`}
                  alt="User Icon"
                  width={500}
                  height={500}
                  className={`pointer-events-none h-40 w-40 border-4 ${
                    isAvatarHovered ? "border-red-500" : "border-gray-500"
                  }`}
                  draggable="false"
                />

                <div
                  className="absolute inset-x-0 bottom-0 flex cursor-pointer items-center justify-center bg-black bg-opacity-50"
                  onClick={() => setIsAvatarSelectionModalOpen(true)}
                >
                  Change Avatar
                </div>
              </div>
            </div>
            <div className=" x-5 text-center font-retropix text-2xl">
              {localName.toUpperCase()}
            </div>
          </div>
          <div className=" flex w-1/2 flex-col items-center justify-center gap-2">
            <button
              className="text-stroke w-full  rounded-md bg-blue-500 px-4 py-2 font-ogoby text-xl uppercase text-white hover:bg-blue-600"
              onClick={handleChangeUsername}
            >
              Change Username
            </button>
            <button
              className="text-stroke w-full  rounded-md bg-green-500 px-4 py-2 font-ogoby text-xl uppercase text-white hover:bg-green-600"
              onClick={handleChangePassword}
            >
              Change Password
            </button>
            {userRole === "instructor" && (
              <button
                className="text-stroke mb-5 w-full  rounded-md bg-gray-500 px-4 py-2 font-ogoby text-xl uppercase text-white hover:bg-gray-600"
                onClick={() => router.push("/instructor/students")}
              >
                Instructor&apos;s Page
              </button>
            )}
          </div>
        </div>

        <div className="mt-2 flex items-center p-4">
          <label className=" mr-2">BGM Volume</label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={localBgmVolume}
            onChange={(e) => {
              const volume = parseFloat(e.target.value);
              setLocalBgmVolume(volume);
              onBgmVolumeChange(volume);
            }}
          />
        </div>
        <div className="mt-2 flex items-center">
          <label className=" mr-2">SFX Volume</label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={localSfxVolume}
            onChange={(e) => {
              const volume = parseFloat(e.target.value);
              setLocalSfxVolume(volume);
              onSfxVolumeChange(volume);
            }}
          />
        </div>
        <div className="mt-4">
          {/* Logout button with confirmation modal */}
          <button
            className="my-4 rounded-lg bg-red-500 px-4 py-2 text-white"
            onClick={handleLogout}
          >
            Logout
          </button>

          {/* Logout confirmation modal */}
          {isLogoutModalOpen && (
            <div
              className="fixed inset-0 flex items-center justify-center  bg-black bg-opacity-50"
              ref={logoutModalRef}
            >
              <div className="font rounded-lg border-4 border-red-500 bg-white p-4 text-center font-ogoby text-xl">
                <p>Are you sure you want to log out?</p>
                <div className="mt-4 flex justify-center">
                  <button
                    className="mr-2 rounded-lg bg-red-500 px-4 py-2 text-white"
                    onClick={cancelLogout}
                  >
                    No
                  </button>
                  <button
                    className="rounded-lg bg-gray-300 px-4 py-2 text-black"
                    onClick={confirmLogout}
                  >
                    Yes
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
        {isChangeUsernameModalOpen && (
          <ChangeUsernameModal
            onClose={() => setIsChangeUsernameModalOpen(false)}
            onChangeUsername={(newUsername) => {
              setLocalName(newUsername);
              setIsChangePasswordModalOpen(false);
            }}
            username={userFirstName}
          />
        )}

        {/* Change Password Modal */}
        {isChangePasswordModalOpen && (
          <ChangePasswordModal
            onClose={() => setIsChangePasswordModalOpen(false)}
            onChangePassword={() => {
              setIsChangePasswordModalOpen(false);
            }}
            username={userFirstName}
          />
        )}
        {isAvatarSelectionModalOpen && (
          <AvatarSelectionModal
            onClose={() => setIsAvatarSelectionModalOpen(false)}
            onSelectAvatar={(newAvatar) => {
              setLocalAvatar(newAvatar); // Update the local avatar immediately
              setIsAvatarSelectionModalOpen(false);
            }}
            uname={userFirstName}
          />
        )}
      </div>
    </div>
  );
}
