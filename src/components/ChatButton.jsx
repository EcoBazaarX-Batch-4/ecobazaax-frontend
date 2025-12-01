import { useState } from "react";
import { Fab } from "@mui/material";
import { ChatBubbleOutline } from "@mui/icons-material";
import ChatModal from "./ChatModal";

const ChatButton = () => {
  const [open, setOpen] = useState(false);

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
          zIndex: 5000, // keep above everything
        }}
      >
        <ChatBubbleOutline />
      </Fab>

      <ChatModal open={open} onClose={() => setOpen(false)} />
    </>
  );
};

export default ChatButton;
