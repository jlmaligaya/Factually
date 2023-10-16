const ImageOverlay = ({ imageUrl, onClose }) => (
  <div className="fixed top-0 left-0 z-50 flex h-full w-full items-center justify-center bg-black bg-opacity-75">
    <div className="relative">
      <button
        onClick={onClose}
        className="absolute top-2 right-2 rounded-full bg-red-500 p-2 text-2xl text-white focus:outline-none hover:bg-red-600"
      >
        X
      </button>
      <img src={imageUrl} alt="Selected" className="max-h-full max-w-full" />
    </div>
  </div>
);

export default ImageOverlay;
