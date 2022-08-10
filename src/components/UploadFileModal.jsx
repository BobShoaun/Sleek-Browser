import { useState, useCallback, useMemo } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, X, Loader } from "react-feather";
import { getIconFromExtension } from "../helpers";
import { formatBytes } from "../helpers";
import path from "path-browserify";
import "./modal.css";

const UploadFileModal = ({ onClose, onUpload, fileSizeLimit }) => {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);

  const hasLargeFile = useMemo(
    () => files.some(file => file.size > fileSizeLimit),
    [files]
  );

  const onDrop = useCallback(
    acceptedFiles => {
      const newFiles = acceptedFiles.filter(
        file => !files.some(f => f.path === file.path)
      );
      setFiles([...files, ...newFiles]);
    },
    [files]
  );

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  const removeFile = index => {
    const filesCpy = [...files];
    filesCpy.splice(index, 1);
    setFiles(filesCpy);
  };

  const upload = async () => {
    setUploading(true);
    await onUpload(files);
    onClose();
    setUploading(false);
  };

  return (
    <main
      onClick={onClose}
      className="bg-black cursor-pointer transition-all backdrop-filter backdrop-blur-sm bg-opacity-10 absolute inset-0 z-30"
    >
      <div
        onClick={e => e.stopPropagation()}
        className="modal bg-gray-100 dark:bg-gray-900 cursor-auto shadow-2xl max-h-screen p-5 rounded-sm absolute z-30 left-0 right-0 top-1/2 max-w-2xl m-auto"
      >
        <section className="mb-4">
          <div
            {...getRootProps({
              className:
                "dropzone group transition-colors cursor-pointer border-2 border-dashed border-gray-400 hover:border-gray-700 dark:border-gray-300 dark:hover:border-gray-400 rounded-sm text-center p-8",
            })}
          >
            <input {...getInputProps()} />
            <Upload
              className="text-gray-400 dark:text-gray-300 group-hover:text-gray-600 dark:group-hover:text-gray-500 mx-auto mb-5 transition-colors"
              size={65}
            />
            <h1 className="text-gray-400 dark:text-gray-300 group-hover:text-gray-600 dark:group-hover:text-gray-500 font-medium text-lg transition-colors">
              Drag 'n' drop files or click to browse
            </h1>
          </div>
        </section>
        <section className="mb-4 px-3 overflow-auto max-h-60">
          <ul className="space-y-2.5">
            {files.map((file, index) => {
              const Icon = getIconFromExtension(path.extname(file.name));

              return (
                <li key={file.path} className="flex items-center gap-4">
                  <Icon
                    className="text-gray-700 dark:text-gray-300"
                    size={22}
                  />
                  <div>
                    <p className="text-gray-800 dark:text-gray-200">
                      {file.path}
                    </p>
                    <p className="text-gray-500 text-xs">
                      {formatBytes(file.size)}
                    </p>
                  </div>
                  <span class="text-red-500 ml-auto text-xs">
                    {file.size > fileSizeLimit ? "File too large!" : ""}
                  </span>

                  <X
                    onClick={() => removeFile(index)}
                    className="text-gray-100 cursor-pointer rounded-full font-bold transition-colors bg-gray-400 hover:bg-gray-500 dark:bg-gray-700 dark:hover:bg-gray-600 p-1"
                    size={20}
                  />
                </li>
              );
            })}
          </ul>
          {files.length <= 0 && (
            <p className="text-sm text-gray-400 dark:text-gray-400">
              No file(s) chosen.
            </p>
          )}
        </section>

        <section className="text-right">
          <button
            onClick={onClose}
            className="bg-gray-300 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 shadow-sm transition-colors  text-gray-500 dark:text-gray-300 font-medium rounded-sm py-1 px-3"
          >
            Cancel
          </button>
          <button
            onClick={upload}
            disabled={files.length <= 0 || uploading || hasLargeFile}
            title={
              hasLargeFile
                ? "Remove large file(s) first"
                : uploading
                ? "Uploading"
                : "Upload File(s)"
            }
            className="ml-3 shadow-md bg-blue-500 disabled:bg-blue-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-400 text-blue-100 font-medium rounded-sm py-1 px-4"
          >
            {uploading ? (
              <>
                &nbsp;
                <Loader size={18} className="animate-spin inline-block" />
                &nbsp;
              </>
            ) : (
              "Upload File(s)"
            )}
          </button>
        </section>
      </div>
    </main>
  );
};

export default UploadFileModal;
