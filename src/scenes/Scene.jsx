export default function Scene({
  id,
  active,
  bg,
  imageRendering = 'pixelated',
  backgroundBrightness = 1,
  irisPhase,
  onIrisAnimationEnd,
  children,
}) {
  const irisClass = irisPhase ? `iris-${irisPhase}` : ''

  return (
    <section
      id={id}
      className={`absolute inset-0 overflow-hidden ${active ? 'visible' : 'invisible'} ${irisClass}`}
      onAnimationEnd={(event) => {
        if (event.target === event.currentTarget) onIrisAnimationEnd?.()
      }}
    >
      <img
        className="pointer-events-none absolute inset-0 h-full w-full select-none object-fill [-webkit-user-drag:none]"
        src={bg}
        alt=""
        draggable={false}
        style={{
          imageRendering,
          filter: backgroundBrightness === 1 ? undefined : `brightness(${backgroundBrightness})`,
        }}
      />
      <div className="absolute inset-0">{children}</div>
    </section>
  )
}
