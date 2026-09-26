import { useRef, useState } from 'react';
import StarsField from './StarsField.jsx';
import { CardMarkIcon } from './Icons.jsx';

const CARD_TEX = ['tex-a', 'tex-b', 'tex-c'];
const SLOT_NAMES = ['front', 'left', 'right'];

function Card({ tex, slot, floating, onClick }){
  return (
    <div
      className={`card3d ${tex} slot-${slot}${floating ? ' floating' : ''}`}
      onClick={onClick}
    >
      <span className="card-texture" aria-hidden="true"></span>
      <div className="card-mark" aria-hidden="true"><CardMarkIcon /></div>
      <div className="chip"></div>
      <div className="card-mid">
        <span>Yur Name.</span>
        <span>Yor Thing</span>
      </div>
      <div className="card-bottom">
        <div className="card-bank">Nexapay <span>card</span></div>
        <div className="visa">VISA</div>
      </div>
    </div>
  );
}

export default function Hero({ onApplyOpen }){
  // order[i] = texture index shown in slot SLOT_NAMES[i]
  const [order, setOrder] = useState([0, 1, 2]);
  const [floating, setFloating] = useState(true);
  const transitioningRef = useRef(false);

  function cycleCards(){
    if(transitioningRef.current) return;
    transitioningRef.current = true;
    setFloating(false);

    setTimeout(() => {
      setOrder((prev) => [prev[1], prev[2], prev[0]]);
    }, 0);

    setTimeout(() => {
      setFloating(true);
      transitioningRef.current = false;
    }, 680);
  }

  return (
    <div className="scene">
      <StarsField />
      <div className="water"></div>

      <main>
        <div className="badge">✦ Crypto-native card</div>
        <h1>Spend <em>crypto</em>.<br />Anywhere you use a <em>card</em>.</h1>
        <p className="sub">Connect your wallet, get your card, and turn your crypto into everyday spending power — without the traditional banking setup.</p>

        <div className="signup signup-cta">
          <a href="#apply" className="btn btn-solid btn-signup" onClick={(e) => { e.preventDefault(); onApplyOpen(); }}>
            <span className="spark">✦</span> Get your card
          </a>
        </div>

        <div className="card-stage" id="cardStage">
          <div className="glow"></div>
          {order.map((texIdx, i) => (
            <Card
              key={texIdx}
              tex={CARD_TEX[texIdx]}
              slot={SLOT_NAMES[i]}
              floating={floating}
              onClick={SLOT_NAMES[i] === 'front' ? cycleCards : undefined}
            />
          ))}
        </div>
      </main>
    </div>
  );
}
