import { useEffect } from "react";

/**
 * Hook that alerts clicks outside of the passed ref
 */
export const useClickOutside = (ref, onClickOutside) => {
  useEffect(() => {
    /**
     * Alert if clicked on outside of element
     */
    const handleClickOutside = e => {
      if (ref.current && !ref.current.contains(e.target)) onClickOutside();
    };

    // Bind the event listener
    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      // Unbind the event listener on clean up
      document.removeEventListener("mousedown", handleClickOutside);
  }, [ref]);
};
