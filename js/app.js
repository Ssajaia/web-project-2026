import { loadSentences, resetTest, handleInput, setDuration } from './typing.js';
import { initLoginForm, initSignupForm } from './auth.js';
import { initLeaderboard } from './leaderboard.js';
import { auth } from './api.js';

const page = document.body.dataset.page;

document.addEventListener('DOMContentLoaded', async () => {
  await syncNav();

  if (page === 'home')        initHome();
  if (page === 'login')       initLoginForm();
  if (page === 'signup')      initSignupForm();
  if (page === 'leaderboard') initLeaderboard();
});

async function initHome() {
  await loadSentences();
  resetTest();

  document.getElementById('typing-input')?.addEventListener('input', (e) => handleInput(e.target.value));
  document.getElementById('restart-btn')?.addEventListener('click', resetTest);

  document.querySelectorAll('.mode-selector__btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const d = parseInt(btn.dataset.duration, 10);
      if (!isNaN(d)) setDuration(d);
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Tab')    { e.preventDefault(); resetTest(); }
    if (e.key === 'Escape') resetTest();
  });
}

// Show/hide nav items depending on whether the user has an active session.
async function syncNav() {
  const { ok, data } = await auth.session();
  const loggedIn = ok && data?.loggedIn;

  document.querySelectorAll('[data-auth="guest"]').forEach(el => el.hidden = loggedIn);
  document.querySelectorAll('[data-auth="user"]').forEach(el => el.hidden = !loggedIn);

  if (loggedIn && data.username) {
    const nameEl = document.getElementById('nav-username');
    if (nameEl) nameEl.textContent = data.username;
  }
}
