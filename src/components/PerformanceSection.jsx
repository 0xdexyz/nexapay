import { useEffect, useMemo, useState } from 'react';
import { COLS, ROWS, DEFAULT_COL, METRICS, DATA, dateForCol, fmtLong } from '../data/metrics.js';
import { useRevealOnScroll } from '../hooks/useRevealOnScroll.js';

function clamp(v, min, max){ return Math.min(Math.max(v, min), max); }

export default function PerformanceSection(){
  const [currentKey, setCurrentKey] = useState('exec');
  const [currentCol, setCurrentCol] = useState(DEFAULT_COL);
  const [barsGrown, setBarsGrown] = useState(false);

  function growBars(){
    setBarsGrown(false);
    requestAnimationFrame(() => requestAnimationFrame(() => setBarsGrown(true)));
  }

  const sectionRef = useRevealOnScroll({ threshold: 0.3, staggerMs: 140, onReveal: growBars });

  const metric = useMemo(() => METRICS.find((m) => m.key === currentKey), [currentKey]);
  const cols = DATA[currentKey];
  const col = cols[currentCol];

  function selectMetric(key){
    setCurrentKey(key);
    setCurrentCol(DEFAULT_COL);
    growBars();
  }

  function handleMove(clientX, rect){
    const x = clamp(clientX - rect.left, 0, rect.width - 1);
    const c = Math.floor((x / rect.width) * COLS);
    if(c !== currentCol) setCurrentCol(c);
  }

  const x = ((currentCol + 0.5) / COLS) * 100;
  const y = ((ROWS - col.height + 0.5) / ROWS) * 100;
  const tipY = clamp(y - 42, 4, 62);
  const tooltipLeft = currentCol > COLS - 8 ? `calc(${x}% - 144px)` : `calc(${x}% + 12px)`;

  return (
    <section className="perf" id="performance" ref={sectionRef}>
      <div className="perf-inner">
        <div className="perf-head reveal-fade">
          <div className="badge">✦ Dashboard</div>
          <h2>Your spending, <em>in real time.</em></h2>
          <p>Track your card activity, spending volume, and transaction history from one simple crypto-native experience.</p>
        </div>

        <div className="perf-card reveal-fade">
          <div className="perf-tabs">
            {METRICS.map((m) => (
              <button
                key={m.key}
                className={'perf-tab' + (m.key === currentKey ? ' active' : '')}
                onClick={() => selectMetric(m.key)}
              >
                <span className="row1"><span className="icon">{m.icon}</span><span className="label">{m.label}</span></span>
                <span className="value">{m.value}</span>
                <span className={'change' + (m.down ? ' down' : '')}><b>{m.change}</b> this month</span>
              </button>
            ))}
          </div>
          <div className="perf-body">
            <div className="perf-chart-wrap">
              <div className="perf-ticks">
                {metric.ticks.map((t) => <span key={t}>{t}</span>)}
              </div>
              <div
                className="perf-chart"
                onMouseMove={(e) => handleMove(e.clientX, e.currentTarget.getBoundingClientRect())}
                onMouseLeave={() => setCurrentCol(DEFAULT_COL)}
                onTouchMove={(e) => {
                  const t = e.touches[0];
                  if(t) handleMove(t.clientX, e.currentTarget.getBoundingClientRect());
                }}
              >
                <div className="perf-grid">
                  {cols.map((c, i) => {
                    const secH = ((c.secondary - c.height) / ROWS) * 100;
                    const barH = (c.height / ROWS) * 100;
                    return (
                      <div key={i} className={'perf-col' + (i === currentCol ? ' active' : '')}>
                        <div className="perf-bar secondary" style={{ height: secH.toFixed(1) + '%' }} />
                        <div
                          className="perf-bar"
                          style={{
                            height: (barsGrown ? barH : 0).toFixed(1) + '%',
                            transition: `height .38s cubic-bezier(.22,.9,.3,1) ${i * 10}ms`
                          }}
                        />
                      </div>
                    );
                  })}
                </div>
                <div className="perf-cursor" style={{ left: x + '%' }} />
                <div className="perf-dot" style={{ left: x + '%', top: y + '%' }} />
                <div className="perf-tooltip" style={{ top: tipY + '%', left: tooltipLeft }}>
                  <div>{fmtLong.format(dateForCol(currentCol))}</div>
                  <div className="tv">{(metric.prefix || '') + col.value.toFixed(metric.precision) + metric.suffix}</div>
                </div>
              </div>
            </div>
            <div className="perf-months">
              <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span>
              <span>May</span><span>Jun</span><span>Jul</span><span>Aug</span>
              <span>Sep</span><span>Oct</span><span>Nov</span><span>Dec</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
