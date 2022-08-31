import { List, Grid, Moon, Sun } from "react-feather";
import { FileBrowserContext } from "../FileBrowser";
import { useContext } from "react";

const Footer = () => {
  const { currentItems, filteredItems, view, setView, theme, setTheme } =
    useContext(FileBrowserContext);

  return (
    <footer className="flex items-center h-full px-3 bg-gray-200 dark:bg-gray-800 border-t border-gray-300 dark:border-gray-600 text-sm text-gray-600 dark:text-gray-400">
      <p className="">
        {filteredItems?.length ?? 0} of {currentItems?.length ?? 0} items
      </p>

      <div className="py-px ml-auto flex items-center h-full">
        <button
          title="Theme"
          onClick={() =>
            setTheme(theme => (theme === "dark" ? "light" : "dark"))
          }
          className={`bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 px-3 h-full transition-colors`}
        >
          {theme === "dark" ? (
            <Moon className="text-gray-700 dark:text-gray-200" size={15} />
          ) : (
            <Sun className="text-gray-700 dark:text-gray-200" size={15} />
          )}
        </button>

        <p className="w-px h-4/6 bg-gray-300 dark:bg-gray-500 mx-2"></p>

        <button
          title="List view"
          onClick={() => setView("list")}
          className={`bg-gray-100 ${
            view === "list"
              ? "bg-gray-200 dark:bg-gray-600"
              : "hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600"
          } px-3 h-full transition-colors`}
        >
          <List className="text-gray-700 dark:text-gray-200" size={15} />
        </button>
        <button
          title="Grid view"
          onClick={() => setView("grid")}
          className={`ml-px ${
            view === "grid"
              ? "bg-gray-200 dark:bg-gray-600"
              : "hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600"
          } bg-gray-100 h-full px-3 transition-colors`}
        >
          <Grid className="text-gray-700 dark:text-gray-200" size={15} />
        </button>
      </div>
    </footer>
  );
};

export default Footer;
