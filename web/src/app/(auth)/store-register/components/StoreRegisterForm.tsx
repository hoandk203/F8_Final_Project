"use client"

import { useRouter } from "next/navigation";
import { useForm, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import TextField from "@mui/material/TextField";
import { useState } from "react";
import CustomButton from "@/components/CustomButton";
import { sendVerificationEmail } from "@/services/authService";
import LoadingOverlay from "@/components/LoadingOverlay";

const schema = z.object({
    email: z
        .string()
        .min(1, { message: "Email is required" })
        .min(8, { message: "Email must be at least 8 characters" })
        .regex(/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/, { message: "Please enter a valid email (aBc123@domain.com)" }),
});

type FormInput = z.infer<typeof schema>;

const StoreRegisterForm = () => {
    const router = useRouter();
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<FormInput>({
        resolver: zodResolver(schema),
        defaultValues: {
            email: "",
        },
    });
    const [error, setError] = useState("");

    const onSubmit: SubmitHandler<FormInput> = async (data) => {
        try {
            const userData = {
                email: data.email,
                password: "Required123@",
                role: "store",
            };
    
            await sendVerificationEmail(userData);
            localStorage.setItem("userData", JSON.stringify(userData));
            reset();
            router.push("/store/verify-store");
        } catch (error: any) {
            setError(error.message);
        }
    };

    return (
        <div>
            {isSubmitting && <LoadingOverlay/>}
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-y-3">
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
                        inputRef={(input) => input && (input.tabIndex = 1)}
                    />
                </div>
                {error && <div className="text-red-500">{error}</div>}
                <div className="grid grid-cols-1 mt-3">
                    <CustomButton
                        type="submit"
                        disabled={isSubmitting}
                        label={isSubmitting ? "Loading..." : "Register"}
                        variant="dark"
                        size="large"
                    />
                </div>
            </form>
        </div>
    );
};

export default StoreRegisterForm;
