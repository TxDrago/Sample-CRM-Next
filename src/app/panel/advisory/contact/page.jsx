"use client";

//react
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
import { VscSettings } from "react-icons/vsc";
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

//Objects Imported
import { tenant_base_url, protocal_url } from "@/Config/Config";

import { getHostnamePart } from "@/components/GlobalHostUrl";

import { SearchElement } from "@/components/SearchElement";

import ManagedByFilter from "@/Hooks/ManagedByFilter/ManagedByFilter";
import UseGridFilter from "@/Hooks/GridFilter/UseGridFilter";
import UseAction from "@/Hooks/Action/UseAction";
import UseDateFilter from "@/Hooks/DateFilter/UseDateFilter";

const name = getHostnamePart();

export default function Contact() {
 const router = useRouter(); // Add this line

  //DND
  const [users, setUsers] = useState([]);

  //------- Business Type --------
  const [business, setBusiness] = useState("");
  const businessType = localStorage.getItem("businessType");

   //--------------------------------------- Set Business Type --------------------------------------------
   const [BusinessType, setBusinessType] = useState("");
        
   useEffect(() => {
     const storedType = localStorage.getItem("businessType") || "";
     setBusinessType(storedType);
   }, []);

  //------------------------------------------------- All States----------------------------------------------------------
  const [selectedRowsId, setSelectedRowsId] = useState([]);
  const [selectedRowEmails, setSelectedRowEmails] = useState([]);
  //-------------------------------------------------- GET Data ----------------------------------------------------
  const [originalData, setOriginalData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const getApiData = async () => {
    const bearer_token = localStorage.getItem("token");
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${bearer_token}`,
        },
      };
      const response = await axios.get(
        `${protocal_url}${name}.${tenant_base_url}/Contact/contacts/byusertoken`,
        config,
      );
      if (response.status === 200) {
        const followup = response.data;
        setOriginalData(followup?.data);
        setFilteredData(followup?.data);
      }
    } catch (error) {
      console.log("error", error);
    }
  };
  useEffect(() => {
    getApiData();
  }, []);

  //----------------------------------------- Managing Color of Assigned To --------------------------------------------
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

  useEffect(() => {
    getAllUsers();
    //------- Business Type --------
    setBusiness(businessType);
  }, []);

  //---------------------------------------------------- Roles & Permissions ----------------------------------------------------

  const businessRole = localStorage.getItem("businessRole");
  const [edit, setEdit] = useState(false);
  const [createSO, setCreateSO] = useState(false);
  const [viewContact, setViewContact] = useState(false);

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
          (item) => item.moduleName === "Contacts",
        );

        if (serviceBoxPermissions) {
          const permissionsArray = serviceBoxPermissions.permissions.split(",");

          console.log("List : ", permissionsArray);

          //------------------------------------------------------ Set permissions ------------------------------------------------

          setEdit(permissionsArray.includes("Edit Contact"));
          setCreateSO(permissionsArray.includes("Create Sales order"));
          setViewContact(permissionsArray.includes("View Contacts"));
        }
      }
    } catch (error) {
      console.error("Error fetching leads:", error);
    }
  }

  useEffect(() => {
    handleGetPermission();
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

  //------------------------------------------------------ Table Heading And Table Data ------------------------------------------
  const columns = [
    {
      field: "name",
      headerName: "Client Name",
      minWidth: 150,
      flex: 1, 
      renderCell: (params) => (
        <span
          onClick={() =>
            edit || businessRole === "Admin" ? handleClick(params.row) : null
          }
          style={{
            cursor: edit || businessRole === "Admin" ? "pointer" : "default",
            color: "blue",
            fontWeight: 500,
          }}
        >
          {params.value}
        </span>
      ),
    },
    {
      field: "mobileNo",
      headerName: "Mobile",
      minWidth: 100,
      flex: 1, 
      renderCell: (params) => (
        <span
          onClick={(event) => handleNumberClick(event, params.row.mobileNo)}
          style={{
            cursor: "pointer",
            display: "flex",
            gap: "5px",
            alignItems: "center",
          }}
        >
          <MdCall className="text-red-600" /> {params.value}
        </span>
      ),
    },
    {
      field: "segments",
      headerName: "Segment",
      minWidth: 120,
      flex: 1, 
      renderCell: (params) => params.row.segments?.join(", ") || "",
    },
    {
      field: "trialStartDate",
      headerName: "Free Trial",
      minWidth: 100,
      flex: 1, 
      renderCell: (params) => params.value?.split("T")[0] || "",
    },
    {
      field: "call_bck_DateTime",
      headerName: "Follow Up",
      minWidth: 120,
      flex: 1, 
      renderCell: (params) =>
        params.value?.replace("T", " ")?.split(":").slice(0, 2).join(":") || "",
    },
    {
      field: "assigned_To",
      headerName: "Managed By",
      minWidth: 200,
      flex: 1, 
      display: "flex",
      alignItems: "center",
      renderCell: (params) => {
        const matchedUser =
          users?.length > 0
            ? users.find((user) => user?.userName === params.value)
            : null;
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
              height: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {params.value} - ({matchedUser?.role})
          </div>
        ) : (
          ""
        );
      },
    },

    ...(createSO || businessRole === "Admin"
      ? [
          {
            field: "createSO",
            headerName: "Action",
            renderHeader: () => <VscSettings size={20} />,
            width: 100,
            display: "flex",
            alignItems: "center",
            renderCell: (params) => (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  router.push(`/panel/${BusinessType}/contact/create_so/${params.row.id}`);
                }}
                className="flex h-7 items-center justify-center rounded bg-blue-600 px-3 py-1 text-white shadow-md hover:bg-blue-500"
              >
                {business === "brokerage" ? "Create Client" : "SO"}
              </button>
            ),
          },
        ]
      : []),
  ];
  //---------------------->---------------------->MANAGE_BY/ASSIGNED_TO<----------------------<ARVIND----------------------
  const roleColors = [
    "#2563eb", // blue
    "#65a30d", // LimeGreen
    "#7c3aed", // MediumPurple
    "#0369a1", //Sky
    "#e11d48", //Rose
  ];

  // Function to get the color for a role based on its index
  const getRoleColorByIndex = (index) => {
    return roleColors[index % roleColors?.length]; // Use modulo for wrapping
  };

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
  // -------------------------------------------- Navigate to Edit Screen ----------------------------------------
  const handleClick = (id) => {
    if (edit || businessRole === "Admin") {
      router.push(`/panel/${BusinessType}/followup/create_follow_up/${id}`);
    }
  };
  //-----------------------------------------------STRIPE BAR DROPDOWN--------------------------------------------------
  const [selectedViewValue, setSelectedViewValue] = useState("Table View");

  //----------------------------------------------- Status -------------------------------------------------------
  const [leadStatus, setLeadStatus] = useState("All Lead"); // Track the selected lead status

  // Function to handle both filters
  function handle_LeadStatus(statusValue) {
    let filteredLeads = originalData;

    // Filter by leadStatus if it's not 'ALL' or null
    if (statusValue !== null && statusValue !== "All Leads") {
      filteredLeads = filteredLeads.filter(
        (lead) => lead.leadesStatus === statusValue,
      );
      console.log(filteredLeads);
    }
    setFilteredData(filteredLeads); // Set the filtered results
  }

  // Handle selecting a lead status
  function handleLeadStatusSelection(status) {
    setLeadStatus(status); // Update leadStatus state
    handle_LeadStatus(status); // Apply both filters
  }

  //-----------------------------------------------> ALL-> LEADS <-functionality <-----------------------------------------------

  const [allLeaddropDown, setAllLeaddropDown] = useState(false);
  const toggleMenuAllLead = () => {
    setAllLeaddropDown(!allLeaddropDown);
  };

  //-----------------------------------------------> ALL LEADS DATA <-----------------------------------------------
  //----------------STATUS DROPDOWN----------------
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
      // Optionally, set an error state to display a user-friendly message
    }
  }

  useEffect(() => {
    handleLeadStatus();
  }, []);

  //----------------------------------------------------ACTION BAR DROPDOWN---------------------------------------------------------
  const actions = [
    { key: 1, value: "Mass Delete" },
    { key: 3, value: "Mass E-Mail" },
    { key: 6, value: "Export To Excel" },
    { key: 7, value: "Export To PDF" },
  ];

  // ------------------------------ Search Function ----------------------------------
  const [searchTerm, setSearchTerm] = useState(""); // State for search term
  useEffect(() => {
    const filtered = originalData.filter(
      (lead) =>
        lead.name?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
        lead.mobileNo?.includes(searchTerm),
    );
    setFilteredData(filtered);
  }, [searchTerm, originalData]);

  // ------------------------------------------------- Managed By State -----------------------------------------
  const [assignedTo, setAssignedTo] = useState("Managed By");
  //------------------------------------------------------Filter Reset Settings ---------------------------------------------
  const handleResetFilter = () => {
    setLeadStatus("All Lead");
    setAssignedTo("Managed By");
    setSearchTerm("");
  };

  return (
    //parent
    <div className="m-3 flex min-h-screen flex-col">
      {/* containerbar*/}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg bg-white px-3 py-2">
        {/* PART-I */}
        {/* container- Alleads, search */}
        <div className="contact_Dropdown_Main_Container flex flex-wrap items-center justify-start gap-3">
          {/* PART-I */}
          {/* All Lead DropDown*/}
          <div
            className="contact_Dropdown_Container relative whitespace-nowrap"
            onClick={toggleMenuAllLead}
            onMouseLeave={() => setAllLeaddropDown(false)}
          >
            <button
              className="contact_Dropdown_Button flex min-w-40 items-center justify-between truncate rounded-md border px-4 py-2"
              id="dropdownDefaultButton"
              type="button"
            >
              {leadStatus}
              <FaAngleDown className="ml-2 text-gray-900" />
            </button>
            {allLeaddropDown && (
              <div className="absolute top-10 z-10 rounded-md border border-gray-300 bg-white">
                <ul className="text-sm text-gray-700">
                  {allLeadData.map((item) => (
                    <li
                      key={item.id}
                      className="block w-56 cursor-pointer border-b px-4 py-2 hover:bg-cyan-500 hover:text-white"
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
        </div>
        <div className="action_Button_Main_Container flex items-center justify-start gap-3">
          {/*  ------------------------------------------------- Stripe-BarDropDown --------------------------------- */}
          <UseGridFilter
            selectedViewValue={selectedViewValue} // Sending selected value
            setSelectedViewValue={setSelectedViewValue} // Setting selected value
          />
          {/*-------------------------------------- ACTIONS DROPDWON --------------------------------------------- */}
          <UseAction
            originalData={originalData} // Sending Original Data
            getApiData={getApiData} // Execute API Data Function
            screenName="Contacts" // Sending Screen Name
            selectedRowsId={selectedRowsId} // Sending Selected Rows IDs
            selectedRowEmails={selectedRowEmails} // Sending Selected Rows E-Mail's
            actions={actions} // Sending Actions Dropdown List
          />
        </div>
      </div>
      {/* 2nd bar Leads and lenghtLeads*/} {/* 2nd bar Leads and lenghtLeads*/}
      <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-3">
          <h1 className="text-3xl font-medium">Contacts</h1>
          <h1 className="min-w-10 rounded bg-blue-600 p-2 text-center text-sm text-white shadow-md">
            {/*  ------------------------------------------------------------------------------------------------*/}
            {/* ------------------- Length ----------------- */}
            {filteredData?.length}
          </h1>
        </div>

        {/* ------------------- Filter by date ----------------- */}
        <UseDateFilter
          onReset={handleResetFilter} //Reset Button Function
          originalData={originalData} // Sending Original Data
          setFilteredData={setFilteredData} // Set Filter Data
          filteredData={filteredData} //Sending Filter Data
        />
      </div>
      {/*-------Table-------*/}
      {viewContact || businessRole === "Admin" ? (
        <div className="leads_Table_Main_Container mt-3 overflow-x-auto">
          <div className="leads_Table_Container min-w-full rounded-md shadow-lg">
            {selectedViewValue === "Table View" && (
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

            {/* -------------------------------------GRID----------------------------------------------------- */}
            {selectedViewValue === "Grid View" && (
              <>
                <div className="min-w-full">
                  {/* ------------Parent------------ */}
                  <div className="grid grid-cols-2 gap-3 text-sm sm:grid-cols-3">
                    {/*---------Card starts Here */}
                    {currentData.map((item) => (
                      // {/* ------------sub-Parent->Container ------------ */}
                      <div
                        className="grid grid-cols-1 gap-1 rounded-lg bg-sky-100 p-2 shadow-md"
                        key={item.id}
                      >
                        <div className="">
                          <div className="flex items-center rounded border-2 border-cyan-500 bg-white py-2 text-center">
                            <div className="mx-auto flex items-center justify-center gap-2">
                              <FaUserTie />
                              <span className="">
                                {item?.name[0].toUpperCase() +
                                  item?.name.substr(1)}
                              </span>
                            </div>
                            <AiOutlineEdit
                              className="mr-3 rounded-full bg-cyan-400 p-1 text-white hover:bg-cyan-500"
                              onClick={(e) => {
                                e.stopPropagation();
                                router.push(`/panel/${BusinessType}/contact/edit_contact/${item.id}`);
                              }}
                              size={25}
                            />
                          </div>
                        </div>

                        <div className="rounded border-2 border-cyan-500 bg-white py-2">
                          <div className="flex items-center justify-between px-3 py-1">
                            <div className="flex items-center justify-between py-1">
                              <IoIosMail size={22} className="w-6" />
                              <span className="hidden sm:block">Email</span>
                            </div>
                            <div className="truncate text-sm font-medium">
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
                            <div className="truncate text-sm font-medium">
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
                              <span className="hidden sm:block">Segments</span>
                            </div>
                            <div className="truncate text-sm font-medium">
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
          {/* --------------------------------------- Pagination ------------------------------------------ */}
          <Stack spacing={2} className="mb-1 mt-4">
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
  );
}
