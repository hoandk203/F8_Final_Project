import type {Metadata} from "next";
import '@/assets/css/style.css'

import Providers from "@/redux/Providers";

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const metadata: Metadata = {
  title: "Scrap Plan",
  description: "Scrap Plan - Hệ thống quản lý thu gom phế liệu",
  icons: {
    icon: '/logo.png',
    shortcut: '/logo.png',
    apple: '/logo.png',
  },
  openGraph: {
    title: "Scrap Plan",
    description: "Hệ thống quản lý thu gom phế liệu",
    images: ['/logo.png'],
  },
};

export default function RootLayout({children,}: Readonly<{children: React.ReactNode;}>) {
    return (
        <html lang="en">
            <head>
                <link rel="icon" href="/logo.png" type="image/png" />
                <link rel="apple-touch-icon" href="/logo.png" />
            </head>
            <body>
                <Providers>
                    <ToastContainer autoClose={3000}/>
                    {children}
                    
                </Providers>
            </body>
        </html>
    );
}
