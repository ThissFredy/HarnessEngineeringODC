import { useCallback, useEffect, useRef, useState } from "react";
import Avatar from "../components/Avatar.jsx";
import { MUDEK } from "../data/avatars.js";
import { MUDEK_ANIMATIONS } from "../data/mudekAnimations.js";
import {
  NODE_5_DESCRIPTION_ORDER,
  NODE_5_INITIAL_DIALOGUE,
  NODE_5_MATCHES,
  NODE_5_READING_BLOCKS,
  NODE_5_TERMS,
} from "../data/nodo5.js";
import nodeFiveIntroAudio from "../assets/audio/Nodo-5-1.mp3";

const PASSING_GRADE = 5.0;
const TYPEWRITER_CHARACTER_DELAY = 50;
const TYPEWRITER_PAUSE_DELAY = 110;
const TALKING_ANIMATION = MUDEK_ANIMATIONS.hablar;
const TERM_IDS = NODE_5_TERMS.map((term) => term.id);

function Node5Header({ step, stepNumber, title, titleId, titleRef }) {
  return (
    <header className="mb-[8px] flex min-h-[50px] shrink-0 items-center justify-between gap-[10px] border-b-4 border-[#35d8ff] bg-[#17263a] px-[11px] py-[7px] shadow-[inset_0_2px_0_#2c4965]">
      <div className="flex min-w-0 items-center gap-[9px]">
        <span className="grid size-[32px] shrink-0 place-items-center border-2 border-[#080d16] bg-[#35d8ff] font-pixel text-[9px] text-[#101725] shadow-[3px_3px_0_#080d16]">
          05
        </span>
        <div className="min-w-0">
          <p className="font-pixel text-[6px] leading-[1.6] text-[#9fe8f4]">
            ESTACIÓN DE CONEXIONES · {step}
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

      <div className="flex shrink-0 items-center gap-[7px] border-2 border-[#40566d] bg-[#101725] px-[8px] py-[5px]">
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
      className={`flex min-h-[42px] min-w-0 items-center gap-[7px] border-2 px-[7px] py-[6px] text-left font-pixel text-[6px] leading-[1.6] transition-colors hover:border-white active:translate-y-[2px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white ${viewed ? "border-[#35d8ff] bg-[#153141] text-[#c1f4ff]" : "border-[#8b7040] bg-[#352d24] text-[#ffe6b8]"}`}
    >
      <span className="grid size-[22px] shrink-0 place-items-center border-2 border-[#101725] bg-[#f0ca63] font-pixel text-[9px] leading-none text-[#101725] shadow-[2px_2px_0_#080d16]">
        {viewed ? "✓" : "+"}
      </span>
      <span className="min-w-0">{term.label}</span>
    </button>
  );
}

function ReadingView({ viewedTermIds, onOpenTerm, onBeginQuiz }) {
  const readingTitleRef = useRef(null);
  const allTermsViewed = TERM_IDS.every((id) => viewedTermIds.includes(id));

  useEffect(() => {
    readingTitleRef.current?.focus();
  }, []);

  return (
    <section
      data-stage-interactive
      aria-labelledby="node-5-reading-title"
      className="absolute inset-[18px] z-20 flex flex-col border-[5px] border-[#f0ca63] bg-[#101725] p-[10px] text-white shadow-[0_8px_0_#080d16,0_12px_24px_#000000b8] ring-4 ring-[#35d8ff]/80"
    >
      <Node5Header
        step="LECTURA · BLOQUES A + B"
        stepNumber={1}
        title="MCP CONECTA · SKILL ORIENTA"
        titleId="node-5-reading-title"
        titleRef={readingTitleRef}
      />

      <div className="grid min-h-0 flex-1 grid-cols-2 gap-[9px]">
        {NODE_5_READING_BLOCKS.map((block) => (
          <article
            key={block.id}
            aria-labelledby={`node-5-block-${block.id}-title`}
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
                  id={`node-5-block-${block.id}-title`}
                  className="font-pixel text-[7px] leading-[1.7] text-[#fff3bd]"
                >
                  {block.title}
                </h2>
              </div>
            </header>

            <p className="mt-[7px] font-pixel text-[7px] leading-[1.8] text-white">
              {block.text}
            </p>

            <div
              role="img"
              aria-label={
                block.id === "mcp"
                  ? "Una aplicación de IA consulta un servidor MCP que expone herramientas y datos"
                  : "Una Skill presenta sus metadatos primero y carga instrucciones y recursos cuando hacen falta"
              }
              className="mt-[7px] grid grid-cols-[1fr_auto_1fr_auto_1fr] items-center gap-[4px] border-2 border-[#40566d] bg-[#101725] px-[6px] py-[6px]"
            >
              {block.diagram.map((label, index) => (
                <span key={label} className="contents">
                  <span className="grid min-h-[31px] place-items-center border border-[#35d8ff] bg-[#153141] px-[4px] text-center font-pixel text-[5px] leading-[1.5] text-[#c1f4ff]">
                    {label}
                  </span>
                  {index < block.diagram.length - 1 && (
                    <span aria-hidden="true" className="font-pixel text-[7px] text-[#f0ca63]">
                      →
                    </span>
                  )}
                </span>
              ))}
            </div>

            {block.evidence && (
              <div className="mt-[7px] grid min-h-0 flex-1 grid-cols-2 gap-[6px]">
                {block.evidence.map((item) => (
                  <aside
                    key={item.eyebrow}
                    className="border-l-[3px] border-[#f0ca63] bg-[#101725] px-[7px] py-[6px]"
                  >
                    <p className="font-pixel text-[5px] leading-[1.5] text-[#f0ca63]">
                      {item.eyebrow}
                    </p>
                    <p className="mt-[3px] font-pixel text-[5px] leading-[1.7] text-[#e5e7eb]">
                      {item.text}
                    </p>
                  </aside>
                ))}
              </div>
            )}

            {block.callout && (
              <aside className="mt-[7px] flex min-h-0 flex-1 flex-col justify-center border-l-[3px] border-[#f0ca63] bg-[#101725] px-[8px] py-[7px]">
                <p className="font-pixel text-[5px] leading-[1.7] text-[#e5e7eb]">
                  {block.callout}
                </p>
              </aside>
            )}
          </article>
        ))}
      </div>

      <div
        role="group"
        aria-label="Términos clave de la Estación de Conexiones"
        className="mt-[7px] grid shrink-0 grid-cols-4 gap-[6px]"
      >
        {NODE_5_TERMS.map((term) => (
          <TermButton
            key={term.id}
            term={term}
            viewed={viewedTermIds.includes(term.id)}
            onOpen={onOpenTerm}
          />
        ))}
      </div>

      <footer className="mt-[7px] flex min-h-[42px] shrink-0 items-center justify-between gap-[9px] border-t-4 border-[#35d8ff] bg-[#17263a] px-[9px] py-[5px] shadow-[inset_0_2px_0_#2c4965]">
        <p
          id="node-5-glossary-status"
          aria-live="polite"
          className="font-pixel text-[6px] leading-[1.7] text-[#9fe8f4]"
        >
          TÉRMINOS CONSULTADOS: {viewedTermIds.length} / {NODE_5_TERMS.length}
        </p>
        <button
          type="button"
          data-stage-interactive
          aria-describedby={!allTermsViewed ? "node-5-glossary-status" : undefined}
          disabled={!allTermsViewed}
          onClick={onBeginQuiz}
          className={`min-h-[34px] border-2 border-[#080d16] px-[10px] py-[5px] font-pixel text-[6px] leading-[1.5] shadow-[0_3px_0_#080d16] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white ${allTermsViewed ? "bg-[#f0ca63] text-[#101725] hover:bg-[#fff3bd] active:translate-y-[2px] active:shadow-[0_1px_0_#080d16]" : "cursor-not-allowed bg-[#59606a] text-[#c8cdd2] opacity-80"}`}
        >
          {allTermsViewed ? "IR AL RETO →" : "CONSULTA LOS «+»"}
        </button>
      </footer>
    </section>
  );
}

function QuizView({
  assignments,
  questionResults,
  selectedConceptId,
  statusMessage,
  onSelectConcept,
  onSelectDescription,
}) {
  const quizTitleRef = useRef(null);
  const correctCount = Object.keys(assignments).length;
  const assignedDescriptionIds = new Set(Object.values(assignments));
  const orderedDescriptions = NODE_5_DESCRIPTION_ORDER.map((id) =>
    NODE_5_MATCHES.find((match) => match.id === id),
  ).filter(Boolean);

  useEffect(() => {
    quizTitleRef.current?.focus();
  }, []);

  return (
    <section
      data-stage-interactive
      aria-labelledby="node-5-quiz-title"
      className="absolute inset-[18px] z-20 flex flex-col border-[5px] border-[#f0ca63] bg-[#101725] p-[11px] text-white shadow-[0_8px_0_#080d16,0_12px_24px_#000000b8] ring-4 ring-[#35d8ff]/80"
    >
      <Node5Header
        step="RETO · EVALUACIÓN"
        stepNumber={2}
        title="RELACIONA CADA CONCEPTO"
        titleId="node-5-quiz-title"
        titleRef={quizTitleRef}
      />

      <div className="mb-[7px] flex min-h-[37px] shrink-0 items-center justify-between gap-[9px] border-2 border-[#40566d] bg-[#17263a] px-[9px] py-[5px]">
        <p id="node-5-quiz-instructions" className="font-pixel text-[6px] leading-[1.7] text-[#e5e7eb]">
          Selecciona un concepto y después su descripción. Puedes reintentar; necesitas 4 de 4 para obtener 5.0.
        </p>
        <div
          role="progressbar"
          aria-label="Relaciones correctas"
          aria-valuemin={0}
          aria-valuemax={NODE_5_MATCHES.length}
          aria-valuenow={correctCount}
          aria-valuetext={`${correctCount} de ${NODE_5_MATCHES.length} relaciones correctas`}
          className="w-[120px] shrink-0 border-2 border-[#40566d] bg-[#101725] px-[6px] py-[4px]"
        >
          <div className="mb-[3px] flex justify-between gap-[4px] font-pixel text-[5px] leading-[1.4]">
            <span className="text-[#9fe8f4]">ACERTADAS</span>
            <span className="text-[#f0ca63]">{correctCount} / 4</span>
          </div>
          <div aria-hidden="true" className="h-[6px] border border-[#52616a] bg-[#080d16] p-[1px]">
            <span
              className="block h-full bg-[#35d8ff] transition-[width] duration-150"
              style={{ width: `${(correctCount / NODE_5_MATCHES.length) * 100}%` }}
            />
          </div>
        </div>
      </div>

      <div className="grid min-h-0 flex-1 grid-cols-[minmax(0,0.78fr)_minmax(0,1.22fr)] gap-[9px]">
        <section aria-labelledby="node-5-concepts-title" className="flex min-h-0 flex-col">
          <h2 id="node-5-concepts-title" className="mb-[5px] shrink-0 border-b-2 border-[#40566d] pb-[4px] font-pixel text-[6px] leading-[1.6] text-[#f0ca63]">
            CONCEPTOS
          </h2>
          <ol className="flex min-h-0 flex-1 flex-col gap-[6px]">
            {NODE_5_MATCHES.map((match, index) => {
              const isMatched = assignments[match.id] !== undefined;
              const result = questionResults[match.id];
              const isSelected = selectedConceptId === match.id;

              return (
                <li key={match.id} className="flex min-h-0 flex-1">
                  <button
                    type="button"
                    data-stage-interactive
                    aria-pressed={isSelected}
                    aria-describedby="node-5-quiz-instructions node-5-quiz-status"
                    disabled={isMatched}
                    onClick={() => onSelectConcept(match.id)}
                    className={`flex min-h-[48px] w-full items-center gap-[8px] border-2 px-[8px] py-[6px] text-left font-pixel text-[7px] leading-[1.7] transition-colors hover:border-white disabled:cursor-not-allowed disabled:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white ${isMatched ? "border-[#79cf8a] bg-[#1c3d35] text-[#d9ffe0]" : isSelected ? "border-[#f0ca63] bg-[#42351e] text-[#fff3bd] ring-2 ring-[#f0ca63]/50" : result === "incorrect" ? "border-[#a85a42] bg-[#382621] text-[#ffe0bd]" : "border-[#52616a] bg-[#17263a] text-white"}`}
                  >
                    <span aria-hidden="true" className={`grid size-[25px] shrink-0 place-items-center border-2 font-pixel text-[8px] ${isMatched ? "border-[#79cf8a] bg-[#79cf8a] text-[#101725]" : isSelected ? "border-[#f0ca63] bg-[#f0ca63] text-[#101725]" : result === "incorrect" ? "border-[#a85a42] bg-[#6a342e] text-[#ffe0bd]" : "border-[#52616a] bg-[#101725] text-[#f0ca63]"}`}>
                      {isMatched ? "✓" : result === "incorrect" ? "!" : String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="min-w-0 flex-1">{match.label}</span>
                    {isSelected && <span aria-hidden="true" className="text-[#f0ca63]">›</span>}
                  </button>
                </li>
              );
            })}
          </ol>
        </section>

        <section aria-labelledby="node-5-descriptions-title" className="flex min-h-0 flex-col">
          <h2 id="node-5-descriptions-title" className="mb-[5px] shrink-0 border-b-2 border-[#40566d] pb-[4px] font-pixel text-[6px] leading-[1.6] text-[#35d8ff]">
            DESCRIPCIONES · ELIGE UNA
          </h2>
          <ol className="flex min-h-0 flex-1 flex-col gap-[6px]">
            {orderedDescriptions.map((match, index) => {
              const isUsed = assignedDescriptionIds.has(match.id);

              return (
                <li key={match.id} className="flex min-h-0 flex-1">
                  <button
                    type="button"
                    data-stage-interactive
                    aria-describedby="node-5-quiz-instructions node-5-quiz-status"
                    aria-label={`Descripción ${index + 1}: ${match.description}`}
                    disabled={isUsed}
                    onClick={() => onSelectDescription(match.id)}
                    className={`flex min-h-[48px] w-full items-center gap-[8px] border-2 px-[8px] py-[6px] text-left transition-colors hover:border-white disabled:cursor-not-allowed disabled:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white ${isUsed ? "border-[#79cf8a] bg-[#1c3d35]" : "border-[#52616a] bg-[#17263a] hover:bg-[#203950]"}`}
                  >
                    <span aria-hidden="true" className={`grid size-[23px] shrink-0 place-items-center border font-pixel text-[7px] ${isUsed ? "border-[#79cf8a] bg-[#79cf8a] text-[#101725]" : "border-[#52616a] bg-[#101725] text-[#35d8ff]"}`}>
                      {isUsed ? "✓" : String(index + 1).padStart(2, "0")}
                    </span>
                    <span className={`font-pixel text-[6px] leading-[1.7] ${isUsed ? "text-[#d9ffe0]" : "text-white"}`}>
                      {match.description}
                    </span>
                  </button>
                </li>
              );
            })}
          </ol>
        </section>
      </div>

      <footer className="mt-[7px] flex min-h-[42px] shrink-0 items-center justify-between gap-[8px] border-t-4 border-[#35d8ff] bg-[#17263a] px-[9px] py-[5px] shadow-[inset_0_2px_0_#2c4965]">
        <p
          id="node-5-quiz-status"
          role="status"
          aria-live="polite"
          aria-atomic="true"
          className="min-w-0 font-pixel text-[6px] leading-[1.7] text-[#ffe6b8]"
        >
          {statusMessage || "Elige un concepto y busca la descripción que le corresponde."}
        </p>
        <span className="shrink-0 font-pixel text-[5px] leading-[1.6] text-[#9fe8f4]">
          TAB · ENTER / ESPACIO
        </span>
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
      aria-labelledby="node-5-success-title"
      className="absolute inset-[18px] z-20 flex flex-col border-[5px] border-[#f0ca63] bg-[#101725] p-[12px] text-white shadow-[0_8px_0_#080d16,0_12px_24px_#000000b8] ring-4 ring-[#35d8ff]/80"
    >
      <Node5Header
        step="RETO COMPLETADO"
        stepNumber={2}
        title="CONEXIONES ESTABLES"
        titleId="node-5-success-title"
        titleRef={successTitleRef}
      />

      <div className="flex min-h-0 flex-1 items-center justify-center px-[12px] py-[9px]">
        <div className="w-full max-w-[700px] border-[4px] border-[#35d8ff] bg-[#17263a] p-[17px] text-center shadow-[0_7px_0_#080d16,0_11px_0_#f0ca63]">
          <div className="mb-[10px] inline-flex items-center gap-[7px] border-2 border-[#7a5c2e] bg-[#352b24] px-[9px] py-[6px] font-pixel text-[6px] leading-[1.5] text-[#f0ca63]">
            <span aria-hidden="true">★</span>
            4 / 4 RELACIONES CORRECTAS
            <span aria-hidden="true">★</span>
          </div>
          <h2 className="font-pixel text-[12px] leading-[1.8] text-[#fff3bd] [text-shadow:2px_2px_0_#080d16]">
            ¡ESTACIÓN ENLAZADA!
          </h2>
          <p className="mx-auto mt-[9px] max-w-[560px] font-pixel text-[7px] leading-[2] text-white">
            Has distinguido entre conectarse a una capacidad y seguir un procedimiento. Tu calificación quedó registrada; el Nodo 6 sigue disponible desde el mapa.
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

function TermDialog({ term, closeButtonRef, onClose, onBackdropClick }) {
  return (
    <div
      data-stage-interactive
      className="absolute inset-0 z-[70] grid place-items-center bg-[#080d16]/90 p-[32px]"
      onClick={onBackdropClick}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="node-5-term-title"
        aria-describedby="node-5-term-description"
        className="flex max-h-full w-full max-w-[650px] flex-col border-[5px] border-[#f0ca63] bg-[#101725] p-[14px] text-white shadow-[0_8px_0_#080d16,0_12px_24px_#000000b8] ring-4 ring-[#35d8ff]"
      >
        <header className="flex shrink-0 items-center justify-between gap-[10px] border-b-4 border-[#35d8ff] bg-[#17263a] px-[10px] py-[8px]">
          <span className="font-pixel text-[7px] leading-[1.7] text-[#9fe8f4]">
            GLOSARIO · ESTACIÓN DE CONEXIONES
          </span>
          <span className="border-2 border-[#7a5c2e] bg-[#f0ca63] px-[6px] py-[3px] font-pixel text-[6px] text-[#101725]">
            TÉRMINO CLAVE
          </span>
        </header>
        <h2
          id="node-5-term-title"
          className="mt-[11px] font-pixel text-[10px] leading-[1.8] text-[#fff3bd] [text-shadow:2px_2px_0_#080d16]"
        >
          {term.title}
        </h2>
        <div className="mt-[8px] max-h-[310px] overflow-y-auto border-l-[4px] border-[#35d8ff] bg-[#17263a] px-[12px] py-[10px]">
          <p
            id="node-5-term-description"
            className="font-pixel text-[7px] leading-[1.9] text-white"
          >
            {term.body}
          </p>
          {term.examples && (
            <ul aria-label="Ejemplos oficiales de servidores MCP" className="mt-[9px] grid grid-cols-2 gap-[7px]">
              {term.examples.map((example) => (
                <li key={example.title} className="border-2 border-[#40566d] bg-[#101725] px-[8px] py-[7px]">
                  <p className="font-pixel text-[6px] leading-[1.6] text-[#f0ca63]">
                    {example.title}
                  </p>
                  <p className="mt-[4px] font-pixel text-[6px] leading-[1.8] text-[#e5e7eb]">
                    {example.body}
                  </p>
                </li>
              ))}
            </ul>
          )}
          {term.citation && (
            <p className="mt-[8px] border-t border-[#40566d] pt-[6px] font-pixel text-[5px] leading-[1.7] text-[#9fe8f4]">
              {term.citation}
            </p>
          )}
        </div>
        <footer className="mt-[10px] flex shrink-0 items-center justify-between gap-[10px] border-t-2 border-[#40566d] pt-[8px]">
          <span className="font-pixel text-[5px] leading-[1.6] text-[#9fe8f4]">
            ESC PARA CERRAR · TÉRMINO AÑADIDO A TU REPASO
          </span>
          <button
            ref={closeButtonRef}
            type="button"
            data-stage-interactive
            onClick={onClose}
            className="min-h-[40px] border-2 border-[#080d16] bg-[#f0ca63] px-[11px] py-[7px] font-pixel text-[6px] leading-[1.5] text-[#101725] shadow-[0_3px_0_#080d16] transition-colors hover:bg-[#fff3bd] active:translate-y-[2px] active:shadow-[0_1px_0_#080d16] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            VOLVER A LA ESTACIÓN
          </button>
        </footer>
      </section>
    </div>
  );
}

export default function Nodo5({ active, onComplete, onExit }) {
  const [phase, setPhase] = useState("welcome");
  const [visibleCharacters, setVisibleCharacters] = useState(0);
  const [talkingFrameIndex, setTalkingFrameIndex] = useState(0);
  const [viewedTermIds, setViewedTermIds] = useState([]);
  const [selectedTermId, setSelectedTermId] = useState(null);
  const [selectedConceptId, setSelectedConceptId] = useState(null);
  const [assignments, setAssignments] = useState({});
  const [questionResults, setQuestionResults] = useState({});
  const [statusMessage, setStatusMessage] = useState("");
  const welcomeAudioRef = useRef(null);
  const welcomeButtonRef = useRef(null);
  const closeTermButtonRef = useRef(null);
  const termTriggerRef = useRef(null);
  const restoreTermFocusRef = useRef(false);
  const completionReportedRef = useRef(false);

  const isTyping =
    phase === "welcome" && visibleCharacters < NODE_5_INITIAL_DIALOGUE.length;
  const visibleText = NODE_5_INITIAL_DIALOGUE.slice(0, visibleCharacters);
  const isSpeaking = active && phase === "welcome" && isTyping;
  const talkingFrame = TALKING_ANIMATION.frames[talkingFrameIndex];
  const selectedTerm = NODE_5_TERMS.find((term) => term.id === selectedTermId);

  const finishTyping = useCallback(() => {
    if (!isTyping) return;

    const audio = welcomeAudioRef.current;
    audio?.pause();
    if (audio) audio.currentTime = 0;
    setVisibleCharacters(NODE_5_INITIAL_DIALOGUE.length);
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

  const selectConcept = useCallback((conceptId) => {
    if (assignments[conceptId] !== undefined) return;
    setSelectedConceptId(conceptId);
    const match = NODE_5_MATCHES.find((item) => item.id === conceptId);
    setStatusMessage(
      `Elegiste ${match?.label ?? "el concepto"}. Ahora selecciona su descripción.`,
    );
  }, [assignments]);

  const selectDescription = useCallback((descriptionId) => {
    if (!active || phase !== "quiz") return;
    if (!selectedConceptId) {
      setStatusMessage("Primero elige un concepto de la columna izquierda.");
      return;
    }

    const match = NODE_5_MATCHES.find((item) => item.id === selectedConceptId);
    if (!match) return;

    if (descriptionId !== selectedConceptId) {
      setQuestionResults((current) => ({
        ...current,
        [selectedConceptId]: "incorrect",
      }));
      setStatusMessage(`${match.incorrectFeedback} Vuelve a intentarlo.`);
      return;
    }

    const nextAssignments = {
      ...assignments,
      [selectedConceptId]: descriptionId,
    };
    const nextResults = {
      ...questionResults,
      [selectedConceptId]: "correct",
    };
    const nextCorrectCount = Object.keys(nextAssignments).length;

    setAssignments(nextAssignments);
    setQuestionResults(nextResults);
    setSelectedConceptId(null);

    if (nextCorrectCount === NODE_5_MATCHES.length) {
      setStatusMessage("¡4 DE 4 CORRECTAS! CALIFICACIÓN: 5.0 / 5.0.");
      setPhase("success");
      if (!completionReportedRef.current) {
        completionReportedRef.current = true;
        onComplete?.(5, PASSING_GRADE);
      }
      return;
    }

    setStatusMessage(`${match.correctFeedback} ${nextCorrectCount} de 4 relaciones correctas.`);
  }, [active, assignments, onComplete, phase, questionResults, selectedConceptId]);

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
    setSelectedConceptId(null);
    setAssignments({});
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
      // La reproducción automática puede estar bloqueada por el navegador.
    });

    return () => {
      audio.pause();
      audio.currentTime = 0;
    };
  }, [active, phase]);

  useEffect(() => {
    if (!active || phase !== "welcome" || !isTyping) return undefined;

    const previousCharacter = NODE_5_INITIAL_DIALOGUE[visibleCharacters - 1];
    const delay = /[.!?,;:]/.test(previousCharacter ?? "")
      ? TYPEWRITER_PAUSE_DELAY
      : TYPEWRITER_CHARACTER_DELAY;
    const timer = window.setTimeout(() => {
      setVisibleCharacters((current) =>
        Math.min(current + 1, NODE_5_INITIAL_DIALOGUE.length),
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
        event.preventDefault();
        closeTermButtonRef.current?.focus();
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
      <audio ref={welcomeAudioRef} src={nodeFiveIntroAudio} preload="auto" />

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
                <span className="text-[#9fe8f4]">ESTACIÓN DE CONEXIONES</span>
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
                  : "ESPACIO O CLIC: ABRIR LOS BLOQUES"}
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
          assignments={assignments}
          questionResults={questionResults}
          selectedConceptId={selectedConceptId}
          statusMessage={statusMessage}
          onSelectConcept={selectConcept}
          onSelectDescription={selectDescription}
        />
      )}

      {phase === "success" && <SuccessView onExit={continueFromSuccess} />}

      {selectedTerm && (
        <TermDialog
          term={selectedTerm}
          closeButtonRef={closeTermButtonRef}
          onClose={closeTerm}
          onBackdropClick={(event) => {
            if (event.target === event.currentTarget) closeTerm();
          }}
        />
      )}
    </div>
  );
}
