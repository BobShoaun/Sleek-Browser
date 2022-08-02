import FileBrowser from "../FileBrowser";
import path from "path";
import { items } from "./files";

const MainPage = () => {
  const fileSizeLimit = 25_000_000; // 25 MB

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

  const deleteFile = async _path => {};

  const downloadFile = async file => {};

  return (
    <FileBrowser
      onBrowse={getItems}
      onUpload={uploadFile}
      onDelete={deleteFile}
      onDownload={downloadFile}
      homePath="/"
      canUpload={() => true}
      fileSizeLimit={fileSizeLimit}
    />
  );
};

export default MainPage;
