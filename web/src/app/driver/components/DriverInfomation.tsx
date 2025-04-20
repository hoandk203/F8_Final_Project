import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/redux/store";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { TextField, Button, CircularProgress, Alert } from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import PersonIcon from '@mui/icons-material/Person';
import { updateUserProfile } from "@/services/authService";
import { updateUserProfile as updateUserProfileSlice } from "@/redux/slice/authSlice";
interface User {
    dateOfBirth: string;
    fullname?: string;
    phone_number?: string;
    date_of_birth?: string;
    gst_number?: string;
    address?: string;
    city?: string;
    country?: string;
    user?: {
      email?: string;
    }
}

// Định nghĩa schema validation
const driverInfoSchema = z.object({
  fullname: z.string().min(1, { message: "Fullname is required" }),
  phone_number: z.string()
    .min(1, { message: "Phone number is required" })
    .regex(/^[0-9]{10,11}$/, { message: "Phone number must be 10-11 digits" }),
  date_of_birth: z.string().min(1, { message: "Date of birth is required" }),
  gst_number: z.string().optional(),
  address: z.string().min(1, { message: "Address is required" }),
  city: z.string().min(1, { message: "City is required" }),
  country: z.string().min(1, { message: "Country is required" }),
});

type DriverInfoFormInput = z.infer<typeof driverInfoSchema>;

const DriverInfomation = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { user } = useSelector((state: RootState) => state.auth as { user: User | null, isAuthenticated: boolean });
    
    const [showDriverInfo, setShowDriverInfo] = useState(false);
    const [editingDriverInfo, setEditingDriverInfo] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    
    // React Hook Form với Zod resolver
    const { control, handleSubmit, reset, formState: { errors } } = useForm<DriverInfoFormInput>({
        resolver: zodResolver(driverInfoSchema),
        defaultValues: {
            fullname: user?.fullname || "",
            phone_number: user?.phone_number || "",
            date_of_birth: user?.date_of_birth || "",
            gst_number: user?.gst_number || "",
            address: user?.address || "",
            city: user?.city || "",
            country: user?.country || "",
        }
    });
    
    // Cập nhật form khi user thay đổi
    useEffect(() => {
        if (user) {
            reset({
                fullname: user.fullname || "",
                phone_number: user.phone_number || "",
                date_of_birth: user.date_of_birth || "",
                gst_number: user.gst_number || "",
                address: user.address || "",
                city: user.city || "",
                country: user.country || "",
            });
        }
    }, [user, reset]);
    
    const toggleDriverInfo = () => {
        setShowDriverInfo(!showDriverInfo);
        if (!showDriverInfo) {
            setEditingDriverInfo(false);
        }
    };
    
    const startEditing = () => {
        setEditingDriverInfo(true);
    };
    
    const cancelEditing = () => {
        setEditingDriverInfo(false);
        // Reset form về giá trị ban đầu
        if (user) {
            reset({
                fullname: user.fullname || "",
                phone_number: user.phone_number || "",
                date_of_birth: user.date_of_birth || "",
                gst_number: user.gst_number || "",
                address: user.address || "",
                city: user.city || "",
                country: user.country || "",
            });
        }
    };
    
    const onSubmit = async (data: DriverInfoFormInput) => {
        setIsSubmitting(true);
        setError("");
        setSuccess("");
        
        try {
            await updateUserProfile(data);
            
            setSuccess("Update information successfully!");
            setEditingDriverInfo(false);
            
            dispatch(updateUserProfileSlice({ ...user, ...data }));
            
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="p-4 bg-white rounded-lg shadow-sm border">
            <div 
                className="flex items-center justify-between cursor-pointer"
                onClick={toggleDriverInfo}
            >
                <div className="flex items-center space-x-3">
                    <PersonIcon className="text-gray-500" />
                    <span>Driver Information</span>
                </div>
                {showDriverInfo ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </div>
            
            {showDriverInfo && (
                <div className="mt-4 border-t pt-4">
                    {success && (
                        <Alert severity="success" className="mb-4">
                            {success}
                        </Alert>
                    )}
                    
                    {error && (
                        <Alert severity="error" className="mb-4">
                            {error}
                        </Alert>
                    )}
                    
                    {editingDriverInfo ? (
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Fullname</label>
                                    <Controller
                                        name="fullname"
                                        control={control}
                                        render={({ field }) => (
                                            <TextField
                                                {...field}
                                                fullWidth
                                                size="small"
                                                error={!!errors.fullname}
                                                helperText={errors.fullname?.message}
                                            />
                                        )}
                                    />
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                                    <Controller
                                        name="phone_number"
                                        control={control}
                                        render={({ field }) => (
                                            <TextField
                                                {...field}
                                                fullWidth
                                                size="small"
                                                error={!!errors.phone_number}
                                                helperText={errors.phone_number?.message}
                                            />
                                        )}
                                    />
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                                    <Controller
                                        name="date_of_birth"
                                        control={control}
                                        render={({ field }) => (
                                            <TextField
                                                {...field}
                                                fullWidth
                                                type="date"
                                                size="small"
                                                error={!!errors.date_of_birth}
                                                helperText={errors.date_of_birth?.message}
                                                InputLabelProps={{ shrink: true }}
                                            />
                                        )}
                                    />
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">GST Number</label>
                                    <Controller
                                        name="gst_number"
                                        control={control}
                                        render={({ field }) => (
                                            <TextField
                                                {...field}
                                                fullWidth
                                                size="small"
                                                error={!!errors.gst_number}
                                                helperText={errors.gst_number?.message}
                                            />
                                        )}
                                    />
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                                    <Controller
                                        name="address"
                                        control={control}
                                        render={({ field }) => (
                                            <TextField
                                                {...field}
                                                fullWidth
                                                size="small"
                                                error={!!errors.address}
                                                helperText={errors.address?.message}
                                            />
                                        )}
                                    />
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                                    <Controller
                                        name="city"
                                        control={control}
                                        render={({ field }) => (
                                            <TextField
                                                {...field}
                                                fullWidth
                                                size="small"
                                                error={!!errors.city}
                                                helperText={errors.city?.message}
                                            />
                                        )}
                                    />
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                                    <Controller
                                        name="country"
                                        control={control}
                                        render={({ field }) => (
                                            <TextField
                                                {...field}
                                                fullWidth
                                                size="small"
                                                error={!!errors.country}
                                                helperText={errors.country?.message}
                                            />
                                        )}
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
                                        className="border-black text-black"
                                        onClick={cancelEditing}
                                        startIcon={<CancelIcon />}
                                    >
                                        Cancel
                                    </Button>
                                </div>
                            </div>
                        </form>
                    ) : (
                        <div className="space-y-3">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-gray-500">Fullname</p>
                                    <p className="font-medium">{user?.fullname || "Not updated"}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Phone Number</p>
                                    <p className="font-medium">{user?.phone_number || "Not updated"}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Date of Birth</p>
                                    <p className="font-medium">{user?.date_of_birth || "Not updated"}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">GST Number</p>
                                    <p className="font-medium">{user?.gst_number || "Not updated"}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Address</p>
                                    <p className="font-medium">{user?.address || "Not updated"}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">City</p>
                                    <p className="font-medium">{user?.city || "Not updated"}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Country</p>
                                    <p className="font-medium">{user?.country || "Not updated"}</p>
                                </div>
                            </div>
                            
                            <Button
                                variant="contained"
                                color="primary"
                                startIcon={<EditIcon />}
                                onClick={startEditing}
                                className="mt-3 bg-[#303030] text-white"
                            >
                                Update
                            </Button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default DriverInfomation;