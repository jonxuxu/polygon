const EditField = ({ state, setState, label }) => (
  <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
    <label
      htmlFor="title"
      className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
    >
      {label}
    </label>
    <div className="mt-1 sm:mt-0 sm:col-span-2">
      <input
        value={state}
        onChange={(e) => setState(e.target.value)}
        type="text"
        name="title"
        id="title"
        // autoComplete="title"
        className="max-w-lg block w-full shadow-sm focus:ring-primary-500 focus:border-primary-300 sm:max-w-xs sm:text-sm border-gray-300 rounded-md"
      />
    </div>
  </div>
);

export default EditField;
