import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './LandingPage.css';

function LandingPage() {
  const navigate = useNavigate();
  const canvasRef = useRef(null);

  // Particle canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = Array.from({ length: 90 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 2.2 + 0.5,
      dx: (Math.random() - 0.5) * 0.4,
      dy: -(Math.random() * 0.6 + 0.2),
      alpha: Math.random(),
      color: ['#ffd700','#ff9900','#ff6600','#ffcc00','#fff4aa'][Math.floor(Math.random()*5)],
    }));

    let animId;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        p.x += p.dx;
        p.y += p.dy;
        p.alpha += (Math.random() - 0.5) * 0.03;
        p.alpha = Math.max(0.1, Math.min(1, p.alpha));

        if (p.y < 0) { p.y = canvas.height; p.x = Math.random() * canvas.width; }
        if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
      });
      animId = requestAnimationFrame(draw);
    };
    draw();

    const onResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', onResize);
    return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', onResize); };
  }, []);

  const handleEnter = () => navigate('/home');

  const diyas = ['🪔','🪔','🪔','🪔','🪔'];
  const lanterns = ['🏮','🏮','🏮'];

  return (
    <div className="landingPage">
      <canvas ref={canvasRef} className="particle-canvas" />

      {/* Floating decorations */}
      {diyas.map((d, i) => <span key={i} className="diya">{d}</span>)}
      {lanterns.map((l, i) => <span key={i} className="lantern">{l}</span>)}

      {/* Rangoli rings */}
      <div className="rangoli-ring" />
      <div className="rangoli-ring inner" />
      <div className="rangoli-ring innermost" />

      {/* Top decorative strip */}
      <div className="diya-strip">
        {Array.from({length: 9}).map((_, i) => (
          <span key={i} className="strip-diya" style={{animationDelay:`${i*0.15}s`}}>🪔</span>
        ))}
      </div>

      {/* Main content */}
      <div className="landing-title-wrap">
        <p className="landing-subtitle">✦ For All My Best Friends ✦</p>
        <div className="diwaliText">Happy Diwali</div>

        {/* 🌟 ULTRA-VISIBLE ABHAY BADGE FOR FRIENDS 🌟 */}
        <div className="landing-abhay-badge">
          <span className="badge-sparkle">✨</span>
          <span className="badge-diya">🪔</span>
          <span className="badge-label">Happy Diwali from AbHaY..!!</span>
          <span className="badge-diya">🪔</span>
          <span className="badge-sparkle">✨</span>
        </div>

        <div className="diwali-emoji-row">
          <span>🎆</span><span>🪔</span><span>✨</span><span>🪔</span><span>🎇</span>
        </div>
        <p className="landing-tagline">Lighting up our friendship with love, laughter & endless crackers! 🎇</p>
      </div>

      <button className="enterButton" onClick={handleEnter} aria-label="Enter Diwali Wishes">
        <span className="btn-sparkle">✨</span>
        Tap to Open Wish 🪔
        <span className="btn-sparkle">✨</span>
      </button>

      <div className="landing-subfooter">
        <span>— SPREAD THE LIGHT & HAPPINESS —</span>
      </div>
    </div>
  );
}

export default LandingPage;
