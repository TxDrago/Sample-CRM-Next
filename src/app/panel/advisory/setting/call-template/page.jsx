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
import { showErrorToast } from "@/utils/toastNotifications";

export default function CallTemplate() {
  const name = getHostnamePart();
  const bearer_token = localStorage.getItem("token");

  const [data, setData] = useState([]);
  const [active, setActive] = useState(true);
  const [selectedData, setSelectedData] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);

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
        `${protocal_url}${name}.${tenant_base_url}/Admin/emailtemplates/getall`,
        config,
      );
      setData(response.data.data);
    } catch (error) {
      console.error("Error fetching leads:", error);
    }
  }

  useEffect(() => {
    handleLead(); // Fetch the  list on initial load
  }, []);

  // Delete  by ID
  const handleDelete = async (id) => {
    const bearer_token = localStorage.getItem("token");
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${bearer_token}`,
        },
      };
      await axios.delete(
        `${protocal_url}${name}.${tenant_base_url}/Admin/emailtemplates/delete/${id}`,
        config,
      );
      setData((prevData) => prevData.filter((item) => item.id !== id));
      alert("Deleted successfully");
    } catch (error) {
      console.log(error);
      alert("Failed to delete. Please try again.");
    }
  };

  // Handle switching to the form for adding or editing
  const handleEdit = (data) => {
    setSelectedData(data);
    setActive(false);
    setIsEditMode(true);
  };

  const handleAdd = () => {
    setSelectedData({ templateDescription: "" });
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

    try {
      if (isEditMode) {
        if (!formData.templateDescription) {
          showErrorToast("Please fill field");
          return;
        }
        await axios.put(
          `${protocal_url}${name}.${tenant_base_url}/Admin/emailtemplates/edit/${formData.id}`,
          formData,
          config,
        );
        alert("Updated successfully");
      } else {
        if (!formData.templateDescription) {
          showErrorToast("Please fill field ");
          return;
        }
        await axios.post(
          `${protocal_url}${name}.${tenant_base_url}/Admin/emailtemplates/add`,
          formData,
          config,
        );
        alert("Added successfully");
      }

      handleLead(); // Refresh the list
      setActive(true); // Switch back to the list view
      setSelectedData(null); // Reset the selected
      setIsEditMode(false); // Reset edit mode
    } catch (error) {
      console.error("Error saving name", error);
      alert("Failed to save . Please try again.");
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
      id: "",
      templateDescription: "",
    });

    useEffect(() => {
      setFormData(data || { id: "", templateDescription: "" });
    }, [data]);

    // Handle form input changes
    const handleChange = (e) => {
      setFormData({
        ...formData,
        templateDescription: e.target.value,
      });
    };

    const handleSubmit = (e) => {
      e.preventDefault();
      handleFormSubmit(formData);
    };

    return (
      <div>
        <div className="min-w-screen flex items-center justify-between">
          <h1 className="text-3xl font-medium">
            {isEditMode ? "Edit" : "Add"}
          </h1>
          <button
            onClick={handleCancel}
            className="min-w-10 rounded border border-blue-600 bg-white px-4 py-2 text-sm text-blue-600"
          >
            Cancel
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex">
          <div className="w-full">
            <div className="mt-3 flex-grow rounded-xl bg-white shadow-md">
              <h2 className="rounded-t-xl bg-cyan-500 px-4 py-2 font-medium text-white">
                Call Templates
              </h2>
              <div className="relative min-h-screen px-4 py-2">
                <div className="flex space-x-4">
                  <div className="flex w-1/2 flex-col">
                    <label
                      htmlFor="templateDescription"
                      className="text-sm font-medium text-gray-700"
                    >
                      Call Templates
                    </label>
                    <input
                      type="text"
                      name="templateDescription"
                      value={formData.templateDescription || ""}
                      onChange={handleChange}
                      className="mt-1 rounded-md border border-gray-300 p-2"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="absolute top-[200px] mt-4 rounded-md border border-cyan-500 px-4 py-4 text-cyan-500 hover:bg-cyan-500 hover:text-white"
                >
                  {isEditMode ? "Update" : "Save"}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    );
  };

  return (
    <div className="min-w-screen m-3">
      {active ? (
        <>
          <div className="min-w-screen flex items-center justify-between">
            <h1 className="text-3xl font-medium">Call Template</h1>
            <button
              onClick={handleAdd}
              className="min-w-10 rounded bg-blue-600 p-2 text-sm text-white"
            >
              Add call Template
            </button>
          </div>
          <div className="mt-3 overflow-x-auto">
            <div className="min-w-full overflow-hidden rounded-md">
              <table className="min-w-full bg-white">
                <thead>
                  <tr className="border-b-2 border-gray-300">
                    <th className="px-1 py-3">
                      <input type="checkbox" />
                    </th>
                    <th className="border-r px-2 py-3 text-left font-medium">
                      <div className="flex items-center justify-between text-sm">
                        <span>call Template</span>
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
                  {data.map((data) => (
                    <tr
                      key={data.id}
                      className="cursor-pointer border-b border-gray-300 hover:bg-gray-200"
                    >
                      <td className="px-1 py-3 text-center">
                        <input type="checkbox" />
                      </td>
                      <td className="max-w-24 break-words px-2 py-4 text-sm">
                        {data.templateDescription}
                      </td>
                      <td className="flex justify-center gap-3 px-2 py-4">
                        <MdEdit
                          size={25}
                          color="white"
                          className="rounded bg-blue-500"
                          onClick={() => handleEdit(data)}
                        />
                        <RiDeleteBin6Fill
                          size={25}
                          color="red"
                          onClick={() => handleDelete(data.id)}
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
