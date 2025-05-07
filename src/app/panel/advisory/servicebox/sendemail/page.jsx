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

export default function CreateSendEmail() {
  const name = getHostnamePart();
 const router = useRouter();
     //--------------------------------------- Set Business Type --------------------------------------------
                           const [BusinessType, setBusinessType] = useState("");
                            
                           useEffect(() => {
                             const storedType = localStorage.getItem("businessType") || "";
                             setBusinessType(storedType);
                           }, []);

  const [editEmail, setEditEmail] = useState({
    Length: "",
    ContentType: "",
    ContentDisposition: "",
    Headers: {
      additionalProp1: ["value1"],
      additionalProp2: ["value2"],
      additionalProp3: ["value3"],
    },
    Name: "",
    FileName: "",
    emails: [],
    emailtype: "",
    product: "",
    subject: "",
    message: "",
  });

  //   HANDLING INPUTS CHANGE
  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditEmail({
      ...editEmail,
      [name]: value,
    });
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setEditEmail((prev) => ({
      ...prev,
      FileName: selectedFile,
    }));
  };

  // --------------------------------------------- Check Box Start -------------------------------------------

  const [selectedCheckbox, setSelectedCheckbox] = useState("Free Trail");

  const handleCheckboxChange = (name) => {
    setSelectedCheckbox(name === selectedCheckbox ? "" : name); // Toggle selection
  };

  useEffect(() => {
    setEditEmail((prev) => ({
      ...prev,
      emailtype: selectedCheckbox,
    }));
  }, [selectedCheckbox]);

  // --------------------------------------------- Check Box End -------------------------------------------

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
        config,
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
        (selectedSegment) => selectedSegment !== segment.segment,
      );
    } else {
      // Add segment if not already selected
      updatedSegments = [...selectedSegments, segment.segment];
    }

    setSelectedSegments(updatedSegments);

    setDefaultTextSegmentDropDown(
      updatedSegments.length > 0
        ? updatedSegments.join(", ")
        : "Select Segment",
    );
  };

  useEffect(() => {
    setEditEmail((prev) => ({
      ...prev,
      product: defaultTextSegmentDropDown,
    }));
  }, [defaultTextSegmentDropDown]);

  //--------------------------------------- Segments END-------------------------------------------------

  //--------------------------------------- Get E-Mail ID  by Segment -------------------------------------------------

  useEffect(() => {
    fetchEmailId();
  }, [selectedSegments]);

  async function fetchEmailId() {
    const bearer_token = localStorage.getItem("token");

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${bearer_token}`,
        },
      };

      // setGetEmailId([]);

      // Construct the query string with selected segments
      const segmentQuery = selectedSegments
        .map((segment) => `segments=${encodeURIComponent(segment)}`)
        .join("&");

      let url;
      if (selectedCheckbox === "Free Trail") {
        url = `${protocal_url}${name}.${tenant_base_url}/Trail/alltrailEmail/bysegment?${segmentQuery}`;
      } else if (selectedCheckbox === "Paid Clients") {
        url = `${protocal_url}${name}.${tenant_base_url}/SalesOrder/salesOrder/clientEmailbysegments?${segmentQuery}`;
      }

      const response = await axios.get(url, config);
      setEditEmail((prev) => ({
        ...prev,
        emails: response.data.data,
      }));
    } catch (error) {
      console.error("Error fetching mobile numbers:", error);
    }
  }

  // ---------------------------------------------  Handle Submit ---------------------------------------------------

  // Helper function to convert file to Base64
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Create FormData for multipart/form-data format
    const formData = new FormData();
    formData.append("Length", editEmail.Length);
    formData.append("ContentType", editEmail.ContentType);
    formData.append("ContentDisposition", editEmail.ContentDisposition);
    formData.append("Headers", JSON.stringify(editEmail.Headers));
    formData.append("Name", editEmail.Name);

    // Append the file object directly
    if (editEmail.FileName && editEmail.FileName instanceof Blob) {
      formData.append("file", editEmail.FileName);
    } else {
      console.error("FileName is not a valid file");
      return;
    }

    formData.append("emails", JSON.stringify(editEmail.emails));
    formData.append("emailtype", editEmail.emailtype);
    formData.append("product", editEmail.product);
    formData.append("subject", editEmail.subject);
    formData.append("message", editEmail.message);

    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    };

    try {
      const response = await axios.post(
        `${protocal_url}${name}.${tenant_base_url}/SMSBox/sendserviceemail1`,
        formData,
        config,
      );
      alert("Successfully Added");
      router.push(`/panel/${BusinessType}/servicebox`);
      console.log("Response from the server:", response.data);
    } catch (error) {
      console.error("Error sending email data:", error);
      console.log("Server response:", error.response?.data); // Additional log to inspect server error details
    }
  };

  return (
    <div className="m-3 flex flex-col overflow-x-auto overflow-y-hidden">
      <div className="flex items-center justify-between rounded-md bg-white px-3 py-2 shadow-md">
        <h1 className="text-xl">Send Email</h1>
        <Link
          href={`/panel/${BusinessType}/servicebox`}
          className="mx-3 rounded border border-blue-500 px-4 py-1 text-blue-500"
        >
          Cancel
        </Link>
      </div>
      {/* -------------FORM Starts FROM HERE------------- */}
      <form onSubmit={handleSubmit} className="mb-6 flex flex-col">
        {/* -------------SMS DETAILS STARTS FROM HERE------------- */}
        <div className="my-3 flex-grow rounded-xl bg-white shadow-md">
          <h2 className="rounded-t-xl bg-cyan-500 px-3 py-2 font-medium text-white">
            Email Details
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
                                  segment.segment,
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
                  htmlFor="subject"
                  className="text-sm font-medium text-gray-700"
                >
                  Subject
                </label>
                <input
                  type="text"
                  name="subject"
                  id="subject"
                  value={editEmail.subject}
                  className="mt-1 rounded-md border border-gray-300 p-2"
                  onChange={handleChange}
                  placeholder="Enter Subject"
                />
              </div>
            </div>
            {/* DROPDOWNS FIELD */}
            <div className="flex space-x-4">
              {/* MESSAGE DROPDOWN */}
              <div className="flex w-1/2 flex-col">
                <label
                  htmlFor="message"
                  className="text-sm font-medium text-gray-700"
                >
                  Message
                </label>
                <input
                  type="text"
                  name="message"
                  id="message"
                  value={editEmail.message}
                  className="rounded-md border border-gray-300 p-2"
                  onChange={handleChange}
                  placeholder="Enter Message"
                />
              </div>
              {/* TEXT MESSAGE DROPDOWN */}
              <div className="flex w-1/2 flex-col">
                <label
                  htmlFor="attachment"
                  className="text-sm font-medium text-gray-700"
                >
                  Attachment
                </label>
                <input
                  type="file"
                  name="attachment"
                  id="attachment"
                  value={editEmail.attachment}
                  accept=".pdf"
                  className="rounded-md border border-gray-300 p-2"
                  onChange={handleFileChange}
                  placeholder="Entere verox peron"
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
