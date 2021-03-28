export function getEase(currentProgress, start, distance, steps, power) {
  currentProgress /= steps / 2;
  if (currentProgress < 1) {
    return (distance / 2) * Math.pow(currentProgress, power) + start;
  }
  currentProgress -= 2;
  return (distance / 2) * (Math.pow(currentProgress, power) + 2) + start;
}
