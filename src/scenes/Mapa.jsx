const NODE_MARKERS = [
  { num: 1, x: 137, y: 480 },
  { num: 2, x: 384, y: 480 },
  { num: 3, x: 512, y: 297 },
  { num: 4, x: 636, y: 297 },
  { num: 5, x: 636, y: 198 },
  { num: 6, x: 818, y: 415 },
  { num: 7, x: 914, y: 220 },
]

export default function Mapa({ onSelectNode }) {
  return (
    <div className="absolute inset-0" aria-label="Nodos del mapa">
      {NODE_MARKERS.map(({ num, x, y }, index) => (
        <button
          key={num}
          type="button"
          aria-label={`Abrir nodo ${num}`}
          title={`Abrir nodo ${num}`}
          onClick={() => onSelectNode(`nodo-${num}`)}
          className="absolute z-10 grid size-[44px] cursor-pointer place-items-center rounded-full border-[4px] border-[#202b40] bg-[#f0ca63] shadow-[0_4px_0_#5b3d2d] transition-[filter] hover:brightness-110 focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-white"
          style={{
            left: `${(x / 1024) * 100}%`,
            top: `${(y / 599) * 100}%`,
            transform: 'translate(-50%, calc(-100% - 26px))',
          }}
        >
          <span
            className="map-node-float grid size-full place-items-center"
            style={{ animationDelay: `${index * -180}ms` }}
            aria-hidden="true"
          >
            <svg viewBox="0 0 16 16" className="size-[18px]" shapeRendering="crispEdges">
              <path fill="#9c602d" d="M6 0h4v3h3v3h3v4h-3v3h-3v3H6v-3H3v-3H0V6h3V3h3z" />
              <path fill="#fff3bd" d="M7 2h2v3h3v2h2v2h-2v2H9v3H7v-3H4V9H2V7h2V5h3z" />
              <path fill="#e9943e" d="M7 5h2v2h2v2H9v2H7V9H5V7h2z" />
            </svg>
          </span>
        </button>
      ))}
    </div>
  )
}
