import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ITimer {
  isStarted: boolean;
  isRunning: boolean;
  isInSession: boolean;
  isInBreak: boolean;
  isInLongBreak: boolean;

  secondsLeft: number;
  sessionsLeft: number;
}

const initialState: ITimer = {
  isStarted: false,
  isRunning: false,
  isInSession: false,
  isInBreak: false,
  isInLongBreak: false,

  secondsLeft: 0,
  sessionsLeft: 0,
};

export const timerSlice = createSlice({
  name: "timer",
  initialState,
  reducers: {
    setStarted: (state, action: PayloadAction<boolean>) => {
      state.isStarted = action.payload;
    },
    setRunning: (state, action: PayloadAction<boolean>) => {
      state.isRunning = action.payload;
    },
    setInSession: (state, action: PayloadAction<boolean>) => {
      state.isInSession = action.payload;
    },
    setInBreak: (state, action: PayloadAction<boolean>) => {
      state.isInBreak = action.payload;
    },
    setInLongBreak: (state, action: PayloadAction<boolean>) => {
      state.isInLongBreak = action.payload;
    },
    setTimer: (state, action: PayloadAction<number>) => {
      state.secondsLeft = action.payload;
    },
    setSessions: (state, action: PayloadAction<number>) => {
      state.sessionsLeft = action.payload;
    },
    decrementTimer: (state) => {
      state.secondsLeft -= 1;
    },
    decrementSessions: (state) => {
      state.sessionsLeft -= 1;
    },
  },
});

export const timerActions = timerSlice.actions;

export default timerSlice.reducer;
