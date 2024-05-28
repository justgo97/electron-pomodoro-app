import { useState } from "react";
import useAudio from "@/context/useAudio";
import { useAppDispatch, useAppSelector } from "@/store/index";
import { settingsActions } from "@/store/settingsReducer";

import { Button, Intent, Switch } from "@blueprintjs/core";

import "@/styles/modal.scss";

interface ModalProps {
  handleClose: () => void;
  show: boolean;
}

const SettingsModal = ({ handleClose, show }: ModalProps) => {
  //
  const settings = useAppSelector((state) => state.settings);
  const dispatch = useAppDispatch();
  const AudioManager = useAudio();

  const [stateSessionsCount, setStateSessionsCount] = useState(
    settings.sessionsCount
  );
  const [stateSessionTime, setStateSessionTime] = useState(
    settings.sessionTime / 60
  );
  const [stateBreakTime, setStateBreakTime] = useState(settings.breakTime / 60);

  const [stateLongBreakTime, setStateLongBreakTime] = useState(
    settings.longBreakTime / 60
  );

  const [stateSounds, setStateSounds] = useState(!AudioManager.silentMode);

  const [stateNotifications, setStateNotifications] = useState(
    settings.notifications
  );

  const [statePopupBreak, setStatePopupBreak] = useState(settings.popupBreak);

  const onChangeSessionsCount = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    //
    let sessionsCount = Number(event.currentTarget.value);
    if (sessionsCount < 1) {
      sessionsCount = 1;
    }
    setStateSessionsCount(sessionsCount);
  };

  const onChangeSession = (event: React.ChangeEvent<HTMLInputElement>) => {
    //
    setStateSessionTime(Number(event.currentTarget.value));
  };

  const onChangeBreak = (event: React.ChangeEvent<HTMLInputElement>) => {
    //
    setStateBreakTime(Number(event.currentTarget.value));
  };

  const onChangeLongBreak = (event: React.ChangeEvent<HTMLInputElement>) => {
    //
    setStateLongBreakTime(Number(event.currentTarget.value));
  };

  const onChangeSound = (event: React.ChangeEvent<HTMLInputElement>) => {
    setStateSounds(event.target.checked);
  };

  const onChangeNotifications = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setStateNotifications(event.target.checked);
  };

  const onChangePopupBreak = (event: React.ChangeEvent<HTMLInputElement>) => {
    setStatePopupBreak(event.target.checked);
  };

  const onClickSave = () => {
    //
    dispatch(settingsActions.setSessionsCount(stateSessionsCount));
    localStorage.setItem("sessionsCount", String(stateSessionsCount));

    dispatch(settingsActions.setSession(stateSessionTime * 60));
    localStorage.setItem("sessionTime", String(stateSessionTime));

    dispatch(settingsActions.setBreak(stateBreakTime * 60));
    localStorage.setItem("breakTime", String(stateBreakTime));

    dispatch(settingsActions.setLongBreak(stateLongBreakTime * 60));
    localStorage.setItem("longBreakTime", String(stateLongBreakTime));

    AudioManager.setSilentMode(!stateSounds);
    localStorage.setItem("soundEffects", stateSounds ? "on" : "off");

    dispatch(settingsActions.setNotifications(stateNotifications));
    localStorage.setItem("notifications", stateNotifications ? "on" : "off");

    dispatch(settingsActions.setPopupBreak(statePopupBreak));
    localStorage.setItem("popupBreak", statePopupBreak ? "on" : "off");

    handleClose();
  };

  const onClickReset = () => {
    setStateSessionsCount(4);
    setStateSessionTime(25);
    setStateBreakTime(5);
    setStateLongBreakTime(15);
    setStateSounds(true);
    setStatePopupBreak(true);
    setStateNotifications(true);
  };

  const onClickClose = () => {
    setStateSessionsCount(settings.sessionsCount);
    setStateSessionTime(settings.sessionTime / 60);
    setStateBreakTime(settings.breakTime / 60);
    setStateLongBreakTime(settings.longBreakTime / 60);
    setStateSounds(!AudioManager.silentMode);
    setStateNotifications(settings.notifications);
    setStatePopupBreak(settings.popupBreak);

    handleClose();
  };

  if (!show) {
    return null;
  }

  return (
    <div id="myModal" className="modal" onClick={onClickClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div></div>
          <h2 className="modal-header-title">Pomodoro Settings</h2>
          <span className="close" onClick={onClickClose}>
            &times;
          </span>
        </div>
        <div className="modal-body">
          <div className="modal-body-fields">
            <div className="modal-body-fields-item">
              <label>Sessions count:</label>
              <input
                type="number"
                value={stateSessionsCount}
                onChange={onChangeSessionsCount}
              />
            </div>
            <div className="modal-body-fields-item">
              <label>Session time:</label>
              <input
                type="number"
                value={stateSessionTime}
                onChange={onChangeSession}
              />
            </div>
            <div className="modal-body-fields-item">
              <label>Short break time:</label>
              <input
                type="number"
                value={stateBreakTime}
                onChange={onChangeBreak}
              />
            </div>
            <div className="modal-body-fields-item">
              <label>Long break time:</label>
              <input
                type="number"
                value={stateLongBreakTime}
                onChange={onChangeLongBreak}
              />
            </div>
            <div>
              <label>Sound effects:</label>
              <Switch
                innerLabelChecked="on"
                innerLabel="off"
                checked={stateSounds}
                onChange={onChangeSound}
              />
            </div>
            <div>
              <label>Notifications:</label>
              <Switch
                innerLabelChecked="on"
                innerLabel="off"
                checked={stateNotifications}
                onChange={onChangeNotifications}
              />
            </div>
            <div>
              <label>Popup break:</label>
              <Switch
                innerLabelChecked="on"
                innerLabel="off"
                checked={statePopupBreak}
                onChange={onChangePopupBreak}
              />
            </div>
          </div>
        </div>
        <div className="modal-footer">
          <div className="modal-footer-buttons">
            <Button text="Save" onClick={onClickSave} intent={Intent.SUCCESS} />
            <Button
              text="Reset"
              onClick={onClickReset}
              intent={Intent.WARNING}
            />
            <Button text="Cancel" onClick={onClickClose} />
          </div>
          <div className="modal-footer-version">App Version {APP_VERSION}</div>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
