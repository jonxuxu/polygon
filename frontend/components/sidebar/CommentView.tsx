import { useState, useContext, useRef } from "react";
import Link from "next/link";
import { UserAvatar } from "components/Topbar";
import { TrashIcon } from "@heroicons/react/outline";
import { fetcher, useMe, useVideo } from "utils/fetcher";
import { useRouter } from "next/router";
import { ShortcutContext } from "components/ShortcutContext";
import dayjs from "dayjs";
import styled from "styled-components";

export function CommentView() {
  const { me } = useMe();
  const router = useRouter();
  const { video, mutate } = useVideo({ cuid: router.query?.cuid });
  const [comment, setComment] = useState("");
  const [inputHeight, setInputHeight] = useState(20);
  const inputRef = useRef(null);

  const { toggleShortcuts } = useContext(ShortcutContext);

  const sendComment = () => {};

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
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
                comments: [...video.comments, { text: comment, user: me }],
              },
              false
            );
            setComment("");
          }}
        >
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
      <CommentInput
        placeholder="Leave a comment..."
        className="focus:border-transparent"
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
        }}
      >
        <CommentButton
          disabled={!me || comment.length === 0}
          onClick={sendComment}
        >
          Comment
        </CommentButton>
      </div>
    </div>
  );
}

const CommentInput = styled.textarea`
  border: none;
  height: ${(props) => props.inputHeight}px;
`;

const CommentButton = styled.button`
  background-color: ${(props) => (props.disabled ? "#C4C4C4" : "black")};
  color: white;
  padding: 2px 10px;
  border-radius: 5px;
  font-size: 14px;
  cursor: ${(props) => (props.disabled ? "auto" : "pointer")};
`;
