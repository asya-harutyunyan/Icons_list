import React, { FC } from 'react';

type GradientLineProps = {
  colorsArray: string[];
};
const GradientLine: FC<GradientLineProps> = ({ colorsArray }) => {
  const circleRadius = 15;
  const distanceBetweenCircles = 165;

  return (
    <svg width={`${colorsArray.length * distanceBetweenCircles}px`}>
      {colorsArray.map((color, index) => {
        const x = circleRadius + index * distanceBetweenCircles;
        return (
          <React.Fragment key={index}>
            {index < colorsArray.length - 1 && (
              <defs>
                <linearGradient
                  id={`gradient${index}`}
                  x1="0%"
                  y1="50%"
                  x2="100%"
                  y2="50%"
                >
                  <stop offset="0%" style={{ stopColor: color }} />
                  <stop
                    offset="100%"
                    style={{ stopColor: colorsArray[index + 1] }}
                  />
                </linearGradient>
              </defs>
            )}
            {index < colorsArray.length - 1 && (
              <rect
                x={x + circleRadius}
                y={circleRadius - 1}
                width={distanceBetweenCircles - circleRadius * 2}
                height="5"
                fill={`url(#gradient${index})`}
              />
            )}
            <circle cx={x} cy={circleRadius} r={circleRadius} fill={color} />
          </React.Fragment>
        );
      })}
    </svg>
  );
};

export default GradientLine;
