import { scores } from './api.js';

export async function initLeaderboard() {
  const tbody    = document.getElementById('leaderboard-body');
  const empty    = document.getElementById('leaderboard-empty');
  const loading  = document.getElementById('leaderboard-loading');
  const durationBtns = document.querySelectorAll('.mode-selector__btn');

  let activeDuration = 60;

  async function load(duration) {
    loading?.classList.remove('hidden');
    tbody.innerHTML = '';
    empty?.classList.add('hidden');

    const { ok, data } = await scores.leaderboard(duration);

    loading?.classList.add('hidden');

    if (!ok || !data?.entries?.length) {
      empty?.classList.remove('hidden');
      return;
    }

    data.entries.forEach((entry, i) => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td class="lb-rank">${i + 1}</td>
        <td class="lb-user">${escapeHtml(entry.username)}</td>
        <td class="lb-wpm">${entry.wpm}</td>
        <td class="lb-accuracy">${entry.accuracy}%</td>
        <td class="lb-date">${formatDate(entry.created_at)}</td>
      `;
      tbody.appendChild(tr);
    });
  }

  durationBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      durationBtns.forEach(b => b.classList.remove('is-active'));
      btn.classList.add('is-active');
      activeDuration = parseInt(btn.dataset.duration, 10);
      load(activeDuration);
    });
  });

  load(activeDuration);
}

function escapeHtml(str) {
  return str.replace(/[&<>"']/g, c => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c]));
}

function formatDate(iso) {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
}
