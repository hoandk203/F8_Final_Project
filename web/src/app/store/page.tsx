"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
// import { fetchStoreList } from "@/redux/slice/storeSlice";
import { Card, CardContent, Grid, Typography, Box, Breadcrumbs, Link, CircularProgress } from "@mui/material";
import { Home as HomeIcon, Store as StoreIcon, AttachMoney as AttachMoneyIcon } from "@mui/icons-material";
import LineChart from "@/app/store/components/LineChart";
import OrderList from "@/app/store/components/OrderList";
// import StoreProfileHeader from "@/app/store/components/StoreProfileHeader";

const StorePage = () => {
  const dispatch = useDispatch<AppDispatch>();
  // const { stores, loading, error } = useSelector((state: RootState) => state.store);
  const [currentStore, setCurrentStore] = useState<any>(null);
  const [revenueData, setRevenueData] = useState({
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    datasets: [
      {
        label: "Doanh thu",
        data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        borderColor: "rgb(24, 103, 192)",
        backgroundColor: "rgba(24, 103, 192, 0.5)",
      },
    ],
  });

  // useEffect(() => {
  //   dispatch(fetchStoreList());
  // }, [dispatch]);

  // useEffect(() => {
  //   if (stores && stores.length > 0) {
  //     setCurrentStore(stores[0]);
  //   }
  // }, [stores]);

  useEffect(() => {
    if (currentStore) {
      setRevenueData({
        labels: ["T1", "T2", "T3", "T4", "T5", "T6", "T7", "T8", "T9", "T10", "T11", "T12"],
        datasets: [
          {
            label: "Doanh thu",
            data: [65000, 59000, 80000, 81000, 56000, 55000, 90000, 81000, 75000, 69000, 91000, 110000],
            borderColor: "rgb(24, 103, 192)",
            backgroundColor: "rgba(24, 103, 192, 0.5)",
          },
        ],
      });
    }
  }, [currentStore]);

  // if (loading) {
  //   return (
  //     <Box className="flex justify-center items-center h-screen">
  //       <CircularProgress />
  //     </Box>
  //   );
  // }

  // if (error) {
  //   return (
  //     <Box className="p-3">
  //       <Typography color="error" variant="h6">
  //         Đã xảy ra lỗi: {error}
  //       </Typography>
  //     </Box>
  //   );
  // }

  return (
    <div className="p-4">
      {/* Store Profile Header */}
      {/* {currentStore && ( */}
        <div className="mb-6">
          <div className="flex items-start md:items-center flex-col md:flex-row gap-4">
            <div className="bg-green-600 rounded-lg p-4 w-16 h-16 flex items-center justify-center">
              <img src="/store-icon.png" alt="Store" className="w-10 h-10" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Amazon VN</h1>
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 text-sm text-gray-600 mt-1">
                <span>store@test.com</span>
                <span className="hidden sm:inline">•</span>
                <span>Owner by: Trần Minh Chính Kiên</span>
                <span className="hidden sm:inline">•</span>
                <span>Hotline: 0972193812</span>
              </div>
            </div>
          </div>
        </div>
      {/* )} */}

      {/* Dashboard Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Summary Card */}
        <div className="lg:col-span-3">
          <Card>
            <CardContent>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
                <Typography variant="h6" className="mb-2 sm:mb-0">Tổng doanh thu</Typography>
                <div className="flex items-center">
                  <AttachMoneyIcon color="primary" />
                  <Typography variant="h6" color="primary">
                    {currentStore?.totalRevenue ? currentStore.totalRevenue.toLocaleString() : "0"}
                  </Typography>
                </div>
              </div>
              <div className="w-full" style={{ height: '300px', minHeight: '300px', position: 'relative' }}>
                <div style={{ position: 'absolute', width: '100%', height: '100%' }}>
                  <LineChart data={revenueData} />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Orders */}
        <div className="lg:col-span-3 mt-6">
          <Typography variant="h6" className="mb-4">
            Danh sách đơn hàng
          </Typography>
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <OrderList />
          </div>
        </div>
      </div>
    </div>
  );
};

export default StorePage;
