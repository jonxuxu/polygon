// @ts-nocheck
import { useEffect, useState } from "react";

export function useSafari() {
  const [isSafari, setIsSafari] = useState(false);

  useEffect(() => {
    console.log(navigator.userAgent);
    const isSafari =
      /constructor/i.test(window.HTMLElement) ||
      (function (p) {
        return p.toString() === "[object SafariRemoteNotification]";
      })(
        !window["safari"] ||
          (typeof safari !== "undefined" && safari.pushNotification)
      );

    if (isSafari) {
      setIsSafari(true);
      console.log("Safari browser detected ");
    }
  }, []);

  return { isSafari };
}
