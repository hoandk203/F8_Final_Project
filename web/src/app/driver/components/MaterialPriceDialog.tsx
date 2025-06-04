"use client";

import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Typography,
  List,
  ListItem,
  Divider,
  CircularProgress,
  TextField,
  InputAdornment,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from "@mui/icons-material/Search";
import { getMaterials } from "@/services/materialService";

interface Material {
  id: number;
  name: string;
  unit_price: number;
}

interface MaterialPriceDialogProps {
  open: boolean;
  onClose: () => void;
}

const MaterialPriceDialog = ({ open, onClose }: MaterialPriceDialogProps) => {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [filteredMaterials, setFilteredMaterials] = useState<Material[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");

  useEffect(() => {
    if (open) {
      fetchMaterials();
    }
  }, [open]);

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredMaterials(materials);
    } else {
      const filtered = materials.filter((material) =>
        material.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredMaterials(filtered);
    }
  }, [searchTerm, materials]);

  const fetchMaterials = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getMaterials();
      setMaterials(data);
      setFilteredMaterials(data);
    } catch (err) {
      console.error("Failed to fetch materials:", err);
      setError("Can't load material list. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // Hàm định dạng tiền tệ
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      PaperProps={{
        sx: {
          borderRadius: "12px",
          margin: { xs: 2, sm: "auto" },
        },
      }}
      sx={{
        '& .MuiDialog-paper': {
          width: '90%',
          maxWidth: '700px',
          margin: '0 auto',
        },
      }}
    >
      <DialogTitle sx={{ m: 0, p: 2, bgcolor: "#f5f5f5" }}>
        <Typography variant="h6" component="div" fontWeight="bold">
          Material Price List
        </Typography>
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers sx={{ p: 2 }}>
        <TextField
          fullWidth
          placeholder="Search materials..."
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={handleSearchChange}
          sx={{ mb: 2 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
        
        {loading ? (
          <div className="flex justify-center items-center py-8">
            <CircularProgress size={40} />
          </div>
        ) : error ? (
          <Typography color="error" className="p-4 text-center">
            {error}
          </Typography>
        ) : (
          <div className="bg-gray-100 rounded-lg">
            <div className="grid grid-cols-2 p-3 font-bold bg-gray-200 rounded-t-lg">
              <div>Material</div>
              <div className="text-right">Price</div>
            </div>
            
            {filteredMaterials.length > 0 ? (
              <div className="max-h-[400px] overflow-y-auto">
                {filteredMaterials.map((material, index) => (
                  <div 
                    key={material.id}
                    className={`grid grid-cols-2 p-3 ${
                      index % 2 === 0 ? "bg-white" : "bg-gray-50"
                    }`}
                  >
                    <div>{material.name}</div>
                    <div className="text-right font-semibold text-blue-600">
                      {formatCurrency(material.unit_price)}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 text-center text-gray-500">
                {searchTerm ? "No materials match your search" : "No materials available"}
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default MaterialPriceDialog; 