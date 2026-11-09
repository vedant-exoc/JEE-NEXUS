const SUBJECTS = ['Mathematics', 'Physics', 'Chemistry'];
const appState = {
  supabase: null,
  session: null,
  user: null,
  profile: null,
  records: [],
  view: 'dashboard',
  subjectTab: 'notes',
  authMode: 'login',
  cloudReady: false,
  lastSynced: null
};

const appEl = document.getElementById('app');
const authView = document.getElementById('auth-view');
const mainShell = document.getElementById('main-shell');
const messageEls = {
  login: document.getElementById('login-message'),
  invite: document.getElementById('invite-message'),
  admin: document.getElementById('admin-message')
};

window.__SUPABASE_CONFIG__ = {
  url: 'https://YOUR_PROJECT_REF.supabase.co',
  anonKey: 'YOUR_SUPABASE_ANON_KEY'
};

function getConfig() {
  return window.__SUPABASE_CONFIG__ || { url: '', anonKey: '' };
}

function setMessage(type, text, isError = false) {
  const el = messageEls[type];
  if (!el) return;
  el.textContent = text;
  el.style.color = isError ? '#ff9bb0' : '#8ff8c8';
}

function showAuth() {
  authView.classList.remove('hidden');
  mainShell.classList.add('hidden');
}

function showApp() {
  authView.classList.add('hidden');
  mainShell.classList.remove('hidden');
  const name = (appState.profile?.full_name || appState.user?.email || 'User').split(' ')[0];
  document.getElementById('user-pill').textContent = name;
}

function escapeHtml(value) {
  return String(value || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;');
}

function capitalize(input) {
  return input ? input.charAt(0).toUpperCase() + input.slice(1) : 'Workspace';
}

function initSupabase() {
  const cfg = getConfig();
  if (!cfg.url || !cfg.anonKey || cfg.url.includes('YOUR_PROJECT_REF') || cfg.anonKey.includes('YOUR_')) {
    console.warn('Supabase is not configured yet. The app is in safe placeholder mode until environment values are added.');
    return false;
  }

  appState.supabase = window.supabase.createClient(cfg.url, cfg.anonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true
    }
  });

  appState.cloudReady = true;
  return true;
}

function bindEvents() {
  document.querySelectorAll('[data-auth-view]').forEach(button => {
    button.addEventListener('click', () => {
      const next = button.dataset.authView;
      appState.authMode = next;
      document.querySelectorAll('.tab').forEach(t => t.classList.toggle('active', t.dataset.authView === next));
      document.getElementById('login-form').classList.toggle('hidden', next !== 'login');
      document.getElementById('invite-form').classList.toggle('hidden', next !== 'invite');
    });
  });

  document.querySelector('#login-form').addEventListener('submit', async (event) => {
    event.preventDefault();
    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value;

    if (!appState.supabase) {
      setMessage('login', 'Supabase credentials are not configured yet. Add the project URL and anon key first.', true);
      return;
    }

    setMessage('login', 'Signing in...');

    try {
      const { data, error } = await appState.supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;

      appState.session = data.session;
      await loadUserProfile();
      await notifyLogin({ email, userId: data.user.id, appName: 'JEE NEXUS' });
      showApp();
      renderApp();
      setMessage('login', '');
    } catch (error) {
      setMessage('login', error.message || 'Login failed.', true);
    }
  });

  document.querySelector('#invite-form').addEventListener('submit', async (event) => {
    event.preventDefault();
    const email = document.getElementById('invite-email').value.trim();
    const token = document.getElementById('invite-token').value.trim();

    try {
      setMessage('invite', 'Validating invitation...');
      const response = await fetch('/.netlify/functions/invite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'validate', email, token })
      });

      const json = await response.json();
      if (!response.ok) throw new Error(json.error || 'Invitation validation failed.');

      if (!appState.supabase) {
        setMessage('invite', 'Supabase has not been configured in this deployment yet. Add your project URL and anon key, then test registration again.', true);
        return;
      }

      const { data, error } = await appState.supabase.auth.signUp({
        email,
        password: json.password || 'JeeNexus@2026',
        options: { emailRedirectTo: window.location.origin }
      });

      if (error) throw error;
      setMessage('invite', 'Invitation accepted. Check your email to verify the account and complete setup.');
    } catch (error) {
      setMessage('invite', error.message || 'Could not complete registration.', true);
    }
  });

  document.getElementById('forgot-password').addEventListener('click', async () => {
    const email = document.getElementById('login-email').value.trim();
    if (!email) {
      setMessage('login', 'Enter your email before requesting a password reset.', true);
      return;
    }

    try {
      if (!appState.supabase) throw new Error('Supabase is not configured.');
      setMessage('login', 'Sending password reset email...');
      const { error } = await appState.supabase.auth.resetPasswordForEmail(email);
      if (error) throw error;
      setMessage('login', 'Password reset email sent.');
    } catch (error) {
      setMessage('login', error.message || 'Could not send reset email.', true);
    }
  });

  document.querySelectorAll('.toggle-password').forEach(button => {
    button.addEventListener('click', () => {
      const target = document.getElementById(button.dataset.target);
      const isHidden = target.type === 'password';
      target.type = isHidden ? 'text' : 'password';
      button.textContent = isHidden ? 'Hide' : 'Show';
    });
  });

  document.getElementById('logout-btn').addEventListener('click', async () => {
    if (appState.supabase) {
      await appState.supabase.auth.signOut();
    }
    appState.session = null;
    appState.profile = null;
    showAuth();
  });

  document.querySelectorAll('.nav-item').forEach(button => {
    button.addEventListener('click', () => {
      const view = button.dataset.view;
      appState.view = view;
      document.querySelectorAll('.nav-item').forEach(item => item.classList.toggle('active', item.dataset.view === view));
      renderApp();
    });
  });

  document.addEventListener('click', async (event) => {
    const subjectCard = event.target.closest('[data-subject]');
    if (subjectCard) {
      appState.view = subjectCard.dataset.subject;
      document.querySelectorAll('.nav-item').forEach(item => item.classList.toggle('active', item.dataset.view === appState.view));
      renderApp();
      return;
    }

    const tabButton = event.target.closest('.tab-label');
    if (tabButton) {
      appState.subjectTab = tabButton.dataset.tab;
      renderSubjectView();
      return;
    }

    if (event.target.closest('#save-profile')) {
      const value = document.getElementById('profile-name').value.trim();
      localStorage.setItem('jee-nexus-profile-name', value || 'Scholar');
      renderApp();
      return;
    }

    if (event.target.closest('#export-data')) {
      exportFallbackData();
      return;
    }

    if (event.target.closest('#sync-now')) {
      await syncRecords();
      return;
    }

    const deleteAction = event.target.closest('[data-action="delete"]');
    if (deleteAction) {
      const id = deleteAction.dataset.id;
      appState.records = appState.records.filter(record => String(record.id) !== String(id));
      localStorage.setItem('jee-nexus-demo-records', JSON.stringify(appState.records));
      renderSubjectView();
    }
  });
}

async function hydrateFallbackRecords() {
  const saved = localStorage.getItem('jee-nexus-demo-records');
  if (saved) {
    try {
      appState.records = JSON.parse(saved);
      return;
    } catch {
      appState.records = [];
    }
  }

  appState.records = [
    { id: '1', subject: 'Mathematics', type: 'note', title: 'Quadratic formulas', status: 'Completed', category: 'Formula', content: 'x = (-b ± √(b² - 4ac))/2a', createdAt: Date.now() },
    { id: '2', subject: 'Physics', type: 'question', title: 'Projectile motion', status: 'Solved', difficulty: 'Medium', source: 'PYQ', topic: 'Kinematics', createdAt: Date.now() },
    { id: '3', subject: 'Chemistry', type: 'lecture', title: 'Coordination chemistry', status: 'In Progress', chapter: 'Coordination', createdAt: Date.now() },
    { id: '4', subject: 'Mathematics', type: 'backlog', title: 'Trigonometric identities', status: 'Not Started', priority: 'High', targetDate: '2026-11-15', createdAt: Date.now() },
    { id: '5', subject: 'Physics', type: 'revision', title: 'Ray optics', status: 'Not Started', category: 'Chapter', createdAt: Date.now() }
  ];
}

async function loadUserProfile() {
  if (!appState.supabase) return;

  const { data: userData, error } = await appState.supabase.auth.getUser();
  if (error) {
    console.warn(error.message);
    return;
  }

  appState.user = userData.user;

  const { data: profileData } = await appState.supabase.from('profiles').select('*').eq('id', userData.user.id).single();
  appState.profile = profileData || {
    full_name: userData.user.email?.split('@')[0] || 'Scholar',
    role: 'user'
  };
}

async function notifyLogin({ email, userId, appName }) {
  if (!appState.cloudReady) return;
  try {
    await fetch('/.netlify/functions/login-notify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, userId, appName })
    });
  } catch (error) {
    console.warn('Login notification failed:', error);
  }
}

async function syncRecords() {
  if (!appState.supabase || !appState.user) {
    localStorage.setItem('jee-nexus-demo-records', JSON.stringify(appState.records));
    return;
  }

  try {
    const payload = appState.records.map(entry => ({ ...entry, user_id: appState.user.id }));
    const { error } = await appState.supabase.from('study_records').upsert(payload, { onConflict: 'id' });
    if (error) throw error;
    appState.lastSynced = new Date().toISOString();
    localStorage.setItem('jee-nexus-demo-records', JSON.stringify(appState.records));
    renderApp();
  } catch (error) {
    console.warn('Cloud sync failed:', error);
  }
}

function renderApp() {
  if (!appState.session) {
    showAuth();
    return;
  }

  showApp();
  document.getElementById('page-title').textContent = appState.view === 'admin' ? 'Admin Dashboard' : capitalize(appState.view);

  if (appState.view === 'dashboard') {
    renderDashboard();
    return;
  }

  if (SUBJECTS.includes(appState.view)) {
    renderSubjectView();
    return;
  }

  if (appState.view === 'admin') {
    renderAdminView();
    return;
  }

  if (appState.view === 'settings') {
    renderSettingsView();
    return;
  }

  renderGenericView();
}

function renderDashboard() {
  appEl.innerHTML = document.getElementById('dashboard-template').innerHTML;

  const backlogCount = appState.records.filter(record => record.type === 'backlog' && record.status !== 'Completed').length;
  const questionCount = appState.records.filter(record => record.type === 'question' && record.status === 'Solved').length;
  const revisionCount = Math.round((appState.records.filter(record => record.type === 'revision' && record.status === 'Completed').length / Math.max(1, appState.records.filter(record => record.type === 'revision').length)) * 100);

  document.getElementById('backlog-count').textContent = backlogCount;
  document.getElementById('question-count').textContent = questionCount;
  document.getElementById('revision-count').textContent = `${revisionCount}%`;
  document.getElementById('daily-quote').textContent = 'Discipline compounds. Small consistent effort creates extraordinary outcomes.';

  const completionFor = (subject) => {
    const subjectRecords = appState.records.filter(record => record.subject === subject);
    const done = subjectRecords.filter(record => record.status === 'Completed' || record.status === 'Solved').length;
    return Math.round((done / Math.max(1, subjectRecords.length)) * 100);
  };

  document.getElementById('math-percent').textContent = `${completionFor('Mathematics')}%`;
  document.getElementById('physics-percent').textContent = `${completionFor('Physics')}%`;
  document.getElementById('chemistry-percent').textContent = `${completionFor('Chemistry')}%`;

  const todaySchedule = appState.records.filter(record => record.type === 'lecture' || record.type === 'backlog').slice(0, 5);
  const scheduleWrap = document.getElementById('today-schedule');
  scheduleWrap.innerHTML = todaySchedule.length
    ? todaySchedule.map(record => `
      <div class="list-item">
        <div class="list-item-main">
          <strong>${escapeHtml(record.title || record.subject || 'Study block')}</strong>
          <small>${escapeHtml(record.subject || 'General')} • ${escapeHtml(record.chapter || 'Preparation')}</small>
        </div>
        <span class="pill ${record.status === 'Completed' || record.status === 'Solved' ? 'green' : ''}">${escapeHtml(record.status || 'Pending')}</span>
      </div>
    `).join('')
    : '<div class="list-item"><div class="list-item-main"><strong>No schedule yet</strong><small>Add lecture or backlog items to build your study focus.</small></div></div>';

  document.getElementById('today-completion').textContent = `${Math.min(100, Math.round((questionCount + backlogCount + revisionCount) / 3))}%`;

  document.querySelectorAll('[data-subject]').forEach(button => {
    button.addEventListener('click', () => {
      appState.view = button.dataset.subject;
      renderApp();
    });
  });
}

function renderSubjectView() {
  appEl.innerHTML = document.getElementById('subject-template').innerHTML;
  document.getElementById('subject-heading').textContent = appState.view;

  const tabs = [
    ['notes', 'Notes'],
    ['lectures', 'Lectures'],
    ['backlogs', 'Backlogs'],
    ['questions', 'Questions'],
    ['revision', 'Revision']
  ];

  const tabsWrap = document.getElementById('subject-tabs');
  tabsWrap.innerHTML = tabs.map(([key, label]) => `
    <button class="tab-label ${appState.subjectTab === key ? 'active' : ''}" data-tab="${key}">${label}</button>
  `).join('');

  const filter = document.getElementById('subject-status-filter');
  const search = document.getElementById('subject-search');

  const renderItems = () => {
    const subjectRecords = appState.records.filter(record => record.subject === appState.view && (
      (appState.subjectTab === 'notes' && (record.type === 'note' || record.category === 'Formula')) ||
      (appState.subjectTab === 'lectures' && record.type === 'lecture') ||
      (appState.subjectTab === 'backlogs' && record.type === 'backlog') ||
      (appState.subjectTab === 'questions' && record.type === 'question') ||
      (appState.subjectTab === 'revision' && record.type === 'revision')
    ));

    const query = search.value.trim().toLowerCase();
    const status = filter.value;

    const items = subjectRecords.filter(record => {
      const matchesSearch = !query || [record.title, record.chapter, record.topic, record.notes, record.content, record.solution].join(' ').toLowerCase().includes(query);
      const matchesStatus = status === 'all' || record.status === status;
      return matchesSearch && matchesStatus;
    });

    const list = document.getElementById('subject-list');
    if (!items.length) {
      list.innerHTML = '<div class="list-item"><div class="list-item-main"><strong>No records yet</strong><small>Use Add item to build your subject workspace.</small></div></div>';
      return;
    }

    list.innerHTML = items.map(record => `
      <div class="list-item">
        <div class="list-item-main">
          <strong>${escapeHtml(record.title || record.chapter || 'Untitled item')}</strong>
          <small>${escapeHtml(record.subject || appState.view)} • ${escapeHtml(record.chapter || record.topic || record.category || 'General')}</small>
        </div>
        <div class="list-actions">
          <span class="pill ${record.status === 'Completed' || record.status === 'Solved' ? 'green' : ''}">${escapeHtml(record.status || 'Not Started')}</span>
          <button class="tiny-btn" data-action="delete" data-id="${record.id}">Delete</button>
        </div>
      </div>
    `).join('');
  };

  search.addEventListener('input', renderItems);
  filter.addEventListener('change', renderItems);

  document.getElementById('add-subject-item').addEventListener('click', () => {
    const typeMap = {
      notes: 'note',
      lectures: 'lecture',
      backlogs: 'backlog',
      questions: 'question',
      revision: 'revision'
    };

    appState.records.push({
      id: `local-${Date.now()}`,
      subject: appState.view,
      type: typeMap[appState.subjectTab] || 'note',
      title: `${appState.view} item`,
      status: 'Not Started',
      createdAt: Date.now()
    });

    localStorage.setItem('jee-nexus-demo-records', JSON.stringify(appState.records));
    renderSubjectView();
  });

  renderItems();
}

function renderAdminView() {
  if (appState.profile?.role !== 'admin') {
    appEl.innerHTML = '<div class="panel glass"><div class="panel-header"><h3>Access denied</h3></div><p>You do not have administrator privileges.</p></div>';
    return;
  }

  appEl.innerHTML = document.getElementById('admin-template').innerHTML;

  const invitations = [
    { email: 'demo@jee-nexus.app', status: 'Pending', expiresAt: '24h' },
    { email: 'admin@jee-nexus.app', status: 'Active', expiresAt: '7d' }
  ];

  const invitationList = document.getElementById('invitation-list');
  invitationList.innerHTML = invitations.map(item => `
    <div class="list-item">
      <div class="list-item-main">
        <strong>${escapeHtml(item.email)}</strong>
        <small>Expires in ${escapeHtml(item.expiresAt)}</small>
      </div>
      <span class="pill ${item.status === 'Active' ? 'green' : ''}">${escapeHtml(item.status)}</span>
    </div>
  `).join('');

  const users = [
    { email: appState.user?.email || 'admin@jee-nexus.app', role: appState.profile?.role || 'admin' },
    { email: 'candidate@jee-nexus.app', role: 'user' }
  ];

  document.getElementById('user-list').innerHTML = users.map(item => `
    <div class="list-item">
      <div class="list-item-main">
        <strong>${escapeHtml(item.email)}</strong>
        <small>${escapeHtml(item.role)}</small>
      </div>
      <span class="pill ${item.role === 'admin' ? 'green' : ''}">${escapeHtml(item.role)}</span>
    </div>
  `).join('');

  document.getElementById('admin-invite-form').addEventListener('submit', async (event) => {
    event.preventDefault();
    const email = document.getElementById('admin-email').value.trim();
    if (!email) {
      setMessage('admin', 'Enter an email address before sending an invite.', true);
      return;
    }

    try {
      setMessage('admin', 'Sending invitation...');
      const response = await fetch('/.netlify/functions/invite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'create', email })
      });
      const json = await response.json();
      if (!response.ok) throw new Error(json.error || 'Invitation failed.');
      setMessage('admin', `Invitation sent to ${email}.`);
    } catch (error) {
      setMessage('admin', error.message || 'Invitation failed.', true);
    }
  });
}

function renderSettingsView() {
  appEl.innerHTML = document.getElementById('settings-template').innerHTML;
  const savedName = localStorage.getItem('jee-nexus-profile-name') || appState.profile?.full_name || 'Scholar';
  document.getElementById('profile-name').value = savedName;

  document.getElementById('export-data').addEventListener('click', exportFallbackData);
  document.getElementById('sync-now').addEventListener('click', syncRecords);
}

function renderGenericView() {
  appEl.innerHTML = '<div class="panel glass"><div class="panel-header"><h3>Workspace</h3></div><p>This section is under active development.</p></div>';
}

function exportFallbackData() {
  const blob = new Blob([JSON.stringify(appState.records, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'jee-nexus-backup.json';
  link.click();
  URL.revokeObjectURL(url);
}

async function initialize() {
  bindEvents();
  await hydrateFallbackRecords();
  initSupabase();

  if (appState.supabase) {
    const { data: { session } } = await appState.supabase.auth.getSession();
    appState.session = session;
    if (session) {
      await loadUserProfile();
      renderApp();
    } else {
      showAuth();
    }
  } else {
    showAuth();
  }
}

window.addEventListener('DOMContentLoaded', initialize);
