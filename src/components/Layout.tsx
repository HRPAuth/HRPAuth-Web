import Box from '@mui/material/Box';
import Navbar from "./Navbar";
import { Outlet } from "react-router-dom";

export default function Layout() {
  return (
    <>
      <Navbar />
      <Box sx={{ maxWidth: 1200, mx: "auto", mt: 4, px: 2 }}>
        <Outlet />
      </Box>
    </>
  );
}
