"use client"

import { useForm, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import TextField from "@mui/material/TextField";
import { useEffect, useState } from "react";
import { IconButton, InputAdornment, Link } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";

import CustomButton from "@/components/CustomButton";
import {loginAPI, setAuthTokens, clearAuthTokens} from "@/services/authService";
import {useRouter} from "next/navigation";
import LoadingOverlay from "@/components/LoadingOverlay";


const schema = z.object({
    email: z
        .string()
        .min(1, { message: "Email is required" })
        .min(8, { message: "Email must be at least 8 characters" })
        .regex(/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/, { message: `Please enter a valid email (aBc123@domain.com)` }),
    password: z
        .string()
        .min(1, { message: "Password is required" })
        .min(8, { message: "Password must be at least 8 characters" })
        .regex(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&_])[A-Za-z\d@$!%*?&_]{8,}$/,
            { 
                message: "Password must contain at least 1 uppercase letter, 1 lowercase letter, 1 number and 1 special character (@$!%*?_&)" 
            }
        ),
});

type FormInput = z.infer<typeof schema>;

const VendorLoginForm = () => {
    const router= useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const handleTogglePassword = () => {
        setShowPassword((prev) => !prev);
    };

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<FormInput>({
        resolver: zodResolver(schema),
        defaultValues: {
            email: "",
            password: "",
        },
    });


    const onSubmit: SubmitHandler<FormInput> = async (data) => {
        try {
            // Clear any existing authentication data
            clearAuthTokens();
            
            const response = await loginAPI(data);
            
            // Store tokens in cookies
            setAuthTokens({
                access_token: response.access_token,
                refresh_token: response.refresh_token,
                role: response.role
            });
            
            // Redirect based on role
            if (response.role === 'vendor') {
                router.push("/vendor");
            } else if (response.role === 'admin') {
                router.push("/admin/drivers");
            } else {
                setError("You are not authorized to access this page");
                clearAuthTokens();
            }

        } catch (e) {
            clearAuthTokens();
            if (e instanceof Error) {
                setError(e.message);
            } else {
                setError("An unknown error occurred");
            }
        }
        reset()
    }

    return (
        <div className="max-w-md mx-auto">
            {isSubmitting && <LoadingOverlay/>}
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-y-3">
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
                        inputRef={(input) => input && (input.tabIndex = 1)}
                    />
                </div>
                <div className="flex flex-col gap-y-1">
                    <label htmlFor={"password"} className="font-semibold">
                        Password
                    </label>
                    <TextField
                        {...register("password")}
                        type={showPassword ? "text" : "password"}
                        id={"password"}
                        label={"Password"}
                        variant="outlined"
                        error={!!errors.password}
                        helperText={errors.password?.message}
                        slotProps={{
                            input: {
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={handleTogglePassword}
                                            edge="end"
                                        >
                                            {showPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                )
                            }
                        }}
                        inputRef={(input) => input && (input.tabIndex = 2)}
                    />
                </div>
                <div className="flex justify-end font-semibold underline cursor-pointer">
                    <Link href="/forgot-password" className="text-black">Forgot Password?</Link>
                </div>
                {error && <p className="text-red-500">{error}</p>}
                <div className="grid grid-cols-1 mt-3">
                    <CustomButton
                        type="submit"
                        disabled={isSubmitting}
                        label={isSubmitting ? "Loading..." : "Login"}
                        variant={"dark"}
                        size={"large"}
                    />
                </div>
            </form>
        </div>
    )
}

export default VendorLoginForm