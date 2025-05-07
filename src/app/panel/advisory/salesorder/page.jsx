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
import { getHostnamePart } from "@/components/GlobalHostUrl";
import { SearchElement } from "@/components/SearchElement";
import UseDateFilter from "@/Hooks/DateFilter/UseDateFilter";

//-----------------------------ToastContainer-----------------------------
import { ToastContainer } from "react-toastify";
import UseFilterBySegment from "@/Hooks/FilterBySegment/UseFilterBySegment";
import UseGridFilter from "@/Hooks/GridFilter/UseGridFilter";
import UseAction from "@/Hooks/Action/UseAction";

export default function SalesOrder() {
 const router = useRouter();
  const bearer_token = localStorage.getItem("token");
  const name = getHostnamePart();
     //--------------------------------------- Set Business Type --------------------------------------------
                           const [BusinessType, setBusinessType] = useState("");
                            
                           useEffect(() => {
                             const storedType = localStorage.getItem("businessType") || "";
                             setBusinessType(storedType);
                           }, []);
  //This is to store the upcoming data from API
  //------------------------------------------------- All States----------------------------------------------------------
  const [selectedRowsId, setSelectedRowsId] = useState([]);
  const [selectedRowEmails, setSelectedRowEmails] = useState([]);
   

  //-------------------------------------------------- GET Data ----------------------------------------------------
  const [originalData, setOriginalData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const getApiData = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${bearer_token}`,
        },
      };
      const response = await axios.get(
        `${protocal_url}${name}.${tenant_base_url}/SalesOrder/salesOrder/byusertoken`,
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
      field: "clientName",
      headerName: "Client Name",
      minWidth: 120,
      flex: 1,
      renderCell: (params) => (
        <span
          onClick={() => handleClick(params.row.id)}
          style={{ cursor: "pointer", color: "blue", fontWeight: 500 }}
        >
          {params.value}
        </span>
      ),
    },
    { field: "email", headerName: "Email", minWidth: 160, flex: 1 },
    {
      field: "mobileNo",
      headerName: "Phone No",
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
      field: "subscription_start_date",
      headerName: "Start Date",
      minWidth: 100,
      flex: 1,
      renderCell: (params) => params.value?.replace("T", " ") || "",
    },
    {
      field: "subscription_end_date",
      headerName: "End Date",
      minWidth: 100,
      flex: 1,
      renderCell: (params) => params.value?.replace("T", " ") || "",
    },
    {
      field: "segments",
      headerName: "Segments",
      minWidth: 120,
      flex: 1,
      renderCell: (params) =>
        params.value?.filter((segment) => segment.length > 1).join(", ") || "-",
    },
    { field: "assigned_To", headerName: "Managed By", minWidth: 100, flex: 1 },
    {
      field: "status",
      headerName: "Status",
      minWidth: 100,
      flex: 1,
      renderCell: (params) => (
        <button
          onClick={
            approve || businessRole === "Admin"
              ? () => handlePendingStatus(params.row.id, params.row.status)
              : undefined
          }
          className="w-[80%] h-7"
        >
          {params.value ? (
            <div className="rounded-full border bg-green-300 text-white px-2 py-[2px] h-full flex items-center justify-center text-xs hover:bg-green-500">
              Approved
            </div>
          ) : (
            <div className="rounded-full border bg-red-300 text-white px-2 py-[2px] h-full flex items-center justify-center text-xs hover:bg-red-500">
              Pending
            </div>
          )}
        </button>
      ),
    },
  ];
  
  // -------------------------------------------- Navigate to Edit Screen ----------------------------------------
  const handleNumberClick = (event, mobileNo) => {
    event.stopPropagation();
    window.location.href = `tel:${mobileNo}`;
  };
  // -------------------------------------------- Navigate to Edit Screen ----------------------------------------
  const handleClick = (id) => {
    if (edit || businessRole === "Admin") {
      router.push(`/panel/${BusinessType}/salesorder/client_so/${id}`);
    }
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
  //-----------------------------------------------STRIPE BAR DROPDOWN--------------------------------------------------
  const [selectedViewValue, setSelectedViewValue] = useState("Table View");

  //------------------------------------------------------- STATUS BAR DROPDOWN -----------------------------------------------
  const status = [
    { key: 0, value: "All Sales Order" },
    { key: 1, value: "Pending Records" },
    { key: 2, value: "Approved Records" },
  ];

  const [salesOrderStatus, setsalesOrderStatus] = useState(status[0].value); // Track the selected lead status
  const [
    isDropdownVisible_salesOrderStatus,
    setisDropdownVisible_salesOrderStatus,
  ] = useState(false);

  const toggleDropdown_salesOrderStatus = () => {
    setisDropdownVisible_salesOrderStatus(!isDropdownVisible_salesOrderStatus);
  };

  const handleStatus = (value) => {
    setsalesOrderStatus(value);
    console.log(salesOrderStatus);
    setisDropdownVisible_salesOrderStatus(false);
    let filteredLeads = filteredData;

    if (value === "Pending Records") {
      filteredLeads = filteredLeads.filter((item) => item.status === false);
    } else if (value === "Approved Records") {
      filteredLeads = filteredLeads.filter((item) => item.status === true);
    }

    // If "All Sales Order" is selected, show all leads
    if (value === "All Sales Order") {
      filteredLeads = originalData;
    }

    setFilteredData(filteredLeads);
    console.log(filteredLeads); // For debugging
  };

  //------------------------------------------------------------ ACTION BAR DROPDOWN --------------------------------------------------
  const actions = [
    { key: 1, value: "Mass Delete" },
    { key: 3, value: "Mass E-Mail" },
    { key: 4, value: "Export To Excel" },
    { key: 5, value: "Export To PDF" },
    // { key: 6, value: "Send SMS" },
  ];

  // -------------------------------------------------------- Status API ---------------------------------------------------------

  const handlePendingStatus = async (id, status) => {
    const bearer_token = localStorage.getItem("token");
    if (status === true) {
      alert("This order is already approved.");
      return;
    }
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${bearer_token}`,
        },
      };
      // API call to approve the order
      const response = await axios.put(
        `${protocal_url}${name}.${tenant_base_url}/SalesOrder/salesOrder/approve/${id}`,
        {},
        config,
      );
      console.log(response);
      alert("Order has been approved successfully!");
      getApiData();
    } catch (error) {
      console.log(error);
      alert("There was an error approving the order.");
    }
  };

  // ------------------------------ Search Function ----------------------------------
  const [searchTerm, setSearchTerm] = useState(""); // State for search term
  useEffect(() => {
    const filtered = originalData.filter(
      (lead) =>
        lead.clientName?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
        lead.mobileNo?.includes(searchTerm),
    );
    setFilteredData(filtered);
  }, [searchTerm, originalData]);

  // ------------------------------------------------- FOLLOW UP By State  --------------------------------------
  const [followUpBy, setFollowUpBy] = useState("Segment By");

  //------------------------------------------------------Filter Reset Settings ---------------------------------------------
  const handleResetFilter = () => {
    setFollowUpBy("Segment By");
    setsalesOrderStatus("All Sales Order");
    setSearchTerm("");
  };
  //---------------------------------------------------- Roles & Permissions ----------------------------------------------------

  const businessRole = localStorage.getItem("businessRole");
  const [edit, setEdit] = useState(false);
  const [approve, setApprove] = useState(false);
  const [viewSO, setViewSO] = useState(false);

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
          (item) => item.moduleName === "Sales Order",
        );

        if (serviceBoxPermissions) {
          const permissionsArray = serviceBoxPermissions.permissions.split(",");

          console.log("List : ", permissionsArray);

          //------------------------------------------------------ Set permissions ------------------------------------------------

          setEdit(permissionsArray.includes("Edit Sales Order"));
          setApprove(permissionsArray.includes("Approve Pending"));
          setViewSO(permissionsArray.includes("View Sales Order"));
        }
      }
    } catch (error) {
      console.error("Error fetching leads:", error);
    }
  }

  useEffect(() => {
    handleGetPermission();
  }, []);

  return (
    //parent
    <div className="flex flex-col min-h-screen m-3">
      <ToastContainer />

      {/* containerbar*/}
      <div className="flex flex-wrap items-center justify-between gap-3 px-3 py-2 bg-white rounded-lg">
        {/* PART-I */}
        {/* container- Alleads, search */}
        <div className="flex flex-wrap items-center justify-start gap-3 contact_Dropdown_Main_Container">
          {/* PART-I */}

          {/*-------------------------------------- ALL FOLLOW UPS DROPDOWN --------------------------------- */}
          <UseFilterBySegment
                      followUpBy={followUpBy} // Sending Value
                      setFollowUpBy={setFollowUpBy} // Pass function to update state in FollowUp
                      setFilteredData={setFilteredData} // Pass function to update filtered data
                      filteredData={filteredData}
                    />
          {/*--------------------------------- All Sales Order  DropDown ----------------------------------------*/}

          <div
            className="relative sales_Oreder_Dropdown_Container whitespace-nowrap"
            onClick={toggleDropdown_salesOrderStatus}
            onMouseLeave={() => setisDropdownVisible_salesOrderStatus(false)}
          >
            <button
              className="flex items-center justify-between px-4 py-2 truncate border rounded-md contact_Dropdown_Button min-w-40"
              id="dropdownDefaultButton"
              type="button"
            >
              {salesOrderStatus}
              <FaAngleDown className="ml-2 text-gray-900" />
            </button>
            {isDropdownVisible_salesOrderStatus && (
              <div className="absolute z-10 bg-white border border-gray-300 rounded-md top-10">
                <ul className="py-2 text-sm text-gray-700">
                  {status.map((item, index) => (
                    <li
                      key={index}
                      className="block w-56 px-4 py-2 border-b cursor-pointer hover:bg-cyan-500 hover:text-white"
                      onClick={() => handleStatus(item.value)} // Correct selection logic
                    >
                      {item.value}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* PART-I */}
          {/*----------------------------------------- Search Box ---------------------------------------------*/}
          <SearchElement
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center justify-start gap-3 action_Button_Main_Container">
          {/*  ------------------------------------------------- Stripe-BarDropDown --------------------------------- */}
          <UseGridFilter
            selectedViewValue={selectedViewValue} // Sending selected value
            setSelectedViewValue={setSelectedViewValue} // Setting selected value
          />
          {/*-------------------------------------- ACTIONS DROPDWON --------------------------------------------- */}
          <UseAction
            originalData={originalData} // Sending Original Data
            getApiData={getApiData} // Execute API Data Function
            screenName="Sales Order" // Sending Screen Name
            selectedRowsId={selectedRowsId} // Sending Selected Rows IDs
            selectedRowEmails={selectedRowEmails} // Sending Selected Rows E-Mail's
            actions={actions} // Sending Actions Dropdown List
          />
        </div>
      </div>
      {/* 2nd bar Leads and lenghtLeads*/}
      <div className="flex flex-wrap items-center justify-between gap-3 mt-3">
        <div className="flex gap-3">
          <h1 className="text-3xl font-medium">Sales Order</h1>
          <h1 className="p-2 text-sm text-center text-white bg-blue-600 rounded shadow-md min-w-10">
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
      {viewSO || businessRole === "Admin" ? (<>
      <div className="mt-3 overflow-x-auto leads_Table_Main_Container">
        <div className="min-w-full rounded-md leads_Table_Container">
          
            {/*---------------------------------------TABLE HEAD START---------------------------------------- */}
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
                          <div className="ml-1">
                            <div>
                              <button
                                onClick={
                                  approve || businessRole === "Admin"
                                    ? () =>
                                        handlePendingStatus(
                                          item.id,
                                          item.status,
                                        )
                                    : undefined
                                }
                                className="w-[90%]"
                              >
                                {item.status === true ? (
                                  <div className="py-1 pl-2 pr-4 text-xs font-medium text-center text-white border rounded shadow-sm bg-emerald-400 shadow-emerald-400 hover:bg-emerald-500">
                                    Approved
                                  </div>
                                ) : (
                                  <div className="w-full py-1 pl-2 pr-4 text-xs font-medium text-center text-white bg-red-400 border rounded shadow-sm shadow-red-400 hover:bg-red-500">
                                    Pending
                                  </div>
                                )}
                              </button>
                            </div>
                          </div>
                          <div className="flex items-center justify-center gap-2 mx-auto">
                            <FaUserTie />
                            <span className="">
                              {item?.clientName[0].toUpperCase() +
                                item?.clientName?.substr(1)}
                            </span>
                          </div>
                          <AiOutlineEdit
                            className="p-1 mr-3 text-white rounded-full shadow shadow-blue-500 bg-cyan-400 hover:bg-cyan-500"
                            onClick={(e) => {
                              e.stopPropagation();
                              router.push(`/panel/${BusinessType}/salesorder/client_so/${item.id}`);
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
                            <span className="hidden sm:block">Segments</span>
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
                            <span className="hidden sm:block">Managed By</span>
                          </div>
                          <div className="text-sm font-medium">
                            {item?.assigned_To}
                          </div>
                        </div>

                        <div className="flex items-center justify-between px-3 py-1">
                          <div className="flex items-center justify-between py-1">
                            <BsHourglassSplit size={18} className="w-6" />
                            <span className="hidden sm:block">Source</span>
                          </div>
                          <div className="text-sm font-medium">
                            {item?.leadSource}
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
                            {item?.subscription_start_date?.split("T")[0]}
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
                            {item?.subscription_end_date?.split("T")[0]}
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
      </>):""}
    </div>
  );
}
