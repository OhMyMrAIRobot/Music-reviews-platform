import { FC } from 'react';
import { ISvgProps } from '../../types/common/types/svg-props';

const NewLogoSvg: FC<ISvgProps> = ({ className }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="100%"
      height="100%"
      viewBox="0 0 400 150"
      className={className}
    >
      <text
        x="50%"
        y="50%"
        dominantBaseline="middle"
        style={{
          fontFamily: '"Brush Script MT","Dancing Script",cursive',
          fontSize: '90px',
          fill: '#fff',
          filter: 'drop-shadow(2px 2px 2px rgba(0,0,0,.5))',
        }}
        textAnchor="middle"
      >
        MusicReview
      </text>
      <path
        fill="none"
        stroke="#fff"
        strokeLinecap="round"
        strokeWidth="6"
        d="M 0 120 q 120 30 400 0"
      />
    </svg>
  );
};

export default NewLogoSvg;
