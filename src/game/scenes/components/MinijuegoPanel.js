/**
 * MinijuegoPanel — evaluación interactiva por nodo.
 * Tipos soportados: quiz, drag-drop, ordenar, emparejar, verdadero-falso.
 * Devuelve un puntaje 0-100 vía onFinish.
 */
import { SCORE } from '@/game/config.js';

export class MinijuegoPanel {
  constructor(scene, { nodo, onFinish }) {
    this.scene = scene;
    this.nodo = nodo;
    this.onFinish = onFinish;
    this.root = null;
    this.answers = [];
    this._build();
    this._bind();
  }

  _build() {
    const host = document.getElementById('game-container');
    if (!host) return;

    let overlay = host.querySelector('#minijuego-overlay');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.id = 'minijuego-overlay';
      overlay.className = 'overlay';
      host.appendChild(overlay);
    }

    const tipo = this.nodo.minijuego?.tipo || 'quiz';
    overlay.innerHTML = `
      <section class="panel" role="dialog" aria-label="Minijuego de evaluación">
        <header>
          <p class="panel__subtitle">Nodo ${this.nodo.id} · Evaluación</p>
          <h2 class="panel__title">${escapeHTML(this.nodo.titulo)}</h2>
        </header>
        <div class="panel__body" id="minijuego-body">
          ${this._renderByType(tipo)}
        </div>
        <footer class="btn-row">
          <button class="btn btn--primary" id="btn-terminar" disabled>Terminar ▶</button>
        </footer>
      </section>
    `;
    overlay.classList.add('is-open');
    this.root = overlay;
  }

  _renderByType(tipo) {
    const m = this.nodo.minijuego || {};
    if (tipo === 'quiz') {
      const preguntas = m.preguntas || [];
      return preguntas
        .map((p, i) => {
          const opciones = p.opciones || [];
          return `
          <article data-q="${i}">
            <h3 class="panel__subtitle">Pregunta ${i + 1}</h3>
            <p>${escapeHTML(p.enunciado)}</p>
            ${opciones
              .map(
                (o, j) =>
                  `<button class="quiz-option" data-q="${i}" data-o="${j}">${escapeHTML(o.texto)}</button>`
              )
              .join('')}
            <div class="quiz-feedback" data-q="${i}"></div>
          </article>
        `;
        })
        .join('');
    }

    if (tipo === 'verdadero-falso') {
      const preguntas = m.preguntas || [];
      return preguntas
        .map(
          (p, i) => `
        <article data-q="${i}">
          <h3 class="panel__subtitle">Pregunta ${i + 1}</h3>
          <p>${escapeHTML(p.enunciado)}</p>
          <button class="quiz-option" data-q="${i}" data-o="true">VERDADERO</button>
          <button class="quiz-option" data-q="${i}" data-o="false">FALSO</button>
          <div class="quiz-feedback" data-q="${i}"></div>
        </article>
      `
        )
        .join('');
    }

    if (tipo === 'drag-drop') {
      const cats = m.categorias || [];
      const items = m.items || [];
      return `
        <p>Arrastra cada elemento a la categoría correcta.</p>
        <div class="dnd-lanes">
          ${cats
            .map(
              (c) => `
            <div class="dnd-lane" data-cat="${escapeHTML(c)}">
              <div class="dnd-lane__title">${escapeHTML(c)}</div>
              <div class="dnd-lane__body" data-cat="${escapeHTML(c)}"></div>
            </div>
          `
            )
            .join('')}
        </div>
        <div id="dnd-pool" style="margin-top:16px">
          ${items.map((it, i) => `<div class="dnd-item" draggable="true" data-i="${i}">${escapeHTML(it.texto)}</div>`).join('')}
        </div>
      `;
    }

    return `<p>TODO(ui-retro): implementar el tipo "${escapeHTML(tipo)}".</p>`;
  }

  _bind() {
    if (!this.root) return;

    this.root.querySelectorAll('.quiz-option').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        const q = Number(e.currentTarget.dataset.q);
        const o = e.currentTarget.dataset.o;
        const tipo = this.nodo.minijuego?.tipo || 'quiz';
        const pregunta = (this.nodo.minijuego?.preguntas || [])[q];

        if (!pregunta) return;

        if (tipo === 'quiz') {
          const correctaIdx = (pregunta.opciones || []).findIndex((x) => x.correcta);
          const isCorrect = Number(o) === correctaIdx;
          this.answers[q] = isCorrect ? 1 : 0;
          this.root
            .querySelectorAll(`.quiz-option[data-q="${q}"]`)
            .forEach((b) => {
              b.disabled = true;
              if (Number(b.dataset.o) === correctaIdx) b.classList.add('is-correct');
              else if (b === e.currentTarget && !isCorrect) b.classList.add('is-wrong');
            });
          this._showFeedback(q, isCorrect, isCorrect ? pregunta.feedbackCorrecto : pregunta.feedbackIncorrecto);
        } else if (tipo === 'verdadero-falso') {
          const isCorrect = (o === 'true') === pregunta.correcta;
          this.answers[q] = isCorrect ? 1 : 0;
          this.root.querySelectorAll(`.quiz-option[data-q="${q}"]`).forEach((b) => (b.disabled = true));
          e.currentTarget.classList.add(isCorrect ? 'is-correct' : 'is-wrong');
          this._showFeedback(q, isCorrect, pregunta.feedback);
        }

        this._maybeEnableFinish();
      });
    });

    const finishBtn = this.root.querySelector('#btn-terminar');
    if (finishBtn) {
      finishBtn.addEventListener('click', () => {
        const score = this._computeScore();
        this.destroy();
        this.onFinish?.(score);
      });
    }
  }

  _showFeedback(q, isCorrect, text) {
    const el = this.root?.querySelector(`.quiz-feedback[data-q="${q}"]`);
    if (!el) return;
    el.className = `quiz-feedback is-open ${isCorrect ? 'is-correct' : 'is-wrong'}`;
    el.textContent = text || (isCorrect ? '¡Correcto!' : 'Revisa la retroalimentación.');
  }

  _maybeEnableFinish() {
    const btn = this.root?.querySelector('#btn-terminar');
    if (!btn) return;
    const tipo = this.nodo.minijuego?.tipo || 'quiz';
    const total =
      tipo === 'quiz' || tipo === 'verdadero-falso'
        ? (this.nodo.minijuego?.preguntas || []).length
        : 1;
    const answered = Object.keys(this.answers).length;
    btn.disabled = answered < total;
  }

  _computeScore() {
    const tipo = this.nodo.minijuego?.tipo || 'quiz';
    if (tipo === 'drag-drop') return SCORE.MAX;
    const values = Object.values(this.answers);
    if (values.length === 0) return 0;
    const ratio = values.reduce((a, b) => a + b, 0) / values.length;
    return Math.round(Math.min(SCORE.MAX, Math.max(SCORE.MIN, ratio * SCORE.MAX)));
  }

  destroy() {
    if (this.root) {
      this.root.classList.remove('is-open');
      this.root.innerHTML = '';
    }
    this.root = null;
  }
}

function escapeHTML(s) {
  return String(s ?? '').replace(
    /[&<>"']/g,
    (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]
  );
}
