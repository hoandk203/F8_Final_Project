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
  Button,
  TextField,
  CircularProgress,
  Alert,
  Snackbar,
  IconButton
} from "@mui/material";
import { Edit as EditIcon, Save as SaveIcon, Cancel as CancelIcon, PhotoCamera as PhotoCameraIcon } from "@mui/icons-material";
import { uploadStoreLogo } from "@/services/storeService";
import { clearAuthTokens, getAuthTokens, setAuthTokens, updateUserProfile } from "@/services/authService";
import ChangePasswordForm from "@/components/ChangePasswordForm";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { updateUserProfile as updateUserProfileSlice } from "@/redux/slice/authSlice";
import { refreshToken } from "@/services/authService";
import { fetchUserProfile } from "@/redux/middlewares/authMiddleware";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import LoadingOverlay from "@/components/LoadingOverlay";

interface User {
  email: string;
  phone: string;
  name: string;
  location: string;
  city: string;
  vendor_name: string;
  created_at: string;
}

// Định nghĩa schema validation
const profileSchema = z.object({
  name: z.string().min(1, { message: "Store name is required" }),
});

type ProfileFormInput = z.infer<typeof profileSchema>;

const VendorProfilePage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const router= useRouter()
  const {user, status} = useSelector((state: RootState) => state.auth as { user: User | null, status: string, error: string | null })
  const [error, setError] = useState("");
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);

  // React Hook Form với Zod resolver
  const { control, handleSubmit, reset, formState: { errors } } = useForm<ProfileFormInput>({
    resolver: zodResolver(profileSchema),
    defaultValues: user || {
      name: ""
    }
  });

  useEffect(() => {
    const checkAuth = async () => {
      const tokens = getAuthTokens();
      if (!tokens?.access_token) {
        router.push("/vendor-login");
        return;
      }
      
      if (!user) {
        try {
          // Dispatch action để lấy thông tin profile và lưu vào Redux store
          await dispatch(fetchUserProfile(tokens.access_token)).unwrap();
        } catch (err: any) {
          if (err?.message === "Access token expired") {
            try {
              const oldRefreshToken = tokens.refresh_token;
              const newTokens = await refreshToken(oldRefreshToken || "");
              setAuthTokens({
                access_token: newTokens.access_token,
                refresh_token: newTokens.refresh_token,
                role: tokens.role
              });

              // Thử lại với token mới
              await dispatch(fetchUserProfile(newTokens.access_token)).unwrap();
            } catch (refreshError) {
              clearAuthTokens();
              router.push("/vendor-login");
            }
          } else {
            clearAuthTokens();
            router.push("/vendor-login");
          }
        }
      }
    };
    
    checkAuth();
  }, [dispatch, router, user]);

  // Cập nhật form khi user thay đổi
  useEffect(() => {
    if (user) {
      reset({
        name: user.name || "",
      });
    }
  }, [user, reset]);

  const handleEdit = () => {
    setEditing(true);
  };

  const handleCancel = () => {
    if (user) {
      reset({
        name: user.name || "",
      });
    }
    setEditing(false);
  };

  const onSubmit = async (data: ProfileFormInput) => {
    try {
      setSaving(true);
      await updateUserProfile(data);
      dispatch(updateUserProfileSlice({ ...user, ...data }));
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
      <LoadingOverlay/>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 4, fontWeight: "bold" }}>
        Vendor Profile
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent sx={{ display: "flex", flexDirection: "column", alignItems: "center", p: 4 }}>
              <Box sx={{ position: "relative" }}>
                <Avatar
                  src={"../../user-avatar.jpg"}
                  sx={{ width: 120, height: 120, mb: 2}}
                />
                <input
                  accept="image/*"
                  style={{ display: "none"}}
                  id="icon-button-file"
                  type="file"
                  onChange={handleLogoUpload}
                />
                <label htmlFor="icon-button-file">
                  <IconButton
                    color="primary"
                    aria-label="upload picture"
                    component="span"
                    sx={{
                      position: "absolute",
                      bottom: 10,
                      right: 0,
                      color: "black",
                      backgroundColor: "white",
                      "&:hover": { backgroundColor: "#f5f5f5" },
                    }}
                  >
                    {uploadingLogo ? (
                      <CircularProgress size={24} />
                    ) : (
                      <PhotoCameraIcon />
                    )}
                  </IconButton>
                </label>
              </Box>

              <Typography variant="h6" sx={{ mt: 2, fontWeight: "bold" }}>
                {user?.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {user?.email}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Joined on {new Date(user?.created_at).toLocaleDateString()}
              </Typography>

              <ChangePasswordForm />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                  Vendor Information
                </Typography>
                {!editing ? (
                  <Button
                    className="border-[#303030] text-black"
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
                      className="bg-[#303030] text-white"
                      onClick={handleSubmit(onSubmit)}
                      disabled={saving}
                      sx={{ mr: 1 }}
                    >
                      {saving ? "Saving..." : "Save"}
                    </Button>
                    <Button
                      startIcon={<CancelIcon />}
                      variant="outlined"
                      className="border-[#303030] text-black"
                      onClick={handleCancel}
                      disabled={saving}
                    >
                      Cancel
                    </Button>
                  </Box>
                )}
              </Box>

              <form>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Vendor Name
                    </Typography>
                    {editing ? (
                      <Controller
                        name="name"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            fullWidth
                            margin="dense"
                            size="small"
                            error={!!errors.name}
                            helperText={errors.name?.message}
                          />
                        )}
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
                      <Typography variant="body1" sx={{ mb: 2 }}>
                        {user?.email}
                      </Typography>
                  </Grid>
                  
                </Grid>
              </form>
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

export default VendorProfilePage; 