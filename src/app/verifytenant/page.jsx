"use client";
// React
import Link from "next/link";
import { useState, useEffect } from "react";
import axios from "axios";

// Icons
import { GiDiamonds } from "react-icons/gi";
import { FaStarOfLife } from "react-icons/fa";

// Toast
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  showSuccessToast,
  showErrorToast,
} from "@/utils/toastNotifications";

// Image
import Image from "next/image";

// Helpers
import { getHostnamePart } from "@/components/GlobalHostUrl";

// Config
import {
  protocal_url,
  tenant_base_url,
  urlchange_base,
  localBase,
  main_base_url,
} from "@/Config/Config";

export default function VerifyTenant() {
  const [userName, setUserName] = useState("");

  const name = getHostnamePart();
  console.log("Hostname part:", name);

  const baseUrl = localBase || "localhost:3000"; // Local base URL
  const serverUrl = protocal_url + tenant_base_url; // Server base URL
  const urlChangeBase = urlchange_base || "igniculusscrm.com";

  console.log("baseUrl:", baseUrl);
  console.log("serverUrl:", serverUrl);
  console.log("urlChangeBase:", urlChangeBase);

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

        console.log("API Response:", response);
        const { isSuccess } = response.data;

        if (isSuccess) {
          showSuccessToast("Tenant Verified!");
          setTimeout(() => {
            const baseUrl =
              import.meta.env.MODE === "development"
                ? "localhost" // Development mode
                : import.meta.env.VITE_BASE_URL || "igniculusscrm.com"; // Production mode

            const port = import.meta.env.VITE_PORT || "5173"; // Default development port
            const urlChangeBase =
              import.meta.env.VITE_URLCHANGE_BASE || "igniculusscrm.com"; // Ensure a default value for production

            let newUrl =
              baseUrl === "localhost"
                ? `http://${name}.localhost:${port}/VerifyTenant` // Development URL
                : `https://${name}.${urlChangeBase}/VerifyTenant`; // Production URL

            console.log("New URL:", newUrl);
          }, 100);
        } else {
          showErrorToast("Tenant verification failed");
        }
      } catch (error) {
        console.error("Error checking tenant:", error);
      }
    };
    verifyTenant();
  }, []);

  function handleUserName(e) {
    setUserName(e.target.value);
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const emailRegex =
      /^[A-Za-z0-9](([a-zA-Z0-9,=\.!\-#|\$%\^&\*\+/\?_`\{\}~]+)*)@(?:[0-9a-zA-Z-]+\.)+[a-zA-Z]{2,9}$/;

    if (!userName) {
      showErrorToast("Input field is empty");
      return;
    }

    try {
      const response = await axios.post(`${main_base_url}/Tenants/check1`, {
        emailId: userName,
      });

      const { isSuccess, data, message } = response.data;

      if (!isSuccess) {
        showErrorToast(message);
      } else {
        showSuccessToast("Login Successful!");
        setTimeout(() => {
          if (!data.name) {
            showErrorToast("Invalid tenant name");
            return;
          }

          const baseUrl =
            process.env.NODE_ENV === "development"
              ? "localhost"
              : urlchange_base;

          const port = "3000";

          let newUrl =
            baseUrl === "localhost"
              ? `http://${data.name}.localhost:${port}/tenantlogin`
              : `https://${data.name}.${urlChangeBase}/tenantlogin`;

          console.log("New URL:", newUrl);
          window.location.href = newUrl;
        }, 100);
      }
    } catch (error) {
      showErrorToast("Login failed. Please try again.");
      console.error("Login error:", error);
    }
  }

  return (
    <>
      <ToastContainer />
      <div className="flex flex-col min-h-screen bg-cyan-500 sm:bg-cyan-500 md:flex-row">
        {/* Part-I */}
        <div className="hidden w-2/3 min-h-screen bg-cyan md:flex flex-col items-center justify-center">
          <div className="flex flex-col items-center gap-2 h-4/5 px-16 py-8 bg-white rounded-md justify-center">
            <Image
              src="/images/IgniculussLogo.png"
              alt="Brand logo"
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
            <p className="text-xs text-center text-gray-400">
              Skip repetitive and manual sales-marketing tasks. Get highly
              productive through automation and save tons of time!
            </p>
          </div>
        </div>

        {/* Part-II */}
        <div className="flex flex-col justify-center w-full min-h-screen bg-cyan-500 md:w-1/3 md:bg-white">
          {/* Image on Top for Small Screens */}
          <div className="flex justify-center md:hidden">
            <Image
              src="/images/IgniculussLogo.png"
              alt="Brand logo"
              width={100}
              height={50}
            />
          </div>

          <div className="flex flex-col justify-center px-3 py-3 mx-10 mt-8 bg-white rounded-2xl md:mx-4">
            <div className="flex items-center gap-3 text-2xl font-semibold">
              <GiDiamonds className="hidden text-3xl md:block" />
              <h1>Check Tenant</h1>
            </div>

            <div className="mt-6">
              {/* Form */}
              <form
                className="flex flex-col gap-2 rounded-md"
                onSubmit={handleSubmit}
              >
                {/* Username */}
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
                    onChange={handleUserName}
                    placeholder="specimen@company.com"
                  />
                </label>

                <button className="py-4 mt-4 text-xs font-bold text-white rounded-md outline-none bg-cyan-500 hover:shadow-md">
                  Submit
                </button>
              </form>

              <div className="relative mt-8 text-center">
                <div className="absolute flex items-center inset-2">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative inline-block px-4 text-sm bg-white">
                  <span className="font-light">Or Join Us</span>
                </div>
              </div>
            </div>

            <div className="mx-auto mt-8 text-sm">
              <span className="font-light">
                Don’t have an Account?{" "}
                <Link href="/registration">
                  <span className="block font-semibold text-center underline ms-1 text-cyan-500 underline-offset-2 hover:scale-110 md:inline-block md:font-normal">
                    Join Us
                  </span>
                </Link>
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
