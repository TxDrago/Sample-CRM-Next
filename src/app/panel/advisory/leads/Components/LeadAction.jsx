import { DataGrid } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import PropTypes from "prop-types";

export default function LeadAction({ currentData }) {


  const columns = [
    {
      field: "id",
      headerName: "ID",
      flex: 1,
      minWidth: 50,
    },
    {
      field: "userName",
      headerName: "Employee Name",
      flex: 1,
      minWidth: 150,
    },
    {
      field: "totalLeads",
      headerName: "Lead Count",
      flex: 1,
      minWidth: 120,
    },
  ];

  return (
    <Paper sx={{ width: "100%" }}>
      <DataGrid
        rows={currentData} // Pass formatted data
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
  );
}

LeadAction.propTypes = {
  currentData: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      userName: PropTypes.string,
      totalLeads: PropTypes.number,
    }),
  ).isRequired,
};
