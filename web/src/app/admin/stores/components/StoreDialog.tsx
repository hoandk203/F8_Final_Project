"use client";

import { useEffect } from "react";
import axios from "axios";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {toast} from "react-toastify";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";

import AdminDialog from "@/app/admin/components/AdminDialog";
import TextField from "@mui/material/TextField";
import CustomButton from "@/components/CustomButton";


import { MenuItem } from "@mui/material";
import { fetchStoreList } from "@/redux/middlewares/storeMiddleware";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const schema = z.object({
    name: z.string().min(1, { message: "Name is required" }).min(2, { message: "Name must be at least 2 characters" }),
    email: z
        .string()
        .min(1, { message: "Email is required" })
        .min(8, { message: "Email must be at least 8 characters" })
        .regex(/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/, { message: `Please enter a valid email (aBc123@domain.com)` }),
    location: z.string().min(1, { message: "Location is required" }).min(2, { message: "Location must be at least 2 characters" }),
    city: z.string().min(1, { message: "City is required" }),
    phone: z.string().min(1, { message: "Phone is required" }).regex(/^\d{10,11}$/, { message: "Phone must be 10-11 digits" }),
    vendorId: z.string().min(1, { message: "Vendor is required" }),
});

type FormInput = z.infer<typeof schema>;

interface Props {
    open: boolean;
    handleClose: () => void;
    vendorList: any;
    currentData?: Partial<FormInput>;
    currentId?: any
}

const StoreDialog = ({ open, handleClose, currentData, currentId, vendorList }: Props) => {
    console.log(currentData);
    const {
        register,
        control,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<FormInput>({
        resolver: zodResolver(schema),
        defaultValues: {
            name: currentData?.name || "",
            email: currentData?.email || "",
            location: currentData?.location || "",
            city: currentData?.city || "",
            phone: currentData?.phone || "",
            vendorId: String(currentData?.vendorId) || "",
        },
    });

    const dispatch = useDispatch<AppDispatch>();

    // Cập nhật giá trị form khi currentData thay đổi
    useEffect(() => {
        if(!open){
            reset({
                name: currentData?.name || "",
                email: currentData?.email || "",
                location: currentData?.location || "",
                city: currentData?.city || "",
                phone: currentData?.phone || "",
                vendorId: String(currentData?.vendorId) || "",
            });
        }
        if (currentData) {
            reset({
                name: currentData?.name || "",
                email: currentData?.email || "",
                location: currentData?.location || "",
                city: currentData?.city || "",
                phone: currentData?.phone || "",
                vendorId: String(currentData?.vendorId) || "",
            }); // Reset giá trị form bằng currentData
        }
    }, [currentData, reset, open]);

    const onSubmit: SubmitHandler<FormInput> = async (data) => {
        if(currentData && currentData.name !== ""){
            try {
                const response = await axios.put(`${BASE_URL}/store/${currentId}`, data);
                if (response.data) {
                    // dispatch(updateVendor([currentId, data]));
                    dispatch(fetchStoreList())
                    handleClose();
                    toast.success("Store updated successfully");
                }
            } catch (e) {
                toast.error("Store update failed");
                console.log(e);
                return e;
            }
        }
        if(currentData && currentData.name === "") {
            try {
                const response = await axios.post(`${BASE_URL}/store`, data);
                if (response.data) {
                    // dispatch(createVendor(data))
                    dispatch(fetchStoreList())
                    toast.success("Store created successfully");
                }
            } catch (e) {
                toast.error("Store create failed");
                console.log(e);
                return e;
            }
        }

    };

    return (
        <AdminDialog
            title={currentData?.name ? "Update store" : "Create store"}
            open={open}
            handleClose={handleClose}
        >
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-y-4">
                <div className="flex flex-col gap-y-1">
                    <label htmlFor={"name"} className="font-semibold">
                        Name
                    </label>
                    <TextField
                        {...register("name")}
                        type="text"
                        id={"name"}
                        label={"Name"}
                        variant="outlined"
                        error={!!errors.name}
                        helperText={errors.name?.message}
                    />
                </div>
                <div className="flex flex-col gap-y-1">
                    <label htmlFor={"email"} className="font-semibold">
                        Email
                    </label>
                    <TextField
                        {...register("email")}
                        type="email"
                        id={"email"}
                        label={"Email"}
                        variant="outlined"
                        error={!!errors.email}
                        helperText={errors.email?.message}
                    />
                </div>
                <div className="flex flex-col gap-y-1">
                    <label htmlFor={"phone"} className="font-semibold">
                        Phone
                    </label>
                    <TextField
                        {...register("phone")}
                        type="text"
                        id={"phone"}
                        label={"Phone"}
                        variant="outlined"
                        error={!!errors.phone}
                        helperText={errors.phone?.message}
                    />
                </div>
                <div className="flex flex-col gap-y-1">
                    <label htmlFor={"location"} className="font-semibold">
                        Location
                    </label>
                    <TextField
                        {...register("location")}
                        type="text"
                        id={"location"}
                        label={"Location"}
                        variant="outlined"
                        error={!!errors.location}
                        helperText={errors.location?.message}
                    />
                </div>
                <div className="flex flex-col gap-y-1">
                    <label htmlFor={"city"} className="font-semibold">
                        City
                    </label>
                    <TextField
                        {...register("city")}
                        type="text"
                        id={"city"}
                        label={"City"}
                        variant="outlined"
                        error={!!errors.city}
                        helperText={errors.city?.message}
                    />
                </div>
                <div className="flex flex-col gap-y-1">
                    <label htmlFor="vendor" className="font-semibold">
                        Vendor
                    </label>
                    <Controller
                        name="vendorId"
                        control={control}
                        render={({ field: { onChange, value } }) => (
                            <TextField
                                select
                                fullWidth
                                label="Vendor"
                                value={value}
                                onChange={onChange}
                                error={!!errors.vendorId}
                                helperText={errors.vendorId?.message}
                            >
                                {vendorList.map((option: any) => (
                                    <MenuItem key={option.id} value={String(option.id)}>
                                        {option.name}
                                    </MenuItem>
                                ))}
                            </TextField>
                        )}
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

export default StoreDialog;
