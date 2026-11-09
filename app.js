* { box-sizing: border-box; }
:root {
  --bg: #08090c;
  --bg-2: #0f1116;
  --panel: rgba(17, 18, 22, 0.82);
  --panel-strong: rgba(19, 21, 25, 0.94);
  --stroke: rgba(255, 36, 72, 0.25);
  --stroke-green: rgba(0, 255, 145, 0.2);
  --crimson: #761323;
  --red: #ff2448;
  --red-soft: #ff5f7d;
  --burgundy: #350b17;
  --green: #00ff91;
  --green-deep: #063b29;
  --text: #f4f7f9;
  --muted: #afbac0;
  --shadow: rgba(0, 0, 0, 0.38);
  --radius: 20px;
}

html, body {
  margin: 0;
  min-height: 100%;
  font-family: Inter, "Segoe UI", sans-serif;
  background:
    radial-gradient(circle at top left, rgba(118, 19, 35, 0.3), transparent 25%),
    radial-gradient(circle at 80% 15%, rgba(0, 255, 145, 0.09), transparent 20%),
    linear-gradient(180deg, var(--bg), #0a0d12 100%);
  color: var(--text);
}

body {
  position: relative;
  overflow-x: hidden;
}

#stars {
  position: fixed;
  inset: 0;
  background-image:
    radial-gradient(2px 2px at 20% 30%, rgba(255,255,255,.7), transparent),
    radial-gradient(1.5px 1.5px at 40% 70%, rgba(255,255,255,.45), transparent),
    radial-gradient(1.5px 1.5px at 80% 20%, rgba(255,255,255,.5), transparent),
    radial-gradient(1.5px 1.5px at 60% 80%, rgba(255,255,255,.7), transparent),
    radial-gradient(2px 2px at 15% 80%, rgba(255,255,255,.5), transparent);
  opacity: 0.85;
  pointer-events: none;
}

.hidden { display: none !important; }
.visible { display: block; }

.glass {
  background: linear-gradient(180deg, rgba(23, 26, 32, 0.95), rgba(12, 13, 17, 0.9));
  border: 1px solid rgba(255, 36, 72, 0.18);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.25), inset 0 0 0 1px rgba(156, 232, 201, 0.06);
  backdrop-filter: blur(12px);
}

.glass-sm {
  background: rgba(14, 16, 20, 0.72);
  border: 1px solid rgba(0,255,145,0.1);
  border-radius: 14px;
}

.auth-shell {
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: 32px 20px;
}

.auth-panel {
  width: min(100%, 460px);
  padding: 26px 22px 20px;
  border-radius: 28px;
  position: relative;
  overflow: hidden;
}

.auth-panel::before,
.panel::before,
.stat-card::before {
  content: "";
  position: absolute;
  inset: 0 auto auto 0;
  width: 180px;
  height: 180px;
  background: radial-gradient(circle, rgba(255, 36, 72, 0.18), transparent 68%);
  pointer-events: none;
}

.logo-wrap {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.brand-mark {
  width: 42px;
  height: 42px;
  display: grid;
  place-items: center;
  border-radius: 14px;
  background: linear-gradient(135deg, rgba(118, 19, 35, 0.95), rgba(53, 11, 23, 0.8));
  border: 1px solid rgba(255, 36, 72, 0.3);
  box-shadow: 0 0 20px rgba(255, 36, 72, 0.16);
  color: var(--text);
  font-weight: 800;
}

.eyebrow {
  font-size: 10px;
  letter-spacing: 0.24em;
  text-transform: uppercase;
  color: var(--green);
  opacity: 0.9;
}

h1, h2, h3, p { margin: 0; }

h1 {
  font-size: clamp(1.5rem, 2.2vw, 2rem);
  margin-top: 4px;
}

.auth-switch {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
  margin: 20px 0 12px;
}

.tab {
  border: 1px solid rgba(255,255,255,0.08);
  background: rgba(255,255,255,0.02);
  color: var(--muted);
  border-radius: 12px;
  padding: 10px 12px;
  cursor: pointer;
  transition: 0.2s ease;
}

.tab.active {
  background: linear-gradient(135deg, rgba(255, 36, 72, 0.16), rgba(0, 255, 145, 0.08));
  border-color: rgba(255, 36, 72, 0.35);
  color: var(--text);
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

label {
  display: flex;
  flex-direction: column;
  gap: 8px;
  color: var(--muted);
  font-size: 0.9rem;
}

input, select, button {
  font: inherit;
}

input, select {
  width: 100%;
  border: 1px solid rgba(255,255,255,0.08);
  background: rgba(12, 13, 18, 0.8);
  color: var(--text);
  padding: 12px 14px;
  border-radius: 12px;
  outline: none;
  transition: 0.2s ease;
}

input:focus, select:focus {
  border-color: rgba(0,255,145,0.5);
  box-shadow: 0 0 0 3px rgba(0,255,145,0.06);
}

.password-wrap {
  display: flex;
  align-items: center;
  border: 1px solid rgba(255,255,255,0.08);
  background: rgba(12, 13, 18, 0.8);
  border-radius: 12px;
  overflow: hidden;
}

.password-wrap input {
  border: 0;
  background: transparent;
  box-shadow: none;
}

.toggle-password {
  border: 0;
  background: transparent;
  color: var(--green);
  padding: 0 12px;
  cursor: pointer;
}

.checkbox-row {
  display: inline-flex;
  flex-direction: row;
  align-items: center;
  gap: 8px;
  margin: 0;
}

.checkbox-row input {
  width: auto;
}

.row {
  display: flex;
  align-items: center;
}

.between { justify-content: space-between; }
.small-row { font-size: 0.82rem; }

.link-button {
  border: 0;
  background: transparent;
  color: var(--red-soft);
  cursor: pointer;
  padding: 0;
}

.primary-btn, .secondary-btn, .tiny-btn, .nav-item, .subject-card, .tab {
  transition: transform 0.2s ease, border-color 0.2s ease, filter 0.2s ease;
}

.primary-btn, .secondary-btn, .tiny-btn {
  border-radius: 12px;
  padding: 11px 15px;
  cursor: pointer;
  border: 1px solid transparent;
}

.primary-btn {
  background: linear-gradient(135deg, rgba(255,36,72,.9), rgba(118,19,35,.9));
  color: #fff;
  border-color: rgba(255,36,72,.35);
  box-shadow: 0 12px 25px rgba(118, 19, 35, 0.2);
}

.secondary-btn {
  background: rgba(9, 13, 15, 0.8);
  color: var(--text);
  border-color: rgba(0,255,145,0.18);
}

.small-btn { padding: 9px 12px; }

.primary-btn:hover, .secondary-btn:hover, .tiny-btn:hover, .nav-item:hover, .subject-card:hover, .tab:hover {
  transform: translateY(-1px);
  filter: brightness(1.05);
}

.message {
  min-height: 18px;
  font-size: 0.82rem;
  color: var(--green);
}

.auth-footer {
  margin-top: 18px;
  text-align: center;
  color: var(--muted);
  font-size: 0.76rem;
  line-height: 1.6;
}

.main-shell {
  min-height: 100vh;
  display: grid;
  grid-template-columns: 250px 1fr;
  gap: 20px;
  padding: 20px;
}

.sidebar {
  border-radius: 26px;
  padding: 20px 12px;
  display: flex;
  flex-direction: column;
  min-height: calc(100vh - 40px);
}

.brand-box {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 10px 18px;
}

.brand-name {
  font-size: 0.98rem;
  font-weight: 700;
}

.brand-sub {
  font-size: 0.58rem;
  letter-spacing: 0.22em;
  color: var(--muted);
}

.nav-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 8px;
}

.nav-item {
  background: transparent;
  border: 1px solid transparent;
  border-radius: 12px;
  color: var(--muted);
  text-align: left;
  padding: 12px 14px;
  font-weight: 600;
  cursor: pointer;
}

.nav-item.active {
  background: linear-gradient(135deg, rgba(255,36,72,0.16), rgba(0,255,145,0.08));
  border-color: rgba(255, 36, 72, 0.2);
  color: var(--text);
}

.sidebar-footer {
  margin-top: auto;
  padding: 12px 10px;
}

.status-line {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 0.78rem;
  color: var(--muted);
  margin-bottom: 10px;
}

.dot {
  width: 10px;
  height: 10px;
  display: inline-block;
  background: var(--green);
  border-radius: 50%;
  box-shadow: 0 0 10px rgba(0,255,145,0.5);
}

.workspace {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.topbar {
  border-radius: 18px;
  padding: 16px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.topbar h2 {
  font-size: 1.45rem;
  margin-top: 4px;
}

.user-pill {
  border-radius: 999px;
  padding: 8px 12px;
  border: 1px solid rgba(0,255,145,0.2);
  background: rgba(6,59,41,0.35);
  color: var(--green);
  font-size: 0.82rem;
}

.content {
  padding-bottom: 24px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 14px;
  margin-bottom: 20px;
}

.stat-card {
  position: relative;
  overflow: hidden;
  border-radius: 22px;
  padding: 18px 16px;
}

.stat-title {
  color: var(--muted);
  font-size: 0.76rem;
  text-transform: uppercase;
  letter-spacing: 0.09em;
}

.stat-number {
  font-size: clamp(1.8rem, 2vw, 2.4rem);
  font-weight: 700;
  margin: 12px 0 6px;
}

.stat-meta {
  font-size: 0.72rem;
  color: var(--muted);
}

.cards-grid {
  display: grid;
  grid-template-columns: 1.3fr 0.7fr;
  gap: 16px;
  margin-bottom: 18px;
}

.two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }

.panel {
  position: relative;
  overflow: hidden;
  border-radius: 24px;
  padding: 20px;
}

.panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 14px;
}

.panel-header h3 {
  font-size: 1rem;
}

.quote-panel {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.quote-mark {
  font-size: 3rem;
  color: var(--red-soft);
  line-height: 1;
  margin-bottom: 10px;
}

.quote-panel p {
  font-size: 1.05rem;
  line-height: 1.6;
  color: var(--text);
}

.quote-footer {
  margin-top: 16px;
  color: var(--green);
  font-size: 0.72rem;
  letter-spacing: 0.16em;
  text-transform: uppercase;
}

.subject-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 14px;
}

.subject-card {
  text-align: left;
  border: 1px solid rgba(255,255,255,0.05);
  border-radius: 22px;
  padding: 18px;
  background: linear-gradient(180deg, rgba(20, 21, 26, 0.95), rgba(12, 14, 18, 0.9));
  cursor: pointer;
  color: var(--text);
}

.subject-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 14px;
}

.subject-icon {
  width: 42px;
  height: 42px;
  display: grid;
  place-items: center;
  border-radius: 12px;
  font-size: 1.4rem;
  font-weight: 700;
}

.subject-icon.math { background: rgba(255,36,72,0.12); color: #ff91a8; }
.subject-icon.physics { background: rgba(0,255,145,0.1); color: #8ff8c8; }
.subject-icon.chemistry { background: rgba(255,255,255,0.06); color: #d7d5da; }

.subject-card h3 {
  font-size: 0.9rem;
  letter-spacing: 0.18em;
  margin-bottom: 8px;
}

.subject-card p {
  color: var(--muted);
  font-size: 0.78rem;
  line-height: 1.5;
}

.subject-percent {
  color: var(--green);
  font-weight: 700;
}

.subject-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  margin: 18px 0 12px;
}

.subject-head h3 {
  font-size: clamp(1.2rem, 1.5vw, 1.8rem);
  margin-top: 4px;
}

.tabs-row {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 16px;
}

.tab-label {
  border: 1px solid rgba(255,255,255,0.06);
  background: rgba(255,255,255,0.02);
  color: var(--muted);
  padding: 8px 12px;
  border-radius: 10px;
  cursor: pointer;
}

.tab-label.active {
  background: rgba(255,36,72,0.12);
  border-color: rgba(255,36,72,0.28);
  color: var(--text);
}

.toolbar {
  display: flex;
  gap: 10px;
  margin-bottom: 14px;
}

.toolbar input,
.toolbar select,
.inline-form input {
  width: 100%;
}

.list-stack {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.list-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding: 12px 14px;
  border-radius: 14px;
  background: rgba(12, 13, 18, 0.7);
  border: 1px solid rgba(255,255,255,0.04);
}

.list-item-main {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.list-item-main strong {
  font-size: 0.92rem;
}

.list-item-main small {
  font-size: 0.72rem;
  color: var(--muted);
}

.pill {
  display: inline-block;
  padding: 5px 8px;
  border-radius: 999px;
  font-size: 0.68rem;
  background: rgba(255,36,72,0.12);
  color: #ffafc2;
  border: 1px solid rgba(255,36,72,0.2);
}

.pill.green {
  background: rgba(0,255,145,0.08);
  color: var(--green);
  border-color: rgba(0,255,145,0.2);
}

.list-actions {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.tiny-btn {
  background: rgba(255,255,255,0.02);
  color: var(--text);
  border: 1px solid rgba(255,255,255,0.06);
  padding: 7px 10px;
  font-size: 0.75rem;
}

.admin-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
}

.inline-form {
  display: flex;
  gap: 10px;
}

.settings-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
}

label span {
  color: var(--muted);
}

@media (max-width: 980px) {
  .main-shell { grid-template-columns: 1fr; }
  .sidebar { min-height: unset; }
  .stats-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .subject-grid { grid-template-columns: 1fr; }
  .cards-grid, .two-col, .admin-grid, .settings-grid { grid-template-columns: 1fr; }
}

@media (max-width: 560px) {
  .topbar { flex-direction: column; align-items: flex-start; }
  .stats-grid { grid-template-columns: 1fr; }
  .toolbar, .inline-form { flex-direction: column; }
  .auth-shell { padding: 18px; }
}
