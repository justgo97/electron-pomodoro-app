interface AudioObject {
  [key: string]: HTMLAudioElement;
}

class AudioManagerClass {
  audioElements: AudioObject;

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
}

export default AudioManagerClass;
