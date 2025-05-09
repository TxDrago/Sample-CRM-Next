"use client";

//react

import { useState } from "react";
import { FaBars } from "react-icons/fa";
import { MdEdit } from "react-icons/md";
import { RiDeleteBin6Fill } from "react-icons/ri";
import Breadcrumb from "../Breadcrumb/Breadcrumb";

export default function Dlp() {
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
      modifiedOn: "14/03/2023",
    },
    {
      id: 2,
      title: "Global Hunt",
      createdBy: "12/03/2023",
      modifiedOn: "14/03/2023",
    },
    {
      id: 3,
      title: "Global Hunt",
      createdBy: "12/03/2023",
      modifiedOn: "14/03/2023",
    },
    {
      id: 4,
      title: "Global Hunt",
      createdBy: "12/03/2023",
      modifiedOn: "14/03/2023",
    },
    {
      id: 5,
      title: "Global Hunt",
      createdBy: "12/03/2023",
      modifiedOn: "14/03/2023",
    },
    {
      id: 6,
      title: "Global Hunt",
      createdBy: "12/03/2023",
      modifiedOn: "14/03/2023",
    },
    {
      id: 7,
      title: "Global Hunt",
      createdBy: "12/03/2023",
      modifiedOn: "14/03/2023",
    },
    {
      id: 8,
      title: "Global Hunt",
      createdBy: "12/03/2023",
      modifiedOn: "14/03/2023",
    },
    {
      id: 9,
      title: "Global Hunt",
      createdBy: "12/03/2023",
      modifiedOn: "14/03/2023",
    },
    {
      id: 10,
      title: "Global Hunt",
      createdBy: "12/03/2023",
      modifiedOn: "14/03/2023",
    },
    {
      id: 11,
      title: "Global Hunt",
      createdBy: "12/03/2023",
      modifiedOn: "14/03/2023",
    },
  ];

  const DlpTable = () => {
    return (
      <div className="min-w-screen m-3">
        <div className="min-w-screen flex flex-wrap items-center justify-between gap-5">
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-medium">DLP</h1>
            <h2 className="text-center text-xl font-medium text-red-500">
              (This feature is coming soon...)
            </h2>
          </div>
          <button
            onClick={handleAdd}
            className="min-w-10 rounded bg-blue-600 p-2 text-sm text-white"
          >
            Add Policy
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
                      <span>Modified On</span>
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
                      {device.modifiedOn}
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

  const AddDlp = () => {
    const [addDlp, setAddDlp] = useState({
      title: "",
      description: "",
      validFrom: "",
      validTo: "",
      idleTimeoutIntervalHours: "",
      sessionDuration: "",
      minutes: "",
    });

    // Handle input changes
    const handleChange = (e) => {
      const { name, value } = e.target;
      setAddDlp((prevDevice) => ({
        ...prevDevice,
        [name]: value,
      }));
    };

    const handleSubmit = (e) => {
      e.preventDefault();
    };

    const [selectedId, setSelectedId] = useState(1);

    const buttons = [
      { id: 1, text: "Session Time out" },
      { id: 2, text: "Dropbox" },
      { id: 3, text: "G Suite" },
    ];

    const handleOptionClick = (id) => {
      setSelectedId(id);
    };

    const tableData = [
      "Access Control Browser Violation",
      "Access Control Geo Violation",
      "Access Control IP Violation",
      "Access Control Mobile Geo Violation",
      "Access Control Mobile IP Violation",
      "Access Control Mobile Network Violation",
    ];

    const gTableData = [
      "Across OU Sharing",
      "Clipboard",
      "Countainerize  Drive",
      "Containerize Email",
      "Delete",
      "Download",
    ];

    return (
      <div className="m-3 flex flex-col overflow-x-auto overflow-y-hidden">
        <div className="flex items-center justify-between rounded-md bg-white px-2 py-2 shadow-md">
          <h1 className="text-xl">Add Policy</h1>
          <div
            onClick={handleCancel}
            className="mx-3 rounded border border-blue-500 px-4 py-1 text-blue-500"
          >
            Cancel
          </div>
        </div>
        <div className="overflow-hidden shadow-md">
          <div className="mt-3 rounded-t-xl bg-cyan-500 px-3 py-2">
            <h1 className="text-white">Access Policy</h1>
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
                        value={addDlp.title}
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
                        value={addDlp.description}
                        className="mt-1 rounded-md border border-gray-300 p-2"
                        onChange={handleChange}
                        placeholder="Enter device type"
                      />
                    </div>
                  </div>
                  {/* SECOND */}
                  <div className="flex space-x-4">
                    {/* TITLE */}
                    <div className="flex w-1/2 flex-col gap-1">
                      <label
                        htmlFor="unmanagedDevice"
                        className="text-sm font-medium text-gray-700"
                      >
                        Unmanaged Device
                      </label>
                      <input
                        type="checkbox"
                        name="unmanagedDevice"
                        className="flex h-5 w-5 justify-start px-1 py-1"
                      />
                    </div>
                    <div className="flex w-1/2 flex-col gap-1">
                      {/* DESCRIPTION */}
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
                  {/* THIRD */}
                  <div className="flex space-x-4">
                    {/* TITLE */}
                    <div className="w1/2 flex flex-col items-start justify-start gap-1">
                      <label
                        htmlFor="validAlways"
                        className="text-sm font-medium text-gray-700"
                      >
                        Valid Always
                      </label>
                      <input
                        type="checkbox"
                        name="validAlways"
                        className="flex h-5 w-5 justify-start px-1 py-1"
                      />
                    </div>
                  </div>
                  {/* FOURTH */}
                  <div className="flex space-x-4">
                    {/* Valid From */}
                    <div className="flex w-1/2 flex-col">
                      <label
                        htmlFor="validFrom"
                        className="text-sm font-medium text-gray-700"
                      >
                        Valid From
                      </label>
                      <input
                        type="text"
                        name="validFrom"
                        value={addDlp.validFrom}
                        className="mt-1 rounded-md border border-gray-300 p-2"
                        onChange={handleChange}
                        placeholder="Enter device type"
                      />
                    </div>
                    <div className="flex w-1/2 flex-col">
                      {/* Valid To */}
                      <label
                        htmlFor="validTo"
                        className="text-sm font-medium text-gray-700"
                      >
                        Valid To
                      </label>
                      <input
                        type="text"
                        name="validTo"
                        value={addDlp.validTo}
                        className="mt-1 rounded-md border border-gray-300 p-2"
                        onChange={handleChange}
                        placeholder="Enter device type"
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
              <h1 className="text-2xl font-medium">Agent</h1>
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
            {/* SESSION TIMEOUT FIELDS */}
            {selectedId === 1 && (
              <>
                <div className="mt-3 rounded-t-xl bg-cyan-500 px-6 py-2">
                  <h1 className="text-white">Session Time out</h1>
                </div>
                <div className="flex flex-col rounded-b-xl bg-white px-4 py-2">
                  <div className="flex gap-4">
                    <div className="grid w-full gap-2 pb-3">
                      <div className="flex space-x-4">
                        {/* UNMANAGED DEVICE */}
                        <div className="flex w-1/2 flex-col">
                          <label
                            htmlFor="unmanagedDevice"
                            className="text-sm font-medium text-gray-700"
                          >
                            Unmanaged Device
                          </label>
                          <input
                            type="checkbox"
                            name="unmanagedDevice"
                            className="flex h-5 w-5 justify-start px-1 py-1"
                          />
                        </div>
                      </div>
                      {/* SECOND */}
                      <div className="flex space-x-4">
                        {/* Idle Timeout Interval (Hours) */}
                        <div className="flex w-1/2 flex-col">
                          <label
                            htmlFor="idleTimeoutIntervalHours"
                            className="text-sm font-medium text-gray-700"
                          >
                            Idle Timeout Interval(Hours)
                          </label>
                          <input
                            type="text"
                            name="idleTimeoutIntervalHours"
                            value={addDlp.idleTimeoutIntervalHours}
                            className="mt-1 rounded-md border border-gray-300 p-2"
                            onChange={handleChange}
                            placeholder="Enter device type"
                          />
                        </div>
                        <div className="flex w-1/2 flex-col">
                          {/* Minutes */}
                          <label
                            htmlFor="minutes"
                            className="text-sm font-medium text-gray-700"
                          >
                            Minutes
                          </label>
                          <input
                            type="text"
                            name="minutes"
                            value={addDlp.minutes}
                            className="mt-1 rounded-md border border-gray-300 p-2"
                            onChange={handleChange}
                            placeholder="Enter device type"
                          />
                        </div>
                      </div>
                      {/* THIRD */}
                      <div className="flex w-full space-x-4">
                        {/* Session Duration (Hours) */}
                        <div className="w1/2 flex w-full flex-col">
                          <label
                            htmlFor="sessionDuration"
                            className="text-sm font-medium text-gray-700"
                          >
                            Session Duration(Hours)
                          </label>
                          <input
                            type="text"
                            name="sessionDuration"
                            value={addDlp.sessionDuration}
                            className="mt-1 rounded-md border border-gray-300 p-2"
                            onChange={handleChange}
                            placeholder="Enter device type"
                          />
                        </div>
                        {/* Minutes */}
                        <div className="w1/2 flex w-full flex-col">
                          <label
                            htmlFor="minutes"
                            className="text-sm font-medium text-gray-700"
                          >
                            Minutes
                          </label>
                          <input
                            type="text"
                            name="minutes"
                            value={addDlp.minutes}
                            className="mt-1 rounded-md border border-gray-300 p-2"
                            onChange={handleChange}
                            placeholder="Enter device type"
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
              </>
            )}
            {/* DROPBOX */}
            {selectedId === 2 && (
              <>
                <div className="rounded-xl bg-white">
                  <h1 className="mt-3 rounded-t-xl bg-cyan-500 px-6 py-2 text-white">
                    Dropbox
                  </h1>
                  <div className="mx-3 mb-6 mt-3 flex flex-col gap-2 py-3">
                    <div className="overflow-x-auto rounded-t-xl">
                      <table className="min-w-full table-auto">
                        <thead>
                          <tr className="rounded-t-xl bg-cyan-500">
                            <th className="px-4 py-2 font-light text-white">
                              Event name
                            </th>
                            <th className="px-4 py-2 font-light text-white">
                              Red
                            </th>
                            <th className="px-4 py-2 font-light text-white">
                              Green
                            </th>
                            <th className="px-4 py-2 font-light text-white">
                              Amber
                            </th>
                            <th className="px-4 py-2 font-light text-white">
                              None
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {tableData.map((item, idx) => (
                            <tr key={idx} className="border-b bg-gray-100">
                              <td className="px-4 py-2">{item}</td>
                              <td className="px-4 py-2 text-center">
                                <input
                                  type="checkbox"
                                  className="form-checkbox"
                                />
                              </td>
                              <td className="px-4 py-2 text-center">
                                <input
                                  type="checkbox"
                                  className="form-checkbox"
                                />
                              </td>
                              <td className="px-4 py-2 text-center">
                                <input
                                  type="checkbox"
                                  className="form-checkbox"
                                />
                              </td>
                              <td className="px-4 py-2 text-center">
                                <input
                                  type="checkbox"
                                  className="form-checkbox"
                                  defaultChecked
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
            )}
            {/* G SUITE */}
            {selectedId === 3 && (
              <>
                <div className="rounded-xl bg-white">
                  <h1 className="mt-3 rounded-t-xl bg-cyan-500 px-6 py-2 text-white">
                    G Suit
                  </h1>
                  <div className="mx-3 mb-6 mt-3 flex flex-col gap-2 py-3">
                    <div className="overflow-x-auto rounded-t-xl">
                      <table className="min-w-full table-auto">
                        <thead>
                          <tr className="rounded-t-xl bg-cyan-500">
                            <th></th>
                            <th className="px-4 py-2 font-light text-white">
                              None
                            </th>
                            <th className="px-4 py-2 font-light text-white">
                              Track
                            </th>
                            <th className="px-4 py-2 font-light text-white">
                              Block
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {gTableData.map((item, idx) => (
                            <tr key={idx} className="border-b bg-gray-100">
                              <td className="px-4 py-2">{item}</td>
                              <td className="px-4 py-2 text-center">
                                <input
                                  type="checkbox"
                                  className="form-checkbox"
                                />
                              </td>
                              <td className="px-4 py-2 text-center">
                                <input
                                  type="checkbox"
                                  className="form-checkbox"
                                />
                              </td>
                              <td className="px-4 py-2 text-center">
                                <input
                                  type="checkbox"
                                  className="form-checkbox"
                                  defaultChecked
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
            )}
          </form>
        </div>
      </div>
    );
  };

  const UpdateDlp = () => {
    const [addDlp, setAddDlp] = useState({
      id: "",
      title: "",
      description: "",
      validFrom: "",
      validTo: "",
      idleTimeoutIntervalHours: "",
      sessionDuration: "",
      minutes: "",
    });

    // Handle input changes
    const handleChange = (e) => {
      const { name, value } = e.target;
      setAddDlp((prevDevice) => ({
        ...prevDevice,
        [name]: value,
      }));
    };

    const handleSubmit = (e) => {
      e.preventDefault();
    };

    const [selectedId, setSelectedId] = useState(1);

    const buttons = [
      { id: 1, text: "Session Time out" },
      { id: 2, text: "Dropbox" },
      { id: 3, text: "G Suite" },
    ];

    const handleOptionClick = (id) => {
      setSelectedId(id);
    };

    const tableData = [
      "Access Control Browser Violation",
      "Access Control Geo Violation",
      "Access Control IP Violation",
      "Access Control Mobile Geo Violation",
      "Access Control Mobile IP Violation",
      "Access Control Mobile Network Violation",
    ];

    const gTableData = [
      "Across OU Sharing",
      "Clipboard",
      "Countainerize  Drive",
      "Containerize Email",
      "Delete",
      "Download",
    ];

    return (
      <div className="m-3 flex flex-col overflow-x-auto overflow-y-hidden">
        <div className="flex items-center justify-between rounded-md bg-white px-2 py-2 shadow-md">
          <h1 className="text-xl">Add Policy</h1>
          <div
            onClick={handleCancel}
            className="mx-3 rounded border border-blue-500 px-4 py-1 text-blue-500"
          >
            Cancel
          </div>
        </div>
        <div className="overflow-hidden shadow-md">
          <div className="mt-3 rounded-t-xl bg-cyan-500 px-3 py-2">
            <h1 className="text-white">Access Policy</h1>
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
                        value={addDlp.title}
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
                        value={addDlp.description}
                        className="mt-1 rounded-md border border-gray-300 p-2"
                        onChange={handleChange}
                        placeholder="Enter device type"
                      />
                    </div>
                  </div>
                  {/* SECOND */}
                  <div className="flex space-x-4">
                    {/* TITLE */}
                    <div className="flex w-1/2 flex-col gap-1">
                      <label
                        htmlFor="unmanagedDevice"
                        className="text-sm font-medium text-gray-700"
                      >
                        Unmanaged Device
                      </label>
                      <input
                        type="checkbox"
                        name="unmanagedDevice"
                        className="flex h-5 w-5 justify-start px-1 py-1"
                      />
                    </div>
                    <div className="flex w-1/2 flex-col gap-1">
                      {/* DESCRIPTION */}
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
                  {/* THIRD */}
                  <div className="flex space-x-4">
                    {/* TITLE */}
                    <div className="w1/2 flex flex-col items-start justify-start gap-1">
                      <label
                        htmlFor="validAlways"
                        className="text-sm font-medium text-gray-700"
                      >
                        Valid Always
                      </label>
                      <input
                        type="checkbox"
                        name="validAlways"
                        className="flex h-5 w-5 justify-start px-1 py-1"
                      />
                    </div>
                  </div>
                  {/* FOURTH */}
                  <div className="flex space-x-4">
                    {/* Valid From */}
                    <div className="flex w-1/2 flex-col">
                      <label
                        htmlFor="validFrom"
                        className="text-sm font-medium text-gray-700"
                      >
                        Valid From
                      </label>
                      <input
                        type="text"
                        name="validFrom"
                        value={addDlp.validFrom}
                        className="mt-1 rounded-md border border-gray-300 p-2"
                        onChange={handleChange}
                        placeholder="Enter device type"
                      />
                    </div>
                    <div className="flex w-1/2 flex-col">
                      {/* Valid To */}
                      <label
                        htmlFor="validTo"
                        className="text-sm font-medium text-gray-700"
                      >
                        Valid To
                      </label>
                      <input
                        type="text"
                        name="validTo"
                        value={addDlp.validTo}
                        className="mt-1 rounded-md border border-gray-300 p-2"
                        onChange={handleChange}
                        placeholder="Enter device type"
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
              <h1 className="text-2xl font-medium">Agent</h1>
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
            {/* SESSION TIMEOUT FIELDS */}
            {selectedId === 1 && (
              <>
                <div className="mt-3 rounded-t-xl bg-cyan-500 px-6 py-2">
                  <h1 className="text-white">Session Time out</h1>
                </div>
                <div className="flex flex-col rounded-b-xl bg-white px-4 py-2">
                  <div className="flex gap-4">
                    <div className="grid w-full gap-2 pb-3">
                      <div className="flex space-x-4">
                        {/* UNMANAGED DEVICE */}
                        <div className="flex w-1/2 flex-col">
                          <label
                            htmlFor="unmanagedDevice"
                            className="text-sm font-medium text-gray-700"
                          >
                            Unmanaged Device
                          </label>
                          <input
                            type="checkbox"
                            name="unmanagedDevice"
                            className="flex h-5 w-5 justify-start px-1 py-1"
                          />
                        </div>
                      </div>
                      {/* SECOND */}
                      <div className="flex space-x-4">
                        {/* Idle Timeout Interval (Hours) */}
                        <div className="flex w-1/2 flex-col">
                          <label
                            htmlFor="idleTimeoutIntervalHours"
                            className="text-sm font-medium text-gray-700"
                          >
                            Idle Timeout Interval(Hours)
                          </label>
                          <input
                            type="text"
                            name="idleTimeoutIntervalHours"
                            value={addDlp.idleTimeoutIntervalHours}
                            className="mt-1 rounded-md border border-gray-300 p-2"
                            onChange={handleChange}
                            placeholder="Enter device type"
                          />
                        </div>
                        <div className="flex w-1/2 flex-col">
                          {/* Minutes */}
                          <label
                            htmlFor="minutes"
                            className="text-sm font-medium text-gray-700"
                          >
                            Minutes
                          </label>
                          <input
                            type="text"
                            name="minutes"
                            value={addDlp.minutes}
                            className="mt-1 rounded-md border border-gray-300 p-2"
                            onChange={handleChange}
                            placeholder="Enter device type"
                          />
                        </div>
                      </div>
                      {/* THIRD */}
                      <div className="flex w-full space-x-4">
                        {/* Session Duration (Hours) */}
                        <div className="w1/2 flex w-full flex-col">
                          <label
                            htmlFor="sessionDuration"
                            className="text-sm font-medium text-gray-700"
                          >
                            Session Duration(Hours)
                          </label>
                          <input
                            type="text"
                            name="sessionDuration"
                            value={addDlp.sessionDuration}
                            className="mt-1 rounded-md border border-gray-300 p-2"
                            onChange={handleChange}
                            placeholder="Enter device type"
                          />
                        </div>
                        {/* Minutes */}
                        <div className="w1/2 flex w-full flex-col">
                          <label
                            htmlFor="minutes"
                            className="text-sm font-medium text-gray-700"
                          >
                            Minutes
                          </label>
                          <input
                            type="text"
                            name="minutes"
                            value={addDlp.minutes}
                            className="mt-1 rounded-md border border-gray-300 p-2"
                            onChange={handleChange}
                            placeholder="Enter device type"
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
              </>
            )}
            {/* DROPBOX */}
            {selectedId === 2 && (
              <>
                <div className="rounded-xl bg-white">
                  <h1 className="mt-3 rounded-t-xl bg-cyan-500 px-6 py-2 text-white">
                    Dropbox
                  </h1>
                  <div className="mx-3 mb-6 mt-3 flex flex-col gap-2 py-3">
                    <div className="overflow-x-auto rounded-t-xl">
                      <table className="min-w-full table-auto">
                        <thead>
                          <tr className="rounded-t-xl bg-cyan-500">
                            <th className="px-4 py-2 font-light text-white">
                              Event name
                            </th>
                            <th className="px-4 py-2 font-light text-white">
                              Red
                            </th>
                            <th className="px-4 py-2 font-light text-white">
                              Green
                            </th>
                            <th className="px-4 py-2 font-light text-white">
                              Amber
                            </th>
                            <th className="px-4 py-2 font-light text-white">
                              None
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {tableData.map((item, idx) => (
                            <tr key={idx} className="border-b bg-gray-100">
                              <td className="px-4 py-2">{item}</td>
                              <td className="px-4 py-2 text-center">
                                <input
                                  type="checkbox"
                                  className="form-checkbox"
                                />
                              </td>
                              <td className="px-4 py-2 text-center">
                                <input
                                  type="checkbox"
                                  className="form-checkbox"
                                />
                              </td>
                              <td className="px-4 py-2 text-center">
                                <input
                                  type="checkbox"
                                  className="form-checkbox"
                                />
                              </td>
                              <td className="px-4 py-2 text-center">
                                <input
                                  type="checkbox"
                                  className="form-checkbox"
                                  defaultChecked
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
            )}
            {/* G SUITE */}
            {selectedId === 3 && (
              <>
                <div className="rounded-xl bg-white">
                  <h1 className="mt-3 rounded-t-xl bg-cyan-500 px-6 py-2 text-white">
                    G Suit
                  </h1>
                  <div className="mx-3 mb-6 mt-3 flex flex-col gap-2 py-3">
                    <div className="overflow-x-auto rounded-t-xl">
                      <table className="min-w-full table-auto">
                        <thead>
                          <tr className="rounded-t-xl bg-cyan-500">
                            <th></th>
                            <th className="px-4 py-2 font-light text-white">
                              None
                            </th>
                            <th className="px-4 py-2 font-light text-white">
                              Track
                            </th>
                            <th className="px-4 py-2 font-light text-white">
                              Block
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {gTableData.map((item, idx) => (
                            <tr key={idx} className="border-b bg-gray-100">
                              <td className="px-4 py-2">{item}</td>
                              <td className="px-4 py-2 text-center">
                                <input
                                  type="checkbox"
                                  className="form-checkbox"
                                />
                              </td>
                              <td className="px-4 py-2 text-center">
                                <input
                                  type="checkbox"
                                  className="form-checkbox"
                                />
                              </td>
                              <td className="px-4 py-2 text-center">
                                <input
                                  type="checkbox"
                                  className="form-checkbox"
                                  defaultChecked
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
            )}
          </form>
        </div>
      </div>
    );
  };

  return (
    <>
      {activeComponent === "Table" ? (
        <DlpTable />
      ) : activeComponent === "Add" ? (
        <AddDlp />
      ) : activeComponent === "Update" ? (
        <UpdateDlp />
      ) : (
        ""
      )}
    </>
  );
}
