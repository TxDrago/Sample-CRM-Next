//(f)Report--->> (sf)RepoComponents--->> EditClientSO.jsx
"use client";

//react
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
//---------------------------//---------------------------//---------------------------//---------------------------
15 - 10 - 2024;
//DONT USE//DONT USE//DONT USE//DONT USE//DONT USE//DONT USE//DONT USE//DONT USE
//DONT USE//DONT USE//DONT USE//DONT USE//DONT USE//DONT USE//DONT USE//DONT USE
//---------------------------//---------------------------//---------------------------//---------------------------
//react
import { useState, useEffect } from "react";
//reactIcon
import { FaAngleDown } from "react-icons/fa";


//external Packages
import axios from "axios";
 
//file
import { tenant_base_url, protocal_url } from "@/Config/Config";
import { getHostnamePart } from "@/components/GlobalHostUrl";

export default function CreateSO() {
  //------- Business Type --------
  const businessType = localStorage.getItem("businessType");
  const [business, setBusiness] = useState("");

  //to make id unique
  const { id } = useParams();
 const router = useRouter();

     //--------------------------------------- Set Business Type --------------------------------------------
                           const [BusinessType, setBusinessType] = useState("");
                            
                           useEffect(() => {
                             const storedType = localStorage.getItem("businessType") || "";
                             setBusinessType(storedType);
                           }, []);

  //form description is kept-out
  const [description, setdescription] = useState("Add Text Here");
  const [editLead, seteditLead] = useState({});

  //IMP used as ${name} in an API
  const name = getHostnamePart();

  //imp to identify mode
  const [isEditMode, setIsEditMode] = useState(false);

  //auto search id-> if found isEditMode(true)
  useEffect(() => {
    if (id) {
      setIsEditMode(false);
      handleLeadbyId(); // Fetch lead data for editing
    } else {
      setIsEditMode(true);
    }

    //------- Business Type --------
    console.log("Bussiness Type Dash Board : ", businessType);
    setBusiness(businessType);
  }, [id]);

  //GET by ID---------------------------//GET---------------------------//GET---------------------------by ID-----------by ID
  async function handleLeadbyId() {
    const bearer_token = localStorage.getItem("token");
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${bearer_token}`,
        },
      };
      const response = await axios.get(
        `${protocal_url}${name}.${tenant_base_url}/Lead/lead/${id}`,
        config,
      );
      const data = response.data.data;

      seteditLead({
        //Personal Details
        leadId: data.id || "",
        clientName: data.name || "",
        language: data.language || "",
        mobileNo: data.mobileNo || "",
        phoneNo: data.phoneNo || "",
        email: data.email || "",
        assigned_To: data.assigned_To || "",
        street: data.street || "",
        postalCode: data.postalCode || "",
        country: data.country || "",
        city: data.city || "",
        state: data.state || "",
        advisaryExp: data.advisaryExp || "",

        //Payment Details
        segments: data.segments || [],

        //Service Details
        subscription_start_date: data.trialStartDate.split("T")[0] || null,
        subscription_end_date: data.trialEndDate.split("T")[0] || null,
      });
      //Description Information
      setdescription(data.description);
    } catch (error) {
      console.error("Error fetching leads:", error);
    }
  }

  //----------------------------------------------------------------------------------------
  //SEGMENETS API Is being used here

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
      editLead.segments.length > 0
        ? editLead.segments.join(", ")
        : "Select Segment",
    );
  }, [editLead]);

  const [defaultTextSegmentDropDown, setdefaultTextSegmentDropDown] =
    useState("Select Product");
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
  // Segment GET API Is being used here

  //----------------------------------------------------------------------------------------
  //assigned_ToDropDown  Is being used here
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
        `${protocal_url}${name}.${tenant_base_url}/Setting/users/byusertoken`,
        config,
      );
      setassigned_ToDropDown(response.data?.data);
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

  //----------------------------------------------------------------------------------------
  //Service
  const Service_DropDown = [
    { key: 1, name: "SMS" },
    { key: 3, name: "Call" },
    { key: 2, name: "What's App" },
  ];

  const [defaultText_Service_DropDown, setDefaultText_Service_DropDown] =
    useState("Select Service");

  const [isDropdownVisible_Service_, setisDropdownVisible_Service_] =
    useState(false);

  const toggleDropdown_Service_ = () => {
    setisDropdownVisible_Service_(!isDropdownVisible_Service_);
  };

  const handleDropdownisDropdown_Service_ = (service) => {
    setDefaultText_Service_DropDown(service);
    setisDropdownVisible_Service_(!isDropdownVisible_Status_);
    seteditLead((prevTask) => ({
      ...prevTask,
      service: service,
    }));
  };

  //----------------------------------------------------------------------------------------
  //Status_DropDown
  const Status_DropDown = [
    { key: 0, name: "Inactive" },
    { key: 1, name: "Active" },
  ];

  const [defaultText_Status_DropDown, setDefaultText_Status_DropDown] =
    useState("Select Status");

  const [isDropdownVisible_Status_, setisDropdownVisible_Status_] =
    useState(false);

  const toggleDropdown_Status_ = () => {
    setisDropdownVisible_Status_(!isDropdownVisible_Status_);
  };

  const handleDropdownisDropdown_Status_ = (id, name) => {
    setDefaultText_Status_DropDown(name);
    setisDropdownVisible_Status_(!isDropdownVisible_Status_);
    seteditLead((prevTask) => ({
      ...prevTask,
      status: false,
    }));
  };

  //----------------------------------------------------------------------------------------
  //TERM
  const Term_DropDown = [
    { key: 1, name: "Monthly" },
    { key: 2, name: "Quartely" },
    { key: 3, name: "Half Yearly" },
    { key: 4, name: "Yearly" },
  ];

  const [defaultText_Term_DropDown, setDefaultText_Term_DropDown] =
    useState("Select Term");

  const [isDropdownVisible_Term_, setisDropdownVisible_Term_] = useState(false);

  const toggleDropdown_Term_ = () => {
    setisDropdownVisible_Term_(!isDropdownVisible_Term_);
  };

  const handleDropdownisDropdown_Term_ = (term) => {
    setDefaultText_Term_DropDown(term);
    setisDropdownVisible_Term_(!isDropdownVisible_Status_);
    seteditLead((prevTask) => ({
      ...prevTask,
      term: term,
    }));
  };

  //----------------------------------------------------------------------------------------
  //Business Type
  const BusinessTypeDropDown = [
    { key: 1, name: "IT" },
    { key: 2, name: "eCommerce" },
    { key: 3, name: "Marketing" },
    { key: 4, name: "Hospitality" },
    { key: 5, name: "Brokerage" },
  ];

  const [defaultTextbusinessTypeDropDown, setDefaultTextbusinessTypeDropDown] =
    useState("Select Business Type");

  const [isDropdownVisiblebusinessType, setisDropdownVisiblebusinessType] =
    useState(false);

  const toggleDropdownbusinessType = () => {
    setisDropdownVisiblebusinessType(!isDropdownVisiblebusinessType);
  };

  const handleDropdownisDropdownVisiblebusinessType = (businessType) => {
    setDefaultTextbusinessTypeDropDown(businessType);
    setisDropdownVisiblebusinessType(!isDropdownVisiblebusinessType);
    seteditLead((prevTask) => ({
      ...prevTask,
      businessType: businessType,
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
    if (!editLead.mobileNo || editLead.mobileNo.trim() === "") {
      errors.mobileNo = "Enter a valid mobile number";
    } else if (
      !editLead.uidaI_Id_No ||
      editLead.uidaI_Id_No.trim() === "" ||
      /^\d{12}$/.test(editLead.uidaI_Id_No)
    ) {
      errors.uidaI_Id_No = "Enter a valid adhar number";
    } else if (
      !editLead.panCard_No ||
      !editLead.panCard_No.trim() === "" ||
      /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(editLead.panCard_No)
    ) {
      errors.panCard_No = "Enter a valid pan number";
    } else if (
      !editLead.reference_Number ||
      editLead.reference_Number.trim() === ""
    ) {
      errors.reference_Number = "Reference Number is required";
    } else if (!editLead.amount_paid || editLead.amount_paid.trim() === "") {
      errors.amount_paid = "Amount paid is required";
    } else if (
      !editLead.subscription_start_date ||
      editLead.subscription_start_date.trim() === ""
    ) {
      errors.subscription_start_date = "Enter subscription start date";
    } else if (
      !editLead.subscription_end_date ||
      editLead.subscription_end_date.trim() === ""
    ) {
      errors.subscription_end_date = "Enter subscription end date";
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
        //----------------//
        description: description,
      };
      const formData_POST = {
        //Personal Details
        leadId: editLead.leadId,
        clientName: editLead.clientName,
        language: editLead.language,
        fatherName: editLead.fatherName,
        motherName: editLead.motherName,
        mobileNo: editLead.mobileNo,
        phoneNo: editLead.phoneNo,
        uidaI_Id_No: editLead.uidaI_Id_No,
        panCard_No: editLead.panCard_No,
        email: editLead.email,
        assigned_To: editLead.assigned_To,
        state: editLead.state,
        city: editLead.city,
        street: editLead.street,
        postalCode: editLead.pinCode,
        advisaryExp: editLead.advisoryExp,
        //Payment Details
        bank_name: editLead.bank_name,
        branch_name: editLead.branch_name,
        paymenT_MODE: editLead.paymenT_MODE,
        reference_Number: editLead.reference_Number,
        totalAmount: editLead.totalAmount,
        due_Amount: editLead.due_Amount,
        amount_paid: editLead.amount_paid,
        discount: editLead.discount,

        chequeOrDD_no: editLead.chequeOrDD_no,
        segments: editLead.segments,
        saleS_ODR_NO: editLead.saleS_ODR_NO,

        //Service Details
        period_of_subscription: editLead.period_of_subscription || null,
        term: editLead.term,
        subscription_start_date: editLead.subscription_start_date || null,
        subscription_end_date: editLead.subscription_end_date || null,
        service: editLead.service || null,
        status: false,
        remarks: editLead.remarks,
      };

      if (isEditMode) {
        await axios.put(
          `${protocal_url}${name}.${tenant_base_url}/Lead/lead/update`,
          formData_PUT,
          config,
        );
        alert("SO updated successfully!");
        router.push(`/panel/${BusinessType}/leads`);
      } else {
        await axios.post(
          `${protocal_url}${name}.${tenant_base_url}/SalesOrder/salesOrder/add`,
          formData_POST,
          config,
        );
        console.log(formData_POST);
        alert("Sales Order created successfully!");
        router.push(`/panel/${BusinessType}/leads`);
      }

      // Redirect after a short delay
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred. Please try again.");
    }
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
    seteditLead((prevTask) => ({
      ...prevTask,
      language: language,
    }));
  };

    //--------------------------------- Set Description -------------------------

const handleDescriptionChange = (event) => {
  setdescription(event.target.value);
};

  return (
    <>
      <div className="mt-3 flex min-h-screen flex-col">
        <div className="mx-3 flex justify-between rounded border bg-white px-3 py-3">
          <div className="flex items-center justify-center gap-3">
            <h1 className="text-xl">
              {/*  {isEditMode? <h1>Edit Lead</h1>: <>Create Lead</> } */}
              Create Sales Order
            </h1>
            <h1 className="rounded-lg bg-blue-500 px-4 py-1 text-xs font-medium text-white">
              Edit Page Layout
            </h1>
          </div>
          <div>
            <Link
              href={`/panel/${BusinessType}/leads`}
              className="rounded border border-blue-500 px-6 py-1 text-blue-500"
            >
              Cancel
            </Link>
          </div>
        </div>

        {/* -------------FORM Starts FROM HERE------------- */}
        {/* Lead Image */}
        <form onSubmit={handleSubmit} className="flex">
          {/*-FORM- */}
          {/*Parent Div */}
          <div className="w-full">
            {/*CHILD Div------ Image Input */}

            <div className="mx-3 my-3 flex-grow rounded-xl bg-white shadow-md">
              <h2 className="rounded-t-xl bg-cyan-500 px-4 py-2 font-medium text-white">
                Personal Details
              </h2>

              {/* -------------SALES ORDER INFORMATION STARTS FROM HERE------------- */}
              {/* -------------I--1------------- */}
              {/* -------------Client Name------------- */}
              <div className="px-4 py-2">
                <div className="flex space-x-4">
                  <div className="flex w-1/2 flex-col">
                    <label
                      htmlFor="clientName"
                      className="text-sm font-medium text-gray-700"
                    >
                      Client Name
                    </label>
                    <input
                      type="text"
                      name="clientName"
                      value={editLead.clientName}
                      placeholder="Enter Client's Name"
                      onChange={handleChange}
                      className="mt-1 rounded-md border border-gray-300 p-2"
                    />
                  </div>
                  {/* -------------I--2------------- */}
                  {/* -------------Language------------- */}
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
                          : editLead.language === ""
                            ? defaultTextLanguageDropDown
                            : editLead.language}
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
                </div>
                {/* -------------II--1------------- */}
                <div className="flex space-x-4">
                  {/* -------------Father's Name------------- */}
                  <div className="flex w-1/2 flex-col">
                    <label
                      htmlFor="fathesName"
                      className="text-sm font-medium text-gray-700"
                    >
                      Father's Name
                    </label>
                    <input
                      type="text"
                      name="fatherName"
                      value={editLead.fatherName}
                      className="mt-1 rounded-md border border-gray-300 p-2"
                      onChange={handleChange}
                      placeholder="Enter Father's Name"
                    />
                  </div>
                  {/* -------------Mother's Name------------- */}
                  <div className="flex w-1/2 flex-col">
                    <label
                      htmlFor="motherName"
                      className="text-sm font-medium text-gray-700"
                    >
                      Mother's Name
                    </label>
                    <input
                      type="text"
                      name="motherName"
                      value={editLead.motherName}
                      className="mt-1 rounded-md border border-gray-300 p-2"
                      onChange={handleChange}
                      placeholder="Enter Mother's Name"
                    />
                  </div>
                </div>
                {/* -------------III--1------------- */}
                {/* -------------Mobile Number------------- */}
                <div className="flex space-x-4">
                  <div className="flex w-1/2 flex-col">
                    <label
                      htmlFor="mobileNo"
                      className="text-sm font-medium text-gray-700"
                    >
                      Mobile Number
                    </label>
                    <input
                      type="text"
                      name="mobileNo"
                      value={editLead.mobileNo}
                      className="mt-1 rounded-md border border-gray-300 p-2"
                      onChange={handleChange}
                      placeholder="Enter your Mobile Number"
                    />
                    {errors.mobileNo && (
                      <span className="text-red-500">{errors.mobileNo}</span>
                    )}
                  </div>
                  {/* -------------III--2------------- */}
                  {/* -------------Alternate Number------------- */}
                  <div className="flex w-1/2 flex-col">
                    <label
                      htmlFor="phoneNo"
                      className="text-sm font-medium text-gray-700"
                    >
                      Alternate Number
                    </label>
                    <input
                      type="text"
                      name="phoneNo"
                      value={editLead.phoneNo}
                      className="mt-1 rounded-md border border-gray-300 p-2"
                      onChange={handleChange}
                      placeholder="Enter your Alternate Number"
                    />
                  </div>
                </div>

                {/* -------------IV--1--------------- */}
                {/* -------------UIDAI Id------------- */}
                <div className="flex space-x-4">
                  <div className="flex w-1/2 flex-col">
                    <label
                      htmlFor="uidaI_Id_No"
                      className="text-sm font-medium text-gray-700"
                    >
                      Enter UIDAI Id
                    </label>
                    <input
                      type="number"
                      name="uidaI_Id_No"
                      value={editLead.uidaI_Id_No}
                      className="mt-1 rounded-md border border-gray-300 p-2"
                      onChange={handleChange}
                      placeholder="9009 9009 9009"
                    />
                    {errors.mobileNo && (
                      <span className="text-red-500">{errors.uidaI_Id_No}</span>
                    )}
                  </div>
                  {/* -------------IV--2--------------- */}
                  {/* -------------Pan Card No.------------- */}
                  <div className="flex w-1/2 flex-col">
                    <label
                      htmlFor="panCard_No"
                      className="text-sm font-medium text-gray-700"
                    >
                      Pan Card No.
                    </label>
                    <input
                      type="text"
                      name="panCard_No"
                      value={editLead.panCard_No}
                      className="mt-1 rounded-md border border-gray-300 p-2 uppercase"
                      onChange={handleChange}
                      placeholder="Enter your Pan Card Details"
                    />
                    {errors.mobileNo && (
                      <span className="text-red-500">{errors.panCard_No}</span>
                    )}
                  </div>
                </div>
                {/* -------------V--1--------------- */}
                {/* -------------Email------------- */}
                <div className="flex space-x-4">
                  <div className="flex w-1/2 flex-col">
                    <label
                      htmlFor="email"
                      className="text-sm font-medium text-gray-700"
                    >
                      Email
                    </label>
                    <input
                      type="text"
                      name="email"
                      value={editLead.email}
                      className="mt-1 rounded-md border border-gray-300 p-2"
                      onChange={handleChange}
                      placeholder="Enter your Email"
                    />
                  </div>
                  {/* -------------V--2--------------- */}
                  {/* -------------Assigned to------------- */}
                  <div className="relative flex w-1/2 flex-col">
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
                        {isEditMode
                          ? editLead.assigned_To
                          : defaultTextassigned_ToDropDown}
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
                {/* -------------VI--1--------------- */}
                {/* -------------State------------- */}
                <div className="flex space-x-4">
                  <div className="flex w-1/2 flex-col">
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
                      className="mt-1 rounded-md border border-gray-300 p-2"
                      onChange={handleChange}
                      placeholder="Enter your State"
                    />
                  </div>
                  {/* -------------VI--2--------------- */}
                  {/* -------------City------------- */}
                  <div className="flex w-1/2 flex-col">
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
                      className="mt-1 rounded-md border border-gray-300 p-2"
                      onChange={handleChange}
                      placeholder="Enter your City"
                    />
                  </div>
                </div>

                {/* -------------VII--1--------------- */}
                {/* -------------Street------------- */}
                <div className="flex space-x-4">
                  <div className="flex w-1/2 flex-col">
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
                      className="mt-1 rounded-md border border-gray-300 p-2"
                      onChange={handleChange}
                      placeholder="Enter your Street"
                    />
                  </div>
                  {/* -------------VII--2--------------- */}
                  {/* -------------PinCode------------- */}
                  <div className="flex w-1/2 flex-col">
                    <label
                      htmlFor="pinCode"
                      className="text-sm font-medium text-gray-700"
                    >
                      Pincode
                    </label>
                    <input
                      type="text"
                      name="pinCode"
                      value={editLead.postalCode}
                      className="mt-1 rounded-md border border-gray-300 p-2"
                      onChange={handleChange}
                      placeholder="Enter your pincode"
                    />
                  </div>
                </div>

                {/* -------------VIII--1--------------- */}
                <div className="flex space-x-4">
                  {/* -------------Business Type------------- */}
                  <div className="relative flex w-1/2 flex-col">
                    <label
                      htmlFor="businessType"
                      className="text-sm font-medium text-gray-700"
                    >
                      Business Type
                    </label>
                    <div
                      className="relative"
                      onClick={toggleDropdownbusinessType}
                      onMouseLeave={() =>
                        setisDropdownVisiblebusinessType(false)
                      }
                    >
                      <button
                        className="mt-1 flex w-full items-center justify-between rounded-md border border-gray-300 p-2"
                        id="businessTypeDropDown"
                        type="button"
                      >
                        {isEditMode
                          ? editLead.businessType
                          : defaultTextbusinessTypeDropDown}
                        <FaAngleDown className="ml-2 text-gray-400" />
                      </button>
                      {isDropdownVisiblebusinessType && (
                        <div className="absolute top-11 z-10 w-full rounded-md border border-gray-300 bg-white">
                          <ul className="py-2 text-sm text-gray-700">
                            {BusinessTypeDropDown.map(({ key, name }) => (
                              <li
                                key={key}
                                onClick={() =>
                                  handleDropdownisDropdownVisiblebusinessType(
                                    name,
                                  )
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
                  {/* -------------VIII--2--------------- */}
                  {/* -------------Advisory Experience------------- */}
                  <div className="flex w-1/2 flex-col">
                    <label
                      htmlFor="advisaryExp"
                      className="text-sm font-medium text-gray-700"
                    >
                      Advisory Experience
                    </label>
                    <input
                      type="text"
                      name="advisaryExp"
                      value={editLead.advisaryExp}
                      className="mt-1 rounded-md border border-gray-300 p-2"
                      onChange={handleChange}
                      placeholder="Enter years"
                    />
                  </div>
                </div>
              </div>
            </div>
            {/* -------------Payment Details INFORMATION STARTS FROM HERE------------- */}
            <div className="mx-3 my-3 flex-grow rounded-xl bg-white shadow-md">
              <h2 className="rounded-t-xl bg-cyan-500 px-4 py-2 font-medium text-white">
                Payment Details
              </h2>
              <div className="px-4 py-2">
                {/* -------------IX--1----------------- */}
                {/* -------------Bank Name------------- */}
                <div className="flex space-x-4">
                  <div className="flex w-1/2 flex-col">
                    <label
                      htmlFor="bank_name"
                      className="text-sm font-medium text-gray-700"
                    >
                      Bank Name
                    </label>
                    <input
                      type="text"
                      name="bank_name"
                      value={editLead.bank_name}
                      className="mt-1 rounded-md border border-gray-300 p-2"
                      onChange={handleChange}
                      placeholder="Bank Name"
                    />
                  </div>
                  {/* -------------IX--2----------------- */}
                  {/* -------------Branch Name------------- */}
                  <div className="flex w-1/2 flex-col">
                    <label
                      htmlFor="branch_name"
                      className="text-sm font-medium text-gray-700"
                    >
                      Branch Name
                    </label>
                    <input
                      type="text"
                      name="branch_name"
                      value={editLead.branch_name}
                      className="mt-1 rounded-md border border-gray-300 p-2"
                      onChange={handleChange}
                      placeholder="Branch Name"
                    />
                  </div>
                </div>
                {/* -------------X--1----------------- */}
                {/* -------------Payment Mode------------- */}
                <div className="flex space-x-4">
                  <div className="flex w-1/2 flex-col">
                    <label
                      htmlFor="paymenT_MODE"
                      className="text-sm font-medium text-gray-700"
                    >
                      Payment Mode
                    </label>
                    <input
                      type="text"
                      name="paymenT_MODE"
                      value={editLead.paymenT_MODE}
                      className="mt-1 rounded-md border border-gray-300 p-2"
                      onChange={handleChange}
                    />
                  </div>
                  {/* -------------X--2----------------- */}
                  {/* -------------Ref No------------- */}
                  <div className="flex w-1/2 flex-col">
                    <label
                      htmlFor="reference_Number"
                      className="text-sm font-medium text-gray-700"
                    >
                      Ref No
                    </label>
                    <input
                      type="text"
                      name="reference_Number"
                      value={editLead.reference_Number}
                      className="mt-1 rounded-md border border-gray-300 p-2"
                      onChange={handleChange}
                    />
                    {errors.mobileNo && (
                      <span className="text-red-500">
                        {errors.reference_Number}
                      </span>
                    )}
                  </div>
                </div>
                {/* -------------XI--1------------- */}
                {/* -------------Total Amount------------- */}
                <div className="flex space-x-4">
                  {business === "brokerage" ? (
                    ""
                  ) : (
                    <div className="flex w-1/2 flex-col">
                      <label
                        htmlFor="totalAmount"
                        className="text-sm font-medium text-gray-700"
                      >
                        Total Amount
                      </label>
                      <input
                        type="number"
                        name="totalAmount"
                        value={editLead.totalAmount}
                        className="mt-1 rounded-md border border-gray-300 p-2"
                        onChange={handleChange}
                        placeholder="Total Amount"
                      />
                    </div>
                  )}

                  {/* -------------XI--2------------- */}
                  {/* -------------  Due Amount------------- */}
                  <div className="flex w-1/2 flex-col">
                    <label
                      htmlFor="due_Amount"
                      className="text-sm font-medium text-gray-700"
                    >
                      {/* Due Amount */}
                      {business === "brokerage" ? "Brokerage" : "Due Amount"}
                    </label>
                    <input
                      type="text"
                      name="due_Amount"
                      value={editLead.due_Amount}
                      className="mt-1 rounded-md border border-gray-300 p-2"
                      onChange={handleChange}
                      placeholder="Due Amount"
                    />
                  </div>
                </div>
                {/* -------------XII--1------------- */}
                {/* -------------Amount Paid------------- */}
                <div className="flex space-x-4">
                  <div className="flex w-1/2 flex-col">
                    <label
                      htmlFor="amount_paid"
                      className="text-sm font-medium text-gray-700"
                    >
                      {/* Amount Paid */}
                      {business === "brokerage" ? "Fund" : "Amount Paid"}
                    </label>
                    <input
                      type="text"
                      name="amount_paid"
                      value={editLead.amount_paid}
                      className="mt-1 rounded-md border border-gray-300 p-2"
                      onChange={handleChange}
                      placeholder="Amount Paid"
                    />
                    {errors.mobileNo && (
                      <span className="text-red-500">{errors.amount_paid}</span>
                    )}
                  </div>
                  {/* -------------XII--2------------- */}
                  {/* -------------Discount------------- */}
                  {business === "brokerage" ? (
                    ""
                  ) : (
                    <div className="flex w-1/2 flex-col">
                      <label
                        htmlFor="discount"
                        className="text-sm font-medium text-gray-700"
                      >
                        Discount
                      </label>
                      <input
                        type="text"
                        name="discount"
                        value={editLead.discount}
                        className="mt-1 rounded-md border border-gray-300 p-2"
                        onChange={handleChange}
                        placeholder="Discount"
                      />
                    </div>
                  )}
                </div>

                {/* -------------XIII--1------------- */}
                {/* -------------Payment Date------------- */}
                <div className="flex space-x-4">
                  <div className="flex w-1/2 flex-col">
                    <label
                      htmlFor="paymentDate"
                      className="text-sm font-medium text-gray-700"
                    >
                      Payment Date
                    </label>
                    <input
                      type="date"
                      name="paymentDate"
                      value={editLead.paymentDate}
                      className="mt-1 rounded-md border border-gray-300 p-2"
                      onChange={handleChange}
                    />
                  </div>
                  {/* -------------XIII--2------------- */}
                  {/* -------------Cheque No Or DD No.------------- */}
                  <div className="flex w-1/2 flex-col">
                    <label
                      htmlFor="chequeOrDD_no"
                      className="text-sm font-medium text-gray-700"
                    >
                      Cheque No Or DD No.
                    </label>
                    <input
                      type="text"
                      name="chequeOrDD_no"
                      value={editLead.chequeOrDD_no}
                      className="mt-1 rounded-md border border-gray-300 p-2"
                      onChange={handleChange}
                      placeholder="Cheque No Or DD No"
                    />
                  </div>
                </div>

                {/* -------------XIV--1------------- */}
                <div className="flex space-x-4">
                  {/* -------------Product-------------> Means Segments */}
                  <div className="flex w-1/2 flex-col">
                    <label
                      htmlFor="segment"
                      className="text-sm font-medium text-gray-700"
                    >
                      Product
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
                  {/* -------------XIV--2------------- */}
                  {/* -------------Sales Order No------------- */}
                  <div className="flex w-1/2 flex-col">
                    <label
                      htmlFor="saleS_ODR_NO"
                      className="text-sm font-medium text-gray-700"
                    >
                      Sales Order No
                    </label>
                    <input
                      type="number"
                      name="saleS_ODR_NO"
                      value={editLead.saleS_ODR_NO}
                      className="mt-1 rounded-md border border-gray-300 p-2"
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* -------------SALES ORDER INFORMATION STARTS FROM HERE------------- */}
            <div className="mx-3 my-3 flex-grow rounded-xl bg-white shadow-md">
              <h2 className="rounded-t-xl bg-cyan-500 px-4 py-2 font-medium text-white">
                Service Details
              </h2>
              <div className="px-4 py-2">
                {/* -------------SALES ORDER INFORMATION FORM STARTS FROM HERE------------- */}
                {/* -------------XV--1------------- */}
                {/* -------------period_of_subscription------------- */}
                {business === "brokerage" ? (
                  ""
                ) : (
                  <div className="flex space-x-4">
                    <div className="flex w-1/2 flex-col">
                      <label
                        htmlFor="period_of_subscription"
                        className="text-sm font-medium text-gray-700"
                      >
                        Period of Subscription
                      </label>
                      <input
                        type="text"
                        name="period_of_Subscription"
                        value={editLead.period_of_subscription}
                        className="mt-1 rounded-md border border-gray-300 p-2"
                        onChange={handleChange}
                        placeholder="Period of Subscription"
                      />
                    </div>
                    {/* -------------Select Term------------- */}
                    {/* -------------XV--2------------- */}
                    <div className="relative flex w-1/2 flex-col">
                      <label
                        htmlFor="term"
                        className="text-sm font-medium text-gray-700"
                      >
                        Term
                      </label>
                      <div
                        className="relative"
                        onClick={toggleDropdown_Term_}
                        onMouseLeave={() => setisDropdownVisible_Term_(false)}
                      >
                        <button
                          className="mt-1 flex w-full items-center justify-between rounded-md border border-gray-300 p-2"
                          id="termDropDown"
                          type="button"
                        >
                          {isEditMode
                            ? editLead.term
                            : defaultText_Term_DropDown}
                          <FaAngleDown className="ml-2 text-gray-400" />
                        </button>
                        {isDropdownVisible_Term_ && (
                          <div className="absolute top-11 z-10 w-full rounded-md border border-gray-300 bg-white">
                            <ul className="py-2 text-sm text-gray-700">
                              {Term_DropDown.map(({ key, name }) => (
                                <li
                                  key={key}
                                  onClick={() =>
                                    handleDropdownisDropdown_Term_(name)
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
                )}

                {/* -------------XVI--1------------- */}
                {/* -------------Subscription Start Date------------- */}
                {business === "brokerage" ? (
                  ""
                ) : (
                  <div className="flex space-x-4">
                    <div className="flex w-1/2 flex-col">
                      <label
                        htmlFor="subscription_start_date"
                        className="text-sm font-medium text-gray-700"
                      >
                        Subscription Start Date
                      </label>
                      <input
                        type="date"
                        name="subscription_start_date"
                        value={editLead.subscription_start_date}
                        className="mt-1 rounded-md border border-gray-300 p-2"
                        onChange={handleChange}
                      />
                      {errors.mobileNo && (
                        <span className="text-red-500">
                          {errors.subscription_start_date}
                        </span>
                      )}
                    </div>
                    {/* -------------XVI--2------------- */}
                    {/* -------------subscription_end_date------------- */}
                    <div className="flex w-1/2 flex-col">
                      <label
                        htmlFor="subscription_end_date"
                        className="text-sm font-medium text-gray-700"
                      >
                        Subscription End Date
                      </label>
                      <input
                        type="date"
                        name="subscription_end_date"
                        value={editLead.subscription_end_date}
                        onChange={handleChange}
                        className="mt-1 rounded-md border border-gray-300 p-2"
                      />
                      {errors.mobileNo && (
                        <span className="text-red-500">
                          {errors.subscription_end_date}
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* -------------XVII--1------------- */}
                <div className="flex space-x-4">
                  {/* -------------Service------------- */} {/* sms , wp,  */}
                  <div className="relative flex w-1/2 flex-col">
                    <label
                      htmlFor="service"
                      className="text-sm font-medium text-gray-700"
                    >
                      Service
                    </label>
                    <div
                      className="relative"
                      onClick={toggleDropdown_Service_}
                      onMouseLeave={() => setisDropdownVisible_Service_(false)}
                    >
                      <button
                        className="mt-1 flex w-full items-center justify-between rounded-md border border-gray-300 p-2"
                        id="serviceDropDown"
                        type="button"
                      >
                        {isEditMode
                          ? editLead.service
                          : defaultText_Service_DropDown}
                        <FaAngleDown className="ml-2 text-gray-400" />
                      </button>
                      {isDropdownVisible_Service_ && (
                        <div className="absolute top-11 z-10 w-full rounded-md border border-gray-300 bg-white">
                          <ul className="py-2 text-sm text-gray-700">
                            {Service_DropDown.map(({ key, name }) => (
                              <li
                                key={key}
                                onClick={() =>
                                  handleDropdownisDropdown_Service_(name)
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
                  {/* -------------XVII--2------------- */}
                  {/* -------------Status------------- */}
                  <div className="relative flex w-1/2 flex-col">
                    <label
                      htmlFor="status"
                      className="text-sm font-medium text-gray-700"
                    >
                      Status
                    </label>
                    <div
                      className="relative"
                      onClick={toggleDropdown_Status_}
                      onMouseLeave={() => setisDropdownVisible_Status_(false)}
                    >
                      <button
                        className="mt-1 flex w-full items-center justify-between rounded-md border border-gray-300 p-2"
                        id="Status_TypeDropDown"
                        type="button"
                      >
                        {isEditMode
                          ? editLead.status
                          : defaultText_Status_DropDown}
                        <FaAngleDown className="ml-2 text-gray-400" />
                      </button>
                      {isDropdownVisible_Status_ && (
                        <div className="absolute top-11 z-10 w-full rounded-md border border-gray-300 bg-white">
                          <ul className="py-2 text-sm text-gray-700">
                            {Status_DropDown.map(({ key, name }) => (
                              <li
                                key={key}
                                onClick={() =>
                                  handleDropdownisDropdown_Status_(key, name)
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
            </div>

            {/*--------------------------Description Box-------------------------- */}
            <div className="mx-3 rounded-xl bg-white shadow-md">
              <h2 className="rounded-t-xl bg-cyan-500 px-4 py-2 font-medium text-white">
                Description Information
              </h2>
              <div className="px-2 py-4">
                <div className="flex flex-col">
                  <label
                    htmlFor="remarks"
                    className="text-sm font-medium text-gray-700"
                  >
                    Description
                  </label>
                  <textarea
      name="description"
      value={description}
      onChange={handleDescriptionChange}
      placeholder="Add Description"
      className="mt-1 h-60 max-h-full w-full resize-none text-balance"
    />
                </div>
              </div>
              <div className="mr-10 flex justify-end gap-5">
                <div className="mr-20 flex justify-end">
                  <button
                    type="submit"
                    className="mb-4 mt-40 rounded border-2 border-cyan-500 bg-cyan-500 px-32 py-4 text-white hover:bg-white hover:text-cyan-500"
                  >
                    {isEditMode ? "Update" : "Save"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}
