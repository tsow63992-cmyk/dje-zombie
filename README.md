# Dje_zombie — Saison 1

**▶ Jouer : https://tsow63992-cmyk.github.io/dje-zombie/**

Jeu narratif dans le navigateur, en français, au format vertical (téléphone d'abord, PC aussi).
Fais tourner la roulette, découvre quel zombie te chasse, et tiens trois nuits en trouvant son point faible.

- 9 zombies (dont un légendaire secret derrière la case JACKPOT), 3 lieux, 27 combinaisons.
- Chaque zombie a une vraie notion scientifique, expliquée dans une séquence animée « Le savais-tu ? » qui donne l'indice clé.
- Roulette du jour (même tirage pour tout le monde), mode libre, bestiaire sauvegardé, image de résultat à partager.
- Aucun fichier externe : tout le dessin est en SVG/Canvas et tout le son est synthétisé (Web Audio). Marche hors ligne.

## Lancer en local (Linux)

Le plus simple : double-cliquer sur `index.html`.

Ou avec un petit serveur :

```sh
cd Dje_zombie
python3 -m http.server 8000
# puis ouvrir http://localhost:8000 dans le navigateur
```

Pour tester sur ton téléphone sur le même Wi-Fi : lance le serveur, puis ouvre `http://IP-DE-TON-PC:8000` sur le téléphone (`hostname -I` donne l'IP).

## Publier gratuitement sur GitHub Pages

1. Crée un dépôt public sur GitHub (par exemple `dje-zombie`).
2. Dans le dossier du jeu :

   ```sh
   git init
   git add .
   git commit -m "Dje_zombie, saison 1"
   git branch -M main
   git remote add origin https://github.com/TON-COMPTE/dje-zombie.git
   git push -u origin main
   ```

3. Sur GitHub : **Settings → Pages → Build and deployment → Source : Deploy from a branch**, branche `main`, dossier `/ (root)`, puis **Save**.
4. Après une minute, le jeu est en ligne sur `https://TON-COMPTE.github.io/dje-zombie/`.

## Commandes

- Tap ou clic sur les choix, ou touches **1 à 4**.
- **Espace** ou tap : affiche la phrase entière, puis passe à la suivante (et passe une roulette déjà vue).
- **M** : couper le son · **V** : voix · **Échap** : menu pause.
- Option « Animations réduites » dans le menu (activée d'office si le système le demande).

## Structure

```
index.html            page unique
css/style.css         tout le style (format 9:16, sous-titres façon TikTok, néon)
js/core.js            moteur des histoires (sans DOM, aussi utilisé par les tests)
js/jeu.js             déroulé d'une partie (scènes, choix, objets, aubes, fins)
js/app.js             écrans : titre, roulette du jour, résultat, bestiaire, menu
js/roulette.js        roulette animée      js/fiche.js       fiche néon du zombie
js/rendu.js           décor, caméra, personnages, HUD
js/science.js         lecteur des séquences « Le savais-tu ? »
js/audio.js           sons synthétisés     js/voix.js        narration (speechSynthesis)
js/soustitres.js      sous-titres          js/effets.js      particules (brume, pluie, braises…)
js/partage.js         image de résultat PNG et partage
js/save.js            sauvegarde locale (localStorage, avec try/catch)
data/zombies.js       fiches des zombies (stats, rareté, point faible)
data/lieux.js         lieux (vocabulaire, objets, plans de caméra, scènes communes)
data/portraits.js     dessins des personnages et des objets
data/decors.js        décors des lieux
data/scenes/*.js      une histoire par zombie (3 nuits, fins, schémas scientifiques)
tests/                vérifications automatiques
```

## Ajouter une Saison 2

Le moteur n'a pas besoin d'être modifié :

1. Ajoute le zombie dans `data/zombies.js` (et son dessin dans `data/portraits.js`).
2. Crée `data/scenes/nouveau.js` sur le modèle de `data/scenes/siffleur.js` (scènes `n1`, `n2`, `n3`, fins, science).
3. Ajoute une ligne `<script src="data/scenes/nouveau.js"></script>` dans `index.html`.
4. Pour un nouveau lieu : une entrée dans `data/lieux.js` et son décor dans `data/decors.js`.
5. Lance `node tests/verifier.js` : il dit tout de suite s'il y a une impasse ou une scène qui n'existe pas.

Dans les textes : `*mot*` s'affiche en jaune, `[[son]]` joue un son, `{abri}`, `{haut}`… sont remplacés par le vocabulaire du lieu.

## Tests

```sh
node tests/verifier.js            # explore tous les chemins des 27 combinaisons
python3 tests/navigateur.py --z siffleur --l village --taille 390x844   # une partie dans Chrome (Playwright)
sh tests/tout.sh                  # les 27 combinaisons dans Chrome, choix au hasard
python3 tests/schemas.py          # dessine tous les schémas « Le savais-tu ? »
python3 tests/ecrans.py           # titre, roulette du jour, téléchargement, rechargement, bestiaire, PC
```

Les tests navigateur demandent Python, Playwright et Google Chrome (`pip install playwright`).
Astuce de test : `index.html?z=braise&l=metro&vite` lance directement une combinaison, en accéléré.

## Limites connues

- La voix dépend des voix installées : sur beaucoup de PC Linux il n'y a pas de voix française (le bouton l'indique), les sous-titres suffisent. Sur Android et iPhone, une voix française est en général disponible.
- Le bouton « Partager » envoie l'image quand le téléphone le permet (Web Share API) ; sinon il copie le texte du résultat.
- Pas de serveur : aucune statistique entre joueurs. La roulette du jour compare les tirages, pas les scores.
