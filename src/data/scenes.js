import inicio from "../assets/backgrounds/main_background.jpeg";
import mapa from "../assets/backgrounds/map.png";
import nodo1 from "../assets/backgrounds/nodo-1.jpeg";

export const SCENES = [
  { type: "inicio", name: "inicio", bg: inicio },
  { type: "mapa", name: "mapa", bg: mapa, imageRendering: "auto" },
  { type: "nodo", nodeNumber: 1, name: "nodo-1", bg: nodo1, imageRendering: "auto" },
];
