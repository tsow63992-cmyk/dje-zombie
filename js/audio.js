/* Dje_zombie — tout le son est synthétisé avec la Web Audio API (aucun fichier audio).
   Le contexte audio ne démarre qu'après le premier tap (contrainte des navigateurs mobiles). */
(function () {
  'use strict';
  var DJE = window.DJE;
  var A = DJE.audio = { pret: false, muet: false };
  var ctx = null, maitre, sfx, amb, reverb, echoIn, bruitBuf = null;
  var ambiance = { nom: null, noeuds: [], timers: [] };
  var coeur = { t: null, bpm: 0 };

  A.init = function () {
    if (ctx) { if (ctx.state === 'suspended') ctx.resume(); return; }
    var AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    try { ctx = new AC(); } catch (e) { return; }
    var comp = ctx.createDynamicsCompressor();
    comp.threshold.value = -14; comp.ratio.value = 4;
    maitre = ctx.createGain(); maitre.gain.value = A.muet ? 0 : 0.85;
    comp.connect(maitre); maitre.connect(ctx.destination);
    sfx = ctx.createGain(); sfx.gain.value = 1; sfx.connect(comp);
    amb = ctx.createGain(); amb.gain.value = 0.55; amb.connect(comp);
    /* réverbération synthétique */
    reverb = ctx.createConvolver();
    var long = ctx.sampleRate * 2.6, ir = ctx.createBuffer(2, long, ctx.sampleRate);
    for (var ch = 0; ch < 2; ch++) { var d = ir.getChannelData(ch); for (var i = 0; i < long; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / long, 3); }
    reverb.buffer = ir;
    var rg = ctx.createGain(); rg.gain.value = 0.35; reverb.connect(rg); rg.connect(comp);
    /* écho de vallée */
    echoIn = ctx.createGain();
    var del = ctx.createDelay(2); del.delayTime.value = 0.55;
    var fb = ctx.createGain(); fb.gain.value = 0.42;
    var lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 2600;
    echoIn.connect(del); del.connect(lp); lp.connect(fb); fb.connect(del); lp.connect(comp);
    bruitBuf = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate);
    var b = bruitBuf.getChannelData(0); for (var j = 0; j < b.length; j++) b[j] = Math.random() * 2 - 1;
    A.pret = true;
    if (ambiance.voulu) A.ambiance(ambiance.voulu, true);
  };

  A.setMuet = function (m) {
    A.muet = m;
    if (ctx) maitre.gain.setTargetAtTime(m ? 0 : 0.85, ctx.currentTime, 0.05);
  };

  /* ── briques de base ── */
  function t0() { return ctx.currentTime + 0.01; }
  function env(g, t, a, pic, rel, dur) {
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(Math.max(pic, 0.0002), t + a);
    g.gain.setValueAtTime(Math.max(pic, 0.0002), t + Math.max(a, dur - rel));
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  }
  function osc(type, f, t, dur, pic, o) {
    o = o || {};
    var n = ctx.createOscillator(), g = ctx.createGain();
    n.type = type; n.frequency.setValueAtTime(f, t);
    if (o.vers) n.frequency.exponentialRampToValueAtTime(o.vers, t + dur);
    env(g, t, o.a || 0.005, pic, o.r || dur * 0.8, dur);
    var sortie = g;
    if (o.filtre) { var fl = ctx.createBiquadFilter(); fl.type = o.filtre; fl.frequency.value = o.ff || 1000; fl.Q.value = o.q || 1; g.connect(fl); sortie = fl; }
    n.connect(g);
    if (o.pan) { var pn = ctx.createStereoPanner(); pn.pan.value = o.pan; sortie.connect(pn); sortie = pn; }
    sortie.connect(o.dest || sfx);
    if (o.rev) sortie.connect(reverb);
    if (o.echo) sortie.connect(echoIn);
    n.start(t); n.stop(t + dur + 0.05);
    return n;
  }
  function bruit(t, dur, pic, o) {
    o = o || {};
    var s = ctx.createBufferSource(), g = ctx.createGain(), f = ctx.createBiquadFilter();
    s.buffer = bruitBuf; s.loop = true;
    f.type = o.type || 'lowpass'; f.frequency.setValueAtTime(o.f || 1000, t); f.Q.value = o.q || 0.8;
    if (o.vers) f.frequency.exponentialRampToValueAtTime(o.vers, t + dur);
    env(g, t, o.a || 0.005, pic, o.r || dur * 0.8, dur);
    s.connect(f); f.connect(g);
    var sortie = g;
    if (o.pan) { var pn = ctx.createStereoPanner(); pn.pan.value = o.pan; g.connect(pn); sortie = pn; }
    sortie.connect(o.dest || sfx);
    if (o.rev) sortie.connect(reverb);
    s.start(t, Math.random()); s.stop(t + dur + 0.05);
    return s;
  }

  /* ── sons ── */
  var S = {};
  S.tick = function (aigu) {
    var t = t0();
    osc('square', aigu ? 1900 : 1500, t, 0.025, 0.12, { filtre: 'bandpass', ff: 2200 });
    bruit(t, 0.02, 0.18, { type: 'highpass', f: 3000 });
  };
  S.flash = function () {
    var t = t0();
    bruit(t, 0.5, 0.55, { type: 'highpass', f: 800, vers: 6000, rev: true });
    osc('sine', 150, t, 0.9, 0.9, { vers: 35 });
    osc('triangle', 600, t, 0.4, 0.2, { vers: 120, rev: true });
  };
  S.whoosh = function () { bruit(t0(), 0.6, 0.25, { type: 'bandpass', f: 300, vers: 2600, q: 1.5, a: 0.2 }); };
  S.clic = function () { osc('sine', 720, t0(), 0.06, 0.12); };
  S.jackpot = function () {
    var t = t0();
    [880, 1109, 1319, 1760, 2217].forEach(function (f, i) { osc('triangle', f, t + i * 0.09, 0.5, 0.18, { rev: true }); });
    bruit(t, 1.2, 0.08, { type: 'highpass', f: 6000, rev: true });
  };
  S.tension = function () {
    var t = t0();
    osc('sawtooth', 110, t, 2.4, 0.08, { vers: 220, filtre: 'lowpass', ff: 900, a: 0.6 });
    osc('sine', 55, t, 2.4, 0.25, { a: 0.4 });
  };
  S.nuit = function () {
    var t = t0();
    osc('sine', 70, t, 2.2, 0.6, { vers: 40, a: 0.02 });
    bruit(t, 1.8, 0.16, { type: 'lowpass', f: 2000, vers: 120, a: 0.6, rev: true });
  };
  S.indice = function () { var t = t0(); osc('sine', 1318, t, 0.35, 0.16, { rev: true }); osc('sine', 1760, t + 0.1, 0.45, 0.14, { rev: true }); };
  S.tape = function () { bruit(t0(), 0.025, 0.12, { type: 'bandpass', f: 2500, q: 2 }); };
  S.jauge = function () { osc('square', 300, t0(), 0.25, 0.04, { vers: 1200, filtre: 'lowpass', ff: 2000 }); };
  S.mort = function () {
    var t = t0();
    [55, 58.3, 61.7].forEach(function (f) { osc('sawtooth', f * 2, t, 3, 0.12, { vers: f, filtre: 'lowpass', ff: 600, a: 0.05, rev: true }); });
    bruit(t, 2.5, 0.12, { type: 'lowpass', f: 800, vers: 80, rev: true });
  };
  S.survie = function () {
    var t = t0();
    [523.25, 659.25, 783.99, 1046.5].forEach(function (f, i) { osc('triangle', f, t + i * 0.12, 2.6, 0.12, { a: 0.3, rev: true }); });
  };
  /* Le sifflement : sinus pur avec vibrato */
  S.siffle = function (arg) {
    var t = t0(), f = 2300, dur = 1.7, vol = 0.22, echo = false, motifs = [[0, dur]];
    if (arg === 'loin') { vol = 0.07; dur = 2.2; echo = true; motifs = [[0, dur]]; }
    if (arg === 'court') { vol = 0.2; motifs = [[0, 0.22], [0.32, 0.22], [0.64, 0.22], [1.0, 0.22], [1.32, 0.22]]; }
    if (arg === 'pres') { vol = 0.32; dur = 1.5; motifs = [[0, dur]]; }
    if (arg === 'echo') { vol = 0.2; echo = true; dur = 1.8; motifs = [[0, dur]]; }
    if (arg === 'tunnel') { vol = 0.16; echo = true; dur = 2; motifs = [[0, dur]]; }
    motifs.forEach(function (m) {
      var n = ctx.createOscillator(), g = ctx.createGain(), lfo = ctx.createOscillator(), lg = ctx.createGain();
      n.type = 'sine';
      n.frequency.setValueAtTime(f * 0.9, t + m[0]);
      n.frequency.exponentialRampToValueAtTime(f * 1.12, t + m[0] + m[1] * 0.35);
      n.frequency.exponentialRampToValueAtTime(f, t + m[0] + m[1]);
      lfo.frequency.value = 5.5; lg.gain.value = 38; lfo.connect(lg); lg.connect(n.frequency);
      env(g, t + m[0], Math.min(0.06, m[1] / 3), vol, Math.min(0.25, m[1] / 2), m[1]);
      n.connect(g);
      var sortie = g;
      if (arg === 'loin' || arg === 'tunnel') { var lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = arg === 'loin' ? 3400 : 2900; g.connect(lp); sortie = lp; }
      sortie.connect(sfx); sortie.connect(reverb);
      if (echo) sortie.connect(echoIn);
      n.start(t + m[0]); lfo.start(t + m[0]); n.stop(t + m[0] + m[1] + 0.05); lfo.stop(t + m[0] + m[1] + 0.05);
    });
  };
  S.pas = function (arg) {
    var t = t0(), n = 6, ecart = 0.45, vol = 0.35, ff = 500, alea = 0.05;
    if (arg === 'course') { n = 9; ecart = 0.19; vol = 0.4; }
    if (arg === 'loin') { n = 14; ecart = 0.2; vol = 0.12; ff = 260; alea = 0.15; }
    if (!arg) { n = 12; ecart = 0.24; vol = 0.25; alea = 0.12; }
    for (var i = 0; i < n; i++) {
      var tt = t + i * ecart + Math.random() * alea;
      bruit(tt, 0.09, vol, { type: 'lowpass', f: ff + Math.random() * 300, pan: (Math.random() - 0.5) * 0.8 });
      osc('sine', 85, tt, 0.07, vol * 0.8, { vers: 50 });
    }
  };
  S.cloche = function () {
    var t = t0(), base = 330, part = [[0.5, 6, 0.3], [1, 4, 0.35], [1.19, 3, 0.2], [1.5, 2.5, 0.18], [2, 2.2, 0.22], [2.5, 1.8, 0.12], [2.66, 1.6, 0.14], [3.01, 1.4, 0.1], [4.2, 1, 0.08], [5.4, 0.8, 0.06]];
    for (var k = 0; k < 4; k++) part.forEach(function (q) { osc('sine', base * q[0], t + k * 0.85, q[1], q[2] * 0.55, { a: 0.004, r: q[1], rev: true, echo: true }); });
  };
  S.phare = function () { var t = t0(); osc('sawtooth', 58, t, 2.4, 0.08, { filtre: 'lowpass', ff: 240, a: 0.3 }); for (var i = 0; i < 6; i++) bruit(t + i * 0.35, 0.03, 0.1, { type: 'bandpass', f: 1800 }); };
  S.corne = function () { var t = t0(); osc('sawtooth', 110, t, 2.8, 0.3, { filtre: 'lowpass', ff: 700, a: 0.25, rev: true }); osc('sawtooth', 111.6, t, 2.8, 0.3, { filtre: 'lowpass', ff: 700, a: 0.25 }); osc('sine', 55, t, 2.8, 0.35, { a: 0.25 }); };
  S.ventilation = function () { var t = t0(); bruit(t, 5, 0.42, { type: 'bandpass', f: 1800, q: 0.4, a: 1.2, r: 1 }); bruit(t, 5, 0.3, { type: 'lowpass', f: 160, a: 1, r: 1 }); osc('sawtooth', 96, t, 5, 0.06, { a: 1.2, filtre: 'lowpass', ff: 400 }); };
  S.sifflet = function () {
    var t = t0(), n = ctx.createOscillator(), g = ctx.createGain(), am = ctx.createOscillator(), ag = ctx.createGain();
    n.frequency.value = 3150; am.frequency.value = 28; ag.gain.value = 0.18; am.connect(ag); ag.connect(g.gain);
    env(g, t, 0.02, 0.22, 0.2, 1.4); n.connect(g); g.connect(sfx); g.connect(reverb); g.connect(echoIn);
    n.start(t); am.start(t); n.stop(t + 1.5); am.stop(t + 1.5);
  };
  S.bateau = function () { var t = t0(); for (var i = 0; i < 24; i++) osc('square', 46, t + i * 0.13, 0.09, 0.16, { filtre: 'lowpass', ff: 220 }); osc('sawtooth', 220, t + 2.2, 1.2, 0.12, { filtre: 'lowpass', ff: 900, rev: true }); };
  S.helico = function () { var t = t0(); for (var i = 0; i < 34; i++) bruit(t + i * 0.1, 0.07, 0.08 + 0.18 * Math.sin(i / 33 * Math.PI), { type: 'lowpass', f: 520 }); };
  S.train = function () {
    var t = t0();
    bruit(t, 3.5, 0.3, { type: 'lowpass', f: 140, vers: 420, a: 1.4 });
    for (var i = 0; i < 10; i++) bruit(t + 0.8 + i * 0.26, 0.05, 0.16, { type: 'bandpass', f: 900 });
    osc('sawtooth', 330, t + 2.4, 0.9, 0.08, { filtre: 'lowpass', ff: 1400, rev: true }); osc('sawtooth', 415, t + 2.4, 0.9, 0.08, { filtre: 'lowpass', ff: 1400 });
  };
  S.metal = function () { var t = t0(); [520, 1210, 1860, 2730].forEach(function (f, i) { osc('sine', f, t, 0.9 - i * 0.15, 0.14, { rev: true }); }); bruit(t, 0.05, 0.3, { type: 'highpass', f: 2500 }); };
  S.vague = function () { bruit(t0(), 2.2, 0.28, { type: 'lowpass', f: 300, vers: 1100, a: 0.9, r: 1.2 }); };
  S.grince = function () {
    var t = t0();
    for (var k = 0; k < 3; k++) {
      var n = ctx.createOscillator(), g = ctx.createGain(), f = ctx.createBiquadFilter();
      n.type = 'sawtooth'; f.type = 'bandpass'; f.frequency.value = 1100; f.Q.value = 7;
      var tt = t + k * 0.7;
      for (var i = 0; i < 24; i++) n.frequency.setValueAtTime(300 + Math.random() * 260, tt + i * 0.018);
      env(g, tt, 0.03, 0.35, 0.15, 0.45);
      n.connect(f); f.connect(g); g.connect(sfx); g.connect(reverb);
      n.start(tt); n.stop(tt + 0.5);
    }
  };
  S.eau = function () { var t = t0(); bruit(t, 0.5, 0.35, { type: 'bandpass', f: 900, vers: 300 }); for (var i = 0; i < 8; i++) osc('sine', 400 + Math.random() * 600, t + 0.1 + Math.random() * 0.5, 0.06, 0.08, { vers: 1200 }); };
  S.pierre = function () { var t = t0(); bruit(t, 0.03, 0.4, { type: 'highpass', f: 2000 }); osc('sine', 900, t, 0.05, 0.2); bruit(t + 0.6, 0.04, 0.18, { type: 'highpass', f: 1500, pan: 0.7, rev: true }); bruit(t + 0.75, 0.03, 0.1, { type: 'highpass', f: 1500, pan: 0.7 }); };
  S.porte = function () { var t = t0(); bruit(t, 0.3, 0.5, { type: 'lowpass', f: 500 }); osc('sine', 70, t, 0.25, 0.6, { vers: 40 }); };
  S.feu = function () {
    var t = t0();
    bruit(t, 3, 0.18, { type: 'lowpass', f: 380, a: 0.4 });
    for (var i = 0; i < 40; i++) bruit(t + Math.random() * 3, 0.008, 0.25 * Math.random(), { type: 'highpass', f: 2500 });
  };
  S.braise = S.feu;
  S.souffle = function () { bruit(t0(), 1.4, 0.16, { type: 'bandpass', f: 650, a: 0.6, r: 0.7 }); };
  S.craque = function () { var t = t0(); for (var i = 0; i < 3; i++) bruit(t + i * 0.07, 0.04, 0.4, { type: 'highpass', f: 1500 }); };
  S.chute = function () { var t = t0(); osc('sine', 60, t, 0.5, 0.8, { vers: 30 }); bruit(t, 0.6, 0.45, { type: 'lowpass', f: 400, rev: true }); };
  S.boum = S.chute;
  S.cri = function () {
    var t = t0(), n = ctx.createOscillator(), g = ctx.createGain(), f = ctx.createBiquadFilter(), l = ctx.createOscillator(), lg = ctx.createGain();
    n.type = 'sawtooth'; n.frequency.setValueAtTime(150, t); n.frequency.exponentialRampToValueAtTime(95, t + 1.3);
    l.frequency.value = 7; lg.gain.value = 8; l.connect(lg); lg.connect(n.frequency);
    f.type = 'bandpass'; f.frequency.value = 700; f.Q.value = 3;
    env(g, t, 0.15, 0.3, 0.5, 1.4); n.connect(f); f.connect(g); g.connect(sfx); g.connect(reverb);
    n.start(t); l.start(t); n.stop(t + 1.5); l.stop(t + 1.5);
  };
  S.vitre = function () { var t = t0(); bruit(t, 0.4, 0.3, { type: 'highpass', f: 4000 }); for (var i = 0; i < 14; i++) osc('sine', 2000 + Math.random() * 4000, t + Math.random() * 0.4, 0.1, 0.06); };
  S.rampe = function () { var t = t0(); for (var i = 0; i < 6; i++) bruit(t + i * 0.3, 0.26, 0.2, { type: 'bandpass', f: 380 + Math.random() * 200, q: 2, a: 0.08 }); };
  S.goutte = function () { osc('sine', 1300, t0(), 0.08, 0.1, { vers: 600, rev: true }); };
  S.brume = function () { var t = t0(); bruit(t, 3, 0.14, { type: 'bandpass', f: 320, q: 3, a: 1.2, r: 1.2, rev: true }); osc('sine', 220, t, 3, 0.05, { a: 1.2 }); osc('sine', 223, t, 3, 0.05, { a: 1.2 }); };
  S.thermique = function () { var t = t0(); bruit(t, 1.6, 0.06, { type: 'highpass', f: 6000, a: 0.3 }); osc('sine', 7200, t, 1.6, 0.025, { a: 0.3 }); osc('sawtooth', 80, t, 1.6, 0.05, { filtre: 'lowpass', ff: 300 }); };
  S.ecoute = function () { var t = t0(); for (var i = 0; i < 3; i++) bruit(t + i * 0.5, 0.35, 0.1, { type: 'bandpass', f: 2600, q: 4, a: 0.15 }); osc('sine', 180, t, 0.08, 0.2); };
  S.geant = function () { var t = t0(); for (var i = 0; i < 4; i++) { osc('sine', 48, t + i * 0.8, 0.45, 0.9, { vers: 28 }); bruit(t + i * 0.8, 0.3, 0.3, { type: 'lowpass', f: 300 }); } };
  S.cascade = function () { bruit(t0(), 3.5, 0.3, { type: 'lowpass', f: 2500, a: 0.6, r: 1 }); };
  S.extincteur = function () { bruit(t0(), 2, 0.4, { type: 'highpass', f: 900, a: 0.05, r: 0.5 }); };
  S.fusee = function () { var t = t0(); bruit(t, 1.5, 0.3, { type: 'bandpass', f: 2500, q: 0.7, a: 0.02 }); bruit(t, 0.06, 0.5, { type: 'highpass', f: 1000 }); };
  S.pluie = function () { var t = t0(); bruit(t, 4, 0.18, { type: 'highpass', f: 2500, a: 1, r: 1.5 }); for (var i = 0; i < 30; i++) bruit(t + Math.random() * 4, 0.01, 0.1, { type: 'highpass', f: 4000 }); };
  S.tonnerre = function () { bruit(t0(), 3.2, 0.5, { type: 'lowpass', f: 140, a: 0.1, r: 2.5, rev: true }); };
  S.vent = function () { bruit(t0(), 3, 0.2, { type: 'bandpass', f: 500, vers: 900, q: 1, a: 1, r: 1.2 }); };
  S.coeur = function () { A.coeurRapide(); };

  A.jouer = function (nom, arg) {
    if (!ctx || !A.pret) return;
    var f = S[nom];
    if (f) { try { f(arg); } catch (e) { /* un son raté ne doit jamais bloquer le jeu */ } }
  };

  /* Battements de cœur, rythme selon la peur */
  A.coeur = function (peur) {
    var bpm = peur >= 55 ? Math.round(64 + (peur - 55) * 1.7) : 0;
    coeur.bpm = bpm;
    if (!bpm) { clearTimeout(coeur.t); coeur.t = null; return; }
    if (!coeur.t) battre();
  };
  A.coeurRapide = function () { if (!ctx) return; var t = t0(); for (var i = 0; i < 4; i++) { osc('sine', 58, t + i * 0.42, 0.16, 0.7, { vers: 40 }); osc('sine', 52, t + i * 0.42 + 0.15, 0.14, 0.45, { vers: 38 }); } };
  function battre() {
    if (!coeur.bpm) { coeur.t = null; return; }
    if (ctx && A.pret && !A.muet) { var t = t0(); osc('sine', 58, t, 0.16, 0.42, { vers: 40 }); osc('sine', 52, t + 0.16, 0.14, 0.28, { vers: 38 }); }
    coeur.t = setTimeout(battre, 60000 / coeur.bpm);
  }

  /* Ambiances en boucle */
  A.ambiance = function (nom, force) {
    ambiance.voulu = nom;
    if (!ctx || !A.pret) return;
    if (ambiance.nom === nom && !force) return;
    var t = ctx.currentTime;
    ambiance.noeuds.forEach(function (n) {
      try { if (n.gain) { n.gain.setTargetAtTime(0.0001, t, 0.6); } if (n.stop) n.stop(t + 3); } catch (e) { /* déjà arrêté */ }
    });
    ambiance.timers.forEach(clearInterval);
    ambiance.noeuds = []; ambiance.timers = []; ambiance.nom = nom;
    if (!nom) return;
    function boucle(type, f, vol, lfoF, lfoA) {
      var s = ctx.createBufferSource(), fl = ctx.createBiquadFilter(), g = ctx.createGain();
      s.buffer = bruitBuf; s.loop = true; fl.type = type; fl.frequency.value = f; fl.Q.value = 0.7;
      g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(vol, t + 2.5);
      s.connect(fl); fl.connect(g); g.connect(amb);
      if (lfoF) {
        var l = ctx.createOscillator(), lg = ctx.createGain();
        l.frequency.value = lfoF; lg.gain.value = lfoA; l.connect(lg); lg.connect(fl.frequency); l.start(t);
        ambiance.noeuds.push(l);
      }
      s.start(t, Math.random()); ambiance.noeuds.push(s, g);
    }
    function nappe(f, vol) {
      var o = ctx.createOscillator(), g = ctx.createGain(), fl = ctx.createBiquadFilter();
      o.type = 'sawtooth'; o.frequency.value = f; fl.type = 'lowpass'; fl.frequency.value = 220;
      g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(vol, t + 3);
      o.connect(fl); fl.connect(g); g.connect(amb); o.start(t); ambiance.noeuds.push(o, g);
    }
    if (nom === 'vent') { boucle('bandpass', 420, 0.22, 0.07, 260); boucle('lowpass', 160, 0.12); }
    if (nom === 'mer') { boucle('lowpass', 520, 0.26, 0.11, 380); boucle('bandpass', 900, 0.06, 0.05, 400); }
    if (nom === 'metro') {
      boucle('lowpass', 90, 0.28); nappe(41, 0.05);
      ambiance.timers.push(setInterval(function () { if (Math.random() < 0.5) A.jouer('goutte'); }, 1700));
    }
    if (nom === 'titre') { nappe(55, 0.06); nappe(82.4, 0.04); boucle('bandpass', 380, 0.06, 0.05, 200); }
    if (nom === 'roulette') { nappe(49, 0.05); }
  };

  A.stopTout = function () { A.coeur(0); A.ambiance(null); };
  document.addEventListener('visibilitychange', function () {
    if (!ctx) return;
    if (document.hidden) ctx.suspend(); else if (!A.muet) ctx.resume();
  });
})();
