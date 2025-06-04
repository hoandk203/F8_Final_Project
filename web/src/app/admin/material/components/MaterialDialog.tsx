"use client";

import { useEffect } from "react";
import axios from "axios";
import { useForm, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";

import AdminDialog from "@/app/admin/components/AdminDialog";
import TextField from "@mui/material/TextField";
import CustomButton from "@/components/CustomButton";

import { fetchMaterialList } from "@/redux/middlewares/materialMiddleware";
import { createMaterial, updateMaterial } from "@/services/materialService";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
const schema = z.object({
  name: z
    .string()
    .min(1, { message: "Name is required" })
    .min(2, { message: "Name must be at least 2 characters" }),
  unitPrice: z
    .string()
    .min(1, { message: "Unit price is required" })
    .refine((val) => !isNaN(Number(val)), {
      message: "Unit price must be a number",
    })
    .refine((val) => Number(val) > 0, {
      message: "Unit price must be greater than 0",
    }),
});

type FormInput = z.infer<typeof schema>;

interface Props {
  open: boolean;
  handleClose: () => void;
  currentData?: Partial<FormInput & { unit_price?: number | string }>;
  currentId?: any;
}

const MaterialDialog = ({ open, handleClose, currentData, currentId }: Props) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormInput>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      unitPrice: "",
    },
  });

  const dispatch = useDispatch<AppDispatch>();

  // Cập nhật giá trị form khi currentData thay đổi
  useEffect(() => {
    if (!open) {
      reset();
    }
    if (currentData) {
      reset({
        name: currentData.name || "",
        unitPrice: currentData.unit_price ? String(currentData.unit_price) : "",
      });
    }
  }, [currentData, reset, open]);

  const onSubmit: SubmitHandler<FormInput> = async (data) => {

    try {
      const formattedData = {
        ...data,
        unitPrice: Number(data.unitPrice),
      };

      if (currentData && currentId) {
        // Update existing material
        const response = await updateMaterial(currentId, formattedData);
        if (response) {
          dispatch(fetchMaterialList());
          handleClose();
          reset();
          toast.success("Material updated successfully");
        }
      } else {
        try {
            // Create new material
          const response = await createMaterial(formattedData);
          
          if (response) {
            dispatch(fetchMaterialList());
            handleClose();
            reset();
            toast.success("Material created successfully");
          }
        } catch (error) {
          toast.error("Material create failed");
          console.log(error);
          return error;
        }
        
      }
    } catch (error: any) {
      console.error("API Error:", error);
      toast.error(error.response?.data?.message || "Operation failed");
    }
  };

  return (
    <AdminDialog
      title={currentId ? "Update material" : "Create material"}
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
        <div className="flex flex-col gap-y-1">
          <label htmlFor="unitPrice" className="font-semibold">
            Unit Price
          </label>
          <TextField
            {...register("unitPrice")}
            type="text"
            id="unitPrice"
            label="Unit Price"
            variant="outlined"
            error={!!errors.unitPrice}
            helperText={errors.unitPrice?.message}
          />
        </div>
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

export default MaterialDialog; 