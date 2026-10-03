/* ------------------------------------------------------------------
   Slot machine sounds, synthesised with the Web Audio API (no files).
   Browsers only allow audio after a user gesture, so the context is
   created by unlock(), which the machine calls from pointer / key
   events. Until then every sound is silently skipped.
   ------------------------------------------------------------------ */

export function createSlotSound() {
  let ctx = null;
  let out = null;
  let noiseBuffer = null;
  let enabled = true;

  const live = () => (enabled && ctx && ctx.state === 'running' ? ctx : null);

  const unlock = () => {
    if (!enabled) return;
    if (!ctx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return;
      try {
        ctx = new AC();
      } catch {
        return;
      }
      const master = ctx.createGain();
      master.gain.value = 0.5;
      const limiter = ctx.createDynamicsCompressor();
      master.connect(limiter);
      limiter.connect(ctx.destination);
      out = master;

      noiseBuffer = ctx.createBuffer(1, Math.floor(ctx.sampleRate * 0.3), ctx.sampleRate);
      const data = noiseBuffer.getChannelData(0);
      for (let i = 0; i < data.length; i += 1) data[i] = Math.random() * 2 - 1;
    }
    if (ctx.state === 'suspended') ctx.resume().catch(() => {});
  };

  const envelope = (gain, at, peak, attack, decay) => {
    gain.gain.setValueAtTime(0.0001, at);
    gain.gain.exponentialRampToValueAtTime(peak, at + attack);
    gain.gain.exponentialRampToValueAtTime(0.0001, at + attack + decay);
  };

  /* pitched voice: optional glide from f0 to f1, optional low-pass */
  const tone = (c, { type = 'sine', f0, f1 = f0, dur, vol, delay = 0, attack = 0.004, lowpass }) => {
    const at = c.currentTime + delay;
    const osc = c.createOscillator();
    const gain = c.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(f0, at);
    if (f1 !== f0) osc.frequency.exponentialRampToValueAtTime(f1, at + dur);
    envelope(gain, at, vol, attack, dur);
    let node = osc;
    if (lowpass) {
      const filter = c.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = lowpass;
      osc.connect(filter);
      node = filter;
    }
    node.connect(gain);
    gain.connect(out);
    osc.start(at);
    osc.stop(at + attack + dur + 0.03);
  };

  /* filtered burst of noise: clicks, thuds, rattles */
  const burst = (c, { filter = 'bandpass', freq, q = 1, dur, vol, delay = 0 }) => {
    const at = c.currentTime + delay;
    const src = c.createBufferSource();
    const biquad = c.createBiquadFilter();
    const gain = c.createGain();
    src.buffer = noiseBuffer;
    biquad.type = filter;
    biquad.frequency.value = freq;
    biquad.Q.value = q;
    envelope(gain, at, vol, 0.002, dur);
    src.connect(biquad);
    biquad.connect(gain);
    gain.connect(out);
    src.start(at, Math.random() * 0.2);
    src.stop(at + dur + 0.03);
  };

  return {
    unlock,

    setEnabled(value) {
      enabled = value;
      if (ctx) {
        if (value) ctx.resume().catch(() => {});
        else ctx.suspend().catch(() => {});
      }
    },

    /* a symbol passing the pay-line; each reel has its own pitch */
    tick(reel) {
      const c = live();
      if (!c) return;
      burst(c, { freq: [1500, 1900, 2350][reel] || 1800, q: 7, dur: 0.022, vol: 0.2 });
      tone(c, { type: 'triangle', f0: 620, f1: 300, dur: 0.012, vol: 0.06 });
    },

    /* a reel locking into place */
    thunk(reel) {
      const c = live();
      if (!c) return;
      tone(c, { f0: [180, 160, 140][reel] || 160, f1: 58, dur: 0.12, vol: 0.5 });
      burst(c, { filter: 'lowpass', freq: 520, dur: 0.06, vol: 0.26 });
    },

    /* the lever's ratchet while it is being pulled */
    ratchet() {
      const c = live();
      if (!c) return;
      burst(c, { freq: 3200, q: 4, dur: 0.01, vol: 0.11 });
    },

    /* the lever hitting the bottom of its travel */
    clunk() {
      const c = live();
      if (!c) return;
      tone(c, { f0: 125, f1: 44, dur: 0.17, vol: 0.7 });
      burst(c, { freq: 320, q: 1.2, dur: 0.09, vol: 0.38 });
      tone(c, { type: 'square', f0: 72, dur: 0.05, vol: 0.08 });
    },

    /* the lever springing back against its top stop */
    clack() {
      const c = live();
      if (!c) return;
      burst(c, { freq: 1250, q: 3, dur: 0.026, vol: 0.17 });
      tone(c, { type: 'triangle', f0: 420, f1: 210, dur: 0.03, vol: 0.09 });
    },

    /* pay-out: a rising arpeggio, a held chord and a spray of coins */
    win() {
      const c = live();
      if (!c) return;
      [659.25, 783.99, 987.77, 1318.51].forEach((f, i) => {
        tone(c, { f0: f, dur: 0.5, vol: 0.26, delay: i * 0.09 });
        tone(c, { type: 'triangle', f0: f * 2, dur: 0.22, vol: 0.07, delay: i * 0.09 });
      });
      [783.99, 987.77, 1318.51].forEach((f) => {
        tone(c, { f0: f, dur: 0.95, vol: 0.14, delay: 0.42, attack: 0.02 });
      });
      for (let i = 0; i < 9; i += 1) {
        tone(c, { f0: 2400 + Math.random() * 1900, dur: 0.05, vol: 0.08, delay: 0.45 + i * 0.06 + Math.random() * 0.03 });
      }
    },

    /* no pay-out: three sagging notes and a dull thud */
    lose() {
      const c = live();
      if (!c) return;
      tone(c, { type: 'sawtooth', f0: 220, f1: 214, dur: 0.17, vol: 0.2, lowpass: 750 });
      tone(c, { type: 'sawtooth', f0: 207.65, f1: 200, dur: 0.17, vol: 0.2, delay: 0.18, lowpass: 700 });
      tone(c, { type: 'sawtooth', f0: 174.61, f1: 118, dur: 0.55, vol: 0.22, delay: 0.36, lowpass: 620, attack: 0.01 });
      tone(c, { f0: 92, f1: 40, dur: 0.32, vol: 0.5, delay: 0.56 });
      burst(c, { filter: 'lowpass', freq: 300, dur: 0.14, vol: 0.2, delay: 0.56 });
    },
  };
}
