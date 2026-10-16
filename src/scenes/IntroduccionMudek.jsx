import { useCallback, useEffect, useRef, useState } from "react";
import Avatar from "../components/Avatar.jsx";
import { MUDEK } from "../data/avatars.js";
import { MUDEK_ANIMATIONS } from "../data/mudekAnimations.js";
import introOneAudio from "../assets/audio/Intro-1.mp3";
import introTwoAudio from "../assets/audio/Intro-2.mp3";
import introThreeAudio from "../assets/audio/Intro.3.mp3";

const INTRODUCTION_MESSAGES = [
  "¡Hola! Mi nombre es MUDEK. Te doy la bienvenida a este recorrido. Soy tu guía en la exploración de las nuevas fronteras de la ingeniería de sistemas.",
  "Actualmente, la Inteligencia Artificial generativa está transformando radicalmente el desarrollo de software. Más del 80% de 195 estudios primarios sobre IA se publicó desde 2023 (Alzahrani, 2026). Al mismo tiempo hay fricción: el 84,2 % de los pull requests de agentes que se rechazan se cierran sin comentarios (Hindi et al., 2026), y la forma de orquestar un agente puede cambiar el costo hasta 3,5 veces en tokens (Lwin & Kumar, 2026). Importa además la arquitectura del arnés del modelo (Lee et al., 2026).",
  "De ahí nuestra pregunta guía: ¿qué estrategias y patrones de harness engineering se han reportado para agentes de IA en el desarrollo de software?",
];

const TALKING_ANIMATION = MUDEK_ANIMATIONS.hablar;
const TYPEWRITER_CHARACTER_DELAY = 50;
const TYPEWRITER_PAUSE_DELAY = 110;

export default function IntroduccionMudek({ active, onComplete }) {
  const [messageIndex, setMessageIndex] = useState(0);
  const [typingState, setTypingState] = useState({
    messageIndex: -1,
    visibleCharacters: 0,
  });
  const [talkingFrameIndex, setTalkingFrameIndex] = useState(0);
  const introOneAudioRef = useRef(null);
  const introTwoAudioRef = useRef(null);
  const introThreeAudioRef = useRef(null);
  const currentMessage = INTRODUCTION_MESSAGES[messageIndex];
  const visibleCharacters =
    typingState.messageIndex === messageIndex
      ? typingState.visibleCharacters
      : 0;
  const isTyping = visibleCharacters < currentMessage.length;
  const visibleText = currentMessage.slice(0, visibleCharacters);
  const talkingFrame = TALKING_ANIMATION.frames[talkingFrameIndex];
  const isLastMessage = messageIndex === INTRODUCTION_MESSAGES.length - 1;

  const finishTyping = useCallback(() => {
    if (!isTyping) return;

    const audio =
      messageIndex === 0
        ? introOneAudioRef.current
        : messageIndex === 1
          ? introTwoAudioRef.current
          : messageIndex === 2
            ? introThreeAudioRef.current
            : null;
    audio?.pause();
    if (audio) audio.currentTime = 0;

    setTypingState({ messageIndex, visibleCharacters: currentMessage.length });
  }, [currentMessage, isTyping, messageIndex]);

  const advanceDialogue = useCallback(() => {
    if (!active) return;
    if (isTyping) {
      finishTyping();
      return;
    }

    if (messageIndex + 1 === INTRODUCTION_MESSAGES.length) {
      onComplete?.();
    } else {
      setMessageIndex((index) => index + 1);
    }
  }, [active, finishTyping, isTyping, messageIndex, onComplete]);

  useEffect(() => {
    if (active) return;

    setMessageIndex(0);
    setTypingState({ messageIndex: -1, visibleCharacters: 0 });
    setTalkingFrameIndex(0);
  }, [active]);

  useEffect(() => {
    const audio = !active
      ? null
      : messageIndex === 0
        ? introOneAudioRef.current
        : messageIndex === 1
          ? introTwoAudioRef.current
          : messageIndex === 2
            ? introThreeAudioRef.current
            : null;

    [introOneAudioRef, introTwoAudioRef, introThreeAudioRef].forEach((audioRef) => {
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
  }, [active, messageIndex]);

  useEffect(() => {
    if (!active || !isTyping) return undefined;

    const previousCharacter = currentMessage[visibleCharacters - 1];
    const delay = /[.!?,;:]/.test(previousCharacter ?? "")
      ? TYPEWRITER_PAUSE_DELAY
      : TYPEWRITER_CHARACTER_DELAY;
    const timer = window.setTimeout(() => {
      setTypingState((current) => {
        const currentCharacters =
          current.messageIndex === messageIndex ? current.visibleCharacters : 0;
        return {
          messageIndex,
          visibleCharacters: Math.min(
            currentCharacters + 1,
            currentMessage.length,
          ),
        };
      });
    }, delay);

    return () => window.clearTimeout(timer);
  }, [active, currentMessage, isTyping, messageIndex, visibleCharacters]);

  useEffect(() => {
    if (
      !active ||
      !isTyping ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      setTalkingFrameIndex(0);
      return undefined;
    }

    const timer = window.setInterval(() => {
      setTalkingFrameIndex(
        (index) => (index + 1) % TALKING_ANIMATION.frames.length,
      );
    }, TALKING_ANIMATION.frameDuration);

    return () => window.clearInterval(timer);
  }, [active, isTyping]);

  useEffect(() => {
    if (!active) return undefined;

    const onKeyDown = (event) => {
      if (event.defaultPrevented || event.repeat) return;
      if (event.code !== "Space" && event.key !== " ") return;
      if (
        event.target?.closest?.(
          "[data-mudek-introduction-dialogue], a, input, textarea, select",
        )
      ) {
        return;
      }

      event.preventDefault();
      advanceDialogue();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [active, advanceDialogue]);

  return (
    <div className="absolute inset-0">
      <audio ref={introOneAudioRef} src={introOneAudio} preload="auto" />
      <audio ref={introTwoAudioRef} src={introTwoAudio} preload="auto" />
      <audio ref={introThreeAudioRef} src={introThreeAudio} preload="auto" />

      <div className="pointer-events-none absolute bottom-[8px] left-[14px] h-[500px] w-[334px]">
        <div
          className={`absolute inset-0 ${isTyping ? "" : "avatar-idle"}`}
          style={
            isTyping
              ? {
                  transform: talkingFrame.transform,
                  transformOrigin: "center bottom",
                }
              : undefined
          }
        >
          <Avatar
            avatar={MUDEK}
            alt={isTyping ? "MUDEK hablando" : "MUDEK"}
            className="h-full w-full"
          />
          {isTyping && (
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

      <button
        type="button"
        data-stage-interactive
        data-mudek-introduction-dialogue
        onClick={advanceDialogue}
        className="absolute left-[360px] right-[28px] top-[38px] z-30 flex max-h-[470px] cursor-pointer flex-col gap-[9px] border-[5px] border-[#f0ca63] bg-[#101725] px-[15px] py-[12px] text-left text-white shadow-[0_8px_0_#080d16,0_12px_24px_#000000b8] ring-4 ring-[#35d8ff]/80 transition-colors hover:border-[#fff3bd] active:translate-y-[3px] active:shadow-[0_5px_0_#080d16,0_9px_18px_#000000b8] focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-white"
      >
        <span className="flex w-full items-center justify-between gap-[8px] border-b-2 border-[#40566d] pb-[7px] font-pixel text-[7px] leading-[1.7]">
          <span className="flex items-center gap-[9px]">
            <span className="border-2 border-[#101725] bg-[#35d8ff] px-[7px] py-[4px] text-[#101725] shadow-[2px_2px_0_#14768b]">
              MUDEK
            </span>
            <span className="text-[#9fe8f4]">BIENVENIDA AL RECORRIDO</span>
          </span>
          <span className="shrink-0 border-2 border-[#7a5c2e] bg-[#f0ca63] px-[7px] py-[4px] text-[#211922] shadow-[2px_2px_0_#080d16]">
            {String(messageIndex + 1).padStart(2, "0")} / 03
          </span>
        </span>

        <span className="block w-full border-l-[4px] border-[#35d8ff] px-[11px] py-[7px] font-pixel text-[8px] leading-[1.9] text-white [text-shadow:1px_1px_0_#080d16]">
          {visibleText}
          {isTyping && <span className="ml-[2px] text-[#f0ca63]">▌</span>}
        </span>

        <span className="flex w-full items-center justify-between gap-[8px] border-t-2 border-[#40566d] pt-[7px] font-pixel text-[7px] leading-[1.7]">
          <span className={isTyping ? "text-[#9fe8f4]" : "text-[#ffe6b8]"}>
            {isTyping
              ? "ESPACIO O CLIC: MOSTRAR TODO"
              : isLastMessage
                ? "ESPACIO O CLIC: IR AL MAPA"
                : "ESPACIO O CLIC: CONTINUAR"}
          </span>
          <span aria-hidden="true" className="shrink-0 text-[#f0ca63]">
            ▼
          </span>
        </span>

        <span
          aria-hidden="true"
          className="pointer-events-none absolute -left-[16px] top-[108px] h-0 w-0 border-y-[13px] border-y-transparent border-r-[16px] border-r-[#f0ca63]"
        />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -left-[9px] top-[113px] h-0 w-0 border-y-[8px] border-y-transparent border-r-[10px] border-r-[#101725]"
        />
      </button>
    </div>
  );
}
