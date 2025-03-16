"use client";

import { useState, useEffect } from 'react';
import { Button } from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';

const PWAInstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState(true);

  useEffect(() => {
    const handler = (e: Event) => {
      // Ngăn Chrome hiển thị prompt cài đặt mặc định
      e.preventDefault();
      // Lưu sự kiện để có thể kích hoạt sau
      setDeferredPrompt(e);
      // Hiển thị prompt tùy chỉnh của chúng ta
      setShowInstallPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handler as EventListener);

    // Kiểm tra xem ứng dụng đã được cài đặt chưa
    window.addEventListener('appinstalled', () => {
      // Ẩn nút cài đặt khi ứng dụng đã được cài đặt
      setShowInstallPrompt(false);
      console.log('PWA đã được cài đặt thành công');
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handler as EventListener);
    };
  }, []);

  const handleInstallClick = () => {
    if (!deferredPrompt) return;

    // Hiển thị prompt cài đặt
    deferredPrompt.prompt();

    // Đợi người dùng phản hồi
    deferredPrompt.userChoice.then((choiceResult: { outcome: string }) => {
      if (choiceResult.outcome === 'accepted') {
        console.log('Người dùng đã chấp nhận cài đặt PWA');
      } else {
        console.log('Người dùng đã từ chối cài đặt PWA');
      }
      // Xóa prompt, nó chỉ có thể được sử dụng một lần
    //   setDeferredPrompt(null);
    });
  };

  // Nếu không có prompt cài đặt hoặc không nên hiển thị, không render gì cả
  if (!showInstallPrompt) {
    return null;
  }

  return (
    <div className="pwa-install-banner">
      <div className="fixed bottom-0 left-0 right-0 bg-white shadow-lg p-4 flex justify-between items-center z-50 border-t border-gray-200">
        <div className="flex-1">
          <h3 className="font-medium text-gray-900">Cài đặt ứng dụng</h3>
          <p className="text-sm text-gray-600">Cài đặt ứng dụng này để truy cập nhanh hơn và sử dụng offline</p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outlined" 
            color="inherit" 
            onClick={() => setShowInstallPrompt(false)}
            size="small"
          >
            Để sau
          </Button>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={handleInstallClick}
            startIcon={<DownloadIcon />}
            size="small"
          >
            Cài đặt
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PWAInstallPrompt;