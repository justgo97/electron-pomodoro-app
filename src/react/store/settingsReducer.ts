import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ISettings } from "@/types";

const initialState: ISettings = {
  sessionTime: 25 * 60,
  breakTime: 5 * 60,
  longBreakTime: 15 * 60,
  sessionsCount: 4,
};

export const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {
    setSession: (state, action: PayloadAction<number>) => {
      state.sessionTime = action.payload;
    },
    setBreak: (state, action: PayloadAction<number>) => {
      state.breakTime = action.payload;
    },
    setLongBreak: (state, action: PayloadAction<number>) => {
      state.longBreakTime = action.payload;
    },
    setSessionsCount: (state, action: PayloadAction<number>) => {
      state.sessionsCount = action.payload;
    },
  },
});

export const settingsActions = settingsSlice.actions;

export default settingsSlice.reducer;
