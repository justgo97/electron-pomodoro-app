import { useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/index";
import { settingsActions } from "@/store/settingsReducer";
import "@/styles/modal.scss";

interface ModalProps {
  handleClose: () => void;
  show: boolean;
}

const Modal = ({ handleClose, show }: ModalProps) => {
  //
  const settings = useAppSelector((state) => state.settings);
  const dispatch = useAppDispatch();

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

  const onChangeSessionsCount = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    //
    setStateSessionsCount(Number(event.currentTarget.value));
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

  const onClickSave = () => {
    //
    dispatch(settingsActions.setSessionsCount(stateSessionsCount));
    dispatch(settingsActions.setSession(stateSessionTime * 60));
    dispatch(settingsActions.setBreak(stateBreakTime * 60));
    dispatch(settingsActions.setLongBreak(stateLongBreakTime * 60));
    handleClose();
  };

  const onClickClose = () => {
    setStateSessionsCount(settings.sessionsCount);
    setStateSessionTime(settings.sessionTime / 60);
    setStateBreakTime(settings.breakTime / 60);
    setStateLongBreakTime(settings.longBreakTime / 60);
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
            <div>
              <label>Sessions count:</label>
              <input
                type="number"
                value={stateSessionsCount}
                onChange={onChangeSessionsCount}
              />
            </div>
            <div>
              <label>Session time:</label>
              <input
                type="number"
                value={stateSessionTime}
                onChange={onChangeSession}
              />
            </div>
            <div>
              <label>Short break time:</label>
              <input
                type="number"
                value={stateBreakTime}
                onChange={onChangeBreak}
              />
            </div>
            <div>
              <label>Long break time:</label>
              <input
                type="number"
                value={stateLongBreakTime}
                onChange={onChangeLongBreak}
              />
            </div>
          </div>
        </div>
        <div className="modal-footer">
          <div className="modal-footer-buttons">
            <button onClick={onClickSave}>Save</button>
            <button onClick={onClickClose}>Cancel</button>
          </div>
          <div className="modal-footer-version">App Version {APP_VERSION}</div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
