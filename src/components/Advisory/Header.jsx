"use client"; // Required for client-side hooks

import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import axios from "axios";

import {
  protocal_url,
  tenant_base_url,
  main_base_url,
} from "@/Config/Config";

import { IoMdNotifications, IoMdSettings } from "react-icons/io";
import { RiBuilding2Line } from "react-icons/ri";
import { MdLogout } from "react-icons/md";
import { FaBars, FaBarsStaggered } from "react-icons/fa6";
import { FiMessageSquare } from "react-icons/fi";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  showSuccessToast,
  showErrorToast,
} from "@/utils/toastNotifications";

import { Badge, Menu, MenuItem } from "@mui/material";

import { getHostnamePart } from "@/components/GlobalHostUrl";

export default function Header({ toggle, setToggle }) {
  const router = useRouter();
  const pathname = usePathname();
  const name = getHostnamePart();

  const [BusinessType, setBusinessType] = useState("");
  const [tenantId, setTenantId] = useState("");
  const [activeKey, setActiveKey] = useState(null);
  const [allMessage, setAllMessage] = useState([]);
  const [activeUsers, setActiveUsers] = useState([]);
  const [userMessageCounts, setUserMessageCounts] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [totalUnreadMessages, setTotalUnreadMessages] = useState(0);

  useEffect(() => {
    const storedType = localStorage.getItem("businessType") || "";
    setBusinessType(storedType);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const registrationdata = localStorage.getItem("registrationdata");
    const userDetail = localStorage.getItem("userDetail");

    if (token && (userDetail || registrationdata)) {
      const registrationDataParsed = JSON.parse(registrationdata || "{}");
      setTenantId(registrationDataParsed.tenantId || "");

      if (window.location.pathname === `/panel/${BusinessType}`) {
        // router.push(`/panel/${BusinessType}/dashboard`);
      }
    } else {
      router.push("/tenantlogin");
    }
  }, [router, BusinessType]);

  useEffect(() => {
    if (tenantId) {
      fetchWelcomeData();
    }
  }, [tenantId]);

  const fetchWelcomeData = async () => {
    try {
      const response = await axios.get(`${main_base_url}/Tenants/gettenant/${tenantId}`);
      console.log(response);
    } catch (error) {
      console.error("Error fetching welcome data:", error);
    }
  };

  const signout = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      const response = await axios.post(
        `${protocal_url}${name}.${tenant_base_url}/Users/logout`,
        {},
        config
      );

      if (response.data.isSuccess) {
        localStorage.clear();
        showSuccessToast("Logout Successful");
        setTimeout(() => {
          router.push("/tenantlogin");
        }, 2000);
      } else {
        showErrorToast("Logout Failed. Try again.");
      }
    } catch (error) {
      console.error("Error during logout:", error.response || error.message);
      showErrorToast("An error occurred while logging out.");
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchAllMessages();

    const interval = setInterval(() => {
      fetchUsers();
      fetchAllMessages();
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const fetchUsers = async () => {
    const token = localStorage.getItem("token");
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const response = await axios.get(
        `${protocal_url}${name}.${tenant_base_url}/Chat/activenotactivestatus`,
        config
      );
      setActiveUsers(response.data?.data || []);
    } catch (error) {
      console.error("Error fetching user status:", error);
    }
  };

  const fetchAllMessages = async () => {
    const token = localStorage.getItem("token");
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const response = await axios.get(
        `${protocal_url}${name}.${tenant_base_url}/Chat/getAllrecievemessages`,
        config
      );
      setAllMessage(response.data?.data || []);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (activeUsers.length && allMessage.length) {
        const counts = activeUsers
          .map((user) => {
            const count = allMessage.filter(
              (msg) => msg.senderId === user.userId && msg.status === false
            ).length;
            return count > 0
              ? { userId: user.userId, userName: user.fullName, count }
              : null;
          })
          .filter(Boolean);

        const total = counts.reduce((sum, u) => sum + u.count, 0);

        setUserMessageCounts(counts);
        setTotalUnreadMessages(total);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [activeUsers, allMessage]);

  const handleDropdownOpen = (event) => setAnchorEl(event.currentTarget);
  const handleDropdownClose = () => setAnchorEl(null);

  const handleNavigate = (userName, userId) => {
    handleDropdownClose();
    router.push(`/panel/${BusinessType}/messaging?userId=${userId}&userName=${userName}`);
  };

  const menu = [
    {
      key: 2,
      logo: (
        <Badge
          badgeContent={totalUnreadMessages}
          color="error"
          overlap="circular"
          classes={{ badge: "bg-green-500" }}
        >
          <FiMessageSquare />
        </Badge>
      ),
      dropdown: true,
      functionality: handleDropdownOpen,
    },
    { key: 3, logo: <IoMdNotifications /> },
    { key: 5, logo: <IoMdSettings />, link: `/panel/${BusinessType}/setting` },
    { key: 6, logo: <MdLogout />, functionality: signout },
  ];

  useEffect(() => {
    const activeItem = menu.find((item) => item.link && pathname.includes(item.link));
    setActiveKey(activeItem ? activeItem.key : null);
  }, [pathname]);

  return (
    <>
      <ToastContainer />
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-4">
          <button
            className="rounded-full bg-cyan-500 p-2 text-white"
            onClick={() => setToggle(!toggle)}
          >
            {toggle ? <FaBarsStaggered /> : <FaBars />}
          </button>
          <div className="flex items-center gap-2 border p-1">
            <RiBuilding2Line size={24} />
            <span className="border-b-2 border-gray-600 font-bold uppercase">
              {name}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {menu.map(({ key, logo, link, functionality }) => (
            <div
              key={key}
              className={`cursor-pointer p-2 ${
                activeKey === key ? "bg-gray-200 text-cyan-600 rounded-full" : "text-gray-700"
              }`}
              onClick={(e) => {
                if (functionality) functionality(e);
                setActiveKey(key);
              }}
            >
              {link ? <Link href={link}>{logo}</Link> : logo}
            </div>
          ))}
        </div>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleDropdownClose}
        >
          {userMessageCounts?.map((msg, idx) => (
            <MenuItem key={idx} onClick={() => handleNavigate(msg.userName, msg.userId)}>
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-blue-500 text-white flex items-center justify-center">
                  {msg.userName.charAt(0)}
                </div>
                <span>{msg.userName}</span>
                <span className="text-red-500 font-bold">({msg.count})</span>
              </div>
            </MenuItem>
          ))}
        </Menu>
      </div>
    </>
  );
}

Header.propTypes = {
  toggle: PropTypes.bool,
  setToggle: PropTypes.func,
};
