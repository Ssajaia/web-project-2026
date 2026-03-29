/**
 * app.js
 * Application entry point.
 * Detects the current page and initialises only what's needed.
 * Keeps the bundle lean — no logic lives here, only orchestration.
 */

import { loadSentences, resetTest, handleInput, setDuration } from './typing.js';
import { initLoginForm } from './auth.js';
import { initSignupForm } from './auth.js';

// ── Page Detection ─────────────────────────────────────────────
const PAGE = {
  isHome:   document.body.dataset.page === 'home',
  isLogin:  document.body.dataset.page === 'login',
  isSignup: document.body.dataset.page === 'signup',
};

// ── Boot ───────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', async () => {
  if (PAGE.isHome)   await initHomePage();
  if (PAGE.isLogin)  initLoginPage();
  if (PAGE.isSignup) initSignupPage();
});

// ── Page Initialisers ──────────────────────────────────────────

/**
 * Initialise the typing test page.
 */
async function initHomePage() {
  await loadSentences();
  resetTest();
  bindTypingInput();
  bindRestartButton();
  bindModeSelector();
  bindKeyboardShortcuts();
}

/**
 * Initialise the login page.
 */
function initLoginPage() {
  initLoginForm();
}

/**
 * Initialise the signup page.
 */
function initSignupPage() {
  initSignupForm();
}

// ── Event Bindings ─────────────────────────────────────────────

/**
 * Bind the typing input to the core handler.
 */
function bindTypingInput() {
  const input = document.getElementById('typing-input');
  if (!input) return;

  input.addEventListener('input', (e) => {
    handleInput(e.target.value);
  });
}

/**
 * Bind the restart button.
 */
function bindRestartButton() {
  const btn = document.getElementById('restart-btn');
  if (!btn) return;

  btn.addEventListener('click', resetTest);
}

/**
 * Bind the time-mode selector buttons.
 */
function bindModeSelector() {
  document.querySelectorAll('.mode-selector__btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const duration = parseInt(btn.dataset.duration, 10);
      if (!isNaN(duration)) setDuration(duration);
    });
  });
}

/**
 * Global keyboard shortcuts.
 * Tab  → restart test
 * Esc  → restart test
 */
function bindKeyboardShortcuts() {
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      resetTest();
    }
    if (e.key === 'Escape') {
      resetTest();
    }
  });
}
