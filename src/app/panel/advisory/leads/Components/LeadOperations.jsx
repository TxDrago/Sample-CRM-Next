import { DataGrid } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import { MdCall } from "react-icons/md";
import PropTypes from "prop-types";

export default function LeadOperations({
  currentData,
  handleSelectionChange,
}) {
  
  const columns = [
    
    { field: "name", headerName: "Client Name", flex: 1 },
     {
         field: "mobileNo",
         headerName: "Mobile",
         minWidth: 150,
         renderCell: (params) => (
           <span
             onClick={(event) => handleNumberClick(event, params.row.mobileNo)}
             style={{
               cursor: "pointer",
               display: "flex",
               gap: "5px",
               alignItems: "center",
             }}
           >
             <MdCall className="text-red-600" /> {params.value}
           </span>
         ),
       },
    { field: "assigned_To", headerName: "Assigned To", flex: 1 },
    { field: "leadesStatus", headerName: "Lead Status", flex: 1 },
    {
      field: "leadsSource",
      headerName: "Lead Source",
      flex: 1,
      renderCell: (params) => <span style={{ color: "blue" }}>{params.value}</span>,
    },
    {
      field: "segments",
      headerName: "Segment",
      flex: 1,
      renderCell: (params) => params.value?.filter((s) => s.length > 1).join(", ") || "",
    },
    { field: "bpName", headerName: "BP Name", flex: 1 },
  ];
 // -------------------------------------------- Navigate to Edit Screen ----------------------------------------
 const handleNumberClick = (event, mobileNo) => {
  event.stopPropagation();
  window.location.href = `tel:${mobileNo}`;
};
  return (
    <Paper sx={{ width: "100%" }}>
    <DataGrid
      rows={currentData} // Row Data
      columns={columns} // Headings
      pagination={false}
      checkboxSelection
      onRowSelectionModelChange={(newSelection) =>
        handleSelectionChange(newSelection)
      }
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
  );
}

LeadOperations.propTypes = {
  currentData: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string,
      mobileNo: PropTypes.string,
      assigned_To: PropTypes.string,
      leadesStatus: PropTypes.string,
      leadsSource: PropTypes.string,
      segments: PropTypes.arrayOf(PropTypes.string),
      bpName: PropTypes.string,
    })
  ).isRequired,
  handleSelectionChange: PropTypes.func.isRequired,
};
