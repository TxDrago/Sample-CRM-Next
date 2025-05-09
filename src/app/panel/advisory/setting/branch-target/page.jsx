"use client";

//react

import { useState, useEffect } from "react";
import { FaAngleDown, FaBars } from "react-icons/fa";
import { MdEdit } from "react-icons/md";
import { RiDeleteBin6Fill } from "react-icons/ri";
import { useParams } from "next/navigation";
import axios from "axios";
import { tenant_base_url, protocal_url } from "@/Config/Config";
import Breadcrumb from "../Breadcrumb/Breadcrumb";

export default function BranchTarget() {
  const { id } = useParams();
  const [active, setActive] = useState(true);
  const [users, setUsers] = useState([
    {
      id: "1",
      targetPrior: "1 Year",
      assignTo: "Rahul Jain",
      targetAmount: "1200",
      setTarget: "2 Months",
      memberName: "Prakash Jain",
    },
    {
      id: "2",
      targetPrior: "1 Year",
      assignTo: "Rahul Jain",
      targetAmount: "1200",
      setTarget: "2 Months",
      memberName: "Prakash Jain",
    },
  ]);

  const [formData, setFormData] = useState({
    id: "",
    targetPrior: "",
    assignTo: "",
    targetAmount: "",
    setTarget: "",
    memberName: "",
  });

  const [editLead, setEditLead] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);

  // assignTo
  const [assignTo, setassignTo] = useState([]);
  const [defaultTextassignToDropDown, setDefaultTextassignToDropDown] =
    useState("Select Assigned");
  const [isDropdownVisibleassignTo, setIsDropdownVisibleassignTo] =
    useState(false);

  const handleActiveState = () => {
    setActive(!active);
    setIsEditMode(false); // Reset edit mode when switching views
    setFormData({
      id: "",
      targetPrior: "",
      assignTo: "",
      targetAmount: "",
      setTarget: "",
      memberName: "",
    }); // Reset form data
  };

  const handleClick = (userId) => {
    const userToEdit = users.find((user) => user.id === userId);
    if (userToEdit) {
      setEditLead(userToEdit);
      setFormData(userToEdit); // Populate form with user data
      setIsEditMode(true);
      setActive(false); // Switch to form view
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validation check
    if (!formData.senderEmail || !formData.port) {
      alert("Please fill in all fields before submitting.");
      return;
    }

    if (isEditMode) {
      console.log("Edit User:", formData);
      // Add logic to submit the edited user data
    } else {
      console.log("Add User:", formData);
      setActive(true); // Switch to the form view

      // Add logic to add a new user
    }
  };

  const handleCheckboxClick = (e, userId) => {
    e.stopPropagation();
    console.log(`Checkbox clicked for user: ${userId}`);
  };

  // Plan Type Dropdown
  const toggleDropdownAssignToType = () => {
    setIsDropdownVisibleassignTo(!isDropdownVisibleassignTo);
  };

  const handleDropdownPlanType = (port) => {
    setFormData((port) => ({
      ...port,
      port,
    }));
    setDefaultTextPortTypeDropDown(port);
    setIsDropdownVisibleassignTo(false);
  };

  async function handleGroup() {
    const bearer_token = localStorage.getItem("token");

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${bearer_token}`,
        },
      };
      const response = await axios.get(
        `${protocal_url}${
          window.location.hostname.split(".")[0]
        }.${tenant_base_url}/Admin/leadstatus/getall`,
        config,
      );
      setplanType(response.data.data);
      console.log("Plan data:", response.data.data);
    } catch (error) {
      console.error("Error fetching plans:", error);
    }
  }

  useEffect(() => {
    handleGroup();
  }, []);

  return (
    <>
      <div className="min-w-screen m-3">
        {active ? (
          <>
            <div className="min-w-screen flex flex-wrap items-center justify-between gap-5">
              <h1 className="text-3xl font-medium">Branch Target</h1>
              <button
                onClick={handleActiveState}
                className="min-w-10 rounded bg-blue-600 p-2 text-sm text-white"
              >
                Add Branch Target
              </button>
            </div>
              {/*---------------------------------------------------------------- BreadCrumb PROP  ----------------------------------------------------------------*/}
              <Breadcrumb />
            <div className="leads_Table_Main_Container mt-3 overflow-x-auto shadow-md">
              <div className="leads_Table_Container min-w-full rounded-md">
                <table className="leads_Table min-w-full bg-white">
                  <thead>
                    <tr className="border-b-2 border-gray-300">
                      <th className="px-1 py-3">
                        <input type="checkbox" />
                      </th>
                      <th className="border-r px-2 py-3 text-left font-medium">
                        <div className="flex items-center justify-between text-sm">
                          <span>Target Prior</span>
                          <FaBars />
                        </div>
                      </th>
                      <th className="border-r px-2 py-3 text-left font-medium">
                        <div className="flex items-center justify-between text-sm">
                          <span>Assign To</span>
                          <FaBars />
                        </div>
                      </th>
                      <th className="border-r px-2 py-3 text-left font-medium">
                        <div className="flex items-center justify-between text-sm">
                          <span>Target Amount</span>
                          <FaBars />
                        </div>
                      </th>

                      <th className="border-r px-2 py-3 text-left font-medium">
                        <div className="flex items-center justify-between text-sm">
                          <span>Set Target</span>
                          <FaBars />
                        </div>
                      </th>

                      <th className="border-r px-2 py-3 text-left font-medium">
                        <div className="flex items-center justify-between text-sm">
                          <span>Member Name</span>
                          <FaBars />
                        </div>
                      </th>

                      <th className="border-r px-2 py-3 text-left font-medium">
                        <div className="flex items-center justify-between text-sm">
                          <span>Action</span>
                        </div>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr
                        key={user.id}
                        className="cursor-pointer border-b border-gray-300 hover:bg-gray-200"
                      >
                        <td className="px-1 py-3 text-center">
                          <input
                            type="checkbox"
                            onClick={(e) => handleCheckboxClick(e, user.id)}
                          />
                        </td>
                        <td className="max-w-24 break-words px-2 py-4 text-sm">
                          {user.targetPrior}
                        </td>

                        <td className="max-w-24 break-words px-2 py-4 text-sm">
                          {user.assignTo}
                        </td>
                        <td className="max-w-24 break-words px-2 py-4 text-sm">
                          {user.targetAmount}
                        </td>

                        <td className="max-w-24 break-words px-2 py-4 text-sm">
                          {user.setTarget}
                        </td>

                        <td className="max-w-24 break-words px-2 py-4 text-sm">
                          {user.memberName}
                        </td>
                        <td className="flex justify-center gap-3 px-2 py-4">
                          <MdEdit
                            size={25}
                            color="white"
                            className="rounded bg-blue-500"
                            onClick={() => handleClick(user.id)}
                          />
                          <RiDeleteBin6Fill size={25} color="red" />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="min-w-screen flex items-center justify-between">
              <h1 className="text-3xl font-medium">
                {isEditMode ? "Edit Branch Target" : "Add Branch Target"}
              </h1>
              <button
                onClick={handleActiveState}
                className="min-w-10 rounded border border-blue-600 bg-white px-4 py-2 text-sm text-blue-600"
              >
                Cancel
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex">
              <div className="w-full">
                <div className="mt-3 flex-grow rounded-xl bg-white shadow-md">
                  <h2 className="rounded-t-xl bg-cyan-500 px-4 py-2 font-medium text-white">
                    Branch Target
                  </h2>
                  {/* -------------1------------- */}
                  <div className="grid gap-2 px-4 py-2">
                    {/* -------------Target Prior------------- */}
                    <div className="flex space-x-4">
                      <div className="flex w-1/2 flex-col">
                        <label
                          htmlFor="targetPrior"
                          className="text-sm font-medium text-gray-700"
                        >
                          Target Prior
                        </label>
                        <input
                          type="text"
                          name="targetPrior"
                          value={formData.targetPrior}
                          onChange={handleChange}
                          className="mt-1 rounded-md border border-gray-300 p-2"
                          placeholder="Enter Sender Email"
                        />
                      </div>
                      {/* -------------Assign To------------- */}
                      <div className="relative flex w-1/2 flex-col">
                        <label
                          htmlFor="assignTo"
                          className="text-sm font-medium text-gray-700"
                        >
                          Assign To
                        </label>
                        <div
                          className="relative"
                          onClick={toggleDropdownAssignToType}
                          onMouseLeave={() =>
                            setIsDropdownVisibleassignTo(false)
                          }
                        >
                          <button
                            className="mt-1 flex w-full items-center justify-between rounded-md border border-gray-300 p-2"
                            id="DropDown"
                            type="button"
                          >
                            {formData.assignTo || defaultTextassignToDropDown}
                            <FaAngleDown className="ml-2 text-gray-400" />
                          </button>

                          {isDropdownVisibleassignTo && (
                            <div className="absolute top-11 z-10 w-full rounded-md border border-gray-300 bg-white">
                              <ul className="py-2 text-sm text-gray-700">
                                {assignTo.map((assignTo) => (
                                  <li
                                    key={assignTo.id}
                                    className="block cursor-pointer border-b px-4 py-2 hover:bg-cyan-500 hover:text-white"
                                    onClick={() =>
                                      handleDropdownPlanType(assignTo.name)
                                    }
                                  >
                                    {assignTo.name}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* -------------2------------- */}
                    <div className="flex space-x-4">
                      {/* -------------Target Amount------------- */}
                      <div className="flex w-1/2 flex-col">
                        <label
                          htmlFor="targetAmount"
                          className="text-sm font-medium text-gray-700"
                        >
                          Target Amount
                        </label>
                        <input
                          type="text"
                          name="targetAmount"
                          value={formData.targetAmount}
                          onChange={handleChange}
                          className="mt-1 rounded-md border border-gray-300 p-2"
                        />
                      </div>

                      {/* -------------setTarget------------- */}
                      <div className="flex w-1/2 flex-col">
                        <label
                          htmlFor="setTarget"
                          className="text-sm font-medium text-gray-700"
                        >
                          Set Target
                        </label>
                        <input
                          type="text"
                          name="setTarget"
                          value={formData.setTarget}
                          onChange={handleChange}
                          className="mt-1 rounded-md border border-gray-300 p-2"
                        />
                      </div>
                    </div>

                    {/* -------------3------------- */}
                    <div className="flex space-x-4">
                      {/* -------------Member Name------------- */}
                      <div className="flex w-1/2 flex-col">
                        <label
                          htmlFor="memberName"
                          className="text-sm font-medium text-gray-700"
                        >
                          Member Name
                        </label>
                        <input
                          type="text"
                          name="memberName"
                          value={formData.memberName}
                          onChange={handleChange}
                          className="mt-1 rounded-md border border-gray-300 p-2"
                        />
                      </div>
                    </div>

                    {/* -------------Button------------- */}
                    <div className="mb-8">
                      <button
                        type="submit"
                        className="mt-4 w-max rounded-md border border-cyan-500 px-4 py-4 text-cyan-500 hover:bg-cyan-500 hover:text-white"
                      >
                        {isEditMode ? "Edit Plan" : "Add Plan"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </>
        )}
      </div>
    </>
  );
}
