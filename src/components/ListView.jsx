import { useRef, useState, useContext } from "react";
import { formatBytes } from "../helpers";
import moment from "moment";
import path from "path";
import { Folder, ChevronUp, ChevronDown } from "react-feather";
import { getIconFromExtension } from "../helpers";
import { AppContext } from "../App";
import { FileBrowserContext } from "../FileBrowser";

const ListView = ({
  showNewFolder,
  onNavigate,
  onPreview,
  onCreateFolder,
  onContextMenu,
  onCopyUrl,
}) => {
  const selectionMode = false;
  const chevronSize = 13;
  const { filteredItems, sortField, setSortField, sortOrder, setSortOrder } =
    useContext(FileBrowserContext);

  const newFolderInput = useRef(null);
  const [selectedIndex, setSelectedIndex] = useState(-1);

  const setSortFieldOrder = field => {
    setSortOrder(
      sortField !== field ? "asc" : sortOrder === "asc" ? "desc" : "asc"
    );
    setSortField(field);
  };

  return (
    <table className="table-auto w-full border-collapse border-b border-gray-300 dark:border-gray-800">
      <thead className="sticky top-0 shadow-md">
        <tr className="text-left bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-200 text-sm py-3 select-none">
          <th className="px-3 py-2"></th>
          <th
            onClick={() => setSortFieldOrder("name")}
            className="px-3 py-2 cursor-pointer hover:bg-gray-300 dark:hover:bg-gray-700"
          >
            <div className="flex items-center font-medium">
              <p>Name</p>
              <div className="ml-auto pl-2">
                <ChevronUp
                  size={chevronSize}
                  className={`-mb-1 ${
                    sortField === "name" && sortOrder === "asc"
                      ? "text-gray-800 dark:text-gray-100"
                      : "text-gray-400 dark:text-gray-600"
                  }`}
                />
                <ChevronDown
                  size={chevronSize}
                  className={`-mt-1 ${
                    sortField === "name" && sortOrder === "desc"
                      ? "text-gray-800 dark:text-gray-100"
                      : "text-gray-400 dark:text-gray-600"
                  }`}
                />
              </div>
            </div>
          </th>
          <th
            onClick={() => setSortFieldOrder("date")}
            className="px-3 py-2 cursor-pointer hover:bg-gray-300 dark:hover:bg-gray-700"
          >
            <div className="flex items-center font-medium">
              <p>Date Modified</p>
              <div className="ml-auto pl-2">
                <ChevronUp
                  size={chevronSize}
                  className={`-mb-1 ${
                    sortField === "date" && sortOrder === "asc"
                      ? "text-gray-800 dark:text-gray-100"
                      : "text-gray-400 dark:text-gray-600"
                  }`}
                />
                <ChevronDown
                  size={chevronSize}
                  className={`-mt-1 ${
                    sortField === "date" && sortOrder === "desc"
                      ? "text-gray-800 dark:text-gray-100"
                      : "text-gray-400 dark:text-gray-600"
                  }`}
                />
              </div>
            </div>
          </th>

          <th
            onClick={() => setSortFieldOrder("type")}
            className="px-3 py-2 cursor-pointer hover:bg-gray-300 dark:hover:bg-gray-700"
          >
            <div className="flex items-center font-medium">
              <p>Type</p>
              <div className="ml-auto pl-2">
                <ChevronUp
                  size={chevronSize}
                  className={`-mb-1 ${
                    sortField === "type" && sortOrder === "asc"
                      ? "text-gray-800 dark:text-gray-100"
                      : "text-gray-400 dark:text-gray-600"
                  }`}
                />
                <ChevronDown
                  size={chevronSize}
                  className={`-mt-1 ${
                    sortField === "type" && sortOrder === "desc"
                      ? "text-gray-800 dark:text-gray-100"
                      : "text-gray-400 dark:text-gray-600"
                  }`}
                />
              </div>
            </div>
          </th>

          <th
            onClick={() => setSortFieldOrder("size")}
            className="px-3 py-2 cursor-pointer hover:bg-gray-300 dark:hover:bg-gray-700"
          >
            <div className="flex items-center font-medium">
              <p>Size</p>
              <div className="ml-auto pl-2">
                <ChevronUp
                  size={chevronSize}
                  className={`-mb-1 ${
                    sortField === "size" && sortOrder === "asc"
                      ? "text-gray-800 dark:text-gray-100"
                      : "text-gray-400 dark:text-gray-600"
                  }`}
                />
                <ChevronDown
                  size={chevronSize}
                  className={`-mt-1 ${
                    sortField === "size" && sortOrder === "desc"
                      ? "text-gray-800 dark:text-gray-100"
                      : "text-gray-400 dark:text-gray-600"
                  }`}
                />
              </div>
            </div>
          </th>
        </tr>
      </thead>
      <tbody>
        {filteredItems.map((item, index) => {
          const Icon = item.isDirectory
            ? Folder
            : getIconFromExtension(path.extname(item.path));
          return (
            <tr
              title={path.basename(item.path)}
              key={item.path}
              tabIndex={index}
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
              className="cursor-pointer bg-gray-100 dark:bg-gray-900 even:bg-gray-200 dark:even:bg-gray-800 hover:bg-gray-300 focus:bg-gray-300 dark:hover:bg-gray-700 dark:focus:bg-gray-700 text-sm"
            >
              <td className="px-3 py-1">
                <Icon
                  className="text-gray-600 dark:text-gray-300 ml-auto"
                  size={13}
                />
              </td>
              <td
                className="px-3 py-1 text-gray-900 dark:text-gray-200 whitespace-nowrap overflow-ellipsis overflow-hidden select-none"
                style={{ maxWidth: "26rem" }}
              >
                {path.basename(item.path) || " -"}
              </td>
              <td className="px-3 py-1 text-gray-500 dark:text-gray-400 whitespace-nowrap">
                {item.isDirectory
                  ? "-"
                  : moment(item.lastModified).format("llll")}
              </td>
              <td className="px-3 py-1 text-gray-500 dark:text-gray-400 whitespace-nowrap">
                {item.isDirectory
                  ? "folder"
                  : path.extname(item.path) || "file"}
              </td>
              <td className="px-3 py-1 text-gray-500 dark:text-gray-400 whitespace-nowrap">
                {item.isDirectory ? "-" : formatBytes(parseInt(item.size))}
              </td>
            </tr>
          );
        })}
        {showNewFolder && (
          <tr className="cursor-pointer bg-gray-300 dark:bg-gray-700 text-sm">
            <td className="px-3 py-1">
              <Folder
                className="text-gray-600 dark:text-gray-300 ml-auto"
                size={13}
              />
            </td>
            <td className="px-3 py-1 text-gray-900 dark:text-gray-100">
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
                  className="w-full px-2 border-2 border-gray-500 rounded-sm text-sm bg-gray-100 dark:bg-gray-800"
                />
              </form>
            </td>

            <td className="px-3 py-1 text-gray-500 dark:text-gray-400">
              {moment().format("llll")}
            </td>
            <td className="px-3 py-1 text-gray-500 dark:text-gray-400">
              folder
            </td>
            <td className="px-3 py-1 text-gray-500 dark:text-gray-400">-</td>
          </tr>
        )}
      </tbody>
    </table>
  );
};

export default ListView;
