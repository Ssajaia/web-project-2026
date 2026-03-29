import { calculateWPM, calculateAccuracy, formatTime, pickRandom } from './utils.js';
import {
  renderSentence, updateCharStyles, updateWPM, updateAccuracy,
  updateTimerDisplay, showResultOverlay, hideResultOverlay,
  setInputEnabled, clearInput, updateModeButtons,
} from './ui.js';
import { scores } from './api.js';

const state = {
  sentences:       [],
  currentSentence: '',
  typedInput:      '',
  correctChars:    0,
  totalTyped:      0,
  duration:        60,
  timeRemaining:   60,
  timerInterval:   null,
  isRunning:       false,
  hasStarted:      false,
};

export async function loadSentences() {
  try {
    const res = await fetch('./data/sentences.json');
    if (!res.ok) throw new Error();
    state.sentences = await res.json();
  } catch {
    state.sentences = ['The quick brown fox jumps over the lazy dog.'];
  }
}

export function resetTest() {
  stopTimer();

  state.typedInput    = '';
  state.correctChars  = 0;
  state.totalTyped    = 0;
  state.timeRemaining = state.duration;
  state.isRunning     = false;
  state.hasStarted    = false;
  state.currentSentence = pickRandom(state.sentences);

  const display = document.getElementById('typing-display-text');
  if (display) renderSentence(state.currentSentence, display);

  updateTimerDisplay(formatTime(state.timeRemaining));
  updateWPM('—');
  updateAccuracy('—');
  clearInput();
  setInputEnabled(true);
  hideResultOverlay();
}

export function handleInput(typed) {
  if (!state.hasStarted) {
    state.hasStarted = true;
    startTimer();
  }

  state.typedInput = typed;
  state.totalTyped = typed.length;

  let correct = 0;
  [...typed].forEach((char, i) => { if (char === state.currentSentence[i]) correct++; });
  state.correctChars = correct;

  const display = document.getElementById('typing-display-text');
  if (display) updateCharStyles(typed, state.currentSentence, display);

  if (typed.length >= state.currentSentence.length) loadNextSentence();
}

export function setDuration(seconds) {
  state.duration = seconds;
  updateModeButtons(seconds);
  resetTest();
}

function startTimer() {
  if (state.isRunning) return;
  state.isRunning = true;

  state.timerInterval = setInterval(() => {
    state.timeRemaining -= 1;
    updateTimerDisplay(formatTime(state.timeRemaining));

    const elapsed = state.duration - state.timeRemaining;
    if (elapsed > 0) {
      updateWPM(calculateWPM(state.correctChars, elapsed));
      updateAccuracy(calculateAccuracy(state.correctChars, state.totalTyped));
    }

    if (state.timeRemaining <= 0) endTest();
  }, 1000);
}

function stopTimer() {
  clearInterval(state.timerInterval);
  state.timerInterval = null;
  state.isRunning = false;
}

async function endTest() {
  stopTimer();
  setInputEnabled(false);

  const wpm      = calculateWPM(state.correctChars, state.duration);
  const accuracy = calculateAccuracy(state.correctChars, state.totalTyped);

  updateWPM(wpm);
  updateAccuracy(`${accuracy}%`);
  showResultOverlay({ wpm, accuracy });

  // Save score if the user is logged in — backend ignores the request if not.
  await scores.save(wpm, accuracy, state.duration);
}

function loadNextSentence() {
  state.currentSentence = pickRandom(state.sentences);
  state.typedInput = '';
  clearInput();

  const display = document.getElementById('typing-display-text');
  if (display) renderSentence(state.currentSentence, display);
}
