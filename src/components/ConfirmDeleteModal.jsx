import { useMemo } from "react";
import path from "path";
import { getIconFromExtension } from "../helpers";
import "./modal.css";

const ConfirmDeleteModal = ({ onClose, onDelete, file }) => {
  const extension = path.extname(file?.path);
  const Icon = useMemo(() => getIconFromExtension(extension), [file]);

  return (
    <main
      onClick={onClose}
      className="bg-black cursor-pointer transition-all backdrop-filter backdrop-blur-sm bg-opacity-10 fixed inset-0 z-30"
    >
      <div
        onClick={e => e.stopPropagation()}
        className="modal bg-gray-100 dark:bg-gray-800 cursor-auto shadow-2xl max-h-screen p-5 rounded-sm fixed z-30 left-0 right-0 top-1/2 -translate-y-1/2 transform max-w-lg m-auto"
      >
        <h1 className="text-lg font-medium text-gray-500 dark:text-gray-300 mb-2">
          Delete this file?
        </h1>
        <hr className="mb-4 bg-gray-500" />
        <div className="flex items-center mb-4 gap-2">
          <Icon className="text-gray-600 dark:text-gray-300 mx-4" size={30} />
          <div className="">
            <h3 className="text-gray-700 dark:text-gray-200 font-bold">
              {path.basename(file.path)}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm break-all">
              {file.path}
            </p>
          </div>
        </div>

        <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 ml-1">
          Warning: This action cannot be undone.
        </p>

        <div className="text-right">
          <button
            onClick={onClose}
            className="bg-gray-300 dark:bg-gray-700 shadow-sm transition-all hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-500 dark:text-gray-300 font-semibold rounded-sm py-1 px-3"
          >
            Cancel
          </button>
          <button
            onClick={() => (onDelete(), onClose())}
            className="ml-3 bg-red-500 shadow-md transition-all hover:bg-red-400 text-red-200 hover:text-red-100 font-semibold rounded-sm py-1 px-3"
          >
            Yes, Permanently Delete
          </button>
        </div>
      </div>
    </main>
  );
};

export default ConfirmDeleteModal;
