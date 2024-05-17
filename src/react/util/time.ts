export const getTime = (secondsLeft: number) => {
  const minutes = Math.floor(secondsLeft / 60);
  const seconds = Math.floor(secondsLeft % 60);
  return ("0" + minutes).slice(-2) + ":" + ("0" + seconds).slice(-2);
};
