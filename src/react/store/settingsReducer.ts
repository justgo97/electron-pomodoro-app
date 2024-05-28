import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ISettings {
  sessionTime: number;
  breakTime: number;
  longBreakTime: number;
  sessionsCount: number;
  notifications: boolean;
  popupBreak: boolean;
}

const getNotificationSetting = () => {
  const localSetting = localStorage.getItem("notifications");

  if (localSetting) {
    return localSetting === "on";
  }

  return true;
};

const getSessionTimeSetting = () => {
  const localSetting = localStorage.getItem("sessionTime");

  if (localSetting) {
    const sessionTime = Number(localSetting);

    if (!isNaN(sessionTime)) {
      return sessionTime;
    }
  }

  return 25;
};

const getBreakTimeSetting = () => {
  const localSetting = localStorage.getItem("breakTime");

  if (localSetting) {
    const breakTime = Number(localSetting);

    if (!isNaN(breakTime)) {
      return breakTime;
    }
  }

  return 5;
};

const getLongBreakTimeSetting = () => {
  const localSetting = localStorage.getItem("longBreakTime");

  if (localSetting) {
    const breakTime = Number(localSetting);

    if (!isNaN(breakTime)) {
      return breakTime;
    }
  }

  return 15;
};

const getSessionsCountSetting = () => {
  const localSetting = localStorage.getItem("sessionsCount");

  if (localSetting) {
    const sessionsCount = Number(localSetting);

    if (!isNaN(sessionsCount)) {
      return sessionsCount;
    }
  }

  return 4;
};

const getPopupBreakSetting = () => {
  const localSetting = localStorage.getItem("popupBreak");

  if (localSetting) {
    return localSetting === "on";
  }

  return true;
};

const initialState: ISettings = {
  sessionTime: getSessionTimeSetting() * 60,
  breakTime: getBreakTimeSetting() * 60,
  longBreakTime: getLongBreakTimeSetting() * 60,
  sessionsCount: getSessionsCountSetting(),
  notifications: getNotificationSetting(),
  popupBreak: getPopupBreakSetting(),
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
    setPopupBreak: (state, action: PayloadAction<boolean>) => {
      state.popupBreak = action.payload;
    },
  },
});

export const settingsActions = settingsSlice.actions;

export default settingsSlice.reducer;
