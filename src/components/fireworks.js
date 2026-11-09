import jQuery from 'jquery';

(function($) {
  // Web Audio Context for realistic, loud, high-impact firecracker sounds
  let audioCtx = null;
  let masterGain = null;
  let masterCompressor = null;

  function getAudioContext() {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        audioCtx = new AudioContext();
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    return audioCtx;
  }

  // High-gain master limiter node to maximize loudness without digital clipping
  function getAudioDestination(ctx) {
    if (!masterCompressor) {
      masterCompressor = ctx.createDynamicsCompressor();
      masterCompressor.threshold.setValueAtTime(-10, ctx.currentTime);
      masterCompressor.knee.setValueAtTime(6, ctx.currentTime);
      masterCompressor.ratio.setValueAtTime(14, ctx.currentTime);
      masterCompressor.attack.setValueAtTime(0.001, ctx.currentTime);
      masterCompressor.release.setValueAtTime(0.18, ctx.currentTime);

      masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(2.4, ctx.currentTime); // High volume booster!

      masterGain.connect(masterCompressor);
      masterCompressor.connect(ctx.destination);
    }
    return masterGain;
  }

  // 1. LOUD Rocket Firecracker Blast (Multi-layer Acoustic Explosion)
  function playCrackerBlast() {
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const dest = getAudioDestination(ctx);
      const now = ctx.currentTime;

      // Layer 1: Sharp Transient Crack (Initial punch)
      const bufferSize = Math.floor(ctx.sampleRate * 0.42);
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.07));
      }
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(4200, now);
      filter.frequency.exponentialRampToValueAtTime(160, now + 0.35);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(2.2, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.38);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(dest);

      // Layer 2: Heavy Sub-Bass Boom (Chest-thumping thump)
      const osc = ctx.createOscillator();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(180, now);
      osc.frequency.exponentialRampToValueAtTime(32, now + 0.32);

      const oscGain = ctx.createGain();
      oscGain.gain.setValueAtTime(1.8, now);
      oscGain.gain.exponentialRampToValueAtTime(0.01, now + 0.32);

      osc.connect(oscGain);
      oscGain.connect(dest);

      // Layer 3: Secondary Sub Body for prolonged rumble
      const sub = ctx.createOscillator();
      sub.type = 'sine';
      sub.frequency.setValueAtTime(95, now);
      sub.frequency.exponentialRampToValueAtTime(25, now + 0.38);

      const subGain = ctx.createGain();
      subGain.gain.setValueAtTime(1.2, now);
      subGain.gain.exponentialRampToValueAtTime(0.005, now + 0.38);

      sub.connect(subGain);
      subGain.connect(dest);

      noise.start(now);
      osc.start(now);
      sub.start(now);

      noise.stop(now + 0.4);
      osc.stop(now + 0.35);
      sub.stop(now + 0.4);
    } catch (e) {}
  }

  // 2. ULTRA LOUD Sutli / Atom Bomb (Massive High-Power Explosion)
  function playBombBlast() {
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const dest = getAudioDestination(ctx);
      const now = ctx.currentTime;

      // Heavy wideband burst with distortion feel
      const bufferSize = Math.floor(ctx.sampleRate * 0.65);
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        // High density blast waveform
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.12));
      }
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(6500, now);
      filter.frequency.exponentialRampToValueAtTime(90, now + 0.55);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(3.2, now); // EXTRA LOUD!
      gain.gain.exponentialRampToValueAtTime(0.005, now + 0.6);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(dest);

      // Super deep bass seismic rumble
      const osc = ctx.createOscillator();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(140, now);
      osc.frequency.exponentialRampToValueAtTime(20, now + 0.55);

      const oscGain = ctx.createGain();
      oscGain.gain.setValueAtTime(2.4, now);
      oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.55);

      osc.connect(oscGain);
      oscGain.connect(dest);

      noise.start(now);
      osc.start(now);
      noise.stop(now + 0.65);
      osc.stop(now + 0.6);
    } catch (e) {}
  }

  // 3. LOUD Anar (Fountain) Sizzle
  function playFountainSound() {
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const dest = getAudioDestination(ctx);
      const now = ctx.currentTime;

      const bufferSize = Math.floor(ctx.sampleRate * 0.35);
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize);
      }
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(3200, now);
      filter.Q.value = 2.5;

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.85, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.32);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(dest);

      noise.start(now);
      noise.stop(now + 0.35);
    } catch (e) {}
  }

  // 4. LOUD Chakri Whistle / Buzz
  function playChakriSound() {
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const dest = getAudioDestination(ctx);
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(450, now);
      osc.frequency.linearRampToValueAtTime(1100, now + 0.2);
      osc.frequency.linearRampToValueAtTime(320, now + 0.38);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.55, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.38);

      osc.connect(gain);
      gain.connect(dest);
      osc.start(now);
      osc.stop(now + 0.4);
    } catch (e) {}
  }

  // 5. Diya Bell Tone (Temple / Singing Bowl Chime)
  function playDiyaBell() {
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const dest = getAudioDestination(ctx);
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      osc.type = 'sine';
      const notes = [659.25, 783.99, 880.00, 1046.50, 1174.66];
      osc.frequency.value = notes[Math.floor(Math.random() * notes.length)];

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.6, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);

      osc.connect(gain);
      gain.connect(dest);
      osc.start(now);
      osc.stop(now + 1.2);
    } catch (e) {}
  }

  // 6. Dhol Bass (Dhamaak)
  function playDholBass() {
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const dest = getAudioDestination(ctx);
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(160, now);
      osc.frequency.exponentialRampToValueAtTime(50, now + 0.18);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(2.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

      osc.connect(gain);
      gain.connect(dest);
      osc.start(now);
      osc.stop(now + 0.22);
    } catch (e) {}
  }

  // 7. Dhol Treble (Taash / Chanti)
  function playDholTreble() {
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const dest = getAudioDestination(ctx);
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(950, now);
      osc.frequency.exponentialRampToValueAtTime(320, now + 0.08);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(1.6, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);

      osc.connect(gain);
      gain.connect(dest);
      osc.start(now);
      osc.stop(now + 0.1);
    } catch (e) {}
  }

  // 8. Pop Sound (for Mini-Game)
  function playPopSound() {
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const dest = getAudioDestination(ctx);
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(500 + Math.random() * 300, now);
      osc.frequency.exponentialRampToValueAtTime(80, now + 0.12);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(1.8, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.12);

      osc.connect(gain);
      gain.connect(dest);
      osc.start(now);
      osc.stop(now + 0.13);
    } catch (e) {}
  }

  $.fn.fireworks = function(options) {
    options = options || {};
    options.sound = options.sound !== undefined ? options.sound : true;
    options.opacity = options.opacity || 0.95;

    const fireworksField = this;
    const container = $(this)[0];
    if (!container) return this;

    // Check if canvas exists
    let canvas = container.querySelector('canvas.fireworks-canvas');
    if (!canvas) {
      canvas = document.createElement('canvas');
      canvas.className = 'fireworks-canvas';
      canvas.style.position = 'absolute';
      canvas.style.top = '0px';
      canvas.style.left = '0px';
      canvas.style.width = '100%';
      canvas.style.height = '100%';
      canvas.style.pointerEvents = 'none';
      canvas.style.zIndex = '1';
      container.appendChild(canvas);
    }

    let SCREEN_WIDTH = (canvas.width = window.innerWidth);
    let SCREEN_HEIGHT = (canvas.height = window.innerHeight);
    const context = canvas.getContext('2d');

    let particles = [];
    let rockets = [];
    let activeEffects = [];
    const MAX_PARTICLES = 650;
    let animId = null;
    let spawnTimer = null;
    let isRunning = false;

    // Particle
    function Particle(pos, color, customShrink, customGravity) {
      this.pos = { x: pos ? pos.x : 0, y: pos ? pos.y : 0 };
      this.vel = { x: 0, y: 0 };
      this.shrink = customShrink || 0.96;
      this.size = 2.6;
      this.resistance = 0.98;
      this.gravity = customGravity !== undefined ? customGravity : 0.12;
      this.alpha = 1;
      this.color = color !== undefined ? color : 45;
    }

    Particle.prototype.update = function() {
      this.vel.x *= this.resistance;
      this.vel.y *= this.resistance;
      this.vel.y += this.gravity;
      this.pos.x += this.vel.x;
      this.pos.y += this.vel.y;
      this.size *= this.shrink;
      this.alpha -= 0.015;
    };

    Particle.prototype.render = function(c) {
      if (!this.exists()) return;
      c.save();
      c.globalCompositeOperation = 'lighter';
      c.fillStyle = `hsla(${this.color}, 100%, 65%, ${Math.max(0, this.alpha)})`;
      c.shadowColor = `hsla(${this.color}, 100%, 75%, 0.9)`;
      c.shadowBlur = 8;
      c.beginPath();
      c.arc(this.pos.x, this.pos.y, Math.max(0.5, this.size), 0, Math.PI * 2);
      c.fill();
      c.restore();
    };

    Particle.prototype.exists = function() {
      return this.alpha > 0.04 && this.size > 0.5;
    };

    // Rocket
    function Rocket(x) {
      this.pos = { x: x, y: SCREEN_HEIGHT };
      this.vel = {
        x: (Math.random() - 0.5) * 4,
        y: -(Math.random() * 5 + 11)
      };
      this.size = 3.5;
      this.shrink = 0.999;
      this.gravity = 0.18;
      this.explosionColor = Math.floor(Math.random() * 360);
      this.targetY = Math.random() * (SCREEN_HEIGHT * 0.42) + SCREEN_HEIGHT * 0.1;
    }

    Rocket.prototype.update = function() {
      this.pos.x += this.vel.x;
      this.pos.y += this.vel.y;
      this.vel.y += this.gravity;
      if (Math.random() < 0.6) {
        const p = new Particle({ x: this.pos.x, y: this.pos.y }, 40);
        p.vel = { x: (Math.random() - 0.5) * 1.5, y: Math.random() * 2 };
        p.size = 1.6;
        p.alpha = 0.7;
        particles.push(p);
      }
    };

    Rocket.prototype.render = function(c) {
      c.save();
      c.fillStyle = '#ffdd44';
      c.shadowColor = '#ffaa00';
      c.shadowBlur = 12;
      c.beginPath();
      c.arc(this.pos.x, this.pos.y, this.size, 0, Math.PI * 2);
      c.fill();
      c.restore();
    };

    Rocket.prototype.explode = function() {
      playCrackerBlast();
      const count = 55 + Math.floor(Math.random() * 30);
      const angleStep = (Math.PI * 2) / count;
      const hue = this.explosionColor;

      for (let i = 0; i < count; i++) {
        const p = new Particle(this.pos, hue + (Math.random() * 40 - 20));
        const angle = i * angleStep + (Math.random() - 0.5) * 0.2;
        const speed = Math.random() * 6 + 2.5;
        p.vel = {
          x: Math.cos(angle) * speed,
          y: Math.sin(angle) * speed
        };
        p.size = Math.random() * 3 + 2;
        p.resistance = 0.94;
        p.shrink = 0.965;
        p.gravity = 0.14;
        particles.push(p);
      }
    };

    // Anar (Flowerpot Fountain Effect)
    function AnarEffect(x, y) {
      this.x = x || SCREEN_WIDTH / 2;
      this.y = y || SCREEN_HEIGHT - 40;
      this.duration = 70;
      this.frame = 0;
    }
    AnarEffect.prototype.update = function() {
      this.frame++;
      if (this.frame % 3 === 0) playFountainSound();
      for (let i = 0; i < 8; i++) {
        const p = new Particle({ x: this.x + (Math.random() - 0.5) * 10, y: this.y }, 45);
        const spread = (Math.random() - 0.5) * 5;
        const speedY = -(Math.random() * 8.5 + 6);
        p.vel = { x: spread, y: speedY };
        p.gravity = 0.22;
        p.size = Math.random() * 2.8 + 1.5;
        p.color = Math.random() < 0.2 ? 60 : (Math.random() < 0.5 ? 40 : 25);
        particles.push(p);
      }
      return this.frame < this.duration;
    };

    // Chakri (Ground Spinner Effect)
    function ChakriEffect(x, y) {
      this.x = x || SCREEN_WIDTH / 2;
      this.y = y || SCREEN_HEIGHT - 60;
      this.duration = 65;
      this.frame = 0;
      this.angle = 0;
    }
    ChakriEffect.prototype.update = function() {
      this.frame++;
      this.angle += 0.35;
      if (this.frame % 3 === 0) playChakriSound();
      for (let arm = 0; arm < 3; arm++) {
        const curAngle = this.angle + (arm * Math.PI * 2) / 3;
        const p = new Particle({
          x: this.x + Math.cos(curAngle) * 18,
          y: this.y + Math.sin(curAngle) * 18
        }, (this.frame * 8) % 360);
        p.vel = {
          x: Math.cos(curAngle + Math.PI / 2) * (Math.random() * 5 + 3),
          y: Math.sin(curAngle + Math.PI / 2) * (Math.random() * 5 + 3)
        };
        p.gravity = 0.05;
        p.shrink = 0.95;
        p.size = 2.4;
        particles.push(p);
      }
      return this.frame < this.duration;
    };

    // Sutli / Atom Bomb (LOUDEST blast with screen flash)
    function triggerAtomBomb(x, y) {
      const bombX = x || SCREEN_WIDTH / 2;
      const bombY = y || SCREEN_HEIGHT * 0.45;
      playBombBlast();

      context.save();
      context.fillStyle = 'rgba(255, 255, 255, 0.9)';
      context.fillRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
      context.restore();

      for (let i = 0; i < 150; i++) {
        const p = new Particle({ x: bombX, y: bombY }, Math.random() < 0.5 ? 20 : 45);
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 12 + 3;
        p.vel = { x: Math.cos(angle) * speed, y: Math.sin(angle) * speed };
        p.size = Math.random() * 4 + 2;
        p.gravity = 0.2;
        p.shrink = 0.955;
        particles.push(p);
      }
    }

    // Sparkler touch trail
    function triggerSparkler(x, y) {
      for (let i = 0; i < 6; i++) {
        const p = new Particle({ x: x + (Math.random() - 0.5) * 8, y: y + (Math.random() - 0.5) * 8 }, 45);
        p.vel = { x: (Math.random() - 0.5) * 4, y: (Math.random() - 0.5) * 4 };
        p.gravity = 0.08;
        p.size = Math.random() * 2.2 + 1;
        p.shrink = 0.94;
        particles.push(p);
      }
    }

    // Main animation loop
    function loop() {
      if (!context) return;
      SCREEN_WIDTH = canvas.width;
      SCREEN_HEIGHT = canvas.height;

      context.clearRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);

      activeEffects = activeEffects.filter(eff => eff.update());

      const survivingRockets = [];
      for (let r of rockets) {
        r.update();
        r.render(context);
        if (r.vel.y >= -1 || r.pos.y <= r.targetY) {
          r.explode();
        } else {
          survivingRockets.push(r);
        }
      }
      rockets = survivingRockets;

      const survivingParticles = [];
      for (let p of particles) {
        p.update();
        if (p.exists()) {
          p.render(context);
          survivingParticles.push(p);
        }
      }
      particles = survivingParticles;
      while (particles.length > MAX_PARTICLES) particles.shift();

      if (isRunning) {
        animId = requestAnimationFrame(loop);
      }
    }

    function spawnRocket(x) {
      const launchX = x !== undefined ? x : Math.random() * (SCREEN_WIDTH * 0.8) + SCREEN_WIDTH * 0.1;
      rockets.push(new Rocket(launchX));
    }

    function start() {
      if (isRunning) return;
      isRunning = true;
      getAudioContext();
      spawnRocket(SCREEN_WIDTH * 0.35);
      setTimeout(() => spawnRocket(SCREEN_WIDTH * 0.65), 250);
      setTimeout(() => spawnRocket(SCREEN_WIDTH * 0.5), 500);

      spawnTimer = setInterval(() => {
        if (rockets.length < 4) {
          spawnRocket();
          if (Math.random() < 0.35) {
            setTimeout(() => spawnRocket(), 200);
          }
        }
      }, 900);

      animId = requestAnimationFrame(loop);
    }

    function stop() {
      isRunning = false;
      if (spawnTimer) clearInterval(spawnTimer);
      if (animId) cancelAnimationFrame(animId);
      rockets = [];
      particles = [];
      activeEffects = [];
      context.clearRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
    }

    // Expose methods
    $.fn.startFireworks = start;
    $.fn.stopFireworks = stop;
    $.fn.fireworksTrigger = (x) => {
      getAudioContext();
      spawnRocket(x);
    };
    $.fn.fireworksTriggerAnar = (x, y) => {
      getAudioContext();
      activeEffects.push(new AnarEffect(x, y));
    };
    $.fn.fireworksTriggerChakri = (x, y) => {
      getAudioContext();
      activeEffects.push(new ChakriEffect(x, y));
    };
    $.fn.fireworksTriggerBomb = (x, y) => {
      getAudioContext();
      triggerAtomBomb(x, y);
    };
    $.fn.fireworksTriggerSparkler = (x, y) => {
      triggerSparkler(x, y);
    };
    $.fn.playDiyaBellTone = () => {
      playDiyaBell();
    };
    $.fn.playDholBass = () => {
      getAudioContext();
      playDholBass();
    };
    $.fn.playDholTreble = () => {
      getAudioContext();
      playDholTreble();
    };
    $.fn.playPopSound = () => {
      getAudioContext();
      playPopSound();
    };

    if (options.autoStart) {
      start();
    }

    return fireworksField;
  };
})(jQuery);
