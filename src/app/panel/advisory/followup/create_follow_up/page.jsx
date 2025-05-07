"use client";

//react
import Link from "next/link";
import { useRouter } from "next/navigation";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { FaAngleDown } from "react-icons/fa";
import ReactQuill from "react-quill";
import { IoInformationCircle } from "react-icons/io5";
import axios from "axios";

import { tenant_base_url, protocal_url } from "@/Config/Config";

import { getHostnamePart } from "@/components/GlobalHostUrl";

const CreateFollowUp = () => {
  const { id } = useParams();
  const bearer_token = localStorage.getItem("token");
  const name = getHostnamePart();
 const router = useRouter();

   //--------------------------------------- Set Business Type --------------------------------------------
         const [BusinessType, setBusinessType] = useState("");
          
         useEffect(() => {
           const storedType = localStorage.getItem("businessType") || "";
           setBusinessType(storedType);
         }, []);

  const [isEditMode, setIsEditMode] = useState(false);
  const [followupsData, setFollowupsData] = useState({
    id: "",
    leadId: "",
    name: "",
    language: "",
    mobileNo: "",
    phoneNo: "",
    email: "",
    assigned_To: "",
    segments: [],
    call_bck_DateTime: "",
    lastModifiedBy: "",
    leadesStatus: "",
  });

  const [description, setDescription] = useState(""); // For Quill editor

  // Fetch Data by ID
  useEffect(() => {
    fetchDataById();
  }, [id, bearer_token, name]);

  // Function to fetch data by ID
  const fetchDataById = async () => {
    const config = {
      headers: {
        Authorization: `Bearer ${bearer_token}`,
      },
    };

    try {
      const response = await axios.get(
        `${protocal_url}${name}.${tenant_base_url}/FollowUp/getbyid/${id}`,
        config,
      );

      if (response.status === 200 && response.data.isSuccess) {
        const followup = response.data.data;
        setFollowupsData({
          id: followup.id,
          leadId: followup.leadId || "",
          name: followup.name || "",
          language: followup.language || "",
          mobileNo: followup.mobileNo || "",
          phoneNo: followup.phoneNo || "",
          email: followup.email || "",
          assigned_To: followup.assigned_To || "",
          segments: followup.segments || [],
          call_bck_DateTime: followup.call_bck_DateTime || "",
          lastModifiedBy: followup.lastModifiedBy || "",
          leadesStatus: followup.leadesStatus || "",
        });
        // Set description in Quill editor
        setDescription(followup.description || "");
      }
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  };

  // Handle Input Change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFollowupsData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const bearer_token = localStorage.getItem("token");
    if (!bearer_token) {
      alert("No token found, please log in again.");
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
        id: followupsData.id,
        leadId: followupsData.leadId,
        name: followupsData.name,
        language: followupsData.language,
        mobileNo: followupsData.mobileNo,
        phoneNo: followupsData.phoneNo,
        email: followupsData.email,
        assigned_To: followupsData.assigned_To,
        segments: followupsData.segments,
        call_bck_DateTime: followupsData.call_bck_DateTime,
        lastModifiedBy: followupsData.lastModifiedBy,
        leadesStatus: followupsData.leadesStatus,
        description: description,
      };

      // Log the URL and payload for debugging
      console.log(
        "PUT URL:",
        `${protocal_url}${name}.${tenant_base_url}/FollowUp/update`,
      );
      console.log("formData_PUT:", formData_PUT);

      // Make the PUT request
      await axios.put(
        `${protocal_url}${name}.${tenant_base_url}/FollowUp/update`,
        formData_PUT,
        config,
      );

      alert("Follow updated successfully!");
      router.push(`/panel/${BusinessType}/followup`);
    } catch (error) {
      // Log the detailed error response
      console.error("Error response:", error.response);

      if (error.response && error.response.data && error.response.data.errors) {
        const validationErrors = error.response.data.errors;
        console.error("Validation errors:", validationErrors);

        // Create a readable error message from the validation errors
        let errorMessage = "Validation errors:\n";
        for (const field in validationErrors) {
          if (validationErrors.hasOwnProperty(field)) {
            errorMessage += `${field}: ${validationErrors[field].join(", ")}\n`;
          }
        }
        alert(errorMessage);
      } else {
        alert("An error occurred. Please try again.");
      }
    }
  };

  // ......................... Segment.....................................

  const [segments, setSegments] = useState([]);

  // Segment GET API Is being used here
  async function handleSegment() {
    const bearer_token = localStorage.getItem("token");

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${bearer_token}`,
        },
      };
      const response = await axios.get(
        `${protocal_url}${name}.${tenant_base_url}/Admin/segment/getall`,
        config,
      );
      setSegments(response.data.data);
      // console.log("segment:", response.data.data);
    } catch (error) {
      console.error("Error fetching segments:", error);
    }
  }

  useEffect(() => {
    handleSegment();
    setdefaultTextSegmentDropDown(
      followupsData.segments.length > 0
        ? followupsData.segments.join(", ")
        : "Select Segment",
    );
  }, [followupsData]);

  const [defaultTextSegmentDropDown, setdefaultTextSegmentDropDown] =
    useState("Select Segment");
  const [isDropdownVisibleSegment, setisDropdownVisibleSegment] =
    useState(false);

  const toggleDropdownSegment = () => {
    setisDropdownVisibleSegment(true);
  };

  const handleCheckboxChange = (segment) => {
    const isChecked = followupsData.segments.includes(segment.segment);

    let updatedSegments;
    if (isChecked) {
      // Remove segment if already selected
      updatedSegments = followupsData.segments.filter(
        (selectedSegment) => selectedSegment !== segment.segment,
      );
    } else {
      // Add segment if not already selected
      updatedSegments = [...followupsData.segments, segment.segment];
    }

    // Update followupsData with new segments array
    setFollowupsData((prev) => ({
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

  // Segment GET API Is being used here

  //----------------------------------------------------------------------------------------
  //assigned_ToDropDown
  const [assigned_ToDropDown, setassigned_ToDropDown] = useState([]);

  async function handleAssigned_To() {
    const bearer_token = localStorage.getItem("token");

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${bearer_token}`,
        },
      };
      const response = await axios.get(
        `${protocal_url}${name}.${tenant_base_url}/Setting/Alluser`,
        config,
      );
      setassigned_ToDropDown(response.data);
    } catch (error) {
      console.error("Error fetching leads:", error);
      // Optionally, set an error state to display a user-friendly message
    }
  }

  useEffect(() => {
    handleAssigned_To();
  }, []);

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
    setFollowupsData((prevTask) => ({
      ...prevTask,
      assigned_To: assigned_To_Username,
    }));
  };

  //----------------------------------------------------------------------------------------
  //LanguageDropDown

  const LanguageDropDown = [
    { key: 1, name: "English" },
    { key: 2, name: "Portuguese" },
    { key: 3, name: "Hindi" },
    { key: 4, name: "Arabic" },
    { key: 5, name: "Japanese" },
  ];

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
    setFollowupsData((prevTask) => ({
      ...prevTask,
      language: language,
    }));
  };

  //----------------------------------------------------------------------------------------
  //LeadStatusDropDown GET API Is being used here
  const [leadStatus, setleadStatus] = useState("");

  async function handleLeadStatus() {
    const bearer_token = localStorage.getItem("token");

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${bearer_token}`,
        },
      };
      const response = await axios.get(
        `${protocal_url}${name}.${tenant_base_url}/Admin/leadstatus/getall`,
        config,
      );
      setleadStatus(response.data.data);
    } catch (error) {
      console.error("Error fetching leads:", error);
      // Optionally, set an error state to display a user-friendly message
    }
  }

  useEffect(() => {
    handleLeadStatus();
  }, []);

  const [defaultTextLeadStatusDropDown, setdefaultTextLeadStatusDropDown] =
    useState("Select Status");
  const [isDropdownVisibleLeadStatus, setisDropdownVisibleLeadStatus] =
    useState(false);

  const toggleDropdownLeadStatus = () => {
    setisDropdownVisibleLeadStatus(!isDropdownVisibleLeadStatus);
  };

  const handleDropdownLeadStatus = (leadStatus) => {
    setdefaultTextLeadStatusDropDown(leadStatus);
    setisDropdownVisibleLeadStatus(!isDropdownVisibleLeadStatus);
    setFollowupsData((prevTask) => ({
      ...prevTask,
      leadesStatus: leadStatus,
    }));
  };

  return (
    <>
      {/* TOP PART */}
      <div className="m-3 flex items-center justify-between rounded-md bg-white px-3 py-2">
        <h1 className="text-xl">Edit Follow Up</h1>
        <Link href={`/panel/${BusinessType}/followup`}>
          <button className="rounded-md border border-blue-600 px-6 py-2 text-center text-sm text-blue-600">
            Cancel
          </button>
        </Link>
      </div>

      {/* FOLLOW-UP FORM */}
      <form onSubmit={handleSubmit}>
        <div className="m-3 shadow-lg">
          <h1 className="text-md rounded-t-lg bg-cyan-500 px-3 py-2 font-medium text-white">
            Follow Up Details
          </h1>
          <div className="rounded-b-xl bg-white px-1">
            <div className="grid gap-2 p-2">
              {/* FIRST ROW */}
              <div className="flex space-x-4">
                {/* LEAD ID FIELD */}
                <div className="flex w-1/2 flex-col">
                  <label
                    htmlFor="leadId"
                    className="text-sm font-medium text-gray-700"
                  >
                    Lead Id
                  </label>
                  <input
                    type="number"
                    name="leadId"
                    id="leadId"
                    value={followupsData.leadId}
                    className="mt-1 rounded-md border border-gray-300 p-2"
                    onChange={handleChange}
                    placeholder="Enter Lead Id"
                  />
                </div>
                {/* CLIENT NAME FIELD */}
                <div className="flex w-1/2 flex-col">
                  <label
                    htmlFor="name"
                    className="text-sm font-medium text-gray-700"
                  >
                    Client Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    value={followupsData.name}
                    className="mt-1 rounded-md border border-gray-300 p-2"
                    onChange={handleChange}
                    placeholder="Enter Client Name"
                  />
                </div>
              </div>
              {/* SECOND ROW */}
              <div className="flex space-x-4">
                {/* LANGUAGE FIELD */}
                <div className="relative flex w-1/2 flex-col">
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
                        : followupsData.language === ""
                          ? defaultTextLanguageDropDown
                          : followupsData.language}
                      <FaAngleDown className="ml-2 text-gray-400" />
                    </button>
                    {isDropdownVisibleLanguage && (
                      <div className="top-10.5 absolute z-10 w-full rounded-md border border-gray-300 bg-white">
                        <ul className="py-2 text-sm text-gray-700">
                          {LanguageDropDown.map(({ key, name }) => (
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
                {/* phoneNo FIELD */}
                <div className="flex w-1/2 flex-col">
                  <label
                    htmlFor="phoneNo"
                    className="text-sm font-medium text-gray-700"
                  >
                    Alternate Number
                  </label>
                  <input
                    type="number"
                    name="phoneNo"
                    id="phoneNo"
                    value={followupsData.phoneNo}
                    className="mt-1 rounded-md border border-gray-300 p-2"
                    onChange={handleChange}
                    placeholder="Enter Alternate Number"
                  />
                </div>
              </div>
              {/* THIRD ROW */}
              <div className="flex space-x-4">
                {/* MOBILE NUMBER FIELD */}
                <div className="flex w-1/2 flex-col">
                  <label
                    htmlFor="mobileNo"
                    className="text-sm font-medium text-gray-700"
                  >
                    mobile Number
                  </label>
                  <input
                    type="number"
                    name="mobileNo"
                    id="mobileNo"
                    value={followupsData.mobileNo}
                    className="mt-1 rounded-md border border-gray-300 p-2"
                    onChange={handleChange}
                    placeholder="Enter Mobile Number"
                  />
                  {/* {errors.mobileNo && (
                    <span style={{ color: "red" }}>{errors.mobileNo}</span>
                  )} */}
                </div>
                {/* EMAIL FIELD */}
                <div className="flex w-1/2 flex-col">
                  <label
                    htmlFor="mobileNo"
                    className="text-sm font-medium text-gray-700"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    name="mobileNo"
                    id="mobileNo"
                    value={followupsData.email}
                    className="mt-1 rounded-md border border-gray-300 p-2"
                    onChange={handleChange}
                    placeholder="Enter E-Mail ID"
                  />
                </div>
              </div>
              {/* FOURTH ROW */}
              <div className="flex space-x-4">
                {/* ASSIGNED TO DROPDOWN */}
                <div className="flex w-1/2 flex-col">
                  <div className="w-1/1 relative flex flex-col">
                    <label
                      htmlFor="leadesStatus"
                      className="text-sm font-medium text-gray-700"
                    >
                      Assigned to
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
                        {followupsData.assigned_To === ""
                          ? defaultTextassigned_ToDropDown
                          : followupsData.assigned_To}

                        <FaAngleDown className="ml-2 text-gray-400" />
                      </button>
                      {isDropdownassigned_ToDropDown && (
                        <div className="absolute top-11 z-10 w-full rounded-md border border-gray-300 bg-white">
                          <ul className="py-2 text-sm text-gray-700">
                            {assigned_ToDropDown.map(
                              ({ key, userName, role }) => (
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
                              ),
                            )}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                {/* CALL BACK DATE FIELD */}
                <div className="flex w-1/2 flex-col">
                  <label
                    htmlFor="call_bck_DateTime"
                    className="text-sm font-medium text-gray-700"
                  >
                    Call Back Date
                  </label>
                  <input
                    type="datetime-local"
                    name="call_bck_DateTime"
                    id="call_bck_DateTime"
                    value={followupsData.call_bck_DateTime}
                    className="mt-1 rounded-md border border-gray-300 p-2"
                    onChange={handleChange}
                    min={new Date().toISOString().slice(0, 16)}
                  />
                </div>
              </div>
              {/* FIFTH ROW */}
              <div className="flex space-x-4">
                {/* LAST MODIFIED BY FIELD */}
                <div className="flex w-1/2 flex-col">
                  <label
                    htmlFor="lastModifiedBy"
                    className="text-sm font-medium text-gray-700"
                  >
                    Last Modified By
                  </label>
                  <input
                    type="Text"
                    name="lastModifiedBy"
                    id="lastModifiedBy"
                    value={followupsData.lastModifiedBy}
                    className="mt-1 rounded-md border border-gray-300 p-2"
                    onChange={handleChange}
                    placeholder="Who Modify"
                  />
                </div>
                {/* -------------Lead Status------------- */}

                <div className="relative flex w-1/2 flex-col">
                  <label
                    htmlFor="leadesStatus"
                    className="text-sm font-medium text-gray-700"
                  >
                    Lead Status
                  </label>
                  <div
                    className="relative"
                    onClick={toggleDropdownLeadStatus}
                    onMouseLeave={() => setisDropdownVisibleLeadStatus(false)}
                  >
                    <button
                      className="mt-1 flex w-full items-center justify-between rounded-md border border-gray-300 p-2"
                      id="LeadStatusDropDown"
                      type="button"
                    >
                      {followupsData.leadesStatus != ""
                        ? followupsData.leadesStatus
                        : defaultTextLeadStatusDropDown}
                      <FaAngleDown className="ml-2 text-gray-400" />
                    </button>
                    {isDropdownVisibleLeadStatus && (
                      <div className="top-10.5 absolute z-10 w-full rounded-md border border-gray-300 bg-white">
                        <ul className="py-2 text-sm text-gray-700">
                          {leadStatus.length > 0 ? (
                            leadStatus.map(({ key, status }) => (
                              <li
                                key={key}
                                onClick={() => handleDropdownLeadStatus(status)}
                                className="block cursor-pointer border-b px-4 py-2 hover:bg-cyan-500 hover:text-white"
                              >
                                {status}
                              </li>
                            ))
                          ) : (
                            <li className="flex items-center gap-1 px-4 py-2 text-center">
                              <IoInformationCircle
                                size={25}
                                className="text-cyan-600"
                              />{" "}
                              Lead status not available. Go to{" "}
                              <span className="font-bold">
                                Settings - Add Lead Status{" "}
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
              {/* Sixth ROW */}
              <div className="flex space-x-4">
                <div className="relative flex w-1/2 flex-col">
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
                      className="mt-1 flex w-full items-center justify-between rounded-md border border-gray-300 p-2"
                      id="LeadStatusDropDown"
                      type="button"
                    >
                      {defaultTextSegmentDropDown}
                      <FaAngleDown className="ml-2 text-gray-400" />
                    </button>
                    {isDropdownVisibleSegment && (
                      <div className="absolute top-11 z-10 w-full rounded-md border border-gray-300 bg-white">
                        <ul className="py-2 text-sm text-gray-700">
                          {segments.length > 0 ? (
                            segments.map((segment) => (
                              <li
                                key={segment.id}
                                className="flex cursor-pointer items-center border-b px-4 py-2 hover:bg-cyan-500 hover:text-white"
                              >
                                <input
                                  type="checkbox"
                                  checked={followupsData.segments.includes(
                                    segment.segment,
                                  )}
                                  onChange={() => handleCheckboxChange(segment)}
                                  className="mr-2"
                                />
                                {segment.segment}
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
            </div>
          </div>
        </div>
        {/* DESCRIPTION */}
        <div className="mx-3 mb-6 rounded-xl bg-white shadow-lg">
          <h2 className="rounded-t-xl bg-cyan-500 px-3 py-2 font-medium text-white">
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
                onChange={setDescription}
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
      </form>
    </>
  );
};

export default CreateFollowUp;
