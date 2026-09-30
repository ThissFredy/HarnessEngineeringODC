/**
 * Wrapper SCORM 1.2 — ODC Harness Engineering
 * Licencia: MIT (ver archivo LICENSE)
 *
 * Compatibilidad: SCORM 1.2 Run-Time Environment.
 * Comunicación con el LMS mediante window.API (o window.parent.API).
 * Si no hay API (modo dev en navegador), entra en fallback con localStorage.
 */

const SCORM_KEYS = {
  lessonStatus: 'cmi.core.lesson_status',
  location: 'cmi.core.lesson_location',
  scoreRaw: 'cmi.core.score.raw',
  scoreMin: 'cmi.core.score.min',
  scoreMax: 'cmi.core.score.max',
  sessionTime: 'cmi.core.session_time',
  suspendData: 'cmi.suspend_data'
};

const LS_PREFIX = 'odc-harness-';

class SCORM12 {
  constructor() {
    this.api = null;
    this.initialized = false;
    this.fallback = false;
    this.sessionStart = Date.now();
    this._finished = false;
    this._onBeforeUnload = this._onBeforeUnload.bind(this);
  }

  _findAPI(win) {
    let attempts = 0;
    let current = win;
    while (current && attempts < 100) {
      if (current.API && typeof current.API.LMSInitialize === 'function') {
        return current.API;
      }
      if (current.parent && current.parent !== current) {
        current = current.parent;
      } else if (current.opener) {
        current = current.opener;
      } else {
        break;
      }
      attempts++;
    }
    return null;
  }

  init() {
    this.api = this._findAPI(window);
    if (!this.api) {
      this.fallback = true;
      this.initialized = true;
      this.sessionStart = Date.now();
      this._bindUnload();
      return false;
    }
    try {
      const ok = this.api.LMSInitialize('');
      this.initialized = ok === true || ok === 'true';
    } catch (_) {
      this.initialized = false;
    }
    if (this.initialized) {
      this.sessionStart = Date.now();
      this._bindUnload();
    }
    return this.initialized;
  }

  _bindUnload() {
    if (typeof window === 'undefined') return;
    window.addEventListener('pagehide', this._onBeforeUnload);
    window.addEventListener('beforeunload', this._onBeforeUnload);
  }

  _onBeforeUnload() {
    this.finish();
  }

  _set(key, value) {
    if (!this.initialized) return false;
    const v = String(value ?? '');
    if (this.fallback) {
      try {
        localStorage.setItem(LS_PREFIX + key, v);
        return true;
      } catch (_) {
        return false;
      }
    }
    try {
      return this.api.LMSSetValue(key, v) === true || this.api.LMSSetValue(key, v) === 'true';
    } catch (_) {
      return false;
    }
  }

  _get(key) {
    if (!this.initialized) return '';
    if (this.fallback) {
      try {
        return localStorage.getItem(LS_PREFIX + key) || '';
      } catch (_) {
        return '';
      }
    }
    try {
      return this.api.LMSGetValue(key) || '';
    } catch (_) {
      return '';
    }
  }

  commit() {
    if (!this.initialized || this.fallback) return true;
    try {
      return this.api.LMSCommit('') === true || this.api.LMSCommit('') === 'true';
    } catch (_) {
      return false;
    }
  }

  formatSessionTime(ms) {
    const total = Math.max(0, Math.floor(ms / 1000));
    const h = Math.floor(total / 3600);
    const m = Math.floor((total % 3600) / 60);
    const s = total % 60;
    const pad = (n) => String(n).padStart(2, '0');
    return `${pad(h).padStart(4, '0')}:${pad(m)}:${pad(s)}.00`;
  }

  setLessonStatus(status) {
    const valid = ['passed', 'completed', 'failed', 'incomplete', 'browsed', 'not attempted'];
    const v = valid.includes(status) ? status : 'incomplete';
    this._set(SCORM_KEYS.lessonStatus, v);
    return this.commit();
  }

  setScore(raw, min = 0, max = 100) {
    const clamp = (n) => (Number.isFinite(Number(n)) ? Number(n) : 0);
    this._set(SCORM_KEYS.scoreMin, clamp(min));
    this._set(SCORM_KEYS.scoreMax, clamp(max));
    this._set(SCORM_KEYS.scoreRaw, clamp(raw));
    return this.commit();
  }

  setLessonLocation(loc) {
    const s = String(loc ?? '').slice(0, 255);
    this._set(SCORM_KEYS.location, s);
    return this.commit();
  }

  saveProgress(state) {
    let payload = '';
    try {
      payload = JSON.stringify(state ?? {});
    } catch (_) {
      payload = '';
    }
    this._set(SCORM_KEYS.suspendData, payload);
    if (state && typeof state === 'object' && state.ultimoNodo) {
      this.setLessonLocation(state.ultimoNodo);
    }
    return this.commit();
  }

  loadProgress() {
    const raw = this._get(SCORM_KEYS.suspendData);
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch (_) {
      return null;
    }
  }

  getLastError() {
    if (this.fallback || !this.api) return '0';
    try {
      return String(this.api.LMSGetLastError() ?? '0');
    } catch (_) {
      return '0';
    }
  }

  finish() {
    if (this._finished || !this.initialized) return true;
    this._finished = true;
    const elapsed = Date.now() - this.sessionStart;
    this._set(SCORM_KEYS.sessionTime, this.formatSessionTime(elapsed));
    this.commit();
    if (!this.fallback) {
      try {
        this.api.LMSFinish('');
      } catch (_) {
        /* noop */
      }
    }
    if (typeof window !== 'undefined') {
      window.removeEventListener('pagehide', this._onBeforeUnload);
      window.removeEventListener('beforeunload', this._onBeforeUnload);
    }
    this.initialized = false;
    return true;
  }
}

export const scorm = new SCORM12();
export const SCORM_KEY = SCORM_KEYS;
export default scorm;
