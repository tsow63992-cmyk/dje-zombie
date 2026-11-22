#!/usr/bin/env python3
"""Dje_zombie — test dans un vrai navigateur (Playwright + Chrome).

Joue une partie de bout en bout en mode accéléré, prend des captures d'écran
aux moments clés et échoue si la console affiche la moindre erreur.

    python3 tests/navigateur.py --z siffleur --l village --taille 390x844 --dossier /tmp/captures
"""
import argparse
import os
import pathlib
import sys
import random
import time

from playwright.sync_api import sync_playwright

RACINE = pathlib.Path(__file__).resolve().parent.parent


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--z', default='siffleur')
    ap.add_argument('--l', default='village')
    ap.add_argument('--taille', default='390x844')
    ap.add_argument('--dossier', default='/tmp/captures')
    ap.add_argument('--choix', default='', help='indices de choix à suivre, ex. 1,2,1 (sinon le premier possible)')
    ap.add_argument('--objets', default='1,2,3')
    ap.add_argument('--lent', action='store_true', help='vitesse normale (sinon accéléré)')
    ap.add_argument('--captures', default='toutes', help='toutes | aucune | fin')
    ap.add_argument('--url', default='')
    a = ap.parse_args()
    w, h = [int(x) for x in a.taille.split('x')]
    os.makedirs(a.dossier, exist_ok=True)
    erreurs = []
    hasard = a.choix == 'hasard'
    choix = [] if hasard else [int(c) for c in a.choix.split(',') if c.strip()]
    with sync_playwright() as p:
        nav = p.chromium.launch(executable_path='/usr/bin/google-chrome', args=['--autoplay-policy=no-user-gesture-required'])
        page = nav.new_page(viewport={'width': w, 'height': h}, device_scale_factor=2 if w < 600 else 1)
        page.on('console', lambda m: erreurs.append('console.' + m.type + ': ' + m.text) if m.type in ('error', 'warning') else None)
        page.on('pageerror', lambda e: erreurs.append('pageerror: ' + str(e)))
        url = a.url or (RACINE / 'index.html').as_uri() + '?z=' + a.z + '&l=' + a.l + ('' if a.lent else '&vite')
        page.goto(url)
        n = 0

        def capture(nom):
            nonlocal n
            if a.captures == 'aucune':
                return
            n += 1
            page.screenshot(path=os.path.join(a.dossier, '%02d_%s.png' % (n, nom)))

        vus = set()
        k = 0
        debut = time.time()
        fini = False
        while time.time() - debut < 240:
            time.sleep(0.15)
            etat = page.evaluate('''() => {
              const q = s => document.querySelector(s);
              return {
                roulette: !!q('.roulette'), fiche: !!q('.fiche-p'), objets: !!q('.objets-p'), science: !!q('.science-p'),
                aube: !!q('.aube-p'), fin: !!q('.fin-p'), resultat: !!q('.resultat-p img'), choix: document.querySelectorAll('#choix .choix-b:not([disabled])').length,
                scene: (window.DJE && DJE.jeu && DJE.jeu.sceneId) || '', bouton: !!q('#ecran .bouton.or:not([disabled])')
              };
            }''')
            cle = None
            for nom in ('roulette', 'fiche', 'objets', 'science', 'aube', 'fin', 'resultat'):
                if etat[nom]:
                    cle = nom
            if cle and cle not in vus and a.captures == 'toutes':
                vus.add(cle)
                time.sleep(0.6 if cle in ('roulette', 'science') else 0.3)
                capture(cle)
            if etat['resultat']:
                time.sleep(0.5)
                capture('resultat_final')
                fini = True
                break
            if etat['objets']:
                objets = random.sample(['1', '2', '3', '4', '5', '6'], 3) if hasard else a.objets.split(',')
                for o in objets:
                    page.keyboard.press(o.strip())
                capture('objets_choisis') if 'objets_choisis' not in vus else None
                vus.add('objets_choisis')
                page.keyboard.press('Enter')
                continue
            if etat['choix']:
                sc = etat['scene']
                if a.captures == 'toutes' and ('choix_' + sc) not in vus:
                    vus.add('choix_' + sc)
                    capture('choix_' + sc)
                idx = choix[k] if k < len(choix) else 1
                k += 1
                boutons = page.query_selector_all('#choix .choix-b')
                actifs = [b for b in boutons if not b.is_disabled()]
                if not actifs:
                    continue
                cible = boutons[idx - 1] if idx - 1 < len(boutons) and not boutons[idx - 1].is_disabled() else actifs[0]
                if hasard:
                    cible = random.choice(actifs)
                try:
                    cible.click(timeout=1500)
                except Exception:
                    pass
                continue
            if etat['bouton'] and (etat['fiche'] or etat['aube'] or etat['fin']):
                try:
                    page.click('#ecran .bouton.or:not([disabled])', timeout=1500)
                except Exception:
                    pass
                continue
            page.keyboard.press('Space')
        if not fini:
            capture('bloque')
            erreurs.append('La partie ne s\'est pas terminée (dernière scène : %s)' % page.evaluate('() => DJE.jeu && DJE.jeu.sceneId'))
        res = page.evaluate('() => JSON.stringify(DJE.save.data.bestiaire)')
        print('bestiaire:', res)
        nav.close()
    if erreurs:
        print('ERREURS:\n  ' + '\n  '.join(erreurs))
        sys.exit(1)
    print('OK : partie terminée sans erreur dans la console.')


if __name__ == '__main__':
    main()
