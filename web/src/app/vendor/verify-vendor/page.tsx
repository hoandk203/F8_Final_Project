"use client"

import dynamic from 'next/dynamic';
import { CircularProgress } from '@mui/material';

const VerifyVendorContainer = dynamic(
    () => import('./components/VerifyVendorContainer'),
    {
        ssr: false,
        loading: () => <div className="flex justify-center items-center">
            <CircularProgress />
        </div>
    }
);

const VerifyVendorPage = () => {
    return (
        <div className="container mx-auto">
            <div className="text-[16px] pt-8 px-4">
                <div className="text-center py-8">
                    <VerifyVendorContainer />
                </div>
            </div>
        </div>
    )
}

export default VerifyVendorPage;