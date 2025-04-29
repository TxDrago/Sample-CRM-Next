"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { tenant_base_url, protocal_url } from "../../../../Config/config";

export default function GlobalUserNameComponent({
  fieldName,
  selectedValue,
  setSelectedValue,
  selectedUserId,
  setSelectedUserId,
  setSelectedUser,
  name,
  className = "",
}) {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    // Safely access window on client
    const fullURL = window.location.href;
    const url = new URL(fullURL);
    const subdomain = url.hostname.split(".")[0];

    fetchUsers(subdomain);
  }, []);

  const fetchUsers = async (subdomain) => {
    const bearer_token = localStorage.getItem("token");
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${bearer_token}`,
        },
      };
      const response = await axios.get(
        `${protocal_url}${subdomain}.${tenant_base_url}/Setting/users/byusertoken`,
        config
      );
      setUsers(response.data?.data || []);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const handleChange = (e) => {
    const value = e.target.value;
    setSelectedValue(value);

    const selectedUser = users.find((user) => user[fieldName] === value);
    if (selectedUser) {
      setSelectedUser(selectedUser);
      setSelectedUserId(selectedUser.userId);
    } else {
      setSelectedUser(null);
      setSelectedUserId(null);
    }
  };

  return (
    <select
      className={className}
      value={selectedValue}
      onChange={handleChange}
      name={name}
    >
      <option value="" disabled>
        Select
      </option>
      {users.map((user) => (
        <option key={user.userId} value={user[fieldName]}>
          {user[fieldName]}
        </option>
      ))}
    </select>
  );
}
