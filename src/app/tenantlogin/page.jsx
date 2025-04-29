"use client";

//react
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import axios from "axios";

//react-icons
import { IoIosEye, IoIosEyeOff } from "react-icons/io";
import { GiDiamonds } from "react-icons/gi";

//react-toast
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  showSuccessToast,
  showErrorToast,
} from "./../../utils/toastNotifications";

//ImageUsed
import Image from "next/image";

import { getHostnamePart } from "@/components/GlobalHostUrl";

// Config
import {
  protocal_url,
  tenant_base_url,
  urlchange_base,
  localBase,
  main_base_url,
} from "@/Config/Config";

// ---------------------------- Microsoft MSAl Import --------------------------------
import {
  getMsalInstance,
  loginRequest,
  graphConfig,
} from "@/Config/msalConfig";

// ---------------------------- Google Import ----------------------------------------
import { jwtDecode } from "jwt-decode";
import { FaStarOfLife } from "react-icons/fa";

export default function TenantLogin() {

  const router = useRouter();
  const msalInstance = getMsalInstance();

  //-------------------------------------- Microsoft Authentication Setup --------------------------------

  const baseUrl = localBase || "localhost:3000"; // Local base URL
  const serverUrl = protocal_url + tenant_base_url; // Server base URL
  const urlChangeBase = urlchange_base || "igniculusscrm.com";

  console.log("baseUrl:", baseUrl);
  console.log("serverUrl:", serverUrl);
  console.log("urlChangeBase:", urlChangeBase);

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userData, setUserData] = useState(null);
  const [managerData, setManagerData] = useState(null);
  //--------------------------------------- Set Business Type --------------------------------------------
  const [BusinessType, setBusinessType] = useState("");

  useEffect(() => {
    const storedType = localStorage.getItem("businessType") || "";
    setBusinessType(storedType);
  }, []);

  // Function to handle Microsoft login
  const handleMicrosoftLogin = async () => {
    try {
      const msalInstance = getMsalInstance();
  
      // Initialize the instance before use
      await msalInstance.initialize();
  
      const loginResponse = await msalInstance.loginPopup(loginRequest);
      msalInstance.setActiveAccount(loginResponse.account);
      setIsAuthenticated(true);
      fetchUserDetails(msalInstance);
    } catch (error) {
      console.error("Login failed:", error);
      setIsAuthenticated(false);
    }
  };

  // Function to fetch user and manager details
  const fetchUserDetails = async (msalInstance) => {
    try {
      const activeAccount = msalInstance.getActiveAccount();
      if (!activeAccount) {
        throw new Error("No active account! Please log in.");
      }
  
      let tokenResponse;
      try {
        tokenResponse = await msalInstance.acquireTokenSilent({
          ...loginRequest,
          account: activeAccount,
        });
      } catch (error) {
        console.error("Silent token failed, trying popup:", error);
        tokenResponse = await msalInstance.acquireTokenPopup(loginRequest);
      }
  
      const headers = { Authorization: `Bearer ${tokenResponse.accessToken}` };
      const userProfile = await fetch(graphConfig.graphMeEndpoint, { headers }).then((res) => res.json());
  
      let managerProfile = null;
      try {
        managerProfile = await fetch(graphConfig.graphManagerEndpoint, { headers }).then((res) => res.json());
      } catch (error) {
        console.warn("Failed to fetch manager profile:", error);
      }
  
      setUserData(userProfile);
      setManagerData(managerProfile);
    } catch (error) {
      console.error("Failed to fetch user or manager details:", error);
    }
  };

  
  // Check existing sessions
  useEffect(() => {
    const accounts = msalInstance.getAllAccounts();
    if (accounts.length > 0) {
      msalInstance.setActiveAccount(accounts[0]);
      setIsAuthenticated(true);
      fetchUserDetails();
    }
  }, []);

  useEffect(() => {
    if (userData && managerData !== null) {
      handleMicrosoftAuth();
    }
  }, [userData, managerData]);

  const handleMicrosoftAuth = async () => {
    try {
      const response = await axios.post(
        `https://your-subdomain.${process.env.NEXT_PUBLIC_TENANT_BASE}/Users/microsoftlogin`,
        {
          firstName: userData.givenName || "",
          lastName: userData.surname || "",
          email: userData.mail || userData.userPrincipalName,
          contactNo: userData.mobilePhone || "",
          country: "",
          businessType: "",
          userName: "",
          password: "",
          confirmPassword: "",
          role: userData.jobTitle || "",
          groupId: null,
          reportedTo: managerData?.displayName || "",
          isActive: true,
          createdDate: null,
          deletedDate: null,
        }
      );

      const loginDetail = response.data.data;
      localStorage.setItem("token", loginDetail.token);
      localStorage.setItem("userDetail", JSON.stringify(loginDetail));
      localStorage.setItem("myData_forget", userData.displayName);

      router.push(`/panel/${BusinessType}/dashboard`);
    } catch (error) {
      if (error.response?.data) {
        alert(error.response.data.message);
      } else {
        console.error("Unhandled Error:", error);
      }
    }
  };


  //---------------------------------------------------- Microsoft Authentication End ----------------------------------------

  //---------------------------------------------------- Google Authentication Setup -----------------------------------------

  const [user, setUser] = useState(null);
  const [showLogin, setShowLogin] = useState(false); // Toggle login modal visibility

  const handleLoginSuccess = (credentialResponse) => {
    const token = credentialResponse.credential;
    const decodedUser = jwtDecode(token); // Decode the token to get user information
    setUser(decodedUser);
    console.log("User Info:", decodedUser);
  };

  const handleLoginError = () => {
    console.error("Login Failed");
  };

  const handleButtonClick = () => {
    setShowLogin(true); // Trigger the Google Login process
  };

  //---------------------------------------------------- Google Authentication End -------------------------------------------

  //username
  const [userName, setuserName] = useState("");
  //password
  const [password, setPassword] = useState("");

  //not resolved yet 23/10/2024
  const deviceType = "";
  const deviceAddress = "";

  //
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);

  //to read url
  const name = getHostnamePart();

  //it is just to verify companyName in URL
  useEffect(() => {
    const apiUrl = `${protocal_url}${name}.${tenant_base_url}/Tenants/check`;
    console.log("Constructed API URL:", apiUrl);

    const verifyTenant = async () => {
      try {
        const response = await axios.post(
          apiUrl,
          {
            tenantName: name,
            tenanturl: apiUrl,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        // console.log("API Response:", response);
        const { isSuccess } = response.data;
      } catch (error) {
        console.error("Error checking tenant:", error); // Log the error
        setTimeout(() => {
          const baseUrl =
            process.env.NODE_ENV === "development"
              ? "localhost"
              : urlchange_base;

          const port = "3000"; // or localBase.split(":")[1] if you need it dynamic

          let newUrl =
            baseUrl === "localhost"
              ? `http://${name}.localhost:${port}/VerifyTenant` // Development URL
              : `https://${name}.${urlChangeBase}/VerifyTenant`; // Production URL

          console.log("New URL:", newUrl);
        }, 100);
      }
    };
    verifyTenant();
  }, []);

  const emailRegex =
    /^[A-Za-z0-9](([a-zA-Z0-9,=\.!\-#|\$%\^&\*\+/\?_`\{\}~]+)*)@(?:[0-9a-zA-Z-]+\.)+[a-zA-Z]{2,9}$/;
  function handleusername(e) {
    let userName = e.target.value;
    if (!userName.match(emailRegex)) {
      setEmailError(true);
    } else {
      setEmailError(false);
    }
    setuserName(e.target.value);
  }

  const passwordRegex =
    /(?=^.{8,}$)((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/;
  function handlepassword(e) {
    let password = e.target.value;
    if (!password.match(passwordRegex)) {
      setPasswordError(true);
    } else {
      setPasswordError(false);
    }
    setPassword(e.target.value);
  }
  const [passwordEye, setPasswordEye] = useState(false);

  function togglePasswordEye() {
    setPasswordEye(!passwordEye);
  }

  async function handleSubmit(e) {
    e.preventDefault();

    //Email Regex match
    const emailRegex =
      /^[A-Za-z0-9](([a-zA-Z0-9,=\.!\-#|\$%\^&\*\+/\?_`\{\}~]+)*)@(?:[0-9a-zA-Z-]+\.)+[a-zA-Z]{2,9}$/;

    //Password Regex match
    const passwordRegex =
      /(?=^.{8,}$)((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/;

    try {
      const response = await axios.post(
        `${protocal_url}${name}.${tenant_base_url}/Users/login`,
        {
          userName: userName,
          password: password.trim(),
          deviceType: deviceType,
          deviceAddress: deviceAddress,
        }
      );
      const logindetail = response.data.data;
      console.log("Login Response: ", response.data);

      //IMP for handling businessType such as Brokerage, IT, Retail.... etc
      localStorage.setItem(
        "businessType",
        response.data.data.userDetail.businessType.replace(/\s+/g, "")
      );

      localStorage.setItem("activeSidebarKey", 1);

      localStorage.setItem(
        "CurrentUserId",
        response.data.data.userDetail.userId
      );

      localStorage.setItem("businessRole", response.data.data.userDetail.role);

      localStorage.setItem("token", response.data.data.token);

      localStorage.setItem("userDetail", JSON.stringify(logindetail));

      localStorage.setItem("myData_forget", userName);

      router.push("/tenantLoginOTP");
    } catch (error) {
      if (error.response.data) {
        console.log(error);
        showErrorToast(error.response.data.message);
      } else {
        console.log(error);
      }
    }
  }

  return (
    <>
      <ToastContainer />
      <div className="flex flex-col min-h-screen bg-cyan-500 sm:bg-cyan-500 md:flex-row">
        {/*----------> Part-I <---------- */}
        <div className="flex-col items-center justify-center hidden w-2/3 min-h-screen bg-cyan md:flex">
          <div className="flex flex-col items-center justify-center gap-2 px-16 py-8 bg-white rounded-md">
            <Image
              src="/images/IgniculussLogo.png"
              alt="Brandlogo"
              width={80}
              height={80}
            />
            <Image
              src="/images/CRMLoginPage.png"
              alt="sample"
              width={600}
              height={1200}
              className="!h-2/3 !w-full"
              priority
            />
            <div className="flex text-3xl font-semibold">
              <GiDiamonds className="text-cyan-500" />
              <h1>Hello, Igniculuss</h1>
            </div>
            <div>
              <p className="text-xs text-center text-gray-400">
                Skip repetitive and manual sales-marketing tasks. Get highly
                <br />
                productive through automation and save tons of time!
              </p>
            </div>
          </div>
        </div>

        {/*----------> Part-II <---------- */}
        <div className="flex flex-col justify-center w-full min-h-screen bg-cyan-500 md:w-1/3 md:bg-white">
          {/* Image on Top for Small Screens */}
          <div className="flex justify-center md:hidden">
            <Image
              src="/images/IgniculussLogo.png"
              alt="sample"
              width={100}
              height={50}
            />
          </div>

          <div className="flex flex-col justify-center px-3 py-3 mx-10 mt-8 bg-white rounded-2xl md:mx-4">
            <div className="flex items-center gap-3 text-2xl font-semibold">
              <GiDiamonds className="hidden text-3xl md:block" />
              <h1 className="">Log In</h1>
            </div>

            <div className="mt-6">
              {/*----------> FORM <---------- */}
              <form
                className="flex flex-col gap-2 rounded-md"
                onSubmit={handleSubmit}
              >
                {/*----------> Username <---------- */}
                <label
                  htmlFor="userName"
                  className="text-xs font-medium text-gray-700"
                >
                  <span className="flex gap-1">
                    User Name
                    <FaStarOfLife size={8} className="text-red-500" />
                  </span>
                  <input
                    type="email"
                    name="userName"
                    className="flex justify-between w-full px-2 py-2 mt-1 text-sm border border-gray-300 rounded-md outline-none"
                    value={userName}
                    onChange={handleusername}
                    placeholder="specimen@company.com"
                  />
                </label>
                {/*----------> Password <---------- */}
                <label
                  htmlFor="password"
                  className="relative block text-xs font-medium text-gray-700"
                >
                  <span className="flex gap-1">
                    Password
                    <FaStarOfLife size={8} className="text-red-500" />
                  </span>
                  <input
                    type={passwordEye ? "text" : "password"}
                    name="password"
                    className="w-full px-2 py-2 pr-12 mt-1 text-sm border border-gray-300 rounded-md outline-none" // Add padding to the right to avoid overlapping text
                    value={password}
                    onChange={handlepassword}
                    placeholder="Password"
                  />
                  <button
                    type="button"
                    onClick={togglePasswordEye}
                    className="absolute inset-y-0 flex items-center text-gray-500 transition-opacity duration-300 ease-in-out right-2 top-6"
                  >
                    {passwordEye ? (
                      <IoIosEye
                        size={22}
                        className={`transition-opacity duration-300 ease-in-out ${
                          passwordEye ? "opacity-100" : "opacity-0"
                        }`}
                      />
                    ) : (
                      <IoIosEyeOff
                        size={22}
                        className={`transition-opacity duration-300 ease-in-out ${
                          passwordEye ? "opacity-0" : "opacity-100"
                        }`}
                      />
                    )}
                  </button>
                </label>

                <Link
                  href="/forgetpassword"
                  className="text-xs font-medium underline text-cyan-500"
                >
                  Reset Password
                </Link>

                <button className="py-4 mt-4 text-xs font-bold text-white rounded-md outline-none bg-cyan-500 hover:shadow-md">
                  Submit
                </button>
              </form>

              <div className="relative mt-8 text-center">
                <div className="absolute flex items-center inset-2">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative inline-block px-4 text-sm bg-white">
                  <span className="font-light">Or Login With</span>
                </div>
              </div>
            </div>
            <button
              onClick={handleMicrosoftLogin}
              className="flex items-center justify-center gap-2 py-4 mt-8 text-xs font-bold bg-white border-2 border-gray-400 rounded-md hover:shadow-md"
            >
              Login with Microsoft{" "}
              <Image
                src="/images/microsoft-logo.png"
                alt="microsoft-logo"
                width={4}
                height={4}
                className="w-4 h-4"
              />
            </button>

            {/*//Google Login Commented */}
            {/*
                <GoogleLogin
                  onSuccess={handleLoginSuccess}
                  onError={handleLoginError}
                />
            */}
          </div>
        </div>
      </div>
    </>
  );
}
