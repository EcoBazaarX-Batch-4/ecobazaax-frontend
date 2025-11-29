import { useState } from "react";
import { Fab } from "@mui/material";
import { ChatBubbleOutline } from "@mui/icons-material";
import { useAuth } from "../contexts/AuthContext";
import ChatModal from "./ChatModal";

const ChatButton = () => {
  const { isAuthenticated } = useAuth();
  const [open, setOpen] = useState(false);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <>
      <Fab
        color="primary"
        aria-label="chat"
        onClick={() => setOpen(true)}
        sx={{
          position: "fixed",
          bottom: 24,
          right: 24,
          zIndex: 1000,
        }}
      >
        <ChatBubbleOutline />
      </Fab>
      <ChatModal open={open} onClose={() => setOpen(false)} />
    </>
  );
};

export default ChatButton;
