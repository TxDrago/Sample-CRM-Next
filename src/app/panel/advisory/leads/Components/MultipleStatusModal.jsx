"use client";
//<-----------------------------------  4th Option  ----------------------------------->
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
//icons
import { ImCancelCircle } from "react-icons/im";
import { FaAngleDown } from "react-icons/fa";

//hooks
import useLeadStatus from "@/Hooks/LeadStatus/useLeadStatus";

//toast
import { ToastContainer } from "react-toastify";
import {
  showErrorToast,
  showSuccessToast,
} from "@/utils/toastNotifications";

const MultipleStatusModal = ({ onClose, multiIds }) => {
  const bearer_token = localStorage.getItem("token");
  const name = getHostnamePart();

  const { leadStatus } = useLeadStatus();

  const [loading, setLoading] = useState(false);

  // ------------------------------------Lead Status To Dropdown -----------------------------------
  const [leadStatusSelected, setLeadStatusSelected] = useState("");

  const [isDropdownVisibleLeadStatus, setIsDropdownVisibleLeadStatus] =
    useState(false);
  const [defaultTextLeadStatusDropDown, setDefaultTextLeadStatusDropDown] =
    useState("Select Status");

  const toggleDropdownLeadStatus = () => {
    setIsDropdownVisibleLeadStatus(!isDropdownVisibleLeadStatus);
  };

  const handleDropdownLeadStatus = (status) => {
    setLeadStatusSelected(status);
    setIsDropdownVisibleLeadStatus(false);
  };

  //----------------------------------------------- Submit function ----------------------------------------------------
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
        leadIds: multiIds,
        leadStatus: leadStatusSelected,
      };

      await axios.post(
        `${protocal_url}${name}.${tenant_base_url}/Lead/leads/changemultiplestatus`,
        formData_POST,
        config,
      );

      showSuccessToast("Status Change successfully!");
      onClose();
    } catch (error) {
      console.error("Error response:", error.response);
      showErrorToast("Failed to change status. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ToastContainer />
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20">
        <div className="w-10/12 rounded-lg bg-white sm:w-4/12">
          <div className="flex items-center justify-center rounded-t-lg bg-cyan-500 px-2 py-2 text-xl font-medium text-white">
            <h2 className="mx-auto">Mulitple Change Status</h2>
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
                        htmlFor="leadStatus"
                        className="text-sm font-medium text-gray-700"
                      >
                        Lead Status:
                      </label>
                      <div
                        className="relative"
                        onClick={toggleDropdownLeadStatus}
                      >
                        <button
                          className="mt-1 flex w-full items-center justify-between rounded-md border border-gray-300 p-2"
                          id="LeadStatusDropDown"
                          type="button"
                        >
                          {leadStatusSelected || defaultTextLeadStatusDropDown}
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

MultipleStatusModal.propTypes = {
  multiIds: PropTypes.arrayOf(PropTypes.number).isRequired,
  onClose: PropTypes.func.isRequired,
};

export default MultipleStatusModal;
