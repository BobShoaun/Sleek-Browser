import FileBrowser from "../FileBrowser";
import path from "path";
import { items } from "./files";

const MainPage = () => {
  const fileSizeLimit = 25_000_000; // 25 MB

  const isHome = (_path) => true;

  /**
   *
   * @param path must be absolute, eg hello/world.txt or hello/foo/ or hello/foo
   * @returns
   */
  const getItems = async (_path) => {
    const i = items.filter(
      (item) =>
        path.dirname(item.path).toLocaleLowerCase() ===
        _path.toLocaleLowerCase()
    );

    // console.log(i);
    // return [];
    return i;
  };

  const getHomeItems = async (_path) => {
    // _path = "/";

    // console.log(i);
    // console.log(path.dirname("/hello"));
    return i;

    console.log(path.dirname("bar"));
    return [];
  };

  const getArchivedItems = async () => {
    return [];
  };

  const uploadFile = async (file, path) => {};

  const deleteFile = async (_path) => {};

  const deleteHomeFile = async (_path) => {};

  const deleteArchivedFile = async (_path) => {};

  const downloadFile = async (file) => {};

  return (
    <FileBrowser
      onBrowse={getItems}
      onUpload={uploadFile}
      onDelete={deleteFile}
      onDownload={downloadFile}
      homePath="/"
      canUpload={isHome}
      fileSizeLimit={fileSizeLimit}
    />
  );
};

export default MainPage;
