"use client"

import React, {useCallback, useEffect} from "react";
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
    TextField
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

import CommonTable from "@/components/commonTable/CommonTable";
import {fetchVendorList} from "@/redux/middlewares/vendorMiddleware";
import CustomButton from "@/components/CustomButton";
import VendorDialog from "@/app/admin/vendors/components/VendorDialog";
import {searchVendorByName, softDeleteVendor} from "@/redux/slice/vendorSlice";
import LoadingOverlay from "@/components/LoadingOverlay";

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

const VendorsPage = () => {
    const dispatch= useDispatch<AppDispatch>()
    const vendorList= useSelector((state: RootState) => state.vendor.vendorList)
    const vendorListStatus= useSelector((state: RootState) => state.vendor.status)
    const [open, setOpen] = React.useState(false);
    const [currentData, setCurrentData] = React.useState({
        id: null,
        name: "",
        email: "",
        vendorId: ""
    });

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setCurrentData({
            id: null,
            name: "",
            email: "",
            vendorId: ""
        })
        setOpen(false);
    };

    useEffect(() => {
        if(vendorList.length === 0){
            dispatch(fetchVendorList())
        }

    }, []);

    const softDelete = async (id: number) => {
        try {
            const response=await axios.delete(`${BASE_URL}/vendor/${id}`)
            if(response.data){
                dispatch(softDeleteVendor(id))
                toast.success("Vendor deleted successfully")
            }
        }catch (e) {
            toast.error("Vendor delete failed")
            console.log(e)
            return e
        }
    }

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
        </div>
    )
}

export default VendorsPage