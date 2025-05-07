"use client";

//react
import Link from "next/link";
import { useRouter } from "next/navigation";

import { useState, useEffect } from "react";
import axios from "axios";
import { tenant_base_url, protocal_url } from "@/Config/Config";
import { getHostnamePart } from "@/components/GlobalHostUrl";
import PropTypes from "prop-types";

export default function EditAccessControl({ onCancel, id }) {
  const name = getHostnamePart();

  //----------------------------Access Control Details -----------------------

  // ------------------------------ Access Control State ------------------------
  const [controlDetails, setControlDetails] = useState({
    id: "",
    title: "",
    description: "",
    enabled: true,
    validDuration: "",
    validFrom: "",
    validTo: "",
    risk: "",
    category: "",
    eventType: "",
  });

  // ------------------------------ Access Control Handle Change ------------------------

  const handleChange = (e) => {
    const { name, type, checked, value } = e.target;
    setControlDetails((prevDetails) => {
      const updatedDetails = {
        ...prevDetails,
        [name]:
          name === "validDuration"
            ? checked
              ? "Valid Always"
              : "Custom"
            : type === "checkbox"
              ? checked
              : value,
      };
      console.log("Updated Control Details:", updatedDetails); // Log updated control details
      return updatedDetails;
    });
  };

  // ------------------------------Edit Access Control Get By ID ------------------------

  useEffect(() => {
    fetchDataById();
  }, [id]);

  // Function to fetch data by ID
  const fetchDataById = async () => {
    const bearer_token = localStorage.getItem("token");
    const config = {
      headers: {
        Authorization: `Bearer ${bearer_token}`,
      },
    };

    try {
      const response = await axios.get(
        `${protocal_url}${name}.${tenant_base_url}/Security/accesscontrol/get/${id}`,
        config,
      );

      if (response.status === 200 && response.data.isSuccess) {
        const data = response.data.data;
        setControlDetails({
          id: data.id,
          title: data.title,
          description: data.description,
          enabled: data.enabled,
          validDuration: data.validDuration,
          validFrom: data.validFrom,
          validTo: data.validTo,
          risk: data.risk,
          category: data.category,
          eventType: data.eventType,
        });
      }
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  };

  // ------------------------------Edit Access Control Handle Submit ------------------------

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    const bearer_token = localStorage.getItem("token");
    const config = {
      headers: {
        Authorization: `Bearer ${bearer_token}`,
      },
    };

    const requestBody = {
      id: controlDetails.id,
      title: controlDetails.title,
      description: controlDetails.description,
      enabled: controlDetails.enabled,
      validDuration: controlDetails.validDuration,
      validFrom: controlDetails.validFrom,
      validTo: controlDetails.validTo,
      risk: controlDetails.risk,
      category: controlDetails.category,
      eventType: controlDetails.eventType,
    };

    console.log("Request Body on Submit:", requestBody);

    try {
      await axios.put(
        `${protocal_url}${name}.${tenant_base_url}/Security/accesscontrol/edit/${id}`,
        requestBody,
        config,
      );
      alert("Successfully Updated");
      onCancel();
    } catch (error) {
      console.error("Error saving pool name", error);
      alert("Failed to save pool. Please try again.");
    }
  };

  // ------------------------------ Option Control ------------------------

  // ------------------------------ Option Control State ------------------------

  const [selectedId, setSelectedId] = useState(1);

  // ------------------------------ Option Control Handle Click ------------------------

  const handleOptionClick = (id, text) => {
    setSelectedId(id);
    setControlDetails((prevDetails) => {
      const updatedDetails = {
        ...prevDetails,
        eventType: text, // Update the eventType directly with the button text
      };
      console.log("Updated Control Details:", updatedDetails); // Log updated control details
      return updatedDetails;
    });
  };

  // ------------------------------ Option Control Buttons ------------------------

  const buttons = [
    { id: 1, text: "Browser Restriction" },
    { id: 2, text: "IP Restriction" },
    { id: 3, text: "Time Restriction" },
    { id: 4, text: "Device Restriction" },
    { id: 5, text: "Geo Location" },
  ];

  return (
    <div className="m-3 flex flex-col overflow-x-auto overflow-y-hidden">
      <div className="flex items-center justify-between rounded-md bg-white px-2 py-2 shadow-md">
        <h1 className="text-xl">Access Control</h1>
        <button
          onClick={onCancel}
          className="mx-3 rounded border border-blue-500 px-4 py-1 text-blue-500"
        >
          Cancel
        </button>
      </div>
      <div className="overflow-hidden shadow-md">
        <div className="mt-3 rounded-t-xl bg-cyan-500 px-3 py-2">
          <h1 className="text-white">Edit Access Control Details</h1>
        </div>
        <form onSubmit={handleFormSubmit}>
          <div className="flex flex-col rounded-b-xl bg-white px-4 py-2">
            <div className="flex gap-4">
              <div className="grid w-full gap-2 pb-3">
                <div className="flex space-x-4">
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
                      value={controlDetails.title}
                      className="mt-1 rounded-md border border-gray-300 p-2"
                      onChange={handleChange}
                      placeholder="Enter device type"
                    />
                  </div>
                  <div className="flex w-1/2 flex-col">
                    <label
                      htmlFor="description"
                      className="text-sm font-medium text-gray-700"
                    >
                      Description
                    </label>
                    <input
                      type="text"
                      name="description"
                      value={controlDetails.description}
                      className="mt-1 rounded-md border border-gray-300 p-2"
                      onChange={handleChange}
                      placeholder="Enter device type"
                    />
                  </div>
                </div>
                <div className="flex space-x-4">
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
                      checked={controlDetails.enabled}
                      className="flex h-5 w-5 justify-start px-1 py-1"
                      onChange={handleChange}
                    />
                  </div>
                  <div className="w1/2 flex flex-1 flex-col items-start justify-start gap-1">
                    <label
                      htmlFor="validDuration"
                      className="text-sm font-medium text-gray-700"
                    >
                      Valid Always
                    </label>
                    <input
                      type="checkbox"
                      name="validDuration"
                      checked={controlDetails.validDuration === "Valid Always"}
                      className="flex h-5 w-5 justify-start px-1 py-1"
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div className="flex space-x-4">
                  <div className="flex w-1/2 flex-col">
                    <label
                      htmlFor="validFrom"
                      className="text-sm font-medium text-gray-700"
                    >
                      Valid From
                    </label>
                    <input
                      disabled={controlDetails.validDuration === "Valid Always"}
                      type="date"
                      name="validFrom"
                      value={controlDetails.validFrom}
                      className="mt-1 rounded-md border border-gray-300 p-2"
                      onChange={handleChange}
                      placeholder="Enter date"
                    />
                  </div>
                  <div className="flex w-1/2 flex-col">
                    <label
                      htmlFor="validTo"
                      className="text-sm font-medium text-gray-700"
                    >
                      Valid To
                    </label>
                    <input
                      disabled={controlDetails.validDuration === "Valid Always"}
                      type="date"
                      name="validTo"
                      value={controlDetails.validTo}
                      className="mt-1 rounded-md border border-gray-300 p-2"
                      onChange={handleChange}
                      placeholder="Enter date"
                    />
                  </div>
                </div>

                <div className="flex space-x-4">
                  <div className="flex w-1/2 flex-col">
                    <label
                      htmlFor="risk"
                      className="text-sm font-medium text-gray-700"
                    >
                      Risk
                    </label>
                    <input
                      type="text"
                      name="risk"
                      value={controlDetails.risk}
                      className="mt-1 rounded-md border border-gray-300 p-2"
                      onChange={handleChange}
                      placeholder="Enter risk level"
                    />
                  </div>
                </div>
                <h2 className="text-md font-medium">Category</h2>
                <div className="flex space-x-4">
                  <div className="w1/2 flex flex-1 items-start justify-start gap-10">
                    <div>
                      <label
                        htmlFor="default"
                        className="text-sm font-medium text-gray-700"
                      >
                        Default
                      </label>
                      <input
                        type="checkbox"
                        name="default"
                        checked={controlDetails.category === "default"}
                        className="flex h-5 w-5 justify-start px-1 py-1"
                        onChange={() =>
                          setControlDetails((prev) => ({
                            ...prev,
                            category: "default", // Set category to 'default' when checked
                          }))
                        }
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="apps"
                        className="text-sm font-medium text-gray-700"
                      >
                        Apps
                      </label>
                      <input
                        type="checkbox"
                        name="apps"
                        checked={controlDetails.category === "apps"}
                        className="flex h-5 w-5 justify-start px-1 py-1"
                        onChange={() =>
                          setControlDetails((prev) => ({
                            ...prev,
                            category: "apps", // Set category to 'apps' when checked
                          }))
                        }
                      />
                    </div>
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
        </form>
      </div>
      <div className="flex flex-col overflow-x-auto overflow-y-hidden">
        <div className="overflow-hidden shadow-md">
          {/* SECOND SECTION */}
          <div className="my-3 flex items-center gap-3">
            {buttons.map(({ id, text }) => (
              <button
                key={id}
                onClick={() => handleOptionClick(id, text)}
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
          {/* BROWSE RESTRICTION */}
          {selectedId === 1 && <>{/* <BrowserRestriction />*/}1</>}

          {/* IP RESTRICTION */}
          {selectedId === 2 && <>2</>}
          {/* TIME RESTRICTION */}
          {selectedId === 3 && <>3</>}
          {/* DEVICE RESTRICTION */}
          {selectedId === 4 && <>4</>}
          {/* GEO LOCATION */}
          {selectedId === 5 && 5}
        </div>
      </div>
    </div>
  );
}
EditAccessControl.propTypes = {
  onCancel: PropTypes.func.isRequired,
  id: PropTypes.string.isRequired,
};
