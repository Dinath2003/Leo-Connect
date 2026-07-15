// === NOTIFICATION CENTRE ===

let notificationPanelOpen = false;

/** Initialize notification system */
function initNotifications() {
  // Create notification panel if it doesn't exist
  if (!document.getElementById('notification-panel')) {
    const panel = document.createElement('div');
    panel.id = 'notification-panel';
    panel.className = 'notification-panel';
    panel.setAttribute('role', 'dialog');
    panel.setAttribute('aria-label', 'Notifications');
    panel.innerHTML = `
      <div class="notification-panel-header">
        <h2 style="margin:0;">Notifications</h2>
        <div style="display:flex; gap:8px; align-items:center;">
          <button class="btn btn-secondary btn-sm" onclick="toggleQuietMode()" id="quiet-mode-btn" aria-label="Toggle quiet mode" title="Quiet Mode">
            🔕
          </button>
          <button class="btn btn-secondary btn-sm" onclick="markAllNotificationsRead()" aria-label="Mark all as read">
            ✓ All
          </button>
          <button class="btn btn-secondary btn-sm" onclick="closeNotificationPanel()" aria-label="Close notifications">
            ✕
          </button>
        </div>
      </div>
      <div class="notification-panel-body" id="notification-panel-body">
      </div>
    `;
    document.body.appendChild(panel);
    
    // Create overlay
    const overlay = document.createElement('div');
    overlay.id = 'notification-overlay';
    overlay.className = 'mobile-overlay';
    overlay.addEventListener('click', closeNotificationPanel);
    document.body.appendChild(overlay);
  }
}

/** Open notification panel */
function openNotificationPanel() {
  const panel = document.getElementById('notification-panel');
  const overlay = document.getElementById('notification-overlay');
  if (panel) {
    panel.classList.add('open');
    notificationPanelOpen = true;
    renderNotificationPanel();
  }
  if (overlay) overlay.classList.add('active');
}

/** Close notification panel */
function closeNotificationPanel() {
  const panel = document.getElementById('notification-panel');
  const overlay = document.getElementById('notification-overlay');
  if (panel) {
    panel.classList.remove('open');
    notificationPanelOpen = false;
  }
  if (overlay) overlay.classList.remove('active');
}

/** Toggle notification panel */
function toggleNotificationPanel() {
  if (notificationPanelOpen) closeNotificationPanel();
  else openNotificationPanel();
}

/** Render notification panel content */
function renderNotificationPanel() {
  const body = document.getElementById('notification-panel-body');
  if (!body) return;
  
  const notifications = state.getData('notifications') || [];
  const emergencies = state.getData('emergencyNotices') || [];
  
  if (notifications.length === 0 && emergencies.filter(e => !e.acknowledged).length === 0) {
    body.innerHTML = `
      <div style="padding: 60px 20px; text-align: center;">
        <div style="font-size: 2rem; margin-bottom: 12px; opacity: 0.3;">🔔</div>
        <div style="font-size: 0.85rem; color: var(--slate-blue);">No notifications</div>
        <div style="font-size: 0.75rem; color: var(--slate-blue); opacity: 0.5; margin-top: 4px;">You're all caught up!</div>
      </div>
    `;
    return;
  }
  
  let html = '';
  
  // Emergency notifications first
  const unacknowledgedEmergencies = emergencies.filter(e => !e.acknowledged);
  if (unacknowledgedEmergencies.length > 0) {
    html += `<div class="notification-group">`;
    html += `<div class="notification-group-title" style="color: var(--danger);">⚠ Emergency Notices</div>`;
    unacknowledgedEmergencies.forEach(e => {
      html += `
        <div class="notification-card emergency" onclick="closeNotificationPanel(); switchView('governance');">
          <div class="notification-card-title">${sanitizeHTML(e.headline)}</div>
          <div class="notification-card-desc">${sanitizeHTML(e.club || e.clubName || 'Club')} — Immediate action required</div>
          <div class="notification-card-time">${formatRelativeTime(e.dateDispatched)}</div>
          <div class="notification-card-module">PR Compliance</div>
        </div>
      `;
    });
    html += `</div>`;
  }
  
  // Group regular notifications by time
  const today = [];
  const thisWeek = [];
  const older = [];
  const now = new Date();
  
  notifications.forEach(n => {
    const nDate = new Date(n.timestamp);
    const diffDays = Math.floor((now - nDate) / (1000 * 60 * 60 * 24));
    if (diffDays === 0) today.push(n);
    else if (diffDays < 7) thisWeek.push(n);
    else older.push(n);
  });
  
  const renderGroup = (title, items) => {
    if (items.length === 0) return '';
    let groupHtml = `<div class="notification-group">`;
    groupHtml += `<div class="notification-group-title">${title}</div>`;
    items.forEach(n => {
      const isUrgent = n.urgent;
      groupHtml += `
        <div class="notification-card ${isUrgent ? 'unread' : ''}">
          <div class="notification-card-title">${sanitizeHTML(n.text)}</div>
          <div class="notification-card-time">${formatRelativeTime(n.timestamp)}</div>
        </div>
      `;
    });
    groupHtml += `</div>`;
    return groupHtml;
  };
  
  html += renderGroup('Today', today);
  html += renderGroup('This Week', thisWeek);
  html += renderGroup('Earlier', older);
  
  body.innerHTML = html;
}

/** Mark all notifications as read */
function markAllNotificationsRead() {
  const notifications = state.getData('notifications') || [];
  notifications.forEach(n => n.read = true);
  state.setData('notifications', notifications);
  renderNotificationPanel();
  updateNotificationBadge();
  showToast('All notifications marked as read', 'success');
}

/** Toggle quiet mode */
function toggleQuietMode() {
  const prefs = state.getPreferences ? state.getPreferences() : { quietMode: false };
  const newQuiet = !prefs.quietMode;
  if (state.setPreference) state.setPreference('quietMode', newQuiet);
  const btn = document.getElementById('quiet-mode-btn');
  if (btn) btn.textContent = newQuiet ? '🔔' : '🔕';
  showToast(newQuiet ? 'Quiet mode enabled — only emergency notifications will alert' : 'Quiet mode disabled', 'info');
}

/** Update notification badge count in header */
function updateNotificationBadge() {
  const notifications = state.getData('notifications') || [];
  const emergencies = state.getData('emergencyNotices') || [];
  const unread = notifications.filter(n => !n.read).length + emergencies.filter(e => !e.acknowledged).length;
  
  // Update any badge elements
  const badges = document.querySelectorAll('#notification-count');
  badges.forEach(badge => {
    badge.textContent = unread > 99 ? '99+' : unread;
    badge.style.display = unread > 0 ? 'flex' : 'none';
  });
}
