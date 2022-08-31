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
  Scissors,
  Clipboard,
  Edit,
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
  onPaste,
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

  const {
    refresh,
    setView,
    sortField,
    setSortField,
    sortOrder,
    setSortOrder,
    setClipboardItemPath,
    setClipboardMode,
    currentPath,
  } = useContext(FileBrowserContext);

  const copy = () => {
    setClipboardItemPath(item.path);
    setClipboardMode("copy");
    onClose();
  };

  const cut = () => {
    setClipboardItemPath(item.path);
    setClipboardMode("cut");
    onClose();
  };

  const paste = () => {
    onPaste(mode === "general" ? currentPath : item.path);
    onClose();
  };

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
            <li>
              <button onClick={paste} className="list-button flex items-center">
                <Clipboard size={13} />
                <p>Paste</p>
              </button>
            </li>
            <li className="group relative">
              <button className="list-button flex items-center">
                <Eye size={13} /> <p>View</p>{" "}
                <ChevronRight className="ml-auto" size={15} />
              </button>
              <ul
                className={`group-focus-within:opacity-100 group-focus-within:pointer-events-auto 
                group-hover:opacity-100 group-hover:pointer-events-auto pointer-events-none opacity-0 
                absolute min-w-[8em] top-0 left-full space-y-1 bg-gray-100 dark:bg-gray-800 text-sm 
                text-gray-700 dark:text-gray-100 shadow-lg p-1 transition-opacity`}
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
                <BarChart size={13} /> <p>Sort</p>
                <ChevronRight className="ml-auto" size={15} />
              </button>
              <div
                tabIndex={1}
                className={`group-focus-within:opacity-100 group-focus-within:pointer-events-auto 
                group-hover:opacity-100 group-hover:pointer-events-auto pointer-events-none opacity-0 
                absolute top-0 left-full space-y-1 bg-gray-100 dark:bg-gray-800 text-sm text-gray-700 
                dark:text-gray-100 shadow-lg p-1 transition-opacity`}
              >
                <fieldset>
                  <legend className="sr-only">Sort Field</legend>
                  <RadioButton
                    onChange={setSortField}
                    field={sortField}
                    value="name"
                    title="Name"
                    name="sort-field-2"
                  />
                  <RadioButton
                    onChange={setSortField}
                    field={sortField}
                    value="date"
                    title="Date Modified"
                    name="sort-field-2"
                  />
                  <RadioButton
                    onChange={setSortField}
                    field={sortField}
                    value="type"
                    title="Type"
                    name="sort-field-2"
                  />
                  <RadioButton
                    onChange={setSortField}
                    field={sortField}
                    value="size"
                    title="Size"
                    name="sort-field-2"
                  />
                </fieldset>
                <hr className="my-2 dark:border-gray-700" role="none" />

                <fieldset>
                  <legend className="sr-only">Sort Order</legend>
                  <RadioButton
                    onChange={setSortOrder}
                    field={sortOrder}
                    value="asc"
                    title="Ascending"
                    name="sort-order-2"
                  />
                  <RadioButton
                    onChange={setSortOrder}
                    field={sortOrder}
                    value="desc"
                    title="Descending"
                    name="sort-order-2"
                  />
                </fieldset>
              </div>
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
              <button onClick={copy} className="list-button flex items-center">
                <Copy size={13} />
                <p>Copy</p>
              </button>
            </li>
            <li>
              <button onClick={cut} className="list-button flex items-center">
                <Scissors size={13} />
                <p>Cut</p>
              </button>
            </li>
            <li>
              <button onClick={paste} className="list-button flex items-center">
                <Clipboard size={13} />
                <p>Paste</p>
              </button>
            </li>
            <li>
              <button
                onClick={copyPath}
                className="list-button flex items-center"
              >
                <Link size={13} />
                <p>Copy Path</p>
              </button>
            </li>
            <hr className="my-2 dark:border-gray-600" />
            <li>
              <button
                onClick={() => onClose()}
                className="list-button flex items-center"
              >
                <Edit size={13} />
                <p>Rename</p>
              </button>
            </li>

            <li>
              <button
                onClick={() => (onClose(), onDeleteFolder(item.path))}
                className="list-button disabled:cursor-not-allowed flex items-center"
              >
                <Trash2 size={13} />
                <p>Delete</p>
              </button>
            </li>
          </>
        )}

        {mode === "file" && (
          <>
            <li>
              <button onClick={copy} className="list-button flex items-center">
                <Copy size={13} />
                <p>Copy</p>
              </button>
            </li>
            <li>
              <button onClick={cut} className="list-button flex items-center">
                <Scissors size={13} />
                <p>Cut</p>
              </button>
            </li>
            <li>
              <button onClick={paste} className="list-button flex items-center">
                <Clipboard size={13} />
                <p>Paste</p>
              </button>
            </li>

            <li>
              <button
                onClick={copyUrl}
                className="list-button flex items-center"
              >
                <Link size={13} />
                <p>Copy URL</p>
              </button>
            </li>

            <hr className="my-2 dark:border-gray-600" />

            <li>
              <button
                onClick={() => (onClose(), onDownload(item))}
                className="list-button flex items-center"
              >
                <Download size={13} />
                <p>Download</p>
              </button>
            </li>
            <li>
              <button
                onClick={() => (onClose(), onDeleteFile(item))}
                className="list-button flex items-center"
              >
                <Trash2 size={13} />
                <p>Delete</p>
              </button>
            </li>
          </>
        )}
      </ul>
    </main>
  );
};

export default ContextMenu;
