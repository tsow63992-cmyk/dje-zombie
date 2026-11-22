/* Dje_zombie — Saison 1 — LE SIFFLEUR (partie modèle).
   Règles du zombie :
   - il ne se bat jamais : il repère, puis il siffle, et toutes les ombres marchent vers le sifflement ;
   - il ne siffle sur toi que s'il te voit (lumière, terrain à découvert) ;
   - son sifflement est un son pur : un son plus fort sur la même fréquence le noie ;
   - il est fragile (FORCE 1) : on peut le faire taire si on l'approche sans être vu. */
(function (root) {
  "use strict";
  var DJE = root.DJE;

  DJE.histoire("siffleur", {
    scenes: {
      /* ───────────── NUIT 1 ───────────── */
      n1: {
        nuit: 1, vue: "large", l: {
          village: ["Silence.", "Le vent descend des sommets.", "Puis, très loin, un *sifflement*.[[siffle:loin]]", "Long. Aigu. Il traverse toute la *vallée*."],
          ile: ["Silence. Juste le *ressac* contre les rochers.", "Puis un *sifflement* passe au-dessus de la lande.[[siffle:loin]]", "Long. Aigu. Le vent ne le couvre même pas."],
          metro: ["Silence. Une goutte tombe, quelque part.", "Puis, au fond du tunnel, un *sifflement*.[[siffle:tunnel]]", "Long. Aigu. Il roule de mur en mur."]
        },
        choix: [
          { t: "Regarder d'où ça vient", go: "n1_regard" },
          { t: "Allumer ta lampe pour mieux voir", need: "lampe", fx: { visi: 2 }, go: "n1_lampe" },
          { t: "Te cacher tout de suite dans {abri}", go: "n1_cache" }
        ]
      },
      n1_regard: {
        vue: "loin", acteurs: [{ q: "zombie", a: "loin", pose: "siffle", ondes: 1 }, { q: "horde", a: "fond" }],
        on: { peur: 15 },
        l: {
          village: ["Sur la crête d'en face, une silhouette *maigre*.", "Deux doigts dans la bouche.", "Elle ne court pas. Elle ne cherche pas. Elle *siffle*.[[siffle]]", "Partout dans la vallée, des *ombres* se lèvent.[[pas:loin]]", "Elles marchent vers *lui*."],
          ile: ["Sur la pointe de la falaise, une silhouette *maigre*.", "Deux doigts dans la bouche. Elle *siffle*.[[siffle]]", "Des cabanes sortent trois… quatre *ombres*.[[pas:loin]]", "Elles marchent vers *lui*."],
          metro: ["Au bout du quai, sous la dernière lampe de secours, une silhouette *maigre*.", "Deux doigts dans la bouche. Elle *siffle*.[[siffle:tunnel]]", "Dans le tunnel, des *pas*. Des dizaines.[[pas:loin]]", "Ils marchent vers *lui*."]
        },
        indice: { id: "appel", t: "Les autres marchent vers le *sifflement*, pas vers toi." },
        choix: [
          { t: "Rester immobile et l'observer", calme: true, go: "n1_observe" },
          { t: "Reculer et te cacher dans {abri}", go: "n1_cache" },
          { t: "Courir te mettre à l'abri, loin de lui", fx: { bruit: 30 }, go: "n1_course" }
        ]
      },
      n1_lampe: {
        vue: "loin", fx: ["faisceau"], acteurs: [{ q: "zombie", a: "loin", pose: "regarde" }],
        on: { peur: 20 },
        l: ["Ton faisceau balaie {nuit}.", "Là-bas, vers {loin}, une silhouette *maigre*. Immobile.", "Elle te *regarde*.", "Elle met deux doigts dans sa bouche."],
        next: "n1_repere"
      },
      n1_repere: {
        vue: "loin", fx: ["faisceau", "danger"], acteurs: [{ q: "zombie", a: "loin", pose: "siffle", ondes: 2 }, { q: "horde", a: "fond" }],
        on: { peur: 20, set: "repere" },
        l: ["Le sifflement change.[[siffle:court]]", "Plus court. Répété. Comme un *doigt pointé* sur toi.", "Toutes les ombres tournent la tête vers *toi*.[[coeur]]"],
        indice: { id: "voir", t: "Il ne siffle sur toi que quand il te *voit*." },
        choix: [
          { t: "Éteindre et courir te cacher", fx: { visi: 0, bruit: 25 }, go: "n1_fuite" },
          { t: "Éteindre et ne plus bouger du tout", calme: true, fx: { visi: 0 }, go: "n1_noir" }
        ]
      },
      n1_noir: {
        vue: "loin", fx: ["noir"], acteurs: [{ q: "zombie", a: "loin", pose: "regarde" }],
        l: ["Noir complet.", "Tu ne bouges plus. Tu respires à peine.", "Le sifflement hésite… s'arrête… reprend, plus loin.[[siffle:loin]]", "Il ne te voit plus. Il ne sait plus où *pointer*."],
        next: "n1_fin"
      },
      n1_fuite: {
        vue: "passage", acteurs: [{ q: "joueur", a: "passage", pose: "court" }, { q: "horde", a: "fond" }],
        on: { peur: 15 },
        l: ["Tu éteins. Tu cours.[[pas:course]]", "Le sifflement te suit, encore et encore.[[siffle:court]]", "Tu plonges dans {abri}.", "Des pas, dehors. Tout près.[[pas]]", "Puis ils s'éloignent… vers le sifflement."],
        next: "n1_fin"
      },
      n1_observe: {
        vue: "loin", acteurs: [{ q: "zombie", a: "loin", pose: "regarde" }],
        l: ["Tu ne bouges plus. Tu le *regardes*.", "Il siffle. S'arrête. Tourne lentement la tête.[[siffle]]", "Il *cherche*. Pas avec les oreilles…", "…avec les *yeux*."],
        indice: { id: "voir", t: "Il ne siffle sur toi que quand il te *voit*." },
        next: "n1_fin"
      },
      n1_cache: {
        vue: "abri", acteurs: [{ q: "joueur", a: "abri", pose: "cache" }],
        l: {
          village: ["Tu te glisses dans la *grange*.", "Ça sent le foin et la poussière. Tu retiens ton souffle.", "Dehors, des *pas*. Beaucoup de pas.[[pas]]", "Ils passent sans s'arrêter. Ils ne te cherchent pas.", "Ils vont vers le *sifflement*."],
          ile: ["Tu te glisses dans la cabane du pêcheur.", "Ça sent le sel et le goudron. Tu retiens ton souffle.", "Dehors, des *pas* dans l'herbe mouillée.[[pas]]", "Ils passent sans s'arrêter. Ils ne te cherchent pas.", "Ils vont vers le *sifflement*."],
          metro: ["Tu te glisses dans la cabine du chef de station.", "Derrière la vitre sale, le quai. Tu retiens ton souffle.", "Sur le carrelage, des *pas*. Beaucoup de pas.[[pas]]", "Ils passent sans s'arrêter. Ils ne te cherchent pas.", "Ils vont vers le *sifflement*."]
        },
        indice: { id: "appel", t: "Les autres marchent vers le *sifflement*, pas vers toi." },
        next: "n1_fin"
      },
      n1_course: {
        vue: "decouvert", acteurs: [{ q: "joueur", a: "decouvert", pose: "court" }, { q: "horde", a: "fond" }],
        on: { peur: 15 },
        l: ["Tu cours. Tes pas claquent sur {sol}.[[pas:course]]", "Une ombre, devant toi, se retourne.", "Elle te regarde… puis repart. Vers le *sifflement*.", "Tu t'enfermes dans {abri}, le cœur en vrac.[[coeur]]"],
        indice: { id: "appel", t: "Les autres marchent vers le *sifflement*, pas vers toi." },
        next: "n1_fin"
      },
      n1_fin: {
        vue: "haut", fx: ["danger"], acteurs: [{ q: "horde", a: "bas" }],
        l: {
          village: ["Le sifflement s'*arrête*.", "Silence.", "Puis il *reprend*. Plus près. Juste sous le *clocher*.[[siffle:pres]]", "Dans les ruelles, des dizaines de *pas*.[[pas]]", "Tu ne fermes pas l'œil jusqu'à l'aube."],
          ile: ["Le sifflement s'*arrête*.", "Silence.", "Puis il *reprend*. Plus près. Juste au pied du *phare*.[[siffle:pres]]", "Sur la lande, des dizaines de *pas*.[[pas]]", "Tu ne fermes pas l'œil jusqu'à l'aube."],
          metro: ["Le sifflement s'*arrête*.", "Silence.", "Puis il *reprend*. Plus près. Juste sous la *passerelle*.[[siffle:pres]]", "Sur les rails, des dizaines de *pas*.[[pas]]", "Tu ne fermes pas l'œil jusqu'au matin."]
        },
        next: "aube1"
      },

      /* ───────────── NUIT 2 ───────────── */
      n2: {
        nuit: 2, vue: "large", l: {
          village: ["La nuit retombe sur la vallée.", "D'ici, tu vois l'*église*. Juste derrière, le sentier du col.", "Il faut te rapprocher. Traverser le village."],
          ile: ["La nuit retombe sur l'île.", "Le *phare* est à l'autre bout de la lande.", "Demain, il faudra l'allumer. Ce soir, il faut l'atteindre."],
          metro: ["Les lampes de secours grésillent.", "Au fond du quai, une porte : *LOCAL TECHNIQUE*.", "Si quelque chose peut t'aider ici, c'est là-dedans."]
        },
        choix: [
          { t: "Passer à couvert, par {passage}", fx: { bruit: 5 }, go: "n2_couvert" },
          { t: "Traverser {decouvert}, vite", fx: { bruit: 20 }, go: "n2_decouvert" },
          { t: "Attendre son sifflement pour savoir où il est", calme: true, go: "n2_situer" }
        ]
      },
      n2_situer: {
        vue: "loin", acteurs: [{ q: "zombie", a: "loin", pose: "siffle", ondes: 1 }],
        on: { set: "situe" },
        l: {
          village: ["Tu attends. Longtemps.", "Le sifflement.[[siffle:echo]]", "Il vient… de partout à la fois.", "La vallée le *renvoie* d'une paroi à l'autre.", "Mais au troisième sifflement, tu le vois : sur la crête, au même *rocher*."],
          ile: ["Tu attends, accroupi contre un muret.", "Le sifflement.[[siffle]]", "Il vient de la falaise. Toujours du même *rocher*.", "De là-haut, il voit toute la lande."],
          metro: ["Tu attends.", "Le sifflement.[[siffle:tunnel]]", "Il arrive par les deux tunnels à la fois, comme dans un *tuyau*.", "Puis tu le vois : sur la *passerelle*, au-dessus des voies. Il surveille le quai."]
        },
        indice: { id: "echo", t: { village: "L'*écho* de la vallée brouille d'où vient le son.", ile: "Il siffle toujours depuis la même *falaise*.", metro: "Les tunnels portent le son très loin, comme un *tuyau*." } },
        next: "n2_couvert"
      },
      n2_couvert: {
        vue: "passage", acteurs: [{ q: "joueur", a: "passage", pose: "cache" }, { q: "horde", a: "fond" }],
        l: {
          village: ["Tu longes les murs. Marche après marche.", "Une ombre passe au bout de la ruelle. Elle ne te voit pas.", "Elle suit le sifflement, comme toutes les autres."],
          ile: ["Tu avances derrière les *murets*, plié en deux.", "Une ombre traverse la lande, à vingt mètres. Elle ne te voit pas.", "Elle suit le sifflement, comme toutes les autres."],
          metro: ["Tu descends sur les voies, sous le bord du quai.", "Une ombre passe juste au-dessus de toi. Elle ne te voit pas.", "Elle suit le sifflement, comme toutes les autres."]
        },
        next: "n2_science"
      },
      n2_decouvert: {
        vue: "decouvert", acteurs: [{ q: "joueur", a: "decouvert", pose: "court" }],
        branche: [{ c: { flag: "repere" }, go: "n2_vu" }],
        l: {
          village: ["Tu traverses la place en courant.[[pas:course]]", "Personne. Ton cœur cogne.", "Tu atteins l'église sans un sifflement."],
          ile: ["Tu traverses la lande en courant.[[pas:course]]", "L'herbe mouillée étouffe tes pas.", "Le phare grandit devant toi. Pas un sifflement."],
          metro: ["Tu longes le quai en courant.[[pas:course]]", "Tes pas résonnent sous la voûte.", "Tu atteins la porte. Pas un sifflement."]
        },
        next: "n2_science"
      },
      n2_vu: {
        vue: "haut", fx: ["danger"], acteurs: [{ q: "zombie", a: "haut", pose: "regarde" }],
        on: { peur: 20 },
        l: {
          village: ["Sur un toit, juste au-dessus de toi, il est *là*.", "Il t'attendait. Depuis hier, il *surveille* ce coin.", "Deux doigts dans la bouche…"],
          ile: ["Sur un rocher, à quelques mètres, il est *là*.", "Il t'attendait. Depuis hier, il *surveille* la lande.", "Deux doigts dans la bouche…"],
          metro: ["Sur la passerelle, au-dessus des voies, il est *là*.", "Il t'attendait. Depuis hier, il *surveille* le quai.", "Deux doigts dans la bouche…"]
        },
        choix: {
          village: [
            { t: "Te jeter sur lui avant qu'il siffle", fx: { bruit: 15 }, go: "n2_attaque" },
            { t: "Lui lancer une pierre", need: "pierre", fx: { perd: "pierre", bruit: 20 }, go: "n2_horde" },
            { t: "Plonger dans le noir et ne plus bouger", go: "n2_frole" }
          ],
          ile: [
            { t: "Te jeter sur lui avant qu'il siffle", fx: { bruit: 15 }, go: "n2_attaque" },
            { t: "Lui tirer ta fusée de détresse dessus", need: "fusee", fx: { perd: "fusee", visi: 2 }, go: "n2_horde" },
            { t: "Plonger dans le noir et ne plus bouger", go: "n2_frole" }
          ],
          metro: [
            { t: "Grimper sur la passerelle avant qu'il siffle", fx: { bruit: 15 }, go: "n2_attaque" },
            { t: "Lui lancer le pied-de-biche", need: "piedbiche", fx: { perd: "piedbiche", bruit: 25 }, go: "n2_horde" },
            { t: "Plonger dans le noir et ne plus bouger", go: "n2_frole" }
          ]
        }
      },
      n2_attaque: {
        vue: "haut", acteurs: [{ q: "zombie", a: "haut", pose: "tombe" }],
        l: ["Tu bondis. Il recule. Il est *léger*. Presque rien.", "Tu le pousses. Il tombe, sans un cri.", "Pas un sifflement.", "En bas, il se relève et s'éloigne en boitant. Sans se retourner."],
        indice: { id: "fragile", t: "Il est *fragile* et ne se bat jamais. Le danger, c'est son appel." },
        next: "n2_science"
      },
      n2_frole: {
        vue: "bas", fx: ["danger", "noir"], acteurs: [{ q: "horde", a: "bas" }],
        on: { peur: 25 },
        l: ["Le sifflement éclate. Court. Répété.[[siffle:court]]", "Les ombres arrivent de partout.[[pas]]", "Tu restes plaqué au sol, dans le noir.[[coeur]]", "Elles tournent autour du sifflement… puis repartent quand il se tait."],
        indice: { id: "voir", t: "Il ne siffle sur toi que quand il te *voit*." },
        next: "n2_science"
      },
      n2_horde: {
        vue: "bas", fx: ["danger"], acteurs: [{ q: "zombie", a: "haut", pose: "siffle", ondes: 2 }, { q: "horde", a: "bas" }],
        l: {
          village: ["Raté. Il recule d'un pas.", "Et il *siffle*. Court. Répété. Sans s'arrêter.[[siffle:court]]", "Tu cours. Mais elles arrivent de *partout*.[[pas]]", "Toutes les ruelles. Toutes les portes."],
          ile: ["La fusée l'aveugle une seconde… et éclaire toute la lande. Et toi avec.", "Il *siffle*. Court. Répété. Sans s'arrêter.[[siffle:court]]", "Tu cours. Mais elles arrivent de *partout*.[[pas]]"],
          metro: ["Le métal sonne sur la passerelle. Raté.", "Il *siffle*. Court. Répété. Sans s'arrêter.[[siffle:tunnel]]", "Tu cours. Mais elles arrivent des deux tunnels.[[pas]]"]
        },
        fin: "horde"
      },
      n2_science: {
        type: "science", vue: "large",
        indice: { id: "pur", t: "Un son pur *disparaît* sous un son plus fort sur la même fréquence." },
        next: "n2_lieu"
      },
      n2_lieu: {
        vue: { village: "haut", ile: "haut", metro: "fond" }, decor: { metro: ["local"] },
        l: {
          village: ["L'église. Froide. Vide.", "Au milieu, la corde de la *cloche* pend jusqu'au sol.", "Une cloche, c'est *fort*. Et plein d'*aigus*. Comme lui."],
          ile: ["Le phare. Un escalier en colimaçon, étroit, interminable.", "En haut, la lanterne. Le mécanisme a l'air de marcher.", "Dehors, le *ressac* gronde. Un bruit *grave*. Tes pas disparaissent dedans."],
          metro: ["La porte est fermée par une *chaîne*.", "Derrière la grille, un gros levier : *VENTILATION*.", "Si ça marche encore, ça va *rugir* dans toute la station."]
        },
        indice: { id: "cle", t: { village: "La *cloche* peut couvrir son sifflement.", ile: "Le *ressac* couvre tes pas. Pas son sifflement : il est aigu.", metro: "La *ventilation* peut couvrir son sifflement." } },
        choix: {
          village: [
            { t: "Nouer ta corde à celle de la cloche, pour sonner de loin", need: "corde", fx: { set: "corde_cloche" }, go: "n2_corde" },
            { t: "Monter au clocher repérer son perchoir", go: "n2_perchoir" },
            { t: "Ne toucher à rien et attendre le jour", go: "n2_fin" }
          ],
          ile: [
            { t: "Vérifier que la lanterne s'allume", go: "n2_lanterne" },
            { t: "Observer la falaise depuis la fenêtre", go: "n2_perchoir" },
            { t: "Ne toucher à rien et attendre le jour", go: "n2_fin" }
          ],
          metro: [
            { t: "Forcer la chaîne au pied-de-biche", need: "piedbiche", fx: { set: "local", bruit: 15 }, go: "n2_force" },
            { t: "Chercher la clé dans la cabine du chef", go: "n2_cle" },
            { t: "Laisser tomber et attendre le matin", go: "n2_fin" }
          ]
        }
      },
      n2_corde: {
        vue: "haut",
        l: ["Tu noues ta corde à celle de la cloche. Un nœud de marin, serré.", "Tu la déroules jusqu'au *cimetière*, derrière le muret.", "Vingt mètres. Assez pour sonner sans être *dessous*."],
        next: "n2_fin"
      },
      n2_perchoir: {
        vue: "loin", acteurs: [{ q: "zombie", a: "loin", pose: "regarde" }],
        on: { set: "situe" },
        l: {
          village: ["Tu montes. Les marches craquent.", "Par l'ouverture du clocher, tu vois *toute* la vallée.", "Et sur la crête, sa silhouette. Toujours au même rocher.", "Tu sais où il *guette*."],
          ile: ["Par la petite fenêtre, tu vois la falaise.", "Il est là. Sur le même rocher qu'hier.", "Le ressac gronde juste en dessous de lui.", "Tu sais où il *guette*."]
        },
        next: "n2_fin"
      },
      n2_lanterne: {
        vue: "haut", decor: ["phare"],
        l: ["Tu actionnes le mécanisme. La grande lentille se met à *tourner*.[[phare]]", "Un faisceau balaie la lande. Une fois. Deux fois.", "Sur la falaise, la silhouette suit la lumière des *yeux*.", "Tu coupes. Il fixait la lumière… pas toi."],
        indice: { id: "lumiere", t: "Il siffle sur ce qu'il *voit*. Il a suivi la lumière, pas toi." },
        next: "n2_fin"
      },
      n2_force: {
        vue: "fond", decor: ["local"],
        l: ["Tu glisses le pied-de-biche dans un maillon. Tu pèses de tout ton poids.", "La chaîne *claque* et tombe.[[metal]]", "Le local est ouvert. Le levier attend."],
        next: "n2_fin"
      },
      n2_cle: {
        vue: "abri", acteurs: [{ q: "joueur", a: "abri", pose: "cache" }],
        on: { set: "local", peur: 15 },
        l: ["Tu te glisses dans la cabine vitrée. Les tiroirs grincent.", "Une clé, sur un clou : *LOCAL TECH*.", "Derrière la vitre, sur la passerelle… une silhouette maigre.", "Elle regarde de ton côté. Tu ne bouges plus. Longtemps.", "Elle finit par se tourner vers le tunnel."],
        next: "n2_fin"
      },
      n2_fin: {
        vue: "large",
        l: ["Le sifflement s'éloigne.[[siffle:loin]]", "Tu comptes les heures, roulé en boule.", "Plus qu'*une* nuit."],
        next: "aube2"
      },

      /* ───────────── NUIT 3 ───────────── */
      n3: {
        nuit: 3, vue: "large",
        l: {
          village: ["Au lever du jour, l'hélicoptère se posera au *col*.", "Mais pour y monter, il faut sortir du village. À *découvert*, sous la lune.", "Et là-haut, sur la crête, il *guette*.[[siffle:loin]]"],
          ile: ["À l'aube, le bateau. S'il voit la *lumière* du phare.", "Et il faudra traverser la *chaussée* avant que la marée la recouvre.", "Sur la falaise, il *guette*.[[siffle:loin]]"],
          metro: ["Le train part du *terminus* à l'aube. Deux stations, par le tunnel.", "Un tunnel droit, noir, interminable.", "Et quelque part, il *guette*.[[siffle:tunnel]]"]
        },
        choix: {
          village: [
            { t: "Faire sonner la cloche", go: "n3_cloche_choix" },
            { t: "Siffler vers la paroi d'en face, caché derrière le muret", si: { indice: "echo" }, go: "n3_echo" },
            { t: "Monter en silence vers son rocher et le faire taire", si: { flag: "situe" }, calme: true, go: "n3_silence" },
            { t: "Courir jusqu'au col sans t'arrêter", go: "n3_course" }
          ],
          ile: [
            { t: "Allumer le phare et attendre le bateau tout en haut", go: "n3_lanterne" },
            { t: "Allumer le phare, puis filer par la chaussée", go: "n3_lumiere" },
            { t: "Faire hurler la corne de brume pour couvrir son sifflement", need: "corne", go: "n3_corne" },
            { t: "Ramper jusqu'à son rocher, sous le bruit du ressac", si: { flag: "situe" }, calme: true, go: "n3_silence" }
          ],
          metro: [
            { t: "Lancer la ventilation, puis filer dans le tunnel", req: { flag: "local" }, pourquoi: "Le local technique est fermé.", go: "n3_ventilation" },
            { t: "Souffler dans ton sifflet pour couvrir le sien", need: "sifflet", go: "n3_sifflet" },
            { t: "Partir dans le tunnel", go: "n3_tunnel" },
            { t: "Te glisser sous la passerelle et le faire taire", si: { flag: "situe" }, calme: true, go: "n3_silence" }
          ]
        }
      },
      n3_cloche_choix: {
        vue: "haut",
        l: ["Tu te glisses jusqu'à l'église.", "La corde de la cloche pend devant toi."],
        choix: [
          { t: "Tirer ta corde depuis le cimetière, loin du clocher", req: { flag: "corde_cloche" }, pourquoi: "Ta corde n'est pas nouée à la cloche.", go: "n3_cloche" },
          { t: "Monter et sonner toi-même", go: "n3_clocher" }
        ]
      },
      n3_cloche: {
        vue: "large", decor: ["cloche"], acteurs: [{ q: "zombie", a: "loin", pose: "siffle", ondes: 1 }, { q: "horde", a: "bas" }],
        l: ["Tu tires. Une fois. Dix fois.[[cloche]]", "La cloche *hurle* sur toute la vallée.", "Là-haut, il siffle. Personne ne l'entend plus.", "Les ombres marchent vers l'église. Vers le bruit le plus fort.", "Toi, tu lâches la corde. Et tu montes vers le col.[[helico]]"],
        fin: "cloche"
      },
      n3_clocher: {
        vue: "haut", decor: ["cloche"], fx: ["danger"], acteurs: [{ q: "horde", a: "bas" }],
        l: ["Tu montes. Tu tires la corde à deux mains.[[cloche]]", "La cloche couvre tout. Le sifflement aussi.", "Mais toutes les ombres marchent vers la *cloche*…[[pas]]", "…et sous la cloche, il y a *toi*."],
        fin: "clocher"
      },
      n3_echo: {
        vue: "loin", acteurs: [{ q: "horde", a: "loin" }],
        l: ["Derrière le muret du cimetière, face à la paroi d'en face.", "Deux doigts dans ta bouche. Tu *siffles*.[[siffle:echo]]", "La paroi te renvoie ton sifflement. Plus fort. *Ailleurs*.", "Les ombres n'entendent que l'*écho*. Elles partent vers la paroi.", "Toi, tu montes vers le col, par l'autre versant.[[helico]]"],
        fin: "echo"
      },
      n3_silence: {
        vue: "loin", acteurs: [{ q: "zombie", a: "loin", pose: "tombe" }],
        l: {
          village: ["Tu fais le grand tour, par les sapins.", "Pas à pas. Dans son *dos*.", "Il est là. Deux doigts déjà levés vers sa bouche.", "Tu le plaques au sol. Il ne pèse *rien*.", "Pas un sifflement. Plus jamais.[[helico]]"],
          ile: ["Tu rampes au pied de la falaise. Le *ressac* avale chacun de tes pas.", "Il est là, au-dessus de toi. Il regarde la lande, pas les rochers.", "Tu grimpes. Il ne t'entend pas venir.", "Tu le plaques au sol. Il ne pèse *rien*.", "Pas un sifflement. Plus jamais. Tu rallumes le phare.[[bateau]]"],
          metro: ["Tu marches entre les rails, dans le noir complet.", "Il est sur la passerelle. Il regarde le quai, pas les voies.", "Tu montes l'échelle de service, barreau par barreau.", "Tu le plaques au sol. Il ne pèse *rien*.", "Pas un sifflement. Plus jamais. Le tunnel est à toi.[[train]]"]
        },
        fin: "silence"
      },
      n3_course: {
        vue: "objectif", acteurs: [{ q: "joueur", a: "objectif", pose: "court" }],
        branche: [{ c: { flag: "repere" }, go: "n3_col" }],
        l: ["Tu sors du village. Tu cours.[[pas:course]]", "La pente. La lune. Tu es une *tache sombre* sur l'herbe pâle.", "Un sifflement, derrière toi. Court. Répété.[[siffle:court]]", "Les ombres sortent du village. Elles grimpent.", "Tu ne te retournes pas. Le ciel blanchit.[[helico]]", "Une main t'attrape. Pas une main morte. Celle du pilote."],
        fin: "justesse"
      },
      n3_col: {
        vue: "objectif", fx: ["danger"], acteurs: [{ q: "zombie", a: "objectif", pose: "siffle", ondes: 2 }, { q: "horde", a: "objectif" }],
        l: ["Tu sors du village. Tu cours.[[pas:course]]", "Mais il connaît ton visage depuis la première nuit.", "Il ne t'attendait pas sur la crête. Il t'attendait sur le *sentier*.[[siffle:court]]", "Les ombres du village. Et celles des alpages.", "Tu es à mi-pente quand le cercle se referme."],
        fin: "col"
      },
      n3_lanterne: {
        vue: "haut", decor: ["phare"], fx: ["danger"], acteurs: [{ q: "zombie", a: "loin", pose: "siffle", ondes: 2 }],
        l: ["Tu allumes. Le faisceau balaie l'île, la mer, la nuit.[[phare]]", "Tu restes en haut, à le regarder tourner.", "Sur la falaise, il regarde la lumière. Puis la petite silhouette *derrière la vitre*.", "Il siffle.[[siffle:court]] En bas, la porte du phare s'ouvre.[[pas]]", "Un seul escalier. Et tu es tout en haut."],
        fin: "lanterne"
      },
      n3_lumiere: {
        vue: "objectif", decor: ["phare"], acteurs: [{ q: "horde", a: "fond" }],
        l: ["Tu allumes. Le faisceau se met à tourner.[[phare]]", "Puis tu redescends. Vite.", "Sur la falaise, il siffle vers la *lumière*. Les ombres marchent vers le phare.", "Toi, tu es déjà sur la chaussée."],
        choix: [
          { t: "Traverser dans le noir complet", go: "n3_lumiere_noir" },
          { t: "Allumer ta lampe pour ne pas glisser", need: "lampe", fx: { visi: 1 }, go: "n3_maree" }
        ]
      },
      n3_lumiere_noir: {
        vue: "objectif", decor: ["phare"], acteurs: [{ q: "joueur", a: "objectif", pose: "court" }],
        l: ["Les algues glissent. L'eau monte déjà à tes chevilles.[[vague]]", "Derrière toi, le sifflement, toujours pointé sur le phare.[[siffle:loin]]", "Au port, une coque grise. Le *bateau*.[[bateau]]", "Il a vu la lumière. Il t'a attendu."],
        fin: "lumiere"
      },
      n3_maree: {
        vue: "objectif", decor: ["phare"], fx: ["danger"], acteurs: [{ q: "joueur", a: "objectif", pose: "court" }, { q: "horde", a: "decouvert" }],
        l: ["Ta lampe s'allume. Et là-haut, il la *voit*.[[siffle:court]]", "Les ombres se détournent du phare. Elles te suivent sur la chaussée.[[pas]]", "Tu cours, l'eau aux genoux.[[vague]]", "Derrière toi, la *marée* recouvre la chaussée. Et les ombres avec.", "Tu montes à bord, trempé. Vivant. De justesse.[[bateau]]"],
        fin: "maree"
      },
      n3_corne: {
        vue: "decouvert", fx: ["danger"], acteurs: [{ q: "zombie", a: "loin", pose: "siffle", ondes: 1 }, { q: "horde", a: "decouvert" }],
        l: ["Tu fais hurler la corne de brume.[[corne]]", "Un son énorme. *Grave*. Il fait trembler les vitres du phare.", "Mais le sifflement passe *au-dessus*, intact.[[siffle]]", "Ta corne n'a rien couvert. Elle a juste dit à toute l'île où tu étais.[[pas]]"],
        fin: "corne"
      },
      n3_ventilation: {
        vue: "large", decor: ["ventilation", "local"], acteurs: [{ q: "zombie", a: "haut", pose: "siffle", ondes: 1 }, { q: "horde", a: "decouvert" }],
        l: ["Tu entres dans le local. Tu abaisses le levier.", "La ventilation *rugit*. Un vacarme de fer et de vent, plein d'*aigus*.[[ventilation]]", "Sur la passerelle, il siffle. Personne ne l'entend plus.", "Les ombres errent sur le quai, perdues.", "Toi, tu es déjà dans le tunnel. Direction : le terminus.[[train]]"],
        fin: "ventilation"
      },
      n3_sifflet: {
        vue: "decouvert", fx: ["danger"], acteurs: [{ q: "horde", a: "decouvert" }],
        l: ["Tu souffles dans ton sifflet de toutes tes forces.[[sifflet]]", "Un son perçant, plus fort que le sien. Le sien disparaît, c'est vrai.", "Mais le tien dit à toutes les ombres où tu es.", "Et les tunnels le portent jusqu'aux stations voisines.[[pas]]"],
        fin: "sifflet"
      },
      n3_tunnel: {
        vue: "objectif",
        l: ["Tu descends sur les voies. Le tunnel s'ouvre devant toi, noir comme un puits."],
        choix: [
          { t: "Garder ta lampe allumée", need: "lampe", fx: { visi: 2 }, go: "n3_lampe" },
          { t: "Avancer dans le noir complet, une main sur le mur", go: "n3_noir" }
        ]
      },
      n3_lampe: {
        vue: "objectif", fx: ["faisceau", "danger"], acteurs: [{ q: "horde", a: "objectif" }],
        l: ["Ton faisceau perce le tunnel sur cent mètres.", "Un tunnel droit. Une lumière qui avance. Visible de *très* loin.", "Derrière toi, un sifflement.[[siffle:tunnel]]", "Puis des pas. Devant. Derrière.[[pas]]"],
        fin: "lampe"
      },
      n3_noir: {
        vue: "objectif", fx: ["noir"],
        branche: [{ c: { flag: "repere" }, go: "n3_noir_vu" }],
        l: ["Noir total. Tu comptes tes pas. Le mur est froid, humide.", "Le sifflement, quelque part derrière toi, *cherche*.[[siffle:tunnel]]", "Il ne voit rien. Il ne sait pas où pointer.", "Au bout, une lumière blanche. Le *terminus*. Le train.[[train]]"],
        fin: "justesse"
      },
      n3_noir_vu: {
        vue: "objectif", fx: ["noir", "danger"], acteurs: [{ q: "horde", a: "objectif" }],
        l: ["Noir total. Tu avances…", "Mais il connaît ton visage depuis la première nuit.", "Il guettait l'entrée du tunnel. Il t'a vu y entrer.[[siffle:court]]", "Le tunnel se remplit de pas. Devant. Derrière.[[pas]]"],
        fin: "horde"
      }
    },

    fins: {
      cloche: { type: "survie", parfait: true, lieux: ["village"], titre: "LA CLOCHE", texte: "Tu as noyé son appel sous un son plus fort, sans être dessous." },
      echo: { type: "survie", parfait: true, lieux: ["village"], titre: "L'ÉCHO", texte: "Tu as retourné la vallée contre lui : la horde a suivi l'écho." },
      silence: { type: "survie", parfait: true, titre: "LE SILENCE", texte: "Tu l'as fait taire avant qu'il te voie. Sans lui, ils sont sourds à toi." },
      lumiere: { type: "survie", parfait: true, lieux: ["ile"], titre: "LA LUMIÈRE", texte: "Il siffle sur ce qu'il voit. Tu lui as donné le phare à regarder." },
      ventilation: { type: "survie", parfait: true, lieux: ["metro"], titre: "LA VENTILATION", texte: "Un vacarme plein d'aigus a noyé son appel. La horde s'est perdue." },
      justesse: { type: "survie", parfait: false, lieux: ["village", "metro"], titre: "DE JUSTESSE", texte: "Tu as survécu, mais sans comprendre comment le battre." },
      maree: { type: "survie", parfait: false, lieux: ["ile"], titre: "LA MARÉE", texte: "Ta lampe t'a trahi. La marée t'a sauvé. Pas toi." },
      horde: {
        type: "mort", titre: "LA HORDE",
        cause: { village: "Le Siffleur… et toutes les ombres de la vallée.", ile: "Le Siffleur… et toutes les ombres de l'île.", metro: "Le Siffleur… et toutes les ombres du réseau." },
        pourquoi: "Il t'avait vu. Il n'a pas eu besoin de se battre : il a appelé.",
        conseil: "Il ne siffle que sur ce qu'il voit. Reste dans le noir, et ne l'attaque jamais à découvert."
      },
      clocher: {
        type: "mort", lieux: ["village"], titre: "LE CLOCHER",
        cause: "Ta propre cloche.",
        pourquoi: "La cloche a bien noyé son sifflement. Mais la horde marche vers le bruit le plus fort. Et tu étais dessous.",
        conseil: "Fais sonner la cloche de loin : noue ta corde à la sienne la veille."
      },
      col: {
        type: "mort", lieux: ["village"], titre: "LE COL",
        cause: "Le Siffleur, posté sur le sentier.",
        pourquoi: "Ta lampe t'avait trahi dès la première nuit. Il savait par où tu passerais.",
        conseil: "Ne t'éclaire jamais face à lui : il ne siffle que sur ce qu'il voit."
      },
      lanterne: {
        type: "mort", lieux: ["ile"], titre: "LA LANTERNE",
        cause: "Le Siffleur, et la horde dans l'escalier.",
        pourquoi: "Une vitre laisse passer la lumière. Il t'a vu derrière, en pleine lumière.",
        conseil: "Allume le phare, puis pars : laisse-le regarder la lumière, pas toi."
      },
      corne: {
        type: "mort", lieux: ["ile"], titre: "LA CORNE",
        cause: "Ta corne de brume.",
        pourquoi: "Une corne de brume est grave. Le sifflement est aigu : il est passé au-dessus, intact. Et ta corne t'a désigné.",
        conseil: "Pour couvrir un son pur, il faut un son plus fort sur sa fréquence. Pas à côté."
      },
      sifflet: {
        type: "mort", lieux: ["metro"], titre: "LE SIFFLET",
        cause: "Ton propre sifflet.",
        pourquoi: "Tu as bien couvert son appel… avec un appel à toi. Le son sortait de ta bouche.",
        conseil: "Le son qui couvre le sien doit venir d'ailleurs. Pense au local technique."
      },
      lampe: {
        type: "mort", lieux: ["metro"], titre: "LA LAMPE",
        cause: "Le Siffleur, au bout du tunnel.",
        pourquoi: "Dans un tunnel droit, une lampe se voit de très loin. Il a vu, il a sifflé.",
        conseil: "Il ne siffle que sur ce qu'il voit. Dans le noir, tu n'existes pas."
      }
    },

    /* « Le savais-tu ? » — le silbo, le son pur, l'écho, le masquage */
    science: {
      titre: "LE SILBO",
      diapos: [
        {
          l: ["Sur l'île de *La Gomera*, aux Canaries, des bergers se parlent en *sifflant*.", "D'un versant à l'autre de la vallée. Sur *plusieurs kilomètres*.", "Ça s'appelle le *silbo*. L'UNESCO l'a inscrit au patrimoine de l'humanité."],
          dessin: function (k, t) {
            k.fond();
            k.texte("LA GOMERA · CANARIES", 450, 70, { taille: 30, couleur: k.c.or });
            k.poly([[0, 640], [0, 300], [210, 380], [450, 610], [690, 360], [900, 260], [900, 640]], k.c.ardoise);
            k.poly([[0, 640], [0, 420], [260, 470], [450, 640]], "#22304a");
            k.poly([[900, 640], [900, 400], [640, 450], [450, 640]], "#22304a");
            k.bonhomme(170, 395, 1, k.c.blanc);
            k.bonhomme(735, 355, 1, k.c.blanc);
            var p = (t * 0.45) % 1;
            for (var i = 0; i < 4; i++) {
              var q = (p + i / 4) % 1;
              k.arc(190, 330, 40 + q * 560, -0.5, 0.15, k.c.rouge, 1 - q);
            }
            if (t > 2) k.fleche(200, 470, 700, 430, k.c.neon, "plusieurs km", k.prog(t, 2, 1));
          }
        },
        {
          l: ["Un cri étale son énergie sur *plein* de fréquences.", "Un sifflement met tout sur *une seule* : c'est un son *pur*.", "Le vent, lui, gronde dans les *graves*. Le sifflement est *aigu*.", "Il reste seul sur sa fréquence. Impossible de le rater."],
          dessin: function (k, t) {
            k.fond();
            k.axes(90, 560, 760, 420, "graves → aigus", "énergie");
            var a = k.prog(t, 0.2, 1.2), b = k.prog(t, 2.6, 1.2), c = k.prog(t, 5.2, 1.4);
            k.courbe(function (x) { return 150 * Math.exp(-Math.pow((x - 0.45) / 0.28, 2)) * (0.8 + 0.2 * Math.sin(x * 40)); }, 90, 560, 760, 420, k.c.blanc, a, 3, "cri");
            if (t < 5.2) k.courbe(function (x) { return 360 * Math.exp(-Math.pow((x - 0.72) / 0.012, 2)); }, 90, 560, 760, 420, k.c.rouge, b, 5, "sifflement");
            if (c > 0) {
              k.remplir(function (x) { return 330 * Math.exp(-Math.pow((x - 0.05) / 0.25, 2)); }, 90, 560, 760, 420, "rgba(90,120,170,0.55)", c, "vent");
              k.courbe(function (x) { return 360 * Math.exp(-Math.pow((x - 0.72) / 0.012, 2)); }, 90, 560, 760, 420, k.c.rouge, 1, 5, "sifflement");
            }
          }
        },
        {
          l: ["Dans une vallée, les parois *renvoient* le son.", "L'écho le porte encore plus loin…", "…et on ne sait plus très bien *d'où* il vient."],
          dessin: function (k, t) {
            k.fond();
            k.poly([[60, 80], [450, 600], [840, 80], [900, 80], [900, 640], [0, 640], [0, 80]], k.c.ardoise);
            k.poly([[60, 80], [450, 600], [840, 80]], k.c.nuit);
            var pts = [[180, 250], [690, 300], [260, 360], [620, 400], [330, 460], [560, 500]];
            var n = Math.min(pts.length - 1, Math.floor(t * 1.4));
            var f = (t * 1.4) % 1;
            for (var i = 0; i < n; i++) k.ligne([pts[i], pts[i + 1]], k.c.rouge, 3, 0.25 + 0.75 * (i + 1) / pts.length);
            if (n < pts.length - 1) {
              var A = pts[n], B = pts[n + 1];
              k.ligne([A, [A[0] + (B[0] - A[0]) * f, A[1] + (B[1] - A[1]) * f]], k.c.rouge, 4, 1);
            }
            k.bonhomme(160, 245, 0.8, k.c.blanc);
            for (var j = 0; j < Math.min(n, 5); j++) k.cercle(pts[j + 1][0], pts[j + 1][1], 10 + 6 * Math.sin(t * 6 + j), k.c.neon, false, 0.6);
            if (t > 3) k.texte("?", 450, 200, { taille: 90, couleur: k.c.or, alpha: k.prog(t, 3, 0.8) });
          }
        },
        {
          l: {
            village: ["Mais un son pur a une *faiblesse*.", "Si un son *plus fort* occupe sa fréquence, il disparaît dessous.", "Une *cloche*, c'est fort. Et plein d'*aigus*."],
            ile: ["Mais un son pur a une *faiblesse*.", "Si un son *plus fort* occupe sa fréquence, il disparaît dessous.", "Le *ressac*, lui, gronde dans les *graves* : il couvre tes pas, pas son sifflement."],
            metro: ["Mais un son pur a une *faiblesse*.", "Si un son *plus fort* occupe sa fréquence, il disparaît dessous.", "Une *ventilation* qui rugit, c'est fort. Et plein d'*aigus*."]
          },
          dessin: function (k, t) {
            k.fond();
            k.axes(90, 560, 760, 420, "graves → aigus", "énergie");
            var monte = k.prog(t, 2.2, 1.6);
            var aigu = k.lieu !== "ile";
            k.courbe(function (x) { return 300 * Math.exp(-Math.pow((x - 0.72) / 0.012, 2)); }, 90, 560, 760, 420, k.c.rouge, 1, 5, "sifflement");
            if (monte > 0) {
              var nom = k.lieu === "village" ? "cloche" : k.lieu === "ile" ? "ressac" : "ventilation";
              k.remplir(function (x) {
                if (!aigu) return 380 * Math.exp(-Math.pow((x - 0.08) / 0.22, 2));
                var v = 180 * Math.exp(-Math.pow((x - 0.6) / 0.3, 2));
                if (k.lieu === "village") [0.33, 0.52, 0.66, 0.72, 0.8, 0.9].forEach(function (p, i) { v += (330 - i * 25) * Math.exp(-Math.pow((x - p) / 0.02, 2)); });
                else v += 200 * Math.exp(-Math.pow((x - 0.7) / 0.2, 2));
                return v;
              }, 90, 560, 760, 420, "rgba(255,201,60,0.6)", monte, nom);
            }
            if (t > 4.2) k.texte(aigu ? "SIFFLEMENT NOYÉ" : "SIFFLEMENT INTACT", 450, 90, { taille: 40, couleur: aigu ? k.c.or : k.c.rouge, alpha: k.prog(t, 4.2, 0.6) });
          }
        }
      ]
    }
  });
})(typeof window !== "undefined" ? window : globalThis);
