/* Dje_zombie — Saison 1 — LE ROUILLÉ.
   Règles : lent, très fort, il grince à chaque pas (on l'entend venir).
   Point faible : l'eau le fait rouiller sur place. L'huile le dégrippe… et le protège de l'eau. */
(function (root) {
  "use strict";
  var DJE = root.DJE;

  DJE.histoire("rouille", {
    scenes: {
      n1: {
        nuit: 1, vue: "large",
        l: {
          village: ["Silence.", "Puis un bruit de *ferraille*, au bout de la ruelle.[[grince]]", "Un pas. Un grincement. Un pas. Un grincement.", "Quelque chose approche. *Très* lentement."],
          ile: ["Le vent. Le ressac.", "Et dessous, un bruit de *ferraille*.[[grince]]", "Un pas. Un grincement. Sur les galets.", "Quelque chose approche. *Très* lentement."],
          metro: ["Silence. Puis, quelque part, un bruit de *ferraille*.[[grince]]", "Un pas. Un grincement. Qui rebondit sur les murs carrelés.", "D'où ça vient ? Impossible à dire."]
        },
        choix: [
          { t: "Regarder qui c'est", go: "n1_voir" },
          { t: "Braquer ta lampe vers le bruit", need: "lampe", fx: { visi: 2 }, go: "n1_lampe" },
          { t: "Te cacher dans {abri}", go: "n1_cache" }
        ]
      },
      n1_voir: {
        vue: "decouvert", acteurs: [{ q: "zombie", a: "decouvert" }],
        l: ["Il sort de l'ombre. Un corps couleur de *rouille*.", "Les genoux raides. Les coudes bloqués.", "Chaque pas lui coûte. Chaque pas *grince*.[[grince]]", "Il est lent. Mais il ne s'arrête jamais."],
        indice: { id: "grince", t: "Il grince à chaque pas : tant que tu l'entends, tu sais où il est." },
        choix: [
          { t: "Le contourner de loin", fx: { bruit: 10 }, go: "n1_contourne" },
          { t: "L'attaquer pendant qu'il est lent", fx: { bruit: 25 }, go: "n1_attaque" },
          { t: "Rester immobile et l'écouter", calme: true, go: "n1_ecoute" }
        ]
      },
      n1_lampe: {
        vue: "decouvert", fx: ["faisceau"], acteurs: [{ q: "zombie", a: "decouvert" }], on: { peur: 15 },
        l: ["Ton faisceau tombe sur lui. Un corps couleur de *rouille*.", "Il tourne la tête vers la lumière. Lentement. Avec un grincement.[[grince]]", "Puis il vient vers toi. Pas après pas."],
        indice: { id: "grince", t: "Il grince à chaque pas : tant que tu l'entends, tu sais où il est." },
        choix: [
          { t: "Éteindre et le contourner de loin", fx: { visi: 0 }, go: "n1_contourne" },
          { t: "L'attaquer pendant qu'il est lent", fx: { bruit: 25 }, go: "n1_attaque" },
          { t: "Te cacher dans {abri}", fx: { visi: 0 }, go: "n1_cache" }
        ]
      },
      n1_attaque: {
        vue: "proche", fx: ["danger"], acteurs: [{ q: "zombie", a: "proche" }], on: { peur: 25 },
        l: ["Tu fonces. Tu le frappes de toutes tes forces.[[metal]]", "Il ne recule même pas. C'est comme taper dans un *poteau*.", "Sa main se referme sur ton bras. Un étau de fer.", "Tu t'arraches. Ta manche reste dans sa main."],
        indice: { id: "force", t: "Lent, oui. Mais sa *force* est énorme : ne te laisse jamais attraper." },
        next: "n1_fin"
      },
      n1_contourne: {
        vue: "passage", acteurs: [{ q: "joueur", a: "passage", pose: "cache" }],
        l: ["Tu fais un grand détour. Tu le gardes à l'oreille.", "Grincement à gauche. Grincement plus loin.[[grince]]", "Tant que tu l'entends, tu sais exactement où il est."],
        next: "n1_fin"
      },
      n1_ecoute: {
        vue: "decouvert", acteurs: [{ q: "zombie", a: "fond" }],
        l: ["Tu ne bouges plus. Tu écoutes.", "Grincement. Grincement.[[grince]]", "Puis… plus rien.", "Il s'est arrêté. Il *écoute*, lui aussi. Longtemps.", "Puis ça reprend. Il s'éloigne."],
        indice: { id: "silence", t: "Quand le grincement s'arrête, il est *immobile*… et il écoute." },
        next: "n1_fin"
      },
      n1_cache: {
        vue: "abri", acteurs: [{ q: "joueur", a: "abri", pose: "cache" }],
        l: ["Tu te glisses dans {abri}. Tu tends l'oreille.", "Le grincement passe tout près…[[grince]]", "…s'arrête…", "…et repart. Il ne t'a pas trouvé."],
        indice: { id: "silence", t: "Quand le grincement s'arrête, il est *immobile*… et il écoute." },
        next: "n1_fin"
      },
      n1_fin: {
        vue: { village: "passage", ile: "eau", metro: "eau" }, fx: { village: ["pluie"] }, decor: { village: ["pluie"] }, acteurs: [{ q: "zombie", a: "fond" }],
        l: {
          village: ["Vers minuit, le ciel se couvre.", "Une goutte. Puis dix. La *pluie*.[[pluie]]", "Dans la ruelle, le grincement devient plus aigu. Plus lent.", "Comme si chaque pas lui faisait mal."],
          ile: ["Le vent forcit. Les *embruns* fouettent toute l'île.[[vague]]", "Le grincement devient plus aigu. Plus lent.", "Comme si chaque pas lui faisait mal."],
          metro: ["Au fond du tunnel, de l'eau ruisselle. Une *flaque* s'élargit sur les voies.[[goutte]]", "Le grincement traverse l'eau… et devient plus aigu. Plus lent.", "Comme si chaque pas lui faisait mal."]
        },
        indice: { id: "eau", t: "Mouillé, il *ralentit* : l'eau le fait rouiller sur place." },
        next: "aube1"
      },

      /* ── NUIT 2 ── */
      n2: {
        nuit: 2, vue: "large",
        l: {
          village: ["Deuxième nuit. La pluie a cessé.", "Tu dois traverser le village jusqu'à l'*église*, d'où part le sentier du col.", "Quelque part, il grince.[[grince]]"],
          ile: ["Deuxième nuit.", "Il faut rejoindre le *phare* : c'est lui qu'il faudra rallumer.", "Quelque part sur la lande, il grince.[[grince]]"],
          metro: ["Deuxième nuit.", "Tu dois atteindre le *local technique*, au bout du quai.", "Quelque part, il grince. Et l'écho le répète partout.[[grince]]"]
        },
        choix: [
          { t: "Avancer en te guidant à son grincement", calme: true, go: "n2_guide" },
          { t: "Courir sans t'arrêter", fx: { bruit: 25 }, go: "n2_course" },
          { t: "Passer par {passage}", go: "n2_passage" }
        ]
      },
      n2_guide: {
        vue: "passage", branche: [{ c: { lieu: "metro" }, go: "n2_echo" }], acteurs: [{ q: "zombie", a: "fond" }],
        l: ["Tu avances au rythme de ses pas.", "Grincement : tu bouges. Silence : tu t'arrêtes.[[grince]]", "Tu sais toujours où il est. Tu passes derrière lui."],
        next: "n2_science"
      },
      n2_echo: {
        vue: "passage", fx: ["danger"],
        l: ["Tu avances au rythme du grincement.[[grince]]", "Il vient de devant. Non… de derrière. Les murs le *renvoient* dans tous les sens.", "Et soudain, le grincement s'arrête. *Juste à côté* de toi."],
        indice: { id: "echo", t: "Ici, l'*écho* brouille son grincement : tu ne sais plus d'où il vient." },
        next: "n2_face"
      },
      n2_course: {
        vue: "decouvert", acteurs: [{ q: "joueur", a: "decouvert", pose: "court" }, { q: "zombie", a: "fond" }],
        l: ["Tu cours.[[pas:course]]", "Tu le dépasses avant qu'il ait fini de tourner la tête.", "Lent. Vraiment lent."],
        next: "n2_science"
      },
      n2_passage: {
        vue: "proche", fx: ["danger"], acteurs: [{ q: "zombie", a: "proche" }],
        l: {
          village: ["Tu prends les ruelles en escaliers. Étroites. Glissantes de pluie.", "Au détour d'une marche, il est là. *Face à toi*.[[grince]]"],
          ile: ["Tu longes les murets. Dans le noir, tu ne vois rien.", "Au bout du muret, il est là. *Face à toi*.[[grince]]"],
          metro: ["Tu descends sur les voies, sous le quai.", "Au milieu des rails, il est là. *Face à toi*.[[grince]]"]
        },
        next: "n2_face"
      },
      n2_face: {
        vue: "proche", fx: ["danger"], acteurs: [{ q: "zombie", a: "proche" }], on: { peur: 20 },
        l: ["Il lève les bras. Ses doigts de fer s'ouvrent.", "Tu as deux secondes. Peut-être trois."],
        choix: {
          village: [
            { t: "Lui vider ta gourde dessus", need: "gourde", fx: { perd: "gourde" }, go: "n2_eau" },
            { t: "L'attirer jusqu'au lavoir", go: "n2_lavoir" },
            { t: "Reculer et fuir", fx: { bruit: 20 }, go: "n2_fuite" }
          ],
          ile: [
            { t: "Lui jeter ton seau d'eau de mer", need: "seau", go: "n2_eau" },
            { t: "L'attirer dans les vagues", go: "n2_lavoir" },
            { t: "Reculer et fuir", fx: { bruit: 20 }, go: "n2_fuite" }
          ],
          metro: [
            { t: "Lui vider ta bouteille d'eau dessus", need: "gourde", fx: { perd: "gourde" }, go: "n2_eau" },
            { t: "L'attirer dans la grande flaque", go: "n2_lavoir" },
            { t: "Reculer et fuir", fx: { bruit: 20 }, go: "n2_fuite" }
          ]
        }
      },
      n2_eau: {
        vue: "proche", acteurs: [{ q: "zombie", a: "proche" }],
        l: ["L'eau l'éclabousse en plein sur les épaules.[[eau]]", "Un grincement terrible. Ses coudes se figent à mi-chemin.", "Il se *bloque*. Des secondes entières.", "Tu passes sous son bras."],
        indice: { id: "eau", t: "Mouillé, il *ralentit* : l'eau le fait rouiller sur place." },
        next: "n2_science"
      },
      n2_lavoir: {
        vue: "eau", acteurs: [{ q: "zombie", a: "eau" }],
        l: {
          village: ["Tu cours vers le lavoir. Il suit, pas après pas.[[grince]]", "Tu sautes par-dessus le bassin. Lui marche *dedans*.[[eau]]", "L'eau jusqu'aux genoux. Ses genoux de fer.", "Il ralentit… ralentit… et s'arrête, figé dans le bassin."],
          ile: ["Tu cours vers la grève. Il suit.[[grince]]", "Une vague arrive. Tu sautes. Lui la prend de plein fouet.[[vague]]", "Le *sel* lui ronge les genoux. Il ralentit…", "…et s'arrête, figé dans l'écume."],
          metro: ["Tu cours vers la grande flaque, entre les rails. Il suit.[[grince]]", "Tu l'enjambes. Lui marche *dedans*.[[eau]]", "Ses chevilles se grippent. Il ralentit…", "…et s'arrête, figé dans l'eau noire."]
        },
        indice: { id: "eau", t: "Mouillé, il *ralentit* : l'eau le fait rouiller sur place." },
        next: "n2_science"
      },
      n2_fuite: {
        vue: "passage", acteurs: [{ q: "joueur", a: "passage", pose: "court" }], on: { peur: 10, set: "traque" },
        l: ["Tu recules. Tu cours.[[pas:course]]", "Il te suit. Lentement. Obstinément.", "Tu le sèmes… mais maintenant, il sait par où tu passes."],
        next: "n2_science"
      },
      n2_science: { type: "science", vue: "large", next: "n2_lieu" },
      n2_lieu: {
        vue: { village: "decouvert", ile: "haut", metro: "fond" }, decor: { metro: ["local"] },
        l: {
          village: ["Dans la vieille *forge*, sur l'établi, une burette d'*huile*.", "De l'huile pour les gonds, les chaînes… les articulations."],
          ile: ["Dans le phare, près du mécanisme, une burette d'*huile*.", "De l'huile pour les engrenages… et pour les articulations."],
          metro: ["Dans le local technique, une burette d'*huile*, pour les aiguillages.", "De l'huile pour tout ce qui grince."]
        },
        indice: { id: "huile", t: "L'*huile* dégrippe le fer. Si lui en trouve, il redevient rapide." },
        choix: [
          { t: "Vider la burette dans le caniveau", fx: { set: "huile_vide" }, go: "n2_vide" },
          { t: "Garder la burette sur toi", fx: { set: "huile_prise" }, go: "n2_fin" },
          { t: "Ne pas y toucher", go: "n2_fin" }
        ]
      },
      n2_vide: {
        vue: "large",
        l: ["Tu vides la burette jusqu'à la dernière goutte.", "Personne n'en profitera."],
        next: "n2_fin"
      },
      n2_fin: {
        vue: "large",
        l: ["Tu attends le jour, l'oreille tendue.", "Grincement. Silence. Grincement.[[grince]]", "Plus qu'*une* nuit."],
        next: "aube2"
      },

      /* ── NUIT 3 ── */
      n3: {
        nuit: 3, vue: "large",
        branche: [{ c: { not: ["huile_vide", "huile_prise"] }, go: "n3_huile" }],
        l: {
          village: ["L'hélicoptère se posera au *col* à l'aube. Il faut monter.", "Le sentier longe le *torrent*. Et il t'attend sur le chemin.[[grince]]"],
          ile: ["Il faut rallumer le phare, puis rejoindre le port par la chaussée.", "Et il rôde au pied du phare.[[grince]]"],
          metro: ["Le train part du terminus à l'aube. Il faut marcher dans le tunnel.", "Et il est dans le tunnel.[[grince]]"]
        },
        choix: [
          { t: { village: "L'attirer dans le torrent glacé", ile: "L'attirer sur la grève, dans les vagues", metro: "L'attirer sous les infiltrations d'eau" }, go: "n3_eau" },
          { t: "Te guider à son grincement et le contourner", calme: true, go: "n3_contourne" },
          { t: "Foncer droit devant", fx: { bruit: 20 }, go: "n3_fonce" },
          { t: "Lui lancer la burette pour le ralentir", si: { flag: "huile_prise" }, go: "n3_huile_lance" }
        ]
      },
      n3_huile: {
        vue: "large", fx: ["danger"], on: { peur: 20 },
        l: {
          village: ["Tu tends l'oreille. Rien.", "Pas un grincement. Il est passé par la *forge*. Il a trouvé la burette.", "Il est *silencieux*, maintenant. Et beaucoup moins lent."],
          ile: ["Tu tends l'oreille. Rien.", "Pas un grincement. Il est passé par le *phare*. Il a trouvé la burette.", "Il est *silencieux*, maintenant. Et beaucoup moins lent."],
          metro: ["Tu tends l'oreille. Rien.", "Pas un grincement. Il est passé par le *local technique*. Il a trouvé la burette.", "Il est *silencieux*, maintenant. Et beaucoup moins lent."]
        },
        indice: { id: "huile", t: "L'*huile* dégrippe le fer. Si lui en trouve, il redevient rapide." },
        choix: [
          { t: "L'attirer dans l'eau quand même", go: "n3_eau_huile" },
          { t: "Te terrer et le laisser passer", calme: true, go: "n3_cache" },
          { t: "Foncer droit devant", go: "n3_fonce_mort" }
        ]
      },
      n3_eau: {
        vue: "eau", acteurs: [{ q: "zombie", a: "eau", pose: "tombe" }],
        l: {
          village: ["Tu fais du bruit. Il vient.[[grince]]", "Tu le guides jusqu'au *torrent*. Tu sautes de pierre en pierre.", "Lui marche dans l'eau glacée.[[cascade]]", "Ses genoux se figent. Puis ses hanches. Puis ses épaules.", "Il reste là, au milieu du courant. Une statue de rouille.[[helico]]"],
          ile: ["Tu fais du bruit. Il vient.[[grince]]", "Tu l'entraînes sur la grève, juste quand la marée monte.", "Les vagues le frappent, encore et encore. Le *sel* le ronge.[[vague]]", "Il se fige, à moitié dans l'écume.", "Tu rallumes le phare et tu cours au port.[[bateau]]"],
          metro: ["Tu fais du bruit. Il vient.[[grince]]", "Tu l'entraînes là où l'eau suinte de la voûte.", "Elle lui coule sur les épaules, dans les coudes, dans les genoux.[[eau]]", "Il se fige entre les rails.", "Tu passes. Le tunnel est à toi.[[train]]"]
        },
        fin: "fige"
      },
      n3_contourne: {
        vue: "passage", branche: [{ c: { lieu: "metro" }, go: "n3_echo" }],
        l: {
          village: ["Tu fermes les yeux. Tu écoutes.", "Grincement à droite. Tu passes à gauche.[[grince]]", "Grincement derrière. Tu accélères.", "Au lever du jour, l'hélicoptère est là.[[helico]]"],
          ile: ["Tu fermes les yeux. Tu écoutes.", "Grincement à droite. Tu passes à gauche.[[grince]]", "Tu allumes le phare. Grincement derrière. Tu accélères.", "Au port, le bateau t'attend.[[bateau]]"]
        },
        fin: "contourne"
      },
      n3_echo: {
        vue: "objectif", fx: ["danger"], acteurs: [{ q: "zombie", a: "objectif" }],
        l: ["Tu fermes les yeux. Tu écoutes.", "Grincement à droite… non, à gauche… Le tunnel renvoie tout.[[grince]]", "Tu avances quand même. Il suffit d'un pas de travers.", "Une main de fer se referme sur ton épaule."],
        fin: "etau"
      },
      n3_fonce: {
        vue: "objectif", branche: [{ c: { flag: "traque" }, go: "n3_fonce_mort" }], acteurs: [{ q: "joueur", a: "objectif", pose: "court" }],
        l: {
          village: ["Tu cours. Droit devant.[[pas:course]]", "Un grincement, sur le côté. Il tourne la tête. Trop lentement.", "Tu es déjà passé.", "Tu ne t'arrêtes qu'en voyant l'hélicoptère.[[helico]]"],
          ile: ["Tu allumes le phare. Puis tu cours, droit devant.[[pas:course]]", "Un grincement, sur le côté. Il tourne la tête. Trop lentement.", "Tu ne t'arrêtes qu'au port.[[bateau]]"],
          metro: ["Tu cours dans le tunnel.[[pas:course]]", "Un grincement, sur le côté. Il tourne la tête. Trop lentement.", "Tu ne t'arrêtes qu'au terminus.[[train]]"]
        },
        fin: "course"
      },
      n3_fonce_mort: {
        vue: "objectif", fx: ["danger"], acteurs: [{ q: "zombie", a: "objectif" }],
        l: ["Tu cours. Droit devant.[[pas:course]]", "Mais il connaît ton chemin. Il t'attend, *immobile*. Sans un bruit.", "Tu ne l'entends pas. Tu le *percutes*.", "Ses doigts de fer se referment."],
        fin: "etau"
      },
      n3_huile_lance: {
        vue: "proche", fx: ["danger"], acteurs: [{ q: "zombie", a: "proche" }],
        l: ["Tu lui lances la burette. Elle s'ouvre sur sa poitrine.", "L'huile coule dans ses coudes, ses genoux, ses doigts.", "Le grincement *disparaît*.", "Et pour la première fois, il *court*."],
        fin: "huile"
      },
      n3_eau_huile: {
        vue: "eau", fx: ["danger"], acteurs: [{ q: "zombie", a: "eau" }],
        l: ["Tu l'attires dans l'eau.[[eau]]", "L'eau perle sur lui… et glisse. Sans rien faire.", "L'*huile* le protège : l'eau ne le touche plus.", "Il sort de l'eau. Bien plus vite que tu ne l'aurais cru."],
        fin: "huile"
      },
      n3_cache: {
        vue: "abri", acteurs: [{ q: "joueur", a: "abri", pose: "cache" }],
        l: {
          village: ["Tu te terres dans la grange. Tu attends.", "Pas de grincement. Rien. Il faut juste… *attendre*.", "Une ombre passe devant la porte. Sans un bruit. Elle continue.", "À l'aube, tu sors. Tu cours au col.[[helico]]"],
          ile: ["Tu te terres dans la cabane du pêcheur. Tu attends.", "Pas de grincement. Rien. Il faut juste… *attendre*.", "Une ombre passe devant la porte. Sans un bruit. Elle continue.", "À l'aube, tu allumes le phare et tu cours au port.[[bateau]]"],
          metro: ["Tu te terres dans la cabine du chef de station. Tu attends.", "Pas de grincement. Rien. Il faut juste… *attendre*.", "Une ombre passe devant la vitre. Sans un bruit. Elle continue.", "Au matin, tu cours jusqu'au terminus.[[train]]"]
        },
        fin: "justesse"
      }
    },

    fins: {
      fige: { type: "survie", parfait: true, titre: "LA STATUE", texte: "Tu l'as attiré dans l'eau : la rouille l'a figé sur place." },
      contourne: { type: "survie", parfait: false, lieux: ["village", "ile"], titre: "À L'OREILLE", texte: "Tu l'as évité en suivant son grincement. Mais tu ne l'as pas arrêté." },
      course: { type: "survie", parfait: false, titre: "LA COURSE", texte: "Il est lent, tu étais rapide. Cette fois, ça a suffi." },
      justesse: { type: "survie", parfait: false, titre: "DE JUSTESSE", texte: "Tu as attendu qu'il passe. Avec l'huile, l'eau ne pouvait plus rien contre lui." },
      etau: {
        type: "mort", titre: "L'ÉTAU",
        cause: "Le Rouillé et ses doigts de fer.",
        pourquoi: { tous: "Il est lent, mais d'une force énorme. Il savait où tu passerais, et il t'a attendu sans bruit.", metro: "Dans les tunnels, l'écho brouille son grincement : tu ne savais plus d'où il venait." },
        conseil: "Mouille-le : la rouille le fige sur place. L'eau est ton arme."
      },
      huile: {
        type: "mort", titre: "L'HUILE",
        cause: "Le Rouillé, dégrippé.",
        pourquoi: "L'huile dégrippe les articulations et protège le fer de l'eau. Tu lui as rendu sa vitesse.",
        conseil: "Vide la burette dès que tu la trouves. Et ne la lui donne jamais."
      }
    },

    science: {
      titre: "LA ROUILLE",
      diapos: [
        {
          l: ["Le fer *rouille* quand il rencontre de l'*eau* et de l'*oxygène*.", "La rouille prend *plus de place* que le fer : elle gonfle et s'effrite…", "…et elle bloque tout ce qui doit tourner."],
          dessin: function (k, t) {
            k.fond();
            var g = k.prog(t, 1.5, 5);
            k.rect(150, 300, 600, 120, "#7d8794");
            k.rect(150, 300 - 30 * g, 600, 30 * g, "#c4622d");
            k.rect(150, 420, 600, 30 * g, "#c4622d");
            for (var i = 0; i < 9; i++) k.cercle(190 + i * 66, 300 + (i % 2) * 120, 8 + 26 * g, "#e07b39", true, 0.85);
            for (var j = 0; j < 5; j++) { var y = ((t * 160 + j * 90) % 260); k.goutte(220 + j * 120, 40 + y, 1); }
            for (var b = 0; b < 4; b++) { var yy = 600 - ((t * 70 + b * 60) % 160); k.cercle(260 + b * 130, yy, 10, k.c.neon, false, 0.7); k.texte("O₂", 260 + b * 130, yy, { taille: 14, couleur: k.c.neon }); }
            k.texte("FER", 450, 360, { taille: 40, couleur: "#1a1f26" });
            if (t > 2) k.texte("EAU + OXYGÈNE → ROUILLE", 450, 520, { taille: 34, couleur: k.c.or, alpha: k.prog(t, 2, 1) });
          }
        },
        {
          l: ["Ce grincement, c'est l'*accroche-glisse*.", "Ça colle… ça lâche… ça colle… des centaines de fois par seconde.", "Comme une craie qui crisse au tableau, ou l'archet d'un *violon*."],
          dessin: function (k, t) {
            k.fond();
            k.axes(90, 330, 760, 230, "temps", "force");
            var pts = [], n = 300, prog = Math.min(1, t / 3);
            for (var i = 0; i <= n * prog; i++) { var x = i / n, ph = (x * 7) % 1; pts.push([90 + x * 760, 330 - (ph < 0.85 ? ph / 0.85 * 200 : (1 - ph) / 0.15 * 200)]); }
            k.ligne(pts, k.c.rouge, 4);
            k.rect(80, 560, 740, 14, "#4a5872");
            var cyc = (t * 1.6) % 1, dx = cyc < 0.8 ? 0 : (cyc - 0.8) / 0.2 * 60;
            var base = 120 + Math.floor(t * 1.6) % 8 * 60 + dx;
            k.rect(base, 490, 110, 70, "#c4622d");
            k.ligne([[60, 525], [base, 525]], "rgba(241,234,216,.7)", 3, 1, [10, 8]);
            k.texte(cyc < 0.8 ? "ÇA COLLE" : "ÇA LÂCHE !", 450, 440, { taille: 36, couleur: cyc < 0.8 ? k.c.blanc : k.c.or });
          }
        },
        {
          l: {
            village: ["Mouille ses articulations… et la rouille les *grippe* sur place.", "Le lavoir, le torrent, la pluie : l'*eau* est ton arme.", "Et surtout, ne lui donne jamais d'*huile*."],
            ile: ["Mouille ses articulations… et la rouille les *grippe* sur place.", "Et le *sel* de la mer accélère la rouille.", "Surtout, ne lui donne jamais d'*huile*."],
            metro: ["Mouille ses articulations… et la rouille les *grippe* sur place.", "Les flaques du tunnel sont ton arme. Mais l'*écho* brouille son grincement.", "Et surtout, ne lui donne jamais d'*huile*."]
          },
          dessin: function (k, t) {
            k.fond();
            var fige = k.prog(t, 1.5, 2.5), ang = (1 - fige) * Math.sin(t * 2.4) * 0.7;
            var cx = 420, cy = 330;
            k.ligne([[180, 330], [cx, cy]], "#7d8794", 34);
            k.ligne([[cx, cy], [cx + 260 * Math.cos(ang), cy + 260 * Math.sin(ang)]], "#7d8794", 34);
            k.cercle(cx, cy, 34, "#5d6672", true);
            k.cercle(cx, cy, 10 + 40 * fige, "#c4622d", true, 0.95);
            for (var j = 0; j < 4; j++) { var y = (t * 180 + j * 70) % 200; k.goutte(cx - 60 + j * 40, 100 + y, 0.9); }
            k.texte(fige > 0.9 ? "GRIPPÉ" : "", cx, 470, { taille: 44, couleur: k.c.or });
            if (t > 4) {
              k.rect(640, 470, 70, 90, "#d9b53a"); k.rect(660, 440, 30, 30, "#b38f22"); k.ligne([[690, 450], [760, 420]], "#b38f22", 6);
              k.croix(675, 515, 1.7, k.c.rouge, k.prog(t, 4, 0.5));
            }
          }
        }
      ]
    }
  });
})(typeof window !== "undefined" ? window : globalThis);
