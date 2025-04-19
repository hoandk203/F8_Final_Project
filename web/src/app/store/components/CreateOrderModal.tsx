"use client";

import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Typography,
  Box,
  CircularProgress,
  Alert,
} from "@mui/material";
import { createOrder } from "@/services/orderService";
import { getMaterials } from "@/services/materialService";
import { refreshToken } from "@/services/authService";
import router from "next/router";

interface Material {
  id: number;
  name: string;
  unit_price: string;
}

interface User {
  id: number;
  // thêm các trường khác nếu cần
}

interface CreateOrderModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const CreateOrderModal = ({ open, onClose, onSuccess }: CreateOrderModalProps) => {
  const { user } = useSelector((state: RootState) => state.auth as { user: User | null });
  const [materials, setMaterials] = useState<Material[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [materialId, setMaterialId] = useState<number | "">("");
  const [weight, setWeight] = useState<number | "">("");
  const [scrapImage, setScrapImage] = useState<string | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [selectedMaterial, setSelectedMaterial] = useState<Material | null>(null);
  const [estimatedAmount, setEstimatedAmount] = useState<number>(0);


  useEffect(() => {
    const fetchMaterials = async () => {
      try {
        const response = await getMaterials();
        setMaterials(response);
      } catch (err: any) {
        if (err?.response?.data?.message === "Access token expired") {
          try {
            const oldRefreshToken = localStorage.getItem("refresh_token");
            const newTokens = await refreshToken(oldRefreshToken || "");
            localStorage.setItem("access_token", newTokens.access_token);
            localStorage.setItem("refresh_token", newTokens.refresh_token);
            
            const response = await getMaterials();
            setMaterials(response);
          } catch (refreshError) {
            localStorage.removeItem("access_token");
            localStorage.removeItem("refresh_token");
            router.push("/store-login");
          }
        }
      }
    };

    if (open) {
      fetchMaterials();
    }
  }, [open]);

  useEffect(() => {
    if (materialId && weight) {
      const material = materials.find((m) => m.id === materialId);
      if (material) {
        console.log(material)
        setSelectedMaterial(material);
        setEstimatedAmount(Number(weight) * parseFloat(material.unit_price));
      }
    } else {
      setEstimatedAmount(0);
    }
  }, [materialId, weight, materials]);

  const handleMaterialChange = (event: any) => {
    setMaterialId(event.target.value);
  };

  const handleWeightChange = (event: any) => {
    setWeight(event.target.value);
  };

  const handleImageChange = (event: any) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setScrapImage(base64String);
        setPreviewImage(base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    if (!materialId || !weight || !scrapImage) {
      setError("Please fill all required fields");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const orderData = {
        orderDetails: [
          {
            materialId,
            weight: Number(weight),
            amount: estimatedAmount,
          },
        ],
        scrapImage,
        storeId: user?.id,
        status: "pending",
      };

      const response = await createOrder(orderData);
      setSuccess("Order created successfully");
      
      // Reset form
      setMaterialId("");
      setWeight("");
      setScrapImage(null);
      setPreviewImage(null);
      setSelectedMaterial(null);
      setEstimatedAmount(0);
      
      // Notify parent component
      setTimeout(() => {
        onSuccess();
      }, 1500);
    } catch (err: any) {
      setError(err.message || "Failed to create order");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="md" 
      fullWidth
      PaperProps={{
        sx: {
          margin: 'auto',
          width: { xs: '95%', sm: '80%', md: '70%' },
          maxWidth: '800px'
        }
      }}
    >
      <DialogTitle>Create New Order</DialogTitle>
      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {success}
          </Alert>
        )}

        <Grid container spacing={3} sx={{ mt: 1 }}>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth required>
              <InputLabel>Material</InputLabel>
              <Select
                value={materialId}
                onChange={handleMaterialChange}
                label="Material"
                disabled={loading}
              >
                {materials.map((material) => (
                  <MenuItem key={material.id} value={material.id}>
                    {material.name} - ${material.unit_price ? parseFloat(material.unit_price).toLocaleString() : 0}/kg
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              label="Weight (kg)"
              type="number"
              fullWidth
              required
              value={weight}
              onChange={handleWeightChange}
              disabled={loading}
              InputProps={{ inputProps: { min: 0 } }}
            />
          </Grid>

          <Grid item xs={12}>
            <Typography variant="subtitle1" gutterBottom>
              Upload Scrap Image
            </Typography>
            <input
              accept="image/*"
              type="file"
              onChange={handleImageChange}
              disabled={loading}
              style={{ display: "none" }}
              id="scrap-image-upload"
            />
            <label htmlFor="scrap-image-upload">
              <Button
                variant="outlined"
                component="span"
                disabled={loading}
                fullWidth
              >
                Choose Image
              </Button>
            </label>
          </Grid>

          {previewImage && (
            <Grid item xs={12}>
              <Box
                sx={{
                  mt: 2,
                  display: "flex",
                  justifyContent: "center",
                  border: "1px solid #ddd",
                  borderRadius: 1,
                  p: 1,
                }}
              >
                <img
                  src={previewImage}
                  alt="Scrap Preview"
                  style={{ maxWidth: "100%", maxHeight: "200px" }}
                />
              </Box>
            </Grid>
          )}

          <Grid item xs={12}>
            <Box
              sx={{
                mt: 2,
                p: 2,
                border: "1px solid #ddd",
                borderRadius: 1,
                bgcolor: "#f5f5f5",
              }}
            >
              <Typography className="font-bold" variant="subtitle1">Order Summary</Typography>
              {selectedMaterial && (
                <>
                  <Typography variant="body2">
                    Material: {selectedMaterial.name}
                  </Typography>
                  <Typography variant="body2">
                    Unit Price: ${selectedMaterial.unit_price ? parseFloat(selectedMaterial.unit_price).toLocaleString() : 0}/kg
                  </Typography>
                  <Typography variant="body2">
                    Weight: {weight} kg
                  </Typography>
                  <Typography variant="h6" sx={{ mt: 1 }}>
                    Estimated Amount: ${estimatedAmount ? estimatedAmount.toLocaleString() : 0}
                  </Typography>
                </>
              )}
            </Box>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          color="primary"
          variant="contained"
          disabled={loading}
          startIcon={loading ? <CircularProgress size={20} /> : null}
        >
          {loading ? "Creating..." : "Create Order"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateOrderModal; 