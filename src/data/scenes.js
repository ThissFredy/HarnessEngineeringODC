import inicio from "../assets/backgrounds/main_background.jpeg";
import mapa from "../assets/backgrounds/map.png";
import nodo1 from "../assets/backgrounds/nodo-1.png";
import nodo2 from "../assets/backgrounds/nodo-2.png";
import nodo3 from "../assets/backgrounds/nodo-3.png";
import nodo4 from "../assets/backgrounds/nodo-4.png";
import nodo5 from "../assets/backgrounds/nodo-5.png";
import nodo6 from "../assets/backgrounds/nodo-6.png";
import nodo7 from "../assets/backgrounds/nodo-7.png";

export const SCENES = [
  { type: "inicio", name: "inicio", bg: inicio },
  { type: "mapa", name: "mapa", bg: mapa, imageRendering: "auto" },
  {
    type: "nodo",
    name: "nodo-1",
    num: 1,
    bg: nodo1,
    kaiReviewAction: "caminar",
  },
  {
    type: "nodo",
    name: "nodo-2",
    num: 2,
    bg: nodo2,
    kaiReviewAction: "senalar",
  },
  {
    type: "nodo",
    name: "nodo-3",
    num: 3,
    bg: nodo3,
    kaiReviewAction: "hablar",
  },
  {
    type: "nodo",
    name: "nodo-4",
    num: 4,
    bg: nodo4,
    kaiReviewAction: "sonreir",
  },
  {
    type: "nodo",
    name: "nodo-5",
    num: 5,
    bg: nodo5,
    kaiReviewAction: "llorar",
  },
  { type: "nodo", name: "nodo-6", num: 6, bg: nodo6, kaiReviewAction: "negar" },
  {
    type: "nodo",
    name: "nodo-7",
    num: 7,
    bg: nodo7,
    kaiReviewAction: "acertar",
  },
];
