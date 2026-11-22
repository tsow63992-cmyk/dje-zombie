/* Dje_zombie — Saison 1 : les fiches des zombies.
   Pour une Saison 2 : ajoute des entrées ici, puis un fichier dans data/scenes/. */
(function (root) {
  'use strict';
  var DJE = root.DJE = root.DJE || {};
  DJE.data = DJE.data || {};

  DJE.data.saison = 'SAISON 1';

  DJE.data.raretes = {
    'COMMUN': { couleur: '#a7b1c2' },
    'RARE': { couleur: '#2ef2e0' },
    'ÉPIQUE': { couleur: '#c08cff' },
    'LÉGENDAIRE': { couleur: '#ffc93c' }
  };
  DJE.data.difficultes = ['', 'FACILE', 'ABORDABLE', 'MOYEN', 'DIFFICILE', 'CAUCHEMAR'];

  DJE.data.zombies = [
    {
      id: 'rouille', num: '001', nom: 'LE ROUILLÉ', court: 'ROUILLÉ', art: 'le Rouillé', Art: 'Le Rouillé',
      rarete: 'COMMUN', poids: 18, diff: 1,
      jauges: [['OUÏE', 4], ['VITESSE', 2], ['FORCE', 6], ['GRINCEMENT', 9]],
      comportement: 'Lent, increvable. Il grince à chaque pas.',
      faible: 'L\'eau. Mouillé, il rouille sur place et se grippe. Ne lui donne jamais d\'huile.',
      science: 'Oxydation du fer et frottement « accroche-glisse »',
      son: 'grince'
    },
    {
      id: 'ecouteur', num: '002', nom: 'L\'ÉCOUTEUR', court: 'ÉCOUTEUR', art: 'l\'Écouteur', Art: 'L\'Écouteur',
      rarete: 'RARE', poids: 10, diff: 3,
      jauges: [['OUÏE', 10], ['VITESSE', 6], ['FORCE', 4], ['PRÉCISION', 9]],
      comportement: 'Presque aveugle. Il entend ton cœur battre.',
      faible: 'Un bruit de fond fort et continu le rend sourd à toi. Un bruit lancé ailleurs l\'envoie ailleurs.',
      science: 'Localisation sonore de la chouette effraie, masquage',
      son: 'ecoute'
    },
    {
      id: 'vitreux', num: '003', nom: 'LE VITREUX', court: 'VITREUX', art: 'le Vitreux', Art: 'Le Vitreux',
      rarete: 'RARE', poids: 10, diff: 3,
      jauges: [['OUÏE', 3], ['VITESSE', 8], ['FORCE', 5], ['MOUVEMENT', 10]],
      comportement: 'Des yeux laiteux. Il ne voit que ce qui bouge.',
      faible: 'L\'immobilité totale. Et bouger en même temps que le vent fait bouger le reste.',
      science: 'Détection du mouvement chez la grenouille, camouflage du phasme',
      son: 'vitre'
    },
    {
      id: 'rampeur', num: '004', nom: 'LE RAMPEUR', court: 'RAMPEUR', art: 'le Rampeur', Art: 'Le Rampeur',
      rarete: 'COMMUN', poids: 18, diff: 2,
      jauges: [['OUÏE', 6], ['VITESSE', 5], ['FORCE', 3], ['VIBRATIONS', 10]],
      comportement: 'Il rampe, passe sous les portes et sent tes pas dans le sol.',
      faible: 'La hauteur : il ne grimpe pas. Et les sols mous, qui avalent les vibrations.',
      science: 'Les serpents « entendent » le sol avec leur mâchoire',
      son: 'rampe'
    },
    {
      id: 'geant', num: '005', nom: 'LE GÉANT', court: 'GÉANT', art: 'le Géant', Art: 'Le Géant',
      rarete: 'COMMUN', poids: 18, diff: 2,
      jauges: [['OUÏE', 4], ['VITESSE', 3], ['FORCE', 10], ['MASSE', 10]],
      comportement: 'Trois mètres. Il défonce les portes. Rien ne l\'arrête en ligne droite.',
      faible: 'Les escaliers étroits et les planchers fragiles. Il s\'épuise vite et tombe lourdement.',
      science: 'Loi du carré-cube (Galilée, 1638)',
      son: 'geant'
    },
    {
      id: 'siffleur', num: '006', nom: 'LE SIFFLEUR', court: 'SIFFLEUR', art: 'le Siffleur', Art: 'Le Siffleur',
      rarete: 'RARE', poids: 10, diff: 4,
      jauges: [['OUÏE', 7], ['VITESSE', 3], ['FORCE', 1], ['APPEL', 10]],
      comportement: 'Il ne se bat jamais. Il te repère, et il appelle les autres.',
      faible: 'Il ne siffle que sur ce qu\'il voit. Un son plus fort sur sa fréquence noie son appel.',
      science: 'Le silbo de La Gomera, son pur, écho des vallées',
      son: 'siffle'
    },
    {
      id: 'braise', num: '007', nom: 'LA BRAISE', court: 'BRAISE', art: 'la Braise', Art: 'La Braise',
      rarete: 'ÉPIQUE', poids: 6.5, diff: 4,
      jauges: [['OUÏE', 5], ['VITESSE', 6], ['FORCE', 6], ['CHALEUR', 10]],
      comportement: 'Incandescente. Tout ce qu\'elle touche s\'enflamme.',
      faible: 'Casser le triangle du feu : l\'étouffer, la noyer, ou l\'attirer là où rien ne brûle.',
      science: 'Le triangle du feu',
      son: 'braise'
    },
    {
      id: 'brume', num: '008', nom: 'LA BRUME', court: 'BRUME', art: 'la Brume', Art: 'La Brume',
      rarete: 'ÉPIQUE', poids: 6.5, diff: 4,
      jauges: [['OUÏE', 6], ['VITESSE', 5], ['FORCE', 5], ['BROUILLARD', 10]],
      comportement: 'Elle avance dans un brouillard froid. Dedans, elle est invisible.',
      faible: 'Le vent et le soleil la dissipent. Un faisceau de lumière en travers révèle son ombre.',
      science: 'Diffusion de la lumière par les gouttelettes',
      son: 'brume'
    },
    {
      id: 'sansyeux', num: '009', nom: 'LE SANS-YEUX', court: 'SANS-YEUX', art: 'le Sans-Yeux', Art: 'Le Sans-Yeux',
      rarete: 'LÉGENDAIRE', poids: 3, diff: 5, jackpot: true,
      jauges: [['OUÏE', 5], ['VITESSE', 7], ['FORCE', 7], ['THERMIQUE', 10]],
      comportement: 'Pas d\'yeux. Deux fossettes. Il voit ta chaleur, même dans le noir total.',
      faible: 'Le verre arrête l\'infrarouge. L\'eau froide et la couverture de survie te cachent. Un feu l\'éblouit.',
      science: 'Vision infrarouge des crotales',
      son: 'thermique'
    }
  ];
})(typeof window !== 'undefined' ? window : globalThis);
