/* Dje_zombie — Saison 1 — L'ÉCOUTEUR.
   Règles : presque aveugle, il chasse à l'oreille ; il entend même ton cœur quand tu as peur.
   Point faible : un gros bruit de fond continu le rend sourd ; un bruit lancé ailleurs l'envoie ailleurs. */
(function (root) {
  "use strict";
  var DJE = root.DJE;

  DJE.histoire("ecouteur", {
    scenes: {
      n1: {
        nuit: 1, vue: "decouvert", acteurs: [{ q: "zombie", a: "decouvert" }],
        l: {
          village: ["Silence. Total.", "Puis un bruit… comme quelqu'un qui *renifle*. Mais avec les oreilles.[[ecoute]]", "Au bout de la ruelle, une silhouette penche la tête. D'un côté. De l'autre."],
          ile: ["Le vent. Le ressac. Rien d'autre.", "Puis, entre deux rafales, une silhouette sur la lande. Elle penche la tête.[[ecoute]]", "D'un côté. De l'autre. Elle *écoute*."],
          metro: ["Silence. Un silence épais, de sous-sol.", "Au bout du quai, une silhouette penche la tête.[[ecoute]]", "D'un côté. De l'autre. Elle *écoute*."]
        },
        choix: [
          { t: "Ne plus bouger, ne plus respirer", calme: true, go: "n1_fige" },
          { t: "Reculer doucement vers {abri}", fx: { bruit: 10 }, go: "n1_recule" },
          { t: "Allumer ta lampe pour le voir", need: "lampe", fx: { visi: 1, bruit: 10 }, go: "n1_lampe" }
        ]
      },
      n1_fige: {
        vue: "proche", acteurs: [{ q: "zombie", a: "proche" }], on: { peur: 20 },
        l: ["Tu ne bouges plus.", "Il approche. Ses oreilles. *Énormes*. L'une plus haute que l'autre.", "Il passe à un mètre de toi. Il n'a presque pas d'yeux.", "Ton cœur cogne. Il s'arrête… tourne la tête vers ta poitrine…[[coeur]]", "…puis repart."],
        indice: { id: "coeur", t: "Il entend même ton *cœur* quand tu as peur." },
        next: "n1_fin"
      },
      n1_recule: {
        vue: "decouvert", acteurs: [{ q: "zombie", a: "fond" }], branche: [{ c: { bruitMin: 30 }, go: "n1_entendu" }],
        l: ["Pas après pas. Tu poses les pieds comme sur du verre.", "Il tourne la tête… vers l'endroit où tu étais.", "Tu te glisses dans {abri}. Il ne t'a pas suivi."],
        indice: { id: "oreilles", t: "Il est presque aveugle : il chasse à l'*oreille*." },
        next: "n1_fin"
      },
      n1_lampe: {
        vue: "decouvert", fx: ["faisceau"], acteurs: [{ q: "zombie", a: "decouvert" }], on: { peur: 20 },
        l: ["Ton faisceau l'attrape. Il ne cligne même pas des yeux.", "Ses yeux sont presque fermés. Il ne voit *rien*.", "Mais le petit *clic* de ta lampe, lui, il l'a entendu.[[ecoute]]", "Il vient droit sur toi."],
        indice: { id: "oreilles", t: "Il est presque aveugle : il chasse à l'*oreille*." },
        choix: [
          { t: "Lancer {caillou} loin de toi", fx: { visi: 0 }, go: "n1_leurre" },
          { t: "Éteindre et ne plus bouger", calme: true, fx: { visi: 0 }, go: "n1_fige" },
          { t: "Courir", fx: { bruit: 35, visi: 0 }, go: "n1_entendu" }
        ]
      },
      n1_entendu: {
        vue: "proche", fx: ["danger"], acteurs: [{ q: "zombie", a: "proche" }], on: { peur: 15 },
        l: ["Il pivote. Vers *toi*. Exactement vers toi.[[ecoute]]", "Il court. Vite."],
        choix: [
          { t: "Ramasser {caillou} et le lancer loin de toi", go: "n1_leurre" },
          { t: "Te jeter dans {abri} et fermer", go: "n1_porte" }
        ]
      },
      n1_leurre: {
        vue: "decouvert", acteurs: [{ q: "zombie", a: "fond" }],
        l: ["Tu lances {caillou} le plus loin possible.[[pierre]]", "Il s'arrête net. La tête tourne vers le bruit.", "Et il fonce… *là-bas*.", "Toi, tu ne bouges plus."],
        indice: { id: "leurre", t: "Un bruit lancé *ailleurs* l'envoie ailleurs." },
        next: "n1_fin"
      },
      n1_porte: {
        vue: "abri", fx: ["danger"], acteurs: [{ q: "joueur", a: "abri", pose: "cache" }], on: { peur: 20 },
        l: ["Tu claques la porte de {abri}. Tu te plaques au sol.[[porte]]", "Il est dehors. Il gratte. Il écoute.", "Tu entends ton propre cœur. Lui aussi, sûrement.[[coeur]]", "Longtemps. Puis il s'en va."],
        indice: { id: "coeur", t: "Il entend même ton *cœur* quand tu as peur." },
        next: "n1_fin"
      },
      n1_fin: {
        vue: { village: "eau", ile: "decouvert", metro: "decouvert" }, acteurs: [{ q: "zombie", a: "fond" }],
        l: {
          village: ["Vers la fin de la nuit, tu remarques une chose.", "Quand il passe près de la *cascade*, il s'arrête. Il secoue la tête.[[cascade]]", "Il repart en *zigzag*. Comme s'il était devenu sourd."],
          ile: ["Vers la fin de la nuit, le vent forcit.[[vent]]", "Sur la lande, il tourne en rond. Il secoue la tête.", "Le *ressac* et le vent : il n'entend plus rien."],
          metro: ["Vers la fin de la nuit, un grondement énorme traverse les murs : une rame de travaux, sur une autre ligne.[[train]]", "Sur le quai, il tourne en rond, la tête entre les mains.", "Puis le silence revient. Et il se remet à *écouter*."]
        },
        indice: { id: "bruitfond", t: "Un gros *bruit de fond* le rend sourd." },
        next: "aube1"
      },

      /* ── NUIT 2 ── */
      n2: {
        nuit: 2, vue: "large", on: { peur: 15 },
        l: {
          village: ["Deuxième nuit.", "Tu dois traverser le village jusqu'à l'église.", "Les ruelles sont *silencieuses*. Chaque pas compte."],
          ile: ["Deuxième nuit. Le vent souffle fort.[[vent]]", "Tu dois traverser la lande jusqu'au *phare*."],
          metro: ["Deuxième nuit.", "Tu dois longer le quai jusqu'au *local technique*.", "Un quai carrelé, silencieux. Le pire endroit pour lui échapper."]
        },
        choix: {
          village: [
            { t: "Longer la cascade, dans son vacarme", go: "n2_masque" },
            { t: "Couper par la place, sur la pointe des pieds", calme: true, fx: { bruit: 15 }, go: "n2_pointe" },
            { t: "Courir", fx: { bruit: 40 }, go: "n2_repere" }
          ],
          ile: [
            { t: "Avancer pendant les rafales", go: "n2_masque" },
            { t: "Marcher sur la pointe des pieds", calme: true, fx: { bruit: 15 }, go: "n2_pointe" },
            { t: "Courir", fx: { bruit: 40 }, go: "n2_repere" }
          ],
          metro: [
            { t: "Enlever tes chaussures et avancer en chaussettes", fx: { bruit: 5 }, go: "n2_chaussettes" },
            { t: "Marcher sur la pointe des pieds", calme: true, fx: { bruit: 15 }, go: "n2_pointe" },
            { t: "Courir", fx: { bruit: 40 }, go: "n2_repere" }
          ]
        }
      },
      n2_masque: {
        vue: { village: "eau", ile: "decouvert" }, acteurs: [{ q: "zombie", a: "fond" }],
        l: {
          village: ["Tu longes le torrent. La *cascade* gronde à côté de toi.[[cascade]]", "Tu marches normalement. Tu pourrais presque *crier*.", "Il est à vingt mètres. Il ne tourne même pas la tête."],
          ile: ["Tu avances quand la rafale arrive. Tu t'arrêtes quand elle retombe.[[vent]]", "Le vent et le ressac couvrent tout.", "Il passe à dix mètres. Il ne tourne même pas la tête."]
        },
        indice: { id: "bruitfond", t: "Un gros *bruit de fond* le rend sourd." },
        next: "n2_science"
      },
      n2_pointe: {
        vue: "passage", acteurs: [{ q: "zombie", a: "fond" }], branche: [{ c: { peurMin: 50 }, go: "n2_coeur" }],
        l: ["Talon. Pointe. Talon. Pointe.", "Il est là, quelque part. Il écoute.", "Tu passes. De justesse."],
        next: "n2_science"
      },
      n2_chaussettes: {
        vue: "decouvert", acteurs: [{ q: "zombie", a: "fond" }], branche: [{ c: { peurMin: 50 }, go: "n2_coeur" }],
        l: ["Tu enlèves tes chaussures. Le carrelage est glacé.", "Tes pas ne font plus aucun bruit.", "Il passe tout près. Il n'entend rien. Tu atteins la porte."],
        next: "n2_science"
      },
      n2_coeur: {
        vue: "proche", fx: ["danger"], acteurs: [{ q: "zombie", a: "proche" }],
        l: ["Tu ne fais aucun bruit. Mais ton cœur… ton cœur *cogne*.[[coeur]]", "Il s'arrête. Il tourne la tête vers ta poitrine.", "Il a entendu."],
        indice: { id: "coeur", t: "Il entend même ton *cœur* quand tu as peur." },
        choix: [
          { t: "Lancer {caillou} au loin", go: "n2_leurre" },
          { t: "Respirer lentement pour calmer ton cœur", calme: true, go: "n2_respire" },
          { t: "Courir", fx: { bruit: 40 }, go: "n2_repere" }
        ]
      },
      n2_respire: {
        vue: "proche", acteurs: [{ q: "zombie", a: "fond" }], on: { peur: -20 },
        l: ["Tu inspires. Quatre secondes. Tu expires. Six secondes.[[souffle]]", "Ton cœur ralentit.", "Il penche la tête… et s'éloigne."],
        next: "n2_science"
      },
      n2_leurre: {
        vue: "decouvert", acteurs: [{ q: "zombie", a: "fond" }],
        l: ["{Caillou} vole et rebondit, loin.[[pierre]]", "Il bondit vers le bruit.", "Tu files."],
        indice: { id: "leurre", t: "Un bruit lancé *ailleurs* l'envoie ailleurs." },
        next: "n2_science"
      },
      n2_repere: {
        vue: "proche", fx: ["danger"], acteurs: [{ q: "zombie", a: "proche" }], on: { peur: 25 },
        l: ["Tes pas claquent.[[pas:course]]", "Il se retourne. Il *sait* exactement où tu es.", "Il court. Plus vite que toi."],
        choix: {
          village: [
            { t: "Lancer une pierre au loin", need: "pierre", go: "n2_leurre_objet" },
            { t: "Te jeter au pied de la cascade", go: "n2_masque_sauve" },
            { t: "Te battre", go: "n2_combat" }
          ],
          ile: [
            { t: "Tirer ta fusée au loin", need: "fusee", fx: { perd: "fusee" }, go: "n2_leurre_objet" },
            { t: "Te jeter dans les rochers, sous le ressac", go: "n2_masque_sauve" },
            { t: "Te battre", go: "n2_combat" }
          ],
          metro: [
            { t: "Lancer le pied-de-biche sur les rails, au loin", need: "piedbiche", fx: { perd: "piedbiche" }, go: "n2_leurre_objet" },
            { t: "Te battre", go: "n2_combat" }
          ]
        }
      },
      n2_leurre_objet: {
        vue: "decouvert", acteurs: [{ q: "zombie", a: "fond" }],
        l: {
          village: ["Ta pierre claque sur les pavés, au fond de la place.[[pierre]]", "Il bondit vers le bruit.", "Tu files."],
          ile: ["Ta fusée file vers la mer en sifflant, et éclate au loin.[[fusee]]", "Il bondit vers le bruit.", "Tu files."],
          metro: ["Le pied-de-biche sonne sur les rails, loin dans le tunnel.[[metal]]", "Il bondit vers le bruit.", "Tu files."]
        },
        indice: { id: "leurre", t: "Un bruit lancé *ailleurs* l'envoie ailleurs." },
        next: "n2_science"
      },
      n2_masque_sauve: {
        vue: { village: "eau", ile: "eau" }, acteurs: [{ q: "zombie", a: "fond" }],
        l: {
          village: ["Tu plonges au bord du torrent, contre la cascade.[[cascade]]", "Il arrive. Il s'arrête. Il secoue la tête.", "Il ne t'entend plus. Il repart en zigzag."],
          ile: ["Tu te jettes entre les rochers. Les vagues explosent tout autour.[[vague]]", "Il arrive. Il s'arrête. Il secoue la tête.", "Il ne t'entend plus."]
        },
        indice: { id: "bruitfond", t: "Un gros *bruit de fond* le rend sourd." },
        next: "n2_science"
      },
      n2_combat: {
        vue: "proche", fx: ["danger"], acteurs: [{ q: "zombie", a: "proche" }], on: { peur: 30, set: "blesse" },
        l: ["Tu te retournes et tu frappes.", "Il est plus fort que toi. Beaucoup plus.", "Tu t'arraches à lui, griffé, en sang.", "Tu as eu de la chance. Elle ne durera pas."],
        next: "n2_science"
      },
      n2_science: { type: "science", vue: "large", next: "n2_lieu" },
      n2_lieu: {
        vue: { village: "haut", ile: "haut", metro: "fond" }, decor: { metro: ["local"] },
        l: {
          village: ["L'église. La corde de la *cloche* pend jusqu'au sol.", "Une cloche, c'est un vacarme qui dure.", "Et derrière, la cascade gronde jour et nuit."],
          ile: ["Le phare. Le mécanisme de la lanterne est prêt.", "Dehors, le vent et le ressac ne s'arrêtent presque jamais."],
          metro: ["Le local technique. Fermé par une *chaîne*.", "Derrière la grille, un levier : *VENTILATION*.", "Si ça marche, ça va *rugir* dans toute la station."]
        },
        choix: {
          village: [
            { t: "Nouer ta corde à la cloche, pour sonner de loin", need: "corde", fx: { set: "corde_cloche" }, go: "n2_fin" },
            { t: "Repérer le chemin le long du torrent", go: "n2_fin" },
            { t: "Attendre le jour", go: "n2_fin" }
          ],
          ile: [
            { t: "Repérer le chemin des rochers, sous le ressac", go: "n2_fin" },
            { t: "Attendre le jour", go: "n2_fin" }
          ],
          metro: [
            { t: "Forcer la chaîne au pied-de-biche", need: "piedbiche", fx: { set: "local", bruit: 30 }, go: "n2_chaine" },
            { t: "Chercher la clé dans la cabine du chef", fx: { set: "local" }, go: "n2_cle" },
            { t: "Attendre le matin", go: "n2_fin" }
          ]
        }
      },
      n2_chaine: {
        vue: "fond", decor: ["local"], on: { peur: 20 },
        l: ["La chaîne claque sur le carrelage.[[metal]]", "Un bruit énorme, dans le silence.", "Au bout du quai, il *se retourne*. Tu files te cacher dans le local."],
        next: "n2_fin"
      },
      n2_cle: {
        vue: "abri", acteurs: [{ q: "joueur", a: "abri", pose: "cache" }],
        l: ["Dans la cabine, une clé sur un clou : *LOCAL TECH*.", "Tu la décroches sans un bruit.", "Tu ouvres le local. Le levier est là."],
        next: "n2_fin"
      },
      n2_fin: {
        vue: "large",
        l: ["Il rôde jusqu'à l'aube. Tu l'entends renifler.[[ecoute]]", "Plus qu'*une* nuit."],
        next: "aube2"
      },

      /* ── NUIT 3 ── */
      n3: {
        nuit: 3, vue: "large", on: { peur: 15 },
        l: {
          village: ["L'hélicoptère se posera au *col* à l'aube.", "Le sentier longe le torrent… puis traverse les alpages, en silence.", "Et il t'attend."],
          ile: ["Rallumer le phare. Puis traverser la chaussée jusqu'au port.", "Il rôde sur la lande. Ce soir, le vent est tombé."],
          metro: ["Le terminus est au bout du tunnel. Un tunnel où le moindre pas résonne.", "Il est quelque part dedans."]
        },
        choix: {
          village: [
            { t: "Sonner la cloche depuis le cimetière, avec ta corde", req: { flag: "corde_cloche" }, pourquoi: "Ta corde n'est pas nouée à la cloche.", go: "n3_cloche" },
            { t: "Monter par le torrent, dans le vacarme de la cascade", go: "n3_torrent" },
            { t: "Lancer des pierres derrière toi en montant", need: "pierre", go: "n3_leurres" },
            { t: "Monter en silence, sur la pointe des pieds", calme: true, go: "n3_silence" }
          ],
          ile: [
            { t: "Allumer le phare, puis passer par les rochers sous le ressac", go: "n3_rochers" },
            { t: "Faire hurler la corne de brume pour le faire fuir", need: "corne", go: "n3_corne" },
            { t: "Tirer ta fusée au loin pour l'attirer ailleurs", need: "fusee", go: "n3_fusee" },
            { t: "Traverser la lande sur la pointe des pieds", calme: true, go: "n3_silence" }
          ],
          metro: [
            { t: "Lancer la ventilation et filer dans le tunnel", req: { flag: "local" }, pourquoi: "Le local technique est fermé.", go: "n3_ventilation" },
            { t: "Lancer le pied-de-biche dans l'autre tunnel", need: "piedbiche", go: "n3_leurres" },
            { t: "Avancer en chaussettes dans le tunnel", calme: true, go: "n3_silence" },
            { t: "Courir jusqu'au terminus", go: "n3_course" }
          ]
        }
      },
      n3_cloche: {
        vue: "large", decor: ["cloche"], acteurs: [{ q: "zombie", a: "decouvert" }],
        l: ["Tu tires la corde depuis le cimetière.[[cloche]]", "La cloche *hurle*. Un vacarme énorme, qui ne s'arrête pas.", "Il se tient la tête. Il tourne sur lui-même. Il est *sourd*.", "Tu montes au col sans même te cacher.[[helico]]"],
        fin: "sourd"
      },
      n3_torrent: {
        vue: "eau", acteurs: [{ q: "zombie", a: "fond" }],
        l: ["Tu remontes le torrent, à côté de la cascade.[[cascade]]", "Un vacarme blanc, continu. Tes pas n'existent plus.", "Il est sur le sentier, à trente mètres. Il n'entend rien.", "Au-dessus de la cascade, les alpages. Le *col*. Le jour.[[helico]]"],
        fin: "sourd"
      },
      n3_rochers: {
        vue: "eau", decor: ["phare"], acteurs: [{ q: "zombie", a: "fond" }],
        l: ["Tu allumes le phare. Puis tu descends dans les rochers.[[phare]]", "Le *ressac* explose autour de toi. Un vacarme qui ne s'arrête jamais.[[vague]]", "Il est sur la lande, au-dessus. Il n'entend rien.", "Tu rejoins la chaussée. Le bateau t'attend.[[bateau]]"],
        fin: "sourd"
      },
      n3_ventilation: {
        vue: "large", decor: ["ventilation", "local"], acteurs: [{ q: "zombie", a: "decouvert" }],
        l: ["Tu abaisses le levier. La ventilation *rugit*.[[ventilation]]", "Un vacarme de vent et de fer remplit toute la station.", "Il se tient la tête. Il tourne en rond. Il est *sourd*.", "Tu marches dans le tunnel, sans même te cacher.[[train]]"],
        fin: "sourd"
      },
      n3_leurres: {
        vue: "objectif", acteurs: [{ q: "zombie", a: "fond" }],
        l: {
          village: ["Tu montes. À chaque virage, tu lances une pierre *derrière* toi.[[pierre]]", "Il court vers chaque bruit. Toujours en retard d'un virage.", "Ta dernière pierre tombe au moment où le jour se lève.[[helico]]"],
          metro: ["Tu lances le pied-de-biche de toutes tes forces dans l'*autre* tunnel.[[metal]]", "Il rebondit sur les rails, encore et encore. Le tunnel porte le bruit très loin.", "Il fonce vers le bruit. Toi, tu pars dans l'autre sens. En chaussettes.[[train]]"]
        },
        fin: "leurre"
      },
      n3_fusee: {
        vue: "objectif", decor: ["phare"], acteurs: [{ q: "zombie", a: "fond" }],
        l: ["Tu tires ta fusée vers la pointe de l'île. Elle file en sifflant et explose au loin.[[fusee]]", "Il bondit vers le bruit.", "Toi, tu allumes le phare et tu cours vers la chaussée.[[bateau]]"],
        fin: "leurre"
      },
      n3_silence: {
        vue: "objectif", acteurs: [{ q: "joueur", a: "objectif", pose: "cache" }],
        branche: [{ c: { flag: "blesse" }, go: "n3_souffle" }, { c: { peurMin: 50 }, go: "n3_coeur" }],
        l: {
          village: ["Pas à pas. Talon. Pointe.", "Tu entends tout. Lui aussi.", "Mais tu ne fais *rien* entendre.", "Le jour se lève. Tu es arrivé au col.[[helico]]"],
          ile: ["Tu allumes le phare. Puis pas à pas. Talon. Pointe.", "Tu entends tout. Lui aussi.", "Mais tu ne fais *rien* entendre.", "Le bateau t'attend au port.[[bateau]]"],
          metro: ["Pas à pas, en chaussettes. Talon. Pointe.", "Tu entends tout. Lui aussi.", "Mais tu ne fais *rien* entendre.", "La lumière du terminus.[[train]]"]
        },
        fin: "silence"
      },
      n3_souffle: {
        vue: "objectif", fx: ["danger"], acteurs: [{ q: "zombie", a: "objectif" }],
        l: ["Tu avances en silence. Mais ta blessure te brûle.", "Ta respiration *siffle* à chaque pas.[[souffle]]", "Il l'entend. Il vient.", "Tu ne peux pas courir. Pas dans cet état."],
        fin: "traque"
      },
      n3_coeur: {
        vue: "objectif", fx: ["danger"], acteurs: [{ q: "zombie", a: "objectif" }],
        l: ["Tu avances en silence. Pas un bruit.", "Sauf ton cœur. Il *cogne*.[[coeur]]", "Il s'arrête. Il tourne la tête vers ta poitrine.", "Il bondit."],
        fin: "coeur"
      },
      n3_corne: {
        vue: "decouvert", fx: ["danger"], acteurs: [{ q: "zombie", a: "decouvert" }],
        l: ["Tu fais hurler la corne de brume.[[corne]]", "Il se fige. Puis il pivote. Vers la corne. Vers *toi*.", "Un bruit énorme… qui sort de tes mains.", "Il court droit sur toi."],
        fin: "traque"
      },
      n3_course: {
        vue: "objectif", fx: ["danger"], acteurs: [{ q: "zombie", a: "objectif" }],
        l: ["Tu cours dans le tunnel.[[pas:course]]", "Chaque pas *claque* et résonne sur cent mètres.", "Il n'a même pas besoin de te voir.", "Il court derrière toi. Plus vite que toi."],
        fin: "traque"
      }
    },

    fins: {
      sourd: { type: "survie", parfait: true, titre: { village: "LE VACARME", ile: "LE RESSAC", metro: "LA VENTILATION" }, texte: "Sous un énorme bruit de fond, il était sourd à toi." },
      leurre: { type: "survie", parfait: true, titre: "LE LEURRE", texte: "Un bruit lancé ailleurs l'a envoyé ailleurs." },
      silence: { type: "survie", parfait: false, titre: "SUR LA POINTE DES PIEDS", texte: "Pas un bruit. Mais tu n'as rien fait pour le tromper." },
      traque: {
        type: "mort", titre: "À L'OREILLE",
        cause: "L'Écouteur.",
        pourquoi: "Il chasse à l'oreille. Le bruit t'a désigné aussi sûrement qu'une lampe.",
        conseil: "Cache tes pas sous un gros bruit de fond, ou lance un bruit ailleurs."
      },
      coeur: {
        type: "mort", titre: "LE CŒUR",
        cause: "L'Écouteur, guidé par ton cœur.",
        pourquoi: "Tu ne faisais aucun bruit. Mais la peur faisait battre ton cœur assez fort pour lui.",
        conseil: "Calme-toi avant de bouger. Ou cache-toi sous un bruit plus fort que ton cœur."
      }
    },

    science: {
      titre: "L'OREILLE DE LA CHOUETTE",
      diapos: [
        {
          l: ["La chouette effraie chasse dans le *noir complet*.", "Un bruit arrive à une oreille un tout petit peu *avant* l'autre.", "Son cerveau mesure cet écart, *moins d'un millième* de seconde, et en déduit la direction.", "Ses oreilles sont même décalées en hauteur : elle sait si ça vient d'en *haut* ou d'en *bas*."],
          dessin: function (k, t) {
            k.fond();
            k.cercle(330, 330, 120, "#c9b48a", true);
            k.cercle(285, 320, 22, "#1a1206", true); k.cercle(375, 320, 22, "#1a1206", true);
            k.poly([[330, 345], [318, 372], [342, 372]], "#8a6a3a");
            k.cercle(212, 300, 14, k.c.neon, false, 1, 4); k.cercle(448, 350, 14, k.c.neon, false, 1, 4);
            k.texte("oreille haute", 160, 250, { taille: 22, couleur: k.c.neon, gras: false });
            k.texte("oreille basse", 520, 410, { taille: 22, couleur: k.c.neon, gras: false });
            var mx = 760, my = 520;
            k.cercle(mx, my, 16, "#9aa4b5", true); k.ligne([[mx + 14, my + 4], [mx + 50, my + 14]], "#9aa4b5", 3);
            var cyc = (t * 0.6) % 1, r = cyc * 520;
            k.arc(mx, my, r, Math.PI * 0.9, Math.PI * 1.45, k.c.rouge, 1 - cyc * 0.6, 4);
            var dD = Math.hypot(mx - 448, my - 350), dG = Math.hypot(mx - 212, my - 300);
            if (r > dD) k.cercle(448, 350, 26, k.c.or, true, 0.8);
            if (r > dG) k.cercle(212, 300, 26, k.c.or, true, 0.8);
            if (t > 4) k.texte("Δt < 1 ms", 330, 560, { taille: 44, couleur: k.c.or, alpha: k.prog(t, 4, 0.8) });
          }
        },
        {
          l: ["Mais si un *bruit de fond* fort et continu couvre tout…", "…tes petits bruits disparaissent dessous.", "Plus d'écart à mesurer : il est *sourd* à toi."],
          dessin: function (k, t) {
            k.fond();
            k.axes(70, 380, 780, 300, "temps", "volume");
            var fond = k.prog(t, 2, 2) * 210;
            var pts = [];
            for (var i = 0; i <= 260; i++) {
              var x = i / 260, v = 0;
              [0.15, 0.32, 0.5, 0.68, 0.85].forEach(function (p) { v += 150 * Math.exp(-Math.pow((x - p) / 0.008, 2)); });
              pts.push([70 + x * 780, 380 - v]);
            }
            k.ligne(pts, k.c.neon, 4);
            if (fond > 0) {
              var zone = [[70, 380]];
              for (var j = 0; j <= 200; j++) zone.push([70 + j / 200 * 780, 380 - fond * (0.85 + 0.15 * Math.sin(j * 1.7 + t * 9))]);
              zone.push([850, 380]);
              k.poly(zone, "rgba(160,175,200,.75)");
              k.texte("CASCADE, RESSAC, VENTILATION…", 460, 380 - fond - 30, { taille: 26, couleur: k.c.blanc });
            }
            k.texte("tes pas", 140, 200, { taille: 24, couleur: k.c.neon, alpha: 1 - k.prog(t, 2.5, 1) });
            if (t > 4) k.texte("PLUS RIEN À ENTENDRE", 460, 540, { taille: 38, couleur: k.c.or, alpha: k.prog(t, 4, 0.6) });
          }
        },
        {
          l: {
            village: ["Et un bruit lancé *ailleurs* l'envoie ailleurs.", "La *cascade*, la *cloche*, une *pierre* lancée au loin : ce sont tes armes."],
            ile: ["Et un bruit lancé *ailleurs* l'envoie ailleurs.", "Ici, le *vent* et le *ressac* grondent presque sans arrêt : profites-en."],
            metro: ["Et un bruit lancé *ailleurs* l'envoie ailleurs.", "Ici, tout est silencieux… sauf ce que tu *provoques*. Pense à la *ventilation*."]
          },
          dessin: function (k, t) {
            k.fond();
            var tourne = k.prog(t, 1, 1);
            var a = -tourne * 0.9;
            var hx = 450, hy = 300;
            k.cercle(hx, hy, 70, "#a9b4a6", true);
            k.cercle(hx - 70 + Math.sin(a) * 10, hy - 20, 22, "#a9b4a6", true); k.cercle(hx + 70 + Math.sin(a) * 10, hy + 10, 22, "#a9b4a6", true);
            k.ligne([[hx, hy], [hx + Math.cos(Math.PI + a * 0.4) * 160 - 60 * tourne, hy + 40 * tourne]], k.c.or, 4, 0.8, [10, 8]);
            var sx = 140, sy = 470;
            if (t > 0.5) { var c = (t * 0.8) % 1; k.arc(sx, sy, 20 + c * 200, -1.2, 0.4, k.c.rouge, 1 - c, 4); }
            k.cercle(sx, sy, 14, "#8f98a3", true);
            k.bonhomme(760 - Math.min(1, Math.max(0, t - 2)) * 60, 520, 1.2, k.c.neon);
            k.texte("ICI !", sx, sy - 60, { taille: 30, couleur: k.c.rouge });
          }
        }
      ]
    }
  });
})(typeof window !== "undefined" ? window : globalThis);
