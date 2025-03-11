import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import {
  Box,
  Button,
  Card,
  Grid,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Pagination,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Typography,
} from "@mui/material";
import {
  Add as AddIcon,
  FileDownload as FileDownloadIcon,
  Search as SearchIcon,
  Visibility as VisibilityIcon,
} from "@mui/icons-material";

const OrderList = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [staff, setStaff] = useState("");
  const [status, setStatus] = useState("");
  
  // Giả lập dữ liệu đơn hàng
  const orders: any[] = [];
  const loading = false;

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleAddOrder = () => {
    // Xử lý thêm đơn hàng mới
    console.log("Add new order");
  };

  const handleExport = () => {
    // Xử lý xuất dữ liệu
    console.log("Export data");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "success";
      case "pending":
        return "warning";
      case "cancelled":
        return "error";
      default:
        return "default";
    }
  };

  return (
    <Box>
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} md={5}>
          <TextField
            fullWidth
            placeholder="Tìm kiếm"
            value={searchTerm}
            onChange={handleSearch}
            size="small"
            InputProps={{
              endAdornment: <SearchIcon />,
            }}
          />
        </Grid>
        <Grid item xs={12} md={7}>
          <Grid container spacing={2}>
            <Grid item xs={6} md={4}>
              <FormControl fullWidth size="small">
                <InputLabel>Nhân viên</InputLabel>
                <Select
                  value={staff}
                  label="Nhân viên"
                  onChange={(e) => setStaff(e.target.value)}
                >
                  <MenuItem value="">Tất cả</MenuItem>
                  <MenuItem value="staff1">Nhân viên 1</MenuItem>
                  <MenuItem value="staff2">Nhân viên 2</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6} md={4}>
              <FormControl fullWidth size="small">
                <InputLabel>Trạng thái</InputLabel>
                <Select
                  value={status}
                  label="Trạng thái"
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <MenuItem value="">Tất cả</MenuItem>
                  <MenuItem value="pending">Đang xử lý</MenuItem>
                  <MenuItem value="completed">Hoàn thành</MenuItem>
                  <MenuItem value="cancelled">Đã hủy</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={4} sx={{ display: "flex", justifyContent: { xs: "center", md: "flex-end" }, mt: { xs: 2, md: 0 } }}>
              <Button
                className="px-2 py-1"
                variant="contained"
                startIcon={<FileDownloadIcon />}
                sx={{ mr: 1}}
                onClick={handleExport}
              >
                Export
              </Button>
              <Button
                variant="contained"
                color="primary"
                startIcon={<AddIcon />}
                onClick={handleAddOrder}
              >
                Order
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="order table">
          <TableHead>
            <TableRow>
              <TableCell>Mã đơn hàng</TableCell>
              <TableCell>Giá trị</TableCell>
              <TableCell>Tài xế</TableCell>
              <TableCell>Nhà cung cấp</TableCell>
              <TableCell>Nhân viên</TableCell>
              <TableCell>Thời gian tạo</TableCell>
              <TableCell>Trạng thái</TableCell>
              <TableCell>Xác nhận</TableCell>
              <TableCell>Thao tác</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.length > 0 ? (
              orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell>{order.id}</TableCell>
                  <TableCell>{order.cost}</TableCell>
                  <TableCell>{order.driver}</TableCell>
                  <TableCell>{order.vendor}</TableCell>
                  <TableCell>{order.staff}</TableCell>
                  <TableCell>{order.createdTime}</TableCell>
                  <TableCell>
                    <Chip
                      label={order.status}
                      color={getStatusColor(order.status)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{order.confirmation}</TableCell>
                  <TableCell>
                    <IconButton size="small">
                      <VisibilityIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={9} align="center">
                  {loading ? "Đang tải..." : "Không có dữ liệu"}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
        <Pagination
          count={10}
          page={page}
          onChange={handlePageChange}
          color="primary"
        />
      </Box>
    </Box>
  );
};

export default OrderList;