"use client"

import React, {useCallback, useEffect} from "react";
import axios from "axios";
import {useDispatch, useSelector} from "react-redux";
import { RootState, AppDispatch } from "@/redux/store";
import {debounce} from "lodash";
import {toast} from "react-toastify";

import {
    InputAdornment,
    TextField
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

import CommonTable from "@/components/commonTable/CommonTable";
import {fetchDriverList} from "@/redux/middlewares/driverMiddleware";
import CustomButton from "@/components/CustomButton";
import DriverDialog from "@/app/admin/drivers/components/DriverDialog";
import {searchDriverByName, softDeleteDriver} from "@/redux/slice/driverSlice";
import LoadingOverlay from "@/components/LoadingOverlay";
import { fetchUserProfile } from "@/redux/middlewares/authMiddleware";
import { refreshToken } from "@/services/authService";
import { useRouter } from "next/navigation";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000";

// Hàm định dạng thời gian
const formatDate = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN'); // Định dạng: DD/MM/YYYY
};

// Hàm định dạng trạng thái tài liệu
const formatDocumentStatus = (status: string) => {
    switch(status) {
        case 'pending':
            return 'Pending';
        case 'approved':
            return 'Approved';
        case 'rejected':
            return 'Rejected';
        default:
            return 'Unknown';
    }
};

const columns= [
    {
        name: "ID",
        key: "id",
    },
    {
        name: "Fullname",
        key: "fullname",
    },
    {
        name: "Date of birth",
        key: "date_of_birth",
        format: formatDate,
    },
    {
        name: "Address",
        key: "address",
    },
    {
        name: "City",
        key: "city",
    },
    {
        name: "Phone number",
        key: "phone_number",
    },
    {
        name: "Document status",
        key: "document_status",
        format: formatDocumentStatus,
    },
    {
        name: "Created at",
        key: "created_at",
        format: formatDate,
    },
    {
        name: "Action",
        key: "action",
    }
]

interface User {
    id: number;
    email: string;
    role: string;
}

const DriversPage = () => {
    const router= useRouter()
    const dispatch= useDispatch<AppDispatch>()
    const driverList= useSelector((state: RootState) => state.driver.driverList)
    const driverListStatus= useSelector((state: RootState) => state.driver.status)
    const [open, setOpen] = React.useState(false);
    const [currentData, setCurrentData] = React.useState({
        id: null,
        fullname: "",
        date_of_birth: "",
        gst_number: "",
        address: "",
        city: "",
        country: "",
        phone_number: "",
        document_status: ""
    });
    const {user} = useSelector((state: RootState) => state.auth as { user: User | null, status: string, error: string | null });
    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setCurrentData({
            id: null,
            fullname: "",
            date_of_birth: "",
            gst_number: "",
            address: "",
            city: "",
            country: "",
            phone_number: "",
            document_status: ""
        })
        setOpen(false);
    };

    useEffect(() => {
        const checkAuth= async () => {
            const accessToken= localStorage.getItem("access_token")
            if(!accessToken){
                router.push("/admin-login")
                return
            }
            if(!user){
                try {
                    // Dispatch action to get profile info and save to Redux store
                    await dispatch(fetchUserProfile(accessToken)).unwrap()
                }catch (err: any) {
                    if (err?.message === "Access token expired") {
                        try {
                            const oldRefreshToken= localStorage.getItem("refresh_token")
                            const newTokens= await refreshToken(oldRefreshToken || "")
                            localStorage.setItem("access_token", newTokens.access_token)
                            localStorage.setItem("refresh_token", newTokens.refresh_token)
    
                            // Retry with new token
                            await dispatch(fetchUserProfile(newTokens.access_token)).unwrap()
                        }
                        catch (refreshError) {
                            localStorage.removeItem("access_token")
                            localStorage.removeItem("refresh_token")
                            router.push("/admin-login")
                        }
                    } else {
                        localStorage.removeItem("access_token")
                        localStorage.removeItem("refresh_token")
                        router.push("/admin-login")
                    }
                }
            }
        }
        checkAuth()
      }, [dispatch, router]);

    useEffect(() => {
        if(driverList.length === 0){
            dispatch(fetchDriverList())
        }
    }, [dispatch, driverList.length]);

    const softDelete = async (id: number) => {
        try {
            const response = await axios.delete(`${BASE_URL}/driver/${id}`)
            if(response.data){
                dispatch(softDeleteDriver(id))
                toast.success("Driver deleted successfully")
            }
        }catch (e) {
            toast.error("Delete driver failed")
            console.log(e)
            return e
        }
    }

    const fetchSearch = async (name: string) => {
        try {
            const response = await axios.get(`${BASE_URL}/driver/search?name=${name}`)
            if(response.data){
                dispatch(searchDriverByName(response.data))
            }
        }catch (e) {
            console.log(e)
            return e
        }
    }

    const debounceSearch = useCallback(debounce((nextValue) => fetchSearch(nextValue), 1000), [])

    const handleSearch = (name: any) => {
        debounceSearch(name)
    }
    
    return (
        <div className={"container mx-auto"}>
            {driverListStatus === 'pending' && <LoadingOverlay/>}

            <h1 className="text-3xl font-bold lg:hidden mb-5">Driver management</h1>
            <div>
                <div className={"mb-5 flex justify-between"}>
                    <div>
                        <TextField
                            id="input-with-icon-textfield"
                            label="Search by driver name"
                            slotProps={{
                                input: {
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <SearchIcon />
                                        </InputAdornment>
                                    ),
                                },
                            }}
                            variant="outlined"
                            onChange={(e) => {handleSearch(e.target.value)}}
                        />
                    </div>
                    <div>
                        <CustomButton label={"Add driver"} variant={"dark"} handleOpenDialog={handleClickOpen}/>
                        <DriverDialog 
                            open={open} 
                            handleClose={handleClose} 
                            currentData={currentData} 
                            currentId={currentData.id}
                        />
                    </div>
                </div>
               <CommonTable 
                    columns={columns} 
                    rows={driverList} 
                    handleOpenDialog={handleClickOpen} 
                    setCurrentData={setCurrentData} 
                    softDelete={softDelete}
                />
            </div>
        </div>
    )
}

export default DriversPage