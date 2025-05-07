"use client";

//react
import Link from "next/link";
import { useRouter } from "next/navigation";

import { useState, useEffect } from "react";
import { FaAngleDown } from "react-icons/fa";
import axios from "axios";
import { IoInformationCircle } from "react-icons/io5";

//file
import { tenant_base_url, protocal_url } from "@/Config/Config";
import { getHostnamePart } from "@/components/GlobalHostUrl";

export default function CreateSendSms() {
  const name = getHostnamePart();
  const router = useRouter();
  //--------------------------------------- Set Business Type --------------------------------------------
  const [BusinessType, setBusinessType] = useState("");

  useEffect(() => {
    const storedType = localStorage.getItem("businessType") || "";
    setBusinessType(storedType);
  }, []);

  const [editSms, setEditSms] = useState({
    mobilenos: [],
    smsType: "",
    products: "",
    callStatus: "",
    textMessage: "",
    sentDateTime: "",
    lastModifiedBy: "",
  });

  //  --------------------------------------- HANDLING INPUTS CHANGE ----------------------------------------
  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditSms({
      ...editSms,
      [name]: value,
    });
  };

  // --------------------------------------------- Check Box Start -------------------------------------------

  const [selectedCheckbox, setSelectedCheckbox] = useState("Free Trail");

  const handleCheckboxChange = (name) => {
    setSelectedCheckbox(name === selectedCheckbox ? "" : name);
  };

  useEffect(() => {
    const currentDate = new Date().toISOString();
    setEditSms((prev) => ({
      ...prev,
      smsType: selectedCheckbox,
      sentDateTime: currentDate,
    }));
  }, [selectedCheckbox]);

  // --------------------------------------------- Check Box End -------------------------------------------

  // ---------------------------------------------  Call Status Start -------------------------------------------

  // DUMMY CALL STATUS
  const callStatusData = [
    { key: 1, name: "Service Call" },
    { key: 2, name: "Trail call" },
    { key: 3, name: "Promotional call" },
  ];

  const [callStatusDropdown, setCallStatusDropdown] = useState(false);
  const [defaultCallStatusText, setDefaultCallStatusText] =
    useState("Call Status");

  const toggleDropdownCallStatus = () => {
    setCallStatusDropdown(!callStatusDropdown);
  };

  const handleDropdownCallStatus = (name) => {
    setDefaultCallStatusText(name);
    setCallStatusDropdown(!callStatusDropdown);
    setEditSms((prev) => ({
      ...prev,
      callStatus: name,
    }));
  };

  // ---------------------------------------------  Call Status End -------------------------------------------

  // ---------------------------------------------  SMS Templates Start -------------------------------------------
  const [templates, setTemplates] = useState([]);
  const [templateDropdown, setTemplateDropdown] = useState(false);
  const [defaultTemplateText, setDefaultTemplateText] =
    useState("Select Template");

  //--------------------------------------- Fatch Templates -------------------------------------------------
  async function handleLead() {
    const bearer_token = localStorage.getItem("token");
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${bearer_token}`,
        },
      };
      const response = await axios.get(
        `${protocal_url}${name}.${tenant_base_url}/Admin/smstemplates/getall`,
        config
      );
      setTemplates(response.data.data);
    } catch (error) {
      console.error("Error fetching leads:", error);
    }
  }

  useEffect(() => {
    handleLead();
  }, []);

  //--------------------------------------- DropDown Handling -------------------------------------------------

  // TOGGLE CALL TEST MSG
  const toggleDropdownTemplate = () => {
    setTemplateDropdown(!templateDropdown);
  };

  const handleDropdownTemplate = (name) => {
    setDefaultTemplateText(name);
    setTemplateDropdown(!templateDropdown);
  };

  useEffect(() => {
    setEditSms((prev) => ({
      ...prev,
      textMessage: defaultTemplateText,
    }));
  }, [defaultTemplateText]);

  // --------------------------------------------- SMS Templates End -------------------------------------------

  //--------------------------------------- Segments OR Product -------------------------------------------------
  const [segments, setSegments] = useState([]);
  const [selectedSegments, setSelectedSegments] = useState([]);
  const [defaultTextSegmentDropDown, setDefaultTextSegmentDropDown] =
    useState("Select Segment");
  const [isDropdownVisibleSegment, setIsDropdownVisibleSegment] =
    useState(false);

  //--------------------------------------- Fatch Segment -------------------------------------------------
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
        config
      );
      setSegments(response.data.data);
    } catch (error) {
      console.error("Error fetching segments:", error);
    }
  }

  useEffect(() => {
    handleSegment();
  }, []);

  //--------------------------------------- DropDown Handling -------------------------------------------------

  const toggleDropdownSegment = () => {
    setIsDropdownVisibleSegment(!isDropdownVisibleSegment);
  };

  const handleProductChange = (segment) => {
    const isChecked = selectedSegments.includes(segment.segment);

    let updatedSegments;
    if (isChecked) {
      // Remove segment if already selected
      updatedSegments = selectedSegments.filter(
        (selectedSegment) => selectedSegment !== segment.segment
      );
    } else {
      // Add segment if not already selected
      updatedSegments = [...selectedSegments, segment.segment];
    }

    setSelectedSegments(updatedSegments);

    setDefaultTextSegmentDropDown(
      updatedSegments.length > 0 ? updatedSegments.join(", ") : "Select Segment"
    );
  };

  useEffect(() => {
    setEditSms((prev) => ({
      ...prev,
      products: defaultTextSegmentDropDown,
    }));
  }, [defaultTextSegmentDropDown]);

  //--------------------------------------- Segments END-------------------------------------------------

  //--------------------------------------- Get Mobile Number by Segment Start-------------------------------------------------

  useEffect(() => {
    fetchMobileNumber();
  }, [selectedSegments]);

  async function fetchMobileNumber() {
    const bearer_token = localStorage.getItem("token");

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${bearer_token}`,
        },
      };

      // setEditSms.([]);

      // Construct the query string with selected segments
      const segmentQuery = selectedSegments
        .map((segment) => `segments=${encodeURIComponent(segment)}`)
        .join("&");

      let url;
      if (selectedCheckbox === "Free Trail") {
        url = `${protocal_url}${name}.${tenant_base_url}/Trail/alltrailmobileno/bysegment?${segmentQuery}`;
      } else if (selectedCheckbox === "Paid Clients") {
        url = `${protocal_url}${name}.${tenant_base_url}/SalesOrder/salesOrder/clientmobilenobysegments?${segmentQuery}`;
      }

      const response = await axios.get(url, config);
      setEditSms((prev) => ({
        ...prev,
        mobilenos: response.data.data,
      }));
    } catch (error) {
      console.error("Error fetching mobile numbers:", error);
    }
  }

  //--------------------------------------- Get Mobile Number by Segment End-------------------------------------------------

  // ------------------------------  Handle Submit ------------------------

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    const bearer_token = localStorage.getItem("token");
    const config = {
      headers: {
        Authorization: `Bearer ${bearer_token}`,
      },
    };

    // Constructing the request body
    const requestBody = {
      mobilenos: editSms.mobilenos,
      requests: {
        smsType: editSms.smsType,
        products: editSms.products,
        callStatus: editSms.callStatus,
        textMessage: editSms.textMessage,
        sentDateTime: editSms.sentDateTime,
        lastModifiedBy: editSms.lastModifiedBy,
      },
    };

    console.log("Request Body on Submit:", requestBody); // Log final form submission data

    try {
      await axios.post(
        `${protocal_url}${name}.${tenant_base_url}/SMSBox/send-servicesms`,
        requestBody,
        config
      );
      alert("Successfully Added");
      router.push(`/panel/${BusinessType}/servicebox`);
    } catch (error) {
      console.error("Error saving pool name", error);
      alert("Failed to save pool. Please try again.");
    }
  };

  return (
    // TOP SECTION
    <div className="m-3 flex flex-col overflow-x-auto overflow-y-hidden">
      <div className="flex items-center justify-between rounded-md bg-white px-3 py-2 shadow-md">
        <h1 className="text-xl">Send SMS</h1>
        <Link
          href={`/panel/${BusinessType}/servicebox`}
          className="mx-3 rounded border border-blue-500 px-4 py-1 text-blue-500"
        >
          Cancel
        </Link>
      </div>
      {/* -------------FORM Starts FROM HERE------------- */}
      <form onSubmit={handleFormSubmit} className="mb-6 flex flex-col">
        {/* -------------SMS DETAILS STARTS FROM HERE------------- */}
        <div className="my-3 flex-grow rounded-xl bg-white shadow-md">
          <h2 className="rounded-t-xl bg-cyan-500 px-3 py-2 font-medium text-white">
            SMS Details
          </h2>

          {/* CHECK BOXES */}
          <div className="flex max-w-full items-center gap-3 bg-white px-3 py-2">
            {/* Free Trail */}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={selectedCheckbox === "Free Trail"}
                onChange={() => handleCheckboxChange("Free Trail")}
              />
              <p className="text-sm text-gray-700">Free Trail</p>
            </div>
            {/* Paid Client */}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={selectedCheckbox === "Paid Clients"}
                onChange={() => handleCheckboxChange("Paid Clients")}
              />
              <p className="text-sm text-gray-700">Paid Clients</p>
            </div>

            {/* Telegram */}
            {/* <div className="flex gap-2 items-center">
              <input
                type="checkbox"
                checked={selectedCheckbox === "Telegram"}
                onChange={() => handleCheckboxChange("Telegram")}
              />
              <p className="text-sm text-gray-700">Telegram</p>
            </div> */}
          </div>

          {/* -------------SMS DETAILS STARTS FROM HERE------------- */}
          {/* -------------6------------- */}
          {/* -------------Street------------- */}
          <div className="grid gap-2 p-2">
            <div className="flex space-x-4">
              {/* PRODUCTS DROPDOWN */}
              <div className="relative flex w-1/2 flex-col">
                <label
                  htmlFor="segment"
                  className="text-sm font-medium text-gray-700"
                >
                  Products
                </label>
                <div
                  className="relative"
                  onMouseLeave={() => setIsDropdownVisibleSegment(false)}
                >
                  <button
                    onClick={toggleDropdownSegment}
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
                                checked={selectedSegments.includes(
                                  segment.segment
                                )}
                                onChange={() => handleProductChange(segment)}
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
                            />
                            Segments not available. Go to{" "}
                            <span className="font-bold">
                              Settings - Add Segment
                            </span>
                            .
                          </li>
                        )}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
              {/* CALL STATUS DROPDOWN */}
              <div className="flex w-1/2 flex-col">
                <label
                  htmlFor="callStatus"
                  className="text-sm font-medium text-gray-700"
                >
                  Call Status
                </label>
                <div
                  className="relative"
                  onClick={toggleDropdownCallStatus}
                  onMouseLeave={() => setCallStatusDropdown(false)}
                >
                  <button
                    className="mt-1 flex w-full items-center justify-between rounded-md border border-gray-300 p-2"
                    id="callStatus"
                    type="button"
                  >
                    {defaultCallStatusText}
                    <FaAngleDown className="ml-2 text-gray-400" />
                  </button>
                  {callStatusDropdown && (
                    <div className="absolute top-10 z-10 w-full rounded-md border border-gray-300 bg-white">
                      <ul className="py-2 text-sm text-gray-700">
                        {callStatusData.map(({ key, name }) => (
                          <li
                            className="z-10 block cursor-pointer border-b px-4 py-2 hover:bg-cyan-500 hover:text-white"
                            key={key}
                            onClick={() => handleDropdownCallStatus(name)}
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
            {/* DROPDOWNS FIELD */}
            <div className="flex space-x-4">
              {/* MAIL TYPE DROPDOWN */}
              <div className="flex w-1/2 flex-col">
                {/* SUBJECT FIELD */}
                <label
                  htmlFor="template"
                  className="text-sm font-medium text-gray-700"
                >
                  Template
                </label>
                <div
                  className="relative"
                  onClick={toggleDropdownTemplate}
                  onMouseLeave={() => setTemplateDropdown(false)}
                >
                  <button
                    className="mt-1 flex w-full items-center justify-between rounded-md border border-gray-300 p-2"
                    id="template"
                    type="button"
                  >
                    {defaultTemplateText}
                    <FaAngleDown className="ml-2 text-gray-400" />
                  </button>
                  {templateDropdown && (
                    <div className="absolute top-10 z-10 w-full rounded-md border border-gray-300 bg-white">
                      <ul className="py-2 text-sm text-gray-700">
                        {templates.map((data) => (
                          <li
                            className="z-10 block cursor-pointer border-b px-4 py-2 hover:bg-cyan-500 hover:text-white"
                            key={data.id}
                            onClick={() =>
                              handleDropdownTemplate(data.templateDescription)
                            }
                          >
                            {data.templateDescription}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Msg FIELD */}
            <div className="flex space-x-4">
              {/* TEXT MESSAGE DROPDOWN */}
              <div className="flex w-full flex-col">
                <label
                  htmlFor="textMessage"
                  className="text-sm font-medium text-gray-700"
                >
                  Text Message
                </label>
                <input
                  type="text"
                  name="textMessage"
                  id="textMessage"
                  value={editSms.textMessage}
                  className="mt-1 rounded-md border border-gray-300 p-2"
                  onChange={handleChange}
                  placeholder="Select Template or Enter Text Message"
                />
              </div>
            </div>

            {/* HIDDEN INPUT */}
            <div className="flex space-x-4">
              <div className="flex w-full flex-col">
                <input className="mt-1 hidden rounded-md border border-gray-300 p-2" />
              </div>
            </div>
          </div>

          <div className="flex justify-end px-2">
            <button
              type="submit"
              className="mb-3 mt-20 rounded border-2 border-cyan-500 bg-cyan-500 px-32 py-4 text-white hover:bg-white hover:text-cyan-500"
            >
              Send
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
