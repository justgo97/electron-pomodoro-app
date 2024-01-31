import { useState, useEffect } from "react";

import { useAppDispatch, useAppSelector } from "@/store/index";
import useAudio from "@/context/useAudio";

import TimerBody from "@/components/TimerBody";
import Modal from "@/components/Modal";

import "@/styles/App.scss";

import soundClick from "@/resources/button_click.mp3";
import soundRing from "@/resources/bell_ring.mp3";
import soundPause from "@/resources/timer_pause.mp3";
import { timerActions } from "./store/timerReducer";

const App = () => {
  const [showSettings, setShowSettings] = useState(false);
  const settings = useAppSelector((state) => state.settings);
  const dispatch = useAppDispatch();
  const AudioManager = useAudio();

  useEffect(() => {
    // Load audio files
    AudioManager.loadAudio("click", soundClick);
    AudioManager.loadAudio("ring", soundRing);
    AudioManager.loadAudio("pause", soundPause);
    document.body.style.backgroundColor = "var(--pomodoro)";
  }, [AudioManager]);

  useEffect(() => {
    //
    dispatch(timerActions.setSessions(settings.sessionsCount));
    dispatch(timerActions.setTimer(settings.sessionTime));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    //
    if (
      Notification.permission !== "granted" &&
      Notification.permission !== "denied"
    ) {
      // ask the user for permission
      Notification.requestPermission().then(function (permission) {
        // If permission is granted
        if (permission === "granted") {
          // Create a new notification
          new Notification(
            "Awesome! You will be notified at the start of each session."
          );
        }
      });
    }
  }, []);

  return (
    <div className="App">
      <div className="timer">
        <TimerHeader showSettings={() => setShowSettings(true)} />
        <TimerBody />
      </div>
      <Modal handleClose={() => setShowSettings(false)} show={showSettings} />
    </div>
  );
};

interface TimerHeaderProps {
  showSettings: () => void;
}

const TimerHeader = ({ showSettings }: TimerHeaderProps) => {
  return (
    <div className="timer-header">
      <button className="timer-header-settings" onClick={showSettings}>
        ⚙️
      </button>
    </div>
  );
};

export default App;
