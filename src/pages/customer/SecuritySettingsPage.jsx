import { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Grid,
  Alert,
  Divider,
} from "@mui/material";
import { useAuth } from "../../contexts/AuthContext";
import { customerService } from "../../services/customerService";

const SecuritySettingsPage = () => {
  const { user, loadUser } = useAuth();
  
  // Profile Form State
  // Backend DTO: { name, email }
  const [profileData, setProfileData] = useState({
    name: user?.name || "",
    email: user?.email || "", 
  });
  const [profileMsg, setProfileMsg] = useState({ type: "", text: "" });
  const [profileLoading, setProfileLoading] = useState(false);

  // Password Form State
  const [passData, setPassData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passMsg, setPassMsg] = useState({ type: "", text: "" });
  const [passLoading, setPassLoading] = useState(false);

  // Handle Profile Update
  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setProfileLoading(true);
    setProfileMsg({ type: "", text: "" });

    try {
      // Fix: Match backend DTO { name, email }
      // Removing 'phone' as it is not in your DTO
      await customerService.updateProfile({
        name: profileData.name,
        email: profileData.email 
      });
      setProfileMsg({ type: "success", text: "Profile updated successfully!" });
      await loadUser(); // Refresh global user context
    } catch (err) {
      setProfileMsg({ type: "error", text: err.response?.data?.message || "Failed to update profile." });
    } finally {
      setProfileLoading(false);
    }
  };

  // Handle Password Change
  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passData.newPassword !== passData.confirmPassword) {
      setPassMsg({ type: "error", text: "New passwords do not match." });
      return;
    }
    
    setPassLoading(true);
    setPassMsg({ type: "", text: "" });

    try {
      await customerService.changePassword({
        currentPassword: passData.currentPassword,
        newPassword: passData.newPassword
      });
      setPassMsg({ type: "success", text: "Password changed successfully!" });
      setPassData({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      setPassMsg({ type: "error", text: err.response?.data?.message || "Failed to change password." });
    } finally {
      setPassLoading(false);
    }
  };

  return (
    <Box>
      <Typography variant="h4" fontWeight={700} gutterBottom>
        Security & Settings
      </Typography>

      <Grid container spacing={4}>
        {/* Profile Information Section */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" fontWeight={600} gutterBottom>
              Edit Profile
            </Typography>
            <Divider sx={{ mb: 3 }} />
            
            {profileMsg.text && (
              <Alert severity={profileMsg.type} sx={{ mb: 2 }}>
                {profileMsg.text}
              </Alert>
            )}

            <form onSubmit={handleProfileUpdate}>
              <TextField
                fullWidth
                label="Full Name"
                value={profileData.name}
                onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                sx={{ mb: 2 }}
                required
              />
              <TextField
                fullWidth
                label="Email Address"
                value={profileData.email}
                // If backend allows updating email, enable this. 
                // Otherwise keep disabled. Assuming enabled for now as it's in DTO.
                onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                sx={{ mb: 3 }}
                required
              />
              <Button 
                type="submit" 
                variant="contained" 
                disabled={profileLoading}
              >
                {profileLoading ? "Saving..." : "Save Changes"}
              </Button>
            </form>
          </Paper>
        </Grid>

        {/* Change Password Section */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" fontWeight={600} gutterBottom>
              Change Password
            </Typography>
            <Divider sx={{ mb: 3 }} />

            {passMsg.text && (
              <Alert severity={passMsg.type} sx={{ mb: 2 }}>
                {passMsg.text}
              </Alert>
            )}

            <form onSubmit={handlePasswordChange}>
              <TextField
                fullWidth
                type="password"
                label="Current Password"
                value={passData.currentPassword}
                onChange={(e) => setPassData({ ...passData, currentPassword: e.target.value })}
                sx={{ mb: 2 }}
                required
              />
              <TextField
                fullWidth
                type="password"
                label="New Password"
                value={passData.newPassword}
                onChange={(e) => setPassData({ ...passData, newPassword: e.target.value })}
                sx={{ mb: 2 }}
                required
              />
              <TextField
                fullWidth
                type="password"
                label="Confirm New Password"
                value={passData.confirmPassword}
                onChange={(e) => setPassData({ ...passData, confirmPassword: e.target.value })}
                sx={{ mb: 3 }}
                required
              />
              <Button 
                type="submit" 
                variant="outlined" 
                color="error"
                disabled={passLoading}
              >
                {passLoading ? "Updating..." : "Update Password"}
              </Button>
            </form>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default SecuritySettingsPage;