// ==========================================================================
// STRUCTURE DES DONNÉES DES SUCCÈS (successdata.js)
// ==========================================================================
//
// Chaque objet dans le tableau `successes` représente un succès et peut contenir les clés suivantes :
//
// - id: (Nombre) Identifiant unique du succès.
//   - Pour le succès initial (racine) : 0
//   - Pour les "ROUTES" (déblocage de catégorie) : Numéro de la route (ex: 1 pour ROUTE 1, 2 pour ROUTE 2).
//   - Pour les "SUCCÈS INTERMÉDIAIRES" (Ponts) : [numéro_catégorie]000 (ex: 1000 pour le pont de la catégorie 1).
//   - Pour les succès (non-évolutifs et tous les niveaux des succès évolutifs) :
//     [numéro_catégorie][numéro_séquentiel_du_succès_sur_3_chiffres_dans_la_catégorie_commençant_à_001].
//     Exemple : 1001 (premier succès de la catégorie 1, potentiellement non-évolutif), 1002, ...,
//     1005 (qui pourrait être le Niveau 1 d'une série évolutive), 1006 (Niveau 2 de la même série), etc.
//
// - name: (Chaîne) Nom du succès affiché à l'utilisateur.
//
// - desc: (Chaîne) Description du succès, expliquant ce qu'il faut accomplir.
//
// - x: (Nombre) Coordonnée X du centre du nœud du succès sur le graphique.
//        Les valeurs négatives sont à gauche de l'axe Y central, positives à droite.
//        Les succès évolutifs d'une catégorie commencent au même niveau X que les succès non-évolutifs de cette catégorie.
//
// - x: (Nombre) Coordonnée X du centre du nœud du succès sur le graphique.
//        Les valeurs négatives sont à gauche du centre, positives à droite.
//
// - y: (Nombre) Coordonnée Y du centre du nœud du succès sur le graphique.
//        Les valeurs négatives sont au-dessus du centre, positives en dessous.
//        Au sein d'une catégorie :
//          - Le bloc combiné des succès non-évolutifs et du premier niveau de chaque série évolutive
//            est centré verticalement par rapport à la coordonnée Y du "SUCCÈS INTERMÉDIAIRE (Pont)" de cette catégorie.
//          - Les séries de succès évolutifs avec le plus grand nombre de niveaux d'évolution sont placées
//            plus haut (valeur Y plus petite/négative) au sein de ce bloc centré, et celles avec moins
//            de niveaux sont placées plus bas.
//
// - lvl: (Nombre) Nombre de points de niveau gagnés lors du déverrouillage de ce succès.
//   - ROUTES (sauf ROUTE 1) : 10
//   - ROUTE 1 : 0
//   - SUCCÈS INTERMÉDIAIRES (Ponts) : 0
//   - SUCCÈS NON-ÉVOLUTIFS : 1
//   - SUCCÈS ÉVOLUTIFS :
//     - Niveau 1 : 1
//     - Niveau 2 : 2
//     - Niveau 3 : 3
//     - (et ainsi de suite, le `lvl` correspond au niveau d'évolution)
//
// - pa: (Tableau de Nombres) Liste des ID des succès parents (prérequis).
//       Un succès ne peut être déverrouillé que si tous ses parents sont déverrouillés.
//       Pour les "ROUTES", `pa` inclut :
//         1. L'ID de la "ROUTE" précédente.
//         2. Les ID des succès de fin de chaîne évolutive de la catégorie précédente.
//         3. Les ID de tous les succès non-évolutifs de la catégorie précédente.
//
// - tai: (Nombre, optionnel) Taille (rayon) du nœud du succès. Si non défini, une valeur par défaut est utilisée.
//
// - lig: (Booléen, optionnel) Contrôle la visibilité du lien vers ce succès depuis ses parents.
//        Si `lig: false`, le lien n'est pas dessiné, SAUF si le parent est listé dans `exep`.
//        Si `lig: true` ou non défini, le lien est dessiné par défaut.
//
// - exep: (Tableau de Nombres, optionnel) Liste d'ID de parents pour lesquels un lien DOIT être dessiné,
//         même si `lig: false` est défini pour ce succès. Utile pour les "ROUTES".
//
// - cond: (Chaîne, optionnel) Condition textuelle supplémentaire pour débloquer le succès,
//         affichée dans la barre latérale. (ex: "Avoir fini la Catégorie X").
//
// - cou: (Chaîne, optionnel) Couleur personnalisée (hexadécimale) pour le remplissage du nœud du succès.
//        Si non définie, des couleurs par défaut basées sur l'état (verrouillé, déverrouillable, déverrouillé) sont utilisées.
//
// - unlocked: (Booléen, ajouté dynamiquement par script.js) Indique si le succès a été déverrouillé.
//             Initialisé à partir du localStorage.
//
// ==========================================================================

const successes = [
    { id: 0, name: "Une nouvelle vie", desc: "Naître et vivre pour accomplir cette liste", x: 0, y: 0, lvl: 0, pa: [], tai: 200},
// ==========================================================================
// Catégorie 1 : Les Fondations (Très Facile) - Impaire (Succès à Gauche)
// ==========================================================================
    { id: 1, name: "ROUTE 1", desc: "Débloque la catégorie 'Les Fondations'.", x: 0, y: -1800, lvl: 0, pa: [0], tai: 150, lig: false, exep: [0], cou: "#FFA500" }, // Reste pa: [0]

    // SUCCÈS INTERMÉDIAIRE (Pont 1)
    { id: 1000, name: "Accès aux Fondations", desc: "Le portail vers les bases de la vie est ouvert.", x: -750, y: -1800, lvl: 0, pa: [1], tai: 70, cou: "#FFFF00"},

    // Succès Non-Évolutifs
    { id: 1001, name: "Vêtements du Jour", desc: "Préparer ses vêtements pour le lendemain avant de se coucher.", x: -1500, y: -2625, lvl: 1, pa: [1000], tai: 30 }, // Centered around y: -1800 (Bridge Y)
    { id: 1002, name: "Message de Gratitude", desc: "Envoyer un message de remerciement à quelqu'un.", x: -1500, y: -2475, lvl: 1, pa: [1000], tai: 30 },
    { id: 1024, name: "Planification Hebdomadaire", desc: "Planifier ses tâches principales pour la semaine à venir.", x: -1500, y: -2325, lvl: 1, pa: [1000], tai: 30 },
    { id: 1025, name: "Lecture Quotidienne (Fondations)", desc: "Lire 10 pages d'un livre chaque jour pendant 5 jours.", x: -1500, y: -2175, lvl: 1, pa: [1000], tai: 30 },

    // Succès Évolutifs : Hydratation Matinale
    { id: 1003, name: "Hydratation Matinale Niveau 1", desc: "Boire un verre d'eau immédiatement après le réveil.", x: -1500, y: -2025, lvl: 1, pa: [1000], tai: 30 },
    { id: 1004, name: "Hydratation Matinale Niveau 2", desc: "Boire un verre d'eau après le réveil et un autre avant chaque repas pendant 3 jours.", x: -1800, y: -2025, lvl: 2, pa: [1003], tai: 30 },
    { id: 1005, name: "Hydratation Matinale Niveau 3", desc: "Boire régulièrement de l'eau tout au long de la journée pour atteindre 1.5L pendant une semaine.", x: -2100, y: -2025, lvl: 3, pa: [1004], tai: 30 },
    
    // Succès Évolutifs : Pause Respiratoire
    { id: 1006, name: "Pause Respiratoire Niveau 1", desc: "Prendre 5 minutes pour se concentrer sur sa respiration dans la journée.", x: -1500, y: -1875, lvl: 1, pa: [1000], tai: 30 },
    { id: 1007, name: "Pause Respiratoire Niveau 2", desc: "Pratiquer 5 minutes de respiration consciente matin et soir pendant 3 jours.", x: -1800, y: -1875, lvl: 2, pa: [1006], tai: 30 },
    { id: 1008, name: "Pause Respiratoire Niveau 3", desc: "Intégrer 10 minutes de méditation basée sur la respiration dans sa routine quotidienne pendant une semaine.", x: -2100, y: -1875, lvl: 3, pa: [1007], tai: 30 },

    // Succès Évolutifs : Déconnexion Progressive
    { id: 1009, name: "Déconnexion Progressive Niveau 1", desc: "Ne pas regarder son téléphone ou un écran pendant les 30 premières minutes après le réveil.", x: -1500, y: -1725, lvl: 1, pa: [1000], tai: 30 },
    { id: 1010, name: "Déconnexion Progressive Niveau 2", desc: "Étendre la période sans écran matinal à 1 heure pendant 5 jours.", x: -1800, y: -1725, lvl: 2, pa: [1009], tai: 30 },
    { id: 1011, name: "Déconnexion Progressive Niveau 3", desc: "Commencer sa journée par une activité non numérique (lecture, étirements, etc.) avant de consulter ses écrans pendant une semaine.", x: -2100, y: -1725, lvl: 3, pa: [1010], tai: 30 },

    // Succès Évolutifs : Détox Numérique
    { id: 1012, name: "Détox Numérique Niveau 1", desc: "Éteindre son téléphone 1 heure avant de dormir.", x: -1500, y: -1575, lvl: 1, pa: [1000], tai: 30},
    { id: 1013, name: "Détox Numérique Niveau 2", desc: "Ne pas utiliser son téléphone pendant 2 heures après le réveil.", x: -1800, y: -1575, lvl: 2, pa: [1012], tai: 30 },
    { id: 1014, name: "Détox Numérique Niveau 3", desc: "Faire une journée entière sans aucun écran non essentiel (téléphone, ordinateur, télévision).", x: -2100, y: -1575, lvl: 3, pa: [1013], tai: 30},
    { id: 1015, name: "Détox Numérique Niveau 4", desc: "Passer un week-end sans consulter les réseaux sociaux ou regarder la télévision.", x: -2400, y: -1575, lvl: 4, pa: [1014], tai: 30},
    { id: 1016, name: "Détox Numérique Niveau 5", desc: "Réduire volontairement son temps d'écran quotidien de manière significative pendant un mois.", x: -2700, y: -1575, lvl: 5, pa: [1015], tai: 30},
    
    // Succès Évolutifs : Organisation Pro
    { id: 1017, name: "Organisation Pro Niveau 1", desc: "Organiser un tiroir ou une étagère.", x: -1500, y: -1425, lvl: 1, pa: [1000], tai: 30 },
    { id: 1018, name: "Organisation Pro Niveau 2", desc: "Trier et organiser sa garde-robe.", x: -1800, y: -1425, lvl: 2, pa: [1017], tai: 30 },
    { id: 1019, name: "Organisation Pro Niveau 3", desc: "Numériser ses documents importants et créer un système de classement numérique simple.", x: -2100, y: -1425, lvl: 3, pa: [1018], tai: 30 },
    { id: 1020, name: "Organisation Pro Niveau 4", desc: "Organiser toutes ses photos numériques.", x: -2400, y: -1425, lvl: 4, pa: [1019], tai: 30 },
    { id: 1021, name: "Organisation Pro Niveau 5", desc: "Mettre en place un système d'organisation efficace pour au moins deux domaines de sa vie (ex: cuisine et bureau).", x: -2700, y: -1425, lvl: 5, pa: [1020], tai: 30 },

    // Succès Évolutifs : Routine Matinale
    { id: 1022, name: "Routine Matinale Niveau 1", desc: "Intégrer une nouvelle habitude à sa routine matinale (ex: méditation, étirements) pendant 3 jours.", x: -1500, y: -1275, lvl: 1, pa: [1000], tai: 30 },
    { id: 1023, name: "Routine Matinale Niveau 2", desc: "Maintenir sa routine matinale pendant une semaine.", x: -1800, y: -1275, lvl: 2, pa: [1022], tai: 30 },
    { id: 1026, name: "Routine Matinale Niveau 3", desc: "Construire une routine matinale complète (3 habitudes minimum) et la maintenir pendant 2 semaines.", x: -2100, y: -1275, lvl: 3, pa: [1023], tai: 30 }, 
    { id: 1027, name: "Routine Matinale Niveau 4", desc: "Adapter sa routine matinale à des imprévus (voyage, changement d'horaire) et la maintenir.", x: -2400, y: -1275, lvl: 4, pa: [1026], tai: 30 }, 
    { id: 1028, name: "Routine Matinale Niveau 5", desc: "Avoir une routine matinale qui vous dynamise et la maintenir sans effort pendant un mois.", x: -2700, y: -1275, lvl: 5, pa: [1027], tai: 30 }, 

    // Nouveaux succès ajoutés pour la catégorie 1
    { id: 1029, name: "Espace de Travail Minimaliste Niveau 1", desc: "Désencombrer son bureau ou son principal espace de travail.", x: -1500, y: -1125, lvl: 1, pa: [1000], tai: 30 },
    { id: 1030, name: "Espace de Travail Minimaliste Niveau 2", desc: "Organiser ses fournitures de bureau pour un accès facile.", x: -1800, y: -1125, lvl: 2, pa: [1029], tai: 30 },
    { id: 1031, name: "Espace de Travail Minimaliste Niveau 3", desc: "Maintenir son espace de travail propre et organisé pendant une semaine.", x: -2100, y: -1125, lvl: 3, pa: [1030], tai: 30 },

// ==========================================================================
// Catégorie 2 : Bien-être Physique (Facile) - PAIRE (Succès à DROITE)
// ==========================================================================
    { id: 2, name: "ROUTE 2", desc: "Débloque la catégorie 'Bien-être Physique'.", x: 0, y: -3000, lvl: 0, pa: [0], tai: 150, lig: false, exep: [0], cou: "#FFA500"},

    // SUCCÈS INTERMÉDIAIRE (Pont 2)
    { id: 2000, name: "Accès au Bien-être", desc: "Le portail vers l'équilibre physique est ouvert.", x: 750, y: -3000, lvl: 0, pa: [2], tai: 70, cou: "#FFFF00" },

    // Succès Non-Évolutifs
    { id: 2001, name: "Posture Parfaite", desc: "Rester assis ou debout avec une bonne posture pendant 30 minutes.", x: 1500, y: -3825, lvl: 1, pa: [2000], tai: 30 },
    { id: 2002, name: "Escalier Conquis", desc: "Privilégier les escaliers à l'ascenseur ou à l'escalator.", x: 1500, y: -3675, lvl: 1, pa: [2000], tai: 30 },
    { id: 2003, name: "Marche Consciente", desc: "Faire une marche de 20 minutes en se concentrant sur ses sensations corporelles et son environnement.", x: 1500, y: -3525, lvl: 1, pa: [2000], tai: 30 },
    { id: 2004, name: "Hydratation Créative", desc: "Infuser son eau avec des fruits ou des herbes pour la rendre plus attrayante.", x: 1500, y: -3375, lvl: 1, pa: [2000], tai: 30 },
    { id: 2005, name: "Cuisine Saine Simple", desc: "Préparer un repas équilibré avec au moins 3 groupes d'aliments différents.", x: 1500, y: -3225, lvl: 1, pa: [2000], tai: 30 },

    // Succès Évolutifs : Objectif Vitamines
    { id: 2006, name: "Objectif Vitamines Niveau 1", desc: "Manger un fruit ou un légume coloré.", x: 1500, y: -3075, lvl: 1, pa: [2000], tai: 30 },
    { id: 2007, name: "Objectif Vitamines Niveau 2", desc: "Manger 3 portions de fruits et légumes différents en une journée.", x: 1800, y: -3075, lvl: 2, pa: [2006], tai: 30 },
    { id: 2008, name: "Objectif Vitamines Niveau 3", desc: "Consommer 5 portions de fruits et légumes par jour pendant une semaine.", x: 2100, y: -3075, lvl: 3, pa: [2007], tai: 30 },

    // Succès Évolutifs : Hydratation Optimale
    { id: 2009, name: "Hydratation Optimale Niveau 1", desc: "Boire un verre d'eau toutes les heures pendant une journée de travail.", x: 1500, y: -2925, lvl: 1, pa: [2000], tai: 30 },
    { id: 2010, name: "Hydratation Optimale Niveau 2", desc: "Atteindre son objectif quotidien d'hydratation (ex: 1.5-2L) pendant 3 jours.", x: 1800, y: -2925, lvl: 2, pa: [2009], tai: 30 },
    { id: 2011, name: "Hydratation Optimale Niveau 3", desc: "Maintenir une hydratation optimale pendant une semaine complète.", x: 2100, y: -2925, lvl: 3, pa: [2010], tai: 30 },

    // Succès Évolutifs : Souffle Conscient
    { id: 2012, name: "Souffle Conscient Niveau 1", desc: "Pratiquer 3 cycles de respiration profonde au cours de la journée.", x: 1500, y: -2775, lvl: 1, pa: [2000], tai: 30 },
    { id: 2013, name: "Souffle Conscient Niveau 2", desc: "Intégrer 5 minutes de respiration profonde dans sa routine quotidienne pendant 5 jours.", x: 1800, y: -2775, lvl: 2, pa: [2012], tai: 30 },

    // Succès Évolutifs : Flexibilité
    { id: 2014, name: "Flexibilité Niveau 1", desc: "Réaliser 5 minutes d'étirements.", x: 1500, y: -2625, lvl: 1, pa: [2000], tai: 30 },
    { id: 2015, name: "Flexibilité Niveau 2", desc: "Tenir une posture d'étirement pendant 30 secondes.", x: 1800, y: -2625, lvl: 2, pa: [2014], tai: 30 },
    { id: 2016, name: "Flexibilité Niveau 3", desc: "Suivre un programme d'étirement quotidien pendant 2 semaines.", x: 2100, y: -2625, lvl: 3, pa: [2015], tai: 30 },
    { id: 2017, name: "Flexibilité Niveau 4", desc: "Améliorer sa souplesse au point de se sentir plus à l'aise dans ses mouvements quotidiens.", x: 2400, y: -2625, lvl: 4, pa: [2016], tai: 30 },
    { id: 2018, name: "Flexibilité Niveau 5", desc: "Intégrer la flexibilité dans sa vie quotidienne et ressentir une nette amélioration de son bien-être physique général sur le long terme.", x: 2700, y: -2625, lvl: 5, pa: [2017], tai: 30 },

    // Succès Évolutifs : Énergie Durable
    { id: 2019, name: "Énergie Durable Niveau 1", desc: "Remplacer une boisson sucrée par de l'eau ou du thé non sucré.", x: 1500, y: -2475, lvl: 1, pa: [2000], tai: 30 },
    { id: 2020, name: "Énergie Durable Niveau 2", desc: "Manger un en-cas sain au lieu d'une sucrerie.", x: 1800, y: -2475, lvl: 2, pa: [2019], tai: 30 },
    { id: 2021, name: "Énergie Durable Niveau 3", desc: "Planifier ses repas pour avoir des apports énergétiques stables sur une semaine.", x: 2100, y: -2475, lvl: 3, pa: [2020], tai: 30 },
    { id: 2022, name: "Énergie Durable Niveau 4", desc: "Identifier les aliments qui vous donnent de l'énergie et ceux qui vous en privent, et adapter votre alimentation en conséquence pendant un mois.", x: 2400, y: -2475, lvl: 4, pa: [2021], tai: 30 },
    { id: 2023, name: "Énergie Durable Niveau 5", desc: "Adopter une alimentation qui soutient votre niveau d'énergie optimal au quotidien.", x: 2700, y: -2475, lvl: 5, pa: [2022], tai: 30 },

    // Succès Évolutifs : Défi Postural
    { id: 2024, name: "Défi Postural Niveau 1", desc: "Corriger consciemment sa posture 5 fois par jour.", x: 1500, y: -2325, lvl: 1, pa: [2000], tai: 30 },
    { id: 2025, name: "Défi Postural Niveau 2", desc: "Passer une journée complète avec une posture correcte.", x: 1800, y: -2325, lvl: 2, pa: [2024], tai: 30 },
    { id: 2026, name: "Défi Postural Niveau 3", desc: "Faire des exercices de renforcement postural 3 fois par semaine pendant un mois.", x: 2100, y: -2325, lvl: 3, pa: [2025], tai: 30 },
    { id: 2027, name: "Défi Postural Niveau 4", desc: "Ressentir une diminution des tensions et douleurs liées à la mauvaise posture.", x: 2400, y: -2325, lvl: 4, pa: [2026], tai: 30 },
    { id: 2028, name: "Défi Postural Niveau 5", desc: "Avoir une posture naturellement plus droite et plus forte, réduisant ainsi les inconforts physiques.", x: 2700, y: -2325, lvl: 5, pa: [2027], tai: 30 },

    // Nouveaux succès ajoutés pour la catégorie 2
    { id: 2029, name: "Sommeil Amélioré Niveau 1", desc: "Éviter la caféine 6 heures avant de se coucher pendant 3 jours.", x: 1500, y: -2175, lvl: 1, pa: [2000], tai: 30 },
    { id: 2030, name: "Sommeil Amélioré Niveau 2", desc: "Créer un rituel relaxant avant le coucher (ex: lecture, bain chaud) et le suivre pendant une semaine.", x: 1800, y: -2175, lvl: 2, pa: [2029], tai: 30 },

// ==========================================================================
// Catégorie 3 : Développement Personnel (Facile) - IMPAIRE (Succès à GAUCHE)
// ==========================================================================
    { id: 3, name: "ROUTE 3", desc: "Débloque la catégorie 'Développement Personnel'.", x: 0, y: -4200, lvl: 0, pa: [0], tai: 150, lig: false, exep: [0], cou: "#FFA500"},

    // SUCCÈS INTERMÉDIAIRE (Pont 3)
    { id: 3000, name: "Accès au Développement", desc: "Le portail vers la croissance personnelle est ouvert.", x: -750, y: -4200, lvl: 0, pa: [3], tai: 70, cou: "#FFFF00" },

    // Succès Non-Évolutifs
    { id: 3001, name: "Nouvelle Recette Simple", desc: "Apprendre et cuisiner une nouvelle recette simple.", x: -1500, y: -5100, lvl: 1, pa: [3000], tai: 30 },
    { id: 3002, name: "Question du Jour", desc: "Se poser une question profonde sur soi-même ou sur le monde.", x: -1500, y: -4950, lvl: 1, pa: [3000], tai: 30 },
    { id: 3003, name: "Objectif Micro-Apprentissage", desc: "Apprendre un fait nouveau ou une petite compétence chaque jour pendant une semaine.", x: -1500, y: -4800, lvl: 1, pa: [3000], tai: 30 },
    { id: 3004, name: "Gestion du Stress (Base)", desc: "Identifier une source de stress mineur et trouver une petite action pour y remédier.", x: -1500, y: -4650, lvl: 1, pa: [3000], tai: 30 },
    { id: 3005, name: "Curiosité Intellectuelle", desc: "Rechercher la réponse à une question que l'on se pose depuis longtemps.", x: -1500, y: -4500, lvl: 1, pa: [3000], tai: 30 },

    // Succès Évolutifs : Journal de Bord
    { id: 3006, name: "Journal de Bord Niveau 1", desc: "Écrire 5 lignes dans un journal.", x: -1500, y: -4350, lvl: 1, pa: [3000], tai: 30 },
    { id: 3007, name: "Journal de Bord Niveau 2", desc: "Tenir un journal quotidien pendant une semaine, en y notant ses pensées ou événements marquants.", x: -1800, y: -4350, lvl: 2, pa: [3006], tai: 30 },
    { id: 3008, name: "Journal de Bord Niveau 3", desc: "Utiliser son journal pour une réflexion plus approfondie sur un sujet spécifique une fois par semaine pendant un mois.", x: -2100, y: -4350, lvl: 3, pa: [3007], tai: 30 },

    // Succès Évolutifs : Perle de Sagesse
    { id: 3009, name: "Perle de Sagesse Niveau 1", desc: "Lire une citation inspirante et la noter.", x: -1500, y: -4200, lvl: 1, pa: [3000], tai: 30 },
    { id: 3010, name: "Perle de Sagesse Niveau 2", desc: "Réfléchir à la signification d'une citation inspirante et comment l'appliquer dans sa vie.", x: -1800, y: -4200, lvl: 2, pa: [3009], tai: 30 },

    // Succès Évolutifs : Bilan Quotidien Positif
    { id: 3011, name: "Bilan Quotidien Positif Niveau 1", desc: "Noter 3 choses positives de sa journée.", x: -1500, y: -4050, lvl: 1, pa: [3000], tai: 30 },
    { id: 3012, name: "Bilan Quotidien Positif Niveau 2", desc: "Pratiquer la gratitude en notant 3 choses positives chaque jour pendant une semaine.", x: -1800, y: -4050, lvl: 2, pa: [3011], tai: 30 },
    { id: 3013, name: "Bilan Quotidien Positif Niveau 3", desc: "Partager une chose positive de sa journée avec quelqu'un d'autre pendant 3 jours.", x: -2100, y: -4050, lvl: 3, pa: [3012], tai: 30 },

    // Succès Évolutifs : Maîtrise de l'Apprentissage
    { id: 3014, name: "Maîtrise de l'Apprentissage Niveau 1", desc: "Identifier son style d'apprentissage préféré.", x: -1500, y: -3900, lvl: 1, pa: [3000], tai: 30 },
    { id: 3015, name: "Maîtrise de l'Apprentissage Niveau 2", desc: "Appliquer une nouvelle technique d'apprentissage pour une compétence simple.", x: -1800, y: -3900, lvl: 2, pa: [3014], tai: 30 },
    { id: 3016, name: "Maîtrise de l'Apprentissage Niveau 3", desc: "Apprendre efficacement un sujet modérément complexe en utilisant plusieurs techniques.", x: -2100, y: -3900, lvl: 3, pa: [3015], tai: 30 },
    { id: 3017, name: "Maîtrise de l'Apprentissage Niveau 4", desc: "Enseigner un concept simple appris à quelqu'un d'autre.", x: -2400, y: -3900, lvl: 4, pa: [3016], tai: 30 },
    { id: 3018, name: "Maîtrise de l'Apprentissage Niveau 5", desc: "Développer une méthode d'apprentissage personnalisée qui vous aide à acquérir de nouvelles connaissances plus facilement.", x: -2700, y: -3900, lvl: 5, pa: [3017], tai: 30 },

    // Succès Évolutifs : Pensée Positive
    { id: 3019, name: "Pensée Positive Niveau 1", desc: "Reformuler une pensée négative en pensée positive.", x: -1500, y: -3750, lvl: 1, pa: [3000], tai: 30 },
    { id: 3020, name: "Pensée Positive Niveau 2", desc: "Pratiquer la gratitude quotidiennement pendant une semaine.", x: -1800, y: -3750, lvl: 2, pa: [3019], tai: 30 },
    { id: 3021, name: "Pensée Positive Niveau 3", desc: "Identifier les schémas de pensée négatifs et les remplacer consciemment pendant 2 semaines.", x: -2100, y: -3750, lvl: 3, pa: [3020], tai: 30 },
    { id: 3022, name: "Pensée Positive Niveau 4", desc: "Développer une attitude plus positive face aux petits défis quotidiens.", x: -2400, y: -3750, lvl: 4, pa: [3021], tai: 30 },
    { id: 3023, name: "Pensée Positive Niveau 5", desc: "Maintenir un état d'esprit optimiste et résilient la plupart du temps.", x: -2700, y: -3750, lvl: 5, pa: [3022], tai: 30 },

    // Succès Évolutifs : Routine de Réflexion
    { id: 3024, name: "Routine de Réflexion Niveau 1", desc: "Réfléchir 5 minutes à sa journée avant de dormir.", x: -1500, y: -3600, lvl: 1, pa: [3000], tai: 30 },
    { id: 3025, name: "Routine de Réflexion Niveau 2", desc: "Écrire ses pensées et émotions dans un journal pendant une semaine.", x: -1800, y: -3600, lvl: 2, pa: [3024], tai: 30 },
    { id: 3026, name: "Routine de Réflexion Niveau 3", desc: "Mettre en place une routine hebdomadaire de bilan personnel.", x: -2100, y: -3600, lvl: 3, pa: [3025], tai: 30 },
    { id: 3027, name: "Routine de Réflexion Niveau 4", desc: "Utiliser la réflexion pour identifier un domaine d'amélioration et mettre en place une action concrète.", x: -2400, y: -3600, lvl: 4, pa: [3026], tai: 30 },
    { id: 3028, name: "Routine de Réflexion Niveau 5", desc: "Intégrer la réflexion régulière comme un outil pour mieux se connaître et progresser.", x: -2700, y: -3600, lvl: 5, pa: [3027], tai: 30 },

    // Nouveaux succès ajoutés pour la catégorie 3
    { id: 3029, name: "Définition de Valeurs Niveau 1", desc: "Lister 5 valeurs personnelles importantes.", x: -1500, y: -3450, lvl: 1, pa: [3000], tai: 30 },
    { id: 3030, name: "Définition de Valeurs Niveau 2", desc: "Réfléchir à la manière dont une de ces valeurs se manifeste (ou non) dans sa vie quotidienne.", x: -1800, y: -3450, lvl: 2, pa: [3029], tai: 30 },

// ==========================================================================
// Catégorie 4 : Relations Sociales (Moyenne) - PAIRE (Succès à DROITE)
// ==========================================================================
    { id: 4, name: "ROUTE 4", desc: "Débloque la catégorie 'Relations Sociales'.", x: 0, y: -5400, lvl: 0, pa: [0], tai: 150, lig: false, exep: [0], cou: "#FFA500"},

    // SUCCÈS INTERMÉDIAIRE (Pont 4)
    { id: 4000, name: "Accès aux Relations", desc: "Le portail vers des liens sociaux épanouis est ouvert.", x: 750, y: -5400, lvl: 0, pa: [4], tai: 70, cou: "#FFFF00" },

    // Succès Évolutifs (Ordonnés par nombre de niveaux, puis par ordre d'apparition dans la liste fournie)
    // --- Séries à 5 niveaux ---
    { id: 4001, name: "Connexion Empathique Niveau 1", desc: "Reconnaître une émotion chez autrui.", x: 1500, y: -6150, lvl: 1, pa: [4000], tai: 30 },
    { id: 4002, name: "Connexion Empathique Niveau 2", desc: "Valider les sentiments d'une personne en difficulté.", x: 1800, y: -6150, lvl: 2, pa: [4001], tai: 30 },
    { id: 4003, name: "Connexion Empathique Niveau 3", desc: "Répondre avec empathie et compassion à une situation difficile vécue par un proche.", x: 2100, y: -6150, lvl: 3, pa: [4002], tai: 30 },
    { id: 4004, name: "Connexion Empathique Niveau 4", desc: "Être capable de se mettre à la place de l'autre même quand vos opinions divergent sur un sujet.", x: 2400, y: -6150, lvl: 4, pa: [4003], tai: 30 },
    { id: 4005, name: "Connexion Empathique Niveau 5", desc: "Développer une écoute profonde et une meilleure compréhension des besoins et émotions des autres.", x: 2700, y: -6150, lvl: 5, pa: [4004], tai: 30 },

    { id: 4006, name: "Communiquant Efficace Niveau 1", desc: "Exprimer clairement un besoin ou une opinion.", x: 1500, y: -6000, lvl: 1, pa: [4000], tai: 30 },
    { id: 4007, name: "Communiquant Efficace Niveau 2", desc: "Utiliser des \"messages Je\" pour exprimer ses sentiments sans accuser.", x: 1800, y: -6000, lvl: 2, pa: [4006], tai: 30 },
    { id: 4008, name: "Communiquant Efficace Niveau 3", desc: "Résoudre un petit conflit par la communication non-violente.", x: 2100, y: -6000, lvl: 3, pa: [4007], tai: 30 },
    { id: 4009, name: "Communiquant Efficace Niveau 4", desc: "Adapter son style de communication pour mieux se faire comprendre de son interlocuteur.", x: 2400, y: -6000, lvl: 4, pa: [4008], tai: 30 },
    { id: 4010, name: "Communiquant Efficace Niveau 5", desc: "Améliorer sa communication pour construire des relations plus harmonieuses et résoudre les désaccords plus facilement.", x: 2700, y: -6000, lvl: 5, pa: [4009], tai: 30 },

    { id: 4011, name: "Tribu Élargie Niveau 1", desc: "Passer un moment de qualité avec un membre de sa famille éloignée.", x: 1500, y: -5850, lvl: 1, pa: [4000], tai: 30 },
    { id: 4012, name: "Tribu Élargie Niveau 2", desc: "Organiser une petite rencontre pour réunir quelques membres de sa famille ou amis.", x: 1800, y: -5850, lvl: 2, pa: [4011], tai: 30 },
    { id: 4013, name: "Tribu Élargie Niveau 3", desc: "Créer un petit groupe de soutien ou d'intérêt avec des personnes partageant les mêmes valeurs.", x: 2100, y: -5850, lvl: 3, pa: [4012], tai: 30 },
    { id: 4014, name: "Tribu Élargie Niveau 4", desc: "Établir des rituels réguliers de connexion avec un cercle social proche (ex: un dîner mensuel avec des amis).", x: 2400, y: -5850, lvl: 4, pa: [4013], tai: 30 },
    { id: 4015, name: "Tribu Élargie Niveau 5", desc: "Bâtir un réseau de soutien solide et diversifié, et être soi-même un soutien pour son entourage.", x: 2700, y: -5850, lvl: 5, pa: [4014], tai: 30 },

    // --- Séries à 3 niveaux ---
    { id: 4016, name: "Art de l'Écoute Niveau 1", desc: "Écouter attentivement quelqu'un sans l'interrompre pendant 5 minutes.", x: 1500, y: -5700, lvl: 1, pa: [4000], tai: 30 },
    { id: 4017, name: "Art de l'Écoute Niveau 2", desc: "Pratiquer l'écoute active (reformuler, poser des questions de clarification) dans une conversation.", x: 1800, y: -5700, lvl: 2, pa: [4016], tai: 30 },
    { id: 4018, name: "Art de l'Écoute Niveau 3", desc: "Aider quelqu'un à se sentir écouté et compris en pratiquant l'écoute active pendant une conversation importante.", x: 2100, y: -5700, lvl: 3, pa: [4017], tai: 30 },

    // --- Séries à 2 niveaux ---
    { id: 4019, name: "Geste Apprécié Niveau 1", desc: "Faire un compliment sincère à quelqu'un.", x: 1500, y: -5550, lvl: 1, pa: [4000], tai: 30 },
    { id: 4020, name: "Geste Apprécié Niveau 2", desc: "Faire un compliment sincère à 3 personnes différentes en une semaine.", x: 1800, y: -5550, lvl: 2, pa: [4019], tai: 30 },

    { id: 4021, name: "Lien Renforcé Niveau 1", desc: "Partager une expérience personnelle avec quelqu'un pour créer un lien.", x: 1500, y: -5400, lvl: 1, pa: [4000], tai: 30 },
    { id: 4022, name: "Lien Renforcé Niveau 2", desc: "Partager une vulnérabilité ou une expérience significative avec un ami de confiance.", x: 1800, y: -5400, lvl: 2, pa: [4021], tai: 30 },

    { id: 4023, name: "Réseautage Doux Niveau 1", desc: "Se présenter à une nouvelle personne dans un contexte social ou professionnel.", x: 1500, y: -5250, lvl: 1, pa: [4000], tai: 30 },
    { id: 4024, name: "Réseautage Doux Niveau 2", desc: "Faire un suivi amical avec une nouvelle connexion.", x: 1800, y: -5250, lvl: 2, pa: [4023], tai: 30 },

    // Succès Non-Évolutifs
    { id: 4025, name: "Rendez-vous Virtuel", desc: "Appeler ou faire un appel vidéo à un ami ou un membre de la famille.", x: 1500, y: -5100, lvl: 1, pa: [4000], tai: 30 },
    { id: 4026, name: "Pardon du Cœur", desc: "Pardonner mentalement à quelqu'un qui vous a blessé.", x: 1500, y: -4950, lvl: 1, pa: [4000], tai: 30 },
    { id: 4027, name: "Initiateur de Conversation", desc: "Engager la conversation avec un inconnu de manière respectueuse.", x: 1500, y: -4800, lvl: 1, pa: [4000], tai: 30 },
    { id: 4028, name: "Soutien Actif", desc: "Offrir son aide concrète à un ami ou un membre de la famille.", x: 1500, y: -4650, lvl: 1, pa: [4000], tai: 30 },
    { id: 4029, name: "Cercle d'Amis", desc: "Organiser une sortie ou une activité avec un groupe d'amis.", x: 1500, y: -4500, lvl: 1, pa: [4000], tai: 30 },

// ==========================================================================
// Catégorie 5 : Gestion Financière (Moyenne) - IMPAIRE (Succès à GAUCHE)
// ==========================================================================
    { id: 5, name: "ROUTE 5", desc: "Débloque la catégorie 'Gestion Financière'.", x: 0, y: -6600, lvl: 0, pa: [0], tai: 150, lig: false, exep: [0], cou: "#FFA500"},

    // SUCCÈS INTERMÉDIAIRE (Pont 5)
    { id: 5000, name: "Accès aux Finances", desc: "Le portail vers la maîtrise financière est ouvert.", x: -750, y: -6600, lvl: 0, pa: [5], tai: 70, cou: "#FFFF00" },

    // Succès Évolutifs (Ordonnés par nombre de niveaux, puis par ordre d'apparition dans la liste fournie)
    // --- Séries à 5 niveaux ---
    { id: 5001, name: "Investisseur Novice Niveau 1", desc: "Comprendre la différence entre un actif et un passif.", x: -1500, y: -7425, lvl: 1, pa: [5000], tai: 30 },
    { id: 5002, name: "Investisseur Novice Niveau 2", desc: "Ouvrir un livret d'épargne dédié à un objectif spécifique (ex: vacances, achat).", x: -1800, y: -7425, lvl: 2, pa: [5001], tai: 30 },
    { id: 5003, name: "Investisseur Novice Niveau 3", desc: "Lire un livre ou suivre un cours introductif sur l'épargne et les placements de base.", x: -2100, y: -7425, lvl: 3, pa: [5002], tai: 30 },
    { id: 5004, name: "Investisseur Novice Niveau 4", desc: "Faire un premier petit placement (ex: Assurance-Vie, plan d'épargne logement).", x: -2400, y: -7425, lvl: 4, pa: [5003], tai: 30 },
    { id: 5005, name: "Investisseur Novice Niveau 5", desc: "Mettre en place un plan d'épargne régulier pour atteindre un objectif financier à moyen terme (ex: apport immobilier).", x: -2700, y: -7425, lvl: 5, pa: [5004], tai: 30 },

    { id: 5006, name: "Maître de la Dette Niveau 1", desc: "Lister toutes ses dettes (hors prêt immobilier).", x: -1500, y: -7275, lvl: 1, pa: [5000], tai: 30 },
    { id: 5007, name: "Maître de la Dette Niveau 2", desc: "Établir un plan de remboursement pour sa plus petite dette.", x: -1800, y: -7275, lvl: 2, pa: [5006], tai: 30 },
    { id: 5008, name: "Maître de la Dette Niveau 3", desc: "Rembourser une dette (hors prêt immobilier) entièrement.", x: -2100, y: -7275, lvl: 3, pa: [5007], tai: 30 },
    { id: 5009, name: "Maître de la Dette Niveau 4", desc: "Réduire le montant total de ses dettes non hypothécaires de 20%.", x: -2400, y: -7275, lvl: 4, pa: [5008], tai: 30 },
    { id: 5010, name: "Maître de la Dette Niveau 5", desc: "Devenir complètement libre de dettes de consommation.", x: -2700, y: -7275, lvl: 5, pa: [5009], tai: 30 },

    { id: 5011, name: "Indépendance Financière Niveau 1", desc: "Établir un budget qui vous permet de vivre sans stress financier pendant un mois.", x: -1500, y: -7125, lvl: 1, pa: [5000], tai: 30 },
    { id: 5012, name: "Indépendance Financière Niveau 2", desc: "Avoir 3 mois de dépenses essentielles en épargne d'urgence.", x: -1800, y: -7125, lvl: 2, pa: [5011], tai: 30 },
    { id: 5013, name: "Indépendance Financière Niveau 3", desc: "Commencer à épargner pour la retraite.", x: -2100, y: -7125, lvl: 3, pa: [5012], tai: 30 },
    { id: 5014, name: "Indépendance Financière Niveau 4", desc: "Générer un petit revenu supplémentaire passif (ex: vente d'objets, sous-location).", x: -2400, y: -7125, lvl: 4, pa: [5013], tai: 30 },
    { id: 5015, name: "Indépendance Financière Niveau 5", desc: "Atteindre une situation financière stable où vos revenus couvrent confortablement vos dépenses.", x: -2700, y: -7125, lvl: 5, pa: [5014], tai: 30 },

    // --- Séries à 3 niveaux ---
    { id: 5016, name: "Consommateur Averti Niveau 1", desc: "Comparer les prix pour un achat important.", x: -1500, y: -6975, lvl: 1, pa: [5000], tai: 30 },
    { id: 5017, name: "Consommateur Averti Niveau 2", desc: "Identifier 3 dépenses non essentielles et les réduire pendant une semaine.", x: -1800, y: -6975, lvl: 2, pa: [5016], tai: 30 },
    { id: 5018, name: "Consommateur Averti Niveau 3", desc: "Mettre en place une stratégie pour économiser sur un poste de dépense régulier (courses, abonnements).", x: -2100, y: -6975, lvl: 3, pa: [5017], tai: 30 },

    { id: 5019, name: "Discipline Budgétaire Niveau 1", desc: "Ne pas acheter d'article dont tu n'as pas besoin pendant 24 heures.", x: -1500, y: -6825, lvl: 1, pa: [5000], tai: 30 },
    { id: 5020, name: "Discipline Budgétaire Niveau 2", desc: "Suivre ses dépenses pendant une semaine.", x: -1800, y: -6825, lvl: 2, pa: [5019], tai: 30 },
    { id: 5021, name: "Discipline Budgétaire Niveau 3", desc: "Établir un budget mensuel simple et s'y tenir pendant 2 semaines.", x: -2100, y: -6825, lvl: 3, pa: [5020], tai: 30 },

    // --- Séries à 2 niveaux ---
    { id: 5022, name: "Micro-Économie Niveau 1", desc: "Économiser 1 € en apportant son café de la maison.", x: -1500, y: -6675, lvl: 1, pa: [5000], tai: 30 },
    { id: 5023, name: "Micro-Économie Niveau 2", desc: "Réaliser 5 petites économies différentes en une semaine.", x: -1800, y: -6675, lvl: 2, pa: [5022], tai: 30 },

    { id: 5024, name: "Anti-Gaspillage Alimentaire Niveau 1", desc: "Utiliser des restes pour créer un nouveau repas.", x: -1500, y: -6525, lvl: 1, pa: [5000], tai: 30 },
    { id: 5025, name: "Anti-Gaspillage Alimentaire Niveau 2", desc: "Planifier ses repas pour minimiser le gaspillage alimentaire pendant une semaine.", x: -1800, y: -6525, lvl: 2, pa: [5024], tai: 30 },

    // Succès Non-Évolutifs
    { id: 5026, name: "Pécule Imprévu", desc: "Trouver 5 € que tu ne savais pas avoir.", x: -1500, y: -6375, lvl: 1, pa: [5000], tai: 30 },
    { id: 5027, name: "Bilan Rapide", desc: "Vérifier le solde de son compte bancaire.", x: -1500, y: -6225, lvl: 1, pa: [5000], tai: 30 },
    { id: 5028, name: "Objectif d'Épargne Mineur", desc: "Mettre de côté 10€ pour un objectif spécifique.", x: -1500, y: -6075, lvl: 1, pa: [5000], tai: 30 },
    { id: 5029, name: "Connaissance Financière de Base", desc: "Comprendre ce qu'est un taux d'intérêt.", x: -1500, y: -5925, lvl: 1, pa: [5000], tai: 30 },
    { id: 5030, name: "Négociation Douce", desc: "Essayer de négocier une petite réduction sur un achat (respectueusement).", x: -1500, y: -5775, lvl: 1, pa: [5000], tai: 30 },

// ==========================================================================
// Catégorie 6 : Carrière & Professionnel (Moyenne) - PAIRE (Succès à DROITE)
// ==========================================================================
    { id: 6, name: "ROUTE 6", desc: "Débloque la catégorie 'Carrière & Professionnel'.", x: 0, y: -7800, lvl: 0, pa: [0], tai: 150, lig: false, exep: [0], cou: "#FFA500"},

    // SUCCÈS INTERMÉDIAIRE (Pont 6)
    { id: 6000, name: "Accès à la Carrière", desc: "Le portail vers l'épanouissement professionnel est ouvert.", x: 750, y: -7800, lvl: 0, pa: [6], tai: 70, cou: "#FFFF00" },

    // Succès Évolutifs (Ordonnés par nombre de niveaux, puis par ordre d'apparition dans la liste fournie)
    // --- Séries à 5 niveaux ---
    { id: 6001, name: "Expertise Reconnue Niveau 1", desc: "Répondre à une question technique simple d'un collègue.", x: 1500, y: -8550, lvl: 1, pa: [6000], tai: 30 },
    { id: 6002, name: "Expertise Reconnue Niveau 2", desc: "Donner une courte présentation sur un sujet lié à son domaine à un petit groupe.", x: 1800, y: -8550, lvl: 2, pa: [6001], tai: 30 },
    { id: 6003, name: "Expertise Reconnue Niveau 3", desc: "Devenir la personne référente sur un sujet spécifique au sein de son équipe.", x: 2100, y: -8550, lvl: 3, pa: [6002], tai: 30 },
    { id: 6004, name: "Expertise Reconnue Niveau 4", desc: "Rédiger un document ou un guide utile sur son domaine d'expertise pour ses collègues.", x: 2400, y: -8550, lvl: 4, pa: [6003], tai: 30 },
    { id: 6005, name: "Expertise Reconnue Niveau 5", desc: "Être reconnu par ses pairs comme une personne de référence dans un aspect de son domaine professionnel.", x: 2700, y: -8550, lvl: 5, pa: [6004], tai: 30 },

    { id: 6006, name: "Leader Collaboratif Niveau 1", desc: "Déléguer une petite tâche avec succès.", x: 1500, y: -8400, lvl: 1, pa: [6000], tai: 30 },
    { id: 6007, name: "Leader Collaboratif Niveau 2", desc: "Faciliter une réunion d'équipe efficace.", x: 1800, y: -8400, lvl: 2, pa: [6006], tai: 30 },
    { id: 6008, name: "Leader Collaboratif Niveau 3", desc: "Résoudre un petit conflit au sein de son équipe de manière constructive.", x: 2100, y: -8400, lvl: 3, pa: [6007], tai: 30 },
    { id: 6009, name: "Leader Collaboratif Niveau 4", desc: "Motiver son équipe à atteindre un objectif commun.", x: 2400, y: -8400, lvl: 4, pa: [6008], tai: 30 },
    { id: 6010, name: "Leader Collaboratif Niveau 5", desc: "Participer à la réussite d'un projet d'équipe en contribuant positivement à la collaboration.", x: 2700, y: -8400, lvl: 5, pa: [6009], tai: 30 },

    { id: 6011, name: "Marque Personnelle Niveau 1", desc: "Mettre à jour son profil LinkedIn.", x: 1500, y: -8250, lvl: 1, pa: [6000], tai: 30 },
    { id: 6012, name: "Marque Personnelle Niveau 2", desc: "Rédiger une publication pertinente sur son domaine professionnel.", x: 1800, y: -8250, lvl: 2, pa: [6011], tai: 30 },
    { id: 6013, name: "Marque Personnelle Niveau 3", desc: "Obtenir une recommandation sur son profil professionnel.", x: 2100, y: -8250, lvl: 3, pa: [6012], tai: 30 },
    { id: 6014, name: "Marque Personnelle Niveau 4", desc: "Participer activement à des discussions de groupe professionnelles en ligne ou hors ligne.", x: 2400, y: -8250, lvl: 4, pa: [6013], tai: 30 },
    { id: 6015, name: "Marque Personnelle Niveau 5", desc: "Avoir une présence professionnelle en ligne qui reflète ses compétences et son expérience.", x: 2700, y: -8250, lvl: 5, pa: [6014], tai: 30 },

    // --- Séries à 3 niveaux ---
    { id: 6016, name: "Maîtrise Logicielle Niveau 1", desc: "Apprendre à utiliser une nouvelle fonctionnalité d'un logiciel professionnel.", x: 1500, y: -8100, lvl: 1, pa: [6000], tai: 30 },
    { id: 6017, name: "Maîtrise Logicielle Niveau 2", desc: "Utiliser cette nouvelle fonctionnalité pour gagner en efficacité sur une tâche.", x: 1800, y: -8100, lvl: 2, pa: [6016], tai: 30 },
    { id: 6018, name: "Maîtrise Logicielle Niveau 3", desc: "Explorer et maîtriser 3 nouvelles fonctionnalités d'un logiciel clé pour son travail.", x: 2100, y: -8100, lvl: 3, pa: [6017], tai: 30 },

    { id: 6019, name: "Force de Proposition Niveau 1", desc: "Soumettre une idée pour améliorer un processus au travail.", x: 1500, y: -7950, lvl: 1, pa: [6000], tai: 30 },
    { id: 6020, name: "Force de Proposition Niveau 2", desc: "Argumenter son idée et obtenir un premier retour constructif.", x: 1800, y: -7950, lvl: 2, pa: [6019], tai: 30 },
    { id: 6021, name: "Force de Proposition Niveau 3", desc: "Participer à la mise en place d'une amélioration que vous avez suggérée.", x: 2100, y: -7950, lvl: 3, pa: [6020], tai: 30 },

    { id: 6022, name: "Planification Stratégique Niveau 1", desc: "Définir un objectif professionnel S.M.A.R.T.", x: 1500, y: -7800, lvl: 1, pa: [6000], tai: 30 },
    { id: 6023, name: "Planification Stratégique Niveau 2", desc: "Décomposer cet objectif en étapes réalisables.", x: 1800, y: -7800, lvl: 2, pa: [6022], tai: 30 },
    { id: 6024, name: "Planification Stratégique Niveau 3", desc: "Atteindre la première étape de son objectif S.M.A.R.T.", x: 2100, y: -7800, lvl: 3, pa: [6023], tai: 30 },

    // --- Séries à 1 niveau (traitées comme non-évolutifs pour le positionnement) ---
    { id: 6025, name: "Gestion des E-mails Niveau 1", desc: "Traiter sa boîte de réception pour atteindre le \"zéro e-mail non lu\" une fois.", x: 1500, y: -7650, lvl: 1, pa: [6000], tai: 30 }, // Considéré comme 1 niveau pour le tri

    // Succès Non-Évolutifs
    { id: 6026, name: "Mentor Junior", desc: "Donner un conseil utile à un collègue moins expérimenté.", x: 1500, y: -7500, lvl: 1, pa: [6000], tai: 30 },
    { id: 6027, name: "Réseau Actif", desc: "Participer à une discussion professionnelle en ligne.", x: 1500, y: -7350, lvl: 1, pa: [6000], tai: 30 },
    { id: 6028, name: "Veille Informative", desc: "Lire un article ou écouter un podcast pertinent pour son secteur d'activité.", x: 1500, y: -7200, lvl: 1, pa: [6000], tai: 30 },
    { id: 6029, name: "Organisation de Fichiers Numériques", desc: "Organiser ses fichiers professionnels sur son ordinateur.", x: 1500, y: -7050, lvl: 1, pa: [6000], tai: 30 },
    { id: 6030, name: "Préparation de Réunion", desc: "Préparer un ordre du jour ou des points clés avant une réunion importante.", x: 1500, y: -6900, lvl: 1, pa: [6000], tai: 30 },
    { id: 6031, name: "Feedback Constructif (Recevoir)", desc: "Demander un retour constructif sur son travail à un collègue ou supérieur.", x: 1500, y: -6750, lvl: 1, pa: [6000], tai: 30 },

// ==========================================================================
// Catégorie 7 : Créativité & Expression (Moyenne-Difficile) - IMPAIRE (Succès à GAUCHE)
// ==========================================================================
    { id: 7, name: "ROUTE 7", desc: "Débloque la catégorie 'Créativité & Expression'.", x: 0, y: -9000, lvl: 0, pa: [0], tai: 150, lig: false, exep: [0], cou: "#FFA500"},

    // SUCCÈS INTERMÉDIAIRE (Pont 7)
    { id: 7000, name: "Accès à la Créativité", desc: "Le portail vers l'expression artistique est ouvert.", x: -750, y: -9000, lvl: 0, pa: [7], tai: 70, cou: "#FFFF00" },

    // Succès Évolutifs (Ordonnés par nombre de niveaux, puis par ordre d'apparition dans la liste fournie pour le positionnement vertical)
    // --- Séries à 5 niveaux ---
    { id: 7001, name: "Maître de l'Instrument Niveau 1", desc: "Apprendre un accord simple sur un instrument de musique.", x: -1500, y: -9900, lvl: 1, pa: [7000], tai: 30 },
    { id: 7002, name: "Maître de l'Instrument Niveau 2", desc: "Jouer une mélodie simple sur un instrument.", x: -1800, y: -9900, lvl: 2, pa: [7001], tai: 30 },
    { id: 7003, name: "Maître de l'Instrument Niveau 3", desc: "Jouer un morceau complet avec un instrument.", x: -2100, y: -9900, lvl: 3, pa: [7002], tai: 30 },
    { id: 7004, name: "Maître de l'Instrument Niveau 4", desc: "Créer une courte séquence musicale ou une petite composition originale.", x: -2400, y: -9900, lvl: 4, pa: [7003], tai: 30 },
    { id: 7005, name: "Maître de l'Instrument Niveau 5", desc: "Jouer un morceau pour ses amis ou sa famille.", x: -2700, y: -9900, lvl: 5, pa: [7004], tai: 30 },

    { id: 7006, name: "Conte Légendaire Niveau 1", desc: "Écrire le début d'une histoire.", x: -1500, y: -9750, lvl: 1, pa: [7000], tai: 30 },
    { id: 7007, name: "Conte Légendaire Niveau 2", desc: "Développer des personnages ou un univers simple pour une histoire.", x: -1800, y: -9750, lvl: 2, pa: [7006], tai: 30 },
    { id: 7008, name: "Conte Légendaire Niveau 3", desc: "Écrire une nouvelle complète.", x: -2100, y: -9750, lvl: 3, pa: [7007], tai: 30 },
    { id: 7009, name: "Conte Légendaire Niveau 4", desc: "Recevoir des retours constructifs sur son écriture et les appliquer à une révision.", x: -2400, y: -9750, lvl: 4, pa: [7008], tai: 30 },
    { id: 7010, name: "Conte Légendaire Niveau 5", desc: "Partager une de ses créations littéraires avec un petit public (blog, cercle d'amis).", x: -2700, y: -9750, lvl: 5, pa: [7009], tai: 30 },

    { id: 7011, name: "Pinceau Magique Niveau 1", desc: "Esquisser un objet ou un visage.", x: -1500, y: -9600, lvl: 1, pa: [7000], tai: 30 },
    { id: 7012, name: "Pinceau Magique Niveau 2", desc: "Réaliser une petite peinture ou un dessin avec des couleurs.", x: -1800, y: -9600, lvl: 2, pa: [7011], tai: 30 },
    { id: 7013, name: "Pinceau Magique Niveau 3", desc: "Compléter une œuvre d'art qui te satisfait pleinement.", x: -2100, y: -9600, lvl: 3, pa: [7012], tai: 30 },
    { id: 7014, name: "Pinceau Magique Niveau 4", desc: "Apprendre une nouvelle technique artistique simple (ex: ombrage, mélange de couleurs).", x: -2400, y: -9600, lvl: 4, pa: [7013], tai: 30 },
    { id: 7015, name: "Pinceau Magique Niveau 5", desc: "Offrir une de ses créations artistiques à un proche.", x: -2700, y: -9600, lvl: 5, pa: [7014], tai: 30 },

    // --- Séries à 3 niveaux ---
    { id: 7016, name: "Gribouillage Inspiré Niveau 1", desc: "Faire un dessin sans but précis.", x: -1500, y: -9450, lvl: 1, pa: [7000], tai: 30 },
    { id: 7017, name: "Gribouillage Inspiré Niveau 2", desc: "Consacrer 15 minutes à dessiner librement pour explorer des idées.", x: -1800, y: -9450, lvl: 2, pa: [7016], tai: 30 },
    { id: 7018, name: "Gribouillage Inspiré Niveau 3", desc: "Remplir une page de carnet avec des doodles ou des esquisses.", x: -2100, y: -9450, lvl: 3, pa: [7017], tai: 30 },

    { id: 7019, name: "Œil Artistique Niveau 1", desc: "Prendre une photo qui te plaît esthétiquement.", x: -1500, y: -9300, lvl: 1, pa: [7000], tai: 30 },
    { id: 7020, name: "Œil Artistique Niveau 2", desc: "Prendre 5 photos sur un thème précis.", x: -1800, y: -9300, lvl: 2, pa: [7019], tai: 30 },
    { id: 7021, name: "Œil Artistique Niveau 3", desc: "Apprendre une règle de composition photographique simple et l'appliquer.", x: -2100, y: -9300, lvl: 3, pa: [7020], tai: 30 },

    // --- Séries à 2 niveaux ---
    { id: 7022, name: "Mélodie du Moment Niveau 1", desc: "Créer une petite mélodie ou des paroles.", x: -1500, y: -9150, lvl: 1, pa: [7000], tai: 30 },
    { id: 7023, name: "Mélodie du Moment Niveau 2", desc: "Enregistrer sa petite création musicale (même avec son téléphone).", x: -1800, y: -9150, lvl: 2, pa: [7022], tai: 30 },

    // --- Séries à 1 niveau (traitées comme non-évolutifs pour le positionnement) ---
    { id: 7024, name: "Défi Créatif Quotidien Niveau 1", desc: "Créer quelque chose de petit chaque jour pendant 3 jours (un dessin, un paragraphe, une mélodie).", x: -1500, y: -9000, lvl: 1, pa: [7000], tai: 30 },

    // Succès Non-Évolutifs
    { id: 7025, name: "Recyclage Créatif", desc: "Détourner un objet de son usage initial pour en faire quelque chose d'autre.", x: -1500, y: -8850, lvl: 1, pa: [7000], tai: 30 },
    { id: 7026, name: "Danse Spontanée", desc: "Danser sans se soucier du regard des autres pendant 5 minutes.", x: -1500, y: -8700, lvl: 1, pa: [7000], tai: 30 },
    { id: 7027, name: "Journal Créatif", desc: "Tenir un carnet d'idées ou d'inspirations créatives pendant une semaine.", x: -1500, y: -8550, lvl: 1, pa: [7000], tai: 30 },
    { id: 7028, name: "Exploration Artistique", desc: "Visiter une galerie d'art, un musée ou assister à un spectacle vivant.", x: -1500, y: -8400, lvl: 1, pa: [7000], tai: 30 },
    { id: 7029, name: "Combinaison Inattendue", desc: "Essayer de combiner deux formes d'art différentes (ex: écrire un poème sur une musique).", x: -1500, y: -8250, lvl: 1, pa: [7000], tai: 30 },
    { id: 7030, name: "Partage de Création", desc: "Montrer une de ses créations (même inachevée) à un ami pour un retour.", x: -1500, y: -8100, lvl: 1, pa: [7000], tai: 30 },

// ==========================================================================
// Catégorie 8 : Aventure & Exploration (Difficile) - PAIRE (Succès à DROITE)
// ==========================================================================
    { id: 8, name: "ROUTE 8", desc: "Débloque la catégorie 'Aventure & Exploration'.", x: 0, y: -10200, lvl: 0, pa: [0], tai: 150, lig: false, exep: [0], cou: "#FFA500"},

    // SUCCÈS INTERMÉDIAIRE (Pont 8)
    { id: 8000, name: "Accès à l'Aventure", desc: "Le portail vers l'inconnu et la découverte est ouvert.", x: 750, y: -10200, lvl: 0, pa: [8], tai: 70, cou: "#FFFF00" },

    // Succès Évolutifs (Ordonnés par nombre de niveaux, puis par ordre d'apparition dans la liste fournie pour le positionnement vertical)
    // --- Séries à 5 niveaux ---
    { id: 8001, name: "Explorateur Local Niveau 1", desc: "Visiter un musée ou un monument de sa ville/région.", x: 1500, y: -11100, lvl: 1, pa: [8000], tai: 30 },
    { id: 8002, name: "Explorateur Local Niveau 2", desc: "Faire une excursion d'une journée dans un endroit que tu ne connais pas à moins de 100 km.", x: 1800, y: -11100, lvl: 2, pa: [8001], tai: 30 },
    { id: 8003, name: "Explorateur Local Niveau 3", desc: "Découvrir un lieu caché ou peu connu dans ta région.", x: 2100, y: -11100, lvl: 3, pa: [8002], tai: 30 },
    { id: 8004, name: "Explorateur Local Niveau 4", desc: "Organiser une petite aventure d'un week-end pour explorer une région voisine.", x: 2400, y: -11100, lvl: 4, pa: [8003], tai: 30 },
    { id: 8005, name: "Explorateur Local Niveau 5", desc: "Partager tes découvertes locales avec d'autres personnes (blog, photos, bouche-à-oreille).", x: 2700, y: -11100, lvl: 5, pa: [8004], tai: 30 },

    { id: 8006, name: "Survie en Milieu Hostile Niveau 1", desc: "Apprendre à faire un nœud essentiel (ex: nœud de chaise).", x: 1500, y: -10950, lvl: 1, pa: [8000], tai: 30 },
    { id: 8007, name: "Survie en Milieu Hostile Niveau 2", desc: "Allumer un feu avec des allumettes ou un briquet, en utilisant des éléments naturels pour l'alimenter.", x: 1800, y: -10950, lvl: 2, pa: [8006], tai: 30 },
    { id: 8008, name: "Survie en Milieu Hostile Niveau 3", desc: "Passer une nuit en pleine nature avec un équipement de camping simple.", x: 2100, y: -10950, lvl: 3, pa: [8007], tai: 30 },
    { id: 8009, name: "Survie en Milieu Hostile Niveau 4", desc: "Apprendre à identifier 3 plantes comestibles sauvages de sa région.", x: 2400, y: -10950, lvl: 4, pa: [8008], tai: 30 },
    { id: 8010, name: "Survie en Milieu Hostile Niveau 5", desc: "Participer à une sortie nature guidée pour apprendre des bases de survie.", x: 2700, y: -10950, lvl: 5, pa: [8009], tai: 30 },

    { id: 8011, name: "Aventure Transfrontalière Niveau 1", desc: "Visiter une ville frontalière d'un pays voisin.", x: 1500, y: -10800, lvl: 1, pa: [8000], tai: 30 },
    { id: 8012, name: "Aventure Transfrontalière Niveau 2", desc: "Traverser une frontière terrestre ou maritime pour la première fois.", x: 1800, y: -10800, lvl: 2, pa: [8011], tai: 30 },
    { id: 8013, name: "Aventure Transfrontalière Niveau 3", desc: "Organiser un voyage dans un pays où la langue est différente, mais où l'on peut se débrouiller en anglais.", x: 2100, y: -10800, lvl: 3, pa: [8012], tai: 30 },
    { id: 8014, name: "Aventure Transfrontalière Niveau 4", desc: "Passer une semaine dans un pays étranger en découvrant sa culture.", x: 2400, y: -10800, lvl: 4, pa: [8013], tai: 30 },
    { id: 8015, name: "Aventure Transfrontalière Niveau 5", desc: "Voyager en groupe dans un pays étranger et gérer les aspects logistiques.", x: 2700, y: -10800, lvl: 5, pa: [8014], tai: 30 },

    // --- Séries à 3 niveaux ---
    { id: 8016, name: "Exploration Quotidienne Niveau 1", desc: "Prendre un chemin différent pour aller au travail/à la maison.", x: 1500, y: -10650, lvl: 1, pa: [8000], tai: 30 },
    { id: 8017, name: "Exploration Quotidienne Niveau 2", desc: "Découvrir un nouveau café, parc ou magasin dans son quartier.", x: 1800, y: -10650, lvl: 2, pa: [8016], tai: 30 },
    { id: 8018, name: "Exploration Quotidienne Niveau 3", desc: "Explorer un quartier de sa ville que l'on connaît peu.", x: 2100, y: -10650, lvl: 3, pa: [8017], tai: 30 },

    { id: 8019, name: "Palais Aventurier Niveau 1", desc: "Goûter à un plat que tu n'as jamais mangé.", x: 1500, y: -10500, lvl: 1, pa: [8000], tai: 30 },
    { id: 8020, name: "Palais Aventurier Niveau 2", desc: "Essayer un type de cuisine étrangère que l'on ne connaît pas.", x: 1800, y: -10500, lvl: 2, pa: [8019], tai: 30 },
    { id: 8021, name: "Palais Aventurier Niveau 3", desc: "Cuisiner un plat d'une culture différente de la sienne.", x: 2100, y: -10500, lvl: 3, pa: [8020], tai: 30 },

    // --- Séries à 2 niveaux ---
    { id: 8022, name: "Défi Physique Mineur Niveau 1", desc: "Monter une côte raide à pied ou en vélo.", x: 1500, y: -10350, lvl: 1, pa: [8000], tai: 30 },
    { id: 8023, name: "Défi Physique Mineur Niveau 2", desc: "Faire une petite randonnée de 30 minutes dans un parc ou en nature.", x: 1800, y: -10350, lvl: 2, pa: [8022], tai: 30 },

    // Succès Non-Évolutifs
    { id: 8024, name: "Nuit Sous les Étoiles (version simplifiée)", desc: "Observer les étoiles loin de la pollution lumineuse.", x: 1500, y: -10200, lvl: 1, pa: [8000], tai: 30 },
    { id: 8025, name: "Cartographe en Herbe", desc: "Étudier une carte d'une région inconnue.", x: 1500, y: -10050, lvl: 1, pa: [8000], tai: 30 },
    { id: 8026, name: "Micro-Aventure Urbaine", desc: "Explorer sa ville comme un touriste pendant une demi-journée.", x: 1500, y: -9900, lvl: 1, pa: [8000], tai: 30 },
    { id: 8027, name: "Apprentissage Linguistique de Voyage", desc: "Apprendre 5 phrases utiles dans la langue d'un pays que l'on souhaite visiter.", x: 1500, y: -9750, lvl: 1, pa: [8000], tai: 30 },
    { id: 8028, name: "Planification de Rêve", desc: "Commencer à planifier un voyage majeur (même s'il est lointain).", x: 1500, y: -9600, lvl: 1, pa: [8000], tai: 30 },
    { id: 8029, name: "Cuisine du Monde à la Maison", desc: "Cuisiner un plat typique d'un pays que l'on n'a jamais visité.", x: 1500, y: -9450, lvl: 1, pa: [8000], tai: 30 },
    { id: 8030, name: "Récit d'Aventure", desc: "Raconter une de ses aventures (même petite) à quelqu'un.", x: 1500, y: -9300, lvl: 1, pa: [8000], tai: 30 },

// ==========================================================================
// Catégorie 9 : Compétences Pratiques (Difficile) - IMPAIRE (Succès à GAUCHE)
// ==========================================================================
    { id: 9, name: "ROUTE 9", desc: "Débloque la catégorie 'Compétences Pratiques'.", x: 0, y: -11400, lvl: 0, pa: [0], tai: 150, lig: false, exep: [0], cou: "#FFA500"},

    // SUCCÈS INTERMÉDIAIRE (Pont 9)
    { id: 9000, name: "Accès aux Compétences", desc: "Le portail vers le savoir-faire pratique est ouvert.", x: -750, y: -11400, lvl: 0, pa: [9], tai: 70, cou: "#FFFF00" },

    // Succès Évolutifs (Ordonnés par nombre de niveaux, puis par ordre d'apparition dans la liste fournie pour le positionnement vertical)
    // --- Séries à 5 niveaux ---
    { id: 9001, name: "Maître Artisanat Niveau 1", desc: "Réparer un petit appareil électroménager simple (ex: changer une pile, réparer un fil).", x: -1500, y: -12300, lvl: 1, pa: [9000], tai: 30 },
    { id: 9002, name: "Maître Artisanat Niveau 2", desc: "Assembler un meuble en kit sans aucune aide.", x: -1800, y: -12300, lvl: 2, pa: [9001], tai: 30 },
    { id: 9003, name: "Maître Artisanat Niveau 3", desc: "Effectuer une tâche de plomberie ou d'électricité simple (ex: changer un joint de robinet, remplacer une ampoule).", x: -2100, y: -12300, lvl: 3, pa: [9002], tai: 30 },
    { id: 9004, name: "Maître Artisanat Niveau 4", desc: "Réaliser une petite réparation ou amélioration dans son logement (ex: accrocher un tableau, repeindre un mur).", x: -2400, y: -12300, lvl: 4, pa: [9003], tai: 30 },
    { id: 9005, name: "Maître Artisanat Niveau 5", desc: "Mettre en place un système de rangement ou une petite étagère DIY.", x: -2700, y: -12300, lvl: 5, pa: [9004], tai: 30 },

    { id: 9006, name: "Autonomie Énergétique Niveau 1", desc: "Réduire sa consommation d'énergie de 5% en un mois.", x: -1500, y: -12150, lvl: 1, pa: [9000], tai: 30 },
    { id: 9007, name: "Autonomie Énergétique Niveau 2", desc: "Comprendre les différentes sources d'énergie de sa maison et optimiser leur utilisation.", x: -1800, y: -12150, lvl: 2, pa: [9006], tai: 30 },
    { id: 9008, name: "Autonomie Énergétique Niveau 3", desc: "Installer un petit dispositif d'économie d'énergie (ex: minuterie pour l'éclairage, mousseurs pour robinets).", x: -2100, y: -12150, lvl: 3, pa: [9007], tai: 30 },
    { id: 9009, name: "Autonomie Énergétique Niveau 4", desc: "Réduire sa consommation d'eau de 10% en un mois.", x: -2400, y: -12150, lvl: 4, pa: [9008], tai: 30 },
    { id: 9010, name: "Autonomie Énergétique Niveau 5", desc: "Adopter des gestes simples pour une meilleure efficacité énergétique au quotidien.", x: -2700, y: -12150, lvl: 5, pa: [9009], tai: 30 },

    { id: 9011, name: "Maître des Éléments Niveau 1", desc: "Comprendre la météo et ses prévisions de base.", x: -1500, y: -12000, lvl: 1, pa: [9000], tai: 30 },
    { id: 9012, name: "Maître des Éléments Niveau 2", desc: "Apprendre à identifier 3 plantes ou animaux de sa région.", x: -1800, y: -12000, lvl: 2, pa: [9011], tai: 30 },
    { id: 9013, name: "Maître des Éléments Niveau 3", desc: "Préparer un kit d'urgence de base pour la maison (eau, nourriture, lampe).", x: -2100, y: -12000, lvl: 3, pa: [9012], tai: 30 },
    { id: 9014, name: "Maître des Éléments Niveau 4", desc: "Apprendre à reconnaître les constellations principales dans le ciel nocturne.", x: -2400, y: -12000, lvl: 4, pa: [9013], tai: 30 },
    { id: 9015, name: "Maître des Éléments Niveau 5", desc: "Acquérir des connaissances de base sur la nature et l'environnement local.", x: -2700, y: -12000, lvl: 5, pa: [9014], tai: 30 },

    // --- Séries à 3 niveaux ---
    { id: 9016, name: "Réparation Express Niveau 1", desc: "Visser une vis lâche ou resserrer un écrou.", x: -1500, y: -11850, lvl: 1, pa: [9000], tai: 30 },
    { id: 9017, name: "Réparation Express Niveau 2", desc: "Changer une ampoule ou une pile.", x: -1800, y: -11850, lvl: 2, pa: [9016], tai: 30 },
    { id: 9018, name: "Réparation Express Niveau 3", desc: "Déboucher un évier ou des toilettes avec des méthodes simples.", x: -2100, y: -11850, lvl: 3, pa: [9017], tai: 30 },

    { id: 9019, name: "Secouriste en Devenir Niveau 1", desc: "Apprendre à faire un pansement ou une attelle simple.", x: -1500, y: -11700, lvl: 1, pa: [9000], tai: 30 },
    { id: 9020, name: "Secouriste en Devenir Niveau 2", desc: "Connaître les numéros d'urgence et savoir quand les appeler.", x: -1800, y: -11700, lvl: 2, pa: [9019], tai: 30 },
    { id: 9021, name: "Secouriste en Devenir Niveau 3", desc: "Suivre une formation de base aux premiers secours (ex: PSC1).", x: -2100, y: -11700, lvl: 3, pa: [9020], tai: 30 },

    { id: 9022, name: "Main Verte Débutant Niveau 1", desc: "Planter une graine et la faire germer.", x: -1500, y: -11550, lvl: 1, pa: [9000], tai: 30 },
    { id: 9023, name: "Main Verte Débutant Niveau 2", desc: "Entretenir une plante d'intérieur pendant un mois.", x: -1800, y: -11550, lvl: 2, pa: [9022], tai: 30 },
    { id: 9024, name: "Main Verte Débutant Niveau 3", desc: "Récolter quelque chose de son propre petit jardin ou pot (herbes, tomate cerise).", x: -2100, y: -11550, lvl: 3, pa: [9023], tai: 30 },

    // Succès Non-Évolutifs
    { id: 9025, name: "Calcul Mental", desc: "Faire un calcul simple de tête sans calculatrice.", x: -1500, y: -11400, lvl: 1, pa: [9000], tai: 30 },
    { id: 9026, name: "Orientation Facile", desc: "Lire une carte papier pour se repérer dans un lieu inconnu.", x: -1500, y: -11250, lvl: 1, pa: [9000], tai: 30 },
    { id: 9027, name: "Bricolage Utile", desc: "Réparer un objet du quotidien au lieu de le jeter.", x: -1500, y: -11100, lvl: 1, pa: [9000], tai: 30 },
    { id: 9028, name: "Connaissance des Outils", desc: "Apprendre le nom et l'usage de 5 outils de base.", x: -1500, y: -10950, lvl: 1, pa: [9000], tai: 30 },
    { id: 9029, name: "Optimisation d'Espace", desc: "Réorganiser un espace de rangement pour le rendre plus fonctionnel.", x: -1500, y: -10800, lvl: 1, pa: [9000], tai: 30 },
    { id: 9030, name: "Recette de Grand-Mère", desc: "Apprendre à faire une recette traditionnelle transmise dans sa famille.", x: -1500, y: -10650, lvl: 1, pa: [9000], tai: 30 },
    { id: 9031, name: "Préparation aux Imprévus", desc: "Vérifier les dates de péremption de sa trousse de premiers secours.", x: -1500, y: -10500, lvl: 1, pa: [9000], tai: 30 },

// ==========================================================================
// Catégorie 10 : Philanthropie & Impact (Difficile) - PAIRE (Succès à DROITE)
// ==========================================================================
    { id: 10, name: "ROUTE 10", desc: "Débloque la catégorie 'Philanthropie & Impact'.", x: 0, y: -12600, lvl: 0, pa: [0], tai: 150, lig: false, exep: [0], cou: "#FFA500"},

    // SUCCÈS INTERMÉDIAIRE (Pont 10)
    { id: 10000, name: "Accès à l'Impact", desc: "Le portail vers la contribution positive au monde est ouvert.", x: 750, y: -12600, lvl: 0, pa: [10], tai: 70, cou: "#FFFF00" },

    // Succès Évolutifs (Ordonnés par nombre de niveaux, puis par ordre d'apparition dans la liste fournie pour le positionnement vertical)
    // --- Séries à 5 niveaux ---
    { id: 10001, name: "Bâtisseur de Communauté Niveau 1", desc: "Participer à une réunion de quartier ou d'association locale.", x: 1500, y: -13500, lvl: 1, pa: [10000], tai: 30 },
    { id: 10002, name: "Bâtisseur de Communauté Niveau 2", desc: "S'impliquer activement dans un petit projet local (ex: nettoyage de parc).", x: 1800, y: -13500, lvl: 2, pa: [10001], tai: 30 },
    { id: 10003, name: "Bâtisseur de Communauté Niveau 3", desc: "Proposer une petite initiative qui rassemble les membres de sa communauté (ex: un pique-nique).", x: 2100, y: -13500, lvl: 3, pa: [10002], tai: 30 },
    { id: 10004, name: "Bâtisseur de Communauté Niveau 4", desc: "Aider à résoudre un petit problème identifié dans sa communauté.", x: 2400, y: -13500, lvl: 4, pa: [10003], tai: 30 },
    { id: 10005, name: "Bâtisseur de Communauté Niveau 5", desc: "Contribuer régulièrement à l'amélioration de son quartier ou de sa communauté locale.", x: 2700, y: -13500, lvl: 5, pa: [10004], tai: 30 },

    { id: 10006, name: "Éveil Écologique Niveau 1", desc: "Réduire sa consommation de plastique à usage unique pendant une semaine.", x: 1500, y: -13350, lvl: 1, pa: [10000], tai: 30 },
    { id: 10007, name: "Éveil Écologique Niveau 2", desc: "Composter ses déchets organiques pendant un mois.", x: 1800, y: -13350, lvl: 2, pa: [10006], tai: 30 },
    { id: 10008, name: "Éveil Écologique Niveau 3", desc: "Sensibiliser son entourage à une cause écologique par des actions concrètes (ex: tri, compostage).", x: 2100, y: -13350, lvl: 3, pa: [10007], tai: 30 },
    { id: 10009, name: "Éveil Écologique Niveau 4", desc: "Participer à une petite action de nettoyage environnemental.", x: 2400, y: -13350, lvl: 4, pa: [10008], tai: 30 },
    { id: 10010, name: "Éveil Écologique Niveau 5", desc: "Adopter un mode de vie plus respectueux de l'environnement au quotidien.", x: 2700, y: -13350, lvl: 5, pa: [10009], tai: 30 },

    { id: 10011, name: "Donateur Engagé Niveau 1", desc: "Faire un don financier régulier à une association caritative.", x: 1500, y: -13200, lvl: 1, pa: [10000], tai: 30 },
    { id: 10012, name: "Donateur Engagé Niveau 2", desc: "Participer à une petite campagne de financement pour une cause qui vous tient à cœur.", x: 1800, y: -13200, lvl: 2, pa: [10011], tai: 30 },
    { id: 10013, name: "Donateur Engagé Niveau 3", desc: "Offrir son temps ou ses compétences bénévolement pour une association (quelques heures).", x: 2100, y: -13200, lvl: 3, pa: [10012], tai: 30 },
    { id: 10014, name: "Donateur Engagé Niveau 4", desc: "Organiser une petite collecte de fonds ou de biens pour une cause.", x: 2400, y: -13200, lvl: 4, pa: [10013], tai: 30 },
    { id: 10015, name: "Donateur Engagé Niveau 5", desc: "Soutenir activement une cause ou une association qui vous tient à cœur.", x: 2700, y: -13200, lvl: 5, pa: [10014], tai: 30 },

    // --- Séries à 3 niveaux ---
    { id: 10016, name: "Gardien de la Planète (Mini) Niveau 1", desc: "Ramasser un déchet par terre.", x: 1500, y: -13050, lvl: 1, pa: [10000], tai: 30 },
    { id: 10017, name: "Gardien de la Planète (Mini) Niveau 2", desc: "Participer à un petit effort de tri ou de recyclage supplémentaire.", x: 1800, y: -13050, lvl: 2, pa: [10016], tai: 30 },
    { id: 10018, name: "Gardien de la Planète (Mini) Niveau 3", desc: "Éviter d'utiliser un sac plastique à usage unique en faisant ses courses.", x: 2100, y: -13050, lvl: 3, pa: [10017], tai: 30 },

    // --- Séries à 2 niveaux ---
    { id: 10019, name: "Rayon de Soleil Niveau 1", desc: "Faire sourire un inconnu.", x: 1500, y: -12900, lvl: 1, pa: [10000], tai: 30 },
    { id: 10020, name: "Rayon de Soleil Niveau 2", desc: "Avoir une interaction positive et brève avec 3 inconnus dans la journée.", x: 1800, y: -12900, lvl: 2, pa: [10019], tai: 30 },

    { id: 10021, name: "Pédagogue du Quotidien Niveau 1", desc: "Expliquer quelque chose à quelqu'un qui a du mal à comprendre.", x: 1500, y: -12750, lvl: 1, pa: [10000], tai: 30 },
    { id: 10022, name: "Pédagogue du Quotidien Niveau 2", desc: "Partager une astuce ou une connaissance utile avec un ami ou un collègue.", x: 1800, y: -12750, lvl: 2, pa: [10021], tai: 30 },

    // --- Séries à 1 niveau (traitées comme non-évolutifs pour le positionnement) ---
    { id: 10023, name: "Consomm'acteur Niveau 1", desc: "Choisir un produit issu du commerce équitable ou d'une entreprise éthique.", x: 1500, y: -12600, lvl: 1, pa: [10000], tai: 30 },

    // Succès Non-Évolutifs
    { id: 10024, name: "Encouragement Sincère", desc: "Encourager quelqu'un qui se sent découragé.", x: 1500, y: -12450, lvl: 1, pa: [10000], tai: 30 },
    { id: 10025, name: "Don de Temps Minimum", desc: "Offrir 15 minutes de son temps à quelqu'un dans le besoin.", x: 1500, y: -12300, lvl: 1, pa: [10000], tai: 30 },
    { id: 10026, name: "Micro-Bénévolat", desc: "Consacrer 1 heure à une action bénévole en ligne ou locale.", x: 1500, y: -12150, lvl: 1, pa: [10000], tai: 30 },
    { id: 10027, name: "Partage de Compétences (Philanthropie)", desc: "Offrir d'aider quelqu'un gratuitement grâce à une de ses compétences.", x: 1500, y: -12000, lvl: 1, pa: [10000], tai: 30 },
    { id: 10028, name: "Sensibilisation Discrète", desc: "Porter un badge ou un accessoire soutenant une cause.", x: 1500, y: -11850, lvl: 1, pa: [10000], tai: 30 },
    { id: 10029, name: "Réduction d'Empreinte (Transport)", desc: "Choisir un mode de transport plus écologique pour un trajet habituel.", x: 1500, y: -11700, lvl: 1, pa: [10000], tai: 30 },

// ==========================================================================
// Catégorie 11 : Maîtrise de Soi & Résilience (Très Difficile) - IMPAIRE (Succès à GAUCHE)
// ==========================================================================
    { id: 11, name: "ROUTE 11", desc: "Débloque la catégorie 'Maîtrise de Soi & Résilience'.", x: 0, y: -13800, lvl: 0, pa: [0], tai: 150, lig: false, exep: [0], cou: "#FFA500"},

    // SUCCÈS INTERMÉDIAIRE (Pont 11)
    { id: 11000, name: "Accès à la Maîtrise", desc: "Le portail vers la force intérieure et la résilience est ouvert.", x: -750, y: -13800, lvl: 0, pa: [11], tai: 70, cou: "#FFFF00" },

    // Succès Évolutifs (Ordonnés par nombre de niveaux, puis par ordre d'apparition dans la liste fournie pour le positionnement vertical)
    // --- Séries à 5 niveaux ---
    { id: 11001, name: "Forteresse Mentale Niveau 1", desc: "Gérer une critique négative sans se mettre sur la défensive.", x: -1500, y: -14700, lvl: 1, pa: [11000], tai: 30 },
    { id: 11002, name: "Forteresse Mentale Niveau 2", desc: "Maintenir sa concentration sur une tâche difficile malgré les distractions.", x: -1800, y: -14700, lvl: 2, pa: [11001], tai: 30 },
    { id: 11003, name: "Forteresse Mentale Niveau 3", desc: "Travailler sur un projet qui connaît des revers et persévérer jusqu'à son achèvement.", x: -2100, y: -14700, lvl: 3, pa: [11002], tai: 30 },
    { id: 11004, name: "Forteresse Mentale Niveau 4", desc: "Garder son calme et sa lucidité face à une situation de stress quotidien.", x: -2400, y: -14700, lvl: 4, pa: [11003], tai: 30 },
    { id: 11005, name: "Forteresse Mentale Niveau 5", desc: "Développer une meilleure capacité à gérer les défis et les frustrations sans se laisser déborder.", x: -2700, y: -14700, lvl: 5, pa: [11004], tai: 30 },

    { id: 11006, name: "Maître des Habitudes Niveau 1", desc: "Maintenir une nouvelle habitude positive pendant 21 jours.", x: -1500, y: -14550, lvl: 1, pa: [11000], tai: 30 },
    { id: 11007, name: "Maître des Habitudes Niveau 2", desc: "Éliminer une mauvaise habitude pendant 30 jours.", x: -1800, y: -14550, lvl: 2, pa: [11006], tai: 30 },
    { id: 11008, name: "Maître des Habitudes Niveau 3", desc: "Mettre en place et maintenir 3 nouvelles habitudes essentielles pendant 2 mois.", x: -2100, y: -14550, lvl: 3, pa: [11007], tai: 30 },
    { id: 11009, name: "Maître des Habitudes Niveau 4", desc: "Changer un comportement qui vous était nuisible pendant plusieurs mois.", x: -2400, y: -14550, lvl: 4, pa: [11008], tai: 30 },
    { id: 11010, name: "Maître des Habitudes Niveau 5", desc: "Avoir un ensemble de routines et d'habitudes qui soutiennent votre bien-être et vos objectifs.", x: -2700, y: -14550, lvl: 5, pa: [11009], tai: 30 },

    { id: 11011, name: "Force Intérieure Niveau 1", desc: "Identifier et nommer une émotion forte que vous ressentez.", x: -1500, y: -14400, lvl: 1, pa: [11000], tai: 30 },
    { id: 11012, name: "Force Intérieure Niveau 2", desc: "Exprimer une émotion difficile de manière constructive.", x: -1800, y: -14400, lvl: 2, pa: [11011], tai: 30 },
    { id: 11013, name: "Force Intérieure Niveau 3", desc: "Dépasser une période de doute ou de découragement en se reconnectant à ses valeurs.", x: -2100, y: -14400, lvl: 3, pa: [11012], tai: 30 },
    { id: 11014, name: "Force Intérieure Niveau 4", desc: "Tirer des leçons d'une expérience difficile pour en sortir plus fort.", x: -2400, y: -14400, lvl: 4, pa: [11013], tai: 30 },
    { id: 11015, name: "Force Intérieure Niveau 5", desc: "Avoir une meilleure compréhension de son fonctionnement émotionnel et être capable de réguler ses émotions dans la plupart des situations.", x: -2700, y: -14400, lvl: 5, pa: [11014], tai: 30 },

    // --- Séries à 3 niveaux ---
    { id: 11016, name: "Contrôle Impulsif Niveau 1", desc: "Résister à une envie impulsive (ex: acheter un objet inutile, manger un plat gras).", x: -1500, y: -14250, lvl: 1, pa: [11000], tai: 30 },
    { id: 11017, name: "Contrôle Impulsif Niveau 2", desc: "Identifier les déclencheurs de ses comportements impulsifs.", x: -1800, y: -14250, lvl: 2, pa: [11016], tai: 30 },
    { id: 11018, name: "Contrôle Impulsif Niveau 3", desc: "Mettre en place une stratégie pour gérer une impulsion spécifique pendant une semaine.", x: -2100, y: -14250, lvl: 3, pa: [11017], tai: 30 },

    { id: 11019, name: "Zen Attitude Niveau 1", desc: "Retrouver son calme après un moment de frustration.", x: -1500, y: -14100, lvl: 1, pa: [11000], tai: 30 },
    { id: 11020, name: "Zen Attitude Niveau 2", desc: "Utiliser une technique de relaxation (respiration, méditation courte) face à un petit stress.", x: -1800, y: -14100, lvl: 2, pa: [11019], tai: 30 },
    { id: 11021, name: "Zen Attitude Niveau 3", desc: "Gérer une situation modérément stressante en restant calme et centré.", x: -2100, y: -14100, lvl: 3, pa: [11020], tai: 30 },

    // --- Séries à 2 niveaux ---
    { id: 11022, name: "Gestion de l'Attente Niveau 1", desc: "Attendre sans impatience dans une longue file d'attente.", x: -1500, y: -13950, lvl: 1, pa: [11000], tai: 30 },
    { id: 11023, name: "Gestion de l'Attente Niveau 2", desc: "Gérer un retard ou un contretemps sans stress excessif.", x: -1800, y: -13950, lvl: 2, pa: [11022], tai: 30 },

    // Succès Non-Évolutifs
    { id: 11024, name: "Humilité Sincère", desc: "Admettre une erreur sans chercher d'excuses.", x: -1500, y: -13800, lvl: 1, pa: [11000], tai: 30 },
    { id: 11025, name: "Non au Drama", desc: "Ne pas réagir à une provocation ou à une dispute inutile.", x: -1500, y: -13650, lvl: 1, pa: [11000], tai: 30 },
    { id: 11026, name: "Acceptation Radicale", desc: "Accepter pleinement une situation que l'on ne peut pas changer.", x: -1500, y: -13500, lvl: 1, pa: [11000], tai: 30 },
    { id: 11027, name: "Défi de Confort Zone", desc: "Faire une petite chose qui sort légèrement de sa zone de confort.", x: -1500, y: -13350, lvl: 1, pa: [11000], tai: 30 },
    { id: 11028, name: "Silence Réparateur", desc: "Passer 30 minutes dans le silence complet, sans distractions.", x: -1500, y: -13200, lvl: 1, pa: [11000], tai: 30 },
    { id: 11029, name: "Journal de Résilience", desc: "Noter une situation difficile surmontée et les leçons apprises.", x: -1500, y: -13050, lvl: 1, pa: [11000], tai: 30 },
    { id: 11030, name: "Auto-Compassion", desc: "Se parler avec la même gentillesse que l'on offrirait à un ami en difficulté.", x: -1500, y: -12900, lvl: 1, pa: [11000], tai: 30 },

// ==========================================================================
// Catégorie 12 : Sagesse & Connaissance (Très Difficile) - PAIRE (Succès à DROITE)
// ==========================================================================
    { id: 12, name: "ROUTE 12", desc: "Débloque la catégorie 'Sagesse & Connaissance'.", x: 0, y: -15000, lvl: 0, pa: [0], tai: 150, lig: false, exep: [0], cou: "#FFA500"},

    // SUCCÈS INTERMÉDIAIRE (Pont 12)
    { id: 12000, name: "Accès à la Sagesse", desc: "Le portail vers la compréhension profonde et le savoir est ouvert.", x: 750, y: -15000, lvl: 0, pa: [12], tai: 70, cou: "#FFFF00" },

    // Succès Évolutifs (Ordonnés par nombre de niveaux, puis par ordre d'apparition dans la liste fournie pour le positionnement vertical)
    // --- Séries à 5 niveaux ---
    { id: 12001, name: "Esprit Critique Niveau 1", desc: "Identifier une erreur de logique simple dans un argument.", x: 1500, y: -15900, lvl: 1, pa: [12000], tai: 30 },
    { id: 12002, name: "Esprit Critique Niveau 2", desc: "Distinguer les faits des opinions dans un texte simple.", x: 1800, y: -15900, lvl: 2, pa: [12001], tai: 30 },
    { id: 12003, name: "Esprit Critique Niveau 3", desc: "Analyser une source d'information et en évaluer la crédibilité.", x: 2100, y: -15900, lvl: 3, pa: [12002], tai: 30 },
    { id: 12004, name: "Esprit Critique Niveau 4", desc: "Déconstruire un argument pour en comprendre les bases.", x: 2400, y: -15900, lvl: 4, pa: [12003], tai: 30 },
    { id: 12005, name: "Esprit Critique Niveau 5", desc: "Développer une pensée plus critique qui vous aide à prendre des décisions éclairées au quotidien.", x: 2700, y: -15900, lvl: 5, pa: [12004], tai: 30 },

    { id: 12006, name: "Philosophe Pratique Niveau 1", desc: "Réfléchir à l'une de ses valeurs fondamentales.", x: 1500, y: -15750, lvl: 1, pa: [12000], tai: 30 },
    { id: 12007, name: "Philosophe Pratique Niveau 2", desc: "Appliquer un principe philosophique simple à une situation de vie quotidienne.", x: 1800, y: -15750, lvl: 2, pa: [12006], tai: 30 },
    { id: 12008, name: "Philosophe Pratique Niveau 3", desc: "Développer sa propre éthique personnelle et essayer de la suivre dans ses actions.", x: 2100, y: -15750, lvl: 3, pa: [12007], tai: 30 },
    { id: 12009, name: "Philosophe Pratique Niveau 4", desc: "Échanger de manière constructive sur un sujet philosophique avec quelqu'un.", x: 2400, y: -15750, lvl: 4, pa: [12008], tai: 30 },
    { id: 12010, name: "Philosophe Pratique Niveau 5", desc: "Avoir une vision du monde plus cohérente et réfléchie qui guide ses actions.", x: 2700, y: -15750, lvl: 5, pa: [12009], tai: 30 },

    { id: 12011, name: "Source de Connaissance Niveau 1", desc: "Lire un article scientifique vulgarisé.", x: 1500, y: -15600, lvl: 1, pa: [12000], tai: 30 },
    { id: 12012, name: "Source de Connaissance Niveau 2", desc: "Suivre un court cours en ligne sur un sujet scientifique qui vous intéresse.", x: 1800, y: -15600, lvl: 2, pa: [12011], tai: 30 },
    { id: 12013, name: "Source de Connaissance Niveau 3", desc: "Participer à un groupe de lecture ou de discussion sur un sujet de connaissance.", x: 2100, y: -15600, lvl: 3, pa: [12012], tai: 30 },
    { id: 12014, name: "Source de Connaissance Niveau 4", desc: "Réaliser un petit projet personnel basé sur des recherches dans un domaine spécifique.", x: 2400, y: -15600, lvl: 4, pa: [12013], tai: 30 },
    { id: 12015, name: "Source de Connaissance Niveau 5", desc: "Partager une de ses découvertes ou analyses avec d'autres personnes.", x: 2700, y: -15600, lvl: 5, pa: [12014], tai: 30 },

    // --- Séries à 3 niveaux ---
    { id: 12016, name: "Vérificateur d'Infos Niveau 1", desc: "Vérifier la véracité d'une information avant de la partager.", x: 1500, y: -15450, lvl: 1, pa: [12000], tai: 30 },
    { id: 12017, name: "Vérificateur d'Infos Niveau 2", desc: "Identifier les sources fiables d'information sur un sujet donné.", x: 1800, y: -15450, lvl: 2, pa: [12016], tai: 30 },
    { id: 12018, name: "Vérificateur d'Infos Niveau 3", desc: "Croiser plusieurs sources pour confirmer une information importante.", x: 2100, y: -15450, lvl: 3, pa: [12017], tai: 30 },

    { id: 12019, name: "Explorateur d'Idées Niveau 1", desc: "Apprendre l'origine d'une idée ou d'un concept majeur.", x: 1500, y: -15300, lvl: 1, pa: [12000], tai: 30 },
    { id: 12020, name: "Explorateur d'Idées Niveau 2", desc: "Lire un article ou regarder un documentaire sur un sujet philosophique ou scientifique nouveau pour soi.", x: 1800, y: -15300, lvl: 2, pa: [12019], tai: 30 },
    { id: 12021, name: "Explorateur d'Idées Niveau 3", desc: "Expliquer un concept complexe que l'on a appris à quelqu'un d'autre.", x: 2100, y: -15300, lvl: 3, pa: [12020], tai: 30 },

    // --- Séries à 2 niveaux ---
    { id: 12022, name: "Interrogation Constructive Niveau 1", desc: "Poser une question qui ouvre de nouvelles perspectives.", x: 1500, y: -15150, lvl: 1, pa: [12000], tai: 30 },
    { id: 12023, name: "Interrogation Constructive Niveau 2", desc: "Poser des questions pour approfondir sa compréhension d'un sujet.", x: 1800, y: -15150, lvl: 2, pa: [12022], tai: 30 },

    // Succès Non-Évolutifs
    { id: 12024, name: "Point de Vue Nuancé", desc: "Reconnaître les multiples facettes d'un problème complexe.", x: 1500, y: -15000, lvl: 1, pa: [12000], tai: 30 },
    { id: 12025, name: "Sagesse Populaire", desc: "Comprendre le sens profond d'un proverbe ou d'une expression.", x: 1500, y: -14850, lvl: 1, pa: [12000], tai: 30 },
    { id: 12026, name: "Documentaire Éclairant", desc: "Regarder un documentaire sur un sujet complexe et en discuter avec quelqu'un.", x: 1500, y: -14700, lvl: 1, pa: [12000], tai: 30 },
    { id: 12027, name: "Podcast Intellectuel", desc: "Écouter un podcast qui explore des idées nouvelles ou des perspectives différentes.", x: 1500, y: -14550, lvl: 1, pa: [12000], tai: 30 },
    { id: 12028, name: "Débat Intérieur", desc: "Argumenter mentalement les deux côtés d'une question philosophique.", x: 1500, y: -14400, lvl: 1, pa: [12000], tai: 30 },
    { id: 12029, name: "Application Pratique du Savoir", desc: "Utiliser une nouvelle connaissance acquise pour résoudre un problème pratique.", x: 1500, y: -14250, lvl: 1, pa: [12000], tai: 30 },
    { id: 12030, name: "Humilité Intellectuelle", desc: "Reconnaître les limites de ses propres connaissances sur un sujet.", x: 1500, y: -14100, lvl: 1, pa: [12000], tai: 30 },

// ==========================================================================
// Catégorie 13 : Innovation & Projet (Très Difficile) - IMPAIRE (Succès à GAUCHE)
// ==========================================================================
    { id: 13, name: "ROUTE 13", desc: "Débloque la catégorie 'Innovation & Projet'.", x: 0, y: -16200, lvl: 0, pa: [0], tai: 150, lig: false, exep: [0], cou: "#FFA500"},

    // SUCCÈS INTERMÉDIAIRE (Pont 13)
    { id: 13000, name: "Accès à l'Innovation", desc: "Le portail vers la création et la réalisation de projets est ouvert.", x: -750, y: -16200, lvl: 0, pa: [13], tai: 70, cou: "#FFFF00" },

    // Succès Évolutifs (Ordonnés par nombre de niveaux, puis par ordre d'apparition dans la liste fournie pour le positionnement vertical)
    // --- Séries à 5 niveaux ---
    { id: 13001, name: "Concepteur Inventif Niveau 1", desc: "Esquisser un concept pour une solution innovante.", x: -1500, y: -17100, lvl: 1, pa: [13000], tai: 30 },
    { id: 13002, name: "Concepteur Inventif Niveau 2", desc: "Construire un prototype fonctionnel simple de son idée.", x: -1800, y: -17100, lvl: 2, pa: [13001], tai: 30 },
    { id: 13003, name: "Concepteur Inventif Niveau 3", desc: "Présenter son idée et son prototype à un public cible pour obtenir des retours.", x: -2100, y: -17100, lvl: 3, pa: [13002], tai: 30 },
    { id: 13004, name: "Concepteur Inventif Niveau 4", desc: "Améliorer son prototype en fonction des premiers retours.", x: -2400, y: -17100, lvl: 4, pa: [13003], tai: 30 },
    { id: 13005, name: "Concepteur Inventif Niveau 5", desc: "Lancer une version améliorée de son projet ou prototype.", x: -2700, y: -17100, lvl: 5, pa: [13004], tai: 30 },

    { id: 13006, name: "Chef de Projet Averti Niveau 1", desc: "Définir les objectifs et le périmètre d'un projet personnel.", x: -1500, y: -16950, lvl: 1, pa: [13000], tai: 30 },
    { id: 13007, name: "Chef de Projet Averti Niveau 2", desc: "Créer un planning détaillé pour un projet et le suivre.", x: -1800, y: -16950, lvl: 2, pa: [13006], tai: 30 },
    { id: 13008, name: "Chef de Projet Averti Niveau 3", desc: "Gérer les imprévus et les défis d'un projet de manière autonome.", x: -2100, y: -16950, lvl: 3, pa: [13007], tai: 30 },
    { id: 13009, name: "Chef de Projet Averti Niveau 4", desc: "Réaliser un projet personnel en respectant les délais et le budget.", x: -2400, y: -16950, lvl: 4, pa: [13008], tai: 30 },
    { id: 13010, name: "Chef de Projet Averti Niveau 5", desc: "Mener à bien un projet complexe avec une équipe.", x: -2700, y: -16950, lvl: 5, pa: [13009], tai: 30 },

    { id: 13011, name: "Créateur de Valeur Niveau 1", desc: "Identifier un besoin non satisfait dans son environnement.", x: -1500, y: -16800, lvl: 1, pa: [13000], tai: 30 },
    { id: 13012, name: "Créateur de Valeur Niveau 2", desc: "Proposer une solution originale à ce besoin.", x: -1800, y: -16800, lvl: 2, pa: [13011], tai: 30 },
    { id: 13013, name: "Créateur de Valeur Niveau 3", desc: "Mettre en œuvre une solution qui apporte une valeur concrète à d'autres.", x: -2100, y: -16800, lvl: 3, pa: [13012], tai: 30 },
    { id: 13014, name: "Créateur de Valeur Niveau 4", desc: "Obtenir des retours positifs sur l'impact de sa création.", x: -2400, y: -16800, lvl: 4, pa: [13013], tai: 30 },
    { id: 13015, name: "Créateur de Valeur Niveau 5", desc: "Développer un projet qui a un impact positif mesurable sur son entourage.", x: -2700, y: -16800, lvl: 5, pa: [13014], tai: 30 },

    // --- Séries à 3 niveaux ---
    { id: 13016, name: "Générateur d'Idées Niveau 1", desc: "Noter 10 idées pour un projet, même folles.", x: -1500, y: -16650, lvl: 1, pa: [13000], tai: 30 },
    { id: 13017, name: "Générateur d'Idées Niveau 2", desc: "Développer 3 de ces idées avec plus de détails.", x: -1800, y: -16650, lvl: 2, pa: [13016], tai: 30 },
    { id: 13018, name: "Générateur d'Idées Niveau 3", desc: "Sélectionner une idée et commencer à esquisser un plan d'action.", x: -2100, y: -16650, lvl: 3, pa: [13017], tai: 30 },

    { id: 13019, name: "Testeur d'Idées Niveau 1", desc: "Demander l'avis de quelqu'un sur une idée de projet.", x: -1500, y: -16500, lvl: 1, pa: [13000], tai: 30 },
    { id: 13020, name: "Testeur d'Idées Niveau 2", desc: "Présenter son idée à 3 personnes et recueillir leurs feedbacks.", x: -1800, y: -16500, lvl: 2, pa: [13019], tai: 30 },
    { id: 13021, name: "Testeur d'Idées Niveau 3", desc: "Intégrer les feedbacks pertinents pour améliorer son concept.", x: -2100, y: -16500, lvl: 3, pa: [13020], tai: 30 },

    { id: 13022, name: "Planificateur Agile Niveau 1", desc: "Découper une idée en étapes simples.", x: -1500, y: -16350, lvl: 1, pa: [13000], tai: 30 },
    { id: 13023, name: "Planificateur Agile Niveau 2", desc: "Estimer le temps nécessaire pour chaque étape.", x: -1800, y: -16350, lvl: 2, pa: [13022], tai: 30 },
    { id: 13024, name: "Planificateur Agile Niveau 3", desc: "Prioriser les étapes et commencer la première.", x: -2100, y: -16350, lvl: 3, pa: [13023], tai: 30 },

    // Succès Non-Évolutifs
    { id: 13025, name: "Ressource Trouvée", desc: "Identifier une ressource clé (personne, outil, information) pour un projet.", x: -1500, y: -16200, lvl: 1, pa: [13000], tai: 30 },
    { id: 13026, name: "Inspiration Collective", desc: "Participer à une séance de brainstorming en groupe.", x: -1500, y: -16050, lvl: 1, pa: [13000], tai: 30 },
    { id: 13027, name: "Prototype Rapide", desc: "Créer une version très simple de son idée pour la tester rapidement.", x: -1500, y: -15900, lvl: 1, pa: [13000], tai: 30 },
    { id: 13028, name: "Pitch d'Ascenseur", desc: "Préparer une présentation concise de son projet (moins de 2 minutes).", x: -1500, y: -15750, lvl: 1, pa: [13000], tai: 30 },
    { id: 13029, name: "Recherche de Financement (Base)", desc: "Se renseigner sur les options de financement pour un petit projet.", x: -1500, y: -15600, lvl: 1, pa: [13000], tai: 30 },
    { id: 13030, name: "Collaboration Fructueuse", desc: "Travailler avec quelqu'un d'autre sur une petite partie d'un projet.", x: -1500, y: -15450, lvl: 1, pa: [13000], tai: 30 },
    { id: 13031, name: "Leçon d'Échec", desc: "Analyser un échec de projet (même petit) pour en tirer des enseignements.", x: -1500, y: -15300, lvl: 1, pa: [13000], tai: 30 },

// ==========================================================================
// Catégorie 14 : Influence & Leadership (Très Difficile) - PAIRE (Succès à DROITE)
// ==========================================================================
    { id: 14, name: "ROUTE 14", desc: "Débloque la catégorie 'Influence & Leadership'.", x: 0, y: -17400, lvl: 0, pa: [0], tai: 150, lig: false, exep: [0], cou: "#FFA500"},

    // SUCCÈS INTERMÉDIAIRE (Pont 14)
    { id: 14000, name: "Accès au Leadership", desc: "Le portail vers l'influence positive et le mentorat est ouvert.", x: 750, y: -17400, lvl: 0, pa: [14], tai: 70, cou: "#FFFF00" },

    // Succès Évolutifs (Ordonnés par nombre de niveaux, puis par ordre d'apparition dans la liste fournie pour le positionnement vertical)
    // --- Séries à 5 niveaux ---
    { id: 14001, name: "Orateur Charismatique Niveau 1", desc: "Faire une présentation claire devant 3 personnes.", x: 1500, y: -18300, lvl: 1, pa: [14000], tai: 30 },
    { id: 14002, name: "Orateur Charismatique Niveau 2", desc: "Animer une discussion de groupe avec succès.", x: 1800, y: -18300, lvl: 2, pa: [14001], tai: 30 },
    { id: 14003, name: "Orateur Charismatique Niveau 3", desc: "Faire une présentation impactante devant un public d'une dizaine de personnes.", x: 2100, y: -18300, lvl: 3, pa: [14002], tai: 30 },
    { id: 14004, name: "Orateur Charismatique Niveau 4", desc: "Captiver et influencer un petit groupe par ses compétences oratoires.", x: 2400, y: -18300, lvl: 4, pa: [14003], tai: 30 },
    { id: 14005, name: "Orateur Charismatique Niveau 5", desc: "Être capable de bien s'exprimer en public et d'influencer positivement son auditoire.", x: 2700, y: -18300, lvl: 5, pa: [14004], tai: 30 },

    { id: 14006, name: "Agent du Changement Niveau 1", desc: "Proposer un changement positif dans son environnement (travail, famille).", x: 1500, y: -18150, lvl: 1, pa: [14000], tai: 30 },
    { id: 14007, name: "Agent du Changement Niveau 2", desc: "Convaincre 2-3 personnes d'adopter ce changement.", x: 1800, y: -18150, lvl: 2, pa: [14006], tai: 30 },
    { id: 14008, name: "Agent du Changement Niveau 3", desc: "Mettre en place un processus ou une petite initiative qui apporte un changement significatif à un groupe.", x: 2100, y: -18150, lvl: 3, pa: [14007], tai: 30 },
    { id: 14009, name: "Agent du Changement Niveau 4", desc: "Surmonter une résistance au changement pour une petite initiative.", x: 2400, y: -18150, lvl: 4, pa: [14008], tai: 30 },
    { id: 14010, name: "Agent du Changement Niveau 5", desc: "Initier un changement positif à petite échelle dans une équipe ou une communauté.", x: 2700, y: -18150, lvl: 5, pa: [14009], tai: 30 },

    { id: 14011, name: "Mentor Inspirant Niveau 1", desc: "Guider un collègue ou un ami sur une petite décision.", x: 1500, y: -18000, lvl: 1, pa: [14000], tai: 30 },
    { id: 14012, name: "Mentor Inspirant Niveau 2", desc: "Accompagner une personne sur un objectif personnel ou professionnel pendant quelques semaines.", x: 1800, y: -18000, lvl: 2, pa: [14011], tai: 30 },
    { id: 14013, name: "Mentor Inspirant Niveau 3", desc: "Voir une personne que vous avez mentorée atteindre un petit succès grâce à vos conseils.", x: 2100, y: -18000, lvl: 3, pa: [14012], tai: 30 },
    { id: 14014, name: "Mentor Inspirant Niveau 4", desc: "Devenir une personne à qui l'on demande régulièrement des conseils.", x: 2400, y: -18000, lvl: 4, pa: [14013], tai: 30 },
    { id: 14015, name: "Mentor Inspirant Niveau 5", desc: "Inspirer et aider plusieurs personnes à se développer et à atteindre leurs objectifs.", x: 2700, y: -18000, lvl: 5, pa: [14014], tai: 30 },

    // --- Séries à 3 niveaux ---
    { id: 14016, name: "Persuasion Positive Niveau 1", desc: "Convaincre quelqu'un d'une idée avec des arguments solides.", x: 1500, y: -17850, lvl: 1, pa: [14000], tai: 30 },
    { id: 14017, name: "Persuasion Positive Niveau 2", desc: "Amener un petit groupe à considérer un nouveau point de vue.", x: 1800, y: -17850, lvl: 2, pa: [14016], tai: 30 },
    { id: 14018, name: "Persuasion Positive Niveau 3", desc: "Influencer une décision de groupe de manière constructive.", x: 2100, y: -17850, lvl: 3, pa: [14017], tai: 30 },

    { id: 14019, name: "Porteur de Vision Niveau 1", desc: "Exprimer une vision inspirante pour un petit groupe.", x: 1500, y: -17700, lvl: 1, pa: [14000], tai: 30 },
    { id: 14020, name: "Porteur de Vision Niveau 2", desc: "Articuler clairement les bénéfices de cette vision pour motiver les autres.", x: 1800, y: -17700, lvl: 2, pa: [14019], tai: 30 },
    { id: 14021, name: "Porteur de Vision Niveau 3", desc: "Obtenir l'adhésion d'un petit groupe à une vision commune.", x: 2100, y: -17700, lvl: 3, pa: [14020], tai: 30 },

    // --- Séries à 2 niveaux ---
    { id: 14022, name: "Harmonisateur de Groupe Niveau 1", desc: "Aider à résoudre un petit désaccord entre deux personnes.", x: 1500, y: -17550, lvl: 1, pa: [14000], tai: 30 },
    { id: 14023, name: "Harmonisateur de Groupe Niveau 2", desc: "Faciliter une discussion pour apaiser des tensions dans un petit groupe.", x: 1800, y: -17550, lvl: 2, pa: [14022], tai: 30 },

    // Succès Non-Évolutifs
    { id: 14024, name: "Inspiration Discrète", desc: "Inspirer quelqu'un par son exemple silencieux.", x: 1500, y: -17400, lvl: 1, pa: [14000], tai: 30 },
    { id: 14025, name: "Soutien Émotionnel", desc: "Apporter un soutien moral à quelqu'un qui doute de lui-même.", x: 1500, y: -17250, lvl: 1, pa: [14000], tai: 30 },
    { id: 14026, name: "Prise de Parole Stratégique", desc: "Intervenir de manière pertinente lors d'une réunion pour influencer une décision.", x: 1500, y: -17100, lvl: 1, pa: [14000], tai: 30 },
    { id: 14027, name: "Réseau d'Influence", desc: "Identifier 3 personnes clés dans son domaine et établir un contact respectueux.", x: 1500, y: -16950, lvl: 1, pa: [14000], tai: 30 },
    { id: 14028, name: "Leadership Serviable", desc: "Aider un membre de son équipe à surmonter un obstacle.", x: 1500, y: -16800, lvl: 1, pa: [14000], tai: 30 },
    { id: 14029, name: "Vision Partagée", desc: "S'assurer que son équipe comprend et adhère à un objectif commun.", x: 1500, y: -16650, lvl: 1, pa: [14000], tai: 30 },
    { id: 14030, name: "Gestion de Conflit (Base)", desc: "Aborder un désaccord mineur avec un collègue de manière constructive.", x: 1500, y: -16500, lvl: 1, pa: [14000], tai: 30 },

// ==========================================================================
// Catégorie 15 : Maîtrise Ultime (Légendaire) - IMPAIRE (Succès à GAUCHE)
// ==========================================================================
    { id: 15, name: "ROUTE 15", desc: "Débloque la catégorie 'Maîtrise Ultime'.", x: 0, y: -18600, lvl: 0, pa: [0], tai: 150, lig: false, exep: [0], cou: "#FFA500"},

    // SUCCÈS INTERMÉDIAIRE (Pont 15)
    { id: 15000, name: "Accès à l'Ultime", desc: "Le portail vers la transcendance et la sagesse légendaire est ouvert.", x: -750, y: -18600, lvl: 0, pa: [15], tai: 70, cou: "#FFFF00" },

    // Succès Évolutifs (Ordonnés par nombre de niveaux, puis par ordre d'apparition dans la liste fournie pour le positionnement vertical)
    // --- Séries à 5 niveaux ---
    { id: 15001, name: "Éveil de la Conscience Niveau 1", desc: "Pratiquer la pleine conscience pendant 10 minutes par jour pendant un mois.", x: -1500, y: -19500, lvl: 1, pa: [15000], tai: 30 },
    { id: 15002, name: "Éveil de la Conscience Niveau 2", desc: "Observer ses pensées et émotions sans jugement pendant une situation stressante.", x: -1800, y: -19500, lvl: 2, pa: [15001], tai: 30 },
    { id: 15003, name: "Éveil de la Conscience Niveau 3", desc: "Développer une conscience accrue de son environnement et de ses interactions.", x: -2100, y: -19500, lvl: 3, pa: [15002], tai: 30 },
    { id: 15004, name: "Éveil de la Conscience Niveau 4", desc: "Atteindre un état de \"flow\" (absorption totale) dans une activité régulière.", x: -2400, y: -19500, lvl: 4, pa: [15003], tai: 30 },
    { id: 15005, name: "Éveil de la Conscience Niveau 5", desc: "Vivre dans un état de plus grande présence et de calme intérieur au quotidien.", x: -2700, y: -19500, lvl: 5, pa: [15004], tai: 30 },

    { id: 15006, name: "Architecte du Destin Niveau 1", desc: "Définir ses valeurs fondamentales.", x: -1500, y: -19350, lvl: 1, pa: [15000], tai: 30 },
    { id: 15007, name: "Architecte du Destin Niveau 2", desc: "Aligner ses actions quotidiennes avec ses valeurs.", x: -1800, y: -19350, lvl: 2, pa: [15006], tai: 30 },
    { id: 15008, name: "Architecte du Destin Niveau 3", desc: "Bâtir une vie en accord avec sa vision la plus élevée.", x: -2100, y: -19350, lvl: 3, pa: [15007], tai: 30 },
    { id: 15009, name: "Architecte du Destin Niveau 4", desc: "Surmonter un obstacle majeur pour progresser vers la vie dont vous rêvez.", x: -2400, y: -19350, lvl: 4, pa: [15008], tai: 30 },
    { id: 15010, name: "Architecte du Destin Niveau 5", desc: "Créer une vie qui vous apporte un profond sentiment de sens et de satisfaction.", x: -2700, y: -19350, lvl: 5, pa: [15009], tai: 30 },

    { id: 15011, name: "Maître de l'Abondance Niveau 1", desc: "Attirer une petite opportunité inattendue.", x: -1500, y: -19200, lvl: 1, pa: [15000], tai: 30 },
    { id: 15012, name: "Maître de l'Abondance Niveau 2", desc: "Manifester un petit désir (ex: un objet, une rencontre).", x: -1800, y: -19200, lvl: 2, pa: [15011], tai: 30 },
    { id: 15013, name: "Maître de l'Abondance Niveau 3", desc: "Attirer des ressources et des opportunités significatives pour un projet personnel.", x: -2100, y: -19200, lvl: 3, pa: [15012], tai: 30 },
    { id: 15014, name: "Maître de l'Abondance Niveau 4", desc: "Créer un flux d'abondance dans un domaine spécifique de sa vie (ex: relations, créativité).", x: -2400, y: -19200, lvl: 4, pa: [15013], tai: 30 },
    { id: 15015, name: "Maître de l'Abondance Niveau 5", desc: "Cultiver un état d'esprit d'abondance qui attire la positivité dans sa vie.", x: -2700, y: -19200, lvl: 5, pa: [15014], tai: 30 },

    // --- Séries à 3 niveaux ---
    { id: 15016, name: "Connexion Universelle Niveau 1", desc: "Ressentir un sentiment de connexion profonde avec l'univers ou la nature.", x: -1500, y: -19050, lvl: 1, pa: [15000], tai: 30 },
    { id: 15017, name: "Connexion Universelle Niveau 2", desc: "Cultiver des moments réguliers de contemplation ou de méditation en nature.", x: -1800, y: -19050, lvl: 2, pa: [15016], tai: 30 },
    { id: 15018, name: "Connexion Universelle Niveau 3", desc: "Intégrer un sentiment d'unité avec le monde dans sa perspective quotidienne.", x: -2100, y: -19050, lvl: 3, pa: [15017], tai: 30 },

    { id: 15019, name: "Transmission de Sagesse Niveau 1", desc: "Partager une leçon de vie profonde tirée d'une expérience personnelle.", x: -1500, y: -18900, lvl: 1, pa: [15000], tai: 30 },
    { id: 15020, name: "Transmission de Sagesse Niveau 2", desc: "Écrire ou enregistrer ses réflexions et leçons de vie pour les autres.", x: -1800, y: -18900, lvl: 2, pa: [15019], tai: 30 },
    { id: 15021, name: "Transmission de Sagesse Niveau 3", desc: "Inspirer activement les autres par sa sagesse et son expérience.", x: -2100, y: -18900, lvl: 3, pa: [15020], tai: 30 },

    { id: 15022, name: "Équilibre Vital Niveau 1", desc: "Identifier les domaines de sa vie qui nécessitent plus d'équilibre.", x: -1500, y: -18750, lvl: 1, pa: [15000], tai: 30 },
    { id: 15023, name: "Équilibre Vital Niveau 2", desc: "Mettre en place une action concrète pour améliorer l'équilibre dans un domaine.", x: -1800, y: -18750, lvl: 2, pa: [15022], tai: 30 },
    { id: 15024, name: "Équilibre Vital Niveau 3", desc: "Trouver l'équilibre parfait entre toutes les facettes de sa vie et le maintenir.", x: -2100, y: -18750, lvl: 3, pa: [15023], tai: 30 },

    // Succès Non-Évolutifs
    { id: 15025, name: "Légèreté de l'Être", desc: "Se sentir entièrement libre de toute attente ou jugement extérieur.", x: -1500, y: -18600, lvl: 1, pa: [15000], tai: 30 },
    { id: 15026, name: "Pionnier de l'Esprit", desc: "Explorer une nouvelle voie de pensée ou de conscience.", x: -1500, y: -18450, lvl: 1, pa: [15000], tai: 30 },
    { id: 15027, name: "Héritage Immatériel", desc: "Réfléchir à l'impact que l'on souhaite laisser derrière soi.", x: -1500, y: -18300, lvl: 1, pa: [15000], tai: 30 },
    { id: 15028, name: "Contribution Unique", desc: "Identifier un talent ou une perspective unique que l'on peut offrir au monde.", x: -1500, y: -18150, lvl: 1, pa: [15000], tai: 30 },
    { id: 15029, name: "Transcendance des Limites", desc: "Dépasser une peur ou une croyance limitante profondément ancrée.", x: -1500, y: -18000, lvl: 1, pa: [15000], tai: 30 },
    { id: 15030, name: "Sérénité Acquise", desc: "Atteindre un état de paix intérieure face à l'incertitude de la vie.", x: -1500, y: -17850, lvl: 1, pa: [15000], tai: 30 },
    { id: 15031, name: "Amour Inconditionnel (Pratique)", desc: "Pratiquer l'amour inconditionnel envers soi-même et une autre personne pendant une journée.", x: -1500, y: -17700, lvl: 1, pa: [15000], tai: 30 },

// ==========================================================================
// Catégorie 16 : Succès Cachés & Événements Spéciaux (Aléatoire/Secret) - PAIRE (Succès à DROITE)
// ==========================================================================
    { id: 16, name: "ROUTE 16", desc: "Débloque la catégorie 'Succès Cachés & Événements Spéciaux'.", x: 0, y: -19800, lvl: 0, pa: [0], tai: 150, lig: false, exep: [0], cou: "#FFA500"},

    // SUCCÈS INTERMÉDIAIRE (Pont 16)
    { id: 16000, name: "Accès aux Mystères", desc: "Le portail vers l'inattendu et les secrets de la vie est ouvert.", x: 750, y: -19800, lvl: 0, pa: [16], tai: 70, cou: "#FFFF00" },

    // Succès Évolutifs (Ordonnés par nombre de niveaux, puis par ordre d'apparition dans la liste fournie pour le positionnement vertical)
    // --- Séries à 5 niveaux ---
    { id: 16001, name: "Bibliothécaire de l'Âme Niveau 1", desc: "Découvrir un livre ancien ou rare qui contient une sagesse intéressante.", x: 1500, y: -20700, lvl: 1, pa: [16000], tai: 30 },
    { id: 16002, name: "Bibliothécaire de l'Âme Niveau 2", desc: "S'immerger dans la lecture de textes philosophiques ou spirituels et en tirer des leçons personnelles.", x: 1800, y: -20700, lvl: 2, pa: [16001], tai: 30 },
    { id: 16003, name: "Bibliothécaire de l'Âme Niveau 3", desc: "Appliquer une idée philosophique ancienne à une situation contemporaine et en observer les bénéfices.", x: 2100, y: -20700, lvl: 3, pa: [16002], tai: 30 },
    { id: 16004, name: "Bibliothécaire de l'Âme Niveau 4", desc: "Partager une leçon de sagesse apprise avec un proche.", x: 2400, y: -20700, lvl: 4, pa: [16003], tai: 30 },
    { id: 16005, name: "Bibliothécaire de l'Âme Niveau 5", desc: "Intégrer une sagesse ancienne dans votre vie quotidienne pour guider vos choix.", x: 2700, y: -20700, lvl: 5, pa: [16004], tai: 30 },

    { id: 16006, name: "Le Maître des Masques Niveau 1", desc: "Reconnaître une émotion cachée ou une motivation sous-jacente chez une personne.", x: 1500, y: -20550, lvl: 1, pa: [16000], tai: 30 },
    { id: 16007, name: "Le Maître des Masques Niveau 2", desc: "Démasquer une situation complexe en comprenant les non-dits simples.", x: 1800, y: -20550, lvl: 2, pa: [16006], tai: 30 },
    { id: 16008, name: "Le Maître des Masques Niveau 3", desc: "Aider une personne à identifier et à exprimer ses véritables émotions ou besoins.", x: 2100, y: -20550, lvl: 3, pa: [16007], tai: 30 },
    { id: 16009, name: "Le Maître des Masques Niveau 4", desc: "Décrypter les dynamiques de groupe simples et les interactions non-verbales.", x: 2400, y: -20550, lvl: 4, pa: [16008], tai: 30 },
    { id: 16010, name: "Le Maître des Masques Niveau 5", desc: "Mieux comprendre la nature humaine et les mécanismes psychologiques simples pour naviguer dans les relations.", x: 2700, y: -20550, lvl: 5, pa: [16009], tai: 30 },

    { id: 16011, name: "Le Passeur de Rêves Niveau 1", desc: "Se souvenir clairement d'un rêve significatif.", x: 1500, y: -20400, lvl: 1, pa: [16000], tai: 30 },
    { id: 16012, name: "Le Passeur de Rêves Niveau 2", desc: "Interpréter un de ses rêves et en tirer une leçon simple pour la vie éveillée.", x: 1800, y: -20400, lvl: 2, pa: [16011], tai: 30 },
    { id: 16013, name: "Le Passeur de Rêves Niveau 3", desc: "Tenter de pratiquer le rêve lucide (prendre conscience que l'on rêve pendant le rêve).", x: 2100, y: -20400, lvl: 3, pa: [16012], tai: 30 },
    { id: 16014, name: "Le Passeur de Rêves Niveau 4", desc: "Utiliser ses rêves pour résoudre un petit problème ou stimuler sa créativité.", x: 2400, y: -20400, lvl: 4, pa: [16013], tai: 30 },
    { id: 16015, name: "Le Passeur de Rêves Niveau 5", desc: "Développer une meilleure compréhension de ses rêves et de leur influence sur sa vie.", x: 2700, y: -20400, lvl: 5, pa: [16014], tai: 30 }, // Correction de la description

    // Succès Non-Évolutifs
    { id: 16016, name: "Le Souffle du Dragon", desc: "Réussir à faire un coup de main impressionnant en cuisine ou en bricolage pour la première fois.", x: 1500, y: -20250, lvl: 1, pa: [16000], tai: 30 },
    { id: 16017, name: "Le Secret de la Forêt", desc: "Découvrir un lieu caché et inattendu dans la nature, que personne d'autre ne semble connaître.", x: 1500, y: -20100, lvl: 1, pa: [16000], tai: 30 },
    { id: 16018, name: "L'Objet Perdu Retrouvé", desc: "Retrouver un objet que vous aviez cherché désespérément pendant longtemps, sans savoir où il était.", x: 1500, y: -19950, lvl: 1, pa: [16000], tai: 30 },
    { id: 16019, name: "Le Signe du Destin", desc: "Recevoir une série de coïncidences qui vous pousse à prendre une décision importante dans votre vie.", x: 1500, y: -19800, lvl: 1, pa: [16000], tai: 30 },
    { id: 16020, name: "Le Rêve Prédictif", desc: "Faire un rêve qui se réalise de manière surprenante dans les jours qui suivent.", x: 1500, y: -19650, lvl: 1, pa: [16000], tai: 30 },
    { id: 16021, name: "Le Message Chiffré", desc: "Décrypter un message ou une énigme qui vous semblait incompréhensible au premier abord.", x: 1500, y: -19500, lvl: 1, pa: [16000], tai: 30 },
    { id: 16022, name: "La Rencontre Inattendue", desc: "Croiser quelqu'un du passé que vous n'aviez pas revu depuis des années, dans un endroit totalement inattendu.", x: 1500, y: -19350, lvl: 1, pa: [16000], tai: 30 },
    { id: 16023, name: "Synchronicité Reconnue", desc: "Noter et réfléchir à une série de coïncidences significatives.", x: 1500, y: -19200, lvl: 1, pa: [16000], tai: 30 },
    { id: 16024, name: "Intuition Écoutée", desc: "Prendre une petite décision en se basant principalement sur son intuition et observer le résultat.", x: 1500, y: -19050, lvl: 1, pa: [16000], tai: 30 },
    { id: 16025, name: "Hasard Créatif", desc: "Utiliser un élément aléatoire (un mot, une image) comme point de départ pour une création.", x: 1500, y: -18900, lvl: 1, pa: [16000], tai: 30 },
    { id: 16026, name: "Chasse au Trésor Urbaine", desc: "Participer à un jeu de piste ou une chasse au trésor.", x: 1500, y: -18750, lvl: 1, pa: [16000], tai: 30 },
    { id: 16027, name: "Message dans une Bouteille (Moderne)", desc: "Laisser une note positive ou inspirante dans un lieu public pour un inconnu.", x: 1500, y: -18600, lvl: 1, pa: [16000], tai: 30 },

// ==========================================================================
// Catégorie 17 : Et plus ? (Spéculatif / Philosophique) - IMPAIRE (Succès à GAUCHE)
// ==========================================================================
    { id: 17, name: "ROUTE 17", desc: "Débloque la catégorie 'Et plus ?'.", x: 0, y: -21000, lvl: 0, pa: [0], tai: 150, lig: false, exep: [0], cou: "#FFA500"},

    // SUCCÈS INTERMÉDIAIRE (Pont 17)
    { id: 17000, name: "Accès à l'Infini", desc: "Le portail vers les grandes questions et l'inconnaissable est ouvert.", x: -750, y: -21000, lvl: 0, pa: [17], tai: 70, cou: "#FFFF00" },

    // Succès Évolutifs (Ordonnés par nombre de niveaux, puis par ordre d'apparition dans la liste fournie pour le positionnement vertical)
    // --- Séries à 5 niveaux ---
    { id: 17001, name: "Théoricien du Sens Personnel Niveau 1", desc: "Identifier 3 choses qui donnent actuellement un sens à votre vie.", x: -1500, y: -22125, lvl: 1, pa: [17000], tai: 30 },
    { id: 17002, name: "Théoricien du Sens Personnel Niveau 2", desc: "Réfléchir à la manière dont ces éléments de sens ont évolué pour vous au fil du temps.", x: -1800, y: -22125, lvl: 2, pa: [17001], tai: 30 },
    { id: 17003, name: "Théoricien du Sens Personnel Niveau 3", desc: "Écrire une courte dissertation sur votre compréhension personnelle et évolutive du \"sens de la vie\".", x: -2100, y: -22125, lvl: 3, pa: [17002], tai: 30 },
    { id: 17004, name: "Théoricien du Sens Personnel Niveau 4", desc: "Discuter avec une personne de confiance de sa propre quête de sens et comparer vos perspectives.", x: -2400, y: -22125, lvl: 4, pa: [17003], tai: 30 },
    { id: 17005, name: "Théoricien du Sens Personnel Niveau 5", desc: "Vivre une semaine en alignant consciemment vos actions quotidiennes avec ce que vous considérez comme le sens de votre vie.", x: -2700, y: -22125, lvl: 5, pa: [17004], tai: 30 },

    { id: 17006, name: "Chercheur de Vérités Alternatives Niveau 1", desc: "Se renseigner sur une théorie du complot populaire et analyser ses arguments et ses failles logiques.", x: -1500, y: -21975, lvl: 1, pa: [17000], tai: 30 },
    { id: 17007, name: "Chercheur de Vérités Alternatives Niveau 2", desc: "Explorer un système de croyance ou une philosophie radicalement différente de la vôtre sans jugement.", x: -1800, y: -21975, lvl: 2, pa: [17006], tai: 30 },
    { id: 17008, name: "Chercheur de Vérités Alternatives Niveau 3", desc: "Identifier les biais cognitifs qui pourraient influencer votre propre perception de la \"vérité\".", x: -2100, y: -21975, lvl: 3, pa: [17007], tai: 30 },
    { id: 17009, name: "Chercheur de Vérités Alternatives Niveau 4", desc: "Débattre respectueusement avec quelqu'un ayant des croyances opposées pour comprendre son point de vue.", x: -2400, y: -21975, lvl: 4, pa: [17008], tai: 30 },
    { id: 17010, name: "Chercheur de Vérités Alternatives Niveau 5", desc: "Développer une plus grande flexibilité mentale et une ouverture à des perspectives multiples sur la réalité.", x: -2700, y: -21975, lvl: 5, pa: [17009], tai: 30 },

    // --- Séries à 4 niveaux ---
    { id: 17011, name: "Explorateur de la Conscience Niveau 1", desc: "Se documenter sur un état de conscience modifié (rêve lucide, méditation profonde, etc.).", x: -1500, y: -21825, lvl: 1, pa: [17000], tai: 30 },
    { id: 17012, name: "Explorateur de la Conscience Niveau 2", desc: "Tenter une pratique visant à explorer un état de conscience modifié de manière sécurisée et informée.", x: -1800, y: -21825, lvl: 2, pa: [17011], tai: 30 },
    { id: 17013, name: "Explorateur de la Conscience Niveau 3", desc: "Tenir un journal de vos expériences et réflexions sur les différents états de conscience.", x: -2100, y: -21825, lvl: 3, pa: [17012], tai: 30 },
    { id: 17014, name: "Explorateur de la Conscience Niveau 4", desc: "Discuter avec d'autres personnes de leurs expériences et perceptions de la conscience.", x: -2400, y: -21825, lvl: 4, pa: [17013], tai: 30 },

    // --- Séries à 3 niveaux ---
    { id: 17015, name: "Cartographe de l'Inconnu Niveau 1", desc: "Lister 3 grandes questions sans réponse scientifique ou philosophique actuelle qui vous intriguent.", x: -1500, y: -21675, lvl: 1, pa: [17000], tai: 30 },
    { id: 17016, name: "Cartographe de l'Inconnu Niveau 2", desc: "Choisir une de ces questions et rechercher 2 théories ou perspectives différentes à son sujet.", x: -1800, y: -21675, lvl: 2, pa: [17015], tai: 30 },
    { id: 17017, name: "Cartographe de l'Inconnu Niveau 3", desc: "Formuler votre propre hypothèse ou opinion éclairée sur cette question, basée sur vos recherches.", x: -2100, y: -21675, lvl: 3, pa: [17016], tai: 30 },

    { id: 17018, name: "Architecte de Mondes Possibles Niveau 1", desc: "Imaginer et décrire brièvement un monde avec une loi physique fondamentalement différente de la nôtre.", x: -1500, y: -21525, lvl: 1, pa: [17000], tai: 30 },
    { id: 17019, name: "Architecte de Mondes Possibles Niveau 2", desc: "Explorer les conséquences de cette loi physique différente sur la vie et la civilisation dans ce monde imaginaire.", x: -1800, y: -21525, lvl: 2, pa: [17018], tai: 30 },
    { id: 17020, name: "Architecte de Mondes Possibles Niveau 3", desc: "Écrire une courte nouvelle ou un scénario se déroulant dans ce monde que vous avez conçu.", x: -2100, y: -21525, lvl: 3, pa: [17019], tai: 30 },

    // Succès Non-Évolutifs
    { id: 17021, name: "Le Grand Pourquoi", desc: "Consacrer une heure à réfléchir sérieusement à la question \"Quel est le sens de la vie ?\".", x: -1500, y: -21375, lvl: 1, pa: [17000], tai: 30 },
    { id: 17022, name: "Hypothèse Multiverselle", desc: "Lire un article ou regarder un documentaire sur les théories du multivers.", x: -1500, y: -21225, lvl: 1, pa: [17000], tai: 30 },
    { id: 17023, name: "Conscience Artificielle", desc: "Réfléchir aux implications éthiques et philosophiques d'une IA véritablement consciente.", x: -1500, y: -21075, lvl: 1, pa: [17000], tai: 30 },
    { id: 17024, name: "Au-delà du Temps", desc: "Imaginer et décrire un concept de voyage dans le temps, ses paradoxes et ses possibilités.", x: -1500, y: -20925, lvl: 1, pa: [17000], tai: 30 },
    { id: 17026, name: "La Nature de la Réalité", desc: "Se demander si la réalité que nous percevons est la seule ou la \"vraie\" réalité.", x: -1500, y: -20775, lvl: 1, pa: [17000], tai: 30 },
    { id: 17027, name: "Paradoxe Contemplé", desc: "Réfléchir à un paradoxe philosophique ou scientifique.", x: -1500, y: -20625, lvl: 1, pa: [17000], tai: 30 },
    { id: 17028, name: "Simulation Mentale", desc: "Imaginer en détail les conséquences d'un choix majeur non pris.", x: -1500, y: -20475, lvl: 1, pa: [17000], tai: 30 },
    { id: 17029, name: "Dialogue Interstellaire (Concept)", desc: "Écrire un court dialogue fictif avec une forme de vie extraterrestre.", x: -1500, y: -20325, lvl: 1, pa: [17000], tai: 30 },
    { id: 17030, name: "Limites de la Connaissance", desc: "Identifier un domaine où le savoir humain est actuellement limité et spéculer sur les futures découvertes.", x: -1500, y: -20175, lvl: 1, pa: [17000], tai: 30 },
    { id: 17031, name: "Héritage Cosmique", desc: "Réfléchir à la place de l'humanité dans l'univers et à son éventuel héritage à long terme.", x: -1500, y: -20025, lvl: 1, pa: [17000], tai: 30 },
 
// ==========================================================================
// ROUTE 18 - La Dernière Étape
// ==========================================================================
    { id: 18, name: "ROUTE 18", desc: "La dernière route avant la consécration finale.", x: 0, y: -22200, lvl: 0, pa: [0], tai: 150, lig: false, exep: [0], cou: "#FFA500"},

// ==========================================================================
// Succès Final (Merci a ceux qui complèteront cette liste et qui cherche d'autre succès a faire ici car vous êtes juste trop fort)
// ==========================================================================
    { id: 99999, name: "The End ...?", desc: "Avoir Painite la vie.\n\nAvoir réalisé une grande partie de ce que nous pouvons faire pour l'instant dans ce monde...\n\nAvoir Platiné la vie.\nSi vous vous posez la question de pourquoi \"Painite\", c'est parce que la Painite est la pierre la plus rare sur Terre.", x: 0, y: -23400, lvl: 360, 
        pa: [
            1001, 1002, 1024, 1025, 1005, 1008, 1011, 1016, 1021, 1028, 1031, // Cat 1 Fin
            2001, 2002, 2003, 2004, 2005, 2008, 2011, 2013, 2018, 2023, 2028, 2030, // Cat 2 Fin
            3001, 3002, 3003, 3004, 3005, 3008, 3010, 3013, 3018, 3023, 3028, 3030, // Cat 3 Fin
            4005, 4010, 4015, 4018, 4020, 4022, 4024, 4025, 4026, 4027, 4028, 4029, // Cat 4 Fin
            5005, 5010, 5015, 5018, 5021, 5023, 5025, 5026, 5027, 5028, 5029, 5030, // Cat 5 Fin
            6005, 6010, 6015, 6018, 6021, 6024, 6025, 6026, 6027, 6028, 6029, 6030, 6031, // Cat 6 Fin
            7005, 7010, 7015, 7018, 7021, 7023, 7024, 7025, 7026, 7027, 7028, 7029, 7030, // Cat 7 Fin
            8005, 8010, 8015, 8018, 8021, 8023, 8024, 8025, 8026, 8027, 8028, 8029, 8030, // Cat 8 Fin
            9005, 9010, 9015, 9018, 9021, 9024, 9025, 9026, 9027, 9028, 9029, 9030, 9031, // Cat 9 Fin
            10005, 10010, 10015, 10018, 10020, 10022, 10023, 10024, 10025, 10026, 10027, 10028, 10029, // Cat 10 Fin
            11005, 11010, 11015, 11018, 11021, 11023, 11024, 11025, 11026, 11027, 11028, 11029, 11030, // Cat 11 Fin
            12005, 12010, 12015, 12018, 12021, 12023, 12024, 12025, 12026, 12027, 12028, 12029, 12030, // Cat 12 Fin
            13005, 13010, 13015, 13018, 13021, 13024, 13025, 13026, 13027, 13028, 13029, 13030, 13031, // Cat 13 Fin
            14005, 14010, 14015, 14018, 14021, 14023, 14024, 14025, 14026, 14027, 14028, 14029, 14030, // Cat 14 Fin
            15005, 15010, 15015, 15018, 15021, 15024, 15025, 15026, 15027, 15028, 15029, 15030, 15031, // Cat 15 Fin
            16005, 16010, 16015, 16016, 16017, 16018, 16019, 16020, 16021, 16022, 16023, 16024, 16025, 16026, 16027, // Cat 16 Fin
            17005, 17010, 17014, 17017, 17020, 17021, 17022, 17023, 17024, 17026, 17027, 17028, 17029, 17030, 17031, // Cat 17 Fin
            18 // ROUTE 18
        ], 
        tai: 300, lig: false, exep: [18], cond: "Avoir fini la liste", cou: "#FF0000",
        victoryMsg: "FÉLICITATIONS !\nVous avez Painite la Vie !\nMerci d'avoir fini cette liste et d'avoir, si possible, été sérieux. Sur ce, je vous laisse mais vous avez débloqué le premier succès d'une grande liste.\nMERCI !" }
];