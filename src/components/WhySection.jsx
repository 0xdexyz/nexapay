import { WHY_CARDS } from '../data/content.js';
import { whyIcons } from './Icons.jsx';
import { useRevealOnScroll } from '../hooks/useRevealOnScroll.js';

export default function WhySection(){
  const sectionRef = useRevealOnScroll({ threshold: 0.15, staggerMs: 90 });

  return (
    <section className="why" id="why" ref={sectionRef}>
      <div className="why-inner">
        <div className="why-head reveal-fade">
          <div className="badge">✦ Features</div>
          <h2>Everything you need to <em>spend crypto</em></h2>
          <p>A crypto-native card experience built around your wallet, your assets, and your everyday spending.</p>
        </div>

        <div className="why-grid">
          {WHY_CARDS.map((card, i) => {
            const Icon = whyIcons[i];
            return (
              <div className="why-card reveal-fade" key={card.title}>
                <div className="why-icon" aria-hidden="true"><Icon /></div>
                <h3>{card.title}</h3>
                <p>{card.body}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
