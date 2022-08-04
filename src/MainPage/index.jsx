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

  return (
    <FileBrowser
      onBrowse={getItems}
      onUpload={uploadFile}
      onDeleteFile={deleteFile}
      onDownload={downloadFile}
      onCreateDirectory={createDirectory}
      onDeleteDirectory={deleteDirectory}
      homePath="/"
      canUpload={() => true}
      fileSizeLimit={fileSizeLimit}
    />
  );
};

export default MainPage;
