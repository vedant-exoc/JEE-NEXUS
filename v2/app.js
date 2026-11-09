/* JEE NEXUS V2 — browser-only design preview. No auth, remote API, or cloud writes. */
(() => {
  'use strict';

  const subjects = ['Mathematics', 'Physics', 'Chemistry'];
  const meta = {
    Mathematics: { icon: '∑', tint: 'math', line: 'Patterns, proofs, and problem solving' },
    Physics: { icon: '◉', tint: 'physics', line: 'Concepts, derivations, and numericals' },
    Chemistry: { icon: '⚗', tint: 'chemistry', line: 'Reactions, exceptions, and NCERT' }
  };
  const sampleRecords = [
    { id: 'demo-1', subject: 'Mathematics', type: 'note', title: 'Quadratic equations', chapter: 'Algebra', status: 'Completed', category: 'Formula', content: 'Discriminant: D = b² − 4ac', createdAt: '2026-01-03' },
    { id: 'demo-2', subject: 'Physics', type: 'lecture', title: 'Newton’s laws — Lecture 04', chapter: 'Laws of Motion', status: 'In Progress', date: '2026-01-04', createdAt: '2026-01-03' },
    { id: 'demo-3', subject: 'Chemistry', type: 'question', title: 'Equilibrium practice set', chapter: 'Chemical Equilibrium', status: 'Solved', difficulty: 'Medium', source: 'PYQ', createdAt: '2026-01-02' },
    { id: 'demo-4', subject: 'Mathematics', type: 'backlog', title: 'Trigonometry — Lecture 02', chapter: 'Trigonometry', status: 'Not Started', priority: 'High', targetDate: '2026-01-10', createdAt: '2026-01-01' },
    { id: 'demo-5', subject: 'Physics', type: 'revision', title: 'Revise ray optics formulae', chapter: 'Ray Optics', status: 'Needs Revision', category: 'Formula', createdAt: '2026-01-02' },
    { id: 'demo-6', subject: 'Chemistry', type: 'task', title: 'Read NCERT: p-block', chapter: 'Inorganic Chemistry', status: 'Completed', createdAt: '2026-01-01' }
  ];
  let records = sampleRecords.map(item => ({ ...item }));
  let view = 'dashboard';
  let subjectTab = 'notes';
  let currentSubject = 'Mathematics';
  const app = document.getElementById('app');
  const auth = document.getElementById('auth-view');
  const shell = document.getElementById('main-shell');
  const dialog = document.getElementById('record-dialog');
  const form = document.getElementById('record-form');
  const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[c]));
  const listFor = (type, subject) => records.filter(record => record.type === type && (!subject || record.subject === subject));
  const ratio = (done, total) => total ? Math.round(done * 100 / total) : 0;
  const empty = (title, body) => `<div class="list-item"><div class="list-item-main"><strong>${esc(title)}</strong><small>${esc(body)}</small></div></div>`;

  function setAuthMessage(id, message, error = false) {
    const el = document.getElementById(id);
    el.textContent = message;
    el.style.color = error ? '#ff9bb0' : '#00ff91';
  }

  function openPreview() {
    auth.classList.add('hidden');
    shell.classList.remove('hidden');
    document.getElementById('user-pill').textContent = 'Demo preview';
    document.getElementById('connection-status').textContent = 'Preview · not connected';
    render();
  }

  function pageHeader(eyebrow, title, description, canAdd = false) {
    return `<div class="page-heading"><div><div class="eyebrow">${esc(eyebrow)}</div><h1>${esc(title)}</h1><p>${esc(description)}</p></div>${canAdd ? '<button class="primary-btn small-btn" data-add>＋ Add item</button>' : ''}</div>`;
  }

  function stat(label, value, note) {
    return `<div class="stat-card glass"><div class="stat-title">${esc(label)}</div><div class="stat-number">${esc(value)}</div><div class="stat-meta">${esc(note)}</div></div>`;
  }

  function card(record) {
    const stateClass = ['Completed', 'Solved'].includes(record.status) ? 'green' : '';
    const info = [record.subject, record.chapter, record.status, record.priority].filter(Boolean).join(' · ');
    return `<article class="list-item"><div class="list-item-main"><strong>${esc(record.title)}</strong><small>${esc(info)}</small>${record.content ? `<small>${esc(record.content)}</small>` : ''}</div><div class="list-actions"><span class="pill ${stateClass}">${esc(record.status || 'Not Started')}</span>${!['Completed','Solved'].includes(record.status) ? `<button class="tiny-btn" data-complete="${esc(record.id)}">Complete</button>` : ''}<button class="tiny-btn" data-delete="${esc(record.id)}">Remove</button></div></article>`;
  }

  function renderDashboard() {
    const backlog = listFor('backlog').filter(r => r.status !== 'Completed').length;
    const solved = listFor('question').filter(r => r.status === 'Solved').length;
    const revisions = listFor('revision');
    const revisionPct = ratio(revisions.filter(r => r.status === 'Completed').length, revisions.length);
    const tasks = listFor('task');
    const tasksDone = tasks.filter(r => r.status === 'Completed').length;
    app.innerHTML = `${pageHeader('JEE NEXUS / COMMAND CENTRE', 'Your study universe', 'A demo overview with sample records. Start with a subject, or explore a planner.', true)}<div class="stats-grid">${stat('TODAY’S TARGETS', `${tasksDone}/${tasks.length}`, 'Completed study tasks')}${stat('PENDING BACKLOG', backlog, 'Unfinished demo lectures')}${stat('QUESTIONS SOLVED', solved, 'Recorded sample questions')}${stat('REVISION PROGRESS', `${revisionPct}%`, 'Completed sample revisions')}</div><div class="cards-grid two-col"><section class="panel glass"><div class="panel-header"><h3>Subject workspaces</h3><span class="muted">Explore your PCM areas</span></div><div class="subject-grid">${subjects.map(subject => { const m = meta[subject], lectures = listFor('lecture', subject), complete = lectures.filter(r => r.status === 'Completed').length; return `<button class="subject-card glass" data-go-subject="${subject}"><div class="subject-header"><span class="subject-icon ${m.tint}">${m.icon}</span><span class="subject-percent">${ratio(complete, lectures.length)}%</span></div><h3>${subject.toUpperCase()}</h3><p>${m.line}</p></button>`; }).join('')}</div></section><section class="panel glass quote-panel"><div class="quote-mark">“</div><p>Small, consistent steps create extraordinary results.</p><div class="quote-footer">A NOTE TO YOUR FUTURE SELF</div></section></div><section class="panel glass"><div class="panel-header"><h3>Study focus</h3><button class="tiny-btn" data-go-view="planner">Open planner →</button></div><div class="list-stack">${records.filter(r => ['lecture','task'].includes(r.type)).slice(0,4).map(card).join('') || empty('No study items', 'Add a task or lecture to get started.')}</div></section>`;
  }

  function renderSubject() {
    const tabs = [['notes','Notes & formulas','note'],['lectures','Lectures','lecture'],['backlogs','Backlogs','backlog'],['questions','Questions','question'],['revision','Revision','revision']];
    const tab = tabs.find(item => item[0] === subjectTab) || tabs[0];
    const items = listFor(tab[2], currentSubject);
    app.innerHTML = `${pageHeader(`${currentSubject.toUpperCase()} / WORKSPACE`, currentSubject, `${meta[currentSubject].line}. Preview records are temporary and not synced.`, true)}<div class="tabs-row">${tabs.map(([key,label]) => `<button class="tab-label ${subjectTab===key?'active':''}" data-tab="${key}">${label}</button>`).join('')}</div><section class="panel glass"><div class="panel-header"><h3>${tab[1]}</h3><span class="muted">${items.length} sample items</span></div><div class="toolbar"><input id="record-search" type="search" placeholder="Search this collection" /><select id="record-filter"><option value="all">All statuses</option><option>Not Started</option><option>In Progress</option><option>Completed</option><option>Solved</option><option>Needs Revision</option><option>Incorrect</option></select></div><div class="list-stack" id="record-list">${items.map(card).join('') || empty(`No ${tab[1].toLowerCase()} yet`, 'Use Add item to add a temporary preview record.')}</div></section>`;
    const update = () => {
      const q = document.getElementById('record-search').value.toLowerCase();
      const status = document.getElementById('record-filter').value;
      const filtered = items.filter(r => (!q || [r.title,r.chapter,r.content].join(' ').toLowerCase().includes(q)) && (status === 'all' || r.status === status));
      document.getElementById('record-list').innerHTML = filtered.map(card).join('') || empty('No matches', 'Try another search or status.');
    };
    document.getElementById('record-search').addEventListener('input', update);
    document.getElementById('record-filter').addEventListener('change', update);
  }

  function renderCollection(title, kind, description) {
    const items = kind === 'backlog' ? listFor(kind).filter(r => r.status !== 'Completed') : kind === 'question' ? listFor(kind) : kind === 'lecture' ? listFor(kind) : listFor(kind);
    app.innerHTML = `${pageHeader(`JEE NEXUS / ${title.toUpperCase()}`, title, description, true)}<div class="stats-grid">${stat('TOTAL ITEMS', items.length, 'Preview sample collection')}${stat('COMPLETED', items.filter(r => ['Completed','Solved'].includes(r.status)).length, 'Completed or solved')}${stat('IN PROGRESS', items.filter(r => r.status === 'In Progress').length, 'Active records')}${stat('TO REVIEW', items.filter(r => ['Needs Revision','Incorrect','Not Started'].includes(r.status)).length, 'Need another pass')}</div><section class="panel glass"><div class="panel-header"><h3>${title}</h3><span class="muted">Temporary demo data</span></div><div class="toolbar"><input id="record-search" type="search" placeholder="Search records" /><select id="subject-filter"><option value="all">All subjects</option>${subjects.map(s => `<option>${s}</option>`).join('')}</select><select id="record-filter"><option value="all">All statuses</option><option>Not Started</option><option>In Progress</option><option>Completed</option><option>Solved</option><option>Needs Revision</option><option>Incorrect</option></select></div><div class="list-stack" id="record-list">${items.map(card).join('') || empty('Nothing here yet', 'Add a preview item to explore this section.')}</div></section>`;
    const update = () => {
      const q = document.getElementById('record-search').value.toLowerCase();
      const subject = document.getElementById('subject-filter').value;
      const status = document.getElementById('record-filter').value;
      const filtered = items.filter(r => (!q || [r.title,r.chapter,r.content].join(' ').toLowerCase().includes(q)) && (subject === 'all' || r.subject === subject) && (status === 'all' || r.status === status));
      document.getElementById('record-list').innerHTML = filtered.map(card).join('') || empty('No matches', 'Try changing your filters.');
    };
    document.getElementById('record-search').addEventListener('input', update);
    document.getElementById('subject-filter').addEventListener('change', update);
    document.getElementById('record-filter').addEventListener('change', update);
  }

  function renderSettings() {
    app.innerHTML = `${pageHeader('JEE NEXUS / SETTINGS', 'Settings', 'The preview does not save account settings or connect to a cloud service.')}<div class="settings-grid"><section class="panel glass"><div class="panel-header"><h3>Cloud setup</h3></div><p>To activate authentication, invitations, and cloud sync, connect a Supabase project and configure Netlify Functions and environment variables.</p><p class="muted">No secrets should be added to this browser preview.</p></section><section class="panel glass"><div class="panel-header"><h3>Preview controls</h3></div><p>All sample records reset when this page is refreshed. Nothing is sent to a server.</p><button class="secondary-btn small-btn" data-reset-demo>Reset sample data</button></section></div>`;
  }

  function renderAdmin() {
    app.innerHTML = `${pageHeader('JEE NEXUS / ADMIN', 'Admin access', 'The demo cannot authenticate administrator permissions or send real invitations.')}<section class="panel glass"><div class="panel-header"><h3>Live admin features are not enabled in preview</h3></div><p>Invitation management, account controls, and login history must be protected by server-verified administrator permissions. No mock controls are presented as functional here.</p></section>`;
  }

  function render() {
    document.querySelectorAll('.nav-item').forEach(button => button.classList.toggle('active', button.dataset.view === view));
    document.getElementById('page-title').textContent = view === 'backlogs' ? 'Backlog Manager' : view === 'questions' ? 'Question Tracker' : view === 'planner' ? 'Lecture Planner' : view === 'revision' ? 'Revision Centre' : view === 'admin' ? 'Admin Dashboard' : view;
    if (view === 'dashboard') return renderDashboard();
    if (subjects.includes(view)) { currentSubject = view; return renderSubject(); }
    if (view === 'planner') return renderCollection('Lecture Planner','lecture','Plan upcoming lectures and review the sample week.');
    if (view === 'backlogs') return renderCollection('Backlog Manager','backlog','Prioritise pending lectures across Mathematics, Physics, and Chemistry.');
    if (view === 'questions') return renderCollection('Question Tracker','question','Review solved questions, mistakes, and items to revisit.');
    if (view === 'revision') return renderCollection('Revision Centre','revision','Review chapters and formula lists that need another pass.');
    if (view === 'admin') return renderAdmin();
    return renderSettings();
  }

  function openAddDialog() {
    const select = form.elements.subject;
    if (subjects.includes(view)) select.value = view;
    else if (view === 'planner' || view === 'backlogs' || view === 'questions' || view === 'revision') select.value = 'Mathematics';
    const typeMap = { planner:'lecture', backlogs:'backlog', questions:'question', revision:'revision' };
    if (typeMap[view]) form.elements.type.value = typeMap[view];
    document.getElementById('dialog-title').textContent = `Add ${subjects.includes(view) ? currentSubject : view === 'planner' ? 'lecture' : view === 'backlogs' ? 'backlog' : view === 'questions' ? 'question' : view === 'revision' ? 'revision item' : 'study item'}`;
    dialog.showModal();
  }

  document.addEventListener('click', event => {
    const authTab = event.target.closest('[data-auth-view]');
    if (authTab) {
      const target = authTab.dataset.authView;
      document.querySelectorAll('[data-auth-view]').forEach(button => button.classList.toggle('active', button === authTab));
      document.getElementById('login-form').classList.toggle('hidden', target !== 'login');
      document.getElementById('invite-form').classList.toggle('hidden', target !== 'invite');
      return;
    }
    if (event.target.closest('#preview-button')) return openPreview();
    const nav = event.target.closest('[data-view]');
    if (nav) { view = nav.dataset.view; return render(); }
    const subject = event.target.closest('[data-go-subject]');
    if (subject) { view = subject.dataset.goSubject; subjectTab = 'notes'; return render(); }
    const link = event.target.closest('[data-go-view]');
    if (link) { view = link.dataset.goView; return render(); }
    const tab = event.target.closest('[data-tab]');
    if (tab) { subjectTab = tab.dataset.tab; return render(); }
    if (event.target.closest('[data-add]')) return openAddDialog();
    const complete = event.target.closest('[data-complete]');
    if (complete) { const item = records.find(r => r.id === complete.dataset.complete); if (item) item.status = item.type === 'question' ? 'Solved' : 'Completed'; return render(); }
    const remove = event.target.closest('[data-delete]');
    if (remove) { records = records.filter(r => r.id !== remove.dataset.delete); return render(); }
    if (event.target.closest('#dialog-close')) return dialog.close();
    if (event.target.closest('#logout-btn')) { shell.classList.add('hidden'); auth.classList.remove('hidden'); return; }
    if (event.target.closest('[data-reset-demo]')) { records = sampleRecords.map(item => ({ ...item })); return render(); }
  });

  document.getElementById('login-form').addEventListener('submit', event => {
    event.preventDefault();
    setAuthMessage('login-message', 'Live sign-in is not connected in this preview. Configure Supabase before using real accounts.', true);
  });
  document.getElementById('invite-form').addEventListener('submit', event => {
    event.preventDefault();
    setAuthMessage('invite-message', 'Invitation validation requires the configured server function. This preview does not validate or consume invite tokens.', true);
  });
  document.getElementById('forgot-password').addEventListener('click', () => setAuthMessage('login-message', 'Password reset is available after Supabase Auth is configured.', true));
  document.querySelectorAll('.toggle-password').forEach(button => button.addEventListener('click', () => {
    const input = document.getElementById(button.dataset.target);
    input.type = input.type === 'password' ? 'text' : 'password';
    button.textContent = input.type === 'password' ? 'Show' : 'Hide';
  }));
  form.addEventListener('submit', event => {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(form));
    records.unshift({ id: `preview-${Date.now()}`, ...data, createdAt: new Date().toISOString() });
    form.reset();
    dialog.close();
    render();
  });
})();
