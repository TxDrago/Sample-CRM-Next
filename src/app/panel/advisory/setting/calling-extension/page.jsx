"use client";

//react
import { useParams } from "next/navigation";

import { useState, useEffect } from "react";
import { FaAngleDown, FaBars } from "react-icons/fa";
import { MdEdit } from "react-icons/md";
import { RiDeleteBin6Fill } from "react-icons/ri";
import axios from "axios";
import { tenant_base_url, protocal_url } from "@/Config/Config";
import Breadcrumb from "../Breadcrumb/Breadcrumb";

export default function CallingExtension() {
  const { id } = useParams();
  const [active, setActive] = useState(true);
  const [users, setUsers] = useState([
    {
      id: "1",
      callingName: "Vibrant Call",
      callingType: "Direct Call",
    },
    {
      id: "2",
      callingName: "Vibrant Call",
      callingType: "Direct Call",
    },
  ]);

  const [formData, setFormData] = useState({
    id: "",
    callingName: "",
    callingType: "",
  });

  const [editLead, setEditLead] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);

  // Calling Type Dropdown
  const [callingTypes, setCallingTypes] = useState([]);
  const [defaultTextCallingTypeDropDown, setDefaultTextCallingTypeDropDown] =
    useState("Select Calling Type");
  const [isDropdownVisibleCallingType, setIsDropdownVisibleCallingType] =
    useState(false);

  const handleActiveState = () => {
    setActive(!active);
    setIsEditMode(false); // Reset edit mode when switching views
    setFormData({
      id: "",
      callingName: "",
      callingType: "",
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
    if (!formData.callingName || !formData.callingType) {
      alert("Please fill in all fields before submitting.");
      return;
    }

    if (isEditMode) {
      console.log("Edit Calling Extension:", formData);
      // Add logic to submit the edited data
    } else {
      console.log("Add Calling Extension:", formData);
      setActive(true); // Switch to list view after adding
      // Add logic to add a new user
    }
  };

  const handleCheckboxClick = (e, userId) => {
    e.stopPropagation();
    console.log(`Checkbox clicked for user: ${userId}`);
  };

  // Calling Type Dropdown
  const toggleDropdownCallingType = () => {
    setIsDropdownVisibleCallingType(!isDropdownVisibleCallingType);
  };

  const handleDropdownCallingType = (callingType) => {
    setFormData((prevData) => ({
      ...prevData,
      callingType,
    }));
    setDefaultTextCallingTypeDropDown(callingType);
    setIsDropdownVisibleCallingType(false);
  };

  async function fetchCallingTypes() {
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
        }.${tenant_base_url}/Admin/callingtypes/getall`,
        config,
      );
      setCallingTypes(response.data.data);
      console.log("Calling Types:", response.data.data);
    } catch (error) {
      console.error("Error fetching calling types:", error);
    }
  }

  useEffect(() => {
    fetchCallingTypes();
  }, []);

  return (
    <>
      <div className="  m-3">
        {active ? (
          <>
            <div className="  flex flex-wrap items-center justify-between gap-5">
              <h1 className="text-3xl font-medium">Calling Extension</h1>
              <button
                onClick={handleActiveState}
                className="min-w-10 rounded bg-blue-600 p-2 text-sm text-white"
              >
                Add Calling Extension
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
                          <span>Calling Name</span>
                          <FaBars />
                        </div>
                      </th>
                      <th className="border-r px-2 py-3 text-left font-medium">
                        <div className="flex items-center justify-between text-sm">
                          <span>Calling Type</span>
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
                          {user.callingName}
                        </td>
                        <td className="max-w-24 break-words px-2 py-4 text-sm">
                          {user.callingType}
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
            <div className="  flex items-center justify-between">
              <h1 className="text-3xl font-medium">
                {isEditMode
                  ? "Edit Calling Extension"
                  : "Add Calling Extension"}
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
                    Calling Extension Form
                  </h2>
                  <div className="grid gap-2 px-3 py-2">
                    {/* Calling Name */}
                    <div className="flex space-x-4">
                      <div className="flex w-1/2 flex-col">
                        <label
                          htmlFor="callingName"
                          className="text-sm font-medium text-gray-700"
                        >
                          Calling Name
                        </label>
                        <input
                          type="text"
                          name="callingName"
                          value={formData.callingName}
                          onChange={handleChange}
                          className="rounded-md border border-gray-300 p-2"
                          placeholder="Enter Calling Name"
                        />
                      </div>

                      {/* Calling Type Dropdown */}
                      <div className="relative flex w-1/2 flex-col">
                        <label
                          htmlFor="callingType"
                          className="text-sm font-medium text-gray-700"
                        >
                          Calling Type
                        </label>
                        <div
                          className="relative"
                          onClick={toggleDropdownCallingType}
                          onMouseLeave={() =>
                            setIsDropdownVisibleCallingType(false)
                          }
                        >
                          <div className="flex cursor-pointer items-center justify-between rounded-md border border-gray-300 p-2">
                            {defaultTextCallingTypeDropDown}
                            <FaAngleDown />
                          </div>
                          {isDropdownVisibleCallingType && (
                            <div className="absolute z-10 mt-2 w-full rounded-md border border-gray-200 bg-white shadow-lg">
                              {callingTypes.map((callingType, index) => (
                                <div
                                  key={index}
                                  className="cursor-pointer p-2 hover:bg-gray-100"
                                  onClick={() =>
                                    handleDropdownCallingType(callingType)
                                  }
                                >
                                  {callingType}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    {/* -------------Button------------- */}

                    <div className="mb-8">
                      <button
                        type="submit"
                        className="mt-4 rounded-md border border-cyan-500 px-4 py-4 text-cyan-500 hover:bg-cyan-500 hover:text-white"
                      >
                        {isEditMode ? "Edit Extension" : "Add Extension"}
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
