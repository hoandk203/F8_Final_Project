import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Home as HomeIcon, 
  ShoppingCart as ShoppingCartIcon, 
  Person as UserIcon, 
  Settings as CogIcon, 
  Logout as LogoutIcon,
  BarChart as ChartBarIcon
} from "@mui/icons-material";

const StoreSidebar = () => {
  const pathname = usePathname();

  const menuItems = [
    {
      name: "Dashboard",
      href: "/store",
      icon: HomeIcon,
    },
    {
      name: "Đơn hàng",
      href: "/store/orders",
      icon: ShoppingCartIcon,
    },
    {
      name: "Thống kê",
      href: "/store/statistics",
      icon: ChartBarIcon,
    },
    {
      name: "Hồ sơ",
      href: "/store/profile",
      icon: UserIcon,
    },
    {
      name: "Cài đặt",
      href: "/store/settings",
      icon: CogIcon,
    },
  ];

  return (
    <div className="h-screen flex flex-col bg-white border-r px-2">
      <div className="p-4">
        <Link href="/store" className="flex items-center py-3">
          <img src="../../logo.png" alt="Logo" className="h-8 w-auto" />
          <span className="ml-2 text-xl font-bold">Scraplan</span>
        </Link>
      </div>
      <div className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-2 px-2">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={`flex items-center p-2 rounded-lg ${
                    isActive
                      ? "bg-primary text-white"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <item.icon className={`h-5 w-5 ${isActive ? "text-white" : "text-gray-500"}`} />
                  <span className="ml-3">{item.name}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
      <div className="p-4 border-t">
        <div className="flex items-center mb-4">
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-700">Amazon VN</p>
            <p className="text-xs text-gray-500">Email: store@example.com</p>
            <p className="text-xs text-gray-500">Hotline: 0972193812</p>
          </div>
        </div>
        <button className="flex items-center w-full p-2 text-gray-700 rounded-lg hover:bg-gray-100">
          <LogoutIcon className="h-5 w-5 text-gray-500" />
          <span className="ml-3">Đăng xuất</span>
        </button>
      </div>
    </div>
  );
};

export default StoreSidebar; 