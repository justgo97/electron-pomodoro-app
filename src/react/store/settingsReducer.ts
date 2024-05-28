import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ISettings {
  sessionTime: number;
  breakTime: number;
  longBreakTime: number;
  sessionsCount: number;
  notifications: boolean;
}

const getNotificationSetting = () => {
  const localSetting = localStorage.getItem("notifications");

  if (localSetting) {
    return localStorage.getItem("notifications") === "on";
  }

  return true;
};

const initialState: ISettings = {
  sessionTime: 25 * 60,
  breakTime: 5 * 60,
  longBreakTime: 15 * 60,
  sessionsCount: 4,
  notifications: getNotificationSetting(),
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
    setNotifications: (state, action: PayloadAction<boolean>) => {
      state.notifications = action.payload;
    },
  },
});

export const settingsActions = settingsSlice.actions;

export default settingsSlice.reducer;
