"use client";

//react

import { useState } from "react";
import { FaAngleDown, FaBars } from "react-icons/fa";
import { MdEdit } from "react-icons/md";
import { RiDeleteBin6Fill } from "react-icons/ri";
import Breadcrumb from "../Breadcrumb/Breadcrumb";

export default function PasswordPolicy() {
  const [activeComponent, setActiveComponent] = useState("Table");
  const [idGet, setIdGet] = useState("");

  const handleAdd = () => {
    setActiveComponent("Add");
  };

  const handleCancel = () => {
    setActiveComponent("Table");
  };

  const PasswordPolicyTable = () => {
    const data = [
      {
        id: 1,
        title: "Global Hunt",
        createdBy: "12/03/2023",
        modifiedOn: "12/03/2023",
      },
      {
        id: 2,
        title: "Global Hunt",
        createdBy: "12/03/2023",
        modifiedOn: "12/03/2023",
      },
      {
        id: 3,
        title: "Global Hunt",
        createdBy: "12/03/2023",
        modifiedOn: "12/03/2023",
      },
      {
        id: 4,
        title: "Global Hunt",
        createdBy: "12/03/2023",
        modifiedOn: "12/03/2023",
      },
      {
        id: 5,
        title: "Global Hunt",
        createdBy: "12/03/2023",
        modifiedOn: "12/03/2023",
      },
      {
        id: 6,
        title: "Global Hunt",
        createdBy: "12/03/2023",
        modifiedOn: "12/03/2023",
      },
      {
        id: 7,
        title: "Global Hunt",
        createdBy: "12/03/2023",
        modifiedOn: "12/03/2023",
      },
      {
        id: 8,
        title: "Global Hunt",
        createdBy: "12/03/2023",
        modifiedOn: "12/03/2023",
      },
      {
        id: 9,
        title: "Global Hunt",
        createdBy: "12/03/2023",
        modifiedOn: "12/03/2023",
      },
      {
        id: 10,
        title: "Global Hunt",
        createdBy: "12/03/2023",
        modifiedOn: "12/03/2023",
      },
      {
        id: 11,
        title: "Global Hunt",
        createdBy: "12/03/2023",
        modifiedOn: "12/03/2023",
      },
    ];

    const handleEdit = (id) => {
      setActiveComponent("Update");
      setIdGet(id);
    };

    return (
      <div className="min-w-screen m-3">
        <div className="min-w-screen flex flex-wrap items-center justify-between gap-5">
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-medium">Password Policy</h1>
            <h2 className="text-center text-xl font-medium text-red-500">
              (This feature is coming soon...)
            </h2>
          </div>
          <button
            onClick={handleAdd}
            className="min-w-10 rounded bg-blue-600 p-2 text-sm text-white"
          >
            Add Password Policy
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

  const AddPasswordPolicy = () => {
    const [isEditMode, setIsEditMode] = useState(false);
    const [addPassword, setAddPassword] = useState({
      title: "",
      description: "",
      validFrom: "",
      validTo: "",
      maxPassAge: "", // DROPDOWN
      minPassAge: "",
      minPassLen: "",
      minCharClass: "",
      minUpperChar: "",
      minLowerChar: "",
      minNumericChar: "",
      minSpeChar: "",
    });

    const handleChange = (e) => {
      const { name, value } = e.target;
      setAddPassword({
        ...addPassword,
        [name]: value,
      });
    };

    const handleSubmit = (e) => {
      e.preventDefault();
    };

    const [selectedId, setSelectedId] = useState(1);

    const buttons = [
      { id: 1, text: "Expiration" },
      { id: 2, text: "Compleocity" },
      { id: 3, text: "Restriction" },
      { id: 4, text: "Historic Password" },
      { id: 5, text: "Account Lock" },
      { id: 6, text: "Preferences" },
    ];

    const handleOptionClick = (id) => {
      setSelectedId(id);
    };

    // DROPDOWNS
    const [maxPasswordAgeDropdown, setMaxPasswordAgeDropdown] = useState(false);
    const [defaultMaxPasswordText, setDefaultMaxPasswordText] = useState(
      "Max Password Age(Days)",
    );
    const [minPasswordAgeDropdown, setMinPasswordAgeDropdown] = useState(false);
    const [defaultMinPasswordText, setDefaultMinPasswordText] = useState(
      "Min Password Age(Days)",
    );
    const [minPasswordLengthDropdown, setMinPasswordLengthDropdown] =
      useState(false);
    const [defaultMinLengthPasswordText, setDefaultMinLengthPasswordText] =
      useState("Minimum Password Length");
    const [minCharClassDropdown, setMinCharClassDropdown] = useState(false);
    const [defaultMinCharClassText, setDefaultMinCharClassText] = useState(
      "Minimum Character Classes",
    );
    const [minUppCaseCharDropdown, setMinUppCaseCharDropdown] = useState(false);
    const [defaultMinUppCaseText, setDefaultMinUppCaseText] = useState(
      "Minimum Uppercase Character",
    );
    const [minLowCaseCharDropdown, setMinLowCaseCharDropdown] = useState(false);
    const [defaultMinLowCaseText, setDefaultMinLowCaseText] = useState(
      "Minimum Lowercase Character",
    );
    const [minNumericCharDropdown, setMinNumericCharDropdown] = useState(false);
    const [defaultNumericCharText, setDefaultNumericCharText] = useState(
      "Minimum Numeric Character",
    );
    const [minSpecialCharDropdown, setMinSpecialCharDropdown] = useState(false);
    const [defaultSpecialCharText, setDefaultSpecialCharText] = useState(
      "Minimum Special Characters",
    );

    // DUMMY DATA
    const minPassword = [
      { id: 1, name: "Min Password" },
      { id: 2, name: "Min Password" },
      { id: 3, name: "Min Password" },
      { id: 4, name: "Min Password" },
    ];

    const maxPassword = [
      { id: 1, name: "Max Password" },
      { id: 2, name: "Max Password" },
      { id: 3, name: "Max Password" },
      { id: 4, name: "Max Password" },
    ];

    const minPwdLen = [
      { id: 1, name: 8 },
      { id: 2, name: 8 },
      { id: 3, name: 8 },
      { id: 4, name: 8 },
    ];

    const minCharClass = [
      { id: 1, name: 8 },
      { id: 2, name: 8 },
      { id: 3, name: 8 },
      { id: 4, name: 8 },
    ];

    const minUpper = [
      { id: 1, name: 8 },
      { id: 2, name: 8 },
      { id: 3, name: 8 },
      { id: 4, name: 8 },
    ];

    const minLower = [
      { id: 1, name: 8 },
      { id: 2, name: 8 },
      { id: 3, name: 8 },
      { id: 4, name: 8 },
    ];

    const minNumeric = [
      { id: 1, name: 8 },
      { id: 2, name: 8 },
      { id: 3, name: 8 },
      { id: 4, name: 8 },
    ];

    const minSpecial = [
      { id: 1, name: 8 },
      { id: 2, name: 8 },
      { id: 3, name: 8 },
      { id: 4, name: 8 },
    ];

    // TOGGLE DROPDOWNS
    const toggleDropdownMaxPassword = () => {
      setMaxPasswordAgeDropdown(!maxPasswordAgeDropdown);
    };

    const toggleDropdownMinPassword = () => {
      setMinPasswordAgeDropdown(!minPasswordAgeDropdown);
    };

    const toggleDropdownMinPassLen = () => {
      setMinPasswordLengthDropdown(!minPasswordLengthDropdown);
    };

    const toggleDropdownMinCharClass = () => {
      setMinCharClassDropdown(!minCharClassDropdown);
    };

    const toggleDropdownMinUpper = () => {
      setMinUppCaseCharDropdown(!minUppCaseCharDropdown);
    };

    const toggleDropdownMinLower = () => {
      setMinLowCaseCharDropdown(!minLowCaseCharDropdown);
    };

    const toggleDropdownMinNumeric = () => {
      setMinNumericCharDropdown(!minNumericCharDropdown);
    };

    const toggleDropdownMinSpecial = () => {
      setMinSpecialCharDropdown(!minSpecialCharDropdown);
    };

    const handleDropdownMaxPassword = (name) => {
      setDefaultMaxPasswordText(name);
      setMaxPasswordAgeDropdown(!maxPasswordAgeDropdown);
      setAddPassword((prev) => ({
        ...prev,
        name: name,
      }));
    };

    const handleDropdownMinPassword = (name) => {
      setDefaultMinPasswordText(name);
      setMinPasswordAgeDropdown(!minPasswordAgeDropdown);
      setAddPassword((prev) => ({
        ...prev,
        name: name,
      }));
    };

    const handleDropdownMinPassLen = (name) => {
      setDefaultMinLengthPasswordText(name);
      setMinPasswordLengthDropdown(!minPasswordLengthDropdown);
      setAddPassword((prev) => ({
        ...prev,
        name: name,
      }));
    };

    const handleDropdownMinCharClass = (name) => {
      setDefaultMinCharClassText(name);
      setMinCharClassDropdown(!minCharClassDropdown);
      setAddPassword((prev) => ({
        ...prev,
        name: name,
      }));
    };

    const handleDropdownMinUpper = (name) => {
      setDefaultMinUppCaseText(name);
      setMinUppCaseCharDropdown(!minUppCaseCharDropdown);
      setAddPassword((prev) => ({
        ...prev,
        name: name,
      }));
    };

    const handleDropdownMinLower = (name) => {
      setDefaultMinLowCaseText(name);
      setMinLowCaseCharDropdown(!minLowCaseCharDropdown);
      setAddPassword((prev) => ({
        ...prev,
        name: name,
      }));
    };

    const handleDropdownMinNumeric = (name) => {
      setDefaultNumericCharText(name);
      setMinNumericCharDropdown(!minLowCaseCharDropdown);
      setAddPassword((prev) => ({
        ...prev,
        name: name,
      }));
    };

    const handleDropdownMinSpecial = (name) => {
      setDefaultSpecialCharText(name);
      setMinSpecialCharDropdown(!minSpecialCharDropdown);
      setAddPassword((prev) => ({
        ...prev,
        name: name,
      }));
    };

    return (
      <div className="m-3 flex flex-col overflow-x-auto overflow-y-hidden">
        <div className="flex items-center justify-between rounded-md bg-white px-2 py-2 shadow-md">
          <h1 className="text-xl">Add Password Policy</h1>
          <div
            onClick={handleCancel}
            className="mx-3 rounded border border-blue-500 px-4 py-1 text-blue-500"
          >
            Cancel
          </div>
        </div>
        <div className="overflow-hidden shadow-md">
          <div className="mt-3 rounded-t-xl bg-cyan-500 px-3 py-2">
            <h1 className="text-white">Password Policy Details</h1>
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
                        value={addPassword.title}
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
                        value={addPassword.description}
                        className="mt-1 rounded-md border border-gray-300 p-2"
                        onChange={handleChange}
                        placeholder="Enter device type"
                      />
                    </div>
                  </div>
                  {/* SECOND */}
                  <div className="flex space-x-4">
                    {/* Enabled */}
                    <div className="w1/2 flex flex-1 flex-col items-start justify-start gap-1">
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
                    {/* Valid Always */}
                    <div className="w1/2 flex flex-1 flex-col items-start justify-start gap-1">
                      <label
                        htmlFor="granted"
                        className="text-sm font-medium text-gray-700"
                      >
                        Granted
                      </label>
                      <input
                        type="checkbox"
                        name="granted"
                        className="flex h-5 w-5 justify-start px-1 py-1"
                      />
                    </div>
                  </div>
                  {/* THIRD */}
                  <div className="flex space-x-4">
                    {/* Valid Always */}
                    <div className="w1/2 flex flex-1 flex-col items-start justify-start gap-1">
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
                    {/* VALID FROM */}
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
                        value={addPassword.validFrom}
                        className="mt-1 rounded-md border border-gray-300 p-2"
                        onChange={handleChange}
                        placeholder="Enter device type"
                      />
                    </div>
                    <div className="flex w-1/2 flex-col">
                      {/* VALID TO */}
                      <label
                        htmlFor="validTo"
                        className="text-sm font-medium text-gray-700"
                      >
                        Valid To
                      </label>
                      <input
                        type="text"
                        name="validTo"
                        value={addPassword.validTo}
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
            {/* EXPIRATION */}
            {selectedId === 1 && (
              <>
                <div className="rounded-xl bg-white">
                  <h1 className="mt-3 rounded-t-xl bg-cyan-500 px-3 py-2 text-white">
                    Expiration
                  </h1>

                  <div className="grid gap-2 px-3 py-3">
                    {/* FIRST */}
                    <div className="flex space-x-4">
                      <div className="w1/2 flex flex-1 flex-col items-start justify-start gap-1">
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
                    {/* SECOND */}
                    <div className="flex w-full space-x-4">
                      {/* FROM (Hours) DROPDOWN */}
                      <div className="relative flex w-1/2 flex-col">
                        <label
                          htmlFor="maxPassAge"
                          className="text-sm font-medium text-gray-700"
                        >
                          Max Password Age(Days)
                        </label>
                        <div
                          className="relative"
                          onClick={toggleDropdownMaxPassword}
                          onMouseLeave={() => setMaxPasswordAgeDropdown(false)}
                        >
                          <button
                            className="mt-1 flex w-full items-center justify-between rounded-md border border-gray-300 p-2"
                            id="maxPassAge"
                            type="button"
                          >
                            {isEditMode
                              ? addPassword.maxPassAge
                              : defaultMaxPasswordText}
                            <FaAngleDown className="ml-2 text-gray-400" />
                          </button>
                          {maxPasswordAgeDropdown && (
                            <div className="top-10.5 absolute z-10 w-full rounded-md border border-gray-300 bg-white">
                              <ul className="py-2 text-sm text-gray-700">
                                {maxPassword.map(({ key, name }) => (
                                  <li
                                    key={key}
                                    onClick={() =>
                                      handleDropdownMaxPassword(name)
                                    }
                                    className="block cursor-pointer border-b px-4 py-2 hover:bg-cyan-500 hover:text-white"
                                  >
                                    {name}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      </div>
                      {/* Minutes DROPDOWN */}
                      <div className="relative flex w-1/2 flex-col">
                        <label
                          htmlFor="minPassAge"
                          className="text-sm font-medium text-gray-700"
                        >
                          Min Password Age(Days)
                        </label>
                        <div
                          className="relative"
                          onClick={toggleDropdownMinPassword}
                          onMouseLeave={() => setMinPasswordAgeDropdown(false)}
                        >
                          <button
                            className="mt-1 flex w-full items-center justify-between rounded-md border border-gray-300 p-2"
                            id="minPassAge"
                            type="button"
                          >
                            {isEditMode
                              ? addPassword.minPassAge
                              : defaultMinPasswordText}
                            <FaAngleDown className="ml-2 text-gray-400" />
                          </button>
                          {minPasswordAgeDropdown && (
                            <div className="top-10.5 absolute z-10 w-full rounded-md border border-gray-300 bg-white">
                              <ul className="py-2 text-sm text-gray-700">
                                {minPassword.map(({ key, name }) => (
                                  <li
                                    key={key}
                                    onClick={() =>
                                      handleDropdownMinPassword(name)
                                    }
                                    className="block cursor-pointer border-b px-4 py-2 hover:bg-cyan-500 hover:text-white"
                                  >
                                    {name}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    {/* THIRD */}
                    <div className="flex space-x-4">
                      <div className="w1/2 flex flex-1 flex-col items-start justify-start gap-1">
                        <label
                          htmlFor="passwordNeverExp"
                          className="text-sm font-medium text-gray-700"
                        >
                          Password Never Expires
                        </label>
                        <input
                          type="checkbox"
                          name="passwordNeverExp"
                          className="flex h-5 w-5 justify-start px-1 py-1"
                          defaultChecked
                        />
                      </div>
                    </div>
                    {/* FOURTH */}
                    <div className="flex space-x-4">
                      <div className="w1/2 flex flex-1 gap-2">
                        <input
                          type="checkbox"
                          name="passwordNeverExp"
                          className="flex h-5 w-5 justify-start px-1 py-1"
                        />
                        <label
                          htmlFor="passwordNeverExp"
                          className="text-sm font-medium text-gray-700"
                        >
                          Force User To Change Password at next Login.
                        </label>
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

            {/* COMPLEOCITY */}
            {selectedId === 2 && (
              <>
                <div className="rounded-xl bg-white">
                  <h1 className="mt-3 rounded-t-xl bg-cyan-500 px-6 py-2 text-white">
                    Compleocity
                  </h1>

                  <div className="grid gap-2 px-3 py-3">
                    {/* FIRST */}
                    <div className="flex w-full space-x-4">
                      {/* FROM (Hours) DROPDOWN */}
                      <div className="relative flex w-1/2 flex-col">
                        <label
                          htmlFor="minPassLen"
                          className="text-sm font-medium text-gray-700"
                        >
                          Minimum Password Length
                        </label>
                        <div
                          className="relative"
                          onClick={toggleDropdownMinPassLen}
                          onMouseLeave={() =>
                            setMinPasswordLengthDropdown(false)
                          }
                        >
                          <button
                            className="mt-1 flex w-full items-center justify-between rounded-md border border-gray-300 p-2"
                            id="minPassLen"
                            type="button"
                          >
                            {isEditMode
                              ? addPassword.minPassLen
                              : defaultMinLengthPasswordText}
                            <FaAngleDown className="ml-2 text-gray-400" />
                          </button>
                          {minPasswordLengthDropdown && (
                            <div className="top-10.5 absolute z-10 w-full rounded-md border border-gray-300 bg-white">
                              <ul className="py-2 text-sm text-gray-700">
                                {minPwdLen.map(({ key, name }) => (
                                  <li
                                    key={key}
                                    onClick={() =>
                                      handleDropdownMinPassLen(name)
                                    }
                                    className="block cursor-pointer border-b px-4 py-2 hover:bg-cyan-500 hover:text-white"
                                  >
                                    {name}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      </div>
                      {/* Minutes DROPDOWN */}
                      <div className="relative flex w-1/2 flex-col">
                        <label
                          htmlFor="minCharClass"
                          className="text-sm font-medium text-gray-700"
                        >
                          Minimum Character Classes from the following four
                          Categories
                        </label>
                        <div
                          className="relative"
                          onClick={toggleDropdownMinCharClass}
                          onMouseLeave={() => setMinCharClassDropdown(false)}
                        >
                          <button
                            className="mt-1 flex w-full items-center justify-between rounded-md border border-gray-300 p-2"
                            id="minCharClass"
                            type="button"
                          >
                            {isEditMode
                              ? addPassword.minCharClass
                              : defaultMinCharClassText}
                            <FaAngleDown className="ml-2 text-gray-400" />
                          </button>
                          {minCharClassDropdown && (
                            <div className="top-10.5 absolute z-10 w-full rounded-md border border-gray-300 bg-white">
                              <ul className="py-2 text-sm text-gray-700">
                                {minCharClass.map(({ key, name }) => (
                                  <li
                                    key={key}
                                    onClick={() =>
                                      handleDropdownMinCharClass(name)
                                    }
                                    className="block cursor-pointer border-b px-4 py-2 hover:bg-cyan-500 hover:text-white"
                                  >
                                    {name}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    {/* SECOND */}
                    <h1 className="text-md mt-2 font-medium text-gray-700">
                      Required Alpha Character
                    </h1>
                    <div className="flex w-full space-x-4">
                      {/* FROM (Hours) DROPDOWN */}
                      <div className="relative flex w-1/2 flex-col">
                        <label
                          htmlFor="minUpperChar"
                          className="text-sm font-medium text-gray-700"
                        >
                          Minimum Uppercase character (A-Z)
                        </label>
                        <div
                          className="relative"
                          onClick={toggleDropdownMinUpper}
                          onMouseLeave={() => setMinUppCaseCharDropdown(false)}
                        >
                          <button
                            className="mt-1 flex w-full items-center justify-between rounded-md border border-gray-300 p-2"
                            id="minUpperChar"
                            type="button"
                          >
                            {isEditMode
                              ? addPassword.minUpperChar
                              : defaultMinUppCaseText}
                            <FaAngleDown className="ml-2 text-gray-400" />
                          </button>
                          {minUppCaseCharDropdown && (
                            <div className="top-10.5 absolute z-10 w-full rounded-md border border-gray-300 bg-white">
                              <ul className="py-2 text-sm text-gray-700">
                                {minUpper.map(({ key, name }) => (
                                  <li
                                    key={key}
                                    onClick={() => handleDropdownMinUpper(name)}
                                    className="block cursor-pointer border-b px-4 py-2 hover:bg-cyan-500 hover:text-white"
                                  >
                                    {name}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      </div>
                      {/* Minutes DROPDOWN */}
                      <div className="relative flex w-1/2 flex-col">
                        <label
                          htmlFor="minLowerChar"
                          className="text-sm font-medium text-gray-700"
                        >
                          Minimum Lowercase Characters (A-Z)
                        </label>
                        <div
                          className="relative"
                          onClick={toggleDropdownMinLower}
                          onMouseLeave={() => setMinLowCaseCharDropdown(false)}
                        >
                          <button
                            className="mt-1 flex w-full items-center justify-between rounded-md border border-gray-300 p-2"
                            id="minLowerChar"
                            type="button"
                          >
                            {isEditMode
                              ? addPassword.minLowerChar
                              : defaultMinLowCaseText}
                            <FaAngleDown className="ml-2 text-gray-400" />
                          </button>
                          {minLowCaseCharDropdown && (
                            <div className="top-10.5 absolute z-10 w-full rounded-md border border-gray-300 bg-white">
                              <ul className="py-2 text-sm text-gray-700">
                                {minLower.map(({ key, name }) => (
                                  <li
                                    key={key}
                                    onClick={() => handleDropdownMinLower(name)}
                                    className="block cursor-pointer border-b px-4 py-2 hover:bg-cyan-500 hover:text-white"
                                  >
                                    {name}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    {/* THIRD */}
                    <h1 className="text-md mt-2 font-medium text-gray-700">
                      Required Non Alpha Characters
                    </h1>
                    <div className="flex w-full space-x-4">
                      {/* FROM (Hours) DROPDOWN */}
                      <div className="relative flex w-1/2 flex-col">
                        <label
                          htmlFor="minNumericChar"
                          className="text-sm font-medium text-gray-700"
                        >
                          Minimum Numeric character (0-9)
                        </label>
                        <div
                          className="relative"
                          onClick={toggleDropdownMinNumeric}
                          onMouseLeave={() => setMinNumericCharDropdown(false)}
                        >
                          <button
                            className="mt-1 flex w-full items-center justify-between rounded-md border border-gray-300 p-2"
                            id="minNumericChar"
                            type="button"
                          >
                            {isEditMode
                              ? addPassword.minNumericChar
                              : defaultNumericCharText}
                            <FaAngleDown className="ml-2 text-gray-400" />
                          </button>
                          {minNumericCharDropdown && (
                            <div className="top-10.5 absolute z-10 w-full rounded-md border border-gray-300 bg-white">
                              <ul className="py-2 text-sm text-gray-700">
                                {minNumeric.map(({ key, name }) => (
                                  <li
                                    key={key}
                                    onClick={() =>
                                      handleDropdownMinNumeric(name)
                                    }
                                    className="block cursor-pointer border-b px-4 py-2 hover:bg-cyan-500 hover:text-white"
                                  >
                                    {name}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      </div>
                      {/* Minimum Special Characters (A-Z) */}
                      <div className="relative flex w-1/2 flex-col">
                        <label
                          htmlFor="minSpeChar"
                          className="text-sm font-medium text-gray-700"
                        >
                          Minimum Special Characters (A-Z)
                        </label>
                        <div
                          className="relative"
                          onClick={toggleDropdownMinSpecial}
                          onMouseLeave={() => setMinSpecialCharDropdown(false)}
                        >
                          <button
                            className="mt-1 flex w-full items-center justify-between rounded-md border border-gray-300 p-2"
                            id="minSpeChar"
                            type="button"
                          >
                            {isEditMode
                              ? addPassword.minSpeChar
                              : defaultSpecialCharText}
                            <FaAngleDown className="ml-2 text-gray-400" />
                          </button>
                          {minSpecialCharDropdown && (
                            <div className="top-10.5 absolute z-10 w-full rounded-md border border-gray-300 bg-white">
                              <ul className="py-2 text-sm text-gray-700">
                                {minSpecial.map(({ key, name }) => (
                                  <li
                                    key={key}
                                    onClick={() =>
                                      handleDropdownMinSpecial(name)
                                    }
                                    className="block cursor-pointer border-b px-4 py-2 hover:bg-cyan-500 hover:text-white"
                                  >
                                    {name}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mb-6 flex flex-col gap-2 py-3">
                    {/* MAIN CART */}

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
            {/* RESTRICTION */}
            {selectedId === 3 && (
              <>
                <div className="rounded-xl bg-white">
                  <h1 className="mt-3 rounded-t-xl bg-cyan-500 px-6 py-2 text-white">
                    Restriction
                  </h1>

                  <div className="mt-3 grid w-full gap-3 px-3 pb-3">
                    {/* FIRST */}
                    <div className="flex space-x-4">
                      <div className="w1/2 flex flex-1 flex-col items-start justify-start gap-1">
                        <label
                          htmlFor="validAlways"
                          className="text-sm font-medium text-gray-700"
                        >
                          Disallow username in password
                        </label>
                        <input
                          type="checkbox"
                          name="validAlways"
                          className="flex h-5 w-5 justify-start px-1 py-1"
                        />
                      </div>
                    </div>
                    {/* SECOND */}
                    <div className="flex space-x-4">
                      <div className="w1/2 flex flex-1 flex-col items-start justify-start gap-1">
                        <label
                          htmlFor="validAlways"
                          className="text-sm font-medium text-gray-700"
                        >
                          Disallow digit as first character in password
                        </label>
                        <input
                          type="checkbox"
                          name="validAlways"
                          className="flex h-5 w-5 justify-start px-1 py-1"
                        />
                      </div>
                    </div>
                    {/* THIRD */}
                    <div className="flex space-x-4">
                      <div className="w1/2 flex flex-1 flex-col items-start justify-start gap-1">
                        <label
                          htmlFor="validAlways"
                          className="text-sm font-medium text-gray-700"
                        >
                          Disallow parts of the user’s full name that exceed two
                          consecutive character in the password
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
                      <div className="w1/2 flex flex-1 flex-col items-start justify-start gap-1">
                        <label
                          htmlFor="validAlways"
                          className="text-sm font-medium text-gray-700"
                        >
                          Exclude Keywords in password
                        </label>
                        <input
                          type="checkbox"
                          name="validAlways"
                          className="flex h-5 w-5 justify-start px-1 py-1"
                        />
                      </div>
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
              </>
            )}
            {/* HISTORIC PASSWORD */}
            {selectedId === 4 && (
              <>
                <div className="rounded-xl bg-white">
                  <h1 className="mt-3 rounded-t-xl bg-cyan-500 px-6 py-2 text-white">
                    Historic Password
                  </h1>
                  <div className="mb-6 flex flex-col gap-2 py-3">
                    {/* MAIN CART */}
                    <div className="grid w-full gap-2 px-3 pb-3">
                      <div className="flex space-x-4">
                        {/* ENABLE */}
                        <div className="flex w-1/2 flex-col">
                          <label
                            htmlFor="enable"
                            className="text-sm font-medium text-gray-700"
                          >
                            Enable Save Historic Password
                          </label>
                          <input
                            type="checkbox"
                            name="enable"
                            className="flex h-5 w-5 justify-start px-1 py-1"
                          />
                        </div>
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
            {/* ACCOUNT LOCK */}
            {selectedId === 5 && (
              <>
                <div className="rounded-xl bg-white">
                  <h1 className="mt-3 rounded-t-xl bg-cyan-500 px-6 py-2 text-white">
                    Account Lock
                  </h1>
                  <div className="mb-6 flex flex-col gap-2 py-3">
                    {/* MAIN CART */}
                    <div className="grid w-full gap-2 px-3 pb-3">
                      <div className="flex space-x-4">
                        {/* ENABLE */}
                        <div className="flex w-1/2 flex-col">
                          <label
                            htmlFor="enable"
                            className="text-sm font-medium text-gray-700"
                          >
                            Enable Account Lock
                          </label>
                          <input
                            type="checkbox"
                            name="enable"
                            className="flex h-5 w-5 justify-start px-1 py-1"
                          />
                        </div>
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
            {/* PREFERENCES */}
            {selectedId === 6 && (
              <>
                <div className="rounded-xl bg-white">
                  <h1 className="mt-3 rounded-t-xl bg-cyan-500 px-6 py-2 text-white">
                    Preferences
                  </h1>
                  <div className="mb-6 flex flex-col gap-2 py-3">
                    {/* MAIN CART */}
                    <div className="grid w-full gap-2 px-3 pb-3">
                      <div className="flex space-x-4">
                        {/* ENABLE */}
                        <div className="flex w-1/2 flex-col">
                          <label
                            htmlFor="enable"
                            className="text-sm font-medium text-gray-700"
                          >
                            Enable Notification on password chenged
                          </label>
                          <input
                            type="checkbox"
                            name="enable"
                            className="flex h-5 w-5 justify-start px-1 py-1"
                          />
                        </div>
                      </div>
                      {/* SECOND */}
                      <div className="flex w-1/2 flex-col">
                        <div className="flex w-1/2 flex-col">
                          <label
                            htmlFor="enable"
                            className="text-sm font-medium text-gray-700"
                          >
                            Logout user on password changed
                          </label>
                          <input
                            type="checkbox"
                            name="enable"
                            className="flex h-5 w-5 justify-start px-1 py-1"
                          />
                        </div>
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

  const UpdatePasswordPolicy = () => {
    const [isEditMode, setIsEditMode] = useState(false);
    const [addPassword, setAddPassword] = useState({
      id: "",
      title: "",
      description: "",
      validFrom: "",
      validTo: "",
      maxPassAge: "", // DROPDOWN
      minPassAge: "",
      minPassLen: "",
      minCharClass: "",
      minUpperChar: "",
      minLowerChar: "",
      minNumericChar: "",
      minSpeChar: "",
    });

    const handleChange = (e) => {
      const { name, value } = e.target;
      setAddPassword({
        ...addPassword,
        [name]: value,
      });
    };

    const handleSubmit = (e) => {
      e.preventDefault();
    };

    const [selectedId, setSelectedId] = useState(1);

    const buttons = [
      { id: 1, text: "Expiration" },
      { id: 2, text: "Compleocity" },
      { id: 3, text: "Restriction" },
      { id: 4, text: "Historic Password" },
      { id: 5, text: "Account Lock" },
      { id: 6, text: "Preferences" },
    ];

    const handleOptionClick = (id) => {
      setSelectedId(id);
    };

    // DROPDOWNS
    const [maxPasswordAgeDropdown, setMaxPasswordAgeDropdown] = useState(false);
    const [defaultMaxPasswordText, setDefaultMaxPasswordText] = useState(
      "Max Password Age(Days)",
    );
    const [minPasswordAgeDropdown, setMinPasswordAgeDropdown] = useState(false);
    const [defaultMinPasswordText, setDefaultMinPasswordText] = useState(
      "Min Password Age(Days)",
    );
    const [minPasswordLengthDropdown, setMinPasswordLengthDropdown] =
      useState(false);
    const [defaultMinLengthPasswordText, setDefaultMinLengthPasswordText] =
      useState("Minimum Password Length");
    const [minCharClassDropdown, setMinCharClassDropdown] = useState(false);
    const [defaultMinCharClassText, setDefaultMinCharClassText] = useState(
      "Minimum Character Classes",
    );
    const [minUppCaseCharDropdown, setMinUppCaseCharDropdown] = useState(false);
    const [defaultMinUppCaseText, setDefaultMinUppCaseText] = useState(
      "Minimum Uppercase Character",
    );
    const [minLowCaseCharDropdown, setMinLowCaseCharDropdown] = useState(false);
    const [defaultMinLowCaseText, setDefaultMinLowCaseText] = useState(
      "Minimum Lowercase Character",
    );
    const [minNumericCharDropdown, setMinNumericCharDropdown] = useState(false);
    const [defaultNumericCharText, setDefaultNumericCharText] = useState(
      "Minimum Numeric Character",
    );
    const [minSpecialCharDropdown, setMinSpecialCharDropdown] = useState(false);
    const [defaultSpecialCharText, setDefaultSpecialCharText] = useState(
      "Minimum Special Characters",
    );

    // DUMMY DATA
    const minPassword = [
      { id: 1, name: "Min Password" },
      { id: 2, name: "Min Password" },
      { id: 3, name: "Min Password" },
      { id: 4, name: "Min Password" },
    ];

    const maxPassword = [
      { id: 1, name: "Max Password" },
      { id: 2, name: "Max Password" },
      { id: 3, name: "Max Password" },
      { id: 4, name: "Max Password" },
    ];

    const minPwdLen = [
      { id: 1, name: 8 },
      { id: 2, name: 8 },
      { id: 3, name: 8 },
      { id: 4, name: 8 },
    ];

    const minCharClass = [
      { id: 1, name: 8 },
      { id: 2, name: 8 },
      { id: 3, name: 8 },
      { id: 4, name: 8 },
    ];

    const minUpper = [
      { id: 1, name: 8 },
      { id: 2, name: 8 },
      { id: 3, name: 8 },
      { id: 4, name: 8 },
    ];

    const minLower = [
      { id: 1, name: 8 },
      { id: 2, name: 8 },
      { id: 3, name: 8 },
      { id: 4, name: 8 },
    ];

    const minNumeric = [
      { id: 1, name: 8 },
      { id: 2, name: 8 },
      { id: 3, name: 8 },
      { id: 4, name: 8 },
    ];

    const minSpecial = [
      { id: 1, name: 8 },
      { id: 2, name: 8 },
      { id: 3, name: 8 },
      { id: 4, name: 8 },
    ];

    // TOGGLE DROPDOWNS
    const toggleDropdownMaxPassword = () => {
      setMaxPasswordAgeDropdown(!maxPasswordAgeDropdown);
    };

    const toggleDropdownMinPassword = () => {
      setMinPasswordAgeDropdown(!minPasswordAgeDropdown);
    };

    const toggleDropdownMinPassLen = () => {
      setMinPasswordLengthDropdown(!minPasswordLengthDropdown);
    };

    const toggleDropdownMinCharClass = () => {
      setMinCharClassDropdown(!minCharClassDropdown);
    };

    const toggleDropdownMinUpper = () => {
      setMinUppCaseCharDropdown(!minUppCaseCharDropdown);
    };

    const toggleDropdownMinLower = () => {
      setMinLowCaseCharDropdown(!minLowCaseCharDropdown);
    };

    const toggleDropdownMinNumeric = () => {
      setMinNumericCharDropdown(!minNumericCharDropdown);
    };

    const toggleDropdownMinSpecial = () => {
      setMinSpecialCharDropdown(!minSpecialCharDropdown);
    };

    const handleDropdownMaxPassword = (name) => {
      setDefaultMaxPasswordText(name);
      setMaxPasswordAgeDropdown(!maxPasswordAgeDropdown);
      setAddPassword((prev) => ({
        ...prev,
        name: name,
      }));
    };

    const handleDropdownMinPassword = (name) => {
      setDefaultMinPasswordText(name);
      setMinPasswordAgeDropdown(!minPasswordAgeDropdown);
      setAddPassword((prev) => ({
        ...prev,
        name: name,
      }));
    };

    const handleDropdownMinPassLen = (name) => {
      setDefaultMinLengthPasswordText(name);
      setMinPasswordLengthDropdown(!minPasswordLengthDropdown);
      setAddPassword((prev) => ({
        ...prev,
        name: name,
      }));
    };

    const handleDropdownMinCharClass = (name) => {
      setDefaultMinCharClassText(name);
      setMinCharClassDropdown(!minCharClassDropdown);
      setAddPassword((prev) => ({
        ...prev,
        name: name,
      }));
    };

    const handleDropdownMinUpper = (name) => {
      setDefaultMinUppCaseText(name);
      setMinUppCaseCharDropdown(!minUppCaseCharDropdown);
      setAddPassword((prev) => ({
        ...prev,
        name: name,
      }));
    };

    const handleDropdownMinLower = (name) => {
      setDefaultMinLowCaseText(name);
      setMinLowCaseCharDropdown(!minLowCaseCharDropdown);
      setAddPassword((prev) => ({
        ...prev,
        name: name,
      }));
    };

    const handleDropdownMinNumeric = (name) => {
      setDefaultNumericCharText(name);
      setMinNumericCharDropdown(!minLowCaseCharDropdown);
      setAddPassword((prev) => ({
        ...prev,
        name: name,
      }));
    };

    const handleDropdownMinSpecial = (name) => {
      setDefaultSpecialCharText(name);
      setMinSpecialCharDropdown(!minSpecialCharDropdown);
      setAddPassword((prev) => ({
        ...prev,
        name: name,
      }));
    };

    return (
      <div className="m-3 flex flex-col overflow-x-auto overflow-y-hidden">
        <div className="flex items-center justify-between rounded-md bg-white px-2 py-2 shadow-md">
          <h1 className="text-xl">Add Password Policy</h1>
          <div
            onClick={handleCancel}
            className="mx-3 rounded border border-blue-500 px-4 py-1 text-blue-500"
          >
            Cancel
          </div>
        </div>
        <div className="overflow-hidden shadow-md">
          <div className="mt-3 rounded-t-xl bg-cyan-500 px-3 py-2">
            <h1 className="text-white">Password Policy Details</h1>
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
                        value={addPassword.title}
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
                        value={addPassword.description}
                        className="mt-1 rounded-md border border-gray-300 p-2"
                        onChange={handleChange}
                        placeholder="Enter device type"
                      />
                    </div>
                  </div>
                  {/* SECOND */}
                  <div className="flex space-x-4">
                    {/* Enabled */}
                    <div className="w1/2 flex flex-1 flex-col items-start justify-start gap-1">
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
                    {/* Valid Always */}
                    <div className="w1/2 flex flex-1 flex-col items-start justify-start gap-1">
                      <label
                        htmlFor="granted"
                        className="text-sm font-medium text-gray-700"
                      >
                        Granted
                      </label>
                      <input
                        type="checkbox"
                        name="granted"
                        className="flex h-5 w-5 justify-start px-1 py-1"
                      />
                    </div>
                  </div>
                  {/* THIRD */}
                  <div className="flex space-x-4">
                    {/* Valid Always */}
                    <div className="w1/2 flex flex-1 flex-col items-start justify-start gap-1">
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
                    {/* VALID FROM */}
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
                        value={addPassword.validFrom}
                        className="mt-1 rounded-md border border-gray-300 p-2"
                        onChange={handleChange}
                        placeholder="Enter device type"
                      />
                    </div>
                    <div className="flex w-1/2 flex-col">
                      {/* VALID TO */}
                      <label
                        htmlFor="validTo"
                        className="text-sm font-medium text-gray-700"
                      >
                        Valid To
                      </label>
                      <input
                        type="text"
                        name="validTo"
                        value={addPassword.validTo}
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
            {/* EXPIRATION */}
            {selectedId === 1 && (
              <>
                <div className="rounded-xl bg-white">
                  <h1 className="mt-3 rounded-t-xl bg-cyan-500 px-3 py-2 text-white">
                    Expiration
                  </h1>

                  <div className="grid gap-2 px-3 py-3">
                    {/* FIRST */}
                    <div className="flex space-x-4">
                      <div className="w1/2 flex flex-1 flex-col items-start justify-start gap-1">
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
                    {/* SECOND */}
                    <div className="flex w-full space-x-4">
                      {/* FROM (Hours) DROPDOWN */}
                      <div className="relative flex w-1/2 flex-col">
                        <label
                          htmlFor="maxPassAge"
                          className="text-sm font-medium text-gray-700"
                        >
                          Max Password Age(Days)
                        </label>
                        <div
                          className="relative"
                          onClick={toggleDropdownMaxPassword}
                          onMouseLeave={() => setMaxPasswordAgeDropdown(false)}
                        >
                          <button
                            className="mt-1 flex w-full items-center justify-between rounded-md border border-gray-300 p-2"
                            id="maxPassAge"
                            type="button"
                          >
                            {isEditMode
                              ? addPassword.maxPassAge
                              : defaultMaxPasswordText}
                            <FaAngleDown className="ml-2 text-gray-400" />
                          </button>
                          {maxPasswordAgeDropdown && (
                            <div className="top-10.5 absolute z-10 w-full rounded-md border border-gray-300 bg-white">
                              <ul className="py-2 text-sm text-gray-700">
                                {maxPassword.map(({ key, name }) => (
                                  <li
                                    key={key}
                                    onClick={() =>
                                      handleDropdownMaxPassword(name)
                                    }
                                    className="block cursor-pointer border-b px-4 py-2 hover:bg-cyan-500 hover:text-white"
                                  >
                                    {name}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      </div>
                      {/* Minutes DROPDOWN */}
                      <div className="relative flex w-1/2 flex-col">
                        <label
                          htmlFor="minPassAge"
                          className="text-sm font-medium text-gray-700"
                        >
                          Min Password Age(Days)
                        </label>
                        <div
                          className="relative"
                          onClick={toggleDropdownMinPassword}
                          onMouseLeave={() => setMinPasswordAgeDropdown(false)}
                        >
                          <button
                            className="mt-1 flex w-full items-center justify-between rounded-md border border-gray-300 p-2"
                            id="minPassAge"
                            type="button"
                          >
                            {isEditMode
                              ? addPassword.minPassAge
                              : defaultMinPasswordText}
                            <FaAngleDown className="ml-2 text-gray-400" />
                          </button>
                          {minPasswordAgeDropdown && (
                            <div className="top-10.5 absolute z-10 w-full rounded-md border border-gray-300 bg-white">
                              <ul className="py-2 text-sm text-gray-700">
                                {minPassword.map(({ key, name }) => (
                                  <li
                                    key={key}
                                    onClick={() =>
                                      handleDropdownMinPassword(name)
                                    }
                                    className="block cursor-pointer border-b px-4 py-2 hover:bg-cyan-500 hover:text-white"
                                  >
                                    {name}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    {/* THIRD */}
                    <div className="flex space-x-4">
                      <div className="w1/2 flex flex-1 flex-col items-start justify-start gap-1">
                        <label
                          htmlFor="passwordNeverExp"
                          className="text-sm font-medium text-gray-700"
                        >
                          Password Never Expires
                        </label>
                        <input
                          type="checkbox"
                          name="passwordNeverExp"
                          className="flex h-5 w-5 justify-start px-1 py-1"
                          defaultChecked
                        />
                      </div>
                    </div>
                    {/* FOURTH */}
                    <div className="flex space-x-4">
                      <div className="w1/2 flex flex-1 gap-2">
                        <input
                          type="checkbox"
                          name="passwordNeverExp"
                          className="flex h-5 w-5 justify-start px-1 py-1"
                        />
                        <label
                          htmlFor="passwordNeverExp"
                          className="text-sm font-medium text-gray-700"
                        >
                          Force User To Change Password at next Login.
                        </label>
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

            {/* COMPLEOCITY */}
            {selectedId === 2 && (
              <>
                <div className="rounded-xl bg-white">
                  <h1 className="mt-3 rounded-t-xl bg-cyan-500 px-6 py-2 text-white">
                    Compleocity
                  </h1>

                  <div className="grid gap-2 px-3 py-3">
                    {/* FIRST */}
                    <div className="flex w-full space-x-4">
                      {/* FROM (Hours) DROPDOWN */}
                      <div className="relative flex w-1/2 flex-col">
                        <label
                          htmlFor="minPassLen"
                          className="text-sm font-medium text-gray-700"
                        >
                          Minimum Password Length
                        </label>
                        <div
                          className="relative"
                          onClick={toggleDropdownMinPassLen}
                          onMouseLeave={() =>
                            setMinPasswordLengthDropdown(false)
                          }
                        >
                          <button
                            className="mt-1 flex w-full items-center justify-between rounded-md border border-gray-300 p-2"
                            id="minPassLen"
                            type="button"
                          >
                            {isEditMode
                              ? addPassword.minPassLen
                              : defaultMinLengthPasswordText}
                            <FaAngleDown className="ml-2 text-gray-400" />
                          </button>
                          {minPasswordLengthDropdown && (
                            <div className="top-10.5 absolute z-10 w-full rounded-md border border-gray-300 bg-white">
                              <ul className="py-2 text-sm text-gray-700">
                                {minPwdLen.map(({ key, name }) => (
                                  <li
                                    key={key}
                                    onClick={() =>
                                      handleDropdownMinPassLen(name)
                                    }
                                    className="block cursor-pointer border-b px-4 py-2 hover:bg-cyan-500 hover:text-white"
                                  >
                                    {name}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      </div>
                      {/* Minutes DROPDOWN */}
                      <div className="relative flex w-1/2 flex-col">
                        <label
                          htmlFor="minCharClass"
                          className="text-sm font-medium text-gray-700"
                        >
                          Minimum Character Classes from the following four
                          Categories
                        </label>
                        <div
                          className="relative"
                          onClick={toggleDropdownMinCharClass}
                          onMouseLeave={() => setMinCharClassDropdown(false)}
                        >
                          <button
                            className="mt-1 flex w-full items-center justify-between rounded-md border border-gray-300 p-2"
                            id="minCharClass"
                            type="button"
                          >
                            {isEditMode
                              ? addPassword.minCharClass
                              : defaultMinCharClassText}
                            <FaAngleDown className="ml-2 text-gray-400" />
                          </button>
                          {minCharClassDropdown && (
                            <div className="top-10.5 absolute z-10 w-full rounded-md border border-gray-300 bg-white">
                              <ul className="py-2 text-sm text-gray-700">
                                {minCharClass.map(({ key, name }) => (
                                  <li
                                    key={key}
                                    onClick={() =>
                                      handleDropdownMinCharClass(name)
                                    }
                                    className="block cursor-pointer border-b px-4 py-2 hover:bg-cyan-500 hover:text-white"
                                  >
                                    {name}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    {/* SECOND */}
                    <h1 className="text-md mt-2 font-medium text-gray-700">
                      Required Alpha Character
                    </h1>
                    <div className="flex w-full space-x-4">
                      {/* FROM (Hours) DROPDOWN */}
                      <div className="relative flex w-1/2 flex-col">
                        <label
                          htmlFor="minUpperChar"
                          className="text-sm font-medium text-gray-700"
                        >
                          Minimum Uppercase character (A-Z)
                        </label>
                        <div
                          className="relative"
                          onClick={toggleDropdownMinUpper}
                          onMouseLeave={() => setMinUppCaseCharDropdown(false)}
                        >
                          <button
                            className="mt-1 flex w-full items-center justify-between rounded-md border border-gray-300 p-2"
                            id="minUpperChar"
                            type="button"
                          >
                            {isEditMode
                              ? addPassword.minUpperChar
                              : defaultMinUppCaseText}
                            <FaAngleDown className="ml-2 text-gray-400" />
                          </button>
                          {minUppCaseCharDropdown && (
                            <div className="top-10.5 absolute z-10 w-full rounded-md border border-gray-300 bg-white">
                              <ul className="py-2 text-sm text-gray-700">
                                {minUpper.map(({ key, name }) => (
                                  <li
                                    key={key}
                                    onClick={() => handleDropdownMinUpper(name)}
                                    className="block cursor-pointer border-b px-4 py-2 hover:bg-cyan-500 hover:text-white"
                                  >
                                    {name}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      </div>
                      {/* Minutes DROPDOWN */}
                      <div className="relative flex w-1/2 flex-col">
                        <label
                          htmlFor="minLowerChar"
                          className="text-sm font-medium text-gray-700"
                        >
                          Minimum Lowercase Characters (A-Z)
                        </label>
                        <div
                          className="relative"
                          onClick={toggleDropdownMinLower}
                          onMouseLeave={() => setMinLowCaseCharDropdown(false)}
                        >
                          <button
                            className="mt-1 flex w-full items-center justify-between rounded-md border border-gray-300 p-2"
                            id="minLowerChar"
                            type="button"
                          >
                            {isEditMode
                              ? addPassword.minLowerChar
                              : defaultMinLowCaseText}
                            <FaAngleDown className="ml-2 text-gray-400" />
                          </button>
                          {minLowCaseCharDropdown && (
                            <div className="top-10.5 absolute z-10 w-full rounded-md border border-gray-300 bg-white">
                              <ul className="py-2 text-sm text-gray-700">
                                {minLower.map(({ key, name }) => (
                                  <li
                                    key={key}
                                    onClick={() => handleDropdownMinLower(name)}
                                    className="block cursor-pointer border-b px-4 py-2 hover:bg-cyan-500 hover:text-white"
                                  >
                                    {name}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    {/* THIRD */}
                    <h1 className="text-md mt-2 font-medium text-gray-700">
                      Required Non Alpha Characters
                    </h1>
                    <div className="flex w-full space-x-4">
                      {/* FROM (Hours) DROPDOWN */}
                      <div className="relative flex w-1/2 flex-col">
                        <label
                          htmlFor="minNumericChar"
                          className="text-sm font-medium text-gray-700"
                        >
                          Minimum Numeric character (0-9)
                        </label>
                        <div
                          className="relative"
                          onClick={toggleDropdownMinNumeric}
                          onMouseLeave={() => setMinNumericCharDropdown(false)}
                        >
                          <button
                            className="mt-1 flex w-full items-center justify-between rounded-md border border-gray-300 p-2"
                            id="minNumericChar"
                            type="button"
                          >
                            {isEditMode
                              ? addPassword.minNumericChar
                              : defaultNumericCharText}
                            <FaAngleDown className="ml-2 text-gray-400" />
                          </button>
                          {minNumericCharDropdown && (
                            <div className="top-10.5 absolute z-10 w-full rounded-md border border-gray-300 bg-white">
                              <ul className="py-2 text-sm text-gray-700">
                                {minNumeric.map(({ key, name }) => (
                                  <li
                                    key={key}
                                    onClick={() =>
                                      handleDropdownMinNumeric(name)
                                    }
                                    className="block cursor-pointer border-b px-4 py-2 hover:bg-cyan-500 hover:text-white"
                                  >
                                    {name}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      </div>
                      {/* Minimum Special Characters (A-Z) */}
                      <div className="relative flex w-1/2 flex-col">
                        <label
                          htmlFor="minSpeChar"
                          className="text-sm font-medium text-gray-700"
                        >
                          Minimum Special Characters (A-Z)
                        </label>
                        <div
                          className="relative"
                          onClick={toggleDropdownMinSpecial}
                          onMouseLeave={() => setMinSpecialCharDropdown(false)}
                        >
                          <button
                            className="mt-1 flex w-full items-center justify-between rounded-md border border-gray-300 p-2"
                            id="minSpeChar"
                            type="button"
                          >
                            {isEditMode
                              ? addPassword.minSpeChar
                              : defaultSpecialCharText}
                            <FaAngleDown className="ml-2 text-gray-400" />
                          </button>
                          {minSpecialCharDropdown && (
                            <div className="top-10.5 absolute z-10 w-full rounded-md border border-gray-300 bg-white">
                              <ul className="py-2 text-sm text-gray-700">
                                {minSpecial.map(({ key, name }) => (
                                  <li
                                    key={key}
                                    onClick={() =>
                                      handleDropdownMinSpecial(name)
                                    }
                                    className="block cursor-pointer border-b px-4 py-2 hover:bg-cyan-500 hover:text-white"
                                  >
                                    {name}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mb-6 flex flex-col gap-2 py-3">
                    {/* MAIN CART */}

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
            {/* RESTRICTION */}
            {selectedId === 3 && (
              <>
                <div className="rounded-xl bg-white">
                  <h1 className="mt-3 rounded-t-xl bg-cyan-500 px-6 py-2 text-white">
                    Restriction
                  </h1>

                  <div className="mt-3 grid w-full gap-3 px-3 pb-3">
                    {/* FIRST */}
                    <div className="flex space-x-4">
                      <div className="w1/2 flex flex-1 flex-col items-start justify-start gap-1">
                        <label
                          htmlFor="validAlways"
                          className="text-sm font-medium text-gray-700"
                        >
                          Disallow username in password
                        </label>
                        <input
                          type="checkbox"
                          name="validAlways"
                          className="flex h-5 w-5 justify-start px-1 py-1"
                        />
                      </div>
                    </div>
                    {/* SECOND */}
                    <div className="flex space-x-4">
                      <div className="w1/2 flex flex-1 flex-col items-start justify-start gap-1">
                        <label
                          htmlFor="validAlways"
                          className="text-sm font-medium text-gray-700"
                        >
                          Disallow digit as first character in password
                        </label>
                        <input
                          type="checkbox"
                          name="validAlways"
                          className="flex h-5 w-5 justify-start px-1 py-1"
                        />
                      </div>
                    </div>
                    {/* THIRD */}
                    <div className="flex space-x-4">
                      <div className="w1/2 flex flex-1 flex-col items-start justify-start gap-1">
                        <label
                          htmlFor="validAlways"
                          className="text-sm font-medium text-gray-700"
                        >
                          Disallow parts of the user’s full name that exceed two
                          consecutive character in the password
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
                      <div className="w1/2 flex flex-1 flex-col items-start justify-start gap-1">
                        <label
                          htmlFor="validAlways"
                          className="text-sm font-medium text-gray-700"
                        >
                          Exclude Keywords in password
                        </label>
                        <input
                          type="checkbox"
                          name="validAlways"
                          className="flex h-5 w-5 justify-start px-1 py-1"
                        />
                      </div>
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
              </>
            )}
            {/* HISTORIC PASSWORD */}
            {selectedId === 4 && (
              <>
                <div className="rounded-xl bg-white">
                  <h1 className="mt-3 rounded-t-xl bg-cyan-500 px-6 py-2 text-white">
                    Historic Password
                  </h1>
                  <div className="mb-6 flex flex-col gap-2 py-3">
                    {/* MAIN CART */}
                    <div className="grid w-full gap-2 px-3 pb-3">
                      <div className="flex space-x-4">
                        {/* ENABLE */}
                        <div className="flex w-1/2 flex-col">
                          <label
                            htmlFor="enable"
                            className="text-sm font-medium text-gray-700"
                          >
                            Enable Save Historic Password
                          </label>
                          <input
                            type="checkbox"
                            name="enable"
                            className="flex h-5 w-5 justify-start px-1 py-1"
                          />
                        </div>
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
            {/* ACCOUNT LOCK */}
            {selectedId === 5 && (
              <>
                <div className="rounded-xl bg-white">
                  <h1 className="mt-3 rounded-t-xl bg-cyan-500 px-6 py-2 text-white">
                    Account Lock
                  </h1>
                  <div className="mb-6 flex flex-col gap-2 py-3">
                    {/* MAIN CART */}
                    <div className="grid w-full gap-2 px-3 pb-3">
                      <div className="flex space-x-4">
                        {/* ENABLE */}
                        <div className="flex w-1/2 flex-col">
                          <label
                            htmlFor="enable"
                            className="text-sm font-medium text-gray-700"
                          >
                            Enable Account Lock
                          </label>
                          <input
                            type="checkbox"
                            name="enable"
                            className="flex h-5 w-5 justify-start px-1 py-1"
                          />
                        </div>
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
            {/* PREFERENCES */}
            {selectedId === 6 && (
              <>
                <div className="rounded-xl bg-white">
                  <h1 className="mt-3 rounded-t-xl bg-cyan-500 px-6 py-2 text-white">
                    Preferences
                  </h1>
                  <div className="mb-6 flex flex-col gap-2 py-3">
                    {/* MAIN CART */}
                    <div className="grid w-full gap-2 px-3 pb-3">
                      <div className="flex space-x-4">
                        {/* ENABLE */}
                        <div className="flex w-1/2 flex-col">
                          <label
                            htmlFor="enable"
                            className="text-sm font-medium text-gray-700"
                          >
                            Enable Notification on password chenged
                          </label>
                          <input
                            type="checkbox"
                            name="enable"
                            className="flex h-5 w-5 justify-start px-1 py-1"
                          />
                        </div>
                      </div>
                      {/* SECOND */}
                      <div className="flex w-1/2 flex-col">
                        <div className="flex w-1/2 flex-col">
                          <label
                            htmlFor="enable"
                            className="text-sm font-medium text-gray-700"
                          >
                            Logout user on password changed
                          </label>
                          <input
                            type="checkbox"
                            name="enable"
                            className="flex h-5 w-5 justify-start px-1 py-1"
                          />
                        </div>
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
        <PasswordPolicyTable />
      ) : activeComponent === "Add" ? (
        <AddPasswordPolicy />
      ) : activeComponent === "Update" ? (
        <UpdatePasswordPolicy />
      ) : (
        ""
      )}
    </>
  );
}
