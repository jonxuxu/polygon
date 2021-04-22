import { users, videos } from "@prisma/client";
import useSWR from "swr";

export const fetcher = (url, data = undefined) =>
  fetch(window.location.origin + url, {
    method: data ? "POST" : "GET",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  }).then((r) => r.json());

// Hooks
export function useFeed() {
  const { data: feed }: { data?: videos[] } = useSWR(
    "/api/video/feed",
    fetcher
  );
  return { feed };
}
export function useMe() {
  const { data: me }: { data?: users & { videos: videos[] } } = useSWR(
    "/api/me",
    fetcher
  );
  return { me };
}
export function useVideo({ cuid }) {
  const {
    data: video,
  }: {
    data?: videos;
  } = useSWR(`/api/video/${cuid}`, fetcher);
  return { video };
}
