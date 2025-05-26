"use client"

import dynamic from 'next/dynamic';
import { CircularProgress } from '@mui/material';

const VerifyAdminContainer = dynamic(
    () => import('./components/VerifyAdminContainer'),
    {
        ssr: false,
        loading: () => <div className="flex justify-center items-center">
            <CircularProgress />
        </div>
    }
);

const VerifyAdminPage = () => {
    return (
        <div className="container mx-auto">
            <div className="text-[16px] pt-8 px-4">
                <div className="text-center py-8">
                    <VerifyAdminContainer />
                </div>
            </div>
        </div>
    )
}

export default VerifyAdminPage;