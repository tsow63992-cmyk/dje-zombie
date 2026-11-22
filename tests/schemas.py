#!/usr/bin/env python3
"""Dje_zombie — dessine chaque diapo « Le savais-tu ? » (9 zombies × 3 lieux) à plusieurs instants,
signale toute erreur JavaScript et produit une planche de contrôle visuel."""
import pathlib
import sys

from playwright.sync_api import sync_playwright

RACINE = pathlib.Path(__file__).resolve().parent.parent
SORTIE = sys.argv[1] if len(sys.argv) > 1 else '/tmp/schemas.png'

JS = '''() => {
  const err = [], vignettes = [];
  const cv = document.createElement('canvas'); cv.width = 450; cv.height = 350;
  const ctx = cv.getContext('2d');
  for (const z of DJE.data.zombies) {
    const seq = DJE.data.histoires[z.id].science;
    for (const l of ['village', 'ile', 'metro']) {
      seq.diapos.forEach((d, i) => {
        for (const t of [0, 0.7, 1.6, 2.6, 3.9, 5.2, 7.5, 12]) {
          try { ctx.setTransform(0.5, 0, 0, 0.5, 0, 0); d.dessin(DJE.science.kit(ctx, l), t); }
          catch (e) { err.push(z.id + ' ' + l + ' diapo ' + i + ' t=' + t + ' : ' + e.message); }
        }
        if (l === 'village' || (i === seq.diapos.length - 1)) vignettes.push(cv.toDataURL('image/jpeg', 0.7));
      });
    }
  }
  return { err, vignettes };
}'''

with sync_playwright() as p:
    nav = p.chromium.launch(executable_path='/usr/bin/google-chrome')
    page = nav.new_page(viewport={'width': 400, 'height': 800})
    erreurs = []
    page.on('pageerror', lambda e: erreurs.append(str(e)))
    page.goto((RACINE / 'index.html').as_uri())
    page.wait_for_timeout(800)
    r = page.evaluate(JS)
    nav.close()

erreurs += r['err']
import base64, io
from PIL import Image
ims = [Image.open(io.BytesIO(base64.b64decode(v.split(',')[1]))) for v in r['vignettes']]
cols = 8
w, h = ims[0].size
planche = Image.new('RGB', (cols * w // 2, ((len(ims) + cols - 1) // cols) * h // 2), 'black')
for i, im in enumerate(ims):
    planche.paste(im.resize((w // 2, h // 2)), ((i % cols) * w // 2, (i // cols) * h // 2))
planche.save(SORTIE)
print(len(ims), 'vignettes ->', SORTIE)
if erreurs:
    print('ERREURS:\n  ' + '\n  '.join(erreurs))
    sys.exit(1)
print('OK : aucun schéma ne plante.')
