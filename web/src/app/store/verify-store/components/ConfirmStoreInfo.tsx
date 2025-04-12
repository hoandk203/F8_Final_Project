"use client"

import { useEffect, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { TextField, MenuItem, FormControl, InputLabel, Select, FormHelperText, CircularProgress, Alert } from "@mui/material";
import CustomButton from "@/components/CustomButton";
import {useDispatch} from "react-redux";
import {AppDispatch} from "@/redux/store";
import {setStep as setVerifyDriverStep} from "@/redux/slice/verifyDriverStepSlice";
import { createStore } from "@/services/authService";
import { getVendorListForStore } from "@/services/vendorService";
import { saveStoreLocation } from "@/services/storeService";
import { useRouter } from "next/navigation";

const schema = z.object({
    name: z.string().min(1, { message: "Store name is required" }),
    location: z.string().min(1, { message: "Address is required" }),
    email: z.string().email({ message: "Invalid email" }).min(1, { message: "Email is required" }),
    phone: z.string().min(1, { message: "Phone number is required" }),
    vendorId: z.string().min(1, { message: "Vendor is required" }),
    city: z.string().min(1, { message: "City is required" }),
});

type FormInput = z.infer<typeof schema>;

interface Vendor {
    id: number;
    name: string;
}

interface GeolocationPosition {
    coords: {
        latitude: number;
        longitude: number;
    };
}

const ConfirmStoreInfo = () => {
    const dispatch = useDispatch<AppDispatch>();
    const router = useRouter();
    const [vendors, setVendors] = useState<Vendor[]>([]);
    const [isLoadingVendors, setIsLoadingVendors] = useState(false);
    const [vendorError, setVendorError] = useState("");
    const [locationError, setLocationError] = useState("");
    const [currentLocation, setCurrentLocation] = useState<{latitude: number, longitude: number} | null>(null);
    const [isLoadingLocation, setIsLoadingLocation] = useState(false);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
        setValue,
        control,
        watch,
    } = useForm<FormInput>({
        resolver: zodResolver(schema),
        defaultValues: {
            name: "",
            location: "",
            email: "",
            phone: "",
            vendorId: "",
            city: "",
        },
    });

    // Fetch vendor list when component mounts
    useEffect(() => {
        const fetchVendors = async () => {
            setIsLoadingVendors(true);
            setVendorError("");
            try {
                const response = await getVendorListForStore();
                setVendors(response);
            } catch (error: any) {
                console.error("Error fetching vendors:", error);
                setVendorError("Cannot load vendor list. Please try again later.");
            } finally {
                setIsLoadingVendors(false);
            }
        };

        fetchVendors();
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
                    setLocationError("Unable to get your current location. Please allow location access.");
                    setIsLoadingLocation(false);
                }
            );
            
        } else {
            setLocationError("Geolocation is not supported by this browser.");
            setIsLoadingLocation(false);
        }
    };

    const onSubmit: SubmitHandler<FormInput> = async (data) => {
        const userId = JSON.parse(localStorage.getItem("userId") || "{}");
        const storeData = {
            ...data,
            vendorId: parseInt(data.vendorId),
            userId: parseInt(userId),
        };
        
        try {
            // Create store
            const storeResponse = await createStore(storeData);
            // Save store location if available
            
            if (currentLocation && storeResponse && storeResponse.id) {
                console.log(currentLocation);
                console.log(storeResponse);
                
                try {
                    
                    await saveStoreLocation(
                        storeResponse.id,
                        currentLocation.latitude,
                        currentLocation.longitude
                    );

                    reset();
                    router.push("/store-login");
                    localStorage.removeItem("userId");
                } catch (locationError) {
                    console.log("Error saving store location:", locationError);
                    // Continue with registration even if location saving fails
                }
            }
            
        } catch (error: any) {
            console.error("Error creating store:", error);
            throw error;
        }
    };

    const selectedVendorId = watch("vendorId");

    return (
        <div>
            <h1 className="text-3xl font-bold mb-1">Verify store information</h1>
            <p className="text-[#666]">Confirm your information to create a new store</p>
            
            <div className="mt-8">
                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-y-4 text-start">
                    <div className="flex flex-col">
                        <label htmlFor="name" className="font-semibold">Store name</label>
                        <TextField
                            {...register("name")}
                            id="name"
                            placeholder="Enter store name"
                            variant="outlined"
                            size="small"
                            error={!!errors.name}
                            helperText={errors.name?.message}
                        />
                    </div>

                    <div className="flex flex-col">
                        <label htmlFor="email" className="font-semibold">Email</label>
                        <TextField
                            {...register("email")}
                            id="email"
                            placeholder="Enter email"
                            variant="outlined"
                            size="small"
                            error={!!errors.email}
                            helperText={errors.email?.message}
                        />
                    </div>

                    <div className="flex flex-col">
                        <label htmlFor="phone" className="font-semibold">Phone</label>
                        <TextField
                            {...register("phone")}
                            id="phone"
                            placeholder="Enter phone number"
                            variant="outlined"
                            size="small"
                            error={!!errors.phone}
                            helperText={errors.phone?.message}
                        />
                    </div>

                    <div className="flex flex-col">
                        <label htmlFor="city" className="font-semibold">City</label>
                        <TextField
                            {...register("city")}
                            id="city"
                            placeholder="Enter city"
                            variant="outlined"
                            size="small"
                            error={!!errors.city}
                            helperText={errors.city?.message}
                        />
                    </div>

                    <div className="flex flex-col">
                        <label htmlFor="location" className="font-semibold">Address</label>
                        <TextField
                            {...register("location")}
                            id="location"
                            placeholder="Enter detailed address"
                            variant="outlined"
                            size="small"
                            error={!!errors.location}
                            helperText={errors.location?.message}
                        />
                    </div>

                    <div className="flex flex-col">
                        <label htmlFor="vendorId" className="font-semibold">Vendor</label>
                        <FormControl error={!!errors.vendorId} size="small">
                            <Select
                                {...register("vendorId")}
                                id="vendorId"
                                displayEmpty
                                disabled={isLoadingVendors}
                                value={selectedVendorId}
                                onChange={(e) => setValue("vendorId", e.target.value)}
                                renderValue={(selected) => {
                                    if (!selected) return <em>Select Vendor</em>;
                                    const selectedVendor = vendors.find(v => v.id.toString() === selected);
                                    return selectedVendor ? selectedVendor.name : <em>Select Vendor</em>;
                                }}
                            >
                                <MenuItem disabled value="">
                                    <em>Select vendor</em>
                                </MenuItem>
                                {isLoadingVendors ? (
                                    <MenuItem value="loading" disabled>
                                        <div className="flex items-center">
                                            <CircularProgress size={20} />
                                            <span className="ml-2">Loading...</span>
                                        </div>
                                    </MenuItem>
                                ) : (
                                    vendors.map((vendor) => (
                                        <MenuItem key={vendor.id} value={vendor.id.toString()}>
                                            {vendor.name}
                                        </MenuItem>
                                    ))
                                )}
                            </Select>
                            {errors.vendorId && <FormHelperText>{errors.vendorId.message}</FormHelperText>}
                            {vendorError && <FormHelperText error>{vendorError}</FormHelperText>}
                        </FormControl>
                    </div>

                    <div className="mt-3 grid gri-cols-1 gap-y-2">
                        <CustomButton
                            type="submit"
                            disabled={isSubmitting || isLoadingVendors}
                            label={isSubmitting ? "Processing..." : "Confirm information"}
                            variant="dark"
                            size="large"
                        />
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ConfirmStoreInfo;