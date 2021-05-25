// import ContentLoader from "react-content-loader";

const VideoLoader = () => {
  const fill = "#ddd";
  return (
    <div className="col-span-6 md:col-span-4 xl:col-span-3 relative rounded-lg  flex">
      <svg
        width={300}
        height={310}
        viewBox="0 0 360 330"
        className=""
        color="gray"
      >
        <rect
          x="16"
          y="17"
          rx="0"
          ry="0"
          width={360}
          height={200}
          fill={fill}
          className=" animate-pulse"
        />
        <circle cx={35} cy={248} r={20} fill={fill} className="animate-pulse" />
        {/* Top rectangle */}
        {/* <rect
          x="16"
          y={209}
          rx="2"
          ry="2"
          width={300}
          height="15"
          fill={fill}
          className="animate-pulse"
        /> */}
        <rect
          x="69"
          y="229"
          rx="2"
          ry="2"
          width="275"
          height="15"
          fill={fill}
          className="animate-pulse"
        />
        <rect
          x="69"
          y="253"
          rx="2"
          ry="2"
          width="140"
          height="15"
          fill={fill}
          className="animate-pulse"
        />
      </svg>
    </div>
  );
};

export default VideoLoader;
