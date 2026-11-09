import React, { useEffect, useState, useRef } from 'react';
import './WishPage.css';
import $ from 'jquery';

const FRIEND_DIWALI_MESSAGES = [
  "Hey bro! May your Diwali be filled with infinite happiness, sweet memories, and endless laughter! 🪔",
  "To my best friend: Wishing you glowing health, booming success, and unstoppable prosperity! ✨",
  "No Diwali celebration is complete without blasting crackers with friends! Have an epic, sparkling festival! 🎆",
  "May Goddess Lakshmi bless you and your family with peace, abundance, and bright fortune always! 💛",
  "Sending the biggest festival hugs and warmest blessings to you and your family! Have a rocking Diwali! 🎇",
];

const ABHAY_FRIEND_FORTUNES = [
  "AbHaY predicts: This year you will finally reply to WhatsApp messages within 2 hours instead of 2 weeks! 📱💀",
  "AbHaY predicts: Your crush will view your story within 5 seconds, but you will overthink the caption for 3 days! 😂",
  "AbHaY predicts: You will promise 'Gym from Monday' for the 64th time, but eat 5 hot Gulab Jamuns instead! 🍯",
  "AbHaY predicts: You will get rich enough to treat the whole gang, then immediately ask for Splitwise! 💵",
  "AbHaY predicts: You are officially the greatest friend in the universe. AbHaY is super lucky to have you, bro! 💛✨",
  "AbHaY predicts: 100% chance you look legendary in your Diwali kurta/dress today. Post that picture! 📸",
  "AbHaY predicts: Goddess Lakshmi is showering wealth and peace on you this year. Grab it with both hands! 🌟",
  "AbHaY predicts: You will secretly finish the entire box of Kaju Katli and blame your family! 🥮😋",
  "AbHaY predicts: No matter where life takes us, our friendship will always stay loud, safe, and rocking! 🎆",
];

const MITHAI_ITEMS = [
  { id: 'katli',  name: 'Kaju Katli',   icon: '🥮', note: 'Diamond luxury for a diamond friend! 💎' },
  { id: 'laddoo', name: 'Laddoo',       icon: '🟡', note: 'AbHaY says: Bhai, calories don’t count on Diwali! 😋' },
  { id: 'jamun',  name: 'Gulab Jamun',  icon: '🍯', note: 'Warm, juicy & full of festive sweetness! 🍯' },
  { id: 'jalebi', name: 'Crispy Jalebi',icon: '🥨', note: 'Twisted like our inside jokes, but 100% sweet! 🥨' },
];

function WishPage() {
  const [userName, setUserName]             = useState('');
  const [fireworks, setFireworks]           = useState(true);
  const [msgIdx, setMsgIdx]                 = useState(0);
  const [copied, setCopied]                 = useState(false);
  const [showCard, setShowCard]             = useState(false);
  const [confetti, setConfetti]             = useState([]);
  const [bgMusicPlaying, setBgMusicPlaying] = useState(false);

  // Active Tab: 'crackers' | 'game' | 'fortune' | 'dhol' | 'diyas'
  const [activeTab, setActiveTab]           = useState('crackers');

  // Tab 1: Cracker Arsenal
  const [selectedCracker, setSelectedCracker] = useState('rocket');
  const [crackerCount, setCrackerCount]     = useState(5);

  // Tab 2: 10s Patakha Rush Game
  const [gameState, setGameState]           = useState('idle'); // 'idle' | 'playing' | 'ended'
  const [gameScore, setGameScore]           = useState(0);
  const [gameTime, setGameTime]             = useState(10);
  const [highScore, setHighScore]           = useState(() => Number(localStorage.getItem('diwaliHighScore') || 0));
  const [gameTargets, setGameTargets]       = useState([]);
  const gameTimerRef                        = useRef(null);
  const gameSpawnRef                        = useRef(null);

  // Tab 3: Fortunes & Roasts
  const [fortuneIdx, setFortuneIdx]         = useState(0);
  const [fortuneFlipping, setFortuneFlipping] = useState(false);

  // Tab 4: Dhol Drum Beats
  const [activePad, setActivePad]           = useState(null);

  // Tab 5: Diyas & Sweets
  const [diyasLit, setDiyasLit]             = useState([false, false, false, false, false]);
  const [diyaSecretUnlocked, setDiyaSecretUnlocked] = useState(false);
  const [sweetCount, setSweetCount]         = useState(0);
  const [sweetMessage, setSweetMessage]     = useState('Tap sweets to feed your friend!');
  const [flyingSweets, setFlyingSweets]     = useState([]);

  // Screen shake on bomb explosions
  const [screenShaking, setScreenShaking]   = useState(false);

  const musicCtxRef = useRef(null);
  const musicIntervalRef = useRef(null);

  // Load user name
  useEffect(() => {
    const n = localStorage.getItem('userName');
    if (n) setUserName(n);
    setTimeout(() => setShowCard(true), 150);

    const iv = setInterval(() => setMsgIdx(i => (i + 1) % FRIEND_DIWALI_MESSAGES.length), 6000);
    return () => clearInterval(iv);
  }, []);

  // Initialize and run Fireworks
  useEffect(() => {
    let isMounted = true;
    const init = async () => {
      await import('./fireworks.js');
      if (!isMounted) return;
      $('.fireworks-container').fireworks({
        sound: true,
        opacity: 0.95
      });
      if (fireworks && $.fn.startFireworks) {
        $('.fireworks-container').startFireworks();
      }
    };
    init();

    return () => {
      isMounted = false;
      if ($.fn.stopFireworks) {
        $('.fireworks-container').stopFireworks();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Sync fireworks state
  useEffect(() => {
    if (!$.fn.startFireworks) return;
    if (fireworks) {
      $('.fireworks-container').show();
      $('.fireworks-container').startFireworks();
    } else {
      if ($.fn.stopFireworks) {
        $('.fireworks-container').stopFireworks();
      }
      $('.fireworks-container').hide();
    }
  }, [fireworks]);

  // Touch or Click sky to launch cracker
  const handleLaunchAt = (e) => {
    if (e.target.closest('.wish-card') || e.target.closest('.control-bar') || e.target.closest('.modal-overlay') || e.target.closest('.game-target')) return;
    
    let clientX = e.clientX;
    let clientY = e.clientY;
    if (e.touches && e.touches.length > 0) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else if (e.changedTouches && e.changedTouches.length > 0) {
      clientX = e.changedTouches[0].clientX;
      clientY = e.changedTouches[0].clientY;
    }
    if (clientX === undefined) clientX = window.innerWidth / 2;
    if (clientY === undefined) clientY = window.innerHeight * 0.45;

    if (!fireworks) setFireworks(true);
    setCrackerCount(c => c + 1);

    if (selectedCracker === 'rocket' && $.fn.fireworksTrigger) {
      $('.fireworks-container').fireworksTrigger(clientX);
    } else if (selectedCracker === 'anar' && $.fn.fireworksTriggerAnar) {
      $('.fireworks-container').fireworksTriggerAnar(clientX, clientY);
    } else if (selectedCracker === 'chakri' && $.fn.fireworksTriggerChakri) {
      $('.fireworks-container').fireworksTriggerChakri(clientX, clientY);
    } else if (selectedCracker === 'bomb' && $.fn.fireworksTriggerBomb) {
      $('.fireworks-container').fireworksTriggerBomb(clientX, clientY);
      setScreenShaking(true);
      setTimeout(() => setScreenShaking(false), 450);
    }
  };

  // Sparkler trail on finger touch drag
  const handleTouchMove = (e) => {
    if (e.touches && e.touches.length > 0 && $.fn.fireworksTriggerSparkler) {
      const touch = e.touches[0];
      if (!e.target.closest('.wish-card')) {
        $('.fireworks-container').fireworksTriggerSparkler(touch.clientX, touch.clientY);
      }
    }
  };

  // Confetti burst
  useEffect(() => {
    if (!showCard) return;
    const pieces = Array.from({ length: 45 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      color: ['#ffd700','#ff8c00','#ff2a6d','#05d9e8','#fffa65','#9b5de5'][i % 6],
      delay: Math.random() * 1.2,
      duration: 2.5 + Math.random() * 2,
    }));
    setConfetti(pieces);
    const t = setTimeout(() => setConfetti([]), 4500);
    return () => clearTimeout(t);
  }, [showCard]);

  // Festive Sitar/Flute Music Synth
  const toggleFestiveMusic = () => {
    if (bgMusicPlaying) {
      if (musicIntervalRef.current) clearInterval(musicIntervalRef.current);
      if (musicCtxRef.current) {
        try { musicCtxRef.current.close(); } catch(e){}
        musicCtxRef.current = null;
      }
      setBgMusicPlaying(false);
    } else {
      try {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        const ctx = new AudioCtx();
        musicCtxRef.current = ctx;

        const scale = [261.63, 293.66, 329.63, 392.00, 440.00, 523.25, 587.33, 659.25];
        let step = 0;

        const playNote = () => {
          if (!musicCtxRef.current || musicCtxRef.current.state === 'closed') return;
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';

          const freq = scale[step % scale.length];
          step = (step + Math.floor(Math.random() * 3 + 1)) % scale.length;
          osc.frequency.setValueAtTime(freq, ctx.currentTime);

          gain.gain.setValueAtTime(0.08, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 1.2);

          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start();
          osc.stop(ctx.currentTime + 1.2);
        };

        playNote();
        musicIntervalRef.current = setInterval(playNote, 500);
        setBgMusicPlaying(true);
      } catch (err) {
        console.warn('Audio error:', err);
      }
    }
  };

  const toggleFireworks = () => setFireworks(prev => !prev);

  // ==================== 10s PATAKHA RUSH MINI-GAME ====================
  const startGame = () => {
    setGameState('playing');
    setGameScore(0);
    setGameTime(10);
    setGameTargets([]);

    const spawnTarget = () => {
      const icons = ['🚀', '💣', '🪔', '🎇', '✨', '🟡'];
      const target = {
        id: Date.now() + Math.random(),
        icon: icons[Math.floor(Math.random() * icons.length)],
        x: 10 + Math.random() * 75,
        y: 15 + Math.random() * 65,
      };
      setGameTargets(prev => [...prev.slice(-4), target]);
    };

    spawnTarget();
    gameSpawnRef.current = setInterval(spawnTarget, 650);

    const startTime = Date.now();
    gameTimerRef.current = setInterval(() => {
      const elapsed = (Date.now() - startTime) / 1000;
      const remaining = Math.max(0, 10 - elapsed);
      setGameTime(remaining.toFixed(1));

      if (remaining <= 0) {
        clearInterval(gameTimerRef.current);
        clearInterval(gameSpawnRef.current);
        setGameState('ended');
        setGameTargets([]);
        // Grand celebration sound
        if ($.fn.fireworksTriggerBomb) $.fn.fireworksTriggerBomb(window.innerWidth / 2, window.innerHeight * 0.4);
      }
    }, 100);
  };

  const popTarget = (id, e) => {
    e.stopPropagation();
    if ($.fn.playPopSound) $.fn.playPopSound();
    setGameScore(s => {
      const next = s + 1;
      if (next > highScore) {
        setHighScore(next);
        localStorage.setItem('diwaliHighScore', String(next));
      }
      return next;
    });
    setGameTargets(prev => prev.filter(t => t.id !== id));
  };

  // Clean game timers on unmount
  useEffect(() => {
    return () => {
      if (gameTimerRef.current) clearInterval(gameTimerRef.current);
      if (gameSpawnRef.current) clearInterval(gameSpawnRef.current);
    };
  }, []);

  // ==================== ABHAY FORTUNES & ROASTS ====================
  const rollFortune = () => {
    setFortuneFlipping(true);
    if ($.fn.playDiyaBellTone) $.fn.playDiyaBellTone();
    setTimeout(() => {
      setFortuneIdx(i => (i + 1) % ABHAY_FRIEND_FORTUNES.length);
      setFortuneFlipping(false);
    }, 250);
  };

  // ==================== DIWALI DHOL DJ ====================
  const playDhol = (type) => {
    setActivePad(type);
    setTimeout(() => setActivePad(null), 180);
    if (type === 'bass' && $.fn.playDholBass) $.fn.playDholBass();
    if (type === 'treble' && $.fn.playDholTreble) $.fn.playDholTreble();
    if (type === 'bell' && $.fn.playDiyaBellTone) $.fn.playDiyaBellTone();
    if (type === 'bomb' && $.fn.fireworksTriggerBomb) {
      $.fn.fireworksTriggerBomb(window.innerWidth / 2, window.innerHeight * 0.4);
      setScreenShaking(true);
      setTimeout(() => setScreenShaking(false), 350);
    }
  };

  // ==================== DIYAS & MITHAI ====================
  const handleLightDiya = (idx) => {
    if (diyasLit[idx]) return;
    const nextLit = [...diyasLit];
    nextLit[idx] = true;
    setDiyasLit(nextLit);

    if ($.fn.playDiyaBellTone) $.fn.playDiyaBellTone();

    if (nextLit.every(Boolean)) {
      setTimeout(() => {
        setDiyaSecretUnlocked(true);
        if ($.fn.fireworksTriggerAnar) {
          $.fn.fireworksTriggerAnar(window.innerWidth * 0.25, window.innerHeight * 0.7);
          $.fn.fireworksTriggerAnar(window.innerWidth * 0.75, window.innerHeight * 0.7);
        }
      }, 500);
    }
  };

  const handleGrandFinale = () => {
    setDiyaSecretUnlocked(false);
    for (let i = 0; i < 7; i++) {
      setTimeout(() => {
        if ($.fn.fireworksTrigger) $.fn.fireworksTrigger(Math.random() * window.innerWidth);
        if (i % 2 === 0 && $.fn.fireworksTriggerAnar) {
          $.fn.fireworksTriggerAnar(Math.random() * window.innerWidth, window.innerHeight * 0.6);
        }
      }, i * 280);
    }
  };

  const handleFeedSweet = (sweet) => {
    setSweetCount(c => c + 1);
    setSweetMessage(sweet.note);
    if ($.fn.playDiyaBellTone) $.fn.playDiyaBellTone();

    const id = Date.now() + Math.random();
    setFlyingSweets(prev => [...prev, { id, icon: sweet.icon, x: 25 + Math.random() * 50 }]);
    setTimeout(() => {
      setFlyingSweets(prev => prev.filter(s => s.id !== id));
    }, 1400);
  };

  const handleCopy = () => {
    const text = `🪔✨ *Happy Diwali from AbHaY..!!* ✨🪔\n\nHey ${userName || 'Friend'}!\n\n"${FRIEND_DIWALI_MESSAGES[msgIdx]}"\n\n🎆 I blasted ${crackerCount} crackers & scored ${highScore} in Patakha Rush! 🏆\nCheck out your personalized wish: ${window.location.origin}${window.location.pathname}#/home`;
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  // WhatsApp 1-tap share with dynamic stats
  const handleWhatsAppShare = () => {
    const shareUrl = `${window.location.origin}${window.location.pathname}#/home`;
    const shareText = `🪔 *Happy Diwali from AbHaY..!!* ✨\n\nHey dost! AbHaY made an interactive Diwali world with loud crackers, a 10s Patakha Rush game, and DJ Dhol! 🎆\n\n👉 Open your wish & challenge my high score (${highScore}): ${shareUrl}`;
    const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;
    window.open(waUrl, '_blank');
  };

  const shareFortuneOnWhatsApp = () => {
    const shareUrl = `${window.location.origin}${window.location.pathname}#/home`;
    const shareText = `🔮 *AbHaY's Diwali Prediction for Me:* 🔮\n\n"${ABHAY_FRIEND_FORTUNES[fortuneIdx]}" 😂\n\nCheck yours here: ${shareUrl}`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`, '_blank');
  };

  const nextMessage = () => setMsgIdx(i => (i + 1) % FRIEND_DIWALI_MESSAGES.length);

  return (
    <div
      className={`wishPage ${screenShaking ? 'screen-shake' : ''}`}
      onClick={handleLaunchAt}
      onTouchStart={handleLaunchAt}
      onTouchMove={handleTouchMove}
    >
      {/* Interactive Fireworks Canvas Container */}
      <div className="fireworks-container" />

      {/* Floating mini-game targets */}
      {gameState === 'playing' && gameTargets.map(t => (
        <div
          key={t.id}
          className="game-target"
          style={{ left: `${t.x}%`, top: `${t.y}%` }}
          onClick={(e) => popTarget(t.id, e)}
          onTouchStart={(e) => popTarget(t.id, e)}
        >
          {t.icon}
        </div>
      ))}

      {/* Confetti Rain */}
      {confetti.map(c => (
        <div
          key={c.id}
          className="confetti-piece"
          style={{
            left: `${c.x}%`,
            background: c.color,
            animationDelay: `${c.delay}s`,
            animationDuration: `${c.duration}s`
          }}
        />
      ))}

      {/* Floating flying sweets animation */}
      {flyingSweets.map(s => (
        <div key={s.id} className="flying-sweet" style={{ left: `${s.x}%` }}>
          {s.icon}
        </div>
      ))}

      {/* Floating lanterns */}
      <div className="lanterns-container">
        {Array.from({ length: 5 }).map((_, i) => (
          <span
            key={i}
            className="wish-lantern"
            style={{
              left: `${10 + i * 20}%`,
              animationDelay: `${i * 0.8}s`,
              animationDuration: `${5.5 + i * 0.6}s`
            }}
          >🏮</span>
        ))}
      </div>

      {/* Top Floating Controls */}
      <div className="control-bar" onClick={e => e.stopPropagation()} onTouchStart={e => e.stopPropagation()}>
        <button
          className={`ctrl-btn ${bgMusicPlaying ? 'active' : ''}`}
          onClick={toggleFestiveMusic}
          title="Toggle Festive Melody"
        >
          {bgMusicPlaying ? '🎵 Music: ON' : '🔇 Music: OFF'}
        </button>
        <button
          className={`ctrl-btn ${fireworks ? 'active' : ''}`}
          onClick={toggleFireworks}
          title="Toggle Fireworks"
        >
          {fireworks ? '🎆 Fireworks: ON' : '🛑 Fireworks: OFF'}
        </button>
      </div>

      {/* Main Glass Wish Card */}
      <div
        className={`wish-card ${showCard ? 'card-visible' : ''}`}
        onClick={e => e.stopPropagation()}
        onTouchStart={e => e.stopPropagation()}
      >
        {/* Corner Ornaments */}
        <span className="wish-corner tl">❋</span>
        <span className="wish-corner tr">❋</span>
        <span className="wish-corner bl">❋</span>
        <span className="wish-corner br">❋</span>

        {/* 🌟 ULTRA HIGH CONTRAST & VISIBLE ABHAY BADGE FOR FRIENDS 🌟 */}
        <div className="abhay-badge">
          <span className="badge-sparkle">✨</span>
          <span className="badge-diya">🪔</span>
          <span className="badge-label">Happy Diwali from AbHaY..!!</span>
          <span className="badge-diya">🪔</span>
          <span className="badge-sparkle">✨</span>
        </div>

        {/* Title For Friends */}
        <h1 className="wish-title">
          Happy Diwali, <span className="wish-name">{userName || 'My Dear Friend'}</span>!
        </h1>
        <p className="friend-tagline">✦ Dedicated to my amazing friends ✦</p>

        {/* Rotating Diwali Message Box */}
        <div className="wish-message-box">
          <p className="wish-message" key={msgIdx}>
            "{FRIEND_DIWALI_MESSAGES[msgIdx]}"
          </p>
          <button className="next-msg-btn" onClick={nextMessage} title="Next Wish Quote">↻</button>
        </div>

        {/* 🎮 5 INTERACTIVE FESTIVE ACTIVITIES TABS 🎮 */}
        <div className="activities-tabs-scroll">
          <button
            className={`tab-btn ${activeTab === 'crackers' ? 'active' : ''}`}
            onClick={() => setActiveTab('crackers')}
          >
            🚀 Patakhas
          </button>
          <button
            className={`tab-btn ${activeTab === 'game' ? 'active' : ''}`}
            onClick={() => setActiveTab('game')}
          >
            🎯 10s Rush Game
          </button>
          <button
            className={`tab-btn ${activeTab === 'fortune' ? 'active' : ''}`}
            onClick={() => setActiveTab('fortune')}
          >
            🔮 Predictions
          </button>
          <button
            className={`tab-btn ${activeTab === 'dhol' ? 'active' : ''}`}
            onClick={() => setActiveTab('dhol')}
          >
            🥁 Dhol DJ
          </button>
          <button
            className={`tab-btn ${activeTab === 'diyas' ? 'active' : ''}`}
            onClick={() => setActiveTab('diyas')}
          >
            🪔 Diyas & Sweets
          </button>
        </div>

        {/* --- TAB 1: CRACKER ARSENAL --- */}
        {activeTab === 'crackers' && (
          <div className="tab-content cracker-arsenal">
            <p className="tab-instruction">Select cracker, then tap sky to blast with loud sounds!</p>
            <div className="cracker-grid">
              <button
                className={`cracker-card ${selectedCracker === 'rocket' ? 'selected' : ''}`}
                onClick={() => setSelectedCracker('rocket')}
              >
                <span className="c-icon">🚀</span>
                <span className="c-name">Rocket</span>
                <span className="c-desc">Sky Burst</span>
              </button>
              <button
                className={`cracker-card ${selectedCracker === 'anar' ? 'selected' : ''}`}
                onClick={() => setSelectedCracker('anar')}
              >
                <span className="c-icon">🌋</span>
                <span className="c-name">Anar</span>
                <span className="c-desc">Fountain</span>
              </button>
              <button
                className={`cracker-card ${selectedCracker === 'chakri' ? 'selected' : ''}`}
                onClick={() => setSelectedCracker('chakri')}
              >
                <span className="c-icon">🌀</span>
                <span className="c-name">Chakri</span>
                <span className="c-desc">Spinner</span>
              </button>
              <button
                className={`cracker-card bomb-card ${selectedCracker === 'bomb' ? 'selected' : ''}`}
                onClick={() => setSelectedCracker('bomb')}
              >
                <span className="c-icon">💣</span>
                <span className="c-name">Sutli Bomb</span>
                <span className="c-desc">Mega Boom</span>
              </button>
            </div>
            <div className="tab-status-strip">
              <span>🎆 Patakhas Blasted: <strong>{crackerCount}</strong></span>
              <span className="sparkler-tip">✨ Tip: Drag finger on sky to draw sparklers!</span>
            </div>
          </div>
        )}

        {/* --- TAB 2: 10-SECOND PATAKHA RUSH MINI GAME --- */}
        {activeTab === 'game' && (
          <div className="tab-content game-tab">
            {gameState === 'idle' && (
              <div className="game-screen-idle">
                <p className="game-heading">🎯 10-Second Patakha Rush!</p>
                <p className="tab-instruction">Tap as many bouncing crackers as you can in 10s!</p>
                <p className="high-score-text">🏆 Best Score: <strong>{highScore}</strong></p>
                <button className="game-start-btn" onClick={startGame}>
                  ▶ START 10s CHALLENGE
                </button>
              </div>
            )}

            {gameState === 'playing' && (
              <div className="game-screen-active">
                <div className="game-hud">
                  <span className="hud-timer">⏳ Time: <strong>{gameTime}s</strong></span>
                  <span className="hud-score">💥 Score: <strong>{gameScore}</strong></span>
                </div>
                <p className="game-live-hint">👉 TAP THE BOUNCING CRACKERS ON SCREEN QUICK!</p>
              </div>
            )}

            {gameState === 'ended' && (
              <div className="game-screen-ended">
                <p className="game-result-title">
                  {gameScore >= 16 ? '🔥 SUTLI BOMB LEGEND! 🔥' : (gameScore >= 9 ? '🚀 ROCKET MASTER! 🚀' : '🧨 PATAKHA NOOB! 😋')}
                </p>
                <p className="game-final-score">You Popped: <strong>{gameScore}</strong> Crackers!</p>
                <div className="game-btn-row">
                  <button className="game-play-again-btn" onClick={startGame}>
                    ↻ Play Again
                  </button>
                  <button className="game-share-btn" onClick={handleWhatsAppShare}>
                    💬 Challenge on WhatsApp
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* --- TAB 3: ABHAY'S FRIEND FORTUNES & ROASTS --- */}
        {activeTab === 'fortune' && (
          <div className="tab-content fortune-tab">
            <p className="fortune-heading">🔮 AbHaY's Diwali Bhavishyavani 🔮</p>
            <div className={`fortune-card ${fortuneFlipping ? 'flipping' : ''}`}>
              <span className="fortune-quote-mark">“</span>
              <p className="fortune-text">{ABHAY_FRIEND_FORTUNES[fortuneIdx]}</p>
            </div>
            <div className="fortune-actions">
              <button className="fortune-next-btn" onClick={rollFortune}>
                🎲 Draw Another Prediction
              </button>
              <button className="fortune-wa-btn" onClick={shareFortuneOnWhatsApp}>
                💬 Share on WhatsApp
              </button>
            </div>
          </div>
        )}

        {/* --- TAB 4: DIWALI DHOL DJ BEATS --- */}
        {activeTab === 'dhol' && (
          <div className="tab-content dhol-tab">
            <p className="tab-instruction">Tap the pads to create festival Bhangra & Dhol beats!</p>
            <div className="dhol-grid">
              <button
                className={`dhol-pad pad-bass ${activePad === 'bass' ? 'pad-hit' : ''}`}
                onClick={() => playDhol('bass')}
              >
                <span className="dhol-icon">🥁</span>
                <span className="dhol-name">Dhol Dhamaak</span>
                <span className="dhol-desc">Deep Bass</span>
              </button>
              <button
                className={`dhol-pad pad-treble ${activePad === 'treble' ? 'pad-hit' : ''}`}
                onClick={() => playDhol('treble')}
              >
                <span className="dhol-icon">🥢</span>
                <span className="dhol-name">Dhol Tilli</span>
                <span className="dhol-desc">Sharp Rim</span>
              </button>
              <button
                className={`dhol-pad pad-bell ${activePad === 'bell' ? 'pad-hit' : ''}`}
                onClick={() => playDhol('bell')}
              >
                <span className="dhol-icon">🔔</span>
                <span className="dhol-name">Mandir Ghanti</span>
                <span className="dhol-desc">Temple Bell</span>
              </button>
              <button
                className={`dhol-pad pad-bomb ${activePad === 'bomb' ? 'pad-hit' : ''}`}
                onClick={() => playDhol('bomb')}
              >
                <span className="dhol-icon">💥</span>
                <span className="dhol-name">Bomb Dhamaka</span>
                <span className="dhol-desc">Sub Bass</span>
              </button>
            </div>
          </div>
        )}

        {/* --- TAB 5: DIYAS & MITHAI --- */}
        {activeTab === 'diyas' && (
          <div className="tab-content diyas-mithai-tab">
            <p className="tab-instruction">Tap to light all 5 diyas & share sweets with friends!</p>
            <div className="diyas-row-interactive">
              {diyasLit.map((isLit, idx) => (
                <div
                  key={idx}
                  className={`diya-interactive-item ${isLit ? 'lit' : 'unlit'}`}
                  onClick={() => handleLightDiya(idx)}
                >
                  <div className={`diya-flame ${isLit ? 'flame-active' : ''}`}>🔥</div>
                  <div className="diya-body">🪔</div>
                  <span className="diya-num">#{idx + 1}</span>
                </div>
              ))}
            </div>
            <p className="diya-status">
              {diyasLit.every(Boolean)
                ? '🌟 ALL 5 DIYAS ARE LIT! Friendship Blessing Unlocked! 🌟'
                : `🪔 Lit: ${diyasLit.filter(Boolean).length} of 5 Diyas. Tap unlit diyas!`}
            </p>

            {/* Sweets Row */}
            <div className="mithai-grid mini">
              {MITHAI_ITEMS.map(item => (
                <button
                  key={item.id}
                  className="sweet-item-btn"
                  onClick={() => handleFeedSweet(item)}
                >
                  <span className="sweet-icon">{item.icon}</span>
                  <span className="sweet-name">{item.name}</span>
                </button>
              ))}
            </div>
            <p className="sweet-subtext">{sweetMessage} • 🍬 Sweets fed: <strong>{sweetCount}</strong></p>
          </div>
        )}

        {/* WhatsApp & Sharing Action Buttons */}
        <div className="wish-actions">
          <button
            className="wish-btn whatsapp-btn"
            onClick={handleWhatsAppShare}
            aria-label="Share on WhatsApp"
          >
            <span className="btn-icon">💬</span>
            <span>Share with Friends on WhatsApp</span>
          </button>

          <div className="secondary-actions-row">
            <button
              className="wish-btn copy-btn"
              onClick={handleCopy}
              aria-label="Copy Greeting"
            >
              {copied ? '✅ Wish Copied!' : '📋 Copy Wish'}
            </button>
            <button
              className="wish-btn next-quote-btn"
              onClick={nextMessage}
            >
              ✨ Next Blessing
            </button>
          </div>
        </div>

        {/* Signature Footer */}
        <div className="abhay-footer">
          <span>💛 Always your friend, <strong>AbHaY..!!</strong> 🪔</span>
        </div>
      </div>

      {/* Screen tap hint for mobile */}
      <p className="click-hint">💥 Tap anywhere on the sky to blast {selectedCracker}! 💥</p>

      {/* 🌟 DIYA QUEST UNLOCKED MODAL 🌟 */}
      {diyaSecretUnlocked && (
        <div className="modal-overlay" onClick={handleGrandFinale}>
          <div className="modal-card" onClick={e => e.stopPropagation()}>
            <div className="modal-icon">🪔 ✨ 🪔</div>
            <h2>FRIENDSHIP BLESSING UNLOCKED!</h2>
            <div className="abhay-modal-badge">✨ Special Note From AbHaY..!! ✨</div>
            <p className="modal-text">
              "Dear {userName || 'Friend'}, you lit all 5 sacred diyas! May our bond of friendship stay as luminous, loud, and indestructible as these Diwali celebrations! Love always, AbHaY..!! 💛"
            </p>
            <button className="modal-btn" onClick={handleGrandFinale}>
              🎆 Trigger Grand Finale Fireworks Show! 🎆
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default WishPage;
