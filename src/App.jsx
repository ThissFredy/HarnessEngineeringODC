import { useCallback, useEffect, useRef, useState } from 'react'
import Stage from './components/Stage.jsx'
import Scene from './scenes/Scene.jsx'
import Inicio from './scenes/Inicio.jsx'
import Mapa from './scenes/Mapa.jsx'
import Nodo from './scenes/Nodo.jsx'
import { SCENES } from './data/scenes.js'
import useStageViewport from './hooks/useStageViewport.js'
import fontLicenseUrl from './assets/fonts/OFL-PressStart2P.txt?url'

export default function App() {
  const frameRef = useRef(null)
  const [current, setCurrent] = useState('inicio')
  const { transform, resetView } = useStageViewport(frameRef)

  const showSceneByName = useCallback((name) => {
    if (SCENES.some((s) => s.name === name)) {
      setCurrent(name)
    }
  }, [])

  useEffect(() => {
    window.ODC = {
      scenes: SCENES.map((s) => s.name),
      showScene: showSceneByName,
      resetView: resetView
    }
  }, [showSceneByName, resetView])

  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.ctrlKey || e.altKey || e.metaKey) return
      const tag = e.target && e.target.tagName ? e.target.tagName.toLowerCase() : ''
      if (tag === 'input' || tag === 'textarea' || tag === 'select') return
      if (e.key >= '1' && e.key <= '9') {
        const scene = SCENES[Number(e.key) - 1]
        if (scene) setCurrent(scene.name)
      } else if (e.key === 'ArrowRight') {
        e.preventDefault()
        setCurrent((name) => {
          const i = SCENES.findIndex((s) => s.name === name)
          return SCENES[(i + 1) % SCENES.length].name
        })
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault()
        setCurrent((name) => {
          const i = SCENES.findIndex((s) => s.name === name)
          return SCENES[(i - 1 + SCENES.length) % SCENES.length].name
        })
      } else if (e.key === '0') {
        resetView()
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [resetView])

  return (
    <div ref={frameRef} id="frame" className="fixed inset-0 touch-none overflow-hidden bg-black">
      <link rel="license" href={fontLicenseUrl} />
      <Stage transform={transform}>
        {SCENES.map((scene) => (
          <Scene key={scene.name} id={'scene-' + scene.name} active={scene.name === current} bg={scene.bg} imageRendering={scene.imageRendering}>
            {scene.type === 'inicio' && <Inicio onVamos={() => showSceneByName('mapa')} />}
            {scene.type === 'mapa' && <Mapa onSelectNode={showSceneByName} />}
            {scene.type === 'nodo' && <Nodo nodo={scene} />}
          </Scene>
        ))}
      </Stage>
    </div>
  )
}
