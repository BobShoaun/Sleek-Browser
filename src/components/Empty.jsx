import { Box } from "react-feather";
import { Trash2 } from "react-feather";

const Empty = ({ onDelete }) => {
  return (
    <div className="h-full flex">
      <main className="m-auto">
        <Box
          className="text-gray-400 dark:text-gray-500 mx-auto mb-5"
          size={100}
        />
        <h2 className="text-gray-400 dark:text-gray-500 text-xl font-bold mb-6">
          This folder is very empty...
        </h2>
        <button
          onClick={onDelete}
          className="flex items-center text-sm mx-auto hover:bg-gray-200 dark:hover:bg-gray-700 border border-gray-300 dark:border-gray-600 transition-colors rounded-sm px-6 py-1.5 text-gray-600 dark:text-gray-400 gap-2"
        >
          <Trash2 size={13} /> Delete
        </button>
      </main>
    </div>
  );
};

export default Empty;
