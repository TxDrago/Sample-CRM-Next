"use client";

//react

import PropTypes from "prop-types";
//Folder Imported
import { DataGrid } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";

export default function SendSMS({
  selectedViewValue,
  currentData,
  handleSelectionChange,
}) {
 
  //------------------------------------------------------ Table Heading And Table Data ------------------------------------------
  const columns = [
    {
      field: "products", 
      headerName: "Segment",
      minWidth: 200,
      flex: 1,
      renderCell: (params) => params.value || "", 
    },
    { field: "textMessage", headerName: "Message", minWidth: 150, flex: 1 },
    
    {
      field: "lastModifiedBy",
      headerName: "Sent By",
      minWidth: 200,
      flex: 1,
      renderCell: (params) => params.value || "N/A", 
    },
    {
      field: "sentDateTime",
      headerName: "Sent Time",
      minWidth: 200,
      flex: 1,
      renderCell: (params) => (params.value ? params.value?.replace("T", " ") : ""),
    },
  ];
  
  return (
    <>
      <div className="leads_Table_Container min-w-full rounded-md">
        {/*---------------------------------------TABLE HEAD START---------------------------------------- */}
        {selectedViewValue === "Table View" && (
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
        )}
      </div>
      {/*---------------------------------------- Grid View ---------------------------------------------*/}
      {selectedViewValue === "Grid View" && <></>}
    </>
  );
}
SendSMS.propTypes = {
  currentData: PropTypes.array.isRequired,
  selectedViewValue: PropTypes.string.isRequired,
  handleSelectionChange: PropTypes.func.isRequired,
};
