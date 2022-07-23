import { useState } from "react";
import { getIconFromExtension } from "../helpers";
import { Archive, Folder, ChevronRight, ChevronDown } from "react-feather";
import path from "path";

const SidebarItem = ({
  item,
  onNavigate,
  onPreview,
  onContextMenu,
  onBrowse,
}) => {
  const [childrenItems, setChildrenItems] = useState([]);
  const [isExpanded, setIsExpanded] = useState(false);

  const expand = async () => {
    if (item.isDirectory) {
      const items = await onBrowse(item.path);
      console.log(items);
      setChildrenItems(items);
      setIsExpanded(isExpanded => !isExpanded);
    }
  };

  const Icon = item.isDirectory
    ? Folder
    : getIconFromExtension(path.extname(item.path));
  return (
    <section>
      <div className="flex items-center">
        <button
          onClick={expand}
          className={`${
            item.isDirectory ? "" : "invisible"
          } text-gray-600 dark:text-gray-500 dark:hover:text-gray-100 py-1.5 px-1 ml-1 transition-colors`}
        >
          {isExpanded ? <ChevronDown size={15} /> : <ChevronRight size={15} />}
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
      {isExpanded && (
        <div className="pl-4 my-0.5 relative">
          <button
            onClick={() => setIsExpanded(isExpanded => !isExpanded)}
            className="absolute ml-2.5 px-1 top-0 bottom-0 left-0 group"
          >
            <div className="w-px h-full bg-gray-500 group-hover:bg-gray-100"></div>
          </button>
          <div className="space-y-0.5">
            {childrenItems.map(item => (
              <SidebarItem
                item={item}
                onNavigate={onNavigate}
                onContextMenu={onContextMenu}
                onBrowse={onBrowse}
              />
            ))}
          </div>
        </div>
      )}
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
    <aside className="py-5 px-3 -border-r border-gray-300 dark:border-gray-600">
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
      <div className="space-y-0.5">
        {rootItems.map(item => (
          <SidebarItem
            item={item}
            onNavigate={onNavigate}
            onContextMenu={onContextMenu}
            onBrowse={onBrowse}
          />
        ))}
      </div>
    </aside>
  );
};

export default Sidebar;
