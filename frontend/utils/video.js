export function enterFullScreen(videoRef) {
  const video = videoRef.current;
  if (video.requestFullscreen) {
    video.requestFullscreen();
  } else if (video.webkitRequestFullscreen) {
    /* Safari */
    video.webkitRequestFullscreen();
  } else if (video.msRequestFullscreen) {
    /* IE11 */
    video.msRequestFullscreen();
  }
}

export function exitFullScreen() {
  if (window.innerHeight == screen.height) {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    }
  }
}
