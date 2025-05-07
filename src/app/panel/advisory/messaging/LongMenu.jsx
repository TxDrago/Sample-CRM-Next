"use client";

//react
import * as React from "react";
//Packages
import PropTypes from "prop-types";
// MUI Components
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import DeleteIcon from "@mui/icons-material/Delete";



const ITEM_HEIGHT = 48;

const LongMenu = ({ onDelete }) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <IconButton
        aria-label="more"
        aria-controls={open ? "long-menu" : undefined}
        aria-expanded={open ? "true" : undefined}
        aria-haspopup="true"
        onClick={handleClick}
        sx={{ padding: "0px" }}
      >
        <MoreVertIcon />
      </IconButton>
      <Menu
        id="long-menu"
        MenuListProps={{
          "aria-labelledby": "long-button",
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{
          style: {
            maxHeight: ITEM_HEIGHT * 4.5,
            width: "20ch",
          },
        }}
      >
        <MenuItem
          onClick={() => {
            handleClose();
            if (onDelete) onDelete(); // Ensure onDelete is called safely
          }}
        >
          <DeleteIcon className="mr-2 text-red-500" />
          Delete
        </MenuItem>
      </Menu>
    </div>
  );
};
LongMenu.propTypes = {
    onDelete: PropTypes.func.isRequired, 
    
  };
export default LongMenu;
