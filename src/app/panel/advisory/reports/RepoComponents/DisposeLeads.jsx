"use client";

//react

import { FaBars } from "react-icons/fa";

export default function DisposeLeads({ currentReports }) {
  return (
    <>
      <table className="leads_Table min-w-full bg-white">
        {/* ----------------- TABLE HEAD START ----------------- */}
        <thead>
          <tr className="border-b-2 border-gray-300">
            {/* CHECKBOX */}
            <th className="w-max px-3 py-3">
              <input type="checkbox" />
            </th>
            {/* CLIENT NAME */}
            <th className="border-r px-2 py-3 text-left font-medium">
              <div className="flex items-center justify-between">
                <span className="text-nowrap pr-2">Client Name</span>
                <FaBars />
              </div>
            </th>
            {/* MOBILE */}
            <th className="border-r px-2 py-3 text-left font-medium">
              <div className="flex items-center justify-between">
                <span className="text-nowrap pr-2">Mobile</span>
                <FaBars />
              </div>
            </th>
            {/* DISPOSE BY */}
            <th className="border-r px-2 py-3 text-left font-medium">
              <div className="flex items-center justify-between">
                <span className="text-nowrap pr-2">Dispose By</span>
                <FaBars />
              </div>
            </th>
            {/* LEAS SOURCE */}
            <th className="border-r px-2 py-3 text-left font-medium">
              <div className="flex items-center justify-between">
                <span className="text-nowrap pr-2">Lead Source</span>
                <FaBars />
              </div>
            </th>
            {/* REMARK */}
            <th className="border-r px-2 py-3 text-left font-medium">
              <div className="flex items-center justify-between">
                <span className="text-nowrap pr-2">Remark</span>
                <FaBars />
              </div>
            </th>
            {/* DISPOSE TIME */}
            <th className="border-r px-2 py-3 text-left font-medium">
              <span className="text-nowrap pr-2">Dispose Time</span>
            </th>
          </tr>
        </thead>
        {/* ----------------- TABLE HEAD END ----------------- */}
        {/* ----------------- TABLE BODY START ----------------- */}
        <tbody>
          {currentReports.map((report, i) => (
            <tr
              key={i}
              className="cursor-pointer border-b border-gray-300 hover:bg-gray-200"
            >
              {/* CHECKBOX */}
              <td className="w-max px-3 py-4 text-center">
                <input type="checkbox" />
              </td>
              {/* CLIENT NAME */}
              <td className="border-b border-gray-300 px-2 py-4 text-sm leading-5 text-gray-600">
                {report.clientName}
              </td>
              {/* MOBILE */}
              <td className="border-b border-gray-300 px-2 py-4 text-sm leading-5 text-gray-600">
                {report.mobile}
              </td>
              {/* DISPOSE BY */}
              <td className="border-b border-gray-300 px-2 py-4 text-sm leading-5 text-gray-600">
                {report.disposeBy}
              </td>
              {/* LEAD SOURCE */}
              <td className="border-b border-gray-300 px-2 py-4 text-sm leading-5 text-gray-600">
                {report.leadSource}
              </td>
              {/* REMARK */}
              <td className="border-b border-gray-300 px-2 py-4 text-sm leading-5 text-gray-600">
                {report.remark}
              </td>
              {/* DISPOSE TIME */}
              <td className="border-b border-gray-300 px-2 py-4 text-sm leading-5 text-gray-600">
                {report.disposeTime}
              </td>
            </tr>
          ))}
        </tbody>
        {/* ----------------- TABLE BODY END ----------------- */}
      </table>
      {/* ------------------- COMING SOON TAB ----------------------- */}
      <div className="mx-auto mt-[2rem] flex w-[300px] items-center justify-center gap-3 rounded-md bg-white py-8 shadow-lg">
        <h1 className="text-center text-xl font-medium text-red-500">
          This feature is coming soon...
        </h1>
      </div>
      {/* ------------------- END ------------------- */}
    </>
  );
}
