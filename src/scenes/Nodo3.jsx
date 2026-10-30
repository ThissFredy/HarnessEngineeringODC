import { useCallback, useEffect, useRef, useState } from "react";
import Avatar from "../components/Avatar.jsx";
import { MUDEK } from "../data/avatars.js";
import { MUDEK_ANIMATIONS } from "../data/mudekAnimations.js";
import {
  NODE_3_INITIAL_DIALOGUE,
  NODE_3_QUIZ,
  NODE_3_TERMS,
} from "../data/nodo3.js";
import nodeThreeWelcomeAudio from "../assets/audio/Nodo-2-2.mp3";

const PASSING_GRADE = 5;
const TYPEWRITER_CHARACTER_DELAY = 50;
const TYPEWRITER_PAUSE_DELAY = 110;
const TERM_IDS = NODE_3_TERMS.map((term) => term.id);

const INDUSTRY_STAGES = [
  {
    year: "2023",
    title: "PROMPT ENGINEERING",
    description: "Mejoró la forma de redactar instrucciones para el modelo.",
    borderClass: "border-[#f0ca63]",
    titleClass: "text-[#fff3bd]",
  },
  {
    year: "2025",
    title: "CONTEXT ENGINEERING",
    description: "Define qué información entra en la ventana y en qué momento.",
    borderClass: "border-[#35d8ff]",
    titleClass: "text-[#9fe8f4]",
  },
  {
    year: "2026",
    title: "HARNESS ENGINEERING",
    description:
      "Estructura el entorno de ejecución y el control del modelo (He et al., 2026).",
    borderClass: "border-[#f0ca63]",
    titleClass: "text-[#f0ca63]",
  },
];

function ArchiveHeader({ step, stepNumber, title, titleId, titleRef }) {
  return (
    <header className="mb-[9px] flex min-h-[54px] items-center justify-between gap-[12px] border-b-4 border-[#35d8ff] bg-[#17263a] px-[13px] py-[8px] shadow-[inset_0_2px_0_#2c4965]">
      <div className="flex min-w-0 items-center gap-[10px]">
        <span className="grid size-[34px] shrink-0 place-items-center border-2 border-[#080d16] bg-[#35d8ff] font-pixel text-[10px] text-[#101725] shadow-[3px_3px_0_#080d16]">
          03
        </span>
        <div className="min-w-0">
          <p className="font-pixel text-[7px] leading-[1.6] text-[#9fe8f4]">
            GRAN ARCHIVO DE LA MENTE
          </p>
          <h1
            ref={titleRef}
            id={titleId}
            tabIndex={-1}
            className="font-pixel text-[10px] leading-[1.7] text-[#fff3bd] [text-shadow:2px_2px_0_#080d16] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#35d8ff]"
          >
            {title}
          </h1>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-[8px] border-2 border-[#40566d] bg-[#101725] px-[8px] py-[6px]">
        <div>
          <p className="text-right font-pixel text-[7px] leading-[1.5] text-[#e5e7eb]">
            {step}
          </p>
          <p className="text-right font-pixel text-[7px] leading-[1.5] text-[#f0ca63]">
            {String(stepNumber).padStart(2, "0")} / 02
          </p>
        </div>
        <div className="flex gap-[3px]" aria-hidden="true">
          {[0, 1].map((index) => (
            <span
              key={index}
              className={`h-[9px] w-[18px] border border-[#080d16] ${index < stepNumber ? "bg-[#35d8ff] shadow-[inset_0_0_0_2px_#14768b]" : "bg-[#344354]"}`}
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
      onClick={(event) => onOpen(term.id, event)}
      className={`flex min-h-[42px] min-w-0 items-center gap-[8px] border-2 px-[9px] py-[7px] text-left font-pixel text-[7px] leading-[1.7] transition-colors hover:border-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white ${viewed ? "border-[#35d8ff] bg-[#153141] text-[#c1f4ff]" : "border-[#8b7040] bg-[#352d24] text-[#ffe6b8]"}`}
    >
      <span className="grid size-[24px] shrink-0 place-items-center border-2 border-[#080d16] bg-[#f0ca63] text-[11px] leading-none text-[#101725] shadow-[2px_2px_0_#080d16]">
        {viewed ? "✓" : "+"}
      </span>
      <span className="min-w-0">{term.label}</span>
    </button>
  );
}

function ReadingView({
  readingBlock,
  viewedTermIds,
  onOpenTerm,
  onChangeBlock,
  onBeginQuiz,
}) {
  const readingTitleRef = useRef(null);
  const allTermsViewed = TERM_IDS.every((id) => viewedTermIds.includes(id));
  const isViewed = (id) => viewedTermIds.includes(id);
  const currentTerms =
    readingBlock === 0 ? NODE_3_TERMS.slice(0, 3) : NODE_3_TERMS.slice(3);
  const isFirstBlock = readingBlock === 0;

  useEffect(() => {
    readingTitleRef.current?.focus();
  }, [readingBlock]);

  return (
    <section
      data-stage-interactive
      aria-labelledby="node-3-reading-title"
      className="absolute inset-[18px] z-20 flex flex-col border-[5px] border-[#f0ca63] bg-[#101725] p-[12px] text-white shadow-[0_8px_0_#080d16,0_12px_24px_#000000b8] ring-4 ring-[#35d8ff]/80"
    >
      <ArchiveHeader
        step={`LECTURA · BLOQUE ${readingBlock + 1}`}
        stepNumber={readingBlock + 1}
        title={
          isFirstBlock
            ? "POR QUÉ SE SATURA EL CONTEXTO"
            : "CÓMO EVOLUCIONÓ LA RESPUESTA"
        }
        titleId="node-3-reading-title"
        titleRef={readingTitleRef}
      />

      {isFirstBlock ? (
        <div className="grid min-h-0 flex-1 grid-cols-[minmax(0,1.35fr)_minmax(0,0.85fr)] gap-[12px]">
          <div className="flex min-h-0 flex-col gap-[9px]">
            <article className="border-2 border-[#35d8ff] bg-[#17263a] p-[12px] shadow-[inset_0_2px_0_#2c4965]">
              <p className="mb-[6px] font-pixel text-[7px] leading-[1.6] text-[#9fe8f4]">
                01 · LA IDEA PRINCIPAL
              </p>
              <h2 className="mb-[6px] font-pixel text-[9px] leading-[1.7] text-[#fff3bd]">
                El contexto tiene un límite
              </h2>
              <p className="font-pixel text-[8px] leading-[1.9] text-white">
                Todo modelo de lenguaje solo puede considerar una cantidad
                limitada de texto a la vez. Cuando su ventana de contexto se
                llena, el rendimiento puede degradarse, especialmente si falta
                orquestación (Goldman et al., 2024).
              </p>
            </article>

            <div className="grid min-h-0 flex-1 grid-cols-2 gap-[9px]">
              <article className="border-2 border-[#52616a] bg-[#17263a] p-[11px]">
                <h3 className="mb-[6px] font-pixel text-[7px] leading-[1.6] text-[#f0ca63]">
                  02 · CALIDAD
                </h3>
                <p className="font-pixel text-[8px] leading-[1.9] text-white">
                  Resumir puede liberar espacio, pero se pierden detalles
                  importantes (Khaldi et al., 2026).
                </p>
              </article>
              <article className="border-2 border-[#52616a] bg-[#17263a] p-[11px]">
                <h3 className="mb-[6px] font-pixel text-[7px] leading-[1.6] text-[#f0ca63]">
                  03 · CONTROL
                </h3>
                <p className="font-pixel text-[8px] leading-[1.9] text-white">
                  Sin control, un agente puede oscilar entre acciones o
                  estancarse en recorridos ineficientes (Liu et al., 2026).
                </p>
              </article>
            </div>
          </div>

          <aside className="flex min-h-0 flex-col gap-[9px]">
            <section className="border-2 border-[#52616a] bg-[#17263a] p-[11px]">
              <h2 className="font-pixel text-[8px] leading-[1.7] text-[#fff3bd]">
                VENTANA DE CONTEXTO
              </h2>
              <div className="mt-[7px] flex items-center justify-between gap-[8px] font-pixel text-[6px] leading-[1.6]">
                <span className="text-[#9fe8f4]">ESPACIO LIMITADO</span>
                <span className="text-[#f0ca63]">SE LLENA</span>
              </div>
              <div
                role="img"
                aria-label="Ilustración: la ventana de contexto está casi llena"
                className="mt-[5px] flex gap-[4px]"
              >
                {Array.from({ length: 10 }, (_, index) => (
                  <span
                    key={index}
                    className={`h-[12px] flex-1 border border-[#080d16] ${index < 8 ? "bg-[#35d8ff]" : "bg-[#f0ca63]"}`}
                  />
                ))}
              </div>
            </section>

            <section className="flex flex-1 flex-col border-2 border-[#f0ca63] bg-[#17263a] p-[11px] shadow-[inset_0_2px_0_#2c4965]">
              <h2 className="font-pixel text-[7px] leading-[1.6] text-[#9fe8f4]">
                EVIDENCIA · MODERNIZACIÓN DE COBOL
              </h2>
              <p className="mt-[4px] font-pixel text-[7px] leading-[1.7] text-white">
                Tokens consumidos según el tipo de orquestación:
              </p>

              <div className="mt-[9px] space-y-[10px]">
                <div>
                  <div className="mb-[4px] flex items-baseline justify-between gap-[6px]">
                    <span className="font-pixel text-[7px] leading-[1.6] text-[#fff3bd]">
                      Controlado por LLM
                    </span>
                    <strong className="font-pixel text-[8px] leading-[1.6] text-[#f0ca63]">
                      1,75–2,25 millones
                    </strong>
                  </div>
                  <div
                    aria-hidden="true"
                    className="h-[10px] border-2 border-[#080d16] bg-[#101725] p-[1px]"
                  >
                    <span className="block h-full w-full bg-[#f0ca63]" />
                  </div>
                </div>
                <div>
                  <div className="mb-[4px] flex items-baseline justify-between gap-[6px]">
                    <span className="font-pixel text-[7px] leading-[1.6] text-[#e5e7eb]">
                      Determinista
                    </span>
                    <strong className="font-pixel text-[8px] leading-[1.6] text-[#9fe8f4]">
                      400.000–700.000
                    </strong>
                  </div>
                  <div
                    aria-hidden="true"
                    className="h-[10px] border-2 border-[#080d16] bg-[#101725] p-[1px]"
                  >
                    <span className="block h-full w-[30%] bg-[#35d8ff]" />
                  </div>
                </div>
              </div>

              <p className="mt-auto pt-[8px] font-pixel text-[7px] leading-[1.7] text-[#d8e1e5]">
                (Lwin &amp; Kumar, 2026)
              </p>
            </section>
          </aside>
        </div>
      ) : (
        <div className="flex min-h-0 flex-1 flex-col">
          <p className="mb-[7px] font-pixel text-[7px] leading-[1.7] text-[#9fe8f4]">
            LÍNEA DE TIEMPO · DEL PROMPT AL ENTORNO COMPLETO
          </p>

          <div className="relative min-h-0 flex-1">
            <div
              aria-hidden="true"
              className="absolute left-[16.6%] right-[16.6%] top-[46px] z-0 h-[5px] border-y border-[#080d16] bg-[#35d8ff] shadow-[0_2px_0_#080d16]"
            >
              <span className="absolute -right-[8px] -top-[6px] h-0 w-0 border-y-[7px] border-y-transparent border-l-[10px] border-l-[#f0ca63]" />
            </div>

            <ol
              aria-label="Línea de tiempo de Prompt, Context y Harness Engineering"
              className="relative z-10 grid h-full grid-cols-3 gap-[10px]"
            >
              {INDUSTRY_STAGES.map((stage, index) => (
                <li
                  key={stage.year}
                  className="flex min-h-0 flex-col items-center"
                >
                  <time
                    dateTime={stage.year}
                    className={`flex h-[32px] items-center border-2 bg-[#101725] px-[8px] font-pixel text-[8px] leading-[1.5] ${stage.borderClass} ${stage.titleClass}`}
                  >
                    {stage.year}
                  </time>
                  <span
                    aria-hidden="true"
                    className={`mt-[1px] grid size-[28px] shrink-0 place-items-center border-[4px] border-[#101725] shadow-[0_0_0_2px_#080d16] ${index === 1 ? "bg-[#35d8ff]" : "bg-[#f0ca63]"}`}
                  >
                    <span className="size-[8px] bg-[#101725]" />
                  </span>
                  <article className="mt-[9px] flex min-h-0 w-full flex-1 flex-col border-2 border-[#52616a] bg-[#17263a] p-[11px] shadow-[inset_0_2px_0_#2c4965]">
                    <p className="font-pixel text-[7px] leading-[1.6] text-[#9fe8f4]">
                      ETAPA {index + 1}
                    </p>
                    <h2
                      className={`mt-[7px] font-pixel text-[8px] leading-[1.8] ${stage.titleClass}`}
                    >
                      {stage.title}
                    </h2>
                    <p className="mt-[7px] font-pixel text-[8px] leading-[1.9] text-white">
                      {stage.description}
                    </p>
                    <p className="mt-auto border-t-2 border-[#40566d] pt-[7px] font-pixel text-[7px] leading-[1.7] text-[#d8e1e5]">
                      {index === 0
                        ? "INSTRUCCIONES"
                        : index === 1
                          ? "INFORMACIÓN"
                          : "ENTORNO Y CONTROL"}
                    </p>
                  </article>
                </li>
              ))}
            </ol>
          </div>

          <aside className="mt-[9px] grid grid-cols-[minmax(0,1fr)_330px] items-center gap-[12px] border-2 border-[#35d8ff] bg-[#17263a] px-[12px] py-[9px] shadow-[4px_4px_0_#080d16]">
            <div>
              <h2 className="font-pixel text-[7px] leading-[1.7] text-[#9fe8f4]">
                CADA ETAPA AMPLÍA LA ANTERIOR
              </h2>
              <p className="mt-[4px] font-pixel text-[8px] leading-[1.9] text-white">
                En tareas complejas, el rendimiento depende no solo de los pesos
                del modelo, sino de la arquitectura de su arnés (Lee et al.,
                2026).
              </p>
            </div>
            <div className="border-l-2 border-[#40566d] pl-[12px]">
              <p className="font-pixel text-[6px] leading-[1.6] text-[#f0ca63]">
                INSTRUCCIONES → INFORMACIÓN → ENTORNO
              </p>
            </div>
          </aside>
        </div>
      )}

      <div
        role="group"
        aria-label={isFirstBlock ? "Términos del bloque uno" : "Término del bloque dos"}
        className={`mt-[8px] grid gap-[8px] ${isFirstBlock ? "grid-cols-3" : "grid-cols-1"}`}
      >
        {currentTerms.map((term) => (
          <TermButton
            key={term.id}
            term={term}
            viewed={isViewed(term.id)}
            onOpen={onOpenTerm}
          />
        ))}
      </div>

      <footer className="mt-[8px] flex min-h-[52px] items-center justify-between gap-[12px] border-t-4 border-[#35d8ff] bg-[#17263a] px-[11px] py-[6px] shadow-[inset_0_2px_0_#2c4965]">
        <p
          id="node-3-glossary-status"
          aria-live="polite"
          className="font-pixel text-[7px] leading-[1.7] text-[#9fe8f4]"
        >
          TÉRMINOS REVISADOS: {viewedTermIds.length} / {NODE_3_TERMS.length}
        </p>
        <nav
          aria-label="Navegación entre los bloques de lectura"
          className="flex items-center gap-[7px]"
        >
          {!isFirstBlock && (
            <button
              type="button"
              data-stage-interactive
              onClick={() => onChangeBlock(0)}
              className="min-h-[40px] border-2 border-[#52616a] bg-[#101725] px-[10px] py-[6px] font-pixel text-[7px] leading-[1.5] text-white hover:border-[#35d8ff] active:translate-y-[2px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              ← BLOQUE 1
            </button>
          )}
          {isFirstBlock ? (
            <button
              type="button"
              data-stage-interactive
              onClick={() => onChangeBlock(1)}
              className="min-h-[40px] border-2 border-[#080d16] bg-[#f0ca63] px-[12px] py-[6px] font-pixel text-[7px] leading-[1.5] text-[#101725] shadow-[0_3px_0_#080d16] hover:bg-[#fff3bd] active:translate-y-[2px] active:shadow-[0_1px_0_#080d16] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              SIGUIENTE BLOQUE →
            </button>
          ) : (
            <button
              type="button"
              data-stage-interactive
              aria-describedby={!allTermsViewed ? "node-3-glossary-status" : undefined}
              disabled={!allTermsViewed}
              onClick={onBeginQuiz}
              className={`min-h-[40px] border-2 border-[#080d16] px-[12px] py-[6px] font-pixel text-[7px] leading-[1.5] shadow-[0_3px_0_#080d16] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white ${allTermsViewed ? "bg-[#f0ca63] text-[#101725] hover:bg-[#fff3bd] active:translate-y-[2px] active:shadow-[0_1px_0_#080d16]" : "cursor-not-allowed bg-[#59606a] text-[#c8cdd2] opacity-70"}`}
            >
              {allTermsViewed
                ? "IR A LA MINIEVALUACIÓN →"
                : "CONSULTA LOS «+»"}
            </button>
          )}
        </nav>
      </footer>
    </section>
  );
}

function QuizView({
  answers,
  questionResults,
  statusMessage,
  onSelectAnswer,
  onCheck,
}) {
  const quizTitleRef = useRef(null);
  const answeredCount = NODE_3_QUIZ.filter(
    (question) => answers[question.id] !== undefined,
  ).length;

  useEffect(() => {
    quizTitleRef.current?.focus();
  }, []);

  return (
    <section
      data-stage-interactive
      aria-labelledby="node-3-quiz-title"
      className="absolute inset-[18px] z-20 flex flex-col border-[5px] border-[#f0ca63] bg-[#101725] p-[12px] text-white shadow-[0_8px_0_#080d16,0_12px_24px_#000000b8] ring-4 ring-[#35d8ff]/80"
    >
      <ArchiveHeader
        step="EVALUACIÓN"
        stepNumber={2}
        title="TRES AFIRMACIONES · VERDADERO O FALSO"
        titleId="node-3-quiz-title"
        titleRef={quizTitleRef}
      />

      <div className="mb-[7px] flex min-h-[29px] items-center justify-between gap-[10px] border-2 border-[#40566d] bg-[#17263a] px-[9px] py-[5px]">
        <p className="font-pixel text-[7px] leading-[1.8] text-[#e5e7eb]">
          Marca una opción por afirmación. Necesitas 3 respuestas correctas para
          aprobar.
        </p>
        <span className="shrink-0 font-pixel text-[7px] leading-[1.5] text-[#f0ca63]">
          {answeredCount} / 3 MARCADAS
        </span>
      </div>

      <div className="flex min-h-0 flex-1 flex-col gap-[7px]">
        {NODE_3_QUIZ.map((question, index) => {
          const result = questionResults[question.id];
          const isLocked = result === "correct";

          return (
            <article
              key={question.id}
              aria-labelledby={`${question.id}-statement`}
              className={`grid min-h-0 flex-1 grid-cols-[minmax(0,1fr)_224px] grid-rows-[minmax(0,1fr)_auto] gap-x-[10px] gap-y-[4px] border-2 p-[8px] shadow-[inset_0_2px_0_#2c4965] ${isLocked ? "border-[#35d8ff] bg-[#142f3a]" : "border-[#52616a] bg-[#17263a]"}`}
            >
              <div className="min-w-0 self-center">
                <p className="mb-[5px] font-pixel text-[6px] leading-[1.6] text-[#9fe8f4]">
                  AFIRMACIÓN {String(index + 1).padStart(2, "0")}
                </p>
                <p
                  id={`${question.id}-statement`}
                  className="font-pixel text-[8px] leading-[1.9] text-white"
                >
                  {question.statement}
                </p>
              </div>

              <div
                role="group"
                aria-label={`Respuesta para la afirmación ${index + 1}`}
                aria-describedby={result ? `${question.id}-feedback` : undefined}
                className="row-span-2 grid grid-cols-2 items-center gap-[6px]"
              >
                {["false", "true"].map((answer) => {
                  const isSelected = answers[question.id] === answer;
                  const isTrue = answer === "true";

                  return (
                    <button
                      key={answer}
                      type="button"
                      data-stage-interactive
                      aria-pressed={isSelected}
                      aria-label={`${isTrue ? "Verdadero" : "Falso"} para la afirmación ${index + 1}`}
                      disabled={isLocked}
                      onClick={() => onSelectAnswer(question.id, answer)}
                      className={`min-h-[46px] border-2 px-[5px] py-[5px] font-pixel text-[7px] leading-[1.7] shadow-[0_3px_0_#080d16] transition-colors hover:border-white active:translate-y-[2px] active:shadow-[0_1px_0_#080d16] disabled:cursor-not-allowed disabled:opacity-75 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white ${isSelected ? (isTrue ? "border-[#35d8ff] bg-[#164257] text-white ring-2 ring-[#35d8ff]/60" : "border-[#f0ca63] bg-[#42351e] text-[#fff3bd] ring-2 ring-[#f0ca63]/50") : "border-[#52616a] bg-[#101725] text-[#d8e1e5]"}`}
                    >
                      {isSelected ? "▣ " : "□ "}
                      {isTrue ? "VERDADERO" : "FALSO"}
                    </button>
                  );
                })}
              </div>

              <div aria-live="polite" className="min-w-0 self-end">
                {result && (
                  <p
                    id={`${question.id}-feedback`}
                    className={`font-pixel text-[7px] leading-[1.65] ${result === "correct" ? "text-[#9fe8f4]" : result === "incorrect" ? "text-[#ffd18c]" : "text-[#d8e1e5]"}`}
                  >
                    <strong>
                      {result === "correct"
                        ? "CORRECTO · "
                        : result === "incorrect"
                          ? `NO TODAVÍA · RESPUESTA: ${question.correctLabel} · `
                          : "SIN RESPUESTA · "}
                    </strong>
                    {result === "unanswered"
                      ? "Selecciona verdadero o falso para esta afirmación."
                      : question.feedback}
                  </p>
                )}
              </div>
            </article>
          );
        })}
      </div>

      <footer className="mt-[8px] flex min-h-[48px] items-center justify-between gap-[12px] border-t-4 border-[#35d8ff] bg-[#17263a] px-[10px] py-[6px] shadow-[inset_0_2px_0_#2c4965]">
        <p
          aria-live="polite"
          className="max-w-[650px] font-pixel text-[7px] leading-[1.8] text-[#ffe6b8]"
        >
          {statusMessage || "Revisa las tres respuestas antes de comprobar."}
        </p>
        <button
          type="button"
          data-stage-interactive
          onClick={onCheck}
          className="min-h-[40px] shrink-0 border-2 border-[#080d16] bg-[#f0ca63] px-[14px] py-[6px] font-pixel text-[7px] leading-[1.5] text-[#101725] shadow-[0_3px_0_#080d16] transition-colors hover:bg-[#fff3bd] active:translate-y-[2px] active:shadow-[0_1px_0_#080d16] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        >
          {statusMessage.includes("correctas")
            ? "COMPROBAR DE NUEVO"
            : "COMPROBAR RESPUESTAS"}
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
      aria-labelledby="node-3-success-title"
      className="absolute inset-[18px] z-20 flex flex-col border-[5px] border-[#f0ca63] bg-[#101725] p-[12px] text-white shadow-[0_8px_0_#080d16,0_12px_24px_#000000b8] ring-4 ring-[#35d8ff]/80"
    >
      <ArchiveHeader
        step="ARCHIVO ORDENADO"
        stepNumber={2}
        title="NODO 03 COMPLETADO"
        titleId="node-3-success-title"
        titleRef={successTitleRef}
      />

      <div className="flex min-h-0 flex-1 items-center justify-center px-[14px] py-[10px]">
        <div className="w-full max-w-[710px] border-[4px] border-[#35d8ff] bg-[#17263a] p-[17px] text-center shadow-[0_7px_0_#080d16,0_11px_0_#f0ca63]">
          <div className="mb-[11px] inline-flex items-center gap-[7px] border-2 border-[#7a5c2e] bg-[#352b24] px-[9px] py-[6px] font-pixel text-[6px] leading-[1.5] text-[#f0ca63]">
            <span aria-hidden="true">★</span>
            3 / 3 RESPUESTAS CORRECTAS
            <span aria-hidden="true">★</span>
          </div>
          <h2 className="font-pixel text-[12px] leading-[1.8] text-[#fff3bd] [text-shadow:2px_2px_0_#080d16]">
            ¡ARCHIVO ORDENADO!
          </h2>
          <p className="mx-auto mt-[9px] max-w-[560px] font-pixel text-[7px] leading-[2] text-white">
            Has completado el Gran Archivo de la Mente. El Nodo 4 queda
            desbloqueado en el mapa: ya puedes avanzar al módulo de Agentes de
            IA.
          </p>

          <div className="mx-auto mt-[13px] grid max-w-[570px] grid-cols-2 gap-[9px]">
            <div className="border-2 border-[#8b7040] bg-[#101725] px-[9px] py-[9px]">
              <p className="font-pixel text-[5px] leading-[1.6] text-[#9fe8f4]">
                CALIFICACIÓN DEL MÓDULO
              </p>
              <p className="mt-[5px] font-pixel text-[12px] leading-[1.5] text-[#f0ca63]">
                {PASSING_GRADE.toFixed(1)} / 5.0
              </p>
            </div>
            <div className="border-2 border-[#35d8ff] bg-[#101725] px-[9px] py-[9px]">
              <p className="font-pixel text-[5px] leading-[1.6] text-[#9fe8f4]">
                SIGUIENTE MÓDULO
              </p>
              <p className="mt-[5px] font-pixel text-[7px] leading-[1.7] text-white">
                NODO 04 · AGENTES DE IA
              </p>
            </div>
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

export default function Nodo3({ active, onComplete, onExit }) {
  const [phase, setPhase] = useState("welcome");
  const [visibleCharacters, setVisibleCharacters] = useState(0);
  const [talkingFrameIndex, setTalkingFrameIndex] = useState(0);
  const [readingBlock, setReadingBlock] = useState(0);
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

  const isTyping =
    phase === "welcome" && visibleCharacters < NODE_3_INITIAL_DIALOGUE.length;
  const visibleText = NODE_3_INITIAL_DIALOGUE.slice(0, visibleCharacters);
  const isSpeaking = active && phase === "welcome" && isTyping;
  const talkingAnimation = MUDEK_ANIMATIONS.hablar;
  const talkingFrame = talkingAnimation.frames[talkingFrameIndex];
  const selectedTerm = NODE_3_TERMS.find(
    (term) => term.id === selectedTermId,
  );

  const finishTyping = useCallback(() => {
    if (!isTyping) return;

    const audio = welcomeAudioRef.current;
    audio?.pause();
    if (audio) audio.currentTime = 0;
    setVisibleCharacters(NODE_3_INITIAL_DIALOGUE.length);
  }, [isTyping]);

  const advanceWelcome = useCallback(() => {
    if (!active || phase !== "welcome") return;
    if (isTyping) {
      finishTyping();
      return;
    }
    setPhase("reading");
  }, [active, finishTyping, isTyping, phase]);

  const closeTerm = useCallback(() => {
    restoreTermFocusRef.current = true;
    setSelectedTermId(null);
  }, []);

  const openTerm = useCallback((termId, event) => {
    termTriggerRef.current = event.currentTarget;
    setViewedTermIds((current) =>
      current.includes(termId) ? current : [...current, termId],
    );
    setSelectedTermId(termId);
  }, []);

  const selectAnswer = useCallback((questionId, answer) => {
    setAnswers((current) => ({ ...current, [questionId]: answer }));
    setQuestionResults((current) => ({ ...current, [questionId]: null }));
    setStatusMessage("");
  }, []);

  const checkAnswers = useCallback(() => {
    if (!active || phase !== "quiz") return;

    const nextResults = Object.fromEntries(
      NODE_3_QUIZ.map((question) => {
        if (questionResults[question.id] === "correct") {
          return [question.id, "correct"];
        }

        const answer = answers[question.id];
        if (answer === undefined) return [question.id, "unanswered"];
        return [
          question.id,
          answer === question.correctAnswer ? "correct" : "incorrect",
        ];
      }),
    );

    const correctCount = Object.values(nextResults).filter(
      (result) => result === "correct",
    ).length;

    if (correctCount === NODE_3_QUIZ.length) {
      setQuestionResults(nextResults);
      setStatusMessage("¡3 DE 3 CORRECTAS! CALIFICACIÓN: 5.0 / 5.0.");
      setPhase("success");
      onComplete?.(3, PASSING_GRADE);
      return;
    }

    setQuestionResults(nextResults);
    const unansweredCount = Object.values(nextResults).filter(
      (result) => result === "unanswered",
    ).length;
    setStatusMessage(
      unansweredCount > 0
        ? `${unansweredCount === 1 ? "Responde la afirmación pendiente" : `Responde las ${unansweredCount} afirmaciones pendientes`}. ${correctCount} de 3 correctas.`
        : `${correctCount} de 3 correctas. Revisa la retroalimentación e inténtalo otra vez.`,
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
    setReadingBlock(0);
    setViewedTermIds([]);
    setSelectedTermId(null);
    setAnswers({});
    setQuestionResults({});
    setStatusMessage("");
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

    const previousCharacter = NODE_3_INITIAL_DIALOGUE[visibleCharacters - 1];
    const delay = /[.!?,;:]/.test(previousCharacter ?? "")
      ? TYPEWRITER_PAUSE_DELAY
      : TYPEWRITER_CHARACTER_DELAY;
    const timer = window.setTimeout(() => {
      setVisibleCharacters((current) =>
        Math.min(current + 1, NODE_3_INITIAL_DIALOGUE.length),
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
        (index) => (index + 1) % talkingAnimation.frames.length,
      );
    }, talkingAnimation.frameDuration);

    return () => window.clearInterval(timer);
  }, [isSpeaking, talkingAnimation]);

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
      <audio
        ref={welcomeAudioRef}
        src={nodeThreeWelcomeAudio}
        preload="auto"
      />

      {phase === "welcome" && (
        <>
          <div className="pointer-events-none absolute bottom-[29px] left-[100px] z-20 h-[250px] w-[160px]">
            <div
              className={`absolute inset-0 ${isSpeaking ? "" : "avatar-idle"}`}
              style={
                isSpeaking
                  ? {
                      transform: talkingFrame.transform,
                      transformOrigin: "center bottom",
                      filter:
                        "drop-shadow(0 0 5px #35d8ff) drop-shadow(0 0 12px #35d8ff)",
                    }
                  : {
                      filter:
                        "drop-shadow(0 0 5px #35d8ff) drop-shadow(0 0 12px #35d8ff)",
                    }
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

          <button
            ref={welcomeButtonRef}
            type="button"
            data-stage-interactive
            onClick={advanceWelcome}
            className="absolute left-[24px] right-[24px] top-[18px] z-30 flex max-h-[270px] cursor-pointer flex-col gap-[8px] border-[5px] border-[#f0ca63] bg-[#101725] px-[15px] py-[10px] text-left text-white shadow-[0_8px_0_#080d16,0_12px_24px_#000000b8] ring-4 ring-[#35d8ff]/80 transition-colors hover:border-[#fff3bd] active:translate-y-[3px] active:shadow-[0_5px_0_#080d16,0_9px_18px_#000000b8] focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-white"
          >
            <span className="flex w-full items-center justify-between gap-[8px] border-b-2 border-[#40566d] pb-[6px] font-pixel text-[7px] leading-[1.7]">
              <span className="flex items-center gap-[9px]">
                <span className="border-2 border-[#101725] bg-[#35d8ff] px-[7px] py-[4px] text-[#101725] shadow-[2px_2px_0_#14768b]">
                  MUDEK
                </span>
                <span className="text-[#9fe8f4]">
                  GRAN ARCHIVO DE LA MENTE
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
                  : "ESPACIO O CLIC: ABRIR EL ARCHIVO"}
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
          readingBlock={readingBlock}
          viewedTermIds={viewedTermIds}
          onOpenTerm={openTerm}
          onChangeBlock={setReadingBlock}
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
        <div
          data-stage-interactive
          className="absolute inset-0 z-[70] grid place-items-center bg-[#080d16]/90 p-[32px]"
          onClick={(event) => {
            if (event.target === event.currentTarget) closeTerm();
          }}
        >
          <section
            ref={termDialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="node-3-term-title"
            aria-describedby="node-3-term-description"
            className="w-full max-w-[620px] border-[5px] border-[#f0ca63] bg-[#101725] p-[14px] text-white shadow-[0_8px_0_#080d16,0_12px_24px_#000000b8] ring-4 ring-[#35d8ff]"
          >
            <header className="flex items-center justify-between gap-[10px] border-b-4 border-[#35d8ff] bg-[#17263a] px-[10px] py-[8px]">
              <span className="font-pixel text-[7px] leading-[1.7] text-[#9fe8f4]">
                GLOSARIO · GRAN ARCHIVO
              </span>
              <span className="border-2 border-[#7a5c2e] bg-[#f0ca63] px-[6px] py-[3px] font-pixel text-[6px] text-[#101725]">
                TÉRMINO
              </span>
            </header>
            <h2
              id="node-3-term-title"
              className="mt-[12px] font-pixel text-[11px] leading-[1.8] text-[#fff3bd] [text-shadow:2px_2px_0_#080d16]"
            >
              {selectedTerm.title}
            </h2>
            <p
              id="node-3-term-description"
              className="mt-[8px] border-l-[4px] border-[#35d8ff] bg-[#17263a] px-[12px] py-[11px] font-pixel text-[9px] leading-[2] text-white"
            >
              {selectedTerm.body}
            </p>
            <footer className="mt-[11px] flex items-center justify-between gap-[10px] border-t-2 border-[#40566d] pt-[9px]">
              <span className="font-pixel text-[7px] leading-[1.7] text-[#9fe8f4]">
                TÉRMINO AÑADIDO A TU REPASO
              </span>
              <button
                ref={closeTermButtonRef}
                type="button"
                data-stage-interactive
                onClick={closeTerm}
                className="min-h-[40px] border-2 border-[#080d16] bg-[#f0ca63] px-[11px] py-[7px] font-pixel text-[7px] leading-[1.5] text-[#101725] shadow-[0_3px_0_#080d16] hover:bg-[#fff3bd] active:translate-y-[2px] active:shadow-[0_1px_0_#080d16] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                VOLVER AL ARCHIVO
              </button>
            </footer>
          </section>
        </div>
      )}
    </div>
  );
}
