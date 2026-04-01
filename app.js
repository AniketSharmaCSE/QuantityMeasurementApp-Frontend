// API config 
// JSON Server – only used for the users list (demo/example)
const JSON_SERVER = 'http://localhost:3000';

// C# API – login, register, history
const API_BASE = 'https://localhost:5000/api/v1';

// 
const UNITS = {
  Length:      ['Feet', 'Inches', 'Yards', 'Centimeters'],
  Weight:      ['Gram', 'Kilogram', 'Pound'],
  Volume:      ['Litre', 'Millilitre', 'Gallon'],
  Temperature: ['Celsius', 'Fahrenheit', 'Kelvin'],
};

let currentType   = 'Length';
let currentAction = 'compare';
let currentUser   = null;
let token         = null;   // JWT from C# API

//  AUTH MODAL 
function showAuthModal() {
  document.getElementById('auth-modal-overlay').style.display = 'flex';
  switchTab('login');
}

function hideAuthModal() {
  document.getElementById('auth-modal-overlay').style.display = 'none';
}

//  AUTH 
function switchTab(tab) {
  document.getElementById('form-signup').classList.toggle('active', tab === 'signup');
  document.getElementById('form-signup').classList.toggle('hidden', tab !== 'signup');
  document.getElementById('form-login').classList.toggle('active', tab === 'login');
  document.getElementById('form-login').classList.toggle('hidden', tab !== 'login');
  document.getElementById('tab-signup').classList.toggle('active', tab === 'signup');
  document.getElementById('tab-login').classList.toggle('active', tab === 'login');
}

function togglePw(id) {
  const el = document.getElementById(id);
  el.type = el.type === 'password' ? 'text' : 'password';
}

function showAuthError(formId, msg) {
  const el = document.getElementById(formId + '-error');
  el.textContent = msg;
  el.style.display = 'block';
}

function checkPasswordStrength(password) {
  const hasUpper   = /[A-Z]/.test(password);
  const hasNumber  = /\d/.test(password);
  const hasSpecial = /[!@#$%^&*()\-_=+\[\]{};':"\\|,.<>\/?]/.test(password);
  const longEnough = password.length >= 6;
  const score = [hasUpper, hasNumber, hasSpecial, longEnough].filter(Boolean).length;
  if (score <= 2) return 'weak';
  if (score === 3) return 'fair';
  return 'strong';
}

function onPasswordInput() {
  const password = document.getElementById('signup-password').value;
  const bar      = document.getElementById('strength-bar');
  const label    = document.getElementById('strength-label');
  if (!password) { bar.className = 'strength-bar'; label.textContent = ''; return; }
  const level = checkPasswordStrength(password);
  bar.className = 'strength-bar ' + level;
  label.textContent = level.charAt(0).toUpperCase() + level.slice(1);
}

function validatePassword(password) {
  if (password.length < 6)             return 'Password must be at least 6 characters.';
  if (!/[A-Z]/.test(password))         return 'Password must contain at least one uppercase letter.';
  if (!/\d/.test(password))            return 'Password must contain at least one number.';
  if (!/[!@#$%^&*()\-_=+\[\]{};':"\\|,.<>\/?]/.test(password))
                                       return 'Password must contain at least one special character.';
  return null;
}

async function handleSignup(e) {
  e.preventDefault();
  document.getElementById('signup-error').style.display = 'none';

  const name     = document.getElementById('signup-name').value.trim();
  const email    = document.getElementById('signup-email').value.trim();
  const password = document.getElementById('signup-password').value;
  const username = document.getElementById('signup-username').value.trim();

  if (!name)     { showAuthError('signup', 'Please enter your full name.'); return; }
  if (!email)    { showAuthError('signup', 'Please enter your email.'); return; }
  if (!username) { showAuthError('signup', 'Please choose a username.'); return; }

  const pwError = validatePassword(password);
  if (pwError)   { showAuthError('signup', pwError); return; }

  try {
    const res  = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password, name })
    });

    const data = await res.json();

    if (!res.ok) {
      const msg = data.message || data.title || 'Registration failed.';
      showAuthError('signup', msg);
      return;
    }

    await fetch(`${JSON_SERVER}/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, username, createdAt: new Date().toISOString() })
    }).catch(() => {});

    showNotif('Account created! Please log in.', 'success');
    switchTab('login');
    document.getElementById('login-username').value = username;

  } catch (err) {
    showAuthError('signup', 'Could not connect to the API. Is it running?');
  }
}

async function handleLogin(e) {
  e.preventDefault();
  document.getElementById('login-error').style.display = 'none';

  const username = document.getElementById('login-username').value.trim();
  const password = document.getElementById('login-password').value;

  if (!username) { showAuthError('login', 'Please enter your username.'); return; }
  if (!password) { showAuthError('login', 'Please enter your password.'); return; }

  try {
    const res  = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });

    const data = await res.json();

    if (!res.ok) {
      showAuthError('login', data.message || 'Invalid username or password.');
      return;
    }

    token       = data.token;
    currentUser = { username: data.username, email: data.email, name: data.name };

    hideAuthModal();
    updateHeaderForAuth();
    showNotif(`Welcome back, ${data.username}!`, 'success');
    loadAllHistory();

  } catch (err) {
    showAuthError('login', 'Could not connect to the API. Is it running?');
  }
}

function logout() {
  currentUser = null;
  token       = null;
  updateHeaderForAuth();
  clearSessionHistory();
  renderHistoryLoggedOut();
  showNotif('Logged out.', '');
}

function updateHeaderForAuth() {
  const userSpan = document.getElementById('display-username');
  const authBtn  = document.getElementById('header-auth-btn');
  if (currentUser) {
    userSpan.textContent = currentUser.username;
    authBtn.textContent  = 'Logout';
    authBtn.onclick      = logout;
  } else {
    userSpan.textContent = '';
    authBtn.textContent  = 'Login';
    authBtn.onclick      = showAuthModal;
  }
}

function renderHistoryLoggedOut() {
  const list = document.getElementById('history-list');
  list.innerHTML = `
    <div style="color:var(--muted);font-size:14px;text-align:center;padding:30px 20px">
      <div style="font-size:28px;margin-bottom:10px">🔒</div>
      <div style="font-weight:600;margin-bottom:6px;color:var(--text)">Login to view history</div>
      <div style="margin-bottom:14px">Your calculation history is saved when you're logged in.</div>
      <button onclick="showAuthModal()" style="background:var(--primary);color:#fff;border:none;border-radius:8px;padding:8px 20px;cursor:pointer;font-size:13px;font-weight:600">Login / Sign Up</button>
    </div>`;
}

//  TYPE & ACTION 
function selectType(card) {
  document.querySelectorAll('.type-card').forEach(c => c.classList.remove('active'));
  card.classList.add('active');
  currentType = card.dataset.type;

  const arithTab = document.getElementById('arith-tab');
  if (currentType === 'Temperature') {
    arithTab.style.opacity       = '0.4';
    arithTab.style.pointerEvents = 'none';
    if (currentAction === 'arith') {
      selectAction(document.querySelector('.action-tab[data-action="compare"]'));
    }
  } else {
    arithTab.style.opacity       = '';
    arithTab.style.pointerEvents = '';
  }

  populateUnits();
  clearResult();
}

function selectAction(btn) {
  document.querySelectorAll('.action-tab').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  currentAction = btn.dataset.action;

  document.querySelectorAll('.input-panel').forEach(p => p.classList.remove('active'));
  document.getElementById('panel-' + (currentAction === 'arith' ? 'arith' : currentAction)).classList.add('active');

  populateUnits();
  clearResult();
}

function updateOpBadge() {
  const op     = document.getElementById('arith-op').value;
  const badges = { Add: '+', Subtract: '−', Divide: '÷' };
  document.getElementById('op-badge').textContent = badges[op] || '+';
  const showTarget = op === 'Add' && currentType === 'Length';
  document.getElementById('target-unit-label').style.display = showTarget ? '' : 'none';
  document.getElementById('arith-target').style.display      = showTarget ? '' : 'none';
}

function populateUnits() {
  const units = UNITS[currentType] || [];

  function fill(id, defaultIdx = 0) {
    const sel = document.getElementById(id);
    if (!sel) return;
    sel.innerHTML = units.map((u, i) =>
      `<option value="${u}" ${i === defaultIdx ? 'selected' : ''}>${u}</option>`
    ).join('');
  }

  fill('cmp-u1', 0); fill('cmp-u2', 1);
  fill('conv-from', 0); fill('conv-to', 1);
  fill('arith-u1', 0); fill('arith-u2', 1); fill('arith-target', 0);
  updateOpBadge();
}

//  EXECUTE 
async function execute() {
  const btn = document.getElementById('btn-execute');
  btn.classList.add('loading');

  try {
    let result;
    if (currentAction === 'compare')      result = await doCompare();
    else if (currentAction === 'convert') result = await doConvert();
    else                                  result = await doArithmetic();

    showResult(result);
    saveToSessionHistory(result);
    if (token) await loadAllHistory();
    else renderSessionHistory();
  } catch (err) {
    showResultError(err.message);
  } finally {
    btn.classList.remove('loading');
  }
}

//  SESSION-ONLY HISTORY ─
// Uses sessionStorage — automatically wiped when the tab/browser is closed.
function saveToSessionHistory(data) {
  const entry = { ...data, timestamp: new Date().toISOString() };
  const existing = JSON.parse(sessionStorage.getItem('qm_session_history') || '[]');
  existing.unshift(entry);
  if (existing.length > 50) existing.length = 50;
  sessionStorage.setItem('qm_session_history', JSON.stringify(existing));
}

function getSessionHistory() {
  return JSON.parse(sessionStorage.getItem('qm_session_history') || '[]');
}

function clearSessionHistory() {
  sessionStorage.removeItem('qm_session_history');
}

function renderSessionHistory() {
  const items = getSessionHistory();
  if (!items.length) { renderHistoryLoggedOut(); return; }

  const list = document.getElementById('history-list');
  const sessionNote = `<div style="background:rgba(61,90,241,0.08);border-radius:8px;padding:8px 14px;margin-bottom:10px;font-size:12px;color:var(--muted);display:flex;align-items:center;gap:8px">
    <span>⏱</span><span>Session history — cleared when tab closes. <button onclick="showAuthModal()" style="background:none;border:none;color:var(--primary);cursor:pointer;font-size:12px;font-weight:600;padding:0">Login</button> to save permanently.</span>
  </div>`;
  list.innerHTML = sessionNote + items.map(item => buildHistoryItem(item)).join('');
}

function authHeader() {
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  return headers;
}

async function doCompare() {
  const v1 = parseFloat(document.getElementById('cmp-v1').value);
  const v2 = parseFloat(document.getElementById('cmp-v2').value);
  const u1 = document.getElementById('cmp-u1').value;
  const u2 = document.getElementById('cmp-u2').value;

  const res = await fetch(`${API_BASE}/quantities/compare`, {
    method: 'POST',
    headers: authHeader(),
    body: JSON.stringify({ value1: v1, unit1: u1, value2: v2, unit2: u2, category: currentType })
  });
  if (!res.ok) throw new Error('Compare failed.');
  return res.json();
}

async function doConvert() {
  const v    = parseFloat(document.getElementById('conv-v').value);
  const from = document.getElementById('conv-from').value;
  const to   = document.getElementById('conv-to').value;

  const res = await fetch(`${API_BASE}/quantities/convert`, {
    method: 'POST',
    headers: authHeader(),
    body: JSON.stringify({ value: v, fromUnit: from, toUnit: to, category: currentType })
  });
  if (!res.ok) throw new Error('Conversion failed.');
  const data = await res.json();

  document.getElementById('conv-result-display').textContent =
    data.result ? (+data.result.value.toFixed(6)) + '' : '—';

  return data;
}

async function doArithmetic() {
  const v1         = parseFloat(document.getElementById('arith-v1').value);
  const v2         = parseFloat(document.getElementById('arith-v2').value);
  const u1         = document.getElementById('arith-u1').value;
  const u2         = document.getElementById('arith-u2').value;
  const op         = document.getElementById('arith-op').value;
  const targetUnit = document.getElementById('arith-target').value;

  const res = await fetch(`${API_BASE}/quantities/calculate`, {
    method: 'POST',
    headers: authHeader(),
    body: JSON.stringify({ value1: v1, unit1: u1, value2: v2, unit2: u2, operation: op, targetUnit, category: currentType })
  });
  if (!res.ok) throw new Error('Arithmetic failed.');
  return res.json();
}

//  RESULT DISPLAY 
function showResult(data) {
  const box  = document.getElementById('result-box');
  const val  = document.getElementById('result-value');
  const meta = document.getElementById('result-meta');

  box.classList.remove('error');
  box.classList.add('visible');

  if (data.operation === 'Compare') {
    // FIX: strict === true so false boolResult is never misread as "no data"
    const isEqual    = data.boolResult === true;
    val.textContent  = isEqual ? 'Equal' : 'Not Equal';
    val.style.color  = isEqual ? 'var(--success)' : 'var(--accent)';
    meta.textContent = `${data.operand1?.value} ${data.operand1?.unit} vs ${data.operand2?.value} ${data.operand2?.unit}`;
  } else if (data.operation === 'Convert') {
    val.style.color  = 'var(--primary)';
    val.textContent  = `${(+data.result.value.toFixed(6))} ${data.result.unit}`;
    meta.textContent = `${data.operand1?.value} ${data.operand1?.unit} → ${data.result?.unit}`;
  } else {
    val.style.color  = 'var(--primary)';
    const rv = data.scalarResult != null ? data.scalarResult : data.result?.value;
    val.textContent  = `${(+rv.toFixed(6))} ${data.result?.unit}`;
    meta.textContent = `${data.operand1?.value} ${data.operand1?.unit} ${data.operation?.toLowerCase()} ${data.operand2?.value} ${data.operand2?.unit}`;
  }
}

function showResultError(msg) {
  const box = document.getElementById('result-box');
  box.classList.add('visible', 'error');
  document.getElementById('result-value').textContent = msg;
  document.getElementById('result-value').style.color = 'var(--accent)';
  document.getElementById('result-meta').textContent  = '';
}

function clearResult() {
  document.getElementById('result-box').classList.remove('visible', 'error');
  document.getElementById('conv-result-display').textContent = '—';
}

//  HISTORY (from C# API) 
async function loadAllHistory() {
  if (!token) return;
  try {
    const res = await fetch(`${API_BASE}/history`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!res.ok) return;
    const data = await res.json();
    renderHistory(data);
  } catch { /* API offline */ }
}

function buildHistoryItem(item) {
  const category = item.operand1?.category || item.result?.category || '';
  let detail = '', result = '';

  if (item.operation === 'Compare') {
    detail = `${item.operand1?.value} ${item.operand1?.unit} vs ${item.operand2?.value} ${item.operand2?.unit}`;
    // FIX: strict === true check — false boolResult must show "Not Equal", not be ambiguous
    result = item.boolResult === true ? 'Equal' : 'Not Equal';
  } else if (item.operation === 'Convert') {
    detail = `${item.operand1?.value} ${item.operand1?.unit}`;
    result = `${(+item.result?.value?.toFixed(4))} ${item.result?.unit}`;
  } else {
    detail = `${item.operand1?.value} ${item.operand1?.unit} · ${item.operand2?.value} ${item.operand2?.unit}`;
    const rv = item.scalarResult != null ? item.scalarResult : item.result?.value;
    result = `${(+(rv || 0).toFixed(4))} ${item.result?.unit || ''}`;
  }

  const time = item.timestamp ? new Date(item.timestamp).toLocaleTimeString() : '';

  return `
    <div class="history-item">
      <span class="history-op">${item.operation}</span>
      <div style="flex:1;margin:0 14px">
        <div class="history-detail">${detail}</div>
        <div class="history-time">${category} · ${time}</div>
      </div>
      <span class="history-result">${result}</span>
    </div>`;
}

function renderHistory(items) {
  const list = document.getElementById('history-list');
  if (!items || !items.length) {
    list.innerHTML = '<div style="color:var(--muted);font-size:14px;text-align:center;padding:20px">No records yet.</div>';
    return;
  }
  list.innerHTML = items.map(item => buildHistoryItem(item)).join('');
}

async function clearHistory() {
  if (!token) { showNotif('Login to manage history.', 'error'); return; }
  try {
    const res = await fetch(`${API_BASE}/history`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!res.ok) throw new Error();

    clearSessionHistory();
    renderHistory([]);
    showNotif('History cleared.', 'success');
  } catch { showNotif('Could not clear history.', 'error'); }
}

//  NOTIFICATION ─
function showNotif(msg, type = '') {
  const n = document.getElementById('notif');
  n.textContent = msg;
  n.className   = 'notif ' + type;
  n.classList.add('show');
  setTimeout(() => n.classList.remove('show'), 2800);
}

//  INIT ─
populateUnits();

// Check for Google OAuth redirect token in URL
const urlParams = new URLSearchParams(window.location.search);
if (urlParams.has('token')) {
  token = urlParams.get('token');
  currentUser = {
    username: urlParams.get('username'),
    email: urlParams.get('email'),
    name: urlParams.get('name')
  };
  window.history.replaceState({}, document.title, window.location.pathname);
  showNotif('Logged in with Google!', 'success');
}

// Always show app directly — no login wall on load
updateHeaderForAuth();

if (token) {
  loadAllHistory();
} else {
  const sessionItems = getSessionHistory();
  if (sessionItems.length) renderSessionHistory();
  else renderHistoryLoggedOut();
}

// Close auth modal when clicking the backdrop
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('auth-modal-overlay')?.addEventListener('click', function(e) {
    if (e.target === this) hideAuthModal();
  });
});
