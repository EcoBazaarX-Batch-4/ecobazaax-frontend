import { useState, useEffect, useRef } from "react";
import {
  Box,
  Paper,
  Typography,
  TextField,
  IconButton,
  CircularProgress,
  Button
} from "@mui/material";
import { Send, Close, Spa, Person } from "@mui/icons-material";
import { useAuth } from "../contexts/AuthContext";

const ChatModal = ({ open, onClose }) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg = { role: "user", content: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const token = localStorage.getItem("token");

      const response = await fetch("http://localhost:5000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: input,
          user_id: user?.id || "guest",
          jwt_token: token,
        }),
      });

      const data = await response.json();
      const botMsg = {
        role: "assistant",
        content: data.response || "No response",
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "⚠️ Unable to connect to server." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSend();
    }
  };

  if (!open) return null;

  return (
    <Paper
      elevation={15}
      sx={{
        position: "fixed",
        bottom: 25,
        right: 25,
        width: 360,
        height: 480,
        borderRadius: "20px",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        zIndex: 2001,
        background: "white",
        animation: "fadeIn 0.25s ease-out",
      }}
    >
      {/* HEADER */}
      <Box
        sx={{
          p: 1.8,
          background: "linear-gradient(135deg, #2ECC71, #27AE60)",
          color: "white",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Spa sx={{ fontSize: 22 }} />
          <Typography fontWeight={700} fontSize={16}>
            Eco-Concierge
          </Typography>
        </Box>
        <IconButton onClick={onClose} sx={{ color: "white" }}>
          <Close />
        </IconButton>
      </Box>

      {/* MESSAGES */}
      <Box
        sx={{
          flex: 1,
          overflowY: "auto",
          p: 2,
          bgcolor: "#f6f9f6",
          display: "flex",
          flexDirection: "column",
          gap: 1.5,
        }}
      >
        {messages.map((msg, i) => {
          const isUser = msg.role === "user";
          return (
            <Box
              key={i}
              sx={{
                display: "flex",
                flexDirection: isUser ? "row-reverse" : "row",
                alignItems: "flex-end",
                gap: 1,
              }}
            >
              {isUser ? (
                <Person sx={{ fontSize: 25, color: "#7f8c8d" }} />
              ) : (
                <Spa sx={{ fontSize: 25, color: "#2ECC71" }} />
              )}

              <Box
                sx={{
                  bgcolor: isUser ? "#2ECC71" : "white",
                  color: isUser ? "white" : "black",
                  px: 1.8,
                  py: 1,
                  borderRadius: isUser
                    ? "16px 16px 4px 16px"
                    : "16px 16px 16px 4px",
                  maxWidth: "75%",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
                  fontSize: "0.9rem",
                }}
              >
                {msg.content}
              </Box>
            </Box>
          );
        })}

        {loading && (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <CircularProgress size={16} />
            <Typography fontSize={13}>Typing…</Typography>
          </Box>
        )}

        <div ref={messagesEndRef} />
      </Box>

      {/* INPUT AREA - UPDATED (SEND BELOW FIELD) */}
      <Box
        sx={{
          p: 1.5,
          borderTop: "1px solid #e0e0e0",
          background: "#fafafa",
        }}
      >
        {/* Text Field */}
        <TextField
          fullWidth
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          size="small"
          sx={{
            "& .MuiOutlinedInput-root": {
              height: 40,
              borderRadius: "10px",
              background: "white",
            },
          }}
        />

        {/* Send Button Below */}
        <Button
          variant="contained"
          fullWidth
          sx={{
            mt: 1.2,
            py: 1,
            backgroundColor: "#2ECC71",
            "&:hover": { backgroundColor: "#27AE60" },
            borderRadius: "10px",
            fontWeight: 600,
          }}
          endIcon={<Send />}
          disabled={!input.trim()}
          onClick={handleSend}
        >
          Send
        </Button>
      </Box>
    </Paper>
  );
};

export default ChatModal;
