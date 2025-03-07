"use client"

import { useRouter } from "next/navigation";
import { useForm, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import TextField from "@mui/material/TextField";
import { useState } from "react";
import { IconButton, InputAdornment } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";

import CustomButton from "@/components/CustomButton";
import { sendVerificationEmail } from "@/services/authService";


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
    confirmPassword: z
        .string()
        .min(1, { message: "Confirm Password is required" })
        
}).refine((data) => data.password === data.confirmPassword, {
        message: "Passwords don't match",
        path: ["confirmPassword"],
    });

type FormInput = z.infer<typeof schema>;

const RegisterForm = () => {
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
            password: "",
            confirmPassword: "",
        },
    });
    const [error, setError] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleTogglePassword = () => {
        setShowPassword((prev) => !prev);
    };

    const handleToggleConfirmPassword = () => {
        setShowConfirmPassword((prev) => !prev);
    };

    const onSubmit: SubmitHandler<FormInput> = async (data) => {
        try {
            const userData = {
                email: data.email,
                password: data.password,
                role: "driver",
            };
    
            await sendVerificationEmail(userData);
            localStorage.setItem("userData", JSON.stringify(userData));
            reset();
            router.push("/verify-driver");
        } catch (error: any) {
            setError(error.message);
        }
    }

    return (
        <div>
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
                        inputRef={(input) => input && (input.tabIndex = 2)}
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
                    />
                </div>
                <div className="flex flex-col gap-y-1">
                    <label htmlFor={"confirmPassword"} className="font-semibold">
                        Confirm Password
                    </label>
                    <TextField
                        {...register("confirmPassword")}
                        type={showConfirmPassword ? "text" : "password"}
                        id={"confirmPassword"}
                        label={"Confirm Password"}
                        variant="outlined"
                        error={!!errors.confirmPassword}
                        helperText={errors.confirmPassword?.message}
                        inputRef={(input) => input && (input.tabIndex = 3)}
                        slotProps={{
                            input: {
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="toggle confirm password visibility"
                                            onClick={handleToggleConfirmPassword}
                                            edge="end"
                                        >
                                            {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                )
                            }
                        }}
                    />
                </div>
                {error && <div className="text-red-500">{error}</div>}
                <div className="grid grid-cols-1 mt-3">
                    <CustomButton
                        type="submit"
                        disabled={isSubmitting}
                        label={isSubmitting ? "Loading..." : "Register"}
                        variant={"dark"}
                        size={"large"}
                    />
                </div>
            </form>
        </div>
    )
}

export default RegisterForm