import { Grid, Paper, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Box } from "@mui/material";
import { Leaderboard, MonetizationOn, EnergySavingsLeaf } from "@mui/icons-material";

const AdminLeaderboardList = ({ data }) => {
  const renderTable = (title, icon, list, valueLabel, valueKey) => (
    <Grid item xs={12} md={4}>
      <Paper sx={{ p: 2, height: '100%' }}>
        <Box display="flex" alignItems="center" gap={1} mb={2}>
          {icon}
          <Typography variant="h6" fontWeight={600}>{title}</Typography>
        </Box>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Rank</TableCell>
                <TableCell>Name</TableCell>
                <TableCell align="right">{valueLabel}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {list && list.length > 0 ? (
                list.map((item, index) => (
                  <TableRow key={index} hover>
                    <TableCell>#{index + 1}</TableCell>
                    <TableCell>{item.name}</TableCell>
                    <TableCell align="right">{item[valueKey]}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow><TableCell colSpan={3} align="center">No data</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Grid>
  );

  return (
    <Grid container spacing={3}>
      {renderTable("Top Sellers", <MonetizationOn color="success" />, data?.topSellersByRevenue, "Revenue", "value")}
      {renderTable("Greenest Customers", <EnergySavingsLeaf color="success" />, data?.greenestCustomers, "Carbon (kg)", "value")}
      {renderTable("Top Buyers", <Leaderboard color="primary" />, data?.topCustomersByOrders, "Orders", "value")}
    </Grid>
  );
};

export default AdminLeaderboardList;