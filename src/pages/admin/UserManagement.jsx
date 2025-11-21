import { useState, useEffect } from "react";
import {
  Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, IconButton, Skeleton, Alert, Button
} from "@mui/material";
import { Edit, Lock, LockOpen } from "@mui/icons-material";
import { adminService } from "../../services/adminService";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const data = await adminService.getUsers({ size: 20 });
      // FIX: Map backend Page content
      setUsers(data.content || []);
    } catch (err) {
      setError("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  const handleLockToggle = async (user) => {
    try {
      const newStatus = { isAccountNonLocked: !user.isAccountNonLocked };
      await adminService.updateUser(user.id, newStatus);
      loadUsers(); // Refresh list
    } catch (err) {
      alert("Failed to update user status");
    }
  };

  return (
    <Box>
      <Typography variant="h4" fontWeight={700} gutterBottom>User Management</Typography>
      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Roles</TableCell>
              <TableCell align="center">Status</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? [...Array(5)].map((_, i) => <TableRow key={i}><TableCell colSpan={6}><Skeleton /></TableCell></TableRow>) :
             users.map((user) => (
              <TableRow key={user.id} hover>
                <TableCell>#{user.id}</TableCell>
                <TableCell fontWeight={600}>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  {/* FIX: Handle role array */}
                  {user.roles?.map(r => <Chip key={r} label={r.replace('ROLE_', '')} size="small" sx={{ mr: 0.5 }} />)}
                </TableCell>
                <TableCell align="center">
                  <Chip 
                    label={user.isAccountNonLocked ? "Active" : "Locked"} 
                    color={user.isAccountNonLocked ? "success" : "error"} 
                    size="small" 
                  />
                </TableCell>
                <TableCell align="center">
                  <IconButton size="small" onClick={() => handleLockToggle(user)} color={user.isAccountNonLocked ? "default" : "warning"}>
                    {user.isAccountNonLocked ? <LockOpen /> : <Lock />}
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default UserManagement;