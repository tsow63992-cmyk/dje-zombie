/* Dje_zombie — Saison 1 — LE GÉANT.
   Règles : trois mètres, force énorme, il défonce les portes. Lent, il s'essouffle vite.
   Point faible : passages étroits, planchers fragiles (loi du carré-cube). */
(function (root) {
  "use strict";
  var DJE = root.DJE;

  DJE.histoire("geant", {
    scenes: {
      n1: {
        nuit: 1, vue: "decouvert", acteurs: [{ q: "zombie", a: "fond" }],
        l: {
          village: ["Silence.", "Puis le sol *tremble*. Une fois. Deux fois.[[geant]]", "Au bout de la rue, une silhouette dépasse des toits."],
          ile: ["Le ressac. Puis le sol tremble.[[geant]]", "Sur la lande, une silhouette énorme. Trois mètres, au moins."],
          metro: ["Silence. Puis la voûte *tremble*.[[geant]]", "Au fond du quai, une silhouette énorme se redresse. Elle touche presque le plafond."]
        },
        choix: [
          { t: "T'enfermer dans {abri}", go: "n1_abri" },
          { t: "Fuir par {etroit}", go: "n1_etroit" },
          { t: "L'observer de loin", calme: true, go: "n1_observe" }
        ]
      },
      n1_abri: {
        vue: "abri", fx: ["danger"], acteurs: [{ q: "joueur", a: "abri", pose: "cache" }], on: { peur: 30 },
        l: ["Tu t'enfermes dans {abri}. Tu bloques la porte.", "BOUM. La porte tremble.[[boum]]", "BOUM. Le bois éclate.[[craque]]", "Une main énorme passe dans le trou."],
        indice: { id: "portes", t: "Les portes ne l'arrêtent pas : il les *défonce*." },
        choix: [
          { t: "Sortir par l'autre côté et courir", fx: { bruit: 20 }, go: "n1_course" },
          { t: "Te glisser dans un recoin trop petit pour lui", go: "n1_recoin" }
        ]
      },
      n1_recoin: {
        vue: "abri", acteurs: [{ q: "joueur", a: "abri", pose: "cache" }],
        l: ["Tu te glisses entre deux poutres. Un espace minuscule.", "Il entre. Il cherche. Sa main fouille l'ombre… et ne passe pas.", "Il grogne. Il frappe. Puis il repart, épuisé."],
        indice: { id: "etroit", t: "Il ne passe pas dans les endroits *étroits*." },
        next: "n1_fin"
      },
      n1_course: {
        vue: "decouvert", acteurs: [{ q: "joueur", a: "decouvert", pose: "court" }, { q: "zombie", a: "fond" }],
        l: ["Tu cours.[[pas:course]]", "Il te suit. Chaque pas fait trembler le sol.[[geant]]", "Mais au bout de cent mètres, il *ralentit*. Il souffle comme une forge.", "Il s'arrête. Toi, non."],
        indice: { id: "lent", t: "Il est lent, et il s'*essouffle* vite." },
        next: "n1_fin"
      },
      n1_etroit: {
        vue: "passage", acteurs: [{ q: "zombie", a: "passage" }],
        l: {
          village: ["Tu fonces dans les ruelles en escaliers.", "Il te suit… et se coince entre deux maisons. Ses épaules raclent la pierre.[[craque]]", "Il recule. Il cherche un autre chemin. Il n'y en a pas."],
          ile: ["Tu fonces vers le phare. L'escalier en colimaçon, étroit, raide.", "Il essaie d'entrer. Ses épaules *bloquent* dans l'encadrement.[[craque]]", "Il frappe le mur. Puis il renonce."],
          metro: ["Tu fonces vers l'escalier de service. Étroit. Raide.", "Il essaie de te suivre. Ses épaules raclent les murs.[[craque]]", "Il ne passe pas. Il frappe la porte. Puis il renonce."]
        },
        indice: { id: "etroit", t: "Il ne passe pas dans les endroits *étroits*." },
        next: "n1_fin"
      },
      n1_observe: {
        vue: "decouvert", acteurs: [{ q: "zombie", a: "decouvert" }],
        l: ["Tu restes dans l'ombre. Tu le regardes.", "Il marche. Chaque pas lui coûte. Il *halète*.", "Il s'arrête tous les vingt mètres pour reprendre son souffle.", "Énorme. Mais pas fait pour courir."],
        indice: { id: "lent", t: "Il est lent, et il s'*essouffle* vite." },
        next: "n1_fin"
      },
      n1_fin: {
        vue: "large", acteurs: [{ q: "zombie", a: "fond" }],
        l: ["Jusqu'à l'aube, le sol tremble par moments.[[geant]]", "Puis il s'effondre quelque part, épuisé, et dort comme une pierre."],
        next: "aube1"
      },

      /* ── NUIT 2 ── */
      n2: {
        nuit: 2, vue: "large", on: { peur: 10 }, acteurs: [{ q: "zombie", a: "decouvert" }],
        l: {
          village: ["Tu dois rejoindre l'église. Il garde la *place*."],
          ile: ["Il faut rejoindre le *phare*. Il garde la lande."],
          metro: ["Tu dois atteindre le local technique. Il est sur le quai, entre toi et la porte."]
        },
        choix: [
          { t: "Passer par {etroit}", go: "n2_etroit" },
          { t: "L'épuiser en le faisant courir", go: "n2_epuise" },
          { t: "Passer pendant qu'il dort, sur la pointe des pieds", calme: true, go: "n2_dort" }
        ]
      },
      n2_etroit: {
        vue: { village: "passage", ile: "haut", metro: "haut" }, acteurs: [{ q: "zombie", a: "bas" }],
        l: {
          village: ["Tu prends les ruelles les plus étroites. Il ne peut pas te suivre.", "Il fait le tour par la grand-rue. Trop lent.", "Tu arrives à l'église bien avant lui."],
          ile: ["Tu longes les murets jusqu'au phare, puis tu fonces dans l'escalier.", "Il arrive trop tard. Il ne passe pas la porte."],
          metro: ["Tu passes par l'escalier de service, puis par la *passerelle*.", "La passerelle grince sous ton poids. Rouillée. Fragile.", "Il te regarde d'en bas. Il ne monte pas."]
        },
        indice: { id: "etroit", t: "Il ne passe pas dans les endroits *étroits*." },
        next: "n2_science"
      },
      n2_epuise: {
        vue: "decouvert", acteurs: [{ q: "zombie", a: "decouvert" }], on: { peur: 15 },
        l: ["Tu te montres. Il charge.[[geant]]", "Tu cours en zigzag. Il te suit, puis il s'arrête, plié en deux.", "Il souffle. Il ne peut plus faire un pas.", "Tu passes à côté de lui."],
        indice: { id: "lent", t: "Il est lent, et il s'*essouffle* vite." },
        next: "n2_science"
      },
      n2_dort: {
        vue: "proche", acteurs: [{ q: "zombie", a: "proche", pose: "tombe" }],
        l: ["Il dort, affalé contre un mur. Sa respiration fait trembler les vitres.", "Tu passes à deux mètres de lui. Sur la pointe des pieds.", "Il ne bouge pas."],
        next: "n2_science"
      },
      n2_science: { type: "science", vue: "large", next: "n2_lieu" },
      n2_lieu: {
        vue: { village: "decouvert", ile: "objectif", metro: "haut" },
        l: {
          village: ["Dans la grange, une échelle monte au *grenier à foin*.", "Le plancher du grenier est pourri. Il craque sous tes pieds.", "Toi, il te porte. Lui, il ne le portera *jamais*."],
          ile: ["Au port, le vieux *ponton* est en planches pourries.", "Il plie sous ton poids. Sous le sien…"],
          metro: ["La passerelle, au-dessus des voies : rouillée, boulonnée de travers.", "Elle te porte. Lui, elle ne le portera *jamais*."]
        },
        indice: { id: "lourd", t: "Un plancher fragile ne le portera *pas*." },
        choix: {
          village: [
            { t: "Préparer le piège du grenier pour demain", fx: { set: "piege" }, go: "n2_fin" },
            { t: "Repérer les ruelles les plus étroites jusqu'au col", go: "n2_fin" }
          ],
          ile: [
            { t: "Repérer le ponton pour demain", fx: { set: "piege" }, go: "n2_fin" },
            { t: "Dormir en haut du phare", go: "n2_fin" }
          ],
          metro: [
            { t: "Desserrer les boulons de la passerelle", need: "piedbiche", fx: { set: "piege" }, go: "n2_fin" },
            { t: "Repérer les couloirs de service", go: "n2_fin" }
          ]
        }
      },
      n2_fin: {
        vue: "large",
        l: ["Il cherche toute la nuit. Il défonce trois portes.[[boum]]", "Puis il s'effondre de fatigue.", "Plus qu'*une* nuit."],
        next: "aube2"
      },

      /* ── NUIT 3 ── */
      n3: {
        nuit: 3, vue: "large", on: { peur: 10 }, acteurs: [{ q: "zombie", a: "decouvert" }],
        l: {
          village: ["L'hélicoptère se posera au *col*. Il faut sortir du village.", "Il t'attend au bout de la grand-rue. Il est *reposé*."],
          ile: ["Rallumer le phare. Puis rejoindre le port.", "Il garde la chaussée."],
          metro: ["Le terminus est au bout du tunnel. Un tunnel large, en béton.", "Il est sur le quai. Reposé. Entre toi et le tunnel."]
        },
        choix: {
          village: [
            { t: "L'attirer dans le grenier pourri de la grange", req: { flag: "piege" }, pourquoi: "Tu n'as pas préparé le grenier.", go: "n3_grenier" },
            { t: "Monter par les ruelles étroites", go: "n3_ruelles" },
            { t: "Passer en force, à côté de lui", go: "n3_force" },
            { t: "T'enfermer dans {abri} jusqu'à l'aube", go: "n3_abri" }
          ],
          ile: [
            { t: "L'attirer sur le ponton pourri", req: { flag: "piege" }, pourquoi: "Tu n'as pas repéré le ponton.", go: "n3_ponton" },
            { t: "Allumer le phare et rester dans l'escalier étroit", go: "n3_phare" },
            { t: "Passer en force, à côté de lui", go: "n3_force" },
            { t: "T'enfermer dans {abri} jusqu'à l'aube", go: "n3_abri" }
          ],
          metro: [
            { t: "L'attirer sur la passerelle", req: { flag: "piege" }, pourquoi: "La passerelle tient encore trop bien.", go: "n3_passerelle" },
            { t: "Passer par l'escalier et les couloirs de service", go: "n3_service" },
            { t: "Le faire courir sur le quai jusqu'à l'épuiser", go: "n3_quai" },
            { t: "T'enfermer dans {abri} jusqu'au matin", go: "n3_abri" }
          ]
        }
      },
      n3_grenier: {
        vue: "decouvert", acteurs: [{ q: "zombie", a: "abri", pose: "tombe" }],
        l: ["Tu te montres. Il charge. Tu fonces dans la grange et tu grimpes l'échelle.", "Il défonce la porte. Il monte. Le grenier *gémit* sous lui.[[craque]]", "CRAC. Le plancher cède.[[chute]]", "Il tombe. Lourdement. Il ne se relève pas.", "Tu sors par la lucarne. Direction : le col.[[helico]]"],
        fin: "chute"
      },
      n3_ponton: {
        vue: "objectif", decor: ["phare"], acteurs: [{ q: "zombie", a: "objectif", pose: "tombe" }],
        l: ["Tu allumes le phare. Puis tu cours sur le ponton du port. Les planches plient sous toi.[[phare]]", "Il te suit. Les planches *craquent*.[[craque]]", "CRAC. Il passe au travers, dans l'eau noire.[[eau]]", "Il est trop lourd pour remonter.[[bateau]]"],
        fin: "chute"
      },
      n3_passerelle: {
        vue: "haut", acteurs: [{ q: "zombie", a: "bas", pose: "tombe" }],
        l: ["Tu montes sur la passerelle. Il te suit. Les boulons desserrés *gémissent*.[[metal]]", "Toi, elle te porte. Lui…", "CRAC. La passerelle plie et s'effondre sur les voies.[[chute]]", "Il ne se relève pas. Tu sautes sur le quai d'en face et tu files.[[train]]"],
        fin: "chute"
      },
      n3_ruelles: {
        vue: "passage", acteurs: [{ q: "zombie", a: "fond" }],
        l: ["Tu prends les ruelles les plus étroites. Les escaliers.", "Il te suit, se coince, recule, fait le tour.[[craque]]", "Trop large. Trop lent.", "Quand il sort enfin du village, tu es déjà au col.[[helico]]"],
        fin: "etroit"
      },
      n3_service: {
        vue: "passage", acteurs: [{ q: "zombie", a: "fond" }],
        l: ["Tu passes par l'escalier de service, puis par les couloirs techniques.", "Étroits. Bas de plafond. Il ne peut pas suivre.", "Tu ressors dans le tunnel, loin devant lui.[[train]]"],
        fin: "etroit"
      },
      n3_phare: {
        vue: "haut", decor: ["phare"], acteurs: [{ q: "zombie", a: "bas" }],
        l: ["Tu allumes le phare. Tu restes dans l'escalier étroit.[[phare]]", "Il frappe la porte. Il ne passe pas.", "À l'aube, épuisé, il s'effondre sur la lande.", "Tu descends. Tu cours au port.[[bateau]]"],
        fin: "etroit"
      },
      n3_quai: {
        vue: "decouvert", fx: ["danger"], acteurs: [{ q: "zombie", a: "proche" }],
        l: ["Tu te montres. Il charge.[[geant]]", "Tu cours sur le quai. Mais ici, pas de détour, pas de recoin : un long couloir de béton.", "Il ne ralentit pas assez vite.", "Il te rattrape au bout du quai."],
        fin: "ecrase"
      },
      n3_force: {
        vue: "proche", fx: ["danger"], acteurs: [{ q: "zombie", a: "proche" }],
        l: ["Tu fonces droit devant, pour passer à côté de lui.", "Il est lent. Mais il n'a pas besoin d'être rapide.", "Un seul revers de bras.[[boum]]"],
        fin: "ecrase"
      },
      n3_abri: {
        vue: "abri", fx: ["danger"], acteurs: [{ q: "joueur", a: "abri", pose: "cache" }],
        l: ["Tu t'enfermes dans {abri}. Tu bloques la porte avec tout ce que tu trouves.", "BOUM.[[boum]] BOUM.", "La porte vole en éclats.[[craque]]"],
        fin: "porte"
      }
    },

    fins: {
      chute: { type: "survie", parfait: true, titre: "LA CHUTE", texte: "Trop lourd pour ce plancher. Plus on est grand, plus on tombe lourdement." },
      etroit: { type: "survie", parfait: true, titre: "TROP ÉTROIT", texte: "Il ne passait pas. Tu as choisi un chemin fait pour toi, pas pour lui." },
      ecrase: {
        type: "mort", titre: "LE REVERS",
        cause: "Le Géant.",
        pourquoi: { tous: "Il est lent, mais sa force est immense. En face à face, tu n'avais aucune chance.", metro: "Dans un couloir de béton, sans recoin ni détour, sa lenteur ne te protégeait pas." },
        conseil: "Fais-le passer là où il ne passe pas : escaliers étroits, planchers fragiles."
      },
      porte: {
        type: "mort", titre: "LA PORTE",
        cause: "Le Géant.",
        pourquoi: "Portes, vitres, murs de planches : il défonce tout. S'enfermer, c'est s'offrir.",
        conseil: "Ne t'enferme pas : va là où il ne passe pas."
      }
    },

    science: {
      titre: "LA LOI DU CARRÉ-CUBE",
      diapos: [
        {
          l: ["Double la taille d'un animal.", "La section de ses muscles est multipliée par *4* : il est 4 fois plus fort…", "…mais son volume, donc son poids, est multiplié par *8*.", "C'est la loi du *carré-cube*, décrite par Galilée en 1638."],
          dessin: function (k, t) {
            k.fond();
            function cube(x, y, s, col) {
              k.poly([[x, y], [x + s, y], [x + s, y - s], [x, y - s]], col);
              k.poly([[x, y - s], [x + s * 0.4, y - s * 1.4], [x + s * 1.4, y - s * 1.4], [x + s, y - s]], "rgba(255,255,255,.18)");
              k.poly([[x + s, y], [x + s * 1.4, y - s * 0.4], [x + s * 1.4, y - s * 1.4], [x + s, y - s]], "rgba(0,0,0,.25)");
            }
            cube(120, 520, 110, "#6c7a90");
            k.texte("×1", 175, 580, { taille: 34, couleur: k.c.blanc });
            var g = k.prog(t, 1.5, 1.5);
            cube(440, 520, 110 + 110 * g, "#8a6a4a");
            k.texte("×2", 550, 580, { taille: 34, couleur: k.c.blanc });
            if (t > 3.5) k.texte("FORCE ×4", 760, 200, { taille: 38, couleur: k.c.neon, alpha: k.prog(t, 3.5, 0.8) });
            if (t > 5.5) k.texte("POIDS ×8", 760, 260, { taille: 38, couleur: k.c.rouge, alpha: k.prog(t, 5.5, 0.8) });
          }
        },
        {
          l: ["Plus on est grand, plus on est lourd *par rapport* à sa force.", "Un géant s'épuise vite, se relève mal, et tombe *lourdement*."],
          dessin: function (k, t) {
            k.fond();
            k.axes(90, 560, 760, 420, "taille", "");
            var p = Math.min(1, t / 2.5);
            k.courbe(function (x) { return 400 * x * x; }, 90, 560, 760, 420, k.c.neon, p, 5, "force");
            k.courbe(function (x) { return 400 * x * x * x * 1.6; }, 90, 560, 760, 420, k.c.rouge, p, 5, "poids");
            if (t > 3) { k.ligne([[90 + 0.625 * 760, 560], [90 + 0.625 * 760, 140]], k.c.or, 3, 0.8, [10, 8]); k.texte("IL S'ÉCROULE", 90 + 0.625 * 760, 120, { taille: 30, couleur: k.c.or, alpha: k.prog(t, 3, 0.8) }); }
          }
        },
        {
          l: {
            village: ["Un plancher pourri te porte. Lui, *non*.", "Une ruelle étroite te laisse passer. Lui, *non*.", "Pense au *grenier* de la grange."],
            ile: ["Un ponton pourri te porte. Lui, *non*.", "L'escalier du phare te laisse passer. Lui, *non*."],
            metro: ["Une passerelle rouillée te porte. Lui, *non*.", "L'escalier de service te laisse passer. Lui, *non*.", "Mais attention : ici, tout le reste est en *béton*."]
          },
          dessin: function (k, t) {
            k.fond();
            var casse = t > 2.5, c = k.prog(t, 2.5, 0.6);
            k.rect(60, 330, 230, 18, "#8a6a4a");
            k.bonhomme(175, 330, 1.2, k.c.neon);
            k.coche(175, 420, 1.3, k.c.neon);
            if (!casse) { k.rect(420, 330, 420, 18, "#8a6a4a"); }
            else { k.poly([[420, 330], [620, 330 + 60 * c], [620, 348 + 60 * c], [420, 348]], "#8a6a4a"); k.poly([[840, 330], [640, 330 + 60 * c], [640, 348 + 60 * c], [840, 348]], "#8a6a4a"); }
            var gy = 330 + (casse ? 200 * c : 0);
            k.rect(585, gy - 170, 80, 120, "#3a3530"); k.cercle(625, gy - 190, 22, "#8b9a8f", true);
            k.ligne([[600, gy - 50], [596, gy]], "#2b2724", 16); k.ligne([[650, gy - 50], [654, gy]], "#2b2724", 16);
            if (casse) k.texte("CRAC !", 630, 220, { taille: 50, couleur: k.c.or, alpha: c });
          }
        }
      ]
    }
  });
})(typeof window !== "undefined" ? window : globalThis);
