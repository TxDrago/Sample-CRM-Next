"use client";

//react
import Link from "next/link";

import { useState, useEffect } from "react";
import axios from "axios";
import SendSMS from "./SMSComponents/SendSMS";
import SendEmail from "./SMSComponents/SendEmail";
//file
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import { tenant_base_url, protocal_url } from "@/Config/Config";
import { getHostnamePart } from "@/components/GlobalHostUrl";
import { SearchElement } from "@/components/SearchElement";
import UseAction from "@/Hooks/Action/UseAction";
import UseGridFilter from "@/Hooks/GridFilter/UseGridFilter";
import UseDateFilter from "@/Hooks/DateFilter/UseDateFilter";

export default function ServiceBox() {
  const name = getHostnamePart();
  //--------------------------------------- Set Business Type --------------------------------------------
  const [BusinessType, setBusinessType] = useState("");

  useEffect(() => {
    const storedType = localStorage.getItem("businessType") || "";
    setBusinessType(storedType);
  }, []);
  //------------------------------------------------- All States----------------------------------------------------------
  const [selectedButton, setSelectedButton] = useState("Send SMS");
  const [selectedRowsId, setSelectedRowsId] = useState([]);
  const [selectedRowEmails, setSelectedRowEmails] = useState([]);

  //-------------------------------------------------- GET Data ----------------------------------------------------
  const [originalData, setOriginalData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);

  async function getApiData(selectedButton) {
    const bearer_token = localStorage.getItem("token");

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${bearer_token}`,
        },
      };
      let response;

      if (selectedButton === "Send SMS") {
        response = await axios.get(
          `${protocal_url}${name}.${tenant_base_url}/SMSBox/sendsmsdetail/byusertoken`,
          config,
        );
        console.log("SMS", response);
      } else if (selectedButton === "Send Email") {
        response = await axios.get(
          `${protocal_url}${name}.${tenant_base_url}/SMSBox/sendemaildetail/byusertoken`,
          config,
        );
      }
      console.log("Data", response);

      setOriginalData(response.data.data);
      setFilteredData(response.data.data);
    } catch (error) {
      console.error("Error fetching leads:", error);
    }
  }

  useEffect(() => {
    getApiData(selectedButton);
  }, [selectedButton]);

  //---------------------------------------------> Grid Pagination <-----------------------------------------------
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentData = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  const handlePageChange = (event, value) => {
    setCurrentPage(value);
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

  //---------------------------------------------------- Ation and it's Functionality ---------------------------------

  // ACTION DROPDOWN DATA
  const actions = [
    { key: 1, value: "Mass Delete" },
    { key: 3, value: "Mass Email" },
    { key: 5, value: "Export to Excel" },
    { key: 6, value: "Export to PDF" },
  ];

  //------------------------------------------------ Buttons -------------------------------------------
  //--------------------------------------------- DYNAMIC BUTTONS ---------------------------------------
  const dynamicButtons = {
    "Send SMS": { text: "Send SMS" },
    "Send Email": {
      text: "Send Email",
    },
  };

  // State to manage the button text
  const [buttonText, setButtonText] = useState({
    text: "Send SMS",
  });

  // Function to handle option click using bracket notation
  const handleOptionClick = (key) => {
    console.log("Clicked key:", key);
    setButtonText(dynamicButtons[key]);
    setSelectedButton(key);
  };

  //------------------------------------------------------Filter Reset Settings ---------------------------------------------
  const handleResetFilter = () => {
    setSearchTerm("");
  };

  //---------------------------------------------------- Roles & Permissions ----------------------------------------------------

  const businessRole = localStorage.getItem("businessRole");

  const [smsPermission, setSMSPermission] = useState(false);
  const [permissions, setPermissions] = useState([]);
  const [emailPermission, setEmailPermission] = useState(false);

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
          (item) => item.moduleName === "Service Box",
        );

        if (serviceBoxPermissions) {
          const permissionsArray = serviceBoxPermissions.permissions.split(",");
          setPermissions(permissionsArray);
          //------------------------------------------------------ Set permissions ------------------------------------------------
          setSMSPermission(permissionsArray.includes("Send SMS"));
          setEmailPermission(permissionsArray.includes("Send Email"));
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
    const filtered = originalData.filter((lead) =>
      lead.products?.toLowerCase()?.includes(searchTerm?.toLowerCase()),
    );
    setFilteredData(filtered);
  }, [searchTerm, originalData]);

  return (
    <div className="m-3 flex min-h-screen flex-col">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-md bg-white px-3 py-2">
        <div className="contact_Dropdown_Main_Container flex flex-wrap items-center justify-start gap-3">
          {/*-------------------------------------- SEARCH ---------------------------------------- */}
          <SearchElement
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {/*----------------------------------- DYNAMIC BUTTONS -----------------------------------*/}
          <div className="service_Button_Main_Container flex gap-4 whitespace-nowrap">
            {Object.keys(dynamicButtons).map((key) =>
              permissions.includes(key) || businessRole === "Admin" ? (
                <button
                  key={key}
                  onClick={() => handleOptionClick(key)}
                  className={`text-md service_Button_Container rounded px-4 py-1.5 font-light ${
                    selectedButton === key
                      ? "bg-cyan-500 text-white"
                      : "bg-gray-100 text-gray-700"
                  } `}
                >
                  {key}
                </button>
              ) : null,
            )}
          </div>
        </div>
        <div className="service_Action_Main_Container flex flex-wrap items-center gap-3">
          {/*---------------------------- DYNAMIC BUTTONS LINKS ------------------------------------*/}
          <div>
            {(smsPermission || businessRole === "Admin") &&
            buttonText.text === "Send SMS" ? (
              <Link href={`/panel/${BusinessType}/servicebox/sendsms`} className="service_Action_Container">
                <button className="text-md service_Action_Button w-[150px] rounded-md bg-blue-600 px-3 py-2 text-center text-white">
                  {buttonText.text}
                </button>
              </Link>
            ) : (
              ""
            )}
            {(emailPermission || businessRole === "Admin") &&
            buttonText.text === "Send Email" ? (
              <Link href={`/panel/${BusinessType}/servicebox/sendemail`} className="service_Action_Container">
                <button className="text-md service_Action_Button w-[150px] rounded-md bg-blue-600 px-3 py-2 text-center text-white">
                  {buttonText.text}
                </button>
              </Link>
            ) : (
              ""
            )}
          </div>

          {/*---------------------------- STRIPEBAR DROPDOWN ---------------------------------------*/}
          <UseGridFilter
            selectedViewValue={selectedViewValue} // Sending selected value
            setSelectedViewValue={setSelectedViewValue} // Setting selected value
          />
          {/*--------------------------------- ACTION DROPDOWN ---------------------------------------*/}
          <UseAction
            originalData={originalData} // Sending Original Data
            getApiData={getApiData} // Execute API Data Function
            screenName="Service Box" // Sending Screen Name
            selectedRowsId={selectedRowsId} // Sending Selected Rows IDs
            selectedRowEmails={selectedRowEmails} // Sending Selected Rows E-Mail's
            actions={actions} // Sending Actions Dropdown List
          />
        </div>
      </div>

      {/* FILTER BY SECTION */}
      <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-medium">SMS Box</h1>
          <h1 className="text-md min-w-10 rounded-md bg-blue-600 px-2 py-2 text-center text-white shadow-md">
            {filteredData.length}
          </h1>
        </div>

        <div className="date_Filter_Main_Container">
          {/* ------------------- Filter by date ----------------- */}
          <UseDateFilter
            onReset={handleResetFilter} //Reset Button Function
            originalData={originalData} // Sending Original Data
            setFilteredData={setFilteredData} // Set Filter Data
            filteredData={filteredData} //Sending Filter Data
          />
        </div>
      </div>
      {/* ------------TABLE------------ */}
      <div className="leads_Table_Main_Container mt-3 overflow-x-auto">
        {/*------------------------------------------ SEND SMS TABLE ------------------------------------------ */}

        {selectedButton === "Send SMS" &&
          (emailPermission || businessRole === "Admin") && (
            <SendSMS
              currentData={currentData}
              selectedViewValue={selectedViewValue}
              handleSelectionChange={handleSelectionChange}
            />
          )}

        {/*----------------------------------------- SEND EMAIL TABLE -------------------------------------------*/}

        {selectedButton === "Send Email" &&
          (smsPermission || businessRole === "Admin") && (
            <SendEmail
              currentData={currentData}
              selectedViewValue={selectedViewValue}
              handleSelectionChange={handleSelectionChange}
            />
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
                fontSize: "1.3 rem",
              },
              "& .MuiPaginationItem-root.Mui-selected": {
                backgroundColor: "rgba(6, 182, 212, 1)",
                color: "#fff",
              },
            }}
          />
        </Stack>
      </div>
    </div>
  );
}
