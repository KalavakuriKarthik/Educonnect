/* ══════════════════════════════════════════════
   EduConnect – layout.js
   Injects sidebar HTML dynamically based on role
   ══════════════════════════════════════════════ */

function buildLayout(pageTitle, activeNav) {
  Auth.redirectIfNotLoggedIn();
  const user = Auth.getUser();
  const role = user?.role || '';

  // Nav items per role
  const navMap = {
    STUDENT: [
      { id:'dashboard',    icon:'fa-home',         label:'Dashboard',    href:'student-dashboard.html' },
      { id:'courses',      icon:'fa-book-open',    label:'My Courses',   href:'student-courses.html' },
      { id:'assessments',  icon:'fa-tasks',         label:'Assessments',  href:'student-assessments.html' },
      { id:'progress',     icon:'fa-chart-line',   label:'My Progress',  href:'student-progress.html' },
      { id:'notifications',icon:'fa-bell',         label:'Notifications',href:'notifications.html' },
    ],
    TEACHER: [
      { id:'dashboard',    icon:'fa-home',         label:'Dashboard',    href:'teacher-dashboard.html' },
      { id:'courses',      icon:'fa-book-open',    label:'My Courses',   href:'teacher-courses.html' },
      { id:'content',      icon:'fa-photo-video',  label:'Content',      href:'teacher-content.html' },
      { id:'assessments',  icon:'fa-tasks',         label:'Assessments',  href:'teacher-assessments.html' },
      { id:'submissions',  icon:'fa-file-alt',     label:'Submissions',  href:'teacher-submissions.html' },
      { id:'notifications',icon:'fa-bell',         label:'Notifications',href:'notifications.html' },
    ],
    SCHOOL_ADMIN: [
      { id:'dashboard',    icon:'fa-home',         label:'Dashboard',    href:'admin-dashboard.html' },
      { id:'users',        icon:'fa-users',         label:'Users',        href:'admin-users.html' },
      { id:'courses',      icon:'fa-book-open',    label:'Courses',      href:'admin-courses.html' },
      { id:'students',     icon:'fa-user-graduate', label:'Students',    href:'admin-students.html' },
      { id:'reports',      icon:'fa-chart-bar',    label:'Reports',      href:'reports.html' },
      { id:'audit-logs',   icon:'fa-history',      label:'Audit Logs',   href:'audit-logs.html' },
      { id:'notifications',icon:'fa-bell',         label:'Notifications',href:'notifications.html' },
    ],
    PROGRAM_MANAGER: [
      { id:'dashboard',    icon:'fa-home',         label:'Dashboard',    href:'admin-dashboard.html' },
      { id:'courses',      icon:'fa-book-open',    label:'Courses',      href:'admin-courses.html' },
      { id:'students',     icon:'fa-user-graduate', label:'Students',    href:'admin-students.html' },
      { id:'reports',      icon:'fa-chart-bar',    label:'Reports',      href:'reports.html' },
      { id:'notifications',icon:'fa-bell',         label:'Notifications',href:'notifications.html' },
    ],
    COMPLIANCE_OFFICER: [
      { id:'dashboard',    icon:'fa-home',         label:'Dashboard',    href:'compliance-dashboard.html' },
      { id:'compliance',   icon:'fa-shield-alt',   label:'Compliance',   href:'compliance-records.html' },
      { id:'audits',       icon:'fa-search',       label:'Audits',       href:'audits.html' },
      { id:'reports',      icon:'fa-chart-bar',    label:'Reports',      href:'reports.html' },
      { id:'notifications',icon:'fa-bell',         label:'Notifications',href:'notifications.html' },
    ],
    GOVERNMENT_AUDITOR: [
      { id:'dashboard',    icon:'fa-home',         label:'Dashboard',    href:'compliance-dashboard.html' },
      { id:'compliance',   icon:'fa-shield-alt',   label:'Compliance',   href:'compliance-records.html' },
      { id:'audits',       icon:'fa-search',       label:'Audits',       href:'audits.html' },
      { id:'reports',      icon:'fa-chart-bar',    label:'Reports',      href:'reports.html' },
      { id:'audit-logs',   icon:'fa-history',      label:'Audit Logs',   href:'audit-logs.html' },
      { id:'notifications',icon:'fa-bell',         label:'Notifications',href:'notifications.html' },
    ],
  };

  const navItems = navMap[role] || navMap.STUDENT;
  const navHTML = navItems.map(n => `
    <div class="nav-item ${activeNav === n.id ? 'active' : ''}" onclick="window.location.href='${n.href}'">
      <i class="fas ${n.icon}"></i> ${n.label}
    </div>`).join('');

  document.getElementById('sidebar').innerHTML = `
    <div class="sidebar-brand">
      <div class="brand-icon"><i class="fas fa-graduation-cap"></i></div>
      <span>EduConnect</span>
    </div>
    <nav class="sidebar-nav">
      <div class="nav-section">Menu</div>
      ${navHTML}
    </nav>
    <div class="sidebar-footer">
      <div class="user-info">
        <div class="user-avatar" id="sidebar-avatar">U</div>
        <div class="user-meta">
          <div class="user-name" id="sidebar-name">Loading…</div>
          <div class="user-role" id="sidebar-role"></div>
        </div>
        <button onclick="logout()" title="Logout" style="background:none;border:none;color:rgba(200,216,234,.6);cursor:pointer;font-size:1.1rem;margin-left:4px">
          <i class="fas fa-sign-out-alt"></i>
        </button>
      </div>
    </div>`;

  document.querySelector('.topbar-title').textContent = pageTitle;
  renderSidebarUser();
  loadNotifCount();
}
