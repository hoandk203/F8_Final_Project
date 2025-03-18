"use client";

import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  Paper, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  TablePagination,
  Chip,
  IconButton,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';
import { getIssuesByStore, createIssue, deleteIssue } from '@/services/issueService';
import { getOrders } from '@/services/orderService';
import { Issue } from '@/types/issue';
import IssueChat from '@/components/issues/IssueChat';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import UploadImages from '@/components/UploadImages';
import { refreshToken } from '@/services/authService';
import router from 'next/router';
import { fetchUserProfile } from '@/redux/middlewares/authMiddleware';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/redux/store';
import DeleteIcon from '@mui/icons-material/Delete';

interface Order {
  id: number;
  customerName: string;
}

interface User {
  id: number;
  user: {
    id: number;
  }
}

const statusColors: Record<string, string> = {
  'pending': 'warning',
  'processing': 'info',
  'resolved': 'success',
  'cancelled': 'error'
};

const statusLabels: Record<string, string> = {
  'pending': 'Chờ xử lý',
  'processing': 'Đang xử lý',
  'resolved': 'Đã giải quyết',
  'cancelled': 'Đã hủy'
};

const IssueStorePage = () => {
  const dispatch = useDispatch<AppDispatch>();
  // State cho danh sách issues
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalIssues, setTotalIssues] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');

  // State cho dialog tạo issue mới
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [newIssue, setNewIssue] = useState({
    orderId: '',
    issueName: '',
    description: ''
  });
  const {user} = useSelector((state: RootState) => state.auth as { user: User | null, status: string, error: string | null });
  const [orders, setOrders] = useState<Order[]>([]);
  const [creatingIssue, setCreatingIssue] = useState(false);

  // State cho IssueChat
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);
  const [openChat, setOpenChat] = useState(false);

  const [issueImage, setIssueImage] = useState<string | null>(null);
  const [userLoaded, setUserLoaded] = useState(false);

  // Thêm state cho dialog xác nhận xóa
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [issueToDelete, setIssueToDelete] = useState<number | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const accessToken = localStorage.getItem("access_token");
      if (!accessToken) {
        router.push("/store-login");
        return;
      }

      try {
        await dispatch(fetchUserProfile(accessToken)).unwrap();
        setUserLoaded(true);
      } catch (err: any) {
        if (err?.message === "Access token expired") {
          try {
            const oldRefreshToken = localStorage.getItem("refresh_token");
            const newTokens = await refreshToken(oldRefreshToken || "");
            localStorage.setItem("access_token", newTokens.access_token);
            localStorage.setItem("refresh_token", newTokens.refresh_token);

            // Thử lại với token mới
            await dispatch(fetchUserProfile(newTokens.access_token)).unwrap();
            setUserLoaded(true);
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
  }, []);

  // Chỉ gọi fetchIssues khi user đã được tải xong
  useEffect(() => {
    if (userLoaded && user?.id) {
      fetchIssues();
    }
  }, [userLoaded, user?.id]);

  // Fetch issues
  const fetchIssues = async () => {
    if (!user?.id) return;
    
    setLoading(true);
    try {
      const response = await getIssuesByStore(user.id);
      setIssues(response);
      setTotalIssues(response.length);
    } catch (error) {
      console.error('Error fetching issues:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch orders for create issue dialog
  const fetchOrders = async () => {
    try {
      const response = await getOrders();
      setOrders(response);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  // Handlers
  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setPage(0);
  };

  const handleOpenCreateDialog = async () => {
    await fetchOrders();
    setOpenCreateDialog(true);
  };

  const handleCloseCreateDialog = () => {
    setOpenCreateDialog(false);
    setNewIssue({
      orderId: '',
      issueName: '',
      description: ''
    });
  };

  const handleCreateIssue = async () => {
    if (!newIssue.orderId || !newIssue.issueName || !newIssue.description) {
      return;
    }

    setCreatingIssue(true);
    try {
      await createIssue({
        userId: user?.user?.id || 0,
        orderId: parseInt(newIssue.orderId),
        issueName: newIssue.issueName,
        description: newIssue.description,
        storeId: user?.id || 0,
        creatorRole: 'store',
        issueImage
      });
      
      // Refresh issues list
      const response = await getIssuesByStore(user?.id || 0);
      setIssues(response);
      setTotalIssues(response.length);
      
      handleCloseCreateDialog();
    } catch (error) {
      console.error('Error creating issue:', error);
    } finally {
      setCreatingIssue(false);
    }
  };

  const handleOpenChat = (issue: Issue) => {
    setSelectedIssue(issue);
    setOpenChat(true);
  };

  const handleCloseChat = () => {
    setOpenChat(false);
    setSelectedIssue(null);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  // Sửa lại hàm handleDeleteIssue để mở dialog xác nhận
  const handleDeleteClick = (issueId: number) => {
    setIssueToDelete(issueId);
    setOpenDeleteDialog(true);
  };
  
  // Hàm xử lý khi người dùng xác nhận xóa
  const handleConfirmDelete = async () => {
    if (issueToDelete === null) return;
    
    setDeleteLoading(true);
    try {
      await deleteIssue(issueToDelete);
      setIssues(issues.filter((issue) => issue.id !== issueToDelete));
      setTotalIssues(prevTotal => prevTotal - 1);
      setOpenDeleteDialog(false);
    } catch (error) {
      console.error('Error deleting issue:', error);
    } finally {
      setDeleteLoading(false);
    }
  };
  
  // Hàm xử lý khi người dùng hủy xóa
  const handleCancelDelete = () => {
    setOpenDeleteDialog(false);
    setIssueToDelete(null);
  };

  // Thay thế hàm handleDeleteIssue cũ
  const handleDeleteIssue = (issueId: number) => {
    handleDeleteClick(issueId);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" component="h1">Issue Management</Typography>
        <Button 
          variant="contained" 
          startIcon={<AddIcon />}
          className='bg-[#303030] text-white'
          onClick={handleOpenCreateDialog}
        >
          Create Issue
        </Button>
      </Box>

      <Paper sx={{ mb: 3, p: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <TextField
            placeholder="Search by ID, issue name..."
            variant="outlined"
            size="small"
            fullWidth
            value={searchTerm}
            onChange={handleSearch}
            InputProps={{
              startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />
            }}
          />
        </Box>
      </Paper>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow className="bg-gray-100">
              <TableCell>ID</TableCell>
              <TableCell>Order ID</TableCell>
              <TableCell>Issue name</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Driver</TableCell>
              <TableCell>Created at</TableCell>
              <TableCell align="center">Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  <CircularProgress size={30} />
                </TableCell>
              </TableRow>
            ) : issues.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  No issues found
                </TableCell>
              </TableRow>
            ) : (
              issues.map((issue) => (
                <TableRow key={issue.id}>
                  <TableCell>{issue.id}</TableCell>
                  <TableCell>{issue.order_id}</TableCell>
                  <TableCell>{issue.issue_name}</TableCell>
                  <TableCell>
                    <Chip 
                      label={statusLabels[issue.status] || issue.status} 
                      color={statusColors[issue.status] as any || "default"}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{issue.driver_fullname || 'Not accepted'}</TableCell>
                  <TableCell>{formatDate(issue.created_at)}</TableCell>
                  <TableCell align="center">
                    <IconButton 
                      className='text-[#303030]'
                      onClick={() => handleOpenChat(issue)}
                      title="Reply"
                    >
                      <QuestionAnswerIcon />
                    </IconButton>
                    <span>({issue.message_count})</span>
                    <IconButton 
                      className='text-[#303030]'
                      onClick={() => handleDeleteIssue(issue.id)}
                      title="Delete"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={totalIssues}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="Number of rows per page:"
          labelDisplayedRows={({ from, to, count }) => `${from}-${to} of ${count}`}
        />
      </TableContainer>

      {/* Dialog tạo vấn đề mới */}
      <Dialog 
      open={openCreateDialog} 
      onClose={handleCloseCreateDialog} 
      maxWidth="sm" 
      fullWidth
      sx={{
        '& .MuiDialog-paper': {
          width: '90%',
          maxWidth: '700px',
          margin: '0 auto',
        },
      }}
      >
        <DialogTitle className='text-center'>Create new issue</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>

            <FormControl fullWidth>
              <InputLabel id="order-select-label">Order</InputLabel>
              <Select
                labelId="order-select-label"
                value={newIssue.orderId}
                label="Order"
                onChange={(e) => setNewIssue({...newIssue, orderId: e.target.value as string})}
              >
                {orders.map((order) => (
                  <MenuItem key={order.id} value={order.id.toString()}>
                    #{order.id} - {order.customerName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            
            <TextField
              label="Issue name"
              fullWidth
              value={newIssue.issueName}
              onChange={(e) => setNewIssue({...newIssue, issueName: e.target.value})}
            />
            
            <TextField
              label="Description"
              fullWidth
              multiline
              rows={4}
              value={newIssue.description}
              onChange={(e) => setNewIssue({...newIssue, description: e.target.value})}
            />

            <UploadImages setIssueImage={setIssueImage} />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseCreateDialog}>Cancel</Button>
          <Button 
            onClick={handleCreateIssue} 
            variant="contained" 
            disabled={!newIssue.orderId || !newIssue.issueName || !newIssue.description || creatingIssue}
          >
            {creatingIssue ? <CircularProgress size={24} /> : 'Create issue'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Issue Chat Dialog */}
      {selectedIssue && (
        <IssueChat 
          open={openChat} 
          onClose={handleCloseChat} 
          issue={selectedIssue} 
          userId={user?.user?.id || 0}
        />
      )}

      {/* Dialog xác nhận xóa */}
      <Dialog 
        open={openDeleteDialog} 
        onClose={handleCancelDelete}
        PaperProps={{
          sx: {
            margin: 'auto',
            width: { xs: '95%', sm: '80%', md: '50%' },
            maxWidth: '500px'
          }
        }}
      >
        <DialogTitle>Confirm delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this issue? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDelete} disabled={deleteLoading}>
            Cancel
          </Button>
          <Button
            onClick={handleConfirmDelete}
            color="error"
            disabled={deleteLoading}
            startIcon={deleteLoading ? <CircularProgress size={20} /> : null}
          >
            {deleteLoading ? "Deleting..." : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default IssueStorePage;