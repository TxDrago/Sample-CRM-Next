"use client";

//react
import { useState } from "react";
import PropTypes from "prop-types";
import { DataGrid } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";

export default function EmployeeReport({ currentReports }) {

  const columns = [
    {
      field: "fullName",
      headerName: "Full Name",
      minWidth: 180,
      flex: 1,
    },
    {
      field: "userName",
      headerName: "Username",
      minWidth: 150,
      flex: 1,
    },
    {
      field: "target",
      headerName: "Target",
      minWidth: 130,
      flex: 1,
    },
    {
      field: "targetAchieved",
      headerName: "Target Achieved",
      minWidth: 160,
      flex: 1,
    },
    {
      field: "targetRemaining",
      headerName: "Target Remaining",
      minWidth: 160,
      flex: 1,
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

EmployeeReport.propTypes = {
  currentReports: PropTypes.arrayOf(
    PropTypes.shape({
      fullName: PropTypes.string.isRequired,
      userName: PropTypes.string.isRequired,
      target: PropTypes.number.isRequired,
      targetAchieved: PropTypes.number.isRequired,
      targetRemaining: PropTypes.number.isRequired,
    }),
  ).isRequired,
};
