"use client";


import { useState, useEffect } from "react";
import axios from "axios";
import PropTypes from "prop-types";

import { tenant_base_url, protocal_url } from "@/Config/Config";

import { getHostnamePart } from "@/components/GlobalHostUrl";

import { ToastContainer } from "react-toastify";
import {
  showErrorToast,
  showSuccessToast,
} from "@/utils/toastNotifications";

export default function EditPermission({ onCancel, permissionId }) {
  const name = getHostnamePart();

  //----------------------------------------------Get by ID------------------------------------------------

  //----------------------------------------------Get by ID------------------------------------------------

  const [defaultGroupModuleText, setDefaultGroupModuleText] = useState("");
  const [defaultTextLeadStatusDropDown, setdefaultTextLeadStatusDropDown] =
    useState("");

  const handleGetById = async () => {
    const bearer_token = localStorage.getItem("token");
    const config = {
      headers: {
        Authorization: `Bearer ${bearer_token}`,
      },
    };

    try {
      const response = await axios.get(
        `${protocal_url}${name}.${tenant_base_url}/Security/rolesandpermissions/get/${permissionId}`,
        config,
      );

      if (response.status === 200 && response.data.isSuccess) {
        const data = response.data.data;
        setdefaultTextLeadStatusDropDown(data.groupName);
        setDefaultGroupModuleText(data.moduleName);
        const permissionsArray = data.permissions.split(",");
        setPermissions(permissionsArray);
      }
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  };

  useEffect(() => {
    handleGetById();
  }, []);

  // ------------------------------------------ Handle checkbox change -------------------------------------------

  const [permissions, setPermissions] = useState([]);

  const handleCheckboxChange = (permission) => {
    setPermissions(
      (prevPermissions) =>
        prevPermissions.includes(permission)
          ? prevPermissions.filter((item) => item !== permission) // Remove if already selected
          : [...prevPermissions, permission], // Add if not selected
    );
  };

  // Log updated permissions whenever they change
  useEffect(() => {
    console.log("Updated permissions: ", permissions);
  }, [permissions]);

  //------------------------------------------------Handle Submit---------------------------------------------------
  const handleSubmit = async (event) => {
    event.preventDefault();
    const bearer_token = localStorage.getItem("token");

    const payload = {
      groupName: defaultTextLeadStatusDropDown,
      moduleName: defaultGroupModuleText,
      permissions,
    };

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${bearer_token}`,
          "Content-Type": "application/json",
        },
      };

      const response = await axios.put(
        `${protocal_url}${name}.${tenant_base_url}/Security/rolesandpermissions/edit/${permissionId}`,
        payload,
        config,
      );
      if (response.data.isSuccess) {
        showSuccessToast("Permission Update successfully!");

        // Call onCancel after a short delay to ensure toast shows first
        setTimeout(() => {
          onCancel();
        }, 1500); // Adjust delay as needed (in milliseconds)
      }
    } catch (error) {
      console.log(error);
      showErrorToast("Failed");
    }
  };

  return (
    <div className="m-3 flex min-h-screen flex-col overflow-x-auto overflow-y-hidden">
      <ToastContainer />
      <div className="flex items-center justify-between rounded-md bg-white px-2 py-2 shadow-md">
        <h1 className="text-xl">Add Roles & Permissions</h1>
        {/*------------------------------------------------- Cancel Button--------------------------------------------- */}
        <button
          onClick={onCancel}
          className="mx-3 rounded border border-blue-500 px-4 py-1 text-blue-500"
        >
          Cancel
        </button>
      </div>
      {/*  */}
      <div className="overflow-hidden shadow-md">
        <div className="mt-3 rounded-t-xl bg-cyan-500 px-3 py-2">
          <h1 className="text-white">Roles & Permissions Details</h1>
        </div>
        {/* ----------- FORMS START FROM HERE ----------- */}
        <form onSubmit={handleSubmit}>
          <div className="flex min-h-screen flex-col rounded-b-xl bg-white px-4 py-2">
            <div className="flex gap-4">
              <div className="grid w-full gap-2 pb-3">
                {/* ----------Lead CHECK BOXES ---------- */}
                {defaultGroupModuleText === "Leads" ? (
                  <div className="mt-2 w-full rounded-sm bg-white p-3 shadow-md">
                    <h1 className="mb-2 text-xl font-normal">Leads</h1>
                    {/* ---------- LEAD BOXES ---------- */}
                    <div className="flex justify-between gap-12">
                      {/* FIRST */}
                      <div className="flex flex-col gap-3">
                        {/* FIRST ROW */}
                        <div className="flex items-center gap-3 font-light">
                          <input
                            type="checkbox"
                            id="create-lead"
                            checked={permissions.includes("Create Lead")}
                            onChange={() => handleCheckboxChange("Create Lead")}
                          />
                          <p className="font-md text-sm">Create Lead</p>
                        </div>
                        {/* SECOND ITEM */}
                        <div className="flex items-center gap-3 font-light">
                          <input
                            type="checkbox"
                            checked={permissions.includes("Upload Leads")}
                            onChange={() =>
                              handleCheckboxChange("Upload Leads")
                            }
                          />
                          <p className="font-md text-sm">Upload Leads</p>
                        </div>
                        {/* THIRD ITEM */}
                        <div className="flex items-center gap-3 font-light">
                          <input
                            type="checkbox"
                            checked={permissions.includes("Lead Operation")}
                            onChange={() =>
                              handleCheckboxChange("Lead Operation")
                            }
                          />
                          <p className="font-md text-sm">Lead Operation</p>
                        </div>
                        {/* FOURTH ITEM */}
                        <div className="flex items-center gap-3 font-light">
                          <input
                            type="checkbox"
                            checked={permissions.includes("Lead Action")}
                            onChange={() => handleCheckboxChange("Lead Action")}
                          />
                          <p className="font-md text-sm">Lead Action</p>
                        </div>
                      </div>
                      {/* SECOND */}
                      <div className="flex flex-col gap-3">
                        {/* FIRST ROW */}
                        <div className="flex items-center gap-3 font-light">
                          <input
                            type="checkbox"
                            checked={permissions.includes("View Leads")}
                            onChange={() => handleCheckboxChange("View Leads")}
                          />
                          <p className="font-md text-sm">View Leads</p>
                        </div>
                        {/* SECOND ITEM */}
                        <div className="flex items-center gap-3 font-light">
                          <input
                            type="checkbox"
                            checked={permissions.includes("Fetch Leads")}
                            onChange={() => handleCheckboxChange("Fetch Leads")}
                          />
                          <p className="font-md text-sm">Fetch Leads</p>
                        </div>
                        {/* THIRD ITEM */}
                        <div className="flex items-center gap-3 font-light">
                          <input
                            type="checkbox"
                            checked={permissions.includes("Edit Lead")}
                            onChange={() => handleCheckboxChange("Edit Lead")}
                          />
                          <p className="font-md text-sm">Edit Lead</p>
                        </div>
                        {/* Fourth ITEM */}
                        <div className="flex items-center gap-3 font-light">
                          <input
                            type="checkbox"
                            checked={permissions.includes("Mass Delete")}
                            onChange={() => handleCheckboxChange("Mass Delete")}
                          />
                          <p className="font-md text-sm">Mass Delete</p>
                        </div>
                      </div>
                      {/* THIRD */}
                      <div className="flex flex-col gap-3">
                        {/* FIRST ROW */}
                        <div className="flex items-center gap-3 font-light">
                          <input
                            type="checkbox"
                            checked={permissions.includes("Approve Leads")}
                            onChange={() =>
                              handleCheckboxChange("Approve Leads")
                            }
                          />
                          <p className="font-md text-sm">Approve Leads</p>
                        </div>
                        {/* SECOND ITEM */}
                        <div className="flex items-center gap-3 font-light">
                          <input
                            type="checkbox"
                            checked={permissions.includes("Export to Excel")}
                            onChange={() =>
                              handleCheckboxChange("Export to Excel")
                            }
                          />
                          <p className="font-md text-sm">Export to Excel</p>
                        </div>
                        {/* THIRD ITEM */}
                        <div className="flex items-center gap-3 font-light">
                          <input
                            type="checkbox"
                            checked={permissions.includes("Export to PDF")}
                            onChange={() =>
                              handleCheckboxChange("Export to PDF")
                            }
                          />
                          <p className="font-md text-sm">Export to PDF</p>
                        </div>
                      </div>
                      {/* FOURTH */}
                      <div className="flex flex-col gap-3">
                        {/* FIRST ROW */}
                        <div className="flex items-center gap-3 font-light">
                          <input
                            type="checkbox"
                            checked={permissions.includes(
                              "Convert Lead to Contact",
                            )}
                            onChange={() =>
                              handleCheckboxChange("Convert Lead to Contact")
                            }
                          />
                          <p className="font-md text-sm">
                            Convert Lead to Contact
                          </p>
                        </div>
                        {/* SECOND ITEM */}
                        <div className="flex items-center gap-3 font-light">
                          <input
                            type="checkbox"
                            checked={permissions.includes("Create Sales Order")}
                            onChange={() =>
                              handleCheckboxChange("Create Sales Order")
                            }
                          />
                          <p className="font-md text-sm">Create Sales Order</p>
                        </div>
                        {/* THIRD ITEM */}
                        <div className="flex items-center gap-3 font-light">
                          <input
                            type="checkbox"
                            checked={permissions.includes("Mass E-Mail")}
                            onChange={() => handleCheckboxChange("Mass E-Mail")}
                          />
                          <p className="font-md text-sm">Mass E-Mail</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  ""
                )}
                {/* --------- CONTACT --------- */}
                {defaultGroupModuleText === "Contacts" ? (
                  <div className="mt-2 w-full rounded-sm bg-white p-3 shadow-md">
                    <h1 className="mb-2 text-xl font-normal">Contacts</h1>
                    {/* ---------- LEAD BOXES ---------- */}
                    <div className="flex justify-between gap-12">
                      {/* FIRST */}
                      <div className="flex flex-col gap-3">
                        {/* FIRST ROW */}
                        <div className="flex items-center gap-3 font-light">
                          <input
                            type="checkbox"
                            checked={permissions.includes("Create Sales order")}
                            onChange={() =>
                              handleCheckboxChange("Create Sales order")
                            }
                          />
                          <p className="font-md text-sm">Create Sales order</p>
                        </div>
                        {/* SECOND ITEM */}
                        <div className="flex items-center gap-3 font-light">
                          <input
                            type="checkbox"
                            checked={permissions.includes("Edit Contact")}
                            onChange={() =>
                              handleCheckboxChange("Edit Contact")
                            }
                          />
                          <p className="font-md text-sm">Edit Contact</p>
                        </div>
                      </div>
                      {/* SECOND */}
                      <div className="flex flex-col gap-3">
                        {/* FIRST ROW */}
                        <div className="flex items-center gap-3 font-light">
                          <input
                            type="checkbox"
                            checked={permissions.includes("View Contacts")}
                            onChange={() =>
                              handleCheckboxChange("View Contacts")
                            }
                          />
                          <p className="font-md text-sm">View Contacts</p>
                        </div>
                        {/* SECOND ITEM */}
                        <div className="flex items-center gap-3 font-light">
                          <input
                            type="checkbox"
                            checked={permissions.includes("Export to PDF")}
                            onChange={() =>
                              handleCheckboxChange("Export to PDF")
                            }
                          />
                          <p className="font-md text-sm">Export to PDF</p>
                        </div>
                      </div>
                      {/* THIRD */}
                      <div className="flex flex-col gap-3">
                        {/* FIRST ROW */}
                        <div className="flex items-center gap-3 font-light">
                          <input
                            type="checkbox"
                            checked={permissions.includes("Mass Delete")}
                            onChange={() => handleCheckboxChange("Mass Delete")}
                          />
                          <p className="font-md text-sm">Mass Delete</p>
                        </div>
                        {/* SECOND ITEM */}
                        <div className="flex items-center gap-3 font-light">
                          <input
                            type="checkbox"
                            checked={permissions.includes("Export to Excel")}
                            onChange={() =>
                              handleCheckboxChange("Export to Excel")
                            }
                          />
                          <p className="font-md text-sm">Export to Excel</p>
                        </div>
                      </div>
                      {/* FOURTH */}
                      <div className="flex flex-col gap-3">
                        {/* FIRST ROW */}
                        <div className="flex items-center gap-3 font-light">
                          <input
                            type="checkbox"
                            checked={permissions.includes("Mass E-Mail")}
                            onChange={() => handleCheckboxChange("Mass E-Mail")}
                          />
                          <p className="font-md text-sm">Mass E-Mail</p>
                        </div>
                      </div>
                      {/* FIFTH */}
                      <div className="flex flex-col gap-3">
                        {/* FIRST ROW */}
                        {/* SECOND ITEM */}
                      </div>
                    </div>
                  </div>
                ) : (
                  ""
                )}
                {/* --------- Client --------- */}
                {defaultGroupModuleText === "Client" ? (
                  <div className="mt-2 w-full rounded-sm bg-white p-3 shadow-md">
                    <h1 className="mb-2 text-xl font-normal">Client</h1>
                    {/* ---------- LEAD BOXES ---------- */}
                    <div className="flex justify-between gap-12">
                      {/* FIRST */}
                      <div className="flex flex-col gap-3">
                        {/* FIRST ROW */}
                        <div className="flex items-center gap-3 font-light">
                          <input
                            type="checkbox"
                            checked={permissions.includes("Mass E-Mail")}
                            onChange={() => handleCheckboxChange("Mass E-Mail")}
                          />
                          <p className="font-md text-sm">Mass E-Mail</p>
                        </div>
                      </div>
                      {/* SECOND */}
                      <div className="flex flex-col gap-3">
                        {/* FIRST ROW */}
                        <div className="flex items-center gap-3 font-light">
                          <input
                            type="checkbox"
                            checked={permissions.includes("Export to PDF")}
                            onChange={() =>
                              handleCheckboxChange("Export to PDF")
                            }
                          />
                          <p className="font-md text-sm">Export to PDF</p>
                        </div>
                      </div>
                      {/* THIRD */}
                      <div className="flex flex-col gap-3">
                        {/* FIRST ROW */}
                        <div className="flex items-center gap-3 font-light">
                          <input
                            type="checkbox"
                            checked={permissions.includes("Export to Excel")}
                            onChange={() =>
                              handleCheckboxChange("Export to Excel")
                            }
                          />
                          <p className="font-md text-sm">Export to Excel</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  ""
                )}
                {/* --------- SO --------- */}
                {defaultGroupModuleText === "Sales Order" ? (
                  <div className="mt-2 w-full rounded-sm bg-white p-3 shadow-md">
                    <h1 className="mb-2 text-xl font-normal">Sales Order</h1>
                    {/* ---------- LEAD BOXES ---------- */}
                    <div className="flex justify-between gap-12">
                      <div className="flex flex-col gap-3">
                        <div className="flex items-center gap-3 font-light">
                          <input
                            type="checkbox"
                            checked={permissions.includes("Edit Sales Order")}
                            onChange={() =>
                              handleCheckboxChange("Edit Sales Order")
                            }
                          />
                          <p className="font-md text-sm">Edit Sales Order</p>
                        </div>
                        <div className="flex items-center gap-3 font-light">
                          <input
                            type="checkbox"
                            checked={permissions.includes("Approve Pending")}
                            onChange={() =>
                              handleCheckboxChange("Approve Pending")
                            }
                          />
                          <p className="font-md text-sm">Approve Pending</p>
                        </div>
                      </div>
                      <div className="flex flex-col gap-3">
                        <div className="flex items-center gap-3 font-light">
                          <input
                            type="checkbox"
                            checked={permissions.includes("Send SMS")}
                            onChange={() => handleCheckboxChange("Send SMS")}
                          />
                          <p className="font-md text-sm">Send SMS</p>
                        </div>
                        <div className="flex items-center gap-3 font-light">
                          <input
                            type="checkbox"
                            checked={permissions.includes("Export to PDF")}
                            onChange={() =>
                              handleCheckboxChange("Export to PDF")
                            }
                          />
                          <p className="font-md text-sm">Export to PDF</p>
                        </div>
                      </div>
                      <div className="flex flex-col gap-3">
                        <div className="flex items-center gap-3 font-light">
                          <input
                            type="checkbox"
                            checked={permissions.includes("Mass Delete")}
                            onChange={() => handleCheckboxChange("Mass Delete")}
                          />
                          <p className="font-md text-sm">Mass Delete</p>
                        </div>
                        <div className="flex items-center gap-3 font-light">
                          <input
                            type="checkbox"
                            checked={permissions.includes("Export to Excel")}
                            onChange={() =>
                              handleCheckboxChange("Export to Excel")
                            }
                          />
                          <p className="font-md text-sm">Export to Excel</p>
                        </div>
                      </div>
                      <div className="flex flex-col gap-3">
                        <div className="flex items-center gap-3 font-light">
                          <input
                            type="checkbox"
                            checked={permissions.includes("Mass E-Mail")}
                            onChange={() => handleCheckboxChange("Mass E-Mail")}
                          />
                          <p className="font-md text-sm">Mass E-Mail</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  ""
                )}
                {/* --------- Free Trail --------- */}
                {defaultGroupModuleText === "Free Trail" ? (
                  <div className="mt-2 w-full rounded-sm bg-white p-3 shadow-md">
                    <h1 className="mb-2 text-xl font-normal">Free Trail</h1>
                    <div className="flex justify-between gap-12">
                      <div className="flex flex-col gap-3">
                        <div className="flex items-center gap-3 font-light">
                          <input
                            type="checkbox"
                            checked={permissions.includes("Edit Free Trail")}
                            onChange={() =>
                              handleCheckboxChange("Edit Free Trail")
                            }
                          />
                          <p className="font-md text-sm">Edit Free Trail</p>
                        </div>
                        <div className="flex items-center gap-3 font-light">
                          <input
                            type="checkbox"
                            checked={permissions.includes("Export Trail")}
                            onChange={() =>
                              handleCheckboxChange("Export Trail")
                            }
                          />
                          <p className="font-md text-sm">Export Trail</p>
                        </div>
                      </div>
                      <div className="flex flex-col gap-3">
                        <div className="flex items-center gap-3 font-light">
                          <input
                            type="checkbox"
                            checked={permissions.includes("Export To PDF")}
                            onChange={() => handleCheckboxChange("Export To PDF")}
                          />
                          <p className="font-md text-sm">Export To PDF</p>
                        </div>
                        <div className="flex items-center gap-3 font-light">
                          <input
                            type="checkbox"
                            checked={permissions.includes("Export To Excel")}
                            onChange={() => handleCheckboxChange("Export To Excel")}
                          />
                          <p className="font-md text-sm">Export To Excel</p>
                        </div>
                      </div>
                      <div className="flex flex-col gap-3">
                        <div className="flex items-center gap-3 font-light">
                          <input
                            type="checkbox"
                            checked={permissions.includes("Mass Delete")}
                            onChange={() => handleCheckboxChange("Mass Delete")}
                          />
                          <p className="font-md text-sm">Mass Delete</p>
                        </div>
                        <div className="flex items-center gap-3 font-light">
                          <input
                            type="checkbox"
                            checked={permissions.includes("Mass E-Mail")}
                            onChange={() => handleCheckboxChange("Mass E-Mail")}
                          />
                          <p className="font-md text-sm">Mass E-Mail</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  ""
                )}
                {/* --------- Follow Up --------- */}
                {defaultGroupModuleText === "Follow Up" ? (
                  <div className="mt-2 w-full rounded-sm bg-white p-3 shadow-md">
                    <h1 className="mb-2 text-xl font-normal">Follow Up</h1>
                    <div className="flex justify-between gap-12">
                      <div className="flex flex-col gap-3">
                        <div className="flex items-center gap-3 font-light">
                          <input
                            type="checkbox"
                            checked={permissions.includes("Edit Follow Up")}
                            onChange={() =>
                              handleCheckboxChange("Edit Follow Up")
                            }
                          />
                          <p className="font-md text-sm">Edit Follow Up</p>
                        </div>
                        <div className="flex items-center gap-3 font-light">
                          <input
                            type="checkbox"
                            checked={permissions.includes("Export Follow Up")}
                            onChange={() =>
                              handleCheckboxChange("Export Follow Up")
                            }
                          />
                          <p className="font-md text-sm">Export Follow Up</p>
                        </div>
                      </div>
                      <div className="flex flex-col gap-3">
                        <div className="flex items-center gap-3 font-light">
                          <input
                            type="checkbox"
                            checked={permissions.includes("Export To PDF")}
                            onChange={() => handleCheckboxChange("Export To PDF")}
                          />
                          <p className="font-md text-sm">Export To PDF</p>
                        </div>
                        <div className="flex items-center gap-3 font-light">
                          <input
                            type="checkbox"
                            checked={permissions.includes("Export To Excel")}
                            onChange={() => handleCheckboxChange("Export To Excel")}
                          />
                          <p className="font-md text-sm">Export To Excel</p>
                        </div>
                      </div>
                      <div className="flex flex-col gap-3">
                        <div className="flex items-center gap-3 font-light">
                          <input
                            type="checkbox"
                            checked={permissions.includes("Mass Delete")}
                            onChange={() => handleCheckboxChange("Mass Delete")}
                          />
                          <p className="font-md text-sm">Mass Delete</p>
                        </div>
                      </div>
                      <div className="flex flex-col gap-3">
                        <div className="flex items-center gap-3 font-light">
                          <input
                            type="checkbox"
                            checked={permissions.includes("Mass E-Mail")}
                            onChange={() => handleCheckboxChange("Mass E-Mail")}
                          />
                          <p className="font-md text-sm">Mass E-Mail</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  ""
                )}
                {/* --------- SMS Box --------- */}
                {defaultGroupModuleText === "Service Box" ? (
                  <div className="mt-2 w-full rounded-sm bg-white p-3 shadow-md">
                    <h1 className="mb-2 text-xl font-normal">Service Box</h1>
                    <div className="flex items-center gap-12">
                      <div className="flex items-center gap-3 font-light">
                        <input
                          type="checkbox"
                          checked={permissions.includes("Send SMS")}
                          onChange={() => handleCheckboxChange("Send SMS")}
                        />
                        <p className="font-md text-sm">Send SMS</p>
                      </div>
                      <div className="flex items-center gap-3 font-light">
                        <input
                          type="checkbox"
                          checked={permissions.includes("Send E-Mail")}
                          onChange={() => handleCheckboxChange("Send E-Mail")}
                        />
                        <p className="font-md text-sm">Send E-Mail</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  ""
                )}
                {/* --------- Reports --------- */}
                {defaultGroupModuleText === "Reports" ? (
                  <div className="mt-2 w-full rounded-sm bg-white p-3 shadow-md">
                    <h1 className="mb-2 text-xl font-normal">Reports</h1>
                    {/* ---------- LEAD BOXES ---------- */}
                    <div className="flex justify-between gap-12">
                      {/* FIRST */}
                      <div className="flex flex-col gap-3">
                        <div className="flex items-center gap-3 font-light">
                          <input
                            type="checkbox"
                            checked={permissions.includes("Employee Report")}
                            onChange={() =>
                              handleCheckboxChange("Employee Report")
                            }
                          />
                          <p className="font-md text-sm">Employee Report</p>
                        </div>
                        <div className="flex items-center gap-3 font-light">
                          <input
                            type="checkbox"
                            checked={permissions.includes("Monitoring")}
                            onChange={() => handleCheckboxChange("Monitoring")}
                          />
                          <p className="font-md text-sm">Monitoring</p>
                        </div>
                      </div>
                      {/* SECOND */}
                      <div className="flex flex-col gap-3">
                        <div className="flex items-center gap-3 font-light">
                          <input
                            type="checkbox"
                            checked={permissions.includes("Lead Report")}
                            onChange={() => handleCheckboxChange("Lead Report")}
                          />
                          <p className="font-md text-sm">Lead Report</p>
                        </div>
                        <div className="flex items-center gap-3 font-light">
                          <input
                            type="checkbox"
                            checked={permissions.includes("Dispose Leads")}
                            onChange={() =>
                              handleCheckboxChange("Dispose Leads")
                            }
                          />
                          <p className="font-md text-sm">Dispose Leads</p>
                        </div>
                      </div>
                      {/* THIRD */}
                      <div className="flex flex-col gap-3">
                        <div className="flex items-center gap-3 font-light">
                          <input
                            type="checkbox"
                            checked={permissions.includes("Client Report")}
                            onChange={() =>
                              handleCheckboxChange("Client Report")
                            }
                          />
                          <p className="font-md text-sm">Client Report</p>
                        </div>
                      </div>
                      {/* FOURTH */}
                      <div className="flex flex-col gap-3">
                        <div className="flex items-center gap-3 font-light">
                          <input
                            type="checkbox"
                            checked={permissions.includes("Sales Report")}
                            onChange={() =>
                              handleCheckboxChange("Sales Report")
                            }
                          />
                          <p className="font-md text-sm">Sales Report</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  ""
                )}

                {/* ---------  Financial Activity --------- */}
                {defaultGroupModuleText === "Financial Activity" ? (
                  <div className="mt-2 w-full rounded-sm bg-white p-3 shadow-md">
                    <h1 className="mb-2 text-xl font-normal">
                      Financial Activity
                    </h1>
                    <div className="flex justify-between gap-12">
                      <div className="flex flex-col gap-3">
                        <div className="flex items-center gap-3 font-light">
                          <input
                            type="checkbox"
                            checked={permissions.includes("View Expenses")}
                            onChange={() =>
                              handleCheckboxChange("View Expenses")
                            }
                          />
                          <p className="font-md text-sm">View Expenses</p>
                        </div>
                        <div className="flex items-center gap-3 font-light">
                          <input
                            type="checkbox"
                            checked={permissions.includes("View Brokerage")}
                            onChange={() =>
                              handleCheckboxChange("View Brokerage")
                            }
                          />
                          <p className="font-md text-sm">View Brokerage</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  ""
                )}
                {/* ----------Settings CHECK BOXES ---------- */}
                {defaultGroupModuleText === "Settings" ? (
                  <div className="mt-2 w-full rounded-sm bg-white p-3 shadow-md">
                    <h1 className="mb-2 text-xl font-normal">Settings</h1>
                    {/* ---------- SETTINGS SECTION ---------- */}
                    <div className="flex justify-between gap-12">
                      {/* FIRST COLUMN */}
                      <div className="flex flex-col gap-3">
                        <div className="flex items-center gap-3 font-light">
                          <input
                            type="checkbox"
                            checked={permissions.includes("User Setting")}
                            onChange={() =>
                              handleCheckboxChange("User Setting")
                            }
                          />
                          <p className="font-md text-sm">User Setting</p>
                        </div>
                        <div className="flex items-center gap-3 font-light">
                          <input
                            type="checkbox"
                            checked={permissions.includes("User Operation")}
                            onChange={() =>
                              handleCheckboxChange("User Operation")
                            }
                          />
                          <p className="font-md text-sm">User Operation</p>
                        </div>
                        <div className="flex items-center gap-3 font-light">
                          <input
                            type="checkbox"
                            checked={permissions.includes("Group")}
                            onChange={() => handleCheckboxChange("Group")}
                          />
                          <p className="font-md text-sm">Group</p>
                        </div>
                        <div className="flex items-center gap-3 font-light">
                          <input
                            type="checkbox"
                            checked={permissions.includes("Department")}
                            onChange={() => handleCheckboxChange("Department")}
                          />
                          <p className="font-md text-sm">Department</p>
                        </div>
                        <div className="flex items-center gap-3 font-light">
                          <input
                            type="checkbox"
                            checked={permissions.includes(
                              "Roles & Permissions",
                            )}
                            onChange={() =>
                              handleCheckboxChange("Roles & Permissions")
                            }
                          />
                          <p className="font-md text-sm">Roles & Permissions</p>
                        </div>
                      </div>
                      {/* SECOND COLUMN */}
                      <div className="flex flex-col gap-3">
                        <div className="flex items-center gap-3 font-light">
                          <input
                            type="checkbox"
                            checked={permissions.includes("Designation")}
                            onChange={() => handleCheckboxChange("Designation")}
                          />
                          <p className="font-md text-sm">Designation</p>
                        </div>
                        <div className="flex items-center gap-3 font-light">
                          <input
                            type="checkbox"
                            checked={permissions.includes("Qualification")}
                            onChange={() =>
                              handleCheckboxChange("Qualification")
                            }
                          />
                          <p className="font-md text-sm">Qualification</p>
                        </div>
                        <div className="flex items-center gap-3 font-light">
                          <input
                            type="checkbox"
                            checked={permissions.includes("Lead Status")}
                            onChange={() => handleCheckboxChange("Lead Status")}
                          />
                          <p className="font-md text-sm">Lead Status</p>
                        </div>
                        <div className="flex items-center gap-3 font-light">
                          <input
                            type="checkbox"
                            checked={permissions.includes("Pools")}
                            onChange={() => handleCheckboxChange("Pools")}
                          />
                          <p className="font-md text-sm">Pools</p>
                        </div>
                      </div>
                      {/* THIRD COLUMN */}
                      <div className="flex flex-col gap-3">
                        <div className="flex items-center gap-3 font-light">
                          <input
                            type="checkbox"
                            checked={permissions.includes("Segments")}
                            onChange={() => handleCheckboxChange("Segments")}
                          />
                          <p className="font-md text-sm">Segments</p>
                        </div>
                        <div className="flex items-center gap-3 font-light">
                          <input
                            type="checkbox"
                            checked={permissions.includes("Expense Head")}
                            onChange={() =>
                              handleCheckboxChange("Expense Head")
                            }
                          />
                          <p className="font-md text-sm">Expense Head</p>
                        </div>
                        <div className="flex items-center gap-3 font-light">
                          <input
                            type="checkbox"
                            checked={permissions.includes("SMS Setting")}
                            onChange={() => handleCheckboxChange("SMS Setting")}
                          />
                          <p className="font-md text-sm">SMS Setting</p>
                        </div>
                        <div className="flex items-center gap-3 font-light">
                          <input
                            type="checkbox"
                            checked={permissions.includes("E-Mail Template")}
                            onChange={() =>
                              handleCheckboxChange("E-Mail Template")
                            }
                          />
                          <p className="font-md text-sm">E-Mail Template</p>
                        </div>
                      </div>
                      {/* FOURTH COLUMN */}
                      <div className="flex flex-col gap-3">
                        <div className="flex items-center gap-3 font-light">
                          <input
                            type="checkbox"
                            checked={permissions.includes("SMS Template")}
                            onChange={() =>
                              handleCheckboxChange("SMS Template")
                            }
                          />
                          <p className="font-md text-sm">SMS Template</p>
                        </div>
                        <div className="flex items-center gap-3 font-light">
                          <input
                            type="checkbox"
                            checked={permissions.includes("Access Device")}
                            onChange={() =>
                              handleCheckboxChange("Access Device")
                            }
                          />
                          <p className="font-md text-sm">Access Device</p>
                        </div>
                        <div className="flex items-center gap-3 font-light">
                          <input
                            type="checkbox"
                            checked={permissions.includes("Access Control")}
                            onChange={() =>
                              handleCheckboxChange("Access Control")
                            }
                          />
                          <p className="font-md text-sm">Access Control</p>
                        </div>
                        <div className="flex items-center gap-3 font-light">
                          <input
                            type="checkbox"
                            checked={permissions.includes("E-Mail Setting")}
                            onChange={() =>
                              handleCheckboxChange("E-Mail Setting")
                            }
                          />
                          <p className="font-md text-sm">E-Mail Setting</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  ""
                )}
              </div>
            </div>
            {/* BUTTONS */}
            <div className="flex justify-end gap-2 px-2">
              <button
                type="submit"
                className="mb-3 mt-20 w-max rounded border-2 border-cyan-500 bg-cyan-500 px-10 py-4 text-white hover:bg-white hover:text-cyan-500"
              >
                Submit
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

EditPermission.propTypes = {
  onCancel: PropTypes.func.isRequired,
  permissionId: PropTypes.number,
};
