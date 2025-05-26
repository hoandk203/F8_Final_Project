"use client"

import { useEffect, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import TextField from "@mui/material/TextField";
import CustomButton from "@/components/CustomButton";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { setStep as setVerifyDriverStep } from "@/redux/slice/verifyDriverStepSlice";
import { createDriver } from "@/services/authService";
import { saveDriverLocation } from "@/services/driverService";
import { Alert, CircularProgress } from "@mui/material";

const schema = z.object({
    fullname: z.string().min(1, { message: "Full name is required" }),
    dateOfBirth: z.string().min(1, { message: "Date of birth is required" }),
    gstNumber: z.string().min(1, { message: "GST number is required" }),
    address: z.string().min(1, { message: "Address is required" }),
    city: z.string().min(1, { message: "City is required" }),
    country: z.string().min(1, { message: "Country is required" }),
});

type FormInput = z.infer<typeof schema>;

interface Props {
    setStep: (step: number) => void
    userId: number,
    identityDocumentId: number
}

interface GeolocationPosition {
    coords: {
        latitude: number;
        longitude: number;
    };
}

const ConfirmIdentity = ({setStep, userId, identityDocumentId}: Props) => {
    const dispatch = useDispatch<AppDispatch>();
    const [currentLocation, setCurrentLocation] = useState<{latitude: number, longitude: number} | null>(null);
    const [isLoadingLocation, setIsLoadingLocation] = useState(false);
    const [locationError, setLocationError] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<FormInput>({
        resolver: zodResolver(schema),
        defaultValues: {
            fullname: "",
            dateOfBirth: "",
            gstNumber: "",
            address: "",
            city: "",
            country: "",
        },
    });

    // Lấy vị trí hiện tại khi component mount
    useEffect(() => {
        getCurrentLocation();
    }, []);

    const getCurrentLocation = () => {
        setIsLoadingLocation(true);
        setLocationError("");
        
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position: GeolocationPosition) => {
                    setCurrentLocation({
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude
                    });
                    setIsLoadingLocation(false);
                },
                (error) => {
                    console.error("Error getting location:", error);
                    setLocationError("Can't get your location. Please try again.");
                    setIsLoadingLocation(false);
                },
                { 
                    enableHighAccuracy: true, 
                    timeout: 10000, 
                    maximumAge: 0 
                }
            );
        } else {
            setLocationError("Your browser does not support location services");
            setIsLoadingLocation(false);
        }
    };

    const onSubmit: SubmitHandler<FormInput> = async (data) => {
        localStorage.removeItem("verifyIdStep")
        localStorage.removeItem("verifyDriverStep")

        setError("");
        setSuccess("");
        
        // Kiểm tra xem đã có vị trí chưa
        if (!currentLocation) {
            setError("Please grant location permission to continue.");
            return;
        }
        const idDocumentId= Number(localStorage.getItem("identityDocumentId"))
        if(idDocumentId){
            identityDocumentId=idDocumentId
        }
        const userIdNumber= userId || Number(localStorage.getItem("userId")) 
        try {
            const driverData = {
                ...data,
                userId: userIdNumber,
                identityDocumentId
            };
            
            // Tạo tài xế
            const response = await createDriver(driverData);
            const driverId = response.id;

            localStorage.removeItem("identityDocumentId")
            localStorage.removeItem("userId")
            // Lưu ID tài xế vào localStorage
            localStorage.setItem("driverId", JSON.stringify(driverId));
            
            // Lưu vị trí tài xế
            try {
                console.log("Saving driver location:", currentLocation);
                await saveDriverLocation(
                    driverId,
                    currentLocation.latitude,
                    currentLocation.longitude
                );
                console.log("Driver location saved successfully");
            } catch (locationError) {
                console.error("Failed to save driver location:", locationError);
                // Không dừng luồng nếu lưu vị trí thất bại
            }
            
            // Reset form và chuyển bước
            reset();
            setSuccess("Identity verification successful!");
            dispatch(setVerifyDriverStep(2));
        } catch (err: any) {
            console.error("Error creating driver:", err);
            setError(err.message || "Failed to verify identity. Please try again.");
        }
    };

    const handleVerifyIdStep = () => {
        setStep(0);
    };

    return (
        <div>
            <h1 className="text-3xl font-bold mb-1">Verify driver identity</h1>
            <p className="text-[#666]">Confirm your information to verify your identity</p>
            
            {error && <Alert severity="error" className="mt-4 mb-2">{error}</Alert>}
            {success && <Alert severity="success" className="mt-4 mb-2">{success}</Alert>}
            
            {locationError && (
                <Alert severity="warning" className="mt-4 mb-2">
                    {locationError}
                    <div className="mt-2">
                        <button 
                            onClick={getCurrentLocation}
                            className="text-blue-600 underline text-sm"
                        >
                            Try again
                        </button>
                    </div>
                </Alert>
            )}
            
            {isLoadingLocation && (
                <div className="flex items-center mt-4 mb-2 text-gray-600">
                    <CircularProgress size={20} />
                    <span className="ml-2">Determining your location...</span>
                </div>
            )}
            
            {currentLocation && !locationError && (
                <Alert severity="info" className="mt-4 mb-2">
                    Your location has been determined. This location will be saved when you register.
                </Alert>
            )}
            
            <div className="mt-8">
                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-y-4 text-start">
                    <div className="flex flex-col">
                        <label htmlFor="fullname" className="font-semibold">Full Name</label>
                        <TextField
                            {...register("fullname")}
                            id="fullname"
                            label="Full Name"
                            variant="outlined"
                            size="small"
                            error={!!errors.fullname}
                            helperText={errors.fullname?.message}
                        />
                    </div>

                    <div className="flex flex-col">
                        <label htmlFor="dateOfBirth" className="font-semibold">Date of Birth</label>
                        <TextField
                            {...register("dateOfBirth")}
                            type="date"
                            id="dateOfBirth"
                            variant="outlined"
                            size="small"
                            error={!!errors.dateOfBirth}
                            helperText={errors.dateOfBirth?.message}
                        />
                    </div>

                    <div className="flex flex-col">
                        <label htmlFor="gstNumber" className="font-semibold">GST Number</label>
                        <TextField
                            {...register("gstNumber")}
                            id="gstNumber"
                            label="GST Number"
                            variant="outlined"
                            size="small"
                            error={!!errors.gstNumber}
                            helperText={errors.gstNumber?.message}
                        />
                    </div>

                    <div className="flex flex-col">
                        <label htmlFor="address" className="font-semibold">Address</label>
                        <TextField
                            {...register("address")}
                            id="address"
                            label="Address"
                            variant="outlined"
                            size="small"
                            error={!!errors.address}
                            helperText={errors.address?.message}
                        />
                    </div>

                    <div className="flex flex-col">
                        <label htmlFor="city" className="font-semibold">City</label>
                        <TextField
                            {...register("city")}
                            id="city"
                            label="City"
                            variant="outlined"
                            size="small"
                            error={!!errors.city}
                            helperText={errors.city?.message}
                        />
                    </div>

                    <div className="flex flex-col">
                        <label htmlFor="country" className="font-semibold">Country</label>
                        <TextField
                            {...register("country")}
                            id="country"
                            label="Country"
                            variant="outlined"
                            size="small"
                            error={!!errors.country}
                            helperText={errors.country?.message}
                        />
                    </div>

                    <div className="mt-3 grid gri-cols-1 gap-y-2">
                        <CustomButton
                            type="submit"
                            disabled={isSubmitting || !currentLocation}
                            label={isSubmitting ? "Verifying..." : "Verify Identity"}
                            variant="dark"
                            size="large"
                        />
                        {/* <CustomButton
                            label={"Retake"}
                            variant="light"
                            size="large"
                            handleVerifyIdStep={handleVerifyIdStep}
                        /> */}
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ConfirmIdentity;