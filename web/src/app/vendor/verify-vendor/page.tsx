"use client"

import { Suspense } from 'react';
import { CircularProgress } from '@mui/material';
import VerifyVendorContainer from "./components/VerifyVendorContainer";

// Prevent pre-rendering
export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

const VerifyVendorPage = () => {
    return (
        <div className="container mx-auto">
            <div className="text-[16px] pt-8 px-4">
                <div className="text-center py-8">
                    <Suspense fallback={<CircularProgress />}>
                        <VerifyVendorContainer />
                    </Suspense>
                </div>
            </div>
        </div>
    )
}

export default VerifyVendorPage;