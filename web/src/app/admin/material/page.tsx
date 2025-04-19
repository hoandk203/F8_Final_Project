"use client";

import React, { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/redux/store";
import { debounce } from "lodash";
import { toast } from "react-toastify";

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  InputAdornment,
  TextField,
  Typography,
  CircularProgress,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

import CommonTable from "@/components/commonTable/CommonTable";
import { fetchMaterialList } from "@/redux/middlewares/materialMiddleware";
import CustomButton from "@/components/CustomButton";
import MaterialDialog from "@/app/admin/material/components/MaterialDialog";
import { searchMaterialByName, softDeleteMaterial } from "@/redux/slice/materialSlice";
import LoadingOverlay from "@/components/LoadingOverlay";
import { fetchUserProfile } from "@/redux/middlewares/authMiddleware";
import { refreshToken } from "@/services/authService";
import { useRouter } from "next/navigation";
import { deleteMaterial, searchMaterial } from "@/services/materialService";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// Hàm định dạng thời gian
const formatDate = (dateString: string) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString("vi-VN"); // Định dạng: DD/MM/YYYY
};

// Hàm định dạng số tiền
const formatPrice = (price: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(price);
};

const columns = [
  {
    name: "ID",
    key: "id",
  },
  {
    name: "Material",
    key: "name",
  },
  {
    name: "Unit Price",
    key: "unit_price",
    format: formatPrice,
  },
  {
    name: "Created time",
    key: "created_at",
    format: formatDate,
  },
  {
    name: "Action",
    key: "action",
  },
];

interface User {
  id: number;
  email: string;
  role: string;
}

const MaterialPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const materialList = useSelector((state: RootState) => state.material.materialList);
  const materialListStatus = useSelector((state: RootState) => state.material.status);
  const [open, setOpen] = React.useState(false);
  const [currentData, setCurrentData] = React.useState({
    id: null,
    name: "",
    unitPrice: "",
  });

  // Thêm state cho dialog xác nhận xóa
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [materialToDelete, setMaterialToDelete] = useState<number | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const { user } = useSelector(
    (state: RootState) =>
      state.auth as { user: User | null; status: string; error: string | null }
  );

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setCurrentData({
      id: null,
      name: "",
      unitPrice: "",
    });
    setOpen(false);
  };

  useEffect(() => {
    const checkAuth = async () => {
      const accessToken = localStorage.getItem("access_token");
      if (!accessToken) {
        router.push("/admin-login");
        return;
      }
      if (!user) {
        try {
          // Dispatch action to get profile info and save to Redux store
          await dispatch(fetchUserProfile(accessToken)).unwrap();
        } catch (err: any) {
          if (err?.message === "Access token expired") {
            try {
              const oldRefreshToken = localStorage.getItem("refresh_token");
              const newTokens = await refreshToken(oldRefreshToken || "");
              localStorage.setItem("access_token", newTokens.access_token);
              localStorage.setItem("refresh_token", newTokens.refresh_token);

              // Retry with new token
              await dispatch(fetchUserProfile(newTokens.access_token)).unwrap();
            } catch (refreshError) {
              localStorage.removeItem("access_token");
              localStorage.removeItem("refresh_token");
              router.push("/admin-login");
            }
          } else {
            localStorage.removeItem("access_token");
            localStorage.removeItem("refresh_token");
            router.push("/admin-login");
          }
        }
      }
    };
    checkAuth();
  }, [dispatch, router, user]);

  useEffect(() => {
    if (materialList.length === 0) {
      dispatch(fetchMaterialList());
    }
  }, [dispatch, materialList.length]);

  // Hàm mở dialog xác nhận xóa
  const handleDeleteClick = (id: number) => {
    setMaterialToDelete(id);
    setOpenDeleteDialog(true);
  };

  // Hàm xử lý khi người dùng xác nhận xóa
  const handleConfirmDelete = async () => {
    if (materialToDelete === null) return;

    setDeleteLoading(true);
    try {
      const response = await deleteMaterial(materialToDelete);
      if (response) {
        dispatch(softDeleteMaterial(materialToDelete));
        toast.success("Material deleted successfully");
        setOpenDeleteDialog(false);
      }
    } catch (e) {
      toast.error("Material delete failed");
      console.log(e);
    } finally {
      setDeleteLoading(false);
    }
  };

  // Hàm xử lý khi người dùng hủy xóa
  const handleCancelDelete = () => {
    setOpenDeleteDialog(false);
    setMaterialToDelete(null);
  };

  // Sửa lại hàm softDelete để sử dụng dialog xác nhận
  const softDelete = async (id: number) => {
    handleDeleteClick(id);
  };

  const fetchSearch = async (name: string) => {
    try {
      const response = await searchMaterial(name);
      if (response) {
        dispatch(searchMaterialByName(response));
      }
    } catch (e) {
      console.log(e);
      return e;
    }
  };

  const debounceSearch = useCallback(
    debounce((nextValue) => fetchSearch(nextValue), 1000),
    []
  );

  const handleSearch = (name: any) => {
    debounceSearch(name);
  };

  return (
    <div className={"container mx-auto"}>
      {materialListStatus === "pending" && <LoadingOverlay />}

      <h1 className="text-xl font-bold lg:hidden mb-5">Material management</h1>

      <div>
        <div className={"mb-5 flex justify-between"}>
          <div>
            <TextField
              id="input-with-icon-textfield"
              label="Search for material name"
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                },
              }}
              variant="outlined"
              onChange={(e) => {
                handleSearch(e.target.value);
              }}
            />
          </div>
          <div>
            <CustomButton
              label={"Add material"}
              variant={"dark"}
              handleOpenDialog={handleClickOpen}
            />
            <MaterialDialog
              open={open}
              handleClose={handleClose}
              currentData={currentData}
              currentId={currentData.id}
            />
          </div>
        </div>
        <div>
          <CommonTable
            columns={columns}
            rows={materialList}
            handleOpenDialog={handleClickOpen}
            setCurrentData={setCurrentData}
            softDelete={softDelete}
          />
        </div>
      </div>

      {/* Dialog xác nhận xóa */}
      <Dialog
        open={openDeleteDialog}
        onClose={handleCancelDelete}
        PaperProps={{
          sx: {
            margin: "auto",
            width: { xs: "95%", sm: "80%", md: "50%" },
            maxWidth: "500px",
          },
        }}
      >
        <DialogTitle>Confirm delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this material? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDelete} disabled={deleteLoading}>
            Cancel
          </Button>
          <Button
            onClick={handleConfirmDelete}
            color="error"
            disabled={deleteLoading}
            startIcon={deleteLoading ? <CircularProgress size={20} /> : null}
          >
            {deleteLoading ? "Deleting..." : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default MaterialPage;