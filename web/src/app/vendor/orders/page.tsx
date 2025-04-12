"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { Add as AddIcon, Visibility as VisibilityIcon, Delete as DeleteIcon } from "@mui/icons-material";
import { getVendorOrders, deleteOrder } from "@/services/orderService";
import { refreshToken } from "@/services/authService";
import { fetchUserProfile } from "@/redux/middlewares/authMiddleware";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import LoadingOverlay from "@/components/LoadingOverlay";

interface Order {
  id: number;
  store_id: number;
  amount: number;
  status: string;
  scrapImageUrl: string;
  createdAt: string;
  orderDetail: {
    weight: number;
  };
}

const VendorOrdersPage = () => {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [viewImageUrl, setViewImageUrl] = useState<string | null>(null);

  const fetchOrders = async (vendorId: number) => {
    setLoading(true);
    setError("");
    try {
      const response = await getVendorOrders(vendorId);
      setOrders(response || []);
      
    } catch (err: any) {
      setError(err.message || "Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };
  console.log(orders);
  
  useEffect(() => {
    const checkAuth = async () => {
      const accessToken = localStorage.getItem("access_token");
      if (!accessToken) {
        router.push("/store-login");
        return;
      }

      try {
        const vendorData= await dispatch(fetchUserProfile(accessToken)).unwrap();
        fetchOrders(vendorData.id);
      } catch (err: any) {
        if (err?.message === "Access token expired") {
          try {
            const oldRefreshToken = localStorage.getItem("refresh_token");
            const newTokens = await refreshToken(oldRefreshToken || "");
            localStorage.setItem("access_token", newTokens.access_token);
            localStorage.setItem("refresh_token", newTokens.refresh_token);

            // Thử lại với token mới
            const vendorData= await dispatch(fetchUserProfile(accessToken)).unwrap();
            fetchOrders(vendorData.id);
          } catch (refreshError) {
            localStorage.removeItem("access_token");
            localStorage.removeItem("refresh_token");
            router.push("/store-login");
          }
        } else {
          localStorage.removeItem("access_token");
          localStorage.removeItem("refresh_token");
          router.push("/store-login");
        }
      }
    };

    checkAuth();
  }, [dispatch, router]);

  const handleViewDetails = (orderId: number) => {
    router.push(`/store/orders/${orderId}`);
  };

  const handleViewImage = (imageUrl: string) => {
    setViewImageUrl(imageUrl);
  };

  const handleCloseImage = () => {
    setViewImageUrl(null);
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "warning";
      case "approved":
        return "success";
      case "rejected":
        return "error";
      case "completed":
        return "info";
      default:
        return "default";
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
        <Typography variant="h5" component="h1">
          Orders
        </Typography>
      </Box>

      {error && (
        <Box sx={{ mb: 3 }}>
          <Typography color="error">{error}</Typography>
        </Box>
      )}

      {loading ? (
        <LoadingOverlay/>
      ) : orders.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: "center" }}>
          <Typography variant="body1">No orders found</Typography>
        </Paper>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>Weight</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Image</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell>{order.id}</TableCell>
                  <TableCell>{formatDate(order.createdAt)}</TableCell>
                  <TableCell>${order.amount.toLocaleString()}</TableCell>
                  <TableCell>
                    {Array.isArray(order.orderDetail) 
                      ? order.orderDetail.reduce((total, detail) => total + (detail?.weight || 0), 0) 
                      : order.orderDetail?.weight || 0} kg
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={order.status}
                      color={getStatusColor(order.status) as any}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    {order.scrapImageUrl && (
                      <IconButton
                        size="small"
                        onClick={() => handleViewImage(order.scrapImageUrl)}
                      >
                        <VisibilityIcon fontSize="small" />
                      </IconButton>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Dialog open={!!viewImageUrl} onClose={handleCloseImage} maxWidth="md" PaperProps={{
        sx: {
          margin: 'auto',
          width: { xs: '95%', sm: '80%', md: '70%' },
          maxWidth: '800px'
        }
      }}>
        <DialogTitle>Scrap Image</DialogTitle>
        <DialogContent>
          {viewImageUrl && (
            <img
              src={viewImageUrl}
              alt="Scrap"
              style={{ maxWidth: "100%", maxHeight: "500px" }}
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseImage}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default VendorOrdersPage; 