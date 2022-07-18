import "./toast.css";
import { useEffect } from "react";

const Toast = ({ message, open, onClose }) => {
  const duration = 2000;

  useEffect(() => {
    let timeout = null;
    if (open) timeout = setTimeout(onClose, duration);
    return () => clearTimeout(timeout);
  }, [open]);

  return (
    <button
      onClick={onClose}
      className={`${
        open ? "toast-open" : "toast-close"
      } cursor-pointer transition-transform duration-300 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 px-7 py-2.5 absolute top-1.5 rounded-full left-1/2 shadow-xl z-30`}
    >
      <p className="text-sm text-center text-gray-700 dark:text-gray-100">
        {message}
      </p>
    </button>
  );
};

export default Toast;
