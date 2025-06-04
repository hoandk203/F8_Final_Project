"use client";

import { useEffect } from "react";
import axios from "axios";
import { useForm, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {toast} from "react-toastify";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";

import AdminDialog from "@/app/admin/components/AdminDialog";
import TextField from "@mui/material/TextField";
import CustomButton from "@/components/CustomButton";
import { fetchDriverList } from "@/redux/middlewares/driverMiddleware";
import { createDriver, updateDriver } from "@/services/driverService";
import { Try } from "@mui/icons-material";
import { createUser } from "@/services/userService";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const schema = z.object({
    email: z.string().email({ message: "Invalid email address" }).optional(),
    fullname: z.string().min(1, { message: "Fullname is required" }),
    dateOfBirth: z.string().min(1, { message: "Date of birth is required" }),
    gstNumber: z.string().min(1, { message: "GST number is required" }),
    address: z.string().min(1, { message: "Address is required" }),
    city: z.string().min(1, { message: "City is required" }),
    country: z.string().min(1, { message: "Country is required" }),
    phoneNumber: z.string().min(1, { message: "Phone number is required" }).regex(/^\d{10,11}$/, { message: "Phone must be 10-11 digits" }),
    userId: z.number().optional(),
    identityDocumentId: z.number().optional(),
});

type FormInput = z.infer<typeof schema>;

interface Props {
    open: boolean;
    handleClose: () => void;
    currentData?: any;
    currentId?: any;
}

const DriverDialog = ({ open, handleClose, currentData, currentId }: Props) => {
    console.log("Current data in DriverDialog:", currentData);
    
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
            phoneNumber: "",
        },
    });

    const dispatch = useDispatch<AppDispatch>();

    // Cập nhật giá trị form khi currentData thay đổi
    useEffect(() => {
        if(!open){
            reset();
        }
        if (currentData && currentData.id) {
            reset({
                fullname: currentData.fullname || "",
                dateOfBirth: currentData.date_of_birth?.split('T')[0] || "",
                gstNumber: currentData.gst_number || "",
                address: currentData.address || "",
                city: currentData.city || "",
                country: currentData.country || "",
                phoneNumber: currentData.phone_number || "",
                userId: currentData.user_id,
                identityDocumentId: currentData.identity_document_id,
            });
        }else{
            reset({
                fullname: "",
                dateOfBirth: "",
                gstNumber: "",
                address: "",
                city: "",
                country: "",
                phoneNumber: "",
                email: "",
            });
        }
    }, [currentData, reset, open]);

    const onSubmit: SubmitHandler<FormInput> = async (data) => {
        if(currentId){
            try {
                const response = await updateDriver(currentId, data);
                if (response) {
                    dispatch(fetchDriverList());
                    handleClose();
                    toast.success("Driver updated successfully");
                }
            } catch (e) {
                toast.error("Driver update failed");
                console.log(e);
                return e;
            }
        } else {
            try {
                const userData= await createUser({
                    email: data.email,
                    role: "driver",
                });
                const userId= userData.id;
                
                try {
                    const driverData= {
                        fullname: data.fullname,
                        dateOfBirth: data.dateOfBirth,
                        gstNumber: data.gstNumber,
                        address: data.address,
                        city: data.city,
                        country: data.country,
                        phoneNumber: data.phoneNumber,
                        userId: parseInt(userId),
                    }
                    const response = await createDriver(driverData);
                    if (response) {
                        dispatch(fetchDriverList());
                        handleClose();
                        toast.success("Driver created successfully. Check your email to get the password.");
                    }
                } catch (e) {
                    toast.error("Driver create failed");
                    console.log(e);
                    return e;
                }
            } catch (error) {
                
            }
            
        }
    };

    return (
        <AdminDialog
            title={currentId ? "Update Driver" : "Add New Driver"}
            open={open}
            handleClose={handleClose}
        >
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-y-4">
                {!currentId && (
                    <div className="flex flex-col gap-y-1">
                        <label htmlFor="email" className="font-semibold">
                            Email
                        </label>
                        <TextField
                            {...register("email")}
                            type="text"
                            id="email"
                            label="Email"
                            variant="outlined"
                            error={!!errors.email}
                            helperText={errors.email?.message}
                        />
                    </div>
                )}
                
                <div className="flex flex-col gap-y-1">
                    <label htmlFor="fullname" className="font-semibold">
                        Fullname
                    </label>
                    <TextField
                        {...register("fullname")}
                        type="text"
                        id="fullname"
                        label="Fullname"
                        variant="outlined"
                        error={!!errors.fullname}
                        helperText={errors.fullname?.message}
                    />
                </div>
                <div className="flex flex-col gap-y-1">
                    <label htmlFor="dateOfBirth" className="font-semibold">
                        Date of birth
                    </label>
                    <TextField
                        {...register("dateOfBirth")}
                        type="date"
                        id="dateOfBirth"
                        InputLabelProps={{ shrink: true }}
                        variant="outlined"
                        error={!!errors.dateOfBirth}
                        helperText={errors.dateOfBirth?.message}
                    />
                </div>
                <div className="flex flex-col gap-y-1">
                    <label htmlFor="gstNumber" className="font-semibold">
                        GST Number
                    </label>
                    <TextField
                        {...register("gstNumber")}
                        type="text"
                        id="gstNumber"
                        label="GST Number"
                        variant="outlined"
                        error={!!errors.gstNumber}
                        helperText={errors.gstNumber?.message}
                    />
                </div>
                <div className="flex flex-col gap-y-1">
                    <label htmlFor="address" className="font-semibold">
                        Address
                    </label>
                    <TextField
                        {...register("address")}
                        type="text"
                        id="address"
                        label="Address"
                        variant="outlined"
                        error={!!errors.address}
                        helperText={errors.address?.message}
                    />
                </div>
                <div className="flex flex-col gap-y-1">
                    <label htmlFor="city" className="font-semibold">
                        City
                    </label>
                    <TextField
                        {...register("city")}
                        type="text"
                        id="city"
                        label="City"
                        variant="outlined"
                        error={!!errors.city}
                        helperText={errors.city?.message}
                    />
                </div>
                <div className="flex flex-col gap-y-1">
                    <label htmlFor="country" className="font-semibold">
                        Country
                    </label>
                    <TextField
                        {...register("country")}
                        type="text"
                        id="country"
                        label="Country"
                        variant="outlined"
                        error={!!errors.country}
                        helperText={errors.country?.message}
                    />
                </div>
                <div className="flex flex-col gap-y-1">
                    <label htmlFor="phoneNumber" className="font-semibold">
                        Phone number
                    </label>
                    <TextField
                        {...register("phoneNumber")}
                        type="text"
                        id="phoneNumber"
                        label="Phone number"
                        variant="outlined"
                        error={!!errors.phoneNumber}
                        helperText={errors.phoneNumber?.message}
                    />
                </div>
                <div className="grid grid-cols-1 mt-3">
                    <CustomButton
                        type="submit"
                        disabled={isSubmitting}
                        label={isSubmitting ? "Loading..." : "Save"}
                        variant={"dark"}
                        size={"large"}
                    />
                </div>
            </form>
        </AdminDialog>
    );
};

export default DriverDialog; 