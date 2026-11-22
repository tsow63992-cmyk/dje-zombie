#!/usr/bin/env python3
"""Dje_zombie — parcours complet depuis l'écran titre : roulette du jour, partie, résultat,
téléchargement de l'image, rechargement (sauvegarde), bestiaire. Taille téléphone puis PC."""
import os, pathlib, sys, time, random
from playwright.sync_api import sync_playwright

RACINE = pathlib.Path(__file__).resolve().parent.parent
D = sys.argv[1] if len(sys.argv) > 1 else '/tmp/ecrans'
os.makedirs(D, exist_ok=True)
erreurs = []

def jouer(page, cap, prefixe):
    vus = set(); debut = time.time()
    while time.time() - debut < 200:
        time.sleep(0.15)
        e = page.evaluate('''() => { const q = s => document.querySelector(s); return {
          roulette: !!q('.roulette'), fiche: !!q('.fiche-p'), objets: !!q('.objets-p'), science: !!q('.science-p'), aube: !!q('.aube-p'),
          fin: !!q('.fin-p'), res: !!q('.resultat-p img'), choix: document.querySelectorAll('#choix .choix-b:not([disabled])').length,
          bouton: !!q('#ecran .bouton.or:not([disabled])'), lieu: !!q('.r-case.lieu') } }''')
        for k in ('roulette', 'fiche', 'objets', 'science', 'aube', 'fin'):
            nom = 'lieu' if (k == 'roulette' and e['lieu']) else k
            if e[k] and nom not in vus:
                vus.add(nom); time.sleep(0.5); cap(prefixe + nom)
        if e['res']:
            time.sleep(0.4); cap(prefixe + 'resultat'); return True
        if e['objets']:
            for o in ('1', '3', '5'): page.keyboard.press(o)
            page.keyboard.press('Enter'); continue
        if e['choix']:
            if 'scene' not in vus and len(vus) > 3:
                vus.add('scene'); cap(prefixe + 'scene')
            page.keyboard.press(str(random.randint(1, e['choix']))); continue
        if e['bouton'] and (e['fiche'] or e['aube'] or e['fin']):
            try: page.click('#ecran .bouton.or:not([disabled])', timeout=1500)
            except Exception: pass
            continue
        page.keyboard.press('Space')
    return False

with sync_playwright() as p:
    nav = p.chromium.launch(executable_path='/usr/bin/google-chrome')
    ctx = nav.new_context(viewport={'width': 390, 'height': 844}, device_scale_factor=2, accept_downloads=True)
    page = ctx.new_page()
    page.on('console', lambda m: erreurs.append(m.type + ': ' + m.text) if m.type in ('error', 'warning') else None)
    page.on('pageerror', lambda e: erreurs.append('pageerror: ' + str(e)))
    n = [0]
    def cap(nom, pg=None):
        n[0] += 1; (pg or page).screenshot(path=os.path.join(D, '%02d_%s.png' % (n[0], nom)))
    url = (RACINE / 'index.html').as_uri()
    page.goto(url + '?vite'); time.sleep(1.2); cap('titre')
    page.click('[data-a="jour"]')
    ok = jouer(page, cap, 'jour_')
    if not ok: erreurs.append('Partie du jour non terminée')
    with page.expect_download() as dl:
        page.click('[data-a="dl"]')
    chemin = os.path.join(D, 'resultat_telecharge.png'); dl.value.save_as(chemin)
    from PIL import Image
    taille = Image.open(chemin).size
    print('image téléchargée :', taille)
    if taille != (1080, 1920): erreurs.append('Image de résultat de taille inattendue : %s' % (taille,))
    page.click('[data-a="partager"]'); time.sleep(0.8)
    print('après Partager :', page.inner_text('.notif'))
    avant = page.evaluate('() => JSON.stringify(DJE.save.data)')
    page.reload(); time.sleep(1.2)
    apres = page.evaluate('() => JSON.stringify(DJE.save.data)')
    if avant != apres: erreurs.append('La sauvegarde a changé après rechargement')
    print('sauvegarde identique après rechargement :', avant == apres)
    print('bouton du jour :', page.inner_text('[data-a="jour"]'))
    cap('titre_apres')
    page.click('[data-a="bestiaire"]'); time.sleep(0.6); cap('bestiaire')
    page.click('.carte-b:not(.inconnu)'); time.sleep(0.6); cap('bestiaire_fiche')
    # PC
    pc = ctx.new_page() if False else nav.new_page(viewport={'width': 1440, 'height': 900})
    pc.on('pageerror', lambda e: erreurs.append('pageerror PC: ' + str(e)))
    pc.goto(url + '?vite'); time.sleep(1.2); cap('pc_titre', pc)
    pc.goto(url + '?vite&z=geant&l=ile'); 
    n[0] += 1; ok2 = jouer(pc, lambda nom: pc.screenshot(path=os.path.join(D, '%02d_pc_%s.png' % (n[0], nom))), '')
    if not ok2: erreurs.append('Partie PC non terminée')
    nav.close()
print('\n'.join(sorted(os.listdir(D))))
if erreurs:
    print('ERREURS:\n  ' + '\n  '.join(erreurs)); sys.exit(1)
print('OK')
