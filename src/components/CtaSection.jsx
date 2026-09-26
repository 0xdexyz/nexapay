import { useRevealOnScroll } from '../hooks/useRevealOnScroll.js';

export default function CtaSection({ onApplyOpen }){
  const sectionRef = useRevealOnScroll({ threshold: 0.2 });

  return (
    <section className="cta" ref={sectionRef}>
      <div className="cta-inner reveal-fade">
        <div className="badge">✦ Get started</div>
        <h2>Ready to <em>spend crypto</em> differently?</h2>
        <p>Connect your wallet, choose your card, and bring your crypto into your everyday spending experience.</p>
        <div className="cta-actions">
          <a href="#apply" className="btn btn-gold btn-lg" onClick={(e) => { e.preventDefault(); onApplyOpen(); }}>
            <span className="spark">✦</span> Get your card
          </a>
          <a href="#contact" className="btn btn-ghost btn-lg">Talk to us</a>
        </div>
      </div>
    </section>
  );
}
