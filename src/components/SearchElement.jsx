import PropTypes from "prop-types";

// Search Element Component
export function SearchElement({ value, onChange }) {
  return (
    <div className="searchBox_Order flex w-auto min-w-[250px] items-center justify-center">
      <input
        type="text"
        placeholder="Search by Name or Mobile"
        value={value}
        onChange={onChange}
        className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 md:max-w-full"
      />
    </div>
  );
}

// PropTypes validation
SearchElement.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};
