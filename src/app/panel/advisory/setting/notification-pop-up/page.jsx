"use client";

//react

import { useState, useEffect } from "react";
import { FaBars } from "react-icons/fa";
import { MdEdit } from "react-icons/md";
import { RiDeleteBin6Fill } from "react-icons/ri";
import { useParams } from "next/navigation";
import axios from "axios";
import Switch from "react-switch"; // Import react-switch
import { tenant_base_url, protocal_url } from "@/Config/Config";
import Breadcrumb from "../Breadcrumb/Breadcrumb";

export default function BranchTarget() {
  const { id } = useParams();
  const [active, setActive] = useState(true);

  //forImgUpload

  const [users, setUsers] = useState([
    {
      id: "1",
      jaisonDocument: "Verify your Account",
      popup: true, // Use true/false for toggle state
    },
    {
      id: "2",
      jaisonDocument: "Verify your Account",
      popup: false, // Another user with toggle off
    },
  ]);

  const [formData, setFormData] = useState({
    id: "",
    jaisonDocument: "",
    popup: false, // Default to false for the toggle
  });

  const [isEditMode, setIsEditMode] = useState(false);

  const handleActiveState = () => {
    setActive(!active);
    setIsEditMode(false); // Reset edit mode when switching views
    setFormData({
      id: "",
      jaisonDocument: "",
      popup: false, // Reset popup to false (disabled)
    });
  };

  const handleClick = (userId) => {
    const userToEdit = users.find((user) => user.id === userId);
    if (userToEdit) {
      setFormData({
        ...userToEdit,
        popup: userToEdit.popup, // Set initial popup state as boolean
      });
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

  const handleToggle = (checked) => {
    setFormData((prevData) => ({
      ...prevData,
      popup: checked, // Update popup state based on toggle (checked = true/false)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.jaisonDocument) {
      alert("Please fill in all fields before submitting.");
      return;
    }

    const submittedData = {
      ...formData,
      popup: formData.popup ? "enabled" : "disabled", // Convert boolean to string for submission
    };

    if (isEditMode) {
      console.log("Edit User:", submittedData);
      // Add logic to submit the edited user data
    } else {
      console.log("Add User:", submittedData);
      setActive(true); // Switch back to view mode
      // Add logic to add a new user
    }
  };

  useEffect(() => {
    // handleGroup fetch logic
  }, []);

  return (
    <>
      <div className="min-w-screen m-3">
        {active ? (
          <>
            <div className="min-w-screen flex flex-wrap items-center justify-between gap-5">
              <h1 className="text-3xl font-medium">NotificationPopup</h1>
              <button
                onClick={handleActiveState}
                className="min-w-10 rounded bg-blue-600 p-2 text-sm text-white"
              >
                Add Notification Popup
              </button>
            </div>
              {/*---------------------------------------------------------------- BreadCrumb PROP  ----------------------------------------------------------------*/}
              <Breadcrumb />
            <div className="leads_Table_Main_Container mt-3 overflow-x-auto shadow-md">
              <div className="leads_Table_Main_Container min-w-full rounded-md">
                <table className="leads_Table min-w-full bg-white">
                  <thead>
                    <tr className="border-b-2 border-gray-300">
                      <th className="px-1 py-3">
                        <input type="checkbox" />
                      </th>
                      <th className="border-r px-2 py-3 text-left font-medium">
                        <div className="flex items-center justify-between text-sm">
                          <span>Jaison Document</span>
                          <FaBars />
                        </div>
                      </th>
                      <th className="border-r px-2 py-3 text-left font-medium">
                        <div className="flex items-center justify-between text-sm">
                          <span>Popup</span>
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
                            onClick={(e) =>
                              console.log(
                                `Checkbox clicked for user: ${user.id}`,
                              )
                            }
                          />
                        </td>
                        <td className="max-w-24 break-words px-2 py-4 text-sm">
                          {user.jaisonDocument}
                        </td>
                        <td className="max-w-24 break-words px-2 py-4 text-sm">
                          <Switch
                            checked={user.popup}
                            onChange={() =>
                              console.log(`Toggle changed for user: ${user.id}`)
                            }
                            height={20}
                            width={48}
                            onColor="#86d3ff"
                            onHandleColor="#2693e6"
                            handleDiameter={30}
                            uncheckedIcon={false}
                            checkedIcon={false}
                            className="react-switch"
                          />
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
                {isEditMode
                  ? "Edit Push Notification Details"
                  : "Add Push Notification Details"}
              </h1>
              <button
                onClick={handleActiveState}
                className="min-w-10 rounded border border-blue-600 bg-white px-4 py-2 text-sm text-blue-600"
              >
                Cancel
              </button>
            </div>
            {/* Form Starts From Here -------------------------------------------> */}
            <form onSubmit={handleSubmit} className="flex">
              <div className="w-full">
                <div className="mt-3 flex-grow rounded-xl bg-white shadow-md">
                  <h2 className="rounded-t-xl bg-cyan-500 px-4 py-2 font-medium text-white">
                    Notification Details
                  </h2>
                  <div className="grid gap-2 px-4 py-2">
                    <div className="flex space-x-4">
                      <div className="flex w-1/2 flex-col">
                        <label
                          htmlFor="Token"
                          className="text-sm font-medium text-gray-700"
                        >
                          Token
                        </label>
                        <input
                          type="text"
                          name="Token"
                          value={formData.Token}
                          onChange={handleChange}
                          className="mt-1 rounded-md border border-gray-300 p-2"
                          placeholder="Please paste token here"
                        />
                      </div>

                      <div className="flex w-1/2 flex-col">
                        <label
                          htmlFor="Title"
                          className="text-sm font-medium text-gray-700"
                        >
                          Title
                        </label>
                        <input
                          type="text"
                          name="Title"
                          value={formData.Title}
                          onChange={handleChange}
                          className="mt-1 rounded-md border border-gray-300 p-2"
                          placeholder="Please paste token here"
                        />
                      </div>
                    </div>

                    <div className="flex space-x-4">
                      <div className="flex w-1/2 flex-col">
                        <label
                          htmlFor="Body"
                          className="text-sm font-medium text-gray-700"
                        >
                          Body
                        </label>
                        <input
                          type="text"
                          name="Body"
                          value={formData.Body}
                          onChange={handleChange}
                          className="mt-1 rounded-md border border-gray-300 p-2"
                          placeholder="Please paste token here"
                        />
                      </div>

                      <div className="flex w-1/2 flex-col">
                        <label
                          htmlFor="popup"
                          className="text-sm font-medium text-gray-700"
                        >
                          Popup
                        </label>
                        <Switch
                          checked={formData.popup}
                          onChange={handleToggle}
                          height={20}
                          width={48}
                          onColor="#86d3ff"
                          onHandleColor="#2693e6"
                          handleDiameter={30}
                          uncheckedIcon={false}
                          checkedIcon={false}
                          className="react-switch"
                        />
                        <span className="text-sm">
                          {formData.popup ? "Enabled" : "Disabled"}
                        </span>
                      </div>
                    </div>

                    <div className="flex space-x-4">
                      <div className="flex w-1/2 flex-col">
                        <label
                          htmlFor="img"
                          className="text-sm font-medium text-gray-700"
                        >
                          Image
                        </label>
                        <input
                          type="file"
                          name="Body"
                          value={formData.img}
                          onChange={handleChange}
                          className="mt-1 rounded-md border border-gray-300 p-2"
                          placeholder="Please paste token here"
                        />
                      </div>
                    </div>

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
