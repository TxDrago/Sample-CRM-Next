"use client";

//react
import { useState } from "react";
import PropTypes from "prop-types";
import { DataGrid } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
//icon
import { MdCall } from "react-icons/md";

export default function LeadsReport({ currentReports }) {
  const columns = [
    { field: "id", headerName: "Lead ID", minWidth: 100, flex: 1 },
    { field: "name", headerName: "Lead Name", minWidth: 150, flex: 1 },
    { field: "mobileNo", headerName: "Mobile", minWidth: 130, flex: 1,
      renderCell: (params) => (
        <span
          onClick={(event) => handleNumberClick(event, params.row.mobileNo)}
          style={{ cursor: "pointer", display:"flex", gap:"5px", alignItems: "center" }}
        >
         <MdCall className="text-red-600" /> {params.value}
        </span>
      ),
     },
    { field: "assigned_To", headerName: "Managed By", minWidth: 150, flex: 1 },
    {
      field: "leadesStatus",
      headerName: "Lead Status",
      minWidth: 150,
      flex: 1,
    },
    { field: "leadsSource", headerName: "Lead Source", minWidth: 150, flex: 1 },
    {
      field: "segments",
      headerName: "Segments",
      minWidth: 180,
      flex: 1,
      renderCell: (params) => params.row.segments?.join(", ") || "N/A",
    },
    {
      field: "description",
      headerName: "Last Remarks",
      minWidth: 200,
      flex: 1,
      renderCell: (params) => (
        <div dangerouslySetInnerHTML={{ __html: params.value }} />
      ),
    },
  ];
   // -------------------------------------------- Navigate to Edit Screen ----------------------------------------
   const handleNumberClick = (event, mobileNo) => {
    event.stopPropagation(); 
    window.location.href = `tel:${mobileNo}`;
  };

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

LeadsReport.propTypes = {
  currentReports: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      mobileNo: PropTypes.string.isRequired,
      assigned_To: PropTypes.string.isRequired,
      leadesStatus: PropTypes.string.isRequired,
      leadsSource: PropTypes.string.isRequired,
      segments: PropTypes.arrayOf(PropTypes.string),
      description: PropTypes.string.isRequired,
    }),
  ).isRequired,
};
