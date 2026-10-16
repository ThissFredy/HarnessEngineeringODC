import { useEffect, useState } from 'react'
import { MUDEK } from '../data/avatars.js'

export default function MudekAnimationReview({ action, active, sceneNumber }) {
  const [frameIndex, setFrameIndex] = useState(0)
  const frame = action.frames[frameIndex]

  useEffect(() => {
    if (!active || action.frames.length < 2) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const timer = window.setInterval(() => {
      setFrameIndex((index) => (index + 1) % action.frames.length)
    }, action.frameDuration)

    return () => window.clearInterval(timer)
  }, [active, action])

  return (
    <section
      className="absolute inset-0 grid place-items-center"
      aria-label={`Revisión temporal de MUDEK: ${action.label}`}
    >
      <div className="grid h-[486px] w-[880px] grid-cols-[minmax(0,1fr)_280px_minmax(0,1fr)] items-center gap-4 border-[6px] border-[#293c53] bg-[#111a2b] p-6 shadow-[0_10px_0_#080d16]">
        <div className="flex flex-col gap-6">
          <p className="text-[10px] leading-relaxed text-[#81cada]">
            PERSONAJE / MUDEK
          </p>
          <div>
            <p className="mb-3 text-[10px] text-[#f0ca63]">ANIMACIÓN</p>
            <h1 className="text-[18px] leading-relaxed text-[#fff3bd]">
              {action.label.toUpperCase()}
            </h1>
          </div>
          <p className="max-w-[230px] text-[10px] leading-[2] text-[#bdcbd7]">
            {action.description}
          </p>
        </div>

        <div className="relative h-[384px] w-[256px] justify-self-center">
          <div
            className="absolute inset-0"
            style={{
              transform: frame.transform,
              transformOrigin: 'center bottom',
            }}
          >
            <img
              src={action.base ?? MUDEK.src}
              alt={`MUDEK: ${action.label.toLowerCase()}`}
              draggable={false}
              className="absolute inset-0 h-full w-full object-fill [image-rendering:pixelated]"
            />
            <img
              src={frame.src}
              alt=""
              aria-hidden="true"
              draggable={false}
              className="pointer-events-none absolute inset-0 h-full w-full object-fill [image-rendering:pixelated]"
            />
          </div>
        </div>

        <div className="flex flex-col gap-5 justify-self-end text-right">
          <p className="text-[10px] leading-[2] text-[#bdcbd7]">
            ESCENA {sceneNumber} / 9
          </p>
          <div className="border-[3px] border-[#40566d] bg-[#18243c] p-4">
            <p className="mb-4 text-[9px] text-[#81cada]">FOTOGRAMA</p>
            <p className="text-[14px] text-[#fff3bd]">
              {String(frameIndex + 1).padStart(2, '0')} / {String(action.frames.length).padStart(2, '0')}
            </p>
            <div className="mt-4 flex justify-end gap-2" aria-hidden="true">
              {action.frames.map((item, index) => (
                <span
                  key={item.src}
                  className={`h-3 w-3 border-2 border-[#81cada] ${index === frameIndex ? 'bg-[#f0ca63]' : 'bg-transparent'}`}
                />
              ))}
            </div>
          </div>
          <p className="text-[9px] leading-[2] text-[#73899d]">
            BUCLE AUTOMÁTICO
          </p>
        </div>
      </div>
    </section>
  )
}
