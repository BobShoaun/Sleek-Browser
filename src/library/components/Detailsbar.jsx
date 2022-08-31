import moment from "moment";
import { X, Download, Copy, Trash2 } from "react-feather";
import { formatBytes } from "../helpers";
import path from "path-browserify";
import { getIconFromExtension, isImage, isVideo } from "../helpers";
import { useMemo, useState, useEffect } from "react";

const Detailsbar = ({
  file,
  onClose,
  onDelete,
  onToast,
  onDownload,
  onZoom,
}) => {
  const [previewType, setPreviewType] = useState("none");

  const extension = path.extname(file?.path);

  const Icon = useMemo(() => getIconFromExtension(extension), [file]);

  useEffect(() => {
    if (isImage(extension)) return void setPreviewType("image");
    if (isVideo(extension)) return void setPreviewType("video");
    setPreviewType("none");
  }, [file]);

  if (!file) return null;

  const copyUrl = () => {
    navigator.clipboard.writeText(file.url);
    onToast(`Copied URL to clipboard.`);
  };

  return (
    <aside className="p-5 dark:border-gray-600 overflow-y-auto h-full">
      <button
        title="Close detailed view panel"
        onClick={onClose}
        className="sticky top-0 bg-transparent hover:bg-gray-200 dark:hover:bg-gray-800 px-2 py-2 rounded-sm transition-colors"
      >
        <X className="text-gray-700 dark:text-gray-200" size={15} />
      </button>

      {previewType === "none" ? (
        <Icon
          className="text-gray-600 dark:text-gray-300 mx-auto mt-5 mb-10"
          size={64}
        />
      ) : previewType === "video" ? (
        <div className="p-1 mb-3 h-40 flex">
          <video
            src={file.url}
            controls
            className="max-h-full m-auto rounded-sm"
          ></video>
        </div>
      ) : (
        <div onClick={onZoom} className="p-1 mb-3 h-40 flex cursor-zoom-in">
          <img
            className="m-auto max-h-full rounded-sm "
            src={file.url}
            alt={path.basename(file.path)}
            onError={() => setPreviewType("none")}
          />
        </div>
      )}

      <table className="w-full mb-5">
        <tbody className="text-sm">
          <tr className="border-b-2 border-gray-300 dark:border-gray-500">
            <td className="text-gray-500 dark:text-gray-400 text-left py-2">
              Name
            </td>
            <td
              className="text-gray-600 dark:text-gray-300 text-right pl-2 py-2 font-medium break-all select-all"
              style={{ wordWrap: "break-word" }}
            >
              {path.basename(file.path) || "-"}
            </td>
          </tr>
          <tr className="border-b-2 border-gray-300 dark:border-gray-500">
            <td className="text-gray-500 dark:text-gray-400 text-left py-2">
              Type
            </td>
            <td className="text-gray-600 dark:text-gray-300 text-right pl-2 py-2 font-medium">
              {path.extname(file.path) || "-"}
            </td>
          </tr>

          <tr className="border-b-2 border-gray-300 dark:border-gray-500">
            <td className="text-gray-500 dark:text-gray-400 text-left py-2">
              Last Modified
            </td>
            <td className="text-gray-600 dark:text-gray-300 text-right pl-2 py-2 font-medium select-all">
              {moment(file.lastModified).format("llll")}
            </td>
          </tr>

          <tr className="border-b-2 border-gray-300 dark:border-gray-500">
            <td className="text-gray-500 dark:text-gray-400 text-left py-2">
              Size
            </td>
            <td className="text-gray-600 dark:text-gray-300 text-right pl-2 py-2 font-medium">
              {formatBytes(file.size)}
            </td>
          </tr>
          <tr>
            <td className="text-gray-500 dark:text-gray-400 text-left py-2">
              URL
            </td>
            <td className="text-gray-600 dark:text-gray-300 text-right pl-2 py-2 font-medium break-all select-all">
              {file.url}
            </td>
          </tr>
        </tbody>
      </table>

      <section className="flex items-center gap-2 mb-2">
        <button
          title="Copy entire path of the file"
          onClick={copyUrl}
          className="flex w-full justify-center items-center gap-2 text-gray-700 dark:text-gray-300 border border-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 px-1 py-1.5 rounded-sm transition-colors"
        >
          <Copy className="" size={15} />
          <p className="text-sm whitespace-nowrap">Copy URL</p>
        </button>
        <button
          title="Delete file from directory (currently unavailable)"
          onClick={() => onDelete(file)}
          // disabled
          className="flex w-full justify-center items-center gap-2 text-gray-700 dark:text-gray-300 disabled:cursor-not-allowed border border-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 disabled:bg-gray-300 px-1 py-1.5 rounded-sm transition-colors"
        >
          <Trash2 className="" size={15} />
          <p className="text-sm">Delete</p>
        </button>
      </section>

      <button
        title="Download file into your local file system"
        onClick={() => onDownload(file)}
        className="flex w-full justify-center items-center gap-2 text-gray-700 dark:text-gray-300 border border-gray-400  hover:bg-gray-200 dark:hover:bg-gray-700 px-2 py-1.5 rounded-sm transition-colors"
      >
        <Download className="" size={15} />
        <p className="text-sm">Download</p>
      </button>
    </aside>
  );
};

export default Detailsbar;
