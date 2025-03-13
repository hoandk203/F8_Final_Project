"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  Box, 
  Card, 
  CardContent, 
  Grid, 
  Typography, 
  Avatar, 
  Divider, 
  Button,
  TextField,
  CircularProgress,
  Alert,
  Snackbar,
  IconButton
} from "@mui/material";
import { Edit as EditIcon, Save as SaveIcon, Cancel as CancelIcon, PhotoCamera as PhotoCameraIcon } from "@mui/icons-material";
import { uploadStoreLogo } from "@/services/storeService";
import { updateUserProfile } from "@/services/authService";
import ChangePasswordForm from "./components/ChangePasswordForm";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { updateUserProfile as updateUserProfileSlice } from "@/redux/slice/authSlice";
import { refreshToken } from "@/services/authService";
import { fetchUserProfile } from "@/redux/middlewares/authMiddleware";

interface User {
  email: string;
  phone: string;
  name: string;
  location: string;
  city: string;
  vendor_name: string;
  created_at: string;
}

interface StoreProfile {
  id: number;
  name: string;
  email: string;
  phone: string;
  location: string;
  city: string;
  vendorName: string;
  createdAt: string;
  logo?: string;
}

const StoreProfilePage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const router= useRouter()
  const {user, status} = useSelector((state: RootState) => state.auth as { user: User | null, status: string, error: string | null })
  const [error, setError] = useState("");
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<User>>(user || {});
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const accessToken = localStorage.getItem("access_token");
      if (!accessToken) {
        router.push("/store-login");
        return;
      }
      
      if (!user) {
        try {
          // Dispatch action để lấy thông tin profile và lưu vào Redux store
          await dispatch(fetchUserProfile(accessToken)).unwrap();
        } catch (err: any) {
          if (err?.message === "Access token expired") {
            try {
              const oldRefreshToken = localStorage.getItem("refresh_token");
              const newTokens = await refreshToken(oldRefreshToken || "");
              localStorage.setItem("access_token", newTokens.access_token);
              localStorage.setItem("refresh_token", newTokens.refresh_token);

              // Thử lại với token mới
              await dispatch(fetchUserProfile(newTokens.access_token)).unwrap();
            } catch (refreshError) {
              localStorage.removeItem("access_token");
              localStorage.removeItem("refresh_token");
              router.push("/store-login");
            }
          } else {
            localStorage.removeItem("access_token");
            localStorage.removeItem("refresh_token");
            router.push("/store-login");
          }
        }
      }
    };
    
    checkAuth();
  }, [dispatch, router, user]);

  // Cập nhật formData khi user thay đổi
  useEffect(() => {
    if (user) {
      setFormData(user);
    }
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEdit = () => {
    setEditing(true);
  };

  const handleCancel = () => {
    setFormData(user || {});
    setEditing(false);
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      await updateUserProfile(formData);
      dispatch(updateUserProfileSlice({ ...user, ...formData }));
      setEditing(false);
      setSuccessMessage("Profile updated successfully");
      setOpenSnackbar(true);
    } catch (err: any) {
      console.error("Failed to update profile:", err);
      setError(err.message || "Failed to update profile");
      setOpenSnackbar(true);
    } finally {
      setSaving(false);
    }
  };

  const handleLogoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || event.target.files.length === 0) {
      return;
    }
    
    const file = event.target.files[0];
    
    try {
      setUploadingLogo(true);
      const result = await uploadStoreLogo(file);
      const updatedProfile = { ...user, logo: result.logoUrl };
      dispatch(updateUserProfileSlice(updatedProfile));
      setSuccessMessage("Logo uploaded successfully");
      setOpenSnackbar(true);
    } catch (err: any) {
      console.error("Failed to upload logo:", err);
      setError(err.message || "Failed to upload logo");
      setOpenSnackbar(true);
    } finally {
      setUploadingLogo(false);
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
    setError("");
    setSuccessMessage("");
  };

  if (status === 'loading') {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!user) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">Profile data not found. Please go back to dashboard.</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 4, fontWeight: "bold" }}>
        Store Profile
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent sx={{ display: "flex", flexDirection: "column", alignItems: "center", p: 4 }}>
              <Box sx={{ position: "relative" }}>
                <Avatar
                  src={"../../user-avatar.jpg"}
                  sx={{ width: 120, height: 120, mb: 2 }}
                />
                <input
                  accept="image/*"
                  style={{ display: "none" }}
                  id="logo-upload"
                  type="file"
                  onChange={handleLogoUpload}
                  disabled={uploadingLogo}
                />
                <label htmlFor="logo-upload">
                  <IconButton
                    component="span"
                    sx={{
                      position: "absolute",
                      bottom: 10,
                      right: 0,
                      backgroundColor: "rgba(255, 255, 255, 0.8)",
                      "&:hover": { backgroundColor: "rgba(255, 255, 255, 0.9)" },
                    }}
                    disabled={uploadingLogo}
                  >
                    {uploadingLogo ? <CircularProgress size={24} /> : <PhotoCameraIcon />}
                  </IconButton>
                </label>
              </Box>
              <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                {user?.name}
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                {user?.vendor_name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Member since {new Date(user?.created_at || "").toLocaleDateString()}
              </Typography>
            </CardContent>
          </Card>
          
          <ChangePasswordForm />
        </Grid>

        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                  Store Information
                </Typography>
                {!editing ? (
                  <Button
                    startIcon={<EditIcon />}
                    variant="outlined"
                    onClick={handleEdit}
                  >
                    Edit
                  </Button>
                ) : (
                  <Box>
                    <Button
                      startIcon={<SaveIcon />}
                      variant="contained"
                      color="primary"
                      onClick={handleSave}
                      disabled={saving}
                      sx={{ mr: 1 }}
                    >
                      {saving ? "Saving..." : "Save"}
                    </Button>
                    <Button
                      startIcon={<CancelIcon />}
                      variant="outlined"
                      onClick={handleCancel}
                      disabled={saving}
                    >
                      Cancel
                    </Button>
                  </Box>
                )}
              </Box>

              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Store Name
                  </Typography>
                  {editing ? (
                    <TextField
                      fullWidth
                      name="name"
                      value={formData.name || ""}
                      onChange={handleInputChange}
                      margin="dense"
                      size="small"
                    />
                  ) : (
                    <Typography variant="body1" sx={{ mb: 2 }}>
                      {user?.name}
                    </Typography>
                  )}
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Email
                  </Typography>
                  {editing ? (
                    <TextField
                      fullWidth
                      name="email"
                      value={formData.email || ""}
                      onChange={handleInputChange}
                      margin="dense"
                      size="small"
                    />
                  ) : (
                    <Typography variant="body1" sx={{ mb: 2 }}>
                      {user?.email}
                    </Typography>
                  )}
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Phone Number
                  </Typography>
                  {editing ? (
                    <TextField
                      fullWidth
                      name="phone"
                      value={formData.phone || ""}
                      onChange={handleInputChange}
                      margin="dense"
                      size="small"
                    />
                  ) : (
                    <Typography variant="body1" sx={{ mb: 2 }}>
                      {user?.phone}
                    </Typography>
                  )}
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    City
                  </Typography>
                  {editing ? (
                    <TextField
                      fullWidth
                      name="city"
                      value={formData.city || ""}
                      onChange={handleInputChange}
                      margin="dense"
                      size="small"
                    />
                  ) : (
                    <Typography variant="body1" sx={{ mb: 2 }}>
                      {user?.city}
                    </Typography>
                  )}
                </Grid>

                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Address
                  </Typography>
                  {editing ? (
                    <TextField
                      fullWidth
                      name="location"
                      value={formData.location || ""}
                      onChange={handleInputChange}
                      margin="dense"
                      size="small"
                    />
                  ) : (
                    <Typography variant="body1" sx={{ mb: 2 }}>
                      {user?.location}
                    </Typography>
                  )}
                </Grid>

                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Vendor
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    {user?.vendor_name}
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={error ? "error" : "success"} 
          sx={{ width: '100%' }}
        >
          {error || successMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default StoreProfilePage; 