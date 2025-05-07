"use client";
//------------------------------------------no use------------------------------------------
//react
import { useState,useEffect } from "react";

//reactIcon
import { FaAngleDown } from "react-icons/fa";

//reactRoute
import { Link } from "react-router-dom";

//dropDown --->>> customHooks
import useManagedBy from "@/Hooks/ManagedBy/useManagedBy";
import useLeadSource from "@/Hooks/LeadSource/useLeadSource";
import useLeadStatus from "@/Hooks/LeadStatus/useLeadStatus";

export default function UploadLead() {
  // Custom Hook
  const { leadStatus } = useLeadStatus();
  const { leadSource } = useLeadSource();
  const { managedBy } = useManagedBy();

    //--------------------------------------- Set Business Type --------------------------------------------
             const [BusinessType, setBusinessType] = useState("");
              
             useEffect(() => {
               const storedType = localStorage.getItem("businessType") || "";
               setBusinessType(storedType);
             }, []);

  const [isEditMode, setIsEditMode] = useState(false);

  //-->--->uploadLead/editLead--> Schema<->Model
  const [editLead, setEditLead] = useState({
    file: "",
    nameColNum: "",
    emailColNum: "",
    investAmountColNum: "",
    stateColNum: "",
    mobColNum: "",
    occupationColNum: "",
    cityColNum: "",
    descriptionColNum: "",
    assigned_To: "",
    pool: "",
    status: "",
  });

  //   HANDLING INPUTS
  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditLead({
      ...editLead,
      [name]: value,
    });
  };

  //   HANDLING FORM SUBMIT
  const handleSubmit = (e) => {
    e.preventDefault();
  };

  //--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  //---------------------------> Assigned To <---------------------------
  //assigned_ToDropDown

  const [assignedToDropdown, setAssignedToDropdown] = useState(false);

  const [defaultAssignedToText, setDefaultAssignedToText] =
    useState("Select Managed By");

  //   TOGGLE ASSIGNED TO DROPDOWN
  const toggleAssignedToDropdown = () => {
    setAssignedToDropdown(!assignedToDropdown);
  };

  // HANDLE DROPDOWN FOR TYPE
  const handleDropdownAssignedTo = (assigned_To) => {
    setDefaultAssignedToText(assigned_To);
    setAssignedToDropdown(!assignedToDropdown);
    setEditLead((prevTask) => ({
      ...prevTask,
      assigned_To: assigned_To,
    }));
  };

  //----------------------------------------------------------------------------------------
  //---------------------------> Lead Source <---------------------------
  //default text for Lead Source
  const [poolDropdown, setPoolDropdown] = useState(false);
  const [defaultPoolText, setDefaultPoolText] = useState("Select Lead Source");

  //   TOGGLE ASSIGNED TO DROPDOWN
  const togglePoolDropdown = () => {
    setPoolDropdown(!poolDropdown);
  };

  // HANDLE DROPDOWN FOR TYPE
  const handleDropdownPool = (pool) => {
    setDefaultPoolText(pool);
    setPoolDropdown(!poolDropdown);
    setEditLead((prevTask) => ({
      ...prevTask,
      pool: pool,
    }));
  };

  //----------------------------------------------------------------------------------------
  //---------------------------> Lead Status <---------------------------
  const [statusDropdown, setStatusDropdown] = useState(false);
  const [defaultStatusText, setDefaultStatusText] = useState("status");

  // TOGGLE FLUSH
  const toggleStatusDropdown = () => {
    setStatusDropdown(!statusDropdown);
  };

  // HANDLE DROPDOWN FOR FLUSH
  const handleDropdownStatus = (status) => {
    setDefaultStatusText(status);
    setStatusDropdown(!statusDropdown);
    setEditLead((prevTask) => ({
      ...prevTask,
      status: status,
    }));
  };

  return (
    <div className="mx-3 mt-3 flex flex-col overflow-x-auto overflow-y-hidden bg-gray-300">
      <div className="mt-3 flex items-center justify-between rounded-md bg-white px-2 py-3 shadow-md">
        <h1 className="rounded-lg px-1 py-1 text-xl font-medium">
          {isEditMode ? <h1>Upload Leads</h1> : <>Create Leads</>}
        </h1>
        <div>
          <Link
            to={`/panel/${BusinessType}/leads`}
            className="mx-3 rounded border border-blue-500 px-4 py-1 text-blue-500"
          >
            Cancel
          </Link>
        </div>
      </div>

      {/* FORM STAT FROM HERE */}
      <div className="overflow-hidden">
        {/* CREATE CONTACT FORM */}
        <form className="flex flex-col py-3" onSubmit={handleSubmit}>
          {/* ----- HEADING ----- */}
          <div className="rounded-t-xl bg-cyan-500 px-3 py-2 shadow-md">
            <h1 className="rounded-t-xl bg-cyan-500 font-medium text-white">
              Upload Leads Information
            </h1>
          </div>
          {/* ----- FIELDS START FROM HERE ------ */}
          <div className="bg-white px-3 py-1">
            <label
              htmlFor="file"
              className="block text-sm font-medium text-gray-700"
            >
              Select File
            </label>
            <input
              type="file"
              name="file"
              id="file"
              value={editLead.file}
              placeholder="Upload"
              className="mt-1 w-full rounded-md border border-gray-300 p-2"
              onChange={handleChange}
            />
          </div>
          <div className="flex gap-3 rounded-b-xl bg-white px-3 py-2">
            {/* FIRST SECTION */}
            <div className="flex flex-1 flex-col">
              {/* ASSIGNED TO DROPDOWN */}
              <label
                htmlFor="assigned_To"
                className="text-sm font-medium text-gray-700"
              >
                Assigned To
              </label>
              <div
                className="relative"
                onClick={toggleAssignedToDropdown}
                onMouseLeave={() => setAssignedToDropdown(false)}
              >
                <button
                  className="mt-1 flex w-full items-center justify-between rounded-md border border-gray-300 p-2"
                  id="LeadStatusDropDown"
                  type="button"
                >
                  {isEditMode ? editLead.assigned_To : defaultAssignedToText}
                  <FaAngleDown className="ml-2 text-gray-400" />
                </button>
                {assignedToDropdown && (
                  <div className="absolute top-10 z-10 w-full rounded-md border border-gray-300 bg-white">
                    <ul className="py-2 text-sm text-gray-700">
                      {assignedToData.map(({ key, name }) => (
                        <li
                          className="block cursor-pointer border-b px-4 py-2 hover:bg-cyan-500 hover:text-white"
                          key={key}
                          onClick={() => handleDropdownAssignedTo(name)}
                        >
                          {name}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
              {/* POOL DROPDOWN */}
              <label
                htmlFor="pool"
                className="text-sm font-medium text-gray-700"
              >
                Pool
              </label>
              <div
                className="relative"
                onClick={togglePoolDropdown}
                onMouseLeave={() => setPoolDropdown(false)}
              >
                <button
                  className="mt-1 flex w-full items-center justify-between rounded-md border border-gray-300 p-2"
                  id="LeadStatusDropDown"
                  type="button"
                >
                  {isEditMode ? editLead.pool : defaultPoolText}
                  <FaAngleDown className="ml-2 text-gray-400" />
                </button>
                {poolDropdown && (
                  <div className="absolute top-10 z-10 w-full rounded-md border border-gray-300 bg-white">
                    <ul className="py-2 text-sm text-gray-700">
                      {poolData.map(({ key, name }) => (
                        <li
                          className="block cursor-pointer border-b px-4 py-2 hover:bg-cyan-500 hover:text-white"
                          key={key}
                          onClick={() => handleDropdownPool(name)}
                        >
                          {name}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
            {/* SECOND SECTION */}
            <div className="flex flex-1 flex-col">
              {/* STATUS DROPDOWN */}
              <label
                htmlFor="status"
                className="text-sm font-medium text-gray-700"
              >
                Status
              </label>
              <div
                className="relative"
                onClick={toggleStatusDropdown}
                onMouseLeave={() => setStatusDropdown(false)}
              >
                <button
                  className="mt-1 flex w-full items-center justify-between rounded-md border border-gray-300 p-2"
                  id="LeadStatusDropDown"
                  type="button"
                >
                  {isEditMode ? editLead.status : defaultStatusText}
                  <FaAngleDown className="ml-2 text-gray-400" />
                </button>
                {statusDropdown && (
                  <div className="absolute top-10 z-10 w-full rounded-md border border-gray-300 bg-white">
                    <ul className="py-2 text-sm text-gray-700">
                      {statusData.map(({ key, name }) => (
                        <li
                          className="block cursor-pointer border-b px-4 py-2 hover:bg-cyan-500 hover:text-white"
                          key={key}
                          onClick={() => handleDropdownStatus(name)}
                        >
                          {name}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* COLUMN NUMBER INFORMATION */}
          <div className="mt-3 rounded-xl bg-white shadow-md">
            <h2 className="rounded-t-xl bg-cyan-500 px-3 py-2 font-medium text-white shadow-md">
              Column Number Information
            </h2>
            <div className="flex gap-3 px-3 py-2">
              {/* FIRST SECTION */}
              <div className="flex flex-1 flex-col">
                {/* NAME COLUMN */}
                <label
                  htmlFor="nameColNum"
                  className="block text-sm font-medium text-gray-700"
                >
                  Name Column Number
                </label>
                <input
                  type="number"
                  name="nameColNum"
                  id="nameColNum"
                  value={editLead.nameColNum}
                  placeholder="Enter name column"
                  className="mt-1 w-full rounded-md border border-gray-300 p-2"
                  onChange={handleChange}
                />
                {/* MOBILE COLUMN */}
                <label
                  htmlFor="mobColNum"
                  className="block text-sm font-medium text-gray-700"
                >
                  Mobile Column Number
                </label>
                <input
                  type="number"
                  name="mobColNum"
                  id="mobColNum"
                  value={editLead.mobColNum}
                  placeholder="Enter mobile column"
                  className="mt-1 w-full rounded-md border border-gray-300 p-2"
                  onChange={handleChange}
                />
                {/* EMAIL COLUMN */}
                <label
                  htmlFor="emailColNum"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email Column Number
                </label>
                <input
                  type="number"
                  name="emailColNum"
                  id="emailColNum"
                  value={editLead.emailColNum}
                  placeholder="Enter email column"
                  className="mt-1 w-full rounded-md border border-gray-300 p-2"
                  onChange={handleChange}
                />
                {/* CITY COLUMN */}
                <label
                  htmlFor="cityColNum"
                  className="block text-sm font-medium text-gray-700"
                >
                  City Column Number
                </label>
                <input
                  type="number"
                  name="cityColNum"
                  id="cityColNum"
                  value={editLead.cityColNum}
                  placeholder="Enter city column"
                  className="mt-1 w-full rounded-md border border-gray-300 p-2"
                  onChange={handleChange}
                />
              </div>
              {/* SECOND SECTION */}
              <div className="flex flex-1 flex-col">
                {/* STATE COLUMN */}
                <label
                  htmlFor="stateColNum"
                  className="block text-sm font-medium text-gray-700"
                >
                  State Column Number
                </label>
                <input
                  type="number"
                  name="stateColNum"
                  id="stateColNum"
                  value={editLead.stateColNum}
                  placeholder="Enter state column"
                  className="mt-1 w-full rounded-md border border-gray-300 p-2"
                  onChange={handleChange}
                />
                {/* OCCUPATION COLUMN */}
                <label
                  htmlFor="occupationColNum"
                  className="block text-sm font-medium text-gray-700"
                >
                  Occupation Column Number
                </label>
                <input
                  type="number"
                  name="occupationColNum"
                  id="occupationColNum"
                  value={editLead.occupationColNum}
                  placeholder="Enter occupation column"
                  className="mt-1 w-full rounded-md border border-gray-300 p-2"
                  onChange={handleChange}
                />
                {/* DESCRIPTION COLUMN */}
                <label
                  htmlFor="descriptionColNum"
                  className="block text-sm font-medium text-gray-700"
                >
                  Description Column Number
                </label>
                <input
                  type="number"
                  name="descriptionColNum"
                  id="descriptionColNum"
                  value={editLead.descriptionColNum}
                  placeholder="Enter description column"
                  className="mt-1 w-full rounded-md border border-gray-300 p-2"
                  onChange={handleChange}
                />
              </div>
            </div>
            {/* BUTTONS */}
            <div className="mr-10 flex justify-end gap-5">
              <div className="mr-20 flex justify-end">
                <button
                  type="submit"
                  className="mb-4 mt-40 rounded border-2 border-cyan-500 bg-cyan-500 px-32 py-4 text-white hover:bg-white hover:text-cyan-500"
                >
                  {isEditMode ? "Update" : "Save"}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
