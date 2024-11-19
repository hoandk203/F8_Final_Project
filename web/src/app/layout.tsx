import type {Metadata} from "next";
import '@/assets/css/style.css'

export const metadata: Metadata = {
    title: "Driver App",
    description: "Driver App",
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
        <body>
        {children}
        </body>
        </html>
    );
}
