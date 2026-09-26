import { useEffect, useRef } from 'react';

export default function WaterCursorFx(){
  const canvasRef = useRef(null);

  useEffect(() => {
    const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if(reduceMotion) return;

    const fx = canvasRef.current;
    const ctx = fx.getContext('2d');
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let W, H;
    let raf;

    function resizeFx(){
      W = window.innerWidth; H = window.innerHeight;
      fx.width = W * dpr; fx.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    resizeFx();
    window.addEventListener('resize', resizeFx);

    let ripples = [];
    const pointer = { x: W / 2, y: H / 2, active: false };
    let lastSpawn = 0;

    function spawnRipple(x, y, strength){
      ripples.push({ x, y, r: 2, alpha: 0.5 * strength, speed: 2.4 + Math.random() * 0.8 });
      if(ripples.length > 40) ripples.shift();
    }

    function pointerMove(x, y){
      pointer.x = x; pointer.y = y; pointer.active = true;
      const now = performance.now();
      if(now - lastSpawn > 55){
        lastSpawn = now;
        spawnRipple(x, y, 1);
      }
    }

    const onMouseMove = (e) => pointerMove(e.clientX, e.clientY);
    const onTouchMove = (e) => {
      if(e.touches && e.touches[0]) pointerMove(e.touches[0].clientX, e.touches[0].clientY);
    };
    const onMouseLeave = () => { pointer.active = false; };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    window.addEventListener('mouseleave', onMouseLeave);

    function drawFx(){
      ctx.clearRect(0, 0, W, H);

      if(pointer.active){
        const glow = ctx.createRadialGradient(pointer.x, pointer.y, 0, pointer.x, pointer.y, 140);
        glow.addColorStop(0, 'rgba(224,200,120,0.85)');
        glow.addColorStop(1, 'rgba(255,255,255,1)');
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(pointer.x, pointer.y, 140, 0, Math.PI * 2);
        ctx.fill();
      }

      for(let i = ripples.length - 1; i >= 0; i--){
        const r = ripples[i];
        r.r += r.speed;
        r.alpha *= 0.965;
        if(r.alpha < 0.01 || r.r > 220){
          ripples.splice(i, 1);
          continue;
        }
        ctx.beginPath();
        ctx.arc(r.x, r.y, r.r, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(201,162,39,' + r.alpha.toFixed(3) + ')';
        ctx.lineWidth = 1.4;
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(r.x, r.y, r.r * 0.62, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(201,162,39,' + (r.alpha * 0.5).toFixed(3) + ')';
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      raf = requestAnimationFrame(drawFx);
    }
    drawFx();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resizeFx);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('mouseleave', onMouseLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      id="waterCursorFx"
      style={{
        position: 'fixed',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 3,
        mixBlendMode: 'multiply'
      }}
    />
  );
}
