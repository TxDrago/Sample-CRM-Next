"use client";
import { useState } from "react";
import PropTypes from "prop-types";
import { ImFilter } from "react-icons/im";
import { TbRefresh } from "react-icons/tb";

export default function UseDateFilter({
  onReset,
  originalData,
  setFilteredData,
  filteredData,
}) {
  // ----------------------------- Date Filter -----------------------------
  const today = new Date().toISOString().split("T")[0];
  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState(today);

  // -------------------------------------- Function to update date states ---------------------------------------
  const onDateChange = (field, value) => {
    let newStartDate = startDate;
    let newEndDate = endDate;

    if (field === "startDate") {
      newStartDate = value;
    } else {
      newEndDate = value;
    }

    // Update state first
    setStartDate(newStartDate);
    setEndDate(newEndDate);

    // Now filter with the updated values
    filterByDateRange(newStartDate, newEndDate);
  };

  //------------------------------------------------Reset Function --------------------------------------------------
  const handleResetClick = () => {
    setStartDate(today);
    setEndDate(today);
    setFilteredData(originalData);
    onReset();
  };

  //--------------------------------------------- Function to filter leads based on date range-----------------------------------
  const filterByDateRange = (start, end) => {
    if (!filteredData || filteredData.length === 0) return;

    const startDateObj = new Date(start);
    startDateObj.setHours(0, 0, 0, 0);
    const endDateObj = new Date(end);
    endDateObj.setHours(23, 59, 59, 999);

    const filtered = filteredData.filter((follow) => {
      const callbackDate = new Date(follow.call_bck_DateTime);
      return callbackDate >= startDateObj && callbackDate <= endDateObj;
    });

    setFilteredData(filtered);
  };

  return (
    <div className="date_Filter_Main_Container">
      <div className="flex items-center justify-between rounded-lg border-2 border-gray-300 bg-white p-2">
        {/* Filter Icon & Label */}
        <div className="flex items-center">
          <button className="border-r border-gray-500 pr-2">
            <ImFilter className="filter_Image_Size" />
          </button>

          <button className="filter_Image_Display whitespace-nowrap border-r border-gray-500 px-2">
            Filter By
          </button>

          {/* Date Inputs */}
          <div className="flex items-center gap-2 px-2">
            <label className="hide_Filter_Text">From:</label>
            <input
              type="date"
              value={startDate}
              className="filter_Date rounded border px-2 py-2"
              onChange={(e) => onDateChange("startDate", e.target.value)}
            />

            <label className="hide_Filter_Text">To:</label>
            <input
              type="date"
              value={endDate}
              className="filter_Date rounded border px-2 py-2"
              onChange={(e) => onDateChange("endDate", e.target.value)}
            />
          </div>
        </div>

        {/* Reset Button */}
        <div
          className="reset_paddings flex cursor-pointer items-center gap-2 rounded border p-2"
          onClick={() => handleResetClick()}
        >
          <label className="hide_Filter_Text">Reset</label>
          <TbRefresh className="filter_Reset_Image" />
        </div>
      </div>
    </div>
  );
}

UseDateFilter.propTypes = {
  onReset: PropTypes.func.isRequired,
  originalData: PropTypes.array.isRequired,
  setFilteredData: PropTypes.func.isRequired,
  filteredData: PropTypes.array.isRequired,
};
