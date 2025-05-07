"use client";


import { useState, useEffect } from "react";
import { FaBars } from "react-icons/fa";
import { FaAngleDown } from "react-icons/fa";
import { MdEdit } from "react-icons/md";
import { RiDeleteBin6Fill } from "react-icons/ri";
import axios from "axios";
import { tenant_base_url, protocal_url } from "@/Config/Config";

import { getHostnamePart } from "@/components/GlobalHostUrl";
import { ToastContainer } from "react-toastify";
import {
  showErrorToast,
  showSuccessToast,
} from "@/utils/toastNotifications";

export default function AccessDevice() {
  const [data, setData] = useState([]);
  const [activeComponent, setActiveComponent] = useState("Table");

  const name = getHostnamePart();
  const [idGet, setIdGet] = useState("");

  // -------------------Fetch All Access Devices---------------------
  async function handleLead() {
    const bearer_token = localStorage.getItem("token");
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${bearer_token}`,
        },
      };
      const response = await axios.get(
        `${protocal_url}${name}.${tenant_base_url}/Setting/getAllAccessDevices`,
        config,
      );
      setData(response.data.data);
    } catch (error) {
      showErrorToast(error.response.data.message);
    }
  }

  useEffect(() => {
    handleLead(); // Fetch the pools list on initial load
  }, []);

  // ------------------Delete Access Devices By ID---------------------
  const handleDelete = async (id) => {
    const bearer_token = localStorage.getItem("token");
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${bearer_token}`,
        },
      };
      await axios.delete(
        `${protocal_url}${name}.${tenant_base_url}/Setting/deleteAccessDevice/${id}`,
        config,
      );
      setData((prevData) => prevData.filter((item) => item.id !== id));
      showSuccessToast("Deleted Successfully");
    } catch (error) {
      showErrorToast(error.response.data.message);
    }
  };

  // Handle cancel form action
  const handleCancel = () => {
    setActiveComponent("Table");
  };

  const handleAdd = () => {
    setActiveComponent("Add");
  };

  const handleEdit = (id) => {
    setActiveComponent("Update");
    setIdGet(id);
  };

  //------------------------------ Access Device Table Component ---------------------------

  const AccessDeviceTable = () => {
    return (
      <>
        <ToastContainer />
        <div className="min-w-screen m-3">
          <div className="min-w-screen flex flex-wrap items-center justify-between gap-5">
            <h1 className="text-3xl font-medium">Access Device</h1>
            <button
              onClick={handleAdd}
              className="min-w-10 rounded bg-blue-600 p-2 text-sm text-white"
            >
              Add Access Device
            </button>
          </div>
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
                        <span>User ID</span>
                        <FaBars />
                      </div>
                    </th>
                    <th className="border-r px-2 py-3 text-left font-medium">
                      <div className="flex items-center justify-between text-sm">
                        <span>User Name</span>
                        <FaBars />
                      </div>
                    </th>
                    <th className="border-r px-2 py-3 text-left font-medium">
                      <div className="flex items-center justify-between text-sm">
                        <span>Device Type</span>
                        <FaBars />
                      </div>
                    </th>
                    <th className="border-r px-2 py-3 text-left font-medium">
                      <div className="flex items-center justify-between text-sm">
                        <span>Device Address</span>
                        <FaBars />
                      </div>
                    </th>
                    <th className="border-r px-2 py-3 text-left font-medium">
                      <div className="flex items-center justify-between text-sm">
                        <span>Device Token</span>
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
                  {data.map((device) => (
                    <tr
                      key={device.id}
                      className="cursor-pointer border-b border-gray-300 hover:bg-gray-200"
                    >
                      <td className="px-1 py-3 text-center">
                        <input type="checkbox" />
                      </td>
                      <td className="max-w-24 break-words px-2 py-4 text-sm">
                        {device.userId}
                      </td>
                      <td className="max-w-24 break-words px-2 py-4 text-sm">
                        {device.userName}
                      </td>
                      <td className="max-w-24 break-words px-2 py-4 text-sm">
                        {device.deviceType}
                      </td>
                      <td className="max-w-24 break-words px-2 py-4 text-sm">
                        {device.deviceAddress}
                      </td>
                      <td className="max-w-24 break-words px-2 py-4 text-sm">
                        {device.deviceToken}
                      </td>
                      <td className="flex justify-center gap-3 px-2 py-4">
                        <MdEdit
                          size={25}
                          color="white"
                          className="rounded bg-blue-500"
                          onClick={() => handleEdit(device.id)}
                        />
                        <RiDeleteBin6Fill
                          size={25}
                          color="red"
                          onClick={() => handleDelete(device.id)}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </>
    );
  };

  //------------------------------ADD Access Device Component ---------------------------

  const AccessDeviceAdd = () => {
    const [addDevice, setAddDevice] = useState({
      userId: "",
      userName: "",
      deviceType: "",
      deviceToken: "",
      deviceAddress: "",
    });

    //----------------------------------------------------------------------------------------
    //Status_ToDropDown
    const [statusToDropDown, setStatusToDropDown] = useState([]);
    const [defaultTextStatus, setDefaultTextStatus] = useState(
      "Select User Name...",
    );
    const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);
    const [errorStatus, setStatusError] = useState(null); // New error state

    const handleStatus = async () => {
      const bearerToken = localStorage.getItem("token");
      const config = {
        headers: {
          Authorization: `Bearer ${bearerToken}`,
        },
      };

      try {
        const response = await axios.get(
          `${protocal_url}${name}.${tenant_base_url}/Setting/users/byusertoken`,
          config,
        );
        setStatusToDropDown(response.data.data);
        console.log("status:", response.data.data);
      } catch (error) {
        console.error("Error fetching leads:", errorStatus);
        console.error("Error fetching leads:", error);
        setStatusError("Failed to fetch pools.");
      }
    };

    useEffect(() => {
      handleStatus();
    }, []);

    const toggleStatusDropdown = () => {
      setIsStatusDropdownOpen((prev) => !prev);
    };

    const handleDropdownStatusSelection = (device) => {
      setIsStatusDropdownOpen(false);
      setDefaultTextStatus(device.userName);
      setAddDevice((prev) => ({
        ...prev,
        userName: device.firstName,
        userId: device.userId,
      }));
    };

    // Handle input changes
    const handleChange = (e) => {
      const { name, value } = e.target;
      setAddDevice((prevDevice) => ({
        ...prevDevice,
        [name]: value,
      }));
    };

    // Handle form submission
    const handleSubmit = async (event) => {
      event.preventDefault();
      const bearer_token = localStorage.getItem("token");

      try {
        const config = {
          headers: {
            Authorization: `Bearer ${bearer_token}`,
            "Content-Type": "application/json",
          },
        };

        if (!addDevice.userName) {
          showErrorToast("Please select user");
          return;
        }
        if (!addDevice.deviceType) {
          showErrorToast("Please enter device type");
          return;
        }
        if (!addDevice.deviceToken) {
          showErrorToast("Please enter device token");
          return;
        }
        if (!addDevice.deviceAddress) {
          showErrorToast("Please enter device address");
          return;
        }

        await axios.post(
          `${protocal_url}${name}.${tenant_base_url}/Setting/addAccessDevice`,
          addDevice,
          config,
        );
        showSuccessToast("Access Device Added Sucessfully");
        window.location.reload();
      } catch (error) {
        showErrorToast(error.response.data.message);
      }
    };

    return (
      <>
        <ToastContainer />
        <div className="m-3 flex flex-col overflow-x-auto overflow-y-hidden">
          <div className="flex items-center justify-between rounded-md bg-white px-2 py-2 shadow-md">
            <h1 className="text-xl">Add Access Device</h1>
            <div
              onClick={handleCancel}
              className="mx-3 rounded border border-blue-500 px-4 py-1 text-blue-500"
            >
              Cancel
            </div>
          </div>
          <div className="overflow-hidden shadow-md">
            <div className="mt-3 rounded-t-xl bg-cyan-500 px-6 py-2">
              <h1 className="text-white">Access Device Information</h1>
            </div>
            {/* CREATE DEVICE FORM */}
            <form onSubmit={handleSubmit}>
              <div className="grid gap-2 rounded-b-xl bg-white px-3 py-2">
                <div className="flex space-x-4">
                  {/* Left Column */}
                  <div className="relative flex w-1/2 flex-col">
                    {/* User Name */}
                    <label
                      htmlFor="Pool"
                      className="text-sm font-medium text-gray-700"
                    >
                      Status
                    </label>
                    <div
                      className="relative"
                      onMouseLeave={() => setIsStatusDropdownOpen(false)}
                    >
                      <button
                        onClick={toggleStatusDropdown}
                        className="mt-1 flex w-full items-center justify-between rounded-md border border-gray-300 p-2"
                        id="LeadStatusDropDown"
                        type="button"
                      >
                        {addDevice.userName === ""
                          ? defaultTextStatus
                          : addDevice.userName}
                        <FaAngleDown className="ml-2 text-gray-400" />
                      </button>
                      {isStatusDropdownOpen && (
                        <div className="absolute top-11 z-10 h-44 w-full overflow-scroll rounded-md border border-gray-300 bg-white">
                          {errorStatus ? (
                            <div className="py-2 text-red-600">
                              {errorStatus}
                            </div>
                          ) : (
                            <ul className="py-2 text-sm text-gray-700">
                              {statusToDropDown.map((device) => (
                                <li
                                  key={device.id}
                                  onClick={() =>
                                    handleDropdownStatusSelection(device)
                                  }
                                  className="block cursor-pointer border-b px-4 py-2 hover:bg-cyan-500 hover:text-white"
                                >
                                  {device.firstName}
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Device Type */}
                  <div className="flex w-1/2 flex-col">
                    <label
                      htmlFor="deviceType"
                      className="text-sm font-medium text-gray-700"
                    >
                      Device Type
                    </label>
                    <input
                      type="text"
                      name="deviceType"
                      value={addDevice.deviceType}
                      className="mt-1 rounded-md border border-gray-300 p-2"
                      onChange={handleChange}
                      placeholder="Enter device type"
                    />
                  </div>
                </div>

                <div className="flex space-x-4">
                  {/* Device Token */}
                  <div className="flex w-1/2 flex-col">
                    <label
                      htmlFor="deviceToken"
                      className="text-sm font-medium text-gray-700"
                    >
                      Device Token
                    </label>
                    <input
                      type="text"
                      name="deviceToken"
                      value={addDevice.deviceToken}
                      className="mt-1 rounded-md border border-gray-300 p-2"
                      onChange={handleChange}
                      placeholder="Enter device token"
                    />
                  </div>
                  {/* User ID */}
                  <div className="flex w-1/2 flex-col">
                    <label
                      htmlFor="userId"
                      className="text-sm font-medium text-gray-700"
                    >
                      User ID
                    </label>
                    <input
                      disabled
                      type="text"
                      name="userId"
                      value={addDevice.userId}
                      className="mt-1 rounded-md border border-gray-300 p-2"
                      onChange={handleChange}
                      placeholder="Enter user ID"
                    />
                  </div>
                </div>

                {/* Right Column */}
                <div className="flex space-x-4">
                  {/* Device Address */}
                  <div className="flex w-1/2 flex-col">
                    <label
                      htmlFor="deviceAddress"
                      className="text-sm font-medium text-gray-700"
                    >
                      Device Address
                    </label>
                    <input
                      type="text"
                      name="deviceAddress"
                      value={addDevice.deviceAddress}
                      className="mt-1 rounded-md border border-gray-300 p-2"
                      onChange={handleChange}
                      placeholder="Enter device address"
                    />
                  </div>
                </div>

                <div className="mb-8 mt-3 flex justify-start">
                  <button
                    type="submit"
                    className="mt-4 rounded-md border border-cyan-500 px-4 py-4 text-cyan-500 hover:bg-cyan-500 hover:text-white"
                  >
                    Save
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </>
    );
  };

  //------------------------------UpDate Access Device Component ---------------------------

  const AccessDeviceUpdate = () => {
    const [addDevice, setAddDevice] = useState({
      id: "",
      userId: "",
      userName: "",
      deviceType: "",
      deviceAddress: "",
      deviceToken: "",
    });

    const [statusToDropDown, setStatusToDropDown] = useState([]);
    const [defaultTextStatus, setDefaultTextStatus] = useState(
      "Select User Name...",
    );
    const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);
    const [errorStatus, setStatusError] = useState(null);

    // Fetch the Access Device by ID
    useEffect(() => {
      if (idGet) {
        handleDeviceId();
      }
    }, [idGet, name, protocal_url, tenant_base_url]);

    const handleDeviceId = async () => {
      const bearer_token = localStorage.getItem("token");
      const config = {
        headers: { Authorization: `Bearer ${bearer_token}` },
      };

      try {
        const response = await axios.get(
          `${protocal_url}${name}.${tenant_base_url}/Setting/getAccessDeviceById/${idGet}`,
          config,
        );
        const data = response.data.data;
        setAddDevice({
          id: data.id || "",
          userId: data.userId || "",
          userName: data.userName || "",
          deviceType: data.deviceType || "",
          deviceAddress: data.deviceAddress || "",
          deviceToken: data.deviceToken || "",
        });
      } catch (error) {
        console.error("Error fetching Access Device by ID:", error);
      }
    };

    // Fetch Users for the dropdown
    useEffect(() => {
      handleStatus();
    }, [name, protocal_url, tenant_base_url]);

    const handleStatus = async () => {
      const bearerToken = localStorage.getItem("token");
      const config = {
        headers: { Authorization: `Bearer ${bearerToken}` },
      };

      try {
        const response = await axios.get(
          `${protocal_url}${name}.${tenant_base_url}/Setting/users/byusertoken`,
          config,
        );
        setStatusToDropDown(response.data.data);
      } catch (error) {
        console.error("Error fetching users:", error);
        setStatusError("Failed to fetch users.");
      }
    };

    const toggleStatusDropdown = () => {
      setIsStatusDropdownOpen((prev) => !prev);
    };

    const handleDropdownStatusSelection = (device) => {
      setIsStatusDropdownOpen(false);
      setDefaultTextStatus(device.userName);
      setAddDevice((prev) => ({
        ...prev,
        userName: device.firstName,
        userId: device.userId,
      }));
    };

    const handleChange = (e) => {
      const { name, value } = e.target;
      setAddDevice((prevDevice) => ({
        ...prevDevice,
        [name]: value,
      }));
    };

    const handleSubmit = async (event) => {
      event.preventDefault();
      const bearer_token = localStorage.getItem("token");

      try {
        const config = {
          headers: {
            Authorization: `Bearer ${bearer_token}`,
            "Content-Type": "application/json",
          },
        };
        const formData_PUT = {
          // id: addDevice.id,
          userId: addDevice.userId,
          userName: addDevice.userName,
          deviceType: addDevice.deviceType,
          deviceAddress: addDevice.deviceAddress,
          deviceToken: addDevice.deviceToken,
        };
        await axios.put(
          `${protocal_url}${name}.${tenant_base_url}/Setting/updateAccessDevice/${idGet}`,
          formData_PUT,
          config,
        );
        showSuccessToast("Access Device updated successfully!");
        window.location.reload();
      } catch (error) {
        console.error("Error updating Access Device:", error);
        alert("An error occurred. Please try again.");
      }
    };

    return (
      <>
        <ToastContainer />
        <div className="m-3 flex flex-col overflow-x-auto overflow-y-hidden">
          <div className="flex items-center justify-between rounded-md bg-white px-2 py-2 shadow-md">
            <h1 className="text-xl">Update Access Device</h1>
            <div
              onClick={handleCancel}
              className="mx-3 rounded border border-blue-500 px-4 py-1 text-blue-500"
            >
              Cancel
            </div>
          </div>
          <div className="overflow-hidden shadow-md">
            <div className="mt-3 rounded-t-xl bg-cyan-500 px-6 py-2">
              <h1 className="text-white">Access Device Information</h1>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="flex flex-col rounded-b-xl bg-white px-4 py-2">
                <div className="flex gap-4">
                  {/* Left Column */}
                  <div className="flex flex-1 flex-col">
                    <label
                      htmlFor="Pool"
                      className="text-sm font-medium text-gray-700"
                    >
                      Status
                    </label>
                    <div
                      className="relative"
                      onMouseLeave={() => setIsStatusDropdownOpen(false)}
                    >
                      <button
                        onClick={toggleStatusDropdown}
                        className="mt-1 flex w-full items-center justify-between rounded-md border border-gray-300 p-2"
                        id="LeadStatusDropDown"
                        type="button"
                      >
                        {addDevice.userName === ""
                          ? defaultTextStatus
                          : addDevice.userName}
                        <FaAngleDown className="ml-2 text-gray-400" />
                      </button>
                      {isStatusDropdownOpen && (
                        <div className="absolute top-11 z-10 w-full rounded-md border border-gray-300 bg-white">
                          {errorStatus ? (
                            <div className="py-2 text-red-600">
                              {errorStatus}
                            </div>
                          ) : (
                            <ul className="py-2 text-sm text-gray-700">
                              {statusToDropDown.map((device) => (
                                <li
                                  key={device.id}
                                  onClick={() =>
                                    handleDropdownStatusSelection(device)
                                  }
                                  className="block cursor-pointer border-b px-4 py-2 hover:bg-cyan-500 hover:text-white"
                                >
                                  {device.firstName}
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      )}
                    </div>

                    <label
                      htmlFor="deviceType"
                      className="text-sm font-medium text-gray-700"
                    >
                      Device Type
                    </label>
                    <input
                      type="text"
                      name="deviceType"
                      value={addDevice.deviceType}
                      className="mt-1 rounded-md border border-gray-300 p-2"
                      onChange={handleChange}
                      placeholder="Enter device type"
                    />

                    <label
                      htmlFor="deviceToken"
                      className="text-sm font-medium text-gray-700"
                    >
                      Device Token
                    </label>
                    <input
                      type="text"
                      name="deviceToken"
                      value={addDevice.deviceToken}
                      className="mt-1 rounded-md border border-gray-300 p-2"
                      onChange={handleChange}
                      placeholder="Enter device token"
                    />
                  </div>

                  {/* Right Column */}
                  <div className="flex flex-1 flex-col">
                    <label
                      htmlFor="userId"
                      className="text-sm font-medium text-gray-700"
                    >
                      User ID
                    </label>
                    <input
                      disabled
                      type="text"
                      name="userId"
                      value={addDevice.userId}
                      className="mt-1 rounded-md border border-gray-300 p-2"
                      onChange={handleChange}
                      placeholder="Enter user ID"
                    />

                    <label
                      htmlFor="deviceAddress"
                      className="text-sm font-medium text-gray-700"
                    >
                      Device Address
                    </label>
                    <input
                      type="text"
                      name="deviceAddress"
                      value={addDevice.deviceAddress}
                      className="mt-1 rounded-md border border-gray-300 p-2"
                      onChange={handleChange}
                      placeholder="Enter device address"
                    />
                  </div>
                </div>

                <div className="mr-10 flex justify-end gap-5">
                  <button
                    type="submit"
                    className="mb-4 mt-40 rounded border-2 border-cyan-500 bg-cyan-500 px-32 py-4 text-white hover:bg-white hover:text-cyan-500"
                  >
                    Save
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </>
    );
  };

  return (
    <>
      {activeComponent === "Table" ? (
        <AccessDeviceTable />
      ) : activeComponent === "Add" ? (
        <AccessDeviceAdd />
      ) : activeComponent === "Update" ? (
        <AccessDeviceUpdate />
      ) : (
        ""
      )}
    </>
  );
}
