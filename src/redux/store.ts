import { configureStore } from "@reduxjs/toolkit";
import asciiReducer from "./asciiSlice";
import uiReducer from "./uiSlice";

export const store = configureStore({
    reducer: {
        ascii: asciiReducer,
        ui: uiReducer
    }
});

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch


