"use client";

//react
import { useRouter } from "next/navigation";

import { useState, useEffect } from "react";

import axios from "axios";

import Image from "next/image";

import { main_base_url, protocal_url, tenant_base_url } from "@/Config/Config";

import { IoIosEye, IoIosEyeOff } from "react-icons/io";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  showSuccessToast,
  showErrorToast,
} from "./../../utils/toastNotifications";

import { GiDiamonds } from "react-icons/gi";

export default function ForgetResetPassword() {
  const router = useRouter();

  const [email, setemail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordEye, setPasswordEye] = useState(false);

  const fullURL = window.location.href;
  const url = new URL(fullURL);
  const subdomain = url.hostname.split(".")[0];

  useEffect(() => {
    const storedEmail = localStorage.getItem("myData_forget");
    if (storedEmail) {
      setemail(storedEmail);
    } else {
      console.error("Email is not available in localStorage.");
    }
  }, []);

  function handlepassword(e) {
    let pass = e.target.value;
    setPassword(pass);
  }

  function handleConfirmPassword(e) {
    let cnfPass = e.target.value;
    setConfirmPassword(cnfPass);
  }

  function togglePasswordEye() {
    setPasswordEye(!passwordEye);
  }

  // Password validation function
  function validatePassword(password) {
    const minLength = 8;
    const maxLength = 16;
    const uppercasePattern = /[A-Z]/;
    const specialCharPattern = /[!@#$%^&*(),.?":{}|<>]/;

    if (password.length < minLength) {
      showErrorToast(`Password must be at least ${minLength} characters long`);
      return false;
    }
    if (password.length > maxLength) {
      showErrorToast(`Password must not exceed ${maxLength} characters`);
      return false;
    }
    if (!uppercasePattern.test(password)) {
      showErrorToast("Password must contain at least one uppercase letter");
      return false;
    }
    if (!specialCharPattern.test(password)) {
      showErrorToast("Password must contain at least one special character");
      return false;
    }
    return true;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate password before submitting
    if (!validatePassword(password)) {
      return; // Stop form submission if password is invalid
    }

    // Check if passwords match
    if (password !== confirmPassword) {
      showErrorToast("Passwords do not match");
      return;
    }

    const formValue = {
      email: email,
      newPassword: password,
      confirmPassword: confirmPassword,
    };

    try {
      const response = await axios.post(
        `${protocal_url}${subdomain}.${tenant_base_url}/Users/reset/password`,
        formValue
      );
      const { isSuccess, message } = response.data;
      if (isSuccess) {
        showSuccessToast(message);
        router.push("/forgetpasssucess");
      }
    } catch (error) {
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

        {/* Part-II */}
        <div className="flex min-h-screen w-full flex-col justify-center bg-cyan-500 md:w-1/3 md:bg-white">
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
              <p className="text-sm text-gray-500">
                Your password must be different from the previous used
                passwords.
              </p>
            </div>

            <div className="mt-8 md:mt-8">
              <form onSubmit={handleSubmit} className="mx-10 flex flex-col">
                {/* Password */}
                <div className="flex flex-col gap-4">
                  <label
                    htmlFor="password"
                    className="relative block text-xs font-medium text-gray-700"
                  >
                    Set New Password
                    <input
                      type={passwordEye ? "text" : "password"}
                      name="password"
                      className="mt-1 w-full rounded-md border border-gray-300 px-2 py-2 pr-12 text-sm outline-none"
                      value={password}
                      onChange={handlepassword}
                      placeholder="Password"
                    />
                    <button
                      type="button"
                      onClick={togglePasswordEye}
                      className="absolute inset-y-0 right-2 top-6 flex items-center text-gray-500 transition-opacity duration-300 ease-in-out"
                    >
                      {passwordEye ? (
                        <IoIosEye size={22} />
                      ) : (
                        <IoIosEyeOff size={22} />
                      )}
                    </button>
                  </label>

                  {/* Confirm Password */}
                  <label
                    htmlFor="confirmPassword"
                    className="relative block text-xs font-medium text-gray-700"
                  >
                    Re-Enter Password
                    <input
                      type={passwordEye ? "text" : "password"}
                      name="password"
                      className="mt-1 w-full rounded-md border border-gray-300 px-2 py-2 pr-12 text-sm outline-none"
                      value={confirmPassword}
                      onChange={handleConfirmPassword}
                      placeholder="Confirm Password"
                    />
                    <button
                      type="button"
                      onClick={togglePasswordEye}
                      className="absolute inset-y-0 right-2 top-6 flex items-center text-gray-500 transition-opacity duration-300 ease-in-out"
                    >
                      {passwordEye ? (
                        <IoIosEye size={22} />
                      ) : (
                        <IoIosEyeOff size={22} />
                      )}
                    </button>
                  </label>
                </div>

                <button className="mt-16 rounded-md bg-cyan-500 py-4 text-xs font-bold text-white outline-none">
                  Reset Password
                </button>
              </form>
            </div>
            <div className="mx-auto mt-8 text-sm">
              <span className="font-medium text-cyan-500"></span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
