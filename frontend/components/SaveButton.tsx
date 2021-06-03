import React from "react";
import { useRouter } from "next/router";
import { mutate } from "swr";
import { fetcher, useMe, useVideo } from "utils/fetcher";

export function SaveButton() {
  const router = useRouter();
  const { video } = useVideo({ cuid: router.query?.cuid });
  const { me } = useMe();
  // if (!me || !video) return null;
  return (
    <button
      className="save"
      onClick={async () => {
        if (!me) {
          alert("Please log in to save videos to your profile.");
          return;
        }

        const savedBy = video.savedBy.find((u) => u.id === me.id)
          ? { disconnect: { email: me.email } }
          : { connect: { email: me.email } };
        await fetcher("/api/video/update", {
          id: video.id,
          savedBy,
        });
        await mutate("/api/video/" + video.cuid);
      }}
    >
      <img
        src="/add-list.svg"
        alt="save"
        style={{
          width: 20,
          height: 20,
          cursor: "pointer",
          marginRight: 8,
        }}
      />
      <span className="text-[#8a8a8a]">
        {me && video.savedBy && video.savedBy.find((u) => u.id === me.id)
          ? "Unsave"
          : "Save"}
      </span>
    </button>
  );
}
