"use client";

import { useState } from "react";
import axios from "axios";
import {
  tenant_base_url,
  protocal_url,
} from "@/Config/Config";
import { getHostnamePart } from "@/components/GlobalHostUrl";

export default function BrowserRestriction() {
  const name = getHostnamePart();

  // -------------------------------Browers Name -----------------------------
  const tableData = ["Firefox", "Internet Explorer", "Chrome"];

  // ------------------------------Browser Restriction  State ------------------------
  const [controlDetails, setControlDetails] = useState({
    browser: "",
    enabled: true,
    version: "",
  });

  // ------------------------------ Browser Restriction Handle Submit ------------------------

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
      browser: controlDetails.browser,
      enabled: controlDetails.enabled,
      version: controlDetails.version,
    };

    console.log("Request Body on Submit:", requestBody); // Log final form submission data

    try {
      await axios.post(
        `${protocal_url}${name}.${tenant_base_url}/Security/browserestriction/add`,
        requestBody,
        config,
      );
      alert("Successfully Added");
    } catch (error) {
      console.error("Error saving pool name", error);
      alert("Failed to save pool. Please try again.");
    }
  };

  return (
    <div className="rounded-t-xl bg-white">
      <h1 className="mt-3 rounded-t-xl bg-cyan-500 px-3 py-2 text-white">
        Browser Restriction
      </h1>
      <form onSubmit={handleFormSubmit}>
        <div className="grid gap-2 px-3 py-2">
          {/* Enabled Checkbox */}
          <div className="flex space-x-4">
            <div className="flex w-1/2 flex-col gap-1">
              <label
                htmlFor="enabled"
                className="text-sm font-medium text-gray-700"
              >
                Enabled
              </label>
              <input
                type="checkbox"
                name="enabled"
                className="h-5 w-5 px-1 py-1"
                onChange={() =>
                  setControlDetails((prev) => ({
                    ...prev,
                    category: true,
                  }))
                }
              />
            </div>
          </div>
        </div>

        <div className="mx-6 py-3">
          {/* Browser Table */}
          <div className="overflow-x-auto rounded-b-md rounded-t-xl">
            <table className="min-w-full table-auto">
              <thead>
                <tr className="rounded-t-xl bg-cyan-500">
                  <th className="px-4 py-2 font-light text-white">Browser</th>
                  <th className="px-4 py-2 font-light text-white">Version</th>
                  <th className="px-4 py-2 font-light text-white">Enabled</th>
                </tr>
              </thead>
              <tbody>
                {tableData.map((item, idx) => (
                  <tr key={idx} className="border-b bg-gray-100">
                    <td className="px-8 py-2">{item}</td>
                    <td className="px-3 py-2 text-center">
                      <input
                        type="text"
                        value={controlDetails.version}
                        className="border border-gray-300 px-6 py-1"
                        placeholder="Enter browser version"
                        onChange={(event) =>
                          setControlDetails((prev) => ({
                            ...prev,
                            version: event.target.value,
                          }))
                        }
                      />
                    </td>
                    <td className="py-2 text-center">
                      <input
                        type="checkbox"
                        className="form-checkbox"
                        onChange={() =>
                          setControlDetails((prev) => ({
                            ...prev,
                            browser: item,
                          }))
                        }
                      />
                    </td>
                  </tr>
                ))}
                <tr>
                  <td colSpan="3" className="px-8 py-2">
                    <div className="flex items-center">
                      <label
                        htmlFor="blockAccess"
                        className="mr-2 text-sm font-medium text-gray-700"
                      >
                        Block Access from mobile browser
                      </label>
                      <input
                        type="checkbox"
                        name="blockAccess"
                        className="h-5 w-5"
                        onChange={() =>
                          setControlDetails((prev) => ({
                            ...prev,
                            browser: "Mobile Browser",
                          }))
                        }
                      />
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </form>
    </div>
  );
}
