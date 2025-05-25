// ==========================================================================
// I. INITIALISATION & CONFIGURATION
// ==========================================================================

// --- Variables d'état Global ---
let level = parseInt(localStorage.getItem("level")) || 0;
let currentPressTarget = null;
let pressTimer = null;
let isAnimatingUnlock = false;
let activeCoverCircle = null;

let isGlobalChromaActive = false;
let chromaGlobalColorIndex = 0;
let chromaAnimationTimer = null;
let isLoopingConfettiActive = false;
let loopingConfettiTimer = null;

let isDevModeActive = localStorage.getItem("devModeActive") === "true";

let selectionIndicatorCircle = null; // Cercle visuel pour le nœud sélectionné
let currentSidebarSuccessData = null; // Données du succès actuellement affiché dans la sidebar

// --- Constants ---
// const SITE_VERSION = "(1.1)"; // Version actuelle du site pour la logique de réinitialisation (Désactivé)
// Colors
const COLOR_NODE_START = "#D0BFFF"; // Couleur du nœud d'origine (Lavande Néon Clair)
const COLOR_NODE_UNLOCKED = "#fff"; // Couleur des nœuds déverrouillés (Blanc)
const COLOR_NODE_LOCKED = "#666";
const COLOR_NODE_UNLOCKABLE = "#66f"; // Couleur des nœuds déblocables (Bleu ciel)
const COLOR_NODE_STROKE = "#222";
const COLOR_LINK = "#555";
const COLOR_UNLOCK_ANIMATION_FILL = "#666";
const CHROMA_COLORS = ["#FF0000", "#FF7F00", "#FFFF00", "#00FF00", "#00FFFF", "#0000FF", "#4B0082", "#8B00FF"];
const CHROMA_TRANSITION_DURATION = 700;
const COLOR_SELECTION_INDICATOR = "yellow";

// Identifiants des éléments DOM pour la barre latérale
const SIDEBAR_NAME_ID = "sidebar-success-name";
const SIDEBAR_DESCRIPTION_ID = "sidebar-success-description";
const SIDEBAR_LEVELUP_ID = "sidebar-success-levelup";
const SIDEBAR_CONDITION_ID = "sidebar-success-condition";

// --- Définitions des Branches Principales ---
const branchDefinitions = [
    { rootNodeId: 2,  branchNumber: 1, name: "Vie et Croissance" },
    { rootNodeId: 33, branchNumber: 2, name: "Réussite et Objectifs" },
    { rootNodeId: 60, branchNumber: 3, name: "Sport et Santé" },
    { rootNodeId: 89, branchNumber: 4, name: "Créativité et Art" }
];

// Éléments DOM
const levelDisplayElement = document.getElementById("level-display");
const unlockedNormalSuccessesDisplayElement = document.getElementById("unlocked-normal-successes-count");
const remainingNormalSuccessesDisplayElement = document.getElementById("remaining-normal-successes-count");
levelDisplayElement.textContent = level;

const settingsIcon = document.getElementById("settings-icon");
const settingsMenu = document.getElementById("settings-menu");
const menuItemReset = document.getElementById("menu-item-reset");
const menuItemDevMode = document.getElementById("menu-item-dev-mode");
const menuItemDevUnlockAll = document.getElementById("menu-item-dev-unlock-all"); // Nouveau bouton
const menuItemVersionDisplay = document.getElementById("menu-item-version-display"); // Nouvel élément pour afficher la version
const menuItemConnexion = document.getElementById("menu-item-connexion");
const resetConfirmationDialog = document.getElementById("reset-confirmation-dialog");
const confirmResetButton = document.getElementById("confirm-reset-button");

// Éléments de la modale de mot de passe pour le mode développeur
const passwordDevModal = document.getElementById("password-dev-modal");
const closeDevModalButton = document.getElementById("close-dev-modal-button");
const devModePasswordInput = document.getElementById("dev-mode-password-input");
const submitDevModePasswordButton = document.getElementById("submit-dev-mode-password");
const devModePasswordError = document.getElementById("dev-mode-password-error");
const cancelResetButton = document.getElementById("cancel-reset-button");

// Éléments de la boîte de message de victoire
const victoryMessageBox = document.getElementById("victory-message-box");
const victoryMessageTextElement = document.getElementById("victory-message-text");
const closeVictoryBoxButton = document.getElementById("close-victory-box-button");

// Éléments de la modale de bienvenue
const welcomeModal = document.getElementById("welcome-modal");
const closeWelcomeModalButton = document.getElementById("close-welcome-modal-button");
const gotItWelcomeButton = document.getElementById("got-it-welcome-button");
const devModeIndicator = document.getElementById("dev-mode-indicator");

const sidebarToggleButton = document.getElementById("sidebar-toggle-button");
const sidebarContentWrapper = document.getElementById("sidebar-content-wrapper");
const sidebarUnlockButton = document.getElementById("sidebar-unlock-button");

// ==========================================================================
// II. GESTION DES DONNÉES & STOCKAGE
// ==========================================================================

/**
 * Vérifie la version du site et réinitialise la progression si une mise à jour est détectée.
 */
// function checkVersionAndReset() {
//     const lastVisitedVersion = localStorage.getItem("lastVisitedVersion");

//     if (lastVisitedVersion !== SITE_VERSION) {
//         console.log(`Mise à jour détectée (Ancienne version: ${lastVisitedVersion}, Nouvelle version: ${SITE_VERSION}). Réinitialisation de la progression.`);
//         alert("Bienvenue dans la nouvelle version du Platine de la Vie !\n\nPour assurer la compatibilité avec les dernières améliorations et changements, votre progression a été réinitialisée.\n\nNous espérons que vous apprécierez les nouveautés !");
//         performReset(); // Réinitialise la progression
//         localStorage.setItem("lastVisitedVersion", SITE_VERSION); // Met à jour la version visitée
//     }
// }

// Appeler cette fonction AVANT de charger la progression sauvegardée.
// checkVersionAndReset(); // Désactivé

// Load saved progress from localStorage
const savedProgress = JSON.parse(localStorage.getItem("successProgress")) || [];
successes.forEach(s => { s.unlocked = savedProgress.includes(s.id); });
level = parseInt(localStorage.getItem("level")) || 0; // S'assurer de recharger le niveau après un éventuel reset

// Map pour un accès rapide aux succès par leur ID
const successMap = new Map(successes.map(s => [s.id, s]));

/**
 * Sauvegarde la progression actuelle (succès déverrouillés et niveau) dans localStorage.
 */
function saveProgress() {
    localStorage.setItem("successProgress", JSON.stringify(successes.filter(s => s.unlocked).map(s => s.id)));
    localStorage.setItem("level", level);
    localStorage.setItem("devModeActive", isDevModeActive);
}

// ==========================================================================
// III. CONFIGURATION D3 & RENDU
// ==========================================================================

const width = window.innerWidth;
const height = window.innerHeight;
const centerX = width / 2;
const centerY = height / 2;
const svg = d3.select("#graph").attr("width", width).attr("height", height);
const container = svg.append("g");

// Création de groupes dédiés pour contrôler l'ordre de rendu (z-index)
const linksGroup = container.append("g").attr("class", "links-group");
const nodesGroup = container.append("g").attr("class", "nodes-group");
const labelsGroup = container.append("g").attr("class", "labels-group");
const effectsGroup = container.append("g").attr("class", "effects-group"); // Pour les effets visuels (explosions, indicateurs)

// Calculer les étendues des données brutes
const allXCoords = successes.map(s => s.x);
const allYCoords = successes.map(s => s.y);

const minDataX = Math.min(...allXCoords);
const maxDataX = Math.max(...allXCoords);
const minDataY = Math.min(...allYCoords);
const maxDataY = Math.max(...allYCoords); // Ajout du calcul pour la coordonnée Y maximale

const worldPaddingTop = 2500;
const worldPaddingBottom = 4000;
const worldPaddingLeft = 7000;
const worldPaddingRight = 7000;
 
// Ajuster les étendues pour translateExtent en tenant compte du décalage centerX, centerY
// car les nœuds sont dessinés à (centerX + d.x, centerY + d.y) dans le conteneur.
const extent_world_X0 = centerX + minDataX - worldPaddingLeft;
const extent_world_X1 = centerX + maxDataX + worldPaddingRight;
const extent_world_Y0 = centerY + minDataY - worldPaddingTop;
const extent_world_Y1 = centerY + maxDataY + worldPaddingBottom;

// Déterminer le scaleExtent en fonction de la taille de l'écran
const isMobileForZoom = window.innerWidth <= 768;
const minScale = isMobileForZoom ? 0.05 : 0.15;
// Comportement de zoom D3
const zoom = d3.zoom()
    .scaleExtent([minScale, 2])
    .translateExtent([[extent_world_X0, extent_world_Y0], [extent_world_X1, extent_world_Y1]])
    .on("zoom", (event) => {
    container.attr("transform", event.transform);
});
svg.call(zoom);

// Définir l'échelle initiale et la position pour centrer le point (0,0)
const initialScale = 0.2; // Choisissez une échelle initiale (par ex. 0.15 pour voir plus de choses)
                           // Assurez-vous que c'est dans les limites de scaleExtent

// Calculer la translation pour centrer le point de données (0,0) à l'écran (centerX, centerY)
// avec l'échelle initiale. Les nœuds sont dessinés à (centerX + d.x, centerY + d.y).
const initialTx = centerX * (1 - initialScale);
const initialTy = centerY * (1 - initialScale);
const initialTransform = d3.zoomIdentity.translate(initialTx, initialTy).scale(initialScale);
svg.call(zoom.transform, initialTransform);

/**
 * Génère un tableau d'objets de lien à partir des données des succès.
 * Chaque objet de lien contient les données du nœud source, du nœud cible et un ID unique.
 * @returns {Array<Object>} Tableau d'objets de données de lien.
 */
function getLinkData() {
    const linkData = [];
    successes.forEach(s => {
        (s.pa || []).forEach(parentId => { // s.pa contient les IDs des parents
            const parent = successMap.get(parentId);
            if (parent) {
                let drawLine = true; // Par défaut, on dessine la ligne

                if (s.lig === false) { // Si lig est explicitement false pour l'enfant
                    // Ne pas dessiner la ligne, SAUF si ce parentId est dans la liste d'exceptions 'exep' de l'enfant
                    drawLine = Array.isArray(s.exep) && s.exep.includes(parentId);
                }
                // Si s.lig est true ou undefined, drawLine reste true.

                if (drawLine) {
                    linkData.push({ source: parent, target: s, id: `link-${parent.id}-to-${s.id}` });
                }
            }
        });
    });
    return linkData;
}

const links = linksGroup
    .attr("class", "links")
    .selectAll("line")
    .data(getLinkData(), d => d.id)
    .enter()
    .append("line")
    .attr("x1", d => centerX + d.source.x)
    .attr("y1", d => centerY + d.source.y)
    .attr("x2", d => centerX + d.target.x)
    .attr("y2", d => centerY + d.target.y)
    .attr("stroke-width", 6); // Épaisseur triplée (2 * 3 = 6)

const nodes = nodesGroup.selectAll("circle")
    .data(successes, d => d.id)
    .enter()
    .append("circle")
    .attr("cx", d => centerX + d.x)
    .attr("cy", d => centerY + d.y)
    .attr("r", d => d.tai || 20) // `tai` définit la taille du nœud
    .attr("stroke", COLOR_NODE_STROKE).attr("stroke-width", 2);

// --- Drawing Branch Labels ---
const branchLabelData = successes
    .filter(s => s.name && s.name.startsWith("ROUTE "))
    .map(routeNode => {
        const match = routeNode.desc.match(/Débloque la catégorie '(.*?)'\./);
        const categoryName = match && match[1] ? match[1] : routeNode.name; 

        return {
            id: `branchlabel-${routeNode.id}`,       // ID unique pour l'étiquette
            x: centerX + routeNode.x,              // Coordonnée X rendue du centre du nœud ROUTE
            y: centerY + routeNode.y,              // Coordonnée Y rendue du centre du nœud ROUTE
            text: categoryName,                    // Le nom de la catégorie à afficher
            categoryId: routeNode.id,              // ID de la catégorie (numéro de la ROUTE) pour déterminer le côté
            nodeRadius: routeNode.tai || 150       // Rayon du nœud ROUTE (qui est routeNode.x = 0)
        };
    })
    .filter(d => d !== null);

labelsGroup.selectAll("text.branch-label")
    .data(branchLabelData, d => d.id)
    .enter()
    .append("text")
    .attr("class", "branch-label")
    .attr("x", d => {
        if (d.categoryId % 2 !== 0) { // Catégorie impaire (succès à gauche) -> étiquette à droite
            return d.x + d.nodeRadius + 30;
        } else { // Catégorie paire (succès à droite) -> étiquette à gauche
            return d.x - d.nodeRadius - 800;
    }})
    .attr("y", d => d.y)
    .attr("text-anchor", d => {
        if (d.categoryId % 2 !== 0) {
            return "start";
        } else {
            return "end";
        }
    })
    .attr("dy", ".35em")
    .attr("fill", "#e0e0e0")
    .style("font-size", "80px")
    .style("font-family", "Arial, sans-serif")
    .style("pointer-events", "none")
    .each(function(d) {
        const textNode = d3.select(this);
        const textContent = d.text;

        if (textContent && textContent.includes("&")) {
            const parts = textContent.split("&"); // Sépare le texte par "&"
            
            parts.forEach((part, index) => {
                let lineText = part.trim();
                if (index < parts.length - 1) {
                    lineText += " &";
                }

                const tspan = textNode.append("tspan").text(lineText);
                if (index > 0) {
                    tspan.attr("x", textNode.attr("x"))
                         .attr("dy", "1.2em");
                }
            });
        } else {
            textNode.text(textContent);
        }
    });

// ==========================================================================
// IV. FONCTIONS DE MISE À JOUR VISUELLE PRINCIPALES
// ==========================================================================

/**
 * Met à jour la couleur de remplissage de tous les nœuds de succès en fonction de leur état actuel.
 */
function updateNodeColors() {
    nodes.each(function(d) {
        const nodeElement = d3.select(this);
        // Si l'effet chroma est actif et que ce n'est pas le nœud initial, sa couleur est gérée par chroma.
        if (isGlobalChromaActive && d.id !== 0) {
            nodeElement.interrupt("globalNodeColorUpdate");
            return;
        }
        nodeElement.transition("globalNodeColorUpdate")
            .duration(1000)
            .ease(d3.easeCubicInOut)
            .attr("fill", () => {
                if (d.id === 0) {
                    return COLOR_NODE_START;
                }
                if (d.unlocked) {
                    return d.cou || COLOR_NODE_UNLOCKED;
                }
                const isUnlockable = (d.pa || []).every(parentId => successMap.get(parentId)?.unlocked);
                if (isUnlockable) {
                    return COLOR_NODE_UNLOCKABLE;
                }
                return COLOR_NODE_LOCKED;
            });
        if (d.id === 0) {
            nodeElement.classed("neon-origin", true);
            // S'assurer que la classe du nœud final n'est pas sur l'origine
            nodeElement.classed("neon-final-chromatic", false);
        } else {
            nodeElement.classed("neon-origin", false);
            // Appliquer la classe chromatique uniquement au nœud final (ID 99999)
            nodeElement.classed("neon-final-chromatic", d.id === 99999);
        }
    });
}

/**
 * Met à jour la couleur de contour de tous les liens en fonction de l'état de leurs nœuds connectés.
 */
function updateLinkColors() {
    links.each(function(d) {
        const linkElement = d3.select(this);
        // Si l'effet chroma est actif et que ce lien est connecté à au moins un nœud non-initial (donc chromatique),
        // sa couleur est gérée par chroma.
        if (isGlobalChromaActive && (d.source.id !== 0 || d.target.id !== 0)) {
            linkElement.interrupt("globalLinkColorUpdate");
            return;
        }

        // Logique de couleur normale pour les liens non-chromatiques (ex: connectés seulement au nœud 0)
        linkElement.transition("globalLinkColorUpdate")
            .duration(1000)
            .attr("stroke", () => {
                const sourceNode = d.source;
                const targetNode = d.target;

                if (sourceNode.unlocked && targetNode.unlocked) {
                    // Pour les liens connectés au nœud 0 (qui ne sont pas chromatiques)
                    if (sourceNode.id === 0) return targetNode.cou || COLOR_NODE_UNLOCKED;
                    if (targetNode.id === 0) return sourceNode.cou || COLOR_NODE_UNLOCKED;
                    // Ce cas ne devrait pas être atteint si chroma est actif pour les autres liens
                    return targetNode.cou || sourceNode.cou || COLOR_NODE_UNLOCKED;
                } else if (sourceNode.unlocked && !targetNode.unlocked && (targetNode.pa || []).every(pId => successMap.get(pId)?.unlocked)) {
                    return COLOR_NODE_UNLOCKABLE;
                } else {
                    return COLOR_LINK;
                }
            });
    });
}

// ==========================================================================
// V. INTERACTION AVEC LES SUCCÈS & LOGIQUE DE DÉVERROUILLAGE
// ==========================================================================

function handlePressStart(event, d) {
    const targetNode = d3.select(this); // 'this' est l'élément SVG du nœud
    const cx = parseFloat(targetNode.attr("cx"));

    // --- Dev Mode Quick Unlock ---
    if (isDevModeActive) {
        if (!d.unlocked) { // Only attempt to unlock if not already unlocked
            devModeUnlock(d);
        }
        updateSuccessDetailsSidebar(d);
        return;
    }
    const cy = parseFloat(targetNode.attr("cy"));
    const nodeRadius = parseFloat(targetNode.attr("r"));

    // Calculs pour l'indicateur de sélection pulsant
    const selectionStrokeWidth = Math.max(3, nodeRadius * 0.15);
    const dynamicPulseAmount = Math.max(2, selectionStrokeWidth * 0.5);
    const desiredGap = 1.5;
    const selectionBaseRadius = nodeRadius + desiredGap + dynamicPulseAmount + (selectionStrokeWidth / 2);

    // --- Centrer la caméra sur le nœud cliqué ---
    // Les coordonnées d.x, d.y sont maintenant relatives au centre.
    const currentTransform = d3.zoomTransform(svg.node());
    const currentScale = currentTransform.k;

    const targetTranslateX = centerX - (centerX + d.x) * currentScale;
    const targetTranslateY = centerY - (centerY + d.y) * currentScale;

    const newTransform = d3.zoomIdentity.translate(targetTranslateX, targetTranslateY).scale(currentScale);
    svg.transition().duration(750).call(zoom.transform, newTransform);

    if (event.type === "touchstart") {
        event.preventDefault();
        if (window.innerWidth <= 768) {
            if (selectionIndicatorCircle) {
                selectionIndicatorCircle.interrupt().remove();
            }
            selectionIndicatorCircle = effectsGroup.append("circle")
                .attr("cx", cx).attr("cy", cy).attr("r", selectionBaseRadius)
                .attr("fill", "none").attr("stroke", COLOR_SELECTION_INDICATOR)
                .attr("stroke-width", selectionStrokeWidth)
                .style("pointer-events", "none");
            pulsateSelectionIndicator(selectionIndicatorCircle, selectionBaseRadius, dynamicPulseAmount);
            updateSuccessDetailsSidebar(d);
            return; // Sur mobile tactile, on s'arrête après avoir affiché l'indicateur et la sidebar
        }
    }
    event.stopPropagation();
    if (selectionIndicatorCircle) {
        selectionIndicatorCircle.interrupt().remove();
    }
    selectionIndicatorCircle = effectsGroup.append("circle")
        .attr("cx", cx).attr("cy", cy).attr("r", selectionBaseRadius)
        .attr("fill", "none").attr("stroke", COLOR_SELECTION_INDICATOR)
        .attr("stroke-width", selectionStrokeWidth)
        .style("pointer-events", "none");
    pulsateSelectionIndicator(selectionIndicatorCircle, selectionBaseRadius, dynamicPulseAmount);

    updateSuccessDetailsSidebar(d);

    if (d.unlocked || isAnimatingUnlock) return;

    let canStartUnlockAnimation = (d.id === 0) || (d.pa || []).every(parentId => successMap.get(parentId)?.unlocked);
    if (!canStartUnlockAnimation) return;

    const initialCoverFill = (d.id === 0) ? COLOR_NODE_START : COLOR_NODE_UNLOCKABLE;
    currentPressTarget = d;
    isAnimatingUnlock = true;
    targetNode.attr("fill", COLOR_UNLOCK_ANIMATION_FILL);
    if (activeCoverCircle) activeCoverCircle.remove();
    activeCoverCircle = effectsGroup.append("circle") // Cercle de couverture
        .attr("cx", cx).attr("cy", cy).attr("r", nodeRadius) // Utiliser nodeRadius ici
        .attr("fill", initialCoverFill).style("pointer-events", "none");

    activeCoverCircle.transition("convergeDuringHold")
        .duration(1000).ease(d3.easeLinear).attr("r", 0)
        .on("end interrupt", function() {
            d3.select(this).remove();
            activeCoverCircle = null;
        });

    clearTimeout(pressTimer);
    pressTimer = setTimeout(() => {
        if (currentPressTarget === d) {
            const finalFillColor = (d.id === 0) ? COLOR_NODE_START : COLOR_NODE_UNLOCKED;
            triggerExplosionAndUnlock(targetNode, d, finalFillColor);
        } else {
            isAnimatingUnlock = false;
        }
        pressTimer = null;
    }, 1000);
}

function handlePressEnd(event, d) {
    if (event.type === "touchend" || event.type === "touchcancel") {
        event.preventDefault();
    }

    const targetNode = d3.select(this);
    let colorToRevertTo;
    if (d.id === 0) {
        colorToRevertTo = COLOR_NODE_START;
    } else if ((d.pa || []).every(parentId => successMap.get(parentId)?.unlocked)) {
        colorToRevertTo = COLOR_NODE_UNLOCKABLE; // Déblocable
    } else {
        colorToRevertTo = COLOR_NODE_LOCKED; // Non déblocable
    }

    if (currentPressTarget === d && pressTimer) {
        clearTimeout(pressTimer);
        pressTimer = null;
        if (activeCoverCircle) activeCoverCircle.interrupt("convergeDuringHold");

        targetNode.transition("holdEndColorCleanup")
            .duration(200)
            .attr("fill", colorToRevertTo);

        isAnimatingUnlock = false;
        currentPressTarget = null;
    }
}

nodes
    .on("mousedown", handlePressStart)
    .on("touchstart", handlePressStart)
    .on("mouseup", handlePressEnd)
    .on("mouseleave", handlePressEnd)
    .on("touchend", handlePressEnd)
    .on("touchcancel", handlePressEnd);

/**
 * Déclenche l'animation d'explosion et finalise le déverrouillage d'un succès.
 * @param {d3.Selection} nodeElement - La sélection D3 du nœud de succès.
 * @param {Object} successData - L'objet de données du succès.
 * @param {string} finalColor - La couleur que le nœud devrait avoir après le déverrouillage.
 */
function triggerExplosionAndUnlock(nodeElement, successData, finalColor) {
    if (successData.id === 99999) {
        triggerEpicFinalUnlockAnimation(nodeElement, successData, finalColor);
        return;
    }

    nodeElement.classed("unlocking-animation", true);

    const cx = parseFloat(nodeElement.attr("cx"));
    const cy = parseFloat(nodeElement.attr("cy"));
    const r = parseFloat(nodeElement.attr("r"));
    
    let explosionColorToUse;
    if (successData.id === 0) {
        explosionColorToUse = COLOR_NODE_START;
    } else {
        explosionColorToUse = successData.cou || COLOR_NODE_UNLOCKED; // Couleur perso si existe, sinon blanc
    }

    const explosionEffect = effectsGroup.append("circle")
        .attr("cx", cx).attr("cy", cy).attr("r", 0).attr("fill", explosionColorToUse).attr("opacity", 0.8)
        .style("pointer-events", "none");

    explosionEffect.transition("explodeEffect").duration(400).ease(d3.easeBounceOut).attr("r", r * 1.3)
        .transition("explodeFade").duration(300).attr("opacity", 0)
        .on("end", () => {
            explosionEffect.remove();
            successData.unlocked = true;
            level += successData.lvl;
            levelDisplayElement.textContent = level;
            updateNormalSuccessesCount();
            saveProgress();

            let actualNodeFillColor;
            if (successData.id === 0) {
                actualNodeFillColor = COLOR_NODE_START; // Le nœud 0 a toujours sa couleur de départ
            } else {
                actualNodeFillColor = successData.cou || finalColor; // Couleur perso si existe, sinon finalColor
            }

            nodeElement.transition("finalFillEffect")
                .duration(500).ease(d3.easeCubicInOut)
                .attr("fill", actualNodeFillColor)
                .on("end", () => {
                    nodeElement.classed("unlocking-animation", false);
                    isAnimatingUnlock = false;
                    currentPressTarget = null;

                    animateLinksToNewlyUnlockableChildren(successData);
                });
        });
}

/**
 * Déclenche une animation épique spécifique pour le déverrouillage du succès final (ID 99999).
 * @param {d3.Selection} nodeElement - La sélection D3 du nœud du succès final.
 * @param {Object} successData - L'objet de données du succès final.
 * @param {string} finalColor - La couleur que le nœud devrait avoir.
 */
function triggerEpicFinalUnlockAnimation(nodeElement, successData, finalColor) {
    const cx = parseFloat(nodeElement.attr("cx"));
    const cy = parseFloat(nodeElement.attr("cy"));
    const r = parseFloat(nodeElement.attr("r"));
    const epicColor = successData.cou || "#FFD700";

    // Jouer la musique de victoire dès le début de l'animation épique
    const victoryAudio = new Audio('audio/victory-sound.mp3'); // Assurez-vous que le chemin est correct
    victoryAudio.play().catch(error => {
        // La lecture automatique peut être bloquée par le navigateur si l'utilisateur n'a pas encore interagi avec la page.
        console.warn("La lecture automatique de l'audio de victoire a été bloquée : ", error);
    });

    // Obtenir la transformation actuelle du zoom/pan pour positionner les confettis correctement
    const currentTransform = d3.zoomTransform(svg.node());
    const nodeScreenX = currentTransform.applyX(cx); // Centre X du nœud dans les coordonnées de l'écran
    const nodeScreenY = currentTransform.applyY(cy); // Centre Y du nœud dans les coordonnées de l'écran
    // 1. Flash lumineux intense
    const flash = svg.append("rect")
        .attr("x", 0)
        .attr("y", 0)
        .attr("width", width)
        .attr("height", height)
        .attr("fill", "white")
        .attr("opacity", 0)
        .style("pointer-events", "none");

    flash.transition().duration(100).attr("opacity", 0.9)
        .transition().duration(300).attr("opacity", 0).remove();

    // 2. Tremblement d'écran prolongé et plus intense
    startScreenShake(2500, 8); // Durée augmentée à 2.5 secondes

    // Délai avant de commencer l'explosion principale pour laisser le flash agir
    setTimeout(() => {
        // 3. Explosion principale majestueuse
        const mainExplosion = effectsGroup.append("circle")
            .attr("cx", cx).attr("cy", cy).attr("r", r)
            .attr("fill", epicColor)
            .attr("opacity", 1)
            .style("pointer-events", "none");

        mainExplosion.transition("epicExplode").duration(1200).ease(d3.easeQuadOut)
            .attr("r", r * 5)
            .attr("opacity", 0)
            .on("end", () => mainExplosion.remove());

        // 4. Pluie d'étincelles
        const numSparks = 100;
        for (let i = 0; i < numSparks; i++) {
            const angle = Math.random() * 2 * Math.PI;
            const distance = r + Math.random() * (r * 4);
            const sparkSize = Math.random() * 6 + 2;
            const sparkDelay = Math.random() * 500;
            const sparkDuration = 800 + Math.random() * 700;

            effectsGroup.append("circle")
                .attr("cx", cx).attr("cy", cy)
                .attr("r", 0)
                .attr("fill", Math.random() > 0.3 ? epicColor : "white")
                .attr("opacity", 0.9)
                .style("pointer-events", "none")
                .transition().delay(sparkDelay).duration(sparkDuration).ease(d3.easeQuadOut)
                .attr("cx", cx + distance * Math.cos(angle))
                .attr("cy", cy + distance * Math.sin(angle))
                .attr("r", sparkSize)
                .transition().duration(sparkDuration * 0.5).ease(d3.easeQuadIn)
                .attr("opacity", 0)
                .attr("r", 0)
                .remove();
        }

        // 5. Effet de Confettis
        const numConfetti = 500; // Encore plus de confettis (le double)
        const confettiColors = ["#FFD700", "#FF8C00", "#FF4500", "#ADFF2F", "#00CED1", "#DA70D6", "#FFFFFF"];
        const maxSpreadRadius = Math.max(width, height) * 0.8; // Rayon de dispersion pour couvrir l'écran

        for (let i = 0; i < numConfetti; i++) {
            const confettoWidth = Math.random() * 8 + 4;
            const confettoHeight = Math.random() * 12 + 6;

            // Position initiale du confetto (centré sur la position du nœud à l'écran)
            const initialX = nodeScreenX - confettoWidth / 2;
            const initialY = nodeScreenY - confettoHeight / 2;

            const confetto = svg.append("rect") // Ajouté directement au SVG principal pour un positionnement à l'écran
                .attr("x", initialX)
                .attr("y", initialY)
                .attr("width", confettoWidth)
                .attr("height", confettoHeight)
                .attr("fill", confettiColors[Math.floor(Math.random() * confettiColors.length)])
                .attr("opacity", 1)
                .style("pointer-events", "none");

            const angle = Math.random() * Math.PI * 2; // Angle de dispersion
            const distance = Math.random() * maxSpreadRadius + maxSpreadRadius * 0.1; // Distance de dispersion relative à la taille de l'écran
            
            const fallDirection = Math.random() > 0.3 ? 1 : -0.2; // 70% tombent, 30% flottent un peu vers le haut au début
            const fallMagnitude = Math.random() * (height * 0.4) + (height * 0.1); // Ampleur de la chute
            const fallDistance = fallMagnitude * fallDirection;
            
            const duration = Math.random() * 2000 + 4000; // Durée de vie entre 4s et 6s
            const rotation = Math.random() * 720 - 360; // Rotation aléatoire

            // Position cible du confetto (coin supérieur gauche)
            const targetX = initialX + distance * Math.cos(angle);
            const targetY = initialY + distance * Math.sin(angle) + fallDistance;
            // Centre cible du confetto pour la rotation
            const targetCenterX = targetX + confettoWidth / 2;
            const targetCenterY = targetY + confettoHeight / 2;

            confetto.transition()
                .duration(duration)
                .ease(d3.easeQuadOut) // Mouvement vers l'extérieur
                .attr("x", targetX)
                .attr("y", targetY)
                .attr("transform", `rotate(${rotation}, ${targetCenterX}, ${targetCenterY})`)
                .transition() // Enchaîner une transition pour l'opacité
                .duration(500) // Durée du fondu
                .ease(d3.easeLinear) // Fondu linéaire
                .style("opacity", 0) // Disparaître
                .remove();
        }

        setTimeout(() => { // La logique de déverrouillage reste ici
            successData.unlocked = true;
            level += successData.lvl;
            levelDisplayElement.textContent = level;
            updateNormalSuccessesCount();
            saveProgress();

            nodeElement.transition("finalEpicFill")
                .duration(500).ease(d3.easeCubicInOut)
                .attr("fill", finalColor)
                .on("end", () => {
                    isAnimatingUnlock = false;
                    currentPressTarget = null;
                    startGlobalChromaEffect(); 

                    // Afficher le message de victoire dans une text box HTML
                    if (successData.victoryMsg) {
                        if (victoryMessageBox && victoryMessageTextElement && closeVictoryBoxButton) {
                            victoryMessageTextElement.innerText = successData.victoryMsg;
                            
                            victoryMessageBox.classList.remove("hidden");
                            setTimeout(() => {
                                victoryMessageBox.classList.add("visible");
                            }, 50); 

                            const hideVictoryBox = () => {
                                victoryMessageBox.classList.remove("visible");
                            };

                            closeVictoryBoxButton.onclick = hideVictoryBox;
                        }
                    }

                    updateNodeColors();
                    updateLinkColors();
                });
        }, 1000); // Délai pour que l'explosion principale ait un impact

    }, 150); // Délai après le flash initial
}


/**
 * Démarre un effet de changement de couleur en boucle (chroma) sur tous les nœuds
 * (sauf initial) et les liens connectés à ces nœuds chromatiques.
 */
function startGlobalChromaEffect() {
    if (!successMap.get(99999)?.unlocked) return;
    
    isGlobalChromaActive = true;
    if (chromaAnimationTimer) {
        chromaAnimationTimer.stop();
    }

    function executeChromaStep() {
        if (!successMap.get(99999)?.unlocked || !isGlobalChromaActive) {
            isGlobalChromaActive = false;
            if (chromaAnimationTimer) chromaAnimationTimer.stop();
            // Arrêter aussi les confettis en boucle si le chroma s'arrête
            stopLoopingSideConfetti();
            updateNodeColors(); updateLinkColors();
            return;
        }
        
        const currentColor = CHROMA_COLORS[chromaGlobalColorIndex];

    nodesGroup.selectAll("circle")
            .filter(d_node => d_node.id !== 0) // Tous les nœuds sauf le nœud initial
            .transition(`chroma_node_step_${chromaGlobalColorIndex}`).duration(CHROMA_TRANSITION_DURATION)
            .ease(d3.easeLinear).attr("fill", currentColor);

    linksGroup.selectAll("line")
            // Un lien est chromatique si au moins une de ses extrémités n'est pas le nœud 0
            .filter(d_link => d_link.source.id !== 0 || d_link.target.id !== 0)
            .transition(`chroma_link_step_${chromaGlobalColorIndex}`).duration(CHROMA_TRANSITION_DURATION)
            .ease(d3.easeLinear).attr("stroke", currentColor);

        chromaGlobalColorIndex = (chromaGlobalColorIndex + 1) % CHROMA_COLORS.length;
        chromaAnimationTimer = d3.timeout(executeChromaStep, CHROMA_TRANSITION_DURATION);
    }

    // Démarrer également les confettis en boucle si ce n'est pas déjà fait
    if (!isLoopingConfettiActive) {
        startLoopingSideConfetti();
    }
    executeChromaStep();
}

/**
 * Démarre un effet de confettis tombant en boucle sur les côtés de l'écran.
 */
function startLoopingSideConfetti() {
    if (!successMap.get(99999)?.unlocked) return; // S'assurer que le succès final est toujours débloqué

    isLoopingConfettiActive = true;
    const confettiInterval = 100; // Intervalle réduit pour tripler la densité des confettis (300ms / 3)
    const confettiSideColors = ["#E6E6FA", "#D8BFD8", "#DDA0DD", "#DA70D6", "#BA55D3", "#9932CC", "#8A2BE2"]; // Tons lavande/violet

    function createSideConfetto() {
        if (!isLoopingConfettiActive || !successMap.get(99999)?.unlocked) {
            if (loopingConfettiTimer) loopingConfettiTimer.stop();
            return;
        }

        // Position de départ X aléatoire sur toute la largeur de l'écran
        const startX = Math.random() * width;
        // Position de départ Y légèrement au-dessus de l'écran
        const startY = -30; 

        const confettoWidth = Math.random() * 6 + 3;
        const confettoHeight = Math.random() * 10 + 5;

        // Cible X avec un léger décalage horizontal aléatoire pour un effet de "flottement"
        const horizontalDrift = (Math.random() - 0.5) * 100; // Dérive de -50px à +50px
        const targetX = startX + horizontalDrift;
        // Cible Y pour qu'ils tombent en dessous de l'écran
        const targetY = height + 30; 

        const initialRotation = 0; 
        const finalRotation = Math.random() * 720 - 360; 

        // Créer un groupe pour chaque confetto pour gérer la translation et la rotation séparément
        const confettoGroup = svg.append("g")
            .attr("transform", `translate(${startX}, ${startY})`);

        confettoGroup.append("rect")
            .attr("x", -confettoWidth / 2) // Centrer le rectangle dans son groupe
            .attr("y", -confettoHeight / 2)
            .attr("width", confettoWidth)
            .attr("height", confettoHeight)
            .attr("fill", confettiSideColors[Math.floor(Math.random() * confettiSideColors.length)])
            .attr("opacity", 0.7 + Math.random() * 0.3)
            .style("pointer-events", "none")
            .transition() // Transition pour la rotation du rectangle
            .duration(5000 + Math.random() * 3000) // Durée entre 5s et 8s pour une chute lente
            .ease(d3.easeLinear)
            .attrTween("transform", function() {
                return d3.interpolateString(`rotate(${initialRotation})`, `rotate(${finalRotation})`);
            });

        confettoGroup.transition() // Transition pour la position du groupe
            .duration(5000 + Math.random() * 3000) // Même durée que la rotation
            .ease(d3.easeLinear)
            .attr("transform", `translate(${targetX}, ${targetY})`)
            .remove();

        loopingConfettiTimer = d3.timeout(createSideConfetto, confettiInterval);
    }
    createSideConfetto();
}

function stopLoopingSideConfetti() {
    isLoopingConfettiActive = false;
    if (loopingConfettiTimer) {
        loopingConfettiTimer.stop();
        loopingConfettiTimer = null;
    }
}

// ==========================================================================
// VI. AIDES UI & ANIMATION
// ==========================================================================

/**
 * Déclenche un effet de tremblement d'écran sur l'élément SVG principal.
 * @param {number} duration - Durée du tremblement en millisecondes.
 * @param {number} intensity - Intensité du tremblement (déplacement maximal en pixels).
 */
function startScreenShake(duration, intensity) {
    const svgNode = svg.node();
    if (!svgNode) return;

    const startTime = Date.now();

    function shake() {
        const elapsedTime = Date.now() - startTime;
        if (elapsedTime < duration) {
            const x = (Math.random() - 0.5) * 2 * intensity;
            const y = (Math.random() - 0.5) * 2 * intensity;
            svgNode.style.transform = `translate(${x}px, ${y}px)`;
            requestAnimationFrame(shake);
        } else {
            svgNode.style.transform = ''; // Réinitialiser la transformation
        }
    }
    requestAnimationFrame(shake);
}

/**
 * Met à jour la barre latérale avec les détails du succès fourni.
 * @param {Object|null} successData - L'objet de données du succès, ou null pour effacer.
 */
function updateSuccessDetailsSidebar(successData) {
    const nameEl = document.getElementById(SIDEBAR_NAME_ID);
    const descriptionEl = document.getElementById(SIDEBAR_DESCRIPTION_ID);
    const levelUpEl = document.getElementById(SIDEBAR_LEVELUP_ID);
    const conditionEl = document.getElementById(SIDEBAR_CONDITION_ID);

    currentSidebarSuccessData = successData;
    if (successData) {
        nameEl.textContent = successData.name;
        descriptionEl.textContent = successData.desc;
        levelUpEl.textContent = `Gain de niveau : +${successData.lvl}`;
        conditionEl.textContent = successData.cond ? `Condition : ${successData.cond}` : ""; // Afficher la condition si elle existe
    } else {
        nameEl.textContent = "Aucun succès sélectionné";
        descriptionEl.textContent = "Cliquez sur un succès pour afficher ses détails ici.";
        levelUpEl.textContent = "";
    }

    if (sidebarUnlockButton) {
        const isMobile = window.innerWidth <= 768;
        const canUnlockThisSuccess = successData && !successData.unlocked &&
                                     ((successData.id === 0) || (successData.pa || []).every(parentId => successMap.get(parentId)?.unlocked));

        if (isMobile && canUnlockThisSuccess) {
            sidebarUnlockButton.style.display = 'block';
        } else {
            sidebarUnlockButton.style.display = 'none';
        }
    }
}

/**
 * Anime un effet de pulsation pour le cercle indicateur de sélection.
 * @param {d3.Selection} circle - La sélection D3 du cercle à faire pulser.
 * @param {number} baseRadius - Le rayon de base du cercle.
 * @param {number} pulseAmplitude - L'amplitude de la pulsation.
 */
function pulsateSelectionIndicator(circle, baseRadius, pulseAmplitude) {
    if (!circle.node()) return;
    const duration = 700;

    circle
        .transition("pulseGrow").duration(duration).ease(d3.easeSinInOut).attr("r", baseRadius + pulseAmplitude)
        .transition("pulseShrink").duration(duration).ease(d3.easeSinInOut).attr("r", baseRadius - pulseAmplitude)
        .on("end", () => pulsateSelectionIndicator(circle, baseRadius, pulseAmplitude));
}

/**
 * Anime les lignes s'écoulant des succès parents vers les succès enfants nouvellement déverrouillables.
 * @param {Object} unlockedParentData - Les données du succès qui vient d'être déverrouillé.
 */
function animateLinksToNewlyUnlockableChildren(unlockedParentData) {
    linksGroup.selectAll(".reverse-animated-link.to-parent-" + unlockedParentData.id).remove();

    const newlyUnlockableChildren = [];
    successes.forEach(childSuccess => {
        if (!childSuccess.unlocked &&
            (childSuccess.pa || []).includes(unlockedParentData.id) &&
            (childSuccess.pa || []).every(pId => successMap.get(pId)?.unlocked)) {
            newlyUnlockableChildren.push(childSuccess);
        }
    });

    let childrenProcessedCount = 0;
    const totalChildrenToProcess = newlyUnlockableChildren.length;

    function checkAllLinkAnimationsComplete() {
        if (childrenProcessedCount === totalChildrenToProcess) {
            updateNodeColors();
            updateLinkColors();
        }
    }
    // Si aucun enfant ne devient déblocable, mettre à jour les couleurs immédiatement
    if (totalChildrenToProcess === 0) {
        updateNodeColors();
        updateLinkColors();
    } else {
        newlyUnlockableChildren.forEach(childData => { // Pour chaque enfant nouvellement déblocable
            const childNodeElement = nodes.filter(n => n.id === childData.id);
            if (childNodeElement.empty()) {
                childrenProcessedCount++;
                checkAllLinkAnimationsComplete();
                return;
            }

            const parentLinksToAnimate = [];
            (childData.pa || []).forEach(parentId => {
                const parentNode = successMap.get(parentId);
                if (parentNode) { // Vérification de sécurité, même si le parent devrait exister
                    let isLinkVisible = true;
                    if (childData.lig === false) {
                        isLinkVisible = Array.isArray(childData.exep) && childData.exep.includes(parentId);
                    }
                    if (isLinkVisible) {
                        parentLinksToAnimate.push(parentNode);
                    }
                }
            });

            let incomingAnimationsForThisChild = parentLinksToAnimate.length;
            const tempAnimatedLinesForThisChild = [];

            if (incomingAnimationsForThisChild === 0) {
                childNodeElement.transition("childBecomesUnlockable_noAnim_" + childData.id)
                    .duration(300).attr("fill", COLOR_NODE_UNLOCKABLE)
                    .on("end", () => {
                        childrenProcessedCount++;
                        checkAllLinkAnimationsComplete();
                    });
                return;
            }

            parentLinksToAnimate.forEach(parentNodeData => {
                const animatedLine = linksGroup.append("line")
                    .attr("x1", centerX + parentNodeData.x).attr("y1", centerY + parentNodeData.y)
                    .attr("x2", centerX + childData.x).attr("y2", centerY + childData.y)
                    .attr("stroke", COLOR_NODE_UNLOCKABLE).attr("stroke-width", 9) // Épaisseur triplée pour l'animation (3 * 3 = 9)
                    .style("pointer-events", "none");
                tempAnimatedLinesForThisChild.push(animatedLine);
                const length = Math.sqrt(Math.pow((centerX + childData.x) - (centerX + parentNodeData.x), 2) + Math.pow((centerY + childData.y) - (centerY + parentNodeData.y), 2));

                animatedLine
                    .attr("stroke-dasharray", length + " " + length)
                    .attr("stroke-dashoffset", length)
                    .transition("linkFlow_" + parentNodeData.id + "_to_" + childData.id)
                    .duration(1500).ease(d3.easeLinear).attr("stroke-dashoffset", 0)
                    .on("end", () => {
                        incomingAnimationsForThisChild--;
                        if (incomingAnimationsForThisChild === 0) {
                            tempAnimatedLinesForThisChild.forEach(line => line.remove());
                            childNodeElement.transition("childBecomesUnlockable_" + childData.id)
                                .duration(300).attr("fill", COLOR_NODE_UNLOCKABLE)
                                .on("end", () => {
                                    childrenProcessedCount++;
                                    checkAllLinkAnimationsComplete();
                                });
                        }
                    });
            });
        });
    }
}

/**
 * Déverrouille un succès et tous ses parents en mode développeur.
 * @param {Object} targetSuccessData - Les données du succès cible.
 */
function devModeUnlock(targetSuccessData) {
    if (isAnimatingUnlock) return;

    isAnimatingUnlock = true; // Marquer comme animant pour éviter les conflits

    let totalLevelGainedFromUnlock = 0;

    // Fonction récursive pour déverrouiller le succès et ses parents
    function unlockWithPrerequisites(successIdToUnlock) {
        const success = successMap.get(successIdToUnlock);
        if (!success || success.unlocked) {
            return 0;
        }

        let levelGainedThisCall = 0;

        // Déverrouiller d'abord les parents
        (success.pa || []).forEach(parentId => {
            levelGainedThisCall += unlockWithPrerequisites(parentId);
        });

        if (!success.unlocked) { // Vérification supplémentaire
            success.unlocked = true;
            levelGainedThisCall += success.lvl;

            const nodeElement = nodes.filter(n => n.id === success.id);
            if (!nodeElement.empty()) {
                const finalColor = (success.id === 0) ? COLOR_NODE_START : (success.cou || COLOR_NODE_UNLOCKED);
                nodeElement.transition("devUnlockFill").duration(100).attr("fill", finalColor);
            }
        }
        return levelGainedThisCall;
    }

    totalLevelGainedFromUnlock = unlockWithPrerequisites(targetSuccessData.id);

    level += totalLevelGainedFromUnlock;
    updateNormalSuccessesCount();
    levelDisplayElement.textContent = level;
    saveProgress();
    updateNodeColors();
    updateLinkColors();
    isAnimatingUnlock = false;
}

/**
 * Calcule et met à jour l'affichage du nombre de succès normaux débloqués et restants.
 * Les succès "normaux" excluent le nœud initial, les ROUTES, les PONTS et le succès final.
 */
function updateNormalSuccessesCount() {
    if (!unlockedNormalSuccessesDisplayElement || !remainingNormalSuccessesDisplayElement) {
        return;
    }

    const normalSuccesses = successes.filter(s =>
        s.id > 18 &&           // Exclut le nœud 0 (initial) et les ROUTES (ID 1-18)
        s.id % 1000 !== 0 &&   // Exclut les ponts (ID se terminant par 000, ex: 1000, 2000)
        s.id !== 99999         // Exclut le succès final (ID 99999)
    );

    const unlockedCount = normalSuccesses.filter(s => s.unlocked).length;
    const totalNormalCount = normalSuccesses.length;
    const remainingCount = totalNormalCount - unlockedCount;

    unlockedNormalSuccessesDisplayElement.textContent = unlockedCount;
    remainingNormalSuccessesDisplayElement.textContent = remainingCount;
}
// ==========================================================================
// VIII. PARAMÈTRES & UTILITAIRES
// ==========================================================================

/**
 * Réinitialise toute la progression, y compris le niveau et les succès déverrouillés.
 */
function performReset() {
    console.log("Progression réinitialisée");
    level = 0;
    successes.forEach(s => s.unlocked = false);

    if (chromaAnimationTimer) {
        chromaAnimationTimer.stop();
        chromaAnimationTimer = null;
    }
    stopLoopingSideConfetti(); // Arrêter les confettis en boucle lors du reset
    isGlobalChromaActive = false;
    chromaGlobalColorIndex = 0;
    saveProgress();
    updateNormalSuccessesCount();
    levelDisplayElement.textContent = level;

    if (selectionIndicatorCircle) {
        selectionIndicatorCircle.interrupt();
        selectionIndicatorCircle.remove();
        selectionIndicatorCircle = null;
    }
    updateNodeColors();
    updateLinkColors();
    updateSuccessDetailsSidebar(null);
}

// --- Logique pour le bouton de bascule de la Sidebar ---
function setupSidebarToggle() {
    if (!sidebarToggleButton || !sidebarContentWrapper) {
        console.warn("Sidebar toggle button or content wrapper not found.");
        return;
    }

    const updateSidebarState = () => {
        if (window.innerWidth <= 768) {
            sidebarToggleButton.style.display = "block";
            if (!sidebarContentWrapper.classList.contains('manually-expanded')) {
                sidebarContentWrapper.classList.add("collapsed");
                sidebarToggleButton.textContent = "Afficher les détails ▶";
                sidebarToggleButton.setAttribute('aria-expanded', 'false');
            }
        } else {
            sidebarToggleButton.style.display = "none";
            sidebarContentWrapper.classList.remove("collapsed");
            sidebarToggleButton.setAttribute('aria-expanded', 'true');
        }
    };

    sidebarToggleButton.onclick = function() {
        const isCollapsed = sidebarContentWrapper.classList.toggle("collapsed");
        sidebarToggleButton.textContent = isCollapsed ? "Afficher les détails ▶" : "Cacher les détails ▼";
        sidebarToggleButton.setAttribute('aria-expanded', !isCollapsed);
        if (!isCollapsed) {
            sidebarContentWrapper.classList.add('manually-expanded');
        } else {
            sidebarContentWrapper.classList.remove('manually-expanded');
        }
    };
    updateSidebarState(); // Initialiser l'état
}

// --- Logique pour le bouton de déverrouillage dans la Sidebar ---
function setupSidebarUnlockButton() {
    if (!sidebarUnlockButton) return;

    sidebarUnlockButton.onclick = function() {
        if (!currentSidebarSuccessData || currentSidebarSuccessData.unlocked || isAnimatingUnlock) {
            return;
        }

        const successData = currentSidebarSuccessData;
        const targetNode = nodes.filter(n => n.id === successData.id);

        if (targetNode.empty()) {
            console.error("Nœud non trouvé pour le déblocage via le bouton de la sidebar.");
            return;
        }

        const canUnlock = (successData.id === 0) || (successData.pa || []).every(parentId => successMap.get(parentId)?.unlocked);
        if (!canUnlock) {
            updateSuccessDetailsSidebar(successData); // Rafraîchir l'état du bouton
            return;
        }

        isAnimatingUnlock = true;
        currentPressTarget = successData; 
        targetNode.attr("fill", COLOR_UNLOCK_ANIMATION_FILL);

        triggerExplosionAndUnlock(targetNode, successData, successData.cou || (successData.id === 0 ? COLOR_NODE_START : COLOR_NODE_UNLOCKED));
        sidebarUnlockButton.style.display = 'none';
    };
}

// --- Logique pour le menu des paramètres ---
function hideSettingsMenu() {
    settingsMenu.classList.add("hidden");
    settingsIcon.style.transform = "rotate(0deg)";
}

function updateDevModeIndicator() {
    if (devModeIndicator) {
        if (isDevModeActive) {
            devModeIndicator.classList.remove("hidden");
            if (menuItemDevUnlockAll) menuItemDevUnlockAll.classList.remove("hidden"); // Afficher le bouton
        } else {
            devModeIndicator.classList.add("hidden");
            if (menuItemDevUnlockAll) menuItemDevUnlockAll.classList.add("hidden"); // Cacher le bouton
        }
    }
}

function devUnlockAllExceptLast() {
    if (!isDevModeActive) return;
    if (confirm("Êtes-vous sûr de vouloir débloquer tous les succès (sauf le dernier) ? Cette action est irréversible sans réinitialisation.")) {
        let totalLevelGained = 0;
        successes.forEach(s => {
            if (s.id !== 99999 && !s.unlocked) {
                s.unlocked = true;
                totalLevelGained += s.lvl;
            }
        });
        level += totalLevelGained;
        levelDisplayElement.textContent = level;
        updateNormalSuccessesCount();
        saveProgress();
        updateNodeColors();
        updateLinkColors();
        console.log("Tous les succès (sauf le dernier) ont été débloqués en mode développeur.");
        hideSettingsMenu();
    }
}

settingsIcon.onclick = function() {
    const isCurrentlyHidden = settingsMenu.classList.contains("hidden");
    settingsMenu.classList.toggle("hidden");
    if (isCurrentlyHidden) {
        settingsIcon.style.transform = "rotate(180deg)";
    } else {
        settingsIcon.style.transform = "rotate(0deg)";
    }
};
menuItemReset.onclick = function() {
    resetConfirmationDialog.classList.remove("hidden");
    hideSettingsMenu();
};

menuItemDevMode.onclick = function() {
    hideSettingsMenu();
    if (isDevModeActive) {
        if (confirm("Le mode développeur est actif. Voulez-vous le désactiver ?")) {
            isDevModeActive = false;
            console.log("Mode développeur désactivé.");
        }
    } else {
        passwordDevModal.classList.remove("hidden");
        devModePasswordInput.value = "";
        devModePasswordInput.focus();
        devModePasswordError.classList.add("hidden");
    }
};

// Gestion de la soumission du mot de passe de la modale
submitDevModePasswordButton.onclick = function() {
    const enteredPassword = devModePasswordInput.value;
    if (enteredPassword === "1ceceslt1") {
        passwordDevModal.classList.add("hidden");
        if (confirm("Mot de passe correct. Voulez-vous activer le mode développeur ?\nCela vous permettra de débloquer les succès instantanément en cliquant dessus, ainsi que leurs prérequis.")) {
            isDevModeActive = true;
            console.log("Mode développeur activé.");
        } else {
            isDevModeActive = false; // S'assurer que c'est bien désactivé
        }
    } else {
        devModePasswordError.textContent = "Mot de passe incorrect.";
        devModePasswordError.classList.remove("hidden");
        devModePasswordInput.value = "";
        devModePasswordInput.focus();
    }
    saveProgress();
    updateDevModeIndicator();
};

if (menuItemDevUnlockAll) {
    menuItemDevUnlockAll.onclick = devUnlockAllExceptLast;
}


// Gestion de la fermeture de la modale
closeDevModalButton.onclick = function() {
    passwordDevModal.classList.add("hidden");
};
window.onclick = function(event) {
    if (event.target == passwordDevModal) {
        passwordDevModal.classList.add("hidden");
    }
};

menuItemConnexion.onclick = function() {
    console.log("Redirection vers la page de connexion...");
    window.location.href = "login.html";
    hideSettingsMenu();
};

confirmResetButton.onclick = function() {
    performReset();
    resetConfirmationDialog.classList.add("hidden");
    hideSettingsMenu();
};

cancelResetButton.onclick = function() {
    resetConfirmationDialog.classList.add("hidden");
    hideSettingsMenu();
};

// --- Logique pour la modale de bienvenue ---
function showWelcomeModal() {
    if (welcomeModal) { // On affiche toujours la modale si elle existe
        welcomeModal.classList.remove("hidden");
    }
}

function hideWelcomeModal() {
    if (welcomeModal) {
        welcomeModal.classList.add("hidden");
        // sessionStorage.setItem('welcomeModalShown', 'true'); // On ne sauvegarde plus l'état
    }
}

if (closeWelcomeModalButton) {
    closeWelcomeModalButton.onclick = hideWelcomeModal;
}
if (gotItWelcomeButton) {
    gotItWelcomeButton.onclick = hideWelcomeModal;
}


// ==========================================================================
// IX. EXÉCUTION INITIALE
// ==========================================================================
updateNodeColors();
updateLinkColors();
updateSuccessDetailsSidebar(null);
setupSidebarToggle();
setupSidebarUnlockButton();
updateDevModeIndicator();
showWelcomeModal(); // Afficher la modale de bienvenue au chargement
updateNormalSuccessesCount();

// Démarrer l'effet chroma global si le succès final est déjà débloqué au chargement
if (successMap.get(99999)?.unlocked) {
    d3.timeout(() => {
        if (successMap.get(99999)?.unlocked) { // Double vérification au cas où un reset aurait eu lieu entre-temps
            startGlobalChromaEffect();
        }
    }, 500);
}
