/* Dje_zombie — Saison 1 — LE VITREUX.
   Règles : rapide, il ne voit que ce qui bouge. La peur fait trembler, et trembler, c'est bouger.
   Point faible : l'immobilité totale ; bouger quand tout bouge autour ; un leurre qui bouge ailleurs. */
(function (root) {
  "use strict";
  var DJE = root.DJE;

  DJE.histoire("vitreux", {
    scenes: {
      n1: {
        nuit: 1, vue: "decouvert", acteurs: [{ q: "zombie", a: "decouvert" }],
        l: {
          village: ["Silence.", "Sur la place, une silhouette. *Immobile*.", "Ses yeux sont *blancs*. Laiteux. Comme deux billes de verre."],
          ile: ["Le vent est tombé.", "Sur la lande, une silhouette. *Immobile*.", "Ses yeux sont *blancs*. Laiteux. Ils brillent sous la lune."],
          metro: ["Une lampe de secours grésille.", "Sur le quai, une silhouette. *Immobile*.", "Ses yeux sont *blancs*. Laiteux. Ils reflètent la lumière verte."]
        },
        choix: [
          { t: "Reculer doucement vers {abri}", go: "n1_recule" },
          { t: "Rester parfaitement immobile", calme: true, go: "n1_immobile" },
          { t: "Allumer ta lampe pour mieux le voir", need: "lampe", fx: { visi: 1 }, go: "n1_lampe" }
        ]
      },
      n1_recule: {
        vue: "decouvert", fx: ["danger"], acteurs: [{ q: "zombie", a: "decouvert" }], on: { peur: 25 },
        l: ["Tu fais un pas en arrière.", "Sa tête *claque* vers toi. Instantanément.", "Il fonce. *Très* vite."],
        indice: { id: "mouvement", t: "Il ne voit que ce qui *bouge*." },
        choix: [
          { t: "T'arrêter net", calme: true, go: "n1_stop" },
          { t: "Courir jusqu'à {abri}", go: "n1_course" }
        ]
      },
      n1_stop: {
        vue: "proche", acteurs: [{ q: "zombie", a: "proche" }],
        l: ["Tu t'arrêtes. Net. Un pied encore en l'air.", "Il freine. Il est à un mètre. Il te *fixe*… sans te voir.", "Il tourne la tête. À gauche. À droite.", "Puis il repart, comme si tu avais disparu."],
        indice: { id: "immobile", t: "*Immobile*, tu es invisible pour lui." },
        next: "n1_fin"
      },
      n1_course: {
        vue: "abri", fx: ["danger"], acteurs: [{ q: "joueur", a: "abri", pose: "cache" }], on: { peur: 20 },
        l: ["Tu cours.[[pas:course]]", "Il est plus rapide. Tu sens son souffle dans ton cou.", "Tu plonges dans {abri}. Tu claques la porte.[[porte]]", "Ses ongles raclent le bois. Longtemps. Puis plus rien."],
        next: "n1_fin"
      },
      n1_immobile: {
        vue: "decouvert", acteurs: [{ q: "zombie", a: "decouvert" }],
        l: ["Tu ne bouges plus. Même tes paupières.", "Une feuille tourbillonne devant lui. Il la *happe* au vol.", "Puis plus rien ne bouge. Il reste là, la tête penchée.", "Il ne sait même pas que tu es là."],
        indice: { id: "immobile", t: "*Immobile*, tu es invisible pour lui." },
        next: "n1_fin"
      },
      n1_lampe: {
        vue: "decouvert", fx: ["faisceau"], acteurs: [{ q: "zombie", a: "decouvert" }], on: { peur: 15 },
        l: ["Ton faisceau tremble un peu. Il balaie le sol.", "Ses yeux suivent le *rond de lumière*. Pas toi. La lumière.", "Le rond bouge. Il fonce *dessus*.", "Tu éteins. Il s'arrête net, perdu."],
        indice: { id: "mouvement", t: "Il ne voit que ce qui *bouge*." },
        next: "n1_fin"
      },
      n1_fin: {
        vue: "large", acteurs: [{ q: "zombie", a: "fond" }],
        l: ["Jusqu'à l'aube, il rôde.", "Il happe tout ce qui bouge : une feuille, un rat, un volet qui claque.[[porte]]", "Rien d'autre."],
        indice: { id: "mouvement", t: "Il ne voit que ce qui *bouge*." },
        next: "aube1"
      },

      /* ── NUIT 2 ── */
      n2: {
        nuit: 2, vue: "decouvert", on: { peur: 15 }, acteurs: [{ q: "zombie", a: "decouvert" }],
        l: {
          village: ["Tu dois traverser la *place* pour rejoindre l'église.", "Il est au milieu. Immobile. Il attend que quelque chose *bouge*."],
          ile: ["Le vent souffle par *rafales*.[[vent]]", "Tu dois traverser la lande jusqu'au phare. Pas un arbre. Pas un mur.", "Il est là, au milieu. Il attend que quelque chose bouge."],
          metro: ["Tu dois longer tout le quai jusqu'au local technique.", "Il est là, sous une lampe de secours. Il attend que quelque chose bouge."]
        },
        choix: {
          village: [
            { t: "Avancer d'un pas chaque fois qu'il regarde ailleurs", calme: true, go: "n2_pas" },
            { t: "Lancer {caillou} de l'autre côté de la place", go: "n2_leurre" },
            { t: "Traverser en courant", go: "n2_course" }
          ],
          ile: [
            { t: "Avancer seulement pendant les rafales, avec l'herbe", go: "n2_vent" },
            { t: "Lancer {caillou} de l'autre côté", go: "n2_leurre" },
            { t: "Traverser en courant", go: "n2_course" }
          ],
          metro: [
            { t: "Avancer d'un pas chaque fois qu'il regarde ailleurs", calme: true, go: "n2_pas" },
            { t: "Lancer {caillou} sur les rails", go: "n2_leurre" },
            { t: "Traverser en courant", go: "n2_course" }
          ]
        }
      },
      n2_pas: {
        vue: "decouvert", acteurs: [{ q: "zombie", a: "fond" }], branche: [{ c: { peurMin: 45 }, go: "n2_tremble" }],
        l: ["Il regarde à gauche : un pas.", "Il regarde à droite : tu te figes.", "Un pas. Figé. Un pas. Figé.", "Tu passes derrière lui. Il ne t'a jamais vu."],
        next: "n2_science"
      },
      n2_tremble: {
        vue: "proche", fx: ["danger"], acteurs: [{ q: "zombie", a: "proche" }], on: { peur: 15 },
        l: ["Tu te figes. Mais tes mains *tremblent*.", "Juste un peu. Juste assez.", "Sa tête claque vers toi."],
        indice: { id: "peur", t: "La *peur* te fait trembler. Et trembler, c'est bouger." },
        choix: [
          { t: "Lancer {caillou} au loin", go: "n2_leurre" },
          { t: "Courir", go: "n2_course" }
        ]
      },
      n2_vent: {
        vue: "decouvert", acteurs: [{ q: "zombie", a: "fond" }],
        l: ["Une rafale. Toute la lande *ondule*. Tu avances.[[vent]]", "La rafale tombe. Tu te figes, plié comme une touffe d'herbe.", "Il tourne la tête dans tous les sens. Tout bouge. Il ne voit *rien*.", "Rafale après rafale, tu atteins le phare."],
        indice: { id: "vent", t: "Quand tout bouge autour de lui, il ne voit plus *rien*." },
        next: "n2_science"
      },
      n2_leurre: {
        vue: "decouvert", acteurs: [{ q: "zombie", a: "fond" }],
        l: ["{Caillou} vole, rebondit, roule au loin.[[pierre]]", "Il fonce dessus comme un chat sur une souris.", "Tu passes pendant qu'il fouille l'ombre."],
        indice: { id: "leurre", t: "Quelque chose qui bouge *ailleurs* l'attire ailleurs." },
        next: "n2_science"
      },
      n2_course: {
        vue: "proche", fx: ["danger"], acteurs: [{ q: "zombie", a: "proche" }], on: { peur: 20 },
        l: ["Tu cours.[[pas:course]]", "Il te voit *immédiatement*. Il est plus rapide que toi.", "Il te rattrape à mi-chemin."],
        choix: [
          { t: "Te figer net", calme: true, go: "n2_fige" },
          { t: "Te battre", go: "n2_combat" }
        ]
      },
      n2_fige: {
        vue: "proche", acteurs: [{ q: "zombie", a: "proche" }],
        l: ["Tu t'arrêtes net. Il te percute presque.", "Il s'arrête à son tour. Il te renifle… sans te voir.", "Une éternité. Puis un chat traverse. Il bondit dessus."],
        indice: { id: "immobile", t: "*Immobile*, tu es invisible pour lui." },
        next: "n2_science"
      },
      n2_combat: {
        vue: "proche", fx: ["danger"], acteurs: [{ q: "zombie", a: "proche" }], on: { peur: 25, set: "blesse" },
        l: ["Tu te débats. Il frappe vite. Très vite.", "Tu t'arraches. Tu es blessé au bras.", "Il te suit… jusqu'à ce que tu te jettes à terre et ne bouges plus."],
        indice: { id: "immobile", t: "*Immobile*, tu es invisible pour lui." },
        next: "n2_science"
      },
      n2_science: { type: "science", vue: "large", next: "n2_lieu" },
      n2_lieu: {
        vue: { village: "haut", ile: "haut", metro: "fond" }, decor: { metro: ["local"] },
        l: {
          village: ["L'église. La corde de la *cloche* pend jusqu'au sol.", "Là-haut, la cloche. Si elle se balance, elle *bouge*. Beaucoup."],
          ile: ["Le phare. La grande lentille, prête à tourner.", "Un faisceau qui tourne, ce sont des ombres qui *bougent* sur toute la lande."],
          metro: ["Le local technique. Un levier : *VENTILATION*.", "Des câbles pendent du plafond. Des papiers traînent partout. Avec un courant d'air, tout va *bouger*."]
        },
        choix: {
          village: [
            { t: "Nouer ta corde à la cloche, pour la faire bouger de loin", need: "corde", fx: { set: "corde_cloche" }, go: "n2_fin" },
            { t: "Attendre le jour", go: "n2_fin" }
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
        vue: "large", decor: ["phare"], acteurs: [{ q: "zombie", a: "decouvert" }],
        l: ["Tu lances le mécanisme. Le faisceau balaie la lande.[[phare]]", "Les ombres des rochers, des murets, des herbes : tout *tourne*.", "En bas, il pivote dans tous les sens, perdu.", "Tu coupes."],
        indice: { id: "vent", t: "Quand tout bouge autour de lui, il ne voit plus *rien*." },
        next: "n2_fin"
      },
      n2_cle: {
        vue: "abri", acteurs: [{ q: "joueur", a: "abri", pose: "cache" }],
        l: ["Dans la cabine vitrée, une clé : *LOCAL TECH*.", "Tu tends la main. Lentement. *Très* lentement.", "Il est sur le quai. Ta main bouge trop lentement pour qu'il la remarque."],
        next: "n2_fin"
      },
      n2_fin: {
        vue: "large",
        l: ["Jusqu'au matin, tu ne bouges plus.", "Plus qu'*une* nuit."],
        next: "aube2"
      },

      /* ── NUIT 3 ── */
      n3: {
        nuit: 3, vue: "large", on: { peur: 15 },
        l: {
          village: ["Pour atteindre le col, il faut traverser les alpages. *À découvert*.", "Et il est là, sur le sentier. Immobile."],
          ile: ["Rallumer le phare. Puis traverser la lande et la chaussée jusqu'au port.", "Il attend au milieu de la lande. Le vent souffle fort.[[vent]]"],
          metro: ["Le terminus est au bout du tunnel. Il est *dans* le tunnel.", "Immobile. Il attend."]
        },
        choix: {
          village: [
            { t: "Faire balancer la cloche de loin, puis monter", req: { flag: "corde_cloche" }, pourquoi: "Ta corde n'est pas nouée à la cloche.", go: "n3_cloche" },
            { t: "Lancer des pierres loin du sentier en montant", need: "pierre", go: "n3_leurre" },
            { t: "Monter pas à pas, en te figeant dès qu'il regarde", calme: true, go: "n3_pas" },
            { t: "Courir jusqu'au col", go: "n3_course" }
          ],
          ile: [
            { t: "Allumer le phare et traverser pendant qu'il tourne", go: "n3_phare" },
            { t: "Avancer seulement avec les rafales", go: "n3_vent" },
            { t: "Tirer ta fusée au loin", need: "fusee", go: "n3_leurre" },
            { t: "Courir jusqu'au port", go: "n3_course" }
          ],
          metro: [
            { t: "Lancer la ventilation, puis avancer dans le courant d'air", req: { flag: "local" }, pourquoi: "Le local technique est fermé.", go: "n3_ventilation" },
            { t: "Lancer {caillou} loin dans le tunnel", go: "n3_leurre" },
            { t: "Avancer pas à pas, en te figeant dès qu'il regarde", calme: true, go: "n3_pas" },
            { t: "Courir jusqu'au terminus", go: "n3_course" }
          ]
        }
      },
      n3_cloche: {
        vue: "large", decor: ["cloche"], acteurs: [{ q: "zombie", a: "decouvert" }],
        l: ["Tu tires. Là-haut, la cloche se met à *balancer*.[[cloche]]", "Il se tourne vers le clocher. Il fixe la cloche. Il ne voit qu'elle.", "Tu montes vers le col, dans son dos.[[helico]]"],
        fin: "leurre"
      },
      n3_leurre: {
        vue: "objectif", acteurs: [{ q: "zombie", a: "fond" }],
        l: {
          village: ["À chaque virage, tu lances une pierre loin du sentier.[[pierre]]", "Il bondit vers chaque pierre qui roule.", "Toi, tu montes, sans un geste de trop.[[helico]]"],
          ile: ["Tu tires ta fusée vers la pointe de l'île. Une boule rouge qui file dans le ciel.[[fusee]]", "Il la *suit* des yeux, puis il court après.", "Tu allumes le phare et tu cours au port.[[bateau]]"],
          metro: ["Tu lances {caillou} loin dans le tunnel. Il roule, rebondit sur les rails.[[metal]]", "Il fonce dessus.", "Tu le dépasses pendant qu'il fouille le ballast.[[train]]"]
        },
        fin: "leurre"
      },
      n3_phare: {
        vue: "large", decor: ["phare"], acteurs: [{ q: "zombie", a: "decouvert" }],
        l: ["Tu allumes. Le faisceau balaie la lande, encore et encore.[[phare]]", "Les ombres tournent. Les rochers bougent. Les herbes bougent. *Tout* bouge.", "Il pivote dans tous les sens, perdu.", "Tu traverses la lande au milieu de ce chaos de lumière.[[bateau]]"],
        fin: "chaos"
      },
      n3_vent: {
        vue: "decouvert", acteurs: [{ q: "zombie", a: "fond" }], branche: [{ c: { peurMin: 50 }, go: "n3_tremble" }],
        l: ["Tu allumes le phare. Puis tu attends la rafale.[[phare]]", "Une rafale. Toute la lande ondule. Tu avances.[[vent]]", "La rafale tombe. Tu te figes. Il te regarde. Il regarde l'herbe. Aucune différence.", "Rafale après rafale, tu rejoins la chaussée.[[bateau]]"],
        fin: "chaos"
      },
      n3_ventilation: {
        vue: "large", decor: ["ventilation", "local"], fx: ["poussiere"], acteurs: [{ q: "zombie", a: "decouvert" }],
        l: ["Tu abaisses le levier. Un courant d'air glacé traverse la station.[[ventilation]]", "Les câbles se balancent. Les papiers s'envolent. La poussière tourbillonne.", "Il pivote dans tous les sens. *Tout* bouge. Il ne voit plus rien.", "Tu avances dans le courant d'air, comme un papier de plus.[[train]]"],
        fin: "chaos"
      },
      n3_pas: {
        vue: "objectif", acteurs: [{ q: "zombie", a: "fond" }],
        branche: [{ c: { flag: "blesse" }, go: "n3_blesse" }, { c: { peurMin: 50 }, go: "n3_tremble" }],
        l: {
          village: ["Il regarde ailleurs : un pas.", "Il tourne la tête : tu deviens une *statue*.", "Une heure comme ça. Peut-être deux.", "Le jour se lève. Tu es passé.[[helico]]"],
          metro: ["Il regarde ailleurs : un pas.", "Il tourne la tête : tu deviens une *statue*.", "Une heure comme ça. Peut-être deux.", "La lumière du terminus. Tu es passé.[[train]]"]
        },
        fin: "statue"
      },
      n3_blesse: {
        vue: "proche", fx: ["danger"], acteurs: [{ q: "zombie", a: "proche" }],
        l: ["Tu te figes. Mais ton bras blessé te lance. Il *tressaille*.", "Un tout petit mouvement.", "Sa tête claque vers toi."],
        fin: "tremble"
      },
      n3_tremble: {
        vue: "proche", fx: ["danger"], acteurs: [{ q: "zombie", a: "proche" }],
        l: ["Tu te figes. Mais tes mains tremblent. Tes genoux aussi.", "La peur, ça se voit. Pour lui, ça *bouge*.", "Sa tête claque vers toi."],
        fin: "tremble"
      },
      n3_course: {
        vue: "objectif", fx: ["danger"], acteurs: [{ q: "zombie", a: "objectif" }],
        l: {
          village: ["Tu cours.[[pas:course]]", "Une tache qui bouge, en plein milieu des alpages.", "Il te voit avant même ton deuxième pas.", "Il est beaucoup plus rapide que toi."],
          ile: ["Tu cours.[[pas:course]]", "Une tache qui bouge, en plein milieu de la lande.", "Il te voit avant même ton deuxième pas.", "Il est beaucoup plus rapide que toi."],
          metro: ["Tu cours.[[pas:course]]", "Une tache qui bouge, en plein milieu du tunnel.", "Il te voit avant même ton deuxième pas.", "Il est beaucoup plus rapide que toi."]
        },
        fin: "vu"
      }
    },

    fins: {
      leurre: { type: "survie", parfait: true, titre: "LE LEURRE", texte: "Tu lui as donné quelque chose qui bouge à regarder. Pas toi." },
      chaos: { type: "survie", parfait: true, lieux: ["ile", "metro"], titre: "TOUT BOUGE", texte: "Quand tout bouge autour de lui, il ne voit plus rien. Tu as bougé avec le reste." },
      statue: { type: "survie", parfait: true, lieux: ["village", "metro"], titre: "LA STATUE", texte: "Immobile, tu n'existais pas pour lui." },
      vu: {
        type: "mort", titre: "LA COURSE",
        cause: "Le Vitreux.",
        pourquoi: "Il ne voit que ce qui bouge. Une silhouette qui court à découvert, c'est tout ce qu'il voit.",
        conseil: "Fige-toi dès qu'il regarde. Ou fais bouger autre chose que toi."
      },
      tremble: {
        type: "mort", titre: "LES MAINS QUI TREMBLENT",
        cause: "Le Vitreux… et ta peur.",
        pourquoi: "Tu étais immobile, mais la peur (ou ta blessure) t'a fait trembler. Pour lui, trembler, c'est bouger.",
        conseil: "Garde ta peur basse avant de te figer. Ou fais bouger autre chose que toi."
      }
    },

    science: {
      titre: "L'ŒIL DE LA GRENOUILLE",
      diapos: [
        {
          l: ["Dans l'œil d'une *grenouille*, certaines cellules ne réagissent qu'à une chose :", "un petit objet sombre qui *bouge*.", "Une mouche posée, immobile ? Ces cellules-là restent muettes."],
          dessin: function (k, t) {
            k.fond();
            k.cercle(250, 330, 150, "#6fae5a", true);
            k.cercle(250, 330, 95, "#e9f1d0", true);
            k.cercle(250, 330, 50, "#151a10", true);
            var bouge = (t % 6) < 3.5;
            var fx = bouge ? 560 + Math.cos(t * 2.2) * 150 : 560 + Math.cos(3.5 * 2.2) * 150;
            var fy = bouge ? 300 + Math.sin(t * 3.1) * 110 : 300 + Math.sin(3.5 * 3.1) * 110;
            k.cercle(fx, fy, 12, "#151515", true); k.cercle(fx - 9, fy - 8, 7, "rgba(220,230,255,.6)", true); k.cercle(fx + 9, fy - 8, 7, "rgba(220,230,255,.6)", true);
            k.ligne([[300, 330], [fx, fy]], bouge ? k.c.neon : "rgba(255,255,255,.1)", 2, 1, [8, 8]);
            k.cercle(250, 560, 26, bouge ? k.c.neon : "#2a3344", true, bouge ? 0.6 + 0.4 * Math.sin(t * 20) : 1);
            k.texte(bouge ? "DÉTECTEUR : ON" : "DÉTECTEUR : RIEN", 520, 560, { taille: 34, couleur: bouge ? k.c.neon : k.c.gris });
          }
        },
        {
          l: ["Le *phasme* a trouvé la parade : il se balance comme une feuille dans le vent.", "Quand tout bouge en même temps, *rien* ne ressort."],
          dessin: function (k, t) {
            k.fond();
            var a = Math.sin(t * 2.5) * 0.25;
            for (var i = 0; i < 7; i++) {
              var x = 110 + i * 115, h = 360 + (i % 3) * 40;
              k.ligne([[x, 640], [x + Math.sin(a + i) * 50, 640 - h]], "#4c8a3a", 6);
              for (var j = 0; j < 4; j++) {
                var px = x + Math.sin(a + i) * 50 * (j + 1) / 4, py = 640 - h * (j + 1) / 4;
                k.poly([[px, py], [px + 40 * Math.cos(a), py - 18], [px + 70 * Math.cos(a), py]], "#5fa847");
              }
            }
            var sx = 455 + Math.sin(a + 3) * 40;
            k.ligne([[sx - 50, 330], [sx + 50, 300]], "#8a7a3a", 9);
            k.ligne([[sx - 30, 324], [sx - 46, 360]], "#8a7a3a", 4); k.ligne([[sx + 20, 307], [sx + 30, 270]], "#8a7a3a", 4);
            if (t > 1.5) k.cercle(sx, 315, 70, k.c.or, false, k.prog(t, 1.5, 0.8), 3);
            if (t > 1.5) k.texte("PHASME", sx, 220, { taille: 30, couleur: k.c.or, alpha: k.prog(t, 1.5, 0.8) });
          }
        },
        {
          l: {
            village: ["*Immobile*, tu n'existes pas pour lui.", "Et quelque chose qui bouge *ailleurs* l'attire ailleurs.", "Mais attention : la *peur* fait trembler. Et trembler, c'est bouger."],
            ile: ["*Immobile*, tu n'existes pas pour lui.", "Et quand la rafale fait onduler toute la lande, bouge *avec* elle.", "Mais attention : la *peur* fait trembler. Et trembler, c'est bouger."],
            metro: ["*Immobile*, tu n'existes pas pour lui.", "Ici, rien ne bouge… sauf si tu fais *tout* bouger. Pense au local technique.", "Mais attention : la *peur* fait trembler. Et trembler, c'est bouger."]
          },
          dessin: function (k, t) {
            k.fond();
            var ph = Math.floor(t / 2.6) % 3;
            k.texte(["IMMOBILE", "TU BOUGES", "TU TREMBLES"][ph], 450, 90, { taille: 44, couleur: ph === 0 ? k.c.neon : k.c.rouge });
            var dx = ph === 1 ? Math.sin(t * 6) * 60 : ph === 2 ? Math.sin(t * 60) * 4 : 0;
            k.bonhomme(450 + dx, 520, 3, ph === 0 ? "rgba(241,234,216,.35)" : k.c.blanc);
            if (ph > 0) { for (var i = 0; i < 3; i++) k.ligne([[330 + dx - i * 18, 300 + i * 40], [360 + dx - i * 18, 300 + i * 40]], k.c.rouge, 4); }
            k.cercle(760, 200, 40, "#eef5f6", true); k.cercle(760, 200, 18, "#bcd6e8", true);
            if (ph > 0) k.ligne([[730, 220], [480 + dx, 330]], k.c.rouge, 3, 0.8, [10, 8]);
          }
        }
      ]
    }
  });
})(typeof window !== "undefined" ? window : globalThis);
