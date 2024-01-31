import { useContext } from "react";

import { AudioContext } from "./AudioProvider";

const useAudio = () => {
  const audioInstance = useContext(AudioContext);

  if (!audioInstance) {
    throw new Error("useAudio must be used within a AudioProvider");
  }

  return audioInstance;
};

export default useAudio;
