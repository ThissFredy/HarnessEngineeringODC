import inicio from "../assets/backgrounds/main_background.jpeg";
import mapa from "../assets/backgrounds/map.png";
import nodo1 from "../assets/backgrounds/nodo-1.jpeg";
import nodo2 from "../assets/backgrounds/nodo-2.jpeg";
import nodo3 from "../assets/backgrounds/nodo-3.png";

export const SCENES = [
  { type: "inicio", name: "inicio", bg: inicio },
  {
    type: "introduccion",
    name: "introduccion-mudek",
    bg: inicio,
    backgroundBrightness: 0.5,
  },
  { type: "mapa", name: "mapa", bg: mapa, imageRendering: "auto" },
  { type: "nodo", nodeNumber: 1, name: "nodo-1", bg: nodo1, imageRendering: "auto", gradeable: true },
  { type: "nodo", nodeNumber: 2, name: "nodo-2", bg: nodo2, imageRendering: "auto", gradeable: true },
  {
    type: "nodo",
    nodeNumber: 3,
    name: "nodo-3",
    bg: nodo3,
    imageRendering: "auto",
    backgroundBrightness: 0.72,
    gradeable: true,
  },
  {
    type: "nodo",
    nodeNumber: 4,
    name: "nodo-4",
    bg: inicio,
    imageRendering: "auto",
    backgroundBrightness: 0.42,
  },
  {
    type: "nodo",
    nodeNumber: 5,
    name: "nodo-5",
    bg: inicio,
    imageRendering: "auto",
    backgroundBrightness: 0.42,
  },
  {
    type: "nodo",
    nodeNumber: 6,
    name: "nodo-6",
    bg: inicio,
    imageRendering: "auto",
    backgroundBrightness: 0.42,
  },
  {
    type: "nodo",
    nodeNumber: 7,
    name: "nodo-7",
    bg: inicio,
    imageRendering: "auto",
    backgroundBrightness: 0.42,
  },
];
