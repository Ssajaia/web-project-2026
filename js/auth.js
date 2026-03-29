import { isValidEmail, hasMinLength } from './utils.js';
import { showFormError, clearFormError, markFieldError, clearFieldError } from './ui.js';
import { auth } from './api.js';

export function initLoginForm() {
  const form = document.getElementById('login-form');
  if (!form) return;
  form.addEventListener('submit', handleLogin);
  attachInlineValidation(form);
}

export function initSignupForm() {
  const form = document.getElementById('signup-form');
  if (!form) return;
  form.addEventListener('submit', handleSignup);
  attachInlineValidation(form);
}

async function handleLogin(e) {
  e.preventDefault();
  clearFormError('login-error');

  const emailField    = document.getElementById('login-email');
  const passwordField = document.getElementById('login-password');
  const email         = emailField.value.trim();
  const password      = passwordField.value;
  const submitBtn     = e.target.querySelector('[type="submit"]');

  let valid = true;

  if (!isValidEmail(email)) {
    markFieldError(emailField, 'login-email-hint', 'Please enter a valid email address.');
    valid = false;
  } else {
    clearFieldError(emailField, 'login-email-hint');
  }

  if (!hasMinLength(password, 8)) {
    markFieldError(passwordField, 'login-password-hint', 'Password must be at least 8 characters.');
    valid = false;
  } else {
    clearFieldError(passwordField, 'login-password-hint');
  }

  if (!valid) return;

  submitBtn.disabled = true;
  submitBtn.textContent = 'Logging in…';

  const { ok, error } = await auth.login(email, password);

  if (ok) {
    window.location.href = 'index.html';
  } else {
    showFormError('login-error', error);
    submitBtn.disabled = false;
    submitBtn.textContent = 'Log In';
  }
}

async function handleSignup(e) {
  e.preventDefault();
  clearFormError('signup-error');

  const usernameField = document.getElementById('signup-username');
  const emailField    = document.getElementById('signup-email');
  const passwordField = document.getElementById('signup-password');
  const confirmField  = document.getElementById('signup-confirm');
  const submitBtn     = e.target.querySelector('[type="submit"]');

  const username = usernameField.value.trim();
  const email    = emailField.value.trim();
  const password = passwordField.value;
  const confirm  = confirmField.value;

  let valid = true;

  if (!hasMinLength(username, 3)) {
    markFieldError(usernameField, 'signup-username-hint', 'Username must be at least 3 characters.');
    valid = false;
  } else {
    clearFieldError(usernameField, 'signup-username-hint');
  }

  if (!isValidEmail(email)) {
    markFieldError(emailField, 'signup-email-hint', 'Please enter a valid email address.');
    valid = false;
  } else {
    clearFieldError(emailField, 'signup-email-hint');
  }

  if (!hasMinLength(password, 8)) {
    markFieldError(passwordField, 'signup-password-hint', 'Password must be at least 8 characters.');
    valid = false;
  } else {
    clearFieldError(passwordField, 'signup-password-hint');
  }

  if (password !== confirm) {
    markFieldError(confirmField, 'signup-confirm-hint', 'Passwords do not match.');
    valid = false;
  } else {
    clearFieldError(confirmField, 'signup-confirm-hint');
  }

  if (!valid) return;

  submitBtn.disabled = true;
  submitBtn.textContent = 'Creating account…';

  const { ok, error } = await auth.signup(username, email, password);

  if (ok) {
    window.location.href = 'index.html';
  } else {
    showFormError('signup-error', error);
    submitBtn.disabled = false;
    submitBtn.textContent = 'Create Account';
  }
}

function attachInlineValidation(form) {
  form.querySelectorAll('.form-input').forEach((input) => {
    input.addEventListener('input', () => {
      if (input.classList.contains('is-error') && input.value.length > 0) {
        input.classList.remove('is-error');
      }
    });
  });
}
