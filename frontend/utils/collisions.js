export const wordCollider = (
  mouseX,
  mouseY,
  videoWidth,
  videoHeight,
  words,
  callback
) => {
  var collision = false;
  for (var i = 0; i < words.length; i++) {
    const word = words[i];
    if (
      mouseX > word.boundingBox[0].x * videoWidth &&
      mouseX < word.boundingBox[2].x * videoWidth &&
      mouseY > word.boundingBox[0].y * videoHeight &&
      mouseY < word.boundingBox[3].y * videoHeight
    ) {
      callback(word);
      collision = true;
      break;
    }
  }
  return collision;
};
