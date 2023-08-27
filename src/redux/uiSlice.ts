import { createSlice } from "@reduxjs/toolkit";

export const uiSlice = createSlice({
  name: "ui",
  initialState: {
    showAuthModal: false
  },
  reducers: {
    setAuthOpen(state: any, action) {
      state.showAuthModal = action.payload
    }
  }
});

export const { setAuthOpen } = uiSlice.actions;
export default uiSlice.reducer;