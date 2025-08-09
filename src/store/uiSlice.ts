import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface UIState {
  loading: boolean;
  darkMode: boolean;
  params: Record<string, any>; // puedes tiparlo mejor si sabes el shape
}

const initialState: UIState = {
  loading: false,
  darkMode: false,
  params: {
    page: 1,
    limit: 10,
    search: "",
    offset: 0,
  },
};

export const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    showLoading: (state) => {
      state.loading = true;
    },
    hideLoading: (state) => {
      state.loading = false;
    },
    toggleDarkMode: (state) => {
      state.darkMode = !state.darkMode;
    },
    setParams: (state, action: PayloadAction<Record<string, any>>) => {
      state.params = action.payload;
    },
    clearParams: (state) => {
      state.params = {};
    },
  },
});

export const {
  showLoading,
  hideLoading,
  toggleDarkMode,
  setParams,
  clearParams,
} = uiSlice.actions;

export default uiSlice.reducer;
