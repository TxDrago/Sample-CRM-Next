"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { getHostnamePart } from "@/components/GlobalHostUrl";
import { protocal_url, tenant_base_url } from "@/Config/Config";

export default function useSegment() {
  const bearer_token = localStorage.getItem("token");
  const name = getHostnamePart();

  const [segments, setsegments] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSegments = async () => {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${bearer_token}`,
          },
        };
        const response = await axios.get(
          `${protocal_url}${name}.${tenant_base_url}/Admin/segment/getall`,
          config,
        );
        setsegments(response.data.data);
        console.log(segments);
      } catch (err) {
        setError(err);
      }
    };

    fetchSegments();
  }, []);
  return { segments };
}
