import { Outlet } from "react-router-dom";
import { Box } from "@mui/material";
import Header from "../components/Header";
import Footer from "../components/Footer";
import ChatButton from "../components/ChatButton";

const PublicLayout = () => {
  return (
    <Box display="flex" flexDirection="column" minHeight="100vh">
      <Header />
      <Box component="main" flexGrow={1}>
        <Outlet />
      </Box>
      <ChatButton />
      <Footer />
    </Box>
  );
};

export default PublicLayout;
