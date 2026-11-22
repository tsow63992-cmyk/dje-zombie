/* Dje_zombie — Saison 1 — LE RAMPEUR.
   Règles : il rampe, passe sous les portes, et sent tes pas dans le sol.
   Point faible : il ne grimpe pas ; un sol mou avale les vibrations ; un choc au loin l'attire au loin. */
(function (root) {
  "use strict";
  var DJE = root.DJE;

  DJE.histoire("rampeur", {
    scenes: {
      n1: {
        nuit: 1, vue: "decouvert", acteurs: [{ q: "zombie", a: "decouvert" }],
        l: {
          village: ["Silence.", "Puis un frottement. Quelque chose *traîne* sur les pavés.[[rampe]]", "Bas. Très bas. Au ras du sol."],
          ile: ["Le ressac. Le vent.", "Et un frottement dans l'herbe. Quelque chose *traîne*, au ras du sol.[[rampe]]"],
          metro: ["Silence.", "Puis un frottement sur le ballast, entre les rails.[[rampe]]", "Quelque chose *rampe*."]
        },
        choix: [
          { t: "T'enfermer dans {abri}", go: "n1_abri" },
          { t: "Grimper sur {perche}", go: "n1_haut" },
          { t: "Rester immobile, sans faire un pas", calme: true, go: "n1_immobile" }
        ]
      },
      n1_abri: {
        vue: "abri", fx: ["danger"], acteurs: [{ q: "joueur", a: "abri", pose: "cache" }], on: { peur: 30 },
        l: ["Tu t'enfermes dans {abri}. Tu reprends ton souffle.", "Le frottement approche. S'arrête devant la porte.[[rampe]]", "Et sous la porte, dans la fente… des *doigts*.", "Il se glisse *dessous*. Comme une ombre."],
        indice: { id: "portes", t: "Il passe *sous* les portes : s'enfermer ne sert à rien." },
        choix: [
          { t: { village: "Grimper sur la poutre, au-dessus du foin", ile: "Grimper dans les filets suspendus", metro: "Grimper sur le bureau, puis sur l'étagère" }, go: "n1_poutre" },
          { t: "Sortir en courant par l'autre côté", fx: { bruit: 30 }, go: "n1_fuite" }
        ]
      },
      n1_poutre: {
        vue: "abri", acteurs: [{ q: "joueur", a: "abri", pose: "cache" }],
        l: ["Tu grimpes. Le plus haut possible.", "Il rampe en dessous. Il tourne en rond. Il *tâte* le sol.", "Il ne lève jamais la tête. Il ne *grimpe* pas.", "Au bout d'une heure, il repart."],
        indice: { id: "grimpe", t: "Il ne sait pas *grimper*." },
        next: "n1_fin"
      },
      n1_fuite: {
        vue: "decouvert", acteurs: [{ q: "joueur", a: "decouvert", pose: "court" }, { q: "zombie", a: "fond" }],
        l: ["Tu fonces dehors.[[pas:course]]", "Derrière toi, le frottement accélère. Il te *suit* à la trace. Pas des yeux. Par le sol.", "Tu sautes sur {perche}. Il passe en dessous… et s'éloigne."],
        indice: { id: "sol", t: "Il sent tes pas *dans le sol*." },
        next: "n1_fin"
      },
      n1_haut: {
        vue: "decouvert", acteurs: [{ q: "zombie", a: "decouvert" }],
        l: ["Tu grimpes sur {perche}. Tu ne touches plus le sol.", "Il arrive. Il rampe juste en dessous de toi.", "Il tâte le sol, là où tu étais. Il *cherche*.", "Il ne lève jamais la tête."],
        indice: { id: "grimpe", t: "Il ne sait pas *grimper*." },
        next: "n1_fin"
      },
      n1_immobile: {
        vue: "decouvert", acteurs: [{ q: "zombie", a: "fond" }],
        l: ["Tu ne bouges plus. Pas un pas.", "Il passe à deux mètres. Il rampe, la joue collée au sol.", "Il s'arrête. Il *écoute le sol*. Rien.", "Il repart."],
        indice: { id: "sol", t: "Il sent tes pas *dans le sol*." },
        next: "n1_fin"
      },
      n1_fin: {
        vue: "large", acteurs: [{ q: "zombie", a: "fond" }],
        l: ["Jusqu'à l'aube, tu ne poses pas un pied par terre.", "En bas, le frottement va et vient.[[rampe]]", "Il ne te trouve pas."],
        next: "aube1"
      },

      /* ── NUIT 2 ── */
      n2: {
        nuit: 2, vue: "large", on: { peur: 10 },
        l: {
          village: ["Tu dois traverser le village jusqu'à l'église et son *clocher*.", "Il rampe dans les ruelles. Il sent chacun de tes pas."],
          ile: ["Il faut traverser l'île jusqu'au *phare*.", "Il rampe quelque part sur la lande."],
          metro: ["Tu dois longer les voies jusqu'au local technique.", "Il rampe quelque part. Et ici, *tout* est béton et rails."]
        },
        choix: {
          village: [
            { t: "Passer par les toits, de maison en maison", go: "n2_toits" },
            { t: "Marcher dans la terre des jardins plutôt que sur les pavés", go: "n2_mou" },
            { t: "Courir sur les pavés", fx: { bruit: 30 }, go: "n2_pas" }
          ],
          ile: [
            { t: "Marcher sur le sable de la plage", go: "n2_mou" },
            { t: "Sauter de rocher en rocher", fx: { bruit: 20 }, go: "n2_pas" },
            { t: "Courir sur la lande", fx: { bruit: 20 }, go: "n2_pas" }
          ],
          metro: [
            { t: "Passer par la passerelle, au-dessus des voies", go: "n2_toits" },
            { t: "Marcher sur le ballast, entre les rails", go: "n2_ballast" },
            { t: "Courir sur le quai", fx: { bruit: 30 }, go: "n2_pas" }
          ]
        }
      },
      n2_toits: {
        vue: "haut", acteurs: [{ q: "zombie", a: "bas" }],
        l: {
          village: ["Tu grimpes sur un toit. Tu sautes au suivant.", "Les tuiles grincent. Mais en bas, il ne sent *rien* : tu ne touches pas son sol.", "Tu redescends juste devant l'église."],
          metro: ["Tu montes sur la passerelle. Elle tremble un peu.", "En bas, il rampe entre les rails. Il ne peut pas monter.", "Tu traverses au-dessus de lui."]
        },
        indice: { id: "grimpe", t: "Il ne sait pas *grimper*." },
        next: "n2_science"
      },
      n2_mou: {
        vue: { village: "decouvert", ile: "eau" }, acteurs: [{ q: "zombie", a: "fond" }],
        l: {
          village: ["Tu marches dans les jardins, sur la terre meuble.", "Tes pas *s'enfoncent*. Ils ne portent pas.", "Il rampe sur les pavés, à quelques mètres. Il ne sent rien."],
          ile: ["Tu descends sur la plage. Le sable *avale* tes pas.", "Il rampe sur les rochers, à quelques mètres. Il ne sent rien."]
        },
        indice: { id: "mou", t: "Sur un sol *mou*, tes pas ne portent pas jusqu'à lui." },
        next: "n2_science"
      },
      n2_ballast: {
        vue: "passage", acteurs: [{ q: "zombie", a: "decouvert" }],
        l: ["Tu marches sur le ballast, entre les rails. Les cailloux roulent sous tes pieds.", "Tu évites le béton du quai. Et surtout, tu ne touches pas les *rails*.", "Il rampe sur le quai. Il hésite… et ne vient pas."],
        indice: { id: "mou", t: "Sur un sol *mou*, tes pas ne portent pas jusqu'à lui." },
        next: "n2_science"
      },
      n2_pas: {
        vue: "proche", fx: ["danger"], acteurs: [{ q: "zombie", a: "proche" }], on: { peur: 25 },
        l: {
          village: ["Tes pas claquent sur les pavés.[[pas:course]]", "Le frottement *accélère*. Il fonce vers toi, au ras du sol.[[rampe]]"],
          ile: ["Tes pas frappent la roche.[[pas:course]]", "Le frottement *accélère*. Il fonce vers toi.[[rampe]]"],
          metro: ["Tes pas claquent sur le béton.[[pas:course]]", "Le frottement *accélère*. Il fonce vers toi.[[rampe]]"]
        },
        indice: { id: "sol", t: "Il sent tes pas *dans le sol*." },
        choix: [
          { t: "Sauter sur {perche}", go: "n2_saut" },
          { t: "Le frapper", go: "n2_combat" }
        ]
      },
      n2_saut: {
        vue: "decouvert", acteurs: [{ q: "zombie", a: "decouvert" }],
        l: ["Tu sautes. Il te frôle la cheville.", "Il tourne en dessous de toi. Puis il s'éloigne."],
        indice: { id: "grimpe", t: "Il ne sait pas *grimper*." },
        next: "n2_science"
      },
      n2_combat: {
        vue: "proche", fx: ["danger"], acteurs: [{ q: "zombie", a: "proche" }], on: { peur: 25, set: "blesse" },
        l: ["Tu le frappes. Il s'accroche à ta jambe.", "Tu le repousses. Il te mord la cheville.", "Tu t'arraches. Tu *boites*."],
        next: "n2_science"
      },
      n2_science: { type: "science", vue: "large", next: "n2_lieu" },
      n2_lieu: {
        vue: { village: "haut", ile: "haut", metro: "fond" }, decor: { metro: ["local"] },
        l: {
          village: ["Le clocher. Un escalier raide, puis une échelle jusqu'à la cloche.", "Là-haut, tu es *intouchable*.", "Et d'en haut, tu vois le sentier du col : des pavés, puis de la *terre*."],
          ile: ["Le phare. Un escalier en colimaçon, raide.", "Là-haut, tu es *intouchable*."],
          metro: ["Le local technique. Une échelle monte vers le *puits d'aération*.", "Sur l'établi, des boulons, des clés… et un plan du tunnel."]
        },
        choix: {
          village: [
            { t: "Repérer le sentier de terre jusqu'au col", fx: { set: "sentier" }, go: "n2_fin" },
            { t: "Dormir en haut du clocher", go: "n2_fin" }
          ],
          ile: [
            { t: "Repérer un chemin de sable jusqu'à la chaussée", go: "n2_fin" },
            { t: "Dormir en haut du phare", go: "n2_fin" }
          ],
          metro: [
            { t: "Étudier le plan du tunnel", go: "n2_plan" },
            { t: "Dormir en haut de l'échelle", go: "n2_fin" }
          ]
        }
      },
      n2_plan: {
        vue: "fond", decor: ["local"],
        l: ["Sur le plan, le tunnel jusqu'au terminus. Huit cents mètres de rails.", "Les rails sont en acier. Le moindre choc *voyage* dedans, très loin.", "Un choc à un bout… se sent à l'autre."],
        indice: { id: "rail", t: "Les *rails* portent les vibrations sur des centaines de mètres." },
        next: "n2_fin"
      },
      n2_fin: {
        vue: "large",
        l: ["Tu passes le reste de la nuit perché, loin du sol.", "En bas, il tourne en rond.[[rampe]]", "Plus qu'*une* nuit."],
        next: "aube2"
      },

      /* ── NUIT 3 ── */
      n3: {
        nuit: 3, vue: "large", on: { peur: 10 },
        l: {
          village: ["L'hélicoptère se posera au *col*. Le sentier part de la place : des pavés, puis de la terre.", "Il rampe sur la place."],
          ile: ["Rallumer le phare. Puis rejoindre le port par la chaussée, en pierre.", "Il rampe au pied du phare."],
          metro: ["Le terminus est au bout du tunnel. Il faut marcher sur les voies.", "Il rampe quelque part dans le tunnel."]
        },
        choix: {
          village: [
            { t: "Lancer une pierre sur les pavés, loin du sentier, puis monter", need: "pierre", go: "n3_leurre" },
            { t: "Passer par les toits jusqu'au sentier", go: "n3_toits" },
            { t: "Rejoindre le sentier de terre par les jardins", si: { flag: "sentier" }, go: "n3_jardins" },
            { t: "T'enfermer dans {abri} jusqu'à l'aube", go: "n3_abri" }
          ],
          ile: [
            { t: "Allumer le phare, puis descendre par la plage de sable", go: "n3_sable" },
            { t: "Allumer le phare et attendre l'aube tout en haut", go: "n3_phare" },
            { t: "Courir sur la chaussée", go: "n3_course" },
            { t: "T'enfermer dans {abri} jusqu'à l'aube", go: "n3_abri" }
          ],
          metro: [
            { t: "Frapper un rail avec le pied-de-biche, loin derrière toi", need: "piedbiche", go: "n3_rail" },
            { t: "Marcher sur le ballast, sans jamais toucher les rails", go: "n3_ballast" },
            { t: "Courir sur les rails", go: "n3_course" },
            { t: "T'enfermer dans {abri} jusqu'au matin", go: "n3_abri" }
          ]
        }
      },
      n3_leurre: {
        vue: "objectif", acteurs: [{ q: "zombie", a: "decouvert" }],
        l: ["Tu lances une pierre de toutes tes forces. Elle claque sur les pavés, au fond de la place.[[pierre]]", "Il fonce vers le choc.", "Toi, tu prends le sentier de terre. Tes pas *s'enfoncent* sans un bruit.[[helico]]"],
        fin: "leurre"
      },
      n3_toits: {
        vue: "haut", branche: [{ c: { flag: "blesse" }, go: "n3_toits_blesse" }], acteurs: [{ q: "zombie", a: "bas" }],
        l: ["Tu passes de toit en toit jusqu'à la dernière maison.", "Tu sautes sur le sentier. De la *terre*. Molle, humide.", "Tes pas ne portent pas. Il reste en bas, sur ses pavés.[[helico]]"],
        fin: "perche"
      },
      n3_toits_blesse: {
        vue: "decouvert", fx: ["danger"], acteurs: [{ q: "zombie", a: "decouvert" }],
        l: ["Tu passes de toit en toit… mais ta cheville lâche.", "Tu glisses. Tu tombes sur les pavés.[[chute]]", "Le choc *résonne* dans tout le sol.", "Le frottement fonce vers toi."],
        fin: "sol"
      },
      n3_jardins: {
        vue: "objectif", acteurs: [{ q: "zombie", a: "decouvert" }],
        l: ["Tu passes par les jardins, puis par le sentier de terre.", "La terre est molle, humide. Tes pas *s'enfoncent*.", "Il rampe sur la place, à cinquante mètres. Il ne sent rien.", "Au col, le jour se lève.[[helico]]"],
        fin: "mou"
      },
      n3_sable: {
        vue: "eau", decor: ["phare"], acteurs: [{ q: "zombie", a: "fond" }],
        l: ["Tu allumes le phare, puis tu descends sur la plage.[[phare]]", "Le sable avale tes pas.", "Il rampe sur les rochers, au-dessus. Il ne sent rien.", "Au bout de la plage, la chaussée. Tu cours les derniers mètres.[[bateau]]"],
        fin: "mou"
      },
      n3_phare: {
        vue: "haut", decor: ["phare"], acteurs: [{ q: "zombie", a: "bas" }],
        l: ["Tu allumes le phare et tu restes en haut.[[phare]]", "En bas, il tourne autour de la tour. Il ne peut pas monter.", "À l'aube, il s'enfonce dans la lande pour dormir.", "Tu descends. Tu cours au port.[[bateau]]"],
        fin: "perche"
      },
      n3_course: {
        vue: "objectif", fx: ["danger"], acteurs: [{ q: "zombie", a: "objectif" }],
        l: {
          ile: ["Tu cours sur la chaussée de pierre.[[pas:course]]", "Chaque pas cogne la roche. Il sent tout.", "Il t'attrape la cheville."],
          metro: ["Tu cours sur les rails.[[pas:course]]", "L'acier *chante* sous tes pieds, jusqu'au fond du tunnel.", "Il fonce vers toi. Il t'attrape la cheville."]
        },
        fin: "sol"
      },
      n3_rail: {
        vue: "objectif", acteurs: [{ q: "zombie", a: "fond" }],
        l: ["Tu frappes le rail de toutes tes forces, loin derrière toi.[[metal]]", "L'acier *vibre* sur des centaines de mètres.", "Il fonce vers le choc. Dans le mauvais sens.", "Toi, tu marches sur le ballast, sans toucher les rails.[[train]]"],
        fin: "leurre"
      },
      n3_ballast: {
        vue: "passage", branche: [{ c: { flag: "blesse" }, go: "n3_ballast_blesse" }], acteurs: [{ q: "zombie", a: "fond" }],
        l: ["Tu marches sur le ballast, pas après pas. Jamais sur les rails.", "Les cailloux bougent. Ils absorbent tes pas.", "Il rampe quelque part. Il ne te trouve pas.", "La lumière du terminus.[[train]]"],
        fin: "mou"
      },
      n3_ballast_blesse: {
        vue: "passage", fx: ["danger"], acteurs: [{ q: "zombie", a: "passage" }],
        l: ["Tu marches sur le ballast… mais tu boites.", "Ta jambe blessée traîne. Tu trébuches. Ta main frappe le *rail*.[[metal]]", "L'acier chante jusqu'au fond du tunnel.", "Il arrive."],
        fin: "sol"
      },
      n3_abri: {
        vue: "abri", fx: ["danger"], acteurs: [{ q: "joueur", a: "abri", pose: "cache" }],
        l: ["Tu t'enfermes dans {abri}. Tu bloques la porte.", "Le frottement approche. La porte ne bouge pas.[[rampe]]", "Il ne passe pas par la porte.", "Il passe *dessous*."],
        fin: "porte"
      }
    },

    fins: {
      leurre: { type: "survie", parfait: true, lieux: ["village", "metro"], titre: "LE CHOC", texte: "Tu as frappé le sol loin de toi : il a filé vers le choc." },
      perche: { type: "survie", parfait: true, lieux: ["village", "ile"], titre: "EN HAUTEUR", texte: "Il ne grimpe pas. Tant que tu étais en hauteur, tu étais intouchable." },
      mou: { type: "survie", parfait: true, titre: "LE SOL MOU", texte: "Sur un sol mou, tes pas ne portaient plus jusqu'à lui." },
      sol: {
        type: "mort", titre: "PAR LE SOL",
        cause: "Le Rampeur.",
        pourquoi: { tous: "Chaque pas sur un sol dur lui disait exactement où tu étais.", metro: "Les rails en acier portent la moindre vibration jusqu'au fond du tunnel." },
        conseil: "Monte en hauteur, marche sur du mou, ou frappe le sol loin de toi."
      },
      porte: {
        type: "mort", titre: "SOUS LA PORTE",
        cause: "Le Rampeur, glissé sous la porte.",
        pourquoi: "Une porte arrête ce qui marche. Pas ce qui rampe.",
        conseil: "Ne compte pas sur les portes : monte en hauteur, ou marche sur du mou."
      }
    },

    science: {
      titre: "L'OREILLE DU SERPENT",
      diapos: [
        {
          l: ["Un serpent n'a *pas d'oreille* visible.", "Il pose sa *mâchoire* au sol. Les vibrations du sol remontent par les os…", "…jusqu'à son oreille interne. Il « entend » avec la terre."],
          dessin: function (k, t) {
            k.fond();
            k.rect(0, 450, 900, 250, "#3a2f24");
            k.poly([[160, 450], [520, 450], [600, 410], [640, 420], [600, 452], [160, 470]], "#6f8a4a");
            k.cercle(610, 425, 6, "#151a10", true);
            k.bonhomme(820, 450, 1.3, k.c.blanc);
            var c = (t * 0.9) % 1;
            for (var i = 0; i < 3; i++) { var q = (c + i / 3) % 1; k.arc(800, 452, 20 + q * 240, Math.PI * 0.98, Math.PI * 1.02, k.c.rouge, 1 - q, 6); k.ligne([[800 - q * 240, 470], [800 - q * 240, 520]], k.c.rouge, 3, 1 - q); }
            if (t > 2) { k.ligne([[590, 452], [560, 430], [540, 420]], k.c.neon, 5, k.prog(t, 2, 1)); k.cercle(540, 420, 12, k.c.neon, false, k.prog(t, 2, 1)); k.texte("mâchoire → oreille interne", 470, 360, { taille: 26, couleur: k.c.neon, alpha: k.prog(t, 2.5, 1) }); }
          }
        },
        {
          l: ["Un sol *dur* porte les vibrations loin : la pierre, le béton, et surtout l'*acier* des rails.", "Un sol *mou*, sable, terre, herbe, les avale."],
          dessin: function (k, t) {
            k.fond();
            var types = [["ACIER", "#8a96a6", 0.15], ["BÉTON", "#6c7480", 0.45], ["SABLE", "#c9a96a", 2.2]];
            types.forEach(function (ty, i) {
              var y = 160 + i * 170;
              k.rect(60, y + 40, 780, 50, ty[1]);
              k.texte(ty[0], 140, y + 10, { taille: 30, couleur: ty[1] });
              var pts = [];
              for (var x = 0; x <= 780; x += 6) { var a = 38 * Math.exp(-ty[2] * x / 260) * Math.sin(x / 18 - t * 10); pts.push([60 + x, y + 65 - a]); }
              k.ligne(pts, k.c.rouge, 3);
            });
          }
        },
        {
          l: {
            village: ["Et lui ne *grimpe* pas : en hauteur, tu es hors de portée.", "Le clocher, les toits, la terre molle des jardins : tes alliés."],
            ile: ["Et lui ne *grimpe* pas : en hauteur, tu es hors de portée.", "Le phare. Et le sable de la plage."],
            metro: ["Et lui ne grimpe pas. Mais ici, tout est béton et rails…", "Un choc sur un rail, *loin* de toi, l'enverra au loin."]
          },
          dessin: function (k, t) {
            k.fond();
            k.rect(0, 560, 900, 140, "#3a2f24");
            k.rect(560, 160, 120, 400, "#5a6478"); k.poly([[550, 160], [620, 70], [690, 160]], "#2a3140");
            k.bonhomme(620, 160, 1.1, k.c.neon);
            k.poly([[180, 560], [420, 560], [470, 532], [500, 540], [470, 562], [180, 575]], "#6f8a4a");
            k.ligne([[490, 520], [560, 470]], k.c.rouge, 3, 0.7, [10, 8]);
            k.croix(525, 490, 1.1, k.c.rouge, k.prog(t, 1.2, 0.6));
            k.texte("IL NE GRIMPE PAS", 300, 420, { taille: 38, couleur: k.c.or, alpha: k.prog(t, 1.5, 0.8) });
          }
        }
      ]
    }
  });
})(typeof window !== "undefined" ? window : globalThis);
