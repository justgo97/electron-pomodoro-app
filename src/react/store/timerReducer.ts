import { PomodoroMode, PomodoroStatus } from "@/util/consts";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ITimer {
  currentMode: PomodoroMode;
  currentStatus: PomodoroStatus;

  secondsLeft: number;
  sessionsLeft: number;
}

const initialState: ITimer = {
  currentMode: PomodoroMode.session,
  currentStatus: PomodoroStatus.idle,

  secondsLeft: 0,
  sessionsLeft: 0,
};

export const timerSlice = createSlice({
  name: "timer",
  initialState,
  reducers: {
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
    setPomodoroMode: (state, action: PayloadAction<PomodoroMode>) => {
      state.currentMode = action.payload;
    },
    setStatus: (state, action: PayloadAction<PomodoroStatus>) => {
      state.currentStatus = action.payload;
    },
  },
});

export const timerActions = timerSlice.actions;

export default timerSlice.reducer;
