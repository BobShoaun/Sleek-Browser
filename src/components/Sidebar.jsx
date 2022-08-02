import {
  useState,
  useEffect,
  useCallback,
  useRef,
  useLayoutEffect,
} from "react";
import { getIconFromExtension } from "../helpers";
import { Archive, Folder, ChevronRight } from "react-feather";
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
          className="flex items-center flex-grow overflow-hidden gap-3 px-2.5 rounded-sm text-gray-600 dark:text-gray-200 hover:bg-gray-300 focus:bg-gray-300 dark:hover:bg-gray-700 dark:focus:bg-gray-700 py-1.5"
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
  onArchive,
  onContextMenu,
  onBrowse,
}) => {
  return (
    <div className="py-5 px-3">
      <h4 className="text-gray-400 pl-2 mb-1 font-bold text-sm">Favorites</h4>
      <button
        title={"Archive"}
        key={"Archive"}
        onClick={onArchive}
        className="w-full flex items-center gap-3 rounded-sm hover:bg-gray-300 focus:bg-gray-300 dark:hover:bg-gray-700 dark:focus:bg-gray-700 py-1.5 px-3 mb-4"
      >
        <div className="flex-shrink-0 text-gray-600 dark:text-gray-200">
          <Archive className="" size={15} />
        </div>
        <p className="text-gray-600 dark:text-gray-200 text-sm text-left truncate">
          Archived Files
        </p>
      </button>

      <h4 className="text-gray-400 pl-2 mb-1 font-bold text-sm">Home</h4>
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
  );
};

export default Sidebar;
