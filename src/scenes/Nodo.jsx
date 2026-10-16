import { useCallback, useEffect, useRef, useState } from "react";
import Avatar from "../components/Avatar.jsx";
import { MUDEK } from "../data/avatars.js";
import {
  NODE_1_CORRECT_ORDER,
  NODE_1_DIALOGUE,
  NODE_1_INITIAL_ORDER,
  NODE_1_QUIZ_OPTIONS,
} from "../data/nodo1.js";
import { MUDEK_ANIMATIONS } from "../data/mudekAnimations.js";
import nodeOneFirstAudio from "../assets/audio/Nodo-1-1.mp3";
import nodeOneSecondAudio from "../assets/audio/Nodo-1-2.mp3";
import nodeOneThirdAudio from "../assets/audio/Nodo-1-3.mp3";
import nodeOneFourthAudio from "../assets/audio/Nodo-1-4.mp3";
import nodeOneFifthAudio from "../assets/audio/Nodo-1-5.mp3";
import nodeOneSixthAudio from "../assets/audio/Nodo-1-6.mp3";
import nodeOneSeventhAudio from "../assets/audio/Nodo-1-7.mp3";
import nodeOneQuizAudio from "../assets/audio/Nodo-1-8.mp3";
import nodeOneSuccessAudio from "../assets/audio/Nodo-1-9.mp3";

const PASSING_GRADE = 5.0;
const TYPEWRITER_CHARACTER_DELAY = 50;
const TYPEWRITER_PAUSE_DELAY = 110;
const STAGE_WIDTH = 1024;
const STAGE_HEIGHT = 599;
const SUCCESS_MESSAGE =
  "¡Excelente! Alzahrani (2026) organiza la evolución de la IA en calidad de software desde el ML clásico y las redes bayesianas hacia los LLM y los sistemas multiagente. Precisamente, los agentes dotados de autonomía serán el tema de nuestro módulo 4. ¡Has desbloqueado el siguiente nivel!";

function findOptionAtPoint(event) {
  const option = document
    .elementFromPoint(event.clientX, event.clientY)
    ?.closest?.("[data-sortable-option]");

  return option?.dataset.sortableOption ?? null;
}

function getStagePointerPosition(event) {
  const stage = event.currentTarget.closest?.("#stage");
  const bounds = stage?.getBoundingClientRect();
  const scaleX = bounds?.width ? bounds.width / STAGE_WIDTH : 1;
  const scaleY = bounds?.height ? bounds.height / STAGE_HEIGHT : 1;

  return {
    x: (event.clientX - (bounds?.left ?? 0)) / scaleX,
    y: (event.clientY - (bounds?.top ?? 0)) / scaleY,
    scaleX,
    scaleY,
  };
}

export default function Nodo({ active, nodeNumber = 1, onComplete, onExit }) {
  const [phase, setPhase] = useState("dialogue");
  const [dialogueIndex, setDialogueIndex] = useState(0);
  const [quizOrder, setQuizOrder] = useState(NODE_1_INITIAL_ORDER);
  const [feedback, setFeedback] = useState(null);
  const [draggedOptionId, setDraggedOptionId] = useState(null);
  const [hoveredOptionId, setHoveredOptionId] = useState(null);
  const [dragPreview, setDragPreview] = useState(null);
  const [typingState, setTypingState] = useState({
    key: "",
    visibleCharacters: 0,
  });
  const [talkingFrameIndex, setTalkingFrameIndex] = useState(0);
  const [isQuizAudioPlaying, setIsQuizAudioPlaying] = useState(false);
  const [isSuccessAudioPlaying, setIsSuccessAudioPlaying] = useState(false);
  const nodeOneFirstAudioRef = useRef(null);
  const nodeOneSecondAudioRef = useRef(null);
  const nodeOneThirdAudioRef = useRef(null);
  const nodeOneFourthAudioRef = useRef(null);
  const nodeOneFifthAudioRef = useRef(null);
  const nodeOneSixthAudioRef = useRef(null);
  const nodeOneSeventhAudioRef = useRef(null);
  const nodeOneQuizAudioRef = useRef(null);
  const nodeOneSuccessAudioRef = useRef(null);
  const dragRef = useRef(null);
  const currentMessage = NODE_1_DIALOGUE[dialogueIndex];
  const typewriterKey =
    phase === "dialogue"
      ? `dialogue-${dialogueIndex}`
      : phase === "success"
        ? "success"
        : "";
  const typewriterText =
    phase === "dialogue"
      ? currentMessage
        ? currentMessage.type === "concept"
          ? `${currentMessage.title}: ${currentMessage.text}`
          : currentMessage.text
        : ""
      : phase === "success"
        ? SUCCESS_MESSAGE
        : "";
  const visibleCharacters =
    typingState.key === typewriterKey ? typingState.visibleCharacters : 0;
  const isTyping =
    Boolean(typewriterText) && visibleCharacters < typewriterText.length;
  const isSpeaking =
    isTyping ||
    (phase === "quiz" && isQuizAudioPlaying) ||
    (phase === "success" && isSuccessAudioPlaying);
  const visibleText = typewriterText.slice(0, visibleCharacters);
  const talkingAnimation = MUDEK_ANIMATIONS.hablar;
  const talkingFrame = talkingAnimation.frames[talkingFrameIndex];

  const finishTyping = useCallback(() => {
    if (!typewriterText || !isTyping) return;

    if (phase === "dialogue") {
      const audio =
        dialogueIndex === 0
          ? nodeOneFirstAudioRef.current
          : dialogueIndex === 1
            ? nodeOneSecondAudioRef.current
            : dialogueIndex === 2
              ? nodeOneThirdAudioRef.current
              : dialogueIndex === 3
                ? nodeOneFourthAudioRef.current
                : dialogueIndex === 4
                  ? nodeOneFifthAudioRef.current
                  : dialogueIndex === 5
                    ? nodeOneSixthAudioRef.current
                    : dialogueIndex === 6
                      ? nodeOneSeventhAudioRef.current
                      : null;
      audio?.pause();
      if (audio) audio.currentTime = 0;
    } else if (phase === "success") {
      const audio = nodeOneSuccessAudioRef.current;
      audio?.pause();
      if (audio) audio.currentTime = 0;
    }

    setTypingState({
      key: typewriterKey,
      visibleCharacters: typewriterText.length,
    });
  }, [dialogueIndex, isTyping, phase, typewriterKey, typewriterText]);

  const advanceDialogue = useCallback(() => {
    if (!active || phase !== "dialogue") return;
    if (isTyping) {
      finishTyping();
      return;
    }

    if (dialogueIndex + 1 === NODE_1_DIALOGUE.length) {
      setPhase("quiz");
    } else {
      setDialogueIndex((index) => index + 1);
    }
  }, [active, dialogueIndex, finishTyping, isTyping, phase]);

  const continueFromSuccess = useCallback(() => {
    if (!active || phase !== "success") return;
    if (isTyping) {
      finishTyping();
      return;
    }
    const audio = nodeOneSuccessAudioRef.current;
    audio?.pause();
    if (audio) audio.currentTime = 0;
    onExit?.();
  }, [active, finishTyping, isTyping, onExit, phase]);

  useEffect(() => {
    if (active) return;

    setPhase("dialogue");
    setDialogueIndex(0);
    setQuizOrder([...NODE_1_INITIAL_ORDER]);
    setFeedback(null);
    setDraggedOptionId(null);
    setHoveredOptionId(null);
    setDragPreview(null);
    setTypingState({ key: "", visibleCharacters: 0 });
    setTalkingFrameIndex(0);
    dragRef.current = null;
  }, [active]);

  useEffect(() => {
    const audio =
      !active || phase !== "dialogue"
        ? null
        : dialogueIndex === 0
          ? nodeOneFirstAudioRef.current
          : dialogueIndex === 1
            ? nodeOneSecondAudioRef.current
            : dialogueIndex === 2
              ? nodeOneThirdAudioRef.current
              : dialogueIndex === 3
                ? nodeOneFourthAudioRef.current
                : dialogueIndex === 4
                  ? nodeOneFifthAudioRef.current
                  : dialogueIndex === 5
                    ? nodeOneSixthAudioRef.current
                    : dialogueIndex === 6
                      ? nodeOneSeventhAudioRef.current
                      : null;

    [
      nodeOneFirstAudioRef,
      nodeOneSecondAudioRef,
      nodeOneThirdAudioRef,
      nodeOneFourthAudioRef,
      nodeOneFifthAudioRef,
      nodeOneSixthAudioRef,
      nodeOneSeventhAudioRef,
    ].forEach((audioRef) => {
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
  }, [active, dialogueIndex, phase]);

  useEffect(() => {
    const audio = nodeOneQuizAudioRef.current;
    if (!audio) return undefined;

    if (!active || phase !== "quiz") {
      audio.pause();
      audio.currentTime = 0;
      return undefined;
    }

    audio.currentTime = 0;
    const playback = audio.play();
    playback?.catch(() => {
      setIsQuizAudioPlaying(false);
    });

    return () => {
      audio.pause();
      audio.currentTime = 0;
    };
  }, [active, phase]);

  useEffect(() => {
    const audio = nodeOneSuccessAudioRef.current;
    if (!audio) return undefined;

    if (!active || phase !== "success") {
      audio.pause();
      audio.currentTime = 0;
      return undefined;
    }

    audio.currentTime = 0;
    const playback = audio.play();
    playback?.catch(() => {
      setIsSuccessAudioPlaying(false);
    });

    return () => {
      audio.pause();
      audio.currentTime = 0;
    };
  }, [active, phase]);

  useEffect(() => {
    if (!active || !isTyping || !typewriterText) return undefined;

    const previousCharacter = typewriterText[visibleCharacters - 1];
    const delay = /[.!?,;:]/.test(previousCharacter ?? "")
      ? TYPEWRITER_PAUSE_DELAY
      : TYPEWRITER_CHARACTER_DELAY;
    const timer = window.setTimeout(() => {
      setTypingState((current) => {
        const currentCharacters =
          current.key === typewriterKey ? current.visibleCharacters : 0;
        return {
          key: typewriterKey,
          visibleCharacters: Math.min(
            currentCharacters + 1,
            typewriterText.length,
          ),
        };
      });
    }, delay);

    return () => window.clearTimeout(timer);
  }, [active, isTyping, typewriterKey, typewriterText, visibleCharacters]);

  useEffect(() => {
    if (
      !active ||
      !isSpeaking ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      setTalkingFrameIndex(0);
      return undefined;
    }

    const timer = window.setInterval(() => {
      setTalkingFrameIndex(
        (index) => (index + 1) % talkingAnimation.frames.length,
      );
    }, talkingAnimation.frameDuration);

    return () => window.clearInterval(timer);
  }, [active, isSpeaking, talkingAnimation]);

  useEffect(() => {
    if (!active || (phase !== "dialogue" && phase !== "success"))
      return undefined;

    const onKeyDown = (event) => {
      if (event.defaultPrevented || event.repeat) return;
      if (event.code !== "Space" && event.key !== " ") return;
      if (event.target?.closest?.("button, a, input, textarea, select")) return;

      event.preventDefault();
      if (phase === "dialogue") advanceDialogue();
      else continueFromSuccess();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [active, advanceDialogue, continueFromSuccess, phase]);

  const reorderOption = useCallback((fromId, toId) => {
    if (!toId || fromId === toId) return;

    setQuizOrder((currentOrder) => {
      const fromIndex = currentOrder.indexOf(fromId);
      const toIndex = currentOrder.indexOf(toId);
      if (fromIndex < 0 || toIndex < 0) return currentOrder;

      const nextOrder = [...currentOrder];
      nextOrder.splice(fromIndex, 1);
      nextOrder.splice(toIndex, 0, fromId);
      return nextOrder;
    });
  }, []);

  const moveOptionBy = useCallback((optionId, direction) => {
    setQuizOrder((currentOrder) => {
      const currentIndex = currentOrder.indexOf(optionId);
      const targetIndex = currentIndex + direction;
      if (
        currentIndex < 0 ||
        targetIndex < 0 ||
        targetIndex >= currentOrder.length
      ) {
        return currentOrder;
      }

      const nextOrder = [...currentOrder];
      [nextOrder[currentIndex], nextOrder[targetIndex]] = [
        nextOrder[targetIndex],
        nextOrder[currentIndex],
      ];
      return nextOrder;
    });
  }, []);

  const startDragging = (event, optionId) => {
    if (feedback || event.button !== 0 || event.target?.closest?.("button"))
      return;

    event.preventDefault();
    event.stopPropagation();
    const pointer = getStagePointerPosition(event);
    const optionBounds = event.currentTarget.getBoundingClientRect();
    const offsetX = (event.clientX - optionBounds.left) / pointer.scaleX;
    const offsetY = (event.clientY - optionBounds.top) / pointer.scaleY;
    const width = optionBounds.width / pointer.scaleX;
    const height = optionBounds.height / pointer.scaleY;
    dragRef.current = {
      optionId,
      pointerId: event.pointerId,
      offsetX,
      offsetY,
    };
    setDraggedOptionId(optionId);
    setHoveredOptionId(optionId);
    setDragPreview({
      left: pointer.x - offsetX,
      top: pointer.y - offsetY,
      width,
      height,
    });

    try {
      event.currentTarget.setPointerCapture(event.pointerId);
    } catch {
      // Pointer capture is best-effort; the quiz remains usable with keyboard controls.
    }
  };

  const moveDraggedOption = (event) => {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;

    event.stopPropagation();
    setHoveredOptionId(findOptionAtPoint(event));
    const pointer = getStagePointerPosition(event);
    setDragPreview((preview) =>
      preview
        ? {
            ...preview,
            left: pointer.x - drag.offsetX,
            top: pointer.y - drag.offsetY,
          }
        : preview,
    );
  };

  const finishDragging = (event) => {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;

    event.preventDefault();
    event.stopPropagation();
    reorderOption(drag.optionId, findOptionAtPoint(event));
    dragRef.current = null;
    setDraggedOptionId(null);
    setHoveredOptionId(null);
    setDragPreview(null);

    try {
      if (event.currentTarget.hasPointerCapture(event.pointerId)) {
        event.currentTarget.releasePointerCapture(event.pointerId);
      }
    } catch {
      // The pointer may already have been released by the browser.
    }
  };

  const cancelDragging = (event) => {
    if (dragRef.current?.pointerId !== event.pointerId) return;
    dragRef.current = null;
    setDraggedOptionId(null);
    setHoveredOptionId(null);
    setDragPreview(null);
  };

  const checkAnswer = () => {
    if (!active || phase !== "quiz" || feedback) return;

    const isCorrect = NODE_1_CORRECT_ORDER.every(
      (optionId, index) => quizOrder[index] === optionId,
    );

    if (isCorrect) {
      setPhase("success");
      onComplete?.(nodeNumber, PASSING_GRADE);
    } else {
      setFeedback("incorrect");
    }
  };

  const retryQuiz = () => {
    setQuizOrder([...NODE_1_INITIAL_ORDER]);
    setFeedback(null);
  };

  const draggedOption = NODE_1_QUIZ_OPTIONS.find(
    (option) => option.id === draggedOptionId,
  );
  const draggedOptionPosition = quizOrder.indexOf(draggedOptionId) + 1;

  return (
    <div className="absolute inset-0">
      <audio
        ref={nodeOneFirstAudioRef}
        src={nodeOneFirstAudio}
        preload="auto"
      />
      <audio
        ref={nodeOneSecondAudioRef}
        src={nodeOneSecondAudio}
        preload="auto"
      />
      <audio
        ref={nodeOneThirdAudioRef}
        src={nodeOneThirdAudio}
        preload="auto"
      />
      <audio
        ref={nodeOneFourthAudioRef}
        src={nodeOneFourthAudio}
        preload="auto"
      />
      <audio
        ref={nodeOneFifthAudioRef}
        src={nodeOneFifthAudio}
        preload="auto"
      />
      <audio
        ref={nodeOneSixthAudioRef}
        src={nodeOneSixthAudio}
        preload="auto"
      />
      <audio
        ref={nodeOneSeventhAudioRef}
        src={nodeOneSeventhAudio}
        preload="auto"
      />
      <audio
        ref={nodeOneQuizAudioRef}
        src={nodeOneQuizAudio}
        preload="auto"
        onPlay={() => setIsQuizAudioPlaying(true)}
        onPause={() => setIsQuizAudioPlaying(false)}
        onEnded={() => setIsQuizAudioPlaying(false)}
      />
      <audio
        ref={nodeOneSuccessAudioRef}
        src={nodeOneSuccessAudio}
        preload="auto"
        onPlay={() => setIsSuccessAudioPlaying(true)}
        onPause={() => setIsSuccessAudioPlaying(false)}
        onEnded={() => setIsSuccessAudioPlaying(false)}
      />

      <div className="pointer-events-none absolute bottom-[20px] left-[120px] h-[320px] w-[120px]">
        <div
          className={`absolute inset-0 ${isSpeaking ? "" : "avatar-idle"}`}
          style={
            isSpeaking
              ? {
                  transform: talkingFrame.transform,
                  transformOrigin: "center bottom",
                }
              : undefined
          }
        >
          <Avatar
            avatar={MUDEK}
            alt={isSpeaking ? "MUDEK hablando" : "MUDEK"}
            className="h-full w-full"
          />
          {isSpeaking && (
            <img
              src={talkingFrame.src}
              alt=""
              aria-hidden="true"
              draggable={false}
              className="pointer-events-none absolute inset-0 h-full w-full select-none object-contain [image-rendering:pixelated]"
            />
          )}
        </div>
      </div>

      {phase === "dialogue" && currentMessage && (
        <button
          type="button"
          data-stage-interactive
          onClick={advanceDialogue}
          className="absolute left-[24px] right-[24px] top-[18px] z-30 flex max-h-[235px] cursor-pointer flex-col gap-[8px] border-[5px] border-[#f0ca63] bg-[#101725] px-[15px] py-[10px] text-left text-white shadow-[0_8px_0_#080d16,0_12px_24px_#000000b8] ring-4 ring-[#35d8ff]/80 transition-colors hover:border-[#fff3bd] focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-white"
        >
          <span className="flex w-full items-center justify-between border-b-2 border-[#40566d] pb-[6px] font-pixel text-[7px] leading-[1.7]">
            <span className="flex items-center gap-[9px]">
              <span className="border-2 border-[#101725] bg-[#35d8ff] px-[7px] py-[4px] text-[#101725] shadow-[2px_2px_0_#14768b]">
                MUDEK
              </span>
              <span className="text-[#9fe8f4]">
                LABORATORIO DE LOS ORÍGENES
              </span>
            </span>
            <span className="border-2 border-[#7a5c2e] bg-[#f0ca63] px-[7px] py-[4px] text-[#211922] shadow-[2px_2px_0_#080d16]">
              {String(dialogueIndex + 1).padStart(2, "0")} / 07
            </span>
          </span>
          {currentMessage.type === "concept" ? (
            <span className="block w-full">
              <span className="mb-[5px] block font-pixel text-[9px] leading-[1.7] text-[#f0ca63] [text-shadow:2px_2px_0_#080d16]">
                CONCEPTO {currentMessage.conceptNumber} DE 4
              </span>
              <span className="block border-l-[4px] border-[#35d8ff] px-[11px] py-[7px] font-pixel text-[8px] leading-[1.9] text-white [text-shadow:1px_1px_0_#080d16]">
                {visibleText}
                {isTyping && <span className="ml-[2px] text-[#f0ca63]">▌</span>}
              </span>
            </span>
          ) : (
            <span className="block w-full whitespace-pre-line border-l-[4px] border-[#35d8ff] px-[11px] py-[7px] font-pixel text-[8px] leading-[1.9] text-white [text-shadow:1px_1px_0_#080d16]">
              {visibleText}
              {isTyping && <span className="ml-[2px] text-[#f0ca63]">▌</span>}
            </span>
          )}
          <span className="flex w-full items-center justify-between border-t-2 border-[#40566d] pt-[6px] font-pixel text-[7px] leading-[1.7]">
            <span className={isTyping ? "text-[#9fe8f4]" : "text-[#ffe6b8]"}>
              {isTyping
                ? "ESPACIO O CLIC: MOSTRAR TODO"
                : "ESPACIO O CLIC: CONTINUAR"}
            </span>
            <span aria-hidden="true" className="text-[#f0ca63]">
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

      {phase === "quiz" && (
        <section
          data-stage-interactive
          aria-labelledby="node-1-quiz-title"
          className="absolute bottom-[28px] left-[260px] right-[28px] top-[28px] z-30 flex flex-col border-[5px] border-[#f0ca63] bg-[#101725] px-[18px] py-[16px] text-white shadow-[0_8px_0_#080d16,0_12px_24px_#000000b8] ring-4 ring-[#35d8ff]/80"
        >
          <header className="mb-[12px] border-b-4 border-[#35d8ff] bg-[#17263a] px-[12px] py-[10px] shadow-[inset_0_2px_0_#2c4965]">
            <p className="mb-[7px] font-pixel text-[7px] leading-[1.7] text-accent">
              MINIJUEGO · NODO {nodeNumber}
            </p>
            <h2
              id="node-1-quiz-title"
              className="font-pixel text-[11px] leading-[1.8] text-[#fff3bd] [text-shadow:2px_2px_0_#080d16]"
            >
              Ordena la evolución de la IA
            </h2>
            <p
              id="sort-instructions"
              className="mt-[6px] font-pixel text-[7px] leading-[1.8] text-[#e5e7eb]"
            >
              Arrastra las etapas de la más antigua a la más reciente. También
              puedes usar las flechas ↑ y ↓.
            </p>
          </header>

          <ol
            aria-label="Etapas de la evolución de la inteligencia artificial"
            className="flex flex-1 flex-col justify-center gap-[7px]"
          >
            {quizOrder.map((optionId, index) => {
              const option = NODE_1_QUIZ_OPTIONS.find(
                (item) => item.id === optionId,
              );
              if (!option) return null;

              const isDragging = draggedOptionId === option.id;
              const isDropTarget =
                hoveredOptionId === option.id && isDragging === false;

              return (
                <li
                  key={option.id}
                  data-sortable-option={option.id}
                  role="listitem"
                  tabIndex={0}
                  aria-label={`Posición ${index + 1}: ${option.label}. Usa las flechas arriba y abajo para reordenar.`}
                  aria-describedby="sort-instructions"
                  aria-grabbed={isDragging}
                  onPointerDown={(event) => startDragging(event, option.id)}
                  onPointerMove={moveDraggedOption}
                  onPointerUp={finishDragging}
                  onPointerCancel={cancelDragging}
                  onKeyDown={(event) => {
                    if (
                      !feedback &&
                      (event.key === "ArrowUp" || event.key === "ArrowDown")
                    ) {
                      event.preventDefault();
                      event.stopPropagation();
                      moveOptionBy(option.id, event.key === "ArrowUp" ? -1 : 1);
                    }
                  }}
                  className={`flex min-h-[56px] touch-none select-none items-center gap-[11px] border-2 px-[10px] py-[6px] outline-none transition-colors focus-visible:border-white focus-visible:ring-2 focus-visible:ring-white ${isDragging ? "border-dashed border-[#f0ca63] bg-[#37404a] opacity-30" : isDropTarget ? "border-accent bg-[#263945]" : "border-[#52616a] bg-[#1b2b32] hover:border-[#9c8060]"} cursor-grab active:cursor-grabbing`}
                >
                  <span className="grid size-[30px] shrink-0 place-items-center border-2 border-[#d6a568] bg-[#352b24] font-pixel text-[9px] text-accent">
                    {index + 1}
                  </span>
                  <span className="flex-1 font-pixel text-[8px] leading-[1.8] text-white">
                    {option.label}
                  </span>
                  <span className="flex shrink-0 flex-col gap-[3px]">
                    <button
                      type="button"
                      aria-label={`Mover “${option.label}” hacia arriba`}
                      disabled={index === 0 || Boolean(feedback)}
                      onClick={() => moveOptionBy(option.id, -1)}
                      className="grid size-[23px] place-items-center border border-[#826445] bg-[#352b24] font-pixel text-[8px] text-accent hover:bg-[#51402f] disabled:cursor-not-allowed disabled:opacity-35 focus-visible:outline-2 focus-visible:outline-white"
                    >
                      ↑
                    </button>
                    <button
                      type="button"
                      aria-label={`Mover “${option.label}” hacia abajo`}
                      disabled={
                        index === quizOrder.length - 1 || Boolean(feedback)
                      }
                      onClick={() => moveOptionBy(option.id, 1)}
                      className="grid size-[23px] place-items-center border border-[#826445] bg-[#352b24] font-pixel text-[8px] text-accent hover:bg-[#51402f] disabled:cursor-not-allowed disabled:opacity-35 focus-visible:outline-2 focus-visible:outline-white"
                    >
                      ↓
                    </button>
                  </span>
                </li>
              );
            })}
          </ol>

          <footer className="mt-[12px] flex min-h-[52px] items-center justify-between gap-[12px] border-t-4 border-[#35d8ff] bg-[#17263a] px-[10px] pb-[8px] pt-[10px] shadow-[inset_0_2px_0_#2c4965]">
            <div
              aria-live="polite"
              className="font-pixel text-[7px] leading-[1.8]"
            >
              {feedback === "incorrect" ? (
                <span className="text-[#ffd18c]">
                  Ese orden no es correcto todavía. Revisa la cronología e
                  inténtalo otra vez.
                </span>
              ) : (
                <span className="text-[#d8e1e5]">
                  Coloca primero la etapa más antigua.
                </span>
              )}
            </div>
            {feedback === "incorrect" ? (
              <button
                type="button"
                onClick={retryQuiz}
                className="shrink-0 border-2 border-[#241923] bg-accent px-[13px] py-[10px] font-pixel text-[8px] leading-[1.5] text-black shadow-[0_3px_0_#100d15] hover:bg-[#ffc35c] active:translate-y-[2px] active:shadow-[0_1px_0_#100d15] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                OTRO INTENTO
              </button>
            ) : (
              <button
                type="button"
                onClick={checkAnswer}
                className="shrink-0 border-2 border-[#241923] bg-accent px-[16px] py-[11px] font-pixel text-[8px] leading-[1.5] text-black shadow-[0_3px_0_#100d15] hover:bg-[#ffc35c] active:translate-y-[2px] active:shadow-[0_1px_0_#100d15] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                COMPROBAR
              </button>
            )}
          </footer>
        </section>
      )}

      {phase === "quiz" && dragPreview && draggedOption && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute z-[80] flex items-center gap-[11px] border-[3px] border-[#f0ca63] bg-[#101725] px-[10px] py-[6px] font-pixel text-[8px] text-white opacity-95 shadow-[0_8px_0_#080d16,0_12px_24px_#000000b8] ring-2 ring-[#35d8ff]"
          style={{
            left: dragPreview.left,
            top: dragPreview.top,
            width: dragPreview.width,
            height: dragPreview.height,
          }}
        >
          <span className="grid size-[30px] shrink-0 place-items-center border-2 border-[#d6a568] bg-[#352b24] text-accent">
            {draggedOptionPosition}
          </span>
          <span className="flex-1 leading-[1.8]">{draggedOption.label}</span>
        </div>
      )}

      {phase === "success" && (
        <button
          type="button"
          data-stage-interactive
          onClick={continueFromSuccess}
          className="absolute left-[24px] right-[24px] top-[18px] z-30 flex max-h-[235px] cursor-pointer flex-col gap-[8px] border-[5px] border-[#f0ca63] bg-[#101725] px-[15px] py-[10px] text-left text-white shadow-[0_8px_0_#080d16,0_12px_24px_#000000b8] ring-4 ring-[#35d8ff]/80 transition-colors hover:border-[#fff3bd] focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-white"
        >
          <span className="flex items-center justify-between border-b-2 border-[#40566d] pb-[6px] font-pixel text-[8px] leading-[1.7]">
            <span className="text-[#9fe8f4]">
              MUDEK · ¡HAS COMPLETADO EL NODO {nodeNumber}!
            </span>
            <span className="border-2 border-[#7a5c2e] bg-[#f0ca63] px-[7px] py-[4px] text-[#211922] shadow-[2px_2px_0_#080d16]">
              ÉXITO
            </span>
          </span>
          <span className="block border-l-[4px] border-[#35d8ff] px-[11px] py-[7px] font-pixel text-[8px] leading-[1.9] text-white [text-shadow:1px_1px_0_#080d16]">
            {visibleText}
            {isTyping && <span className="ml-[2px] text-[#f0ca63]">▌</span>}
          </span>
          <span className="font-pixel text-[8px] leading-[1.7] text-[#f0ca63]">
            CALIFICACIÓN DEL NODO: {PASSING_GRADE.toFixed(1)} / 5.0
          </span>
          <span className="flex items-center justify-between border-t-2 border-[#40566d] pt-[6px] font-pixel text-[7px] leading-[1.7]">
            <span className={isTyping ? "text-[#9fe8f4]" : "text-[#ffe6b8]"}>
              {isTyping
                ? "ESPACIO O CLIC: MOSTRAR TODO"
                : "ESPACIO O CLIC: VOLVER AL MAPA"}
            </span>
            <span aria-hidden="true" className="text-[#f0ca63]">
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
    </div>
  );
}
