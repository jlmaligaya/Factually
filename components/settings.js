import React, { useState, useEffect } from "react";
import { signOut } from "next-auth/react";
import Image from "next/image";

export default function GameSettingsModal({
  isOpen,
  onClose,
  bgmVolume,
  sfxVolume,
  onBgmVolumeChange,
  onSfxVolumeChange,
  userFirstName,
  userAvatar,
}) {
  const [localBgmVolume, setLocalBgmVolume] = useState(
    () => parseFloat(localStorage.getItem("bgmVolume")) || 0.5
  );
  const [localSfxVolume, setLocalSfxVolume] = useState(
    () => parseFloat(localStorage.getItem("sfxVolume")) || 0.5
  );

  useEffect(() => {
    setLocalBgmVolume(bgmVolume);
    setLocalSfxVolume(sfxVolume);
  }, [bgmVolume, sfxVolume]);

  const handleClose = () => {
    localStorage.setItem("bgmVolume", localBgmVolume.toString());
    localStorage.setItem("sfxVolume", localSfxVolume.toString());
    onClose();
  };

  // Placeholder for account name and icon
  const placeholderAccountName = "John Doe";
  const placeholderIcon = (
    <Image
      src={`/avatars/${userAvatar}.png`}
      alt="User Icon"
      width={500}
      height={500}
      className="pointer-events-none h-40 w-40 border-4 border-gray-500"
      draggable="false"
    />
  );

  return (
    <div
      className={`modal ${
        isOpen ? "modal-open" : "modal-closed"
      } font-boom text-black`}
    >
      <div className="w-4xl h-4/12 flex flex-col items-center justify-center rounded-lg border-4 border-red-500 bg-white bg-contain bg-no-repeat p-4 text-black">
        {/* Close button as an "x" inside the game container */}
        <div className="flex w-full items-center justify-between">
          <button
            className="rounded-lg bg-red-500 px-4 py-2 text-white"
            onClick={handleClose}
          >
            X
          </button>
        </div>
        <div className="flex w-full flex-col items-center gap-2">
          {/* Placeholder for icon and account name using Tailwind CSS classes */}
          <div>{placeholderIcon}</div>
          <div className=" x-5 font-retropix text-2xl">
            {userFirstName.toUpperCase()}
          </div>
        </div>
        <h1 className="mt-4 border-4 border-red-400 bg-red-500 p-2 text-white">
          Settings
        </h1>
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
          {/* Logout button */}
          <button
            className="my-4 rounded-lg bg-red-500 px-4 py-2 text-white"
            onClick={signOut}
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
