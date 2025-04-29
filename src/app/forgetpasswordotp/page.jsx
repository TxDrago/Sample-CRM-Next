"use client";

//react
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

import axios from "axios";

import Image from "next/image";

import { main_base_url } from "@/Config/Config";

import { GiDiamonds } from "react-icons/gi";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  showSuccessToast,
  showErrorToast,
} from "./../../utils/toastNotifications";

export default function ForgetPassOTP() {
  const router = useRouter();
  const [otp, setotp] = useState("");

  //otp resend state
  const [resendDisabled, setResendDisabled] = useState(true);

  const [countdown, setCountdown] = useState(120);

  const [email, setemail] = useState("");

  //-----------------Email Read-----------------
  useEffect(() => {
    const storedEmail = localStorage.getItem("myData_forget");
    if (storedEmail) {
      setemail(storedEmail);
    } else {
      console.error("Email is not available in localStorage.");
    }
  }, []);

  //-----------------Resend OTP TIMER-----------------
  useEffect(() => {
    let timer;
    if (resendDisabled) {
      timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev === 1) {
            clearInterval(timer);
            setResendDisabled(false); // Enable resend button
            return 120;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [resendDisabled]);

  //-----------------Resend OTP Function-----------------
  const handleResend = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post(`${main_base_url}/Users/send/otp`, {
        Email: email,
      });
      if (response.data.status === 200) {
        setResendDisabled(true); // Disable the resend button
        showSuccessToast("OTP Sent");
      } else {
        showErrorToast("Failed To Sent OTP");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to resend OTP: " + error.message);
    }
  };

  //-----------------HandleChange OTP INPUT-----------------
  const handleChange = (e) => {
    let OTP = e.target.value;
    setotp(OTP);
    console.log(otp);
  };

  //-----------------Handle SUBMIT-----------------
  const handleSubmit = async (event) => {
    event.preventDefault();

    //validation Added for OTP
    if (otp.length < 1) {
      showErrorToast("OTP field is empty");
    } else if (otp.length > 6) {
      showErrorToast("OTP cannot be more than 6 digits");
    } else if (otp.length < 6) {
      showErrorToast("OTP cannot be less than 6 digits");
    }

    const formValues = {
      emailid: email,
      otp: otp,
    };

    try {
      const response = await axios.post(
        `${main_base_url}/Users/verify/otp`,
        formValues
      );
      const { message, isSuccess } = response.data;
      if (isSuccess) {
        showSuccessToast(message);
        router.push("/forgetresetpass");
      } else {
        showErrorToast("OTP verification failed");
      }
    } catch (error) {
      console.error("Error:", error);
      showErrorToast(error.response.data.message);
    }
  };
  return (
    <>
      <ToastContainer />
      <div className="flex min-h-screen flex-col bg-cyan-500 md:flex-row">
        {/*----------> Part-I <---------- */}
        <div className="bg-cyan hidden min-h-screen w-2/3 flex-col items-center justify-center md:flex">
          <div className="flex flex-col items-center justify-center gap-2 rounded-md bg-white px-16 py-10">
            <Image
              src="/images/IgniculussLogo.png"
              alt="Brandlogo"
              width={80}
              height={80}
            />
            <Image
              src="/images/forgetPassword.png"
              alt="forgetPassword"
              width={300}
              height={150}
            />
            <div className="flex text-3xl font-semibold">
              <GiDiamonds className="mt-1 text-cyan-500" />
              <h1 className="">
                Don't worry <br />
                we'll help you.
              </h1>
            </div>
            <div>
              <p className="text-center text-xs text-gray-400">
                Skip repetitive and manual sales-marketing tasks. Get highly
                <br />
                productive through automation and save tons of time!
              </p>
            </div>
          </div>
        </div>

        {/*----------> Part-II <---------- */}
        <div className="flex min-h-screen w-full flex-col justify-center bg-cyan-500 md:w-1/3 md:bg-white">
          {/* Image on Top for Small Screens */}
          <div className="flex justify-center md:hidden">
            <Image
              src="/images/IgniculussLogo.png"
              alt="Brandlogo"
              width={80}
              height={80}
            />
          </div>

          <div className="mx-10 mt-8 flex flex-col justify-center rounded-2xl bg-white px-3 py-3 md:mx-4">
            <div className="flex items-center gap-3 text-2xl font-semibold">
              <GiDiamonds className="mb-6 hidden text-3xl md:block" />
              <h1 className="">
                Forgot your <br />
                Password
              </h1>
            </div>

            <div className="flex sm:mx-10">
              <p className="text-gray-500">Don't worry about your account</p>
            </div>

            <div className="mt-8 md:mt-16">
              <form onSubmit={handleSubmit} className="mx-10 flex flex-col">
                <label
                  htmlFor="forgetemail"
                  className="text-xs font-medium text-gray-700"
                >
                  Enter OTP
                </label>
                <input
                  type="number"
                  name="otp"
                  value={otp}
                  className="mt-1 w-full rounded-md border border-gray-300 px-2 py-2 text-sm outline-none"
                  onChange={handleChange}
                  placeholder="000000"
                />
                <div className="mt-6 flex flex-col items-center justify-center gap-2">
                  <div className="text-sm">
                    <p>Code has been sent to your Mail Address </p>
                    <p className="text-center text-cyan-500">{email}</p>
                  </div>
                  <div className="mt-6">
                    <span className="text-sm">This code will expire in </span>
                    <span className="text-red-500">{countdown} </span>
                    <span className="text-sm">sec's </span>
                  </div>
                </div>
                <button className="mt-3 rounded-md bg-cyan-500 py-4 text-xs font-bold text-white outline-none">
                  Verify
                </button>
                <div className="mt-3 flex items-center justify-between">
                  <div
                    className={`cursor-pointer text-left text-sm text-slate-900 ${
                      resendDisabled ? "cursor-not-allowed opacity-50" : ""
                    }`}
                    onClick={!resendDisabled ? handleResend : null}
                  >
                    {resendDisabled ? `Resend` : "Resend"}
                  </div>
                  <div className="text-right text-sm">
                    <Link href="/" className="text-cyan-500 underline">
                      Back to login
                    </Link>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
