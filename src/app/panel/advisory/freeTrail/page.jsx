"use client";

//react
import { useRouter } from "next/navigation";

import { useState, useEffect } from "react";
//external Packages
import axios from "axios";
//React Icons
import { FaPhoneAlt } from "react-icons/fa";
import { IoIosMail } from "react-icons/io";
import { MdCall } from "react-icons/md";
//grid->
import { BiCalendar } from "react-icons/bi";
import { RiShieldUserLine } from "react-icons/ri";
import { FaUserTie } from "react-icons/fa";
import { PiLineSegmentsBold } from "react-icons/pi";
import { AiOutlineEdit } from "react-icons/ai";
import { BsHourglassSplit } from "react-icons/bs";
//Folder Imported
import { DataGrid } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import { tenant_base_url, protocal_url } from "@/Config/Config";
import { getHostnamePart } from "@/components/GlobalHostUrl";
import { SearchElement } from "@/components/SearchElement";
import ManagedByFilter from "@/Hooks/ManagedByFilter/ManagedByFilter";
import UseAction from "@/Hooks/Action/UseAction";
import UseDateFilter from "@/Hooks/DateFilter/UseDateFilter";
import UseGridFilter from "@/Hooks/GridFilter/UseGridFilter";
import UseFilterBySegment from "@/Hooks/FilterBySegment/UseFilterBySegment";

export default function FreeTrail() {
 const router = useRouter();
  const bearer_token = localStorage.getItem("token");
  const name = getHostnamePart();
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
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${bearer_token}`,
        },
      };
      const response = await axios.get(
        `${protocal_url}${name}.${tenant_base_url}/Trail/alltrail/byusertoken`,
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
      field: "name",
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
    { field: "email", headerName: "Email", minWidth: 150, flex: 1 },
    {
      field: "assigned_To",
      headerName: "Managed By",
      minWidth: 100,
      flex: 1,
    },
    {
      field: "segments",
      headerName: "Segment",
      minWidth: 100,
      flex: 1,
      renderCell: (params) => params.row.segments?.join(", ") || "N/A",
    },
    {
      field: "trialStartDate",
      headerName: "Trial Start Date",
      minWidth: 120,
      flex: 1,
      renderCell: (params) =>
        params.value ? params.value.replace("T", " ").split(":").slice(0, 2).join(":") : "N/A",
    },
    {
      field: "trialEndDate",
      headerName: "Trial End Date",
      minWidth: 120,
      flex: 1,
      renderCell: (params) =>
        params.value ? params.value.replace("T", " ").split(":").slice(0, 2).join(":") : "N/A",
    },
  ];
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
      router.push(`/panel/${BusinessType}/freeTrail/create_free_trail/${id}`);
    }
  };
  //-----------------------------------------------STRIPE BAR DROPDOWN--------------------------------------------------
  const [selectedViewValue, setSelectedViewValue] = useState("Table View");
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
  // ------------------------------------------------- FOLLOW UP By State  --------------------------------------
  const [followUpBy, setFollowUpBy] = useState("Segment By");
  // ------------------------------------------------- Managed By State -----------------------------------------
  const [assignedTo, setAssignedTo] = useState("Managed By");
  //------------------------------------------------------Filter Reset Settings ---------------------------------------------
  const handleResetFilter = () => {
    setAssignedTo("Managed By");
    setFollowUpBy("Segment By");
    setSearchTerm("");
  };

 //---------------------------------------------------- Roles & Permissions ----------------------------------------------------

 const businessRole = localStorage.getItem("businessRole");
 const [edit, setEdit] = useState(false);
 const [viewFreeTrail, setViewFreeTrail] = useState(false);

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
         (item) => item.moduleName === "Free Trail",
       );

       if (serviceBoxPermissions) {
         const permissionsArray = serviceBoxPermissions.permissions.split(",");

         console.log("List : ", permissionsArray);

         //------------------------------------------------------ Set permissions ------------------------------------------------

         setEdit(permissionsArray.includes("Edit Free Trail"));
         setViewFreeTrail(permissionsArray.includes("View Free Trail"));
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
    <>
      {/* -------- PARENT -------- */}
      <div className="m-3 flex min-h-screen flex-col">
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg bg-white px-3 py-2">
          {/* container- FollowUp, search */}
          <div className="contact_Dropdown_Main_Container flex flex-wrap items-center justify-start gap-3">
            {/*-------------------------------------- ALL FOLLOW UPS DROPDOWN --------------------------------- */}
            <UseFilterBySegment
              followUpBy={followUpBy} // Sending Value
              setFollowUpBy={setFollowUpBy} // Pass function to update state in FollowUp
              setFilteredData={setFilteredData} // Pass function to update filtered data
              filteredData={filteredData}
            />

            {/* ---------------------------------- Managed BY Filter ----------------------------------------------*/}
          <ManagedByFilter
                        assignedTo={assignedTo} // Sending Value
                        setAssignedTo={setAssignedTo} // Pass function to update state in FollowUp
                        setFilteredData={setFilteredData} // Pass function to update filtered data
                        filteredData={filteredData}
                      />
            {/* ---------------------------------------- SEARCH DROPDOWN ------------------------------------------- */}
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
              screenName="Free Trail" // Sending Screen Name
              selectedRowsId={selectedRowsId} // Sending Selected Rows IDs
              selectedRowEmails={selectedRowEmails} // Sending Selected Rows E-Mail's
              actions={actions} // Sending Actions Dropdown List
            />
            {/* END ACTIONS DROPDWON */}
          </div>
        </div>
        {/* MIDDLE SECTION */}
        <div className="my-1 flex flex-wrap items-center justify-between gap-3 py-2">
          <div className="flex items-center justify-center gap-3">
            <h1 className="text-3xl font-medium">Free Trail</h1>
            <h1 className="min-w-10 rounded-md bg-blue-600 p-2 text-center text-sm text-white shadow-md">
              {filteredData.length}
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
        {/* TABLE VIEW */}
        {viewFreeTrail || businessRole === "Admin" ? (<>
        <div className="leads_Table_Main_Container overflow-x-auto">
          <div className="leads_Table_Container min-w-full rounded-md">
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
          </div>
          {/*---------------------------------------- Grid View ---------------------------------------------*/}
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
                  <div>
                    <div className="flex items-center py-2 text-center bg-white border-2 rounded border-cyan-500">
                      <div className="flex items-center justify-center gap-2 mx-auto">
                        <FaUserTie />
                        <span className="">
                          {item?.name[0].toUpperCase() + item?.name.substr(1)}
                        </span>
                      </div>
                      <AiOutlineEdit
                        className="p-1 mr-3 text-white rounded-full bg-cyan-400 hover:bg-cyan-500"
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push(`/panel/${BusinessType}/freeTrail/create_free_trail/${item.id}`);
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
                        <span className="hidden sm:block">Trail End Date</span>
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
        </>):""}
      </div>
    </>
  );
}
