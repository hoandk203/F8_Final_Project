"use client"

import * as React from 'react';
import {Dialog, DialogActions, DialogContent, DialogTitle} from '@mui/material';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import OrderInfo from "@/components/OrderInfo";
import CustomButton from "@/components/CustomButton";

interface NewOrderDialogProps {
    open: boolean
    handleClose: () => void
}

const NewOrderDialog: React.FC<NewOrderDialogProps> = ({open, handleClose}) => {

    return (
    <>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title" className="py-0 px-4">
          <div className="text-[14px] text-center">
            <div>
              <LocalShippingOutlinedIcon className="text-[100px]"/>
            </div>
            <div>
              <h3 className="font-bold text-xl">You got new order!</h3>
              <span>Check information carefully before accept</span>
            </div>
          </div>
        </DialogTitle>
        <DialogContent className="!p-4">
          <div id="alert-dialog-description" className="text-black text-[14px]">
            <OrderInfo type={"waiting"} activeDialog={false}/>
          </div>
        </DialogContent>
        <DialogActions className="grid grid-cols-2 gap-3 font-semibold pt-0 pb-4 px-4">
              <CustomButton handleCloseDialog={handleClose} label={"Decline"} variant={"light"} size={"large"}/>
              <CustomButton label={"Accept"} variant={"dark"} size={"large"}/>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default NewOrderDialog;
