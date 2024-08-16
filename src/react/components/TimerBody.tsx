import { useRef, useEffect } from "react";
import { useAppSelector, useAppDispatch } from "@/store";

import useAudio from "@/context/useAudio";
import { timerActions } from "@/store/timerReducer";

import { getTime } from "@/util/time";
import { PomodoroMode, PomodoroStatus } from "@/util/consts";

import TimerDisplay from "@/components/TimerDisplay";

const TimerBody = () => {
  const AudioManager = useAudio();
  const settings = useAppSelector((state) => state.settings);
  const timer = useAppSelector((state) => state.timer);
  const dispatch = useAppDispatch();

  const refSessionInterval = useRef<NodeJS.Timeout>(null);
  const refBreakInterval = useRef<NodeJS.Timeout>(null);

  const refCurrentMode = useRef<PomodoroMode>(PomodoroMode.session);

  const refStartTime = useRef(0);
  const refDuration = useRef(0);

  useEffect(() => {
    if (timer.currentStatus !== PomodoroStatus.idle) return;

    dispatch(timerActions.setTimer(settings.sessionTime));
    refDuration.current = settings.sessionTime;
  }, [settings.sessionTime, timer.currentStatus, dispatch]);

  useEffect(() => {
    if (timer.currentStatus !== PomodoroStatus.idle) return;

    dispatch(timerActions.setSessions(settings.sessionsCount));
  }, [settings.sessionsCount, timer.currentStatus, dispatch]);

  useEffect(() => {
    //
    if (timer.currentStatus !== PomodoroStatus.running) return;

    // We are only interested in the last second
    if (timer.secondsLeft > 0) return;

    //
    if (
      timer.currentMode === PomodoroMode.session &&
      refSessionInterval.current
    ) {
      clearInterval(refSessionInterval.current);
      refSessionInterval.current = null;
      //
      dispatch(timerActions.decrementSessions());
      AudioManager.playAudio("ring");

      if (timer.sessionsLeft === 1) {
        //
        dispatch(timerActions.setPomodoroMode(PomodoroMode.longBreak));
        refCurrentMode.current = PomodoroMode.longBreak;
        dispatch(timerActions.setTimer(settings.longBreakTime));
        refDuration.current = settings.longBreakTime;
      } else {
        dispatch(timerActions.setPomodoroMode(PomodoroMode.break));
        refCurrentMode.current = PomodoroMode.break;
        dispatch(timerActions.setTimer(settings.breakTime));
        refDuration.current = settings.breakTime;
      }

      if (Notification.permission === "granted" && settings.notifications) {
        new Notification("Take a break!");
      }
      startBreakInterval();
    } else if (refBreakInterval.current) {
      //
      clearInterval(refBreakInterval.current);
      refBreakInterval.current = null;

      AudioManager.playAudio("ring");

      if (
        timer.currentMode === PomodoroMode.longBreak ||
        timer.sessionsLeft === 0
      ) {
        dispatch(timerActions.setStatus(PomodoroStatus.idle));
        dispatch(timerActions.setPomodoroMode(PomodoroMode.session));
        document.body.style.backgroundColor = "var(--pomodoro)";
        refCurrentMode.current = PomodoroMode.session;
        window.document.title = "Pomodoro - Complete!";

        if (Notification.permission === "granted" && settings.notifications) {
          new Notification(
            "Your long break is complete, For another round start the timer again!"
          );
        }
      } else {
        // What to do after a short break

        dispatch(timerActions.setTimer(settings.sessionTime));
        refDuration.current = settings.sessionTime;

        if (Notification.permission === "granted" && settings.notifications) {
          new Notification("Get back to work!");
        }

        startSessionInterval();
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timer.secondsLeft]);

  const startSessionInterval = () => {
    dispatch(timerActions.setStatus(PomodoroStatus.running));
    dispatch(timerActions.setPomodoroMode(PomodoroMode.session));

    document.body.style.backgroundColor = "var(--pomodoro)";
    refCurrentMode.current = PomodoroMode.session;

    // There is an ongoing timer running
    if (refSessionInterval.current) {
      clearInterval(refSessionInterval.current);
    }

    window.document.title = "Pomodoro - Session [RUNNING]";

    refStartTime.current = Date.now();
    // Create an interval that tics every 1 second
    refSessionInterval.current = setInterval(() => {
      const currentTime = Date.now();
      const elapsedTime = currentTime - refStartTime.current;

      const newTime = Math.max(
        0,
        Math.floor(refDuration.current - elapsedTime / 1000)
      );

      window.document.title = `Pomodoro - Session [${getTime(
        newTime
      )}] [RUNNING]`;

      dispatch(timerActions.setTimer(newTime));
    }, 900);
  };

  const startBreakInterval = () => {
    dispatch(timerActions.setStatus(PomodoroStatus.running));

    if (refBreakInterval.current) {
      return;
    }

    if (refCurrentMode.current === PomodoroMode.longBreak) {
      document.body.style.backgroundColor = "var(--longBreak)";
      window.document.title = "Pomodoro - Long Break [RUNNING]";
    } else {
      document.body.style.backgroundColor = "var(--shortBreak)";
      window.document.title = "Pomodoro - Short Break [RUNNING]";
    }

    if (settings.popupBreak) {
      window.electronAPI.startBreak();
    }

    refStartTime.current = Date.now();
    refBreakInterval.current = setInterval(() => {
      const currentTime = Date.now();
      const elapsedTime = currentTime - refStartTime.current;

      const newTime = Math.max(
        0,
        Math.floor(refDuration.current - elapsedTime / 1000)
      );

      if (refCurrentMode.current === PomodoroMode.longBreak) {
        window.document.title = `Pomodoro - Long Break [${getTime(
          newTime
        )}] [RUNNING]`;
      } else {
        window.document.title = `Pomodoro - Short Break [${getTime(
          newTime
        )}] [RUNNING]`;
      }

      dispatch(timerActions.setTimer(newTime));
    }, 900);
  };

  const onClickToggle = () => {
    if (timer.currentStatus === PomodoroStatus.running) {
      pauseTimer();
    } else {
      resumeTimer();
    }
  };

  const pauseTimer = () => {
    if (refSessionInterval.current) {
      clearInterval(refSessionInterval.current);
      refSessionInterval.current = null;
    } else if (refBreakInterval.current) {
      clearInterval(refBreakInterval.current);
      refBreakInterval.current = null;
    }

    AudioManager.playAudio("pause");
    dispatch(timerActions.setStatus(PomodoroStatus.paused));
    refDuration.current = timer.secondsLeft;

    window.document.title = window.document.title.replace("RUNNING", "PAUSED");
  };

  const resumeTimer = () => {
    if (timer.currentStatus !== PomodoroStatus.paused) {
      dispatch(timerActions.setSessions(settings.sessionsCount));

      if (refCurrentMode.current === PomodoroMode.session) {
        dispatch(timerActions.setTimer(settings.sessionTime));
        refDuration.current = settings.sessionTime;
      } else if (refCurrentMode.current === PomodoroMode.break) {
        dispatch(timerActions.setTimer(settings.breakTime));
        refDuration.current = settings.breakTime;
      } else if (refCurrentMode.current === PomodoroMode.longBreak) {
        dispatch(timerActions.setTimer(settings.longBreakTime));
        refDuration.current = settings.longBreakTime;
      }
    }

    AudioManager.playAudio("click");

    if (
      timer.currentMode === PomodoroMode.break ||
      timer.currentMode === PomodoroMode.longBreak
    ) {
      startBreakInterval();
    } else {
      startSessionInterval();
    }
  };

  const onClickReset = () => {
    // Reset the timer
    dispatch(timerActions.setTimer(settings.sessionTime));
    dispatch(timerActions.setSessions(settings.sessionsCount));
    refDuration.current = settings.sessionTime;

    document.body.style.backgroundColor = "var(--pomodoro)";
    refCurrentMode.current = PomodoroMode.session;
    dispatch(timerActions.setPomodoroMode(PomodoroMode.session));

    // We clicked reset while paused so end the session
    if (timer.currentStatus === PomodoroStatus.paused) {
      window.document.title = "Pomodoro - Idle...";
      dispatch(timerActions.setStatus(PomodoroStatus.idle));
      AudioManager.playAudio("pause");
    } else {
      // Clear any possible break timer
      if (refBreakInterval.current) {
        clearInterval(refBreakInterval.current);
        refBreakInterval.current = null;
      }

      AudioManager.playAudio("click");

      // Just start a session
      if (timer.currentStatus === PomodoroStatus.running) {
        startSessionInterval();
      }
    }
  };

  const onClickPomodoro = () => {
    if (timer.currentMode === PomodoroMode.session) {
      return;
    }

    document.body.style.backgroundColor = "var(--pomodoro)";
    refCurrentMode.current = PomodoroMode.session;

    AudioManager.playAudio("click");

    dispatch(timerActions.setTimer(settings.sessionTime));
    refDuration.current = settings.sessionTime;

    if (refBreakInterval.current) {
      clearInterval(refBreakInterval.current);
      refBreakInterval.current = null;
    }

    if (timer.currentStatus === PomodoroStatus.running) {
      startSessionInterval();
    } else {
      dispatch(timerActions.setPomodoroMode(PomodoroMode.session));
    }
  };

  const onClickBreak = () => {
    //
    if (timer.currentMode === PomodoroMode.break) {
      return;
    }

    document.body.style.backgroundColor = "var(--shortBreak)";
    refCurrentMode.current = PomodoroMode.break;

    AudioManager.playAudio("click");

    if (refSessionInterval.current) {
      clearInterval(refSessionInterval.current);
      refSessionInterval.current = null;
    }

    if (refBreakInterval.current) {
      clearInterval(refBreakInterval.current);
      refBreakInterval.current = null;
    }

    dispatch(timerActions.setPomodoroMode(PomodoroMode.break));
    dispatch(timerActions.setTimer(settings.breakTime));
    refDuration.current = settings.breakTime;
    if (timer.currentStatus === PomodoroStatus.running) {
      startBreakInterval();
    }
  };

  const onClickLongBreak = () => {
    if (timer.currentMode === PomodoroMode.longBreak) {
      return;
    }

    document.body.style.backgroundColor = "var(--longBreak)";
    refCurrentMode.current = PomodoroMode.longBreak;

    AudioManager.playAudio("click");

    if (refSessionInterval.current) {
      clearInterval(refSessionInterval.current);
      refSessionInterval.current = null;
    }

    if (refBreakInterval.current) {
      clearInterval(refBreakInterval.current);
      refBreakInterval.current = null;
    }

    dispatch(timerActions.setPomodoroMode(PomodoroMode.longBreak));
    dispatch(timerActions.setTimer(settings.longBreakTime));
    refDuration.current = settings.longBreakTime;
    if (timer.currentStatus === PomodoroStatus.running) {
      startBreakInterval();
    }
  };

  return (
    <>
      <div className="timer-status">
        <button
          onClick={onClickPomodoro}
          className={`timer-status-button${
            timer.currentMode === PomodoroMode.session
              ? " timer-status-button-active"
              : ""
          }`}
        >
          Pomodoro
        </button>
        <button
          onClick={onClickBreak}
          className={`timer-status-button${
            timer.currentMode === PomodoroMode.break
              ? " timer-status-button-active"
              : ""
          }`}
        >
          Short break
        </button>
        <button
          onClick={onClickLongBreak}
          className={`timer-status-button${
            timer.currentMode === PomodoroMode.longBreak
              ? " timer-status-button-active"
              : ""
          }`}
        >
          Long break
        </button>
      </div>

      <TimerDisplay
        time={timer.secondsLeft}
        isRunning={timer.currentStatus === PomodoroStatus.running}
      />

      <div className="timer-message">
        {timer.currentStatus === PomodoroStatus.running
          ? timer.currentMode !== PomodoroMode.session
            ? "Time for a break! Rest your eyes. Stretch. Breathe. Relax 🏖️"
            : "Time for a session! Avoid distractions and work hard 🧑‍💻️"
          : "Idle... ⏸️"}
      </div>

      <h3 className="timer-sessions">Sessions Left: {timer.sessionsLeft}</h3>
      <div className="timer-buttons">
        <button onClick={onClickToggle}>
          {timer.currentStatus !== PomodoroStatus.idle
            ? timer.currentStatus === PomodoroStatus.running
              ? "Pause"
              : "Resume"
            : "Start"}
        </button>
        <button onClick={onClickReset}>Reset</button>
      </div>
    </>
  );
};

export default TimerBody;
