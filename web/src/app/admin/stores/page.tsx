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
import {fetchStoreList} from "@/redux/middlewares/storeMiddleware";
import {fetchVendorList} from "@/redux/middlewares/vendorMiddleware";
import CustomButton from "@/components/CustomButton";
import StoreDialog from "@/app/admin/stores/components/StoreDialog";
import {searchStoreByName, softDeleteStore} from "@/redux/slice/storeSlice";
import LoadingOverlay from "@/components/LoadingOverlay";



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
        key: "vendor",
    },
    {
        name: "Location",
        key: "location",
    },
    {
        name: "Created time",
        key: "created_at"
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

const StoresPage = () => {
    const dispatch= useDispatch<AppDispatch>()
    const storeList= useSelector((state: RootState) => state.store.storeList)
    const vendorList= useSelector((state: RootState) => state.vendor.vendorList)
    const storeListStatus= useSelector((state: RootState) => state.store.status)
    const [open, setOpen] = React.useState(false);
    const [currentData, setCurrentData] = React.useState({
        id: null,
        name: "",
        email: "",
        location: "",
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
            location: "",
            vendorId: ""
        })
        setOpen(false);
    };

    useEffect(() => {
        if(storeList.length === 0){
            dispatch(fetchStoreList())
        }
        if(vendorList.length === 0){
            dispatch(fetchVendorList())
        }

    }, []);

    const softDelete = async (id: number) => {
        try {
            const response=await axios.delete(`http://localhost:3000/store/${id}`)
            if(response.data){
                dispatch(softDeleteStore(id))
                toast.success("Store deleted successfully")
            }
        }catch (e) {
            toast.error("Store delete failed")
            console.log(e)
            return e
        }
    }

    const fetchSearch= async (name: string) => {
        try {
            const  response= await axios.get(`http://localhost:3000/store/search?name=${name}`)
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
                        <StoreDialog vendorList={vendorList} open={open} handleClose={handleClose} currentData={currentData} currentId={currentData.id}/>
                    </div>
                </div>
               <CommonTable columns={columns} rows={storeList} handleOpenDialog={handleClickOpen} setCurrentData={setCurrentData} softDelete={softDelete}/>
            </div>
        </div>
    )
}

export default StoresPage