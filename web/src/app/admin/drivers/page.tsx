"use client"

import React, {useCallback, useEffect, useState} from "react";
import axios from "axios";
import {useDispatch, useSelector} from "react-redux";
import { RootState, AppDispatch } from "@/redux/store";
import {debounce} from "lodash";
import {toast} from "react-toastify";

import {
    InputAdornment,
    TextField,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    CircularProgress
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

import CommonTable from "@/components/commonTable/CommonTable";
import {fetchDriverList} from "@/redux/middlewares/driverMiddleware";
import CustomButton from "@/components/CustomButton";
import DriverDialog from "@/app/admin/drivers/components/DriverDialog";
import {searchDriverByName, softDeleteDriver} from "@/redux/slice/driverSlice";
import LoadingOverlay from "@/components/LoadingOverlay";
import { fetchUserProfile } from "@/redux/middlewares/authMiddleware";
import { clearAuthTokens, getAuthTokens, refreshToken, setAuthTokens } from "@/services/authService";
import { useRouter } from "next/navigation";
import IdentityDocumentDialog from "./components/IdentityDocumentDialog";
import { getIdentityDocument } from "@/services/identityDocumentService";
import {getVehicleById} from "@/services/vehicleService";
import VehicleDialog from "@/app/admin/drivers/components/VehicleDialog";

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
        name: "Phone number",
        key: "phone_number",
    },
    {
        name: "Vehicle status",
        key: "vehicle_status",
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
    
    // Thêm state cho dialog xác nhận xóa
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [driverToDelete, setDriverToDelete] = useState<number | null>(null);
    const [deleteLoading, setDeleteLoading] = useState(false);
    
    // Thêm state cho Identity Document Dialog
    const [identityDocumentDialogOpen, setIdentityDocumentDialogOpen] = useState(false);
    const [vehicleDialogOpen, setVehicleDialogOpen] = useState(false);
    const [documentData, setDocumentData] = useState({
        id: null as number | null,
        frontImageUrl: "",
        backImageUrl: "",
        status: "",
        driverId: null as number | null
    });
    const [vehicleData, setVehicleData] = useState({
        id: null as number | null,
        vehiclePlateNumber: "",
        vehicleColor: "",
        vehicleImage: "",
        vehicleRCImage: "",
        status: "",
    })
    const [documentLoading, setDocumentLoading] = useState(false);
    const [vehicleLoading, setVehicleLoading] = useState(false);
    
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
            const tokens= getAuthTokens();
            if(!tokens?.access_token){
                router.push("/vendor-login")
                return
            }
            if(!user){
                try {
                    // Dispatch action to get profile info and save to Redux store
                    const userData= await dispatch(fetchUserProfile(tokens.access_token)).unwrap()
                    if(userData.role !== "admin"){
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
        if(driverList.length === 0){
            dispatch(fetchDriverList())
        }
    }, [dispatch, driverList.length]);

    // Hàm mở dialog xác nhận xóa
    const handleDeleteClick = (id: number) => {
        setDriverToDelete(id);
        setOpenDeleteDialog(true);
    };
    
    // Hàm xử lý khi người dùng xác nhận xóa
    const handleConfirmDelete = async () => {
        if (driverToDelete === null) return;
        
        setDeleteLoading(true);
        try {
            const response = await axios.delete(`${BASE_URL}/driver/${driverToDelete}`);
            if(response.data){
                dispatch(softDeleteDriver(driverToDelete));
                toast.success("Driver deleted successfully");
                setOpenDeleteDialog(false);
            }
        } catch (e) {
            toast.error("Delete driver failed");
            console.log(e);
        } finally {
            setDeleteLoading(false);
        }
    };
    
    // Hàm xử lý khi người dùng hủy xóa
    const handleCancelDelete = () => {
        setOpenDeleteDialog(false);
        setDriverToDelete(null);
    };

    // Sửa lại hàm softDelete để sử dụng dialog xác nhận
    const softDelete = async (id: number) => {
        handleDeleteClick(id);
    };

    const handleViewDocument = async (row: any) => {
        if (!row.identity_document_id) {
            toast.error("No identity document found for this driver");
            return;
        }
        
        setDocumentLoading(true);
        
        try {
            const document:any = await getIdentityDocument(row.identity_document_id);
            
            setDocumentData({
                id: row.identity_document_id,
                frontImageUrl: document.frontImageUrl,
                backImageUrl: document.backImageUrl,
                status: document.status,
                driverId: row.id
            });
            setIdentityDocumentDialogOpen(true);
        } catch (error) {
            console.log("Error fetching identity document:", error);
            toast.error("Failed to load identity document");
        } finally {
            setDocumentLoading(false);
        }
    };

    const handleViewVehicle = async (row: any) => {
        if (!row.vehicle_id) {
            toast.error("No vehicle found for this driver");
            return;
        }
        setVehicleLoading(true);

        try {
            const vehicle:any = await getVehicleById(row.vehicle_id);

            setVehicleData({
                id: row.vehicle_id,
                vehiclePlateNumber: vehicle.vehiclePlateNumber,
                vehicleColor: vehicle.vehicleColor,
                vehicleImage: vehicle.vehicleImage,
                vehicleRCImage: vehicle.vehicleRCImage,
                status: vehicle.status
            });
            setVehicleDialogOpen(true);

        }catch (error) {
            console.log("Error fetching vehicle:", error);
            toast.error("Failed to load vehicle");
        } finally {
            setVehicleLoading(false);
        }



    };

    const handleCloseIdentityDocumentDialog = () => {
        setIdentityDocumentDialogOpen(false);
    };

    const handleCloseVehicleDialog = () => {
        setVehicleDialogOpen(false);
    };

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
            {documentLoading && <LoadingOverlay />}
            {vehicleLoading && <LoadingOverlay />}

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
                        {/* <CustomButton label={"Add driver"} variant={"dark"} handleOpenDialog={handleClickOpen}/> */}
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
                    onViewDocument={handleViewDocument}
                    onViewVehicle={handleViewVehicle}
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
                        Are you sure you want to delete this driver? This action cannot be undone.
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

            <IdentityDocumentDialog
                open={identityDocumentDialogOpen}
                onClose={handleCloseIdentityDocumentDialog}
                documentData={documentData}
            />

            <VehicleDialog open={vehicleDialogOpen} onClose={handleCloseVehicleDialog} vehicleData={vehicleData}/>
        </div>
    )
}

export default DriversPage;