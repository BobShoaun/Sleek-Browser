const RadioButton = ({ onChange, name, field, title, value }) => (
  <label className="flex items-center gap-2 cursor-pointer rounded-sm px-3 py-1 transition-colors whitespace-nowrap hover:bg-gray-200 dark:hover:bg-gray-700 focus:bg-gray-200 dark:focus:bg-gray-700">
    <input
      type="radio"
      name={name}
      value={value}
      checked={field === value}
      onChange={e => onChange(e.target.value)}
      className="before:content-['•'] before:opacity-0 before:checked:opacity-100 before:text-xl appearance-none before:transition-opacity"
    />
    {title}
  </label>
);

export default RadioButton;
