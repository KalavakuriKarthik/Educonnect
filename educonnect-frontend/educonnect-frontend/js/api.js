/* ══════════════════════════════════════════════
   EduConnect – api.js
   Central API layer: all fetch calls to backend
   Base URL: http://localhost:8080
   ══════════════════════════════════════════════ */

const API_BASE = 'http://localhost:8080';

// ─── Token helpers ────────────────────────────
const Auth = {
  getToken  : ()        => localStorage.getItem('ec_token'),
  getUser   : ()        => JSON.parse(localStorage.getItem('ec_user') || 'null'),
  setSession: (data)    => {
    localStorage.setItem('ec_token', data.token);
    localStorage.setItem('ec_user',  JSON.stringify({ userId: data.userId, name: data.name, email: data.email, role: data.role }));
  },
  clear: () => {
    localStorage.removeItem('ec_token');
    localStorage.removeItem('ec_user');
  },
  isLoggedIn: () => !!localStorage.getItem('ec_token'),
  redirectIfNotLoggedIn: () => {
    if (!Auth.isLoggedIn()) { window.location.href = '../index.html'; }
  },
  redirectIfLoggedIn: () => {
    if (Auth.isLoggedIn()) {
      const role = Auth.getUser()?.role;
      window.location.href = roleDashboard(role);
    }
  }
};

function roleDashboard(role) {
  const map = {
    STUDENT          : 'pages/student-dashboard.html',
    TEACHER          : 'pages/teacher-dashboard.html',
    SCHOOL_ADMIN     : 'pages/admin-dashboard.html',
    PROGRAM_MANAGER  : 'pages/admin-dashboard.html',
    COMPLIANCE_OFFICER: 'pages/compliance-dashboard.html',
    GOVERNMENT_AUDITOR: 'pages/compliance-dashboard.html',
  };
  return map[role] || 'index.html';
}

// ─── Core fetch wrapper ───────────────────────
async function apiFetch(endpoint, options = {}) {
  const token = Auth.getToken();
  const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}${endpoint}`, { ...options, headers });

  if (res.status === 401) { Auth.clear(); window.location.href = '../index.html'; return; }

  const text = await res.text();
  let data;
  try { data = text ? JSON.parse(text) : {}; } catch { data = { message: text }; }

  if (!res.ok) {
    const msg = data?.message || data?.error || `HTTP ${res.status}`;
    throw new Error(msg);
  }
  return data;
}

// ══════════════════════════════════════════════
// API MODULE FUNCTIONS
// ══════════════════════════════════════════════

// ─── Auth ─────────────────────────────────────
const AuthAPI = {
  register: (body) => apiFetch('/api/auth/register', { method: 'POST', body: JSON.stringify(body) }),
  login   : (body) => apiFetch('/api/auth/login',    { method: 'POST', body: JSON.stringify(body) }),
  getUsers: ()     => apiFetch('/api/auth/users'),
};

// ─── Courses ──────────────────────────────────
const CourseAPI = {
  getAll       : ()          => apiFetch('/api/courses'),
  getById      : (id)        => apiFetch(`/api/courses/${id}`),
  getByTeacher : (tid)       => apiFetch(`/api/courses/teacher/${tid}`),
  search       : (title)     => apiFetch(`/api/courses/search?title=${encodeURIComponent(title)}`),
  create       : (body)      => apiFetch('/api/courses',    { method: 'POST', body: JSON.stringify(body) }),
  update       : (id, body)  => apiFetch(`/api/courses/${id}`, { method: 'PUT',  body: JSON.stringify(body) }),
  delete       : (id)        => apiFetch(`/api/courses/${id}`, { method: 'DELETE' }),
};

// ─── Students ─────────────────────────────────
const StudentAPI = {
  getAll       : ()              => apiFetch('/api/students'),
  getById      : (id)            => apiFetch(`/api/students/${id}`),
  getByUserId  : (uid)           => apiFetch(`/api/students/user/${uid}`),
  createProfile: (uid, body)     => apiFetch(`/api/students/profile/${uid}`, { method: 'POST', body: JSON.stringify(body) }),
  update       : (id, body)      => apiFetch(`/api/students/${id}`,          { method: 'PUT',  body: JSON.stringify(body) }),
};

// ─── Enrollments ──────────────────────────────
const EnrollmentAPI = {
  enroll        : (sid, cid) => apiFetch(`/api/enrollments/${sid}/course/${cid}`, { method: 'POST' }),
  unenroll      : (sid, cid) => apiFetch(`/api/enrollments/${sid}/course/${cid}`, { method: 'DELETE' }),
  byStudent     : (sid)      => apiFetch(`/api/enrollments/student/${sid}`),
  byCourse      : (cid)      => apiFetch(`/api/enrollments/course/${cid}`),
};

// ─── Content ──────────────────────────────────
const ContentAPI = {
  byCourse    : (cid)       => apiFetch(`/api/content/course/${cid}`),
  getById     : (id)        => apiFetch(`/api/content/${id}`),
  upload      : (body)      => apiFetch('/api/content',  { method: 'POST', body: JSON.stringify(body) }),
  trackAccess : (cid, sid)  => apiFetch(`/api/content/${cid}/access/${sid}`, { method: 'POST' }),
  delete      : (id)        => apiFetch(`/api/content/${id}`, { method: 'DELETE' }),
};

// ─── Assessments ──────────────────────────────
const AssessmentAPI = {
  getAll       : ()              => apiFetch('/api/assessments'),
  getById      : (id)            => apiFetch(`/api/assessments/${id}`),
  byCourse     : (cid)           => apiFetch(`/api/assessments/course/${cid}`),
  create       : (body)          => apiFetch('/api/assessments', { method: 'POST', body: JSON.stringify(body) }),
  submit       : (body)          => apiFetch('/api/assessments/submit', { method: 'POST', body: JSON.stringify(body) }),
  grade        : (subId, body)   => apiFetch(`/api/assessments/submissions/${subId}/grade`, { method: 'PUT', body: JSON.stringify(body) }),
  submissionsByStudent   : (sid) => apiFetch(`/api/assessments/submissions/student/${sid}`),
  submissionsByAssessment: (aid) => apiFetch(`/api/assessments/submissions/assessment/${aid}`),
};

// ─── Progress ─────────────────────────────────
const ProgressAPI = {
  byStudent          : (sid)        => apiFetch(`/api/progress/student/${sid}`),
  byStudentAndCourse : (sid, cid)   => apiFetch(`/api/progress/student/${sid}/course/${cid}`),
  byCourse           : (cid)        => apiFetch(`/api/progress/course/${cid}`),
};

// ─── Compliance ───────────────────────────────
const ComplianceAPI = {
  getRecords        : ()         => apiFetch('/api/compliance/records'),
  createRecord      : (body)     => apiFetch('/api/compliance/records', { method: 'POST', body: JSON.stringify(body) }),
  recordsByType     : (type)     => apiFetch(`/api/compliance/records/type/${type}`),
  getSummary        : ()         => apiFetch('/api/compliance/summary'),
  getAudits         : ()         => apiFetch('/api/compliance/audits'),
  createAudit       : (oid, b)   => apiFetch(`/api/compliance/audits/${oid}`, { method: 'POST', body: JSON.stringify(b) }),
  auditsByOfficer   : (oid)      => apiFetch(`/api/compliance/audits/officer/${oid}`),
  updateAuditStatus : (id, s)    => apiFetch(`/api/compliance/audits/${id}/status?status=${s}`, { method: 'PUT' }),
};

// ─── Notifications ────────────────────────────
const NotifAPI = {
  byUser    : (uid) => apiFetch(`/api/notifications/user/${uid}`),
  unread    : (uid) => apiFetch(`/api/notifications/user/${uid}/unread`),
  count     : (uid) => apiFetch(`/api/notifications/user/${uid}/count`),
  markRead  : (nid) => apiFetch(`/api/notifications/${nid}/read`,         { method: 'PUT' }),
  markAllRead:(uid) => apiFetch(`/api/notifications/user/${uid}/read-all`, { method: 'PUT' }),
};

// ─── Reports ──────────────────────────────────
const ReportAPI = {
  dashboard : ()           => apiFetch('/api/reports/dashboard'),
  course    : (cid)        => apiFetch(`/api/reports/course/${cid}`),
  generate  : (scope, uid) => apiFetch(`/api/reports/generate?scope=${scope}&generatedBy=${uid}`, { method: 'POST' }),
  getAll    : ()           => apiFetch('/api/reports'),
};

// ─── Audit Logs ───────────────────────────────
const AuditLogAPI = {
  getAll  : ()    => apiFetch('/api/audit-logs'),
  byUser  : (uid) => apiFetch(`/api/audit-logs/user/${uid}`),
};

// ══════════════════════════════════════════════
// UI UTILITY FUNCTIONS
// ══════════════════════════════════════════════

// Toast notifications
function showToast(message, type = 'info') {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    document.body.appendChild(container);
  }
  const icons = { success: '✓', error: '✕', info: 'ℹ' };
  const t = document.createElement('div');
  t.className = `toast ${type}`;
  t.innerHTML = `<span>${icons[type] || 'ℹ'}</span> ${message}`;
  container.appendChild(t);
  setTimeout(() => { t.style.opacity = '0'; t.style.transform = 'translateX(30px)'; t.style.transition = '.3s'; setTimeout(() => t.remove(), 300); }, 3000);
}

// Loading state on buttons
function setLoading(btn, loading, label = 'Save') {
  btn.disabled = loading;
  btn.innerHTML = loading ? '<span class="spinner" style="width:16px;height:16px;border-width:2px;margin:0;display:inline-block;vertical-align:middle"></span> Loading...' : label;
}

// Render a spinner in a container
function renderSpinner(el) {
  el.innerHTML = '<div class="spinner"></div>';
}

// Format date
function fmtDate(d) {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

// Badge HTML
function badge(status) {
  const s = (status || '').toLowerCase();
  return `<span class="badge badge-${s}">${status || '—'}</span>`;
}

// Escape HTML
function esc(str) {
  if (!str) return '';
  return String(str).replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
}

// Build sidebar user info
function renderSidebarUser() {
  const user = Auth.getUser();
  if (!user) return;
  const av = document.getElementById('sidebar-avatar');
  const nm = document.getElementById('sidebar-name');
  const rl = document.getElementById('sidebar-role');
  if (av) av.textContent = (user.name || 'U').charAt(0).toUpperCase();
  if (nm) nm.textContent = user.name || 'User';
  if (rl) rl.textContent = (user.role || '').replace('_', ' ');
}

// Load unread notification count
async function loadNotifCount() {
  const user = Auth.getUser();
  if (!user) return;
  try {
    const data = await NotifAPI.count(user.userId);
    const badge = document.getElementById('notif-count');
    if (badge) {
      badge.textContent = data.unreadCount || 0;
      badge.style.display = data.unreadCount > 0 ? 'flex' : 'none';
    }
  } catch {}
}

// Logout
function logout() {
  Auth.clear();
  window.location.href = '../index.html';
}

// Open / close modal
function openModal(id)  { document.getElementById(id).classList.add('open'); }
function closeModal(id) { document.getElementById(id).classList.remove('open'); }

// Progress bar HTML
function progressBar(pct) {
  const p = Math.round(pct || 0);
  return `<div class="progress-bar-wrap"><div class="progress-bar-fill" style="width:${p}%"></div></div><small style="color:var(--text-muted)">${p}%</small>`;
}
