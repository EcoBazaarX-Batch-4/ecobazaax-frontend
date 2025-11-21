import { useState, useEffect } from "react";
import { Box, Typography, Paper, TextField, Button, Grid, Alert, Divider } from "@mui/material";
import { useAuth } from "../../contexts/AuthContext";
import { sellerService } from "../../services/sellerService";

const StoreSettings = () => {
  const { user, loadUser } = useAuth();
  const [storeData, setStoreData] = useState({ storeName: user?.storeName || "", storeDescription: user?.storeDescription || "" });
  const [payoutData, setPayoutData] = useState({});
  const [msg, setMsg] = useState({ type: "", text: "" });

  useEffect(() => {
    const loadPayout = async () => {
        try {
            const data = await sellerService.getPayoutDetails();
            setPayoutData(data);
        } catch (e) { /* Ignore 404 if not set */ }
    };
    if(user) loadPayout();
  }, [user]);

  const handleStoreSave = async (e) => {
    e.preventDefault();
    try {
        await sellerService.updateStoreProfile(storeData);
        setMsg({ type: "success", text: "Profile saved!" });
        loadUser(); // Refresh header name
    } catch (err) {
        setMsg({ type: "error", text: "Failed to save profile" });
    }
  };

  const handlePayoutSave = async (e) => {
    e.preventDefault();
    try {
        await sellerService.updatePayoutDetails(payoutData);
        setMsg({ type: "success", text: "Payout details saved!" });
    } catch (err) {
        setMsg({ type: "error", text: "Failed to save details" });
    }
  };

  return (
    <Box>
      <Typography variant="h4" fontWeight={700} gutterBottom>Store Settings</Typography>
      {msg.text && <Alert severity={msg.type} sx={{ mb: 3 }}>{msg.text}</Alert>}

      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>Public Profile</Typography>
            <form onSubmit={handleStoreSave}>
              <TextField fullWidth label="Store Name" value={storeData.storeName} onChange={(e)=>setStoreData({...storeData, storeName:e.target.value})} margin="normal" required />
              <TextField fullWidth label="Description" multiline rows={3} value={storeData.storeDescription} onChange={(e)=>setStoreData({...storeData, storeDescription:e.target.value})} margin="normal" />
              <Button type="submit" variant="contained" sx={{ mt: 2 }}>Save Profile</Button>
            </form>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>Payout Details (Private)</Typography>
            <form onSubmit={handlePayoutSave}>
                <TextField fullWidth label="Account Holder" value={payoutData.accountHolderName || ''} onChange={(e)=>setPayoutData({...payoutData, accountHolderName:e.target.value})} margin="normal" required />
                <TextField fullWidth label="Account Number" value={payoutData.accountNumber || ''} onChange={(e)=>setPayoutData({...payoutData, accountNumber:e.target.value})} margin="normal" required />
                <TextField fullWidth label="Bank Name" value={payoutData.bankName || ''} onChange={(e)=>setPayoutData({...payoutData, bankName:e.target.value})} margin="normal" required />
                <TextField fullWidth label="IFSC Code" value={payoutData.ifscCode || ''} onChange={(e)=>setPayoutData({...payoutData, ifscCode:e.target.value})} margin="normal" required />
                <Button type="submit" variant="contained" color="secondary" sx={{ mt: 2 }}>Save Payout Info</Button>
            </form>
            </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default StoreSettings;