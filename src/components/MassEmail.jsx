"use client";
import { useState } from "react";
import PropTypes from "prop-types";
import axios from "axios";

// Folder Imported
import { tenant_base_url, protocal_url } from "@/Config/Config";
import { getHostnamePart } from "@/components/GlobalHostUrl";

const MassEmail = ({ emails, onClose }) => {
  const bearer_token = localStorage.getItem("token");
  const name = getHostnamePart();

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false); // Loading state

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!bearer_token) {
      alert("No token found, please log in again.");
      return;
    }

    setLoading(true); // Set loading to true when starting the request

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${bearer_token}`,
          "Content-Type": "application/json",
        },
      };

      const formData_POST = {
        emails: emails, // Use the emails array from props
        description: message, // Use the message state for the email body
      };

      console.log(
        "POST URL:",
        `${protocal_url}${name}.${tenant_base_url}/Lead/lead/massemail`,
      );
      console.log("formData_POST:", formData_POST);

      // Make the POST request
      await axios.post(
        `${protocal_url}${name}.${tenant_base_url}/Lead/lead/massemail`,
        formData_POST,
        config,
      );

      alert("Emails sent successfully!");
      onClose(); // Close modal after sending email
    } catch (error) {
      console.error("Error response:", error.response);

      if (error.response?.data?.errors) {
        const validationErrors = error.response.data.errors;
        console.error("Validation errors:", validationErrors);

        let errorMessage = "Validation errors:\n";
        for (const field in validationErrors) {
          if (Object.prototype.hasOwnProperty.call(validationErrors, field)) {
            errorMessage += `${field}: ${validationErrors[field].join(", ")}\n`;
          }
        }
        alert(errorMessage);
      } else {
        alert("An error occurred. Please try again.");
      }
    } finally {
      setLoading(false); // Always set loading to false after the request
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-lg rounded-lg bg-white p-6 shadow-lg">
        <h2 className="mb-4 text-xl font-semibold">Mass Email</h2>

        {/* Display Selected Emails */}
        <div className="mb-4">
          <h4 className="font-medium">Selected Emails:</h4>
          <div className="h-24 overflow-y-auto rounded border bg-gray-100 p-2">
            {emails.length > 0 ? (
              emails.map((email, index) => (
                <div key={index} className="text-sm">
                  {email}
                </div>
              ))
            ) : (
              <p>No emails selected.</p>
            )}
          </div>
        </div>

        {/* Textarea for Mass Email */}
        <textarea
          className="mb-4 w-full rounded border p-2"
          rows="4"
          placeholder="Write your message here..."
          value={message}
          onChange={(e) => setMessage(e.target.value)} // Update the message state
        ></textarea>

        {/* Button Container */}
        <div className="flex justify-end">
          <button
            className={`mr-2 rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 ${loading ? "cursor-not-allowed opacity-50" : ""}`}
            onClick={handleSubmit} // Call handleSubmit to send email
            disabled={loading} // Disable button while loading
          >
            {loading ? "Sending..." : "Send"}{" "}
            {/* Change button text based on loading state */}
          </button>
          <button
            className="rounded bg-gray-300 px-4 py-2 text-black hover:bg-gray-400"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

// Define prop types
MassEmail.propTypes = {
  emails: PropTypes.arrayOf(PropTypes.string).isRequired,
  onClose: PropTypes.func.isRequired,
};

export default MassEmail;
