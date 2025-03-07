"use client"

import { useForm, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import TextField from "@mui/material/TextField";
import CustomButton from "@/components/CustomButton";
import {useDispatch} from "react-redux";
import {AppDispatch} from "@/redux/store";
import {setStep as setVerifyDriverStep} from "@/redux/slice/verifyDriverStepSlice";
import {createDriver} from "@/services/authService";

const schema = z.object({
    fullname: z.string().min(1, { message: "Full name is required" }),
    dateOfBirth: z.string().min(1, { message: "Date of birth is required" }),
    gstNumber: z.string().min(1, { message: "GST number is required" }),
    address: z.string().min(1, { message: "Address is required" }),
    city: z.string().min(1, { message: "City is required" }),
    country: z.string().min(1, { message: "Country is required" }),
});

type FormInput = z.infer<typeof schema>;

interface Props {
    setStep: (step: number) => void
    userId: number,
    identityDocumentId: number
}

const ConfirmIdentity = ({setStep, userId, identityDocumentId}: Props) => {
    const dispatch= useDispatch<AppDispatch>()

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
        },
    });

    const onSubmit: SubmitHandler<FormInput> = async (data) => {
        const driverData= {
            ...data,
            userId,
            identityDocumentId
        }
        try {
            const response= await createDriver(driverData)
            localStorage.setItem("driverId", JSON.stringify(response.id));
            reset()
            dispatch(setVerifyDriverStep(2))
        }catch (e) {
            throw e
        }

    }

    const handleVerifyIdStep = () => {
        setStep(0)
    }

    return (
        <div>
            <h1 className="text-3xl font-bold mb-1">Verify driver identity</h1>
            <p className="text-[#666]">Confirm your information to verify your identity</p>
            
            <div className="mt-8">
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
                        <label htmlFor="country" className="font-semibold">Country</label>
                        <TextField
                            {...register("country")}
                            id="country"
                            label="Country"
                            variant="outlined"
                            size="small"
                            error={!!errors.country}
                            helperText={errors.country?.message}
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
                            handleVerifyIdStep={handleVerifyIdStep}
                        />
                    </div>
                </form>
            </div>
        </div>
    )
}

export default ConfirmIdentity;