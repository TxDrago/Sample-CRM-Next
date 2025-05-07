"use client";

//react
import Link from "next/link";

import { useEffect, useState } from "react";
import { IoMdHome } from "react-icons/io";
import { IoIosArrowForward } from "react-icons/io";

const Breadcrumb = () => {
  //--------------------------------------- Set Business Type --------------------------------------------
  const [BusinessType, setBusinessType] = useState("");

  useEffect(() => {
    const storedType = localStorage.getItem("businessType") || "";
    setBusinessType(storedType);
  }, []);

  return (
    <div className="flex items-center my-2">
      <Link href={`/panel/${BusinessType}/dashboard`}>
        <IoMdHome size={30} className="mb-1 text-blue-600" />
      </Link>
      <IoIosArrowForward
        size={20}
        className="mx-2 text-blue-600 bg-white border border-blue-600 rounded-full shadow-md"
      />
      <Link
        className="p-1 text-blue-600 bg-white border border-blue-500 rounded hover:text-blue-500"
        href={`/panel/${BusinessType}/setting`}
      >
        Settings
      </Link>
    </div>
  );
};

export default Breadcrumb;
