import React, { useState } from "react";
import { useRouter } from "next/router";
import { useMe, useVideo } from "utils/fetcher";
import { copyToClipboard } from "utils/text";

export function ShareButton() {
  const router = useRouter();
  const { video } = useVideo({ cuid: router.query?.cuid });
  const [copied, setCopied] = useState(false);
  const { me } = useMe();

  return (
    <button
      className="save"
      onClick={() => {
        copyToClipboard(window.location.href);
        setCopied(true);
      }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-4 w-4 text-[#8a8a8a] mr-2 mt-0.5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
        />
      </svg>
      <span className="text-[#8a8a8a]">
        {copied ? "Copied!" : "Share Link"}
      </span>
    </button>
  );
}
