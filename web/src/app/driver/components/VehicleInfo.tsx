import { useState, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { TextField, Button, CircularProgress, Alert } from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import UploadImages from "@/components/UploadImages";
import { getVehicleInfo, updateVehicleInfo } from "@/services/driverService";

interface Vehicle {
    id?: number;
    driverId?: number;
    vehiclePlateNumber?: string;
    vehicleColor?: string;
    vehicleImage?: string;
    vehicleRCImage?: string;
    status?: string;
}

// Định nghĩa schema validation
const vehicleInfoSchema = z.object({
    vehiclePlateNumber: z.string().min(1, { message: "Vehicle plate number is required" }),
    vehicleColor: z.string().min(1, { message: "Vehicle color is required" }),
    vehicleImage: z.string().min(1, { message: "Vehicle image is required" }),
    vehicleRCImage: z.string().min(1, { message: "Vehicle RC image is required" }),
});

type VehicleInfoFormInput = z.infer<typeof vehicleInfoSchema>;

const VehicleInfo = () => {
    const { user } = useSelector((state: RootState) => state.auth as { user: any });
    const [vehicle, setVehicle] = useState<Vehicle | null>(null);
    const [loading, setLoading] = useState(true);
    const [editingVehicleInfo, setEditingVehicleInfo] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [vehicleImage, setVehicleImage] = useState("");
    const [vehicleRCImage, setVehicleRCImage] = useState("");

    const { control, handleSubmit, reset, formState: { errors } } = useForm<VehicleInfoFormInput>({
        resolver: zodResolver(vehicleInfoSchema),
        defaultValues: {
            vehiclePlateNumber: "",
            vehicleColor: "",
            vehicleImage: "",
            vehicleRCImage: "",
        }
    });

    const fetchVehicleInfo = async () => {
        try {
            setLoading(true);
            if (user?.id) {
                const data = await getVehicleInfo(user.id);
                setVehicle(data);
                setVehicleImage(data.vehicleImage || "");
                setVehicleRCImage(data.vehicleRCImage || "");
                
                // Cập nhật giá trị mặc định cho form
                reset({
                    vehiclePlateNumber: data.vehiclePlateNumber || "",
                    vehicleColor: data.vehicleColor || "",
                    vehicleImage: data.vehicleImage || "",
                    vehicleRCImage: data.vehicleRCImage || "",
                });
            }
        } catch (err: any) {
            setError(err.message || "Cannot load vehicle information");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchVehicleInfo();
    }, [user]);

    const startEditing = () => {
        setEditingVehicleInfo(true);
        setError("");
        setSuccess("");
    };

    const cancelEditing = () => {
        setEditingVehicleInfo(false);
        setVehicleImage(vehicle?.vehicleImage || "");
        setVehicleRCImage(vehicle?.vehicleRCImage || "");
        setError("");
        setSuccess("");
    };

    const setVehicleImageCallback = useCallback((value: string) => {
        setError("");
        setVehicleImage(value);
    }, []);

    const setVehicleRCImageCallback = useCallback((value: string) => {
        setError("");
        setVehicleRCImage(value);
    }, []);

    const onSubmit = async (data: VehicleInfoFormInput) => {
        try {
            setIsSubmitting(true);
            setError("");
            setSuccess("");

            if (!vehicleImage || !vehicleRCImage) {
                setError("Please upload vehicle image and vehicle RC image");
                setIsSubmitting(false);
                return;
            }

            if (vehicle?.id) {
                const updatedData = {
                    ...data,
                    vehicleImage,
                    vehicleRCImage,
                };
                await updateVehicleInfo(vehicle.id, updatedData);
                await fetchVehicleInfo();
                setSuccess("Update successfully, waiting for approval");
                setEditingVehicleInfo(false);
            }
        } catch (err: any) {
            setError(err.message || "Cannot update vehicle information");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center p-4">
                <CircularProgress />
            </div>
        );
    }

    return (
        <div className="p-4">
            {error && (
                <Alert severity="error" className="mb-4">
                    {error}
                </Alert>
            )}
            {success && (
                <Alert severity="success" className="mb-4">
                    {success}
                </Alert>
            )}

            {editingVehicleInfo ? (
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="space-y-4">
                        <Controller
                            name="vehiclePlateNumber"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="Vehicle plate number"
                                    fullWidth
                                    error={!!errors.vehiclePlateNumber}
                                    helperText={errors.vehiclePlateNumber?.message}
                                />
                            )}
                        />

                        <Controller
                            name="vehicleColor"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="Vehicle color"
                                    fullWidth
                                    error={!!errors.vehicleColor}
                                    helperText={errors.vehicleColor?.message}
                                />
                            )}
                        />

                        <div>
                            <p className="text-sm font-medium mb-2">Vehicle Image</p>
                            <UploadImages 
                                setVehicleImageCallback={setVehicleImageCallback} 
                                initialImage={vehicle?.vehicleImage || ''}
                            />
                        </div>

                        <div>
                            <p className="text-sm font-medium mb-2">Vehicle RC Image</p>
                            <UploadImages 
                                setVehicleRCImageCallback={setVehicleRCImageCallback}
                                initialImage={vehicle?.vehicleRCImage || ''}
                            />
                        </div>

                        <div className="flex space-x-2 pt-2">
                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                className="bg-[#303030] text-white"
                                disabled={isSubmitting}
                                startIcon={isSubmitting ? <CircularProgress size={20} /> : <SaveIcon />}
                            >
                                {isSubmitting ? "Saving..." : "Save"}
                            </Button>
                            <Button
                                variant="outlined"
                                className="border-[#303030] text-[#303030]"
                                onClick={cancelEditing}
                                startIcon={<CancelIcon />}
                            >
                                Cancel
                            </Button>
                        </div>
                    </div>
                </form>
            ) : (
                <div className="space-y-4">
                    {vehicle ? (
                        <>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-gray-500">Vehicle Plate Number</p>
                                    <p className="font-medium">{vehicle.vehiclePlateNumber || "Not updated"}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Vehicle Color</p>
                                    <p className="font-medium">{vehicle.vehicleColor || "Not updated"}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-gray-500">Vehicle Image</p>
                                    {vehicle.vehicleImage ? (
                                        <img 
                                            src={vehicle.vehicleImage} 
                                            alt="Vehicle" 
                                            className="mt-2 rounded-lg w-full max-h-40 object-cover"
                                        />
                                    ) : (
                                        <p className="font-medium">Not updated</p>
                                    )}
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Vehicle RC Image</p>
                                    {vehicle.vehicleRCImage ? (
                                        <img 
                                            src={vehicle.vehicleRCImage} 
                                            alt="Vehicle RC" 
                                            className="mt-2 rounded-lg w-full max-h-40 object-cover"
                                        />
                                    ) : (
                                        <p className="font-medium">Not updated</p>
                                    )}
                                </div>
                            </div>

                            <div>
                                <p className="text-sm text-gray-500 mb-2">Status</p>
                                <span className={`font-medium ${
                                    vehicle.status === 'approved' ? 'text-green-600 bg-green-100 rounded-md px-2 py-1' : 
                                    vehicle.status === 'pending' ? 'text-red-600 bg-red-100 rounded-md px-2 py-1' : 
                                    vehicle.status === 'rejected' ? 'text-red-700 bg-red-100 rounded-md px-2 py-1' : ''
                                }`}>
                                    {vehicle.status === 'approved' ? 'Approved' : 
                                     vehicle.status === 'pending' ? 'Pending' : 
                                     vehicle.status === 'rejected' ? 'Rejected' : 'Not updated'}
                                </span>
                            </div>

                            <Button
                                variant="contained"
                                color="primary"
                                startIcon={<EditIcon />}
                                onClick={startEditing}
                                className="mt-3 bg-[#303030] text-white"
                                disabled={vehicle.status === 'approved'}
                            >
                                Update
                            </Button>
                            {vehicle.status === 'approved' && (
                                <p className="text-sm text-gray-500 mt-2">
                                    Information has been approved and cannot be edited
                                </p>
                            )}
                        </>
                    ) : (
                        <div className="text-center py-4">
                            <p className="text-gray-500">No vehicle information</p>
                            <Button
                                variant="contained"
                                color="primary"
                                startIcon={<EditIcon />}
                                onClick={startEditing}
                                className="mt-3 bg-[#303030] text-white"
                            >
                                Add vehicle information
                            </Button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default VehicleInfo;