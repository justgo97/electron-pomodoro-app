import { useRef, useEffect } from "react";
import { useAppSelector, useAppDispatch } from "@/store";

import useAudio from "@/context/useAudio";
import { timerActions } from "@/store/timerReducer";

const TimerBody = () => {
  const AudioManager = useAudio();
  const settings = useAppSelector((state) => state.settings);
  const timer = useAppSelector((state) => state.timer);
  const dispatch = useAppDispatch();

  const refSessionInterval = useRef<NodeJS.Timeout>(null);
  const refBreakInterval = useRef<NodeJS.Timeout>(null);
  const refCurrentMode = useRef<string>("pomodoro");

  useEffect(() => {
    if (timer.isStarted) return;

    dispatch(timerActions.setTimer(settings.seesionTime));
  }, [settings.seesionTime, timer.isStarted, dispatch]);

  useEffect(() => {
    if (timer.isStarted) return;

    dispatch(timerActions.setSessions(settings.sessionsCount));
  }, [settings.sessionsCount, timer.isStarted, dispatch]);

  const startSessionInterval = () => {
    dispatch(timerActions.setStarted(true));
    dispatch(timerActions.setRunning(true));
    dispatch(timerActions.setInSession(true));
    dispatch(timerActions.setInBreak(false));
    dispatch(timerActions.setInLongBreak(false));

    document.body.style.backgroundColor = "var(--pomodoro)";
    refCurrentMode.current = "pomodoro";

    // There is an ongoing timer running
    if (refSessionInterval.current) {
      return;
    }

    // Create an interval that tics every 1 second
    refSessionInterval.current = setInterval(() => {
      dispatch(timerActions.decrementTimer());
    }, 1000);
  };

  function startBreakInterval() {
    dispatch(timerActions.setStarted(true));
    dispatch(timerActions.setRunning(true));
    dispatch(timerActions.setInSession(false));

    if (refBreakInterval.current) {
      return;
    }

    if (refCurrentMode.current === "longBreak") {
      document.body.style.backgroundColor = "var(--longBreak)";
    } else {
      document.body.style.backgroundColor = "var(--shortBreak)";
    }

    refBreakInterval.current = setInterval(() => {
      dispatch(timerActions.decrementTimer());
    }, 1000);
  }

  const onClickToggle = () => {
    if (timer.isRunning) {
      if (refSessionInterval.current) {
        clearInterval(refSessionInterval.current);
        refSessionInterval.current = null;
      }

      if (refBreakInterval.current) {
        clearInterval(refBreakInterval.current);
        refBreakInterval.current = null;
      }

      AudioManager.playAudio("pause");
      dispatch(timerActions.setRunning(false));
    } else {
      if (!timer.isStarted) {
        dispatch(timerActions.setSessions(settings.sessionsCount));

        if (refCurrentMode.current === "pomodoro") {
          dispatch(timerActions.setTimer(settings.seesionTime));
        } else if (refCurrentMode.current === "shortBreak") {
          dispatch(timerActions.setTimer(settings.breakTime));
        } else {
          dispatch(timerActions.setTimer(settings.longBreakTime));
        }
      }

      AudioManager.playAudio("click");

      if (timer.isInBreak || timer.isInLongBreak) {
        startBreakInterval();
      } else {
        startSessionInterval();
      }
    }
  };

  const onClickReset = () => {
    // Reset the timer
    dispatch(timerActions.setTimer(settings.seesionTime));
    dispatch(timerActions.setSessions(settings.sessionsCount));

    if (refCurrentMode.current !== "pomodoro") {
      // we are in a break and running
      if (refBreakInterval.current) {
        clearInterval(refBreakInterval.current);
        refBreakInterval.current = null;
      }
      dispatch(timerActions.setInBreak(false));
      dispatch(timerActions.setInLongBreak(false));
    }

    // We clicked reset while paused so end the session
    if (!timer.isRunning) {
      refCurrentMode.current = "pomodoro";
      dispatch(timerActions.setStarted(false));
      dispatch(timerActions.setInSession(false));
      AudioManager.playAudio("pause");
    } else {
      AudioManager.playAudio("click");
      // Just restart the session
      startSessionInterval();
    }
  };

  const onClickPomodoro = () => {
    if (timer.isInSession) {
      return;
    }

    document.body.style.backgroundColor = "var(--pomodoro)";
    refCurrentMode.current = "pomodoro";

    AudioManager.playAudio("click");

    dispatch(timerActions.setTimer(settings.seesionTime));

    if (refBreakInterval.current) {
      clearInterval(refBreakInterval.current);
      refBreakInterval.current = null;
    }

    if (timer.isRunning) {
      startSessionInterval();
    } else {
      dispatch(timerActions.setInBreak(false));
      dispatch(timerActions.setInLongBreak(false));
      dispatch(timerActions.setInSession(true));
    }
  };

  const onClickBreak = () => {
    //
    if (timer.isInBreak) {
      return;
    }

    document.body.style.backgroundColor = "var(--shortBreak)";
    refCurrentMode.current = "shortBreak";

    AudioManager.playAudio("click");

    if (refSessionInterval.current) {
      clearInterval(refSessionInterval.current);
      refSessionInterval.current = null;
    }

    if (refBreakInterval.current) {
      clearInterval(refBreakInterval.current);
      refBreakInterval.current = null;
    }

    dispatch(timerActions.setInBreak(true));
    dispatch(timerActions.setInLongBreak(false));
    dispatch(timerActions.setInSession(false));
    dispatch(timerActions.setTimer(settings.breakTime));
    if (timer.isRunning) {
      startBreakInterval();
    }
  };

  const onClickLongBreak = () => {
    if (timer.isInLongBreak) {
      return;
    }

    document.body.style.backgroundColor = "var(--longBreak)";
    refCurrentMode.current = "longBreak";

    AudioManager.playAudio("click");

    if (refSessionInterval.current) {
      clearInterval(refSessionInterval.current);
      refSessionInterval.current = null;
    }

    if (refBreakInterval.current) {
      clearInterval(refBreakInterval.current);
      refBreakInterval.current = null;
    }

    dispatch(timerActions.setInBreak(false));
    dispatch(timerActions.setInLongBreak(true));
    dispatch(timerActions.setInSession(false));
    dispatch(timerActions.setTimer(settings.longBreakTime));
    if (timer.isRunning) {
      startBreakInterval();
    }
  };

  useEffect(() => {
    //
    if (!timer.isRunning) return;

    if (timer.secondsLeft <= 0) {
      //
      if (timer.isInSession && refSessionInterval.current) {
        clearInterval(refSessionInterval.current);
        refSessionInterval.current = null;
        //
        dispatch(timerActions.decrementSessions());
        AudioManager.playAudio("ring");

        if (timer.sessionsLeft === 1) {
          //
          dispatch(timerActions.setInLongBreak(true));
          refCurrentMode.current = "longBreak";
          dispatch(timerActions.setTimer(settings.longBreakTime));
        } else {
          dispatch(timerActions.setInBreak(true));
          refCurrentMode.current = "shortBreak";
          dispatch(timerActions.setTimer(settings.breakTime));
        }

        if (Notification.permission === "granted") {
          new Notification("Take a break!");
        }
        startBreakInterval();
      } else if (refBreakInterval.current) {
        //
        clearInterval(refBreakInterval.current);
        refBreakInterval.current = null;

        AudioManager.playAudio("ring");

        if (timer.isInLongBreak || timer.sessionsLeft === 0) {
          dispatch(timerActions.setRunning(false));
          dispatch(timerActions.setStarted(false));
          dispatch(timerActions.setInLongBreak(false));
          document.body.style.backgroundColor = "var(--pomodoro)";
          refCurrentMode.current = "pomodoro";
          if (Notification.permission === "granted") {
            new Notification(
              "Your long break is complete, For another round start the timer again!"
            );
          }
        } else {
          dispatch(timerActions.setInBreak(false));
          dispatch(timerActions.setTimer(settings.seesionTime));
          if (Notification.permission === "granted") {
            new Notification("Get back to work!");
          }
          startSessionInterval();
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timer.secondsLeft]);

  return (
    <>
      <div className="timer-status">
        <button
          onClick={onClickPomodoro}
          className={"timer-status-button ".concat(
            !timer.isInBreak && !timer.isInLongBreak
              ? "timer-status-button-active"
              : ""
          )}
        >
          Pomodoro
        </button>
        <button
          onClick={onClickBreak}
          className={"timer-status-button ".concat(
            timer.isInBreak ? "timer-status-button-active" : ""
          )}
        >
          Short break
        </button>
        <button
          onClick={onClickLongBreak}
          className={"timer-status-button ".concat(
            timer.isInLongBreak ? "timer-status-button-active" : ""
          )}
        >
          Long break
        </button>
      </div>

      <TimerDisplay time={timer.secondsLeft} isRunning={timer.isRunning} />

      <h3 className="timer-sessions">Sessions Left: {timer.sessionsLeft}</h3>
      <div className="timer-buttons">
        <button onClick={onClickToggle}>
          {timer.isStarted ? (timer.isRunning ? "Pause" : "Resume") : "Start"}
        </button>
        <button onClick={onClickReset}>Reset</button>
      </div>
    </>
  );
};

interface TimerDisplayProps {
  time: number;
  isRunning: boolean;
}

const TimerDisplay = ({ time, isRunning }: TimerDisplayProps) => {
  const getTime = (secondsLeft: number) => {
    const minutes = Math.floor(secondsLeft / 60);
    const seconds = Math.floor(secondsLeft % 60);
    return ("0" + minutes).slice(-2) + ":" + ("0" + seconds).slice(-2);
  };

  return (
    <div className="timer-time">
      <p
        className={`timer-time-text`.concat(
          !isRunning ? " timer-time-text-disabled" : ""
        )}
      >
        {getTime(time)}
      </p>
    </div>
  );
};

export default TimerBody;
