import { PropsWithChildren, useRef, createContext } from "react";

import AudioManagerClass from "@/util/AudioManager";

export const AudioContext = createContext<AudioManagerClass | null>(null);

export const AudioProvider = ({ children }: PropsWithChildren) => {
  const audioManagerInstance = useRef(new AudioManagerClass());

  return (
    <AudioContext.Provider value={audioManagerInstance.current}>
      {children}
    </AudioContext.Provider>
  );
};
