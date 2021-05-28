import React from "react";
import ContentLoader from "react-content-loader";

export const ProfileLoading = () => {
  return (
    <ContentLoader
      width={400}
      viewBox="0 0 400 300"
      backgroundColor="#f0f0f0"
      foregroundColor="#dedede"
    >
      <circle cx="200" cy="60" r="60" />
      <rect x="137" y="150" rx="3" ry="3" width="125" height="25" />
      <rect x="78" y="220" rx="3" ry="3" width="254" height="8" />
      <rect x="78" y="240" rx="3" ry="3" width="254" height="8" />
    </ContentLoader>
  );
};

export const VideoLoading = () => (
  <ContentLoader
    width="100%"
    viewBox="0 0 1100 400"
    backgroundColor="#f0f0f0"
    foregroundColor="#dedede"
  >
    <rect x="0" y="0" width="1100" height="400" />
  </ContentLoader>
);
