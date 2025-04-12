"use client"

import { useRouter } from "next/navigation";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import TextField from "@mui/material/TextField";
import { useState } from "react";
import CustomButton from "@/components/CustomButton";
import { sendVerificationEmail } from "@/services/authService";
import { FormControl, InputLabel, MenuItem, Select, FormHelperText, IconButton, InputAdornment } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import LoadingOverlay from "@/components/LoadingOverlay";

const schema = z.object({
    name: z.string().min(1, { message: "Name is required" }),
    email: z
        .string()
        .min(1, { message: "Email is required" })
        .min(8, { message: "Email must be at least 8 characters" })
        .regex(/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/, { message: "Please enter a valid email (aBc123@domain.com)" }),
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
    confirmPassword: z.string().min(1, { message: "Confirm password is required" }),
    role: z.string().min(1, { message: "Role is required" }),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
});

type FormInput = z.infer<typeof schema>;

const VendorRegisterForm = () => {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState("");

    const handleTogglePassword = () => {
        setShowPassword((prev) => !prev);
    };

    const handleToggleConfirmPassword = () => {
        setShowConfirmPassword((prev) => !prev);
    };

    const {
        register,
        handleSubmit,
        reset,
        control,
        formState: { errors, isSubmitting },
    } = useForm<FormInput>({
        resolver: zodResolver(schema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
            confirmPassword: "",
            role: "",
        },
    });

    const onSubmit: SubmitHandler<FormInput> = async (data) => {
        try {
            const userData = {
                name: data.name,
                email: data.email,
                password: data.password,
                role: data.role,
            };
    
            await sendVerificationEmail(userData);
            localStorage.setItem("userData", JSON.stringify(userData));
            reset();
            
            router.push("/vendor/verify-vendor");
        } catch (error: any) {
            setError(error.message);
        }
    };

    return (
        <div>
            {isSubmitting && <LoadingOverlay/>}
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-y-3">
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
                        inputRef={(input) => input && (input.tabIndex = 1)}
                    />
                </div>
                
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
                        inputRef={(input) => input && (input.tabIndex = 2)}
                    />
                </div>
                
                <div className="flex flex-col gap-y-1">
                    <label htmlFor="password" className="font-semibold">
                        Password
                    </label>
                    <TextField
                        {...register("password")}
                        type={showPassword ? "text" : "password"}
                        id="password"
                        label="Password"
                        variant="outlined"
                        error={!!errors.password}
                        helperText={errors.password?.message}
                        inputRef={(input) => input && (input.tabIndex = 3)}
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
                    <label htmlFor="confirmPassword" className="font-semibold">
                        Confirm Password
                    </label>
                    <TextField
                        {...register("confirmPassword")}
                        type={showConfirmPassword ? "text" : "password"}
                        id="confirmPassword"
                        label="Confirm Password"
                        variant="outlined"
                        error={!!errors.confirmPassword}
                        helperText={errors.confirmPassword?.message}
                        inputRef={(input) => input && (input.tabIndex = 4)}
                        slotProps={{
                            input: {
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="toggle password visibility"
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
                
                <div className="flex flex-col gap-y-1">
                    <label htmlFor="role" className="font-semibold">
                        Role
                    </label>
                    <Controller
                        name="role"
                        control={control}
                        render={({ field }) => (
                            <FormControl error={!!errors.role}>
                                <Select
                                    {...field}
                                    id="role"
                                    displayEmpty
                                    inputProps={{ tabIndex: 5 }}
                                    value={field.value || ""}
                                >
                                    <MenuItem value="" disabled>
                                        <em>Select role</em>
                                    </MenuItem>
                                    <MenuItem value="vendor">Vendor</MenuItem>
                                    <MenuItem value="admin">Admin</MenuItem>
                                </Select>
                                {errors.role && <FormHelperText>{errors.role.message}</FormHelperText>}
                            </FormControl>
                        )}
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

export default VendorRegisterForm;
