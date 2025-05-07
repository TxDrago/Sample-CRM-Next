"use client";

//react
import Link from "next/link";
import { useRouter } from "next/navigation";

import { useEffect, useState } from "react";

//external
import axios from "axios";

//reactIcons
import { ImCancelCircle } from "react-icons/im";
import {
  FaArrowAltCircleDown,
  FaArrowAltCircleUp,
  FaUsers,
} from "react-icons/fa";
import { LuIndianRupee } from "react-icons/lu";
import { MdOutlineGroups2 } from "react-icons/md";
import { GiHumanPyramid } from "react-icons/gi";
import { GrContactInfo } from "react-icons/gr";

//Chart
import SalesPipelineChart from "./Components/SalesPipelineChart";
import LeadSourceChart from "./Components/LeadSourceChart";
import SalesReportChart from "./Components/SalesReportChart";
import CustomerSegmentationChart from "./Components/CustomerSegmentationChart";

//imports
import { tenant_base_url, protocal_url } from "@/Config/Config";
import { getHostnamePart } from "@/components/GlobalHostUrl";

export default function Home() {
  const bearer_token = localStorage.getItem("token");
  const name = getHostnamePart();

  //------- Business Type --------
  const businessType = localStorage.getItem("businessType");
  const [business, setBusiness] = useState("");

  //
  const router = useRouter();

     //--------------------------------------- Set Business Type --------------------------------------------
           const [BusinessType, setBusinessType] = useState("");
            
           useEffect(() => {
             const storedType = localStorage.getItem("businessType") || "";
             setBusinessType(storedType);
           }, []);

  //
  const [salesData, setSalesData] = useState([]);
  const [leadsData, setLeadsData] = useState([]);
  const [kycData, setKycData] = useState([]);
  const [data, setData] = useState([]);

  //
  const [targetAchievedData, setTargetAchievedData] = useState([]);

  // ------------- GET TARGET API -------------
  const fetchTargetData = async () => {
    const token = localStorage.getItem("token");
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const targetRes = await axios.get(
        `${protocal_url}${name}.${tenant_base_url}/Report/targetreports/byusertoken`,
        config,
      );

      const res = targetRes?.data?.data;
      setData(res);
      console.log(data);
    } catch (err) {
      console.log("Error while fetching target api", err);
    }
  };

  // ------------- GET TARGET API -------------
  const fetchTargetAchievedData = async () => {
    const token = localStorage.getItem("token");
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const targetAchievedRes = await axios.get(
        `${protocal_url}${name}.${tenant_base_url}/Report/brokaragetreports/byusertoken`,
        config,
      );

      const targetAchievedDat = targetAchievedRes?.data?.data;

      setTargetAchievedData(targetAchievedDat);
      console.log(targetAchievedData);
      // console.log(targetAchievedRes?.data?.data)
    } catch (err) {
      console.log("Error while fetching target api", err);
    }
  };

  // TO FETCH DATA WHEN COMPONENT RENDERS AT FIRST
  useEffect(() => {
    fetchTargetData();
    fetchTargetAchievedData();
  }, []);

  //ByPass OTP -> CHECK
  const checkStoredOtp = () => {
    const storedOtp = localStorage.getItem("otp"); // Retrieve OTP from localStorage
    if (!storedOtp || storedOtp.length !== 6) {
      router.push("/tenantloginOTP"); // Redirect if OTP is not valid or doesn't have 6 characters
    }
  };
  //----------calling data in effect-----------
  useEffect(() => {
    checkStoredOtp();
    handleGetApis();
    //------- Business Type --------
    console.log("Bussiness Type Dash Board : ", businessType);
    setBusiness(businessType);
  }, []);

  //------------------------------------------------------------------------------------------------
  //----------------GET----------------
  async function handleGetApis() {
    const bearer_token = localStorage.getItem("token");
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${bearer_token}`,
        },
      };

      // First API call: current month sales report
      const reportRes = await axios.get(
        `${protocal_url}${name}.${tenant_base_url}/Report/currrentmonthSales/report`,
        config,
      );
      const reportData = reportRes.data.data;
      setSalesData(reportData?.salesData); // Set sales data after the first API call is complete

      // Second API call: current month leads report
      const leadRes = await axios.get(
        `${protocal_url}${name}.${tenant_base_url}/Report/currentmonthLeads/report`,
        config,
      );
      const leadData = leadRes.data.data;
      setLeadsData(leadData); // Set leads data after the second API call is complete

      // Third API call: current month leads report
      const kycRes = await axios.get(
        `${protocal_url}${name}.${tenant_base_url}/Report/currentmonthKYC/report`,
        config,
      );
      const Kyc = kycRes.data.data;
      setKycData(Kyc); // Set KYC data after the Third API call is complete
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  //------------ Destructure salesData with fallback values to prevent null or undefined issues-----------------
  const {
    currentMonthSales = 0,
    previousMonthSales = 0,
    currentMonthClientCount = 0,
    previousMonthClientCount = 0,
  } = salesData || {};

  //----------------Calculate percentage increase for clients-----------------
  const clientPercentageChange =
    previousMonthClientCount === 0
      ? currentMonthClientCount * 100
      : ((currentMonthClientCount - previousMonthClientCount) /
          previousMonthClientCount) *
        100;
  //---------------------last month diffrence-------------------------

  const clientDiffrence = currentMonthClientCount - previousMonthClientCount;

  //-------------------------- Calculate percentage increase for revenue-----------------------------
  const revenuePercentageChange =
    previousMonthSales === 0
      ? currentMonthSales * 100
      : ((currentMonthSales - previousMonthSales) / previousMonthSales) * 100;

  //---------------------last month diffrence-------------------------
  const revenueDiffrence = currentMonthSales - previousMonthSales;

  //-------------------------- Determine increase or decrease status for revenue and sales--------------------------
  const revenueStatus = revenuePercentageChange > 0 ? "up" : "down";
  const clientStatus = clientPercentageChange > 0 ? "up" : "down";

  //----------------------for leads and intrested leads-----------------------------
  const {
    currentMonthLeads = 0,
    previousMonthLeads = 0,
    currentMonthInterestedLeads = 0,
    previousMonthInterestedLeads = 0,
  } = leadsData || {};

  //----------------Calculate percentage increase for leads-----------------

  const leadsPercentage =
    previousMonthLeads === 0
      ? currentMonthLeads * 100
      : ((currentMonthLeads - previousMonthLeads) / previousMonthLeads) * 100;
  //---------------------last month diffrence-------------------------
  const leadsDiffrence = currentMonthLeads - previousMonthLeads;

  //-------------------------- Calculate percentage increase for intrested leads-----------------------------
  const intrestedPercentageChange =
    previousMonthInterestedLeads === 0
      ? currentMonthInterestedLeads * 100 // Multiply current leads directly by 100 if no previous leads.
      : ((currentMonthInterestedLeads - previousMonthInterestedLeads) /
          previousMonthInterestedLeads) *
        100;
  const intrestedLeadsDiffrence =
    currentMonthInterestedLeads - previousMonthInterestedLeads;
  //-------------------------- Determine increase or decrease status for leads and intrested leads--------------------------

  const leadStatus = leadsPercentage > 0 ? "up" : "down";
  const intrestedLeadStatus = intrestedPercentageChange > 0 ? "up" : "down";

  //------------ Destructure KYC with fallback values to prevent null or undefined issues-----------------

  const currentMonthKYC = kycData.currentMonthKYC;
  const previousMonthKYC = kycData.previousMonthKYC;

  //----------------Calculate percentage increase for clients-----------------
  const kycPercentageChange =
    previousMonthKYC === 0
      ? currentMonthKYC * 100
      : ((currentMonthKYC - previousMonthKYC) / previousMonthKYC) * 100;
  //---------------------last month diffrence-------------------------
  const kycDiffrence = currentMonthKYC - previousMonthKYC;

  //-------------------------- Determine increase or decrease status for revenue and sales--------------------------
  const kycStatus = kycPercentageChange > 0 ? "up" : "down";

  // ------------ DATA FUNCTIONALITY STARTS FROM HERE ------------
  const [remainingDays, setRemainingDays] = useState(0);
  const [showSubscription, setShowSubscription] = useState(true);

  const user = JSON.parse(localStorage.getItem("userDetail"));
  // USERNAME
  const firstName = user?.userDetail?.firstName;

  useEffect(() => {
    if (!user?.tenantCreationDate) return;

    const subscriptionStartDate = new Date(user.tenantCreationDate);
    const subscriptionEndDate = new Date(subscriptionStartDate);
    subscriptionEndDate.setMonth(subscriptionEndDate.getMonth() + 1);

    const calculateRemainingDays = () => {
      const today = new Date();
      const timeDifference =
        Date.UTC(
          subscriptionEndDate.getFullYear(),
          subscriptionEndDate.getMonth(),
          subscriptionEndDate.getDate(),
        ) - Date.UTC(today.getFullYear(), today.getMonth(), today.getDate());
      const days = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));
      return days > 0 ? days : 0;
    };

    setRemainingDays(calculateRemainingDays());

    // Schedule the next update at midnight
    const now = new Date();
    const timeUntilMidnight =
      new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1) - now;

    const timeout = setTimeout(() => {
      setRemainingDays(calculateRemainingDays());
    }, timeUntilMidnight);

    return () => clearTimeout(timeout);
  }, [user]);

  //------------------------------------------------------ Get API ----------------------------------------------------

  const [totalBrokerage, setTotalBrokerage] = useState(0);
  const [targetAchieved, setTargetAchieved] = useState(0);

  const getDetails = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${bearer_token}`,
        },
      };
      const response = await axios.get(
        `${protocal_url}${name}.${tenant_base_url}/Report/brokaragetreports/byusertoken`,
        config,
      );
      if (response.status === 200) {
        const Details = response.data.data.totalBrokerage;
        setTargetAchieved(Details);
        console.log("Target Achieved", Details);
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  const getAchieveDetails = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${bearer_token}`,
        },
      };
      const response = await axios.get(
        `${protocal_url}${name}.${tenant_base_url}/Report/targetreports/byusertoken`,
        config,
      );
      if (response.status === 200) {
        const Details = response.data.data.totalTarget;
        setTotalBrokerage(Details);
        console.log("Total Target", Details);
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  useEffect(() => {
    getDetails();
    getAchieveDetails();
  }, []);

  const Remain = totalBrokerage - targetAchieved;

  return (
    <>
      <div className="flex min-h-screen flex-col gap-1">
        {showSubscription && (
          <div className="animate-fade-in flex transform animate-slide-down items-center justify-between border-t-2 bg-white px-3 py-2 text-white shadow-md transition duration-500 ease-in-out">
            <div className="flex flex-col justify-start">
              {/*Condition if reamining days are less than 5  */}
              <h1
                className={`${
                  remainingDays < 5 ? "text-red-500" : "text-gray-700"
                } text-xl font-semibold`}
              >
                Clock is ticking! {remainingDays} day&apos;s are left in your
                trail.
              </h1>
              <p className="text-xs font-semibold text-gray-500">
                Pick a perfect plan for your business needs before your trial
                period gets over.
              </p>
            </div>
            {/* SECOND */}
            <div className="flex items-center gap-4">
              <Link href={`/panel/${BusinessType}/subscription/`}>
                <button className="cursor-pointer rounded-md border-none bg-cyan-500 px-2 py-2 text-sm font-semibold text-white hover:shadow-md">
                  Choose Plan
                </button>
              </Link>
              <Link href={`/panel/${businessType}/dashboard`} onClick={() => setShowSubscription(false)}>
                <ImCancelCircle color="red" size={25} />
              </Link>
            </div>
          </div>
        )}
        {/* FIRST NAME */}
        <h1 className="my-2 px-3 pb-1 text-2xl font-semibold text-gray-700 sm:text-3xl">
          Hello, {firstName || ""}
        </h1>
        {/* ------- TOP CARDS ------- */}
        {/* ------- 4 Card, Charo ki alag alag CSS {Parent}  ------- */}
        <div className="grid grid-cols-2 items-center gap-2 px-2 sm:grid sm:grid-cols-2 sm:gap-3 lg:flex">
          {/* ------- CARD --> CHILD:1------- */}
          <div className="md:w-4/4 flex h-44 flex-col justify-between rounded-md bg-white p-2 shadow-lg sm:min-h-52 sm:gap-4 sm:p-4 lg:w-1/4">
            <div className="flex flex-col">
              {}
              <h1 className="text-sm  font-medium uppercase">
                {business === "brokerage" ? "Leads" : "Lead this month"}
              </h1>
              {/* ------- CARD--> 1 ---> Logo and SideText --> Parent ----------- */}
              <div className="mt-2 flex items-center justify-between">
                {/* ------- CARD--> 1 ---> Logo --> C1 ----------- */}
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-teal-500 px-2 text-white sm:h-20 sm:w-20">
                  {/* ------- CARD--> 1 ---> Logo --> C1 ----------- */}
                  <GrContactInfo className="text-2xl sm:text-5xl" />
                </div>
                {/* ------- CARD--> 1 ---> SideText --> Parent --> {top-bottom TEXTS}  C2 ----------- */}
                <div className="flex flex-col items-center justify-center gap-1">
                  <span className="text-lg font-semibold sm:text-xl sm:font-bold">
                    {currentMonthLeads}
                  </span>

                  <div
                    className={`flex items-center gap-1 rounded-lg p-1 ${leadStatus == "up" ? "bg-green-200" : "bg-red-200"} `}
                  >
                    {leadStatus == "up" ? (
                      <FaArrowAltCircleUp className="text-sm" />
                    ) : (
                      <FaArrowAltCircleDown className="text-sm" />
                    )}
                    <span className="sm:text-md text-sm">
                      {Math.round(leadsPercentage)}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
            {/* ------- CARD--> 1 ---> PROGRESS BAR  --> C3 ----------- */}
            <div className="h-2 w-full rounded-lg border border-gray-500 bg-transparent">
              <div
                className={`h-full ${
                  leadStatus == "up" ? "bg-blue-600" : "bg-red-500"
                }`}
                style={{
                  maxWidth: `${Math.abs(Math.round(leadsPercentage))}%`,
                }}
              ></div>
            </div>
            {/* ------- CARD--> 1 ---> Last Line{Text}--> C4 ----------- */}
            <h3 className="text-sm font-light">
              Last Month Relative:{" "}
              <span className="text-sm">{leadsDiffrence}</span>
            </h3>
          </div>
          {/* ---------------------------------------------------------------------------------------------------------------- */}
          {/* ------- CARD --> CHILD:2 ------- */}
          <div className="md:w-4/4 flex h-44 flex-col justify-between rounded-md bg-white p-2 shadow-lg sm:min-h-52 sm:gap-4 sm:p-4 lg:w-1/4">
            <div className="flex flex-col">
              <h1 className="text-sm font-medium uppercase">
                {business === "brokerage" ? "Funds" : "REVENUE THIS MONTH"}
              </h1>
              {/* ------- CARD--> 2 ---> Logo and SideText --> Parent ----------- */}
              <div className="mt-2 flex items-center justify-between">
                {/* ------- CARD--> 2 ---> Logo --> C1 ----------- */}
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-rose-500 px-2 text-white sm:h-20 sm:w-20">
                  <LuIndianRupee className="text-2xl sm:text-5xl" />
                </div>
                {/* ------- CARD--> 2 ---> SideText --> Parent --> {top-bottom TEXTS}  C2 ----------- */}
                <div className="flex flex-col items-center justify-center gap-1">
                  <span className="text-lg font-semibold sm:text-xl sm:font-bold">
                    {currentMonthSales}
                  </span>

                  <div
                    className={`flex items-center gap-1 rounded-lg p-1 ${leadStatus == "up" ? "bg-green-200" : "bg-red-200"} `}
                  >
                    {leadStatus == "up" ? (
                      <FaArrowAltCircleUp className="text-sm" />
                    ) : (
                      <FaArrowAltCircleDown className="text-sm" />
                    )}
                    <span className="sm:text-md text-sm">
                      {Math.round(leadsPercentage)}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
            {/* ------- CARD--> 2 ---> PROGRESS BAR  --> C3 ----------- */}
            <div className="h-2 w-full rounded-lg border border-gray-500 bg-transparent">
              <div
                className={`h-full ${
                  leadStatus == "up" ? "bg-blue-600" : "bg-red-600"
                }`}
                style={{
                  maxWidth: `${Math.abs(Math.round(leadsPercentage))}%`,
                }}
              ></div>
            </div>
            {/* ------- CARD--> 2 ---> Last Line{Text}--> C4 ----------- */}
            <h3 className="text-sm font-light">
              Last Month Relative:{" "}
              <span className="text-sm">{revenueDiffrence}</span>
            </h3>
          </div>
          {/* ---------------------------------------------------------------------------------------------------------------- */}
          {/* ------- CARD --> CHILD:3------- */}
          <div className="md:w-4/4 flex h-44 flex-col justify-between rounded-md bg-white p-2 shadow-lg sm:min-h-52 sm:gap-4 sm:p-4 lg:w-1/4">
            <div className="flex flex-col">
              {}
              <h1 className="text-sm font-medium uppercase">
                {business === "brokerage" ? "KYC" : "CLIENT THIS MONTH"}
              </h1>
              {/* ------- CARD--> 3 ---> Logo and SideText --> Parent ----------- */}
              <div className="mt-2 flex items-center justify-between">
                {/* ------- CARD--> 3 ---> Logo --> C1 ----------- */}
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-lime-500 px-2 text-white sm:h-20 sm:w-20">
                  <MdOutlineGroups2 className="text-2xl sm:text-5xl" />
                </div>
                {/* ------- CARD--> 3 ---> SideText --> Parent --> {top-bottom TEXTS}  C2 ----------- */}

                <div className="flex flex-col items-center justify-center gap-1">
                  <span className="text-lg font-semibold sm:text-xl sm:font-bold">
                    {business === "brokerage"
                      ? currentMonthKYC
                      : currentMonthClientCount}
                  </span>
                  {business === "brokerage" ? (
                    <div
                      className={`flex items-center gap-1 rounded-lg p-1 ${leadStatus == "up" ? "bg-green-200" : "bg-red-200"} `}
                    >
                      {kycStatus == "up" ? (
                        <FaArrowAltCircleUp className="text-sm" />
                      ) : (
                        <FaArrowAltCircleDown className="text-sm" />
                      )}
                      <span className="sm:text-md text-sm">
                        {Math.round(kycPercentageChange)}%
                      </span>
                    </div>
                  ) : (
                    <div
                      className={`flex items-center gap-1 rounded-lg p-1 ${leadStatus == "up" ? "bg-green-200" : "bg-red-200"} `}
                    >
                      {clientStatus == "up" ? (
                        <FaArrowAltCircleUp className="text-sm" />
                      ) : (
                        <FaArrowAltCircleDown className="text-sm" />
                      )}
                      <span className="sm:text-md text-sm">
                        {Math.round(clientPercentageChange)}%
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
            {/* ------- CARD--> 3  --> PROGRESS BAR  --> C3 ----------- */}
            <div className="h-2 w-full rounded-lg border border-gray-500 bg-transparent">
              {business === "brokerage" ? (
                <div
                  className={`h-full ${
                    clientStatus == "up" ? "bg-blue-600" : "bg-red-600"
                  }`}
                  style={{
                    maxWidth: `${Math.abs(Math.round(kycPercentageChange))}%`,
                  }}
                ></div>
              ) : (
                <div
                  className={`h-full ${
                    clientStatus == "up" ? "bg-blue-600" : "bg-red-600"
                  }`}
                  style={{
                    maxWidth: `${Math.abs(Math.round(clientPercentageChange))}%`,
                  }}
                ></div>
              )}
            </div>
            <h3 className="text-sm font-light">
              Last Month Relative:{" "}
              {business === "brokerage" ? (
                <span className="text-sm">{kycDiffrence}</span>
              ) : (
                <span className="text-sm">{clientDiffrence}</span>
              )}
            </h3>
          </div>
          {/* ---------------------------------------------------------------------------------------------------------------- */}
          {/* ------- CARD --> CHILD -> 4 ------- */}
          <div className="md:w-4/4 flex h-44 flex-col justify-between rounded-md bg-white p-2 shadow-lg sm:min-h-52 sm:gap-4 sm:p-4 lg:w-1/4">
            <div className="flex flex-col">
              {}
              <h1 className="text-sm font-medium uppercase">
                {business === "brokerage"
                  ? "Interested Clients"
                  : "SALES IN PIPELINE"}
              </h1>
              {/* ------- CARD--> 4 ---> Logo and SideText --> Parent ----------- */}
              <div className="mt-2 flex items-center justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-sky-500 px-2 text-white sm:h-20 sm:w-20">
                  {/* ------- CARD--> 4 ---> Logo --> C1 ----------- */}
                  <GiHumanPyramid className="text-2xl sm:text-5xl" />
                </div>
                {/* ------- CARD--> 4 ---> SideText --> Parent --> {top-bottom TEXTS}  C2 ----------- */}

                <div className="flex flex-col items-center justify-center gap-1">
                  <span className="text-lg font-semibold sm:text-xl sm:font-bold">
                    {currentMonthInterestedLeads}
                  </span>

                  <button
                    className={`flex items-center gap-1 rounded-lg p-1 ${leadStatus == "up" ? "bg-green-200" : "bg-red-200"} `}
                  >
                    {intrestedLeadStatus == "up" ? (
                      <FaArrowAltCircleUp className="text-sm" />
                    ) : (
                      <FaArrowAltCircleDown className="text-sm" />
                    )}
                    <span className="sm:text-md text-sm">
                      {Math.round(intrestedPercentageChange)}%
                    </span>
                  </button>
                </div>
              </div>
            </div>
            {/* ------- CARD--> 4 ---> PROGRESS BAR  --> C3 ----------- */}
            {/* ------- CARD--> 4 ---> PROGRESS BAR  --> C3 ----------- */}
            <div className="h-2 w-full rounded-lg border border-gray-500 bg-transparent">
              <div
                className={`h-full ${
                  leadStatus == "up" ? "bg-blue-600" : "bg-red-500"
                }`}
                style={{
                  maxWidth: `${Math.abs(Math.round(leadsPercentage))}%`,
                }}
              ></div>
            </div>
            {/* ------- CARD--> 1 ---> Last Line{Text}--> C4 ----------- */}
            <h3 className="text-sm font-light">
              Last Month Relative:{" "}
              <span className="text-sm">{intrestedLeadsDiffrence}</span>
            </h3>
          </div>
        </div>
        {/* ---------------------------------------------------------------------------------------------------------------- */}

        <div className="m-2 grid grid-cols-1 gap-4 sm:grid-cols-2">
  {/* --- LEFT CARD: Customer Segmentation --- */}
  <div className="flex flex-col justify-between rounded-lg bg-white px-6 py-6 shadow-md">
    <h1 className="text-xl font-medium mb-4">
      {business === "brokerage" ? "Brokerage" : "Custom Segmentation"}
    </h1>

    <div className="flex flex-col items-center gap-4">
      <CustomerSegmentationChart
        totalBrokerage={totalBrokerage}
        businessType={businessType}
        targetAchieved={targetAchieved}
      />

      {businessType === "Brokerage" ? (
        <>
          <div className="flex w-full items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded bg-orange-600"></div>
              <span>Total Target</span>
            </div>
            <span className="text-gray-700">{totalBrokerage}</span>
          </div>
          <div className="flex w-full items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded bg-green-300"></div>
              <span>Target Achieved (Brokerage)</span>
            </div>
            <span className="text-gray-700">{targetAchieved}</span>
          </div>
        </>
      ) : (
        <>
          {[
            { label: "Small Business", color: "bg-orange-600" },
            { label: "Enterprise", color: "bg-orange-300" },
            { label: "Company", color: "bg-blue-600" },
          ].map((item, index) => (
            <div
              key={index}
              className="flex w-full items-center justify-between text-sm"
            >
              <div className="flex items-center gap-2">
                <div className={`h-3 w-3 rounded ${item.color}`}></div>
                <span>{item.label}</span>
              </div>
              <div className="flex gap-1">
                <span className="text-gray-700">1,650</span>
                <span className="text-green-500">↑ 424</span>
              </div>
            </div>
          ))}
        </>
      )}

      <h2 className="mt-4 font-semibold text-base">
        Remaining:{" "}
        {businessType === "Brokerage" ? (Remain <= 0 ? "0" : Remain) : "900"}
      </h2>
    </div>
  </div>

  {/* --- RIGHT CARD: Sales Report --- */}
  <div className="flex flex-col justify-between rounded-lg bg-white px-6 py-6 shadow-md">
    <SalesReportChart
      businessType={businessType}
      totalBrokerage={totalBrokerage}
      targetAchieved={targetAchieved}
    />
  </div>
</div>

        {/* ------- BOTTOM CARDS ------- */}
        {business === "brokerage" ? (
          ""
        ) : (
          <div className="mx-2 gap-3 sm:flex md:grid md:grid-cols-1">
            {/* ------- BOTTOM CARD ------- */}
            <div className="flex flex-col rounded-md bg-white px-3 py-6 shadow-sm">
              <SalesPipelineChart />
            </div>
            {/* ------- BOTTOM CARD ------- */}
            <div className="mb-4 mt-3 flex h-[400px] gap-4 rounded-md bg-blue-50 px-4 py-4 shadow-md">
              <LeadSourceChart />
            </div>
          </div>
        )}
      </div>
    </>
  );
}
