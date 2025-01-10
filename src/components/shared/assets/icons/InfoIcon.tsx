import React from "react";

const InfoIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => {
  return (
    <svg
      width="24px"
      height="24px"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <circle cx="12" cy="12" r="10" stroke="#fff" strokeWidth="1.5" />
      <path
        d="M12 17V11"
        stroke="#fff"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <circle
        cx="1"
        cy="1"
        r="1"
        transform="matrix(1 0 0 -1 11 9)"
        fill="#fff"
      />
    </svg>
  );
};

export default InfoIcon;
