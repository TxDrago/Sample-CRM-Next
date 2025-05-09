"use client"; // Required for useState and other client-side hooks

import { useState } from "react";
import Header from "@/components/Advisory/Header";
import SidebarBar from "@/components/Advisory/Sidebar";

//-------------------------- Import Global CSS --------------------
import "@/styles/globals.css";

export default function AdvisoryLayout({ children }) {
  const [toggle, setToggle] = useState(false);

  return (
    <div className="flex relative">
      {/* Overlay */}
      <div
        className={toggle ? "hide_View" : "Show_View"}
        onClick={() => setToggle(false)}
      />

      {/* Sidebar */}
      <div
        className={`scrollbar-hidden sticky top-0 h-screen bg-cyan-500 ${
          toggle ? "Side_Bar_Large" : "Side_Bar_Small"
        }`}
      >
        <SidebarBar toggle={toggle} setToggle={setToggle} />
      </div>

      {/* Main Content */}
      <div
        className={`flex h-screen flex-col ${
          toggle ? "Main_Screen_Large" : "Main_Screen_Small"
        }`}
      >
        <Header toggle={toggle} setToggle={setToggle} />
        <div className="flex-grow overflow-auto bg-gray-300">{children}</div>
      </div>
    </div>
  );
}
