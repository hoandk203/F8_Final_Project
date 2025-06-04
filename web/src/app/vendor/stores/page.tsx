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
    CircularProgress,
    Box
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

import CommonTable from "@/components/commonTable/CommonTable";
import {fetchStoreList} from "@/redux/middlewares/storeMiddleware";
import {fetchVendorList} from "@/redux/middlewares/vendorMiddleware";
import CustomButton from "@/components/CustomButton";
import StoreDialog from "@/app/vendor/stores/components/StoreDialog";
import {searchStoreByName, softDeleteStore} from "@/redux/slice/storeSlice";
import LoadingOverlay from "@/components/LoadingOverlay";
import { fetchUserProfile } from "@/redux/middlewares/authMiddleware";
import { clearAuthTokens, getAuthTokens, refreshToken, setAuthTokens } from "@/services/authService";
import { useRouter } from "next/navigation";
import { getStoreByVendorId } from "@/services/storeService";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;


const formatDate = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN'); 
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
        name: "Location",
        key: "location",
    },
    {
        name: "Status",
        key: "status",
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
    role: string
}

const StoresPage = () => {
    console.log("Store page");
    const dispatch= useDispatch<AppDispatch>()
    const router= useRouter()
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
    const [loading, setLoading] = useState(false);
    const {user} = useSelector((state: RootState) => state.auth as { user: User | null, status: string, error: string | null });
    const handleClickOpen = () => {
        setOpen(true);
    };
    
    const [storeList, setStoreList] = useState<any[]>([]);

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
            
            try {
                // Dispatch action to get profile info and save to Redux store
                setLoading(true);
                const userData= await dispatch(fetchUserProfile(tokens.access_token)).unwrap()
                
                if(userData?.user.role !== "vendor"){
                    router.push("/vendor-login");
                    clearAuthTokens();
                }
                await fetchStoreList(userData?.id || 0)
                setLoading(false);
            }catch (err: any) {
                setLoading(false);
                if (err?.message === "Access token expired") {
                    try {
                        setLoading(true);
                        const oldRefreshToken = tokens.refresh_token;
                        const newTokens = await refreshToken(oldRefreshToken || "");
                        setAuthTokens({
                            access_token: newTokens.access_token,
                            refresh_token: newTokens.refresh_token,
                            role: tokens.role
                        });

                        // Retry with new token
                        const userData= await dispatch(fetchUserProfile(newTokens.access_token)).unwrap()
                        await fetchStoreList(userData?.id || 0)
                    }
                    catch (refreshError) {
                        setLoading(false);
                        clearAuthTokens();
                        router.push("/vendor-login")
                    }
                } else {
                    setLoading(false);
                    clearAuthTokens();
                    router.push("/vendor-login")
                }
            }
            
        }
        checkAuth()
      }, [dispatch, router]);

    const fetchStoreList = async (vendorId: number) => {
        console.log(vendorId);
        
        try {
            const response = await getStoreByVendorId(Number(vendorId));
            setStoreList(response);
        } catch (error: any) {
            console.log("Error fetching store list:", error);
        }
    };
    
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

    if(loading){
        return <LoadingOverlay/>
    }
    
    return (
        <Box sx={{ p: 3 }}>

            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
        <Typography variant="h5" component="h1">
          Stores
        </Typography>
      </Box>
            <div>
                
               <CommonTable 
                    columns={columns}
                    rows={storeList}
                    handleOpenDialog={handleClickOpen}
                    setCurrentData={setCurrentData}
                    softDelete={softDelete}
                />
            </div>
            <StoreDialog 
                storeList={storeList}
                setStoreList={setStoreList}
                open={open} 
                handleClose={handleClose} 
                currentData={currentData} 
                currentId={currentData.id}
            />
            
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
        </Box>
    )
}

export default StoresPage