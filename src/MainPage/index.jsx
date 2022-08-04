import FileBrowser from "../FileBrowser";
import path from "path";
import { items as _items } from "./files";
import { useState } from "react";

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
    const i = items.filter(item => path.dirname(item.path) === _path);
    return i;
  };

  const uploadFile = async (file, path) => {};

  const deleteFile = async _path => {
    items = items.filter(item => item.path !== _path);
  };

  const downloadFile = async file => {};

  const createFolder = async _path => {
    items.push({
      path: _path,
      isDirectory: true,
    });
  };

  const deleteFolder = async _path => {
    items = items.filter(item => item.path !== _path);

    // const index = items.findIndex(item => item.path === _path);
    // items.splice(index, 1);
  };

  return (
    <FileBrowser
      onBrowse={getItems}
      onUpload={uploadFile}
      onDelete={deleteFile}
      onDownload={downloadFile}
      onCreateFolder={createFolder}
      onDeleteFolder={deleteFolder}
      homePath="/"
      canUpload={() => true}
      fileSizeLimit={fileSizeLimit}
    />
  );
};

export default MainPage;
