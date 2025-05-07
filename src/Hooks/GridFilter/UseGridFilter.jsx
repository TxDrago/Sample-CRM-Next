"use client";
import { useState } from "react";
import { FaAngleDown, FaBars } from "react-icons/fa";
import PropTypes from "prop-types";

//Wizard->
import { FaTableList } from "react-icons/fa6";
import { IoGrid } from "react-icons/io5";

export default function UseGridFilter({
 
  setSelectedViewValue,
}) {
  const stripeBar = [
    { key: 1, value: "Table View", icon: <FaTableList /> },
    { key: 2, value: "Grid View", icon: <IoGrid /> },
  ];

  const [stripeBardropDown, setStripeBardropDown] = useState(false);

  const handleStripeButton = (value) => {
    setSelectedViewValue(value);
    setStripeBardropDown(false);
  };

  return (
    <>
    <div className="relative" onMouseLeave={() => setStripeBardropDown(false)}>
      <button
        className="flex items-center justify-between gap-2 rounded-md border px-4 py-3"
        type="button"
        onClick={() => setStripeBardropDown(!stripeBardropDown)}
      >
        <FaBars />
        <FaAngleDown className="text-gray-900" />
      </button>
      
       {stripeBardropDown && (
                  <div className="absolute right-0 z-10 w-32 bg-white border border-gray-300 rounded-md top-10">
                    <ul className="text-sm text-gray-700">
                      {stripeBar.map(({ key, value, icon }) => (
                        <li
                          key={key}
                          className="flex items-center gap-2 py-2 border-b cursor-pointer hover:bg-cyan-500 hover:text-white"
                          onClick={() => handleStripeButton(value)}
                        >
                          <div className="flex items-center justify-center w-6 h-6 mx-1 text-lg">
                            {icon}
                          </div>
                          <div className="flex-1 text-left">{value}</div>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
    </div>
     
    </>
  );
}

UseGridFilter.propTypes = {
  setSelectedViewValue: PropTypes.func.isRequired,
};
