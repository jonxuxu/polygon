import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import Skeleton from "react-loading-skeleton";
import dayjs from "dayjs";
import { fetcher, useMe, useVideo } from "utils/fetcher";
import { Transcription } from "utils/types";

import Topbar, { UserAvatar } from "components/Topbar";
import VideoPlayer from "components/VideoPlayer";
import { SnippetPreview } from "components/SnippetPreview";
import { ShareButton } from "../../../components/ShareButton";
import { SaveButton } from "../../../components/SaveButton";
import { TrashIcon } from "@heroicons/react/outline";

var relativeTime = require("dayjs/plugin/relativeTime");
dayjs.extend(relativeTime);

const App = () => {
  const router = useRouter();
  const videoRef = useRef(null);

  const { video, mutate } = useVideo({ cuid: router.query?.cuid });
  const { me } = useMe();

  const [snippets, setSnippets] = useState<Transcription[]>([]);
  const [comment, setComment] = useState("");
  const [mobile, setMobile] = useState(false);
  const [commentInputFocus, setCommentInputFocus] = useState(false);

  useEffect(() => {
    // if (navigator.userAgent) setMobile(true);
    const toMatch = [/Android/i, /iPhone/i, /iPad/i, /iPod/i, /Windows Phone/i];
    const isMobile = toMatch.some((toMatchItem) => {
      return navigator.userAgent.match(toMatchItem);
    });
    if (isMobile) setMobile(true);
  }, []);

  return (
    <div>
      {/* {video && video.url && <VideoPlayer videoRow={video} />} */}
      <Topbar />
      {mobile && (
        <div className="bg-yellow-50 text-yellow-700 flex items-center text-center rounded-md m-3 p-1">
          NOTE: Frame's interactive video player does not yet support mobile
          devices.
        </div>
      )}
      <div className="flex" style={{ width: "100%" }}>
        <div style={{ flex: 1 }}>
          {video && video.url ? (
            <div>
              <VideoPlayer
                videoRow={video}
                snippets={snippets}
                setSnippets={setSnippets}
                videoRef={videoRef}
                commentInputFocus={commentInputFocus}
              />
              <div className="mx-10">
                <div className="my-2 text-xl text-gray-700">
                  {video.title}
                  {me && me.id === video.creator && (
                    <Link href={`/video/${video.cuid}/edit`}>
                      <a className="link text-sm ml-2">Edit </a>
                    </Link>
                  )}
                </div>
                <div className="text-gray-500 text-sm flex flex-row items-center justify-between mt-3">
                  <span className="">
                    {video.views + video.viewBoost} views - {/* @ts-ignore */}
                    {dayjs(video.created).from(dayjs())}
                  </span>
                  <div>
                    <SaveButton />
                    <ShareButton />
                  </div>
                </div>
                <hr className="mb-4" />
                <div className="mb text-md text-gray-700 mb-2 flex">
                  <img
                    className="h-8 w-8 rounded-full mr-2"
                    src={video.user.image}
                    alt="User creator"
                  />
                  {video.user.name}
                  <br />
                </div>
                <span className="text-sm text-gray-500">
                  {video.description}
                </span>
                {/* Save button */}
                <br />
                {/* <CommentsSection video={video} /> */}
                <div>
                  <h4 className="mt-8 mb-3 text-xl">Comments </h4>

                  <form
                    onSubmit={async (e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      fetcher("/api/video/comment/create", {
                        text: comment,
                        video_id: video.id,
                      });
                      mutate(
                        {
                          ...video,
                          comments: [
                            ...video.comments,
                            { text: comment, user: me },
                          ],
                        },
                        false
                      );
                      setComment("");
                    }}
                  >
                    <div className="flex flex-row mt-5">
                      <input
                        placeholder="Leave a comment"
                        className={`text-input `}
                        value={comment}
                        type="text"
                        style={{ cursor: !!me ? "text" : "not-allowed" }}
                        disabled={!me}
                        onChange={(e) => setComment(e.target.value)}
                        onFocus={() => setCommentInputFocus(true)}
                        onBlur={() => setCommentInputFocus(false)}
                      />

                      <button
                        disabled={!me}
                        type="submit"
                        className="primary ml-1"
                      >
                        Comment
                      </button>
                    </div>
                    {!me && (
                      <div className="mt-1 text-sm">
                        <Link href="/login">
                          <a className="link">Log in</a>
                        </Link>{" "}
                        to leave a comment
                      </div>
                    )}
                  </form>

                  {video.comments.map((comment) => (
                    <div key={comment.id} className="flex flex-col mb-5 mt-3">
                      <div className="flex flex-row items-center gap-3 text-sm">
                        <UserAvatar user={comment.user} />
                        {comment.user.name}{" "}
                        <p className="text-sm float-right">
                          {/* @ts-ignore */}
                          {dayjs(comment.created).from(dayjs())}
                        </p>
                        {me && me.id === comment.user_id && (
                          <TrashIcon
                            className="text-red-400 h-5"
                            onClick={() =>
                              fetcher("/api/video/comment/delete", {
                                id: comment.id,
                              })
                            }
                          />
                        )}
                      </div>

                      <p className="text-lg mt-2 ml-11">{comment.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="p-3 m-10">
              <Skeleton count={5} />
            </div>
          )}
        </div>
        <SnippetPreview snippets={snippets} videoRef={videoRef} />
      </div>
    </div>
  );
};

// const CommentsSection({video}) =>

export default App;
