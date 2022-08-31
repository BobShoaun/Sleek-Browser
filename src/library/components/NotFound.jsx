import { XOctagon } from "react-feather";

const NotFound = () => {
  return (
    <div className="h-full flex">
      <main className="m-auto">
        <XOctagon
          className="text-gray-400 dark:text-gray-500 mx-auto mb-5"
          size={100}
        />
        <h2 className="text-gray-400 dark:text-gray-500 text-xl font-bold">
          The item you are looking for does not exist :(
        </h2>
      </main>
    </div>
  );
};

export default NotFound;
