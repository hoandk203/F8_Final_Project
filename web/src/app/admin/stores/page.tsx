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
import {fetchStoreList} from "@/redux/middlewares/storeMiddleware";
import {fetchVendorList} from "@/redux/middlewares/vendorMiddleware";
import CustomButton from "@/components/CustomButton";
import StoreDialog from "@/app/admin/stores/components/StoreDialog";
import {searchStoreByName, softDeleteStore} from "@/redux/slice/storeSlice";
import LoadingOverlay from "@/components/LoadingOverlay";
import { fetchUserProfile } from "@/redux/middlewares/authMiddleware";
import { clearAuthTokens, getAuthTokens, refreshToken, setAuthTokens } from "@/services/authService";
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
        name: "Store",
        key: "name",
    },
    {
        name: "Vendor",
        key: "vendor_name",
    },
    {
        name: "Location",
        key: "location",
    },
    {
        name: "City",
        key: "city",
    },
    {
        name: "Phone",
        key: "phone",
    },
    {
        name: "Email",
        key: "email",
    },
    {
        name: "Created time",
        key: "created_at",
        format: formatDate, // Thêm hàm format cho cột created_at
    },
    {
        name: "Action",
        key: "action",
    }
]

interface User {
    id: number;
    email: string;
    role: string
}

const StoresPage = () => {
    const dispatch= useDispatch<AppDispatch>()
    const router= useRouter()
    const storeList= useSelector((state: RootState) => state.store.storeList)
    const vendorList= useSelector((state: RootState) => state.vendor.vendorList)
    const storeListStatus= useSelector((state: RootState) => state.store.status)
    const [open, setOpen] = React.useState(false);
    const [currentData, setCurrentData] = React.useState({
        id: null,
        name: "",
        email: "",
        location: "",
        city: "",
        phone: "",
        vendorId: ""
    });
    
    // Thêm state cho dialog xác nhận xóa
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [storeToDelete, setStoreToDelete] = useState<number | null>(null);
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
            phone: "",
            vendorId: ""
        })
        setOpen(false);
    };

    useEffect(() => {
        const checkAuth= async () => {
            const tokens = getAuthTokens();
            if(!tokens?.access_token){
                router.push("/vendor-login")
                return
            }
            if(!user){
                try {
                    // Dispatch action to get profile info and save to Redux store
                    const userData= await dispatch(fetchUserProfile(tokens.access_token)).unwrap()
                    if(userData?.role !== "admin"){
                        router.push("/vendor-login");
                        clearAuthTokens();
                    }
                }catch (err: any) {
                    if (err?.message === "Access token expired") {
                        try {
                            const oldRefreshToken= tokens.refresh_token
                            const newTokens= await refreshToken(oldRefreshToken || "")
                            setAuthTokens({
                                access_token: newTokens.access_token,
                                refresh_token: newTokens.refresh_token,
                                role: tokens.role
                            });
    
                            // Retry with new token
                            await dispatch(fetchUserProfile(newTokens.access_token)).unwrap()
                        }
                        catch (refreshError) {
                            clearAuthTokens();
                            router.push("/vendor-login")
                        }
                    } else {
                        clearAuthTokens();
                        router.push("/vendor-login")
                    }
                }
            }
        }
        checkAuth()
      }, [dispatch, router]);

    useEffect(() => {
        if(storeList.length === 0){
            dispatch(fetchStoreList())
        }
        if(vendorList.length === 0){
            dispatch(fetchVendorList())
        }
    }, [dispatch, storeList.length, vendorList.length]);

    // Hàm mở dialog xác nhận xóa
    const handleDeleteClick = (id: number) => {
        setStoreToDelete(id);
        setOpenDeleteDialog(true);
    };
    
    // Hàm xử lý khi người dùng xác nhận xóa
    const handleConfirmDelete = async () => {
        if (storeToDelete === null) return;
        
        setDeleteLoading(true);
        try {
            const response = await axios.delete(`${BASE_URL}/store/${storeToDelete}`);
            if(response.data){
                dispatch(softDeleteStore(storeToDelete));
                toast.success("Store deleted successfully");
                setOpenDeleteDialog(false);
            }
        } catch (e) {
            toast.error("Store delete failed");
            console.log(e);
        } finally {
            setDeleteLoading(false);
        }
    };
    
    // Hàm xử lý khi người dùng hủy xóa
    const handleCancelDelete = () => {
        setOpenDeleteDialog(false);
        setStoreToDelete(null);
    };

    // Sửa lại hàm softDelete để sử dụng dialog xác nhận
    const softDelete = async (id: number) => {
        handleDeleteClick(id);
    };

    const fetchSearch= async (name: string) => {
        try {
            const  response= await axios.get(`${BASE_URL}/store/search?name=${name}`)
            if(response.data){
                dispatch(searchStoreByName(response.data))
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
            {storeListStatus === 'pending' && <LoadingOverlay/>}

            <h1 className="text-3xl font-bold lg:hidden mb-5">stores</h1>
            <div>
                <div className={"mb-5 flex justify-between"}>
                    <div>
                        <TextField
                            id="input-with-icon-textfield"
                            label="Search for store name"
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
                        <CustomButton label={"Add store"} variant={"dark"} handleOpenDialog={handleClickOpen}/>
                        <StoreDialog 
                            vendorList={vendorList} 
                            open={open} 
                            handleClose={handleClose} 
                            currentData={currentData} 
                            currentId={currentData.id}
                        />
                    </div>
                </div>
               <CommonTable 
                    columns={columns} 
                    rows={storeList} 
                    handleOpenDialog={handleClickOpen} 
                    setCurrentData={setCurrentData} 
                    softDelete={softDelete}
                />
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
                        Are you sure you want to delete this store? This action cannot be undone.
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

export default StoresPage