"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { getHostnamePart } from "@/components/GlobalHostUrl";
import { protocal_url, tenant_base_url } from "@/Config/Config";

export default function useLeadSource() {
  const bearer_token = localStorage.getItem("token");
  const name = getHostnamePart();

  const [leadSource, setleadSource] = useState([]);
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
          `${protocal_url}${name}.${tenant_base_url}/Admin/pool/getall`,
          config,
        );
        setleadSource(response.data.data);
      } catch (err) {
        setError(err);
      }
    };

    fetchLeadStatus();
  }, []);

  return { leadSource };
}
