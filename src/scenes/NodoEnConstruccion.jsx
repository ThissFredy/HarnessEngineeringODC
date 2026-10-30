import { useEffect } from "react";
import Avatar from "../components/Avatar.jsx";
import { MUDEK } from "../data/avatars.js";
import badgeNode3 from "../assets/badges/badge-node-3.png";
import badgeNode4 from "../assets/badges/badge-node-4.png";
import badgeNode5 from "../assets/badges/badge-node-5.png";
import badgeNode6 from "../assets/badges/badge-node-6.png";
import badgeNode7 from "../assets/badges/badge-node-7.png";

const NODE_ENTRY_INFO = {
  3: { title: "Limitaciones y Evolución", badge: badgeNode3 },
  4: { title: "Agentes de IA", badge: badgeNode4 },
  5: { title: "Skills y MCP", badge: badgeNode5 },
  6: { title: "Sandbox y Guardrails", badge: badgeNode6 },
  7: { title: "Harness Engineering", badge: badgeNode7 },
};

export default function NodoEnConstruccion({ active, nodeNumber, onExit }) {
  const node = NODE_ENTRY_INFO[nodeNumber];

  useEffect(() => {
    if (!active) return undefined;

    const onKeyDown = (event) => {
      if (event.defaultPrevented || event.repeat) return;
      if (event.code !== "Space" && event.key !== " ") return;
      if (event.target?.closest?.("button, a, input, textarea, select")) return;

      event.preventDefault();
      onExit?.();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [active, onExit]);

  if (!active || !node) return null;

  return (
    <div className="absolute inset-0">
      <div className="pointer-events-none absolute bottom-[20px] left-[120px] h-[320px] w-[120px]">
        <Avatar avatar={MUDEK} alt="MUDEK" className="avatar-idle h-full w-full" />
      </div>

      <section
        aria-labelledby={`node-entry-${nodeNumber}-title`}
        className="absolute bottom-[30px] left-[250px] right-[32px] top-[30px] z-30 flex flex-col border-[5px] border-[#f0ca63] bg-[#101725] px-[20px] py-[18px] text-white shadow-[0_8px_0_#080d16,0_12px_24px_#000000b8] ring-4 ring-[#35d8ff]/80"
      >
        <header className="border-b-4 border-[#35d8ff] bg-[#17263a] px-[16px] py-[12px] shadow-[inset_0_2px_0_#2c4965]">
          <p className="mb-[8px] font-pixel text-[7px] leading-[1.7] text-[#9fe8f4]">
            ACCESO HABILITADO · NODO {String(nodeNumber).padStart(2, "0")}
          </p>
          <h1
            id={`node-entry-${nodeNumber}-title`}
            className="font-pixel text-[12px] leading-[1.8] text-[#fff3bd] [text-shadow:2px_2px_0_#080d16]"
          >
            {node.title}
          </h1>
        </header>

        <div className="flex flex-1 items-center justify-center gap-[28px] px-[14px] py-[18px]">
          <img
            src={node.badge}
            alt={`Insignia del Nodo ${nodeNumber}: ${node.title}`}
            draggable={false}
            className="h-[170px] w-[190px] shrink-0 select-none object-contain [image-rendering:pixelated]"
          />
          <div className="max-w-[370px] border-l-[4px] border-[#35d8ff] pl-[18px]">
            <h2 className="mb-[12px] font-pixel text-[9px] leading-[1.8] text-[#f0ca63]">
              CONTENIDO EN PREPARACIÓN
            </h2>
            <p className="font-pixel text-[7px] leading-[2] text-white">
              La entrada a este nodo ya está habilitada. El material educativo y
              el reto se incorporarán más adelante.
            </p>
          </div>
        </div>

        <footer className="flex items-center justify-between gap-[16px] border-t-4 border-[#35d8ff] bg-[#17263a] px-[14px] py-[10px] shadow-[inset_0_2px_0_#2c4965]">
          <p className="font-pixel text-[7px] leading-[1.8] text-[#9fe8f4]">
            ESPACIO O CLIC EN VOLVER AL MAPA
          </p>
          <button
            type="button"
            data-stage-interactive
            onClick={onExit}
            className="min-h-[48px] shrink-0 border-2 border-[#241923] bg-[#f0ca63] px-[14px] py-[10px] font-pixel text-[8px] leading-[1.5] text-[#101725] shadow-[0_4px_0_#080d16] hover:bg-[#fff3bd] active:translate-y-[3px] active:shadow-[0_1px_0_#080d16] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            VOLVER AL MAPA
          </button>
        </footer>
      </section>
    </div>
  );
}
