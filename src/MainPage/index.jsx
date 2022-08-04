import FileBrowser from "../FileBrowser";
import path from "path";
import { items as _items } from "./files";

let items = _items;

const MainPage = () => {
  const fileSizeLimit = 25_000_000; // 25 MB
  // const [items, setItems] = useState(_items);

  /**
   *
   * @param path must be absolute, eg /hello/world.txt or /hello/foo/ or /hello/foo
   * @returns
   */
  const getItems = async _path => {
    return items.filter(item => path.dirname(item.path) === _path);
  };

  const uploadFile = async (file, path) => {};

  const deleteFile = async _path => {
    items = items.filter(item => item.path !== _path);
  };

  const downloadFile = async file => {};

  const createDirectory = async _path => {
    items.push({
      path: _path,
      isDirectory: true,
    });
  };

  const deleteDirectory = async _path => {
    const childrenItems = await getItems(_path);
    for (const childItem of childrenItems) {
      if (childItem.isDirectory) deleteDirectory(childItem.path);
      else deleteFile(childItem.path);
    }
    items = items.filter(item => item.path !== _path);
  };

  const copy = async (targetItemPath, destinationDirectoryPath) => {
    // TODO: also copy children in folder
    const targetItem = items.find(item => item.path === targetItemPath);
    items.push({
      ...targetItem,
      path: path.join(destinationDirectoryPath, path.basename(targetItemPath)),
    });
  };

  const cut = async (targetItemPath, destinationDirectoryPath) => {
    const targetItem = items.find(item => item.path === targetItemPath);
    items.push({
      ...targetItem,
      path: path.join(destinationDirectoryPath, path.basename(targetItemPath)),
    });
    if (targetItem.isDirectory) deleteDirectory(targetItem.path);
    else deleteFile(targetItem.path);
  };

  return (
    <FileBrowser
      onBrowse={getItems}
      onUpload={uploadFile}
      onDeleteFile={deleteFile}
      onDownload={downloadFile}
      onCreateDirectory={createDirectory}
      onDeleteDirectory={deleteDirectory}
      onCopy={copy}
      onCut={cut}
      canUpload={() => true}
      fileSizeLimit={fileSizeLimit}
      config={{
        showHiddenItems: false,
        directoryDisplayName: "folder",
        fileDisplayName: "file",
      }}
    />
  );
};

export default MainPage;
