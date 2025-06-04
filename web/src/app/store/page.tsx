"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { Card, CardContent, Grid, Typography, Box, Breadcrumbs, Link, CircularProgress, Button } from "@mui/material";
import { Home as HomeIcon, Store as StoreIcon, AttachMoney as AttachMoneyIcon } from "@mui/icons-material";
import LineChart from "@/app/store/components/LineChart";
import OrderList from "@/app/store/components/OrderList";
import { useRouter } from "next/navigation";
import { refreshToken, getAuthTokens, setAuthTokens, clearAuthTokens } from "@/services/authService";
import { fetchUserProfile } from "@/redux/middlewares/authMiddleware";
import { getOrdersByStore } from "@/services/orderService";

interface User {
  email: string;
  phone: string;
  name: string;
  vendor_name: string;
}

interface Order {
  id: number;
  store_id: number;
  amount: number;
  status: string;
  created_at: string;
  orderDetail_weight: number;
}

const StorePage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const router= useRouter();
  const {user, status, error} = useSelector((state: RootState) => state.auth as { user: User | null, status: string, error: string | null });

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [revenueData, setRevenueData] = useState({
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    datasets: [
      {
        label: "Revenue",
        data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        borderColor: "rgb(24, 103, 192)",
        backgroundColor: "rgba(24, 103, 192, 0.5)",
      },
    ],
  });
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const [totalWeight, setTotalWeight] = useState(0);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await getOrdersByStore();
      setOrders(response || []);
      processOrderData(response);
    } catch (err) {
      console.log("Failed to fetch orders:", err);
    } finally {
      setLoading(false);
    }
  };

  const processOrderData = (orders: Order[]) => {
    if (!orders || orders.length === 0) return;

    // Calculate total revenue and number of orders
    let total = 0;
    let totalWeight = 0;
    let pending = 0;
    let completed = 0;

    // Initialize monthly revenue array
    const monthlyRevenue = Array(12).fill(0);
    
    // Loop through each order to calculate
    orders.forEach(order => {
      // Only count completed orders for revenue
      if (order.status.toLowerCase() === 'completed') {
        // Calculate total revenue
        total += parseFloat(order.amount.toString());
        
        // Calculate revenue by month
        const orderDate = new Date(order.created_at);
        const month = orderDate.getMonth(); // 0-11
        monthlyRevenue[month] += parseFloat(order.amount.toString());
      }
      
      // Calculate total weight for all orders
      totalWeight += order.orderDetail_weight || 0;
    });
    
    // Update state
    setTotalRevenue(total);
    setTotalOrders(orders.length);
    setTotalWeight(totalWeight);
    
    // Update chart data
    setRevenueData({
      labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
      datasets: [
        {
          label: "Revenue",
          data: monthlyRevenue,
          borderColor: "rgb(24, 103, 192)",
          backgroundColor: "rgba(24, 103, 192, 0.5)",
        },
      ],
    });
  };

  useEffect(() => {
    const checkAuth= async () => {
        const tokens = getAuthTokens();
        if(!tokens?.access_token){
            router.push("/store-login")
            return
        }
        if(!user){
            try {
                // Dispatch action to get profile info and save to Redux store
                const userData= await dispatch(fetchUserProfile(tokens.access_token)).unwrap()
                if(userData.user.role !== "store"){
                    router.push("/store-login");
                    clearAuthTokens();
                }
            }catch (err: any) {
                if (err?.message === "Access token expired") {
                    try {
                        const oldRefreshToken = tokens.refresh_token;
                        const newTokens = await refreshToken(oldRefreshToken || "");
                        
                        // Update tokens in cookies
                        setAuthTokens({
                            access_token: newTokens.access_token,
                            refresh_token: newTokens.refresh_token,
                            role: tokens.role
                        });

                        // Retry with new token
                        await dispatch(fetchUserProfile(newTokens.access_token)).unwrap()
                    }
                    catch (refreshError) {
                        clearAuthTokens();
                        router.push("/store-login")
                    }
                } else {
                    clearAuthTokens();
                    router.push("/store-login")
                }
            }
        }
    }
    checkAuth()
  }, [dispatch, router]);

  useEffect(() => {
    if (user) {
      fetchOrders();
    }
  }, [user]);

  if (loading && !user) {
    return (
      <Box className="flex justify-center items-center h-screen">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <div className="p-4">
      {/* Store Profile Header */}
      <div className="mb-6">
        <div className="flex items-start md:items-center flex-col md:flex-row gap-4">
          <div>
            <h1 className="text-2xl font-bold">{user?.name}</h1>
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 text-sm text-gray-600 mt-1">
              <span>Email: {user?.email}</span>
              <span className="hidden sm:inline">•</span>
              <span>Vendor: {user?.vendor_name}</span>
              <span className="hidden sm:inline">•</span>
              <span>Hotline: {user?.phone}</span>
            </div>
          </div>
        </div>
      </div>

      

      {/* Dashboard Content */}
      <div className="grid grid-cols-4 md-grid-cols-1 gap-6">
        {/* Revenue Summary Card */}
        <div className="col-span-4 md:col-span-3">
          <Card>
            <CardContent>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
                <Typography variant="h6" className="mb-2 sm:mb-0">Monthly Revenue</Typography>
                <div className="flex items-center">
                  <AttachMoneyIcon color="primary" />
                  <Typography variant="h6" color="primary">
                    {totalRevenue.toLocaleString()}
                  </Typography>
                </div>
              </div>
              <div className="w-full" style={{ height: '320px', minHeight: '320px', position: 'relative' }}>
                <div style={{ position: 'absolute', width: '100%', height: '100%' }}>
                  <LineChart data={revenueData} />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Overview Statistics Cards */}
        <div className="grid grid-cols-1 gap-4">
          <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Orders</p>
                <p className="text-2xl font-semibold mt-1">{totalOrders}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
            </div>
            <div className="mt-2 text-sm text-gray-600 flex flex-col gap-1">
              <span>Completed: {orders.filter(o => o.status.toLowerCase() === 'completed').length.toLocaleString()} orders</span>
              <span>Uncompleted: {orders.filter(o => o.status.toLowerCase() !== 'completed').length.toLocaleString()} orders</span>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Revenue</p>
                <p className="text-2xl font-semibold mt-1">${totalRevenue.toLocaleString()}</p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Weight</p>
                <p className="text-2xl font-semibold mt-1">{totalWeight.toLocaleString()} kg</p>
              </div>
              <div className="bg-purple-100 p-3 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                </svg>
              </div>
            </div>
            <div className="mt-2 text-sm text-gray-600 flex flex-col gap-1">
              <span>Completed: {orders.filter(o => o.status.toLowerCase() === 'completed').reduce((acc, curr) => acc + (curr.orderDetail_weight || 0), 0).toLocaleString()} kg</span>
              <span>Uncompleted: {orders.filter(o => o.status.toLowerCase() !== 'completed').reduce((acc, curr) => acc + (curr.orderDetail_weight || 0), 0).toLocaleString()} kg</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="mt-6">
        <div className="flex justify-between items-center mb-4">
          <Typography variant="h6">Recent Orders</Typography>
          <Button 
            variant="outlined" 
            size="small"
            onClick={() => router.push('/store/orders')}
          >
            View All
          </Button>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {orders.slice(0, 5).map(order => (
                <tr key={order.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">#{order.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(order.created_at).toLocaleDateString('vi-VN')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${order.amount.toLocaleString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      order.status.toLowerCase() === 'completed' 
                        ? 'bg-green-100 text-green-800' 
                        : order.status.toLowerCase() === 'pending'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
              
              {orders.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-4 text-center text-sm text-gray-500">
                    No orders yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      
    </div>
  );
};

export default StorePage;
