"use client";

//react

import { useState, useEffect } from "react";
import { FaBars } from "react-icons/fa";
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

export default function EmailSetting() {
  const name = getHostnamePart();
  const bearer_token = localStorage.getItem("token");

  const [data, setData] = useState([]);
  const [active, setActive] = useState(true);
  const [selectedData, setSelectedData] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);

  // Fetch all data
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
        `${protocal_url}${name}.${tenant_base_url}/Admin/emailsetting/getall`,
        config,
      );
      setData(response.data.data);
    } catch (error) {
      showErrorToast(error.response.data.message);
    }
  }

  useEffect(() => {
    handleLead(); // Fetch the list on initial load
  }, []);

  // Delete smssetting by ID
  //-------------------Delete-------------------Delete-------------------Delete-------------------Delete-------------------
  const handleDelete = async (id) => {
    const bearer_token = localStorage.getItem("token");
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${bearer_token}`,
        },
      };
      await axios.delete(
        `${protocal_url}${name}.${tenant_base_url}/Admin/emailsetting/delete/${id}`,
        config,
      );
      showSuccessToast("Deleted successfully");
      setData((prevData) => prevData.filter((item) => item.id !== id));
    } catch (error) {
      showErrorToast(error.response.data.message);
    }
  };

  // Switch to edit form
  const handleEdit = (data) => {
    setSelectedData(data);
    setActive(false);
    setIsEditMode(true);
  };

  const handleAdd = () => {
    setSelectedData({
      id: "",
      senderEmailId: "",
      relayServerName: "",
      relayPortNo: "",
      serveremail: "",
      key: "",
    });
    setActive(false);
    setIsEditMode(false);
  };

  // Handle form submission callback
  const handleFormSubmit = async (formData) => {
    const bearer_token = localStorage.getItem("token");
    const config = {
      headers: {
        Authorization: `Bearer ${bearer_token}`,
      },
    };

    const formData_POST = {
      senderEmailId: formData.senderEmailId,
      relayServerName: formData.relayServerName,
      relayPortNo: formData.relayPortNo,
      serveremail: formData.serveremail,
      key: formData.key,
    };

    const formData_PUT = {
      id: formData.id,
      senderEmailId: formData.senderEmailId,
      relayServerName: formData.relayServerName,
      relayPortNo: formData.relayPortNo,
      serveremail: formData.serveremail,
      key: formData.key,
    };

    try {
      if (isEditMode) {
        await axios.put(
          `${protocal_url}${name}.${tenant_base_url}/Admin/emailsetting/edit/${formData.id}`,
          formData_PUT,
          config,
        );
        showSuccessToast("Updated successfully");
      } else {
        await axios.post(
          `${protocal_url}${name}.${tenant_base_url}/Admin/emailsetting/add`,
          formData_POST,
          config,
        );
        showSuccessToast("Added successfully");
      }

      handleLead(); // Refresh the list
      setActive(true); // Switch back to the list view
      setSelectedData(null); // Reset the selected
      setIsEditMode(false); // Reset edit mode
    } catch (error) {
      showErrorToast(error.response.data.message);
    }
  };

  // Handle cancel action
  const handleCancel = () => {
    setActive(true);
    setSelectedData(null);
    setIsEditMode(false);
  };

  // Form Component for Adding/Updating
  const EditForm = ({ data, isEditMode }) => {
    const [formData, setFormData] = useState({
      id: "",
      senderEmailId: "",
      relayServerName: "",
      relayPortNo: "",
      serveremail: "",
      key: "",
    });

    useEffect(() => {
      setFormData(
        data || {
          id: "",
          senderEmailId: "",
          relayServerName: "",
          relayPortNo: "",
          serveremail: "",
          key: "",
        },
      );
    }, [data]);

    // Handle form input changes
    const handleChange = (e) => {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value,
      });
    };

    const handleSubmit = (e) => {
      e.preventDefault(); // Prevent default form submission
      handleFormSubmit(formData); // Call to submit the form data
    };

    return (
      <>
        <ToastContainer />
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-medium">
            {isEditMode ? "Edit Email Setting" : "Add Email Setting"}
          </h1>
          <button
            onClick={handleCancel}
            className="rounded border border-blue-600 bg-white px-4 py-1.5 text-blue-600"
          >
            Cancel
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-3 flex">
          <div className="w-full">
            <div className="rounded-xl bg-white pb-6 shadow-md">
              <div className="">
                <h1 className="text-md rounded-t-lg bg-cyan-500 px-3 py-2 font-medium text-white">
                  Email Setting
                </h1>
                <div className="rounded-b-xl bg-white px-1">
                  <div className="grid gap-2 p-2">
                    {/* FIRST ROW  */}
                    <div className="flex space-x-4">
                      {/*  Sender Email Id FIELD */}
                      <div className="flex w-1/2 flex-col">
                        <label
                          htmlFor="senderEmailId"
                          className="text-sm font-medium text-gray-700"
                        >
                          Sender Email Id
                        </label>
                        <input
                          type="email"
                          name="senderEmailId"
                          id="senderEmailId"
                          value={formData.senderEmailId}
                          className="mt-1 rounded-md border border-gray-300 p-2"
                          onChange={handleChange}
                          placeholder="Enter API Sender Id"
                        />
                      </div>
                      {/* Relay Server Name FIELD */}
                      <div className="flex w-1/2 flex-col">
                        <label
                          htmlFor="relayServerName"
                          className="text-sm font-medium text-gray-700"
                        >
                          Relay Server Name
                        </label>
                        <input
                          type="text"
                          name="relayServerName"
                          id="relayServerName"
                          value={formData.relayServerName}
                          className="mt-1 rounded-md border border-gray-300 p-2"
                          onChange={handleChange}
                          placeholder="Enter API Key"
                        />
                      </div>
                    </div>

                    {/* SECOND ROW  */}
                    <div className="flex space-x-4">
                      {/* Relay Port Number FIELD */}
                      <div className="flex w-1/2 flex-col">
                        <label
                          htmlFor="relayPortNo"
                          className="text-sm font-medium text-gray-700"
                        >
                          Relay Port Number
                        </label>
                        <input
                          type="text"
                          name="relayPortNo"
                          id="relayPortNo"
                          value={formData.relayPortNo}
                          className="mt-1 rounded-md border border-gray-300 p-2"
                          onChange={handleChange}
                          placeholder="Enter API Sender Id"
                        />
                      </div>
                      {/* server email FIELD */}
                      <div className="flex w-1/2 flex-col">
                        <label
                          htmlFor="serveremail"
                          className="text-sm font-medium text-gray-700"
                        >
                          Relay Server Name
                        </label>
                        <input
                          type="text"
                          name="serveremail"
                          id="serveremail"
                          value={formData.serveremail}
                          className="mt-1 rounded-md border border-gray-300 p-2"
                          onChange={handleChange}
                          placeholder="Enter Server Email"
                        />
                      </div>
                    </div>

                    {/* Third ROW   */}
                    <div className="flex space-x-4">
                      {/*   key FIELD */}
                      <div className="flex w-1/2 flex-col">
                        <label
                          htmlFor="key"
                          className="text-sm font-medium text-gray-700"
                        >
                          Key
                        </label>
                        <input
                          type="text"
                          name="key"
                          id="key"
                          value={formData.key}
                          className="mt-1 rounded-md border border-gray-300 p-2"
                          onChange={handleChange}
                          placeholder="Please enter key "
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mb-8 px-4">
                <button
                  type="submit"
                  className="mt-4 rounded-md border border-cyan-500 px-4 py-4 text-cyan-500 hover:bg-cyan-500 hover:text-white"
                  // onClick={handleLog}
                >
                  {isEditMode ? "Update" : "Save"}
                </button>
              </div>
            </div>
          </div>
        </form>
      </>
    );
  };

  return (
    <div className="m-3">
      {active ? (
        <>
          <div className="flex flex-wrap items-center justify-between gap-5">
            <h1 className="text-3xl font-medium">Email Setting</h1>
            <button
              onClick={handleAdd}
              className="min-w-10 rounded bg-blue-600 p-2 text-sm text-white"
            >
              Add Email Setting
            </button>
          </div>
          <div className="leads_Table_Main_Container mt-3 overflow-x-auto shadow-md">
            <div className="leads_Table_Container min-w-full rounded-md">
              <table className="leads_Table min-w-full rounded-md bg-white">
                <thead>
                  <tr className="border-b-2 border-gray-300">
                    <th className="px-1 py-3">
                      <input type="checkbox" />
                    </th>
                    <th className="px-2 py-3 text-left font-medium">
                      <div className="flex items-center justify-between text-sm">
                        <span>Sender Email</span>
                        <FaBars />
                      </div>
                    </th>

                    <th className="px-2 py-3 text-left font-medium">
                      <div className="flex items-center justify-between text-sm">
                        <span>Relay Server Name</span>
                        <FaBars />
                      </div>
                    </th>
                    <th className="px-2 py-3 text-left font-medium">
                      <div className="flex items-center justify-between text-sm">
                        <span>Relay Port No</span>
                        <FaBars />
                      </div>
                    </th>
                    <th className="px-2 py-3 text-left font-medium">
                      <div className="flex items-center justify-between text-sm">
                        <span>Server Email</span>
                        <FaBars />
                      </div>
                    </th>
                    <th className="px-2 py-3 text-left font-medium">
                      <div className="flex items-center justify-between text-sm">
                        <span>Key</span>
                        <FaBars />
                      </div>
                    </th>

                    <th className="px-2 py-3 text-left font-medium">
                      <div className="flex items-center justify-between text-sm">
                        <span>Action</span>
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((item) => (
                    <tr
                      key={item.id}
                      className="cursor-pointer border-b border-gray-300 hover:bg-gray-200"
                    >
                      <td className="px-1 py-3 text-center">
                        <input type="checkbox" />
                      </td>
                      <td className="px-2 py-3 text-sm">
                        {item.senderEmailId}
                      </td>
                      <td className="px-2 py-3 text-sm">
                        {item.relayServerName}
                      </td>
                      <td className="px-2 py-3 text-sm">{item.relayPortNo}</td>
                      <td className="px-2 py-3 text-sm">{item.serveremail}</td>
                      <td className="px-2 py-3 text-sm">{item.key}</td>
                      <td className="flex justify-center gap-3 px-2 py-4">
                        <MdEdit
                          size={25}
                          className="rounded bg-blue-500 text-white"
                          onClick={() => handleEdit(item)}
                        />
                        <RiDeleteBin6Fill
                          size={25}
                          color="red"
                          onClick={() => handleDelete(item.id)}
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
  );
}
