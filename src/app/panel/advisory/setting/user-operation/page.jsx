"use client";

//react
import Link from "next/link";

//react
import { useState, useEffect } from "react";
//reactIcon
import { FaAngleDown, FaBars } from "react-icons/fa";
import { MdEdit } from "react-icons/md";
import { RiDeleteBin6Fill } from "react-icons/ri";


import { useParams } from "next/navigation";

//external Packages
import axios from "axios";

import { tenant_base_url, protocal_url } from "@/Config/Config";
import { getHostnamePart } from "@/components/GlobalHostUrl";
import GlobalUserNameComponent from "@/components/GlobalUserNameComponent";

import { IoMdHome } from "react-icons/io";
import { IoIosArrowForward } from "react-icons/io";

//toastify~
import { ToastContainer } from "react-toastify";
import {
  showSuccessToast,
  showErrorToast,
} from "@/utils/toastNotifications";
import Breadcrumb from "../Breadcrumb/Breadcrumb";

export default function UserOperation() {
  //to make id unique
  const { id } = useParams();

     //--------------------------------------- Set Business Type --------------------------------------------
       const [BusinessType, setBusinessType] = useState("");
              
       useEffect(() => {
         const storedType = localStorage.getItem("businessType") || "";
         setBusinessType(storedType);
       }, []);

  const pathnames = location.pathname.split("/").filter((x) => x);

  const name = getHostnamePart();

  const bearer_token = localStorage.getItem("token");

  //state to show table or form
  const [active, setActive] = useState(true);

  //form
  const [formData, setFormData] = useState({
    fullName: "",
    userName: "",
    teamMember: "",
    reportedTo: "",
    groupName: "",
    currencyCode: "",
    extensions: "",
    did: "",
  });

  const [users, setUsers] = useState([]);
  const [groupNames, setGroupNames] = useState([]);

  //editMode
  const [editLead, setEditLead] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);

  //show edit prefield
  const [isShowFields, setIsShowFields] = useState(false);
  const [selectedUserName, setSelectedUserName] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);

  //getting user operation lists and groups lists here
  useEffect(() => {
    getOprationLists();
    getGroupsNames();
  }, []);

  const handleActiveState = () => {
    //table to form and viceversa
    setActive(!active);

    setIsShowFields(false);

    setIsEditMode(false); // Reset edit mode when switching views

    setFormData({
      fullName: "",
      userName: "",
      teamMember: "",
      reportedTo: "",
      groupName: "",
      target: "",
      currencyCode: "",
      extensions: "",
      did: "",
    }); // Reset form dataa
    setSelectedUserName("");
  };

  const handleClick = (user) => {
    handleSelectUser(user);
    setFormData({
      fullName: user?.fullName,
      userName: user?.userName,
      teamMember: user?.teamMember,
      reportedTo: user?.reportedTo,
      groupName: user?.groupName,
      target: user?.target,
      currencyCode: user?.currencyCode,
      extensions: user?.extensions,
      did: user?.did,
    });

    if (user) {
      setEditLead(user);
      setFormData(user); // Populate form with user data
      setIsEditMode(true);
      setActive(false); // Switch to form view
    }
  };

  // get operation lists
  const getOprationLists = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${bearer_token}`,
        },
      };
      const response = await axios.get(
        `${protocal_url}${name}.${tenant_base_url}/Setting/userOpration/all`,
        config,
      );
      if (response.status === 200) {
        const opration = response.data; // Get the user data
        setUsers(opration?.data); // Set the user data for editing
      }
    } catch (error) {
      console.log(error);
      showErrorToast(error.response.data.message);
    }
  };

  // get operation lists
  const getGroupsNames = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${bearer_token}`,
        },
      };
      const response = await axios.get(
        `${protocal_url}${name}.${tenant_base_url}/Admin/group/all`,
        config,
      );
      if (response.status === 200) {
        const opration = response.data; // Get the user data
        setGroupNames(opration?.data); // Set the user data for editing
      } else showErrorToast("You are not an authorised user");
    } catch (error) {
      showErrorToast("You are not an authorised user");
    }
  };

  // Handle user selection and update form fields
  const handleSelectUser = (item) => {
    const fullName = `${item.firstName} ${item.lastName}`;
    setFormData({
      ...formData,
      fullName: fullName,
      reportedTo: item.reportedTo,
      groupName: item.role,
      userName: item.userName,
      userId: item.userId,
    });
    setIsShowFields(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const [errors, setErrors] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isEditMode) {
      handleUpdateOpration();
    } else {
      if (!formData.currencyCode) {
        showErrorToast("Please enter currency");
        return;
      }
      if (!formData.reportedTo) {
        showErrorToast("Please select reported to");
        return;
      }
      if (!formData.groupName) {
        showErrorToast("Please select group name");
        return;
      }
      if (!formData.target) {
        showErrorToast("Please select Target name");
        return;
      }
      handleCreateOperation();
    }
  };

  const handleCreateOperation = async (e) => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${bearer_token}`,
        },
      };
      const response = await axios.post(
        `${protocal_url}${name}.${tenant_base_url}/Setting/userOpration/add`,
        formData,
        config,
      );
      getOprationLists();
      setActive(!active);
      showSuccessToast("User operation created successfull");
    } catch (error) {
      showErrorToast(error.response.data.message);
    }
  };

  //delete  operation
  const handleDeleteOpration = async (id) => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${bearer_token}`,
        },
      };
      const response = await axios.delete(
        `${protocal_url}${name}.${tenant_base_url}/Setting/userOpration/delete/${id}`,
        config,
      );
      getOprationLists();
      showSuccessToast("User deleted successfully");
    } catch (error) {
      console.error(error.response.data.message);
    }
  };

  //update  operation
  const handleUpdateOpration = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${bearer_token}`,
        },
      };
      const response = await axios.put(
        `${protocal_url}${name}.${tenant_base_url}/Setting/userOpration/update/${formData?.id}`,
        formData,
        config,
      );
      getOprationLists();
      handleActiveState();
      alert(response.data.message);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  return (
    <>
      <ToastContainer />
      <div className="m-3 min-w-screen">
        {active ? (
          <>
            <div className="flex flex-wrap items-center justify-between gap-5 min-w-screen">
              <h1 className="text-3xl font-medium">User Operation</h1>
              <button
                onClick={handleActiveState}
                className="p-2 text-sm text-white bg-blue-600 rounded min-w-10"
              >
                Add User Operation
              </button>
            </div>

  {/*---------------------------------------------------------------- BreadCrumb PROP  ----------------------------------------------------------------*/}
  <Breadcrumb />

            
            <div className="mt-3 overflow-x-auto shadow-md leads_Table_Main_Container">
              <div className="min-w-full rounded-md leads_Table_Container">
                <table className="min-w-full bg-white leads_Table">
                  <thead>
                    <tr className="border-b-2 border-gray-300">
                      <th className="px-1 py-3">
                        <input type="checkbox" />
                      </th>

                      {/* <th className="px-2 py-3 font-medium text-left border-r">
                      <div className="flex items-center justify-between text-sm max-w-32">
                        <span>Full Name</span>
                        <FaBars />
                      </div>
                    </th> */}
                      <th className="px-2 py-3 font-medium text-left border-r">
                        <div className="flex items-center justify-between text-sm">
                          <span>User Name</span>
                          <FaBars />
                        </div>
                      </th>

                      {/* <th className="px-2 py-3 font-medium text-left border-r">
                      <div className="flex items-center justify-between text-sm">
                        <span>Team Member</span>
                        <FaBars />
                      </div>
                    </th> */}

                      <th className="px-2 py-3 font-medium text-left border-r">
                        <div className="flex items-center justify-between text-sm">
                          <span>Reported To</span>
                          <FaBars />
                        </div>
                      </th>

                      <th className="px-2 py-3 font-medium text-left border-r">
                        <div className="flex items-center justify-between text-sm">
                          <span>Group</span>
                          <FaBars />
                        </div>
                      </th>

                      <th className="px-2 py-3 font-medium text-left border-r">
                        <div className="flex items-center justify-between text-sm">
                          <span>Target</span>
                          <FaBars />
                        </div>
                      </th>

                      <th className="px-2 py-3 font-medium text-left border-r">
                        <div className="flex items-center justify-between text-sm">
                          <span>Currency Code</span>
                          <FaBars />
                        </div>
                      </th>

                      <th className="px-2 py-3 font-medium text-left border-r">
                        <div className="flex items-center justify-between text-sm">
                          <span>Extension</span>
                          <FaBars />
                        </div>
                      </th>

                      <th className="px-2 py-3 font-medium text-left border-r">
                        <div className="flex items-center justify-between text-sm">
                          <span>DID</span>
                          <FaBars />
                        </div>
                      </th>

                      <th className="px-2 py-3 font-medium text-left border-r">
                        <div className="flex items-center justify-between text-sm">
                          <span>Action</span>
                        </div>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {users?.map((user) => (
                      <tr
                        key={user.id}
                        className="border-b border-gray-300 cursor-pointer hover:bg-gray-200"
                      >
                        <td className="px-1 py-3 text-center">
                          <input
                            type="checkbox"
                            onClick={(e) => handleCheckboxClick(e, user.id)}
                          />
                        </td>
                        {/* <td className="px-2 py-4 text-sm break-words max-w-24">
                        {user.first_name}
                      </td> */}
                        <td className="px-2 py-4 text-sm break-words max-w-24">
                          {user.userName}
                        </td>

                        <td className="px-2 py-4 text-sm break-words max-w-24">
                          {user.reportedTo}
                        </td>
                        <td className="px-2 py-4 text-sm break-words max-w-24">
                          {user.groupName}
                        </td>
                        <td className="px-2 py-4 text-sm break-words max-w-24">
                          {user.target}
                        </td>
                        <td className="px-2 py-4 text-sm break-words max-w-24">
                          {user.currencyCode}
                        </td>
                        <td className="px-2 py-4 text-sm break-words max-w-24">
                          {user.extensions}
                        </td>
                        <td className="px-2 py-4 text-sm break-words max-w-24">
                          {user.did}
                        </td>
                        <td className="flex justify-center gap-3 px-2 py-4">
                          <MdEdit
                            size={25}
                            color="white"
                            className="bg-blue-500 rounded"
                            onClick={() => handleClick(user)}
                          />
                          <RiDeleteBin6Fill
                            size={25}
                            color="red"
                            onClick={() => {
                              handleDeleteOpration(user.id);
                            }}
                          />
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
            <div className="flex items-center justify-between min-w-screen">
              <h1 className="text-3xl font-medium">
                {isEditMode ? "Edit User Operation" : "Add user Operation"}
              </h1>
              <button
                onClick={handleActiveState}
                className="px-4 py-2 text-sm text-blue-600 bg-white border border-blue-600 rounded min-w-10"
              >
                Cancel
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex">
              <div className="w-full">
                <div className="flex-grow mt-3 bg-white shadow-md rounded-xl">
                  <h2 className="px-4 py-2 font-medium text-white rounded-t-xl bg-cyan-500">
                    Lead Information
                  </h2>
                  {/* -------------1------------- */}
                  <div className="grid gap-2 px-4 py-2">
                    <div className="flex space-x-4">
                      {/* Username field */}
                      <div className="flex flex-col w-1/2">
                        <label
                          htmlFor="username"
                          className="text-sm font-medium text-gray-700"
                        >
                          Username
                        </label>
                        <GlobalUserNameComponent
                          name="userName"
                          fieldName="userName"
                          selectedValue={selectedUserName || formData?.userName}
                          setSelectedValue={setSelectedUserName}
                          setSelectedUser={(e) => {
                            handleSelectUser(e);
                            setSelectedUser(e);
                          }}
                          className="p-2 mt-1 border border-gray-300 rounded-md"
                        />
                      </div>

                      {/* Conditional Full Name field */}
                      {isShowFields && (
                        <div className="flex flex-col w-1/2">
                          <label
                            htmlFor="fullName"
                            className="text-sm font-medium text-gray-700"
                          >
                            Full Name
                          </label>
                          <input
                            disabled
                            value={formData?.fullName || ""}
                            type="text"
                            name="fullName"
                            className="p-2 mt-1 border border-gray-300 rounded-md"
                          />
                        </div>
                      )}
                    </div>

                    {isShowFields && (
                      <div className="grid gap-2">
                        <div className="flex space-x-4">
                          {/* Team Member */}
                          <div className="flex flex-col w-1/2">
                            <label
                              htmlFor="teamMember"
                              className="text-sm font-medium text-gray-700"
                            >
                              Currency Code
                            </label>
                            <input
                              type="text"
                              name="currencyCode"
                              value={formData?.currencyCode || ""}
                              onChange={handleChange}
                              className="p-2 mt-1 border border-gray-300 rounded-md"
                            />
                          </div>

                          {/* reportedTo Dropdown */}
                          <div className="flex flex-col w-1/2">
                            <label
                              htmlFor="reportedTo"
                              className="text-sm font-medium text-gray-700"
                            >
                              Reported To
                            </label>
                            <GlobalUserNameComponent
                              name="reportedTo"
                              fieldName="reportedTo"
                              selectedValue={formData?.reportedTo}
                              setSelectedValue={(value) =>
                                setFormData({ ...formData, reportedTo: value })
                              }
                              className="p-2 mt-1 border border-gray-300 rounded-md"
                            />
                            {errors.reportedTo && <p>{errors.reportedTo}</p>}
                          </div>
                        </div>

                        <div className="flex space-x-4">
                          {/* Group Dropdown */}
                          <div className="flex flex-col w-1/2">
                            <label
                              htmlFor="groupName"
                              className="text-sm font-medium text-gray-700"
                            >
                              Group Name
                            </label>
                            <select
                              name={"groupName"}
                              className="p-2 mt-1 border border-gray-300 rounded-md"
                              value={formData?.groupName}
                              onChange={handleChange}
                            >
                              <option value={formData?.groupName} disabled>
                                {formData?.groupName || "Select"}
                              </option>
                              {groupNames?.map((item) => (
                                <option key={item.id} value={item.groupName}>
                                  {item.groupName}
                                </option>
                              ))}
                            </select>
                            {errors.groupName && (
                              <span style={{ color: "red" }}>
                                {errors.groupName}
                              </span>
                            )}
                          </div>

                          {/* target */}
                          <div className="flex flex-col w-1/2">
                            <label
                              htmlFor="target"
                              className="text-sm font-medium text-gray-700"
                            >
                              Target
                            </label>
                            <input
                              type="number"
                              name="target"
                              value={formData?.target || ""}
                              onChange={handleChange}
                              className="p-2 mt-1 border border-gray-300 rounded-md"
                            />
                            {errors.target && (
                              <span style={{ color: "red" }}>
                                {errors.target}
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="flex space-x-4">
                          {/* extensions */}
                          <div className="flex flex-col w-1/2">
                            <label
                              htmlFor="extensions"
                              className="text-sm font-medium text-gray-700"
                            >
                              Extension
                            </label>
                            <input
                              type="text"
                              name="extensions"
                              value={formData?.extensions || ""}
                              onChange={handleChange}
                              className="p-2 mt-1 border border-gray-300 rounded-md"
                            />
                          </div>

                          {/* did */}
                          <div className="flex flex-col w-1/2">
                            <label
                              htmlFor="did"
                              className="text-sm font-medium text-gray-700"
                            >
                              DID
                            </label>
                            <input
                              type="text"
                              name="did"
                              value={formData?.did || ""}
                              onChange={handleChange}
                              className="p-2 mt-1 border border-gray-300 rounded-md"
                            />
                          </div>
                        </div>

                        {/* -------------Button------------- */}
                        <div className="flex items-center justify-end max-w-full mb-3">
                          <button
                            type="submit"
                            className="w-full px-6 py-4 mt-4 border rounded-md border-cyan-500 text-cyan-500 hover:bg-cyan-500 hover:text-white"
                          >
                            {isEditMode ? "Update User" : "Save User"}
                          </button>
                        </div>
                      </div>
                    )}
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
