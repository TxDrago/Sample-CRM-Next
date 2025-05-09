"use client";

//react
import Link from "next/link";
import { useRouter } from "next/navigation";

import { useState, useEffect } from "react";
//reactIcon->
import { FaAngleDown } from "react-icons/fa";
import { MdOutlineContactPhone } from "react-icons/md";
//reactPackages
import { useNavigate, useParams } from "react-router-dom";

//external Packages
import axios from "axios";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
//file
import { tenant_base_url, protocal_url } from "@/Config/Config";
//Images
import { getHostnamePart } from "@/components/GlobalHostUrl";
import {
  showErrorToast,
  showSuccessToast,
} from "@/utils/toastNotifications";
import { ToastContainer } from "react-toastify";

//LanguageDropDown
import languageDropDown from "@/components//dropdown/Languages/languageDropdown";

//dropDown --->>> customHooks
import useLeadStatus from "@/Hooks/LeadStatus/useLeadStatus";
import useLeadSource from "@/Hooks/LeadSource/useLeadSource";
import useManagedBy from "@/Hooks/ManagedBy/useManagedBy";
import useSegment from "@/Hooks/Segment/useSegment";

//------------------------------------------------------------------------------->CODE STARTS FROM HERE<-------------------------------------------------------------------------------
export default function CreateContact() {
  //to make id unique
  const { id } = useParams();
 const router = useRouter();
  const name = getHostnamePart();

  // Custom Hook
  const { leadStatus } = useLeadStatus();
  const { leadSource } = useLeadSource();
  const { managedBy } = useManagedBy();
  const { segments } = useSegment();

   //--------------------------------------- Set Business Type --------------------------------------------
         const [BusinessType, setBusinessType] = useState("");
          
         useEffect(() => {
           const storedType = localStorage.getItem("businessType") || "";
           setBusinessType(storedType);
         }, []);

  //form description is kept-out
  const [description, setdescription] = useState("Add Text Here");
  const [editLead, seteditLead] = useState({
    id: "",
    name: "",
    language: "",
    company: "",
    email: "",
    title: "",
    leadSource: "",
    leadesStatus: "",
    mobNo: "",
    phNo: "",
    assigned_To: "",
    street: "",
    pinCode: "",
    country: "",
    city: "",
    state: "",
    riskCapcity: "",
    tradingTime: "",
    tradingType: "",
    investmet: "",
    advisoryExp: "",
    trialStartDate: "",
    trialEndDate: "",
    tradingYears: "",
    callBackDateTime: "",
    contactId: "",
    lastModifiedBy: "",
    segments: [],
  });

  //----------------------------------------------------------------------------------------

  //imp to identify mode
  const [isEditMode, setIsEditMode] = useState(false);

  //auto search id-> if found isEditMode(true)
  useEffect(() => {
    if (id) {
      setIsEditMode(true);
      handleLead(); // Fetch lead data for editing
    }
  }, [id]);

  //GET by ID---------------------------//GET---------------------------//GET---------------------------by ID-----------by ID
  async function handleLead() {
    const bearer_token = localStorage.getItem("token");
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${bearer_token}`,
        },
      };
      const response = await axios.get(
        `${protocal_url}${name}.${tenant_base_url}/Contact/contact/${id}`,
        config,
      );
      const data = response.data.data;

      setdescription(data.description);

      seteditLead({
        id: data.id || "",
        name: data.name || "",
        language: data.language || "",
        company: data.company || "",
        title: data.tital || "",
        leadSource: data.leadsSource || "",
        leadesStatus: data.leadesStatus || "N/A",
        mobNo: data.mobileNo || "",
        phNo: data.phoneNo || "",
        email: data.email || "",
        assigned_To: data.assigned_To || "N/A",
        callBackDateTime: data.call_bck_DateTime || "",
        street: data.street || "",
        pinCode: data.postalCode || "",
        country: data.country || "",
        city: data.city || "",
        state: data.state || "",
        riskCapcity: data.risk_Capacity || "",
        tradingTime: data.tradingTime || "",
        tradingType: data.tradingType || "",
        investmet: data.investment || "",
        advisoryExp: data.advisaryExp || "",
        segments: data.segments || [],
        trialStartDate: data.trialStartDate || "",
        trialEndDate: data.trialEndDate || "",
        tradingYears: data.trading_yrs || "",
        contactId: data.contactId || "",
        lastModifiedBy: data.lastModifiedBy || "",
      });
    } catch (error) {
      showErrorToast("Error fetching leads:", error);
    }
  }

  //----------------------------------------------------------------------------------------
  //PooL / Lead Source ToDropDown
  // const [poolToDropDown, setPoolToDropDown] = useState([]);

  const [defaultTextPool, setDefaultTextPool] = useState("Select Lead Source");

  const [isPoolDropdownOpen, setIsPoolDropdownOpen] = useState(false);

  const [poolEdit, setPoolEdit] = useState("");

  const toggleDropdown = () => {
    setIsPoolDropdownOpen((prev) => !prev);
  };

  const handleDropdownSelection = (poolName) => {
    setIsPoolDropdownOpen(false);
    setDefaultTextPool(poolName);
    seteditLead((prev) => ({
      ...prev,
      leadSource: poolName,
    }));
    setPoolEdit(poolName);
  };

  //----------------------------------------------------------------------------------------
  //Lead Status ToDropDown

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
    seteditLead((prevTask) => ({
      ...prevTask,
      leadesStatus: leadStatus,
    }));
  };

  useEffect(() => {
    setdefaultTextSegmentDropDown(
      editLead.segments.length > 0
        ? editLead.segments.join(", ")
        : "Select Segment",
    );
  }, [editLead]);

  const [defaultTextSegmentDropDown, setdefaultTextSegmentDropDown] =
    useState("Select Segment");
  const [isDropdownVisibleSegment, setisDropdownVisibleSegment] =
    useState(false);

  const toggleDropdownSegment = () => {
    setisDropdownVisibleSegment(true);
  };

  const handleCheckboxChange = (segment) => {
    const isChecked = editLead.segments.includes(segment.segment);

    let updatedSegments;
    if (isChecked) {
      // Remove segment if already selected
      updatedSegments = editLead.segments.filter(
        (selectedSegment) => selectedSegment !== segment.segment,
      );
    } else {
      // Add segment if not already selected
      updatedSegments = [...editLead.segments, segment.segment];
    }
    seteditLead((prev) => ({
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
    seteditLead((prevTask) => ({
      ...prevTask,
      assigned_To: assigned_To_Username,
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    seteditLead((prevTask) => ({
      ...prevTask,
      [name]: value,
    }));
  };

  //------------------------------------------Mobile Regex------------------------------------------
  const handleContactChange = (event) => {
    const inputValue = event.target.value.replace(/[^0-9]/g, "");
    const { name } = event.target;

    seteditLead((prevState) => ({
      ...prevState,
      [name]: inputValue,
    }));
  };

  //------------------------------------------Email Regex------------------------------------------
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  //---------->handleSubmit<----------
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
        id: editLead.id,
        name: editLead.name,
        language: editLead.language,
        company: editLead.company,
        email: editLead.email,
        tital: editLead.title,
        leadsSource: editLead.leadSource,
        leadesStatus: editLead.leadesStatus,
        mobileNo: editLead.mobNo,
        phoneNo: editLead.phNo,
        assigned_To: editLead.assigned_To,
        street: editLead.street,
        postalCode: editLead.pinCode,
        country: editLead.country,
        city: editLead.city,
        state: editLead.state,
        risk_Capacity: editLead.riskCapcity,
        tradingTime: editLead.tradingTime,
        tradingType: editLead.tradingType,
        investment: editLead.investmet,
        advisaryExp: editLead.advisoryExp,
        segments: editLead.segments,
        trialStartDate: editLead.trialStartDate || null,
        trialEndDate: editLead.trialEndDate || null,
        trading_yrs: editLead.tradingYears,
        call_bck_DateTime: editLead.callBackDateTime || null,
        contactID: editLead.contactId,
        lastModifiedBy: editLead.lastModifiedBy,
        description: description,
      };

      if (!formData_PUT.name) {
        showErrorToast("Please enter name");
        return;
      }

      if (!formData_PUT.mobileNo) {
        showErrorToast("Please enter mobile");
        return;
      }

      if (
        formData_PUT.mobileNo.length < 9 ||
        formData_PUT.mobileNo.length > 15
      ) {
        showErrorToast("Invalid mobile number");
        return;
      }

      if (formData_PUT.email && !emailRegex.test(formData_PUT.email)) {
        showErrorToast("Invalid email format");
        return;
      }

      if (isEditMode) {
        await axios.put(
          `${protocal_url}${name}.${tenant_base_url}/Contact/contact/update`,
          formData_PUT,
          config,
        );
        showSuccessToast("Contact updated successfully!");
        router.push(`/panel/${BusinessType}/contact`);
      }
    } catch (error) {
      showErrorToast("An error occurred. Please try again.", error);
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
    seteditLead((prevTask) => ({
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
            <MdOutlineContactPhone size={25} />
            <h1 className="text-xl">
              <h1>Edit Contact</h1>
            </h1>
          </div>

          {/* ------------------------------------------------> Cancel Button  <------------------------------------------------ */}
          <div>
            <Link
              to={`/panel/${BusinessType}/contact`}
              className="mx-3 rounded border border-blue-500 px-4 py-1 text-blue-500"
            >
              Cancel
            </Link>
          </div>
        </div>

        {/* -------------FORM Starts FROM HERE------------- */}
        <form onSubmit={handleSubmit} className="mb-6 flex">
          {/* ------------------------------------------------> FORM PARENT includes 3 tabs <------------------------------------------------ */}

          {/*Parent Div */}
          <div className="w-screen">
            {/*CHILD Div------ Image Input */}

            <div className="m-3 rounded-xl bg-white shadow-md">
              <h2 className="rounded-t-xl bg-cyan-500 px-4 py-2 font-medium text-white">
                Contact Details
              </h2>

              {/* -------------CONTACT INFORMATION STARTS FROM HERE------------- */}
              <div className="space-y-3 p-2">
                {/*CHILD Div------ Image Input */}
                {/* -------------1------------- */}
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-4">
                  {/* -------------Name------------- */}
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
                      value={editLead.name}
                      onChange={handleChange}
                      className="mt-1 w-full rounded-md border border-gray-300 p-2"
                    />
                  </div>
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
                          : editLead.language === ""
                            ? defaultTextLanguageDropDown
                            : editLead.language}
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
                </div>
                {/* -------------2------------- */}
                {/* -------------Company------------- */}
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-4">
                  <div className="relative flex flex-col">
                    <label
                      htmlFor="company"
                      className="text-sm font-medium text-gray-700"
                    >
                      Company
                    </label>
                    <input
                      type="text"
                      name="company"
                      value={editLead.company}
                      className="mt-1 w-full rounded-md border border-gray-300 p-2"
                      onChange={handleChange}
                      placeholder="Enter your Company"
                    />
                  </div>
                  {/* -------------Title------------- */}
                  <div className="relative flex flex-col">
                    <label
                      htmlFor="title"
                      className="text-sm font-medium text-gray-700"
                    >
                      Title
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={editLead.title}
                      className="mt-1 w-full rounded-md border border-gray-300 p-2"
                      onChange={handleChange}
                      placeholder="Enter Title"
                    />
                  </div>
                </div>
                {/* -------------3------------- */}
                {/* -------------Lead Source------------- */}
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-4">
                  <div className="relative flex flex-col">
                    <label
                      htmlFor="Pool"
                      className="text-sm font-medium text-gray-700"
                    >
                      Lead Source
                    </label>
                    <div
                      className="relative"
                      onMouseLeave={() => setIsPoolDropdownOpen(false)}
                    >
                      <button
                        onClick={toggleDropdown}
                        className="mt-1 flex w-full items-center justify-between rounded-md border border-gray-300 p-2"
                        id="LeadPoolDropDown"
                        type="button"
                      >
                        {poolEdit === ""
                          ? defaultTextPool
                          : editLead.leadSource}
                        <FaAngleDown className="ml-2 text-gray-400" />
                      </button>
                      {isPoolDropdownOpen && (
                        <div className="absolute top-11 z-10 w-full rounded-md border border-gray-300 bg-white">
                          <ul className="py-2 text-sm text-gray-700">
                            {leadSource.map(({ id, poolName }) => (
                              <li
                                key={id}
                                onClick={() =>
                                  handleDropdownSelection(poolName)
                                }
                                className="block cursor-pointer border-b px-4 py-2 hover:bg-cyan-500 hover:text-white"
                              >
                                {poolName}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* -------------Lead Status------------- */}
                  <div className="relative flex flex-col">
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
                        {isEditMode
                          ? editLead.leadesStatus
                          : defaultTextLeadStatusDropDown}
                        <FaAngleDown className="ml-2 text-gray-400" />
                      </button>
                      {isDropdownVisibleLeadStatus && (
                        <div className="top-10.5 absolute z-10 w-full rounded-md border border-gray-300 bg-white">
                          <ul className="py-2 text-sm text-gray-700">
                            {leadStatus.map(({ key, status }) => (
                              <li
                                key={key}
                                onClick={() => handleDropdownLeadStatus(status)}
                                className="block cursor-pointer border-b px-4 py-2 hover:bg-cyan-500 hover:text-white"
                              >
                                {status}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* -------------4------------- */}
                {/* -------------Mobile Number------------- */}
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-4">
                  <div className="relative flex flex-col">
                    <label
                      htmlFor="mobNo"
                      className="text-sm font-medium text-gray-700"
                    >
                      Mobile Number
                    </label>
                    <input
                      type="text"
                      name="mobNo"
                      value={editLead.mobNo}
                      maxLength="15"
                      className="mt-1 w-full rounded-md border border-gray-300 p-2"
                      onChange={handleContactChange}
                      placeholder="Enter your Mobile Number"
                    />
                  </div>
                  {/* -------------Alternate Number------------- */}
                  <div className="relative flex flex-col">
                    <label
                      htmlFor="phNo"
                      className="text-sm font-medium text-gray-700"
                    >
                      Alternate Number
                    </label>
                    <input
                      type="text"
                      name="phNo"
                      value={editLead.phNo}
                      maxLength="15"
                      className="mt-1 w-full rounded-md border border-gray-300 p-2"
                      onChange={handleContactChange}
                      placeholder="Enter your Alternate Number"
                    />
                  </div>
                </div>
                {/* -------------5------------- */}
                {/* -------------Email------------- */}
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-4">
                  <div className="relative flex flex-col">
                    <label
                      htmlFor="email"
                      className="text-sm font-medium text-gray-700"
                    >
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={editLead.email}
                      className="mt-1 w-full rounded-md border border-gray-300 p-2"
                      onChange={handleChange}
                      placeholder="Enter your Email"
                    />
                  </div>
                  {/* -------------Assigned to------------- */}
                  <div className="relative flex flex-col">
                    <label
                      htmlFor="leadesStatus"
                      className="text-sm font-medium text-gray-700"
                    >
                      Managed By
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
                        {isEditMode
                          ? editLead.assigned_To
                          : defaultTextassigned_ToDropDown}
                        <FaAngleDown className="ml-2 text-gray-400" />
                      </button>
                      {isDropdownassigned_ToDropDown && (
                        <div className="top-9.9 absolute z-10 w-full rounded-md border border-gray-300 bg-white">
                          <ul className="py-2 text-sm text-gray-700">
                            {managedBy.map(({ userName, role }, index) => (
                              <li
                                key={index}
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
                </div>
              </div>
            </div>
            {/* -------------Address INFORMATION STARTS FROM HERE------------- */}
            <div className="mx-3 my-3 flex-grow rounded-xl bg-white shadow-md">
              <h2 className="rounded-t-xl bg-cyan-500 px-4 py-2 font-medium text-white">
                Address Information
              </h2>

              {/* -------------Address Information STARTS FROM HERE------------- */}
              {/* -------------6------------- */}
              {/* -------------Street------------- */}
              <div className="grid gap-2 p-2">
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-4">
                  <div className="relative flex flex-col">
                    <label
                      htmlFor="street"
                      className="text-sm font-medium text-gray-700"
                    >
                      Street
                    </label>
                    <input
                      type="text"
                      name="street"
                      value={editLead.street}
                      className="mt-1 w-full rounded-md border border-gray-300 p-2"
                      onChange={handleChange}
                      placeholder="Enter your Street"
                    />
                  </div>
                  {/* -------------PinCode------------- */}
                  <div className="relative flex flex-col">
                    <label
                      htmlFor="pinCode"
                      className="text-sm font-medium text-gray-700"
                    >
                      Pincode
                    </label>
                    <input
                      type="text"
                      name="pinCode"
                      value={editLead.pinCode}
                      className="mt-1 w-full rounded-md border border-gray-300 p-2"
                      onChange={handleChange}
                      placeholder="Enter your pincode"
                    />
                  </div>
                </div>
                {/* -------------7------------- */}
                {/* -------------Country------------- */}
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-4">
                  <div className="relative flex flex-col">
                    <label
                      htmlFor="country"
                      className="text-sm font-medium text-gray-700"
                    >
                      Country
                    </label>
                    <input
                      type="text"
                      name="country"
                      value={editLead.country}
                      className="mt-1 w-full rounded-md border border-gray-300 p-2"
                      onChange={handleChange}
                      placeholder="Enter your Country Name"
                    />
                  </div>
                  {/* -------------City------------- */}
                  <div className="relative flex flex-col">
                    <label
                      htmlFor="city"
                      className="text-sm font-medium text-gray-700"
                    >
                      City
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={editLead.city}
                      className="mt-1 w-full rounded-md border border-gray-300 p-2"
                      onChange={handleChange}
                      placeholder="Enter your City name"
                    />
                  </div>
                </div>
                {/* -------------8------------- */}
                {/* -------------State------------- */}
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-4">
                  <div className="relative flex flex-col">
                    <label
                      htmlFor="state"
                      className="text-sm font-medium text-gray-700"
                    >
                      State
                    </label>
                    <input
                      type="text"
                      name="state"
                      value={editLead.state}
                      className="mt-1 w-full rounded-md border border-gray-300 p-2"
                      onChange={handleChange}
                      placeholder="Enter your State name"
                    />
                  </div>
                  {/* -------------Description------------- */}
                </div>{" "}
                {/* -------------9------------- */}
                {/* -------------Risk Capcity------------- */}
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-4">
                  <div className="relative flex flex-col">
                    <label
                      htmlFor="riskCapcity"
                      className="text-sm font-medium text-gray-700"
                    >
                      Risk Capacity
                    </label>
                    <input
                      type="text"
                      name="riskCapcity"
                      value={editLead.riskCapcity}
                      className="mt-1 w-full rounded-md border border-gray-300 p-2"
                      onChange={handleChange}
                      placeholder="Enter Risk Capacity"
                    />
                  </div>
                  {/* -------------Trading Time------------- */}
                  <div className="relative flex flex-col">
                    <label
                      htmlFor="tradingTime"
                      className="text-sm font-medium text-gray-700"
                    >
                      Trading Time
                    </label>
                    <input
                      type="text"
                      name="tradingTime"
                      value={editLead.tradingTime}
                      className="mt-1 w-full rounded-md border border-gray-300 p-2"
                      onChange={handleChange}
                      placeholder="Enter Trading Time"
                    />
                  </div>
                </div>
                {/* -------------10------------- */}
                {/* -------------Trading Type------------- */}
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-4">
                  <div className="relative flex flex-col">
                    <label
                      htmlFor="tradingType"
                      className="text-sm font-medium text-gray-700"
                    >
                      Trading Type
                    </label>
                    <input
                      type="text"
                      name="tradingType"
                      value={editLead.tradingType}
                      className="mt-1 w-full rounded-md border border-gray-300 p-2"
                      onChange={handleChange}
                    />
                  </div>
                  {/* -------------investmet------------- */}
                  <div className="relative flex flex-col">
                    <label
                      htmlFor="investmet"
                      className="text-sm font-medium text-gray-700"
                    >
                      Information
                    </label>
                    <input
                      type="text"
                      name="investmet"
                      value={editLead.investmet}
                      className="mt-1 w-full rounded-md border border-gray-300 p-2"
                      onChange={handleChange}
                    />
                  </div>
                </div>
                {/* -------------11------------- */}
                {/* -------------Advisory Exp------------- */}
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-4">
                  <div className="relative flex flex-col">
                    <label
                      htmlFor="empNadvisoryExpame"
                      className="text-sm font-medium text-gray-700"
                    >
                      Advisory Exp
                    </label>
                    <input
                      type="text"
                      name="advisoryExp"
                      value={editLead.advisoryExp}
                      className="mt-1 w-full rounded-md border border-gray-300 p-2"
                      onChange={handleChange}
                      placeholder="Enter your Advisory"
                    />
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
                            {segments.map((segment) => (
                              <li
                                key={segment.id}
                                className="flex cursor-pointer items-center border-b px-4 py-2 hover:bg-cyan-500 hover:text-white"
                              >
                                <input
                                  type="checkbox"
                                  checked={editLead.segments.includes(
                                    segment.segment,
                                  )}
                                  onChange={() => handleCheckboxChange(segment)}
                                  className="mr-2"
                                />
                                {segment.segment}{" "}
                                {/* Assuming 'segment' is the property you want to display */}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                {/* -------------11------------- */}
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
                      value={editLead.trialStartDate?.split("T")[0]}
                      className="mt-1 w-full rounded-md border border-gray-300 p-2"
                      onChange={handleChange}
                    />
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
                      value={editLead.trialEndDate?.split("T")[0]}
                      onChange={handleChange}
                      className="mt-1 w-full rounded-md border border-gray-300 p-2"
                    />
                  </div>
                </div>
                {/* -------------12------------- */}
                {/* -------------Trading Years------------- */}
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-4">
                  <div className="relative flex flex-col">
                    <label
                      htmlFor="tradingYears"
                      className="text-sm font-medium text-gray-700"
                    >
                      Trading Years
                    </label>
                    <input
                      type="text"
                      name="tradingYears"
                      value={editLead.tradingYears}
                      className="mt-1 w-full rounded-md border border-gray-300 p-2"
                      onChange={handleChange}
                      placeholder="Enter years"
                    />
                    {/* -------------callBackDateTime ------------- */}
                  </div>
                  <div className="relative flex flex-col">
                    <label
                      htmlFor="callBackDateTime"
                      className="text-sm font-medium text-gray-700"
                    >
                      CallBack DateTime
                    </label>
                    <input
                      type="datetime-local"
                      name="callBackDateTime"
                      value={editLead.callBackDateTime}
                      onChange={handleChange}
                      className="mt-1 w-full rounded-md border border-gray-300 p-2"
                    />
                  </div>
                </div>
                {/* -------------13------------- */}
                {/* -------------contactID ------------- */}
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-4">
                  <div className="relative flex flex-col">
                    <label
                      htmlFor="contactId"
                      className="text-sm font-medium text-gray-700"
                    >
                      Contact ID
                    </label>
                    <input
                      type="text"
                      name="contactId"
                      value={editLead.contactId}
                      className="mt-1 w-full rounded-md border border-gray-300 p-2"
                      onChange={handleChange}
                      placeholder="Enter ContactID"
                    />
                  </div>
                  {/* -------------lastModifiedBy ------------- */}
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
                      value={editLead.lastModifiedBy}
                      className="mt-1 w-full rounded-md border border-gray-300 p-2"
                      onChange={handleChange}
                      placeholder="Enter details"
                    />
                  </div>
                </div>
              </div>
            </div>
            {/* DESCRIPTION */}
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
                  className="mb-2 mt-24 w-full rounded border-2 border-cyan-500 bg-cyan-500 px-36 py-4 text-white hover:bg-white hover:text-cyan-500 sm:me-10 sm:w-1/3"
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
