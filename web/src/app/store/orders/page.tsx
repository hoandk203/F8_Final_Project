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
import { getOrders, deleteOrder } from "@/services/orderService";
import CreateOrderModal from "../components/CreateOrderModal";
import { refreshToken } from "@/services/authService";
import { fetchUserProfile } from "@/redux/middlewares/authMiddleware";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";

interface Order {
  id: number;
  store_id: number;
  amount: number;
  status: string;
  scrap_image_url: string;
  created_at: string;
  orderDetail_weight: number;
}

const OrdersPage = () => {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [viewImageUrl, setViewImageUrl] = useState<string | null>(null);

  const fetchOrders = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await getOrders();
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
        await dispatch(fetchUserProfile(accessToken)).unwrap();
        fetchOrders();
      } catch (err: any) {
        if (err?.message === "Access token expired") {
          try {
            const oldRefreshToken = localStorage.getItem("refresh_token");
            const newTokens = await refreshToken(oldRefreshToken || "");
            localStorage.setItem("access_token", newTokens.access_token);
            localStorage.setItem("refresh_token", newTokens.refresh_token);

            // Thử lại với token mới
            await dispatch(fetchUserProfile(newTokens.access_token)).unwrap();
            fetchOrders();
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

  const handleCreateOrder = () => {
    setOpenCreateModal(true);
  };

  const handleCloseCreateModal = () => {
    setOpenCreateModal(false);
  };

  const handleOrderCreated = () => {
    setOpenCreateModal(false);
    fetchOrders();
  };

  const handleViewDetails = (orderId: number) => {
    router.push(`/store/orders/${orderId}`);
  };

  const handleViewImage = (imageUrl: string) => {
    setViewImageUrl(imageUrl);
  };

  const handleCloseImage = () => {
    setViewImageUrl(null);
  };

  const handleDeleteClick = (orderId: number) => {
    setSelectedOrderId(orderId);
    setOpenDeleteDialog(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedOrderId) return;

    setDeleteLoading(true);
    try {
      await deleteOrder(selectedOrderId);
      setOpenDeleteDialog(false);
      fetchOrders();
    } catch (err: any) {
      setError(err.message || "Failed to delete order");
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleDeleteCancel = () => {
    setOpenDeleteDialog(false);
    setSelectedOrderId(null);
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
        <Button
          variant="contained"
          className="bg-[#555]"
          startIcon={<AddIcon />}
          onClick={handleCreateOrder}
        >
          Create Order
        </Button>
      </Box>

      {error && (
        <Box sx={{ mb: 3 }}>
          <Typography color="error">{error}</Typography>
        </Box>
      )}

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
          <CircularProgress />
        </Box>
      ) : orders.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: "center" }}>
          <Typography variant="body1">No orders found</Typography>
          <Button
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={handleCreateOrder}
            sx={{ mt: 2 }}
          >
            Create your first order
          </Button>
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
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell>{order.id}</TableCell>
                  <TableCell>{formatDate(order.created_at)}</TableCell>
                  <TableCell>${order.amount.toLocaleString()}</TableCell>
                  <TableCell>{order.orderDetail_weight} kg</TableCell>
                  <TableCell>
                    <Chip
                      label={order.status}
                      color={getStatusColor(order.status) as any}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    {order.scrap_image_url && (
                      <IconButton
                        size="small"
                        onClick={() => handleViewImage(order.scrap_image_url)}
                      >
                        <VisibilityIcon fontSize="small" />
                      </IconButton>
                    )}
                  </TableCell>
                  <TableCell align="right">
                    <IconButton
                      size="small"
                      onClick={() => handleViewDetails(order.id)}
                      sx={{ mr: 1 }}
                    >
                      <VisibilityIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => handleDeleteClick(order.id)}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      
      <CreateOrderModal
      open={openCreateModal}
      onClose={handleCloseCreateModal}
      onSuccess={handleOrderCreated}
      />
      

      <Dialog open={openDeleteDialog} onClose={handleDeleteCancel} PaperProps={{
        sx: {
          margin: 'auto',
          width: { xs: '95%', sm: '80%', md: '70%' },
          maxWidth: '800px'
        }
      }}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this order? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel} disabled={deleteLoading}>
            Cancel
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            color="error"
            disabled={deleteLoading}
            startIcon={deleteLoading ? <CircularProgress size={20} /> : null}
          >
            {deleteLoading ? "Deleting..." : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>

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

export default OrdersPage; 