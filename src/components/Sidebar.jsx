import { getIconFromExtension } from "../helpers";
import { Archive, Folder } from "react-feather";
import path from "path";

const Sidebar = ({
  rootItems,
  onNavigate,
  onPreview,
  onArchive,
  onContextMenu,
}) => {
  return (
    <aside className="py-5 px-3 -border-r border-gray-300 dark:border-gray-600">
      <h4 className="text-gray-400 pl-2 mb-1 font-bold text-sm">Archive</h4>
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
        {rootItems.map(item => {
          const Icon = item.isDirectory
            ? Folder
            : getIconFromExtension(path.extname(item.name));
          return (
            <button
              title={item.name}
              key={item.path}
              onClick={() =>
                item.isDirectory ? onNavigate(item.path) : onPreview(item)
              }
              onContextMenu={e => {
                e.preventDefault();
                e.stopPropagation();
                onContextMenu(item, e.pageX, e.pageY);
              }}
              className="w-full flex items-center gap-3 rounded-sm hover:bg-gray-300 focus:bg-gray-300 dark:hover:bg-gray-700 dark:focus:bg-gray-700 py-1.5 px-3"
            >
              <div className="flex-shrink-0 text-gray-600 dark:text-gray-200">
                <Icon className="" size={15} />
              </div>
              <p className="text-gray-600 dark:text-gray-200 text-sm text-left truncate">
                {item.name || "-"}
              </p>
            </button>
          );
        })}
      </div>
    </aside>
  );
};

export default Sidebar;
