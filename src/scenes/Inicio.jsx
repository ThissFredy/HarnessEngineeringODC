const INFO_BLOCKS = [
  {
    title: "Población objetivo",
    desc: "Estudiantes de Ingenieria de Sistemas de  la Universidad de Cundinamarca",
    side: "left",
  },
  {
    title: "Resultado de aprendizaje",
    desc: "Comprender la arquitectura de Harness Engineering para la implementación segura y escalable de agentes LLM en el ciclo vital de desarrollo de software (SDLC).",
    side: "right",
  },
  {
    title: "CADI",
    desc: "Aplicaciones de Machine Learning",
    side: "left",
  },
  {
    title: "Metodología",
    desc: "Exploración gamificada sobre mapa con 7 nodos temáticos",
    side: "right",
  },
  {
    title: "Evaluación",
    desc: "Sumativa. Cada nodo cierra con un minijuego; el SCO reporta el promedio final (0–5) a Moodle.",
    side: "left",
  },
];

export default function Inicio({ onVamos }) {
  return (
    <div className="relative h-full">
      <h1 className="absolute left-1/2 top-[18px] z-10 w-max max-w-[calc(100%-40px)] -translate-x-1/2 border-4 border-[#281922] bg-[#211922eF] px-[22px] py-[12px] text-center font-normal text-[20px] leading-[1.45] text-accent shadow-[0_5px_0_#100d15] [text-shadow:3px_3px_0_#000000]">
        Harness Engineering: Un nuevo Paradigma
      </h1>
      <div className="absolute bottom-[88px] left-[20px] top-[108px] flex w-[232px] flex-col gap-[10px]">
        {INFO_BLOCKS.filter((block) => block.side === "left").map((block) => (
          <section key={block.title} className="border-2 border-[#bd9065] bg-[#1b1518eF] p-[9px] shadow-[3px_3px_0_#100d15]">
            <h2 className="mb-[6px] font-normal text-[10px] leading-[1.5] text-accent [text-shadow:2px_2px_0_#000000]">
              {block.title}
            </h2>
            <p className="text-[9px] leading-[1.55] text-white [text-shadow:1px_1px_0_rgba(0,0,0,0.85)]">
              {block.desc}
            </p>
          </section>
        ))}
      </div>
      <div className="absolute bottom-[88px] right-[20px] top-[108px] flex w-[232px] flex-col gap-[10px] text-right">
        {INFO_BLOCKS.filter((block) => block.side === "right").map((block) => (
          <section key={block.title} className="border-2 border-[#bd9065] bg-[#1b1518eF] p-[9px] shadow-[3px_3px_0_#100d15]">
            <h2 className="mb-[6px] font-normal text-[10px] leading-[1.5] text-accent [text-shadow:2px_2px_0_#000000]">
              {block.title}
            </h2>
            <p className="text-[9px] leading-[1.55] text-white [text-shadow:1px_1px_0_rgba(0,0,0,0.85)]">
              {block.desc}
            </p>
          </section>
        ))}
      </div>
      <button
        id="btn-vamos"
        type="button"
        onClick={onVamos}
        className="absolute bottom-[22px] left-1/2 -translate-x-1/2 cursor-pointer border-4 border-[#241923] bg-accent px-[32px] py-[16px] font-pixel text-[22px] leading-none text-black shadow-[0_6px_0_#100d15] transition-colors hover:bg-[#ffc35c] active:translate-y-[4px] active:shadow-[0_2px_0_#100d15] focus-visible:outline-4 focus-visible:outline-offset-[3px] focus-visible:outline-white"
      >
        VAMOS
      </button>
    </div>
  );
}
