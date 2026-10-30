import { useCallback, useEffect, useRef, useState } from "react";
import Avatar from "../components/Avatar.jsx";
import { MUDEK } from "../data/avatars.js";
import { MUDEK_ANIMATIONS } from "../data/mudekAnimations.js";
import {
  NODE_2_CASES,
  NODE_2_GLOSSARY,
  NODE_2_INITIAL_DIALOGUE,
  NODE_2_PHASES,
  NODE_2_QUIZ_CASE_ORDER,
  NODE_2_READING_BLOCKS,
} from "../data/nodo2.js";
import nodeTwoIntroAudio from "../assets/audio/Nodo-2-1.mp3";

const PASSING_GRADE = 5.0;
const TYPEWRITER_CHARACTER_DELAY = 50;
const TYPEWRITER_PAUSE_DELAY = 110;
const STAGE_WIDTH = 1024;
const STAGE_HEIGHT = 599;
const TALKING_ANIMATION = MUDEK_ANIMATIONS.hablar;

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

function findPhaseAtPoint(event) {
  const target = document
    .elementFromPoint(event.clientX, event.clientY)
    ?.closest?.("[data-case-drop-target]");

  return target?.dataset.caseDropTarget ?? null;
}

function openCasePopup(item, onOpenInfo) {
  const phase = NODE_2_PHASES.find((candidate) => candidate.id === item.phaseId);

  onOpenInfo({
    type: "info",
    eyebrow: `CASO REAL · ${phase?.label.toUpperCase() ?? "CICLO DE SOFTWARE"}`,
    title: item.popupTitle,
    body: item.popupBody,
  });
}

function Node2Reading({ onOpenInfo, onStartQuiz }) {
  const readingTitleRef = useRef(null);

  useEffect(() => {
    readingTitleRef.current?.focus();
  }, []);

  return (
    <section
      data-stage-interactive
      aria-labelledby="node-2-reading-title"
      className="absolute bottom-[18px] left-[252px] right-[22px] top-[18px] z-30 flex flex-col gap-[9px] border-[5px] border-[#f0ca63] bg-[#101725] px-[12px] py-[10px] text-white shadow-[0_8px_0_#080d16,0_12px_24px_#000000b8] ring-4 ring-[#35d8ff]/80"
    >
      <header className="flex shrink-0 items-center justify-between gap-[10px] border-b-4 border-[#35d8ff] bg-[#17263a] px-[10px] py-[7px] shadow-[inset_0_2px_0_#2c4965]">
        <div>
          <p className="mb-[4px] font-pixel text-[6px] leading-[1.6] text-[#9fe8f4]">
            NODO 02 · OFICINA DEL DESARROLLADOR
          </p>
          <h1
            ref={readingTitleRef}
            id="node-2-reading-title"
            tabIndex={-1}
            className="font-pixel text-[9px] leading-[1.7] text-[#fff3bd] [text-shadow:2px_2px_0_#080d16] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#35d8ff]"
          >
            IA EN EL CICLO DE SOFTWARE
          </h1>
        </div>
        <span className="shrink-0 border-2 border-[#7a5c2e] bg-[#f0ca63] px-[8px] py-[5px] font-pixel text-[6px] leading-[1.6] text-[#211922] shadow-[2px_2px_0_#080d16]">
          LECTURAS A + B
        </span>
      </header>

      <div className="grid min-h-0 flex-1 grid-cols-2 gap-[8px]">
        {NODE_2_READING_BLOCKS.map((block) => (
          <article
            key={block.id}
            className="flex min-h-0 flex-col border-2 border-[#52616a] bg-[#17263a] px-[9px] py-[8px] shadow-[inset_0_2px_0_#2c4965]"
          >
            <header className="flex shrink-0 items-center gap-[8px] border-b border-[#40566d] pb-[8px]">
              <span className="grid size-[30px] shrink-0 place-items-center border-2 border-[#7a5c2e] bg-[#f0ca63] font-pixel text-[11px] text-[#101725] shadow-[2px_2px_0_#080d16]">
                {block.marker}
              </span>
              <span className="min-w-0">
                <span className="block font-pixel text-[6px] leading-[1.6] text-[#35d8ff]">
                  {block.eyebrow}
                </span>
                <span className="block font-pixel text-[7px] leading-[1.7] text-[#fff3bd]">
                  {block.title}
                </span>
              </span>
            </header>

            <p className="mt-[10px] max-w-[310px] font-pixel text-[7px] leading-[2] text-white [text-shadow:1px_1px_0_#080d16]">
              {block.text}
            </p>

            {block.id === "human-loop" && (
              <div
                role="group"
                aria-label="Datos de colaboración en WhatsApp y desarrollo científico"
                className="mt-[12px] border border-[#40566d] bg-[#101725] px-[8px] py-[8px]"
              >
                <div className="mb-[5px] flex items-center justify-between gap-[6px] font-pixel text-[6px] leading-[1.7]">
                  <span className="text-[#9fe8f4]">60 % · UN CLIC</span>
                  <span className="text-[#f0ca63]">40 % · REVISIÓN</span>
                </div>
                <div aria-hidden="true" className="flex h-[10px] overflow-hidden border border-[#080d16]">
                  <span className="h-full w-[60%] bg-[#35d8ff]" />
                  <span className="h-full w-[40%] bg-[#f0ca63]" />
                </div>
                <p className="mt-[6px] font-pixel text-[5px] leading-[1.7] text-[#d8e1e5]">
                  WhatsApp · 25 meses (Mao et al., 2026)
                </p>
                <p className="mt-[4px] border-t border-[#40566d] pt-[5px] font-pixel text-[6px] leading-[1.7] text-[#d8e1e5]">
                  Microscopio · meses → 3 semanas (Wang et al., 2026)
                </p>
              </div>
            )}

            <div className="mt-auto flex flex-wrap gap-[5px] pt-[10px]">
              {block.glossaryIds.map((glossaryId) => {
                const term = NODE_2_GLOSSARY.find(
                  (candidate) => candidate.id === glossaryId,
                );
                if (!term) return null;

                return (
                  <button
                    key={term.id}
                    type="button"
                    aria-label={`Abrir término clave: ${term.term}`}
                    aria-haspopup="dialog"
                    onClick={() =>
                      onOpenInfo({
                        type: "info",
                        eyebrow: "TÉRMINO CLAVE",
                        title: term.term,
                        body: term.definition,
                      })
                    }
                    className="flex min-h-[36px] items-center gap-[5px] border border-[#35d8ff] bg-[#101725] px-[6px] py-[5px] font-pixel text-[6px] leading-[1.5] text-[#dffaff] shadow-[2px_2px_0_#080d16] transition-colors hover:bg-[#203950] active:translate-y-[1px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                  >
                    <span
                      aria-hidden="true"
                      className="grid size-[18px] shrink-0 place-items-center border border-[#7a5c2e] bg-[#f0ca63] text-[9px] text-[#101725]"
                    >
                      +
                    </span>
                    {term.term}
                  </button>
                );
              })}
            </div>
          </article>
        ))}
      </div>

      <section aria-labelledby="node-2-cases-title" className="shrink-0">
        <header className="mb-[5px] flex items-center justify-between gap-[8px]">
          <h2
            id="node-2-cases-title"
            className="font-pixel text-[6px] leading-[1.6] text-[#f0ca63]"
          >
            EXPLORA UN CASO POR FASE · PULSA +
          </h2>
        </header>
        <div className="grid grid-cols-5 gap-[5px]">
          {NODE_2_CASES.map((item) => {
            const phase = NODE_2_PHASES.find(
              (candidate) => candidate.id === item.phaseId,
            );

            return (
              <article
                key={item.id}
                className="flex min-h-[72px] flex-col border-2 border-[#40566d] bg-[#17263a] px-[6px] py-[5px] shadow-[2px_2px_0_#080d16]"
              >
                <p className="truncate font-pixel text-[5px] leading-[1.6] text-[#35d8ff]">
                  {phase?.shortLabel.toUpperCase()}
                </p>
                <div className="flex min-h-0 flex-1 items-center justify-between gap-[4px]">
                  <p className="min-w-0 font-pixel text-[6px] leading-[1.6] text-white">
                    {item.teaser}
                  </p>
                  <button
                    type="button"
                    aria-label={`Abrir caso real: ${item.popupTitle}`}
                    aria-haspopup="dialog"
                    onClick={() => openCasePopup(item, onOpenInfo)}
                    className="grid size-[36px] shrink-0 place-items-center border-2 border-[#7a5c2e] bg-[#f0ca63] font-pixel text-[11px] text-[#101725] shadow-[0_3px_0_#080d16] transition-colors hover:bg-[#fff3bd] active:translate-y-[2px] active:shadow-[0_1px_0_#080d16] focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-white"
                  >
                    +
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <footer className="flex shrink-0 items-center justify-between gap-[10px] border-t-4 border-[#35d8ff] bg-[#17263a] px-[9px] py-[6px] shadow-[inset_0_2px_0_#2c4965]">
        <p className="font-pixel text-[6px] leading-[1.7] text-[#d8e1e5]">
          CUANDO ESTÉS LISTO, APLICA LAS IDEAS EN EL RETO.
        </p>
        <button
          type="button"
          onClick={onStartQuiz}
          className="min-h-[44px] shrink-0 border-2 border-[#241923] bg-[#f0ca63] px-[10px] py-[7px] font-pixel text-[6px] leading-[1.5] text-[#101725] shadow-[0_3px_0_#080d16] transition-colors hover:bg-[#fff3bd] active:translate-y-[2px] active:shadow-[0_1px_0_#080d16] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        >
          INICIAR RETO →
        </button>
      </footer>
    </section>
  );
}

function Node2Quiz({
  assignments,
  completedCount,
  selectedCaseId,
  quizStatus,
  draggedCaseId,
  hoveredPhaseId,
  onCaseActivate,
  onCasePointerDown,
  onCasePointerMove,
  onCasePointerUp,
  onCasePointerCancel,
  onPhaseClick,
}) {
  const quizTitleRef = useRef(null);
  const assignedCaseIds = new Set(Object.values(assignments));
  const orderedCases = NODE_2_QUIZ_CASE_ORDER.map((caseId) =>
    NODE_2_CASES.find((item) => item.id === caseId),
  ).filter((item) => item && !assignedCaseIds.has(item.id));

  useEffect(() => {
    quizTitleRef.current?.focus();
  }, []);

  return (
    <section
      data-stage-interactive
      aria-labelledby="node-2-quiz-title"
      className="absolute bottom-[20px] left-[252px] right-[22px] top-[20px] z-30 flex flex-col border-[5px] border-[#f0ca63] bg-[#101725] px-[12px] py-[10px] text-white shadow-[0_8px_0_#080d16,0_12px_24px_#000000b8] ring-4 ring-[#35d8ff]/80"
    >
      <header className="mb-[8px] flex shrink-0 items-center justify-between gap-[12px] border-b-4 border-[#35d8ff] bg-[#17263a] px-[10px] py-[7px] shadow-[inset_0_2px_0_#2c4965]">
        <div className="min-w-0">
          <p className="mb-[4px] font-pixel text-[6px] leading-[1.6] text-[#9fe8f4]">
            MINIEVALUACIÓN · NODO 02
          </p>
          <h1
            ref={quizTitleRef}
            id="node-2-quiz-title"
            tabIndex={-1}
            className="font-pixel text-[9px] leading-[1.7] text-[#fff3bd] [text-shadow:2px_2px_0_#080d16] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#35d8ff]"
          >
            Relaciona caso y fase
          </h1>
          <p
            id="node-2-quiz-instructions"
            className="mt-[3px] font-pixel text-[6px] leading-[1.7] text-[#e5e7eb]"
          >
            Arrastra un caso o selecciónalo y elige una fase.
          </p>
        </div>
        <div className="w-[118px] shrink-0 border-2 border-[#40566d] bg-[#101725] px-[7px] py-[5px]">
          <div className="mb-[4px] flex items-center justify-between gap-[5px] font-pixel text-[6px] leading-[1.5]">
            <span className="text-[#9fe8f4]">ACERTADOS</span>
            <span className="text-[#f0ca63]">
              {completedCount}/{NODE_2_CASES.length}
            </span>
          </div>
          <div
            role="progressbar"
            aria-label="Casos ubicados correctamente"
            aria-valuemin={0}
            aria-valuemax={NODE_2_CASES.length}
            aria-valuenow={completedCount}
            aria-valuetext={`${completedCount} de ${NODE_2_CASES.length} casos correctos`}
            className="h-[8px] border border-[#52616a] bg-[#080d16] p-[1px]"
          >
            <span
              className="block h-full bg-[#35d8ff] transition-[width] duration-150"
              style={{ width: `${(completedCount / NODE_2_CASES.length) * 100}%` }}
            />
          </div>
        </div>
      </header>

      <div className="grid min-h-0 flex-1 grid-cols-[0.94fr_1.06fr] gap-[9px]">
        <section
          aria-labelledby="node-2-case-bank-title"
          className="flex min-h-0 flex-col"
        >
          <h2
            id="node-2-case-bank-title"
            className="mb-[5px] shrink-0 border-b-2 border-[#40566d] pb-[4px] font-pixel text-[6px] leading-[1.6] text-[#f0ca63]"
          >
            CASOS
          </h2>
          <ol
            aria-label="Casos para clasificar"
            className="flex min-h-0 flex-1 flex-col gap-[5px]"
          >
            {orderedCases.map((item) => {
              const isSelected = selectedCaseId === item.id;
              const isDragging = draggedCaseId === item.id;
              const originalPosition =
                NODE_2_QUIZ_CASE_ORDER.indexOf(item.id) + 1;

              return (
                <li key={item.id} className="flex min-h-0 flex-1">
                  <button
                    type="button"
                    aria-pressed={isSelected}
                    aria-describedby="node-2-quiz-instructions"
                    onClick={(event) => onCaseActivate(item.id, event)}
                    onPointerDown={(event) => onCasePointerDown(event, item.id)}
                    onPointerMove={onCasePointerMove}
                    onPointerUp={onCasePointerUp}
                    onPointerCancel={onCasePointerCancel}
                    className={`flex min-h-[48px] w-full touch-none select-none items-center gap-[7px] border-2 px-[7px] py-[5px] text-left outline-none transition-colors focus-visible:border-white focus-visible:ring-2 focus-visible:ring-white ${isDragging ? "border-dashed border-[#f0ca63] bg-[#37404a] opacity-35" : isSelected ? "border-[#f0ca63] bg-[#263945] ring-1 ring-[#f0ca63]" : "border-[#52616a] bg-[#1b2b32] hover:border-[#35d8ff]"} cursor-grab active:cursor-grabbing`}
                  >
                    <span className="grid size-[23px] shrink-0 place-items-center border border-[#7a5c2e] bg-[#352b24] font-pixel text-[7px] text-[#f0ca63]">
                      {String(originalPosition).padStart(2, "0")}
                    </span>
                    <span className="flex-1 font-pixel text-[6px] leading-[1.8] text-white">
                      {item.label}
                    </span>
                    <span
                      aria-hidden="true"
                      className="shrink-0 font-pixel text-[6px] text-[#9fe8f4]"
                    >
                      ↕
                    </span>
                  </button>
                </li>
              );
            })}
          </ol>
        </section>

        <section
          aria-labelledby="node-2-phase-title"
          className="flex min-h-0 flex-col"
        >
          <h2
            id="node-2-phase-title"
            className="mb-[5px] shrink-0 border-b-2 border-[#40566d] pb-[4px] font-pixel text-[6px] leading-[1.6] text-[#35d8ff]"
          >
            FASES DEL CICLO
          </h2>
          <ol
            aria-label="Fases del ciclo de vida del software"
            className="flex min-h-0 flex-1 flex-col gap-[5px]"
          >
            {NODE_2_PHASES.map((phase, index) => {
              const assignedCase = NODE_2_CASES.find(
                (item) => item.id === assignments[phase.id],
              );
              const isDropTarget =
                hoveredPhaseId === phase.id && !assignedCase;

              return (
                <li key={phase.id} className="flex min-h-0 flex-1">
                  <button
                    type="button"
                    disabled={Boolean(assignedCase)}
                    data-case-drop-target={
                      assignedCase ? undefined : phase.id
                    }
                    aria-label={
                      assignedCase
                        ? `${phase.label}. Correcto: ${assignedCase.label}`
                        : `${phase.label}. Colocar aquí el caso seleccionado.`
                    }
                    aria-describedby="node-2-quiz-instructions"
                    onClick={() => onPhaseClick(phase.id)}
                    className={`flex min-h-[48px] w-full items-center gap-[8px] border-2 px-[8px] py-[5px] text-left outline-none transition-colors focus-visible:border-white focus-visible:ring-2 focus-visible:ring-white disabled:cursor-default ${assignedCase ? "border-[#79cf8a] bg-[#1c3d35]" : isDropTarget ? "border-[#f0ca63] bg-[#263945] ring-1 ring-[#35d8ff]" : "border-[#52616a] bg-[#17263a] hover:border-[#35d8ff]"}`}
                  >
                    <span
                      aria-hidden="true"
                      className={`grid size-[26px] shrink-0 place-items-center border-2 font-pixel text-[7px] ${assignedCase ? "border-[#79cf8a] bg-[#79cf8a] text-[#101725]" : "border-[#52616a] bg-[#101725] text-[#f0ca63]"}`}
                    >
                      {assignedCase ? "✓" : String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="min-w-0 flex-1 font-pixel text-[6px] leading-[1.7] text-[#fff3bd]">
                      {phase.shortLabel.toUpperCase()}
                    </span>
                    {assignedCase ? (
                      <span className="max-w-[145px] font-pixel text-[5px] leading-[1.6] text-[#d9ffe0]">
                        {assignedCase.teaser}
                      </span>
                    ) : (
                      <span
                        aria-hidden="true"
                        className="grid size-[25px] shrink-0 place-items-center border border-dashed border-[#718596] font-pixel text-[7px] text-[#9daeba]"
                      >
                        +
                      </span>
                    )}
                  </button>
                </li>
              );
            })}
          </ol>
        </section>
      </div>

      <footer className="mt-[8px] flex shrink-0 items-center justify-between gap-[10px] border-t-4 border-[#35d8ff] bg-[#17263a] px-[9px] py-[6px] shadow-[inset_0_2px_0_#2c4965]">
        <p
          role="status"
          aria-live="polite"
          aria-atomic="true"
          className="min-h-[18px] font-pixel text-[6px] leading-[1.7] text-[#d8e1e5]"
        >
          {quizStatus}
        </p>
        <span className="shrink-0 font-pixel text-[5px] leading-[1.7] text-[#f0ca63]">
          ESPACIO ELIGE · TAB AVANZA · ENTER COLOCA
        </span>
      </footer>
    </section>
  );
}

function Node2Modal({ modal, onClose }) {
  const closeButtonRef = useRef(null);
  const isFeedback = modal.type === "feedback";
  const isCorrect = modal.isCorrect;
  const eyebrowColor = isFeedback
    ? isCorrect
      ? "text-[#9fe8f4]"
      : "text-[#ffd18c]"
    : "text-[#9fe8f4]";

  useEffect(() => {
    const previousFocus = document.activeElement;
    closeButtonRef.current?.focus();

    return () => {
      if (modal.type === "feedback" && modal.isComplete) return;
      if (
        previousFocus instanceof HTMLElement &&
        previousFocus.isConnected &&
        !previousFocus.disabled &&
        previousFocus !== document.body
      ) {
        previousFocus.focus();
      } else if (modal.type === "feedback") {
        document.getElementById("node-2-quiz-title")?.focus();
      }
    };
  }, [modal]);

  return (
    <div
      data-stage-interactive
      className="absolute inset-0 z-[90] grid place-items-center bg-[#080d16]/85 px-[34px] py-[24px]"
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="node-2-modal-title"
        aria-describedby="node-2-modal-description"
        onKeyDown={(event) => {
          if (event.key !== "Tab") return;
          event.preventDefault();
          closeButtonRef.current?.focus();
        }}
        className="flex max-h-full w-full max-w-[600px] flex-col border-[5px] border-[#f0ca63] bg-[#101725] p-[15px] text-white shadow-[0_9px_0_#080d16,0_14px_28px_#000000c9] ring-4 ring-[#35d8ff]/80"
      >
        <header className="flex shrink-0 items-center gap-[11px] border-b-4 border-[#35d8ff] bg-[#17263a] px-[10px] py-[9px] shadow-[inset_0_2px_0_#2c4965]">
          <span
            aria-hidden="true"
            className={`grid size-[31px] shrink-0 place-items-center border-2 font-pixel text-[11px] ${isFeedback && !isCorrect ? "border-[#a85a42] bg-[#6a342e] text-[#ffe0bd]" : "border-[#7a5c2e] bg-[#f0ca63] text-[#101725]"}`}
          >
            {isFeedback ? (isCorrect ? "✓" : "!") : "+"}
          </span>
          <div className="min-w-0">
            <p className={`mb-[4px] font-pixel text-[6px] leading-[1.6] ${eyebrowColor}`}>
              {modal.eyebrow}
            </p>
            <h2
              id="node-2-modal-title"
              className="font-pixel text-[8px] leading-[1.8] text-[#fff3bd] [text-shadow:2px_2px_0_#080d16]"
            >
              {modal.title}
            </h2>
          </div>
        </header>

        <p id="node-2-modal-description" className="my-[14px] overflow-y-auto border-l-[4px] border-[#35d8ff] bg-[#17263a] px-[12px] py-[10px] font-pixel text-[7px] leading-[2] text-white [text-shadow:1px_1px_0_#080d16]">
          {modal.body}
        </p>

        {isFeedback && modal.isComplete && (
          <p className="mb-[10px] border-2 border-[#7a5c2e] bg-[#352b24] px-[9px] py-[7px] font-pixel text-[6px] leading-[1.7] text-[#f0ca63]">
            5 DE 5 CASOS CORRECTOS · CALIFICACIÓN MÁXIMA
          </p>
        )}

        <footer className="flex shrink-0 justify-end border-t-2 border-[#40566d] pt-[9px]">
          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            className="min-h-[44px] border-2 border-[#241923] bg-[#f0ca63] px-[12px] py-[7px] font-pixel text-[6px] leading-[1.6] text-[#101725] shadow-[0_3px_0_#080d16] transition-colors hover:bg-[#fff3bd] active:translate-y-[2px] active:shadow-[0_1px_0_#080d16] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            {modal.actionLabel ?? "CERRAR VENTANA"}
          </button>
        </footer>
      </section>
    </div>
  );
}

function Node2Success({ onExit }) {
  const exitButtonRef = useRef(null);

  useEffect(() => {
    exitButtonRef.current?.focus();
  }, []);

  return (
    <section
      data-stage-interactive
      aria-labelledby="node-2-success-title"
      className="absolute bottom-[52px] left-[252px] right-[22px] top-[52px] z-30 flex flex-col justify-between border-[5px] border-[#f0ca63] bg-[#101725] px-[16px] py-[14px] text-white shadow-[0_8px_0_#080d16,0_12px_24px_#000000b8] ring-4 ring-[#35d8ff]/80"
    >
      <header className="border-b-4 border-[#35d8ff] bg-[#17263a] px-[13px] py-[11px] shadow-[inset_0_2px_0_#2c4965]">
        <p className="mb-[7px] font-pixel text-[6px] leading-[1.7] text-[#9fe8f4]">
          NODO 02 · EVALUACIÓN COMPLETADA
        </p>
        <h1
          id="node-2-success-title"
          className="font-pixel text-[11px] leading-[1.8] text-[#fff3bd] [text-shadow:2px_2px_0_#080d16]"
        >
          ¡CICLO COMPLETO!
        </h1>
      </header>

      <div className="flex flex-1 flex-col justify-center gap-[14px] px-[10px] py-[12px]">
        <div className="flex items-center gap-[16px]">
          <div className="grid size-[102px] shrink-0 place-items-center border-[4px] border-[#f0ca63] bg-[#352b24] font-pixel text-[20px] text-[#f0ca63] shadow-[5px_5px_0_#080d16,0_0_0_4px_#35d8ff]">
            {PASSING_GRADE.toFixed(1)}
          </div>
          <div className="max-w-[430px] border-l-[4px] border-[#35d8ff] pl-[13px]">
            <p className="mb-[8px] font-pixel text-[8px] leading-[1.8] text-[#f0ca63]">
              CALIFICACIÓN DEL MÓDULO: 5.0 / 5.0
            </p>
            <p className="font-pixel text-[7px] leading-[2] text-white">
              Ubicaste correctamente los cinco casos. El siguiente módulo ya
              está desbloqueado: vuelve al mapa para continuar.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-5 gap-[6px]">
          {NODE_2_PHASES.map((phase, index) => (
            <div
              key={phase.id}
              className="border-2 border-[#79cf8a] bg-[#1c3d35] px-[6px] py-[7px] text-center shadow-[2px_2px_0_#080d16]"
            >
              <span className="mb-[4px] block font-pixel text-[7px] text-[#bfffc6]">
                0{index + 1} · ✓
              </span>
              <span className="block font-pixel text-[5px] leading-[1.6] text-white">
                {phase.shortLabel.toUpperCase()}
              </span>
            </div>
          ))}
        </div>
      </div>

      <footer className="flex items-center justify-between gap-[12px] border-t-4 border-[#35d8ff] bg-[#17263a] px-[12px] py-[9px] shadow-[inset_0_2px_0_#2c4965]">
        <p className="font-pixel text-[6px] leading-[1.7] text-[#9fe8f4]">
          ESPACIO O CLIC: VOLVER AL MAPA
        </p>
        <button
          ref={exitButtonRef}
          type="button"
          onClick={onExit}
          className="min-h-[42px] shrink-0 border-2 border-[#241923] bg-[#f0ca63] px-[13px] py-[8px] font-pixel text-[7px] leading-[1.5] text-[#101725] shadow-[0_4px_0_#080d16] transition-colors hover:bg-[#fff3bd] active:translate-y-[3px] active:shadow-[0_1px_0_#080d16] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        >
          VOLVER AL MAPA
        </button>
      </footer>
    </section>
  );
}

export default function Nodo2({ active, onComplete, onExit }) {
  const [phase, setPhase] = useState("welcome");
  const [visibleCharacters, setVisibleCharacters] = useState(0);
  const [talkingFrameIndex, setTalkingFrameIndex] = useState(0);
  const [activeModal, setActiveModal] = useState(null);
  const [assignments, setAssignments] = useState({});
  const [selectedCaseId, setSelectedCaseId] = useState(null);
  const [quizStatus, setQuizStatus] = useState("Elige un caso para comenzar.");
  const [draggedCaseId, setDraggedCaseId] = useState(null);
  const [hoveredPhaseId, setHoveredPhaseId] = useState(null);
  const [dragPreview, setDragPreview] = useState(null);
  const introAudioRef = useRef(null);
  const dragRef = useRef(null);
  const welcomeDialogueRef = useRef(null);

  const isTyping =
    phase === "welcome" && visibleCharacters < NODE_2_INITIAL_DIALOGUE.length;
  const visibleText = NODE_2_INITIAL_DIALOGUE.slice(0, visibleCharacters);
  const isSpeaking = active && isTyping;
  const talkingFrame = TALKING_ANIMATION.frames[talkingFrameIndex];
  const completedCount = Object.keys(assignments).length;
  const draggedCase = NODE_2_CASES.find(
    (item) => item.id === draggedCaseId,
  );

  const finishTyping = useCallback(() => {
    if (!isTyping) return;

    const audio = introAudioRef.current;
    audio?.pause();
    if (audio) audio.currentTime = 0;
    setVisibleCharacters(NODE_2_INITIAL_DIALOGUE.length);
  }, [isTyping]);

  const advanceWelcome = useCallback(() => {
    if (!active || phase !== "welcome") return;
    if (isTyping) {
      finishTyping();
      return;
    }
    setPhase("reading");
  }, [active, finishTyping, isTyping, phase]);

  const openInfoPopup = useCallback((popup) => {
    setActiveModal(popup);
  }, []);

  const startQuiz = useCallback(() => {
    if (!active || phase !== "reading" || activeModal) return;
    setPhase("quiz");
  }, [active, activeModal, phase]);

  const closeModal = useCallback(() => {
    if (activeModal?.type === "feedback" && activeModal.isComplete) {
      onComplete?.(2, PASSING_GRADE);
      setPhase("success");
    } else if (activeModal?.type === "feedback") {
      setQuizStatus(
        activeModal.isCorrect
          ? `${completedCount} de ${NODE_2_CASES.length} casos correctos. Continúa.`
          : "Ese intento no se contó. Prueba otra fase.",
      );
    }
    setActiveModal(null);
    setSelectedCaseId(null);
  }, [activeModal, completedCount, onComplete]);

  const placeCase = useCallback(
    (caseId, phaseId) => {
      if (!active || phase !== "quiz" || activeModal || !phaseId) return;

      const item = NODE_2_CASES.find((candidate) => candidate.id === caseId);
      const targetPhase = NODE_2_PHASES.find(
        (candidate) => candidate.id === phaseId,
      );
      const correctPhase = NODE_2_PHASES.find(
        (candidate) => candidate.id === item?.phaseId,
      );

      if (
        !item ||
        !targetPhase ||
        !correctPhase ||
        assignments[phaseId] ||
        Object.values(assignments).includes(caseId)
      ) {
        return;
      }

      setSelectedCaseId(null);

      if (item.phaseId !== phaseId) {
        setActiveModal({
          type: "feedback",
          isCorrect: false,
          eyebrow: "REVISIÓN NECESARIA",
          title: "Este caso va en otra fase",
          body: `Este caso pertenece a «${correctPhase.label}», no a «${targetPhase.label}». Vuelve a intentarlo; todavía no cuenta como acierto.`,
          actionLabel: "VOLVER A INTENTAR",
        });
        return;
      }

      const nextAssignments = { ...assignments, [phaseId]: caseId };
      const isComplete = Object.keys(nextAssignments).length === NODE_2_CASES.length;
      setAssignments(nextAssignments);
      setActiveModal({
        type: "feedback",
        isCorrect: true,
        isComplete,
        eyebrow: `ACIERTO · ${Object.keys(nextAssignments).length}/${NODE_2_CASES.length}`,
        title: `${item.id === "operations" ? "Operación" : targetPhase.label} ✔`,
        body: item.feedback,
        actionLabel: isComplete ? "VER CALIFICACIÓN" : "SEGUIR CON LOS CASOS",
      });
    }, [active, activeModal, assignments, phase],
  );

  const toggleCaseSelection = useCallback(
    (caseId) => {
      const nextCaseId = selectedCaseId === caseId ? null : caseId;
      const item = NODE_2_CASES.find((candidate) => candidate.id === nextCaseId);
      setSelectedCaseId(nextCaseId);
      setQuizStatus(
        item
          ? `Seleccionado: ${item.teaser}. Elige una fase.`
          : "Selección cancelada. Elige otro caso.",
      );
    },
    [selectedCaseId],
  );

  const selectCase = useCallback(
    (caseId, event) => {
      // Pointer selections are handled on pointer-up; detail 0 is keyboard/AT.
      if (event.detail !== 0) return;
      toggleCaseSelection(caseId);
    },
    [toggleCaseSelection],
  );

  const startDraggingCase = useCallback(
    (event, caseId) => {
      if (
        !active ||
        phase !== "quiz" ||
        activeModal ||
        (event.button !== 0 && event.pointerType !== "touch")
      ) {
        return;
      }

      event.stopPropagation();
      const pointer = getStagePointerPosition(event);
      const bounds = event.currentTarget.getBoundingClientRect();
      dragRef.current = {
        caseId,
        pointerId: event.pointerId,
        originX: pointer.x,
        originY: pointer.y,
        offsetX: (event.clientX - bounds.left) / pointer.scaleX,
        offsetY: (event.clientY - bounds.top) / pointer.scaleY,
        width: bounds.width / pointer.scaleX,
        height: bounds.height / pointer.scaleY,
        moved: false,
      };

      try {
        event.currentTarget.setPointerCapture(event.pointerId);
      } catch {
        // Pointer capture is best-effort; the case can also be selected by click.
      }
    },
    [active, activeModal, phase],
  );

  const moveDraggedCase = useCallback((event) => {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;

    const pointer = getStagePointerPosition(event);
    if (
      !drag.moved &&
      Math.hypot(pointer.x - drag.originX, pointer.y - drag.originY) < 4
    ) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();
    drag.moved = true;
    setSelectedCaseId(drag.caseId);
    setDraggedCaseId(drag.caseId);
    setHoveredPhaseId(findPhaseAtPoint(event));
    setDragPreview({
      left: pointer.x - drag.offsetX,
      top: pointer.y - drag.offsetY,
      width: drag.width,
      height: drag.height,
    });
  }, []);

  const finishDraggingCase = useCallback(
    (event) => {
      const drag = dragRef.current;
      if (!drag || drag.pointerId !== event.pointerId) return;

      event.stopPropagation();
      const didMove = drag.moved;
      const targetPhaseId = didMove ? findPhaseAtPoint(event) : null;
      dragRef.current = null;
      setDraggedCaseId(null);
      setHoveredPhaseId(null);
      setDragPreview(null);

      if (didMove) {
        setSelectedCaseId(null);
        if (targetPhaseId) {
          placeCase(drag.caseId, targetPhaseId);
        } else {
          setQuizStatus("Suelta el caso dentro de una fase para ubicarlo.");
        }
      } else {
        toggleCaseSelection(drag.caseId);
      }

      try {
        if (event.currentTarget.hasPointerCapture(event.pointerId)) {
          event.currentTarget.releasePointerCapture(event.pointerId);
        }
      } catch {
        // The browser may already have released pointer capture.
      }
    },
    [placeCase, toggleCaseSelection],
  );

  const cancelDraggingCase = useCallback((event) => {
    if (dragRef.current?.pointerId !== event.pointerId) return;
    dragRef.current = null;
    setDraggedCaseId(null);
    setHoveredPhaseId(null);
    setDragPreview(null);
  }, []);

  const placeSelectedCase = useCallback(
    (phaseId) => {
      if (selectedCaseId) {
        placeCase(selectedCaseId, phaseId);
      } else {
        setQuizStatus("Selecciona un caso antes de elegir la fase.");
      }
    },
    [placeCase, selectedCaseId],
  );

  const exitSuccess = useCallback(() => {
    if (!active || phase !== "success") return;
    onExit?.();
  }, [active, onExit, phase]);

  useEffect(() => {
    if (active) return;

    setPhase("welcome");
    setVisibleCharacters(0);
    setTalkingFrameIndex(0);
    setActiveModal(null);
    setAssignments({});
    setSelectedCaseId(null);
    setQuizStatus("Elige un caso para comenzar.");
    setDraggedCaseId(null);
    setHoveredPhaseId(null);
    setDragPreview(null);
    dragRef.current = null;
  }, [active]);

  useEffect(() => {
    if (active && phase === "welcome") {
      welcomeDialogueRef.current?.focus();
    }
  }, [active, phase]);

  useEffect(() => {
    const audio = introAudioRef.current;
    if (!audio) return undefined;

    if (!active || phase !== "welcome") {
      audio.pause();
      audio.currentTime = 0;
      return undefined;
    }

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

    const previousCharacter = NODE_2_INITIAL_DIALOGUE[visibleCharacters - 1];
    const delay = /[.!?,;:]/.test(previousCharacter ?? "")
      ? TYPEWRITER_PAUSE_DELAY
      : TYPEWRITER_CHARACTER_DELAY;
    const timer = window.setTimeout(() => {
      setVisibleCharacters((current) =>
        Math.min(current + 1, NODE_2_INITIAL_DIALOGUE.length),
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
    if (!active || activeModal) return undefined;
    if (!["welcome", "reading", "success"].includes(phase)) return undefined;

    const onKeyDown = (event) => {
      if (event.defaultPrevented || event.repeat) return;
      if (event.code !== "Space" && event.key !== " ") return;
      if (event.target?.closest?.("button, a, input, textarea, select")) return;

      event.preventDefault();
      if (phase === "welcome") advanceWelcome();
      else if (phase === "reading") startQuiz();
      else exitSuccess();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [
    active,
    activeModal,
    advanceWelcome,
    exitSuccess,
    phase,
    startQuiz,
  ]);

  useEffect(() => {
    if (!activeModal) return undefined;

    const onKeyDown = (event) => {
      if (event.key !== "Escape") return;
      event.preventDefault();
      closeModal();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [activeModal, closeModal]);

  return (
    <div className="absolute inset-0">
      <audio
        ref={introAudioRef}
        src={nodeTwoIntroAudio}
        preload="auto"
      />

      <div className="pointer-events-none absolute bottom-[20px] left-[114px] z-10 h-[352px] w-[132px]">
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

      {active && phase === "welcome" && (
        <button
          ref={welcomeDialogueRef}
          type="button"
          data-stage-interactive
          onClick={advanceWelcome}
          className="absolute left-[24px] right-[24px] top-[18px] z-30 flex max-h-[260px] cursor-pointer flex-col gap-[8px] border-[5px] border-[#f0ca63] bg-[#101725] px-[15px] py-[10px] text-left text-white shadow-[0_8px_0_#080d16,0_12px_24px_#000000b8] ring-4 ring-[#35d8ff]/80 transition-colors hover:border-[#fff3bd] active:translate-y-[3px] active:shadow-[0_5px_0_#080d16,0_9px_18px_#000000b8] focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-white"
        >
          <span className="flex w-full items-center justify-between gap-[8px] border-b-2 border-[#40566d] pb-[6px] font-pixel text-[7px] leading-[1.7]">
            <span className="flex items-center gap-[9px]">
              <span className="border-2 border-[#101725] bg-[#35d8ff] px-[7px] py-[4px] text-[#101725] shadow-[2px_2px_0_#14768b]">
                MUDEK
              </span>
              <span className="text-[#9fe8f4]">
                OFICINA DEL DESARROLLADOR
              </span>
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

      {active && phase === "reading" && (
        <Node2Reading onOpenInfo={openInfoPopup} onStartQuiz={startQuiz} />
      )}

      {active && phase === "quiz" && (
        <Node2Quiz
          assignments={assignments}
          completedCount={completedCount}
          selectedCaseId={selectedCaseId}
          quizStatus={quizStatus}
          draggedCaseId={draggedCaseId}
          hoveredPhaseId={hoveredPhaseId}
          onCaseActivate={selectCase}
          onCasePointerDown={startDraggingCase}
          onCasePointerMove={moveDraggedCase}
          onCasePointerUp={finishDraggingCase}
          onCasePointerCancel={cancelDraggingCase}
          onPhaseClick={placeSelectedCase}
        />
      )}

      {active && phase === "success" && <Node2Success onExit={exitSuccess} />}

      {active && phase === "quiz" && dragPreview && draggedCase && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute z-[80] flex items-center gap-[7px] border-[3px] border-[#f0ca63] bg-[#101725] px-[6px] py-[4px] font-pixel text-[5px] text-white opacity-95 shadow-[0_8px_0_#080d16,0_12px_24px_#000000b8] ring-2 ring-[#35d8ff]"
          style={{
            left: dragPreview.left,
            top: dragPreview.top,
            width: dragPreview.width,
            height: dragPreview.height,
          }}
        >
          <span className="grid size-[23px] shrink-0 place-items-center border border-[#7a5c2e] bg-[#352b24] text-[#f0ca63]">
            ↕
          </span>
          <span className="flex-1 leading-[1.8]">{draggedCase.label}</span>
        </div>
      )}

      {active && activeModal && (
        <Node2Modal modal={activeModal} onClose={closeModal} />
      )}
    </div>
  );
}
