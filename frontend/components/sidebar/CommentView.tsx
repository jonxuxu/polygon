import { useState, useContext, useRef } from "react";
import Link from "next/link";
import { UserAvatar } from "components/Topbar";
import { TrashIcon } from "@heroicons/react/outline";
import { fetcher, useMe, useVideo } from "utils/fetcher";
import { useRouter } from "next/router";
import { ShortcutContext } from "components/ShortcutContext";
import HelpButton from "components/HelpButton";
import styled from "styled-components";

export function CommentView() {
  const { me } = useMe();
  const router = useRouter();
  const { video, mutate } = useVideo({ cuid: router.query?.cuid });
  const [comment, setComment] = useState("");
  const [inputHeight, setInputHeight] = useState(40);
  const inputRef = useRef(null);

  const { toggleShortcuts } = useContext(ShortcutContext);

  const sendComment = () => {};

  if (!video || !video.comments) {
    return <div>Loading...</div>;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <div style={{ padding: "15px 15px", flexGrow: 1 }}>
        {!me && (
          <div className="mt-1 text-sm">
            <Link href="/login">
              <a className="link">Log in</a>
            </Link>{" "}
            to leave a comment
          </div>
        )}

        {video.comments.map((comment, i) => {
          if (!comment.user) {
            return;
          }
          return (
            <div key={i} className="flex flex-col mb-5 mt-3 group">
              <div className="flex flex-row gap-3 text-sm">
                <UserAvatar user={comment.user} />
                <div>
                  <span>
                    <span style={{ fontWeight: "bold" }}>
                      {comment.user.name}
                    </span>{" "}
                    <span style={{ wordBreak: "break-all" }}>
                      {comment.text}
                    </span>
                  </span>
                  {/* <p className="text-sm float-right">
                {dayjs(comment.created).from(dayjs())}
              </p>  */}
                </div>
              </div>
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
          );
        })}
      </div>
      <form
        className="w-full"
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
              comments: [...video.comments, { text: comment, user: me }],
            },
            false
          );
          setComment("");
        }}
      >
        <CommentInput
          placeholder="Leave a comment..."
          className="focus:border-transparent focus:ring-0 w-full hide-scrollbar"
          value={comment}
          type="text"
          ref={inputRef}
          style={{
            cursor: !!me ? "text" : "not-allowed",
            borderTop: "1px solid #E5E5E5",
          }}
          inputHeight={inputHeight}
          disabled={!me}
          onChange={(e) => {
            setComment(e.target.value);
            if (inputRef.current) {
              setInputHeight(inputRef.current.scrollHeight);
            }
          }}
          onFocus={() => toggleShortcuts(false)}
          onBlur={() => toggleShortcuts(true)}
        />
        <div
          style={{
            borderTop: "1px solid #E5E5E5",
            padding: 10,
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <CommentButton
            disabled={!me || comment.length === 0}
            onClick={sendComment}
            type="submit"
          >
            Comment
          </CommentButton>
          <HelpButton />
        </div>
      </form>
    </div>
  );
}

const CommentInput = styled.textarea`
  border: none;
  height: ${(props) => props.inputHeight}px;
  resize: none;
`;

const CommentButton = styled.button`
  background-color: ${(props) => (props.disabled ? "#C4C4C4" : "black")};
  color: white;
  padding: 2px 10px;
  border-radius: 5px;
  font-size: 14px;
  cursor: ${(props) => (props.disabled ? "auto" : "pointer")};
`;
