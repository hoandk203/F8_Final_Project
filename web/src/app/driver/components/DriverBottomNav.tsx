"use client"

import { useRouter, usePathname } from 'next/navigation';
import HomeIcon from '@mui/icons-material/Home';
import NotificationsIcon from '@mui/icons-material/Notifications';
import PersonIcon from '@mui/icons-material/Person';

const DriverBottomNav = () => {
  const router = useRouter();
  const pathname = usePathname();

  const isActive = (path: string) => {
    return pathname === path;
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white shadow-lg border-t border-gray-200 z-50">
      <div className="flex justify-around items-center h-16">
        <button 
          onClick={() => router.push('/driver')}
          className={`flex flex-col items-center justify-center w-1/3 h-full ${
            isActive('/driver') ? 'text-green-600' : 'text-gray-500'
          }`}
        >
          <HomeIcon className="mb-1" fontSize="medium" />
          <span className="text-xs">Home</span>
        </button>
        
        <button 
          onClick={() => router.push('/driver/notifications')}
          className={`flex flex-col items-center justify-center w-1/3 h-full ${
            isActive('/driver/notifications') ? 'text-green-600' : 'text-gray-500'
          }`}
        >
          <NotificationsIcon className="mb-1" fontSize="medium" />
          <span className="text-xs">Notifications</span>
        </button>
        
        <button 
          onClick={() => router.push('/driver/profile')}
          className={`flex flex-col items-center justify-center w-1/3 h-full ${
            isActive('/driver/profile') ? 'text-green-600' : 'text-gray-500'
          }`}
        >
          <PersonIcon className="mb-1" fontSize="medium" />
          <span className="text-xs">Profile</span>
        </button>
      </div>
    </div>
  );
};

export default DriverBottomNav;
