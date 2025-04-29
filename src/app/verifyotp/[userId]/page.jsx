"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "next/navigation";
// Config 
import {  main_base_url } from "@/Config/Config";

//images
import Image from "next/image";
// import companyUploadIMG from "../../../../public/images/companyUploadIMG.png";
import { GiDiamonds } from "react-icons/gi";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  showSuccessToast,
  showErrorToast,
} from "../../../utils/toastNotifications";

const VerifyOtp = () => {
  const { userId } = useParams();

  const [otp, setOtp] = useState("");

  const [countdown, setCountdown] = useState(60);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [companyName, setCompanyName] = useState("");
  const [base64Image, setBase64Image] = useState("");
  const [emailreg, setEmailreg] = useState("");

  const [resendDisabled, setResendDisabled] = useState(true); // Initialize to true

  useEffect(() => {
    const registration = JSON.parse(localStorage.getItem("registrationdata"));
    if (registration && registration.data && registration.data.email) {
      // console.log(registration.data.email)
      setEmailreg(registration.data.email);
    } else {
      console.error("Registration data or email is not available.");
    }
  }, []);

  // Countdown logic for OTP resend
  useEffect(() => {
    let timer;
    if (resendDisabled) {
      timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev === 1) {
            clearInterval(timer);
            setResendDisabled(false); // Re-enable resend after countdown finishes
            return 120;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [resendDisabled]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setBase64Image(event.target.result.split(",")[1]);
        document.getElementById("profileImage").src = event.target.result;
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageClick = () => {
    document.getElementById("imageInput").click();
  };

  //OTP Handler ----> Submit Button
  const handleSubmit = async (event) => {
    event.preventDefault();
    //validation Added for OTP
    if (otp.length < 1) {
      showErrorToast("Please enter OTP");
    } else if (otp.length > 6) {
      showErrorToast("OTP cannot be more than 6 digits");
    } else if (otp.length < 6) {
      showErrorToast("OTP cannot be less than 6 digits");
    }

    const formValues = {
      emailid: emailreg,
      otp: otp,
    };

    try {
      const response = await axios.post(
        `${main_base_url}/Users/verify/otp`,
        formValues
      );
      if (response.data.status === 200) {
        // Toggle the modal to open it
        toggleModal();
      }
    } catch (error) {
      showErrorToast(error.response.data.message);
    }
  };

  //OTP Handler ----> Resend Button
  const handleResend = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post(`${main_base_url}/Users/send/otp`, {
        Email: emailreg,
      });
      if (response.data.status === 200) {
        setResendDisabled(true);
      } else {
        alert("Failed to resend OTP");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to resend OTP: " + error.message);
    }
  };

  //Company Name + Img Verification form SUBMIT
  const handleUpload = async (e) => {
    e.preventDefault();
    const businessType = localStorage.getItem("registrationBusinessType");
    const formData = {
      userId: userId,
      name: companyName?.replace(/\s+/g, ""),
      host: companyName?.replace(/\s+/g, "") + ".copulaa.com",
      tenentLogo: base64Image,
      connectionString: "string",
      tenantEmail: emailreg,
      domain: "",
      bussinessType: businessType,
    };
    try {
      const response = await axios.post(`${main_base_url}/Tenants`, formData, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      console.log(response.data);
      const data = response.data;
      if (data.isSuccess === false) {
        // console.log('Success:', response.data.tenantId);
        showErrorToast(data.message);
      } else {
        showSuccessToast("Company Added Successfully");
        localStorage.setItem("companyData", JSON.stringify(data));
        localStorage.setItem("myData", response.data.tenantId);
        const host = response.data.tenant.host;
        console.log(response);

        const tenantId = response.data.tenant.tenantId;

        // Check if running on localhost or server

        const baseUrl =
        process.env.NODE_ENV === "development"
          ? "localhost" // Development mode
          : process.env.NEXT_PUBLIC_BASE_URL || "igniculusscrm.com"; // Production mode
      
      const port = process.env.NEXT_PUBLIC_PORT || "3000"; // Default development port
      
      const urlChangeBase =
        process.env.NEXT_PUBLIC_URLCHANGE_BASE || "igniculusscrm.com"; // Default production domain

        const subdomain = host.split(".")[0]; // Extract subdomain (e.g., "companyname")

        const newUrl =
          baseUrl === "localhost"
            ? `http://${subdomain}.localhost:${port}/welcome/${tenantId}` // Development URL
            : `https://${subdomain}.${urlChangeBase}/welcome/${tenantId}`; // Production URL

        console.log("Redirecting to:", newUrl);
        window.location.href = newUrl; // Perform redirection
      }
    } catch (error) {
      console.error("Error:", error.response.data.errors.tenant);
      showSuccessToast(error.response.data.errors.tenant);
    }
  };

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  return (
    <>
      <ToastContainer />
      {isModalOpen && (
        <Modal
          companyName={companyName}
          setCompanyName={setCompanyName}
          base64Image={base64Image}
          handleImageClick={handleImageClick}
          handleImageChange={handleImageChange}
          handleUpload={handleUpload}
          toggleModal={toggleModal}
        />
      )}

      <div className="flex items-center justify-center min-h-screen bg-cyan-500">
        <div className="items-center justify-center hidden h-screen w-2/3 md:flex">
          <WelcomeSection />
        </div>
        <div className="flex items-center justify-center w-full min-h-screen bg-cyan md:w-1/3 md:bg-white">
          <OtpForm
            otp={otp}
            setOtp={setOtp}
            resendDisabled={resendDisabled}
            countdown={countdown}
            handleResend={handleResend}
            handleSubmit={handleSubmit}
            emailreg={emailreg}
          />
        </div>
      </div>
    </>
  );
};

const WelcomeSection = () => (
  <div className="flex flex-col bg-cyan-500 md:flex-row h-screen">
    <div className="flex-col items-center justify-center hidden bg-cyan md:flex">
      <div className="flex flex-col justify-center gap-2 h-4/5 px-6 py-12 bg-white rounded-md">
        <Image
          src="/images/IgniculussLogo.png"
          alt="Brandlogo"
          width={80}
          height={80}
          className="mx-auto"
        />
        <Image
          src="/images/verifyOTP.png"
          alt="sample"
          width={600}
          height={1200}
          className="!w-3/4 !mx-auto !h-2/3"
        />
        <div className="flex justify-center text-3xl font-semibold">
          <GiDiamonds className="place-content-start text-cyan-500" />
          <h1 className="">Hello, Igniculuss</h1>
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
  </div>
);

const OtpForm = ({
  otp,
  setOtp,
  resendDisabled,
  countdown,
  handleResend,
  handleSubmit,
  emailreg,
}) => (
  <div className="flex flex-col justify-center w-full min-h-screen md:w-3/3 bg-cyan-500 md:bg-white">
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
        <h1 className="">Verify your Sign-up</h1>
      </div>

      <div className="text-sm text-slate-900">
        Enter the one-time password sent to your Email ID.
      </div>

      <div className="mt-8 md:mt-16">
        <form onSubmit={handleSubmit} className="flex flex-col">
          <div className="flex justify-between mb-2">
            <span>{emailreg}</span>
            {/* Change button on email 
            <Link to="/" className="text-sm underline text-cyan-500">
              Change
            </Link>
            */}
          </div>
          <input
            type="number"
            className="h-10 px-3 text-xs !border border-gray-400 rounded-md focus:outline-none"
            placeholder="XXX XXX"
            maxLength={6}
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />
          <div className="flex items-center justify-between mt-3">
            <div
              className={`cursor-pointer text-left text-sm text-slate-900 ${
                resendDisabled ? "cursor-not-allowed opacity-50" : ""
              }`}
              onClick={!resendDisabled ? handleResend : null}
            >
              {resendDisabled ? `Resend in ${countdown}s` : "Resend"}
            </div>
            <div className="text-sm text-right"></div>
          </div>
          <div className="mt-12">
            <button
              type="submit"
              className="w-full py-3 text-sm text-white rounded-lg bg-cyan-500"
            >
              Verify
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
);

const Modal = ({
  companyName,
  setCompanyName,
  base64Image,
  handleImageClick,
  handleImageChange,
  handleUpload,
  toggleModal,
}) => {
  // Just use public path
  const defaultCompanyImage = "/images/companyUploadIMG.png";

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50">
      <div className="w-full p-12 mx-10 bg-white rounded-lg md:w-2/3 lg:w-1/3">
        <div className="flex mb-4 text-xl font-semibold text-center sm:text-2-xl">
          <span className="text-gray-400 cursor-pointer" onClick={toggleModal}>
            X
          </span>
          <span className="mx-auto">Add Company Logo</span>
        </div>

        <form
          onSubmit={handleUpload}
          className="flex flex-col items-center gap-6"
        >
          <div className="flex flex-col w-full gap-8">
            <input
              id="imageInput"
              type="file"
              onChange={handleImageChange}
              accept="image/*"
              hidden
            />

            <Image
              id="profileImage"
              src={
                base64Image
                  ? `data:image/png;base64,${base64Image}`
                  : defaultCompanyImage
              }
              alt="Profile"
              width={96} // w-24
              height={96} // h-24
              onClick={handleImageClick}
              className="mx-auto text-center border rounded-full cursor-pointer"
            />

            <p className="text-xs text-center text-gray-500">
              Supported formats: JPEG, PNG
            </p>
            <div className="flex flex-col gap-2">
              <label
                htmlFor="companyName"
                className="font-medium text-gray-700 text-md "
              >
                Company Name
              </label>
              <input
                id="companyName"
                type="text"
                placeholder="Company Name"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="w-full p-2 mb-4 border rounded-md"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full px-4 py-4 text-white rounded-lg bg-cyan-500"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default VerifyOtp;
