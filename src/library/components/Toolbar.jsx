import {
  FolderPlus,
  List,
  Grid,
  ChevronRight,
  ChevronLeft,
  Home,
  UploadCloud,
  AlignJustify,
  BarChart,
  Check,
  Search,
  RefreshCw,
  X,
} from "react-feather";
import { Fragment, useState, useRef, useContext } from "react";
import path from "path-browserify";
import "./toolbar.css";
import { FileBrowserContext } from "../FileBrowser";
import RadioButton from "./RadioButton";

const Toolbar = ({
  backwardPaths,
  forwardPaths,
  onHome,
  onNewFolder,
  onUpload,
  onNavigate,
  onBack,
  onForwards,
  onRefresh,
  canUpload,
  onSearch,
}) => {
  const [editMode, setEditMode] = useState(false);
  const editPathInput = useRef(null);
  const searchForm = useRef(null);
  const {
    currentPath,
    sortField,
    setSortField,
    sortOrder,
    setSortOrder,
    searchQuery,
    setSearchQuery,
  } = useContext(FileBrowserContext);

  const submitEdit = e => {
    e.preventDefault();
    setEditMode(false);
    onNavigate(path.normalize(editPathInput.current.value));
  };

  const pathEntries = currentPath.split("/").filter(entry => entry);
  const _canUpload = canUpload(currentPath);

  return (
    <header className="px-5 py-3 bg-gray-300 dark:bg-gray-700 flex h-full">
      <button
        title="Go back"
        onClick={onBack}
        disabled={backwardPaths.length <= 0}
        className="toolbar-button disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed px-3 py-1 rounded-l-sm transition-colors"
      >
        <ChevronLeft className="text-gray-700 dark:text-gray-200" size={15} />
      </button>

      <button
        title="Go forwards"
        onClick={onForwards}
        disabled={forwardPaths.length <= 0}
        className="ml-px toolbar-button disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed px-3 py-1 rounded-r-sm transition-colors"
      >
        <ChevronRight className="text-gray-700 dark:text-gray-200" size={15} />
      </button>

      <button
        onClick={onRefresh}
        title="Refresh file browser"
        className="ml-2 toolbar-button px-3 py-1 rounded-sm transition-colors"
      >
        <RefreshCw className="text-gray-700 dark:text-gray-200" size={15} />
      </button>

      <button
        onClick={onHome}
        title="Go to root directory"
        className="ml-2 toolbar-button px-3 py-1 rounded-sm transition-colors"
      >
        <Home className="text-gray-700 dark:text-gray-200" size={15} />
      </button>

      {_canUpload && (
        <button
          disabled={!_canUpload}
          onClick={onNewFolder}
          title="Create a new folder within current directory"
          className={`ml-2 flex items-center gap-2 toolbar-button disabled:bg-gray-200 disabled:cursor-not-allowed px-3 py-1 rounded-sm transition-colors`}
        >
          <FolderPlus className="text-gray-700 dark:text-gray-200" size={15} />
          <p className="text-gray-700 dark:text-gray-200 text-sm whitespace-nowrap">
            New Folder
          </p>
        </button>
      )}

      {_canUpload && (
        <button
          onClick={onUpload}
          title="Upload a file to current directory"
          disabled={!_canUpload}
          className="ml-2 flex items-center gap-2 toolbar-button disabled:bg-gray-200 disabled:cursor-not-allowed px-3 py-1 rounded-sm transition-colors"
        >
          <UploadCloud className="text-gray-700 dark:text-gray-200" size={15} />
          <p className="text-gray-700 dark:text-gray-200 text-sm">Upload</p>
        </button>
      )}

      <div className="mx-auto" style={{ flexBasis: "30em" }}>
        <div
          title="Current path, double click to edit"
          className="mx-3 toolbar-button cursor-text text-sm rounded-full transition-colors h-full text-gray-600 dark:text-gray-200 flex"
        >
          {editMode ? (
            <form
              action=""
              onSubmit={submitEdit}
              className="my-auto w-full h-full"
            >
              <input
                ref={editPathInput}
                type="text"
                className="bg-transparent outline-none w-full h-full px-5"
                autoFocus
                onBlur={() => setEditMode(false)}
                defaultValue={currentPath}
              />
            </form>
          ) : (
            <p
              onDoubleClick={() => setEditMode(true)}
              className="flex items-center no-scrollbar overflow-auto my-auto px-5 w-full"
            >
              <>
                <button
                  onClick={() => onNavigate("/")}
                  className="hover:underline cursor-pointer whitespace-nowrap flex-shrink-0"
                >
                  Home
                </button>
                <ChevronRight
                  size={15}
                  className="mx-1.5 whitespace-nowrap flex-shrink-0 last:hidden"
                />
              </>
              {pathEntries.map((entry, index) => (
                <Fragment key={index}>
                  <button
                    onClick={() =>
                      onNavigate(
                        `/${pathEntries.slice(0, index + 1).join("/")}`
                      )
                    }
                    className="hover:underline cursor-pointer whitespace-nowrap flex-shrink-0"
                  >
                    {entry}
                  </button>
                  <ChevronRight
                    size={15}
                    className="mx-1.5 whitespace-nowrap flex-shrink-0 last:hidden"
                  />
                </Fragment>
              ))}
            </p>
          )}
        </div>
      </div>

      <div className="relative dropdown-wrapper">
        <button
          title="Sort files in a certain order"
          className="h-full flex items-center gap-2 toolbar-button text-gray-700 dark:text-gray-200 px-3 py-1 rounded-sm transition-colors"
          id="sort-menu-button"
          aria-haspopup="true"
        >
          <BarChart size={15} />
          <p className="text-sm">Sort</p>
        </button>

        <div
          className="dropdown absolute shadow-lg top-9 left-1/2 -translate-x-1/2 transition-opacity text-gray-500 dark:text-gray-200 bg-gray-100 dark:bg-gray-800 rounded-sm p-1 text-left text-sm"
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="sort-menu-button"
          tabIndex="1"
        >
          <fieldset>
            <legend className="sr-only">Sort Field</legend>
            <RadioButton
              onChange={setSortField}
              field={sortField}
              value="name"
              title="Name"
              name="sort-field-1"
            />
            <RadioButton
              onChange={setSortField}
              field={sortField}
              value="date"
              title="Date Modified"
              name="sort-field-1"
            />
            <RadioButton
              onChange={setSortField}
              field={sortField}
              value="type"
              title="Type"
              name="sort-field-1"
            />
            <RadioButton
              onChange={setSortField}
              field={sortField}
              value="size"
              title="Size"
              name="sort-field-1"
            />
          </fieldset>
          <hr className="my-2 dark:border-gray-700" role="none" />

          <fieldset>
            <legend className="sr-only">Sort Order</legend>
            <RadioButton
              onChange={setSortOrder}
              field={sortOrder}
              value="asc"
              title="Ascending"
              name="sort-order-1"
            />
            <RadioButton
              onChange={setSortOrder}
              field={sortOrder}
              value="desc"
              title="Descending"
              name="sort-order-1"
            />
          </fieldset>
        </div>
      </div>

      <form
        title="Search for files within this directory"
        action=""
        ref={searchForm}
        onSubmit={e => {
          e.preventDefault();
          onSearch(searchQuery);
        }}
        style={{ flexBasis: "15em" }}
        className="ml-2 my-auto h-full overflow-hidden text-sm rounded-sm text-gray-600 dark:text-gray-300 relative"
      >
        <Search
          onClick={() => onSearch(searchQuery)}
          className="absolute cursor-pointer top-1/2 left-2.5 transform -translate-y-1/2"
          size={15}
        />
        <input
          type="search"
          className="toolbar-button outline-none w-full h-full pl-9 pr-2 transition-colors"
          autoFocus
          placeholder="Search within directory..."
          autoComplete="on"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
        />
        {searchQuery && (
          <button
            onClick={() => {
              setSearchQuery("");
              onSearch("");
            }}
            className="absolute cursor-pointer top-1/2 right-2.5 transform -translate-y-1/2 bg-gray-400 bg-opacity-80 text-white p-0.5 rounded-full"
          >
            <X size={10} strokeWidth={4} />
          </button>
        )}
      </form>

      {/* <button
        title="List view"
        onClick={onList}
        className={`ml-2 bg-gray-100 ${
          view === "list" ? "shadow-inner" : ""
        } hover:bg-gray-200 px-3 py-1 rounded-l-sm`}
      >
        <List className="text-gray-700" size={15} />
      </button>
      <button
        title="Grid view"
        onClick={onGrid}
        className={`ml-px ${
          view === "grid" ? "shadow-inner" : ""
        } bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-r-sm`}
      >
        <Grid className="text-gray-700" size={15} />
      </button> */}
    </header>
  );
};

export default Toolbar;
