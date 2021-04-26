import { fetcher } from "./fetcher";

export function validateFile(file, setDuration) {
  var video = document.createElement("video");
  video.preload = "metadata";
  video.onloadedmetadata = function () {
    window.URL.revokeObjectURL(video.src);
    console.log("duration: ", video.duration);
    setDuration(video.duration);
  };

  video.src = URL.createObjectURL(file);
}

export async function uploadThumbnail(video, thumbnail) {
  const { response: t } = await fetcher(`/api/storage/upload-thumbnail`, {
    cuid: video.cuid,
  });
  const { url, fields } = t;
  const tData = new FormData();

  Object.entries({ ...fields, file: thumbnail }).forEach(([key, value]) => {
    // @ts-ignore
    tData.append(key, value);
  });

  const u = await fetch(url, {
    method: "POST",
    body: tData,
  });
  if (u.ok) {
    console.log("thumbnail uploaded", t);
    fetcher("/api/video/update", {
      thumbnail_url: t.url + video.cuid,
      id: video.id,
    });
  }
}
