import FileBrowser from "../FileBrowser";

const MainPage = () => {
  const fileSizeLimit = 25_000_000; // 25 MB

  const isHome = (_path) => true;

  /**
   *
   * @param path must be absolute, eg hello/world.txt or hello/foo/ or hello/foo
   * @returns
   */
  const getItems = async (path) => {
    console.log(path);
    // return [];
    return getHomeItems();
  };

  const getHomeItems = async (_path) => {
    return [
      {
        name: "Hello",
        isDirectory: false,
        size: 1000,
        lastModified: Date.now(),
        path: "Help/Me",
        url: `https://s3.amazonaws.com/`,
      },
      {
        name: "Foo",
        isDirectory: true,
        path: "Hello/world",
      },
    ];
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
      homePath="Home/"
      canUpload={isHome}
      fileSizeLimit={fileSizeLimit}
    />
  );
};

export default MainPage;
