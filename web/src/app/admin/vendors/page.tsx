"use client"

import React, {useCallback, useEffect, useState} from "react";
import axios from "axios";
import {useDispatch, useSelector} from "react-redux";
import { RootState, AppDispatch } from "@/redux/store";
import {debounce} from "lodash";
import {toast} from "react-toastify";

import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    InputAdornment,
    TextField,
    Typography,
    CircularProgress
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

import CommonTable from "@/components/commonTable/CommonTable";
import {fetchVendorList} from "@/redux/middlewares/vendorMiddleware";
import CustomButton from "@/components/CustomButton";
import VendorDialog from "@/app/admin/vendors/components/VendorDialog";
import {searchVendorByName, softDeleteVendor} from "@/redux/slice/vendorSlice";
import LoadingOverlay from "@/components/LoadingOverlay";
import { fetchUserProfile } from "@/redux/middlewares/authMiddleware";
import { refreshToken } from "@/services/authService";
import { useRouter } from "next/navigation";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// Hàm định dạng thời gian
const formatDate = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN'); // Định dạng: DD/MM/YYYY
};

const columns= [
    {
        name: "ID",
        key: "id",
    },
    {
        name: "Vendor",
        key: "name",
    },
    {
        name: "Created time",
        key: "created_at",
        format: formatDate,
    },
    {
        name: "Email",
        key: "email",
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

const VendorsPage = () => {
    const dispatch= useDispatch<AppDispatch>()
    const router= useRouter()
    const vendorList= useSelector((state: RootState) => state.vendor.vendorList)
    const vendorListStatus= useSelector((state: RootState) => state.vendor.status)
    const [open, setOpen] = React.useState(false);
    const [currentData, setCurrentData] = React.useState({
        id: null,
        name: "",
        email: "",
        location: "",
        city: "",
        phone: ""
    });
    
    // Thêm state cho dialog xác nhận xóa
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [vendorToDelete, setVendorToDelete] = useState<number | null>(null);
    const [deleteLoading, setDeleteLoading] = useState(false);
    
    const {user} = useSelector((state: RootState) => state.auth as { user: User | null, status: string, error: string | null });

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setCurrentData({
            id: null,
            name: "",
            email: "",
            location: "",
            city: "",
            phone: ""
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
        if(vendorList.length === 0){
            dispatch(fetchVendorList())
        }
    }, [dispatch, vendorList.length]);

    // Hàm mở dialog xác nhận xóa
    const handleDeleteClick = (id: number) => {
        setVendorToDelete(id);
        setOpenDeleteDialog(true);
    };
    
    // Hàm xử lý khi người dùng xác nhận xóa
    const handleConfirmDelete = async () => {
        if (vendorToDelete === null) return;
        
        setDeleteLoading(true);
        try {
            const response = await axios.delete(`${BASE_URL}/vendor/${vendorToDelete}`);
            if(response.data){
                dispatch(softDeleteVendor(vendorToDelete));
                toast.success("Vendor deleted successfully");
                setOpenDeleteDialog(false);
            }
        } catch (e) {
            toast.error("Vendor delete failed");
            console.log(e);
        } finally {
            setDeleteLoading(false);
        }
    };
    
    // Hàm xử lý khi người dùng hủy xóa
    const handleCancelDelete = () => {
        setOpenDeleteDialog(false);
        setVendorToDelete(null);
    };

    // Sửa lại hàm softDelete để sử dụng dialog xác nhận
    const softDelete = async (id: number) => {
        handleDeleteClick(id);
    };

    const fetchSearch= async (name: string) => {
        try {
            const  response= await axios.get(`${BASE_URL}/vendor/search?name=${name}`)
            if(response.data){
                dispatch(searchVendorByName(response.data))
            }
        }catch (e) {
            console.log(e)
            return e
        }
    }

    const debounceSearch = useCallback(debounce((nextValue) => fetchSearch(nextValue), 1000), [])

    const handleSearch= (name: any) => {
        debounceSearch(name)
    }
    
    return (
        <div className={"container mx-auto"}>

            {vendorListStatus === 'pending' && <LoadingOverlay/>}

            <h1 className="text-xl font-bold lg:hidden mb-5">Vendors management</h1>
            <div>
                <div className={"mb-5 flex justify-between"}>
                    <div>
                        <TextField
                            id="input-with-icon-textfield"
                            label="Search for vendor name"
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
                        <CustomButton label={"Add vendor"} variant={"dark"} handleOpenDialog={handleClickOpen}/>
                        <VendorDialog open={open} handleClose={handleClose} currentData={currentData} currentId={currentData.id}/>
                    </div>
                </div>
               <div>
                    <CommonTable columns={columns} rows={vendorList} handleOpenDialog={handleClickOpen} setCurrentData={setCurrentData} softDelete={softDelete}/>
               </div>
            </div>
            
            {/* Dialog xác nhận xóa */}
            <Dialog 
                open={openDeleteDialog} 
                onClose={handleCancelDelete}
                PaperProps={{
                    sx: {
                        margin: 'auto',
                        width: { xs: '95%', sm: '80%', md: '50%' },
                        maxWidth: '500px'
                    }
                }}
            >
                <DialogTitle>Confirm delete</DialogTitle>
                <DialogContent>
                    <Typography>
                        Are you sure you want to delete this vendor? This action cannot be undone.
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCancelDelete} disabled={deleteLoading}>
                        Cancel
                    </Button>
                    <Button
                        onClick={handleConfirmDelete}
                        color="error"
                        disabled={deleteLoading}
                        startIcon={deleteLoading ? <CircularProgress size={20} /> : null}
                    >
                        {deleteLoading ? "Deleting..." : "Delete"}
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}

export default VendorsPage