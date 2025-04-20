"use client"

import {Button, Dialog, DialogActions, DialogContent, DialogTitle} from "@mui/material"
import Checkbox from '@mui/material/Checkbox';
import React, {useState} from "react";
import {getOrdersByStore, getOrdersUnpaidByStore} from "@/services/orderService";

interface Order {
    id: number;
    store_id: number;
    amount: number;
    status: string;
    scrap_image_url: string;
    created_at: string;
    orderDetail_weight: number;
}

interface Props {
    open: boolean
    handleClose: () => void
    title: string
    storeId?: number
    setOrders: React.Dispatch<React.SetStateAction<Order[]>>
}

const FilterDialog = ({title, open, handleClose, storeId, setOrders}: Props) => {
    const [checkedUnpaid, setCheckedUnpaid] = useState(false);

    const handleCheckedUnpaid = (event: React.ChangeEvent<HTMLInputElement>) => {
        setCheckedUnpaid(event.target.checked);
    };

    const handleFilter = async() => {
        if (checkedUnpaid) {
            try {
                const response= await getOrdersUnpaidByStore(storeId || 0);
                setOrders(response || []);
            }catch (e) {
                console.log(e)
            }finally {
                handleClose();
            }
        }else{
            try {
                const response= await getOrdersByStore();
                setOrders(response || []);
            }catch (e) {
                console.log(e)
            }finally {
                handleClose();
            }
        }


    }

    return(
        <Dialog
            PaperProps={{
                sx: {
                    margin: 'auto',
                    width: { xs: '95%', sm: '80%', md: '70%' },
                    maxWidth: '800px'
                }
            }}
            open={open}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">
                {title}
            </DialogTitle>
            <DialogContent>
                <Checkbox
                    id={"unpaid"}
                    checked={checkedUnpaid}
                    onChange={handleCheckedUnpaid}
                    inputProps={{ 'aria-label': 'controlled' }}
                />
                <label className={"cursor-pointer"} htmlFor={"unpaid"}>Unpaid</label>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Close</Button>
                <Button onClick={handleFilter} autoFocus>
                    Filter
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default FilterDialog