import React, { useState, useEffect } from 'react';
import { signOut } from 'next-auth/react';
import Image from 'next/image';

export default function GameSettingsModal({
  isOpen,
  onClose,
  bgmVolume,
  sfxVolume,
  onBgmVolumeChange,
  onSfxVolumeChange,
  userFirstName,
}) {
  const [localBgmVolume, setLocalBgmVolume] = useState(() =>
    parseFloat(localStorage.getItem('bgmVolume')) || 0.5
  );
  const [localSfxVolume, setLocalSfxVolume] = useState(() =>
    parseFloat(localStorage.getItem('sfxVolume')) || 0.5
  );

  useEffect(() => {
    setLocalBgmVolume(bgmVolume);
    setLocalSfxVolume(sfxVolume);
  }, [bgmVolume, sfxVolume]);

  const handleClose = () => {
    localStorage.setItem('bgmVolume', localBgmVolume.toString());
    localStorage.setItem('sfxVolume', localSfxVolume.toString());
    onClose();
  };

  // Placeholder for account name and icon
  const placeholderAccountName = "John Doe";
  const placeholderIcon = (
    <Image
      src=""
      alt="User Icon"
      className="h-40 w-40 rounded-full bg-black"
      draggable='false'
    />

  );

  return (
    <div className={`modal ${isOpen ? 'modal-open' : 'modal-closed'} font-boom text-black`}>
      <div className="bg-white border-red-500 border-4 bg-contain bg-no-repeat w-4xl h-4/12 p-4 flex flex-col justify-center items-center text-black rounded-lg">
        {/* Close button as an "x" inside the game container */}
        <div className="w-full flex justify-between items-center">
          <button className="bg-red-500 text-white px-4 py-2 rounded-lg" onClick={handleClose}>
            X
          </button>
        </div>
        <div className="flex items-center gap-2 flex-col w-full">
            {/* Placeholder for icon and account name using Tailwind CSS classes */}
            <div>
              {placeholderIcon}
            </div>
            <div className=" text-2xl font-retropix x-5">
              {userFirstName.toUpperCase()}
            </div>
          </div>
          <h1 className='mt-4 bg-red-500 p-2 border-red-400 border-4 text-white'>Settings</h1>
        <div className="flex items-center mt-2 p-4">
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
        <div className="flex items-center mt-2">
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
          <button className="bg-red-500 text-white px-4 py-2 rounded-lg my-4" onClick={signOut}>
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
