import { configureStore } from "@reduxjs/toolkit";
import asciiReducer from "./asciiSlice";

export const store = configureStore({
    reducer: {
        ascii: asciiReducer
    }
});

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch


