import { useCallback, useEffect, useRef, useState } from "react";
import Avatar from "../components/Avatar.jsx";
import { MUDEK } from "../data/avatars.js";
import { MUDEK_ANIMATIONS } from "../data/mudekAnimations.js";
import {
  NODE_4_FLOW_OPTIONS,
  NODE_4_INITIAL_DIALOGUE,
  NODE_4_QUIZ,
  NODE_4_READING_BLOCKS,
  NODE_4_TERMS,
} from "../data/nodo4.js";
import nodeFourIntroAudio from "../assets/audio/Nodo-4-1.mp3";
import fuzzingBugImage from "../assets/illustrations/pixel-bug.png";
import pythonLogo from "../assets/illustrations/python-logo-notext.svg";

const PASSING_GRADE = 5.0;
const TYPEWRITER_CHARACTER_DELAY = 50;
const TYPEWRITER_PAUSE_DELAY = 110;
const TALKING_ANIMATION = MUDEK_ANIMATIONS.hablar;
const TERM_IDS = NODE_4_TERMS.map((term) => term.id);

function ControlHeader({ step, stepNumber, title, titleId, titleRef }) {
  return (
    <header className="mb-[8px] flex min-h-[52px] shrink-0 items-center justify-between gap-[10px] border-b-4 border-[#35d8ff] bg-[#17263a] px-[11px] py-[7px] shadow-[inset_0_2px_0_#2c4965]">
      <div className="flex min-w-0 items-center gap-[10px]">
        <span className="grid size-[34px] shrink-0 place-items-center border-2 border-[#080d16] bg-[#35d8ff] font-pixel text-[10px] text-[#101725] shadow-[3px_3px_0_#080d16]">
          04
        </span>
        <div className="min-w-0">
          <p className="font-pixel text-[6px] leading-[1.6] text-[#9fe8f4]">
            CENTRO DE CONTROL DE AGENTES · {step}
          </p>
          <h1
            ref={titleRef}
            id={titleId}
            tabIndex={-1}
            className="font-pixel text-[9px] leading-[1.7] text-[#fff3bd] [text-shadow:2px_2px_0_#080d16] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#35d8ff]"
          >
            {title}
          </h1>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-[7px] border-2 border-[#40566d] bg-[#101725] px-[8px] py-[6px]">
        <div>
          <p className="text-right font-pixel text-[6px] leading-[1.5] text-[#e5e7eb]">
            PROGRESO
          </p>
          <p className="text-right font-pixel text-[7px] leading-[1.5] text-[#f0ca63]">
            {String(stepNumber).padStart(2, "0")} / 02
          </p>
        </div>
        <div className="flex gap-[3px]" aria-hidden="true">
          {[0, 1].map((index) => (
            <span
              key={index}
              className={`h-[9px] w-[17px] border border-[#080d16] ${index < stepNumber ? "bg-[#35d8ff] shadow-[inset_0_0_0_2px_#14768b]" : "bg-[#344354]"}`}
            />
          ))}
        </div>
      </div>
    </header>
  );
}

function TermButton({ term, viewed, onOpen }) {
  return (
    <button
      type="button"
      data-stage-interactive
      aria-label={`Abrir término: ${term.title}${viewed ? ". Ya consultado" : ""}`}
      aria-haspopup="dialog"
      onClick={(event) => onOpen(term.id, event)}
      className={`flex min-h-[60px] min-w-0 items-center gap-[9px] border-2 px-[10px] py-[8px] text-left font-pixel text-[10px] leading-[1.6] transition-colors hover:border-white active:translate-y-[2px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white ${viewed ? "border-[#35d8ff] bg-[#153141] text-[#c1f4ff]" : "border-[#8b7040] bg-[#352d24] text-[#ffe6b8]"}`}
    >
      <span className="grid size-[30px] shrink-0 place-items-center border-2 border-[#101725] bg-[#f0ca63] font-pixel text-[12px] leading-none text-[#101725] shadow-[2px_2px_0_#080d16]">
        {viewed ? "✓" : "+"}
      </span>
      <span className="min-w-0">{term.label}</span>
    </button>
  );
}

function ReadingView({ viewedTermIds, onOpenTerm, onBeginQuiz }) {
  const readingTitleRef = useRef(null);
  const allTermsViewed = TERM_IDS.every((id) => viewedTermIds.includes(id));
  const isViewed = (id) => viewedTermIds.includes(id);

  useEffect(() => {
    readingTitleRef.current?.focus();
  }, []);

  return (
    <section
      data-stage-interactive
      aria-labelledby="node-4-reading-title"
      className="absolute inset-[18px] z-20 flex flex-col border-[5px] border-[#f0ca63] bg-[#101725] p-[11px] text-white shadow-[0_8px_0_#080d16,0_12px_24px_#000000b8] ring-4 ring-[#35d8ff]/80"
    >
      <ControlHeader
        step="LECTURA · BLOQUES A + B"
        stepNumber={1}
        title="FLUJOS DE TRABAJO Y AUTONOMÍA"
        titleId="node-4-reading-title"
        titleRef={readingTitleRef}
      />

      <div className="grid min-h-0 flex-1 grid-cols-2 gap-[9px]">
        {NODE_4_READING_BLOCKS.map((block) => (
          <article
            key={block.id}
            aria-labelledby={`node-4-block-${block.id}-title`}
            className="flex min-h-0 flex-col border-2 border-[#52616a] bg-[#17263a] p-[9px] shadow-[inset_0_2px_0_#2c4965]"
          >
            <header className="flex shrink-0 items-center gap-[8px] border-b border-[#40566d] pb-[7px]">
              <span className="grid size-[28px] shrink-0 place-items-center border-2 border-[#7a5c2e] bg-[#f0ca63] font-pixel text-[10px] text-[#101725] shadow-[2px_2px_0_#080d16]">
                {block.marker}
              </span>
              <div className="min-w-0">
                <p className="font-pixel text-[6px] leading-[1.6] text-[#35d8ff]">
                  {block.eyebrow}
                </p>
                <h2
                  id={`node-4-block-${block.id}-title`}
                  className="font-pixel text-[7px] leading-[1.7] text-[#fff3bd]"
                >
                  {block.title}
                </h2>
              </div>
            </header>

            <p className="mt-[8px] font-pixel text-[7px] leading-[1.85] text-white">
              {block.text}
            </p>

            {block.flowLabels && (
              <div className="mt-[9px] border-2 border-[#40566d] bg-[#101725] px-[6px] py-[7px]">
                <p className="mb-[5px] font-pixel text-[5px] leading-[1.6] text-[#9fe8f4]">
                  CICLO DE ACCIÓN
                </p>
                <div
                  role="img"
                  aria-label="Ciclo: observar, decidir, actuar y observar el resultado"
                  className="flex items-center justify-between gap-[3px]"
                >
                  {block.flowLabels.map((label, index) => (
                    <span key={`${label}-${index}`} className="contents">
                      <span className="grid min-h-[26px] flex-1 place-items-center border border-[#35d8ff] bg-[#153141] px-[3px] text-center font-pixel text-[5px] leading-[1.5] text-[#c1f4ff]">
                        {label}
                      </span>
                      {index < block.flowLabels.length - 1 && (
                        <span
                          aria-hidden="true"
                          className="font-pixel text-[7px] text-[#f0ca63]"
                        >
                          →
                        </span>
                      )}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {block.evidenceEyebrow && (
              <aside className="mt-auto grid min-h-[108px] grid-cols-[minmax(0,1fr)_96px] items-center gap-[9px] border-l-[3px] border-[#f0ca63] bg-[#101725] px-[9px] py-[8px]">
                <div className="min-w-0">
                  <p className="font-pixel text-[8px] leading-[1.7] text-[#f0ca63]">
                    {block.evidenceEyebrow}
                  </p>
                  <p className="mt-[5px] font-pixel text-[7px] leading-[1.75] text-[#e5e7eb]">
                    {block.evidenceText}
                  </p>
                </div>
                <img
                  src={fuzzingBugImage}
                  alt="Un error de software representado como un insecto pixelado."
                  draggable={false}
                  className="size-[88px] border-2 border-[#080d16] bg-[#f0ca63] object-contain p-[5px] shadow-[3px_3px_0_#080d16] [image-rendering:pixelated]"
                />
              </aside>
            )}

            {block.evidence && (
              <div className="mt-[7px] flex min-h-0 flex-1 flex-col gap-[5px]">
                {block.evidence.map((item) => (
                  <aside
                    key={item.eyebrow}
                    className={`flex min-h-0 flex-1 border-l-[3px] border-[#35d8ff] bg-[#101725] px-[7px] py-[5px] ${item.logo ? "items-center gap-[8px]" : "flex-col justify-center"}`}
                  >
                    <div className="min-w-0 flex-1">
                      <p className="font-pixel text-[5px] leading-[1.5] text-[#9fe8f4]">
                        {item.eyebrow}
                      </p>
                      <p className="mt-[3px] font-pixel text-[6px] leading-[1.65] text-[#e5e7eb]">
                        {item.text}
                      </p>
                    </div>
                    {item.logo === "python" && (
                      <div
                        role="img"
                        aria-label="Logotipo de Python, marca de Python Software Foundation."
                        className="flex h-[48px] w-[54px] shrink-0 items-center justify-center gap-[1px] border-2 border-[#080d16] bg-[#fff3bd] px-[3px] shadow-[2px_2px_0_#080d16]"
                      >
                        <img
                          src={pythonLogo}
                          alt=""
                          aria-hidden="true"
                          draggable={false}
                          className="size-[34px] object-contain"
                        />
                        <span
                          aria-hidden="true"
                          className="font-pixel text-[6px] text-[#101725]"
                        >
                          ™
                        </span>
                      </div>
                    )}
                  </aside>
                ))}
              </div>
            )}
          </article>
        ))}
      </div>

      <div
        role="group"
        aria-label="Términos clave del Centro de Control"
        className="mt-[8px] grid shrink-0 grid-cols-4 gap-[7px]"
      >
        {NODE_4_TERMS.map((term) => (
          <TermButton
            key={term.id}
            term={term}
            viewed={isViewed(term.id)}
            onOpen={onOpenTerm}
          />
        ))}
      </div>

      <footer className="mt-[7px] flex min-h-[44px] shrink-0 items-center justify-between gap-[10px] border-t-4 border-[#35d8ff] bg-[#17263a] px-[9px] py-[5px] shadow-[inset_0_2px_0_#2c4965]">
        <p
          id="node-4-glossary-status"
          aria-live="polite"
          className="font-pixel text-[7px] leading-[1.7] text-[#9fe8f4]"
        >
          TÉRMINOS CONSULTADOS: {viewedTermIds.length} / {NODE_4_TERMS.length}
        </p>
        <button
          type="button"
          data-stage-interactive
          aria-describedby={!allTermsViewed ? "node-4-glossary-status" : undefined}
          disabled={!allTermsViewed}
          onClick={onBeginQuiz}
          className={`min-h-[40px] border-2 border-[#080d16] px-[10px] py-[5px] font-pixel text-[7px] leading-[1.5] shadow-[0_3px_0_#080d16] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white ${allTermsViewed ? "bg-[#f0ca63] text-[#101725] hover:bg-[#fff3bd] active:translate-y-[2px] active:shadow-[0_1px_0_#080d16]" : "cursor-not-allowed bg-[#59606a] text-[#c8cdd2] opacity-80"}`}
        >
          {allTermsViewed ? "IR A LOS ESCENARIOS →" : "CONSULTA LOS «+»"}
        </button>
      </footer>
    </section>
  );
}

function QuizView({ answers, questionResults, statusMessage, onSelectAnswer, onCheck }) {
  const quizTitleRef = useRef(null);
  const answeredCount = NODE_4_QUIZ.filter(
    (scenario) => answers[scenario.id] !== undefined,
  ).length;
  const correctCount = NODE_4_QUIZ.filter(
    (scenario) => questionResults[scenario.id] === "correct",
  ).length;

  useEffect(() => {
    quizTitleRef.current?.focus();
  }, []);

  return (
    <section
      data-stage-interactive
      aria-labelledby="node-4-quiz-title"
      className="absolute inset-[18px] z-20 flex flex-col border-[5px] border-[#f0ca63] bg-[#101725] p-[11px] text-white shadow-[0_8px_0_#080d16,0_12px_24px_#000000b8] ring-4 ring-[#35d8ff]/80"
    >
      <ControlHeader
        step="RETO · EVALUACIÓN"
        stepNumber={2}
        title="ELIGE EL FLUJO MÁS ADECUADO"
        titleId="node-4-quiz-title"
        titleRef={quizTitleRef}
      />

      <div className="mb-[7px] flex min-h-[34px] shrink-0 items-center justify-between gap-[8px] border-2 border-[#40566d] bg-[#17263a] px-[9px] py-[5px]">
        <p className="font-pixel text-[6px] leading-[1.7] text-[#e5e7eb]">
          Elige A, B o C con clic o Tab + Enter/Espacio. Necesitas 3 aciertos para obtener 5.0.
        </p>
        <span className="shrink-0 font-pixel text-[6px] leading-[1.5] text-[#f0ca63]">
          {correctCount} / 3 CORRECTAS
        </span>
      </div>

      <ol
        aria-label="Escenarios sobre orquestación y autonomía de agentes"
        className="flex min-h-0 flex-1 flex-col gap-[7px]"
      >
        {NODE_4_QUIZ.map((scenario, index) => {
          const result = questionResults[scenario.id];
          const isLocked = result === "correct";

          return (
            <li key={scenario.id} className="min-h-0 flex-1">
              <article
                aria-labelledby={`node-4-scenario-${scenario.id}-prompt`}
                className={`grid h-full min-h-0 grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] grid-rows-[minmax(0,1fr)_auto] gap-x-[9px] gap-y-[3px] border-2 p-[7px] shadow-[inset_0_2px_0_#2c4965] ${isLocked ? "border-[#35d8ff] bg-[#142f3a]" : "border-[#52616a] bg-[#17263a]"}`}
              >
                <div className="min-w-0 self-center">
                  <p className="mb-[4px] font-pixel text-[5px] leading-[1.5] text-[#9fe8f4]">
                    ESCENARIO {String(index + 1).padStart(2, "0")}
                  </p>
                  <p
                    id={`node-4-scenario-${scenario.id}-prompt`}
                    className="font-pixel text-[7px] leading-[1.8] text-white"
                  >
                    {scenario.prompt}
                  </p>
                </div>

                <div
                  role="group"
                  aria-label={`Tipo de flujo para el escenario ${index + 1}`}
                  aria-describedby={result ? `node-4-feedback-${scenario.id}` : undefined}
                  className="row-span-2 grid grid-cols-3 items-center gap-[5px]"
                >
                  {NODE_4_FLOW_OPTIONS.map((option) => {
                    const isSelected = answers[scenario.id] === option.id;
                    const stateIcon =
                      result === "correct" && isSelected
                        ? "✓"
                        : isSelected
                          ? "▣"
                          : "□";

                    return (
                      <button
                        key={option.id}
                        type="button"
                        data-stage-interactive
                        aria-pressed={isSelected}
                        aria-label={`${option.id}: ${option.label}. ${option.detail}`}
                        disabled={isLocked}
                        onClick={() => onSelectAnswer(scenario.id, option.id)}
                        className={`flex min-h-[58px] min-w-0 flex-col items-start justify-center border-2 px-[5px] py-[5px] text-left font-pixel text-[6px] leading-[1.55] shadow-[0_3px_0_#080d16] transition-colors hover:border-white active:translate-y-[2px] active:shadow-[0_1px_0_#080d16] disabled:cursor-not-allowed disabled:opacity-80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white ${isSelected ? (result === "incorrect" ? "border-[#f0ca63] bg-[#42351e] text-[#fff3bd] ring-2 ring-[#f0ca63]/50" : "border-[#35d8ff] bg-[#164257] text-white ring-2 ring-[#35d8ff]/60") : "border-[#52616a] bg-[#101725] text-[#d8e1e5]"}`}
                      >
                        <span className="text-[7px] text-[#f0ca63]">
                          {stateIcon} {option.id} · {option.label}
                        </span>
                        <span className="mt-[3px] text-[#cbd5df]">
                          {option.detail}
                        </span>
                      </button>
                    );
                  })}
                </div>

                <div
                  id={`node-4-feedback-${scenario.id}`}
                  aria-live="polite"
                  className="min-w-0 self-end"
                >
                  {result && (
                    <p
                      className={`font-pixel text-[6px] leading-[1.55] ${result === "correct" ? "text-[#9fe8f4]" : result === "incorrect" ? "text-[#ffd18c]" : "text-[#d8e1e5]"}`}
                    >
                      <strong>
                        {result === "correct"
                          ? "CORRECTO · "
                          : result === "incorrect"
                            ? "REVISA LA PISTA · "
                            : "PENDIENTE · "}
                      </strong>
                      {result === "correct"
                        ? scenario.correctFeedback
                        : result === "incorrect"
                          ? scenario.incorrectFeedback
                          : "Selecciona un flujo para este escenario."}
                    </p>
                  )}
                </div>
              </article>
            </li>
          );
        })}
      </ol>

      <footer className="mt-[7px] flex min-h-[44px] shrink-0 items-center justify-between gap-[9px] border-t-4 border-[#35d8ff] bg-[#17263a] px-[9px] py-[5px] shadow-[inset_0_2px_0_#2c4965]">
        <p
          aria-live="polite"
          className="min-w-0 font-pixel text-[6px] leading-[1.7] text-[#ffe6b8]"
        >
          {statusMessage || `${answeredCount} / 3 seleccionadas. Revisa tus elecciones antes de comprobar.`}
        </p>
        <button
          type="button"
          data-stage-interactive
          onClick={onCheck}
          className="min-h-[36px] shrink-0 border-2 border-[#080d16] bg-[#f0ca63] px-[10px] py-[5px] font-pixel text-[6px] leading-[1.5] text-[#101725] shadow-[0_3px_0_#080d16] transition-colors hover:bg-[#fff3bd] active:translate-y-[2px] active:shadow-[0_1px_0_#080d16] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        >
          COMPROBAR
        </button>
      </footer>
    </section>
  );
}

function SuccessView({ onExit }) {
  const successTitleRef = useRef(null);

  useEffect(() => {
    successTitleRef.current?.focus();
  }, []);

  return (
    <section
      data-stage-interactive
      aria-labelledby="node-4-success-title"
      className="absolute inset-[18px] z-20 flex flex-col border-[5px] border-[#f0ca63] bg-[#101725] p-[12px] text-white shadow-[0_8px_0_#080d16,0_12px_24px_#000000b8] ring-4 ring-[#35d8ff]/80"
    >
      <ControlHeader
        step="RETO COMPLETADO"
        stepNumber={2}
        title="CENTRO DE CONTROL · ESTABLE"
        titleId="node-4-success-title"
        titleRef={successTitleRef}
      />

      <div className="flex min-h-0 flex-1 items-center justify-center px-[12px] py-[9px]">
        <div className="w-full max-w-[710px] border-[4px] border-[#35d8ff] bg-[#17263a] p-[17px] text-center shadow-[0_7px_0_#080d16,0_11px_0_#f0ca63]">
          <div className="mb-[10px] inline-flex items-center gap-[7px] border-2 border-[#7a5c2e] bg-[#352b24] px-[9px] py-[6px] font-pixel text-[6px] leading-[1.5] text-[#f0ca63]">
            <span aria-hidden="true">★</span>
            3 / 3 ESCENARIOS CORRECTOS
            <span aria-hidden="true">★</span>
          </div>
          <h2 className="font-pixel text-[12px] leading-[1.8] text-[#fff3bd] [text-shadow:2px_2px_0_#080d16]">
            ¡BUENA DECISIÓN!
          </h2>
          <p className="mx-auto mt-[9px] max-w-[560px] font-pixel text-[7px] leading-[2] text-white">
            Has elegido un flujo adecuado para cada tarea, considerando autonomía,
            validación, riesgo y costo.
          </p>

          <div className="mx-auto mt-[13px] max-w-[260px] border-2 border-[#f0ca63] bg-[#101725] px-[12px] py-[9px]">
            <p className="font-pixel text-[6px] leading-[1.6] text-[#9fe8f4]">
              CALIFICACIÓN DEL MÓDULO
            </p>
            <p className="mt-[5px] font-pixel text-[13px] leading-[1.5] text-[#f0ca63]">
              {PASSING_GRADE.toFixed(1)} / 5.0
            </p>
          </div>

          <button
            type="button"
            data-stage-interactive
            onClick={onExit}
            className="mt-[14px] min-h-[42px] border-2 border-[#080d16] bg-[#f0ca63] px-[16px] py-[8px] font-pixel text-[7px] leading-[1.5] text-[#101725] shadow-[0_4px_0_#080d16] transition-colors hover:bg-[#fff3bd] active:translate-y-[3px] active:shadow-[0_1px_0_#080d16] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            VOLVER AL MAPA
          </button>
          <p className="mt-[7px] font-pixel text-[5px] leading-[1.5] text-[#9fe8f4]">
            CLIC O ESPACIO PARA CONTINUAR
          </p>
        </div>
      </div>
    </section>
  );
}

function TermDialog({ term, closeButtonRef, dialogRef, onClose, onBackdropClick }) {
  return (
    <div
      data-stage-interactive
      className="absolute inset-0 z-[70] grid place-items-center bg-[#080d16]/95 p-[20px]"
      onClick={onBackdropClick}
    >
      <section
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="node-4-term-title"
        aria-describedby="node-4-term-description"
        className="flex max-h-full w-full max-w-[900px] flex-col border-[5px] border-[#f0ca63] bg-[#101725] p-[18px] text-white shadow-[0_8px_0_#080d16,0_12px_24px_#000000b8] ring-4 ring-[#35d8ff]"
      >
        <header className="flex items-center justify-between gap-[10px] border-b-4 border-[#35d8ff] bg-[#17263a] px-[14px] py-[11px]">
          <span className="font-pixel text-[9px] leading-[1.7] text-[#9fe8f4]">
            GLOSARIO
          </span>
          <span className="border-2 border-[#7a5c2e] bg-[#f0ca63] px-[8px] py-[5px] font-pixel text-[8px] text-[#101725]">
            CONCEPTO
          </span>
        </header>
        <h2
          id="node-4-term-title"
          className="mt-[18px] font-pixel text-[19px] leading-[1.7] text-[#fff3bd] [text-shadow:2px_2px_0_#080d16]"
        >
          {term.title}
        </h2>
        <div className="mt-[14px] border-l-[6px] border-[#35d8ff] bg-[#17263a] px-[20px] py-[17px]">
          <p className="mb-[9px] font-pixel text-[8px] leading-[1.7] text-[#9fe8f4]">
            IDEA CLAVE
          </p>
          <p
            id="node-4-term-description"
            className="font-pixel text-[16px] leading-[1.9] text-white [text-shadow:1px_1px_0_#080d16]"
          >
            {term.body}
          </p>
          {term.citation && (
            <p className="mt-[12px] border-t border-[#40566d] pt-[9px] font-pixel text-[8px] leading-[1.7] text-[#b8dce5]">
              FUENTE · {term.citation}
            </p>
          )}
        </div>
        <footer className="mt-[16px] flex items-center justify-between gap-[10px] border-t-2 border-[#40566d] pt-[12px]">
          <span className="font-pixel text-[8px] leading-[1.7] text-[#9fe8f4]">
            ESC PARA CERRAR
          </span>
          <button
            ref={closeButtonRef}
            type="button"
            data-stage-interactive
            onClick={onClose}
            className="min-h-[48px] border-2 border-[#080d16] bg-[#f0ca63] px-[16px] py-[9px] font-pixel text-[9px] leading-[1.5] text-[#101725] shadow-[0_3px_0_#080d16] hover:bg-[#fff3bd] active:translate-y-[2px] active:shadow-[0_1px_0_#080d16] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            CERRAR
          </button>
        </footer>
      </section>
    </div>
  );
}

export default function Nodo4({ active, onComplete, onExit }) {
  const [phase, setPhase] = useState("welcome");
  const [visibleCharacters, setVisibleCharacters] = useState(0);
  const [talkingFrameIndex, setTalkingFrameIndex] = useState(0);
  const [viewedTermIds, setViewedTermIds] = useState([]);
  const [selectedTermId, setSelectedTermId] = useState(null);
  const [answers, setAnswers] = useState({});
  const [questionResults, setQuestionResults] = useState({});
  const [statusMessage, setStatusMessage] = useState("");
  const welcomeAudioRef = useRef(null);
  const welcomeButtonRef = useRef(null);
  const closeTermButtonRef = useRef(null);
  const termDialogRef = useRef(null);
  const termTriggerRef = useRef(null);
  const restoreTermFocusRef = useRef(false);
  const completionReportedRef = useRef(false);

  const isTyping =
    phase === "welcome" && visibleCharacters < NODE_4_INITIAL_DIALOGUE.length;
  const visibleText = NODE_4_INITIAL_DIALOGUE.slice(0, visibleCharacters);
  const isSpeaking = active && phase === "welcome" && isTyping;
  const talkingFrame = TALKING_ANIMATION.frames[talkingFrameIndex];
  const selectedTerm = NODE_4_TERMS.find((term) => term.id === selectedTermId);

  const finishTyping = useCallback(() => {
    if (!isTyping) return;

    const audio = welcomeAudioRef.current;
    audio?.pause();
    if (audio) audio.currentTime = 0;
    setVisibleCharacters(NODE_4_INITIAL_DIALOGUE.length);
  }, [isTyping]);

  const advanceWelcome = useCallback(() => {
    if (!active || phase !== "welcome") return;
    if (isTyping) {
      finishTyping();
      return;
    }
    setPhase("reading");
  }, [active, finishTyping, isTyping, phase]);

  const openTerm = useCallback((termId, event) => {
    termTriggerRef.current = event.currentTarget;
    setViewedTermIds((current) =>
      current.includes(termId) ? current : [...current, termId],
    );
    setSelectedTermId(termId);
  }, []);

  const closeTerm = useCallback(() => {
    restoreTermFocusRef.current = true;
    setSelectedTermId(null);
  }, []);

  const selectAnswer = useCallback((scenarioId, answer) => {
    setAnswers((current) => ({ ...current, [scenarioId]: answer }));
    setQuestionResults((current) => ({ ...current, [scenarioId]: null }));
    setStatusMessage("");
  }, []);

  const checkAnswers = useCallback(() => {
    if (!active || phase !== "quiz") return;

    const nextResults = Object.fromEntries(
      NODE_4_QUIZ.map((scenario) => {
        if (questionResults[scenario.id] === "correct") {
          return [scenario.id, "correct"];
        }

        const answer = answers[scenario.id];
        if (answer === undefined) return [scenario.id, "unanswered"];
        return [
          scenario.id,
          answer === scenario.correctAnswer ? "correct" : "incorrect",
        ];
      }),
    );
    const correctCount = Object.values(nextResults).filter(
      (result) => result === "correct",
    ).length;

    setQuestionResults(nextResults);

    if (correctCount === NODE_4_QUIZ.length) {
      setStatusMessage("¡3 DE 3 CORRECTAS! CALIFICACIÓN: 5.0 / 5.0.");
      setPhase("success");
      if (!completionReportedRef.current) {
        completionReportedRef.current = true;
        onComplete?.(4, PASSING_GRADE);
      }
      return;
    }

    const unansweredCount = Object.values(nextResults).filter(
      (result) => result === "unanswered",
    ).length;
    setStatusMessage(
      unansweredCount > 0
        ? `${unansweredCount === 1 ? "Responde el escenario pendiente" : `Responde los ${unansweredCount} escenarios pendientes`}. ${correctCount} de 3 correctos.`
        : `${correctCount} de 3 correctos. Revisa las pistas e inténtalo otra vez.`,
    );
  }, [active, answers, onComplete, phase, questionResults]);

  const continueFromSuccess = useCallback(() => {
    if (!active || phase !== "success") return;
    onExit?.();
  }, [active, onExit, phase]);

  useEffect(() => {
    if (active) return;

    setPhase("welcome");
    setVisibleCharacters(0);
    setTalkingFrameIndex(0);
    setViewedTermIds([]);
    setSelectedTermId(null);
    setAnswers({});
    setQuestionResults({});
    setStatusMessage("");
    completionReportedRef.current = false;
    restoreTermFocusRef.current = false;
  }, [active]);

  useEffect(() => {
    const audio = welcomeAudioRef.current;
    if (!active || phase !== "welcome" || !audio) return undefined;

    audio.currentTime = 0;
    const playback = audio.play();
    playback?.catch(() => {
      // El navegador puede bloquear la reproducción automática.
    });

    return () => {
      audio.pause();
      audio.currentTime = 0;
    };
  }, [active, phase]);

  useEffect(() => {
    if (!active || phase !== "welcome" || !isTyping) return undefined;

    const previousCharacter = NODE_4_INITIAL_DIALOGUE[visibleCharacters - 1];
    const delay = /[.!?,;:]/.test(previousCharacter ?? "")
      ? TYPEWRITER_PAUSE_DELAY
      : TYPEWRITER_CHARACTER_DELAY;
    const timer = window.setTimeout(() => {
      setVisibleCharacters((current) =>
        Math.min(current + 1, NODE_4_INITIAL_DIALOGUE.length),
      );
    }, delay);

    return () => window.clearTimeout(timer);
  }, [active, isTyping, phase, visibleCharacters]);

  useEffect(() => {
    if (
      !isSpeaking ||
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
  }, [isSpeaking]);

  useEffect(() => {
    if (!active || phase !== "welcome") return undefined;

    welcomeButtonRef.current?.focus();

    const onKeyDown = (event) => {
      if (event.defaultPrevented || event.repeat) return;
      if (event.code !== "Space" && event.key !== " ") return;
      if (event.target?.closest?.("button, a, input, textarea, select")) return;

      event.preventDefault();
      advanceWelcome();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [active, advanceWelcome, phase]);

  useEffect(() => {
    if (selectedTerm) {
      closeTermButtonRef.current?.focus();

      const onKeyDown = (event) => {
        if (event.key === "Escape") {
          event.preventDefault();
          closeTerm();
          return;
        }

        if (event.key !== "Tab") return;
        const buttons = termDialogRef.current?.querySelectorAll(
          'button:not([disabled])',
        );
        if (!buttons?.length) return;

        const first = buttons[0];
        const last = buttons[buttons.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      };

      window.addEventListener("keydown", onKeyDown);
      return () => window.removeEventListener("keydown", onKeyDown);
    }

    if (restoreTermFocusRef.current) {
      termTriggerRef.current?.focus();
      restoreTermFocusRef.current = false;
    }
    return undefined;
  }, [closeTerm, selectedTerm]);

  useEffect(() => {
    if (!active || phase !== "success") return undefined;

    const onKeyDown = (event) => {
      if (event.defaultPrevented || event.repeat) return;
      if (event.code !== "Space" && event.key !== " ") return;
      if (event.target?.closest?.("button, a, input, textarea, select")) return;

      event.preventDefault();
      continueFromSuccess();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [active, continueFromSuccess, phase]);

  if (!active) return null;

  return (
    <div data-stage-interactive className="absolute inset-0">
      <audio ref={welcomeAudioRef} src={nodeFourIntroAudio} preload="auto" />

      {phase === "welcome" && (
        <>
          <div className="pointer-events-none absolute bottom-[25px] left-[88px] z-20 h-[248px] w-[160px]">
            <div
              className={`absolute inset-0 ${isSpeaking ? "" : "avatar-idle"}`}
              style={{
                transform: isSpeaking ? talkingFrame.transform : undefined,
                transformOrigin: "center bottom",
                filter:
                  "drop-shadow(0 0 5px #35d8ff) drop-shadow(0 0 12px #35d8ff)",
              }}
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

          <button
            ref={welcomeButtonRef}
            type="button"
            data-stage-interactive
            onClick={advanceWelcome}
            className="absolute left-[24px] right-[24px] top-[18px] z-30 flex max-h-[300px] cursor-pointer flex-col gap-[8px] border-[5px] border-[#f0ca63] bg-[#101725] px-[15px] py-[10px] text-left text-white shadow-[0_8px_0_#080d16,0_12px_24px_#000000b8] ring-4 ring-[#35d8ff]/80 transition-colors hover:border-[#fff3bd] active:translate-y-[3px] active:shadow-[0_5px_0_#080d16,0_9px_18px_#000000b8] focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-white"
          >
            <span className="flex w-full items-center justify-between gap-[8px] border-b-2 border-[#40566d] pb-[6px] font-pixel text-[7px] leading-[1.7]">
              <span className="flex items-center gap-[9px]">
                <span className="border-2 border-[#101725] bg-[#35d8ff] px-[7px] py-[4px] text-[#101725] shadow-[2px_2px_0_#14768b]">
                  MUDEK
                </span>
                <span className="text-[#9fe8f4]">CENTRO DE CONTROL</span>
              </span>
              <span className="shrink-0 border-2 border-[#7a5c2e] bg-[#f0ca63] px-[7px] py-[4px] text-[#211922] shadow-[2px_2px_0_#080d16]">
                01 / 01
              </span>
            </span>

            <span className="block w-full whitespace-pre-line border-l-[4px] border-[#35d8ff] px-[11px] py-[7px] font-pixel text-[8px] leading-[1.9] text-white [text-shadow:1px_1px_0_#080d16]">
              {visibleText}
              {isTyping && <span className="ml-[2px] text-[#f0ca63]">▌</span>}
            </span>

            <span className="flex w-full items-center justify-between gap-[8px] border-t-2 border-[#40566d] pt-[6px] font-pixel text-[7px] leading-[1.7]">
              <span className={isTyping ? "text-[#9fe8f4]" : "text-[#ffe6b8]"}>
                {isTyping
                  ? "ESPACIO O CLIC: MOSTRAR TODO"
                  : "ESPACIO O CLIC: ABRIR EL CENTRO"}
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
        </>
      )}

      {phase === "reading" && (
        <ReadingView
          viewedTermIds={viewedTermIds}
          onOpenTerm={openTerm}
          onBeginQuiz={() => setPhase("quiz")}
        />
      )}

      {phase === "quiz" && (
        <QuizView
          answers={answers}
          questionResults={questionResults}
          statusMessage={statusMessage}
          onSelectAnswer={selectAnswer}
          onCheck={checkAnswers}
        />
      )}

      {phase === "success" && <SuccessView onExit={continueFromSuccess} />}

      {selectedTerm && (
        <TermDialog
          term={selectedTerm}
          closeButtonRef={closeTermButtonRef}
          dialogRef={termDialogRef}
          onClose={closeTerm}
          onBackdropClick={(event) => {
            if (event.target === event.currentTarget) closeTerm();
          }}
        />
      )}
    </div>
  );
}
