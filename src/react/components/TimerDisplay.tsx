import { getTime } from "@/util/time";

interface TimerDisplayProps {
  time: number;
  isRunning: boolean;
}

const TimerDisplay = ({ time, isRunning }: TimerDisplayProps) => {
  return (
    <div className="timer-time">
      <p
        className={`timer-time-text${
          !isRunning ? " timer-time-text-disabled" : ""
        }`}
      >
        {getTime(time)}
      </p>
    </div>
  );
};

export default TimerDisplay;
