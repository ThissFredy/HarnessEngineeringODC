export default function Scene({ id, active, bg, imageRendering = 'pixelated', children }) {
  return (
    <section id={id} className={'absolute inset-0 overflow-hidden ' + (active ? 'visible' : 'invisible')}>
      <img
        className="pointer-events-none absolute inset-0 h-full w-full select-none object-fill [-webkit-user-drag:none]"
        src={bg}
        alt=""
        draggable={false}
        style={{ imageRendering }}
      />
      <div className="absolute inset-0">{children}</div>
    </section>
  )
}
