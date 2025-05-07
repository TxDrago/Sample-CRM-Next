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

export default function SMSSetting() {
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
        `${protocal_url}${name}.${tenant_base_url}/Admin/smssetting/getall`,
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
        `${protocal_url}${name}.${tenant_base_url}/Admin/smssetting/delete/${id}`,
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
      senderId: "",
      apiKey: "",
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
      senderId: formData.senderId,
      apiKey: formData.apiKey,
    };

    const formData_PUT = {
      id: formData.id,
      senderId: formData.senderId,
      apiKey: formData.apiKey,
    };

    if (!formData_POST.senderId) {
      showErrorToast("Please enter sender ID");
      return;
    }
    if (!formData_POST.apiKey) {
      showErrorToast("Please enter API key");
      return;
    }

    try {
      if (isEditMode) {
        await axios.put(
          `${protocal_url}${name}.${tenant_base_url}/Admin/smssetting/edit/${formData.id}`,
          formData_PUT,
          config,
        );
        showSuccessToast("Updated successfully");
      } else {
        await axios.post(
          `${protocal_url}${name}.${tenant_base_url}/Admin/smssetting/add`,
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
      senderId: "",
      apiKey: "",
    });

    useEffect(() => {
      setFormData(
        data || {
          id: "",
          senderId: "",
          apiKey: "",
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
            {isEditMode ? "Edit SMS Setting" : "Add SMS Setting"}
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
                  SMS Setting
                </h1>
                <div className="rounded-b-xl bg-white px-1">
                  <div className="grid gap-2 p-2">
                    {/* FIRST ROW */}
                    <div className="flex space-x-4">
                      {/* LEAD ID FIELD */}
                      <div className="flex w-1/2 flex-col">
                        <label
                          htmlFor="senderId"
                          className="text-sm font-medium text-gray-700"
                        >
                          Sender ID
                        </label>
                        <input
                          type="text"
                          name="senderId"
                          id="senderId"
                          value={formData.senderId}
                          className="mt-1 rounded-md border border-gray-300 p-2"
                          onChange={handleChange}
                          placeholder="Enter API Sender Id"
                        />
                      </div>
                      {/* CLIENT NAME FIELD */}

                      <div className="flex w-1/2 flex-col">
                        <label
                          htmlFor="apiKey"
                          className="text-sm font-medium text-gray-700"
                        >
                          API Key
                        </label>
                        <input
                          type="text"
                          name="apiKey"
                          id="apiKey"
                          value={formData.apiKey}
                          className="mt-1 rounded-md border border-gray-300 p-2"
                          onChange={handleChange}
                          placeholder="Enter API Key"
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
            <h1 className="text-3xl font-medium">SMS Setting</h1>
            <button
              onClick={handleAdd}
              className="min-w-10 rounded bg-blue-600 p-2 text-sm text-white"
            >
              Add SMS Setting
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
                        <span>API Sender ID</span>
                        <FaBars />
                      </div>
                    </th>

                    <th className="px-2 py-3 text-left font-medium">
                      <div className="flex items-center justify-between text-sm">
                        <span>API Key</span>
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
                      <td className="px-2 py-3 text-sm">{item.senderId}</td>
                      <td className="px-2 py-3 text-sm">{item.apiKey}</td>
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
