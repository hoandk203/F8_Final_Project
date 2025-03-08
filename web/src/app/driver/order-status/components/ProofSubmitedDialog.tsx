"use client"

import * as React from 'react';
import {Dialog, DialogActions, DialogTitle} from '@mui/material';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import CustomButton from "@/components/CustomButton";

interface ProofSubmitedDialogProps {
    open: boolean
    handleClose: () => void
}

const ProofSubmitedDialog: React.FC<ProofSubmitedDialogProps> = ({open, handleClose}) => {

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
              <h3 className="font-bold text-xl">Proof submited</h3>
              <span>Thank for picking up the order!</span>
            </div>
          </div>
        </DialogTitle>
        <DialogActions className="grid grid-cols-1 font-semibold pt-4 pb-4 px-4">
              <CustomButton handleCloseDialog={handleClose} label={"Mask as Picked up"} variant={"dark"} size={"large"}/>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default ProofSubmitedDialog;