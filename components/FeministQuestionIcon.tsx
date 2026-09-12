import React from 'react';

interface FeministQuestionIconProps extends React.SVGProps<SVGSVGElement> {
  className?: string;
  size?: number | string;
  color?: string;
}

export const FeministQuestionIcon: React.FC<FeministQuestionIconProps> = ({
  className = "w-12 h-12",
  size,
  color = "currentColor",
  ...props
}) => {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      className={className}
      aria-hidden="true"
      {...props}
    >
      {/* 问号与女性圆环一体化弧线 */}
      <path
        d="M 38 52 A 22 22 0 1 1 61.5 44.5 C 54.5 51.5 50 57.5 50 63.5 L 50 76"
        stroke={color}
        strokeWidth="9.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* 十字横杆 */}
      <line
        x1="33"
        y1="68"
        x2="67"
        y2="68"
        stroke={color}
        strokeWidth="9.5"
        strokeLinecap="round"
      />
      {/* 底部实心圆点 */}
      <circle
        cx="50"
        cy="90"
        r="4.8"
        fill={color}
      />
    </svg>
  );
};

export default FeministQuestionIcon;
