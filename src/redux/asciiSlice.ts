import { createSlice } from "@reduxjs/toolkit";

export const asciiSlice = createSlice({
  name: "asciis",
  initialState: { value: [] },
  reducers: {
    addAscii(state: any, action) {
      state.value = [...state.value, ...action.payload];
    },
  },
});

export const { addAscii } = asciiSlice.actions;
export default asciiSlice.reducer;
