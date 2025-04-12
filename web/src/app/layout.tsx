import type {Metadata} from "next";
import '@/assets/css/style.css'

import Providers from "@/redux/Providers";

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const metadata: Metadata = {
  title: "Driver App",
  description: "Driver App",
};

export default function RootLayout({children,}: Readonly<{children: React.ReactNode;}>) {
    return (
        <html lang="en">
            <body>
                <Providers>
                    <ToastContainer autoClose={3000}/>
                    {children}
                    
                </Providers>
            </body>
        </html>
    );
}
