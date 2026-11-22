#!/usr/bin/env python3
"""Dje_zombie — vérifications diverses : voix simulée, menu pause, animations réduites,
écran de mort, petit téléphone (360×640)."""
import os, pathlib, sys, time
from playwright.sync_api import sync_playwright
RACINE = pathlib.Path(__file__).resolve().parent.parent
D = sys.argv[1] if len(sys.argv) > 1 else '/tmp/divers'
os.makedirs(D, exist_ok=True)
URL = (RACINE / 'index.html').as_uri()
FAUSSE_VOIX = '''
  window.__dits = [];
  const v = { name: 'Voix test', lang: 'fr-FR', localService: true };
  const synth = { getVoices: () => [v], speak: (u) => { window.__dits.push(u.text); setTimeout(() => u.onend && u.onend(), 120); },
    cancel: () => {}, pause: () => {}, resume: () => {}, onvoiceschanged: null };
  Object.defineProperty(window, 'speechSynthesis', { value: synth });
  window.SpeechSynthesisUtterance = function (t) { this.text = t; };
'''
erreurs = []
def suivre(page, err, jusqua='resultat', limite=150, choix='1'):
    debut = time.time()
    while time.time() - debut < limite:
        time.sleep(0.12)
        e = page.evaluate('''() => { const q = s => document.querySelector(s); return { objets: !!q('.objets-p'), res: !!q('.resultat-p img'), fin: !!q('.fin-p'),
          choix: document.querySelectorAll('#choix .choix-b:not([disabled])').length, bouton: !!q('#ecran .bouton.or:not([disabled])'), menu: !!q('.menu-p') } }''')
        if jusqua == 'fin' and e['fin']: return True
        if e['res']: return True
        if e['objets']:
            for o in ('1', '2', '3'): page.keyboard.press(o)
            page.keyboard.press('Enter'); continue
        if e['choix']:
            page.evaluate('''(n) => { const b = [...document.querySelectorAll('#choix .choix-b')]; const c = (b[n - 1] && !b[n - 1].disabled) ? b[n - 1] : b.find(x => !x.disabled); if (c) c.click(); }''', int(choix))
            time.sleep(0.4); continue
        if e['bouton']:
            try: page.click('#ecran .bouton.or:not([disabled])', timeout=1000)
            except Exception: pass
            continue
        page.keyboard.press('Space')
    err.append('limite de temps atteinte (%s)' % jusqua); return False

with sync_playwright() as p:
    nav = p.chromium.launch(executable_path='/usr/bin/google-chrome')
    # 1. Voix simulée + menu pause
    ctx = nav.new_context(viewport={'width': 390, 'height': 844})
    ctx.add_init_script(FAUSSE_VOIX)
    page = ctx.new_page()
    page.on('pageerror', lambda e: erreurs.append('voix: ' + str(e)))
    page.goto(URL + '?vite'); time.sleep(1)
    page.click('[data-opt="voix"]'); time.sleep(0.2)
    print('libellé voix :', page.inner_text('[data-opt="voix"]'))
    page.click('[data-a="libre"]'); time.sleep(4)
    page.keyboard.press('Escape'); time.sleep(0.4)
    en_pause = page.evaluate('() => DJE.jeu.pause'); page.screenshot(path=D + '/menu_pause.png')
    st_avant = page.inner_text('#soustitres'); time.sleep(1.5); st_apres = page.inner_text('#soustitres')
    print('pause active :', en_pause, '· sous-titres figés pendant la pause :', st_avant == st_apres)
    if not en_pause: erreurs.append('Le menu ne met pas le jeu en pause')
    page.click('[data-a="reprendre"]')
    suivre(page, erreurs)
    nb = page.evaluate('() => window.__dits.length')
    print('phrases dites par la voix :', nb)
    if nb < 10: erreurs.append('La voix n\'a presque rien dit')
    ctx.close()
    # 2. Animations réduites + écran de mort
    ctx = nav.new_context(viewport={'width': 390, 'height': 844}, reduced_motion='reduce', device_scale_factor=2)
    page = ctx.new_page(); page.on('pageerror', lambda e: erreurs.append('réduit: ' + str(e)))
    page.goto(URL + '?vite&z=brume&l=village'); time.sleep(1)
    print('mode réduit activé :', page.evaluate("() => document.body.classList.contains('reduit')"))
    if suivre(page, erreurs, 'fin', choix='4'):
        time.sleep(0.6); page.screenshot(path=D + '/fin_mort.png')
        print('fin atteinte :', page.inner_text('.fin-p .verdict'))
    ctx.close()
    # 3. Petit téléphone
    ctx = nav.new_context(viewport={'width': 360, 'height': 640}, device_scale_factor=2)
    page = ctx.new_page(); page.on('pageerror', lambda e: erreurs.append('360: ' + str(e)))
    page.goto(URL); time.sleep(1); page.screenshot(path=D + '/petit_titre.png')
    page.goto(URL + '?vite&z=siffleur&l=village'); 
    debut = time.time()
    while time.time() - debut < 90:
        time.sleep(0.12)
        sc = page.evaluate('() => DJE.jeu.sceneId')
        n = page.evaluate("() => document.querySelectorAll('#choix .choix-b').length")
        if page.query_selector('.objets-p'):
            page.screenshot(path=D + '/petit_objets.png')
            for o in ('1', '2', '3'): page.keyboard.press(o)
            page.keyboard.press('Enter'); continue
        if n >= 3 and sc == 'n1':
            time.sleep(0.6); page.screenshot(path=D + '/petit_choix.png')
            # vérifie que rien ne déborde de l'écran
            deb = page.evaluate('''() => { const r = document.getElementById('stage').getBoundingClientRect();
              return [...document.querySelectorAll('#choix .choix-b, #soustitres .ligne-st, #hud')].some(e => { const b = e.getBoundingClientRect(); return b.bottom > r.bottom + 1 || b.top < r.top - 1; }); }''')
            print('débordement en 360×640 :', deb)
            if deb: erreurs.append('Débordement en 360×640')
            break
        page.keyboard.press('Space')
    nav.close()
if erreurs: print('ERREURS:\n  ' + '\n  '.join(erreurs)); sys.exit(1)
print('OK')
