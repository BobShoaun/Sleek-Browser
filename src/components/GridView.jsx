import { useRef, useState, useContext } from "react";
import { Folder } from "react-feather";
import { getIconFromExtension } from "../helpers";
import path from "path-browserify";

const GridView = ({
  currentItems,
  showNewFolder,
  onNavigate,
  onPreview,
  onCreateFolder,
  onContextMenu,
  onCopyUrl,
}) => {
  const selectionMode = false;
  const newFolderInput = useRef(null);

  const [selectedIndex, setSelectedIndex] = useState(-1);

  return (
    <div className="grid entries gap-x-2 gap-y-3 p-3.5 items-start place-content-start min-h-full">
      {currentItems.map((item, index) => {
        const Icon = item.isDirectory
          ? Folder
          : getIconFromExtension(path.extname(item.path));
        return (
          <button
            title={path.basename(item.path)}
            onDoubleClick={() => item.isDirectory && onNavigate(item.path)}
            onClick={() => {
              setSelectedIndex(index);
              if (item.isDirectory) return;
              selectionMode ? onCopyUrl(item) : onPreview(item);
            }}
            onContextMenu={e => {
              e.preventDefault();
              e.stopPropagation();
              onContextMenu(item, e.pageX, e.pageY);
            }}
            className="py-3.5 px-2 hover:bg-gray-200 dark:hover:bg-gray-800 focus:bg-gray-300 dark:focus:bg-gray-700 transition-colors rounded-sm"
            key={item.path}
          >
            <Icon
              className="text-gray-600 dark:text-gray-300 mx-auto mb-1.5"
              size={40}
            />

            <p className="text-center text-sm text-gray-700 dark:text-gray-200 break-words">
              {path.basename(item.path) || "-"}
            </p>
          </button>
        );
      })}

      {showNewFolder && (
        <div className="py-3.5 px-2 bg-gray-200 dark:bg-gray-800 rounded-sm">
          <Folder
            className="text-gray-600 dark:text-gray-300 mx-auto mb-1"
            size={40}
          />
          <form
            onSubmit={e => {
              e.preventDefault();
              onCreateFolder(newFolderInput.current.value);
            }}
          >
            <input
              ref={newFolderInput}
              autoFocus
              type="text"
              defaultValue="New folder"
              onBlur={() => onCreateFolder(newFolderInput.current.value)}
              onFocus={e => e.target.select()}
              className="w-full px-1 bg-gray-100 dark:bg-gray-800 border-2 border-gray-500 rounded-sm text-center text-sm text-gray-700 dark:text-gray-200 break-words"
            />
          </form>
        </div>
      )}
    </div>
  );
};

export default GridView;
