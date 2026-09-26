import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SECURITY_CARDS } from '../data/content.js';
import { secIcons } from './Icons.jsx';

gsap.registerPlugin(ScrollTrigger);

export default function SecuritySection(){
  const secRef = useRef(null);
  const stageRef = useRef(null);

  useEffect(() => {
    const cards = Array.prototype.slice.call(stageRef.current.querySelectorAll('.sec-card'));
    const total = cards.length;
    if(total === 0) return;

    gsap.set(cards[0], { y: '0%', scale: 1, rotation: 0 });
    for(let i = 1; i < total; i++){
      gsap.set(cards[i], { y: '100%', scale: 1, rotation: 0 });
    }

    const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let secTimeline;
    let secResize;

    if(!reduceMotion){
      secTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: stageRef.current.closest('.sticky-security'),
          start: 'top top',
          end: '+=' + (window.innerHeight * (total - 1)),
          pin: true,
          scrub: 0.5,
          pinSpacing: true
        }
      });

      for(let j = 0; j < total - 1; j++){
        const current = cards[j];
        const next = cards[j + 1];
        const position = j;

        secTimeline.to(current, { scale: 0.82, rotation: 4, y: '-6%', duration: 1, ease: 'none' }, position);
        secTimeline.to(next, { y: '0%', duration: 1, ease: 'none' }, position);
      }

      secResize = new ResizeObserver(() => { ScrollTrigger.refresh(); });
      secResize.observe(secRef.current);
    }

    return () => {
      if(secResize) secResize.disconnect();
      if(secTimeline){
        secTimeline.scrollTrigger && secTimeline.scrollTrigger.kill();
        secTimeline.kill();
      }
    };
  }, []);

  return (
    <section className="sec" id="security" ref={secRef}>
      <div className="sec-head">
        <div className="badge">✦ Security</div>
        <h2>Your crypto. <em>Your control.</em></h2>
        <p>Security-first infrastructure designed to keep your wallet and card activity protected.</p>
      </div>

      <div className="sticky-security">
        <div className="sec-stage" id="secStage" ref={stageRef}>
          {SECURITY_CARDS.map((card, i) => {
            const Icon = secIcons[i];
            return (
              <div className="sec-card" key={card.title} data-index={i}>
                <div>
                  <div className="sec-icon" aria-hidden="true"><Icon /></div>
                  <div className="sec-eyebrow">{card.eyebrow}</div>
                  <h3>{card.title}</h3>
                  <p>{card.body}</p>
                </div>
                <div className="sec-foot">
                  <div><div className="sec-stat">{card.stat}</div><div className="sec-stat-label">{card.statLabel}</div></div>
                  <div className="sec-index">{card.index}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
