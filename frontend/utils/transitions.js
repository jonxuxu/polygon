export function getEase(currentProgress, start, distance, steps) {
  currentProgress /= steps / 2;
  if (currentProgress < 1) {
    return (distance / 2) * Math.pow(currentProgress, 3) + start;
  }
  currentProgress -= 2;
  return (distance / 2) * (Math.pow(currentProgress, 3) + 2) + start;
}
