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
import { useRouter } from "next/navigation";
import { logoutUser } from "@/redux/middlewares/authMiddleware";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";

const StoreSidebar = () => {
  const pathname = usePathname();
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  
  const menuItems = [
    {
      name: "Dashboard",
      href: "/store",
      icon: HomeIcon,
    },
    {
      name: "Order",
      href: "/store/orders",
      icon: ShoppingCartIcon,
    },
    {
      name: "Profile",
      href: "/store/profile",
      icon: UserIcon,
    },
    {
      name: "Settings",
      href: "/store/settings",
      icon: CogIcon,
    },
  ];

  const handleLogout = async () => {
    const accessToken = localStorage.getItem("access_token");
    const refreshToken = localStorage.getItem("refresh_token");
    
    if (accessToken && refreshToken) {
      await dispatch(logoutUser({ accessToken, refreshToken }));
    }
    
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    if(pathname.startsWith("/store")){
      router.push("/store-login");
    }else{
      router.push("/vendor-login");
    }
  };

  // Hàm kiểm tra xem một menu item có đang active hay không
  const isActive = (href: string) => {
    if (href === "/store") {
      // Nếu là trang Dashboard, chỉ active khi đường dẫn chính xác là /store
      return pathname === "/store";
    }
    // Với các trang khác, kiểm tra xem pathname có bắt đầu bằng href không
    return pathname.startsWith(href);
  };

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
            const active = isActive(item.href);
            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={`flex items-center p-2 rounded-lg ${
                    active
                      ? "bg-[#555] text-white"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <item.icon className={`h-5 w-5 ${active ? "text-white" : "text-gray-500"}`} />
                  <span className="ml-3">{item.name}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
      <div className="p-4">
        <button className="flex items-center w-full p-2 text-gray-700 rounded-lg hover:bg-gray-100">
          <LogoutIcon className="h-5 w-5 text-gray-500" />
          <span className="ml-3" onClick={handleLogout}>Logout</span>
        </button>
        <div className="flex items-center py-4 border-t mt-2">
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-700 py-1">Amazon VN</p>
            <p className="text-xs text-gray-500 py-1">Email: store@example.com</p>
            <p className="text-xs text-gray-500 py-1">Hotline: 0972193812</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoreSidebar; 