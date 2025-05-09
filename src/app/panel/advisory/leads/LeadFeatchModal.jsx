"use client";

//react
import { useState } from "react";
//props
import PropTypes from "prop-types";
//axios
import axios from "axios";
//url
import { tenant_base_url, protocal_url } from "@/Config/Config";
//name
import { ImCancelCircle } from "react-icons/im";
import { getHostnamePart } from "@/components/GlobalHostUrl";

//toast
import { ToastContainer } from "react-toastify";
import {
  showSuccessToast,
  showErrorToast,
} from "@/utils/toastNotifications";

const LeadFeatchModal = ({ onClose }) => {
  const bearer_token = localStorage.getItem("token");
  const name = getHostnamePart();

  const [loading, setLoading] = useState(false);
  const [leadCount, setLeadCount] = useState("");

  const handleInputChange = (e) => {
    const { value } = e.target;

    setLeadCount(value);
  };

  //--------------------------------------------------handleSubmit-----------------------------------

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!bearer_token) {
      showErrorToast("No token found, please log in again.");
      return;
    }

    setLoading(true);

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${bearer_token}`,
          "Content-Type": "application/json",
        },
      };

      const formData_POST = {
        leadCount: leadCount,
      };

      const response = await axios.post(
        `${protocal_url}${name}.${tenant_base_url}/LeadOpration/leads/fetchleads`,
        formData_POST,
        config,
      );

      if (response.data.status === 200) {
        toast.success(response.data.message, {
          onClose: () => {
            onClose(); // Close modal after the toast is dismissed
          },
          autoClose: 2000,
          theme: "colored",
        });
      } else if (response.data.status === 402) {
        showErrorToast(response.data.message);
      }
    } catch (error) {
      if (error.response) {
        if (error.response.status === 400) {
          showErrorToast(error.response.data.message);
        } else if (error.response.status === 402) {
          showErrorToast(error.response.data.message);
        } else {
          showErrorToast(error.response.data.message);
        }
      } else {
        showErrorToast("Network error. Please try again.", {
          onClose: () => {
            console.log("Network error toast closed");
          },
        });
      }
      console.error("Error response:", error.response);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ToastContainer />

      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20">
        <div className="w-10/12 rounded-lg bg-white sm:w-4/12">
          <div className="flex items-center justify-center rounded-t-lg bg-cyan-500 px-2 py-2 text-xl font-medium text-white">
            <h2 className="mx-auto">Fetch Leads</h2>
            <ImCancelCircle onClick={onClose} size={22} />
          </div>
          <form onSubmit={handleSubmit} className="px-4">
            <div className="mt-3">
              <h1 className="text-md rounded-t-lg bg-cyan-500 px-4 py-2 font-medium text-white">
                Details
              </h1>
              <div className="rounded-b-xl border-2 border-t-0 border-cyan-500 bg-white px-1">
                <div className="grid gap-2 p-2">
                  <div className="flex space-x-4">
                    <div className="flex w-full flex-col">
                      <label
                        htmlFor="leadCount"
                        className="text-sm font-medium text-gray-700"
                      >
                        Lead Count:
                      </label>
                      <input
                        type="number"
                        name="leadCount"
                        id="leadCount"
                        value={leadCount}
                        onChange={handleInputChange}
                        className="mt-1 rounded-md border border-gray-300 p-2"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-2 justify-end gap-5">
              <button
                type="submit"
                className="mb-3 rounded-md border-2 border-cyan-500 bg-cyan-500 p-2 text-white hover:bg-white hover:text-cyan-500"
                disabled={loading}
              >
                {loading ? "Sending..." : "Submit"}
              </button>
              <button
                type="button"
                className="mb-3 rounded-md border-2 border-gray-300 p-2 font-semibold text-gray-500 hover:bg-gray-300 hover:text-white"
                onClick={onClose}
              >
                Close
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

LeadFeatchModal.propTypes = {
  onClose: PropTypes.func.isRequired,
};

export default LeadFeatchModal;
