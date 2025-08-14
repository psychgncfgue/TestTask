import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { PaletteMode } from '@mui/material';

interface ThemeState {
  mode: PaletteMode;
}

const initialState: ThemeState = {
  mode: 'light',
};

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    setMode(state, action: PayloadAction<PaletteMode>) {
      state.mode = action.payload;
    },
  },
});

export const { setMode } = themeSlice.actions;
export default themeSlice.reducer;