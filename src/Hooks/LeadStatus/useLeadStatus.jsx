"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { getHostnamePart } from "@/components/GlobalHostUrl";
import { protocal_url, tenant_base_url } from "@/Config/Config";

export default function useLeadStatus() {
  const bearer_token = localStorage.getItem("token");
  const name = getHostnamePart();

  const [leadStatus, setLeadStatus] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLeadStatus = async () => {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${bearer_token}`,
          },
        };
        const response = await axios.get(
          `${protocal_url}${name}.${tenant_base_url}/Admin/leadstatus/getall`,
          config,
        );
        setLeadStatus(response.data.data);
      } catch (err) {
        setError(err);
      }
    };

    fetchLeadStatus();
  }, []); // Correct dependency array

  return { leadStatus };
}
