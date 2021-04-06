export const wordCollider = (
  mouseX,
  mouseY,
  videoWidth,
  videoHeight,
  words,
  callback
) => {
  if (words === null || words === undefined) return false;

  var collision = false;
  for (var i = 0; i < words.length; i++) {
    const word = words[i];
    const bounds = [
      {
        x: word.boundingBox[0].x * videoWidth,
        y: word.boundingBox[0].y * videoHeight,
      },
      {
        x: word.boundingBox[2].x * videoWidth,
        y: word.boundingBox[2].y * videoHeight,
      },
    ];
    collision = boundsCollider(mouseX, mouseY, bounds, () => {
      callback(word);
    });
    if (collision) {
      break;
    }
  }
  return collision;
};

// Executes callback if mouseX and mouseY is within the bounds, and returns if there was a collision
export const boundsCollider = (mouseX, mouseY, bounds, callback) => {
  // Assuming bounds is a simple rectangle, 2 corners provided
  if (mouseX < bounds[0].x || mouseX > bounds[1].x) return false;
  if (mouseY < bounds[0].y || mouseY > bounds[1].y) return false;
  callback();
  return true;
};
