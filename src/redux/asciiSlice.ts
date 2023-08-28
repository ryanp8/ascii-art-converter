import { createSlice } from "@reduxjs/toolkit";

export const asciiSlice = createSlice({
  name: "asciis",
  initialState: { value: [] },
  reducers: {
    addAscii(state: any, action) {
      state.value = [...state.value, ...action.payload];
    },
    deleteAscii(state: any, action) {
      const id = action.payload;
      state.value = state.value.filter((a: any) => a.id !== id);
    }
  },
});

export const { addAscii, deleteAscii } = asciiSlice.actions;
export default asciiSlice.reducer;
