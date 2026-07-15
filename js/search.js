// === GLOBAL SEARCH SYSTEM ===
// Searches across all data collections with categorized results

let searchOverlayOpen = false;

/** Initialize search system */
function initSearch() {
  // Listen for Cmd+K / Ctrl+K to open search
  document.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault();
      toggleSearchOverlay();
    }
    if (e.key === 'Escape' && searchOverlayOpen) {
      closeSearchOverlay();
    }
  });
  
  // Make sidebar search input open the overlay
  const sidebarSearch = document.querySelector('.search-input');
  if (sidebarSearch) {
    sidebarSearch.removeAttribute('readonly');
    sidebarSearch.addEventListener('focus', (e) => {
      e.target.blur();
      openSearchOverlay();
    });
  }
}

/** Toggle search overlay */
function toggleSearchOverlay() {
  if (searchOverlayOpen) closeSearchOverlay();
  else openSearchOverlay();
}

/** Open search overlay */
function openSearchOverlay() {
  let overlay = document.getElementById('search-overlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = 'search-overlay';
    overlay.className = 'search-overlay';
    overlay.innerHTML = `
      <div class="search-modal" role="dialog" aria-label="Search">
        <div class="search-modal-input-wrap">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.637 10.637Z" />
          </svg>
          <input type="text" class="search-modal-input" id="global-search-input" placeholder="Search requests, clubs, resources, cases..." autocomplete="off" />
        </div>
        <div class="search-results-container" id="search-results-container">
          <div style="padding: 40px; text-align: center; color: var(--slate-blue); font-size: 0.82rem;">
            Start typing to search across all modules...
          </div>
        </div>
        <div class="search-modal-footer">
          <div class="search-shortcut-hint">
            <kbd>↑↓</kbd> Navigate
            <kbd>↵</kbd> Open
            <kbd>Esc</kbd> Close
          </div>
          <div class="search-shortcut-hint">
            <kbd>⌘K</kbd> Search
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(overlay);
    
    // Click outside to close
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) closeSearchOverlay();
    });
    
    // Input handler
    const input = overlay.querySelector('#global-search-input');
    input.addEventListener('input', debounce((e) => {
      performSearch(e.target.value.trim());
    }, 200));
    
    // Keyboard nav
    input.addEventListener('keydown', handleSearchKeyboard);
  }
  
  overlay.classList.add('active');
  searchOverlayOpen = true;
  
  const input = overlay.querySelector('#global-search-input');
  input.value = '';
  input.focus();
  
  // Reset results
  const container = overlay.querySelector('#search-results-container');
  container.innerHTML = '<div style="padding: 40px; text-align: center; color: var(--slate-blue); font-size: 0.82rem;">Start typing to search across all modules...</div>';
}

/** Close search overlay */
function closeSearchOverlay() {
  const overlay = document.getElementById('search-overlay');
  if (overlay) {
    overlay.classList.remove('active');
    searchOverlayOpen = false;
  }
}

/** Perform search across all collections */
function performSearch(query) {
  const container = document.getElementById('search-results-container');
  if (!container) return;
  
  if (!query || query.length < 2) {
    container.innerHTML = '<div style="padding: 40px; text-align: center; color: var(--slate-blue); font-size: 0.82rem;">Start typing to search across all modules...</div>';
    return;
  }
  
  const q = query.toLowerCase();
  const results = {};
  
  // Search website requests
  const requests = state.getData('websiteRequests') || [];
  const matchedRequests = requests.filter(r => 
    (r.domain && r.domain.toLowerCase().includes(q)) ||
    (r.preferredDomain && r.preferredDomain.toLowerCase().includes(q)) ||
    (r.title && r.title.toLowerCase().includes(q)) ||
    (r.referenceNumber && r.referenceNumber.toLowerCase().includes(q)) ||
    (r.club && r.club.toLowerCase().includes(q)) ||
    (r.id && r.id.toLowerCase().includes(q))
  );
  if (matchedRequests.length) results['Website Requests'] = matchedRequests.map(r => ({
    title: r.preferredDomain || r.domain || r.title || r.id,
    subtitle: `${r.status} • ${r.club || 'Unknown club'}`,
    icon: '🌐',
    action: () => { closeSearchOverlay(); switchView('websites'); }
  }));
  
  // Search clubs
  const clubs = state.getData('clubs') || [];
  const matchedClubs = clubs.filter(c =>
    c.name.toLowerCase().includes(q) ||
    (c.number && c.number.toLowerCase().includes(q))
  );
  if (matchedClubs.length) results['Clubs'] = matchedClubs.map(c => ({
    title: c.name,
    subtitle: `Club #${c.number} • ${c.type}`,
    icon: '🦁',
    action: () => { closeSearchOverlay(); switchView('admin'); }
  }));
  
  // Search maintenance tickets
  const tickets = state.getData('maintenanceTickets') || [];
  const matchedTickets = tickets.filter(t =>
    (t.subject && t.subject.toLowerCase().includes(q)) ||
    (t.id && t.id.toLowerCase().includes(q))
  );
  if (matchedTickets.length) results['Maintenance'] = matchedTickets.map(t => ({
    title: t.subject,
    subtitle: `${t.status} • ${t.priority || 'Normal'}`,
    icon: '🔧',
    action: () => { closeSearchOverlay(); switchView('maintenance'); }
  }));
  
  // Search compliance cases
  const comp = state.getData('complianceCases') || [];
  const matchedComp = comp.filter(c =>
    (c.club && c.club.toLowerCase().includes(q)) ||
    (c.clubName && c.clubName.toLowerCase().includes(q)) ||
    (c.category && c.category.toLowerCase().includes(q)) ||
    (c.id && c.id.toLowerCase().includes(q))
  );
  if (matchedComp.length) results['Compliance Cases'] = matchedComp.map(c => ({
    title: (c.club || c.clubName) + ' — ' + c.category,
    subtitle: `${c.status} • ${c.severity || 'Normal'}`,
    icon: '🛡️',
    action: () => { closeSearchOverlay(); switchView('governance'); }
  }));
  
  // Search verification cases
  const verif = state.getData('verificationCases') || [];
  const matchedVerif = verif.filter(v =>
    (v.subject && v.subject.toLowerCase().includes(q)) ||
    (v.id && v.id.toLowerCase().includes(q))
  );
  if (matchedVerif.length) results['Verification Cases'] = matchedVerif.map(v => ({
    title: v.subject,
    subtitle: `${v.status}`,
    icon: '⚖️',
    action: () => { closeSearchOverlay(); switchView('verification'); }
  }));
  
  // Search resources
  const resources = state.getData('resources') || [];
  const matchedRes = resources.filter(r =>
    (r.name && r.name.toLowerCase().includes(q)) ||
    (r.category && r.category.toLowerCase().includes(q))
  );
  if (matchedRes.length) results['PR Resources'] = matchedRes.map(r => ({
    title: r.name,
    subtitle: `${r.category} • ${r.version || 'v1.0'}`,
    icon: '🎨',
    action: () => { closeSearchOverlay(); switchView('governance'); }
  }));
  
  // Search users
  const users = state.getData('users') || [];
  const matchedUsers = users.filter(u =>
    (u.name && u.name.toLowerCase().includes(q)) ||
    (u.email && u.email.toLowerCase().includes(q))
  );
  if (matchedUsers.length) results['Users'] = matchedUsers.map(u => ({
    title: u.name,
    subtitle: `${u.role} • ${u.email}`,
    icon: '👤',
    action: () => { closeSearchOverlay(); switchView('admin'); }
  }));
  
  // Search appointments
  const apts = state.getData('appointments') || [];
  const matchedApts = apts.filter(a =>
    (a.purpose && a.purpose.toLowerCase().includes(q)) ||
    (a.requestedBy && a.requestedBy.toLowerCase().includes(q))
  );
  if (matchedApts.length) results['Appointments'] = matchedApts.map(a => ({
    title: a.purpose || 'Appointment',
    subtitle: `${a.status} • ${formatDate(a.date)}`,
    icon: '📅',
    action: () => { closeSearchOverlay(); switchView('appointments'); }
  }));
  
  // Render results
  if (Object.keys(results).length === 0) {
    container.innerHTML = `<div style="padding: 40px; text-align: center; color: var(--slate-blue); font-size: 0.82rem;">No results found for "${sanitizeHTML(query)}"</div>`;
    return;
  }
  
  let html = '';
  for (const [group, items] of Object.entries(results)) {
    html += `<div class="search-result-group">`;
    html += `<div class="search-result-group-title">${group}</div>`;
    items.slice(0, 5).forEach((item, i) => {
      html += `<div class="search-result-item" data-search-group="${group}" data-search-index="${i}" onclick="handleSearchResultClick(this)">`;
      html += `<div class="search-result-icon"><span style="font-size:1rem;">${item.icon}</span></div>`;
      html += `<div><div class="search-result-title">${sanitizeHTML(item.title)}</div><div class="search-result-meta">${sanitizeHTML(item.subtitle)}</div></div>`;
      html += `</div>`;
    });
    html += `</div>`;
  }
  
  container.innerHTML = html;
  container._results = results;
}

/** Handle search result click */
function handleSearchResultClick(element) {
  const container = document.getElementById('search-results-container');
  const results = container._results;
  const group = element.getAttribute('data-search-group');
  const index = parseInt(element.getAttribute('data-search-index'));
  if (results && results[group] && results[group][index]) {
    results[group][index].action();
  }
}

/** Keyboard navigation in search */
function handleSearchKeyboard(e) {
  const container = document.getElementById('search-results-container');
  if (!container) return;
  const items = container.querySelectorAll('.search-result-item');
  if (items.length === 0) return;
  
  const activeItem = container.querySelector('.search-result-item.active');
  let activeIndex = -1;
  items.forEach((item, i) => { if (item === activeItem) activeIndex = i; });
  
  if (e.key === 'ArrowDown') {
    e.preventDefault();
    items.forEach(i => i.classList.remove('active'));
    const next = (activeIndex + 1) % items.length;
    items[next].classList.add('active');
    items[next].scrollIntoView({ block: 'nearest' });
  } else if (e.key === 'ArrowUp') {
    e.preventDefault();
    items.forEach(i => i.classList.remove('active'));
    const prev = activeIndex <= 0 ? items.length - 1 : activeIndex - 1;
    items[prev].classList.add('active');
    items[prev].scrollIntoView({ block: 'nearest' });
  } else if (e.key === 'Enter') {
    e.preventDefault();
    if (activeItem) activeItem.click();
    else if (items.length > 0) items[0].click();
  }
}
