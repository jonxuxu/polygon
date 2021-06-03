import { users, videos, Prisma, snippets, comments } from "@prisma/client";
import useSWR from "swr";

const baseUrl =
  typeof window !== "undefined"
    ? window.location.origin
    : process.env.NODE_ENV === "production"
    ? "https://polygon.video"
    : "http://localhost:3000";

export const fetcher = (url, data = undefined) =>
  fetch(baseUrl + url, {
    method: data ? "POST" : "GET",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  }).then((r) => r.json());

export function useFeed(initialData = []) {
  const { data: feed }: { data?: (videos & { user: users })[] } = useSWR(
    "/api/video/feed",
    fetcher,
    { initialData }
  );
  return { feed: feed };
}
export function useMe() {
  const {
    data: me,
  }: {
    data?: users & {
      snippets: snippets[];
      videos: videos[];
      savedVideos: videos[];
    };
  } = useSWR("/api/me", fetcher);
  return { me };
}
export function useVideo({ cuid, initialData = {} }) {
  const {
    data: video,
    mutate,
  }: {
    mutate: any;
    data?: videos & {
      user: users;
      savedBy: users[];
      comments: (comments & { user: users })[];
    };
  } = useSWR(`/api/video/${cuid}`, fetcher, { initialData });
  return { video, mutate };
}
