import { useEffect, useState, useCallback, createContext, useRef } from "react";
import path from "path-browserify";
import UploadFileModal from "../components/UploadFileModal";
import ConfirmDeleteModal from "../components/ConfirmDeleteModal";
import Toolbar from "../components/Toolbar";
import Sidebar from "../components/Sidebar";
import Detailsbar from "../components/Detailsbar";
import ListView from "../components/ListView";
import GridView from "../components/GridView";
import moment from "moment";
import Fuse from "fuse.js";
import Footer from "../components/Footer";
import Loading from "../components/Loading";
import ContextMenu from "../components/ContextMenu";
import Toast from "../components/Toast";
import NotFound from "../components/NotFound";
import Empty from "../components/Empty";
import ImageModal from "../components/ImageModal";
import "./index.css";

export const FileBrowserContext = createContext();

const FileBrowser = ({
  onBrowse,
  onUpload,
  onDeleteFile,
  canUpload,
  onDownload,
  onCreateDirectory,
  onDeleteDirectory,
  fileSizeLimit,
  onCopy,
  onCut,
  initialPath = "/",
  onRouterNavigate,
}) => {
  // navigation
  const [currentPath, setCurrentPath] = useState("/");
  const [currentItems, setCurrentItems] = useState([]);
  const [refreshPaths, setRefreshPaths] = useState([]);

  // history
  const [backwardPaths, setBackwardPaths] = useState([]); // stack
  const [forwardPaths, setForwardPaths] = useState([]); // stack
  const [cachedPathItems, setCachedPathItems] = useState(new Map());

  // general
  const [view, setView] = useState(localStorage.view ?? "list");
  const [showNewFolder, setShowNewFolder] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [theme, setTheme] = useState(localStorage.theme ?? "light");

  // modals
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showImgModal, setShowImgModal] = useState(false);

  // delete
  const [deletingFile, setDeletingFile] = useState(null);

  // details pane
  const [previewFile, setPreviewFile] = useState(null);
  const [isDetailsOpen, setDetailsOpen] = useState(false);

  // search
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredItems, setFilteredItems] = useState([]);

  // sorting
  const [sortField, setSortField] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");

  // context menu
  const [ctShow, setCtShow] = useState(false);
  const [ctPos, setCtPos] = useState({ x: 0, y: 0 });
  const [ctItem, setCtItem] = useState(null);

  // toast
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  // clipboard
  const [clipboardItemPath, setClipboardItemPath] = useState("");
  const [clipboardMode, setClipboardMode] = useState("copy"); // copy | cut

  useEffect(() => {
    localStorage.setItem("view", view);
  }, [view]);

  useEffect(() => {
    localStorage.setItem("theme", theme);
    document.body.style.setProperty("color-scheme", theme);
  }, [theme]);

  // sorting logic
  useEffect(() => {
    const items = [...currentItems].sort((a, b) => {
      switch (sortField) {
        case "name":
          return path.basename(a.path).localeCompare(path.basename(b.path));
        case "date":
          return moment(a.lastModified).diff(b.lastModified);
        case "type":
          return path.extname(a.path).localeCompare(path.extname(b.path));
        case "size":
          return (a.size ?? 0) - (b.size ?? 0);
        default:
          console.error("invalid sort field");
      }
    });
    if (sortOrder === "desc") items.reverse();
    setCurrentItems(items);
  }, [sortField, sortOrder]);

  useEffect(() => {
    setFilteredItems(currentItems);
  }, [currentItems]);

  // sets current path directly, not interacting with path history
  const _setCurrentPath = async path => {
    setIsLoading(true);
    const pathItems = await onBrowse(path);
    setCurrentPath(path);
    setCurrentItems(pathItems);
    setIsLoading(false);
    return pathItems;
  };

  const _navigate = async path => {
    if (currentPath !== path) {
      setBackwardPaths(paths => [...paths, currentPath]); // push to back stack
      setForwardPaths([]);
    }
    onRouterNavigate?.(path);
    setSearchQuery(""); // clear search box
    return await _setCurrentPath(path);
  };

  const refresh = () => {
    _navigate(currentPath);
  };

  useEffect(() => {
    _navigate(initialPath);
  }, []);

  const uploadFiles = async files => {
    for (const file of files) {
      console.log("uploading", file);
      const _path = path.join(currentPath, file.path);
      await onUpload(file, _path);
    }
    refresh();
  };

  const createDirectory = async name => {
    await onCreateDirectory(path.join(currentPath, name));
    refresh();
    setRefreshPaths([currentPath]);
    setShowNewFolder(false);

    // const file = new File([], name); // empty file for creating directory
    // const _path = path.join(currentPath, name, file.name);
    // await onUpload(file, _path);
    // refresh();
    // setShowNewFolder(false);
  };

  const deleteFile = async _path => {
    await onDeleteFile(_path);
    refresh();
    setRefreshPaths([path.dirname(_path)]);
    setDetailsOpen(false);
  };

  const deleteDirectory = async _path => {
    // check if folder is empty
    // const items = await onBrowse(_path);
    // if (items.length > 0) {
    //   setToastMessage(`Cannot delete non-empty folder.`);
    //   setToastOpen(true);
    //   return;
    // }

    await onDeleteDirectory(_path);
    const parentDirPath = path.dirname(_path);
    _navigate(parentDirPath);
    setRefreshPaths([parentDirPath]);

    // basicly deleting file within folder with same name.
    // const fileName = path.basename(_path);
    // const filePath = path.join(_path, fileName);
    // const dir = path.dirname(_path) + "/";
    // await onDelete(filePath);
    // _navigate(dir);
    // if (dir === homePath) loadRoot();
  };

  const goBack = () => {
    const previousPath = backwardPaths[backwardPaths.length - 1];
    setBackwardPaths(paths => {
      // pop previous path from backwardPaths
      const pathsCpy = [...paths];
      pathsCpy.pop();
      return pathsCpy;
    });
    setForwardPaths(paths => [...paths, currentPath]); // push currentPath to forwardPaths
    _setCurrentPath(previousPath);
  };

  const goForward = () => {
    const nextPath = forwardPaths[forwardPaths.length - 1];
    setForwardPaths(paths => {
      // pop path
      const pathsCpy = [...paths];
      pathsCpy.pop();
      return pathsCpy;
    });
    setBackwardPaths(paths => [...paths, currentPath]); // push currentPath
    _setCurrentPath(nextPath);
  };

  const search = query => {
    const fuse = new Fuse(currentItems, { keys: ["path"] });
    const filtered = query
      ? fuse.search(query).map(res => res.item)
      : currentItems;
    setFilteredItems(filtered);
  };

  const openContextMenu = (item, x, y) => {
    setCtPos({ x, y });
    setCtItem(item);
    setCtShow(true);
  };

  const copyUrl = file => {
    navigator.clipboard.writeText(file.url);
    setToastMessage(`Copied URL to clipboard.`);
    setToastOpen(true);
  };

  const pasteClipboard = destinationDirectoryPath => {
    if (clipboardMode === "cut") {
      onCut(clipboardItemPath, destinationDirectoryPath);
      setRefreshPaths([
        path.dirname(clipboardItemPath),
        destinationDirectoryPath,
      ]);
    } else {
      onCopy(clipboardItemPath, destinationDirectoryPath);
      setRefreshPaths([destinationDirectoryPath]);
    }
  };

  // sidebar resizing, TODO: extract into hook
  const sidebarResizeHandleRef = useRef(null);
  const isSidebarResizing = useRef(false);
  const [sidebarWidth, setSidebarWidth] = useState("clamp(250px, 20%, 350px)");
  const sidebarMinWidth = "200px";
  const sidebarMaxWidth = "40%";

  useEffect(() => {
    sidebarResizeHandleRef.current.addEventListener("mousedown", () => {
      isSidebarResizing.current = true;
      document.body.classList.add("no-select");
    });
    document.addEventListener("mouseup", () => {
      isSidebarResizing.current = false;
      document.body.classList.remove("no-select");
    });
    document.addEventListener("mousemove", e => {
      if (!isSidebarResizing.current) return;
      setSidebarWidth(
        `clamp(${sidebarMinWidth}, ${e.clientX}px, ${sidebarMaxWidth})`
      );
    });
  }, []);

  // details bar resizing
  const detailsResizeHandleRef = useRef(null);
  const isDetailsResizing = useRef(false);
  const [detailsWidth, setDetailsWidth] = useState("clamp(280px, 25%, 400px)");
  const detailsMinWidth = "250px";
  const detailsMaxWidth = "40%";

  useEffect(() => {
    detailsResizeHandleRef.current.addEventListener("mousedown", () => {
      isDetailsResizing.current = true;
      document.body.classList.add("no-select");
    });
    document.addEventListener("mouseup", () => {
      isDetailsResizing.current = false;
      document.body.classList.remove("no-select");
    });
    document.addEventListener("mousemove", e => {
      if (!isDetailsResizing.current) return;
      setDetailsWidth(
        `clamp(${detailsMinWidth}, 100% - ${e.clientX}px, ${detailsMaxWidth})`
      );
    });
  }, []);

  return (
    <FileBrowserContext.Provider
      value={{
        currentPath,
        currentItems,
        filteredItems,
        navigate: _navigate,
        refresh,
        view,
        setView,
        sortField,
        setSortField,
        sortOrder,
        setSortOrder,
        searchQuery,
        setSearchQuery,
        theme,
        setTheme,
        refreshPaths,
        setClipboardItemPath,
        setClipboardMode,
      }}
    >
      <main
        className={`${
          theme === "dark" ? "dark" : ""
        } h-screen relative overflow-hidden`}
      >
        {showUploadModal && (
          <UploadFileModal
            onClose={() => setShowUploadModal(false)}
            onUpload={uploadFiles}
            fileSizeLimit={fileSizeLimit}
          />
        )}
        {deletingFile && (
          <ConfirmDeleteModal
            onClose={() => setDeletingFile(null)}
            file={deletingFile}
            onDelete={() => deleteFile(deletingFile.path)}
          />
        )}

        {showImgModal && (
          <ImageModal
            src={previewFile.url}
            alt={path.basename(previewFile.path)}
            onClose={() => setShowImgModal(false)}
          />
        )}

        <ContextMenu
          position={ctPos}
          onClose={() => setCtShow(false)}
          show={ctShow}
          item={ctItem}
          onDownload={onDownload}
          onToast={message => (setToastMessage(message), setToastOpen(true))}
          onDeleteFile={() => setDeletingFile(ctItem)}
          onDeleteFolder={deleteDirectory}
          canUpload={canUpload(currentPath)}
          onUpload={() => setShowUploadModal(true)}
          onNewFolder={() => setShowNewFolder(true)}
          onPaste={pasteClipboard}
        />
        <Toast
          open={toastOpen}
          message={toastMessage}
          onClose={() => setToastOpen(false)}
        />

        <header className="fb__header absolute top-0 left-0 right-0 z-20 shadow-md">
          <Toolbar
            backwardPaths={backwardPaths}
            forwardPaths={forwardPaths}
            onHome={() => _navigate("/")}
            onNewFolder={() => setShowNewFolder(true)}
            onUpload={() => setShowUploadModal(true)}
            onNavigate={_navigate}
            onBack={goBack}
            onForwards={goForward}
            canUpload={canUpload}
            onSearch={search}
            onRefresh={refresh}
          />
        </header>

        <aside
          style={{ width: sidebarWidth }}
          className="fb__sidebar absolute left-0 bottom-0 z-10 shadow-lg border-r border-gray-300 dark:border-gray-600 bg-gray-200 dark:bg-gray-800"
        >
          <div
            ref={sidebarResizeHandleRef}
            className="absolute bottom-0 top-0 -right-1.5 w-3 cursor-ew-resize"
          />
          <Sidebar
            onNavigate={_navigate}
            onPreview={file => (setPreviewFile(file), setDetailsOpen(true))}
            onContextMenu={openContextMenu}
            onBrowse={onBrowse}
          />
        </aside>

        <section
          className={`fb__main absolute z-0 overflow-auto bg-gray-100 dark:bg-gray-900 ${
            isDetailsResizing.current
              ? "transition-[none]"
              : "transition-[right]"
          }`}
          onContextMenu={e => {
            e.preventDefault();
            openContextMenu(null, e.pageX, e.pageY);
          }}
          style={{
            left: sidebarWidth,
            right: isDetailsOpen ? detailsWidth : 0,
          }}
        >
          {isLoading && <Loading />}
          {!currentItems ? (
            <NotFound />
          ) : currentItems.length <= 0 && !showNewFolder ? (
            <Empty onDelete={() => deleteDirectory(currentPath)} />
          ) : view === "grid" ? (
            <GridView
              currentItems={filteredItems}
              showNewFolder={showNewFolder}
              onNavigate={_navigate}
              onPreview={file => (setPreviewFile(file), setDetailsOpen(true))}
              onCreateFolder={createDirectory}
              onContextMenu={openContextMenu}
              onCopyUrl={copyUrl}
            />
          ) : (
            <ListView
              showNewFolder={showNewFolder}
              onNavigate={_navigate}
              onPreview={file => (setPreviewFile(file), setDetailsOpen(true))}
              onCreateFolder={createDirectory}
              onContextMenu={openContextMenu}
              onCopyUrl={copyUrl}
            />
          )}
        </section>

        <footer
          className={`fb__footer absolute bottom-0 shadow-md ${
            isDetailsResizing.current
              ? "transition-[none]"
              : "transition-[right]"
          }`}
          style={{
            left: sidebarWidth,
            right: isDetailsOpen ? detailsWidth : 0,
          }}
        >
          <Footer />
        </footer>

        <aside
          className={`fb__details absolute bottom-0 z-10 transition-[right,visibility] bg-gray-100 dark:bg-gray-900 border-l border-gray-300 dark:border-gray-600 shadow-lg`}
          style={{
            width: detailsWidth,
            right: isDetailsOpen ? 0 : `calc(-1 * ${detailsWidth})`,
            visibility: isDetailsOpen ? "visible" : "hidden",
          }}
        >
          <div
            ref={detailsResizeHandleRef}
            className="absolute bottom-0 top-0 -left-1.5 w-3 cursor-ew-resize"
          />
          {previewFile && (
            <Detailsbar
              file={previewFile}
              onDelete={() => setDeletingFile(previewFile)}
              onClose={() => setDetailsOpen(false)}
              onToast={message => (
                setToastMessage(message), setToastOpen(true)
              )}
              onDownload={onDownload}
              onZoom={() => setShowImgModal(true)}
            />
          )}
        </aside>
      </main>
    </FileBrowserContext.Provider>
  );
};

export default FileBrowser;
