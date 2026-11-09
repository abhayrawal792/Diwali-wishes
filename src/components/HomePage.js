import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './HomePage.css';

function HomePage() {
  const [name, setName] = useState('');
  const [focused, setFocused] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();

  // Press Enter to submit
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Enter') handleSubmit(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  const handleSubmit = () => {
    if (!name.trim()) return;
    setSubmitted(true);
    localStorage.setItem('userName', name.trim());
    setTimeout(() => navigate('/wish'), 600);
  };

  const diyas = ['🪔','🪔','🪔','🪔','🪔','🪔','🪔'];

  return (
    <div className="homePage">
      {/* Animated background orbs */}
      <div className="orb orb1" /><div className="orb orb2" /><div className="orb orb3" />

      {/* Top & bottom diya rows */}
      <div className="diya-row top">
        {diyas.map((d,i) => <span key={i} className="row-diya" style={{animationDelay:`${i*0.18}s`}}>{d}</span>)}
      </div>

      {/* Card */}
      <div className={`glassCard ${submitted ? 'card-exit' : ''}`}>
        {/* Corner decorations */}
        <span className="corner tl">✦</span>
        <span className="corner tr">✦</span>
        <span className="corner bl">✦</span>
        <span className="corner br">✦</span>

        {/* Pattern line */}
        <div className="card-pattern">— ✦ 🪔 ✦ —</div>

        {/* 🌟 ULTRA VISIBLE ABHAY BADGE 🌟 */}
        <div className="home-abhay-badge">
          <span className="badge-sparkle">✨</span>
          <span className="badge-diya">🪔</span>
          <span className="badge-label">Happy Diwali from AbHaY..!!</span>
          <span className="badge-diya">🪔</span>
          <span className="badge-sparkle">✨</span>
        </div>

        <div className="card-icon">🪔</div>
        <h1>Hey Friend! 🌟<br/><span className="title-highlight">Your Diwali Wish</span></h1>
        <p className="card-subtext">Enter your name below to unlock your personalized fireworks & blessing:</p>

        <div className={`input-wrap ${focused ? 'focused' : ''} ${name ? 'has-value' : ''}`}>
          <label className="float-label">Your Name / Nickname</label>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            className="nameInput"
            maxLength={30}
            placeholder="Type your name here..."
            autoFocus
          />
          <span className="input-diya">🪔</span>
        </div>

        <button
          className={`submitButton ${name.trim() ? 'active' : ''}`}
          onClick={handleSubmit}
          disabled={!name.trim()}
          aria-label="Open Diwali Wish"
        >
          <span>Open My Diwali Wish</span>
          <span className="btn-icon">🎆</span>
        </button>

        <p className="enter-hint">Tap button above or press <kbd>Enter</kbd></p>

        {/* Bottom pattern */}
        <div className="card-pattern">— ✦ 🎇 ✦ —</div>
      </div>

      {/* Bottom diya row */}
      <div className="diya-row bottom">
        {diyas.map((d,i) => <span key={i} className="row-diya" style={{animationDelay:`${(diyas.length-i)*0.18}s`}}>{d}</span>)}
      </div>
    </div>
  );
}

export default HomePage;
