import {
    Button, CircularProgress,
    Dialog, DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    Grid,
    IconButton,
    InputLabel, MenuItem,
    Select,
    Typography
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import React from "react";
import { toast } from "react-toastify";
import {updateVehicleStatus} from "@/services/vehicleService";
import {fetchDriverList} from "@/redux/middlewares/driverMiddleware";
import {useDispatch} from "react-redux";
import {AppDispatch} from "@/redux/store";

interface Props {
    open: boolean;
    onClose: () => void;
    vehicleData?: any
}

const VehicleDialog= ({open, onClose, vehicleData}: Props) => {
    const dispatch = useDispatch<AppDispatch>();
    const [loading, setLoading] = React.useState(false);
    const [status, setStatus] = React.useState("");

    const handleStatusChange = (event: any) => {
        setStatus(event.target.value);
    }

    const handleSave = async () => {
        setLoading(true);
        try {
            const response= await updateVehicleStatus(vehicleData.id, status);

            if (response) {
                toast.success("Vehicle status updated successfully");
                dispatch(fetchDriverList());
                onClose();
            }
        }catch (e) {
            console.log("Error updating vehicle status:", e);
            toast.error("Failed to update vehicle status");
        } finally {
            setLoading(false);
        }
    }
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
                Vehicle
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
                            Vehicle Plate Number: {vehicleData.vehiclePlateNumber}
                        </Typography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Typography className={"capitalize"} variant="subtitle1" fontWeight="bold" gutterBottom>
                            Vehicle Color: {vehicleData.vehicleColor}
                        </Typography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                            Vehicle Image
                        </Typography>
                        <div className="border rounded-lg overflow-hidden mb-4 h-[300px] flex items-center justify-center bg-gray-100">
                            {vehicleData.vehicleImage ? (
                                <img
                                    src={vehicleData.vehicleImage}
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
                            Vehicle RC Image
                        </Typography>
                        <div className="border rounded-lg overflow-hidden mb-4 h-[300px] flex items-center justify-center bg-gray-100">
                            {vehicleData.vehicleRCImage ? (
                                <img
                                    src={vehicleData.vehicleRCImage}
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
                            value={status || vehicleData.status}
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
}

export default VehicleDialog