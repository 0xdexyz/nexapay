import { useEffect, useRef } from 'react';

// Replays the site's original reveal-fade behavior: the first time the
// section scrolls into view, each `.reveal-fade` child inside it gets
// `.in-view` added, staggered by `staggerMs`. Runs once per section.
export function useRevealOnScroll({ threshold = 0.15, staggerMs = 0, onReveal } = {}){
  const sectionRef = useRef(null);

  useEffect(() => {
    const section = sectionRef.current;
    if(!section || !('IntersectionObserver' in window)) return;

    document.body.classList.add('js-anim');
    const revealEls = section.querySelectorAll('.reveal-fade');
    let seen = false;
    const timers = [];

    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if(entry.isIntersecting && !seen){
          seen = true;
          revealEls.forEach((el, i) => {
            const t = setTimeout(() => { el.classList.add('in-view'); }, i * staggerMs);
            timers.push(t);
          });
          if(onReveal) onReveal();
        }
      });
    }, { threshold });

    io.observe(section);
    return () => {
      io.disconnect();
      timers.forEach(clearTimeout);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return sectionRef;
}
