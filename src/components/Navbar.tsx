import { AppBar, Toolbar, Typography, Button } from "@mui/material";
import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography
          variant="h6"
          sx={{ flexGrow: 1 }}
          component={Link}
          to="/"
          style={{ textDecoration: "none", color: "inherit" }}
        >
          HRPAuth
        </Typography>
        <Button color="inherit" component={Link} to="/about">SkinLib</Button>
        <Button color="inherit" component={Link} to="/dash">Dashboard</Button>
        <Button color="inherit" component={Link} to="/login">登录</Button>
        <Button color="inherit" component={Link} to="/register">注册</Button>
      </Toolbar>
    </AppBar>
  );
}
