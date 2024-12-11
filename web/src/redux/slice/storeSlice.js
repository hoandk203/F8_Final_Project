import { createSlice } from "@reduxjs/toolkit";
import {fetchStoreList} from "../middlewares/storeMiddleware";

const initialState= {
    storeList: [],
    status: 'idle'
}

export const storeSlice= createSlice({
    name: "store",
    initialState,
    reducers: {
        // createStore: (state, action) => {
        //     state.storeList= [action.payload, ...state.storeList]
        // },
        // updateStore: (state, action) => {
        //     state.storeList= state.storeList.map(store => {
        //         if(store.id === action.payload[0]){
        //             return action.payload[1]
        //         }
        //         return store
        //     })
        // },
        softDeleteStore: (state, action) => {
            state.storeList= state.storeList.filter(store => store.id !== action.payload)
        },
        searchStoreByName: (state, action) => {
            state.storeList= action.payload
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchStoreList.pending, (state, action) => {
                state.status = 'pending'
            })
            .addCase(fetchStoreList.fulfilled, (state, action) => {
                state.status = 'success'
                state.storeList= action.payload
            })
    }
})

export const {createStore, updateStore, softDeleteStore, searchStoreByName} = storeSlice.actions