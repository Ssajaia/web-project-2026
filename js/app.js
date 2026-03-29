// main js entry point

import { loadSentences, resetTest, handleInput, setDuration } from './typing.js';
import { initLoginForm } from './auth.js';
import { initSignupForm } from './auth.js';

const PAGE = {
  isHome:   document.body.dataset.page === 'home',
  isLogin:  document.body.dataset.page === 'login',
  isSignup: document.body.dataset.page === 'signup',
};

document.addEventListener('DOMContentLoaded', async () => {
  if (PAGE.isHome)   await initHomePage();
  if (PAGE.isLogin)  initLoginPage();
  if (PAGE.isSignup) initSignupPage();
});


async function initHomePage() {
  await loadSentences();
  resetTest();
  bindTypingInput();
  bindRestartButton();
  bindModeSelector();
  bindKeyboardShortcuts();
}


function initLoginPage() {
  initLoginForm();
}


function initSignupPage() {
  initSignupForm();
}


function bindTypingInput() {
  const input = document.getElementById('typing-input');
  if (!input) return;

  input.addEventListener('input', (e) => {
    handleInput(e.target.value);
  });
}


function bindRestartButton() {
  const btn = document.getElementById('restart-btn');
  if (!btn) return;

  btn.addEventListener('click', resetTest);
}


function bindModeSelector() {
  document.querySelectorAll('.mode-selector__btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const duration = parseInt(btn.dataset.duration, 10);
      if (!isNaN(duration)) setDuration(duration);
    });
  });
}


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
