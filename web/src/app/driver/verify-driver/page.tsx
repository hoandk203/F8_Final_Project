"use client"

import dynamic from 'next/dynamic';
import { CircularProgress } from '@mui/material';

const VerifyDriverContainer = dynamic(
    () => import('./components/VerifyDriverContainer'),
    {
        ssr: false,
        loading: () => <div className="flex justify-center items-center">
            <CircularProgress />
        </div>
    }
);

const VerifyDriverPage = () => {
    return (
        <div className="container mx-auto">
            <div className="text-[16px] pt-8 px-4">
                <div className="text-center py-8">
                    <VerifyDriverContainer />
                </div>
            </div>
        </div>
    )
}

export default VerifyDriverPage;