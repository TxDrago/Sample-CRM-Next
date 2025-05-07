"use client";
//<-----------------------------------  3rd Option  ----------------------------------->
//react
import { useState, useEffect } from "react";
//prop
import PropTypes from "prop-types";
//axios
import axios from "axios";
//url
import { tenant_base_url, protocal_url } from "@/Config/Config";
//name
import { getHostnamePart } from "@/components/GlobalHostUrl";
//hooks
import useLeadStatus from "@/Hooks/LeadStatus/useLeadStatus";
//react-icons
import { FaAngleDown } from "react-icons/fa";
import { ImCancelCircle } from "react-icons/im";
//toast
import { ToastContainer } from "react-toastify";
import {
  showErrorToast,
  showSuccessToast,
} from "@/utils/toastNotifications";

const LeadStatusModal = ({ onClose }) => {
  const bearer_token = localStorage.getItem("token");
  const name = getHostnamePart();

  const { leadStatus } = useLeadStatus();

  const [loading, setLoading] = useState(false);
  const [leadCount, setLeadCount] = useState("");
  const [leadeStatus, setLeadeStatus] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "leadCount") {
      setLeadCount(value);
    }
  };

  //----------------------------------------------- handleSubmit ----------------------------------------------------
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!bearer_token) {
      showErrorToast("No token found, please log in again.");
      return;
    }

    setLoading(true);

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${bearer_token}`,
          "Content-Type": "application/json",
        },
      };

      const formData_POST = {
        leadCount: leadCount,
        leadeStatus: leadeStatus,
      };

      await axios.post(
        `${protocal_url}${name}.${tenant_base_url}/LeadOpration/leads/multiplechangestatus`,
        formData_POST,
        config,
      );

      showSuccessToast("Status Change successfully!");
      onClose();
    } catch (error) {
      console.error("Error response:", error.response);
    } finally {
      setLoading(false);
    }
  };

  // ------------------------------------Lead Status Dropdown -----------------------------------

  const [defaultTextLeadStatusDropDown, setdefaultTextLeadStatusDropDown] =
    useState("Select Status");
  const [isDropdownVisibleLeadStatus, setisDropdownVisibleLeadStatus] =
    useState(false);

  const toggleDropdownLeadStatus = () => {
    setisDropdownVisibleLeadStatus(!isDropdownVisibleLeadStatus);
  };

  const handleDropdownLeadStatus = (leadStatus) => {
    setLeadeStatus(leadStatus);
    setisDropdownVisibleLeadStatus(!isDropdownVisibleLeadStatus);
  };

  return (
    <>
      <ToastContainer />
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-20">
        <div className="w-10/12 rounded-lg bg-white sm:w-4/12">
          <div className="flex items-center justify-center rounded-t-lg bg-cyan-500 px-2 py-2 text-xl font-medium text-white">
            <h2 className="mx-auto">Leads Allotment</h2>
            <ImCancelCircle onClick={onClose} size={22} />
          </div>
          <form onSubmit={handleSubmit} className="px-4">
            <div className="mt-3">
              <h1 className="text-md rounded-t-lg bg-cyan-500 px-4 py-2 font-medium text-white">
                Details
              </h1>
              <div className="rounded-b-xl border-2 border-t-0 border-cyan-500 bg-white px-1">
                <div className="grid gap-2 p-2">
                  <div className="flex space-x-4">
                    <div className="flex w-full flex-col">
                      <label
                        htmlFor="leadCount"
                        className="text-sm font-medium text-gray-700"
                      >
                        Lead Count:
                      </label>
                      <input
                        type="number"
                        name="leadCount"
                        id="leadCount"
                        value={leadCount}
                        onChange={handleInputChange}
                        className="mt-1 rounded-md border border-gray-300 p-2 outline-none"
                      />
                    </div>
                  </div>
                  <div className="flex space-x-4">
                    <div className="flex w-full flex-col">
                      <div className="w-1/1 relative flex flex-col">
                        <label
                          htmlFor="leadStatus"
                          className="text-sm font-medium text-gray-700 outline-none"
                        >
                          Lead Status
                        </label>
                        <div
                          className="relative"
                          onClick={toggleDropdownLeadStatus}
                          onMouseLeave={() =>
                            setisDropdownVisibleLeadStatus(false)
                          }
                        >
                          <button
                            className="mt-1 flex w-full items-center justify-between rounded-md border border-gray-300 p-2"
                            id="LeadStatusDropDown"
                            type="button"
                          >
                            {leadeStatus != ""
                              ? leadeStatus
                              : defaultTextLeadStatusDropDown}
                            <FaAngleDown className="ml-2 text-gray-400" />
                          </button>
                          {isDropdownVisibleLeadStatus && (
                            <div className="top-10.5 absolute z-10 w-full rounded-md border border-gray-300 bg-white">
                              <ul className="py-2 text-sm text-gray-700">
                                {leadStatus.map(({ key, status }) => (
                                  <li
                                    key={key}
                                    onClick={() =>
                                      handleDropdownLeadStatus(status)
                                    }
                                    className="block cursor-pointer border-b px-4 py-2 hover:bg-cyan-500 hover:text-white"
                                  >
                                    {status}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-2 justify-end gap-5">
              <button
                type="submit"
                className="mb-3 rounded-md border-2 border-cyan-500 bg-cyan-500 p-2 text-white hover:bg-white hover:text-cyan-500"
                disabled={loading}
              >
                {loading ? "Sending..." : "Submit"}
              </button>
              <button
                type="button"
                className="mb-3 rounded-md border-2 border-gray-300 p-2 font-semibold text-gray-500 hover:bg-gray-300 hover:text-white"
                onClick={onClose}
              >
                Close
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

LeadStatusModal.propTypes = {
  onClose: PropTypes.func.isRequired,
};

export default LeadStatusModal;
