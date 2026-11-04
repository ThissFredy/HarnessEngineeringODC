import { useCallback, useEffect, useRef, useState } from 'react'
import { flushSync } from 'react-dom'
import Stage from './components/Stage.jsx'
import Scene from './scenes/Scene.jsx'
import Inicio from './scenes/Inicio.jsx'
import IntroduccionMudek from './scenes/IntroduccionMudek.jsx'
import Mapa from './scenes/Mapa.jsx'
import Nodo from './scenes/Nodo.jsx'
import Nodo2 from './scenes/Nodo2.jsx'
import Nodo3 from './scenes/Nodo3.jsx'
import Nodo4 from './scenes/Nodo4.jsx'
import Nodo5 from './scenes/Nodo5.jsx'
import NodoEnConstruccion from './scenes/NodoEnConstruccion.jsx'
import { SCENES } from './data/scenes.js'
import useStageViewport from './hooks/useStageViewport.js'
import fontLicenseUrl from './assets/fonts/OFL-PressStart2P.txt?url'

const ENTERABLE_NODE_NUMBERS = SCENES
  .filter((scene) => scene.type === 'nodo')
  .map((scene) => scene.nodeNumber)
const GRADED_NODE_NUMBERS = SCENES
  .filter((scene) => scene.type === 'nodo' && scene.gradeable)
  .map((scene) => scene.nodeNumber)
const NODE_GRADES_STORAGE_KEY = 'odc-node-grades-v1'

function readNodeGrades() {
  let savedGrades = {}

  try {
    const savedValue = window.localStorage.getItem(NODE_GRADES_STORAGE_KEY)
    const parsedValue = savedValue ? JSON.parse(savedValue) : null
    if (parsedValue && typeof parsedValue === 'object' && !Array.isArray(parsedValue)) {
      savedGrades = parsedValue
    }
  } catch {
    // If storage is unavailable, start with fresh grades for this session.
  }

  return Object.fromEntries(
    GRADED_NODE_NUMBERS.map((nodeNumber) => {
      const grade = savedGrades[nodeNumber]
      return [
        nodeNumber,
        typeof grade === 'number' && grade >= 0 && grade <= 5 ? grade : 0,
      ]
    }),
  )
}

export default function App() {
  const frameRef = useRef(null)
  const [current, setCurrent] = useState('inicio')
  const [irisTransition, setIrisTransition] = useState(null)
  const [curtainTransition, setCurtainTransition] = useState(null)
  const [nodeGrades, setNodeGrades] = useState(readNodeGrades)
  const nodeGradesRef = useRef(nodeGrades)
  const { transform, resetView } = useStageViewport(frameRef)
  const enterableNodeNumbers = ENTERABLE_NODE_NUMBERS.filter((nodeNumber) => {
    if (nodeNumber > 2 && Number(nodeGrades[2] ?? 0) < 5) return false
    if (nodeNumber === 4 && Number(nodeGrades[3] ?? 0) < 5) return false
    return true
  })

  const navigateToScene = useCallback((name) => {
    const targetScene = SCENES.find((scene) => scene.name === name)
    if (!targetScene || irisTransition || curtainTransition || name === current) return false

    const currentScene = SCENES.find((scene) => scene.name === current)
    const enteringMapFromIntroduction =
      currentScene?.type === 'introduccion' && targetScene.type === 'mapa'
    const openingIntroductionCurtain =
      currentScene?.type === 'inicio' && targetScene.type === 'introduccion'

    if (openingIntroductionCurtain) {
      flushSync(() => {
        setCurtainTransition({ from: current, to: name, phase: 'closing' })
      })
    } else if (
      targetScene.type === 'nodo' ||
      currentScene?.type === 'nodo' ||
      enteringMapFromIntroduction
    ) {
      flushSync(() => {
        setIrisTransition({ from: current, to: name, phase: 'closing' })
      })
    } else {
      setCurrent(name)
    }

    return true
  }, [current, curtainTransition, irisTransition])

  const handleEnterNode = useCallback((nodeNumber) => {
    const grades = nodeGradesRef.current
    if (nodeNumber > 2 && Number(grades[2] ?? 0) < 5) return false
    if (nodeNumber === 4 && Number(grades[3] ?? 0) < 5) return false

    const nodeScene = SCENES.find(
      (scene) => scene.type === 'nodo' && scene.nodeNumber === nodeNumber,
    )
    return nodeScene ? navigateToScene(nodeScene.name) : false
  }, [navigateToScene])

  const saveNodeGrade = useCallback((nodeNumber, grade) => {
    if (!GRADED_NODE_NUMBERS.includes(nodeNumber)) return

    const normalizedGrade = Math.round(Math.min(5, Math.max(0, Number(grade) || 0)) * 10) / 10
    const nextGrades = { ...nodeGradesRef.current, [nodeNumber]: normalizedGrade }
    nodeGradesRef.current = nextGrades
    setNodeGrades(nextGrades)

    try {
      window.localStorage.setItem(NODE_GRADES_STORAGE_KEY, JSON.stringify(nextGrades))
    } catch {
      // Keep the grade for this session even if persistent storage is unavailable.
    }
  }, [])

  const handleIrisAnimationEnd = useCallback((sceneName) => {
    if (!irisTransition) return

    if (irisTransition.phase === 'closing' && irisTransition.from === sceneName) {
      setCurrent(irisTransition.to)
      setIrisTransition({ ...irisTransition, phase: 'opening' })
    } else if (irisTransition.phase === 'opening' && irisTransition.to === sceneName) {
      setIrisTransition(null)
    }
  }, [irisTransition])

  const handleCurtainAnimationEnd = useCallback(() => {
    if (!curtainTransition) return

    if (curtainTransition.phase === 'closing') {
      setCurrent(curtainTransition.to)
      setCurtainTransition({ ...curtainTransition, phase: 'opening' })
    } else if (curtainTransition.phase === 'opening') {
      setCurtainTransition(null)
    }
  }, [curtainTransition])

  useEffect(() => {
    window.ODC = {
      scenes: SCENES.map((s) => s.name),
      showScene: navigateToScene,
      resetView: resetView,
      nodeGrades,
    }
  }, [navigateToScene, resetView, nodeGrades])

  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.ctrlKey || e.altKey || e.metaKey) return
      const tag = e.target && e.target.tagName ? e.target.tagName.toLowerCase() : ''
      if (tag === 'input' || tag === 'textarea' || tag === 'select') return
      if (import.meta.env.DEV && e.key >= '1' && e.key <= '9') {
        const scene = SCENES[Number(e.key) - 1]
        if (scene) navigateToScene(scene.name)
      } else if (e.key === '0') {
        resetView()
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [navigateToScene, resetView])

  return (
    <div ref={frameRef} id="frame" className="fixed inset-0 touch-none overflow-hidden bg-black">
      <link rel="license" href={fontLicenseUrl} />
      <Stage
        transform={transform}
        transitioning={Boolean(irisTransition || curtainTransition)}
      >
        {SCENES.map((scene) => {
          const active = scene.name === current
          const irisPhase =
            irisTransition?.phase === 'closing' && irisTransition.from === scene.name
              ? 'close'
              : irisTransition?.phase === 'opening' && irisTransition.to === scene.name
                ? 'open'
                : null

          return (
            <Scene
              key={scene.name}
              id={'scene-' + scene.name}
              active={active}
              bg={scene.bg}
              imageRendering={scene.imageRendering}
              backgroundBrightness={scene.backgroundBrightness}
              irisPhase={irisPhase}
              onIrisAnimationEnd={() => handleIrisAnimationEnd(scene.name)}
            >
              {scene.type === 'inicio' && (
                <Inicio onVamos={() => navigateToScene('introduccion-mudek')} />
              )}
              {scene.type === 'introduccion' && (
                <IntroduccionMudek
                  active={active}
                  onComplete={() => navigateToScene('mapa')}
                />
              )}
              {scene.type === 'mapa' && (
                <Mapa
                  active={active && !irisTransition}
                  enterableNodeNumbers={enterableNodeNumbers}
                  nodeGrades={nodeGrades}
                  onEnterNode={handleEnterNode}
                />
              )}
              {scene.type === 'nodo' && scene.nodeNumber === 1 && (
                <Nodo
                  active={active}
                  nodeNumber={scene.nodeNumber}
                  onComplete={saveNodeGrade}
                  onExit={() => navigateToScene('mapa')}
                />
              )}
              {scene.type === 'nodo' && scene.nodeNumber === 2 && (
                <Nodo2
                  active={active}
                  onComplete={saveNodeGrade}
                  onExit={() => navigateToScene('mapa')}
                />
              )}
              {scene.type === 'nodo' && scene.nodeNumber === 3 && (
                <Nodo3
                  active={active}
                  onComplete={saveNodeGrade}
                  onExit={() => navigateToScene('mapa')}
                />
              )}
              {scene.type === 'nodo' && scene.nodeNumber === 4 && (
                <Nodo4
                  active={active}
                  onComplete={saveNodeGrade}
                  onExit={() => navigateToScene('mapa')}
                />
              )}
              {scene.type === 'nodo' && scene.nodeNumber === 5 && (
                <Nodo5
                  active={active}
                  onComplete={saveNodeGrade}
                  onExit={() => navigateToScene('mapa')}
                />
              )}
              {scene.type === 'nodo' && scene.nodeNumber >= 6 && (
                <NodoEnConstruccion
                  active={active}
                  nodeNumber={scene.nodeNumber}
                  onExit={() => navigateToScene('mapa')}
                />
              )}
            </Scene>
          )
        })}
        {curtainTransition && (
          <div
            aria-hidden="true"
            data-stage-interactive
            className={`absolute inset-0 z-[100] bg-black curtain-${curtainTransition.phase}`}
            onAnimationEnd={(event) => {
              if (event.target === event.currentTarget) handleCurtainAnimationEnd()
            }}
          />
        )}
      </Stage>
    </div>
  )
}
