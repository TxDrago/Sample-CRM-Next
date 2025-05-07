"use client";

//react

import { useState } from "react";
import PropTypes from "prop-types";
import { DataGrid } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import { GoDot } from "react-icons/go";

export default function Monitoring({ currentReports }) {
  //-------------------------------------------Table Headings--------------------------------
  const columns = [
    {
      field: "userName",
      headerName: "Username",
      minWidth: 150, // Adjust to fit content dynamically
      flex: 1,
    },
    {
      field: "date",
      headerName: "Date",
      minWidth: 130, // Ensure it fits date format
      flex: 1,
      renderCell: (params) => params.value?.split("T")[0] || "",
    },
    {
      field: "logInTime",
      headerName: "Login Time",
      minWidth: 150,
      flex: 1,
      renderCell: (params) => params.value?.replace("T", " ") || "",
    },
    {
      field: "logoutTime",
      headerName: "Logout Time",
      minWidth: 150,
      flex: 1,
      renderCell: (params) => params.value?.replace("T", " ") || "",
    },
    {
      field: "noOfLeadUpdate",
      headerName: "Total Leads Disposed",
      minWidth: 180,
      flex: 1,
    },
    {
      field: "status",
      headerName: "Status",
      minWidth: 130,
      flex: 1,
      renderCell: (params) => (
        <div className="flex items-center gap-1">
          <GoDot
            className={`rounded-full border ${
              params.value
                ? "bg-green-500 text-green-300 shadow-md shadow-green-300"
                : "bg-red-400 text-red-700 shadow-sm shadow-red-300"
            }`}
          />
          {params.value ? "Online" : "Offline"}
        </div>
      ),
    },
  ];

  // -------------------> State for Pagination <-------------------
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const paginatedData = currentReports.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };
//------------------------------------------------- Row Data ----------------------------
const rows = paginatedData.map((report, index) => ({
  id: report.id || index + 1, // Ensure id is set correctly
  ...report,
}));

  return (
   <>
    <Paper sx={{ width: "100%" }}>
      <DataGrid
        rows={rows}
        columns={columns}
        pagination={false}
        checkboxSelection
        sx={{
          border: 0,
          width: "100%",
          "& .MuiDataGrid-columnHeaderTitle": {
            fontWeight: "bold",
          },
          "& .MuiDataGrid-footerContainer": {
            display: "none",
          },
        }}
      />
    </Paper>
      {/* ---------------------------- Pagination ---------------------------- */}
      <Stack spacing={2} className="mb-1 mt-4">
        <Pagination
          count={Math.ceil(currentReports.length / itemsPerPage)}
          page={currentPage}
          onChange={handlePageChange}
          sx={{
            display: "flex",
            justifyContent: "center",
            "& .MuiPaginationItem-root": {
              fontSize: "1.2rem",
            },
            "& .MuiPaginationItem-root.Mui-selected": {
              backgroundColor: "rgba(6, 182, 212, 1)",
              color: "#fff",
            },
          }}
        />
      </Stack>
    </>
  );
}

Monitoring.propTypes = {
  currentReports: PropTypes.arrayOf(
    PropTypes.shape({
      userName: PropTypes.string.isRequired,
      date: PropTypes.string,
      logInTime: PropTypes.string,
      logoutTime: PropTypes.string,
      noOfLeadUpdate: PropTypes.number,
      status: PropTypes.bool.isRequired,
    }),
  ).isRequired,
};
