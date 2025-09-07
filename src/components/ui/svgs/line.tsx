interface LineSVGProps {
  width?: number; // largura opcional
}

export const LineSVG = ({ width = 409 }: LineSVGProps) => {
  return (
    <svg
      className={`mt-[-6px]`}
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height="6"
      viewBox={`0 0 ${width} 6`}
      fill="none"
    >
      <rect width={width} height="6" rx="3" fill="#484848" />
    </svg>
  );
};
