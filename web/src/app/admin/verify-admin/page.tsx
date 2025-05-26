"use client"

import { Suspense } from 'react';
import { CircularProgress } from '@mui/material';
import VerifyAdminContainer from "./components/VerifyAdminContainer";

// Prevent pre-rendering
export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

const VerifyAdminPage = () => {
    return (
        <div className="container mx-auto">
            <div className="text-[16px] pt-8 px-4">
                <div className="text-center py-8">
                    <Suspense fallback={<CircularProgress />}>
                        <VerifyAdminContainer />
                    </Suspense>
                </div>
            </div>
        </div>
    )
}

export default VerifyAdminPage;