import { useState, useEffect, useCallback, useRef, useContext } from "react";
import { getIconFromExtension } from "../helpers";
import {
  Archive,
  Folder,
  ChevronRight,
  Home,
  Star,
  Clock,
  Trash2,
} from "react-feather";
import path from "path";
import { FileBrowserContext } from "../FileBrowser";

const showHiddenFiles = false;

const SidebarItem = ({
  item,
  isVisible = true,
  onNavigate,
  onPreview,
  onContextMenu,
  onBrowse,
  onVisibleDescendantsChange,
}) => {
  const { refreshInfo } = useContext(FileBrowserContext);
  const [childrenItems, setChildrenItems] = useState([]);
  const [isExpanded, setIsExpanded] = useState(false);

  const [childrenItemCounts, setChildrenItemCounts] = useState([]);
  const itemRef = useRef(null);

  const visibleChildrenItems = showHiddenFiles
    ? childrenItems
    : childrenItems.filter(item => !path.basename(item.path).startsWith("."));

  const numVisibleDescendantItems = isExpanded
    ? visibleChildrenItems.length +
      childrenItemCounts.reduce((a, b) => a + b, 0)
    : 0;

  const Icon = item.isDirectory
    ? Folder
    : getIconFromExtension(path.extname(item.path));

  const getChildrenItems = useCallback(
    async item => setChildrenItems(await onBrowse(item.path)),
    [setChildrenItems, onBrowse]
  );

  useEffect(() => {
    if (item.path === refreshInfo.path) getChildrenItems(item);
  }, [item, refreshInfo]);

  useEffect(() => {
    if (!isVisible) return;
    getChildrenItems(item);
  }, [item, isVisible]);

  useEffect(
    () => onVisibleDescendantsChange?.(numVisibleDescendantItems),
    [numVisibleDescendantItems]
  );

  useEffect(() => {
    if (!itemRef.current) return;
    const itemStyle = window.getComputedStyle(itemRef.current);
    const marginTop = parseInt(itemStyle.getPropertyValue("margin-top"));
    const marginBottom = parseInt(itemStyle.getPropertyValue("margin-bottom"));
    itemRef.current.fullHeight =
      itemRef.current.offsetHeight + marginTop + marginBottom;
  }, []);

  return (
    <section>
      <div className="flex items-center mb-1" ref={itemRef}>
        <button
          onClick={() => setIsExpanded(isExpanded => !isExpanded)}
          className={`${
            isExpanded ? "rotate-90" : ""
          } text-gray-400 hover:text-gray-600 focus:text-gray-600 dark:text-gray-500 dark:hover:text-gray-200 dark:focus:text-gray-200 py-1.5 px-1 ml-1`}
          style={{
            visibility:
              item.isDirectory && visibleChildrenItems.length ? "" : "hidden",
            transition:
              "transform 200ms linear, color 150ms cubic-bezier(0.4, 0, 0.2, 1)",
          }}
        >
          <ChevronRight size={15} />
        </button>
        <button
          title={item.path}
          key={item.path}
          onClick={() =>
            item.isDirectory ? onNavigate(item.path) : onPreview(item)
          }
          onContextMenu={e => {
            e.preventDefault();
            e.stopPropagation();
            onContextMenu(item, e.pageX, e.pageY);
          }}
          className="flex items-center flex-grow overflow-hidden gap-2 px-2 rounded-sm text-gray-600 dark:text-gray-300 hover:bg-gray-300 focus:bg-gray-300 dark:hover:bg-gray-700 dark:focus:bg-gray-700 py-1.5"
        >
          <Icon className="flex-shrink-0" size={15} />
          <p className="text-sm truncate">{path.basename(item.path) || "-"}</p>
        </button>
      </div>
      <div
        className="pl-4 relative transition-[max-height,visibility] duration-200 ease-linear overflow-hidden"
        style={{
          maxHeight:
            numVisibleDescendantItems * (itemRef.current?.fullHeight ?? 0),
          visibility: isExpanded ? "" : "hidden", // do not set visible explicitly, theres a difference
        }}
      >
        <button
          onClick={() => setIsExpanded(false)}
          className="absolute ml-2.5 mb-1 px-1 top-0 bottom-0 left-0 group"
        >
          <div className="w-px h-full bg-gray-400 group-hover:bg-gray-600 group-focus:bg-gray-600 dark:bg-gray-500 dark:group-hover:bg-gray-200 dark:group-focus:bg-gray-200 transition-colors" />
        </button>
        {visibleChildrenItems.map((item, index) => (
          <SidebarItem
            key={index}
            item={item}
            isVisible={isExpanded}
            onNavigate={onNavigate}
            onContextMenu={onContextMenu}
            onBrowse={onBrowse}
            onPreview={onPreview}
            onVisibleDescendantsChange={count =>
              setChildrenItemCounts(
                cic => ((cic[index] = count), [...cic]) // create copy to ensure rerender
              )
            }
          />
        ))}
      </div>
    </section>
  );
};

const Sidebar = ({ onNavigate, onPreview, onContextMenu, onBrowse }) => {
  const [rootItems, setRootItems] = useState([]);
  const { refreshInfo } = useContext(FileBrowserContext);

  const getRootItems = useCallback(
    async () => setRootItems(await onBrowse("/")),
    []
  );

  useEffect(() => void getRootItems(), [getRootItems]);

  useEffect(() => {
    if (refreshInfo.path === "/") getRootItems();
  }, [getRootItems, refreshInfo]);

  return (
    <div className="py-5 px-3 overflow-y-auto h-full">
      <div className="mb-2">
        <button
          onClick={() => onNavigate("/")}
          className="mb-1 flex items-center w-full overflow-hidden font-bold gap-2.5 px-2 rounded-sm text-gray-500 dark:text-gray-400 hover:bg-gray-300 focus:bg-gray-300 dark:hover:bg-gray-700 dark:focus:bg-gray-700 py-1.5"
        >
          <Clock className="flex-shrink-0" size={15} />
          <p className="text-sm truncate">Recents</p>
        </button>
      </div>

      <div className="mb-2">
        <button
          onClick={() => onNavigate("/")}
          className="mb-1 flex items-center w-full overflow-hidden font-bold gap-2.5 px-2 rounded-sm text-gray-500 dark:text-gray-400 hover:bg-gray-300 focus:bg-gray-300 dark:hover:bg-gray-700 dark:focus:bg-gray-700 py-1.5"
        >
          <Star className="flex-shrink-0" size={15} />
          <p className="text-sm truncate">Favorites</p>
        </button>
      </div>

      <div className="mb-2">
        <button
          onClick={() => onNavigate("/")}
          className="mb-1 flex items-center w-full overflow-hidden font-bold gap-2.5 px-2 rounded-sm text-gray-500 dark:text-gray-400 hover:bg-gray-300 focus:bg-gray-300 dark:hover:bg-gray-700 dark:focus:bg-gray-700 py-1.5"
        >
          <Home className="flex-shrink-0" size={15} />
          <p className="text-sm truncate">Home</p>
        </button>
        {rootItems.map(item => (
          <SidebarItem
            key={item.path}
            item={item}
            onNavigate={onNavigate}
            onContextMenu={onContextMenu}
            onBrowse={onBrowse}
            onPreview={onPreview}
          />
        ))}
      </div>

      <div className="mb-2">
        <button
          onClick={() => onNavigate("/")}
          className="mb-1 flex items-center w-full overflow-hidden font-bold gap-2.5 px-2 rounded-sm text-gray-500 dark:text-gray-400 hover:bg-gray-300 focus:bg-gray-300 dark:hover:bg-gray-700 dark:focus:bg-gray-700 py-1.5"
        >
          <Archive className="flex-shrink-0" size={15} />
          <p className="text-sm truncate">Archived</p>
        </button>
      </div>

      <button
        onClick={() => onNavigate("/")}
        className="mb-1 flex items-center w-full overflow-hidden font-bold gap-2.5 px-2 rounded-sm text-gray-500 dark:text-gray-400 hover:bg-gray-300 focus:bg-gray-300 dark:hover:bg-gray-700 dark:focus:bg-gray-700 py-1.5"
      >
        <Trash2 className="flex-shrink-0" size={15} />
        <p className="text-sm truncate">Trash</p>
      </button>
    </div>
  );
};

export default Sidebar;
