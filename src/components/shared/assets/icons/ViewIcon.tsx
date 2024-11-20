import React from "react";

const ViewIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => {
  return (
    <svg
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      aria-hidden="true"
      className="h-5 w-5 text-violet-200 hover:text-violet-100"
      {...props}
    >
      <circle cx="12" cy="12" r="4" fill="#33363F" />
      <path
        d="M21 12C21 12 20 4 12 4C4 4 3 12 3 12"
        stroke="#33363F"
        strokeWidth="2"
      />
    </svg>
  );
};

export default ViewIcon;
