/* Dje_zombie — Saison 1 : les lieux.
   Chaque lieu fournit : son vocabulaire ({mots}), ses objets, ses points d'ancrage
   pour les personnages, ses plans de caméra et les scènes communes (arrivée, objets, aubes).
   Le décor dessiné se trouve dans data/decors.js. */
(function (root) {
  'use strict';
  var DJE = root.DJE;

  DJE.lieu({
    id: 'village', nom: 'LE VILLAGE', titre: 'Village de montagne', ambiance: 'vent',
    objectif: 'HÉLICOPTÈRE AU COL', court: 'au village',
    mots: {
      abri: 'la grange', haut: 'le clocher', loin: 'la crête d\'en face', sol: 'les pavés',
      secours: 'l\'hélicoptère', objectif: 'le col', eau: 'le lavoir', bruitfond: 'la cascade',
      decouvert: 'la place', passage: 'les ruelles en escaliers', nuit: 'la vallée',
      murs: 'les murs de pierre', ici: 'le village', bois: 'les granges en bois',
      caillou: 'une pierre', perche: 'un muret', etroit: 'les ruelles en escaliers', piece: 'la forge'
    },
    objets: [
      { id: 'corde', nom: 'Corde', desc: 'Vingt mètres, solide.' },
      { id: 'allumettes', nom: 'Allumettes', desc: 'Une boîte presque pleine.' },
      { id: 'lampe', nom: 'Lampe torche', desc: 'Les piles tiendront.' },
      { id: 'couverture', nom: 'Couverture', desc: 'En laine, épaisse et lourde.' },
      { id: 'pierre', nom: 'Pierres', desc: 'Une poignée, pour faire diversion.' },
      { id: 'gourde', nom: 'Gourde', desc: 'Pleine d\'eau du lavoir.' }
    ],
    /* x, y = position des pieds dans le monde (1800 × 1600), s = échelle */
    ancres: {
      loin: [1430, 610, 0.5], haut: [930, 905, 0.42], decouvert: [900, 1450, 1], passage: [640, 1375, 0.9],
      objectif: [420, 520, 0.32], eau: [560, 1480, 1], bas: [900, 1430, 0.9], proche: [760, 1500, 1.15],
      abri: [1290, 1400, 0.9], fond: [1180, 1280, 0.7]
    },
    vues: {
      large: [900, 800, 900], loin: [1400, 650, 600], haut: [930, 940, 520], decouvert: [900, 1230, 720],
      passage: [700, 1230, 700], objectif: [520, 640, 720], eau: [620, 1260, 700], bas: [880, 1250, 760],
      proche: [800, 1280, 620]
    },
    scenes: {
      debut: {
        vue: 'large', l: [
          'Une vallée perdue, tout au fond des montagnes.',
          'Un *village* de pierre. Des ruelles en *escaliers*. Un vieux *clocher*.',
          'Personne. Juste le *vent*.',
          'Sur la porte de l\'église, quelqu\'un a gravé un message.'
        ], next: 'debut_msg'
      },
      debut_msg: {
        vue: 'haut', message: 'HÉLICOPTÈRE AU COL DANS 3 JOURS', l: [
          'Le *col*, c\'est tout là-haut, au-dessus des derniers sapins.',
          'Trois jours. Donc *trois nuits*.',
          'Et cette nuit, {Z} va te chasser.'
        ], next: 'objets'
      },
      objets: {
        type: 'objets', vue: 'decouvert', l: [
          'Avant la nuit, tu fouilles les maisons.',
          'Tu ne peux porter que *trois* objets.',
          'Choisis bien. Tu sais ce qui te chasse.'
        ], next: 'n1'
      },
      aube1: {
        type: 'aube', vue: 'large', decor: ['aube'], on: { peur: -25, bruitA: 0, visi: 0 }, l: [
          'Le ciel pâlit derrière la crête.',
          'Tu es *vivant*. Une nuit de tenue.'
        ], next: 'n2'
      },
      aube2: {
        type: 'aube', vue: 'large', decor: ['aube'], on: { peur: -25, bruitA: 0, visi: 0 }, l: [
          'Deuxième aube. Tes mains tremblent un peu moins.',
          'Demain matin, l\'hélicoptère se posera au *col*.'
        ], next: 'n3'
      }
    }
  });

  DJE.lieu({
    id: 'ile', nom: 'L\'ÎLE DU PHARE', titre: 'Île du phare', ambiance: 'mer',
    objectif: 'BATEAU AU PORT', court: 'sur l\'île',
    mots: {
      abri: 'la cabane du pêcheur', haut: 'le phare', loin: 'la falaise', sol: 'les galets',
      secours: 'le bateau', objectif: 'le port', eau: 'la mer', bruitfond: 'le ressac',
      decouvert: 'la lande', passage: 'les murets de pierre sèche', nuit: 'l\'île',
      murs: 'les murets', ici: 'l\'île', bois: 'les cabanes en planches',
      caillou: 'un galet', perche: 'un rocher', etroit: 'l\'escalier du phare', piece: 'le phare'
    },
    objets: [
      { id: 'lampe', nom: 'Lampe tempête', desc: 'Elle éclaire loin.' },
      { id: 'fusee', nom: 'Fusée de détresse', desc: 'Rouge, aveuglante, brûlante.' },
      { id: 'corde', nom: 'Corde', desc: 'Une corde de bateau, salée.' },
      { id: 'seau', nom: 'Seau', desc: 'En zinc. Il suffit de le remplir.' },
      { id: 'couvsurvie', nom: 'Couverture de survie', desc: 'Fine et dorée. Elle renvoie la chaleur.' },
      { id: 'corne', nom: 'Corne de brume', desc: 'Portative. Un son énorme et grave.' }
    ],
    ancres: {
      loin: [1640, 1010, 0.55], haut: [1350, 520, 0.3], decouvert: [960, 1320, 0.9], passage: [800, 1300, 0.85],
      objectif: [230, 1470, 0.75], eau: [980, 1530, 1], bas: [1000, 1320, 0.85], proche: [760, 1500, 1.15],
      abri: [640, 1310, 0.8], fond: [1150, 1250, 0.7]
    },
    vues: {
      large: [1080, 800, 900], loin: [1500, 960, 620], haut: [1340, 640, 600], decouvert: [960, 1200, 760],
      passage: [820, 1220, 700], objectif: [420, 1230, 760], eau: [960, 1260, 720], bas: [960, 1230, 760],
      proche: [820, 1290, 620]
    },
    scenes: {
      debut: {
        vue: 'large', l: [
          'Une île au bout du monde. De la lande, du vent, et un *phare*.',
          'Le gardien est parti.',
          'Son *journal* est resté ouvert sur la table. La dernière page dit :'
        ], next: 'debut_msg'
      },
      debut_msg: {
        vue: 'haut', message: 'BATEAU AU PORT À L\'AUBE DU 3ᵉ JOUR. ALLUMEZ LE PHARE.', l: [
          'Le *port* est de l\'autre côté de la *chaussée*. À marée haute, la mer la recouvre.',
          'Trois jours. Donc *trois nuits*. Et il faudra rallumer le phare.',
          'Et cette nuit, {Z} va te chasser.'
        ], next: 'objets'
      },
      objets: {
        type: 'objets', vue: 'decouvert', l: [
          'Avant la nuit, tu fouilles les cabanes de pêcheurs.',
          'Tu ne peux porter que *trois* objets.',
          'Choisis bien. Tu sais ce qui te chasse.'
        ], next: 'n1'
      },
      aube1: {
        type: 'aube', vue: 'large', decor: ['aube'], on: { peur: -25, bruitA: 0, visi: 0 }, l: [
          'Le jour se lève sur la mer, gris et froid.',
          'Tu es *vivant*. Une nuit de tenue.'
        ], next: 'n2'
      },
      aube2: {
        type: 'aube', vue: 'large', decor: ['aube'], on: { peur: -25, bruitA: 0, visi: 0 }, l: [
          'Deuxième aube. Les mouettes crient au-dessus du port.',
          'Demain matin, le *bateau*. S\'il voit la lumière du phare.'
        ], next: 'n3'
      }
    }
  });

  DJE.lieu({
    id: 'metro', nom: 'LA STATION FANTÔME', titre: 'Station de métro abandonnée', ambiance: 'metro',
    objectif: 'TRAIN AU TERMINUS', court: 'dans le métro',
    mots: {
      abri: 'la cabine du chef de station', haut: 'la passerelle', loin: 'le bout du quai', sol: 'le carrelage',
      secours: 'le train', objectif: 'le terminus', eau: 'les flaques du tunnel', bruitfond: 'la ventilation',
      decouvert: 'le quai', passage: 'les voies, sous le bord du quai', nuit: 'la station',
      murs: 'les murs carrelés', ici: 'la station', bois: 'les vieux bancs en bois',
      caillou: 'un boulon rouillé', perche: 'un banc', etroit: 'l\'escalier de service', piece: 'le local technique'
    },
    objets: [
      { id: 'lampe', nom: 'Lampe frontale', desc: 'Les mains restent libres.' },
      { id: 'extincteur', nom: 'Extincteur', desc: 'Au CO2. Encore plein.' },
      { id: 'piedbiche', nom: 'Pied-de-biche', desc: 'Pour forcer une porte.' },
      { id: 'sifflet', nom: 'Sifflet', desc: 'Celui du chef de quai. Strident.' },
      { id: 'briquet', nom: 'Briquet', desc: 'Il reste du gaz.' },
      { id: 'gourde', nom: 'Bouteille d\'eau', desc: 'Un litre, bouchée.' }
    ],
    ancres: {
      loin: [1540, 1262, 0.55], haut: [900, 770, 0.5], decouvert: [900, 1262, 0.85], passage: [900, 1500, 0.95],
      objectif: [200, 1420, 0.6], eau: [1120, 1520, 1], bas: [1000, 1262, 0.8], proche: [760, 1540, 1.15],
      abri: [470, 1262, 0.8], fond: [1250, 1262, 0.7]
    },
    vues: {
      large: [900, 800, 900], loin: [1420, 1180, 620], haut: [900, 820, 640], decouvert: [900, 1120, 760],
      passage: [900, 1240, 720], objectif: [380, 1140, 720], eau: [1060, 1240, 700], bas: [960, 1150, 760],
      proche: [820, 1270, 620]
    },
    scenes: {
      debut: {
        vue: 'large', l: [
          'Sous la ville, une station de métro *fermée* depuis des années.',
          'Du carrelage blanc. Des rails rouillés. Deux *tunnels* noirs.',
          'Sur un plan du réseau, quelqu\'un a écrit à la craie :'
        ], next: 'debut_msg'
      },
      debut_msg: {
        vue: 'decouvert', message: 'DERNIER TRAIN AU TERMINUS DANS 3 JOURS', l: [
          'Le *terminus*, c\'est deux stations plus loin. Par le tunnel.',
          'Ici, pas de soleil. Mais la nuit, ils *descendent*.',
          'Et cette nuit, {Z} va te chasser.'
        ], next: 'objets'
      },
      objets: {
        type: 'objets', vue: 'decouvert', l: [
          'Avant la nuit, tu fouilles les guichets et les vestiaires.',
          'Tu ne peux porter que *trois* objets.',
          'Choisis bien. Tu sais ce qui te chasse.'
        ], next: 'n1'
      },
      aube1: {
        type: 'aube', vue: 'large', decor: ['aube'], on: { peur: -25, bruitA: 0, visi: 0 }, l: [
          'Ta montre indique *6 h*. Là-haut, il fait jour.',
          'Tu es *vivant*. Une nuit de tenue.'
        ], next: 'n2'
      },
      aube2: {
        type: 'aube', vue: 'large', decor: ['aube'], on: { peur: -25, bruitA: 0, visi: 0 }, l: [
          '6 h. Deuxième jour sous la terre.',
          'Demain matin, le *train*. Au terminus.'
        ], next: 'n3'
      }
    }
  });
})(typeof window !== 'undefined' ? window : globalThis);
