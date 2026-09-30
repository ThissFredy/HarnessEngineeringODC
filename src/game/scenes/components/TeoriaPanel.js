/**
 * TeoriaPanel — vista de teoría con avatar guía y contenido por bloques.
 * Se renderiza en DOM sobre el canvas para máxima legibilidad.
 */

export class TeoriaPanel {
  constructor(scene, { nodo, onContinue }) {
    this.scene = scene;
    this.nodo = nodo;
    this.onContinue = onContinue;
    this.root = null;
    this._build();
    this._bind();
  }

  _build() {
    const teoria = this.nodo.teoria || {};
    const bloques = Array.isArray(teoria.bloques) ? teoria.bloques : [];

    const host = document.getElementById('game-container');
    if (!host) return;

    let overlay = host.querySelector('#teoria-overlay');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.id = 'teoria-overlay';
      overlay.className = 'overlay';
      host.appendChild(overlay);
    }

    overlay.innerHTML = `
      <section class="panel" role="dialog" aria-label="Teoría del nodo">
        <header>
          <p class="panel__subtitle">Nodo ${this.nodo.id} · Teoría</p>
          <h2 class="panel__title">${escapeHTML(this.nodo.titulo)}</h2>
        </header>

        <div class="avatar">
          <div class="avatar__img" aria-hidden="true" style="display:flex;align-items:center;justify-content:center;font-family:var(--font-pixel);font-size:10px;color:#46c2ff">AVA</div>
          <div class="avatar__bubble">${escapeHTML(teoria.hook || '¡Bienvenido! Vamos a explorar este tema.')}</div>
        </div>

        <div class="panel__body">
          ${bloques
            .map(
              (b) => `
            <article>
              <h3 class="panel__subtitle">${escapeHTML(b.titulo || '')}</h3>
              <p>${escapeHTML(b.cuerpo || '')}</p>
            </article>
          `
            )
            .join('')}

          ${
            teoria.analogia
              ? `<div class="keyfact"><strong>Analogía:</strong> ${escapeHTML(teoria.analogia)}</div>`
              : ''
          }
          ${teoria.datoClave ? `<div class="keyfact"><strong>Dato clave:</strong> ${escapeHTML(teoria.datoClave)}</div>` : ''}

          ${
            Array.isArray(teoria.glosario) && teoria.glosario.length
              ? `<ul class="glossary">${teoria.glosario
                  .map(
                    (g) =>
                      `<li><span class="term">${escapeHTML(g.termino)}</span><span>${escapeHTML(g.definicion)}</span></li>`
                  )
                  .join('')}</ul>`
              : ''
          }
        </div>

        <footer class="btn-row">
          <button class="btn btn--primary" id="btn-ir-minijuego">Ir al minijuego ▶</button>
        </footer>
      </section>
    `;

    overlay.classList.add('is-open');
    this.root = overlay;
  }

  _bind() {
    if (!this.root) return;
    const btn = this.root.querySelector('#btn-ir-minijuego');
    if (btn) {
      btn.addEventListener('click', () => {
        this.destroy();
        this.onContinue?.();
      });
    }
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
