import {
  Folder,
  File,
  FileText,
  Film,
  Image,
  Music,
  Code,
  Archive,
  Disc,
  Database,
} from "react-feather";

export const formatBytes = (bytes, decimals = 2) => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
};

const textExtensions = [
  "txt",
  "pdf",
  "pptx",
  "ppt",
  "md",
  "doc",
  "docx",
  "rtf",
  "tex",
  "text",
  "log",
];
const imageExtensions = [
  "png",
  "jpg",
  "gif",
  "tiff",
  "psd",
  "eps",
  "ai",
  "jpeg",
  "svg",
];
const videoExtensions = ["webm", "mp4", "avi", "mov", "wmv", "mkv"];
const audioExtensions = ["mp3", "m4a", "ogg", "wav", "aif", "mid", "midi"];
const codeExtensions = [
  "js",
  "html",
  "css",
  "jsx",
  "tsx",
  "c",
  "cpp",
  "py",
  "java",
  "csharp",
  "xml",
  "cfm",
  "asp",
  "php",
  "vb",
  "sh",
  "h",
  "cs",
  "class",
  "swift",
];
const archiveExtensions = [
  "zip",
  "7z",
  "tar.gz",
  "rar",
  "pkg",
  "z",
  "rpm",
  "gz",
];
const discExtensions = ["iso", "dmg", "toast", "vcd"];
const databaseExtensions = ["csv", "dat", "mdb", "sql", "tar"];

export const getIconFromExtension = (extension) => {
  const ext = extension.replace(/^\./, "").toLocaleLowerCase();
  if (textExtensions.includes(ext)) return FileText;
  if (imageExtensions.includes(ext)) return Image;
  if (archiveExtensions.includes(ext)) return Archive;
  if (databaseExtensions.includes(ext)) return Database;
  if (videoExtensions.includes(ext)) return Film;
  if (audioExtensions.includes(ext)) return Music;
  if (codeExtensions.includes(ext)) return Code;
  if (discExtensions.includes(ext)) return Disc;
  return File;
};

export const isImage = (extension) => {
  const ext = extension.replace(/^\./, "").toLocaleLowerCase();
  return imageExtensions.includes(ext);
};

export const isVideo = (extension) => {
  const ext = extension.replace(/^\./, "").toLocaleLowerCase();
  return videoExtensions.includes(ext);
};
