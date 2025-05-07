"use client";
import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import { FaAngleDown } from "react-icons/fa";
import { getHostnamePart } from "@/components/GlobalHostUrl";
import { protocal_url, tenant_base_url } from "@/Config/Config";

export default function UseFilterBySegment({
  followUpBy,
  setFollowUpBy,
  setFilteredData,
  filteredData,
}) {
  const name = getHostnamePart();
  const [allFollowUpToDropdown, setAllFollowUpToDropdown] = useState(false);
  const [allFollowUpToData, setAllFollowUpToData] = useState([]);

  const toggleMenuFollowUpTo = () => {
    setAllFollowUpToDropdown((prev) => !prev);
  };

  useEffect(() => {
    const fetchFollowUpUsers = async () => {
      try {
        const bearer_token = localStorage.getItem("token");
        const config = { headers: { Authorization: `Bearer ${bearer_token}` } };
        const response = await axios.get(
          `${protocal_url}${name}.${tenant_base_url}/Admin/segment/getall`,
          config,
        );
        setAllFollowUpToData(response.data.data || []);
      } catch (error) {
        console.error("Error fetching FollowUp users:", error);
      }
    };

    fetchFollowUpUsers();
  }, [name, followUpBy]);
  // ---------------------------------------------------------- Handle Filter  --------------------------------------------

  function handleFollowUpBySelection(followUpByValue) {
    setFollowUpBy(followUpByValue);
    let filtered = filteredData;
    if (followUpByValue !== "Follow Up By") {
      filtered = filtered.filter(
        (lead) => lead.segments && lead.segments.includes(followUpByValue),
      );
    }
    setAllFollowUpToDropdown(false);
    setFilteredData(filtered);
  }

  return (
    <div
      className="relative whitespace-nowrap"
      onMouseLeave={() => setAllFollowUpToDropdown(false)}
    >
      <button
        className="flex min-w-36 items-center justify-between rounded-md border px-4 py-2"
        type="button"
        onClick={toggleMenuFollowUpTo}
      >
        {followUpBy}
        <FaAngleDown className="ml-2 text-gray-900" />
      </button>
      {allFollowUpToDropdown && (
        <div className="absolute top-10 z-10 rounded-md border border-gray-300 bg-white">
          <ul className="py-2 text-sm text-gray-700">
            {allFollowUpToData.map((item) => (
              <li
                key={item.id}
                className="block w-56 cursor-pointer border-b px-4 py-2 hover:bg-cyan-500 hover:text-white"
                onClick={() => handleFollowUpBySelection(item.segment)}
              >
                {item.segment}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

UseFilterBySegment.propTypes = {
  followUpBy: PropTypes.string.isRequired,
  setFollowUpBy: PropTypes.func.isRequired,
  setFilteredData: PropTypes.func.isRequired,
  filteredData: PropTypes.array.isRequired,
};
