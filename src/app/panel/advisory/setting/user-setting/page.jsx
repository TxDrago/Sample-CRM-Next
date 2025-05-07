"use client";

//react
// import Link from "next/link";

import { useState, useEffect } from "react";

import axios from "axios";
import { tenant_base_url, protocal_url } from "@/Config/Config";
import { getHostnamePart } from "@/components/GlobalHostUrl";

//reactIcons
import { FaBars } from "react-icons/fa";
import { MdEdit } from "react-icons/md";
import { RiDeleteBin6Fill } from "react-icons/ri";

import Breadcrumb from "../Breadcrumb/Breadcrumb";

import { ToastContainer } from "react-toastify";
import { showErrorToast, showSuccessToast } from "@/utils/toastNotifications";

export default function UserSetting() {
  const name = getHostnamePart();
  const bearer_token = localStorage.getItem("token");


  const [data, setData] = useState([]);
  const [active, setActive] = useState(true);
  const [selectedData, setSelectedData] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);

  const businessType = localStorage.getItem("businessType");

  const [reportedTo, setreportedTo] = useState([]);

  // Handle checkbox click
  const handleCheckboxClick = (e, userId) => {
    e.stopPropagation(); // Prevent row click event from firing
    console.log(`Checkbox clicked for user: ${userId}`);
  };

  //switching from admin to another users
  const handleLoginUser = async (user) => {
    const bearer_token = localStorage.getItem("token");
    const config = {
      headers: {
        Authorization: `Bearer ${bearer_token}`,
      },
    };
    try {
      const response = await axios.post(
        `${protocal_url}${name}.${tenant_base_url}/Users/login`,
        {
          userName: user?.email,
          password: user?.dycriptedPassword,
          deviceType: "",
          deviceAddress: "",
        },
        config
      );

      // Log the response to verify the status code
      console.log("Response status:", response?.status);
      const logindetail = response.data.data;
      if (response?.data?.data) {
        localStorage.setItem("token", response.data.data.token);
        localStorage.setItem("userDetail", JSON.stringify(logindetail));
        alert("Login successful");
        // refresh();
      }
    } catch (error) {
      console.error("Error during login:", error);
    }
  };

  // Password visibility state
  const [passwordEye, setPasswordEye] = useState(false);

  // Fetch all  data
  //-------------------get-------------------get-------------------get-------------------get-------------------
  async function handleLead() {
    const bearer_token = localStorage.getItem("token");
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${bearer_token}`,
        },
      };
      const response = await axios.get(
        `${protocal_url}${name}.${tenant_base_url}/Setting/users/byusertoken`,
        config
      );
      console.log(response?.data?.data, "000");
      setData(response?.data?.data);
      setreportedTo(response?.data?.data);
    } catch (error) {
      console.error("Error fetching leads:", error);
    }
  }

  useEffect(() => {
    handleLead(); // Fetch the  list on initial load
  }, []);

  // Delete  by ID
  const handleDelete = async (id) => {
    console.log(id);
    const bearer_token = localStorage.getItem("token");
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${bearer_token}`,
        },
      };
      await axios.delete(
        `${protocal_url}${name}.${tenant_base_url}/Setting/${id}`,
        config
      );
      showSuccessToast("User Deleted Successfully");
      setData((prevData) => prevData.filter((item) => item.id !== id));
      handleLead();
    } catch (error) {
      showErrorToast(error.response.data.message);
    }
  };

  // Handle switching to the form for adding or editing
  const handleEdit = (data) => {
    setSelectedData(data);
    setActive(false);
    setIsEditMode(true);
  };

  const handleAdd = () => {
    setSelectedData({
      userId: "",
      firstName: "",
      lastName: "",
      email: "",
      contactNo: "",
      country: "",
      businessType: "",
      password: "",
      confirmPassword: "",
      reportedTo: "",
      role: "",
      createdDate: "",
      deletedDate: "",
      userName: "",
    });
    setActive(false);
    setIsEditMode(false);
  };

  // Handle form submission callback
  const handleFormSubmit = async (formData) => {
    const config = {
      headers: {
        Authorization: `Bearer ${bearer_token}`,
      },
    };

    const formData_POST = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      contactNo: formData.contactNo,
      country: formData.country,
      businessType: businessType,
      userName: formData.userName || "",
      password: formData.password,
      confirmPassword: formData.confirmPassword,
      role: formData.role || "",
      groupId: null,
      reportedTo: formData.reportedTo,
      isActive: true,
      createdDate: null,
      deletedDate: null,
    };

    const formData_PUT = {
      userId: formData.userId,
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      contactNo: formData.contactNo,
      country: formData.country,
      businessType: businessType,
      userName: formData.userName,
      password: formData.password,
      confirmPassword: formData.confirmPassword,
      role: formData.role,
      groupId: null,
      reportedTo: formData.reportedTo,
      isActive: true,
      createdDate: formData.createdDate || null,
      deletedDate: formData.deletedDate || null,
    };

    console.log(formData_POST, "handleSubmitRunned");

    try {
      if (isEditMode) {
        await axios.put(
          `${protocal_url}${name}.${tenant_base_url}/Setting/update`,
          formData_PUT,
          config
        );
      } else {
        if (!formData_POST.firstName) {
          showErrorToast("Please enter name");
          return;
        }

        if (!formData_POST.email) {
          showErrorToast("Please enter email");
          return;
        }

        if (!formData_POST.contactNo) {
          showErrorToast("Please enter contact number");
          return;
        }

        if (!formData_POST.password) {
          showErrorToast("Please enter password");
          return;
        }

        if (formData_POST.password !== formData_POST.confirmPassword) {
          showErrorToast("Password doesnt match");
          return;
        }

        if (!formData_POST.reportedTo) {
          showErrorToast("Please selected Reported to");
          return;
        }

        if (!formData_POST.role) {
          showErrorToast("Please selected group name");
          return;
        }
        await axios.post(
          `${protocal_url}${name}.${tenant_base_url}/Setting`,
          formData_POST,
          config
        );
      }

      handleLead(); // Refresh the list
      setActive(true); // Switch back to the list view
      setSelectedData(null); // Reset the selected
      setIsEditMode(false); // Reset edit mode
    } catch (error) {
      showErrorToast(error.response.data.message);
    }
  };

  // Handle cancel form action
  const handleCancel = () => {
    setActive(true);
    setSelectedData(null);
    setIsEditMode(false);
  };

  // Form Component for Adding/Updating
  const EditForm = ({ data, isEditMode }) => {
    const [formData, setFormData] = useState({
      userId: "",
      firstName: "",
      lastName: "",
      email: "",
      contactNo: "",
      country: "",
      businessType: "",
      password: "",
      confirmPassword: "",
      reportedTo: "",
      role: "",
      createdDate: "",
      deletedDate: "",
      userName: "",
    });

    useEffect(() => {
      setFormData(
        data || {
          userId: "",
          firstName: "",
          lastName: "",
          email: "",
          contactNo: "",
          country: "",
          businessType: "",
          password: "",
          confirmPassword: "",
          reportedTo: "",
          role: "",
          createdDate: "",
          deletedDate: "",
          userName: "",
        }
      );
    }, [data]);

    const handleChange = (e) => {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value,
      });
    };

    // ROLE dropdown management
    const [ROLE, setROLE] = useState([]);
    async function handleRole() {
      const bearer_token = localStorage.getItem("token");
      const config = {
        headers: {
          Authorization: `Bearer ${bearer_token}`,
        },
      };
      try {
        const response = await axios.get(
          `${protocal_url}${name}.${tenant_base_url}/Admin/group/all`,
          config
        );
        setROLE(response.data.data);
        // console.log("Role data:", response.data.data);
      } catch (error) {
        console.error("Error fetching roles:", error);
      }
    }

    useEffect(() => {
      handleRole();
    }, []);

    const handleSubmit = (e) => {
      e.preventDefault();
      handleFormSubmit(formData);
    };

    return (
      <>
        <ToastContainer />
        <div className="flex items-center justify-between min-w-screen">
          <h1 className="text-3xl font-medium">
            {isEditMode ? "Edit" : "Add"}
          </h1>
          <button
            onClick={handleCancel}
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

              <div className="grid gap-2 px-3 py-2">
                {/*<---------------1--------------->*/}
                {/*<---------------First Name--------------->*/}
                <div className="flex space-x-4">
                  <div className="flex flex-col w-1/2">
                    <label
                      htmlFor="firstName"
                      className="text-sm font-medium text-gray-700"
                    >
                      First Name
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName || ""}
                      onChange={handleChange}
                      className="p-2 mt-1 border border-gray-300 rounded-md"
                    />
                  </div>
                  {/*<---------------Last Name--------------->*/}
                  <div className="flex flex-col w-1/2">
                    <label
                      htmlFor="lastName"
                      className="text-sm font-medium text-gray-700"
                    >
                      Last Name
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName || ""}
                      onChange={handleChange}
                      className="p-2 mt-1 border border-gray-300 rounded-md"
                    />
                  </div>
                </div>
                {/*<---------------2--------------->*/}
                <div className="flex space-x-4">
                  {/*<---------------Email--------------->*/}
                  <div className="flex flex-col w-1/2">
                    <label
                      htmlFor="email"
                      className="text-sm font-medium text-gray-700"
                    >
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email || ""}
                      onChange={handleChange}
                      className="p-2 mt-1 border border-gray-300 rounded-md"
                    />
                  </div>
                  {/*<---------------contactNo--------------->*/}
                  <div className="flex flex-col w-1/2">
                    <label
                      htmlFor="contactNo"
                      className="text-sm font-medium text-gray-700"
                    >
                      Contact Number
                    </label>
                    <input
                      type="number"
                      name="contactNo"
                      value={formData.contactNo || ""}
                      onChange={handleChange}
                      className="p-2 mt-1 border border-gray-300 rounded-md"
                    />
                  </div>
                </div>

                {/*<---------------3--------------->*/}
                {/*<---------------userName--------------->*/}
                <div className="flex space-x-4">
                  <div className="flex flex-col w-1/2">
                    <label
                      htmlFor="userName"
                      className="text-sm font-medium text-gray-700"
                    >
                      Username
                    </label>
                    <input
                      type="text"
                      name="userName"
                      value={formData.userName || ""}
                      onChange={handleChange}
                      className="p-2 mt-1 border border-gray-300 rounded-md"
                    />
                  </div>

                  {/*<---------------country--------------->*/}
                  <div className="flex flex-col w-1/2">
                    <label
                      htmlFor="country"
                      className="text-sm font-medium text-gray-700"
                    >
                      Country
                    </label>
                    <input
                      type="text"
                      name="country"
                      value={formData.country || ""}
                      onChange={handleChange}
                      className="p-2 mt-1 border border-gray-300 rounded-md"
                    />
                  </div>
                </div>
                {/*<---------------4--------------->*/}
                <div className="flex space-x-4">
                  {/* Password Input Field */}
                  <div className="flex flex-col w-1/2">
                    <label
                      htmlFor="password"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Password
                      <div className="relative">
                        <input
                          type={passwordEye ? "text" : "password"}
                          name="password"
                          className="w-full py-2 pl-2 pr-10 mt-1 text-sm border border-gray-300 rounded-md outline-none"
                          value={formData.password}
                          onChange={handleChange}
                          placeholder="********"
                        />
                      </div>
                    </label>
                  </div>
                  {/*<---------------Confirm Password--------------->*/}
                  {/* Password Input Field */}
                  <div className="flex flex-col w-1/2">
                    <label
                      htmlFor="confirmPassword"
                      className="relative block text-sm font-medium text-gray-700"
                    >
                      Confirm Password
                      <input
                        type={passwordEye ? "text" : "password"}
                        name="confirmPassword"
                        className="flex justify-between w-full px-2 py-2 mt-1 text-sm border border-gray-300 rounded-md outline-none"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        placeholder="********"
                      />
                    </label>
                  </div>
                </div>
                {/*<---------------5--------------->*/}
                <div className="flex space-x-4">
                  <div className="flex flex-col w-1/2">
                    <label
                      htmlFor="reportedTo"
                      className="text-sm font-medium text-gray-700"
                    >
                      Reported To
                    </label>
                    <select
                      name="reportedTo"
                      className="p-2 mt-1 border border-gray-300 rounded-md"
                      value={formData?.reportedTo || ""}
                      onChange={handleChange}
                    >
                      <option value="" disabled>
                        {formData?.userName || "Select"}
                      </option>
                      {reportedTo?.map((item) => (
                        <option key={item.id} value={item.userName}>
                          {item.userName}
                        </option>
                      ))}
                    </select>
                  </div>
                  {/* -------------ROLE------------- */}

                  <div className="flex flex-col w-1/2">
                    <label
                      htmlFor="role"
                      className="text-sm font-medium text-gray-700"
                    >
                      Group Name
                    </label>
                    <select
                      name="role"
                      className="p-2 mt-1 border border-gray-300 rounded-md"
                      value={formData?.role || ""}
                      onChange={handleChange}
                    >
                      <option value={formData?.role || ""} disabled>
                        {formData?.role || "Select"}
                      </option>
                      {ROLE?.map((item, i) => (
                        <option key={i} value={item.groupName}>
                          {item.groupName}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* -------------createdDate------------- */}

                <div className="flex items-center justify-end max-w-full mb-3">
                  <button
                    type="submit"
                    className="w-full px-6 py-4 mt-4 border rounded-md border-cyan-500 text-cyan-500 hover:bg-cyan-500 hover:text-white"
                  >
                    {isEditMode ? "Update User" : "Save User"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </form>
      </>
    );
  };

  return (
    <>
      <ToastContainer />
      <div className="m-3 min-w-screen">
        {active ? (
          <>
            <div className="flex flex-wrap items-center justify-between gap-5 min-w-screen">
              <h1 className="text-3xl font-medium whitespace-nowrap">User</h1>
              <button
                onClick={handleAdd}
                className="p-2 text-sm text-white bg-blue-600 rounded min-w-10"
              >
                Add user
              </button>
            </div>
            {/*---------------------------------------------------------------- BreadCrumb PROP  ----------------------------------------------------------------*/}
            <Breadcrumb />

            <div className="flex-wrap gap-5 mt-3 overflow-x-auto shadow-md">
              <div className="min-w-full rounded-md leads_Table_Container">
                <table className="min-w-full bg-white leads_Table">
                  <thead>
                    <tr className="border-b-2 border-gray-300">
                      <th className="px-1 py-3">
                        <input type="checkbox" />
                      </th>
                      <th className="px-2 py-3 font-medium text-left border-r">
                        <div className="flex items-center justify-between text-sm">
                          <span>First Name</span>
                          <FaBars />
                        </div>
                      </th>
                      <th className="px-2 py-3 font-medium text-left border-r">
                        <div className="flex items-center justify-between text-sm">
                          <span>Last Name</span>
                          <FaBars />
                        </div>
                      </th>
                      <th className="px-2 py-3 font-medium text-left border-r">
                        <div className="flex items-center justify-between text-sm">
                          <span>Email</span>
                          <FaBars />
                        </div>
                      </th>
                      <th className="px-2 py-3 font-medium text-left border-r">
                        <div className="flex items-center justify-between text-sm">
                          <span>Contact</span>
                          <FaBars />
                        </div>
                      </th>
                      <th className="px-2 py-3 font-medium text-left border-r">
                        <div className="flex items-center justify-between text-sm">
                          <span>Country</span>
                          <FaBars />
                        </div>
                      </th>
                      <th className="px-2 py-3 font-medium text-left border-r">
                        <div className="flex items-center justify-between text-sm">
                          <span>Reported To</span>
                          <FaBars />
                        </div>
                      </th>
                      <th className="px-2 py-3 font-medium text-left border-r">
                        <div className="flex items-center justify-between text-sm">
                          <span>Role</span>
                          <FaBars />
                        </div>
                      </th>
                      <th className="px-2 py-3 font-medium text-left border-r">
                        <div className="flex items-center justify-between text-sm">
                          <span>Created Date</span>
                          <FaBars />
                        </div>
                      </th>
                      <th className="px-2 py-3 font-medium text-left border-r">
                        <div className="flex items-center justify-between text-sm">
                          <span>Direct Login</span>
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
                    {data.map((data, i) => (
                      <tr
                        key={data.i}
                        className="border-b border-gray-300 cursor-pointer hover:bg-gray-200"
                      >
                        <td className="px-1 py-3 text-center">
                          <input type="checkbox" />
                        </td>
                        <td className="px-2 py-4 text-sm break-words max-w-24">
                          {data.firstName}
                        </td>
                        <td className="px-1 text-sm break-words min-w-20 max-w-20">
                          {data.lastName}
                        </td>
                        <td className="px-2 py-4 text-sm break-words max-w-24">
                          {data.email}
                        </td>
                        <td className="px-2 py-4 text-sm break-words max-w-24">
                          <a
                            href={`tel:${data.contactNo}`}
                            onClick={(event) => event.stopPropagation()}
                          >
                            {data.contactNo}
                          </a>
                        </td>
                        <td className="px-2 py-4 text-sm break-words max-w-24">
                          {data.country}
                        </td>
                        <td className="px-2 py-4 text-sm break-words max-w-24">
                          {data.reportedTo}
                        </td>
                        <td className="px-2 py-4 text-sm break-words max-w-24">
                          {data.role}
                        </td>

                        <td className="px-2 py-4 text-sm break-words max-w-24">
                          {data?.createdDate?.split("T")[0] || ""}
                        </td>

                        <td className="text-center">
                          <div
                            onClick={() => handleLoginUser(user)}
                            className="p-2 text-sm text-white bg-blue-600 rounded min-w-10"
                          >
                            Login As
                          </div>
                        </td>

                        <td className="flex justify-center gap-3 px-2 py-4">
                          <MdEdit
                            size={25}
                            color="white"
                            className="bg-blue-500 rounded"
                            onClick={() => handleEdit(data)}
                          />
                          <RiDeleteBin6Fill
                            size={25}
                            color="red"
                            onClick={() => handleDelete(data.userId)}
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
          <EditForm data={selectedData} isEditMode={isEditMode} />
        )}
      </div>
    </>
  );
}
