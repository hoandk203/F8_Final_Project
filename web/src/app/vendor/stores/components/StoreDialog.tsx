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


import { MenuItem, Select, FormControl, InputLabel, FormHelperText } from "@mui/material";
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
    status: z.enum(["pending", "approved"], { message: "Please select a valid status" }),
});

type FormInput = z.infer<typeof schema>;

interface Props {
    open: boolean;
    handleClose: () => void;
    currentData?: Partial<FormInput>;
    currentId?: any
    setStoreList: (storeList: any[]) => void;
    storeList: any[]
}

const StoreDialog = ({ open, handleClose, currentData, currentId, storeList, setStoreList }: Props) => {
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
            status: currentData?.status || "pending",
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
                status: currentData?.status || "pending",
            });
        }
        if (currentData) {
            reset({
                name: currentData?.name || "",
                email: currentData?.email || "",
                location: currentData?.location || "",
                city: currentData?.city || "",
                phone: currentData?.phone || "",
                status: currentData?.status || "pending",
            }); // Reset giá trị form bằng currentData
        }
    }, [currentData, reset, open]);

    const onSubmit: SubmitHandler<FormInput> = async (data) => {

        const updatedStoreList = storeList.map(store => {
            if (store.id === currentId) {
                return { ...store, ...data };
            }
            return store;
        });

        if(currentData && currentData.name !== ""){
            try {
                const response = await axios.put(`${BASE_URL}/store/${currentId}`, data);
                console.log(response);
                if (response.data) {
                    // dispatch(updateVendor([currentId, data]));
                    setStoreList([...updatedStoreList]);
                    handleClose();
                    toast.success("Store updated successfully");
                }
            } catch (e) {
                toast.error("Store update failed");
                console.log(e);
                return e;
            }
        }

    };

    return (
        <AdminDialog
            title="Update store"
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
                    <label htmlFor={"status"} className="font-semibold">
                        Status
                    </label>
                    <Controller
                        name="status"
                        control={control}
                        render={({ field }) => (
                            <FormControl error={!!errors.status}>
                                <InputLabel id="status-label">Status</InputLabel>
                                <Select
                                    {...field}
                                    labelId="status-label"
                                    id="status"
                                    label="Status"
                                >
                                    <MenuItem value="pending">Pending</MenuItem>
                                    <MenuItem value="approved">Approved</MenuItem>
                                </Select>
                                {errors.status && (
                                    <FormHelperText>{errors.status.message}</FormHelperText>
                                )}
                            </FormControl>
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
