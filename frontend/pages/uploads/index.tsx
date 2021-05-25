import Topbar from "../../components/Topbar";
import { useMe } from "utils/fetcher";
import { UploadList } from "../../components/UploadList";
import { useSession } from "next-auth/client";
import { useEffect, useRef, useState } from "react";
import Router from "next/router";
import styled from "styled-components";
import { ReactTypeformEmbed } from "react-typeform-embed";

const UploadsPage = () => {
  const { me } = useMe();

  const [session, loading] = useSession();
  useEffect(() => {
    if (!loading && !session) Router.push("/");
  });

  if (loading || me === undefined) {
    return (
      <div>
        <Topbar />
      </div>
    );
  }

  return (
    <div>
      {me.approved ? (
        <div>
          <Topbar />
          <div className="m-10">
            <UploadList />
          </div>
        </div>
      ) : (
        <Restricted />
      )}
    </div>
  );
};

const Restricted = () => {
  const formRef = useRef(null);

  return (
    <div style={{ position: "relative" }}>
      <Topbar
        background="rgba(0,0,0,0)"
        theme="dark"
        style={{
          position: "absolute",
          top: 0,
          width: "100%",
          left: 0,
          zIndex: 2,
        }}
      />
      <div
        style={{
          backgroundImage: "url('restricted.svg')",
          minHeight: "100vh",
          width: "100vw",
          backgroundSize: "cover",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          zIndex: 1,
          textAlign: "center",
          color: "white",
        }}
      >
        <h1 className="mt-4 text-4xl tracking-tight font-extrabold text-white sm:mt-5 sm:text-6xl lg:mt-6 xl:text-6xl">
          <span>Join the video </span>
          <span className="inline-block bg-gradient-to-br from-primary-400 to-purple-500 text-transparent bg-clip-text">
            <h1>revolution</h1>
          </span>
        </h1>
        <span style={{ maxWidth: 600, marginTop: 80, fontSize: "1.2em" }}>
          Uploading videos is currently only open to Frame insiders.
        </span>
        <span style={{ maxWidth: 600, marginTop: 30, fontSize: "1.2em" }}>
          Apply to be an insider creator to upload your own videos. Be the first
          to enjoy our upcoming monetization and influencer features.
        </span>
        <div style={{ marginTop: 80 }}>
          <PrimaryButton
            onClick={() => {
              formRef.current.typeform.open();
            }}
          >
            Apply
          </PrimaryButton>
        </div>
      </div>
      <ReactTypeformEmbed
        url="https://form.typeform.com/to/HOmG00SI"
        popup
        ref={formRef}
      />
    </div>
  );
};

export default UploadsPage;

const PrimaryButton = styled.div`
  position: relative;
  padding: 6px 30px;
  font-size: 1.3em;
  margin-left: 20px;
  cursor: pointer;
  font-weight: bold;

  &:before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border-radius: 10px;
    padding: 2px;
    background: linear-gradient(45deg, #ee3699, #8036df);
    -webkit-mask: linear-gradient(#fff 0 0) content-box,
      linear-gradient(#fff 0 0);
    -webkit-mask-composite: destination-out;
    mask-composite: exclude;
  }
`;

const SecondaryButton = styled.div`
  margin-right: 20px;
  font-size: 1.3em;
  border: 2px solid rgba(255, 255, 255, 0.7);
  border-radius: 10px;
  padding: 6px 30px;
  cursor: pointer;
  font-weight: bold;
`;
