/* Dje_zombie — petits outils pour l'interface. */
(function () {
  'use strict';
  var DJE = window.DJE, U = DJE.u = {};

  U.$ = function (s) { return document.querySelector(s); };
  U.el = function (tag, cls, html) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html != null) e.innerHTML = html;
    return e;
  };
  U.echap = function (s) {
    return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; });
  };
  /* Typographie française : espace insécable avant ? ! : ; et dans « » */
  U.typo = function (s) {
    return String(s).replace(/ ([?!:;»])/g, ' $1').replace(/« /g, '« ');
  };
  /* *mot* → mot en jaune ; [[son]] retiré */
  U.fmt = function (s) {
    return U.typo(U.echap(U.sansSons(s))).replace(/\*([^*]+)\*/g, '<span class="k">$1</span>');
  };
  U.sansSons = function (s) { return String(s).replace(/\[\[[^\]]+\]\]/g, ''); };
  U.nu = function (s) { return U.sansSons(s).replace(/\*/g, ''); };
  U.sons = function (s) {
    var out = [], m, re = /\[\[([^\]]+)\]\]/g;
    while ((m = re.exec(s))) { var p = m[1].split(':'); out.push({ nom: p[0], arg: p[1] }); }
    return out;
  };

  /* Attentes que l'on peut écourter d'un tap */
  var attentes = [];
  U.attendre = function (ms) {
    return new Promise(function (res) {
      var fini = false;
      function fin() {
        if (fini) return;
        fini = true;
        clearTimeout(t);
        var i = attentes.indexOf(fin);
        if (i >= 0) attentes.splice(i, 1);
        res();
      }
      var t = setTimeout(fin, ms);
      attentes.push(fin);
    });
  };
  U.passer = function () { var a = attentes.slice(); attentes.length = 0; a.forEach(function (f) { f(); }); };
  U.pause = function (ms) { return new Promise(function (res) { setTimeout(res, ms); }); };

  U.ease = {
    outQuart: function (t) { return 1 - Math.pow(1 - t, 4); },
    outCubic: function (t) { return 1 - Math.pow(1 - t, 3); },
    inOut: function (t) { return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2; }
  };
  U.reduit = function () { return document.body.classList.contains('reduit'); };

  /* Une seule promesse « clic sur un bouton » à la fois */
  U.surClic = function (el, fn) {
    el.addEventListener('click', function (ev) { ev.stopPropagation(); fn(ev); });
    return el;
  };

  U.taille = function () {
    var st = document.getElementById('stage');
    if (!st) return;
    var w = st.getBoundingClientRect().width;
    st.style.setProperty('--u', (w / 100).toFixed(2) + 'px');
    if (DJE.fx && DJE.fx.redim) DJE.fx.redim();
  };
})();
