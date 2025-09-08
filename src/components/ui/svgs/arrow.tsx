type ArrowProps = {
  direction?: "left" | "right";
  onClick?: () => void;
};

export const ArrowSVG = ({ direction = "right", onClick }: ArrowProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="48"
      height="48"
      viewBox="0 0 48 48"
      fill="none"
      className={`${direction === "left" ? "rotate-180" : ""} cursor-pointer`}
      onClick={onClick}
    >
      <rect
        width="48"
        height="48"
        rx="24"
        className="fill-gray-400 hover:fill-gray-500 transition-colors duration-200"
        fillOpacity="0.5"
      />
      <path
        d="M10 24H38M38 24L24 10M38 24L24 38"
        stroke="#F5F5F5"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
