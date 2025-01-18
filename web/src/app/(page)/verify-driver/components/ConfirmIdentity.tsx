"use client"

import { useForm, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import TextField from "@mui/material/TextField";
import CustomButton from "@/components/CustomButton";

const schema = z.object({
    fullname: z.string().min(1, { message: "Full name is required" }),
    dateOfBirth: z.string().min(1, { message: "Date of birth is required" }),
    gstNumber: z.string().min(1, { message: "GST number is required" }),
    address: z.string().min(1, { message: "Address is required" }),
    city: z.string().min(1, { message: "City is required" }),
    state: z.string().min(1, { message: "State is required" }),
});

type FormInput = z.infer<typeof schema>;

const ConfirmIdentity = () => {
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
            state: "",
        },
    });

    const onSubmit: SubmitHandler<FormInput> = async (data) => {
        setTimeout(() => {
            console.log(data)
            reset()
        }, 2000)
    }

    return (
        <div>
            <h1 className="text-3xl font-bold mb-1">Verify driver identity</h1>
            <p className="text-[#666] mb-6">Confirm your information to verify your identity</p>
            
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
                        InputLabelProps={{ shrink: true }}
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
                    <label htmlFor="state" className="font-semibold">State</label>
                    <TextField
                        {...register("state")}
                        id="state"
                        label="State"
                        variant="outlined"
                        size="small"
                        error={!!errors.state}
                        helperText={errors.state?.message}
                    />
                </div>

                <div className="mt-3 grid gri-cols-1 gap-y-2">
                    <CustomButton
                        type="submit"
                        disabled={isSubmitting}
                        label={isSubmitting ? "Verifying..." : "Verify Identity"}
                        variant="dark"
                        size="large"
                    />
                    <CustomButton
                        label={"Retake"}
                        variant="light"
                        size="large"
                    />
                </div>
            </form>
        </div>
    )
}

export default ConfirmIdentity;