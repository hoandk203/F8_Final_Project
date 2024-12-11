import { createSlice } from "@reduxjs/toolkit";
import {fetchVendorList} from "../middlewares/vendorMiddleware";

const initialState= {
    vendorList: [],
    status: 'idle'
}

export const vendorSlice= createSlice({
    name: "vendor",
    initialState,
    reducers: {
        // createVendor: (state, action) => {
        //     state.vendorList= [action.payload, ...state.vendorList]
        // },
        // updateVendor: (state, action) => {
        //     state.vendorList= state.vendorList.map(vendor => {
        //         if(vendor.id === action.payload[0]){
        //             return action.payload[1]
        //         }
        //         return vendor
        //     })
        // },
        softDeleteVendor: (state, action) => {
            state.vendorList= state.vendorList.filter(vendor => vendor.id !== action.payload)
        },
        searchVendorByName: (state, action) => {
            state.vendorList= action.payload
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchVendorList.pending, (state, action) => {
                state.status = 'pending'
            })
            .addCase(fetchVendorList.fulfilled, (state, action) => {
                state.vendorList= action.payload
                state.status = 'success'
            })

    }
})

export const {createVendor, updateVendor, softDeleteVendor, searchVendorByName} = vendorSlice.actions