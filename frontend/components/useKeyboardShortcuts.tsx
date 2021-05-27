import { useCallback, useContext, useEffect } from "react";
import { ShortcutContext } from "./ShortcutContext";

export default function useKeyboardShortcuts({ videoRef }) {
  // Keyboard listeners
  const { shortcutsEnabled, toggleShortcuts } = useContext(ShortcutContext);

  const handlekeydownEvent = useCallback((event) => {
    const { keyCode } = event;

    if (event.target.tagName === "VIDEO") {
      return;
    }
    // Space
    if (keyCode === 32) {
      event.preventDefault();
      if (videoRef.current.paused) {
        videoRef.current.play();
      } else {
        videoRef.current.pause();
      }
    } else if (keyCode === 39) {
      // Right button
      videoRef.current.currentTime += 30;
    } else if (keyCode === 37) {
      // Left button
      videoRef.current.currentTime -= 30;
    } else if (keyCode === 38) {
      // Up arrow
      if (videoRef.current.volume <= 0.9) {
        videoRef.current.volume += 0.1;
      } else {
        videoRef.current.volume = 1;
      }
    } else if (keyCode === 40) {
      // Down arrow
      if (videoRef.current.volume >= 0.1) {
        videoRef.current.volume -= 0.1;
      } else {
        videoRef.current.volume = 0;
      }
    }
  }, []);

  function enableShortcuts() {
    document.addEventListener("keydown", handlekeydownEvent);
    toggleShortcuts(true);
    console.log("enabled");
  }
  function disableShortcuts() {
    document.removeEventListener("keydown", handlekeydownEvent);
    toggleShortcuts(false);
    console.log("disabled");
  }

  // // disable shortcuts when user is typing comments
  useEffect(() => {
    if (shortcutsEnabled) {
      enableShortcuts();
    } else {
      disableShortcuts();
    }
    return () => disableShortcuts();
  }, [shortcutsEnabled]);

  return { enableShortcuts, disableShortcuts };
}
