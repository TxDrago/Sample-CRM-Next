"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { getHostnamePart } from "@/components/GlobalHostUrl";
import { protocal_url, tenant_base_url } from "@/Config/Config";

export default function useManagedBy() {
  const bearer_token = localStorage.getItem("token");
  const name = getHostnamePart();

  const [managedBy, setManagedBy] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchManagedBy = async () => {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${bearer_token}`,
          },
        };
        const response = await axios.get(
          `${protocal_url}${name}.${tenant_base_url}/Setting/users/byusertoken`,
          config,
        );
        setManagedBy(response.data.data);
      } catch (err) {
        setError(err);
      }
    };

    fetchManagedBy();
  }, []);
  return { managedBy };
}
