import {
  useState,
  useEffect,
  useCallback,
  useRef,
  useLayoutEffect,
} from "react";
import { getIconFromExtension } from "../helpers";
import {
  Archive,
  Folder,
  ChevronRight,
  Home,
  Star,
  Clock,
} from "react-feather";
import path from "path";

const SidebarItem = ({
  item,
  onNavigate,
  onPreview,
  onContextMenu,
  onBrowse,
  onHeightChanged,
}) => {
  const [childrenItems, setChildrenItems] = useState([]);
  const [isExpanded, setIsExpanded] = useState(false);

  const childrenItemsRef = useRef(null);
  const [childrenItemsHeight, setChildrenItemsHeight] = useState(0);

  const getChildrenItems = useCallback(
    async item => setChildrenItems(await onBrowse(item.path)),
    [setChildrenItems, onBrowse]
  );

  useEffect(() => void getChildrenItems(item), [item]);

  useEffect(() => {
    if (!isExpanded) return;
    getChildrenItems(item);
  }, [isExpanded, item]);

  useLayoutEffect(() => {
    const height = childrenItemsRef.current?.scrollHeight;
    onHeightChanged?.(isExpanded ? height : -height);
  }, [isExpanded, childrenItems]);

  const onChildHeightChanged = delta => {
    setChildrenItemsHeight(childrenItemsRef.current?.scrollHeight + delta);
    onHeightChanged?.(delta);
  };

  const Icon = item.isDirectory
    ? Folder
    : getIconFromExtension(path.extname(item.path));

  return (
    <section>
      <div className="flex items-center mb-1">
        <button
          onClick={() => setIsExpanded(isExpanded => !isExpanded)}
          className={`${
            item.isDirectory && childrenItems.length ? "" : "invisible"
          } ${
            isExpanded ? "rotate-90" : ""
          } text-gray-600 dark:text-gray-500 dark:hover:text-gray-100 py-1.5 px-1 ml-1 transition-[transform,color]`}
        >
          <ChevronRight size={15} />
        </button>
        <button
          title={path.basename(item.path)}
          key={item.path}
          onClick={() =>
            item.isDirectory ? onNavigate(item.path) : onPreview(item)
          }
          onContextMenu={e => {
            e.preventDefault();
            e.stopPropagation();
            onContextMenu(item, e.pageX, e.pageY);
          }}
          className="flex items-center flex-grow overflow-hidden gap-2 px-2 rounded-sm text-gray-600 dark:text-gray-200 hover:bg-gray-300 focus:bg-gray-300 dark:hover:bg-gray-700 dark:focus:bg-gray-700 py-1.5"
        >
          <Icon className="flex-shrink-0" size={15} />
          <p className="text-sm truncate">{path.basename(item.path) || "-"}</p>
        </button>
      </div>
      <div
        ref={childrenItemsRef}
        className="pl-4 relative transition-[max-height] duration-200 ease-linear overflow-hidden"
        style={{ maxHeight: isExpanded ? childrenItemsHeight : 0 }}
      >
        <button
          onClick={() => setIsExpanded(false)}
          className="absolute ml-2.5 mb-1 px-1 top-0 bottom-0 left-0 group"
        >
          <div className="w-px h-full bg-gray-500 group-hover:bg-gray-100 transition-colors" />
        </button>
        {childrenItems.map(item => (
          <SidebarItem
            key={item.path}
            item={item}
            onNavigate={onNavigate}
            onContextMenu={onContextMenu}
            onBrowse={onBrowse}
            onPreview={onPreview}
            onHeightChanged={onChildHeightChanged}
          />
        ))}
      </div>
    </section>
  );
};

const Sidebar = ({
  rootItems,
  onNavigate,
  onPreview,
  onContextMenu,
  onBrowse,
}) => {
  return (
    <div className="py-5 px-3">
      <div className="mb-2">
        <button
          title="Recents"
          onClick={() => onNavigate("/")}
          className="mb-1 flex items-center w-full overflow-hidden font-bold gap-2.5 px-2 rounded-sm text-gray-400 dark:text-gray-400 hover:bg-gray-300 focus:bg-gray-300 dark:hover:bg-gray-700 dark:focus:bg-gray-700 py-1.5"
        >
          <Clock className="flex-shrink-0" size={15} />
          <p className="text-sm truncate">Recents</p>
        </button>
      </div>

      <div className="mb-2">
        <button
          title="Favorites"
          onClick={() => onNavigate("/")}
          className="mb-1 flex items-center w-full overflow-hidden font-bold gap-2.5 px-2 rounded-sm text-gray-400 dark:text-gray-400 hover:bg-gray-300 focus:bg-gray-300 dark:hover:bg-gray-700 dark:focus:bg-gray-700 py-1.5"
        >
          <Star className="flex-shrink-0" size={15} />
          <p className="text-sm truncate">Favorites</p>
        </button>
      </div>

      <div className="mb-2">
        <button
          title="Home"
          onClick={() => onNavigate("/")}
          className="mb-1 flex items-center w-full overflow-hidden font-bold gap-2.5 px-2 rounded-sm text-gray-400 dark:text-gray-400 hover:bg-gray-300 focus:bg-gray-300 dark:hover:bg-gray-700 dark:focus:bg-gray-700 py-1.5"
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

      <button
        title="Archived"
        onClick={() => onNavigate("/")}
        className="mb-1 flex items-center w-full overflow-hidden font-bold gap-2.5 px-2 rounded-sm text-gray-400 dark:text-gray-400 hover:bg-gray-300 focus:bg-gray-300 dark:hover:bg-gray-700 dark:focus:bg-gray-700 py-1.5"
      >
        <Archive className="flex-shrink-0" size={15} />
        <p className="text-sm truncate">Archived</p>
      </button>
    </div>
  );
};

export default Sidebar;
