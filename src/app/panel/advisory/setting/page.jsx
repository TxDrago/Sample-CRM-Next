"use client";

import { useEffect,useState } from "react";
import { useRouter } from "next/navigation";
//external Packages
import axios from "axios";

import { IoMdSettings } from "react-icons/io";

//Folder Imported
import { tenant_base_url, protocal_url } from "@/Config/Config";
import { getHostnamePart } from "@/components/GlobalHostUrl";



export default function Setting() {
  const router = useRouter();
  const name = getHostnamePart();
  //--------------------------------------- Set Business Type --------------------------------------------
  const [BusinessType, setBusinessType] = useState("");
  useEffect(() => {
    const storedType = localStorage.getItem("businessType") || "";
    setBusinessType(storedType);
  }, []);
  //-------------------------------------------------------------- Setting Buttons -----------------------------------------------
    const settingButtons = [
      {
        key: 1,
        value: "User Setting",
        link: `/panel/${BusinessType}/setting/user-setting`,
        group: "User's Settings",
      },
      {
        key: 2,
        value: "User Operation",
        link: `/panel/${BusinessType}/setting/user-operation`,
        group: "User's Settings",
      },
      {
        key: 3,
        value: "Group",
        link: `/panel/${BusinessType}/setting/group`,
        group: "User's Settings",
      },
      {
        key: 27,
        value: "Roles & Permissions",
        link: `/panel/${BusinessType}/setting/permissions`,
        group: "User's Settings",
      },
      {
        key: 7,
        value: "Lead Status",
        link: `/panel/${BusinessType}/setting/leadStatus`,
        group: "Lead Settings",
      },
      {
        key: 8,
        value: "Pools",
        link: `/panel/${BusinessType}/setting/pools`,
        group: "Lead Settings",
      },
      {
        key: 9,
        value: "Segments",
        link: `/panel/${BusinessType}/setting/segments`,
        group: "Lead Settings",
      },
      {
        key: 10,
        value: "SMS Template",
        link: `/panel/${BusinessType}/setting/sms-template`,
        group: "ENV Settings",
      },
      {
        key: 11,
        value: "E-Mail Template",
        link: `/panel/${BusinessType}/setting/email-template`,
        group: "ENV Settings",
      },
      {
        key: 15,
        value: "SMS Setting",
        link: `/panel/${BusinessType}/setting/sms-Settings`,
        group: "ENV Settings",
      },
      {
        key: 16,
        value: "E-Mail Setting",
        link: `/panel/${BusinessType}/setting/email-Settings`,
        group: "ENV Settings",
      },
      {
        key: 21,
        value: "Access Device",
        link: `/panel/${BusinessType}/setting/access-device`,
        group: "Security Settings",
      },
      {
        key: 24,
        value: "Access Control",
        link: `/panel/${BusinessType}/setting/access-control`,
        group: "Security Settings",
      },
      {
        key: 4,
        value: "Department",
        link: `/panel/${BusinessType}/setting/department`,
        group: "Other Settings",
      },
      {
        key: 5,
        value: "Designation",
        link: `/panel/${BusinessType}/setting/designation`,
        group: "Other Settings",
      },
      {
        key: 26,
        value: "Expense Head",
        link: `/panel/${BusinessType}/setting/expensehead`,
        group: "Other Settings",
      },
      {
        key: 6,
        value: "Qualification",
        link: `/panel/${BusinessType}/setting/qualification`,
        group: "Other Settings",
      },
    ];
   // -------------------------------------- Group the data by the `group` property -------------------------------------
   const groupedData = settingButtons.reduce((acc, item) => {
    acc[item.group] = acc[item.group] || [];
    acc[item.group].push(item);
    return acc;
  }, {});
  

 

  //---------------------------------------------------- Roles & Permissions ----------------------------------------------------

  const businessRole = localStorage.getItem("businessRole");
  // const [permissions, setPermissions] = useState([]);

  async function handleGetPermission() {
    const bearer_token = localStorage.getItem("token");
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${bearer_token}`,
        },
      };
      const response = await axios.get(
        `${protocal_url}${name}.${tenant_base_url}/Security/rolesandpermissions/getgroupwise/${businessRole}`,
        config,
      );
      console.log("Permission Data : ", response.data.data);
      const permissionsList = response?.data?.data;

      if (permissionsList) {
        const serviceBoxPermissions = permissionsList.find(
          (item) => item.moduleName === "Settings",
        );

        if (serviceBoxPermissions) {
          const permissionsArray = serviceBoxPermissions.permissions.split(",");
          // setPermissions(permissionsArray);

          console.log("List : ", permissionsArray);

          //------------------------------------------------------ Set permissions ------------------------------------------------
        }
      }
    } catch (error) {
      console.error("Error fetching leads:", error);
    }
  }

  useEffect(() => {
    handleGetPermission();
  }, []);



  return (
    <>
      <div className="flex flex-col m-3">
        {/* Header Section Parent*/}
        <div className="flex justify-between rounded-t-xl bg-gradient-to-r from-cyan-500 from-20% via-sky-600 via-100% p-3 text-white">
          {/* Heading */}
          <h1 className="flex items-center gap-2 text-2xl tracking-wide roboto-slab-setting">
            <IoMdSettings /> Setting Dashboard
          </h1>
        </div>

        {/* Main Section */}
        <div className="flex items-start min-h-screen px-4 py-8 bg-white rounded-b-xl">
          <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {/* Setting Cards */}
            {Object.keys(groupedData).map((group) => (
              <div key={group} className="rounded-b-lg shadow-md rounded-t-xl">
                <h2 className="flex justify-center px-4 py-2 text-lg text-white border-b rounded-t-xl bg-sky-500">
                  {group}
                </h2>
                {/* Buttons */}
                <div className="grid w-full grid-cols-1 gap-2 my-2">
                  {groupedData[group].map((button) => (
                    <div
                      key={button.key}
                      onClick={() => router.push(button.link)}
                      className="p-2 mx-4 text-center cursor-pointer bg-white border-2 rounded-full shadow-md border-cyan-500 text-cyan-500 hover:bg-cyan-500 hover:text-white"
                    >
                      {button.value}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
