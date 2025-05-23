// ==========================================================================
// I. INITIALISATION & CONFIGURATION
// ==========================================================================

// --- Variables d'état global ---
let level = parseInt(localStorage.getItem("level")) || 0;
let currentPressTarget = null; // Données du nœud de succès en cours de pression
let pressTimer = null;         // Minuteur pour l'action de maintien pour déverrouiller
let isAnimatingUnlock = false; // Drapeau pour éviter les animations de déverrouillage conflictuelles
let activeCoverCircle = null;  // Sélection D3 du cercle de couverture rétrécissant pendant le déverrouillage
let selectionIndicatorCircle = null; // Sélection D3 du cercle de sélection jaune pulsant

// --- Constants ---
// Colors
const COLOR_NODE_START = "#FFA500";        // Orange pour le nœud de départ
const COLOR_NODE_UNLOCKED = "#fff";         // Blanc pour les nœuds génériques déverrouillés
const COLOR_NODE_LOCKED = "#666";          // Gris pour les nœuds verrouillés, non déverrouillables
const COLOR_NODE_UNLOCKABLE = "#66f";       // Bleu clair pour les nœuds déverrouillables
const COLOR_NODE_STROKE = "#222";          // Couleur du contour des nœuds
const COLOR_LINK = "#555";                 // Couleur par défaut des liens
const COLOR_UNLOCK_ANIMATION_FILL = "#666"; // Couleur de remplissage du nœud pendant l'animation de déverrouillage
const COLOR_SELECTION_INDICATOR = "yellow"; // Couleur du cercle de sélection

// DOM Element IDs for Sidebar
const SIDEBAR_NAME_ID = "sidebar-success-name"; // ID pour le nom du succès dans la barre latérale
const SIDEBAR_DESCRIPTION_ID = "sidebar-success-description"; // ID pour la description du succès dans la barre latérale
const SIDEBAR_LEVELUP_ID = "sidebar-success-levelup"; // ID pour le gain de niveau dans la barre latérale

// --- DOM Element Selections ---
// Level display
const levelDisplayElement = document.getElementById("level-display"); // Élément d'affichage du niveau
levelDisplayElement.textContent = level;

// Settings Menu Elements
const settingsIcon = document.getElementById("settings-icon"); // Icône des paramètres
const settingsMenu = document.getElementById("settings-menu"); // Menu des paramètres
const menuItemReset = document.getElementById("menu-item-reset"); // Option de menu pour réinitialiser
const menuItemDevMode = document.getElementById("menu-item-dev-mode"); // Option de menu pour le mode développeur
const resetConfirmationDialog = document.getElementById("reset-confirmation-dialog"); // Dialogue de confirmation de réinitialisation
const confirmResetButton = document.getElementById("confirm-reset-button"); // Bouton de confirmation de réinitialisation
const cancelResetButton = document.getElementById("cancel-reset-button"); // Bouton d'annulation de réinitialisation

// ==========================================================================
// II. GESTION DES DONNÉES & STOCKAGE
// ==========================================================================

// Load saved progress from localStorage
const savedProgress = JSON.parse(localStorage.getItem("successProgress")) || []; // Chargement de la progression sauvegardée
successes.forEach(s => { s.unlocked = savedProgress.includes(s.id); });

// Create a map for quick success lookup by ID
const successMap = new Map(successes.map(s => [s.id, s])); // Création d'une map pour une recherche rapide des succès par ID

/**
 * Sauvegarde la progression actuelle (succès déverrouillés et niveau) dans localStorage.
 */
function saveProgress() {
    localStorage.setItem("successProgress", JSON.stringify(successes.filter(s => s.unlocked).map(s => s.id)));
    localStorage.setItem("level", level);
}

// ==========================================================================
// III. CONFIGURATION D3 & RENDU
// ==========================================================================

// --- SVG Setup ---
const width = window.innerWidth;
const height = window.innerHeight;
const svg = d3.select("#graph").attr("width", width).attr("height", height);
const container = svg.append("g"); // Conteneur principal pour le zoom et le déplacement

// Création de groupes dédiés pour contrôler l'ordre de rendu (z-index)
const linksGroup = container.append("g").attr("class", "links-group"); // Pour toutes les lignes (statiques et animées)
const nodesGroup = container.append("g").attr("class", "nodes-group");   // Pour tous les cercles de succès
const effectsGroup = container.append("g").attr("class", "effects-group"); // Pour les effets au premier plan (indicateur, explosions, etc.)

// --- Zoom Behavior ---
svg.call(d3.zoom().scaleExtent([0.05, 2]).on("zoom", (event) => {
    container.attr("transform", event.transform); // Appliquer la transformation de zoom au conteneur
}));

// --- Link Data Generation ---
/**
 * Génère un tableau d'objets de lien à partir des données des succès.
 * Chaque objet de lien contient les données du nœud source, du nœud cible et un ID unique.
 * @returns {Array<Object>} Tableau d'objets de données de lien.
 */
function getLinkData() {
    const linkData = [];
    successes.forEach(s => {
        s.parents.forEach(parentId => {
            const parent = successMap.get(parentId);
            if (parent) {
                linkData.push({ source: parent, target: s, id: `link-${parent.id}-to-${s.id}` });
            }
        });
    });
    return linkData;
}

// --- Drawing Links ---
const links = linksGroup // Les liens statiques sont ajoutés au groupe des liens
    .attr("class", "links")
    .selectAll("line")
    .data(getLinkData(), d => d.id)
    .enter()
    .append("line")
    .attr("x1", d => d.source.x)
    .attr("y1", d => d.source.y)
    .attr("x2", d => d.target.x)
    .attr("y2", d => d.target.y)
    .attr("stroke-width", 2);
    // La couleur de contour initiale est définie par updateLinkColors()

// --- Drawing Nodes (Successes) ---
const nodes = nodesGroup.selectAll("circle") // Les nœuds sont ajoutés à leur propre groupe
    .data(successes, d => d.id) // Utiliser d.id comme clé pour la liaison de données
    .enter()
    .append("circle")
    .attr("cx", d => d.x)
    .attr("cy", d => d.y)
    .attr("r", d => d.id === 1 ? 30 : 20) // Le nœud de départ est plus grand
    .attr("stroke", COLOR_NODE_STROKE)
    .attr("stroke-width", 2);
    // La couleur de remplissage initiale est définie par updateNodeColors()

// ==========================================================================
// IV. FONCTIONS DE MISE À JOUR VISUELLE PRINCIPALES
// ==========================================================================

/**
 * Met à jour la couleur de remplissage de tous les nœuds de succès en fonction de leur état actuel.
 */
function updateNodeColors() {
    nodes.transition("globalNodeColorUpdate") // Nommer la transition pour une meilleure gestion
        .duration(1000)
        .ease(d3.easeCubicInOut)
        .attr("fill", d => {
            if (d.unlocked) {
                return (d.id === 1) ? COLOR_NODE_START : COLOR_NODE_UNLOCKED;
            }
            if (d.id === 1) { // Starting node, not yet unlocked
                return COLOR_NODE_START; // Le nœud de départ, pas encore déverrouillé
            }
            if (d.parents.every(parentId => successMap.get(parentId)?.unlocked)) {
                return COLOR_NODE_UNLOCKABLE;
            }
            return COLOR_NODE_LOCKED;
        });
}

/**
 * Met à jour la couleur de contour de tous les liens en fonction de l'état de leurs nœuds connectés.
 */
function updateLinkColors() {
    links.transition("globalLinkColorUpdate") // Nommer la transition
        .duration(1000)
        .attr("stroke", d => {
            const sourceNode = d.source;
            const targetNode = d.target;

            if (sourceNode.unlocked && targetNode.unlocked) {
                return COLOR_NODE_UNLOCKED; // Les deux déverrouillés : Blanc
            } else if (sourceNode.unlocked && !targetNode.unlocked && targetNode.parents.every(pId => successMap.get(pId)?.unlocked)) {
                return COLOR_NODE_UNLOCKABLE; // Parent déverrouillé, enfant devient déverrouillable : Bleu clair
            } else {
                return COLOR_LINK; // Défaut : Gris
            }
        });
}

// ==========================================================================
// V. INTERACTION AVEC LES SUCCÈS & LOGIQUE DE DÉVERROUILLAGE
// ==========================================================================

nodes
    .on("mousedown", function(event, d) {
        event.stopPropagation(); // Prevent zoom drag during node interaction

        const targetNode = d3.select(this);
        const cx = parseFloat(targetNode.attr("cx"));
        const cy = parseFloat(targetNode.attr("cy"));
        const r = parseFloat(targetNode.attr("r"));
        const selectionBaseRadius = r + 4;

        // --- Selection Indicator Management ---
        if (selectionIndicatorCircle) {
            selectionIndicatorCircle.interrupt();
            selectionIndicatorCircle.remove();
        }
        selectionIndicatorCircle = effectsGroup.append("circle") // L'indicateur va dans le groupe des effets
            .attr("cx", cx).attr("cy", cy).attr("r", selectionBaseRadius)
            .attr("fill", "none")
            .attr("stroke", COLOR_SELECTION_INDICATOR)
            .attr("stroke-width", 2.5)
            .style("pointer-events", "none");
        pulsateSelectionIndicator(selectionIndicatorCircle, selectionBaseRadius);
        // Mettre à jour la barre latérale avec les informations du succès cliqué
        updateSuccessDetailsSidebar(d); 

        // --- Unlock Eligibility Check ---
        if (d.unlocked || isAnimatingUnlock) { // Si déjà déverrouillé ou une autre animation est en cours
            return; 
        }

        let canStartUnlockAnimation = false;
        let initialCoverFill;

        if (d.id === 1) { // Special case for the first success
            canStartUnlockAnimation = true;
            initialCoverFill = COLOR_NODE_START; // Le cercle de couverture est orange
        } else if (d.parents.every(parentId => successMap.get(parentId)?.unlocked)) { // Other unlockable successes
            canStartUnlockAnimation = true;
            initialCoverFill = COLOR_NODE_UNLOCKABLE; // Le cercle de couverture est bleu clair
        }

        if (!canStartUnlockAnimation) { // Non éligible pour l'animation de déverrouillage
            return; 
        }

        // --- Start Unlock Animation Sequence ---
        currentPressTarget = d;
        isAnimatingUnlock = true;

        targetNode.attr("fill", COLOR_UNLOCK_ANIMATION_FILL); // Node turns to "locked" color during animation
        // Le nœud prend la couleur "verrouillé" pendant l'animation
        if (activeCoverCircle) activeCoverCircle.remove(); // Clean up previous cover circle if any
        activeCoverCircle = effectsGroup.append("circle") // Le cercle de couverture va aussi dans le groupe des effets
            .attr("cx", cx).attr("cy", cy).attr("r", r)
            .attr("fill", initialCoverFill)
            .style("pointer-events", "none");

        activeCoverCircle.transition("convergeDuringHold")
            .duration(1000) // Maintien d'1 seconde
            .ease(d3.easeLinear)
            .attr("r", 0)
            .on("end interrupt", function() { // Supprimer à la fin ou à l'interruption
                d3.select(this).remove();
                activeCoverCircle = null;
            });

        clearTimeout(pressTimer);
        pressTimer = setTimeout(() => {
            if (currentPressTarget === d) {
                const finalFillColor = (d.id === 1) ? COLOR_NODE_START : COLOR_NODE_UNLOCKED;
                triggerExplosionAndUnlock(targetNode, d, finalFillColor);
            } else {
                isAnimatingUnlock = false; // La cible a changé pendant le maintien
            }
            pressTimer = null;
        }, 1000);
    })
    .on("mouseup", function(event, d) {
        const targetNode = d3.select(this);
        const colorToRevertTo = (d.id === 1 && currentPressTarget === d) ? COLOR_NODE_START : COLOR_NODE_UNLOCKABLE;

        if (currentPressTarget === d && pressTimer) { // Pression courte, minuteur toujours actif
            clearTimeout(pressTimer);
            pressTimer = null;
            if (activeCoverCircle) activeCoverCircle.interrupt("convergeDuringHold");

            targetNode.transition("holdEndColorShort")
                .duration(200)
                .attr("fill", colorToRevertTo);

            isAnimatingUnlock = false;
            currentPressTarget = null;
        }
        // Si pressTimer est null, cela signifie que le maintien s'est terminé ou a été géré par mouseleave
    })
    .on("mouseleave", function(event, d) {
        const targetNode = d3.select(this);
        const colorToRevertTo = (d.id === 1 && currentPressTarget === d) ? COLOR_NODE_START : COLOR_NODE_UNLOCKABLE;

        if (currentPressTarget === d && pressTimer) { // Nœud quitté pendant le maintien et minuteur actif
            clearTimeout(pressTimer);
            pressTimer = null;
            if (activeCoverCircle) activeCoverCircle.interrupt("convergeDuringHold");

            targetNode.transition("holdLeaveColor")
                .duration(200)
                .attr("fill", colorToRevertTo);

            isAnimatingUnlock = false;
            currentPressTarget = null;
        }
    });

/**
 * Déclenche l'animation d'explosion et finalise le déverrouillage d'un succès.
 * @param {d3.Selection} nodeElement - La sélection D3 du nœud de succès.
 * @param {Object} successData - L'objet de données du succès.
 * @param {string} finalColor - La couleur que le nœud devrait avoir après le déverrouillage.
 */
function triggerExplosionAndUnlock(nodeElement, successData, finalColor) {
    nodeElement.classed("unlocking-animation", true); // Marquer pour éviter les problèmes avec mouseup

    const cx = parseFloat(nodeElement.attr("cx"));
    const cy = parseFloat(nodeElement.attr("cy"));
    const r = parseFloat(nodeElement.attr("r"));

    const explosionEffect = effectsGroup.append("circle") // L'explosion va dans le groupe des effets
        .attr("cx", cx).attr("cy", cy).attr("r", 0)
        .attr("fill", finalColor).attr("opacity", 0.8)
        .style("pointer-events", "none");

    explosionEffect.transition("explodeEffect").duration(400).ease(d3.easeBounceOut).attr("r", r * 1.3)
        .transition("explodeFade").duration(300).attr("opacity", 0)
        .on("end", () => {
            explosionEffect.remove();

            // Déverrouillage effectif
            successData.unlocked = true;
            level += successData.levelUp;
            levelDisplayElement.textContent = level;
            saveProgress();

            nodeElement.transition("finalFillEffect").duration(500).ease(d3.easeCubicInOut).attr("fill", finalColor)
                .on("end", () => {
                    nodeElement.classed("unlocking-animation", false);
                    isAnimatingUnlock = false;
                    currentPressTarget = null;

                    animateLinksToNewlyUnlockableChildren(successData);
                });
        });
}

// ==========================================================================
// VI. AIDES UI & ANIMATION
// ==========================================================================

/**
 * Met à jour la barre latérale avec les détails du succès fourni.
 * @param {Object|null} successData - L'objet de données du succès, ou null pour effacer.
 */
function updateSuccessDetailsSidebar(successData) {
    const nameEl = document.getElementById(SIDEBAR_NAME_ID);
    const descriptionEl = document.getElementById(SIDEBAR_DESCRIPTION_ID);
    const levelUpEl = document.getElementById(SIDEBAR_LEVELUP_ID);

    if (successData) {
        nameEl.textContent = successData.name;
        descriptionEl.textContent = successData.description;
        levelUpEl.textContent = `Gain de niveau : +${successData.levelUp}`;
    } else {
        nameEl.textContent = "Aucun succès sélectionné";
        descriptionEl.textContent = "Cliquez sur un succès pour afficher ses détails ici.";
        levelUpEl.textContent = "";
    }
}

/**
 * Anime un effet de pulsation pour le cercle indicateur de sélection.
 * @param {d3.Selection} circle - La sélection D3 du cercle à faire pulser.
 * @param {number} baseRadius - Le rayon de base du cercle.
 */
function pulsateSelectionIndicator(circle, baseRadius) {
    if (!circle.node()) return; // Arrêter si le cercle est retiré
    // Définition de l'amplitude et de la durée de la pulsation
    const pulseAmount = 2;
    const duration = 700;

    circle
        .transition("pulseGrow").duration(duration).ease(d3.easeSinInOut).attr("r", baseRadius + pulseAmount)
        .transition("pulseShrink").duration(duration).ease(d3.easeSinInOut).attr("r", baseRadius)
        .on("end", () => pulsateSelectionIndicator(circle, baseRadius));
}

/**
 * Anime les lignes s'écoulant des succès parents vers les succès enfants nouvellement déverrouillables.
 * @param {Object} unlockedParentData - Les données du succès qui vient d'être déverrouillé.
 */
function animateLinksToNewlyUnlockableChildren(unlockedParentData) {
    const newlyUnlockableChildren = [];
    successes.forEach(childSuccess => {
        if (!childSuccess.unlocked &&
            childSuccess.parents.includes(unlockedParentData.id) &&
            childSuccess.parents.every(pId => successMap.get(pId)?.unlocked)) {
            newlyUnlockableChildren.push(childSuccess);
        }
    });

    let childrenProcessedCount = 0;
    const totalChildrenToProcess = newlyUnlockableChildren.length;

    // Fonction pour vérifier si toutes les animations de lien sont terminées
    function checkAllLinkAnimationsComplete() {
        if (childrenProcessedCount === totalChildrenToProcess) {
            updateNodeColors();
            updateLinkColors();
        }
    }

    // Si aucun enfant ne devient déblocable, mettre à jour les couleurs globales immédiatement
    if (totalChildrenToProcess === 0) {
        updateNodeColors();
        updateLinkColors();
    } else {
        newlyUnlockableChildren.forEach(childData => {
            const childNodeElement = nodes.filter(n => n.id === childData.id);
            if (childNodeElement.empty()) {
                childrenProcessedCount++; // Sécurité : si le nœud enfant n'est pas trouvé
                checkAllLinkAnimationsComplete();
                return;
            }

            let incomingAnimationsForThisChild = 0;
            const tempAnimatedLinesForThisChild = [];

            childData.parents.forEach(parentId => {
                const parentNodeData = successMap.get(parentId);
                // Tous les parents de childData sont maintenant déverrouillés.

                incomingAnimationsForThisChild++;
                const animatedLine = linksGroup.append("line") // La ligne animée est ajoutée au groupe des liens
                    .attr("x1", parentNodeData.x).attr("y1", parentNodeData.y)
                    .attr("x2", childData.x).attr("y2", childData.y)
                    .attr("stroke", COLOR_NODE_UNLOCKABLE).attr("stroke-width", 3)
                    .style("pointer-events", "none");
                tempAnimatedLinesForThisChild.push(animatedLine);

                const length = Math.sqrt(Math.pow(childData.x - parentNodeData.x, 2) + Math.pow(childData.y - parentNodeData.y, 2)); // Calcul de la longueur du lien

                animatedLine
                    .attr("stroke-dasharray", length + " " + length)
                    .attr("stroke-dashoffset", length)
                    .transition("linkFlow_" + parentNodeData.id + "_to_" + childData.id) // Nommer la transition
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

// ==========================================================================
// VII. PARAMÈTRES & UTILITAIRES
// ==========================================================================

/**
 * Réinitialise toute la progression, y compris le niveau et les succès déverrouillés.
 */
function performReset() {
    console.log("Progression réinitialisée");
    level = 0;
    successes.forEach(s => s.unlocked = false);
    saveProgress(); // Sauvegarder l'état réinitialisé
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

// --- Settings Menu Event Listeners ---
settingsIcon.onclick = function() {
    // Détermine l'état actuel du menu (visible ou caché) *avant* de le basculer.
    const isCurrentlyHidden = settingsMenu.classList.contains("hidden");

    settingsMenu.classList.toggle("hidden");

    // Applique la rotation en fonction de l'action (ouverture ou fermeture)
    if (isCurrentlyHidden) { // Le menu était caché, il est maintenant affiché (ouverture)
        settingsIcon.style.transform = "rotate(180deg)"; // Rotation sens horaire de 180 degrés
    } else { // Le menu était visible, il est maintenant caché (fermeture)
        settingsIcon.style.transform = "rotate(0deg)"; // Rotation sens antihoraire (retour à l'état initial)
    }
    // Important : Assurez-vous que l'élément #settings-icon a une propriété CSS 'transition'
    // pour que la rotation soit animée. Par exemple: 'transition: transform 0.4s ease-in-out;'
};

menuItemReset.onclick = function() {
    resetConfirmationDialog.classList.remove("hidden");
    settingsMenu.classList.add("hidden");
};

menuItemDevMode.onclick = function() {
    console.log("Mode développeur cliqué (fonctionnalité à implémenter)");
    alert("Le mode développeur n'est pas encore implémenté.");
    settingsMenu.classList.add("hidden");
};

confirmResetButton.onclick = function() {
    performReset();
    resetConfirmationDialog.classList.add("hidden");
};

cancelResetButton.onclick = function() {
    resetConfirmationDialog.classList.add("hidden");
};

// ==========================================================================
// VIII. EXÉCUTION INITIALE
// ==========================================================================
updateNodeColors();
updateLinkColors();
updateSuccessDetailsSidebar(null); // Initialiser la barre latérale avec le message par défaut
