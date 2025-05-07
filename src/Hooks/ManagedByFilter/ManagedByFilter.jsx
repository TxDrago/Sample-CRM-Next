"use client";
import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import { FaAngleDown } from "react-icons/fa";
import { getHostnamePart } from "@/components/GlobalHostUrl";
import { protocal_url, tenant_base_url } from "@/Config/Config";

export default function ManagedByFilter({
  assignedTo,
  setAssignedTo,
  setFilteredData,
  filteredData
}) {
  const name = getHostnamePart();
  const [allAssigned_To_DROPDOWN, setallAssigned_To_DROPDOWN] = useState(false);
  const [allAssigned_To_Data, setallAssigned_To_Data] = useState([]);

  const toggleMenuAssigned_To = () => {
    setallAssigned_To_DROPDOWN(!allAssigned_To_DROPDOWN);
  };

  //----------------------------------------------- Fetch Assigned Users Data -----------------------------------------------------
  async function fetchAssignedUsers() {
    const bearer_token = localStorage.getItem("token");

    try {
      const config = { headers: { Authorization: `Bearer ${bearer_token}` } };
      const response = await axios.get(
        `${protocal_url}${name}.${tenant_base_url}/Setting/users/byusertoken`,
        config,
      );
      setallAssigned_To_Data(response.data.data);
    } catch (error) {
      console.error("Error fetching assigned users:", error);
    }
  }

  useEffect(() => {
    fetchAssignedUsers();
  }, []);

  // ---------------------------------------------------------- Handle Filter  --------------------------------------------
  function handleAssignedToSelection(assignedToValue) {
    setAssignedTo(assignedToValue); // Update state in FollowUp
    let filtered = filteredData;
      if (assignedToValue !== "Managed By") {
        filtered = filtered.filter(
          (lead) => lead.assigned_To === assignedToValue,
        );
      }
      setFilteredData(filtered);
    }  
  

  return (
    <div
      className="contact_Dropdown_Container relative whitespace-nowrap"
      onClick={toggleMenuAssigned_To}
      onMouseLeave={() => setallAssigned_To_DROPDOWN(false)}
    >
      <button
        className="contact_Dropdown_Button flex min-w-36 items-center justify-between rounded-md border px-4 py-2"
        type="button"
      >
        {assignedTo}
        <FaAngleDown className="ml-2 text-gray-900" />
      </button>
      {allAssigned_To_DROPDOWN && (
        <div className="absolute top-10 z-10 rounded-md border border-gray-300 bg-white">
          <ul className="py-2 text-sm text-gray-700">
            {allAssigned_To_Data.map((item) => (
              <li
                key={item.id}
                className="block w-56 cursor-pointer border-b px-4 py-2 hover:bg-cyan-500 hover:text-white"
                onClick={() => handleAssignedToSelection(item.userName)}
              >
                {item.userName}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

ManagedByFilter.propTypes = {
  assignedTo: PropTypes.string.isRequired,
  followUpBy: PropTypes.string.isRequired,
  setAssignedTo: PropTypes.func.isRequired,
  setFilteredData: PropTypes.func.isRequired,
  setFinalData: PropTypes.func.isRequired,
  finalData: PropTypes.array.isRequired,
  originalData: PropTypes.array.isRequired,
  filteredData : PropTypes.array.isRequired,
};
