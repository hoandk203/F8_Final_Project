"use client"

import VerifyDriverContainer from "@/app/driver/verify-driver/components/VerifyDriverContainer";
import { Suspense } from 'react';
import { CircularProgress } from '@mui/material';

// Prevent pre-rendering
export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

const VerifyDriverPage = () => {
    return (
        <div className="container mx-auto">
            <div className="text-[16px] pt-8 px-4">
                <div className="text-center py-8">
                    <Suspense fallback={<CircularProgress />}>
                        <VerifyDriverContainer />
                    </Suspense>
                </div>
            </div>
        </div>
    )
}

export default VerifyDriverPage;