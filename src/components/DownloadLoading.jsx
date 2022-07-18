const DownloadLoading = ({ onCancel }) => {
  return (
    <main className="bg-white bg-opacity-70 fixed inset-0 z-50 flex">
      <div className="m-auto text-center">
        <h1 className="text-gray-600 text-2xl mb-4">
          Waiting for your file to download...
        </h1>
        <button
          onClick={onCancel}
          className="bg-gray-300 hover:bg-gray-200 focus:bg-gray-200 transition-colors py-1 px-3 text-gray-700"
        >
          Cancel
        </button>
      </div>
    </main>
  );
};

export default DownloadLoading;
