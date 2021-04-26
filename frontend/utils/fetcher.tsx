import { users, videos, Prisma } from "@prisma/client";
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

export function useFeed() {
  const { data: feed }: { data?: (videos & { user: users })[] } = useSWR(
    "/api/video/feed",
    fetcher
  );
  return { feed: feed };
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
    data?: videos & { user: users; savedBy: users[] };
  } = useSWR(`/api/video/${cuid}`, fetcher);
  return { video };
}
