// All backend communication goes through here.
// When the PHP backend is ready, set BASE_URL to your server (e.g. '/api').
// Every function returns { ok, data, error } so callers never deal with raw fetch.

const BASE_URL = '/api';

async function request(method, path, body = null) {
  const options = {
    method,
    headers: { 'Content-Type': 'application/json', 'X-Requested-With': 'XMLHttpRequest' },
    credentials: 'same-origin',
  };

  if (body) options.body = JSON.stringify(body);

  try {
    const res = await fetch(`${BASE_URL}${path}`, options);
    const data = await res.json();
    return { ok: res.ok, data, error: res.ok ? null : (data.message ?? 'Something went wrong.') };
  } catch {
    return { ok: false, data: null, error: 'Could not reach the server.' };
  }
}

// Auth — maps to /api/auth/login.php, /api/auth/signup.php, etc.
export const auth = {
  login:   (email, password)              => request('POST', '/auth/login',   { email, password }),
  signup:  (username, email, password)    => request('POST', '/auth/signup',  { username, email, password }),
  logout:  ()                             => request('POST', '/auth/logout'),
  session: ()                             => request('GET',  '/auth/session'),
};

// Scores — maps to /api/scores/save.php, /api/scores/leaderboard.php
export const scores = {
  save:        (wpm, accuracy, duration) => request('POST', '/scores/save',        { wpm, accuracy, duration }),
  leaderboard: (duration = 60)           => request('GET',  `/scores/leaderboard?duration=${duration}`),
  personal:    ()                        => request('GET',  '/scores/personal'),
};
