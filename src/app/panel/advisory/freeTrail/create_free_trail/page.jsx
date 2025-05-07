"use client";

//react
import Link from "next/link";
import { useRouter } from "next/navigation";
//react
import { useState, useEffect } from "react";

//reactIcon
import { FaAngleDown } from "react-icons/fa";

//reactPackages
import { useParams } from "next/navigation";

//external Packages
import axios from "axios";
import ReactQuill from "react-quill";

//textBox
import "react-quill/dist/quill.snow.css";

//API-Keywords
import { tenant_base_url, protocal_url } from "@/Config/Config";

import { getHostnamePart } from "@/components/GlobalHostUrl";

//LanguageDropDown
import languageDropDown from "../../../../data/dropdown/Languages/languageDropdown";

//dropDown --->>> customHooks
import useManagedBy from "@/Hooks/ManagedBy/useManagedBy";
import useSegment from "@/Hooks/Segment/useSegment";
import { ToastContainer } from "react-toastify";

export default function CreateTrial() {
  //to make id unique
  const { id } = useParams();
 const router = useRouter();

  const { managedBy } = useManagedBy();
  const { segments } = useSegment();

  const name = getHostnamePart();
   //--------------------------------------- Set Business Type --------------------------------------------
         const [BusinessType, setBusinessType] = useState("");
          
         useEffect(() => {
           const storedType = localStorage.getItem("businessType") || "";
           setBusinessType(storedType);
         }, []);

  //form description is kept-out
  const [description, setdescription] = useState("Add Text Here");

  const [isEditMode, setIsEditMode] = useState(false);
  const [editTrail, setEditTrail] = useState({
    id: "",
    leadId: "",
    name: "",
    language: "",
    mobileNo: "",
    phoneNo: "",
    email: "",
    assigned_To: "",
    trialStartDate: "",
    trialEndDate: "",
    call_bck_DateTime: "",
    lastModifiedBy: "",
    segments: [],
  });

  useEffect(() => {
    handleFreeTrail(); // Fetch lead data for editing
  }, [id]);

  //GET by ID---------------------------//GET---------------------------//GET---------------------------by ID-----------by ID
  async function handleFreeTrail() {
    const bearer_token = localStorage.getItem("token");
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${bearer_token}`,
        },
      };
      const response = await axios.get(
        `${protocal_url}${name}.${tenant_base_url}/Trail/getbyid/${id}`,
        config,
      );
      const data = response.data.data;
      setdescription(data.description);
      setEditTrail({
        id: data.id || "",
        leadId: data.leadId || "",
        name: data.name || "",
        language: data.language || "",
        mobileNo: data.mobileNo || "",
        phoneNo: data.phoneNo || "",
        email: data.email || "",
        assigned_To: data.assigned_To || "",
        call_bck_DateTime: data.call_bck_DateTime || "",
        segments: data.segments || [],
        trialStartDate: data.trialStartDate || "",
        trialEndDate: data.trialEndDate || "",
        lastModifiedBy: data.lastModifiedBy || "",
      });
    } catch (error) {
      console.error("Error fetching Trail:", error);
    }
  }

  //----------------------------------------------------------------------------------------

  //--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

  useEffect(() => {
    setdefaultTextSegmentDropDown(
      editTrail.segments.length > 0
        ? editTrail.segments.join(", ")
        : "Select Segment",
    );
  }, [editTrail]);

  const [defaultTextSegmentDropDown, setdefaultTextSegmentDropDown] =
    useState("Select Segment");
  const [isDropdownVisibleSegment, setisDropdownVisibleSegment] =
    useState(false);

  const toggleDropdownSegment = () => {
    setisDropdownVisibleSegment(true);
  };

  const handleCheckboxChange = (segment) => {
    const isChecked = editTrail.segments.includes(segment);

    let updatedSegments;
    if (isChecked) {
      // Remove segment if already selected
      updatedSegments = editTrail.segments.filter(
        (selectedSegment) => selectedSegment !== segment,
      );
    } else {
      // Add segment if not already selected
      updatedSegments = [...editTrail.segments, segment];
    }
    setEditTrail((prev) => ({
      ...prev,
      segments: updatedSegments,
    }));

    setdefaultTextSegmentDropDown(
      updatedSegments.length > 0
        ? updatedSegments.join(", ")
        : "Select Segment",
    );

    console.log("Selected segments:", updatedSegments);
  };

  //--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  //---------------------------> Assigned To <---------------------------

  const [defaultTextassigned_ToDropDown, setdefaultTextassigned_ToDropDown] =
    useState("Select Assigned");
  const [isDropdownassigned_ToDropDown, setisDropdownassigned_ToDropDown] =
    useState(false);

  const toggleDropdownassigned_ToDropDown = () => {
    setisDropdownassigned_ToDropDown(!isDropdownassigned_ToDropDown);
  };

  const handleDropdownassigned_ToDropDown = (
    assigned_To_Username,
    assigned_To_Role,
  ) => {
    setdefaultTextassigned_ToDropDown(
      assigned_To_Username + " " + assigned_To_Role,
    );
    setisDropdownassigned_ToDropDown(!isDropdownassigned_ToDropDown);
    setEditTrail((prevTask) => ({
      ...prevTask,
      assigned_To: assigned_To_Username,
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditTrail((prevTask) => ({
      ...prevTask,
      [name]: value,
    }));
  };

  //---------->handleSubmit<----------
  //two different models one for PUT and one for POST
  const [errors, setErrors] = useState({});

  const handleSubmit = async (event) => {
    event.preventDefault();
    const bearer_token = localStorage.getItem("token");

    const errors = {};

    // VALIDATION
    if (
      !editTrail.mobileNo ||
      isNaN(editTrail.mobileNo) ||
      editTrail.mobileNo.trim() === ""
    ) {
      errors.mobileNo = "Enter a valid mobile number";
    } else if (!editTrail.segments) {
      errors.segments = "Segments are required";
    } else if (!editTrail.trialStartDate) {
      errors.trialStartDate = "Enter trail start date";
    } else if (!editTrail.trialEndDate) {
      errors.trialEndDate = "Enter trail end date";
    }

    if (Object.keys(errors).length > 0) {
      setErrors(errors);
      return;
    }

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${bearer_token}`,
          "Content-Type": "application/json",
        },
      };
      const formData_PUT = {
        id: editTrail.id,
        leadId: editTrail.leadId,
        name: editTrail.name,
        language: editTrail.language,
        email: editTrail.email,
        mobileNo: editTrail.mobileNo,
        phoneNo: editTrail.phoneNo,
        assigned_To: editTrail.assigned_To,
        segments: editTrail.segments,
        trialStartDate: editTrail.trialStartDate || null,
        trialEndDate: editTrail.trialEndDate || null,
        trading_yrs: editTrail.tradingYears,
        call_bck_DateTime: editTrail.call_bck_DateTime || null,
        contactID: editTrail.contactId,
        lastModifiedBy: editTrail.lastModifiedBy,
        //----------------//
        description: description,
      };

      await axios.put(
        `${protocal_url}${name}.${tenant_base_url}/Trail/update`,
        formData_PUT,
        config,
      );
      alert("Free Trail updated successfully!");
      router.push(`/panel/${BusinessType}/freeTrail`);

      // Redirect after a short delay
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred. Please try again.");
    }
  };

  //----------------------------------------------------------------------------------------
  //LanguageDropDown
  const [defaultTextLanguageDropDown, setDefaultTextLanguageDropDown] =
    useState("Select Language");
  const [isDropdownVisibleLanguage, setisDropdownVisibleLanguage] =
    useState(false);

  const toggleDropdownLanguage = () => {
    setisDropdownVisibleLanguage(!isDropdownVisibleLanguage);
  };

  const handleDropdownLanguage = (language) => {
    setDefaultTextLanguageDropDown(language);
    setisDropdownVisibleLanguage(false);
    setEditTrail((prevTask) => ({
      ...prevTask,
      language: language,
    }));
  };

  return (
    <>
      <ToastContainer />
      {/* ------------------------------------------------> Parent <------------------------------------------------ */}
      <div className="mt-3">
        {/* ------------------------------------------------> Heading  <------------------------------------------------ */}
        <div className="mx-3 flex justify-between rounded border bg-white p-3">
          {/* ------------------------------------------------> Text and Logo  <------------------------------------------------ */}
          <div className="flex items-center justify-center gap-3">
            <h1 className="text-xl">Edit Free Trail</h1>
          </div>
          <div>
            {/* ------------------------------------------------> Cancel Button  <------------------------------------------------ */}
            <Link
              to={`/panel/${BusinessType}/freeTrail`}
              className="rounded border border-blue-500 px-4 py-1 text-blue-500 sm:px-6"
            >
              Cancel
            </Link>
          </div>
        </div>

        {/* -------------FORM Starts FROM HERE------------- */}
        <form onSubmit={handleSubmit} className="mb-6 flex">
          {/* ------------------------------------------------> FORM PARENT includes 4 tabs <------------------------------------------------ */}
          <div className="w-screen">
            <div className="m-3 rounded-xl bg-white shadow-md">
              <h2 className="rounded-t-xl bg-cyan-500 px-4 py-2 font-medium text-white">
                Free Trail Information
              </h2>

              {/* -------------Free Trail INFORMATION STARTS FROM HERE------------- */}
              <div className="space-y-3 p-2">
                {/* -------------1------------- */}
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-4">
                  {/* -------------Lead ID------------- */}
                  <div className="relative flex flex-col">
                    <label
                      htmlFor="leadId"
                      className="text-sm font-medium text-gray-700"
                    >
                      Lead ID
                    </label>
                    <input
                      type="text"
                      name="leadId"
                      value={editTrail.leadId}
                      onChange={handleChange}
                      className="mt-1 w-full rounded-md border border-gray-300 p-2"
                    />
                  </div>

                  {/* -------------Language------------- */}
                  <div className="relative flex flex-col">
                    <label
                      htmlFor="name"
                      className="text-sm font-medium text-gray-700"
                    >
                      Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={editTrail.name}
                      onChange={handleChange}
                      className="mt-1 w-full rounded-md border border-gray-300 p-2"
                    />
                  </div>
                </div>
                {/* -------------2------------- */}

                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-4">
                  {/* -------------Language------------- */}
                  <div className="relative flex flex-col">
                    <label
                      htmlFor="language"
                      className="text-sm font-medium text-gray-700"
                    >
                      Language
                    </label>
                    <div
                      className="relative"
                      onClick={toggleDropdownLanguage}
                      onMouseLeave={() => setisDropdownVisibleLanguage(false)}
                    >
                      <button
                        className="mt-1 flex w-full items-center justify-between rounded-md border border-gray-300 p-2"
                        id="LanguageDropDown"
                        type="button"
                      >
                        {!isEditMode
                          ? defaultTextLanguageDropDown
                          : setEditTrail.language === ""
                            ? defaultTextLanguageDropDown
                            : setEditTrail.language}
                        <FaAngleDown className="ml-2 text-gray-400" />
                      </button>
                      {isDropdownVisibleLanguage && (
                        <div className="top-10.5 absolute z-10 w-full rounded-md border border-gray-300 bg-white">
                          <ul className="py-2 text-sm text-gray-700">
                            {languageDropDown.map(({ key, name }) => (
                              <li
                                key={key}
                                onClick={() => handleDropdownLanguage(name)}
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
                  {/* ------------- Mobile Number------------- */}
                  <div className="relative flex flex-col">
                    <label
                      htmlFor="mobileNo"
                      className="text-sm font-medium text-gray-700"
                    >
                      Mobile Number
                    </label>
                    <input
                      type="text"
                      name="mobileNo"
                      value={editTrail.mobileNo}
                      className="mt-1 w-full rounded-md border border-gray-300 p-2"
                      onChange={handleChange}
                      placeholder="Enter your Mobile Number"
                    />
                    {errors.mobileNo && (
                      <span style={{ color: "red" }}>{errors.mobileNo}</span>
                    )}
                  </div>
                </div>
                {/* -------------3------------- */}
                {/* -------------Alternate Number------------- */}
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-4">
                  <div className="relative flex flex-col">
                    <label
                      htmlFor="phoneNo"
                      className="text-sm font-medium text-gray-700"
                    >
                      Alternate Number
                    </label>
                    <input
                      type="text"
                      name="phoneNo"
                      value={editTrail.phoneNo}
                      className="mt-1 w-full rounded-md border border-gray-300 p-2"
                      onChange={handleChange}
                      placeholder="Enter your Alternate Number"
                    />
                  </div>

                  {/* -------------Email------------- */}
                  <div className="relative flex flex-col">
                    <label
                      htmlFor="email"
                      className="text-sm font-medium text-gray-700"
                    >
                      Email
                    </label>
                    <input
                      type="text"
                      name="email"
                      value={editTrail.email}
                      className="mt-1 w-full rounded-md border border-gray-300 p-2"
                      onChange={handleChange}
                      placeholder="Enter your Email"
                    />
                  </div>
                </div>

                {/* -------------4------------- */}
                {/* -----------Assigned To------------- */}
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-4">
                  <div className="relative flex flex-col">
                    <label
                      htmlFor=" AssignedTo"
                      className="text-sm font-medium text-gray-700"
                    >
                      Assigned To
                    </label>
                    <div
                      className="relative"
                      onClick={toggleDropdownassigned_ToDropDown}
                      onMouseLeave={() =>
                        setisDropdownassigned_ToDropDown(false)
                      }
                    >
                      <button
                        className="mt-1 flex w-full items-center justify-between rounded-md border border-gray-300 p-2"
                        id="LeadStatusDropDown"
                        type="button"
                      >
                        {editTrail.assigned_To === ""
                          ? editTrail.assigned_To
                          : defaultTextassigned_ToDropDown}
                        <FaAngleDown className="ml-2 text-gray-400" />
                      </button>
                      {isDropdownassigned_ToDropDown && (
                        <div className="absolute top-11 z-10 w-full rounded-md border border-gray-300 bg-white">
                          <ul className="py-2 text-sm text-gray-700">
                            {managedBy.map(({ key, userName, role }) => (
                              <li
                                key={key}
                                onClick={() =>
                                  handleDropdownassigned_ToDropDown(
                                    userName,
                                    role,
                                  )
                                }
                                className="block cursor-pointer border-b px-4 py-2 hover:bg-cyan-500 hover:text-white"
                              >
                                {userName}-({role})
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                  {/* -------------Segments------------- */}
                  <div className="relative flex flex-col">
                    <label
                      htmlFor="segment"
                      className="text-sm font-medium text-gray-700"
                    >
                      Segment
                    </label>
                    <div
                      className="relative"
                      onClick={toggleDropdownSegment}
                      onMouseLeave={() => setisDropdownVisibleSegment(false)}
                    >
                      <button
                        id="segemntDropDown"
                        type="button"
                        className="mt-1 flex w-full items-center justify-between rounded-md border border-gray-300 p-2"
                      >
                        {defaultTextSegmentDropDown}
                        <FaAngleDown className="ml-2 text-gray-400" />
                      </button>
                      {isDropdownVisibleSegment && (
                        <div className="absolute top-11 z-10 w-full rounded-md border border-gray-300 bg-white">
                          <ul className="py-2 text-sm text-gray-700">
                            {segments?.length > 0 ? (
                              segments.map(({ key, segment }) => (
                                <li
                                  key={key}
                                  className="flex cursor-pointer items-center border-b px-4 py-2 hover:bg-cyan-500 hover:text-white"
                                >
                                  <input
                                    type="checkbox"
                                    checked={editTrail.segments?.includes(
                                      segment,
                                    )}
                                    onChange={() =>
                                      handleCheckboxChange(segment)
                                    }
                                    className="mr-2"
                                  />
                                  {segment}
                                </li>
                              ))
                            ) : (
                              <li className="flex items-center gap-1 px-4 py-2 text-center">
                                <IoInformationCircle
                                  size={25}
                                  className="text-cyan-600"
                                />{" "}
                                Segments not available. Go to{" "}
                                <span className="font-bold">
                                  Settings - Add Segment{" "}
                                </span>
                                .
                              </li>
                            )}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                {/* -------------5------------- */}
                {/* -------------Trail Start Date------------- */}
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-4">
                  <div className="relative flex flex-col">
                    <label
                      htmlFor="trialStartDate"
                      className="text-sm font-medium text-gray-700"
                    >
                      Trail Start Date
                    </label>
                    <input
                      type="date"
                      name="trialStartDate"
                      value={editTrail.trialStartDate.split("T")[0]}
                      className="mt-1 w-full rounded-md border border-gray-300 p-2"
                      onChange={handleChange}
                    />
                    {errors.trialStartDate && (
                      <span style={{ color: "red" }}>
                        {errors.trialStartDate}
                      </span>
                    )}
                  </div>
                  {/* -------------Trail End Date------------- */}
                  <div className="relative flex flex-col">
                    <label
                      htmlFor="trialEndDate"
                      className="text-sm font-medium text-gray-700"
                    >
                      Trail End Date
                    </label>
                    <input
                      type="date"
                      name="trialEndDate"
                      value={editTrail.trialEndDate.split("T")[0]}
                      onChange={handleChange}
                      className="mt-1 w-full rounded-md border border-gray-300 p-2"
                    />
                    {errors.trialEndDate && (
                      <span style={{ color: "red" }}>
                        {errors.trialEndDate}
                      </span>
                    )}
                  </div>
                </div>
                {/* -------------6------------- */}
                {/* -------------CallBack DateTime------------- */}
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-4">
                  <div className="relative flex flex-col">
                    <label
                      htmlFor="callBackDateTime"
                      className="text-sm font-medium text-gray-700"
                    >
                      CallBack DateTime
                    </label>
                    <input
                      type="date"
                      name="callBackDateTime"
                      value={editTrail.call_bck_DateTime.split("T")[0]}
                      onChange={handleChange}
                      className="mt-1 w-full rounded-md border border-gray-300 p-2"
                    />
                  </div>
                  {/* ------------Last Modified By------------- */}
                  <div className="relative flex flex-col">
                    <label
                      htmlFor="lastModifiedBy"
                      className="text-sm font-medium text-gray-700"
                    >
                      Last Modified By
                    </label>
                    <input
                      type="text"
                      name="lastModifiedBy"
                      value={editTrail.lastModifiedBy}
                      className="mt-1 w-full rounded-md border border-gray-300 p-2"
                      onChange={handleChange}
                      placeholder="Enter details"
                    />
                  </div>
                </div>
              </div>
            </div>
            {/* -------------Description Information------------- */}
            <div className="mx-3 mb-6 rounded-xl bg-white shadow-md">
              <h2 className="rounded-t-xl bg-cyan-500 px-4 py-2 font-medium text-white">
                Description Information
              </h2>
              <div className="p-2">
                <div className="flex flex-col">
                  <label
                    htmlFor="description"
                    className="text-sm font-medium text-gray-700"
                  >
                    Description
                  </label>
                  <ReactQuill
                    name="description"
                    value={description}
                    className="mt-1 h-60 max-h-full hyphens-auto text-balance"
                    theme="snow"
                    onChange={setdescription}
                    placeholder="Add Description"
                  />
                </div>
              </div>
              <div className="flex justify-end px-2">
                <button
                  type="submit"
                  className="mb-3 mt-20 rounded border-2 border-cyan-500 bg-cyan-500 px-32 py-4 text-white hover:bg-white hover:text-cyan-500"
                >
                  {isEditMode ? "Update" : "Save"}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}
