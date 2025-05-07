"use client";

// REACT - IN BUILD
import { useState, useEffect } from "react";
import { usePathname } from 'next/navigation';
import EmployeeReport from "./RepoComponents/EmployeeReport";
import LeadsReport from "./RepoComponents/LeadsReport";
import ClientReports from "./RepoComponents/ClientReports";
import SalesReports from "./RepoComponents/SalesReports";
import Monitoring from "./RepoComponents/Monitoring";

//Folder Imported
import { getHostnamePart } from "@/components/GlobalHostUrl";
import { tenant_base_url, protocal_url } from "@/Config/Config";
//external Packages
import axios from "axios";
import DisposeLeads from "./RepoComponents/DisposeLeads";
// import { parseISO, subMonths, isAfter } from 'date-fns';

const name = getHostnamePart();

export default function Reports() {
  const location = usePathname();
  const [getReports, setGetReports] = useState([]);

  //------------------------------------------------------------------------------------------------
  //----------------GET ----------------
  async function handleGetReport(reportId = selectedId) {
    const bearer_token = localStorage.getItem("token");

    const urls = {
      1: "/Report/performance/report/byusertoken",
      2: "/Lead/leads/byusertoken",
      3: "/SalesOrder/salesOrder/clientbyusertoken",
      4: "/Report/performance/report/byusertoken",
      6: "/Report/callingreports/byusertoken",
    };

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${bearer_token}`,
        },
      };

      const endpoint = urls[reportId];

      if (!endpoint) {
        throw new Error("Invalid report selection.");
      }

      const response = await axios.get(
        `${protocal_url}${name}.${tenant_base_url}${endpoint}`,
        config,
      );

      const data = response.data.data;
      setGetReports(data);
      console.log(getReports);
    } catch (error) {
      console.error("Error fetching reports:", error);
      // Optionally, set an error state to display a user-friendly message
    }
  }

  useEffect(() => {
    handleGetReport(); // Initial call on component mount
  }, []);

  //---------------------->---------------------->PAGINATION->FILTERLEADS/ <----------------------<----------------------
  const currentReports = getReports;

  //----------------STRIPE BAR DROPDOWN----------------

  //   DYNAMIC BUTTONS
  const dynamicButtons = [
    { id: 1, name: "Employee Report" },
    { id: 2, name: "Lead Report" },
    { id: 3, name: "Client Report" },
    { id: 4, name: "Sales Report" },
    { id: 5, name: "Dispose Leads" },
    { id: 6, name: "Monitoring" },
  ];

  const [selectedId, setSelectedId] = useState(
    () => parseInt(localStorage.getItem("selectedId")) || 1,
  );

  // Function to handle option click using bracket notation
  const handleOptionClick = (id) => {
    setSelectedId(id);

    // Immediately use the `id` instead of `selectedId` which will be stale
    handleGetReport(id);

    // Store the selected id in localStorage
    localStorage.setItem("selectedId", id);
  };

  useEffect(() => {
    return () => {
      // This will run when the component unmounts
      localStorage.removeItem("selectedId");
    };
  }, [location]);

  // ---------------------BUTTON THAT ARE VISIBLE IN SALES REPORTS ------------------------------------
  const buttons = [
    { id: 1, name: "Source Wise" },
    { id: 2, name: "Employee Wise" },
  ];

  const [buttonId, setButtonId] = useState(1);

  const handleButtonClick = (id) => {
    setButtonId(id);
  };

  //---------------------------------------------------- Roles & Permissions ----------------------------------------------------

  const businessRole = localStorage.getItem("businessRole");
  const [permissions, setPermissions] = useState([]);
  const [employee, setEmployee] = useState(false);
  const [lead, setLead] = useState(false);
  const [client, setClient] = useState(false);
  const [sales, setSales] = useState(false);
  const [dispose, setDispose] = useState(false);
  const [monitoring, setMonitoring] = useState(false);

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
          (item) => item.moduleName === "Reports",
        );

        if (serviceBoxPermissions) {
          const permissionsArray = serviceBoxPermissions.permissions.split(",");
          setPermissions(permissionsArray);
          //------------------------------------------------------ Set permissions ------------------------------------------------

          setEmployee(permissionsArray.includes("Employee Report"));
          setLead(permissionsArray.includes("Lead Report"));
          setClient(permissionsArray.includes("Client Report"));
          setSales(permissionsArray.includes("Sales Report"));
          setDispose(permissionsArray.includes("Dispose Leads"));
          setMonitoring(permissionsArray.includes("Monitoring"));
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
    <div className="m-3 flex min-h-screen flex-col">
      <div className="flex items-center justify-between gap-3 rounded-md bg-white px-3 py-2">
        <div className="reports_Buttons_Main_Container flex gap-3">
          {dynamicButtons.map(({ id, name }) => (
            <>
              {permissions.includes(name) || businessRole === "Admin" ? (
                <button
                  key={id}
                  onClick={() => handleOptionClick(id)}
                  className={`text-md reports_Buttons_Container rounded px-3 py-1.5 font-light ${
                    selectedId === id
                      ? "bg-cyan-500 text-white"
                      : "bg-gray-100 text-gray-700"
                  } `}
                >
                  {name}
                </button>
              ) : (
                ""
              )}
            </>
          ))}
        </div>
      </div>

      {/* FILTER BY SECTION */}
      <div className="mb-3 mt-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-3">
          <h1 className="reports_Heading_Text text-3xl font-medium">
            {(() => {
              switch (selectedId) {
                case 1:
                  return "Employees Report";
                case 2:
                  return "Leads Report";
                case 3:
                  return "Clients Report";
                case 4:
                  return "Sales Report";
                case 5:
                  return "Dispose Lead";
                case 6:
                  return "Monitoring";
              }
            })()}
          </h1>
          <h1 className="text-md min-w-10 rounded-md bg-blue-600 px-2 py-2 text-center text-white shadow-md">
            {getReports.length}
          </h1>
        </div>

        {selectedId === 4 && (
          <div className="flex items-center gap-1">
            {buttons.map(({ id, name }) => (
              <button
                onClick={() => handleButtonClick(id)}
                key={id}
                className={`px-1 py-2 text-[12px] ${
                  buttonId === id
                    ? "bg-cyan-500 text-white"
                    : "bg-gray-100 text-gray-700"
                } rounded-md shadow-md`}
              >
                {name}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ------------TABLE------------ */}
      <div className="leads_Table_Main_Container overflow-x-auto">
        {/* EMPLOYEE REPORT TABLE */}
        <div className="leads_Table_Container min-w-full rounded-md">
          {selectedId === 1 && (employee || businessRole === "Admin") && (
            <EmployeeReport currentReports={currentReports} />
          )}
        </div>
        {/* LEAD REPORTS TABLE */}
        <div className="leads_Table_Container min-w-full rounded-md">
          {selectedId === 2 && (lead || businessRole === "Admin") && (
            <LeadsReport currentReports={currentReports} />
          )}
        </div>
        {/* CLIENT REPORTS TABLE */}
        <div className="leads_Table_Container min-w-full rounded-md">
          {selectedId === 3 && (client || businessRole === "Admin") && (
            <ClientReports currentReports={currentReports} />
          )}
        </div>
        {/* SALES REPORTS TABLE */}
        <div className="leads_Table_Container min-w-full rounded-md">
          {selectedId === 4 && (sales || businessRole === "Admin") && (
            <SalesReports currentReports={currentReports} btn={buttonId} />
          )}
        </div>
        {/* DISPOSE REPORTS TABLE */}
        <div className="leads_Table_Container min-w-full rounded-md">
          {selectedId === 5 && (dispose || businessRole === "Admin") && (
            <DisposeLeads currentReports={currentReports} />
          )}
        </div>
        {/* Monitoring TABLE */}
        <div className="leads_Table_Container min-w-full rounded-md">
          {selectedId === 6 && (monitoring || businessRole === "Admin") && (
            <Monitoring currentReports={currentReports} />
          )}
        </div>
      </div>
    </div>
  );
}
