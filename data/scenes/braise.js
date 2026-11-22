/* Dje_zombie — Saison 1 — LA BRAISE.
   Règles : incandescente, elle enflamme tout ce qu'elle touche ; plus il y a de bois, plus elle grandit.
   Point faible : le triangle du feu. L'étouffer (oxygène), la noyer (chaleur), l'attirer sur la pierre (combustible). */
(function (root) {
  "use strict";
  var DJE = root.DJE;

  DJE.histoire("braise", {
    scenes: {
      n1: {
        nuit: 1, vue: "decouvert", fx: ["braises"], acteurs: [{ q: "zombie", a: "fond" }],
        l: {
          village: ["Silence.", "Puis une *lueur* orange, au bout de la rue.", "Une silhouette qui *rougeoie*. Comme un tison qui marche.[[braise]]"],
          ile: ["Le ressac. La nuit noire.", "Puis une *lueur* orange sur la lande. Une silhouette qui *rougeoie*.[[braise]]"],
          metro: ["Une lueur orange au fond du tunnel.", "Une silhouette qui *rougeoie*, entre les rails.[[braise]]"]
        },
        choix: [
          { t: "Te cacher dans {abri}", go: "n1_abri" },
          { t: { village: "Reculer sur la place pavée et l'observer", ile: "Reculer sur les rochers et l'observer", metro: "Reculer sur le quai carrelé et l'observer" }, calme: true, go: "n1_observe" },
          { t: "Courir loin d'elle", fx: { bruit: 20 }, go: "n1_course" }
        ]
      },
      n1_abri: {
        vue: "abri", decor: ["feu"], fx: ["braises", "danger"], acteurs: [{ q: "joueur", a: "abri", pose: "cache" }], on: { peur: 30 },
        l: {
          village: ["Tu te glisses dans la grange.", "La lueur approche. Elle s'arrête contre la porte en bois.", "Et la porte se met à *fumer*. Puis à *brûler*.[[feu]]", "La grange est pleine de foin."],
          ile: ["Tu te glisses dans la cabane en planches.", "La lueur approche. Elle pose la main sur le mur.", "Les planches se mettent à *fumer*. Puis à *brûler*.[[feu]]"],
          metro: ["Tu te glisses dans la cabine du chef de station.", "La lueur approche. Elle pose la main sur la porte.", "Le vieux bureau en bois, derrière toi, se met à *fumer*.[[feu]]", "La fumée remplit la cabine."]
        },
        indice: { id: "brule", t: "Tout ce qu'elle touche s'*enflamme* : bois, foin, planches." },
        choix: {
          village: [
            { t: "Étouffer les flammes sous ta couverture", need: "couverture", go: "n1_eteint" },
            { t: "Défoncer une planche et sortir par l'arrière", go: "n1_sortie" }
          ],
          ile: [
            { t: "Jeter ton seau d'eau de mer sur les flammes", need: "seau", go: "n1_eteint" },
            { t: "Défoncer une planche et sortir par l'arrière", go: "n1_sortie" }
          ],
          metro: [
            { t: "Vider une giclée d'extincteur", need: "extincteur", go: "n1_eteint" },
            { t: "Sortir par la porte de derrière", go: "n1_sortie" }
          ]
        }
      },
      n1_eteint: {
        vue: "abri", acteurs: [{ q: "joueur", a: "abri", pose: "cache" }],
        l: {
          village: ["Tu jettes la couverture sur la porte en feu. Tu appuies de tout ton poids.", "Les flammes s'éteignent sous la laine.", "Dehors, la silhouette recule. Sa lueur baisse un instant."],
          ile: ["Tu jettes l'eau de mer sur les planches.[[eau]]", "Ça siffle. Ça fume. Le feu meurt.", "Dehors, la silhouette recule."],
          metro: ["Tu vides une giclée d'extincteur.[[extincteur]]", "Un nuage blanc. Le feu meurt d'un coup.", "Dehors, la silhouette recule. Sa lueur vacille."]
        },
        indice: { id: "eteint", t: "Le feu qu'elle allume, on peut l'*éteindre*." },
        next: "n1_fin"
      },
      n1_sortie: {
        vue: "decouvert", decor: ["feu"], fx: ["braises"], acteurs: [{ q: "zombie", a: "abri" }],
        l: ["Tu défonces la planche du fond. Tu sors en toussant.[[craque]]", "Derrière toi, {abri} s'embrase en entier.[[feu]]", "La silhouette reste dans le feu. Elle a l'air… *plus grande*. Plus vive."],
        indice: { id: "bois", t: "Plus il y a de bois autour d'elle, plus elle *grandit*." },
        next: "n1_fin"
      },
      n1_observe: {
        vue: "decouvert", fx: ["braises"], acteurs: [{ q: "zombie", a: "decouvert" }],
        l: {
          village: ["Tu recules sur la place. Des pavés. De la pierre.", "Elle te suit… puis s'arrête au bord de la place.", "Sur la pierre, sa lueur *baisse*. Elle tourne la tête vers les granges.", "Elle repart vers le bois."],
          ile: ["Tu recules sur les rochers.", "Elle s'arrête au bord. Les embruns grésillent sur elle.[[braise]]", "Sa lueur *baisse*. Elle repart vers les cabanes."],
          metro: ["Tu recules sur le quai carrelé.", "Elle s'arrête. Sur le béton, rien à brûler. Sa lueur *baisse*.", "Elle repart vers les vieux bancs en bois."]
        },
        indice: { id: "pierre", t: "Sur la *pierre*, elle ne trouve rien à brûler : elle faiblit." },
        next: "n1_fin"
      },
      n1_course: {
        vue: "decouvert", decor: { village: ["feu"] }, fx: ["braises"], acteurs: [{ q: "joueur", a: "decouvert", pose: "court" }, { q: "zombie", a: "fond" }], on: { peur: 15 },
        l: ["Tu cours. Elle te suit.[[pas:course]]", "Elle frôle {bois}. Tout s'embrase sur son passage.[[feu]]", "Tu t'échappes. Derrière toi, la nuit est orange."],
        indice: { id: "brule", t: "Tout ce qu'elle touche s'*enflamme* : bois, foin, planches." },
        next: "n1_fin"
      },
      n1_fin: {
        vue: "large", decor: { village: ["feu"] }, fx: ["braises"],
        l: {
          village: ["Le reste de la nuit, une grange brûle au fond du village.[[feu]]", "La silhouette danse devant. Plus grande que jamais."],
          ile: ["Le reste de la nuit, une cabane brûle sur la lande.", "Puis la bruine de l'aube l'éteint. La silhouette s'en va en sifflant.[[braise]]"],
          metro: ["Le reste de la nuit, la fumée flotte sous la voûte.", "Tu tousses. Ici, la fumée n'a *nulle part* où aller."]
        },
        indice: {
          village: { id: "bois", t: "Plus il y a de bois autour d'elle, plus elle *grandit*." },
          ile: { id: "eau", t: "L'*eau* la fait siffler et noircir." },
          metro: { id: "fumee", t: "En sous-sol, la *fumée* ne s'échappe pas." }
        },
        next: "aube1"
      },

      /* ── NUIT 2 ── */
      n2: {
        nuit: 2, vue: "large", on: { peur: 10 }, fx: ["braises"], acteurs: [{ q: "zombie", a: "fond" }],
        l: {
          village: ["Tu dois rejoindre l'église. Elle rôde près des granges."],
          ile: ["Il faut atteindre le phare. Elle rôde près des cabanes."],
          metro: ["Tu dois atteindre le local technique. Elle rôde près des bancs en bois."]
        },
        choix: [
          { t: { village: "Passer par la place pavée, loin des granges", ile: "Passer par les rochers du rivage", metro: "Passer par le quai carrelé, loin des bancs" }, go: "n2_pierre" },
          { t: "Passer vite, au ras du bois", go: "n2_bois" },
          { t: { village: "Enflammer une botte de foin au loin, pour l'attirer", ile: "Tirer ta fusée sur la lande, pour l'attirer", metro: "Enflammer un tas de papiers au loin, pour l'attirer" }, need: { village: "allumettes", ile: "fusee", metro: "briquet" }, go: "n2_diversion" }
        ]
      },
      n2_pierre: {
        vue: "decouvert", fx: ["braises"], acteurs: [{ q: "zombie", a: "decouvert" }],
        l: {
          village: ["Tu restes sur les pavés. Loin de tout ce qui brûle.", "Elle te voit. Elle vient… et ralentit. Sa lueur faiblit à chaque pas.", "Tu passes."],
          ile: ["Tu restes sur les rochers. Les embruns te fouettent le visage.", "Elle te voit. Elle vient… et ralentit. Sa lueur faiblit à chaque pas.", "Tu passes."],
          metro: ["Tu restes sur le carrelage. Loin des bancs.", "Elle te voit. Elle vient… et ralentit. Sa lueur faiblit à chaque pas.", "Tu passes."]
        },
        indice: { id: "pierre", t: "Sur la *pierre*, elle ne trouve rien à brûler : elle faiblit." },
        next: "n2_science"
      },
      n2_bois: {
        vue: "decouvert", decor: ["feu"], fx: ["braises", "danger"], acteurs: [{ q: "zombie", a: "proche" }], on: { peur: 25 },
        l: ["Tu passes au ras de {bois}.", "Elle te voit. Elle fonce. Le bois s'embrase à son passage.[[feu]]", "Un mur de flammes te barre la route."],
        choix: [
          { t: "Traverser les flammes", go: "n2_flammes" },
          { t: "Faire demi-tour par la pierre", go: "n2_pierre" }
        ]
      },
      n2_flammes: {
        vue: "proche", decor: ["feu"], fx: ["braises", "danger"], acteurs: [{ q: "zombie", a: "proche" }],
        l: ["Tu fonces dans les flammes, le bras devant le visage.[[feu]]", "Une poutre en feu s'effondre devant toi.[[craque]]", "Derrière, elle. Devant, le feu.", "Tu es pris entre les deux."],
        fin: "flammes"
      },
      n2_diversion: {
        vue: "large", decor: { village: ["feu"] }, fx: ["braises"], acteurs: [{ q: "zombie", a: "fond" }],
        on: { ile: { perd: "fusee" }, metro: { peur: 10 } },
        l: {
          village: ["Tu enflammes une botte de foin, loin, au bout de la place.[[feu]]", "Elle se tourne vers les flammes. Elle y va.", "Elle *aime* ce qui brûle."],
          ile: ["Tu tires ta fusée sur la lande, loin du phare.[[fusee]]", "Une boule rouge, brûlante. Elle se tourne vers elle. Elle y va."],
          metro: ["Tu enflammes un tas de vieux papiers, au bout du quai.[[feu]]", "Elle se tourne vers les flammes. Elle y va.", "Mais la fumée, elle, se répand sous la voûte."]
        },
        indice: { id: "attire", t: "Elle marche vers ce qui *brûle*." },
        next: "n2_science"
      },
      n2_science: { type: "science", vue: "large", next: "n2_lieu" },
      n2_lieu: {
        vue: { village: "eau", ile: "haut", metro: "fond" }, decor: { metro: ["local"] },
        l: {
          village: ["L'église. De la pierre, partout : les murs, le sol, les marches.", "Et dehors, le *lavoir*, plein d'eau glacée."],
          ile: ["Le phare. Tout en pierre.", "Dehors, la mer, partout."],
          metro: ["Le local technique. Un *robinet d'incendie* au mur. Et un levier : VENTILATION.", "La ventilation chasserait la fumée… en faisant entrer de l'air frais."]
        },
        choix: {
          village: [
            { t: "Tremper ta couverture dans le lavoir", need: "couverture", fx: { set: "couv_mouillee" }, go: "n2_fin" },
            { t: "Repérer le chemin de pierre jusqu'au col", go: "n2_fin" },
            { t: "Attendre le jour sur les marches de l'église", go: "n2_fin" }
          ],
          ile: [
            { t: "Remplir ton seau d'eau de mer", need: "seau", fx: { set: "seau_plein" }, go: "n2_fin" },
            { t: "Attendre le jour dans le phare", go: "n2_fin" }
          ],
          metro: [
            { t: "Dérouler la lance d'incendie", fx: { set: "lance" }, go: "n2_fin" },
            { t: "Repérer le levier de ventilation", fx: { set: "vent" }, go: "n2_fin" },
            { t: "Attendre le matin", go: "n2_fin" }
          ]
        }
      },
      n2_fin: {
        vue: "large",
        l: ["Tu attends le jour, loin de tout ce qui brûle.", "Plus qu'*une* nuit."],
        next: "aube2"
      },

      /* ── NUIT 3 ── */
      n3: {
        nuit: 3, vue: "large", on: { peur: 10 }, fx: ["braises"], acteurs: [{ q: "zombie", a: "fond" }],
        l: {
          village: ["L'hélicoptère se posera au *col*. Le sentier passe entre les granges… puis dans la forêt de *sapins*.", "Elle rôde près des granges."],
          ile: ["Rallumer le phare. Puis rejoindre le port par la chaussée.", "Elle rôde près du phare."],
          metro: ["Le terminus est au bout du tunnel.", "Elle est dans le tunnel. La fumée de la veille flotte encore."]
        },
        choix: {
          village: [
            { t: "L'étouffer sous ta couverture trempée", req: { flag: "couv_mouillee" }, pourquoi: "Il te faut une couverture trempée.", go: "n3_etouffe" },
            { t: "L'attirer dans le lavoir", go: "n3_lavoir" },
            { t: "Monter par le chemin de pierre", go: "n3_pierre" },
            { t: "Couper par la forêt de sapins", go: "n3_foret" }
          ],
          ile: [
            { t: "Lui jeter ton seau d'eau de mer", req: { flag: "seau_plein" }, pourquoi: "Ton seau n'est pas rempli.", go: "n3_seau" },
            { t: "L'attirer dans les vagues", go: "n3_vagues" },
            { t: "Passer par les rochers jusqu'à la chaussée", go: "n3_pierre" },
            { t: "T'enfermer dans la cabane en planches", go: "n3_cabane" }
          ],
          metro: [
            { t: "L'arroser avec la lance d'incendie", req: { flag: "lance" }, pourquoi: "La lance d'incendie n'est pas prête.", go: "n3_lance" },
            { t: "La viser avec l'extincteur", need: "extincteur", go: "n3_extincteur" },
            { t: "Lancer la ventilation pour chasser la fumée", si: { flag: "vent" }, go: "n3_ventilation" },
            { t: "Traverser la fumée en courant", go: "n3_fumee" }
          ]
        }
      },
      n3_etouffe: {
        vue: "haut", acteurs: [{ q: "zombie", a: "haut", pose: "tombe" }],
        l: ["Tu attends qu'elle passe sous le porche. Tu sautes.", "La couverture trempée s'abat sur elle. Tu serres.[[souffle]]", "Ça siffle. Ça fume. Sa lueur *s'éteint* sous la laine.", "Plus d'air. Plus de feu. Plus rien.[[helico]]"],
        fin: "etouffe"
      },
      n3_lavoir: {
        vue: "eau", acteurs: [{ q: "zombie", a: "eau", pose: "tombe" }],
        l: ["Tu te montres. Elle te suit.", "Tu sautes par-dessus le bassin. Elle, elle marche *dedans*.[[eau]]", "Un sifflement énorme. Un nuage de vapeur.", "Quand il se dissipe, il ne reste qu'une silhouette noire, éteinte.[[helico]]"],
        fin: "noyee"
      },
      n3_vagues: {
        vue: "eau", decor: ["phare"], acteurs: [{ q: "zombie", a: "eau", pose: "tombe" }],
        l: ["Tu l'attires sur la grève. Une vague arrive. Puis une autre.[[vague]]", "Elle siffle. Elle fume. Elle noircit.", "La mer l'éteint, morceau par morceau.", "Tu allumes le phare et tu cours au port.[[bateau]]"],
        fin: "noyee"
      },
      n3_seau: {
        vue: "objectif", decor: ["phare"], acteurs: [{ q: "zombie", a: "decouvert" }],
        l: ["Tu allumes le phare. Elle arrive.[[phare]]", "Tu attends qu'elle soit à deux mètres. Tu lances l'eau.[[eau]]", "Elle siffle, recule, noircit.", "Le temps qu'elle se rallume, tu es déjà sur la chaussée.[[bateau]]"],
        fin: "noyee"
      },
      n3_lance: {
        vue: "decouvert", acteurs: [{ q: "zombie", a: "decouvert", pose: "tombe" }],
        l: ["Tu ouvres la lance d'incendie. Un jet *énorme*.[[eau]]", "Elle siffle, elle hurle, elle noircit.", "Il ne reste qu'une statue de charbon fumant au milieu des rails.[[train]]"],
        fin: "noyee"
      },
      n3_extincteur: {
        vue: "decouvert", acteurs: [{ q: "zombie", a: "decouvert", pose: "tombe" }],
        l: ["Tu vides l'extincteur sur elle. Un nuage blanc, glacé.[[extincteur]]", "Le gaz chasse l'*oxygène*. Sa lueur vacille… et meurt.", "Tu traverses le tunnel avant qu'elle se rallume.[[train]]"],
        fin: "etouffe"
      },
      n3_pierre: {
        vue: "objectif", acteurs: [{ q: "zombie", a: "objectif" }],
        l: {
          village: ["Tu montes par le chemin de pierre. Murets. Rochers. Pas un brin d'herbe.", "Elle te suit… et faiblit à chaque pas. Rien à brûler.", "Au col, elle n'est plus qu'une braise grise. L'hélicoptère se pose.[[helico]]"],
          ile: ["Tu allumes le phare. Puis tu passes par les rochers.[[phare]]", "Les embruns grésillent sur elle quand elle te suit. Rien à brûler. Elle faiblit.", "Tu rejoins la chaussée. Le bateau t'attend.[[bateau]]"]
        },
        fin: "pierre"
      },
      n3_foret: {
        vue: "objectif", decor: ["feu"], fx: ["braises", "danger"], acteurs: [{ q: "zombie", a: "objectif" }],
        l: ["Tu prends le raccourci par la forêt de sapins.", "Elle te suit. Elle frôle un tronc.[[feu]]", "Puis un autre. La résine s'embrase d'un coup.", "En une minute, toute la forêt flambe autour de toi."],
        fin: "incendie"
      },
      n3_cabane: {
        vue: "abri", decor: ["feu"], fx: ["braises", "danger"], acteurs: [{ q: "joueur", a: "abri", pose: "cache" }],
        l: ["Tu t'enfermes dans la cabane en planches.", "Elle pose une main sur le mur.[[feu]]", "Les planches sèches s'embrasent en quelques secondes."],
        fin: "incendie"
      },
      n3_ventilation: {
        vue: "large", decor: ["ventilation", "local"], fx: ["braises", "danger"], acteurs: [{ q: "zombie", a: "decouvert" }],
        l: ["Tu abaisses le levier. Un courant d'air puissant traverse la station.[[ventilation]]", "La fumée s'en va… et l'air frais arrive. Plein d'*oxygène*.", "Elle se redresse. Ses flammes *doublent* de taille.[[feu]]", "Elle te voit. Et elle a de quoi brûler longtemps."],
        fin: "souffle"
      },
      n3_fumee: {
        vue: "objectif", fx: ["brume", "braises", "danger"], acteurs: [{ q: "zombie", a: "objectif" }],
        l: ["Tu cours dans le tunnel enfumé.[[pas:course]]", "La fumée te pique les yeux. Te brûle la gorge.[[souffle]]", "Tu tousses. Tu tombes à genoux.", "Une lueur orange approche dans le brouillard."],
        fin: "fumee"
      }
    },

    fins: {
      etouffe: { type: "survie", parfait: true, lieux: ["village", "metro"], titre: "PLUS D'AIR", texte: "Sans oxygène, pas de feu. Tu l'as étouffée." },
      noyee: { type: "survie", parfait: true, titre: "LA VAPEUR", texte: "L'eau a refroidi la braise. Plus de chaleur, plus de feu." },
      pierre: { type: "survie", parfait: true, lieux: ["village", "ile"], titre: "RIEN À BRÛLER", texte: "Sur la pierre, elle n'avait rien à brûler. Elle s'est éteinte toute seule." },
      flammes: {
        type: "mort", titre: "LE MUR DE FEU",
        cause: "Le feu qu'elle a allumé.",
        pourquoi: "Tu as voulu traverser le bois en flammes au lieu de faire demi-tour par la pierre.",
        conseil: "Ne passe jamais près du bois quand elle est là. Reste sur la pierre."
      },
      incendie: {
        type: "mort", lieux: ["village", "ile"], titre: "L'INCENDIE",
        cause: "La Braise… et tout ce qui brûlait autour de toi.",
        pourquoi: { village: "Des sapins pleins de résine : tu lui as offert une forêt entière à brûler.", ile: "Des planches sèches : tu t'es enfermé dans du combustible." },
        conseil: "Reste sur la pierre. Loin du bois."
      },
      souffle: {
        type: "mort", lieux: ["metro"], titre: "LE SOUFFLE",
        cause: "La Braise, ranimée.",
        pourquoi: "La ventilation a apporté de l'air frais, plein d'oxygène. Tu as nourri le feu.",
        conseil: "Retire un côté du triangle du feu, n'en ajoute jamais. Étouffe-la ou noie-la."
      },
      fumee: {
        type: "mort", lieux: ["metro"], titre: "LA FUMÉE",
        cause: "La fumée, puis la Braise.",
        pourquoi: "En sous-sol, la fumée ne s'échappe pas. Elle tue avant les flammes.",
        conseil: "Ne traverse jamais la fumée. Éteins la Braise avant de bouger."
      }
    },

    science: {
      titre: "LE TRIANGLE DU FEU",
      diapos: [
        {
          l: ["Un feu a besoin de trois choses :", "un *combustible*, de la *chaleur*, et de l'*oxygène*.", "C'est le *triangle du feu*."],
          dessin: function (k, t) {
            k.fond();
            var A = [450, 110], B = [180, 560], C = [720, 560];
            var p = k.prog(t, 0.3, 1.5);
            k.ligne([A, [A[0] + (B[0] - A[0]) * p, A[1] + (B[1] - A[1]) * p]], k.c.or, 6);
            k.ligne([B, [B[0] + (C[0] - B[0]) * p, B[1] + (C[1] - B[1]) * p]], k.c.or, 6);
            k.ligne([C, [C[0] + (A[0] - C[0]) * p, C[1] + (A[1] - C[1]) * p]], k.c.or, 6);
            k.flamme(450, 460, 2.2, t, k.prog(t, 1.5, 1));
            if (t > 1.6) {
              k.texte("CHALEUR", 450, 70, { taille: 32, couleur: k.c.rouge, alpha: k.prog(t, 1.6, 0.6) });
              k.texte("COMBUSTIBLE", 180, 610, { taille: 30, couleur: "#d9a066", alpha: k.prog(t, 2.2, 0.6) });
              k.texte("OXYGÈNE", 720, 610, { taille: 30, couleur: k.c.neon, alpha: k.prog(t, 2.8, 0.6) });
            }
          }
        },
        {
          l: ["Retire *un seul* côté, et le feu meurt.", "Étouffer : plus d'oxygène. Arroser : plus de chaleur.", "La pierre : plus rien à brûler."],
          dessin: function (k, t) {
            k.fond();
            var ph = Math.floor(t / 2.4) % 3, f = (t % 2.4) / 2.4;
            var noms = [["ÉTOUFFER", "plus d'oxygène", k.c.neon], ["ARROSER", "plus de chaleur", k.c.bleu], ["LA PIERRE", "plus rien à brûler", "#9aa4b5"]];
            k.texte(noms[ph][0], 450, 90, { taille: 46, couleur: noms[ph][2] });
            k.texte(noms[ph][1], 450, 140, { taille: 28, couleur: k.c.blanc, gras: false });
            var taille = Math.max(0, 1 - f * 1.4);
            k.flamme(450, 520, 2.6 * taille + 0.01, t, taille);
            if (ph === 0) k.rect(260, 520 - 260 * Math.min(1, f * 2) - 20, 380, 30, "#a0522d");
            if (ph === 1) for (var i = 0; i < 6; i++) k.goutte(330 + i * 50, 200 + ((f * 600 + i * 40) % 300), 1.1);
            if (ph === 2) k.rect(250, 520, 400, 60, "#6c7480");
            if (ph !== 2) k.rect(330, 520, 240, 40, "#7a5230");
          }
        },
        {
          l: {
            village: ["Ici, le *bois* est partout : granges, poutres, sapins. Évite-le.", "Une couverture *trempée* l'étouffe. Le *lavoir* la noie.", "Et le chemin de *pierre* ne lui donne rien à brûler."],
            ile: ["Ici, la *mer* est partout. Et la pierre aussi.", "Un seau d'eau de mer, une vague : ce sont tes armes.", "Mais les cabanes en planches, elles, flambent."],
            metro: ["Ici, le béton ne brûle pas. Mais la *fumée* ne s'échappe pas.", "Un *extincteur* chasse l'oxygène. Une lance d'incendie la noie.", "Et surtout : ne lui donne jamais d'*air* en plus."]
          },
          dessin: function (k, t) {
            k.fond();
            k.poly([[450, 160], [250, 520], [650, 520]], null, k.c.or, 5);
            k.flamme(450, 450, 1.8, t);
            var items = k.lieu === "village" ? [["COUVERTURE", k.c.neon], ["LAVOIR", k.c.bleu], ["PIERRE", "#9aa4b5"]] :
              k.lieu === "ile" ? [["SABLE", k.c.neon], ["MER", k.c.bleu], ["ROCHERS", "#9aa4b5"]] : [["EXTINCTEUR", k.c.neon], ["LANCE", k.c.bleu], ["BÉTON", "#9aa4b5"]];
            items.forEach(function (it, i) { k.texte(it[0], 150 + i * 300, 610, { taille: 30, couleur: it[1], alpha: k.prog(t, 0.5 + i * 0.8, 0.6) }); });
            if (k.lieu === "metro" && t > 4) { k.texte("+ AIR = DANGER", 450, 90, { taille: 38, couleur: k.c.rouge, alpha: k.prog(t, 4, 0.6) }); }
          }
        }
      ]
    }
  });
})(typeof window !== "undefined" ? window : globalThis);
