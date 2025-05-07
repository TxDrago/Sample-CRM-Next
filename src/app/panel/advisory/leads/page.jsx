"use client";

//react
import Link from "next/link";
import { useRouter } from "next/navigation";

import { useEffect, useState } from "react";

//external Packages
import axios from "axios";
import { DataGrid } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";

//React Icons
import { FaAngleDown } from "react-icons/fa";
import { MdCall } from "react-icons/md";

//grid->
import { BiCalendar } from "react-icons/bi";
import { RiShieldUserLine } from "react-icons/ri";
import { FaUserTie } from "react-icons/fa";
import { IoIosMail } from "react-icons/io";
import { FaPhoneAlt } from "react-icons/fa";
import { PiLineSegmentsBold } from "react-icons/pi";
import { AiOutlineEdit } from "react-icons/ai";
import { BsHourglassSplit } from "react-icons/bs";

//Folder Imported
import { tenant_base_url, protocal_url } from "@/Config/Config";

//name
import { getHostnamePart } from "@/components/GlobalHostUrl";

//files
import LeadOperations from "./Components/LeadOperations";
import LeadAction from "./Components/LeadAction";
import UploadLead from "./Components/UploadLead";

//modals
import LeadAssignModal from "./Components/LeadAssignModal";
import LeadStatusModal from "./Components/LeadStatusModal";
import MultipleAssignModal from "./Components/MultipleAssignModal";
import MultipuleStatusModal from "./Components/MultipleStatusModal";
import LeadFeatchModal from "./LeadFeatchModal";

//Global Search Element
import { SearchElement } from "@/components/SearchElement";

import UseDateFilter from "@/Hooks/DateFilter/UseDateFilter";
import UseAction from "@/Hooks/Action/UseAction";
import UseGridFilter from "@/Hooks/GridFilter/UseGridFilter";
import ManagedByFilter from "@/Hooks/ManagedByFilter/ManagedByFilter";

export default function Lead() {
 const router = useRouter();
  const name = getHostnamePart();

  //------- Business Type --------
  const businessType = localStorage.getItem("businessType");
  const businessRole = localStorage.getItem("businessRole");
  const [business, setBusiness] = useState("");
  const [adminRole, setAdminRole] = useState("");

    //--------------------------------------- Set Business Type --------------------------------------------
             const [BusinessType, setBusinessType] = useState("");
              
             useEffect(() => {
               const storedType = localStorage.getItem("businessType") || "";
               setBusinessType(storedType);
             }, []);

  // Featch Lead Modal
  const [isFeatchModalOpen, setIsFetchModalOpen] = useState(false);

  //DND
  const [users, setUsers] = useState([]);

  //------------------------------------------------- All States----------------------------------------------------------
  const [selectedRowsId, setSelectedRowsId] = useState([]);
  const [selectedRowEmails, setSelectedRowEmails] = useState([]);

  //------------------------------------------------- Modal Satates --------------------------------------------------------
  const [selectedValue, setSelectedValue] = useState("");
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [multiAssignModal, setMultiAssignModal] = useState(false);
  const [multiStatusModal, setMultiStatusModal] = useState(false);

  //-------------------------------------------------- GET Data ----------------------------------------------------
  const [originalData, setOriginalData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);

  const getApiData = async (id = 0) => {
    // Default id to 0
    const bearer_token = localStorage.getItem("token");

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${bearer_token}`,
        },
      };

      let response;
      if (id === 4) {
        response = await axios.get(
          `${protocal_url}${name}.${tenant_base_url}/LeadOpration/leads/byusertoken/count`,
          config,
        );
      } else {
        response = await axios.get(
          `${protocal_url}${name}.${tenant_base_url}/Lead/leads/byusertoken`,
          config,
        );
      }

      if (response.status === 200) {
        const followup = response.data;
        setOriginalData(followup?.data || []);
        setFilteredData(followup?.data || []);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    getApiData();
  }, []);

  //---------------------------------------------> Grid Pagination <-----------------------------------------------
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentData = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  //-----------------------------------------------STRIPE BAR DROPDOWN--------------------------------------------------
  const [selectedViewValue, setSelectedViewValue] = useState("Table View");
  // -------------------------------------------- Navigate to Edit Screen ----------------------------------------
  const handleNumberClick = (event, mobileNo) => {
    event.stopPropagation();
    window.location.href = `tel:${mobileNo}`;
  };
  //------------------------------------------------------ Check Box Data ------------------------------------------
  const handleSelectionChange = (selectionModel) => {
    const selectedRows = currentData.filter((row) =>
      selectionModel.includes(row.id),
    );
    const selectedIDs = selectedRows.map((row) => row.id);
    const selectedEmails = selectedRows.map((row) => row.email);
    setSelectedRowsId(selectedIDs);
    setSelectedRowEmails(selectedEmails);
  };

  //------------------------------------------------------------------------------------------------
  //----------------Managing Color of Assigned To----------------
  const getAllUsers = async () => {
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

      const data = response.data?.data;
      setUsers(data);
    } catch (error) {
      console.error("Error fetching leads:", error);
      // Optionally, set an error state to display a user-friendly message
    }
  };

  //useEffect ==> to fetch handleLead, getAllUsers, bussiness, & AdminRole
  useEffect(() => {
    getAllUsers();
    setBusiness(businessType);
    setAdminRole(businessRole);
  }, []);

  function handleLeadStatusSelection(status) {
    setLeadStatus(status); // Update leadStatus state
    handle_LeadStatus(status); // Apply filter based on selected status
  }

  // Function to --------------> filter leads <--------------
  function handle_LeadStatus(statusValue) {
    if (activeButtonId === 1) {
      let filteredLeads;
      if (statusValue === "All Lead" || statusValue === null) {
        // Show all leads when "All Lead" is selected or reset
        filteredLeads = filteredData;
      } else {
        // Apply filtering for other statuses
        filteredLeads = filteredData.filter(
          (lead) => lead.leadesStatus === statusValue,
        );
      }
      setFilteredData(filteredLeads);
    }
    if (activeButtonId === 2) {
      let filteredLeads;
      if (statusValue === "All Lead" || statusValue === null) {
        // Show all leads when "All Lead" is selected or reset
        filteredLeads = filteredData;
      } else {
        // Apply filtering for other statuses
        filteredLeads = filteredData.filter(
          (lead) => lead.leadesStatus === statusValue,
        );
      }
      setFilteredData(filteredLeads);
    }
  }

  //-----------------------------------------------> ALL LEADS-->>DROPDOWN<-----------------------------------------------
  //BY_DEFAULT-TEXT
  const [leadStatus, setLeadStatus] = useState("All Lead"); // Track the selected lead status

  //->DROPDOWN_STATE
  const [allLeaddropDown, setAllLeaddropDown] = useState(false);

  //->TOGGLE
  const toggleMenuAllLead = () => {
    setAllLeaddropDown(!allLeaddropDown);
  };

  //ARRAY TO STORE DATA
  const [allLeadData, setallLeadData] = useState([]);

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
      setallLeadData(response.data.data);
    } catch (error) {
      console.error("Error fetching leads:", error);
    }
  }

  useEffect(() => {
    handleLeadStatus();
  }, []);

  //-------------------------------------------------------------------------------------

  //-------------------------------->ACTION BAR DROPDOWN<--------------------------------
  const actions = [
    // { key: 0, value: "Actions" },
    { key: 1, value: "Mass Delete" },
    { key: 3, value: "Mass E-Mail" },
    // { key: 4, value: "Approve Leads" },
    { key: 5, value: "Export To Excel" },
    { key: 6, value: "Export To PDF" },
    { key: 7, value: "Convert Lead to Contact" },
  ];

  // ---------------------------------------- Close Modal Function -----------------------------------
  const closeModal = () => {
    setAssignModalOpen(false);
    setStatusModalOpen(false);
    setMultiAssignModal(false);
    setMultiStatusModal(false);
    setIsFetchModalOpen(false);
    getApiData();
  };
  //---------------------->---------------------->MANAGE_BY/ASSIGNED_TO<----------------------<ARVIND----------------------
  const roleColors = [
    "#2563eb", // blue
    "#22c55e", // LimeGreen
    "#7c3aed", // MediumPurple
    "#0369a1", //Sky
    "#e11d48", //Rose
  ];

  // Function to get the color for a role based on its index
  const getRoleColorByIndex = (index) => {
    return roleColors[index % roleColors?.length]; // Use modulo for wrapping
  };
  //--------------------------------------------------  DYNAMIC RENDERING BUTTONS - TABLE --------------------------------------------
  // DYNAMIC LEAD BUTTONS
  const dynamicButtons = [
    { id: 1, name: "Leads" },
    { id: 2, name: "Upload Leads" },
    { id: 3, name: "Lead Operations" },
    { id: 4, name: "Lead Action" },
  ];

  // State to keep track of the selected button and button text

  const [activeButtonId, setActiveButtonId] = useState(
    () => parseInt(localStorage.getItem("activeButtonId")) || 1,
  );

  const handleDynamicButtonsClick = (id) => {
    setActiveButtonId(id); // Update state first
    localStorage.setItem("activeButtonId", id);
    getApiData(id);
  };

  useEffect(() => {
    return () => {
      // This will run when the component unmounts
      localStorage.removeItem("activeButtonId");
    };
  }, [location]);

  //------------------------------------------------------------------------------------------------
  //-----------------------------------leadOperations BAR DROPDOWN-----------------------------------------------------
  const leadOperations = [
    { key: 1, value: "Lead Allotment" },
    { key: 2, value: "Multiple Assign" },
    { key: 3, value: "Change Status" },
    { key: 4, value: "Multiple Status Change" },
  ];

  const handleSelect = (selected) => {
    setSelectedValue(selected);

    console.log("Selected Value:", selected, selectedValue);

    if (selected === "Lead Allotment") {
      setAssignModalOpen(true);
    }
    if (selected === "Change Status") {
      setStatusModalOpen(true);
    }
    if (selected === "Multiple Assign") {
      if (selectedRowsId.length > 0) {
        setMultiAssignModal(true);
      } else {
        alert("No Id Selected");
      }
    }
    if (selected === "Multiple Status Change") {
      if (selectedRowsId.length > 0) {
        setMultiStatusModal(true);
      } else {
        alert("No Id Selected");
      }
    }
  };

  // SELECT OPERATION DROPDOWN
  const [selectOperationDropdown, setSelectOperationDropdown] = useState(false);

  // TOGGLE SELECT OPERATION
  const toggleDropdownSelectOperation = () => {
    setSelectOperationDropdown(!selectOperationDropdown);
  };

  //---------------------------------------------------- Roles & Permissions ----------------------------------------------------

  const [permissions, setPermissions] = useState([]);
  const [createSO, setCreateSO] = useState(false);
  const [viewLeads, setviewLeads] = useState(false);
  const [createLead, setCreateLead] = useState(false);
  const [viewName, setViewName] = useState("");
  const [fetchLead, setFetchLead] = useState(false);

  async function handleGetPermission() {
    const bearer_token = localStorage.getItem("token");
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${bearer_token}`,
        },
      };
      const response = await axios.get(
        `${protocal_url}${name}.${tenant_base_url}/Security/rolesandpermissions/getgroupwise/${businessRole}`,
        config,
      );
      console.log("Permission Data : ", response.data.data);
      const permissionsList = response?.data?.data;

      if (permissionsList) {
        const serviceBoxPermissions = permissionsList.find(
          (item) => item.moduleName === "Leads",
        );

        if (serviceBoxPermissions) {
          const permissionsArray = serviceBoxPermissions.permissions.split(",");
          setPermissions(permissionsArray);

          console.log("List : ", permissionsArray);

          //------------------------------------------------------ Set permissions ------------------------------------------------
          if (
            permissionsArray.includes("View Leads") ||
            businessRole === "Admin"
          ) {
            setViewName("Leads");
          } else {
            setViewName("");
          }
          setCreateSO(permissionsArray.includes("Create Sales Order"));
          setviewLeads(permissionsArray.includes("View Leads"));
          setCreateLead(permissionsArray.includes("Create Lead"));
          setFetchLead(permissionsArray.includes("Fetch Leads"));
        }
      }
    } catch (error) {
      console.error("Error fetching leads:", error);
    }
  }

  useEffect(() => {
    handleGetPermission();
  }, []);

  // ------------------------------ Search Function ----------------------------------
  const [searchTerm, setSearchTerm] = useState(""); // State for search term
  useEffect(() => {
    let filtered = [];

    if (activeButtonId === 4) {
      // Filter for Lead Action (id === 4)
      filtered = originalData.filter(
        (lead) =>
          lead.userName &&
          lead.userName.toLowerCase().includes(searchTerm?.toLowerCase()),
      );
    } else {
      // General filtering for other lead types
      filtered = originalData.filter(
        (lead) =>
          lead.name?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
          lead.mobileNo?.includes(searchTerm),
      );
    }

    setFilteredData(filtered);
  }, [searchTerm, originalData, activeButtonId]); // Added activeButtonId to dependencies

  // ------------------------------------------------- Managed By State -----------------------------------------
  const [assignedTo, setAssignedTo] = useState("Managed By");
  //------------------------------------------------------Filter Reset Settings ---------------------------------------------
  const handleResetFilter = () => {
    setLeadStatus("All Lead");
    setAssignedTo("Managed By");
    setSearchTerm("");
    setLeadStatus("All Lead");
  };
  //-------------------------------------Enable us to switch to createlead/editlead page with /:id ----------------------------
  let handleClick = (item) => {
    router.push(`/panel/${BusinessType}/leads/edit_lead/${item.id}`);
  };
  //------------------------------------------------------ Table Heading And Table Data ------------------------------------------
  const columns = [
    {
      field: "name",
      headerName: "Lead Name",
      minWidth: 150,
      flex: 1,
      renderCell: (params) => (
        <div
          onClick={() => handleClick(params.row)} // Always trigger on click
          style={{
            cursor: "pointer",
            color: "blue",
            fontWeight: 500,
            width: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            lineHeight:1,
            height:"100%"
          }}
        >
          {params.value || "-"} {/* Show dash if empty */}
          <div className="mt-1 flex h-6 w-[80%] justify-center">
            <div className="w-full px-1 py-1 text-xs text-center text-white rounded-full bg-cyan-500">
              {params.row.leadesStatus || "NA"}
            </div>
          </div>
        </div>
      ),
    },

    !business.includes("Brokerage") && {
      field: "email",
      headerName: "Email",
      minWidth: 160,
      flex: 1,
      renderCell: (params) => (
        <a href={`mailto:${params.value}`} onClick={(e) => e.stopPropagation()}>
          {params.value}
        </a>
      ),
    },
    {
      field: "mobileNo",
      headerName: "Phone No",
      minWidth: 110,
      flex: 1,
      renderCell: (params) => (
        <span
          onClick={(event) => handleNumberClick(event, params.row.mobileNo)}
          style={{ display: "flex", gap: "5px", alignItems: "center" }}
        >
          <MdCall className="text-red-600" /> {params.value}
        </span>
      ),
    },
    !business.includes("Brokerage") && {
      field: "call_bck_DateTime",
      headerName: "Follow Up",
      minWidth: 100,
      flex: 1,
      renderCell: (params) => params.value?.replace("T", " ").split(":00")[0],
    },
    {
      field: "segments",
      headerName: "Segments",
      minWidth: 120,
      flex: 1,
      renderCell: (params) => params.row.segments?.join(", ") || "",
    },
    {
      field: "managedBy",
      headerName: "Managed By",
      minWidth: 120,
      flex: 1,
      display: "flex",
      alignItems: "center",
      renderCell: (params) => {
        const matchedUser = users.find(
          (user) => user.userName === params.row.assigned_To,
        );
        const roleColor = getRoleColorByIndex(matchedUser?.role?.length);
        return matchedUser ? (
          <div
            style={{
              backgroundColor: roleColor || "#000",
              borderRadius: "8px",
              padding: "8px",
              color: "white",
              textAlign: "center",
              width: "100%",
              height: "60%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {params.row.assigned_To || "NA"} - ({matchedUser?.role || "NA"})
          </div>
        ) : (
          ""
        );
      },
    },
    (createSO || businessRole === "Admin") && {
      field: "createSO",
      headerName: "Action",
      minWidth: 80,
      flex: 1,
      display: "flex",
      alignItems: "center",
      renderCell: (params) => (
        <button
          onClick={(e) => {
            e.stopPropagation();
            router.push(`/panel/${BusinessType}/leads/create/so/${params.row.id}`);
          }}
          className="flex items-center justify-center px-3 py-1 text-white bg-blue-600 rounded shadow-md h-7 hover:bg-blue-500"
        >
          {business === "brokerage" ? "Create Client" : "SO"}
        </button>
      ),
    },
  ].filter(Boolean);

  return (
    //parent
    <>
      <div className="flex flex-col min-h-screen m-3">
        {/* -----------------------------------Leads Allotment Modal------------------------------ */}
        {assignModalOpen && <LeadAssignModal onClose={closeModal} />}
        {/* -----------------------------------Multi Assign Modal------------------------------ */}
        {multiAssignModal && (
          <MultipleAssignModal multiIds={selectedRowsId} onClose={closeModal} />
        )}
        {/* -----------------------------------Change Status Modal------------------------------ */}
        {statusModalOpen && <LeadStatusModal onClose={closeModal} />}
        {/* -----------------------------------Multi Status Change Modal------------------------------ */}
        {multiStatusModal && (
          <MultipuleStatusModal
            multiIds={selectedRowsId}
            onClose={closeModal}
          />
        )}
        {/* -------------------------------- Fetch modal -------------------------------------------- */}
        {isFeatchModalOpen && <LeadFeatchModal onClose={closeModal} />}
        {/* containerbar*/}
        <div className="flex flex-wrap items-center justify-between gap-3 px-3 py-2 bg-white rounded-lg">
          {/* PART-I */}
          {/* container- Alleads, search */}
          <div className="flex flex-wrap items-start justify-between gap-3">
            {/* PART-I */}
            {/* All Lead  DropDown*/}
            <div
              className="relative button_MaxWidth_first_layer_Container"
              onClick={toggleMenuAllLead}
              onMouseLeave={() => setAllLeaddropDown(false)}
            >
              <button
                className="flex items-center justify-between px-4 py-2 truncate border rounded-md button_MaxWidth_first_layer min-w-40 max-w-44"
                id="dropdownDefaultButton"
                type="button"
              >
                {leadStatus}
                <FaAngleDown className="ml-2 text-gray-900" />
              </button>
              {allLeaddropDown && (
                <div className="absolute z-10 bg-white border border-gray-300 rounded-md top-10">
                  <ul className="text-sm text-gray-700">
                    {allLeadData.map((item) => (
                      <li
                        key={item.id}
                        className="block w-56 px-4 py-2 border-b cursor-pointer hover:bg-cyan-500 hover:text-white"
                        onClick={() => handleLeadStatusSelection(item.status)} // Correct selection logic
                      >
                        {item.status}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            {/* ---------------------------------- Managed BY Filter ----------------------------------------------*/}
            <ManagedByFilter
              assignedTo={assignedTo} // Sending Value
              setAssignedTo={setAssignedTo} // Pass function to update state in FollowUp
              setFilteredData={setFilteredData} // Pass function to update filtered data
              filteredData={filteredData}
            />
            {/*--------------------------------------- Search Box -------------------------------------------------------*/}
            <SearchElement
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />

            {/*------------------------------------- Fetch Box ----------------------------------------------------------*/}
            {fetchLead || businessRole === "Admin" ? (
              <div className="flex gap-1 button_MaxWidth_first_layer_Container">
                <button
                  className="flex items-center justify-center gap-2 px-4 py-2 text-white bg-blue-600 border rounded-lg button_MaxWidth_first_layer"
                  onClick={() => setIsFetchModalOpen(true)}
                >
                  Fetch Leads
                </button>
              </div>
            ) : (
              ""
            )}
          </div>
          <div className="flex flex-wrap items-center gap-3 button_MaxWidth_Main_Container">
            {/* PART-II */}
            {/*--------------------------------------------------- Stripe-BarDropDown -------------------------------------*/}
            {activeButtonId === 2 || activeButtonId === 4 ? (
              ""
            ) : (
              <>
                {/*  ------------------------------------------------- Stripe-BarDropDown --------------------------------- */}
                <UseGridFilter
                  selectedViewValue={selectedViewValue} // Sending selected value
                  setSelectedViewValue={setSelectedViewValue} // Setting selected value
                />
              </>
            )}
            {/* PART-II */}
            {/*------------------------------------------------------  Create Lead ------------------------------------------*/}
            {createLead || businessRole === "Admin" ? (
              <div className="flex button_MaxWidth_Container">
                <Link href={`/panel/${BusinessType}/leads/create_lead`} className="button_MaxWidth">
                  <button
                    className="flex items-center justify-center gap-2 px-4 py-2 text-white bg-blue-600 border rounded-lg button_MaxWidth"
                    id="dropdownDefaultButton"
                    type="button"
                  >
                    Create Lead
                  </button>
                </Link>
              </div>
            ) : (
              ""
            )}
            {/*-------------------------------------- ACTIONS DROPDWON --------------------------------------------- */}
            <UseAction
              originalData={originalData} // Sending Original Data
              getApiData={getApiData} // Execute API Data Function
              screenName="Leads" // Sending Screen Name
              selectedRowsId={selectedRowsId} // Sending Selected Rows IDs
              selectedRowEmails={selectedRowEmails} // Sending Selected Rows E-Mail's
              actions={actions} // Sending Actions Dropdown List
            />
          </div>
        </div>
        {/* 2nd bar Leads and lenghtLeads*/}
        <div className="flex flex-wrap items-center justify-between gap-3 mt-3 leads_Button_Main_Container">
          <div className="flex items-center justify-start gap-3 leads_Button_Main_Container">
            <h1 className="text-3xl font-medium">Leads</h1>
            <h1 className="px-2 py-2 text-center text-white bg-blue-600 rounded-md shadow-md text-md min-w-10">
              {filteredData?.length}
            </h1>

            {/*---------------------------------------------------- BUTTONS -------------------------------------------------*/}
            <div className="flex gap-2 leads_Button_Container">
              {dynamicButtons.map(({ id, name }) =>
                permissions.includes(name) ||
                name === viewName ||
                businessRole === "Admin" ? (
                  <button
                    key={id}
                    onClick={() => handleDynamicButtonsClick(id)}
                    className={`text-md leads_Button whitespace-nowrap rounded px-2 py-1.5 font-light ${
                      activeButtonId === id
                        ? "bg-cyan-500 text-white"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {name}
                  </button>
                ) : null,
              )}
            </div>
          </div>

          {activeButtonId === 1 ? (
            <>
              {/* ------------------- Filter by date ----------------- */}
              <UseDateFilter
                onReset={handleResetFilter} //Reset Button Function
                originalData={originalData} // Sending Original Data
                setFilteredData={setFilteredData} // Set Filter Data
                filteredData={filteredData} //Sending Filter Data
              />
            </>
          ) : (
            ""
          )}
        </div>
        {activeButtonId === 3 && (
          <div
            className="relative my-1"
            onClick={toggleDropdownSelectOperation}
            onMouseLeave={() => setSelectOperationDropdown(false)}
          >
            <button
              className="flex items-center justify-between gap-2 px-4 py-2 mt-2 text-gray-600 bg-white border rounded-lg"
              id="dropdownDefaultButton"
              type="button"
            >
              Select Lead Operation Type
              <FaAngleDown className="text-gray-900" />
            </button>
            {selectOperationDropdown && (
              <div className="absolute z-10 w-64 bg-white border border-gray-300 rounded-md top-13">
                <ul className="text-sm text-gray-700 rounded-md">
                  {leadOperations.map(({ key, value }) => (
                    <li
                      key={key}
                      onClick={() => handleSelect(value)}
                      className="block px-4 py-2 border-b cursor-pointer hover:bg-cyan-500 hover:text-white"
                    >
                      {value}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
        {/*-------Table-------*/}
        {viewLeads || businessRole === "Admin" ? (
          <div className="mt-3 overflow-x-auto leads_Table_Main_Container">
            <div className="min-w-full rounded-md leads_Table_Container">
              {selectedViewValue === "Table View" && activeButtonId === 1 && (
                <Paper sx={{ width: "100%" }}>
                  <DataGrid
                    rows={currentData} // Row Data
                    columns={columns} // Headings
                    pagination={false}
                    checkboxSelection
                    onRowSelectionModelChange={(newSelection) =>
                      handleSelectionChange(newSelection)
                    }
                    sx={{
                      border: 0,
                      width: "100%",
                      "& .MuiDataGrid-columnHeaderTitle": {
                        fontWeight: "bold",
                      },
                      "& .MuiDataGrid-footerContainer": {
                        display: "none",
                      },
                    }}
                  />
                </Paper>
              )}

              {/* ------------GRID------------ */}
              {selectedViewValue === "Grid View" && (
                <>
                  <div className="min-w-full">
                    {/* ------------Parent------------ */}
                    <div className="grid grid-cols-2 gap-3 text-sm sm:grid-cols-3">
                      {/*---------Card starts Here */}
                      {currentData.map((item) => (
                        // {/* ------------sub-Parent->Container ------------ */}
                        <div
                          className="grid grid-cols-1 gap-1 p-2 rounded-lg shadow-md bg-sky-100"
                          key={item.id}
                        >
                          <div className="">
                            <div className="flex items-center py-2 text-center bg-white border-2 rounded border-cyan-500">
                              <div className="flex items-center justify-center gap-2 mx-auto">
                                <FaUserTie />
                                <span className="">
                                  {item?.name[0]?.toUpperCase() +
                                    item?.name?.substr(1)}
                                </span>
                              </div>
                              <AiOutlineEdit
                                className="p-1 mr-3 text-white rounded-full bg-cyan-400 hover:bg-cyan-500"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  router.push(`/panel/${BusinessType}/leads/edit_lead/${item.id}`);
                                }}
                                size={25}
                              />
                            </div>
                          </div>

                          <div className="py-2 bg-white border-2 rounded border-cyan-500">
                            <div className="flex items-center justify-between px-3 py-1">
                              <div className="flex items-center justify-between py-1">
                                <IoIosMail size={22} className="w-6" />
                                <span className="hidden sm:block">Email</span>
                              </div>
                              <div className="text-sm font-medium truncate">
                                <a
                                  href={`mailto:${item.email}`}
                                  onClick={(event) => event.stopPropagation()}
                                >
                                  {item.email}
                                </a>
                              </div>
                            </div>

                            <div className="flex items-center justify-between px-3 py-1">
                              <div className="flex items-center justify-between py-1">
                                <FaPhoneAlt size={14} className="w-6" />
                                <span className="hidden sm:block">Phone</span>
                              </div>
                              <div className="text-sm font-medium truncate">
                                <a
                                  href={`tel:${item.mobileNo}`}
                                  onClick={(event) => event.stopPropagation()}
                                >
                                  {item?.mobileNo}
                                </a>
                              </div>
                            </div>

                            <div className="flex items-center justify-between px-3 py-1">
                              <div className="flex items-center justify-between py-1">
                                <PiLineSegmentsBold size={16} className="w-6" />
                                <span className="hidden sm:block">
                                  Segments
                                </span>
                              </div>
                              <div className="text-sm font-medium truncate">
                                {item?.segments?.length
                                  ? item.segments?.join(", ")
                                  : ""}
                              </div>
                            </div>

                            <div className="flex items-center justify-between px-3 py-1">
                              <div className="flex items-center justify-between py-1">
                                <RiShieldUserLine size={18} className="w-6" />
                                <span className="hidden sm:block">
                                  Managed By
                                </span>
                              </div>
                              <div className="text-sm font-medium">
                                {item?.assigned_To}
                              </div>
                            </div>

                            <div className="flex items-center justify-between px-3 py-1">
                              <div className="flex items-center justify-between py-1">
                                <BsHourglassSplit size={18} className="w-6" />
                                <span className="hidden sm:block">Status</span>
                              </div>
                              <div className="text-sm font-medium">
                                {item?.leadesStatus}
                              </div>
                            </div>

                            <div className="flex items-center justify-between px-3 py-1">
                              <div className="flex items-center justify-between py-1">
                                <BiCalendar size={18} className="w-6" />
                                <span className="hidden sm:block">
                                  Trail Start Date
                                </span>
                              </div>
                              <div className="text-sm font-medium">
                                {item?.trialStartDate?.split("T")[0]}
                              </div>
                            </div>

                            <div className="flex items-center justify-between px-3 py-1">
                              <div className="flex items-center justify-between py-1">
                                <BiCalendar size={18} className="w-6" />
                                <span className="hidden sm:block">
                                  Trail End Date
                                </span>
                              </div>
                              <div className="text-sm font-medium">
                                {item?.trialEndDate?.split("T")[0]}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/*--------------------------------- LEAD OPERATIONS TABLE ---------------------------------------*/}
            <div className="min-w-full overflow-hidden rounded-md">
              {/* MONITORING TABLE */}
              {selectedViewValue === "Table View" && activeButtonId === 2 && (
                <UploadLead />
              )}
            </div>

            {/*------------------------------------- LEAD ACTION TABLE --------------------------------------*/}
            <div className="min-w-full overflow-hidden rounded-md">
              {/* LEAD ACTION TABLE */}
              {selectedViewValue === "Table View" && activeButtonId === 3 && (
                <LeadOperations
                  currentData={currentData}
                  handleSelectionChange={handleSelectionChange}
                />
              )}
              {/* RENDERING UPLOAD LEADS PAGE */}
              {activeButtonId === 4 && <LeadAction currentData={currentData} />}
            </div>

            {/* --------------------------------------- Pagination ------------------------------------------ */}
            <Stack spacing={2} className="mt-4 mb-1">
              <Pagination
                count={Math.ceil(filteredData.length / itemsPerPage)}
                page={currentPage}
                onChange={handlePageChange}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  "& .MuiPaginationItem-root": {
                    fontSize: "1.2rem",
                  },
                  "& .MuiPaginationItem-root.Mui-selected": {
                    backgroundColor: "rgba(6, 182, 212, 1)",
                    color: "#fff",
                  },
                }}
              />
            </Stack>
          </div>
        ) : (
          ""
        )}
      </div>
    </>
  );
}
