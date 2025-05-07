"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import axios from "axios";
import PropTypes from "prop-types";

// Icons
import { RiHome4Line } from "react-icons/ri";
import { GrContactInfo } from "react-icons/gr";
import { MdOutlineContactPhone, MdOutlineEmail } from "react-icons/md";
import { BsGraphUpArrow } from "react-icons/bs";
import { SiAmazonsimpleemailservice } from "react-icons/si";
import { FiUsers } from "react-icons/fi";
import { IoDocumentTextOutline } from "react-icons/io5";
import { VscGraph } from "react-icons/vsc";
import { FaRegHandshake } from "react-icons/fa6";
import { PiChatsBold } from "react-icons/pi";

// Assets (put your `noAvatar.png` in /public/images)
import Image from "next/image";
// import noAvatar from "@/public/images/noAvatar.png";

import { getHostnamePart } from "@/components/GlobalHostUrl";
import { main_base_url } from "@/Config/Config";

export default function SidebaBar({ toggle }) {
  const name = getHostnamePart();
  const [welcomedata, setWelcomeData] = useState({});
  const [businessType, setBusinessType] = useState("");
  const [active, setActive] = useState(1);

  useEffect(() => {
    const storedType = localStorage.getItem("businessType") || "";
    setBusinessType(storedType);

    const activeKey = Number(localStorage.getItem("activeSidebarKey")) || 1;
    setActive(activeKey);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${main_base_url}/Tenants/gettenant/${name}`
        );
        setWelcomeData(response.data);
      } catch (error) {
        console.error("Error fetching welcome data:", error);
      }
    };
    fetchData();
  }, [name]);

  useEffect(() => {
    localStorage.setItem("activeSidebarKey", active);
  }, [active]);

  const sidebarOptions = {
    advisory: [
      {
        key: 1,
        data: "Home",
        link: `/panel/${businessType}/dashboard`,
        icon: <RiHome4Line />,
      },
      {
        key: 2,
        data: "Leads",
        link: `/panel/${businessType}/leads`,
        icon: <GrContactInfo />,
      },
      {
        key: 3,
        data: "Contacts",
        link: `/panel/${businessType}/contact`,
        icon: <MdOutlineContactPhone />,
      },
      {
        key: 6,
        data: "Free Trail",
        link: `/panel/${businessType}/freeTrail`,
        icon: <FaRegHandshake />,
      },
      {
        key: 7,
        data: "Follow up",
        link: `/panel/${businessType}/followup`,
        icon: <SiAmazonsimpleemailservice />,
      },
      {
        key: 5,
        data: "Sales order",
        link: `/panel/${businessType}/salesorder`,
        icon: <BsGraphUpArrow />,
      },
      {
        key: 4,
        data: "Client",
        link: `/panel/${businessType}/client`,
        icon: <FiUsers />,
      },
      {
        key: 9,
        data: "Service Box",
        link: `/panel/${businessType}/servicebox`,
        icon: <MdOutlineEmail />,
      },
      {
        key: 11,
        data: "Reports",
        link: `/panel/${businessType}/reports`,
        icon: <IoDocumentTextOutline />,
      },
      {
        key: 12,
        data: "Analytics",
        link: `/panel/${businessType}/analytics`,
        icon: <VscGraph />,
      },
      {
        key: 13,
        data: "Messaging",
        link: `/panel/${businessType}/messaging`,
        icon: <PiChatsBold />,
      },
    ],
  };

  const activeSidebar = sidebarOptions[businessType] || sidebarOptions.advisory;

  return (
    <div className="flex flex-col gap-3 bg-cyan-500">
      <div className="relative">
        <div className="sticky top-0 mt-4">
          <Image
            src={welcomedata?.tenentLogo || "/images/noAvatar.png"}
            alt="Company Image"
            width={toggle ? 56 : 80}
            height={toggle ? 56 : 80}
            className="mx-auto rounded-full border object-cover shadow-md shadow-cyan-600"
          />
        </div>
      </div>

      <div className="CustomerTestimonialReview mt-10 flex h-full flex-col">
        {activeSidebar.map(({ key, data, icon, link }, index) => (
          <Link href={link} key={key} onClick={() => setActive(key)}>
            <li
              className={`flex ${
                toggle ? "justify-center" : "justify-start"
              } text-md font-small items-center gap-3 from-cyan-300 to-cyan-700 py-3 text-white shadow-md hover:bg-gradient-to-b ${
                index === 0 ? "border-b-2 border-t-2" : "border-b-2"
              } ${
                active === key
                  ? "bg-gradient-to-r from-cyan-600 to-cyan-800 hover:bg-gradient-to-b hover:from-cyan-300 hover:to-cyan-700"
                  : "hover:bg-gradient-to-b hover:from-cyan-300 hover:to-cyan-700"
              }`}
            >
              <h1
                className={`${
                  toggle
                    ? "flex flex-col items-center gap-1 px-1"
                    : "flex items-center gap-2 px-2"
                }`}
              >
                <span
                  className={`${toggle ? "text-sm sm:text-xl" : "text-xl"}`}
                >
                  {icon}
                </span>
                <span
                  className={`${
                    toggle ? "whitespace-nowrap text-xs" : "text-md"
                  }`}
                >
                  {data}
                </span>
              </h1>
            </li>
          </Link>
        ))}
      </div>
    </div>
  );
}

SidebaBar.propTypes = {
  toggle: PropTypes.bool.isRequired,
};
