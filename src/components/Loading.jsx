import { Loader } from "react-feather";

const Loading = () => {
  return (
    <main className="absolute inset-0 flex bg-gray-500 dark:bg-gray-900 bg-opacity-10 dark:bg-opacity-30 cursor-wait">
      <div className="m-auto bg-gray-100 dark:bg-gray-800 rounded-sm shadow-md py-2 px-6 flex items-center gap-3 text-gray-500 dark:text-gray-300">
        <Loader className="animate-spin" strokeWidth={3} size={20} />
        <h1 className="text-lg font-medium">Loading...</h1>
      </div>
    </main>
  );
};

export default Loading;
