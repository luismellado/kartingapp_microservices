import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import HomeIcon from '@mui/icons-material/Home';

export default function Navbar() {
  const [open, setOpen] = React.useState(false);
  const navigate = useNavigate();

  const toggleDrawer = (isOpen) => () => {
    setOpen(isOpen);
  };

  return (
    <Box sx={{ flexGrow: 1 }}>  
      <AppBar 
        position="fixed"  // Fija el Navbar en la parte superior
        sx={{ 
          width: "100%",  // Ocupa todo el ancho
          backgroundColor: "#357a38",  
        }}
      >
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            KartingRM Reservas
          </Typography>

          <HomeIcon 
          fontSize="large"
          onClick={() => navigate("./")}
          style={{ cursor: "pointer" }}
          />

          <Button color="inherit" onClick={() => navigate("./add")} >Agendar Reserva </Button>
          <Button color="inherit" onClick={() => navigate("./config")} >Configuración </Button>
          <Button color="inherit" onClick={() => navigate("./reports")} >Reportes </Button>
          
        </Toolbar>
      </AppBar>
    </Box>
  );
}
