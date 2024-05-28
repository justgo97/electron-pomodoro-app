interface AudioObject {
  [key: string]: HTMLAudioElement;
}

const getSilentSetting = () => {
  //
  const localSetting = localStorage.getItem("soundEffects");

  if (localSetting) {
    return localSetting === "off";
  } else {
    return false;
  }
};

class AudioManagerClass {
  audioElements: AudioObject;
  silentMode = getSilentSetting();

  constructor() {
    this.audioElements = {};
  }

  loadAudio(key: string, src: string) {
    if (!this.audioElements[key]) {
      const audio = new Audio(src);
      this.audioElements[key] = audio;
    }
  }

  playAudio(key: string) {
    if (this.silentMode) return;

    const audio = this.audioElements[key];
    if (audio) {
      audio.play();
    }
  }

  pauseAudio(key: string) {
    const audio = this.audioElements[key];
    if (audio) {
      audio.pause();
    }
  }

  setSilentMode(state: boolean) {
    this.silentMode = state;
  }
}

export default AudioManagerClass;
