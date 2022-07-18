const RadioButton = ({ onChange, field, title, value }) => {
  return (
    <div
      onClick={() => onChange(value)}
      className="flex cursor-pointer items-center gap-3 px-3 py-1 w-full text-left whitespace-nowrap hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
    >
      <span
        className={`transition-opacity ${
          field === value ? "opacity-100" : "opacity-0"
        }`}
        style={{ fontSize: "1.5rem" }}
      >
        •
      </span>
      {title}
    </div>
  );
};

export default RadioButton;
