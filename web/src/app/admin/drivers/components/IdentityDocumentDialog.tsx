"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Grid,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { toast } from "react-toastify";
import axios from "axios";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { fetchDriverList } from "@/redux/middlewares/driverMiddleware";
import {updateIdentityDocumentStatus} from "@/services/identityDocumentService";

interface IdentityDocumentDialogProps {
  open: boolean;
  onClose: () => void;
  documentData: any
}

const IdentityDocumentDialog = ({
  open,
  onClose,
  documentData,
}: IdentityDocumentDialogProps) => {
  const [status, setStatus] = useState(documentData.status || "pending");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch<AppDispatch>();

  React.useEffect(() => {
    if (documentData.status) {
      setStatus(documentData.status);
    }
  }, [documentData.status]);

  const handleStatusChange = (event: any) => {
    setStatus(event.target.value);
  };

  const handleSave = async () => {
    if (!documentData.id) {
      toast.error("Document ID is missing");
      return;
    }
    
    setLoading(true);
    try {
      const response= await updateIdentityDocumentStatus(documentData.id, status);

      if (response) {
        toast.success("Document status updated successfully");
        dispatch(fetchDriverList());
        onClose();
      }
    } catch (error) {
      console.log("Error updating document status:", error);
      toast.error("Failed to update document status");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: "8px",
          maxWidth: "1000px",
          margin: "0 auto",
        },
      }}
    >
      <DialogTitle sx={{ m: 0, p: 2, bgcolor: "primary.main", color: "white" }} className="bg-[#303030]">
        Identity Document
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: "white",
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers sx={{ p: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
              Front Side
            </Typography>
            <div className="border rounded-lg overflow-hidden mb-4 h-[300px] flex items-center justify-center bg-gray-100">
              {documentData.frontImageUrl ? (
                <img
                  src={documentData.frontImageUrl}
                  alt="Front side of ID"
                  className="max-w-full max-h-full object-contain"
                />
              ) : (
                <Typography color="text.secondary">No image available</Typography>
              )}
            </div>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
              Back Side
            </Typography>
            <div className="border rounded-lg overflow-hidden mb-4 h-[300px] flex items-center justify-center bg-gray-100">
              {documentData.backImageUrl ? (
                <img
                  src={documentData.backImageUrl}
                  alt="Back side of ID"
                  className="max-w-full max-h-full object-contain"
                />
              ) : (
                <Typography color="text.secondary">No image available</Typography>
              )}
            </div>
          </Grid>
        </Grid>

        <div className="mt-4">
          <FormControl fullWidth variant="outlined">
            <InputLabel id="status-select-label">Status</InputLabel>
            <Select
              labelId="status-select-label"
              id="status-select"
              value={status || documentData.status}
              onChange={handleStatusChange}
              label="Status"
            >
              <MenuItem value="pending">Pending</MenuItem>
              <MenuItem value="approved">Approved</MenuItem>
              <MenuItem value="rejected">Rejected</MenuItem>
            </Select>
          </FormControl>
        </div>
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose} disabled={loading} className="text-[#303030]">
          Cancel
        </Button>
        <Button
          onClick={handleSave}
          variant="contained"
          className="bg-[#303030]"
          color="primary"
          disabled={loading}
          startIcon={loading ? <CircularProgress size={20} /> : null}
        >
          {loading ? "Saving..." : "Save Changes"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default IdentityDocumentDialog; 