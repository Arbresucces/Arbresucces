// Chargement de la progression sauvegardée
const savedProgress = JSON.parse(localStorage.getItem("successProgress")) || [];
successes.forEach(s => { s.unlocked = savedProgress.includes(s.id); });

// Initialiser le niveau
import { successes } from "./successData.js";
let level = parseInt(localStorage.getItem("level")) || 0;
document.getElementById("level-display").textContent = level;

// Dimensions de la scène
const width = window.innerWidth, height = window.innerHeight;
const svg = d3.select("#graph").attr("width", width).attr("height", height);
const container = svg.append("g");

// Zoom et déplacement
svg.call(d3.zoom().scaleExtent([0.05, 2]).on("zoom", (event) => {
    container.attr("transform", event.transform);
}));

// Création du mapping des succès
const successMap = new Map(successes.map(s => [s.id, s]));

// Dessin des liens entre succès (multi-parent)
successes.forEach(s => {
    s.parents.forEach(parentId => {
        const parent = successMap.get(parentId);
        if (parent) {
            container.append("line")
                .attr("x1", parent.x)
                .attr("y1", parent.y)
                .attr("x2", s.x)
                .attr("y2", s.y)
                .attr("stroke", "#555")
                .attr("stroke-width", 2);
        }
    });
});

// Dessin des succès (cercles)
const nodes = container.selectAll("circle").data(successes).enter()
    .append("circle")
    .attr("cx", d => d.x)
    .attr("cy", d => d.y)
    .attr("r", d => d.id === 1 ? 30 : 20) // Taille plus grande pour le départ
    .attr("fill", d => d.id === 1 ? "#FFA500" : (d.unlocked ? "#fff" : "#666")) // Orange pour le départ
    .attr("stroke", "#222")
    .attr("stroke-width", 2)
    .on("click", showSuccessInfo);

// Mise à jour des couleurs des succès
function updateColors() {
    nodes.transition()
        .duration(1000)
        .ease(d3.easeCubicInOut)
        .attr("fill", d => {
            if (d.id === 1) return "#FFA500"; // Garder l'orange pour le départ
            if (d.unlocked) return "#fff"; // Débloqué
            if (d.parents.every(parentId => successMap.get(parentId)?.unlocked)) return "#66f"; // Déblocable
            return "#666"; // Non déblocable
        });
}
updateColors();

// Affichage des infos d'un succès
function showSuccessInfo(event, d) {
    document.getElementById("success-title").textContent = d.name;
    document.getElementById("success-description").textContent = d.description;
    document.getElementById("modal").classList.remove("hidden");

    const validateButton = document.getElementById("validate-button");

    if (d.unlocked) {
        validateButton.style.display = "none";
    } else {
        if (d.parents.every(parentId => successMap.get(parentId)?.unlocked)) {
            validateButton.style.display = "block";
            validateButton.onclick = () => validateSuccess(d);
        } else {
            validateButton.style.display = "none";
        }
    }

    document.getElementById("close-button").onclick = () => document.getElementById("modal").classList.add("hidden");
}

// Déblocage d'un succès avec animation
function validateSuccess(success) {
    document.getElementById("modal").classList.add("hidden");
    success.unlocked = true;
    level += success.levelUp;

    localStorage.setItem("successProgress", JSON.stringify(successes.filter(s => s.unlocked).map(s => s.id)));
    localStorage.setItem("level", level);
    document.getElementById("level-display").textContent = level;

    // Animation progressive du bleu au blanc
    d3.selectAll("circle")
        .filter(d => d.id === success.id && d.id !== 1)
        .transition()
        .duration(1000)
        .ease(d3.easeCubicInOut)
        .attr("fill", "#fff");

    updateColors();
}

// Réinitialisation de la progression
document.getElementById("reset-button").onclick = function () {
    console.log("Progression réinitialisée");
    level = 0;
    localStorage.setItem("level", level);
    successes.forEach(s => s.unlocked = false);
    localStorage.removeItem("successProgress");
    document.getElementById("level-display").textContent = level;
    updateColors();
};
