import { useState, useEffect, useRef } from "react";
import {
  Box,
  Paper,
  Typography,
  TextField,
  IconButton,
  Button,
  CircularProgress,
} from "@mui/material";
import { Send, Close } from "@mui/icons-material";

const ChatModal = ({ open, onClose }) => {
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
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify({ message: input }),
      });

      const data = await response.json();
      const botMsg = { role: "assistant", content: data.response || "No response" };
      setMessages((prev) => [...prev, botMsg]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Error connecting to server." },
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
      elevation={10}
      sx={{
        position: "fixed",
        bottom: 25,
        right: 25,
        width: 360,
        height: 500,
        borderRadius: "16px",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        zIndex: 2000,
        animation: "fadeIn 0.25s ease-out",
        "@keyframes fadeIn": {
          from: { opacity: 0, transform: "scale(0.9)" },
          to: { opacity: 1, transform: "scale(1)" },
        },
      }}
    >
      {/* Header */}
      <Box
        sx={{
          p: 2,
          bgcolor: "primary.main",
          color: "white",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography fontWeight={600}>Chat Assistant</Typography>
        <IconButton onClick={onClose} sx={{ color: "white" }}>
          <Close />
        </IconButton>
      </Box>

      {/* Messages */}
      <Box
        sx={{
          flex: 1,
          overflowY: "auto",
          p: 2,
          bgcolor: "#f4f4f4",
          display: "flex",
          flexDirection: "column",
          gap: 1.5,
        }}
      >
        {messages.map((msg, i) => (
          <Box
            key={i}
            sx={{
              alignSelf: msg.role === "user" ? "flex-end" : "flex-start",
              bgcolor: msg.role === "user" ? "primary.main" : "white",
              color: msg.role === "user" ? "white" : "black",
              px: 2,
              py: 1,
              borderRadius: 2,
              maxWidth: "80%",
              boxShadow: 1,
            }}
          >
            {msg.content}
          </Box>
        ))}

        {loading && (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <CircularProgress size={18} />
            <Typography fontSize={14}>Typing...</Typography>
          </Box>
        )}

        <div ref={messagesEndRef} />
      </Box>

      {/* Input */}
      <Box sx={{ p: 2, borderTop: "1px solid #ddd" }}>
        <TextField
          fullWidth
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          size="small"
        />

        <Button
          fullWidth
          variant="contained"
          sx={{ mt: 1 }}
          endIcon={<Send />}
          onClick={handleSend}
          disabled={!input.trim()}
        >
          Send
        </Button>
      </Box>
    </Paper>
  );
};

export default ChatModal;
