"use client";

//react

import { useState, useEffect } from "react";
import { FaAngleDown } from "react-icons/fa";
import { IoInformationCircle } from "react-icons/io5";
import axios from "axios";
import PropTypes from "prop-types";

//----------------- MUI Imports --------------------
import {
  Grid,
  Checkbox,
  FormControlLabel,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import { tenant_base_url, protocal_url } from "@/Config/Config";

import { getHostnamePart } from "@/components/GlobalHostUrl";

import { ToastContainer } from "react-toastify";
import {
  showErrorToast,
  showSuccessToast,
} from "@/utils/toastNotifications";

export default function AddPermission({ onCancel }) {
  const name = getHostnamePart();

  // ----------------------------------------------- Group DropDown GET API Is being used here -------------------------------------
  const [grpName, setGrpName] = useState([]);

  async function handleGroupName() {
    const bearer_token = localStorage.getItem("token");

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${bearer_token}`,
        },
      };
      const response = await axios.get(
        `${protocal_url}${name}.${tenant_base_url}/Admin/group/all`,
        config,
      );
      setGrpName(response.data.data);
    } catch (error) {
      console.error("Error fetching leads:", error);
      // Optionally, set an error state to display a user-friendly message
    }
  }

  useEffect(() => {
    handleGroupName();
  }, []);

  const [defaultTextLeadStatusDropDown, setdefaultTextLeadStatusDropDown] =
    useState("Select Group Name");
  const [isDropdownVisibleLeadStatus, setisDropdownVisibleLeadStatus] =
    useState(false);

  const toggleDropdownLeadStatus = () => {
    setisDropdownVisibleLeadStatus(!isDropdownVisibleLeadStatus);
  };

  const handleDropdownLeadStatus = (leadStatus) => {
    setdefaultTextLeadStatusDropDown(leadStatus);
    setisDropdownVisibleLeadStatus(!isDropdownVisibleLeadStatus);
  };

  // ------------------------------------------ Handle checkbox change -------------------------------------------

  const [selectedPermissions, setSelectedPermissions] = useState({});

  const handleCheckboxChange = (module, permission) => {
    setSelectedPermissions((prev) => {
      const updatedModule = prev[module] ? [...prev[module]] : [];

      if (updatedModule.includes(permission)) {
        return {
          ...prev,
          [module]: updatedModule.filter((perm) => perm !== permission),
        };
      } else {
        return {
          ...prev,
          [module]: [...updatedModule, permission],
        };
      }
    });
  };

  // Log updated permissions whenever they change
  useEffect(() => {
    console.log("Updated permissions: ", selectedPermissions);
  }, [selectedPermissions]);

  //------------------------------------------------Handle Submit---------------------------------------------------
  const handleSubmit = async (event) => {
    event.preventDefault();
    const bearer_token = localStorage.getItem("token");
    let success = false; // Flag to check if at least one request was successful

    // Convert selectedPermissions object into an array of modules
    const payload = Object.keys(selectedPermissions).map((module) => ({
      groupName: defaultTextLeadStatusDropDown,
      moduleName: module,
      permissions: selectedPermissions[module],
      createdDate: null,
      updatedDate: null,
      lastModifiedBy: null,
    }));

    console.log("Payload before sending:", payload);

    const config = {
      headers: {
        Authorization: `Bearer ${bearer_token}`,
        "Content-Type": "application/json",
      },
    };

    try {
      for (const item of payload) {
        console.log("Sending Payload:", JSON.stringify(item, null, 2));

        const response = await axios.post(
          `${protocal_url}${name}.${tenant_base_url}/Security/rolesandpermissions/add`,
          item,
          config,
        );

        console.log("Response:", response.data);

        if (response.data.isSuccess) {
          success = true; // Set success flag if at least one request succeeds
        }
      }

      // Show success toast only once if at least one request was successful
      if (success) {
        showSuccessToast("Permission added successfully!");

        // Close the modal after all requests are completed
        setTimeout(() => {
          onCancel();
        }, 1500);
      }
    } catch (error) {
      console.error("API Error:", error.response?.data || error.message);
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
                {/* ------ FIRST ONE -------- */}
                <div className="flex space-x-4">
                  {/* ---------- Group NAME DROPDOWN ---------- */}
                  <div className="relative flex w-1/2 flex-col">
                    <label
                      htmlFor="leadesStatus"
                      className="text-sm font-medium text-gray-700"
                    >
                      Group Name
                    </label>
                    <div
                      className="relative"
                      onMouseLeave={() => setisDropdownVisibleLeadStatus(false)}
                    >
                      <button
                        className="mt-1 flex w-full items-center justify-between rounded-md border border-gray-300 p-2"
                        id="LeadStatusDropDown"
                        type="button"
                        onClick={toggleDropdownLeadStatus}
                      >
                        {defaultTextLeadStatusDropDown}
                        <FaAngleDown className="ml-2 text-gray-400" />
                      </button>
                      {isDropdownVisibleLeadStatus && (
                        <div className="absolute top-full z-10 w-full rounded-md border border-gray-300 bg-white">
                          <ul className="py-2 text-sm text-gray-700">
                            {grpName.length > 0 ? (
                              grpName.map((group) =>
                                group.groupName === "Admin" ? null : (
                                  <li
                                    key={group.id}
                                    onClick={() =>
                                      handleDropdownLeadStatus(group.groupName)
                                    }
                                    className="block cursor-pointer border-b px-4 py-2 hover:bg-cyan-500 hover:text-white"
                                  >
                                    {group.groupName}
                                  </li>
                                ),
                              )
                            ) : (
                              <li className="flex items-center gap-1 px-4 py-2 text-center">
                                <IoInformationCircle
                                  size={25}
                                  className="text-cyan-600"
                                />
                                Group Name not available. Go to{" "}
                                <span className="font-bold">
                                  Settings - Groups - Add
                                </span>
                                .
                              </li>
                            )}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* ---------- DROPDOWN END ---------- */}
                </div>

                {/* ----------Lead CHECK BOXES ---------- */}
                <div className="mt-2 w-full rounded-sm bg-white shadow-md">
                  <Accordion sx={{ boxShadow: "none" }}>
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls="panel2-content"
                      id="panel2-header"
                    >
                      <Typography variant="h6">Leads</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      {/* MUI Grid Layout */}
                      <Grid
                        container
                        spacing={3}
                        justifyContent="space-between"
                      >
                        {/* FIRST COLUMN */}
                        <Grid
                          item
                          xs={12}
                          sm={6}
                          md={3}
                          sx={{ flexDirection: "column", display: "flex" }}
                        >
                          <FormControlLabel
                            control={
                              <Checkbox
                                onChange={() =>
                                  handleCheckboxChange("Leads", "Create Lead")
                                }
                              />
                            }
                            label="Create Lead"
                          />
                          <FormControlLabel
                            control={
                              <Checkbox
                                onChange={() =>
                                  handleCheckboxChange("Leads", "Upload Leads")
                                }
                              />
                            }
                            label="Upload Leads"
                          />
                          <FormControlLabel
                            control={
                              <Checkbox
                                onChange={() =>
                                  handleCheckboxChange(
                                    "Leads",
                                    "Lead Operation",
                                  )
                                }
                              />
                            }
                            label="Lead Operation"
                          />
                          <FormControlLabel
                            control={
                              <Checkbox
                                onChange={() =>
                                  handleCheckboxChange("Leads", "Lead Action")
                                }
                              />
                            }
                            label="Lead Action"
                          />
                        </Grid>

                        {/* SECOND COLUMN */}
                        <Grid
                          item
                          xs={12}
                          sm={6}
                          md={3}
                          sx={{ flexDirection: "column", display: "flex" }}
                        >
                          <FormControlLabel
                            control={
                              <Checkbox
                                onChange={() =>
                                  handleCheckboxChange("Leads", "View Leads")
                                }
                              />
                            }
                            label="View Leads"
                          />
                          <FormControlLabel
                            control={
                              <Checkbox
                                onChange={() =>
                                  handleCheckboxChange("Leads", "Fetch Leads")
                                }
                              />
                            }
                            label="Fetch Leads"
                          />
                          <FormControlLabel
                            control={
                              <Checkbox
                                onChange={() =>
                                  handleCheckboxChange("Leads", "Edit Lead")
                                }
                              />
                            }
                            label="Edit Lead"
                          />
                        </Grid>

                        {/* THIRD COLUMN */}
                        <Grid
                          item
                          xs={12}
                          sm={6}
                          md={3}
                          sx={{ flexDirection: "column", display: "flex" }}
                        >
                          <FormControlLabel
                            control={
                              <Checkbox
                                onChange={() =>
                                  handleCheckboxChange("Leads", "Mass Delete")
                                }
                              />
                            }
                            label="Mass Delete"
                          />
                          <FormControlLabel
                            control={
                              <Checkbox
                                onChange={() =>
                                  handleCheckboxChange(
                                    "Leads",
                                    "Export to Excel",
                                  )
                                }
                              />
                            }
                            label="Export to Excel"
                          />
                          <FormControlLabel
                            control={
                              <Checkbox
                                onChange={() =>
                                  handleCheckboxChange("Leads", "Export to PDF")
                                }
                              />
                            }
                            label="Export to PDF"
                          />
                        </Grid>

                        {/* FOURTH COLUMN */}
                        <Grid
                          item
                          xs={12}
                          sm={6}
                          md={3}
                          sx={{ flexDirection: "column", display: "flex" }}
                        >
                          <FormControlLabel
                            control={
                              <Checkbox
                                onChange={() =>
                                  handleCheckboxChange(
                                    "Leads",
                                    "Convert Lead to Contact",
                                  )
                                }
                              />
                            }
                            label="Convert Lead to Contact"
                          />
                          <FormControlLabel
                            control={
                              <Checkbox
                                onChange={() =>
                                  handleCheckboxChange(
                                    "Leads",
                                    "Create Sales Order",
                                  )
                                }
                              />
                            }
                            label="Create Sales Order"
                          />
                          <FormControlLabel
                            control={
                              <Checkbox
                                onChange={() =>
                                  handleCheckboxChange("Leads", "Mass E-Mail")
                                }
                              />
                            }
                            label="Mass E-Mail"
                          />
                        </Grid>
                      </Grid>
                    </AccordionDetails>
                  </Accordion>
                </div>

                {/* --------- CONTACT --------- */}
                <div className="mt-2 w-full rounded-sm bg-white shadow-md">
                  <Accordion sx={{ boxShadow: "none" }}>
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls="panel3-content"
                      id="panel3-header"
                    >
                      <Typography component="span">
                        <h1 className="text-xl font-normal">Contacts</h1>
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Grid
                        container
                        spacing={3}
                        justifyContent="space-between"
                      >
                        {/* FIRST COLUMN */}
                        <Grid
                          item
                          xs={12}
                          sm={6}
                          md={3}
                          sx={{ flexDirection: "column", display: "flex" }}
                        >
                          <FormControlLabel
                            control={
                              <Checkbox
                                onChange={() =>
                                  handleCheckboxChange(
                                    "Contacts",
                                    "Create Sales Order",
                                  )
                                }
                              />
                            }
                            label="Create Sales Order"
                          />
                          <FormControlLabel
                            control={
                              <Checkbox
                                onChange={() =>
                                  handleCheckboxChange(
                                    "Contacts",
                                    "Edit Contact",
                                  )
                                }
                              />
                            }
                            label="Edit Contact"
                          />
                        </Grid>

                        {/* SECOND COLUMN */}
                        <Grid
                          item
                          xs={12}
                          sm={6}
                          md={3}
                          sx={{ flexDirection: "column", display: "flex" }}
                        >
                          <FormControlLabel
                            control={
                              <Checkbox
                                onChange={() =>
                                  handleCheckboxChange(
                                    "Contacts",
                                    "View Contacts",
                                  )
                                }
                              />
                            }
                            label="View Contacts"
                          />
                          <FormControlLabel
                            control={
                              <Checkbox
                                onChange={() =>
                                  handleCheckboxChange(
                                    "Contacts",
                                    "Export to PDF",
                                  )
                                }
                              />
                            }
                            label="Export to PDF"
                          />
                        </Grid>

                        {/* THIRD COLUMN */}
                        <Grid
                          item
                          xs={12}
                          sm={6}
                          md={3}
                          sx={{ flexDirection: "column", display: "flex" }}
                        >
                          <FormControlLabel
                            control={
                              <Checkbox
                                onChange={() =>
                                  handleCheckboxChange(
                                    "Contacts",
                                    "Mass Delete",
                                  )
                                }
                              />
                            }
                            label="Mass Delete"
                          />
                          <FormControlLabel
                            control={
                              <Checkbox
                                onChange={() =>
                                  handleCheckboxChange(
                                    "Contacts",
                                    "Export to Excel",
                                  )
                                }
                              />
                            }
                            label="Export to Excel"
                          />
                        </Grid>

                        {/* FOURTH COLUMN */}
                        <Grid
                          item
                          xs={12}
                          sm={6}
                          md={3}
                          sx={{ flexDirection: "column", display: "flex" }}
                        >
                          <FormControlLabel
                            control={
                              <Checkbox
                                onChange={() =>
                                  handleCheckboxChange(
                                    "Contacts",
                                    "Mass E-Mail",
                                  )
                                }
                              />
                            }
                            label="Mass E-Mail"
                          />
                        </Grid>
                      </Grid>
                    </AccordionDetails>
                  </Accordion>
                </div>

                {/* --------- Client  --------- */}
                {/* --------- Client Section --------- */}
                <div className="mt-2 w-full rounded-sm bg-white shadow-md">
                  <Accordion sx={{ boxShadow: "none" }}>
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls="panel4-content"
                      id="panel4-header"
                    >
                      <Typography variant="h6">Client</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      {/* MUI Grid Layout */}
                      <Grid
                        container
                        spacing={3}
                        justifyContent="space-between"
                      >
                        {/* FIRST COLUMN */}
                        <Grid
                          item
                          xs={12}
                          sm={6}
                          md={3}
                          sx={{ flexDirection: "column", display: "flex" }}
                        >
                          <FormControlLabel
                            control={
                              <Checkbox
                                onChange={() =>
                                  handleCheckboxChange("Client", "Mass E-Mail")
                                }
                              />
                            }
                            label="Mass E-Mail"
                          />
                        </Grid>

                        {/* SECOND COLUMN */}
                        <Grid
                          item
                          xs={12}
                          sm={6}
                          md={3}
                          sx={{ flexDirection: "column", display: "flex" }}
                        >
                          <FormControlLabel
                            control={
                              <Checkbox
                                onChange={() =>
                                  handleCheckboxChange(
                                    "Client",
                                    "Export to PDF",
                                  )
                                }
                              />
                            }
                            label="Export to PDF"
                          />
                        </Grid>

                        {/* THIRD COLUMN */}
                        <Grid
                          item
                          xs={12}
                          sm={6}
                          md={3}
                          sx={{ flexDirection: "column", display: "flex" }}
                        >
                          <FormControlLabel
                            control={
                              <Checkbox
                                onChange={() =>
                                  handleCheckboxChange(
                                    "Client",
                                    "Export to Excel",
                                  )
                                }
                              />
                            }
                            label="Export to Excel"
                          />
                        </Grid>

                        {/* FOURTH COLUMN */}
                        <Grid
                          item
                          xs={12}
                          sm={6}
                          md={3}
                          sx={{ flexDirection: "column", display: "flex" }}
                        >
                          <FormControlLabel
                            control={
                              <Checkbox
                                onChange={() =>
                                  handleCheckboxChange("Client", "View Client")
                                }
                              />
                            }
                            label="View Client"
                          />
                        </Grid>
                      </Grid>
                    </AccordionDetails>
                  </Accordion>
                </div>

                {/* --------- SO --------- */}
                {/* --------- SALES ORDER SECTION ---------- */}
                <div className="mt-2 w-full rounded-sm bg-white shadow-md">
                  <Accordion sx={{ boxShadow: "none" }}>
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls="panel5-content"
                      id="panel5-header"
                    >
                      <Typography component="span">
                        <h1 className="text-xl font-normal">Sales Order</h1>
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      {/* MUI Grid for Balanced Layout */}
                      <Grid
                        container
                        spacing={3}
                        justifyContent="space-between"
                      >
                        {/* COLUMN 1 */}
                        <Grid
                          item
                          xs={12}
                          sm={6}
                          md={3}
                          sx={{ flexDirection: "column", display: "flex" }}
                        >
                          <FormControlLabel
                            control={
                              <Checkbox
                                onChange={() =>
                                  handleCheckboxChange(
                                    "Sales Order",
                                    "Edit Sales Order",
                                  )
                                }
                              />
                            }
                            label="Edit Sales Order"
                          />
                          <FormControlLabel
                            control={
                              <Checkbox
                                onChange={() =>
                                  handleCheckboxChange(
                                    "Sales Order",
                                    "Approve Pending",
                                  )
                                }
                              />
                            }
                            label="Approve Pending"
                          />
                        </Grid>

                        {/* COLUMN 2 */}
                        <Grid
                          item
                          xs={12}
                          sm={6}
                          md={3}
                          sx={{ flexDirection: "column", display: "flex" }}
                        >
                          <FormControlLabel
                            control={
                              <Checkbox
                                onChange={() =>
                                  handleCheckboxChange(
                                    "Sales Order",
                                    "Send SMS",
                                  )
                                }
                              />
                            }
                            label="Send SMS"
                          />
                          <FormControlLabel
                            control={
                              <Checkbox
                                onChange={() =>
                                  handleCheckboxChange(
                                    "Sales Order",
                                    "Export to PDF",
                                  )
                                }
                              />
                            }
                            label="Export to PDF"
                          />
                        </Grid>

                        {/* COLUMN 3 */}
                        <Grid
                          item
                          xs={12}
                          sm={6}
                          md={3}
                          sx={{ flexDirection: "column", display: "flex" }}
                        >
                          <FormControlLabel
                            control={
                              <Checkbox
                                onChange={() =>
                                  handleCheckboxChange(
                                    "Sales Order",
                                    "Mass Delete",
                                  )
                                }
                              />
                            }
                            label="Mass Delete"
                          />
                          <FormControlLabel
                            control={
                              <Checkbox
                                onChange={() =>
                                  handleCheckboxChange(
                                    "Sales Order",
                                    "Export to Excel",
                                  )
                                }
                              />
                            }
                            label="Export to Excel"
                          />
                        </Grid>

                        {/* COLUMN 4 */}
                        <Grid
                          item
                          xs={12}
                          sm={6}
                          md={3}
                          sx={{ flexDirection: "column", display: "flex" }}
                        >
                          <FormControlLabel
                            control={
                              <Checkbox
                                onChange={() =>
                                  handleCheckboxChange(
                                    "Sales Order",
                                    "Mass E-Mail",
                                  )
                                }
                              />
                            }
                            label="Mass E-Mail"
                          />
                                <FormControlLabel
                            control={
                              <Checkbox
                                onChange={() =>
                                  handleCheckboxChange("Sales Order", "View Sales Order")
                                }
                              />
                            }
                            label="View Sales Order"
                          />
                        </Grid>
                      </Grid>
                    </AccordionDetails>
                  </Accordion>
                </div>

                {/* --------- Free Trail --------- */}
                {/* ---------- FREE TRIAL SECTION ---------- */}
                <div className="mt-2 w-full rounded-sm bg-white shadow-md">
                  <Accordion sx={{ boxShadow: "none" }}>
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls="panel6-content"
                      id="panel6-header"
                    >
                      <Typography component="span">
                        <h1 className="text-xl font-normal">Free Trial</h1>
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      {/* MUI Grid for Layout */}
                      <Grid
                        container
                        spacing={3}
                        justifyContent="space-between"
                      >
                        {/* FIRST COLUMN */}
                        <Grid
                          item
                          xs={12}
                          sm={6}
                          md={3}
                          sx={{ flexDirection: "column", display: "flex" }}
                        >
                          <FormControlLabel
                            control={
                              <Checkbox
                                onChange={() =>
                                  handleCheckboxChange(
                                    "Free Trail",
                                    "Edit Free Trail",
                                  )
                                }
                              />
                            }
                            label="Edit Free Trail"
                          />
                          <FormControlLabel
                            control={
                              <Checkbox
                                onChange={() =>
                                  handleCheckboxChange(
                                    "Free Trail",
                                    "Export Trail",
                                  )
                                }
                              />
                            }
                            label="Export Trail"
                          />
                        </Grid>

                        {/* SECOND COLUMN */}
                        <Grid
                          item
                          xs={12}
                          sm={6}
                          md={3}
                          sx={{ flexDirection: "column", display: "flex" }}
                        >
                          <FormControlLabel
                            control={
                              <Checkbox
                                onChange={() =>
                                  handleCheckboxChange(
                                    "Free Trail",
                                    "Export To PDF",
                                  )
                                }
                              />
                            }
                            label="Export To PDF"
                          />
                          <FormControlLabel
                            control={
                              <Checkbox
                                onChange={() =>
                                  handleCheckboxChange(
                                    "Free Trail",
                                    "Export To Excel",
                                  )
                                }
                              />
                            }
                            label="Export To Excel"
                          />
                        </Grid>

                        {/* THIRD COLUMN */}
                        <Grid
                          item
                          xs={12}
                          sm={6}
                          md={3}
                          sx={{ flexDirection: "column", display: "flex" }}
                        >
                          <FormControlLabel
                            control={
                              <Checkbox
                                onChange={() =>
                                  handleCheckboxChange(
                                    "Free Trail",
                                    "Mass Delete",
                                  )
                                }
                              />
                            }
                            label="Mass Delete"
                          />
                                     <FormControlLabel
                            control={
                              <Checkbox
                                onChange={() =>
                                  handleCheckboxChange("Free Trail", "View Free Trail")
                                }
                              />
                            }
                            label="View Free Trail"
                          />
                        </Grid>

                        {/* FOURTH COLUMN */}
                        <Grid
                          item
                          xs={12}
                          sm={6}
                          md={3}
                          sx={{ flexDirection: "column", display: "flex" }}
                        >
                          <FormControlLabel
                            control={
                              <Checkbox
                                onChange={() =>
                                  handleCheckboxChange(
                                    "Free Trail",
                                    "Mass E-Mail",
                                  )
                                }
                              />
                            }
                            label="Mass E-Mail"
                          />
                        </Grid>
                      </Grid>
                    </AccordionDetails>
                  </Accordion>
                </div>

                {/* --------- Follow Up --------- */}
                {/* ---------- FOLLOW UP SECTION ---------- */}
                <div className="mt-2 w-full rounded-sm bg-white shadow-md">
                  <Accordion sx={{ boxShadow: "none" }}>
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls="panel7-content"
                      id="panel7-header"
                    >
                      <Typography component="span">
                        <h1 className="text-xl font-normal">Follow Up</h1>
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      {/* MUI Grid Layout for Better Spacing */}
                      <Grid
                        container
                        spacing={3}
                        justifyContent="space-between"
                      >
                        {/* FIRST COLUMN */}
                        <Grid
                          item
                          xs={12}
                          sm={6}
                          md={3}
                          sx={{ flexDirection: "column", display: "flex" }}
                        >
                          <FormControlLabel
                            control={
                              <Checkbox
                                onChange={() =>
                                  handleCheckboxChange(
                                    "Follow Up",
                                    "Edit Follow Up",
                                  )
                                }
                              />
                            }
                            label="Edit Follow Up"
                          />
                          <FormControlLabel
                            control={
                              <Checkbox
                                onChange={() =>
                                  handleCheckboxChange(
                                    "Follow Up",
                                    "Export Follow Up",
                                  )
                                }
                              />
                            }
                            label="Export Follow Up"
                          />
                        </Grid>

                        {/* SECOND COLUMN */}
                        <Grid
                          item
                          xs={12}
                          sm={6}
                          md={3}
                          sx={{ flexDirection: "column", display: "flex" }}
                        >
                          <FormControlLabel
                            control={
                              <Checkbox
                                onChange={() =>
                                  handleCheckboxChange(
                                    "Follow Up",
                                    "Export To PDF",
                                  )
                                }
                              />
                            }
                            label="Export To PDF"
                          />
                          <FormControlLabel
                            control={
                              <Checkbox
                                onChange={() =>
                                  handleCheckboxChange(
                                    "Follow Up",
                                    "Export To Excel",
                                  )
                                }
                              />
                            }
                            label="Export To Excel"
                          />
                        </Grid>

                        {/* THIRD COLUMN */}
                        <Grid
                          item
                          xs={12}
                          sm={6}
                          md={3}
                          sx={{ flexDirection: "column", display: "flex" }}
                        >
                          <FormControlLabel
                            control={
                              <Checkbox
                                onChange={() =>
                                  handleCheckboxChange(
                                    "Follow Up",
                                    "Mass Delete",
                                  )
                                }
                              />
                            }
                            label="Mass Delete"
                          />
                               <FormControlLabel
                            control={
                              <Checkbox
                                onChange={() =>
                                  handleCheckboxChange("Follow Up", "View Follow Up")
                                }
                              />
                            }
                            label="View Follow Up"
                          />
                        </Grid>

                        {/* FOURTH COLUMN */}
                        <Grid
                          item
                          xs={12}
                          sm={6}
                          md={3}
                          sx={{ flexDirection: "column", display: "flex" }}
                        >
                          <FormControlLabel
                            control={
                              <Checkbox
                                onChange={() =>
                                  handleCheckboxChange(
                                    "Follow Up",
                                    "Mass E-Mail",
                                  )
                                }
                              />
                            }
                            label="Mass E-Mail"
                          />
                        </Grid>
                      </Grid>
                    </AccordionDetails>
                  </Accordion>
                </div>

                {/* --------- SMS Box --------- */}
                {/* --------- SERVICE BOX --------- */}
                <div className="mt-2 w-full rounded-sm bg-white shadow-md">
                  <Accordion sx={{ boxShadow: "none" }}>
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls="panel-8content"
                      id="panel8-header"
                    >
                      <Typography component="span">
                        <h1 className="text-xl font-normal">Service Box</h1>
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      {/* MUI Grid Layout for checkboxes */}
                      <Grid container spacing={3} justifyContent="flex-start">
                        {/* FIRST COLUMN */}
                        <Grid
                          item
                          xs={12}
                          sm={6}
                          md={3}
                          sx={{ flexDirection: "column", display: "flex" }}
                        >
                          <FormControlLabel
                            control={
                              <Checkbox
                                onChange={() =>
                                  handleCheckboxChange(
                                    "Service Box",
                                    "Send SMS",
                                  )
                                }
                              />
                            }
                            label="Send SMS"
                          />
                        </Grid>

                        {/* SECOND COLUMN */}
                        <Grid
                          item
                          xs={12}
                          sm={6}
                          md={3}
                          sx={{ flexDirection: "column", display: "flex" }}
                        >
                          <FormControlLabel
                            control={
                              <Checkbox
                                onChange={() =>
                                  handleCheckboxChange(
                                    "Service Box",
                                    "Send E-Mail",
                                  )
                                }
                              />
                            }
                            label="Send E-Mail"
                          />
                        </Grid>

                      </Grid>
                    </AccordionDetails>
                  </Accordion>
                </div>

                {/* --------- Reports --------- */}
                {/* ---------- Reports SECTION ---------- */}
                <div className="mt-2 w-full rounded-sm bg-white shadow-md">
                  <Accordion sx={{ boxShadow: "none" }}>
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls="panel9-content"
                      id="panel9-header"
                    >
                      <Typography variant="h6">Reports</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      {/* MUI Grid for Reports */}
                      <Grid
                        container
                        spacing={3}
                        justifyContent="space-between"
                      >
                        {/* FIRST COLUMN */}
                        <Grid
                          item
                          xs={12}
                          sm={6}
                          md={3}
                          sx={{ flexDirection: "column", display: "flex" }}
                        >
                          <FormControlLabel
                            control={
                              <Checkbox
                                onChange={() =>
                                  handleCheckboxChange(
                                    "Reports",
                                    "Employee Report",
                                  )
                                }
                              />
                            }
                            label="Employee Report"
                          />
                          <FormControlLabel
                            control={
                              <Checkbox
                                onChange={() =>
                                  handleCheckboxChange("Reports", "Monitoring")
                                }
                              />
                            }
                            label="Monitoring"
                          />
                        </Grid>

                        {/* SECOND COLUMN */}
                        <Grid
                          item
                          xs={12}
                          sm={6}
                          md={3}
                          sx={{ flexDirection: "column", display: "flex" }}
                        >
                          <FormControlLabel
                            control={
                              <Checkbox
                                onChange={() =>
                                  handleCheckboxChange("Reports", "Lead Report")
                                }
                              />
                            }
                            label="Lead Report"
                          />
                          <FormControlLabel
                            control={
                              <Checkbox
                                onChange={() =>
                                  handleCheckboxChange(
                                    "Reports",
                                    "Dispose Leads",
                                  )
                                }
                              />
                            }
                            label="Dispose Leads"
                          />
                        </Grid>

                        {/* THIRD COLUMN */}
                        <Grid
                          item
                          xs={12}
                          sm={6}
                          md={3}
                          sx={{ flexDirection: "column", display: "flex" }}
                        >
                          <FormControlLabel
                            control={
                              <Checkbox
                                onChange={() =>
                                  handleCheckboxChange(
                                    "Reports",
                                    "Client Report",
                                  )
                                }
                              />
                            }
                            label="Client Report"
                          />
                        </Grid>

                        {/* FOURTH COLUMN */}
                        <Grid
                          item
                          xs={12}
                          sm={6}
                          md={3}
                          sx={{ flexDirection: "column", display: "flex" }}
                        >
                          <FormControlLabel
                            control={
                              <Checkbox
                                onChange={() =>
                                  handleCheckboxChange(
                                    "Reports",
                                    "Sales Report",
                                  )
                                }
                              />
                            }
                            label="Sales Report"
                          />
                        </Grid>
                      </Grid>
                    </AccordionDetails>
                  </Accordion>
                </div>

                {/* ---------  Financial Activity --------- */}
                {/* ---------  Financial Activity --------- */}
                <div className="mt-2 w-full rounded-sm bg-white shadow-md">
                  <Accordion sx={{ boxShadow: "none" }}>
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls="panel10-content"
                      id="panel10-header"
                    >
                      <Typography component="span">
                        <h1 className="text-xl font-normal">
                          Financial Activity
                        </h1>
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      {/* ----------  Financial Activity CHECKBOXES ---------- */}
                      <Grid container spacing={3} justifyContent="flex-start">
                        {/* FIRST CHECKBOX */}
                        <Grid
                          item
                          xs={12}
                          sm={6}
                          md={3}
                          sx={{ flexDirection: "column", display: "flex" }}
                        >
                          <FormControlLabel
                            control={
                              <Checkbox
                                onChange={() =>
                                  handleCheckboxChange(
                                    "Financial Activity",
                                    "View Expenses",
                                  )
                                }
                              />
                            }
                            label="View Expenses"
                          />
                        </Grid>

                        {/* SECOND CHECKBOX */}
                        <Grid
                          item
                          xs={12}
                          sm={6}
                          md={3}
                          sx={{ flexDirection: "column", display: "flex" }}
                        >
                          <FormControlLabel
                            control={
                              <Checkbox
                                onChange={() =>
                                  handleCheckboxChange(
                                    "Financial Activity",
                                    "View Brokerage",
                                  )
                                }
                              />
                            }
                            label="View Brokerage"
                          />
                        </Grid>
                      </Grid>
                    </AccordionDetails>
                  </Accordion>
                </div>

                {/* ----------Settings CHECK BOXES ---------- */}
                <div className="mt-2 w-full rounded-sm bg-white shadow-md">
                  <Accordion sx={{ boxShadow: "none" }}>
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls="panel2-content"
                      id="panel2-header"
                    >
                      <Typography variant="h6">Settings</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      {/* MUI Grid Layout */}
                      <Grid
                        container
                        spacing={3}
                        justifyContent="space-between"
                      >
                        {/* FIRST COLUMN */}
                        <Grid
                          item
                          xs={12}
                          sm={6}
                          md={3}
                          sx={{ flexDirection: "column", display: "flex" }}
                        >
                          <FormControlLabel
                            control={
                              <Checkbox
                                onChange={() =>
                                  handleCheckboxChange(
                                    "Settings",
                                    "User Setting",
                                  )
                                }
                              />
                            }
                            label="User Setting"
                          />
                          <FormControlLabel
                            control={
                              <Checkbox
                                onChange={() =>
                                  handleCheckboxChange(
                                    "Settings",
                                    "User Operation",
                                  )
                                }
                              />
                            }
                            label="User Operation"
                          />
                          <FormControlLabel
                            control={
                              <Checkbox
                                onChange={() =>
                                  handleCheckboxChange("Settings", "Group")
                                }
                              />
                            }
                            label="Group"
                          />
                          <FormControlLabel
                            control={
                              <Checkbox
                                onChange={() =>
                                  handleCheckboxChange("Settings", "Department")
                                }
                              />
                            }
                            label="Department"
                          />
                          <FormControlLabel
                            control={
                              <Checkbox
                                onChange={() =>
                                  handleCheckboxChange(
                                    "Settings",
                                    "Roles & Permissions",
                                  )
                                }
                              />
                            }
                            label="Roles & Permissions"
                          />
                        </Grid>

                        {/* SECOND COLUMN */}
                        <Grid
                          item
                          xs={12}
                          sm={6}
                          md={3}
                          sx={{ flexDirection: "column", display: "flex" }}
                        >
                          <FormControlLabel
                            control={
                              <Checkbox
                                onChange={() =>
                                  handleCheckboxChange(
                                    "Settings",
                                    "Designation",
                                  )
                                }
                              />
                            }
                            label="Designation"
                          />
                          <FormControlLabel
                            control={
                              <Checkbox
                                onChange={() =>
                                  handleCheckboxChange(
                                    "Settings",
                                    "Qualification",
                                  )
                                }
                              />
                            }
                            label="Qualification"
                          />
                          <FormControlLabel
                            control={
                              <Checkbox
                                onChange={() =>
                                  handleCheckboxChange(
                                    "Settings",
                                    "Lead Status",
                                  )
                                }
                              />
                            }
                            label="Lead Status"
                          />
                          <FormControlLabel
                            control={
                              <Checkbox
                                onChange={() =>
                                  handleCheckboxChange("Settings", "Pools")
                                }
                              />
                            }
                            label="Pools"
                          />
                        </Grid>

                        {/* THIRD COLUMN */}
                        <Grid
                          item
                          xs={12}
                          sm={6}
                          md={3}
                          sx={{ flexDirection: "column", display: "flex" }}
                        >
                          <FormControlLabel
                            control={
                              <Checkbox
                                onChange={() =>
                                  handleCheckboxChange("Settings", "Segments")
                                }
                              />
                            }
                            label="Segments"
                          />
                          <FormControlLabel
                            control={
                              <Checkbox
                                onChange={() =>
                                  handleCheckboxChange(
                                    "Settings",
                                    "Expense Head",
                                  )
                                }
                              />
                            }
                            label="Expense Head"
                          />
                          <FormControlLabel
                            control={
                              <Checkbox
                                onChange={() =>
                                  handleCheckboxChange(
                                    "Settings",
                                    "SMS Setting",
                                  )
                                }
                              />
                            }
                            label="SMS Setting"
                          />
                          <FormControlLabel
                            control={
                              <Checkbox
                                onChange={() =>
                                  handleCheckboxChange(
                                    "Settings",
                                    " E-Mail Template",
                                  )
                                }
                              />
                            }
                            label=" E-Mail Template"
                          />
                        </Grid>

                        {/* FOURTH COLUMN */}
                        <Grid
                          item
                          xs={12}
                          sm={6}
                          md={3}
                          sx={{ flexDirection: "column", display: "flex" }}
                        >
                          <FormControlLabel
                            control={
                              <Checkbox
                                onChange={() =>
                                  handleCheckboxChange(
                                    "Settings",
                                    "SMS Template",
                                  )
                                }
                              />
                            }
                            label="Create Lead"
                          />
                          <FormControlLabel
                            control={
                              <Checkbox
                                onChange={() =>
                                  handleCheckboxChange(
                                    "Settings",
                                    "Access Device",
                                  )
                                }
                              />
                            }
                            label="Access Device"
                          />
                          <FormControlLabel
                            control={
                              <Checkbox
                                onChange={() =>
                                  handleCheckboxChange(
                                    "Settings",
                                    "Access Control",
                                  )
                                }
                              />
                            }
                            label="Access Control"
                          />
                          <FormControlLabel
                            control={
                              <Checkbox
                                onChange={() =>
                                  handleCheckboxChange(
                                    "Settings",
                                    "E-Mail Setting",
                                  )
                                }
                              />
                            }
                            label="E-Mail Setting"
                          />
                        </Grid>
                      </Grid>
                    </AccordionDetails>
                  </Accordion>
                </div>
              </div>
            </div>
            {/* BUTTONS */}
            <div className="flex justify-end gap-2 px-2">
              <button
                type="submit"
                className="mb-3 mt-20 w-max rounded border-2 border-cyan-500 bg-cyan-500 px-10 py-4 text-white hover:bg-white hover:text-cyan-500 disabled:cursor-not-allowed disabled:border-gray-300 disabled:bg-gray-300 disabled:text-gray-500"
                disabled={
                  !(
                    selectedPermissions.length !== 0 &&
                    defaultTextLeadStatusDropDown !== "Select Group Name"
                  )
                }
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

AddPermission.propTypes = {
  onCancel: PropTypes.func.isRequired,
};
