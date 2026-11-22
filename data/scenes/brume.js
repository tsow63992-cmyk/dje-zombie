/* Dje_zombie — Saison 1 — LA BRUME.
   Règles : elle avance dans un brouillard froid ; dedans, elle est invisible. Une lampe braquée dedans = mur blanc.
   Point faible : vent et soleil la dissipent ; le brouillard froid reste en bas ; un faisceau en travers révèle son ombre. */
(function (root) {
  "use strict";
  var DJE = root.DJE;

  DJE.histoire("brume", {
    scenes: {
      n1: {
        nuit: 1, vue: "decouvert", fx: ["brume"],
        l: {
          village: ["Silence.", "Un *brouillard* blanc descend la ruelle. Épais. Froid.[[brume]]", "Il avance. Contre le vent."],
          ile: ["Le vent tombe d'un coup.", "Un *brouillard* blanc monte de la mer. Il avale la lande, mètre par mètre.[[brume]]"],
          metro: ["Silence.", "Un *brouillard* blanc sort du tunnel. Sous terre. Sans raison.[[brume]]", "Il glisse sur les rails, vers le quai."]
        },
        choix: [
          { t: "Braquer ta lampe sur le brouillard", need: "lampe", fx: { visi: 2 }, go: "n1_mur" },
          { t: "Grimper le plus haut possible", go: "n1_haut" },
          { t: "Reculer loin du brouillard", go: "n1_recule" }
        ]
      },
      n1_mur: {
        vue: "decouvert", fx: ["brume", "faisceau", "danger"], on: { peur: 20 },
        l: ["Ton faisceau frappe le brouillard.", "Un *mur blanc*. Tu ne vois plus rien. Ni devant, ni autour.", "Mais toi, au bout de ta lampe, tu brilles comme un phare.", "Dans le blanc, une forme se déplace. *Vers* toi."],
        indice: { id: "mur", t: "Ta lampe dans le brouillard ? Un *mur blanc*. Et elle, elle voit ta lumière." },
        choix: [
          { t: "Éteindre et te jeter sur le côté", fx: { visi: 0 }, go: "n1_cote" },
          { t: "Courir", fx: { visi: 0, bruit: 30 }, go: "n1_recule" }
        ]
      },
      n1_cote: {
        vue: "proche", fx: ["brume"], on: { peur: 20 },
        l: ["Tu éteins. Tu plonges sur le côté.", "Une main glacée frôle ta nuque.[[souffle]]", "Le brouillard passe sur toi… et continue."],
        next: "n1_fin"
      },
      n1_haut: {
        vue: "haut", fx: ["brume"],
        l: {
          village: ["Tu grimpes sur un toit, puis sur le muret du clocher.", "Le brouillard passe *en dessous* de toi. Une rivière blanche dans les ruelles.", "Tu es au-dessus. Hors de sa portée."],
          ile: ["Tu grimpes sur le toit du blockhaus.", "Le brouillard passe en dessous. Une mer blanche sur la lande.", "Tu es au-dessus."],
          metro: ["Tu grimpes sur la passerelle, au-dessus des voies.", "Le brouillard glisse en dessous de toi, sur les rails. Il ne monte pas.", "Tu es au-dessus."]
        },
        indice: { id: "bas", t: "Le brouillard froid reste *en bas*." },
        next: "n1_fin"
      },
      n1_recule: {
        vue: "proche", fx: ["brume", "danger"], on: { peur: 25 },
        l: ["Tu recules. Le brouillard avance plus vite que toi.", "Il t'avale. Tu ne vois plus tes mains.[[brume]]", "Un souffle froid, juste derrière toi. Tu cours, à l'aveugle.[[pas:course]]", "Tu sors du blanc. Le brouillard s'arrête… et repart ailleurs."],
        indice: { id: "brouillard", t: "Quand le brouillard *monte*, c'est qu'elle approche." },
        next: "n1_fin"
      },
      n1_fin: {
        vue: "large", decor: ["aube"], fx: ["brume"],
        l: ["Jusqu'à l'aube, le brouillard rôde.", "Au lever du soleil, il *fond*. En quelques minutes, il ne reste rien."],
        indice: { id: "soleil", t: "Au lever du *soleil*, son brouillard fond." },
        next: "aube1"
      },

      /* ── NUIT 2 ── */
      n2: {
        nuit: 2, vue: "large", on: { peur: 10 }, fx: ["brume"],
        l: {
          village: ["Tu dois rejoindre l'église. Le brouillard remplit déjà le bas du village."],
          ile: ["Il faut atteindre le phare. Le brouillard marin recouvre toute la lande."],
          metro: ["Tu dois atteindre le local technique. Le brouillard stagne sur le quai."]
        },
        choix: [
          { t: { village: "Passer par les toits, au-dessus de la nappe", ile: "Passer par la crête de la falaise", metro: "Passer par la passerelle, au-dessus des voies" }, go: "n2_haut" },
          { t: "Poser ta lampe par terre, le faisceau en travers du passage", need: "lampe", go: "n2_travers" },
          { t: "Traverser le brouillard à l'aveugle", go: "n2_aveugle" }
        ]
      },
      n2_haut: {
        vue: "haut", fx: ["brume"],
        l: {
          village: ["Tu passes de toit en toit, au-dessus de la nappe.", "Sous toi, le brouillard. Quelque part dedans, elle te cherche.", "Elle ne monte pas."],
          ile: ["Tu longes la crête de la falaise. Le brouillard reste plus bas, sur la lande.", "Ici, le vent du large le déchire en lambeaux.[[vent]]"],
          metro: ["Tu passes sur la passerelle. Le brouillard stagne sur les voies, en dessous.", "Elle ne monte pas."]
        },
        indice: { id: "bas", t: "Le brouillard froid reste *en bas*." },
        next: "n2_science"
      },
      n2_travers: {
        vue: "passage", fx: ["brume"], acteurs: [{ q: "zombie", a: "passage" }],
        l: ["Tu poses ta lampe par terre, le faisceau *en travers* du passage.", "Dans le brouillard, le faisceau devient une barre de lumière. Visible. Solide.", "Et dans la barre… une *ombre*. Une silhouette découpée dans le blanc.", "Maintenant, tu sais où elle est. Tu passes de l'autre côté."],
        indice: { id: "ombre", t: "Un faisceau *en travers* du brouillard révèle son ombre." },
        next: "n2_science"
      },
      n2_aveugle: {
        vue: "proche", fx: ["brume", "danger"], on: { peur: 30 },
        l: ["Tu entres dans le brouillard. Tu ne vois plus rien.", "Un souffle froid. À gauche ? À droite ?[[souffle]]", "Une main glacée t'attrape le bras."],
        choix: [
          { t: "Te dégager et courir vers {haut}", go: "n2_degage" },
          { t: "Allumer ta lampe pour la voir", need: "lampe", go: "n2_mur" }
        ]
      },
      n2_degage: {
        vue: "haut", fx: ["brume"], on: { peur: 10 },
        l: ["Tu tires de toutes tes forces. Tu t'arraches.", "Tu cours vers {haut}. Tu grimpes.[[pas:course]]", "Le brouillard s'arrête en dessous de toi."],
        indice: { id: "bas", t: "Le brouillard froid reste *en bas*." },
        next: "n2_science"
      },
      n2_mur: {
        vue: "proche", fx: ["brume", "faisceau", "danger"],
        l: ["Tu allumes. Un mur blanc, aveuglant.", "Tu ne vois rien. Elle, elle te voit très bien.", "La main glacée ne te lâche plus."],
        fin: "mur"
      },
      n2_science: { type: "science", vue: "large", next: "n2_lieu" },
      n2_lieu: {
        vue: { village: "haut", ile: "haut", metro: "fond" }, decor: { metro: ["local"] }, fx: ["brume"],
        l: {
          village: ["Le clocher. Tout en haut, au-dessus du brouillard.", "D'ici, la nappe blanche remplit la vallée. Les *crêtes*, elles, dépassent."],
          ile: ["Le phare. Le brouillard s'arrête à mi-hauteur de la tour.", "Le faisceau, en tournant, va *traverser* le brouillard de côté."],
          metro: ["Le local technique. Un levier : *VENTILATION*.", "Et une échelle vers le puits d'aération : l'air *monte* par là, vers la rue."]
        },
        choix: {
          village: [
            { t: "Repérer le chemin des crêtes jusqu'au col", fx: { set: "crete" }, go: "n2_fin" },
            { t: "Dormir en haut du clocher", go: "n2_fin" }
          ],
          ile: [
            { t: "Tester la lanterne", go: "n2_lanterne" },
            { t: "Attendre le jour", go: "n2_fin" }
          ],
          metro: [
            { t: "Forcer la porte au pied-de-biche", need: "piedbiche", fx: { set: "local" }, go: "n2_fin" },
            { t: "Chercher la clé dans la cabine vitrée", fx: { set: "local" }, go: "n2_cle" },
            { t: "Attendre le matin", go: "n2_fin" }
          ]
        }
      },
      n2_lanterne: {
        vue: "large", decor: ["phare"], fx: ["brume"], acteurs: [{ q: "zombie", a: "decouvert" }],
        l: ["Tu lances le mécanisme. Le faisceau balaie la lande.[[phare]]", "Dans le brouillard, il devient une *lame* de lumière.", "Et dans la lame, une ombre passe. Une silhouette, découpée dans le blanc.", "Tu coupes."],
        indice: { id: "ombre", t: "Un faisceau *en travers* du brouillard révèle son ombre." },
        next: "n2_fin"
      },
      n2_cle: {
        vue: "abri", acteurs: [{ q: "joueur", a: "abri", pose: "cache" }],
        l: ["Dans la cabine vitrée, une clé : *LOCAL TECH*.", "Tu ouvres le local. Le levier est là."],
        next: "n2_fin"
      },
      n2_fin: {
        vue: "large", decor: ["aube"],
        l: ["Tu attends le soleil. Le brouillard fond à l'aube, comme hier.", "Plus qu'*une* nuit."],
        next: "aube2"
      },

      /* ── NUIT 3 ── */
      n3: {
        nuit: 3, vue: "large", on: { peur: 10 }, fx: ["brume"],
        l: {
          village: ["L'hélicoptère se posera au *col*, à l'aube. Le brouillard remplit déjà la vallée.", "Elle est dedans. Quelque part."],
          ile: ["Rallumer le phare. Puis rejoindre le port par la chaussée.", "Le brouillard marin est plus épais que jamais. Elle est dedans."],
          metro: ["Le terminus est au bout du tunnel. Un tunnel rempli de brouillard.", "Elle est dedans."]
        },
        choix: {
          village: [
            { t: "Monter par les crêtes, au-dessus de la nappe", req: { flag: "crete" }, pourquoi: "Tu n'as pas repéré le chemin des crêtes.", go: "n3_crete" },
            { t: "Attendre en haut du clocher que le soleil se lève", go: "n3_soleil" },
            { t: "Poser ta lampe en travers du sentier", need: "lampe", go: "n3_travers" },
            { t: "Traverser le brouillard à l'aveugle", go: "n3_aveugle" }
          ],
          ile: [
            { t: "Allumer le phare : son faisceau balaiera le brouillard", go: "n3_phare" },
            { t: "Attendre que le vent du large se lève", go: "n3_vent" },
            { t: "Éclairer droit devant toi avec ta lampe", need: "lampe", go: "n3_mur" },
            { t: "Traverser à l'aveugle", go: "n3_aveugle" }
          ],
          metro: [
            { t: "Lancer la ventilation pour aspirer le brouillard", req: { flag: "local" }, pourquoi: "Le local technique est fermé.", go: "n3_ventilation" },
            { t: "Poser ta lampe en travers du tunnel", need: "lampe", go: "n3_travers" },
            { t: "Éclairer droit devant toi avec ta lampe", need: "lampe", go: "n3_mur" },
            { t: "Traverser le tunnel à l'aveugle", go: "n3_aveugle" }
          ]
        }
      },
      n3_crete: {
        vue: "objectif", fx: ["brume"],
        l: ["Tu montes par les crêtes. Sous toi, une mer de *nuages*.", "Le brouillard froid reste au fond. Elle reste avec lui.", "Tu marches au-dessus d'elle, sous les étoiles.", "Au col, l'hélicoptère se pose au premier rayon.[[helico]]"],
        fin: "dessus"
      },
      n3_soleil: {
        vue: "large", decor: ["aube"], fx: ["brume"],
        l: ["Tu restes en haut du clocher toute la nuit. Le brouillard lèche les murs, en dessous.", "Le ciel pâlit. Le premier rayon de *soleil* touche la nappe.", "Elle fond. Elle se déchire. Elle disparaît.", "Tu cours jusqu'au col. L'hélicoptère est là.[[helico]]"],
        fin: "soleil"
      },
      n3_travers: {
        vue: "objectif", fx: ["brume"], acteurs: [{ q: "zombie", a: "objectif" }],
        l: {
          village: ["Tu poses ta lampe sur un rocher, le faisceau en travers du sentier.", "Une barre de lumière dans le blanc. Tu attends.", "Une ombre la traverse. *Là*. À gauche.", "Tu passes à droite, en silence.[[helico]]"],
          metro: ["Tu poses ta lampe sur le rail, le faisceau en travers du tunnel.", "Une barre de lumière dans le blanc. Tu attends.", "Une ombre la traverse. *Là*. Contre le mur de gauche.", "Tu passes à droite, en silence.[[train]]"]
        },
        fin: "ombre"
      },
      n3_phare: {
        vue: "large", decor: ["phare"], fx: ["brume"], acteurs: [{ q: "zombie", a: "decouvert" }],
        l: ["Tu allumes. Le faisceau balaie le brouillard, de côté.[[phare]]", "À chaque passage, une lame de lumière. Et dans la lame… son *ombre*.", "Tu sais où elle est, à chaque tour. Tu descends quand elle est loin.", "Tu traverses la chaussée. Le bateau t'attend.[[bateau]]"],
        fin: "ombre"
      },
      n3_vent: {
        vue: "large", decor: ["aube"],
        l: ["Tu allumes le phare. Puis tu attends, accroupi contre un muret.[[phare]]", "Vers cinq heures, le *vent du large* se lève.[[vent]]", "Le brouillard se déchire en lambeaux. Elle n'a plus nulle part où se cacher.", "Elle s'enfuit vers la mer. Tu cours au port.[[bateau]]"],
        fin: "vent"
      },
      n3_ventilation: {
        vue: "large", decor: ["ventilation", "local"], acteurs: [{ q: "zombie", a: "passage" }],
        l: ["Tu abaisses le levier. Le puits d'aération se met à *aspirer*.[[ventilation]]", "Le brouillard monte, tourbillonne, s'engouffre vers la surface.", "En une minute, le tunnel est clair. Et elle est là, au milieu des rails. *Visible*.", "Tu la contournes largement. Le train t'attend.[[train]]"],
        fin: "vent"
      },
      n3_aveugle: {
        vue: "proche", fx: ["brume", "danger"],
        l: ["Tu entres dans le brouillard.", "Tu ne vois plus tes pieds. Plus le chemin. Plus rien.[[brume]]", "Un souffle glacé dans ton cou.[[souffle]]", "Tu ne l'as jamais vue venir."],
        fin: "blanc"
      },
      n3_mur: {
        vue: "proche", fx: ["brume", "faisceau", "danger"],
        l: ["Tu allumes ta lampe, droit devant.", "Un *mur blanc*. Aveuglant.", "Toi, tu ne vois plus rien. Elle, elle voit ta lumière.", "La main glacée se pose sur ton épaule."],
        fin: "mur"
      }
    },

    fins: {
      dessus: { type: "survie", parfait: true, lieux: ["village"], titre: "LA MER DE NUAGES", texte: "Le brouillard froid reste au fond. Tu es passé au-dessus d'elle." },
      soleil: { type: "survie", parfait: true, lieux: ["village"], titre: "LE PREMIER RAYON", texte: "Le soleil a fait fondre son brouillard. Sans lui, elle n'est rien." },
      ombre: { type: "survie", parfait: true, titre: "L'OMBRE", texte: "Un faisceau en travers du brouillard a découpé son ombre. Tu savais où elle était." },
      vent: { type: "survie", parfait: true, lieux: ["ile", "metro"], titre: "LE VENT", texte: "Le courant d'air a déchiré son brouillard. Elle n'avait plus où se cacher." },
      blanc: {
        type: "mort", titre: "LE BLANC",
        cause: "La Brume, invisible dans son brouillard.",
        pourquoi: "Dans le brouillard, elle est invisible. Tu es entré chez elle, à l'aveugle.",
        conseil: "Passe au-dessus, attends le vent ou le soleil, ou révèle-la avec un faisceau en travers."
      },
      mur: {
        type: "mort", titre: "LE MUR BLANC",
        cause: "La Brume, guidée par ta lampe.",
        pourquoi: "Une lampe braquée dans le brouillard ne fait qu'un mur blanc. Toi, tu ne vois rien. Elle, elle voit ta lumière.",
        conseil: "Ne braque jamais ta lampe dans le brouillard : pose-la, faisceau en travers."
      }
    },

    science: {
      titre: "LA LUMIÈRE DANS LE BROUILLARD",
      diapos: [
        {
          l: ["Le brouillard, ce sont des milliards de *gouttelettes* d'eau.", "Chacune renvoie la lumière dans *tous les sens*.", "Braque ta lampe dedans : la lumière te revient en pleine figure. Un *mur blanc*."],
          dessin: function (k, t) {
            k.fond();
            var g = [[420, 200], [520, 260], [470, 360], [600, 330], [560, 450], [680, 220], [700, 400], [430, 480]];
            k.rect(60, 320, 60, 40, "#7f8ea6"); k.poly([[120, 315], [150, 300], [150, 380], [120, 365]], "#aab6c8");
            var p = k.prog(t, 0.3, 1);
            k.ligne([[150, 340], [150 + 300 * p, 340]], "#fff3c0", 10, 0.8);
            g.forEach(function (d, i) {
              k.cercle(d[0], d[1], 14, "#cfe0f5", true, 0.8);
              if (t > 1.3) for (var a = 0; a < 8; a++) { var r = 20 + ((t * 60 + i * 9) % 60); k.ligne([[d[0] + Math.cos(a * 0.785) * 18, d[1] + Math.sin(a * 0.785) * 18], [d[0] + Math.cos(a * 0.785) * r, d[1] + Math.sin(a * 0.785) * r]], "#fff3c0", 2, 0.5); }
            });
            if (t > 3) k.rect(380, 120, 400, 420, "rgba(240,240,250,.0)", true);
            if (t > 3.5) { k.rect(320, 130, 460, 430, "rgba(235,238,245," + (0.75 * k.prog(t, 3.5, 1.2)) + ")"); k.texte("MUR BLANC", 550, 345, { taille: 46, couleur: "#4a5872", alpha: k.prog(t, 4, 0.6) }); }
          }
        },
        {
          l: ["Mais un faisceau qui traverse le brouillard *de côté* devient visible : une barre de lumière.", "Et ce qui marche dedans y découpe une *ombre*."],
          dessin: function (k, t) {
            k.fond();
            for (var i = 0; i < 40; i++) k.cercle((i * 97) % 900, 120 + (i * 53) % 460, 40, "rgba(205,216,230,.06)", true);
            var sx = 300 + ((t * 70) % 400);
            k.poly([[40, 300], [900, 280], [900, 400], [40, 380]], "rgba(255,243,192,.28)");
            k.poly([[sx - 25, 285], [sx + 25, 284], [sx + 25, 396], [sx - 25, 395]], "#03070e");
            k.rect(sx - 22, 390, 44, 120, "rgba(207,216,227,.25)");
            k.cercle(sx, 360, 22, "rgba(207,216,227,.25)", true);
            k.rect(20, 320, 30, 40, "#7f8ea6");
            if (t > 1.5) k.texte("SON OMBRE", sx, 250, { taille: 30, couleur: k.c.or, alpha: k.prog(t, 1.5, 0.6) });
          }
        },
        {
          l: {
            village: ["L'air froid et humide est lourd : il reste *au fond* des vallées.", "Le clocher et les crêtes dépassent de la nappe.", "Et au premier rayon de *soleil*, le brouillard fond."],
            ile: ["Le brouillard marin naît quand un air humide passe sur la mer froide.", "Mais le *vent* du large le déchire. Et le *soleil* le fait fondre."],
            metro: ["Sous terre, pas de vent : le brouillard stagne.", "Sauf là où l'air bouge : les *puits d'aération*, la *ventilation*."]
          },
          dessin: function (k, t) {
            k.fond();
            k.poly([[0, 120], [450, 620], [900, 120], [900, 700], [0, 700]], k.c.ardoise);
            var niveau = 520 - 80 * Math.min(1, t / 3);
            var fond = Math.max(0, 1 - k.prog(t, 4, 2));
            k.poly([[0 + (700 - niveau) * 0.9, niveau], [900 - (700 - niveau) * 0.9, niveau], [450, 620]], "rgba(220,228,240," + (0.75 * fond) + ")");
            k.rect(420, 260, 60, 200, "#646f84"); k.poly([[410, 260], [450, 200], [490, 260]], "#2a3140");
            k.bonhomme(450, 260, 0.6, k.c.neon);
            if (t > 3.5) { k.cercle(800, 120, 40 * k.prog(t, 3.5, 1), "#ffc93c", true); k.texte("SOLEIL / VENT", 700, 60, { taille: 28, couleur: k.c.or, alpha: k.prog(t, 3.5, 0.6) }); }
          }
        }
      ]
    }
  });
})(typeof window !== "undefined" ? window : globalThis);
