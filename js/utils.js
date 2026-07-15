// ==========================================
// UTILITY FUNCTIONS FOR LEO CONNECT PLATFORM
// ==========================================

/**
 * Show toast notification
 * @param {string} message - Toast message text
 * @param {'info'|'success'|'warning'|'danger'} type - Toast severity
 */
function showToast(message, type = 'info') {
  const container = document.getElementById('toast-container');
  if (!container) return;
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.setAttribute('role', 'alert');
  toast.setAttribute('aria-live', 'assertive');
  toast.innerHTML = `
    <div class="toast-icon">${type === 'success' ? '✓' : type === 'danger' ? '✕' : type === 'warning' ? '⚠' : 'ℹ'}</div>
    <div class="toast-content">
      <div class="toast-message">${message}</div>
    </div>
    <button class="toast-close" onclick="this.parentElement.remove()" aria-label="Dismiss">✕</button>
  `;
  container.appendChild(toast);
  setTimeout(() => {
    toast.style.animation = 'slideOutRight 0.3s ease forwards';
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

/**
 * Debounce function — delays invoking func until after `wait` ms of inactivity
 * @param {Function} func - Function to debounce
 * @param {number} wait - Delay in milliseconds
 * @returns {Function}
 */
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Throttle function — ensures func fires at most once per `limit` ms
 * @param {Function} func - Function to throttle
 * @param {number} limit - Minimum interval in milliseconds
 * @returns {Function}
 */
function throttle(func, limit) {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

/**
 * Format relative time — e.g., "2 hours ago", "3 days ago"
 * @param {string} dateStr - ISO date string or parseable date
 * @returns {string}
 */
function formatRelativeTime(dateStr) {
  const date = new Date(dateStr);
  const now = new Date();
  const diff = now - date;
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);

  if (seconds < 60) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  if (weeks < 4) return `${weeks}w ago`;
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

/**
 * Format date for display — e.g., "15 Jul 2026"
 * @param {string} dateStr - ISO date string or parseable date
 * @returns {string}
 */
function formatDate(dateStr) {
  if (!dateStr) return '—';
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

/**
 * Format date and time — e.g., "15 Jul 2026, 14:30"
 * @param {string} dateStr - ISO date string or parseable date
 * @returns {string}
 */
function formatDateTime(dateStr) {
  if (!dateStr) return '—';
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

/**
 * Generate reference number with prefix — e.g., "WR-2026-0042"
 * @param {string} prefix - Reference prefix (e.g., 'WR', 'MNT', 'CMP')
 * @returns {string}
 */
function generateReferenceNumber(prefix) {
  const year = new Date().getFullYear();
  const seq = String(Math.floor(Math.random() * 9000) + 1000);
  return `${prefix}-${year}-${seq}`;
}

/**
 * Generate 6-digit secure access code
 * @returns {string}
 */
function generateAccessCode() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

/**
 * Generate unique ID (base-36 timestamp + random suffix)
 * @returns {string}
 */
function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
}

/**
 * Calculate countdown from a deadline
 * @param {string} deadlineStr - Deadline date string
 * @returns {{ expired: boolean, days: number, hours: number, minutes: number, total: number }}
 */
function calculateCountdown(deadlineStr) {
  const deadline = new Date(deadlineStr);
  const now = new Date();
  const diff = deadline - now;
  if (diff <= 0) return { expired: true, days: 0, hours: 0, minutes: 0, total: 0 };
  return {
    expired: false,
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
    minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
    total: diff
  };
}

/**
 * Render countdown HTML with urgency classes
 * @param {string} deadlineStr - Deadline date string
 * @returns {string} HTML markup
 */
function renderCountdown(deadlineStr) {
  const cd = calculateCountdown(deadlineStr);
  if (cd.expired) {
    return `<div class="countdown critical">
      <div class="countdown-segment"><span class="countdown-value">0</span><span class="countdown-label">Days</span></div>
      <div class="countdown-segment"><span class="countdown-value">0</span><span class="countdown-label">Hours</span></div>
      <span style="font-size:0.72rem; color:var(--danger); font-weight:600;">OVERDUE</span>
    </div>`;
  }
  const urgencyClass = cd.days < 1 ? 'critical' : cd.days < 3 ? 'urgent' : '';
  return `<div class="countdown ${urgencyClass}">
    <div class="countdown-segment"><span class="countdown-value">${cd.days}</span><span class="countdown-label">Days</span></div>
    <div class="countdown-segment"><span class="countdown-value">${cd.hours}</span><span class="countdown-label">Hours</span></div>
    <div class="countdown-segment"><span class="countdown-value">${cd.minutes}</span><span class="countdown-label">Min</span></div>
  </div>`;
}

/**
 * Group an array of objects by a key or function
 * @param {Array} array - Source array
 * @param {string|Function} key - Property name or selector function
 * @returns {Object}
 */
function groupBy(array, key) {
  return array.reduce((groups, item) => {
    const val = typeof key === 'function' ? key(item) : item[key];
    (groups[val] = groups[val] || []).push(item);
    return groups;
  }, {});
}

/**
 * Sanitize HTML to prevent XSS — escapes all HTML entities
 * @param {string} str - Raw string
 * @returns {string} Escaped string
 */
function sanitizeHTML(str) {
  const temp = document.createElement('div');
  temp.textContent = str;
  return temp.innerHTML;
}

/**
 * Copy text to clipboard with toast feedback
 * @param {string} text - Text to copy
 */
function copyToClipboard(text) {
  navigator.clipboard.writeText(text).then(() => {
    showToast('Copied to clipboard', 'success');
  }).catch(() => {
    // Fallback for older browsers / insecure contexts
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.left = '-9999px';
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
    showToast('Copied to clipboard', 'success');
  });
}

/**
 * Pluralize text — returns "1 item" or "5 items"
 * @param {number} count
 * @param {string} singular
 * @param {string} [plural] - Defaults to singular + 's'
 * @returns {string}
 */
function pluralize(count, singular, plural) {
  return count === 1 ? `${count} ${singular}` : `${count} ${plural || singular + 's'}`;
}

/**
 * Trap focus within an element (for modals / side-panels).
 * Returns a cleanup function to remove the listener.
 * @param {HTMLElement} element - Container to trap focus within
 * @returns {Function} Cleanup function
 */
function trapFocus(element) {
  const focusable = element.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
  const firstFocusable = focusable[0];
  const lastFocusable = focusable[focusable.length - 1];

  function handleTabKey(e) {
    if (e.key !== 'Tab') return;
    if (e.shiftKey) {
      if (document.activeElement === firstFocusable) {
        lastFocusable.focus();
        e.preventDefault();
      }
    } else {
      if (document.activeElement === lastFocusable) {
        firstFocusable.focus();
        e.preventDefault();
      }
    }
  }

  element.addEventListener('keydown', handleTabKey);
  firstFocusable?.focus();
  return () => element.removeEventListener('keydown', handleTabKey);
}

/**
 * Get status badge HTML
 * @param {string} status - Status label
 * @returns {string} HTML markup
 */
function getStatusBadge(status) {
  const statusMap = {
    'Draft': 'badge-draft',
    'Submitted': 'badge-submitted',
    'Feasibility Review': 'badge-review',
    'Design in Progress': 'badge-progress',
    'Development in Progress': 'badge-progress',
    'Internal Testing': 'badge-review',
    'PR and Branding Review': 'badge-review',
    'Club Content Review': 'badge-review',
    'Published': 'badge-published',
    'Active': 'badge-active',
    'Approved': 'badge-approved',
    'Completed': 'badge-completed',
    'Rejected': 'badge-rejected',
    'Cancelled': 'badge-cancelled',
    'Work in Progress': 'badge-progress',
    'Assigned': 'badge-assigned',
    'Under Review': 'badge-review',
    'Triage': 'badge-triage',
    'Resolved': 'badge-approved',
    'Closed': 'badge-approved',
    'Overdue': 'badge-overdue',
    'Action Taken': 'badge-submitted',
    'Acknowledged': 'badge-submitted',
    'Pending': 'badge-warning',
    'Emergency': 'badge-rejected',
    'Meeting Scheduling': 'badge-progress',
    'Investigation': 'badge-review',
  };
  const cls = statusMap[status] || 'badge-draft';
  return `<span class="badge ${cls}">${sanitizeHTML(status)}</span>`;
}

/**
 * Get priority indicator HTML
 * @param {string} priority - Priority level
 * @returns {string} HTML markup
 */
function getPriorityIndicator(priority) {
  const colors = {
    'Low': { bg: 'rgba(255,255,255,0.06)', text: 'var(--slate-blue)', label: 'Low' },
    'Normal': { bg: 'rgba(59, 130, 246, 0.12)', text: 'var(--info)', label: 'Normal' },
    'High': { bg: 'rgba(245, 158, 11, 0.12)', text: 'var(--warning)', label: 'High' },
    'Critical': { bg: 'rgba(239, 68, 68, 0.12)', text: 'var(--danger)', label: 'Critical' },
    'Emergency': { bg: 'rgba(220, 38, 38, 0.15)', text: '#dc2626', label: '⚠ Emergency' },
  };
  const p = colors[priority] || colors['Normal'];
  return `<span class="badge" style="background:${p.bg}; color:${p.text};">${p.label}</span>`;
}

/**
 * Check if a user role has access to a given module
 * @param {string} role - User role identifier
 * @param {string} moduleId - Module identifier
 * @returns {boolean}
 */
function hasModuleAccess(role, moduleId) {
  const access = {
    'super-admin': ['dashboard','admin','websites','maintenance','governance','verification','appointments','inquiries','audit'],
    'club-president': ['dashboard','websites','maintenance','governance','verification','appointments','inquiries'],
    'district-pr': ['dashboard','governance','websites'],
    'district-tech': ['dashboard','websites','maintenance','inquiries'],
    'district-verification': ['dashboard','verification','appointments'],
    'individual-leo': ['dashboard','inquiries'],
  };
  const modules = access[role] || [];
  return modules.includes(moduleId);
}

/**
 * Get human-readable module display name
 * @param {string} moduleId - Module identifier
 * @returns {string}
 */
function getModuleName(moduleId) {
  const names = {
    'dashboard': 'Overview',
    'admin': 'Clubs & Users',
    'websites': 'Website Services',
    'maintenance': 'Maintenance Center',
    'governance': 'PR Standards & Compliance',
    'verification': 'Mediation Cases',
    'appointments': 'Appointments',
    'inquiries': 'Inquiries',
    'audit': 'Audit Logs',
  };
  return names[moduleId] || moduleId;
}
