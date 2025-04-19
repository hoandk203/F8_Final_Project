import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { fetchMaterialList } from "@/redux/middlewares/materialMiddleware";

interface Material {
  id: number;
  name: string;
  unitPrice: number;
  createdAt: string;
  modifiedAt: string;
  active: boolean;
}

interface MaterialState {
  materialList: Material[];
  status: "idle" | "pending" | "succeeded" | "failed";
  error: string | null;
}

const initialState: MaterialState = {
  materialList: [],
  status: "idle",
  error: null,
};

const materialSlice = createSlice({
  name: "material",
  initialState,
  reducers: {
    searchMaterialByName: (state, action: PayloadAction<Material[]>) => {
      state.materialList = action.payload;
    },
    softDeleteMaterial: (state, action: PayloadAction<number>) => {
      state.materialList = state.materialList.filter(
        (material) => material.id !== action.payload
      );
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMaterialList.pending, (state) => {
        state.status = "pending";
      })
      .addCase(fetchMaterialList.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.materialList = action.payload;
      })
      .addCase(fetchMaterialList.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Failed to fetch materials";
      });
  },
});

export const { searchMaterialByName, softDeleteMaterial } = materialSlice.actions;
export default materialSlice.reducer; 