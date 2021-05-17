export function positionTranslation(videoRef, translationRef, word) {
  const videoWidth = videoRef.current.offsetWidth;
  const videoHeight = videoRef.current.offsetHeight;
  const width = translationRef.current.offsetWidth;
  const height = translationRef.current.offsetHeight;

  const isRight = word.boundingBox[0].x > 1 - word.boundingBox[2].x;
  const isTop = word.boundingBox[2].y > 1 - word.boundingBox[0].y;

  const translateStartX = word.boundingBox[0].x * videoWidth;
  const translateEndX = word.boundingBox[2].x * videoWidth;
  const translateStartY = word.boundingBox[0].y * videoHeight;
  const translateEndY = word.boundingBox[2].y * videoHeight;

  var rectX = isRight ? translateStartX - width - 5 : translateEndX + 5;
  var rectY = translateStartY;

  if (rectX < 0) {
    rectX = translateStartX;
    rectY = isTop ? translateEndY + 5 : translateStartY - height - 5;
  }
  if (rectY < 0) {
    rectY = translateStartY;
    rectX = translateEndX + 5;
  }

  return [rectX, rectY];
}
