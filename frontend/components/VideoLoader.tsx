export const VideoLoader = () => {
  const fill = "#ddd";
  return (
    <div className="col-span-6 md:col-span-4 xl:col-span-3 relative rounded-lg bg-white flex">
      <svg
        width={300}
        height={310}
        viewBox="0 0 360 330"
        className=""
        color="gray"
      >
        <rect
          x="0"
          y="0"
          rx="0"
          ry="0"
          width={370}
          height={200}
          fill={fill}
          className=" animate-pulse"
        />
        <circle cx={23} cy={278} r={20} fill={fill} className="animate-pulse" />
        {/* Top rectangle */}
        <rect
          x="7"
          y={229}
          rx="2"
          ry="2"
          width={330}
          height="15"
          fill={fill}
          className="animate-pulse"
        />
        <rect
          x="50"
          y="259"
          rx="2"
          ry="2"
          width="275"
          height="15"
          fill={fill}
          className="animate-pulse"
        />
        <rect
          x="50"
          y="283"
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
