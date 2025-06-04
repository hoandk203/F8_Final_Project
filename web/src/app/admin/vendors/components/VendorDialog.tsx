"use client";

import { useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";

import AdminDialog from "@/app/admin/components/AdminDialog";
import TextField from "@mui/material/TextField";
import CustomButton from "@/components/CustomButton";

import { fetchVendorList } from "@/redux/middlewares/vendorMiddleware";
import { createUser } from "@/services/userService";
import { createVendor, updateVendor } from "@/services/vendorService";

const schema = z.object({
    name: z.string().min(1, { message: "Name is required" }).min(2, { message: "Name must be at least 2 characters" }),
    email: z
        .string()
        .min(1, { message: "Email is required" })
        .min(8, { message: "Email must be at least 8 characters" })
        .regex(/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/, { message: `Please enter a valid email (aBc123@domain.com)` }),
});

type FormInput = z.infer<typeof schema>;

interface Props {
    open: boolean;
    handleClose: () => void;
    currentData?: Partial<FormInput>;
    currentId?: any
}

const VendorDialog = ({ open, handleClose, currentData, currentId }: Props) => {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<FormInput>({
        resolver: zodResolver(schema),
        defaultValues: {
            name: "",
            email: "",
        },
    });

    const dispatch = useDispatch<AppDispatch>();

    // Cập nhật giá trị form khi currentData thay đổi
    useEffect(() => {
        if (!open) {
            reset();
        }
        if (currentData) {
            reset(currentData); // Reset giá trị form bằng currentData
        }
    }, [currentData, reset, open]);

    const onSubmit: SubmitHandler<FormInput> = async (data) => {
        try {
            if (currentData && currentId) {
                // Update existing vendor
                const response = await updateVendor(currentId, {name: data.name});
                if (response) {
                    dispatch(fetchVendorList());
                    handleClose();
                    reset();
                    toast.success("Vendor updated successfully");
                }
            } else {
                // Create new vendor
                try {
                    const userData = await createUser({
                        name: data.name,
                        email: data.email,
                        role: "vendor",
                    });
                    const userId = userData.id;
                    
                    const vendorData = {
                        ...data,
                        userId: parseInt(userId),
                    };
                    
                    const response = await createVendor(vendorData);
                    if (response) {
                        dispatch(fetchVendorList());
                        handleClose();
                        reset();
                        toast.success("Vendor created successfully. Please check your email to get the password.");
                    }
                } catch (error: any) {
                    toast.error(error.message || "Failed to create vendor");
                    console.log(error);
                }
            }
        } catch (error: any) {
            console.error("API Error:", error);
            toast.error(error.message || "Operation failed");
        }
    };

    return (
        <AdminDialog
            title={currentId ? "Update vendor" : "Create vendor"}
            open={open}
            handleClose={handleClose}
        >
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-y-4">
                <div className="flex flex-col gap-y-1">
                    <label htmlFor="name" className="font-semibold">
                        Name
                    </label>
                    <TextField
                        {...register("name")}
                        type="text"
                        id="name"
                        label="Name"
                        variant="outlined"
                        error={!!errors.name}
                        helperText={errors.name?.message}
                    />
                </div>
                {!currentId && (
                    <div className="flex flex-col gap-y-1">
                        <label htmlFor="email" className="font-semibold">
                            Email
                        </label>
                        <TextField
                            {...register("email")}
                            type="email"
                            id="email"
                            label="Email"
                            variant="outlined"
                            error={!!errors.email}
                            helperText={errors.email?.message}
                        />
                    </div>   
                )}
                <div className="grid grid-cols-1 mt-3">
                    <CustomButton
                        type="submit"
                        disabled={isSubmitting}
                        label={isSubmitting ? "Processing..." : "Save"}
                        variant="dark"
                        size="large"
                    />
                </div>
            </form>
        </AdminDialog>
    );
};

export default VendorDialog;
