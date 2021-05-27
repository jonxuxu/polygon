import { SnippetPreview } from "components/SnippetPreview";
import { useState, useContext } from "react";
import styled from "styled-components";
import { fetcher, useMe, useVideo } from "utils/fetcher";
import { useRouter } from "next/router";
import Link from "next/link";
import { UserAvatar } from "components/Topbar";
import { TrashIcon } from "@heroicons/react/outline";
import { ShortcutContext } from "components/ShortcutContext";
import dayjs from "dayjs";

const Sidebar = ({ snippets, videoRef }) => {
  const { me } = useMe();
  const router = useRouter();
  const { video, mutate } = useVideo({ cuid: router.query?.cuid });

  const [comment, setComment] = useState("");
  const [tab, setTab] = useState("snippets");

  const { toggleShortcuts } = useContext(ShortcutContext);

  return (
    <div
      style={{
        width: 400,
        display: "flex",
        flexDirection: "column",
        borderLeft: "1px solid #E5E5E5",
      }}
    >
      <div
        style={{
          display: "flex",
          padding: 10,
          borderTop: "1px solid #E5E5E5",
          borderBottom: "1px solid #E5E5E5",
        }}
      >
        <TabButton
          isActive={tab === "snippets"}
          onClick={() => {
            setTab("snippets");
          }}
        >
          Snippets
        </TabButton>
        <TabButton
          isActive={tab === "comments"}
          onClick={() => {
            setTab("comments");
          }}
        >
          Comments
        </TabButton>
      </div>
      <div style={{ flexGrow: 1, overflowY: "scroll" }}>
        {tab === "snippets" && (
          <SnippetPreview snippets={snippets} videoRef={videoRef} />
        )}
        {tab === "comments" && (
          <div
            style={{ display: "flex", flexDirection: "column", height: "100%" }}
          >
            <div style={{ padding: "15px 30px", flexGrow: 1 }}>
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
                    onFocus={() => toggleShortcuts(false)}
                    onBlur={() => toggleShortcuts(true)}
                  />

                  <button disabled={!me} type="submit" className="primary ml-1">
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

              {video.comments.map((comment, i) => (
                <div key={i} className="flex flex-col mb-5 mt-3 group">
                  <div className="flex flex-row items-center gap-3 text-sm">
                    <UserAvatar user={comment.user} />
                    {comment.user.name}{" "}
                    <p className="text-sm float-right">
                      {/* @ts-ignore */}
                      {dayjs(comment.created).from(dayjs())}
                    </p>
                    {me && me.id === comment.user_id && (
                      <TrashIcon
                        className="text-red-400 h-5 opacity-0 group-hover:opacity-100 transition ease-in-out duration-150"
                        onClick={async () => {
                          await fetcher("/api/video/comment/delete", {
                            id: comment.id,
                          });
                          mutate();
                        }}
                      />
                    )}
                  </div>

                  <p className="text-lg mt-2 ml-11">{comment.text}</p>
                </div>
              ))}
            </div>
            <div
              style={{
                borderTop: "1px solid #E5E5E5",
                padding: 10,
              }}
            >
              Leave a comment...
            </div>
            <div
              style={{
                borderTop: "1px solid #E5E5E5",
                padding: 10,
              }}
            >
              Poggers
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;

const TabButton = styled.span`
  cursor: pointer;
  margin-left: 20px;
  ${(props) =>
    props.isActive &&
    `font-weight: bold;
    background: linear-gradient(93.12deg, #EE3699 -20.79%, #8036DF  109.75%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    `}
`;
