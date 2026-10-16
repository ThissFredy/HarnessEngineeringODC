import { useCallback, useEffect, useRef, useState } from 'react'
import { flushSync } from 'react-dom'
import Stage from './components/Stage.jsx'
import Scene from './scenes/Scene.jsx'
import Inicio from './scenes/Inicio.jsx'
import Mapa from './scenes/Mapa.jsx'
import Nodo from './scenes/Nodo.jsx'
import { SCENES } from './data/scenes.js'
import useStageViewport from './hooks/useStageViewport.js'
import fontLicenseUrl from './assets/fonts/OFL-PressStart2P.txt?url'

const ENTERABLE_NODE_NUMBERS = SCENES
  .filter((scene) => scene.type === 'nodo')
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
    SCENES.filter((scene) => scene.type === 'nodo').map((scene) => {
      const grade = savedGrades[scene.nodeNumber]
      return [
        scene.nodeNumber,
        typeof grade === 'number' && grade >= 0 && grade <= 5 ? grade : 0,
      ]
    }),
  )
}

export default function App() {
  const frameRef = useRef(null)
  const [current, setCurrent] = useState('inicio')
  const [irisTransition, setIrisTransition] = useState(null)
  const [nodeGrades, setNodeGrades] = useState(readNodeGrades)
  const nodeGradesRef = useRef(nodeGrades)
  const { transform, resetView } = useStageViewport(frameRef)

  const navigateToScene = useCallback((name) => {
    const targetScene = SCENES.find((scene) => scene.name === name)
    if (!targetScene || irisTransition || name === current) return false

    const currentScene = SCENES.find((scene) => scene.name === current)
    if (targetScene.type === 'nodo' || currentScene?.type === 'nodo') {
      flushSync(() => {
        setIrisTransition({ from: current, to: name, phase: 'closing' })
      })
    } else {
      setCurrent(name)
    }

    return true
  }, [current, irisTransition])

  const handleEnterNode = useCallback((nodeNumber) => {
    const nodeScene = SCENES.find(
      (scene) => scene.type === 'nodo' && scene.nodeNumber === nodeNumber,
    )
    return nodeScene ? navigateToScene(nodeScene.name) : false
  }, [navigateToScene])

  const saveNodeGrade = useCallback((nodeNumber, grade) => {
    if (!ENTERABLE_NODE_NUMBERS.includes(nodeNumber)) return

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
      <Stage transform={transform} transitioning={Boolean(irisTransition)}>
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
              irisPhase={irisPhase}
              onIrisAnimationEnd={() => handleIrisAnimationEnd(scene.name)}
            >
              {scene.type === 'inicio' && <Inicio onVamos={() => navigateToScene('mapa')} />}
              {scene.type === 'mapa' && (
                <Mapa
                  active={active && !irisTransition}
                  enterableNodeNumbers={ENTERABLE_NODE_NUMBERS}
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
            </Scene>
          )
        })}
      </Stage>
    </div>
  )
}
