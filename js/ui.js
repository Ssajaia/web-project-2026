/**
 * ui.js
 * All DOM manipulation lives here.
 * No business logic — only rendering and display updates.
 */

// ── Element references (resolved lazily per page) ──────────────
const el = (id) => document.getElementById(id);

// ── Text Rendering ─────────────────────────────────────────────

/**
 * Render a sentence into the typing display as individual char spans.
 * @param {string} sentence
 * @param {HTMLElement} container
 */
export function renderSentence(sentence, container) {
  container.innerHTML = '';
  [...sentence].forEach((char, index) => {
    const span = document.createElement('span');
    span.classList.add('char');
    span.dataset.index = index;
    if (char === ' ') {
      span.dataset.space = 'true';
      span.textContent = '·';
      span.classList.add('char--space');
    } else {
      span.textContent = char;
    }
    container.appendChild(span);
  });
}

/**
 * Update character styling based on typed input vs. target sentence.
 * @param {string} typed - what the user has typed so far
 * @param {string} target - the full target sentence
 * @param {HTMLElement} container
 */
export function updateCharStyles(typed, target, container) {
  const chars = container.querySelectorAll('.char');

  chars.forEach((span, index) => {
    span.classList.remove('char--correct', 'char--error', 'char--active');

    if (index < typed.length) {
      const isCorrect = typed[index] === target[index];
      span.classList.add(isCorrect ? 'char--correct' : 'char--error');
    } else if (index === typed.length) {
      span.classList.add('char--active');
    }
  });
}

// ── Stats Display ──────────────────────────────────────────────

/**
 * Update the WPM display element.
 * @param {number|string} wpm
 */
export function updateWPM(wpm) {
  const el = document.getElementById('wpm-display');
  if (el) el.textContent = wpm;
}

/**
 * Update the accuracy display element.
 * @param {number|string} accuracy
 */
export function updateAccuracy(accuracy) {
  const el = document.getElementById('accuracy-display');
  if (el) el.textContent = typeof accuracy === 'number' ? `${accuracy}%` : accuracy;
}

/**
 * Update the timer display element.
 * @param {string} timeString - formatted time string e.g. "01:30"
 */
export function updateTimerDisplay(timeString) {
  const el = document.getElementById('timer-display');
  if (el) {
    el.textContent = timeString;
    // Visual warning states
    const seconds = parseInt(timeString.split(':')[1], 10) + (parseInt(timeString.split(':')[0], 10) * 60);
    el.classList.toggle('timer-display--warning',  seconds <= 10 && seconds > 5);
    el.classList.toggle('timer-display--critical', seconds <= 5);
  }
}

// ── Result Overlay ─────────────────────────────────────────────

/**
 * Show the result overlay with final stats.
 * @param {{ wpm: number, accuracy: number }} stats
 */
export function showResultOverlay(stats) {
  const overlay = document.getElementById('result-overlay');
  if (!overlay) return;

  const wpmEl = overlay.querySelector('.result-overlay__wpm');
  if (wpmEl) wpmEl.innerHTML = `${stats.wpm} <span>wpm</span>`;

  overlay.classList.add('is-visible');
}

/**
 * Hide the result overlay.
 */
export function hideResultOverlay() {
  const overlay = document.getElementById('result-overlay');
  if (overlay) overlay.classList.remove('is-visible');
}

// ── Input State ────────────────────────────────────────────────

/**
 * Enable or disable the typing input field.
 * @param {boolean} enabled
 */
export function setInputEnabled(enabled) {
  const input = document.getElementById('typing-input');
  if (input) {
    input.disabled = !enabled;
    if (enabled) input.focus();
  }
}

/**
 * Clear the typing input field.
 */
export function clearInput() {
  const input = document.getElementById('typing-input');
  if (input) input.value = '';
}

// ── Form Errors ────────────────────────────────────────────────

/**
 * Show a form-level error message.
 * @param {string} elementId - ID of the error message element
 * @param {string} message
 */
export function showFormError(elementId, message) {
  const el = document.getElementById(elementId);
  if (!el) return;
  el.textContent = message;
  el.classList.add('is-visible');
}

/**
 * Clear a form-level error message.
 * @param {string} elementId
 */
export function clearFormError(elementId) {
  const el = document.getElementById(elementId);
  if (!el) return;
  el.textContent = '';
  el.classList.remove('is-visible');
}

/**
 * Mark a field as having an error.
 * @param {HTMLElement} field
 * @param {string} hintId - ID of the hint span to update
 * @param {string} message
 */
export function markFieldError(field, hintId, message) {
  field.classList.add('is-error');
  const hint = document.getElementById(hintId);
  if (hint) {
    hint.textContent = message;
    hint.classList.add('form-error');
  }
}

/**
 * Clear error state from a field.
 * @param {HTMLElement} field
 * @param {string} hintId
 * @param {string} [originalHint=''] - restore original hint text
 */
export function clearFieldError(field, hintId, originalHint = '') {
  field.classList.remove('is-error');
  const hint = document.getElementById(hintId);
  if (hint) {
    hint.textContent = originalHint;
    hint.classList.remove('form-error');
  }
}

// ── Toast Notifications ────────────────────────────────────────

/**
 * Show a short-lived toast notification.
 * @param {string} message
 * @param {number} [durationMs=3000]
 */
export function showToast(message, durationMs = 3000) {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.classList.add('toast');
  toast.textContent = message;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(8px)';
    toast.style.transition = 'opacity 200ms, transform 200ms';
    setTimeout(() => toast.remove(), 220);
  }, durationMs);
}

// ── Mode Selector ──────────────────────────────────────────────

/**
 * Update active state on mode selector buttons.
 * @param {number} selectedDuration - the active duration value
 */
export function updateModeButtons(selectedDuration) {
  document.querySelectorAll('.mode-selector__btn').forEach((btn) => {
    const isActive = parseInt(btn.dataset.duration, 10) === selectedDuration;
    btn.classList.toggle('is-active', isActive);
  });
}