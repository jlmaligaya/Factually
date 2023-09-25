import React, { useState, useEffect } from 'react';
import { signOut } from 'next-auth/react';

export default function GameSettingsModal({
  isOpen,
  onClose,
  bgmVolume,
  sfxVolume,
  onBgmVolumeChange,
  onSfxVolumeChange,
}) {
  // Initialize the local state values once when the component mounts
  const [localBgmVolume, setLocalBgmVolume] = useState(() =>
    parseFloat(localStorage.getItem('bgmVolume')) || 0.5
  );
  const [localSfxVolume, setLocalSfxVolume] = useState(() =>
    parseFloat(localStorage.getItem('sfxVolume')) || 0.5
  );

  useEffect(() => {
    // Listen for changes to the bgmVolume and sfxVolume props and update the local state
    setLocalBgmVolume(bgmVolume);
    setLocalSfxVolume(sfxVolume);
  }, [bgmVolume, sfxVolume]);

  const handleClose = () => {
    localStorage.setItem('bgmVolume', localBgmVolume.toString());
    localStorage.setItem('sfxVolume', localSfxVolume.toString());
    onClose();
  };

  return (
    <div className={`modal ${isOpen ? 'modal-open' : 'modal-closed'} font-boom text-black`}>
      <div className="game-settings-container flex justify-center items-center flex-col bg-[url('../public/assets/activity/l_main.svg')] bg-contain bg-no-repeat h-1/2 w-4/12" style={{ backgroundSize: '100% 100%' }}>
        <div className="game-title-container p-15">
          <h2 className="game-title">Game Settings</h2>
        </div>
        <div className="volume-container">
          <div className="volume-label-container">
            <label className="volume-label">BGM Volume</label>
          </div>
          <div className="volume-slider-container">
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
        </div>
        <div className="volume-container">
          <div className="volume-label-container">
            <label className="volume-label">SFX Volume</label>
          </div>
          <div className="volume-slider-container">
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
        </div>
        <div className="button-container">
          <button className="close-button" onClick={handleClose}>
            Close
          </button>
          {/* Logout button */}
        <button className="close-button" onClick={signOut}>Logout</button>
        </div>
      </div>
    </div>
  );
}