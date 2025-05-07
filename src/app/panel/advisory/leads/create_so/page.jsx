"use client";
//NOTE-->>
//BROKERAGE + ADVISARY

//react
import { useState, useEffect } from "react";

//reactPackages
import { Link, useNavigate, useParams } from "react-router-dom";

//reactIcon
import { FaAngleDown, FaStarOfLife } from "react-icons/fa";
import { IoInformationCircle } from "react-icons/io5";

//external Packages
import axios from "axios";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

//API-Keywords
import { tenant_base_url, protocal_url } from "@/Config/Config";
import { getHostnamePart } from "@/components/GlobalHostUrl";

//dropDown --->>> Data
//LanguageDropDown
import languageDropDown from "../../../../data/dropdown/Languages/languageDropdown";

//businessDropDown
import businessDropDown from "../../../../data/dropdown/Business/businessDropdown";

//serviceDropDown
import serviceDropDown from "../../../../data/dropdown/Term/termDropDown";

//term
import termDropDown from "../../../../data/dropdown/Term/termDropDown";

//Toast-Conatainer
import { ToastContainer } from "react-toastify";
import {
  showSuccessToast,
  showErrorToast,
} from "@/utils/toastNotifications";

//dropDown --->>> customHooks
import useSegment from "@/Hooks/Segment/useSegment";
import useManagedBy from "@/Hooks/ManagedBy/useManagedBy";
import useLeadSource from "@/Hooks/LeadSource/useLeadSource";

export default function CreateSOLead() {
  const { id } = useParams();
 const router = useRouter();

  //IMP used as ${name} in an API
  const name = getHostnamePart();

    //--------------------------------------- Set Business Type --------------------------------------------
             const [BusinessType, setBusinessType] = useState("");
              
             useEffect(() => {
               const storedType = localStorage.getItem("businessType") || "";
               setBusinessType(storedType);
             }, []);

  //const bearer_token for API Config
  const bearer_token = localStorage.getItem("token");

  // Custom Hook
  const { segments } = useSegment();
  const { managedBy } = useManagedBy();
  const { leadSource } = useLeadSource();

  //------- Business Type --------
  const businessType = localStorage.getItem("businessType");
  const [business, setBusiness] = useState("");

  //form description is kept-out
  const [description, setdescription] = useState("Add Text Here");

  const [editLead, seteditLead] = useState([]);

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
    console.log("Company Type :-> ", businessType);
    setBusiness(businessType);
  }, [id]);

  //GET by ID---------------------------//GET---------------------------//GET---------------------------by ID-----------by ID
  async function handleLeadbyId() {
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
      console.log(data);

      seteditLead({
        //Personal Details
        leadId: data.id || "",
        clientName: data?.name || "",
        language: data?.language || "",
        mobileNo: data?.mobileNo || "",
        phoneNo: data?.phoneNo || "",
        email: data?.email || "",
        leadSource: data?.leadsSource || "N/A",
        assigned_To: data?.assigned_To || "N/A",
        street: data?.street || "",
        postalCode: data?.postalCode || "",
        country: data?.country || "",
        city: data?.city || "",
        state: data?.state || "",
        advisaryExp: data?.advisaryExp || "",

        //Payment Details
        segments: data?.segments || [],

        // Service Details
        subscription_start_date: data?.trialStartDate
          ? data.trialStartDate.split("T")[0]
          : null,
        subscription_end_date: data?.trialEndDate
          ? data.trialEndDate.split("T")[0]
          : null,
      });
      //Description Information
      setdescription(data.description);
    } catch (error) {
      console.error("Error fetching leads:", error);
    }
  }

  //----------------------------------------------------------------------------------------
  useEffect(() => {
    setdefaultTextSegmentDropDown(
      editLead.segments?.length > 0
        ? editLead.segments.join(", ")
        : "Select Segment",
    );
  }, [editLead]);

  //----------------------------------------------------------------------------------------
  //Segment
  const [defaultTextSegmentDropDown, setdefaultTextSegmentDropDown] =
    useState("Select Segment");
  const [isDropdownVisibleSegment, setisDropdownVisibleSegment] =
    useState(false);

  const toggleDropdownSegment = () => {
    setisDropdownVisibleSegment(true);
  };

  const handleCheckboxChange = (segment) => {
    const isChecked = editLead.segments.includes(segment);

    let updatedSegments;
    if (isChecked) {
      // Remove segment if already selected
      updatedSegments = editLead.segments.filter(
        (selectedSegment) => selectedSegment !== segment,
      );
    } else {
      // Add segment if not already selected
      updatedSegments = [...editLead.segments, segment];
    }
    seteditLead((prev) => ({
      ...prev,
      segments: updatedSegments,
    }));

    setdefaultTextSegmentDropDown(
      updatedSegments?.length > 0
        ? updatedSegments.join(", ")
        : "Select Segment",
    );

    console.log("Selected segments:", updatedSegments);
  };

  //----------------------------------------------------------------------------------------
  //assigned_ToDropDown
  const [defaultTextassigned_ToDropDown, setdefaultTextassigned_ToDropDown] =
    useState("Selected Managed By");

  useEffect(() => {
    if (editLead?.assigned_To) {
      setdefaultTextassigned_ToDropDown(editLead.assigned_To);
    } else {
      setdefaultTextassigned_ToDropDown("Select Lead Source");
    }
  }, [editLead?.assigned_To]);

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

  //----------------------------------------------------------------------------------------
  //Service
  const [defaultText_Service_DropDown, setDefaultText_Service_DropDown] =
    useState("Select Service");

  const [isDropdownVisible_Service_, setisDropdownVisible_Service_] =
    useState(false);

  const toggleDropdown_Service_ = () => {
    setisDropdownVisible_Service_(!isDropdownVisible_Service_);
  };

  const handleDropdownisDropdown_Service_ = (service) => {
    setDefaultText_Service_DropDown(service);
    setisDropdownVisible_Service_(!isDropdownVisible_Service_);
    seteditLead((prevTask) => ({
      ...prevTask,
      service: service,
    }));
  };

  //----------------------------------------------------------------------------------------
  //Term
  const [defaultText_Term_DropDown, setDefaultText_Term_DropDown] =
    useState("Select Term");

  const [isDropdownVisible_Term_, setisDropdownVisible_Term_] = useState(false);

  const toggleDropdown_Term_ = () => {
    setisDropdownVisible_Term_(!isDropdownVisible_Term_);
  };

  const handleDropdownisDropdown_Term_ = (term) => {
    setDefaultText_Term_DropDown(term);
    setisDropdownVisible_Term_(!setisDropdownVisible_Term_);
    seteditLead((prevTask) => ({
      ...prevTask,
      term: term,
    }));
  };

  //----------------------------------------------------------------------------------------
  //Business Type
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
      business: businessType,
    }));
  };

  //----------------------------------------------------------------------------------------

  //---------------------------> Lead Source <---------------------------
  //default text for Lead Source
  const [defaultTextPool, setDefaultTextPool] = useState("Select Lead Source");

  useEffect(() => {
    if (editLead?.leadSource) {
      setDefaultTextPool(editLead.leadSource);
    } else {
      setDefaultTextPool("Select Lead Source");
    }
  }, [editLead?.leadSource]);

  //dropDown State
  const [isPoolDropdownOpen, setIsPoolDropdownOpen] = useState(false);

  //error
  const [error, setError] = useState(null); // New error state

  //
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

  //LanguageDropDown
  const [defaultTextLanguageDropDown, setDefaultTextLanguageDropDown] =
    useState("Select Language");

  // Update default language when editLead.language changes
  useEffect(() => {
    if (editLead?.language) {
      setDefaultTextLanguageDropDown(editLead.language);
    } else {
      setDefaultTextLanguageDropDown("Select Language");
    }
  }, [editLead?.language]);

  const [isDropdownVisibleLanguage, setisDropdownVisibleLanguage] =
    useState(false);

  const toggleDropdownLanguage = () => {
    setisDropdownVisibleLanguage(!isDropdownVisibleLanguage);
  };

  const handleDropdownLanguage = (language) => {
    setDefaultTextLanguageDropDown(language);
    setisDropdownVisibleLanguage(!isDropdownVisibleLanguage);
    seteditLead((prevTask) => ({
      ...prevTask,
      language: language,
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

  //---------->handleChange<----------
  const handleChange = (e) => {
    const { name, value } = e.target;
    seteditLead((prevTask) => ({
      ...prevTask,
      [name]: value,
    }));
  };

  //---------->handleSubmit<----------
  //models, PUT, and POST
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

      const formData_POST = {
        //Personal Details
        leadId: editLead.leadId,
        leadSource: editLead.leadSource || null,
        clientName: editLead.clientName,
        language: editLead?.language,
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
        postalCode: editLead.postalCode,
        dob: editLead.dob,
        country: editLead.country,
        business: editLead.business || "",
        advisaryExp: editLead.advisaryExp,
        bank_name: editLead.bank_name,
        branch_name: editLead.branch_name,
        paymenT_MODE: editLead.paymenT_MODE,
        reference_Number: editLead.reference_Number,
        totalAmount: editLead.totalAmount,
        due_Amount: editLead.due_Amount,
        amount_paid: editLead.amount_paid,
        discount: editLead.discount,
        paymentDate: editLead.paymentDate,
        chequeOrDD_no: editLead.chequeOrDD_no,
        segments: editLead.segments,
        saleS_ODR_NO: editLead.saleS_ODR_NO,
        period_of_Subscription: editLead.period_of_Subscription || null,
        term: editLead.term,
        subscription_start_date: editLead.subscription_start_date || null,
        subscription_end_date: editLead.subscription_end_date || null,
        remarks: editLead.remarks,
        service: editLead.service || null,
        status: false,
        description: description,
      };

      //------------------------------------------------------------------------------------> Validations//--> Validations//--> Validations//--> Validations//--> Validations
      //------------------------------------------------------------------------------------> Validations//--> FOR BROKERAGE

      if (business == "Brokerage") {
        if (!formData_POST.clientName) {
          showErrorToast("Please enter name");
          return;
        }

        if (!formData_POST.mobileNo) {
          showErrorToast("Please enter mobile number");
          return;
        }
        if (!formData_POST.assigned_To) {
          showErrorToast("Please select Managed by");
          return;
        }
        if (!formData_POST.due_Amount) {
          showErrorToast("Please enter brokerage");
          return;
        }
        if (!formData_POST.amount_paid) {
          showErrorToast("Please enter funds");
          return;
        }
      }
      //------------------------------------------------------------------------------------> Validations//--> FOR OTHERS
      else {
        if (!formData_POST.clientName) {
          showErrorToast("Please enter name");
          return;
        }

        if (!formData_POST.mobileNo) {
          showErrorToast("Please enter mobile number");
          return;
        }

        if (!formData_POST.uidaI_Id_No) {
          showErrorToast("Please enter UIDAI Id");
          return;
        }

        if (!formData_POST.panCard_No) {
          showErrorToast("Please enter pan card number");
          return;
        }

        if (formData_POST.email && !emailRegex.test(formData_POST.email)) {
          showErrorToast("Invalid email format");
          return;
        }

        if (!formData_POST.assigned_To) {
          showErrorToast("Please select Managed by");
          return;
        }
        if (!formData_POST.reference_Number) {
          showErrorToast("Please enter reference number");
          return;
        }

        if (!formData_POST.amount_paid) {
          showErrorToast("Please enter paid amount");
          return;
        }

        if (!formData_POST.paymentDate) {
          showErrorToast("Please enter payment date");
          return;
        }
        //Date Logic Validation
        const today = new Date().toISOString().split("T")[0];

        //Previous date cannot be selected
        if (formData_POST.subscription_start_date < today) {
          showErrorToast("Previous date cannot be selected");
          return;
        }

        if (formData_POST.subscription_end_date < today) {
          showErrorToast("Previous date cannot be selected");
          return;
        }

        if (!formData_POST.subscription_start_date) {
          showErrorToast("Please select subscription start date");
          return;
        }

        if (!formData_POST.subscription_end_date) {
          showErrorToast("Please select subscription end date");
          return;
        }
      }

      const response = await axios.post(
        `${protocal_url}${name}.${tenant_base_url}/SalesOrder/salesOrder/add`,
        formData_POST,
        config,
      );
      if (response.data.isSuccess) {
        showSuccessToast("Sales Order created successfully!");
        router.push(`/panel/${BusinessType}/leads`);
      }
      // Redirect after a short delay
    } catch (error) {
      console.log(error);
      showErrorToast(error.data.message);
    }
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
            <h1 className="text-xl">Create Sales Order</h1>
          </div>
          <div>
            {/* ------------------------------------------------> Cancel Button  <------------------------------------------------ */}
            <Link
              to={`/panel/${BusinessType}/leads`}
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
            {/*CHILD Div------ Image Input */}

            <div className="m-3 rounded-xl bg-white shadow-md">
              <h2 className="rounded-t-xl bg-cyan-500 px-4 py-2 font-medium text-white">
                Personal Details
              </h2>

              {/* -------------Parent <SALES ORDER INFORMATION STARTS FROM HERE>------------- */}
              {/* ------------------------------------< business === "brokerage" >------------------------------------- */}
              {/* ------------------------------------< Client Name, Mobile Number, Alternate Number, Email, Managed By, Country, State, City, Pin-Code >------------------------------------- */}

              {
                business === "brokerage" ? (
                  <div className="space-y-3 p-2">
                    {/* ------------------------------------1------------------------------------- */}
                    {/* -------------SUB -> Parent -> <Name && Mobile Number>------------- */}
                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-4">
                      {/* -------------Client Name------------- */}
                      <div className="relative flex flex-col">
                        <label
                          htmlFor="clientName"
                          className="text-sm font-medium text-gray-700"
                        >
                          <span className="flex gap-1">
                            Client Name
                            <FaStarOfLife size={8} className="text-red-500" />
                          </span>
                        </label>
                        <input
                          type="text"
                          name="clientName"
                          value={editLead.clientName}
                          placeholder="Enter Client's Name"
                          onChange={handleChange}
                          className="mt-1 w-full rounded-md border border-gray-300 p-2"
                        />
                      </div>
                      {/* -------------Mobile Number------------- */}
                      <div className="relative flex flex-col">
                        <label
                          htmlFor="mobileNo"
                          className="text-sm font-medium text-gray-700"
                        >
                          <span className="flex gap-1">
                            Mobile Number
                            <FaStarOfLife size={8} className="text-red-500" />
                          </span>
                        </label>
                        <input
                          type="text"
                          name="mobileNo"
                          value={editLead.mobileNo}
                          maxLength="15"
                          className="mt-1 w-full rounded-md border border-gray-300 p-2"
                          onChange={handleContactChange}
                          placeholder="Enter your Mobile Number"
                        />
                      </div>
                    </div>

                    {/* ------------------------------------2------------------------------------- */}
                    {/* -------------SUB -> Parent -> <Alternate Numbe && EMail>------------- */}
                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-4">
                      {/* -------------Alternate Number------------- */}
                      <div className="relative flex flex-col">
                        <label
                          htmlFor="phoneNo"
                          className="text-sm font-medium text-gray-700"
                        >
                          Alternate Number
                        </label>
                        <input
                          type="number"
                          name="phoneNo"
                          maxLength="15"
                          value={editLead.phoneNo}
                          className="mt-1 w-full rounded-md border border-gray-300 p-2"
                          onChange={handleContactChange}
                          placeholder="Enter your Alternate Number"
                          onKeyDown={(e) => {
                            if (e.key === "e" || e.key === "E") {
                              e.preventDefault(); // Block 'e' and 'E'
                            }
                          }}
                          onWheel={(e) => e.target.blur()} // Disable scroll
                        />
                      </div>
                      {/* -------------Email------------- */}
                      <div className="relative flex flex-col">
                        <label
                          htmlFor="email"
                          className="text-sm font-medium text-gray-700"
                        >
                          <span className="flex gap-1">
                            Email
                            <FaStarOfLife size={8} className="text-red-500" />
                          </span>
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={editLead.email}
                          onChange={handleChange}
                          placeholder="Enter your Email"
                          className="mt-1 w-full rounded-md border border-gray-300 p-2"
                        />
                      </div>
                    </div>

                    {/* ------------------------------------3------------------------------------- */}
                    {/* -------------SUB -> Parent -> <Managed By && Lead Status>------------- */}
                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-4">
                      {/* -------------Managed By------------- */}
                      <div className="relative flex flex-col">
                        <label
                          htmlFor="managedBy"
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
                            <div className="absolute top-11 z-10 w-full rounded-md border border-gray-300 bg-white">
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

                      {/* -------------Country------------- */}
                      <div className="relative flex flex-col">
                        <label
                          htmlFor="country"
                          className="text-sm font-medium text-gray-700"
                        >
                          Country
                        </label>
                        <input
                          type="text"
                          name="city"
                          value={editLead.country}
                          className="mt-1 w-full rounded-md border border-gray-300 p-2"
                          onChange={handleChange}
                          placeholder="Enter your Country"
                        />
                      </div>
                    </div>

                    {/* -------------VI--1--------------- */}
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
                          placeholder="Enter your State"
                        />
                      </div>
                      {/* -------------VI--2--------------- */}
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
                          placeholder="Enter your City"
                        />
                      </div>
                    </div>

                    {/* -------------VII--1--------------- */}
                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-4">
                      {/* -------------PinCode------------- */}
                      <div className="relative flex flex-col">
                        <label
                          htmlFor="postalCode"
                          className="text-sm font-medium text-gray-700"
                        >
                          Pincode
                        </label>
                        <input
                          type="text"
                          name="pinCode"
                          value={editLead.postalCode}
                          className="mt-1 w-full rounded-md border border-gray-300 p-2"
                          onChange={handleChange}
                          placeholder="Enter your pincode"
                        />
                      </div>
                      {/* -------------VII--2--------------- */}
                      <div className="relative flex flex-col">
                        {/* -------------Lead Source------------- */}
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
                              : editLead?.leadSource}
                            <FaAngleDown className="ml-2 text-gray-400" />
                          </button>
                          {isPoolDropdownOpen && (
                            <div className="absolute top-11 z-10 w-full rounded-md border border-gray-300 bg-white">
                              {error ? (
                                <div className="py-2 text-red-600">{error}</div>
                              ) : (
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
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  // {/* ------------------------------------< businessType === "Other" >------------------------------------- */}
                  // {/* ------------------------------------< Client Name, Language, Father's Name, Mother's Name , Mobile Number, Alternate Number, UIDAI Id, Pan Card, Email, Managed By, DOB, Country, State, City, Street, Pin-Code >------------------------------------- */}

                  <div className="space-y-3 p-2">
                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-4">
                      <div className="relative flex flex-col">
                        <label
                          htmlFor="clientName"
                          className="text-sm font-medium text-gray-700"
                        >
                          <span className="flex gap-1">
                            Client Name
                            <FaStarOfLife size={8} className="text-red-500" />
                          </span>
                        </label>
                        <input
                          type="text"
                          name="clientName"
                          value={editLead.clientName}
                          placeholder="Enter Client's Name"
                          onChange={handleChange}
                          className="mt-1 w-full rounded-md border border-gray-300 p-2"
                        />
                      </div>
                      {/* -------------I--2------------- */}
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
                          onMouseLeave={() =>
                            setisDropdownVisibleLanguage(false)
                          }
                        >
                          <button
                            className="mt-1 flex w-full items-center justify-between rounded-md border border-gray-300 p-2"
                            id="LanguageDropDown"
                            type="button"
                          >
                            {!isEditMode
                              ? defaultTextLanguageDropDown
                              : editLead.language ||
                                defaultTextLanguageDropDown}
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
                    {/* -------------II--1------------- */}
                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-4">
                      {/* -------------Father's Name------------- */}
                      <div className="relative flex flex-col">
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
                          className="mt-1 w-full rounded-md border border-gray-300 p-2"
                          onChange={handleChange}
                          placeholder="Enter Father's Name"
                        />
                      </div>
                      {/* -------------Mother's Name ------------- */}
                      <div className="relative flex flex-col">
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
                          className="mt-1 w-full rounded-md border border-gray-300 p-2"
                          onChange={handleChange}
                          placeholder="Enter Mother's Name"
                        />
                      </div>
                    </div>
                    {/* -------------III--1------------- */}
                    {/* -------------Mobile Number------------- */}
                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-4">
                      <div className="relative flex flex-col">
                        <label
                          htmlFor="mobileNo"
                          className="text-sm font-medium text-gray-700"
                        >
                          <span className="flex gap-1">
                            Mobile Number
                            <FaStarOfLife size={8} className="text-red-500" />
                          </span>
                        </label>
                        <input
                          type="number"
                          name="mobileNo"
                          value={editLead.mobileNo}
                          maxLength="15"
                          className="mt-1 w-full rounded-md border border-gray-300 p-2"
                          onChange={handleContactChange}
                          placeholder="Enter your Mobile Number"
                          onKeyDown={(e) => {
                            if (e.key === "e" || e.key === "E") {
                              e.preventDefault(); // Block 'e' and 'E'
                            }
                          }}
                          onWheel={(e) => e.target.blur()} // Disable scroll
                        />
                      </div>
                      {/* -------------III--2------------- */}
                      {/* -------------Alternate Number------------- */}
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
                          maxLength="15"
                          value={editLead.phoneNo}
                          className="mt-1 w-full rounded-md border border-gray-300 p-2"
                          onChange={handleContactChange}
                          placeholder="Enter your Alternate Number"
                          onKeyDown={(e) => {
                            if (e.key === "e" || e.key === "E") {
                              e.preventDefault(); // Block 'e' and 'E'
                            }
                          }}
                          onWheel={(e) => e.target.blur()} // Disable scroll
                        />
                      </div>
                    </div>

                    {/* -------------IV--1--------------- */}
                    {/* -------------UIDAI Id------------- */}
                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-4">
                      <div className="relative flex flex-col">
                        <label
                          htmlFor="uidaI_Id_No"
                          className="text-sm font-medium text-gray-700"
                        >
                          <span className="flex gap-1">
                            Enter UIDAI Id
                            <FaStarOfLife size={8} className="text-red-500" />
                          </span>
                        </label>
                        <input
                          type="number"
                          name="uidaI_Id_No"
                          maxLength="12"
                          value={editLead.uidaI_Id_No}
                          className="mt-1 w-full rounded-md border border-gray-300 p-2"
                          onChange={handleChange}
                          placeholder="9009 9009 9009"
                          onKeyDown={(e) => {
                            if (e.key === "e" || e.key === "E") {
                              e.preventDefault(); // Block 'e' and 'E'
                            }
                          }}
                          onWheel={(e) => e.target.blur()} // Disable scroll
                        />
                      </div>
                      {/* -------------IV--2--------------- */}
                      {/* -------------Pan Card No.------------- */}
                      <div className="relative flex flex-col">
                        <label
                          htmlFor="panCard_No"
                          className="text-sm font-medium text-gray-700"
                        >
                          <span className="flex gap-1">
                            Pan Card No.
                            <FaStarOfLife size={8} className="text-red-500" />
                          </span>
                        </label>
                        <input
                          type="text"
                          name="panCard_No"
                          value={editLead.panCard_No}
                          className="mt-1 rounded-md border border-gray-300 p-2 uppercase"
                          onChange={handleChange}
                          placeholder="Enter your Pan Card Details"
                        />
                      </div>
                    </div>
                    {/* -------------V--1--------------- */}
                    {/* -------------Email------------- */}
                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-4">
                      <div className="relative flex flex-col">
                        <label
                          htmlFor="email"
                          className="text-sm font-medium text-gray-700"
                        >
                          <span className="flex gap-1">
                            Email
                            <FaStarOfLife size={8} className="text-red-500" />
                          </span>
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
                      {/* -------------V--2--------------- */}
                      {/* -------------Managed By------------- */}
                      <div className="relative flex flex-col">
                        <label
                          htmlFor="leadesStatus"
                          className="text-sm font-medium text-gray-700"
                        >
                          <span className="flex gap-1">
                            Managed By
                            <FaStarOfLife size={8} className="text-red-500" />
                          </span>
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
                              ? defaultTextassigned_ToDropDown
                              : editLead.assigned_To}
                            <FaAngleDown className="ml-2 text-gray-400" />
                          </button>
                          {isDropdownassigned_ToDropDown && (
                            <div className="top-9.9 absolute z-10 w-full rounded-md border border-gray-300 bg-white">
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
                    </div>

                    {/* -------------0--1--------------- */}
                    {/* -------------DOB------------- */}
                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-4">
                      <div className="relative flex flex-col">
                        <label
                          htmlFor="dob"
                          className="text-sm font-medium text-gray-700"
                        >
                          DOB
                        </label>
                        <input
                          type="date"
                          name="state"
                          value={editLead.dob}
                          className="mt-1 w-full rounded-md border border-gray-300 p-2"
                          onChange={handleChange}
                        />
                      </div>
                      {/* -------------0--2--------------- */}
                      {/* -------------Country------------- */}
                      <div className="relative flex flex-col">
                        <label
                          htmlFor="country"
                          className="text-sm font-medium text-gray-700"
                        >
                          Country
                        </label>
                        <input
                          type="text"
                          name="city"
                          value={editLead.country}
                          className="mt-1 w-full rounded-md border border-gray-300 p-2"
                          onChange={handleChange}
                          placeholder="Enter your Country"
                        />
                      </div>
                    </div>

                    {/* -------------VI--1--------------- */}
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
                          placeholder="Enter your State"
                        />
                      </div>
                      {/* -------------VI--2--------------- */}
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
                          placeholder="Enter your City"
                        />
                      </div>
                    </div>

                    {/* -------------VII--1--------------- */}
                    {/* -------------Street------------- */}
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
                      {/* -------------VII--2--------------- */}
                      {/* -------------PinCode------------- */}
                      <div className="relative flex flex-col">
                        <label
                          htmlFor="postalCode"
                          className="text-sm font-medium text-gray-700"
                        >
                          Pincode
                        </label>
                        <input
                          type="text"
                          name="pinCode"
                          value={editLead.postalCode}
                          className="mt-1 w-full rounded-md border border-gray-300 p-2"
                          onChange={handleChange}
                          placeholder="Enter your pincode"
                        />
                      </div>
                    </div>

                    {/* -------------VIII--1--------------- */}
                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-4">
                      {/* -------------Business Type------------- */}
                      <div className="relative flex flex-col">
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
                                {businessDropDown.map(({ key, name }) => (
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
                      <div className="relative flex flex-col">
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
                          className="mt-1 w-full rounded-md border border-gray-300 p-2"
                          onChange={handleChange}
                          placeholder="Enter years"
                        />
                      </div>
                    </div>
                    {/* -------------IX--1--------------- */}
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
                              {error ? (
                                <div className="py-2 text-red-600">{error}</div>
                              ) : (
                                <ul className="py-2 text-sm text-gray-700">
                                  {leadSource?.map(({ id, poolName }) => (
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
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )
                // {/* ------------------------------------------------------------------------------ */}
              }
            </div>
            {/* ------------------------------------------------>TAB  2 : Payment Details TAB <------------------------------------------------ */}

            {/* ------------------------------------< businessType === "Brokerage" >------------------------------------- */}
            {/* ------------------------------------< Brokerage, Funds, Payment Date, Segment   >------------------------------------- */}

            {
              business === "brokerage" ? (
                <div className="mx-3 my-3 flex-grow rounded-xl bg-white shadow-md">
                  <h2 className="rounded-t-xl bg-cyan-500 px-4 py-2 font-medium text-white">
                    Payment Details
                  </h2>
                  <div className="grid gap-2 px-4 py-2">
                    {/* ------------------------------------XI------------------------------------- */}
                    {/* -------------SUB -> Parent -> <Brokerage && Funds>------------- */}
                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-4">
                      {/* -------------XI--1------------- */}
                      <div className="relative flex flex-col">
                        {/* -------------  Brokerage ------------- */}

                        <label
                          htmlFor="due_Amount"
                          className="text-sm font-medium text-gray-700"
                        >
                          <span className="flex gap-1">
                            Brokerage
                            <FaStarOfLife size={8} className="text-red-500" />
                          </span>
                        </label>
                        <input
                          type="text"
                          name="due_Amount"
                          value={editLead.due_Amount}
                          className="mt-1 w-full rounded-md border border-gray-300 p-2"
                          onChange={handleChange}
                          placeholder="Brokerage"
                        />
                      </div>

                      {/* -------------XI--1------------- */}
                      <div className="relative flex flex-col">
                        {/* -------------  Funds ------------- */}
                        <label
                          htmlFor="amount_paid"
                          className="text-sm font-medium text-gray-700"
                        >
                          <span className="flex gap-1">
                            Funds
                            <FaStarOfLife size={8} className="text-red-500" />
                          </span>
                        </label>
                        <input
                          type="text"
                          name="amount_paid"
                          id="amount_paid"
                          value={editLead.amount_paid}
                          className="mt-1 w-full rounded-md border border-gray-300 p-2"
                          onChange={handleChange}
                          placeholder="Funds"
                        />
                      </div>
                    </div>

                    {/* -------------XIII--1------------- */}
                    {/* -------------Payment Date------------- */}
                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-4">
                      <div className="relative flex flex-col">
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
                          className="mt-1 w-full rounded-md border border-gray-300 p-2"
                          onChange={handleChange}
                        />
                      </div>
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
                          onMouseLeave={() =>
                            setisDropdownVisibleSegment(false)
                          }
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
                                {segments?.length > 0 ? (
                                  segments?.map(({ key, segment }) => (
                                    <li
                                      key={key}
                                      className="flex cursor-pointer items-center border-b px-4 py-2 hover:bg-cyan-500 hover:text-white"
                                    >
                                      <input
                                        type="checkbox"
                                        checked={editLead.segments?.includes(
                                          segment,
                                        )}
                                        onChange={() =>
                                          handleCheckboxChange(segment)
                                        }
                                        className="mr-2"
                                      />
                                      {segment}{" "}
                                      {/* Assuming segment is the property you want to display */}
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
              ) : (
                // {/* ------------------------------------< businessType === "Other" >------------------------------------- */}
                // {/* -------------Bank Name, Branch Name, Payment Mode ,Ref No ,Total Amount ,Due Amount ,Amount Paid ,Discount ,Payment Date ,Cheque No Or DD No., Segment, Sales Order No------------- */}

                <div className="mx-3 my-3 flex-grow rounded-xl bg-white shadow-md">
                  <h2 className="rounded-t-xl bg-cyan-500 px-4 py-2 font-medium text-white">
                    Payment Details
                  </h2>
                  <div className="grid gap-2 px-4 py-2">
                    {/* -------------IX--1----------------- */}
                    {/* -------------Bank Name------------- */}
                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-4">
                      <div className="relative flex flex-col">
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
                          className="mt-1 w-full rounded-md border border-gray-300 p-2"
                          onChange={handleChange}
                          placeholder="Bank Name"
                        />
                      </div>
                      {/* -------------IX--2----------------- */}
                      {/* -------------Branch Name------------- */}
                      <div className="relative flex flex-col">
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
                          className="mt-1 w-full rounded-md border border-gray-300 p-2"
                          onChange={handleChange}
                          placeholder="Branch Name"
                        />
                      </div>
                    </div>
                    {/* -------------X--1----------------- */}
                    {/* -------------Payment Mode------------- */}
                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-4">
                      <div className="relative flex flex-col">
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
                          className="mt-1 w-full rounded-md border border-gray-300 p-2"
                          onChange={handleChange}
                        />
                      </div>
                      {/* -------------X--2----------------- */}
                      {/* -------------Ref No------------- */}
                      <div className="relative flex flex-col">
                        <label
                          htmlFor="reference_Number"
                          className="text-sm font-medium text-gray-700"
                        >
                          <span className="flex gap-1">
                            Ref No
                            <FaStarOfLife size={8} className="text-red-500" />
                          </span>
                        </label>
                        <input
                          type="text"
                          name="reference_Number"
                          value={editLead.reference_Number}
                          className="mt-1 w-full rounded-md border border-gray-300 p-2"
                          onChange={handleChange}
                        />
                      </div>
                    </div>

                    {/* -------------XI--1------------- */}
                    {/* -------------Total Amount------------- */}
                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-4">
                      <div className="relative flex flex-col">
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
                          className="mt-1 w-full rounded-md border border-gray-300 p-2"
                          onChange={handleChange}
                          placeholder="Total Amount"
                          onKeyDown={(e) => {
                            if (e.key === "e" || e.key === "E") {
                              e.preventDefault(); // Block 'e' and 'E'
                            }
                          }}
                          onWheel={(e) => e.target.blur()} // Disable scroll
                        />
                      </div>
                      {/* -------------XI--2------------- */}
                      {/* -------------  Due Amount------------- */}
                      <div className="relative flex flex-col">
                        <label
                          htmlFor="due_Amount"
                          className="text-sm font-medium text-gray-700"
                        >
                          {/* Due Amount */}
                          Due Amount
                        </label>
                        <input
                          type="number"
                          name="due_Amount"
                          value={editLead.due_Amount}
                          className="mt-1 w-full rounded-md border border-gray-300 p-2"
                          onChange={handleChange}
                          placeholder="Due Amount"
                          onKeyDown={(e) => {
                            if (e.key === "e" || e.key === "E") {
                              e.preventDefault(); // Block 'e' and 'E'
                            }
                          }}
                          onWheel={(e) => e.target.blur()} // Disable scroll
                        />
                      </div>
                    </div>
                    {/* -------------XII--1------------- */}
                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-4">
                      <div className="relative flex flex-col">
                        {/* -------------Amount Paid------------- */}
                        <label
                          htmlFor="amount_paid"
                          className="text-sm font-medium text-gray-700"
                        >
                          <span className="flex gap-1">
                            Amount Paid
                            <FaStarOfLife size={8} className="text-red-500" />
                          </span>
                        </label>
                        <input
                          type="number"
                          name="amount_paid"
                          id="amount_paid"
                          value={editLead.amount_paid}
                          className="mt-1 w-full rounded-md border border-gray-300 p-2"
                          onChange={handleChange}
                          placeholder="Amount Paid"
                          onKeyDown={(e) => {
                            if (e.key === "e" || e.key === "E") {
                              e.preventDefault(); // Block 'e' and 'E'
                            }
                          }}
                          onWheel={(e) => e.target.blur()} // Disable scroll
                        />
                      </div>

                      <div className="relative flex flex-col">
                        {/* -------------Discount------------- */}

                        <label
                          htmlFor="discount"
                          className="text-sm font-medium text-gray-700"
                        >
                          Discount
                        </label>
                        <input
                          type="number"
                          name="discount"
                          id="discount"
                          value={editLead.discount}
                          className="mt-1 w-full rounded-md border border-gray-300 p-2"
                          onChange={handleChange}
                          placeholder="Discount"
                          onKeyDown={(e) => {
                            if (e.key === "e" || e.key === "E") {
                              e.preventDefault(); // Block 'e' and 'E'
                            }
                          }}
                          onWheel={(e) => e.target.blur()} // Disable scroll
                        />
                      </div>
                    </div>

                    {/* -------------XIII--1------------- */}
                    {/* -------------Payment Date------------- */}
                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-4">
                      <div className="relative flex flex-col">
                        <label
                          htmlFor="paymentDate"
                          className="text-sm font-medium text-gray-700"
                        >
                          <span className="flex gap-1">
                            Payment Date
                            <FaStarOfLife size={8} className="text-red-500" />
                          </span>
                        </label>
                        <input
                          type="date"
                          name="paymentDate"
                          value={editLead.paymentDate}
                          className="mt-1 w-full rounded-md border border-gray-300 p-2"
                          onChange={handleChange}
                        />
                      </div>
                      {/* -------------XIII--2------------- */}
                      {/* -------------Cheque No Or DD No.------------- */}

                      <div className="relative flex flex-col">
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
                          className="mt-1 w-full rounded-md border border-gray-300 p-2"
                          onChange={handleChange}
                          placeholder="Cheque No Or DD No"
                        />
                      </div>
                    </div>

                    {/* -------------XIV--1------------- */}
                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-4">
                      {/* -------------Segments-------------> */}
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
                          onMouseLeave={() =>
                            setisDropdownVisibleSegment(false)
                          }
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
                                {segments?.length > 0 ? (
                                  segments.map(({ key, segment }) => (
                                    <li
                                      key={segment.id}
                                      className="flex cursor-pointer items-center border-b px-4 py-2 hover:bg-cyan-500 hover:text-white"
                                    >
                                      <input
                                        type="checkbox"
                                        checked={editLead?.segments?.includes(
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
                      {/* -------------XIV--2------------- */}
                      {/* -------------Sales Order No------------- */}

                      <div className="relative flex flex-col">
                        <label
                          htmlFor="saleS_ODR_NO"
                          className="text-sm font-medium text-gray-700"
                        >
                          Sales Order No
                        </label>
                        <input
                          type="text"
                          name="saleS_ODR_NO"
                          value={editLead.saleS_ODR_NO}
                          className="mt-1 w-full rounded-md border border-gray-300 p-2"
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )
              // {/* ------------------------------------------------------------------------------ */}
            }

            {/* ------------------------------------------------>TAB  3 : SALES ORDER INFORMATION TAB <------------------------------------------------ */}
            <div className="mx-3 my-3 flex-grow rounded-xl bg-white shadow-md">
              <h2 className="rounded-t-xl bg-cyan-500 px-4 py-2 font-medium text-white">
                Service Details
              </h2>
              <div className="grid gap-2 px-4 py-2">
                {/* -------------SALES ORDER INFORMATION FORM STARTS FROM HERE------------- */}
                {/* ------------------------------------< businessType === "Brokerage" >------------------------------------- */}
                {/* ------------------------------------< Service, Status, Remarks   >------------------------------------- */}

                {/* ------------------------------------< businessType === "Other" >------------------------------------- */}
                {/* ------------------------------------< Period of Subscription, Term, Subscription Start Date, Subscription End Date, Service, Status, Remarks>------------------------------------- */}

                {business === "brokerage" ? (
                  ""
                ) : (
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-4">
                    {/* -------------SUB -> Parent -> <Period of Subscription && Funds>------------- */}
                    <div className="relative flex flex-col">
                      {/* -------------Period of Subscription & Term------------- */}
                      <label
                        htmlFor="period_of_Subscription"
                        className="text-sm font-medium text-gray-700"
                      >
                        Period of Subscription
                      </label>
                      <input
                        type="text"
                        name="period_of_Subscription"
                        value={editLead.period_of_Subscription}
                        className="mt-1 w-full rounded-md border border-gray-300 p-2"
                        onChange={handleChange}
                        placeholder="Period of Subscription"
                      />
                    </div>
                    {/* -------------Term------------- */}
                    {/* -------------XV--2------------- */}
                    <div className="relative flex flex-col">
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
                              {termDropDown.map(({ key, name }) => (
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
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-4">
                    <div className="relative flex flex-col">
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
                        className="mt-1 w-full rounded-md border border-gray-300 p-2"
                        onChange={handleChange}
                      />
                    </div>

                    {/* -------------XVI--2------------- */}
                    {/* -------------subscription_end_date------------- */}

                    <div className="relative flex flex-col">
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
                        className="mt-1 w-full rounded-md border border-gray-300 p-2"
                      />
                    </div>
                  </div>
                )}

                {/* -------------XVII--1------------- */}
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-4">
                  {/* -------------Service------------- */}
                  <div className="relative flex flex-col">
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
                            {serviceDropDown.map(({ key, name }) => (
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
                  <div className="relative flex flex-col">
                    <label
                      htmlFor="status"
                      className="text-sm font-medium text-gray-700"
                    >
                      Status
                    </label>
                    <input
                      readOnly
                      type="text"
                      name="status"
                      value="Pending"
                      className="mt-1 w-full rounded-md border border-gray-300 p-2"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-4">
                  {/* -------------Remark------------- */}
                  <div className="flex w-full flex-col">
                    <label
                      htmlFor="remarks"
                      className="text-sm font-medium text-gray-700"
                    >
                      Remarks
                    </label>
                    <input
                      type="text"
                      name="remarks"
                      value={editLead.remarks}
                      className="mt-1 w-full rounded-md border border-gray-300 p-2"
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/*--------------------------Description Box-------------------------- */}
            <div className="mx-3 rounded-xl bg-white shadow-md">
              <h2 className="rounded-t-xl bg-cyan-500 px-4 py-2 font-medium text-white">
                Description Information
              </h2>
              <div className="grid gap-2 px-2 py-4">
                <div className="flex flex-col">
                  <label
                    htmlFor="remarks"
                    className="text-sm font-medium text-gray-700"
                  >
                    Description
                  </label>
                  <ReactQuill
                    name="remarks"
                    value={description}
                    className="h-60 max-h-60 hyphens-auto text-balance"
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
                  Save
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}
