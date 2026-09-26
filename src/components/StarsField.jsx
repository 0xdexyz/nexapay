import { useMemo } from 'react';

const STAR_COUNT = 55;

export default function StarsField(){
  const stars = useMemo(() => Array.from({ length: STAR_COUNT }, () => ({
    left: Math.random() * 100 + '%',
    top: Math.random() * 90 + '%',
    animationDelay: (Math.random() * 3).toFixed(2) + 's',
    animationDuration: (2.4 + Math.random() * 2.4).toFixed(2) + 's',
    size: (1 + Math.random() * 2).toFixed(1) + 'px'
  })), []);

  return (
    <div className="stars">
      {stars.map((s, i) => (
        <div
          key={i}
          className="star"
          style={{
            left: s.left,
            top: s.top,
            animationDelay: s.animationDelay,
            animationDuration: s.animationDuration,
            width: s.size,
            height: s.size
          }}
        />
      ))}
    </div>
  );
}
