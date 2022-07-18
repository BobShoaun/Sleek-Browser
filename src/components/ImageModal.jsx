import { useState } from "react";
import "./modal.css";

const ImageModal = ({ src, alt, onClose }) => {
  const [zoomedIn, setZoomedIn] = useState(false);
  return (
    <main
      onClick={onClose}
      className="cursor-pointer px-20 py-10 absolute inset-0 bg-black backdrop-filter backdrop-blur-sm bg-opacity-10 z-30"
    >
      <div
        onClick={e => e.stopPropagation()}
        className="image-modal h-full flex flex-col cursor-auto bg-gray-100 dark:bg-gray-800 rounded-sm p-2 shadow-2xl"
      >
        <div
          onClick={() => setZoomedIn(zoomed => !zoomed)}
          className={`h-full w-full overflow-auto bg-black p-5 ${
            zoomedIn ? "cursor-zoom-out" : "cursor-zoom-in"
          }`}
        >
          <img
            src={src}
            alt={alt}
            className={`${
              zoomedIn
                ? "-min-h-full min-w-full w-auto h-auto"
                : "w-full h-full object-scale-down"
            } m-auto`}
          />
        </div>
      </div>
    </main>
  );
};

export default ImageModal;
