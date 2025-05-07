"use client";



import { useState } from "react";
import { FaBars } from "react-icons/fa";
import { MdEdit } from "react-icons/md";
import { RiDeleteBin6Fill } from "react-icons/ri";

export default function Alert() {
  const [activeComponent, setActiveComponent] = useState("Table");
  const [idGet, setIdGet] = useState("");

  const handleAdd = () => {
    setActiveComponent("Add");
  };

  const handleCancel = () => {
    setActiveComponent("Table");
  };

  const handleEdit = (id) => {
    setActiveComponent("Update");
    setIdGet(id);
  };

  const data = [
    {
      id: 1,
      title: "Global Hunt",
      createdBy: "12/03/2023",
      events: "Accros DU Sharing",
    },
    {
      id: 2,
      title: "Global Hunt",
      createdBy: "12/03/2023",
      events: "Accros DU Sharing",
    },
    {
      id: 3,
      title: "Global Hunt",
      createdBy: "12/03/2023",
      events: "Accros DU Sharing",
    },
    {
      id: 4,
      title: "Global Hunt",
      createdBy: "12/03/2023",
      events: "Accros DU Sharing",
    },
    {
      id: 5,
      title: "Global Hunt",
      createdBy: "12/03/2023",
      events: "Accros DU Sharing",
    },
    {
      id: 6,
      title: "Global Hunt",
      createdBy: "12/03/2023",
      events: "Accros DU Sharing",
    },
    {
      id: 7,
      title: "Global Hunt",
      createdBy: "12/03/2023",
      events: "Accros DU Sharing",
    },
    {
      id: 8,
      title: "Global Hunt",
      createdBy: "12/03/2023",
      events: "Accros DU Sharing",
    },
    {
      id: 9,
      title: "Global Hunt",
      createdBy: "12/03/2023",
      events: "Accros DU Sharing",
    },
    {
      id: 10,
      title: "Global Hunt",
      createdBy: "12/03/2023",
      events: "Accros DU Sharing",
    },
    {
      id: 11,
      title: "Global Hunt",
      createdBy: "12/03/2023",
      events: "Accros DU Sharing",
    },
  ];

  const AlertTable = () => {
    return (
      <div className="min-w-screen m-3">
        <div className="min-w-screen flex flex-wrap items-center justify-between gap-5">
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-medium">Alert</h1>
            <h2 className="text-center text-xl font-medium text-red-500">
              (This feature is coming soon...)
            </h2>
          </div>
          <button
            onClick={handleAdd}
            className="min-w-10 rounded bg-blue-600 p-2 text-sm text-white"
          >
            Add Alert
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
                      <span>Title</span>
                      <FaBars />
                    </div>
                  </th>
                  <th className="border-r px-2 py-3 text-left font-medium">
                    <div className="flex items-center justify-between text-sm">
                      <span>Created By</span>
                      <FaBars />
                    </div>
                  </th>
                  <th className="border-r px-2 py-3 text-left font-medium">
                    <div className="flex items-center justify-between text-sm">
                      <span>Events</span>
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
                      {device.title}
                    </td>
                    <td className="max-w-24 break-words px-2 py-4 text-sm">
                      {device.createdBy}
                    </td>
                    <td className="max-w-24 break-words px-2 py-4 text-sm">
                      {device.events}
                    </td>
                    <td className="flex justify-center gap-3 px-2 py-4">
                      <MdEdit
                        size={25}
                        color="white"
                        className="rounded bg-blue-500"
                        onClick={() => handleEdit(device.id)}
                      />
                      <RiDeleteBin6Fill size={25} color="red" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  const AddALert = () => {
    const [addAlert, setAddAlert] = useState({
      title: "",
      description: "",
    });

    const handleChange = (e) => {
      const { name, value } = e.target;
      setAddAlert({
        ...addAlert,
        [name]: value,
      });
    };

    const handleSubmit = (e) => {
      e.preventDefault();
    };

    const [selectedId, setSelectedId] = useState(1);

    const buttons = [
      { id: 1, text: "Web Violation" },
      { id: 2, text: "DLP Violation" },
    ];

    const handleOptionClick = (id) => {
      setSelectedId(id);
    };

    const web = [
      "Login Page",
      "Browser Restriction",
      "IP Restriction",
      "Time Restriction",
      "Geo Location",
      "Account Lock",
      "Password Change",
      "Device Request",
    ];

    const dlp = [
      "Download",
      "Dropbox Consumer Account",
      "Download Email Attachment",
      "Share",
      "Whitelist IP",
      "Print",
      "Sync Dropbox",
      "Document Delete",
      "Screen Capture",
      "Across OU",
      "Email Compliance",
      "Clipboard",
      "Containerize Email",
      "Containerize Drive",
      "Github Account Violation",
    ];

    return (
      <div className="m-3 flex flex-col overflow-x-auto overflow-y-hidden">
        <div className="flex items-center justify-between rounded-md bg-white px-2 py-2 shadow-md">
          <h1 className="text-xl">Add Alert</h1>
          <div
            onClick={handleCancel}
            className="mx-3 rounded border border-blue-500 px-4 py-1 text-blue-500"
          >
            Cancel
          </div>
        </div>
        <div className="overflow-hidden shadow-md">
          <div className="mt-3 rounded-t-xl bg-cyan-500 px-3 py-2">
            <h1 className="text-white">Alert Details</h1>
          </div>
          {/* CREATE DLP FORM */}
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col rounded-b-xl bg-white px-4 py-2">
              <div className="flex gap-4">
                <div className="grid w-full gap-2 pb-3">
                  <div className="flex space-x-4">
                    {/* TITLE */}
                    <div className="flex w-1/2 flex-col">
                      <label
                        htmlFor="title"
                        className="text-sm font-medium text-gray-700"
                      >
                        Title
                      </label>
                      <input
                        type="text"
                        name="title"
                        value={addAlert.title}
                        className="mt-1 rounded-md border border-gray-300 p-2"
                        onChange={handleChange}
                        placeholder="Enter device type"
                      />
                    </div>
                    <div className="flex w-1/2 flex-col">
                      {/* DESCRIPTION */}
                      <label
                        htmlFor="description"
                        className="text-sm font-medium text-gray-700"
                      >
                        Description
                      </label>
                      <input
                        type="text"
                        name="description"
                        value={addAlert.description}
                        className="mt-1 rounded-md border border-gray-300 p-2"
                        onChange={handleChange}
                        placeholder="Enter device type"
                      />
                    </div>
                  </div>
                  {/* SECOND */}
                  <div className="flex space-x-4">
                    {/* Enabled */}
                    <div className="w1/2 flex flex-col items-start justify-start gap-1">
                      <label
                        htmlFor="enabled"
                        className="text-sm font-medium text-gray-700"
                      >
                        Enabled
                      </label>
                      <input
                        type="checkbox"
                        name="enabled"
                        className="flex h-5 w-5 justify-start px-1 py-1"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-5">
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="mb-4 mt-20 rounded border-2 border-cyan-500 bg-cyan-500 px-32 py-4 text-white hover:bg-white hover:text-cyan-500"
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
            {/* SECOND SECTION */}
            <div className="mt-3 flex gap-3">
              <h1 className="text-2xl font-medium">Events</h1>
              {buttons.map(({ id, text }) => (
                <button
                  key={id}
                  onClick={() => handleOptionClick(id)}
                  className={`text-md rounded px-3 py-2 font-light ${
                    selectedId === id
                      ? "bg-cyan-500 text-white"
                      : "bg-gray-100 text-gray-700"
                  } `}
                >
                  {text}
                </button>
              ))}
            </div>
            {/* WEB SECTION */}
            {selectedId === 1 && (
              <>
                <div className="rounded-xl bg-white">
                  <h1 className="mt-3 rounded-t-xl bg-cyan-500 px-6 py-2 text-white">
                    Web Violation
                  </h1>
                  <div className="mb-6 flex flex-col gap-2 py-3">
                    {/* MAIN CART */}
                    <div className="p-4">
                      <div className="grid grid-cols-4 gap-x-6 gap-y-4">
                        {web.map((item, idx) => (
                          <label
                            key={idx}
                            className="flex items-center space-x-2"
                          >
                            <input type="checkbox" className="h-5 w-5" />
                            <span className="text-md font-light">{item}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div className="mr-3 flex justify-end gap-5">
                      <div className="flex justify-end">
                        <button
                          type="submit"
                          className="mb-4 mt-20 rounded border-2 border-cyan-500 bg-cyan-500 px-32 py-4 text-white hover:bg-white hover:text-cyan-500"
                        >
                          Save
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* DLP SECTION */}
            {selectedId === 2 && (
              <>
                <div className="rounded-xl bg-white">
                  <h1 className="mt-3 rounded-t-xl bg-cyan-500 px-6 py-2 text-white">
                    DLP Violation
                  </h1>
                  <div className="mb-6 flex flex-col gap-2 py-3">
                    {/* MAIN CART */}
                    <div className="p-4">
                      <div className="grid grid-cols-4 gap-x-6 gap-y-4">
                        {dlp.map((item, idx) => (
                          <label
                            key={idx}
                            className="flex items-center space-x-2"
                          >
                            <input type="checkbox" className="h-5 w-5" />
                            <span className="text-md font-light">{item}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div className="mr-3 flex justify-end gap-5">
                      <div className="flex justify-end">
                        <button
                          type="submit"
                          className="mb-4 mt-20 rounded border-2 border-cyan-500 bg-cyan-500 px-32 py-4 text-white hover:bg-white hover:text-cyan-500"
                        >
                          Save
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </form>
        </div>
      </div>
    );
  };

  const UpdateAlert = () => {
    const [addAlert, setAddAlert] = useState({
      id: "",
      title: "",
      description: "",
    });

    const handleChange = (e) => {
      const { name, value } = e.target;
      setAddAlert({
        ...addAlert,
        [name]: value,
      });
    };

    const handleSubmit = (e) => {
      e.preventDefault();
    };

    const [selectedId, setSelectedId] = useState(1);

    const buttons = [
      { id: 1, text: "Web Violation" },
      { id: 2, text: "DLP Violation" },
    ];

    const handleOptionClick = (id) => {
      setSelectedId(id);
    };

    const web = [
      "Login Page",
      "Browser Restriction",
      "IP Restriction",
      "Time Restriction",
      "Geo Location",
      "Account Lock",
      "Password Change",
      "Device Request",
    ];

    const dlp = [
      "Download",
      "Dropbox Consumer Account",
      "Download Email Attachment",
      "Share",
      "Whitelist IP",
      "Print",
      "Sync Dropbox",
      "Document Delete",
      "Screen Capture",
      "Across OU",
      "Email Compliance",
      "Clipboard",
      "Containerize Email",
      "Containerize Drive",
      "Github Account Violation",
    ];

    return (
      <div className="m-3 flex flex-col overflow-x-auto overflow-y-hidden">
        <div className="flex items-center justify-between rounded-md bg-white px-2 py-2 shadow-md">
          <h1 className="text-xl">Add Alert</h1>
          <div
            onClick={handleCancel}
            className="mx-3 rounded border border-blue-500 px-4 py-1 text-blue-500"
          >
            Cancel
          </div>
        </div>
        <div className="overflow-hidden shadow-md">
          <div className="mt-3 rounded-t-xl bg-cyan-500 px-3 py-2">
            <h1 className="text-white">Alert Details</h1>
          </div>
          {/* CREATE DLP FORM */}
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col rounded-b-xl bg-white px-4 py-2">
              <div className="flex gap-4">
                <div className="grid w-full gap-2 pb-3">
                  <div className="flex space-x-4">
                    {/* TITLE */}
                    <div className="flex w-1/2 flex-col">
                      <label
                        htmlFor="title"
                        className="text-sm font-medium text-gray-700"
                      >
                        Title
                      </label>
                      <input
                        type="text"
                        name="title"
                        value={addAlert.title}
                        className="mt-1 rounded-md border border-gray-300 p-2"
                        onChange={handleChange}
                        placeholder="Enter device type"
                      />
                    </div>
                    <div className="flex w-1/2 flex-col">
                      {/* DESCRIPTION */}
                      <label
                        htmlFor="description"
                        className="text-sm font-medium text-gray-700"
                      >
                        Description
                      </label>
                      <input
                        type="text"
                        name="description"
                        value={addAlert.description}
                        className="mt-1 rounded-md border border-gray-300 p-2"
                        onChange={handleChange}
                        placeholder="Enter device type"
                      />
                    </div>
                  </div>
                  {/* SECOND */}
                  <div className="flex space-x-4">
                    {/* Enabled */}
                    <div className="w1/2 flex flex-col items-start justify-start gap-1">
                      <label
                        htmlFor="enabled"
                        className="text-sm font-medium text-gray-700"
                      >
                        Enabled
                      </label>
                      <input
                        type="checkbox"
                        name="enabled"
                        className="flex h-5 w-5 justify-start px-1 py-1"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-5">
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="mb-4 mt-20 rounded border-2 border-cyan-500 bg-cyan-500 px-32 py-4 text-white hover:bg-white hover:text-cyan-500"
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
            {/* SECOND SECTION */}
            <div className="mt-3 flex gap-3">
              <h1 className="text-2xl font-medium">Events</h1>
              {buttons.map(({ id, text }) => (
                <button
                  key={id}
                  onClick={() => handleOptionClick(id)}
                  className={`text-md rounded px-3 py-2 font-light ${
                    selectedId === id
                      ? "bg-cyan-500 text-white"
                      : "bg-gray-100 text-gray-700"
                  } `}
                >
                  {text}
                </button>
              ))}
            </div>
            {/* WEB SECTION */}
            {selectedId === 1 && (
              <>
                <div className="rounded-xl bg-white">
                  <h1 className="mt-3 rounded-t-xl bg-cyan-500 px-6 py-2 text-white">
                    Web Violation
                  </h1>
                  <div className="mb-6 flex flex-col gap-2 py-3">
                    {/* MAIN CART */}
                    <div className="p-4">
                      <div className="grid grid-cols-4 gap-x-6 gap-y-4">
                        {web.map((item, idx) => (
                          <label
                            key={idx}
                            className="flex items-center space-x-2"
                          >
                            <input type="checkbox" className="h-5 w-5" />
                            <span className="text-md font-light">{item}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div className="mr-3 flex justify-end gap-5">
                      <div className="flex justify-end">
                        <button
                          type="submit"
                          className="mb-4 mt-20 rounded border-2 border-cyan-500 bg-cyan-500 px-32 py-4 text-white hover:bg-white hover:text-cyan-500"
                        >
                          Save
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* DLP SECTION */}
            {selectedId === 2 && (
              <>
                <div className="rounded-xl bg-white">
                  <h1 className="mt-3 rounded-t-xl bg-cyan-500 px-6 py-2 text-white">
                    DLP Violation
                  </h1>
                  <div className="mb-6 flex flex-col gap-2 py-3">
                    {/* MAIN CART */}
                    <div className="p-4">
                      <div className="grid grid-cols-4 gap-x-6 gap-y-4">
                        {dlp.map((item, idx) => (
                          <label
                            key={idx}
                            className="flex items-center space-x-2"
                          >
                            <input type="checkbox" className="h-5 w-5" />
                            <span className="text-md font-light">{item}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div className="mr-3 flex justify-end gap-5">
                      <div className="flex justify-end">
                        <button
                          type="submit"
                          className="mb-4 mt-20 rounded border-2 border-cyan-500 bg-cyan-500 px-32 py-4 text-white hover:bg-white hover:text-cyan-500"
                        >
                          Save
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </form>
        </div>
      </div>
    );
  };

  return (
    <>
      {activeComponent === "Table" ? (
        <AlertTable />
      ) : activeComponent === "Add" ? (
        <AddALert />
      ) : activeComponent === "Update" ? (
        <UpdateAlert />
      ) : (
        ""
      )}
    </>
  );
}
