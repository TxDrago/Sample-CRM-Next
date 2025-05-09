"use client";

// react
import { useState, useEffect, useCallback } from "react";
//prop
import PropTypes from "prop-types";
//axios
import axios from "axios";
//url
import { tenant_base_url, protocal_url } from "@/Config/Config";
//name
import { getHostnamePart } from "@/components/GlobalHostUrl";
//hooks
import useManagedBy from "@/Hooks/ManagedBy/useManagedBy";
//icons
import { FaAngleDown } from "react-icons/fa";
import { ImCancelCircle } from "react-icons/im";

//toast
import { ToastContainer } from "react-toastify";
import {
  showErrorToast,
  showSuccessToast,
} from "@/utils/toastNotifications";

const MultipleAssignModal = ({ onClose, multiIds }) => {
  const bearer_token = localStorage.getItem("token");
  const name = getHostnamePart();

  const { managedBy } = useManagedBy();

  const [loading, setLoading] = useState(false);
  const [assignedTo, setAssignedTo] = useState("");

  // ------------------------------------Assigned To Dropdown -----------------------------------

  const [defaultTextassigned_ToDropDown, setdefaultTextassigned_ToDropDown] =
    useState("Select Managed by");

  const [isDropdownassigned_ToDropDown, setisDropdownassigned_ToDropDown] =
    useState(false);

  const toggleDropdownassigned_ToDropDown = () => {
    setisDropdownassigned_ToDropDown(!isDropdownassigned_ToDropDown);
  };

  const handleDropdownassigned_ToDropDown = (assigned_To_Username) => {
    setdefaultTextassigned_ToDropDown(assigned_To_Username);
    setisDropdownassigned_ToDropDown(false);
    setAssignedTo(assigned_To_Username);
  };

  //--------------------------------------------------SUBMIT-----------------------------------
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
        assignedTo: assignedTo,
      };

      await axios.post(
        `${protocal_url}${name}.${tenant_base_url}/Lead/leads/changemultipleAssignTo`,
        formData_POST,
        config,
      );

      showSuccessToast("Assign Leads successfully!");
      onClose();
    } catch (error) {
      console.error("Error response:", error.response);
      showErrorToast("Failed to assign leads. Please try again.");
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
                      <div className="w-1/1 relative flex flex-col">
                        <label
                          htmlFor="assignedTo"
                          className="text-sm font-medium text-gray-700 outline-none"
                        >
                          Assigned to
                        </label>
                        <div
                          className="relative"
                          onClick={toggleDropdownassigned_ToDropDown}
                          onMouseLeave={() =>
                            setisDropdownassigned_ToDropDown(false)
                          }
                        >
                          <button
                            className="mt-1 flex w-full items-center justify-between rounded-md border border-gray-300 p-2"
                            id="LeadStatusDropDown"
                            type="button"
                          >
                            {assignedTo === ""
                              ? defaultTextassigned_ToDropDown
                              : assignedTo}
                            <FaAngleDown className="ml-2 text-gray-400" />
                          </button>
                          {isDropdownassigned_ToDropDown && (
                            <div className="absolute top-11 z-10 w-full rounded-md border border-gray-300 bg-white">
                              <ul className="text-sm text-gray-700">
                                {managedBy.map(({ key, userName, role }) => (
                                  <li
                                    key={key}
                                    onClick={() =>
                                      handleDropdownassigned_ToDropDown(
                                        userName,
                                      )
                                    }
                                    className="block cursor-pointer border-b px-4 py-2 hover:bg-cyan-500 hover:text-white"
                                  >
                                    {userName}-({role})
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

MultipleAssignModal.propTypes = {
  multiIds: PropTypes.arrayOf(PropTypes.number).isRequired,
  onClose: PropTypes.func.isRequired,
};

export default MultipleAssignModal;
