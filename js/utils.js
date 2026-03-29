
export function formatTime(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}
export function calculateWPM(correctChars, elapsedSeconds) {
  if (elapsedSeconds <= 0) return 0;
  const words = correctChars / 5;
  const minutes = elapsedSeconds / 60;
  return Math.round(words / minutes);
}
export function calculateAccuracy(correctChars, totalTyped) {
  if (totalTyped === 0) return 100;
  return Math.round((correctChars / totalTyped) * 100);
}
export function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}
export function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}
export function debounce(fn, delayMs) {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delayMs);
  };
}
export function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}
export function hasMinLength(value, min) {
  return value.trim().length >= min;
}
