/* Dje_zombie — Saison 1 — LE SANS-YEUX (légendaire, case JACKPOT).
   Règles : pas d'yeux, deux fossettes ; il voit la chaleur (infrarouge), même dans le noir total.
   Point faible : le verre arrête l'infrarouge ; l'eau glacée et une couverture cachent ta chaleur ; un feu l'éblouit.
   Plus il fait froid autour, plus tu ressors. Dans l'air tiède du métro, tu ressors moins. */
(function (root) {
  "use strict";
  var DJE = root.DJE;

  DJE.histoire("sansyeux", {
    scenes: {
      n1: {
        nuit: 1, vue: "decouvert", acteurs: [{ q: "zombie", a: "decouvert", pose: "regarde" }],
        l: {
          village: ["Silence. Froid. Ton souffle fait de la buée.", "Au bout de la rue, une silhouette rouge sombre tourne la tête…", "…vers *toi*. Pourtant, tu es dans le noir complet.[[thermique]]"],
          ile: ["Le vent glacé de la mer.", "Sur la lande, une silhouette rouge sombre tourne la tête vers *toi*.[[thermique]]", "Tu es dans le noir complet. Et lui n'a pas d'yeux."],
          metro: ["Une chaleur moite. Le métro garde la tiédeur du jour.", "Au bout du quai, une silhouette rouge sombre tourne la tête vers toi.[[thermique]]", "Lentement. Comme s'il hésitait."]
        },
        choix: [
          { t: "Te plaquer dans l'ombre la plus noire", go: "n1_ombre" },
          { t: "Te cacher dans {abri}", go: "n1_abri" },
          { t: "Observer son visage, sans bouger", calme: true, go: "n1_visage" }
        ]
      },
      n1_ombre: {
        vue: "proche", fx: ["danger", "thermique"], acteurs: [{ q: "zombie", a: "proche" }], on: { peur: 25 },
        l: ["Tu te plaques dans le coin le plus noir.", "Il vient *droit* sur toi. Sans hésiter.", "Le noir ne lui fait rien."],
        indice: { id: "noir", t: "Le noir ne te protège pas : il voit ta *chaleur*." },
        choix: [
          { t: "Fuir dans {abri}", go: "n1_abri" },
          { t: "Courir", fx: { bruit: 20 }, go: "n1_course" }
        ]
      },
      n1_abri: {
        vue: "abri", acteurs: [{ q: "joueur", a: "abri", pose: "cache" }],
        l: ["Tu fonces dans {abri}. Tu fermes.", "Dehors, il s'arrête. Il penche la tête. Il *cherche*.", "Les murs l'aveuglent. Mais il y a des fentes…", "Il colle son visage à une fente. Tu te recroquevilles hors de sa vue."],
        indice: { id: "murs", t: "Les murs l'aveuglent : il voit ta chaleur, mais pas à travers la pierre ni le bois." },
        next: "n1_fin"
      },
      n1_course: {
        vue: "abri", fx: ["danger"], acteurs: [{ q: "joueur", a: "abri", pose: "cache" }], on: { peur: 15 },
        l: ["Tu cours.[[pas:course]]", "Il te suit sans hésiter, dans le noir total.", "Tu fonces dans {abri}. Tu claques la porte.[[porte]]", "Il s'arrête devant. Il *cherche* une ouverture."],
        indice: { id: "murs", t: "Les murs l'aveuglent : il voit ta chaleur, mais pas à travers la pierre ni le bois." },
        next: "n1_fin"
      },
      n1_visage: {
        vue: "proche", fx: ["thermique"], acteurs: [{ q: "zombie", a: "proche", pose: "regarde" }],
        l: ["Il n'a pas d'yeux. Juste deux *fossettes*, sous le nez.", "Comme un serpent.", "Il tourne la tête vers un chat qui passe… vers une cheminée encore tiède… vers *toi*.", "Il ne suit pas la lumière. Il suit la *chaleur*."],
        indice: { id: "chaleur", t: "Il ne voit pas la lumière. Il voit la *chaleur*." },
        next: "n1_fin"
      },
      n1_fin: {
        vue: "large", fx: ["thermique"], acteurs: [{ q: "zombie", a: "fond" }],
        l: {
          village: ["Toute la nuit, il rôde.", "Il s'arrête devant chaque cheminée encore tiède. Devant chaque bête endormie.", "Et la nuit de montagne est *glaciale*. Tu es la chose la plus chaude de la vallée."],
          ile: ["Toute la nuit, il rôde sur la lande.", "Il évite la mer. L'eau glacée, pour lui, c'est du *noir*."],
          metro: ["Toute la nuit, il rôde.", "Mais ici, l'air est tiède, les murs aussi. Il hésite. Il cherche.", "Tu te détaches *moins* que dehors."]
        },
        indice: {
          village: { id: "froid", t: "Plus il fait *froid* autour, plus tu brilles pour lui." },
          ile: { id: "eau", t: "L'*eau glacée*, pour lui, c'est du noir." },
          metro: { id: "tiede", t: "Dans l'air *tiède*, tu te détaches moins." }
        },
        next: "aube1"
      },

      /* ── NUIT 2 ── */
      n2: {
        nuit: 2, vue: "large", on: { peur: 10 }, acteurs: [{ q: "zombie", a: "decouvert" }],
        l: {
          village: ["Il gèle.", "Tu dois rejoindre l'église. Il rôde sur la place."],
          ile: ["Il faut atteindre le phare. Il rôde sur la lande."],
          metro: ["Tu dois atteindre le local technique. Il rôde sur le quai."]
        },
        choix: {
          village: [
            { t: "Passer dans le torrent glacé, de l'eau jusqu'aux genoux", go: "n2_eau" },
            { t: "T'envelopper dans ta couverture et avancer", need: "couverture", go: "n2_couv" },
            { t: "Traverser la place dans le noir", go: "n2_noir" }
          ],
          ile: [
            { t: "Passer dans la mer, le long du rivage", go: "n2_eau" },
            { t: "T'envelopper dans la couverture de survie", need: "couvsurvie", go: "n2_couv" },
            { t: "Traverser la lande dans le noir", go: "n2_noir" }
          ],
          metro: [
            { t: "Te glisser derrière la cabine vitrée, puis longer le mur", go: "n2_vitre" },
            { t: "Allumer un feu de papiers au bout du quai", need: "briquet", go: "n2_feu" },
            { t: "Traverser le quai dans le noir", go: "n2_noir" }
          ]
        }
      },
      n2_eau: {
        vue: "eau", acteurs: [{ q: "zombie", a: "fond" }], on: { peur: 10 },
        l: {
          village: ["Tu entres dans le torrent. L'eau glacée te coupe le souffle.[[cascade]]", "Tes jambes deviennent froides. Aussi froides que l'eau.", "Il balaie la rive du regard. Tes jambes ont *disparu* pour lui.", "Tu avances, plié en deux. Tu atteins l'église, gelé."],
          ile: ["Tu entres dans la mer jusqu'à la taille. Le froid te broie les côtes.[[vague]]", "Il balaie le rivage. Tu n'es plus qu'une tache tiède, à demi effacée.", "Tu atteins le phare, transi."]
        },
        indice: { id: "eau", t: "L'*eau glacée*, pour lui, c'est du noir." },
        next: "n2_science"
      },
      n2_couv: {
        vue: "decouvert", acteurs: [{ q: "zombie", a: "fond" }],
        l: {
          village: ["Tu t'enroules dans la couverture de laine. Épaisse. Lourde.", "Ta chaleur reste *dedans*. Dehors, la laine est froide.", "Il regarde de ton côté… hésite… et regarde ailleurs."],
          ile: ["Tu t'enroules dans la couverture de survie, le côté doré vers l'extérieur.", "Elle *renvoie* ta chaleur vers toi. Dehors, plus rien ne passe.", "Il regarde de ton côté. Il ne voit qu'une tache froide."]
        },
        indice: { id: "isole", t: "Une couverture garde ta chaleur *dedans* : il ne te voit plus." },
        next: "n2_science"
      },
      n2_noir: {
        vue: "proche", fx: ["danger", "thermique"], acteurs: [{ q: "zombie", a: "proche" }], on: { peur: 25 },
        l: ["Tu traverses dans le noir.", "Il tourne la tête. Vers toi. *Immédiatement*.", "Le noir ne te cache pas."],
        indice: { id: "noir", t: "Le noir ne te protège pas : il voit ta *chaleur*." },
        choix: {
          village: [
            { t: "Plonger dans le lavoir glacé", go: "n2_plonge" },
            { t: "Courir jusqu'à l'église", go: "n2_course" }
          ],
          ile: [
            { t: "Plonger dans la mer", go: "n2_plonge" },
            { t: "Courir jusqu'au phare", go: "n2_course" }
          ],
          metro: [
            { t: "Plonger derrière la cabine vitrée", go: "n2_vitre" },
            { t: "Courir jusqu'au local", go: "n2_course" }
          ]
        }
      },
      n2_plonge: {
        vue: "eau", acteurs: [{ q: "zombie", a: "fond" }],
        l: {
          village: ["Tu plonges dans le bassin du lavoir. L'eau glacée t'avale.[[eau]]", "Tu restes dessous, le plus longtemps possible.", "Quand tu remontes, il est parti. Il a perdu ta trace."],
          ile: ["Tu plonges dans les vagues. Le froid t'assomme.[[vague]]", "Quand tu remontes, il fixe un autre point du rivage. Il t'a perdu."]
        },
        indice: { id: "eau", t: "L'*eau glacée*, pour lui, c'est du noir." },
        next: "n2_science"
      },
      n2_course: {
        vue: "abri", fx: ["danger"], acteurs: [{ q: "joueur", a: "abri", pose: "cache" }], on: { peur: 25, set: "blesse" },
        l: ["Tu cours.[[pas:course]]", "Il te suit, sans jamais te perdre. Il te rattrape à la porte.", "Ses ongles te lacèrent le dos. Tu claques la porte.[[porte]]", "Tu saignes."],
        next: "n2_science"
      },
      n2_vitre: {
        vue: "abri", acteurs: [{ q: "joueur", a: "abri", pose: "cache" }],
        l: ["Tu te glisses derrière la cabine vitrée. Entre lui et toi : une *vitre*.", "Il te regarde… et ne voit rien. Comme si la vitre était un mur.", "Tu longes la cabine jusqu'au local."],
        indice: { id: "verre", t: "Derrière une *vitre*, il ne te voit plus." },
        next: "n2_science"
      },
      n2_feu: {
        vue: "decouvert", decor: ["feu"], fx: ["braises"], acteurs: [{ q: "zombie", a: "fond" }],
        l: ["Tu enflammes un tas de vieux papiers au bout du quai.[[feu]]", "Il se tourne vers les flammes. Fasciné. *Ébloui*.", "Tu passes dans son dos."],
        indice: { id: "feu", t: "Un feu, plus chaud que toi, l'*éblouit*." },
        next: "n2_science"
      },
      n2_science: { type: "science", vue: "large", next: "n2_lieu" },
      n2_lieu: {
        vue: { village: "haut", ile: "haut", metro: "fond" }, decor: { metro: ["local"] },
        l: {
          village: ["L'église. Les grands *vitraux* laissent passer la lune.", "Le verre laisse passer la lumière… mais arrête l'infrarouge de ta chaleur.", "Dans la sacristie, un vieux poêle à bois."],
          ile: ["Le phare. En haut, la *lanterne* : une cage de verre.", "Derrière le verre, ta chaleur ne passe plus."],
          metro: ["Le local technique. Un poêle à gaz de chantier, avec sa bouteille.", "Et en face, la *cabine vitrée* du chef de station."]
        },
        choix: {
          village: [
            { t: "Préparer le poêle de la sacristie", need: "allumettes", fx: { set: "poele" }, go: "n2_fin" },
            { t: "Repérer le chemin du torrent jusqu'au col", go: "n2_fin" },
            { t: "Attendre le jour derrière un vitrail", go: "n2_fin" }
          ],
          ile: [
            { t: "Dormir dans la lanterne vitrée", go: "n2_fin" },
            { t: "Attendre le jour au pied du phare", go: "n2_fin" }
          ],
          metro: [
            { t: "Préparer le poêle à gaz pour faire diversion", need: "briquet", fx: { set: "poele" }, go: "n2_fin" },
            { t: "Attendre le matin dans le local", go: "n2_fin" }
          ]
        }
      },
      n2_fin: {
        vue: "large",
        l: ["Tu attends le jour. Tes mains ne se réchauffent pas.", "Plus qu'*une* nuit."],
        next: "aube2"
      },

      /* ── NUIT 3 ── */
      n3: {
        nuit: 3, vue: "large", on: { peur: 10 }, acteurs: [{ q: "zombie", a: "decouvert" }],
        l: {
          village: ["Il gèle à pierre fendre.", "L'hélicoptère se posera au *col*. Le sentier longe le torrent.", "Il rôde entre toi et le sentier."],
          ile: ["Rallumer le phare. Puis rejoindre le port par la chaussée.", "Il rôde près du phare."],
          metro: ["Le terminus est au bout du tunnel.", "Il rôde dans le tunnel."]
        },
        choix: {
          village: [
            { t: "Allumer le poêle pour l'attirer, puis filer", req: { flag: "poele" }, pourquoi: "Le poêle n'est pas prêt.", go: "n3_feu" },
            { t: "Monter dans le lit du torrent glacé", go: "n3_torrent" },
            { t: "T'envelopper dans ta couverture et monter", need: "couverture", go: "n3_couv" },
            { t: "Monter dans le noir, en silence", go: "n3_noir" }
          ],
          ile: [
            { t: "Allumer le phare, puis descendre sous ta couverture de survie", need: "couvsurvie", go: "n3_couv" },
            { t: "Tirer ta fusée au loin pour l'éblouir", need: "fusee", go: "n3_fusee" },
            { t: "Allumer le phare, puis longer le rivage dans l'eau glacée", go: "n3_mer" },
            { t: "Traverser la lande dans le noir", go: "n3_noir" }
          ],
          metro: [
            { t: "Allumer le poêle à gaz au bout du quai, puis filer", req: { flag: "poele" }, pourquoi: "Le poêle n'est pas prêt.", go: "n3_feu" },
            { t: "Te cacher dans la cabine vitrée jusqu'au matin", go: "n3_cabine" },
            { t: "Traverser le tunnel dans le noir", go: "n3_noir" },
            { t: "Te tremper dans les flaques pour te refroidir", go: "n3_flaques" }
          ]
        }
      },
      n3_feu: {
        vue: "large", decor: ["feu"], fx: ["braises"], acteurs: [{ q: "zombie", a: "fond" }],
        l: {
          village: ["Tu allumes le poêle de la sacristie. Le tuyau se met à rougir.[[feu]]", "Il se tourne vers l'église. Vers cette chose *brûlante*.", "Il ne voit plus que ça.", "Toi, tu remontes le sentier, dans son dos.[[helico]]"],
          metro: ["Tu allumes le poêle à gaz. Une flamme bleue, rugissante.[[feu]]", "Il se tourne vers la chaleur. *Ébloui*.", "Toi, tu files dans le tunnel.[[train]]"]
        },
        fin: "eblouie"
      },
      n3_fusee: {
        vue: "large", decor: ["phare"], acteurs: [{ q: "zombie", a: "fond" }],
        l: ["Tu tires ta fusée vers la pointe de l'île. Une boule rouge, *brûlante*.[[fusee]]", "Il se tourne vers elle. Ébloui. Il court après.", "Tu allumes le phare et tu cours au port.[[bateau]]"],
        fin: "eblouie"
      },
      n3_torrent: {
        vue: "eau", branche: [{ c: { flag: "blesse" }, go: "n3_sang" }], acteurs: [{ q: "zombie", a: "fond" }],
        l: ["Tu descends dans le torrent. L'eau glacée jusqu'à la taille.[[cascade]]", "Tu remontes le courant. Ton corps refroidit. Tu deviens *froid*, comme l'eau.", "Il balaie la vallée. Il ne voit qu'un torrent noir.", "Au col, tu sors de l'eau, bleu de froid. L'hélicoptère est là.[[helico]]"],
        fin: "froid"
      },
      n3_mer: {
        vue: "eau", decor: ["phare"], branche: [{ c: { flag: "blesse" }, go: "n3_sang" }], acteurs: [{ q: "zombie", a: "fond" }],
        l: ["Tu allumes le phare, puis tu descends sur la grève.[[phare]]", "Tu longes le rivage, dans l'eau glacée jusqu'à la taille.[[vague]]", "Ton corps refroidit. Tu deviens froid comme la mer.", "Il balaie la côte. Il ne voit rien. Le bateau t'attend.[[bateau]]"],
        fin: "froid"
      },
      n3_couv: {
        vue: "objectif", branche: [{ c: { flag: "blesse" }, go: "n3_sang" }], acteurs: [{ q: "zombie", a: "fond" }],
        l: {
          village: ["Tu t'enroules dans ta couverture de laine. Ta chaleur reste dedans.", "Tu montes le sentier, lentement.", "Il regarde vers toi. Il ne voit qu'une forme froide, comme un rocher.", "Au col, tu laisses tomber la couverture. L'hélicoptère.[[helico]]"],
          ile: ["Tu allumes le phare depuis la lanterne vitrée.[[phare]]", "Puis tu t'enroules dans la couverture de survie, côté doré dehors.", "Tu descends, tu traverses la lande. Il ne voit qu'une tache froide.", "Le bateau t'attend.[[bateau]]"]
        },
        fin: "isole"
      },
      n3_cabine: {
        vue: "abri", fx: ["thermique"], acteurs: [{ q: "joueur", a: "abri", pose: "cache" }],
        l: ["Tu t'enfermes dans la cabine vitrée. Tu te couches sous le bureau.", "Il arrive. Il colle son visage à la vitre.[[thermique]]", "Il ne voit rien. Le verre arrête ta chaleur.", "Au matin, il s'éloigne vers l'autre tunnel. Tu cours au terminus.[[train]]"],
        fin: "verre"
      },
      n3_noir: {
        vue: "objectif", branche: [{ c: { lieu: "metro" }, go: "n3_noir_metro" }], fx: ["thermique", "danger"], acteurs: [{ q: "zombie", a: "objectif" }],
        l: ["Tu avances dans le noir complet.", "Pour toi, il fait nuit. Pour lui, tu es une *lanterne*.[[thermique]]", "Il tourne la tête. Vers toi. Il court."],
        fin: "lanterne"
      },
      n3_noir_metro: {
        vue: "objectif", branche: [{ c: { flag: "blesse" }, go: "n3_sang" }], acteurs: [{ q: "zombie", a: "fond" }],
        l: ["Tu avances dans le tunnel tiède, dans le noir.", "Les murs sont tièdes. L'air est tiède. Tu te fonds dans la chaleur du tunnel.", "Il hésite. Il tourne la tête… et regarde ailleurs.", "Tu arrives au terminus, le cœur au bord des lèvres.[[train]]"],
        fin: "tiede"
      },
      n3_flaques: {
        vue: "eau", fx: ["thermique", "danger"], acteurs: [{ q: "zombie", a: "eau" }],
        l: ["Tu te jettes dans une flaque, entre les rails.[[eau]]", "L'eau est *tiède*, comme tout le reste ici.", "Tu es trempé… et toujours aussi chaud.", "Il arrive."],
        fin: "lanterne"
      },
      n3_sang: {
        vue: "objectif", fx: ["thermique", "danger"], acteurs: [{ q: "zombie", a: "objectif" }],
        l: ["Tu avances… mais ta blessure saigne encore.", "Chaque goutte qui tombe est *chaude*. Une traînée lumineuse, pour lui.", "Il suit la piste. Il te trouve."],
        fin: "sang"
      }
    },

    fins: {
      eblouie: { type: "survie", parfait: true, titre: "L'ÉBLOUISSEMENT", texte: "Un feu plus chaud que toi : il ne voyait plus que lui." },
      froid: { type: "survie", parfait: true, lieux: ["village", "ile"], titre: "LE FROID", texte: "L'eau glacée a éteint ta chaleur. Tu étais aussi froid que l'eau." },
      isole: { type: "survie", parfait: true, lieux: ["village", "ile"], titre: "LA COUVERTURE", texte: "Ta chaleur restait dedans. Pour lui, tu n'étais qu'un rocher froid." },
      verre: { type: "survie", parfait: true, lieux: ["metro"], titre: "LA VITRE", texte: "Le verre laisse passer la lumière, pas l'infrarouge. Derrière, tu étais invisible." },
      tiede: { type: "survie", parfait: false, lieux: ["metro"], titre: "LA TIÉDEUR", texte: "Dans l'air tiède du métro, tu te détachais moins. De justesse." },
      lanterne: {
        type: "mort", titre: "LA LANTERNE",
        cause: "Le Sans-Yeux.",
        pourquoi: { tous: "Le noir ne te cachait pas : il voit ta chaleur. Dans la nuit froide, tu brillais comme une lanterne.", metro: "L'eau tiède ne t'a pas refroidi. Tu brillais toujours pour lui." },
        conseil: "Cache ta chaleur : eau glacée, couverture, vitre. Ou éblouis-le avec un feu."
      },
      sang: {
        type: "mort", titre: "LA PISTE",
        cause: "Le Sans-Yeux, sur ta piste.",
        pourquoi: "Ton sang est chaud. Chaque goutte laissait une trace lumineuse pour lui.",
        conseil: "Ne te laisse pas blesser : ne cours jamais à découvert devant lui."
      }
    },

    science: {
      titre: "LA VISION INFRAROUGE",
      diapos: [
        {
          l: ["Tout ce qui est chaud *brille*, dans une lumière invisible pour nous : l'*infrarouge*.", "Toi, à 37 °C, tu es une *lanterne*.", "Et plus il fait froid autour, plus tu ressors."],
          dessin: function (k, t) {
            var ctx = k.ctx;
            k.fond();
            k.rect(0, 0, 900, 700, "#0a1430");
            var g = ctx.createRadialGradient(450, 330, 10, 450, 330, 230);
            var pulse = 0.85 + 0.15 * Math.sin(t * 3);
            g.addColorStop(0, "rgba(255,240,120," + pulse + ")"); g.addColorStop(0.35, "rgba(255,120,40,.8)"); g.addColorStop(1, "rgba(120,0,60,0)");
            ctx.fillStyle = g; ctx.fillRect(200, 80, 500, 520);
            k.bonhomme(450, 520, 4, "rgba(255,250,220,.9)");
            k.texte("37 °C", 450, 620, { taille: 40, couleur: k.c.or });
            k.texte("−5 °C", 140, 120, { taille: 34, couleur: "#6f9cff" });
          }
        },
        {
          l: ["Les crotales ont deux *fossettes* sur le museau, entre l'œil et la narine.", "Elles captent la chaleur d'une proie, même dans le *noir* total."],
          dessin: function (k, t) {
            k.fond();
            k.poly([[100, 380], [420, 300], [520, 330], [540, 380], [420, 420], [100, 430]], "#7a6a3a");
            k.cercle(470, 335, 8, "#1a1206", true);
            k.cercle(515, 360, 9, k.c.or, true, 0.6 + 0.4 * Math.sin(t * 6));
            k.texte("fossette", 515, 440, { taille: 26, couleur: k.c.or });
            var mx = 780, my = 360;
            k.cercle(mx, my, 26, "#ff7a3a", true); k.cercle(mx - 18, my - 18, 10, "#ff7a3a", true);
            var c = (t * 0.8) % 1;
            for (var i = 0; i < 3; i++) { var q = (c + i / 3) % 1; k.arc(mx, my, 30 + q * 230, Math.PI * 0.85, Math.PI * 1.15, k.c.rouge, 1 - q, 5); }
          }
        },
        {
          l: {
            village: ["Mais le *verre* arrête cet infrarouge-là : derrière une vitre, tu disparais.", "L'*eau glacée* éteint ta chaleur. Une couverture la garde *dedans*.", "Et un feu, plus chaud que toi, l'*éblouit*."],
            ile: ["Mais le *verre* arrête cet infrarouge-là. La lanterne du phare est une cage de verre.", "La *couverture de survie* renvoie ta chaleur. La mer glacée l'éteint.", "Et une *fusée*, plus chaude que toi, l'éblouit."],
            metro: ["Mais le *verre* arrête cet infrarouge-là : pense à la *cabine vitrée*.", "Ici, tout est tiède : tu te détaches moins… tant que tu ne saignes pas.", "Et un feu, plus chaud que toi, l'*éblouit*."]
          },
          dessin: function (k, t) {
            k.fond();
            k.rect(430, 120, 24, 460, "rgba(170,210,240,.35)");
            k.texte("VERRE", 442, 90, { taille: 30, couleur: "#aad2f0" });
            k.bonhomme(720, 520, 3, k.c.blanc);
            var p = (t * 0.5) % 1;
            k.ligne([[60, 240], [60 + 780 * p, 240]], "#fff3c0", 5, 0.9);
            k.texte("lumière : passe", 220, 205, { taille: 26, couleur: "#fff3c0", gras: false });
            var q = Math.min(p * 780, 640);
            k.ligne([[690, 420], [690 - q, 420]], k.c.rouge, 6, 0.9);
            if (690 - q <= 460) k.croix(470, 420, 1.2, k.c.rouge);
            k.texte("chaleur : bloquée", 220, 470, { taille: 26, couleur: k.c.rouge, gras: false });
          }
        }
      ]
    }
  });
})(typeof window !== "undefined" ? window : globalThis);
