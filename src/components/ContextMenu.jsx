import { useRef, useState, useEffect, useContext } from "react";
import { useClickOutside } from "../hooks/useClickOutside";
import {
  Trash2,
  Copy,
  Link,
  Download,
  FolderPlus,
  UploadCloud,
  BarChart,
  Eye,
  List,
  Grid,
  ChevronRight,
  RefreshCw,
} from "react-feather";
import RadioButton from "./RadioButton";
import { FileBrowserContext } from "../FileBrowser";

const ContextMenu = ({
  item,
  position,
  onClose,
  show,
  onDownload,
  onToast,
  onDeleteFile,
  onDeleteFolder,
  canUpload,
  onUpload,
  onNewFolder,
}) => {
  const wrapperRef = useRef(null);
  useClickOutside(wrapperRef, () => {
    setShow(false);
    onClose();
  });

  const [_show, setShow] = useState(false);

  useEffect(() => {
    setShow(show);
  }, [show]);

  const copyUrl = () => {
    navigator.clipboard.writeText(item.url ?? item.path);
    onToast(`Copied URL to clipboard.`);
    onClose();
  };

  const copyPath = () => {
    navigator.clipboard.writeText(item.path);
    onToast(`Copied path to clipboard.`);
    onClose();
  };

  const mode = item ? (item.isDirectory ? "directory" : "file") : "general";

  const { refresh, setView, sortField, setSortField, sortOrder, setSortOrder } =
    useContext(FileBrowserContext);

  return (
    <main
      ref={wrapperRef}
      style={{
        top: position.y,
        left: position.x,
        opacity: _show ? 1 : 0,
        pointerEvents: _show ? "all" : "none",
        minWidth: "8em",
      }}
      className="bg-gray-100 dark:bg-gray-800 rounded-sm absolute shadow-lg p-1 transition-opacity z-40"
    >
      <ul className="text-sm text-gray-700 dark:text-gray-100 space-y-1">
        {mode === "general" && (
          <>
            <li className="group relative">
              <button className="list-button flex items-center">
                <Eye size={13} /> <p>View</p>{" "}
                <ChevronRight className="ml-auto" size={15} />
              </button>
              <ul
                className="group-hover:opacity-100 group-hover:z-50 opacity-0 absolute top-0 left-full space-y-1 bg-gray-100 dark:bg-gray-800 text-sm text-gray-700 dark:text-gray-100 shadow-lg p-1 transition-opacity"
                style={{ minWidth: "8em" }}
              >
                <li>
                  <button
                    onClick={() => (onClose(), setView("list"))}
                    className="list-button flex items-center"
                  >
                    <List size={13} /> <p>List</p>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => (onClose(), setView("grid"))}
                    className="list-button flex items-center"
                  >
                    <Grid size={13} /> <p>Grid</p>
                  </button>
                </li>
              </ul>
            </li>
            <li className="group relative">
              <button className="list-button flex items-center">
                <BarChart size={13} /> <p>Sort</p>{" "}
                <ChevronRight className="ml-auto" size={15} />
              </button>
              <ul
                className="group-hover:opacity-100 group-hover:z-50 opacity-0 absolute top-0 left-full space-y-1 bg-gray-100 dark:bg-gray-800 text-sm text-gray-700 dark:text-gray-100 shadow-lg p-1 transition-opacity"
                style={{ minWidth: "8em" }}
              >
                <li>
                  <RadioButton
                    onChange={setSortField}
                    field={sortField}
                    value="name"
                    title="Name"
                  />
                </li>
                <li>
                  <RadioButton
                    onChange={setSortField}
                    field={sortField}
                    value="date"
                    title="Last Modified"
                  />
                </li>
                <li>
                  <RadioButton
                    onChange={setSortField}
                    field={sortField}
                    value="type"
                    title="Type"
                  />
                </li>
                <li>
                  <RadioButton
                    onChange={setSortField}
                    field={sortField}
                    value="size"
                    title="Size"
                  />
                </li>
                <hr className="my-1 dark:border-gray-500" />

                <li>
                  <RadioButton
                    onChange={setSortOrder}
                    field={sortOrder}
                    value="asc"
                    title="Ascending"
                  />
                </li>
                <li>
                  <RadioButton
                    onChange={setSortOrder}
                    field={sortOrder}
                    value="desc"
                    title="Descending"
                  />
                </li>
              </ul>
            </li>
            <li>
              <button
                onClick={() => (onClose(), refresh())}
                className="list-button flex items-center"
              >
                <RefreshCw size={13} /> <p>Refresh</p>
              </button>
            </li>
            {canUpload && (
              <>
                <li>
                  <button
                    onClick={() => (onClose(), onUpload())}
                    className="list-button flex items-center"
                  >
                    <UploadCloud size={13} /> <p>Upload File(s)</p>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => (onClose(), onNewFolder())}
                    className="list-button flex items-center"
                  >
                    <FolderPlus size={13} /> <p>New Folder</p>
                  </button>
                </li>
              </>
            )}
          </>
        )}

        {mode === "directory" && (
          <>
            <li>
              <button
                onClick={copyPath}
                className="list-button flex items-center"
              >
                <Link size={13} /> <p>Copy Path</p>
              </button>
            </li>
            <li>
              <button
                // disabled
                onClick={() => (onClose(), onDeleteFolder(item.path))}
                className="list-button disabled:cursor-not-allowed flex items-center"
              >
                <Trash2 size={13} /> <p>Delete</p>
              </button>
            </li>
          </>
        )}

        {mode === "file" && (
          <>
            <li>
              <button
                onClick={() => (onClose(), onDownload(item))}
                className="list-button flex items-center"
              >
                <Download size={13} /> <p>Download</p>
              </button>
            </li>
            <li>
              <button
                onClick={copyUrl}
                className="list-button flex items-center"
              >
                <Link size={13} /> <p>Copy URL</p>
              </button>
            </li>
            <li>
              <button
                onClick={() => (onClose(), onDeleteFile(item))}
                className="list-button flex items-center"
              >
                <Trash2 size={13} /> <p>Delete</p>
              </button>
            </li>
          </>
        )}
      </ul>
    </main>
  );
};

export default ContextMenu;
