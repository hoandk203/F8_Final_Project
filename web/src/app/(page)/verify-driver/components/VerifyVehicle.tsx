"use client"

import {z} from "zod";
import {SubmitHandler, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";

import {TextField} from "@mui/material";
import UploadImages from "@/components/UploadImages";
import CustomButton from "@/components/CustomButton";
import {useCallback, useState} from "react";
import {uploadVehicle} from "@/services/imageService";
import {useRouter} from "next/navigation";

const schema = z.object({
    vehiclePlateNumber: z.string().min(1, {message: "Vehicle plate number is required"}),
    vehicleColor: z.string().min(1, {message: "Vehicle color is required"}),
})

type FormInput = z.infer<typeof schema>;

const VerifyVehicle = () => {
    const router= useRouter()

    const {
        register,
        handleSubmit,
        reset,
        formState: {errors, isSubmitting}
    } = useForm<FormInput>({
        resolver: zodResolver(schema),
        defaultValues: {
            vehiclePlateNumber: "",
            vehicleColor: "",
        },
    })

    const [error, setError] = useState("")
    const [vehicleImage, setVehicleImage] = useState("")
    const [vehicleRCImage, setVehicleRCImage] = useState("")

    const setVehicleImageCallback = useCallback((value: string) => {
        setError("")
        setVehicleImage(value)
    }, []);
    const setVehicleRCImageCallback = useCallback((value: string) => {
        setError("")
        setVehicleRCImage(value)
    }, []);

    const onSubmit: SubmitHandler<FormInput> = async (data) => {
        try {
            if(vehicleImage && vehicleRCImage){
                const driverId= JSON.parse(localStorage.getItem("driverId") || "{}")
                const vehicleData= {
                    driverId,
                    ...data,
                    vehicleImage,
                    vehicleRCImage,
                    status: "pending"
                }
                await uploadVehicle(vehicleData)
                localStorage.removeItem("driverId")
                router.push("/");
            }else{
                setError("Please upload vehicle images & RC image")
            }
            reset()
        }catch (e) {
            console.log(e)
        }

    }

    return (
        <>
            <h1 className="text-3xl font-bold mb-1">Set up your vehicle</h1>
            <p className="text-[#666]">Please upload information of your vehicle</p>

            <div className="mt-8">
                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-y-4 text-start">
                    <div className="flex flex-col">
                        <label htmlFor="vehiclePlateNumber" className="font-semibold">Vehicle Plate Number</label>
                        <TextField
                            {...register("vehiclePlateNumber")}
                            id="vehiclePlateNumber"
                            label="Vehicle Plate Number"
                            variant="outlined"
                            error={!!errors.vehiclePlateNumber}
                            helperText={errors.vehiclePlateNumber?.message}
                        />
                    </div>
                    <div className="flex flex-col">
                        <label htmlFor="vehicleColor" className="font-semibold">Vehicle Color</label>
                        <TextField
                            {...register("vehicleColor")}
                            id="vehicleColor"
                            label="Vehicle Color"
                            variant="outlined"
                            error={!!errors.vehicleColor}
                            helperText={errors.vehicleColor?.message}
                        />
                    </div>
                    {error && <p className="text-red-500">{error}</p>}
                    <div className="flex flex-col">
                        <label htmlFor="vehicleImages" className="font-semibold">Vehicle's Images</label>
                        <UploadImages setVehicleImageCallback={setVehicleImageCallback}/>
                    </div>
                    <div className="flex flex-col">
                        <label htmlFor="vehicleRCImages" className="font-semibold">Vehicle's RC Images</label>
                        <UploadImages setVehicleRCImageCallback={setVehicleRCImageCallback}/>
                    </div>
                    <div className={"grid grid-cols-1 mt-8"}>
                        <CustomButton type="submit" label="Save & Continue" variant="dark" size="large"/>
                    </div>
                </form>
            </div>
        </>
    )
}

export default VerifyVehicle