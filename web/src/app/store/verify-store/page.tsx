"use client"

import dynamic from 'next/dynamic';
import { CircularProgress } from '@mui/material';

const VerifyStoreContainer = dynamic(
    () => import('./components/VerifyStoreContainer'),
    {
        ssr: false,
        loading: () => <div className="flex justify-center items-center">
            <CircularProgress />
        </div>
    }
);

const VerifyStorePage = () => {
    return (
        <div className="container mx-auto">
            <div className="text-[16px] pt-8 px-4">
                <div className="text-center py-8">
                    <VerifyStoreContainer />
                </div>
            </div>
        </div>
    )
}

export default VerifyStorePage;