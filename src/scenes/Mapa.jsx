import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Avatar from "../components/Avatar.jsx";
import { MUDEK } from "../data/avatars.js";
import { MUDEK_ANIMATIONS } from "../data/mudekAnimations.js";
import mapOneAudio from "../assets/audio/Map-1.mp3";
import mapTwoAudio from "../assets/audio/Map-2.mp3";

const MUDEK_WALK_ANIMATION = MUDEK_ANIMATIONS.caminar;
const MUDEK_TALK_ANIMATION = MUDEK_ANIMATIONS.hablar;
const MAP_DIALOGUE_MESSAGES = [
  "En respuesta a este cambio, es importante entender un marco metodológico mucho más robusto: el Harness Engineering. Acompáñame a recorrer este mapa para descubrir sus estrategias y patrones arquitectónicos.",
  "En cada parada, te revelaré los hallazgos clave para comprender este paradigma. Deberás prestar atención y superar un pequeño reto interactivo para desbloquear el siguiente camino y obtener tu calificación final.\n\n¿Todo listo?\n\n¡Usa las flechas de tu teclado, y dirígete al primer nivel para comenzar!",
];

const MAP_WIDTH = 1697;
const MAP_HEIGHT = 927;
const PATH_TOLERANCE = 27;
const NODE_REACH = 38;
const MOVE_SPEED = 260;
const INITIAL_POSITION = { x: 225, y: 665 };

const NODE_MARKERS = [
  { num: 1, x: 225, y: 755 },
  { num: 2, x: 639, y: 756 },
  { num: 3, x: 853, y: 449 },
  { num: 4, x: 1059, y: 447 },
  { num: 5, x: 1059, y: 337 },
  { num: 6, x: 1352, y: 669 },
  { num: 7, x: 1506, y: 354 },
];

const GUIDED_PATH = [
  { x: 212, y: 620 },
  { x: 212, y: 700 },
  { x: 225, y: 755 },
  { x: 350, y: 755 },
  { x: 374, y: 740 },
  { x: 374, y: 720 },
  { x: 494, y: 720 },
  { x: 494, y: 740 },
  { x: 520, y: 755 },
  { x: 639, y: 755 },
  { x: 790, y: 755 },
  { x: 820, y: 744 },
  { x: 846, y: 718 },
  { x: 870, y: 680 },
  { x: 887, y: 650 },
  { x: 887, y: 585 },
  { x: 876, y: 555 },
  { x: 854, y: 520 },
  { x: 853, y: 449 },
  { x: 1059, y: 447 },
  { x: 1059, y: 337 },
  { x: 1120, y: 337 },
  { x: 1149, y: 348 },
  { x: 1173, y: 369 },
  { x: 1183, y: 394 },
  { x: 1183, y: 448 },
  { x: 1173, y: 482 },
  { x: 1162, y: 520 },
  { x: 1182, y: 552 },
  { x: 1216, y: 580 },
  { x: 1228, y: 613 },
  { x: 1230, y: 646 },
  { x: 1255, y: 662 },
  { x: 1295, y: 669 },
  { x: 1352, y: 669 },
  { x: 1440, y: 669 },
  { x: 1464, y: 646 },
  { x: 1464, y: 610 },
  { x: 1470, y: 584 },
  { x: 1490, y: 558 },
  { x: 1506, y: 530 },
  { x: 1506, y: 354 },
];
const GUIDED_SEGMENTS = GUIDED_PATH.slice(1).map((point, index) => [
  GUIDED_PATH[index],
  point,
]);

const ARROW_KEYS = new Set(["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"]);

function distanceToSegment(point, start, end) {
  const segmentX = end.x - start.x;
  const segmentY = end.y - start.y;
  const segmentLengthSquared = segmentX * segmentX + segmentY * segmentY;
  const projection = Math.max(
    0,
    Math.min(
      1,
      ((point.x - start.x) * segmentX + (point.y - start.y) * segmentY) /
        segmentLengthSquared,
    ),
  );
  const closestX = start.x + projection * segmentX;
  const closestY = start.y + projection * segmentY;

  return Math.hypot(point.x - closestX, point.y - closestY);
}

function isOnGuidedPath(position) {
  return GUIDED_SEGMENTS.some(([start, end]) => {
    return distanceToSegment(position, start, end) <= PATH_TOLERANCE;
  });
}

function findNearbyNode(position) {
  let nearbyNode = null;
  let nearestDistance = NODE_REACH;

  for (const node of NODE_MARKERS) {
    const distance = Math.hypot(position.x - node.x, position.y - node.y);
    if (distance <= nearestDistance) {
      nearbyNode = node;
      nearestDistance = distance;
    }
  }

  return nearbyNode;
}

function moveOnPath(position, directionX, directionY, distance) {
  const directionLength = Math.hypot(directionX, directionY);
  if (directionLength === 0 || distance === 0) return position;

  const nextPosition = {
    x: position.x + (directionX / directionLength) * distance,
    y: position.y + (directionY / directionLength) * distance,
  };

  return isOnGuidedPath(nextPosition) ? nextPosition : position;
}

export default function Mapa({
  active,
  enterableNodeNumbers = [],
  nodeGrades = {},
  onEnterNode,
}) {
  const positionRef = useRef(INITIAL_POSITION);
  const [position, setPosition] = useState(INITIAL_POSITION);
  const [isMoving, setIsMoving] = useState(false);
  const [walkingFrameIndex, setWalkingFrameIndex] = useState(0);
  const [mapDialogueIndex, setMapDialogueIndex] = useState(0);
  const [mapDialogueComplete, setMapDialogueComplete] = useState(false);
  const [mapTypingState, setMapTypingState] = useState({
    messageIndex: -1,
    visibleCharacters: 0,
  });
  const [talkingFrameIndex, setTalkingFrameIndex] = useState(0);
  const mapOneAudioRef = useRef(null);
  const mapTwoAudioRef = useRef(null);
  const [spaceDetectedNode, setSpaceDetectedNode] = useState(null);
  const currentMapMessage = MAP_DIALOGUE_MESSAGES[mapDialogueIndex];
  const mapVisibleCharacters =
    mapTypingState.messageIndex === mapDialogueIndex
      ? mapTypingState.visibleCharacters
      : 0;
  const isMapDialogueTyping =
    !mapDialogueComplete && mapVisibleCharacters < currentMapMessage.length;
  const mapVisibleText = currentMapMessage.slice(0, mapVisibleCharacters);
  const isLastMapMessage = mapDialogueIndex === MAP_DIALOGUE_MESSAGES.length - 1;
  const canExplore = active && mapDialogueComplete;
  const nearbyNode = useMemo(() => findNearbyNode(position), [position]);

  const finishMapDialogueTyping = useCallback(() => {
    if (!isMapDialogueTyping) return;

    const audio =
      mapDialogueIndex === 0
        ? mapOneAudioRef.current
        : mapDialogueIndex === 1
          ? mapTwoAudioRef.current
          : null;
    audio?.pause();
    if (audio) audio.currentTime = 0;

    setMapTypingState({
      messageIndex: mapDialogueIndex,
      visibleCharacters: currentMapMessage.length,
    });
  }, [currentMapMessage, isMapDialogueTyping, mapDialogueIndex]);

  const advanceMapDialogue = useCallback(() => {
    if (!active || mapDialogueComplete) return;
    if (isMapDialogueTyping) {
      finishMapDialogueTyping();
      return;
    }

    if (mapDialogueIndex + 1 === MAP_DIALOGUE_MESSAGES.length) {
      setMapDialogueComplete(true);
    } else {
      setMapDialogueIndex((index) => index + 1);
    }
  }, [
    active,
    finishMapDialogueTyping,
    isMapDialogueTyping,
    mapDialogueComplete,
    mapDialogueIndex,
  ]);

  useEffect(() => {
    const audio = !active || mapDialogueComplete
      ? null
      : mapDialogueIndex === 0
        ? mapOneAudioRef.current
        : mapDialogueIndex === 1
          ? mapTwoAudioRef.current
          : null;

    [mapOneAudioRef, mapTwoAudioRef].forEach((audioRef) => {
      if (audioRef.current !== audio) {
        audioRef.current?.pause();
        if (audioRef.current) audioRef.current.currentTime = 0;
      }
    });

    if (!audio) return undefined;

    audio.currentTime = 0;
    const playback = audio.play();
    playback?.catch(() => {
      // Playback can be blocked by the browser's autoplay policy.
    });

    return () => {
      audio.pause();
      audio.currentTime = 0;
    };
  }, [active, mapDialogueComplete, mapDialogueIndex]);

  useEffect(() => {
    if (!active || mapDialogueComplete || !isMapDialogueTyping) return undefined;

    const previousCharacter = currentMapMessage[mapVisibleCharacters - 1];
    const delay = /[.!?,;:]/.test(previousCharacter ?? "") ? 110 : 50;
    const timer = window.setTimeout(() => {
      setMapTypingState((current) => {
        const currentCharacters =
          current.messageIndex === mapDialogueIndex ? current.visibleCharacters : 0;
        return {
          messageIndex: mapDialogueIndex,
          visibleCharacters: Math.min(
            currentCharacters + 1,
            currentMapMessage.length,
          ),
        };
      });
    }, delay);

    return () => window.clearTimeout(timer);
  }, [
    active,
    currentMapMessage,
    isMapDialogueTyping,
    mapDialogueComplete,
    mapDialogueIndex,
    mapVisibleCharacters,
  ]);

  useEffect(() => {
    if (
      !active ||
      mapDialogueComplete ||
      !isMapDialogueTyping ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      setTalkingFrameIndex(0);
      return undefined;
    }

    const timer = window.setInterval(() => {
      setTalkingFrameIndex(
        (index) => (index + 1) % MUDEK_TALK_ANIMATION.frames.length,
      );
    }, MUDEK_TALK_ANIMATION.frameDuration);

    return () => window.clearInterval(timer);
  }, [active, isMapDialogueTyping, mapDialogueComplete]);

  useEffect(() => {
    if (!active || mapDialogueComplete) return undefined;

    const onKeyDown = (event) => {
      if (event.defaultPrevented || event.repeat) return;
      if (event.code !== "Space" && event.key !== " ") return;
      if (
        event.target?.closest?.(
          "[data-map-welcome-dialogue], a, input, textarea, select",
        )
      ) {
        return;
      }

      event.preventDefault();
      advanceMapDialogue();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [active, advanceMapDialogue, mapDialogueComplete]);

  useEffect(() => {
    if (!canExplore) {
      setIsMoving(false);
      setSpaceDetectedNode(null);
      return undefined;
    }

    const pressedKeys = new Set();
    let animationFrame = null;
    let previousFrameTime = null;
    setIsMoving(false);

    const moveFrame = (timestamp) => {
      const deltaTime =
        previousFrameTime === null
          ? 0
          : Math.min((timestamp - previousFrameTime) / 1000, 0.05);
      previousFrameTime = timestamp;

      const directionX =
        Number(pressedKeys.has("ArrowRight")) -
        Number(pressedKeys.has("ArrowLeft"));
      const directionY =
        Number(pressedKeys.has("ArrowDown")) -
        Number(pressedKeys.has("ArrowUp"));
      const currentPosition = positionRef.current;
      const nextPosition = moveOnPath(
        currentPosition,
        directionX,
        directionY,
        MOVE_SPEED * deltaTime,
      );
      const moved = nextPosition !== currentPosition;

      if (moved) {
        positionRef.current = nextPosition;
        setPosition(nextPosition);
      }
      setIsMoving(moved);

      if (pressedKeys.size > 0) {
        animationFrame = window.requestAnimationFrame(moveFrame);
      } else {
        animationFrame = null;
        previousFrameTime = null;
        setIsMoving(false);
      }
    };

    const startMoving = () => {
      if (animationFrame === null) {
        previousFrameTime = null;
        animationFrame = window.requestAnimationFrame(moveFrame);
      }
    };

    const clearMovement = () => {
      pressedKeys.clear();
      if (animationFrame !== null) {
        window.cancelAnimationFrame(animationFrame);
        animationFrame = null;
      }
      previousFrameTime = null;
    };

    const stopMoving = () => {
      clearMovement();
      setIsMoving(false);
    };

    const onKeyDown = (event) => {
      if (event.ctrlKey || event.altKey || event.metaKey) return;
      const tagName = event.target?.tagName?.toLowerCase();
      if (["input", "textarea", "select"].includes(tagName)) return;

      if (ARROW_KEYS.has(event.key)) {
        event.preventDefault();
        pressedKeys.add(event.key);
        setSpaceDetectedNode(null);
        startMoving();
      } else if (event.code === "Space" || event.key === " ") {
        event.preventDefault();
        if (event.repeat) return;

        const node = findNearbyNode(positionRef.current);
        if (node) {
          const enteredNode = onEnterNode?.(node.num);
          if (!enteredNode) setSpaceDetectedNode(node.num);
        }
      }
    };

    const onKeyUp = (event) => {
      if (!ARROW_KEYS.has(event.key)) return;
      event.preventDefault();
      pressedKeys.delete(event.key);

      if (pressedKeys.size === 0) {
        if (animationFrame !== null) {
          window.cancelAnimationFrame(animationFrame);
          animationFrame = null;
        }
        previousFrameTime = null;
        setIsMoving(false);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    window.addEventListener("blur", stopMoving);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
      window.removeEventListener("blur", stopMoving);
      clearMovement();
    };
  }, [canExplore, onEnterNode]);

  useEffect(() => {
    if (
      !isMoving ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      setWalkingFrameIndex(0);
      return undefined;
    }

    const timer = window.setInterval(() => {
      setWalkingFrameIndex(
        (index) => (index + 1) % MUDEK_WALK_ANIMATION.frames.length,
      );
    }, MUDEK_WALK_ANIMATION.frameDuration);

    return () => window.clearInterval(timer);
  }, [isMoving]);

  const avatarStyle = {
    left: `${(position.x / MAP_WIDTH) * 100}%`,
    top: `${(position.y / MAP_HEIGHT) * 100}%`,
  };
  const isAvatarTalking = active && !mapDialogueComplete && isMapDialogueTyping;
  const talkingFrame = isAvatarTalking
    ? MUDEK_TALK_ANIMATION.frames[talkingFrameIndex]
    : null;
  const walkingFrame = canExplore && isMoving
    ? MUDEK_WALK_ANIMATION.frames[walkingFrameIndex]
    : null;
  const avatarFrame = talkingFrame ?? walkingFrame;

  return (
    <div className="absolute inset-0" aria-label="Nodos del mapa">
      <audio ref={mapOneAudioRef} src={mapOneAudio} preload="auto" />
      <audio ref={mapTwoAudioRef} src={mapTwoAudio} preload="auto" />

      {mapDialogueComplete && (
        <>
          <div className="absolute left-[12px] top-[12px] z-30 border-[3px] border-[#202b40] bg-[#17263aee] px-[9px] py-[7px] font-normal text-[7px] leading-[1.7] text-white shadow-[0_3px_0_#101725]">
            <span className="block">FLECHAS: MOVER</span>
            <span className="block text-accent">
              ESPACIO: {enterableNodeNumbers.includes(nearbyNode?.num) ? "ENTRAR" : "DETECTAR"}
            </span>
          </div>
          {nearbyNode && (
            <div
              role="status"
              aria-live="polite"
              className="absolute left-[12px] top-[61px] z-30 border-[3px] border-[#202b40] bg-[#17263aee] px-[9px] py-[7px] font-normal text-[7px] leading-[1.7] text-accent shadow-[0_3px_0_#101725]"
            >
              <span className="block">
                {spaceDetectedNode === nearbyNode.num
                  ? `ESPACIO DETECTADO · NODO ${nearbyNode.num}`
                  : `NODO ${nearbyNode.num} · PULSA ESPACIO`}
              </span>
              {enterableNodeNumbers.includes(nearbyNode.num) && (
                <span className="mt-[4px] block text-white">
                  CALIFICACIÓN: {Number(nodeGrades[nearbyNode.num] ?? 0).toFixed(1)} / 5.0
                </span>
              )}
            </div>
          )}
        </>
      )}

      <div
        className="pointer-events-none absolute z-20 h-[60px] w-[40px] -translate-x-1/2 -translate-y-full"
        style={avatarStyle}
      >
        <span className="absolute -bottom-[2px] left-1/2 z-0 h-[13px] w-[34px] -translate-x-1/2 rounded-full border-2 border-[#fff4cd] bg-[#20c3e8]/80 shadow-[0_0_0_3px_#203044,0_0_12px_#35d8ff]" />
        <div
          className={`map-avatar-highlight absolute inset-0 z-10 ${avatarFrame ? "" : "avatar-idle"}`}
          style={
            avatarFrame
              ? {
                  transform: avatarFrame.transform,
                  transformOrigin: "center bottom",
                }
              : undefined
          }
        >
          <Avatar
            avatar={MUDEK}
            alt={isAvatarTalking ? "MUDEK hablando" : walkingFrame ? "MUDEK caminando" : MUDEK.name}
            className="h-full w-full"
          />
          {avatarFrame && (
            <img
              src={avatarFrame.src}
              alt=""
              aria-hidden="true"
              draggable={false}
              className="pointer-events-none absolute inset-0 h-full w-full select-none object-contain [image-rendering:pixelated]"
            />
          )}
        </div>
      </div>

      {!mapDialogueComplete && (
        <button
          type="button"
          data-stage-interactive
          data-map-welcome-dialogue
          onClick={advanceMapDialogue}
          className="absolute left-[24px] right-[24px] top-[18px] z-30 flex max-h-[280px] cursor-pointer flex-col gap-[8px] border-[5px] border-[#f0ca63] bg-[#101725] px-[15px] py-[10px] text-left text-white shadow-[0_8px_0_#080d16,0_12px_24px_#000000b8] ring-4 ring-[#35d8ff]/80 transition-colors hover:border-[#fff3bd] active:translate-y-[3px] active:shadow-[0_5px_0_#080d16,0_9px_18px_#000000b8] focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-white"
        >
          <span className="flex w-full items-center justify-between gap-[8px] border-b-2 border-[#40566d] pb-[6px] font-pixel text-[7px] leading-[1.7]">
            <span className="flex items-center gap-[9px]">
              <span className="border-2 border-[#101725] bg-[#35d8ff] px-[7px] py-[4px] text-[#101725] shadow-[2px_2px_0_#14768b]">
                MUDEK
              </span>
              <span className="text-[#9fe8f4]">BIENVENIDA AL MAPA</span>
            </span>
            <span className="shrink-0 border-2 border-[#7a5c2e] bg-[#f0ca63] px-[7px] py-[4px] text-[#211922] shadow-[2px_2px_0_#080d16]">
              {String(mapDialogueIndex + 1).padStart(2, "0")} / 02
            </span>
          </span>

          <span className="block w-full whitespace-pre-line border-l-[4px] border-[#35d8ff] px-[11px] py-[7px] font-pixel text-[8px] leading-[1.9] text-white [text-shadow:1px_1px_0_#080d16]">
            {mapVisibleText}
            {isMapDialogueTyping && <span className="ml-[2px] text-[#f0ca63]">▌</span>}
          </span>

          <span className="flex w-full items-center justify-between gap-[8px] border-t-2 border-[#40566d] pt-[6px] font-pixel text-[7px] leading-[1.7]">
            <span className={isMapDialogueTyping ? "text-[#9fe8f4]" : "text-[#ffe6b8]"}>
              {isMapDialogueTyping
                ? "ESPACIO O CLIC: MOSTRAR TODO"
                : isLastMapMessage
                  ? "ESPACIO O CLIC: COMENZAR"
                  : "ESPACIO O CLIC: CONTINUAR"}
            </span>
            <span aria-hidden="true" className="shrink-0 text-[#f0ca63]">
              ▼
            </span>
          </span>

          <span
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-[15px] left-[82px] h-0 w-0 border-x-[12px] border-x-transparent border-t-[15px] border-t-[#f0ca63]"
          />
          <span
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-[10px] left-[86px] h-0 w-0 border-x-[8px] border-x-transparent border-t-[10px] border-t-[#101725]"
          />
        </button>
      )}

      {NODE_MARKERS.map(({ num, x, y }, index) => {
        const isNearby = nearbyNode?.num === num;

        return (
          <div
            key={num}
            aria-hidden="true"
            className="pointer-events-none absolute z-10 grid size-[44px] place-items-center"
            style={{
              left: `${(x / MAP_WIDTH) * 100}%`,
              top: `${(y / MAP_HEIGHT) * 100}%`,
              transform: "translate(-50%, calc(-100% - 26px))",
            }}
          >
            <span
              className={`map-node-float grid size-full place-items-center rounded-full border-[4px] border-[#202b40] bg-[#f0ca63] shadow-[0_4px_0_#5b3d2d] transition-[filter,transform] ${isNearby ? "scale-125 brightness-125" : ""}`}
              style={{ animationDelay: `${index * -180}ms` }}
            >
              <svg
                viewBox="0 0 16 16"
                className="size-[18px]"
                shapeRendering="crispEdges"
              >
                <path
                  fill="#9c602d"
                  d="M6 0h4v3h3v3h3v4h-3v3h-3v3H6v-3H3v-3H0V6h3V3h3z"
                />
                <path
                  fill="#fff3bd"
                  d="M7 2h2v3h3v2h2v2h-2v2H9v3H7v-3H4V9H2V7h2V5h3z"
                />
                <path fill="#e9943e" d="M7 5h2v2h2v2H9v2H7V9H5V7h2z" />
              </svg>
            </span>
          </div>
        );
      })}
    </div>
  );
}
