import { useCallback, useEffect, useRef, useState } from "react";
import Avatar from "../components/Avatar.jsx";
import { MUDEK } from "../data/avatars.js";
import { MUDEK_ANIMATIONS } from "../data/mudekAnimations.js";
import {
  NODE_6_INITIAL_DIALOGUE,
  NODE_6_OPTIONS,
  NODE_6_READING_BLOCKS,
  NODE_6_TERMS,
} from "../data/nodo6.js";
import nodeSixIntroAudio from "../assets/audio/Nodo-6-1.mp3";

const PASSING_GRADE = 5.0;
const TOTAL_FLOW_STEPS = 3;
const TYPEWRITER_CHARACTER_DELAY = 50;
const TYPEWRITER_PAUSE_DELAY = 110;
const TALKING_ANIMATION = MUDEK_ANIMATIONS.hablar;
const SECTION_TERM_IDS = [
  ["sandbox", "virtual-real-gap"],
  ["validation-gap", "calibrated-supervision"],
];

function Node6Header({ step, stepNumber, title, titleId, titleRef }) {
  return (
    <header className="mb-[9px] flex min-h-[54px] shrink-0 items-center justify-between gap-[12px] border-b-4 border-[#35d8ff] bg-[#17263a] px-[12px] py-[8px] shadow-[inset_0_2px_0_#2c4965]">
      <div className="flex min-w-0 items-center gap-[10px]">
        <span className="grid size-[34px] shrink-0 place-items-center border-2 border-[#080d16] bg-[#35d8ff] font-pixel text-[10px] text-[#101725] shadow-[3px_3px_0_#080d16]">
          06
        </span>
        <div className="min-w-0">
          <p className="font-pixel text-[7px] leading-[1.6] text-[#9fe8f4]">
            BASE DE PRUEBAS · {step}
          </p>
          <h1
            ref={titleRef}
            id={titleId}
            tabIndex={-1}
            className="font-pixel text-[10px] leading-[1.6] text-[#fff3bd] [text-shadow:2px_2px_0_#080d16] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#35d8ff]"
          >
            {title}
          </h1>
        </div>
      </div>

      <div
        role="group"
        aria-label={`Progreso: paso ${stepNumber} de ${TOTAL_FLOW_STEPS}`}
        className="flex shrink-0 items-center gap-[9px] border-2 border-[#40566d] bg-[#101725] px-[9px] py-[6px]"
      >
        <div>
          <p className="text-right font-pixel text-[6px] leading-[1.5] text-[#e5e7eb]">
            PROGRESO
          </p>
          <p className="text-right font-pixel text-[8px] leading-[1.5] text-[#f0ca63]">
            {String(stepNumber).padStart(2, "0")} / {String(TOTAL_FLOW_STEPS).padStart(2, "0")}
          </p>
        </div>
        <div className="flex gap-[3px]" aria-hidden="true">
          {Array.from({ length: TOTAL_FLOW_STEPS }, (_, index) => (
            <span
              key={index}
              className={`h-[10px] w-[16px] border border-[#080d16] ${index < stepNumber ? "bg-[#35d8ff] shadow-[inset_0_0_0_2px_#14768b]" : "bg-[#344354]"}`}
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
      aria-label={`Abrir concepto: ${term.title}${viewed ? ". Ya consultado" : ""}`}
      aria-haspopup="dialog"
      onClick={(event) => onOpen(term.id, event)}
      className={`flex min-h-[68px] min-w-0 items-center gap-[11px] border-2 px-[12px] py-[10px] text-left font-pixel text-[10px] leading-[1.7] transition-colors hover:border-white active:translate-y-[2px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white ${viewed ? "border-[#35d8ff] bg-[#153141] text-[#c1f4ff]" : "border-[#8b7040] bg-[#352d24] text-[#ffe6b8]"}`}
    >
      <span className="grid size-[34px] shrink-0 place-items-center border-2 border-[#101725] bg-[#f0ca63] font-pixel text-[13px] leading-none text-[#101725] shadow-[2px_2px_0_#080d16]">
        {viewed ? "✓" : "+"}
      </span>
      <span className="min-w-0">{term.label}</span>
    </button>
  );
}

function EvidenceCard({ item }) {
  return (
    <aside className="flex min-h-0 flex-col border-2 border-[#40566d] bg-[#101725] px-[15px] py-[13px] shadow-[inset_0_2px_0_#17263a]">
      <p className="font-pixel text-[8px] leading-[1.6] text-[#9fe8f4]">
        {item.label}
      </p>
      <p className="mt-[8px] font-pixel text-[12px] leading-[1.7] text-[#f0ca63]">
        {item.highlight}
      </p>
      <p className="mt-[8px] font-pixel text-[10px] leading-[1.9] text-white">
        {item.text}
      </p>
    </aside>
  );
}

function ReadingBlock({ block }) {
  return (
    <article
      aria-labelledby={`node-6-block-${block.id}-title`}
      className="flex min-h-0 flex-col border-2 border-[#52616a] bg-[#17263a] p-[17px] shadow-[inset_0_2px_0_#2c4965]"
    >
      <header className="flex shrink-0 items-center gap-[12px] border-b border-[#40566d] pb-[11px]">
        <span className="grid size-[42px] shrink-0 place-items-center border-2 border-[#7a5c2e] bg-[#f0ca63] font-pixel text-[15px] text-[#101725] shadow-[3px_3px_0_#080d16]">
          {block.marker}
        </span>
        <div className="min-w-0">
          <p className="font-pixel text-[8px] leading-[1.7] text-[#35d8ff]">
            {block.eyebrow}
          </p>
          <h2
            id={`node-6-block-${block.id}-title`}
            className="font-pixel text-[13px] leading-[1.8] text-[#fff3bd]"
          >
            {block.title}
          </h2>
        </div>
      </header>

      {block.evidence && (
        <div className="mt-[10px] grid min-h-0 flex-1 grid-cols-2 gap-[10px]">
          <div className="flex min-h-0 flex-col gap-[10px]">
            <p className="font-pixel text-[11px] leading-[2] text-white">
              {block.introduction}
            </p>
            <EvidenceCard item={block.evidence[0]} />
          </div>
          <div className="flex min-h-0 flex-col gap-[10px]">
            <EvidenceCard item={block.evidence[1]} />
            <aside className="border-l-[5px] border-[#f0ca63] bg-[#101725] px-[14px] py-[11px]">
              <p className="font-pixel text-[9px] leading-[1.9] text-[#fff3bd]">
                {block.limitation}
              </p>
            </aside>
          </div>
        </div>
      )}

      {block.guardrailLevels && (
        <div className="mt-[13px] grid min-h-0 flex-1 grid-cols-2 gap-[16px]">
          <div className="flex min-h-0 flex-col">
            <p className="font-pixel text-[10px] leading-[2] text-white">
              {block.introduction}
            </p>
            <div
              role="img"
              aria-label={`Cuatro niveles propuestos de guardrails: ${block.guardrailLevels.join(", ")}`}
              className="mt-[10px] grid grid-cols-4 gap-[5px] border-2 border-[#40566d] bg-[#101725] p-[6px]"
            >
              {block.guardrailLevels.map((level, index) => (
                <div
                  key={level}
                  className="flex min-h-[52px] flex-col items-center justify-center gap-[5px] border border-[#35d8ff] bg-[#153141] px-[3px] py-[5px] text-center"
                >
                  <span className="font-pixel text-[6px] leading-none text-[#f0ca63]">
                    0{index + 1}
                  </span>
                  <span className="font-pixel text-[7px] leading-[1.5] text-[#c1f4ff]">
                    {level}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex min-h-0 flex-col justify-between gap-[12px]">
            <aside className="border-2 border-[#40566d] bg-[#101725] px-[13px] py-[11px]">
              <p className="font-pixel text-[8px] leading-[1.6] text-[#9fe8f4]">
                {block.supervision.label}
              </p>
              <p className="mt-[7px] font-pixel text-[11px] leading-[1.8] text-[#f0ca63]">
                {block.supervision.highlight}
              </p>
              <p className="mt-[7px] font-pixel text-[9px] leading-[1.9] text-white">
                {block.supervision.text}
              </p>
            </aside>
            <aside className="border-l-[5px] border-[#f0ca63] bg-[#101725] px-[13px] py-[10px]">
              <p className="font-pixel text-[8px] leading-[1.9] text-[#fff3bd]">
                {block.limitation}
              </p>
            </aside>
          </div>
        </div>
      )}
    </article>
  );
}

function ReadingView({
  sectionIndex,
  viewedTermIds,
  onOpenTerm,
  onContinue,
}) {
  const readingTitleRef = useRef(null);
  const block = NODE_6_READING_BLOCKS[sectionIndex];
  const sectionTermIds = SECTION_TERM_IDS[sectionIndex];
  const sectionTerms = NODE_6_TERMS.filter((term) =>
    sectionTermIds.includes(term.id),
  );

  useEffect(() => {
    readingTitleRef.current?.focus();
  }, [sectionIndex]);

  return (
    <section
      data-stage-interactive
      aria-labelledby="node-6-reading-title"
      className="absolute inset-[17px] z-20 flex flex-col border-[5px] border-[#f0ca63] bg-[#101725] p-[11px] text-white shadow-[0_8px_0_#080d16,0_12px_24px_#000000b8] ring-4 ring-[#35d8ff]/80"
    >
      <Node6Header
        step={`SECCIÓN ${sectionIndex + 1} / 2 · BLOQUE ${block.marker}`}
        stepNumber={sectionIndex + 1}
        title={block.title.toUpperCase()}
        titleId="node-6-reading-title"
        titleRef={readingTitleRef}
      />

      <div className="grid min-h-0 flex-1 grid-cols-1">
        <ReadingBlock block={block} />
      </div>

      <div
        role="group"
        aria-label={`Conceptos clave de la sección ${sectionIndex + 1}`}
        className="mt-[10px] grid shrink-0 grid-cols-2 gap-[10px]"
      >
        {sectionTerms.map((term) => (
          <TermButton
            key={term.id}
            term={term}
            viewed={viewedTermIds.includes(term.id)}
            onOpen={onOpenTerm}
          />
        ))}
      </div>

      <footer className="mt-[10px] flex min-h-[54px] shrink-0 items-center justify-between gap-[14px] border-t-4 border-[#35d8ff] bg-[#17263a] px-[12px] py-[8px] shadow-[inset_0_2px_0_#2c4965]">
        <p
          id="node-6-glossary-status"
          aria-live="polite"
          className="font-pixel text-[8px] leading-[1.7] text-[#9fe8f4]"
        >
          CONCEPTOS CONSULTADOS: {viewedTermIds.length} / {NODE_6_TERMS.length}
        </p>
        <button
          type="button"
          data-stage-interactive
          onClick={onContinue}
          className="min-h-[44px] border-2 border-[#080d16] bg-[#f0ca63] px-[15px] py-[8px] font-pixel text-[9px] leading-[1.6] text-[#101725] shadow-[0_3px_0_#080d16] transition-colors hover:bg-[#fff3bd] active:translate-y-[2px] active:shadow-[0_1px_0_#080d16] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        >
          {sectionIndex === 0
            ? "SIGUIENTE: SECCIÓN B →"
            : "IR A LA MINI EVALUACIÓN →"}
        </button>
      </footer>
    </section>
  );
}

function QuizView({ selectedOptionId, onSelectOption }) {
  const quizTitleRef = useRef(null);

  useEffect(() => {
    quizTitleRef.current?.focus();
  }, []);

  return (
    <section
      data-stage-interactive
      aria-labelledby="node-6-quiz-title"
      className="absolute inset-[17px] z-20 flex flex-col border-[5px] border-[#f0ca63] bg-[#101725] p-[12px] text-white shadow-[0_8px_0_#080d16,0_12px_24px_#000000b8] ring-4 ring-[#35d8ff]/80"
    >
      <Node6Header
        step="RETO · DECISIÓN ANTES DEL DESPLIEGUE"
        stepNumber={3}
        title="UN SANDBOX NO BASTA"
        titleId="node-6-quiz-title"
        titleRef={quizTitleRef}
      />

      <div className="mb-[10px] shrink-0 border-2 border-[#35d8ff] bg-[#17263a] px-[14px] py-[11px] shadow-[inset_0_2px_0_#2c4965]">
        <p className="mb-[6px] font-pixel text-[6px] leading-[1.6] text-[#9fe8f4]">
          CASO · CORRECCIÓN DE CÓDIGO
        </p>
        <h2
          id="node-6-case-question"
          className="font-pixel text-[10px] leading-[1.9] text-[#fff3bd]"
        >
          Un agente corrige un error y todas las pruebas del sandbox pasan. ¿Qué
          haces antes de desplegar?
        </h2>
      </div>

      <div
        role="group"
        aria-labelledby="node-6-case-question"
        aria-describedby="node-6-case-instructions"
        className="grid min-h-0 flex-1 grid-cols-2 grid-rows-2 gap-[9px]"
      >
        {NODE_6_OPTIONS.map((option) => {
          const isSelected = selectedOptionId === option.id;
          return (
            <button
              key={option.id}
              type="button"
              data-stage-interactive
              aria-label={`Opción ${option.id}. ${option.text}`}
              aria-pressed={isSelected}
              onClick={(event) => onSelectOption(option.id, event)}
              className={`flex min-h-[100px] items-start gap-[12px] border-[3px] px-[12px] py-[11px] text-left transition-colors hover:border-white active:translate-y-[2px] focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-white ${isSelected ? "border-[#f0ca63] bg-[#42351e]" : "border-[#52616a] bg-[#17263a] hover:bg-[#203950]"}`}
            >
              <span
                aria-hidden="true"
                className={`grid size-[34px] shrink-0 place-items-center border-2 font-pixel text-[11px] shadow-[2px_2px_0_#080d16] ${isSelected ? "border-[#f0ca63] bg-[#f0ca63] text-[#101725]" : "border-[#35d8ff] bg-[#101725] text-[#35d8ff]"}`}
              >
                {option.id}
              </span>
              <span className="font-pixel text-[9px] leading-[1.9] text-white">
                {option.text}
              </span>
            </button>
          );
        })}
      </div>

      <footer className="mt-[9px] flex min-h-[42px] shrink-0 items-center justify-between gap-[10px] border-t-4 border-[#35d8ff] bg-[#17263a] px-[10px] py-[6px] shadow-[inset_0_2px_0_#2c4965]">
        <p
          id="node-6-case-instructions"
          className="font-pixel text-[7px] leading-[1.7] text-[#9fe8f4]"
        >
          ELIGE UNA OPCIÓN · CLIC, TAB Y ENTER / ESPACIO
        </p>
        <span className="shrink-0 font-pixel text-[7px] leading-[1.6] text-[#f0ca63]">
          SOLO B REGISTRA 5.0
        </span>
      </footer>
    </section>
  );
}

function SuccessView({ titleRef, onExit }) {
  return (
    <section
      data-stage-interactive
      aria-labelledby="node-6-success-title"
      className="absolute inset-[17px] z-20 flex flex-col border-[5px] border-[#f0ca63] bg-[#101725] p-[12px] text-white shadow-[0_8px_0_#080d16,0_12px_24px_#000000b8] ring-4 ring-[#35d8ff]/80"
    >
      <Node6Header
        step="RETO COMPLETADO"
        stepNumber={3}
        title="VALIDACIÓN RESPONSABLE"
        titleId="node-6-success-title"
        titleRef={titleRef}
      />

      <div className="flex min-h-0 flex-1 items-center justify-center px-[16px] py-[12px]">
        <div className="w-full max-w-[720px] border-[4px] border-[#35d8ff] bg-[#17263a] p-[20px] text-center shadow-[0_7px_0_#080d16,0_11px_0_#f0ca63]">
          <div className="mb-[11px] inline-flex items-center gap-[8px] border-2 border-[#7a5c2e] bg-[#352b24] px-[11px] py-[7px] font-pixel text-[7px] leading-[1.5] text-[#f0ca63]">
            <span aria-hidden="true">★</span>
            DECISIÓN CORRECTA · 1 / 1
            <span aria-hidden="true">★</span>
          </div>
          <h2 className="font-pixel text-[14px] leading-[1.8] text-[#fff3bd] [text-shadow:2px_2px_0_#080d16]">
            ¡BASE DE PRUEBAS VALIDADA!
          </h2>
          <p className="mx-auto mt-[10px] max-w-[570px] font-pixel text-[9px] leading-[2] text-white">
            Un resultado satisfactorio en el sandbox es solo una parte de la
            verificación. La nota de este módulo quedó registrada.
          </p>

          <div className="mx-auto mt-[15px] max-w-[280px] border-2 border-[#f0ca63] bg-[#101725] px-[14px] py-[10px]">
            <p className="font-pixel text-[7px] leading-[1.6] text-[#9fe8f4]">
              CALIFICACIÓN DEL MÓDULO
            </p>
            <p className="mt-[5px] font-pixel text-[16px] leading-[1.5] text-[#f0ca63]">
              {PASSING_GRADE.toFixed(1)} / 5.0
            </p>
          </div>

          <button
            type="button"
            data-stage-interactive
            onClick={onExit}
            className="mt-[16px] min-h-[46px] border-2 border-[#080d16] bg-[#f0ca63] px-[17px] py-[9px] font-pixel text-[8px] leading-[1.5] text-[#101725] shadow-[0_4px_0_#080d16] transition-colors hover:bg-[#fff3bd] active:translate-y-[3px] active:shadow-[0_1px_0_#080d16] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            VOLVER AL MAPA
          </button>
          <p className="mt-[8px] font-pixel text-[6px] leading-[1.6] text-[#9fe8f4]">
            CLIC O ESPACIO PARA CONTINUAR
          </p>
        </div>
      </div>
    </section>
  );
}

function TermDialog({ term, dialogRef, closeButtonRef, onClose, onBackdropClick }) {
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
        aria-labelledby="node-6-term-title"
        aria-describedby="node-6-term-description"
        className="flex max-h-full w-full max-w-[850px] flex-col border-[5px] border-[#f0ca63] bg-[#101725] p-[17px] text-white shadow-[0_8px_0_#080d16,0_12px_24px_#000000b8] ring-4 ring-[#35d8ff]"
      >
        <header className="flex shrink-0 items-center justify-between gap-[12px] border-b-4 border-[#35d8ff] bg-[#17263a] px-[14px] py-[11px]">
          <span className="font-pixel text-[8px] leading-[1.7] text-[#9fe8f4]">
            GLOSARIO · BASE DE PRUEBAS
          </span>
          <span className="border-2 border-[#7a5c2e] bg-[#f0ca63] px-[8px] py-[5px] font-pixel text-[7px] text-[#101725]">
            CONCEPTO CLAVE
          </span>
        </header>

        <h2
          id="node-6-term-title"
          className="mt-[17px] font-pixel text-[18px] leading-[1.7] text-[#fff3bd] [text-shadow:2px_2px_0_#080d16]"
        >
          {term.title}
        </h2>
        <div className="mt-[13px] max-h-[330px] overflow-y-auto border-l-[6px] border-[#35d8ff] bg-[#17263a] px-[19px] py-[16px]">
          <p
            id="node-6-term-description"
            className="font-pixel text-[15px] leading-[1.9] text-white [text-shadow:1px_1px_0_#080d16]"
          >
            {term.body}
          </p>
          {term.citation && (
            <p className="mt-[13px] border-t border-[#40566d] pt-[9px] font-pixel text-[8px] leading-[1.7] text-[#b8dce5]">
              FUENTE · {term.citation}
            </p>
          )}
        </div>

        <footer className="mt-[15px] flex shrink-0 items-center justify-between gap-[12px] border-t-2 border-[#40566d] pt-[11px]">
          <span className="font-pixel text-[7px] leading-[1.7] text-[#9fe8f4]">
            ESC PARA CERRAR
          </span>
          <button
            ref={closeButtonRef}
            type="button"
            data-stage-interactive
            onClick={onClose}
            className="min-h-[46px] border-2 border-[#080d16] bg-[#f0ca63] px-[15px] py-[8px] font-pixel text-[8px] leading-[1.5] text-[#101725] shadow-[0_3px_0_#080d16] transition-colors hover:bg-[#fff3bd] active:translate-y-[2px] active:shadow-[0_1px_0_#080d16] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            VOLVER A LA LECTURA
          </button>
        </footer>
      </section>
    </div>
  );
}

function FeedbackDialog({
  option,
  dialogRef,
  closeButtonRef,
  onClose,
  onBackdropClick,
}) {
  const resultClasses = option.correct
    ? "border-[#79cf8a] bg-[#1c3d35] text-[#d9ffe0]"
    : "border-[#a85a42] bg-[#382621] text-[#ffe0bd]";

  return (
    <div
      data-stage-interactive
      className="absolute inset-0 z-[80] grid place-items-center bg-[#080d16]/95 p-[20px]"
      onClick={onBackdropClick}
    >
      <section
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="node-6-feedback-title"
        aria-describedby="node-6-feedback-description"
        className="flex max-h-full w-full max-w-[850px] flex-col border-[5px] border-[#f0ca63] bg-[#101725] p-[17px] text-white shadow-[0_8px_0_#080d16,0_12px_24px_#000000b8] ring-4 ring-[#35d8ff]"
      >
        <header className="flex shrink-0 items-center justify-between gap-[12px] border-b-4 border-[#35d8ff] bg-[#17263a] px-[14px] py-[11px]">
          <span className="font-pixel text-[8px] leading-[1.7] text-[#9fe8f4]">
            RETROALIMENTACIÓN · OPCIÓN {option.id}
          </span>
          <span
            className={`border-2 px-[8px] py-[5px] font-pixel text-[7px] ${resultClasses}`}
          >
            {option.correct ? "✓ CORRECTA" : "✕ REVISA"}
          </span>
        </header>

        <h2
          id="node-6-feedback-title"
          className="mt-[17px] font-pixel text-[16px] leading-[1.8] text-[#fff3bd] [text-shadow:2px_2px_0_#080d16]"
        >
          {option.correct ? "¡DECISIÓN RESPONSABLE!" : "ANTES DE DESPLEGAR…"}
        </h2>
        <p
          id="node-6-feedback-description"
          className="mt-[12px] border-l-[6px] border-[#35d8ff] bg-[#17263a] px-[18px] py-[15px] font-pixel text-[13px] leading-[1.9] text-white"
        >
          {option.feedback}
        </p>

        <footer className="mt-[15px] flex shrink-0 items-center justify-between gap-[12px] border-t-2 border-[#40566d] pt-[11px]">
          <span className="font-pixel text-[7px] leading-[1.7] text-[#9fe8f4]">
            {option.correct
              ? "CALIFICACIÓN REGISTRADA: 5.0 / 5.0"
              : "PUEDES VOLVER AL CASO E INTENTAR OTRA OPCIÓN"}
          </span>
          <button
            ref={closeButtonRef}
            type="button"
            data-stage-interactive
            onClick={onClose}
            className="min-h-[46px] border-2 border-[#080d16] bg-[#f0ca63] px-[15px] py-[8px] font-pixel text-[8px] leading-[1.5] text-[#101725] shadow-[0_3px_0_#080d16] transition-colors hover:bg-[#fff3bd] active:translate-y-[2px] active:shadow-[0_1px_0_#080d16] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            {option.correct ? "VER CALIFICACIÓN" : "VOLVER AL CASO"}
          </button>
        </footer>
      </section>
    </div>
  );
}

export default function Nodo6({ active, onComplete, onExit }) {
  const [phase, setPhase] = useState("welcome");
  const [readingSection, setReadingSection] = useState(0);
  const [visibleCharacters, setVisibleCharacters] = useState(0);
  const [talkingFrameIndex, setTalkingFrameIndex] = useState(0);
  const [viewedTermIds, setViewedTermIds] = useState([]);
  const [selectedTermId, setSelectedTermId] = useState(null);
  const [feedbackOptionId, setFeedbackOptionId] = useState(null);
  const welcomeAudioRef = useRef(null);
  const welcomeButtonRef = useRef(null);
  const termCloseButtonRef = useRef(null);
  const termDialogRef = useRef(null);
  const termTriggerRef = useRef(null);
  const feedbackCloseButtonRef = useRef(null);
  const feedbackDialogRef = useRef(null);
  const optionTriggerRef = useRef(null);
  const successTitleRef = useRef(null);
  const restoreTermFocusRef = useRef(false);
  const restoreFeedbackFocusRef = useRef(false);
  const completionReportedRef = useRef(false);

  const isTyping =
    phase === "welcome" && visibleCharacters < NODE_6_INITIAL_DIALOGUE.length;
  const visibleText = NODE_6_INITIAL_DIALOGUE.slice(0, visibleCharacters);
  const isSpeaking = active && phase === "welcome" && isTyping;
  const talkingFrame = TALKING_ANIMATION.frames[talkingFrameIndex];
  const selectedTerm = NODE_6_TERMS.find((term) => term.id === selectedTermId);
  const feedbackOption = NODE_6_OPTIONS.find(
    (option) => option.id === feedbackOptionId,
  );

  const finishTyping = useCallback(() => {
    if (!isTyping) return;

    const audio = welcomeAudioRef.current;
    audio?.pause();
    if (audio) audio.currentTime = 0;
    setVisibleCharacters(NODE_6_INITIAL_DIALOGUE.length);
  }, [isTyping]);

  const advanceWelcome = useCallback(() => {
    if (!active || phase !== "welcome") return;
    if (isTyping) {
      finishTyping();
      return;
    }
    setReadingSection(0);
    setPhase("reading");
  }, [active, finishTyping, isTyping, phase]);

  const continueReading = useCallback(() => {
    if (!active || phase !== "reading") return;
    if (readingSection === 0) {
      setReadingSection(1);
      return;
    }
    setPhase("quiz");
  }, [active, phase, readingSection]);

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

  const selectOption = useCallback(
    (optionId, event) => {
      if (!active || phase !== "quiz") return;

      const option = NODE_6_OPTIONS.find((item) => item.id === optionId);
      if (!option) return;

      optionTriggerRef.current = event.currentTarget;
      setFeedbackOptionId(option.id);

      if (option.correct) {
        setPhase("success");
        if (!completionReportedRef.current) {
          completionReportedRef.current = true;
          onComplete?.(6, PASSING_GRADE);
        }
      }
    },
    [active, onComplete, phase],
  );

  const closeFeedback = useCallback(() => {
    restoreFeedbackFocusRef.current = true;
    setFeedbackOptionId(null);
  }, []);

  const continueFromSuccess = useCallback(() => {
    if (!active || phase !== "success") return;
    onExit?.();
  }, [active, onExit, phase]);

  useEffect(() => {
    if (active) return;

    setPhase("welcome");
    setReadingSection(0);
    setVisibleCharacters(0);
    setTalkingFrameIndex(0);
    setViewedTermIds([]);
    setSelectedTermId(null);
    setFeedbackOptionId(null);
    completionReportedRef.current = false;
    restoreTermFocusRef.current = false;
    restoreFeedbackFocusRef.current = false;
  }, [active]);

  useEffect(() => {
    const audio = welcomeAudioRef.current;
    if (!active || phase !== "welcome" || !audio) return undefined;

    audio.currentTime = 0;
    const playback = audio.play();
    playback?.catch(() => {
      // La reproducción automática puede estar bloqueada por el navegador.
    });

    return () => {
      audio.pause();
      audio.currentTime = 0;
    };
  }, [active, phase]);

  useEffect(() => {
    if (!active || phase !== "welcome" || !isTyping) return undefined;

    const previousCharacter = NODE_6_INITIAL_DIALOGUE[visibleCharacters - 1];
    const delay = /[.!?,;:]/.test(previousCharacter ?? "")
      ? TYPEWRITER_PAUSE_DELAY
      : TYPEWRITER_CHARACTER_DELAY;
    const timer = window.setTimeout(() => {
      setVisibleCharacters((current) =>
        Math.min(current + 1, NODE_6_INITIAL_DIALOGUE.length),
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
      termCloseButtonRef.current?.focus();

      const onKeyDown = (event) => {
        if (event.key === "Escape") {
          event.preventDefault();
          closeTerm();
          return;
        }

        if (event.key !== "Tab") return;
        event.preventDefault();
        termCloseButtonRef.current?.focus();
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
    if (feedbackOption) {
      feedbackCloseButtonRef.current?.focus();

      const onKeyDown = (event) => {
        if (event.key === "Escape") {
          event.preventDefault();
          closeFeedback();
          return;
        }

        if (event.key !== "Tab") return;
        event.preventDefault();
        feedbackCloseButtonRef.current?.focus();
      };

      window.addEventListener("keydown", onKeyDown);
      return () => window.removeEventListener("keydown", onKeyDown);
    }

    if (restoreFeedbackFocusRef.current) {
      if (phase === "success") successTitleRef.current?.focus();
      else optionTriggerRef.current?.focus();
      restoreFeedbackFocusRef.current = false;
    }
    return undefined;
  }, [closeFeedback, feedbackOption, phase]);

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
      <audio ref={welcomeAudioRef} src={nodeSixIntroAudio} preload="auto" />

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
            className="absolute left-[24px] right-[24px] top-[18px] z-30 flex max-h-[330px] cursor-pointer flex-col gap-[9px] border-[5px] border-[#f0ca63] bg-[#101725] px-[17px] py-[12px] text-left text-white shadow-[0_8px_0_#080d16,0_12px_24px_#000000b8] ring-4 ring-[#35d8ff]/80 transition-colors hover:border-[#fff3bd] active:translate-y-[3px] active:shadow-[0_5px_0_#080d16,0_9px_18px_#000000b8] focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-white"
          >
            <span className="flex w-full items-center justify-between gap-[10px] border-b-2 border-[#40566d] pb-[8px] font-pixel text-[8px] leading-[1.7]">
              <span className="flex items-center gap-[10px]">
                <span className="border-2 border-[#101725] bg-[#35d8ff] px-[8px] py-[5px] text-[#101725] shadow-[2px_2px_0_#14768b]">
                  MUDEK
                </span>
                <span className="text-[#9fe8f4]">BASE DE PRUEBAS</span>
              </span>
              <span className="shrink-0 border-2 border-[#7a5c2e] bg-[#f0ca63] px-[8px] py-[5px] text-[#211922] shadow-[2px_2px_0_#080d16]">
                01 / 01
              </span>
            </span>

            <span className="block w-full whitespace-pre-line border-l-[4px] border-[#35d8ff] px-[13px] py-[9px] font-pixel text-[9px] leading-[1.9] text-white [text-shadow:1px_1px_0_#080d16]">
              {visibleText}
              {isTyping && <span className="ml-[2px] text-[#f0ca63]">▌</span>}
            </span>

            <span className="flex w-full items-center justify-between gap-[10px] border-t-2 border-[#40566d] pt-[8px] font-pixel text-[8px] leading-[1.7]">
              <span className={isTyping ? "text-[#9fe8f4]" : "text-[#ffe6b8]"}>
                {isTyping
                  ? "ESPACIO O CLIC: MOSTRAR TODO"
                  : "ESPACIO O CLIC: ABRIR LA SECCIÓN A"}
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
          sectionIndex={readingSection}
          viewedTermIds={viewedTermIds}
          onOpenTerm={openTerm}
          onContinue={continueReading}
        />
      )}

      {phase === "quiz" && (
        <QuizView
          selectedOptionId={feedbackOptionId}
          onSelectOption={selectOption}
        />
      )}

      {phase === "success" && (
        <SuccessView titleRef={successTitleRef} onExit={continueFromSuccess} />
      )}

      {selectedTerm && (
        <TermDialog
          term={selectedTerm}
          dialogRef={termDialogRef}
          closeButtonRef={termCloseButtonRef}
          onClose={closeTerm}
          onBackdropClick={(event) => {
            if (event.target === event.currentTarget) closeTerm();
          }}
        />
      )}

      {feedbackOption && (
        <FeedbackDialog
          option={feedbackOption}
          dialogRef={feedbackDialogRef}
          closeButtonRef={feedbackCloseButtonRef}
          onClose={closeFeedback}
          onBackdropClick={(event) => {
            if (event.target === event.currentTarget) closeFeedback();
          }}
        />
      )}
    </div>
  );
}
