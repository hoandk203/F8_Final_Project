import React from "react";
import { Menu as MenuIcon, Notifications as BellIcon } from "@mui/icons-material";

interface StoreHeaderProps {
  showSidebar: boolean;
  setShowSidebar: (show: boolean) => void;
}

const StoreHeader = ({ showSidebar, setShowSidebar }: StoreHeaderProps) => {
  return (
    <header className="bg-white shadow">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center">
          <button
            onClick={() => setShowSidebar(!showSidebar)}
            className="lg:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 focus:outline-none"
          >
            <MenuIcon className="h-6 w-6" />
          </button>
          <nav className="hidden lg:flex ml-4">
            <ol className="flex items-center space-x-1 text-sm">
              <li>
                <a href="/store" className="text-gray-500 hover:text-gray-900">
                  Home
                </a>
              </li>
              <li className="flex items-center">
                <span className="mx-1 text-gray-400">/</span>
                <span className="text-gray-900">Dashboard</span>
              </li>
            </ol>
          </nav>
        </div>
        <div className="flex items-center space-x-4">
          <button className="p-1 rounded-full text-gray-600 hover:text-gray-900 focus:outline-none">
            <BellIcon className="h-6 w-6" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default StoreHeader;