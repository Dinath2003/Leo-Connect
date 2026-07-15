// ==========================================
// RENDERERS FOR VIEW DATA
// ==========================================

function renderViewData(viewId) {
  switch (viewId) {
    case "dashboard":
      renderDashboard();
      break;
    case "workspace":
      renderWorkspaceView();
      break;
    case "admin":
      renderAdminPanel();
      break;
    case "websites":
      renderWebsiteRequests();
      break;
    case "maintenance":
      renderMaintenanceAndTraining();
      break;
    case "governance":
      renderGovernanceAndBranding();
      break;
    case "verification":
      renderVerificationCases();
      break;
    case "appointments":
      renderAppointments();
      break;
    case "inquiries":
      renderInquiries();
      break;
    case "audit":
      renderAuditLogsTable();
      break;
  }
}

// 1. DASHBOARD VIEW RENDERER
let currentDashboardFilter = 'all';

function filterDashboardTasks(filterType) {
  currentDashboardFilter = filterType;
  
  // Update filter pills active class
  const fAll = document.getElementById("task-filter-all");
  const fProg = document.getElementById("task-filter-progress");
  const fPub = document.getElementById("task-filter-published");
  
  if (fAll) fAll.classList.toggle("active", filterType === 'all');
  if (fProg) fProg.classList.toggle("active", filterType === 'Progress');
  if (fPub) fPub.classList.toggle("active", filterType === 'Published');
  
  renderDashboard();
}

function renderDashboard() {
  const container = document.getElementById("dashboard-tasks-container");
  if (!container) return;

  const user = state.currentUser;
  if (!user) return;

  const role = user.role;
  const requests = state.getData("websiteRequests") || [];
  const complianceCases = state.getData("complianceCases") || [];
  const tickets = state.getData("maintenanceTickets") || [];
  const appointments = state.getData("appointments") || [];
  const emergencies = state.getData("emergencyNotices") || [];
  const verification = state.getData("verificationCases") || [];
  const checklist = JSON.parse(localStorage.getItem("trainingChecklist")) || {};

  // 1. Calculate stats based on role
  let stats = [];
  if (role === 'super-admin') {
    const activeReqs = requests.filter(r => r.status !== 'Published' && r.status !== 'Rejected' && r.status !== 'Cancelled').length;
    const pendingReviews = requests.filter(r => r.status === 'Submitted' || r.status === 'PR and Branding Review').length;
    const nonCompliant = state.getData("clubs").filter(c => c.brandingStatus !== 'Compliant').length;
    const activeApts = appointments.filter(a => a.status === 'Confirmed' || a.status === 'Requested').length;
    
    stats = [
      { label: 'Active Requests', value: activeReqs, trend: 'All websites in pipeline', icon: '🌐' },
      { label: 'Pending Reviews', value: pendingReviews, trend: 'Awaiting decision', icon: '📋' },
      { label: 'Non-Compliant Clubs', value: nonCompliant, trend: 'Warning / Action required', icon: '🛡️' },
      { label: 'Active Appointments', value: activeApts, trend: 'Upcoming meetings', icon: '📅' }
    ];
  } else if (role === 'club-president') {
    const myReqs = requests.filter(r => r.clubId === user.club).length;
    const myTickets = tickets.filter(t => t.club === user.club).length;
    const clubObj = state.getData("clubs").find(c => c.id === user.club) || {};
    const compliance = clubObj.brandingStatus || 'Compliant';
    const myApts = appointments.filter(a => a.requestedBy === user.name).length;
    
    stats = [
      { label: 'My Web Requests', value: myReqs, trend: 'Websites & projects', icon: '🌐' },
      { label: 'Maintenance Tickets', value: myTickets, trend: 'Active support tickets', icon: '🔧' },
      { label: 'Branding Status', value: compliance, trend: 'Club compliance level', icon: '🛡️', customColor: compliance === 'Compliant' ? 'var(--success-green)' : 'var(--warning)' },
      { label: 'My Appointments', value: myApts, trend: 'Scheduled with Council', icon: '📅' }
    ];
  } else if (role === 'district-tech') {
    const assignedReqs = requests.filter(r => r.assignedDev === user.name || r.assignedTo === user.name).length;
    const openTickets = tickets.filter(t => t.status !== 'Closed' && t.status !== 'Resolved').length;
    const pendingQA = requests.filter(r => r.status === 'Internal Testing').length;
    const closedTickets = tickets.filter(t => t.status === 'Closed' || t.status === 'Resolved').length;
    
    stats = [
      { label: 'Assigned Websites', value: assignedReqs, trend: 'In design & development', icon: '💻' },
      { label: 'Open Support Tickets', value: openTickets, trend: 'Awaiting tech resolution', icon: '🔧' },
      { label: 'Pending QA Reviews', value: pendingQA, trend: 'Internal testing validation', icon: '🔬' },
      { label: 'Completed Tickets', value: closedTickets, trend: 'Lifetime tickets resolved', icon: '✅' }
    ];
  } else if (role === 'district-pr') {
    const pendingReviews = requests.filter(r => r.status === 'PR and Branding Review').length;
    const activeViolations = complianceCases.filter(c => c.status !== 'Closed').length;
    const resourcesCount = state.getData("resources").length;
    const closedCases = complianceCases.filter(c => c.status === 'Closed').length;
    
    stats = [
      { label: 'PR Reviews Pending', value: pendingReviews, trend: 'Website branding checks', icon: '🎨' },
      { label: 'Active CoC Violations', value: activeViolations, trend: 'Compliance cases in progress', icon: '⚠️' },
      { label: 'Branding Resources', value: resourcesCount, trend: 'Assets in visual library', icon: '📁' },
      { label: 'Resolved Cases', value: closedCases, trend: 'Compliance issues closed', icon: '✅' }
    ];
  } else {
    // Default fallback
    stats = [
      { label: 'Active Requests', value: requests.length, trend: 'Total requests in system', icon: '🌐' },
      { label: 'Support Tickets', value: tickets.length, trend: 'Total maintenance tickets', icon: '🔧' },
      { label: 'Compliance Cases', value: complianceCases.length, trend: 'Branding audit cases', icon: '🛡️' },
      { label: 'District Calendar', value: appointments.length, trend: 'Total booked appointments', icon: '📅' }
    ];
  }

  // Draw Dashboard UI
  let html = '';

  // 1. Stats Grid HTML
  html += `<div class="stats-grid">`;
  stats.forEach(s => {
    const valColor = s.customColor ? `style="color:${s.customColor}"` : '';
    html += `
      <div class="card stat-card">
        <div style="display:flex; justify-content:space-between; align-items:flex-start;">
          <div>
            <div class="stat-label">${s.label}</div>
            <div class="stat-value" ${valColor}>${s.value}</div>
          </div>
          <span style="font-size:1.4rem; padding:6px; background:rgba(123, 69, 240, 0.08); border-radius:8px;">${s.icon}</span>
        </div>
        <div class="stat-trend" style="color:var(--slate-blue); opacity:0.6; font-size:0.68rem; margin-top:4px;">${s.trend}</div>
      </div>
    `;
  });
  html += `</div>`;

  // 2. Emergency Banner (If club president has an unacknowledged emergency notice)
  let userEmergencies = [];
  if (role === 'club-president') {
    userEmergencies = emergencies.filter(e => !e.acknowledged && (e.club === user.club || e.clubName === user.club));
  } else if (role === 'super-admin' || role === 'district-pr') {
    userEmergencies = emergencies.filter(e => !e.acknowledged);
  }
  
  if (userEmergencies.length > 0) {
    const em = userEmergencies[0];
    html += `
      <div class="emergency-banner" onclick="switchView('governance')">
        <div class="emergency-banner-icon">🚨</div>
        <div class="emergency-banner-content">
          <div class="emergency-banner-title">EMERGENCY DIRECTIVE: ${sanitizeHTML(em.headline)}</div>
          <div class="emergency-banner-desc">Dispatched by District PR: <strong>${sanitizeHTML(em.instruction)}</strong>. Action and evidence submission required.</div>
        </div>
        <div class="emergency-banner-action">
          <button class="btn btn-danger btn-sm" style="background:#dc2626; border-radius:8px;">View Notice</button>
        </div>
      </div>
    `;
  }

  // 3. My Attention Section
  const attentionItems = state.getAttentionItems() || [];
  html += `
    <div class="section-header" style="margin-top: 10px;">
      <div>
        <h2 class="section-title">My Attention</h2>
        <p class="section-subtitle">Processes requiring your immediate review or action.</p>
      </div>
    </div>
  `;

  if (attentionItems.length === 0) {
    html += `
      <div class="card" style="padding: 24px; text-align: center; color: var(--slate-blue); font-size: 0.82rem;">
        🟢 No pending items require your immediate attention right now.
      </div>
    `;
  } else {
    html += `<div class="attention-grid">`;
    attentionItems.forEach(item => {
      let badgeCls = 'badge-draft';
      if (item.priority === 'Emergency') badgeCls = 'badge-rejected';
      else if (item.priority === 'High') badgeCls = 'badge-warning';
      else badgeCls = 'badge-progress';
      
      html += `
        <div class="attention-card ${item.priority.toLowerCase()}" onclick="switchView('${item.module}')">
          <div class="attention-card-icon" style="background:rgba(123, 69, 240, 0.08);">${item.icon}</div>
          <div class="attention-card-body">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:4px;">
              <span class="badge ${badgeCls}" style="font-size:0.6rem; padding:2px 6px;">${item.priority}</span>
              <span style="font-size:0.68rem; color:var(--slate-blue); opacity:0.5; font-family:monospace;">${item.ref}</span>
            </div>
            <div class="attention-card-title">${sanitizeHTML(item.title)}</div>
            <div class="attention-card-meta">${sanitizeHTML(item.action)}</div>
            <div class="attention-card-action">Go to task →</div>
          </div>
        </div>
      `;
    });
    html += `</div>`;
  }

  // 4. Live Process Overview Section
  let processOverview = state.getProcessOverview() || [];
  
  // Filter based on selected dashboard tab
  if (currentDashboardFilter === 'Progress') {
    processOverview = processOverview.filter(p => !['Published', 'Closed', 'Resolved', 'Draft'].includes(p.status));
  } else if (currentDashboardFilter === 'Published') {
    processOverview = processOverview.filter(p => p.status === 'Published');
  }

  html += `
    <div class="section-header" style="margin-top: 24px;">
      <div>
        <h2 class="section-title">Live Process Feed</h2>
        <p class="section-subtitle">Real-time tracking of active website, maintenance, and compliance workflows.</p>
      </div>
    </div>
  `;

  if (processOverview.length === 0) {
    html += `
      <div class="card" style="padding: 32px; text-align: center; color: var(--slate-blue); font-size: 0.82rem;">
        No active workflows matching the selected filter.
      </div>
    `;
  } else {
    html += `<div class="process-overview-grid">`;
    processOverview.forEach(p => {
      html += `
        <div class="process-overview-card" onclick="switchView('${p.module}')">
          <div class="process-card-header">
            <span style="font-size:0.68rem; font-weight:700; color:var(--periwinkle); opacity:0.5;">${p.type}</span>
            ${getStatusBadge(p.status)}
          </div>
          <div class="process-card-title" style="margin-bottom:6px; font-weight:700;">${sanitizeHTML(p.title)}</div>
          <div class="process-card-activity" style="font-size:0.72rem; color:var(--slate-blue); line-height:1.4; margin-bottom:12px;">
            Next: <span style="color:var(--periwinkle); font-weight:500;">${sanitizeHTML(p.nextAction)}</span>
          </div>
          <div style="display:flex; justify-content:space-between; align-items:center; font-size:0.65rem; color:var(--slate-blue); opacity:0.6;">
            <span>Ref: ${p.id}</span>
            <span>Active ${formatRelativeTime(p.lastActivity)}</span>
          </div>
        </div>
      `;
    });
    html += `</div>`;
  }

  container.innerHTML = html;

  // ── Update Right Sidebar Widgets ──────────────────────────────────────
  const sidebarNote = document.getElementById("sidebar-coc-note");
  const sidebarActionBtn = document.getElementById("sidebar-coc-action-btn");
  const sidebarTime = document.getElementById("sidebar-coc-time");

  if (checklist["quiz-pass"]) {
    if (sidebarNote) sidebarNote.textContent = "Congratulations! You have passed the branding quiz and acknowledged the mandatory Code of Conduct. 🏆";
    if (sidebarActionBtn) {
      sidebarActionBtn.textContent = "Certified";
      sidebarActionBtn.style.opacity = "0.5";
      sidebarActionBtn.disabled = true;
    }
  } else {
    if (sidebarNote) sidebarNote.textContent = "Please sign the mandatory Code of Conduct and complete the technical branding quiz. Compliance score is currently warning status. 🏀";
    if (sidebarActionBtn) {
      sidebarActionBtn.textContent = "I'm going";
      sidebarActionBtn.style.opacity = "1";
      sidebarActionBtn.disabled = false;
    }
  }
  if (sidebarTime) sidebarTime.textContent = "Just now";

  // Update Resolved Support Tickets count
  const resolvedTicketsCount = tickets.filter(x => x.status === "Completed" || x.status === "Closed" || x.status === "Resolved").length;
  const sidebarActivityText = document.getElementById("sidebar-activity-stat-text");
  if (sidebarActivityText) {
    sidebarActivityText.textContent = `${resolvedTicketsCount} Tickets Completed`;
  }
  
  // Trigger Header notification count badge update
  if (window.updateNotificationBadge) {
    window.updateNotificationBadge();
  }
}

// 2. CLUBS & USERS VIEW RENDERER
function renderAdminPanel() {
  const users = state.getData("users");
  const clubs = state.getData("clubs");
  
  // Render users table
  const usersTable = document.getElementById("admin-users-table");
  if (usersTable) {
    usersTable.innerHTML = users.map(u => {
      const clubObj = clubs.find(c => c.id === u.club) || { name: u.club };
      const clubName = u.club === "District Council" ? "District Council" : clubObj.name;
      return `
        <tr>
          <td><strong>${u.name}</strong></td>
          <td>${u.email}</td>
          <td>${clubName}</td>
          <td><span style="text-transform: capitalize;">${u.role.replace(/-/g, ' ')}</span></td>
          <td><span class="badge badge-active">${u.status}</span></td>
          <td>
            <button class="btn btn-secondary btn-sm" onclick="toggleUserStatus('${u.id}')">${u.status === "Active" ? "Suspend" : "Activate"}</button>
          </td>
        </tr>
      `;
    }).join('');
  }

  // Render clubs table
  const clubsTable = document.getElementById("admin-clubs-table");
  if (clubsTable) {
    clubsTable.innerHTML = clubs.map(c => {
      let brandClass = "badge-approved";
      if (c.brandingStatus === "Warning") brandClass = "badge-warning";
      if (c.brandingStatus === "Non-Compliant") brandClass = "badge-rejected";

      return `
        <tr>
          <td><strong>${c.name}</strong></td>
          <td>${c.number}</td>
          <td>${c.sponsor}</td>
          <td>${c.type}</td>
          <td>${c.president}</td>
          <td><span class="badge ${brandClass}">${c.brandingStatus}</span></td>
          <td>
            <button class="btn btn-secondary btn-sm" onclick="viewClubDashboard('${c.id}')">Profiles Workspace</button>
          </td>
        </tr>
      `;
    }).join('');
  }

  // Populate User Creation Dialog Clubs Select
  const selectClub = document.getElementById("usr-club");
  if (selectClub) {
    selectClub.innerHTML = `<option value="District Council">District Council</option>` + 
      clubs.map(c => `<option value="${c.id}">${c.name}</option>`).join('');
  }
}

// 3. WEBSITE SERVICES VIEW RENDERER
function renderWebsiteRequests() {
  const reqs = state.getData("websiteRequests");
  const table = document.getElementById("website-requests-table");
  if (!table) return;
  const r = state.currentUser.role;
  const clubId = state.currentUser.club;

  // Filter requests based on role permissions (Least privilege)
  const visibleReqs = r === "club-president" ? reqs.filter(x => x.clubId === clubId) : reqs;

  table.innerHTML = visibleReqs.map(req => {
    let statusClass = "badge-submitted";
    if (req.status === "Published" || req.status === "Approved") statusClass = "badge-published";
    if (req.status === "Rejected" || req.status === "Cancelled") statusClass = "badge-rejected";
    if (req.status.includes("Progress")) statusClass = "badge-progress";
    if (req.status.includes("Review")) statusClass = "badge-review";

    // Operations buttons depending on roles
    let actionButtons = `<button class="btn btn-secondary btn-sm" onclick="viewRequestDetails('${req.id}')">Details</button>`;

    return `
      <tr>
        <td><code>${req.id}</code></td>
        <td><strong>${req.clubName}</strong><br><span style="font-size:0.75rem; opacity:0.7;">${req.type}</span></td>
        <td>${req.type}</td>
        <td><code>${req.preferredDomain}</code></td>
        <td>${req.targetDate}</td>
        <td><span class="badge ${statusClass}">${req.status}</span></td>
        <td>${req.assignedDev || "<em>Unassigned</em>"}</td>
        <td>
          <div style="display:flex; gap:6px;">
            ${actionButtons}
          </div>
        </td>
      </tr>
    `;
  }).join('');

  // Display buttons for request submissions
  const actionBtnsContainer = document.getElementById("website-request-btns");
  if (actionBtnsContainer) {
    if (r === "club-president") {
      actionBtnsContainer.innerHTML = `
        <button class="btn btn-primary" onclick="openWebsiteRequestWizard()">Request Club Website</button>
        <button class="btn btn-secondary" onclick="openWebsiteRequestWizard()">Request Project Website</button>
      `;
    } else {
      actionBtnsContainer.innerHTML = "";
    }
  }

  // Render published websites directory
  const activeSites = state.getData("activeSites");
  const activeTable = document.getElementById("active-sites-table");
  if (activeTable) {
    activeTable.innerHTML = activeSites.map(s => `
      <tr>
        <td><strong>${s.club}</strong></td>
        <td><a href="https://${s.domain}" target="_blank"><code>${s.domain}</code></a></td>
        <td>${s.registrar}</td>
        <td><span class="badge badge-published">${s.ssl}</span></td>
        <td>${s.hosting}</td>
        <td>${s.expiry}</td>
        <td>${s.responsibility}</td>
      </tr>
    `).join('');
  }
}

// 4. MAINTENANCE & SUPPORT VIEW RENDERER
function renderMaintenanceAndTraining() {
  const tickets = state.getData("maintenanceTickets");
  const table = document.getElementById("maintenance-tickets-table");
  if (!table) return;
  const r = state.currentUser.role;
  const clubId = state.currentUser.club;

  // Filter tickets
  const visibleTickets = r === "club-president" ? tickets.filter(t => t.clubId === clubId) : tickets;

  table.innerHTML = visibleTickets.map(t => {
    let priorityClass = "badge-submitted";
    if (t.priority === "Urgent" || t.priority === "Critical") priorityClass = "badge-rejected";
    if (t.priority === "High") priorityClass = "badge-warning";

    let statusClass = "badge-review";
    if (t.status === "Completed" || t.status === "Closed") statusClass = "badge-published";
    if (t.status === "Work in Progress") statusClass = "badge-progress";

    return `
      <tr>
        <td><code>${t.id}</code></td>
        <td><strong>${t.clubName}</strong></td>
        <td>${t.category}</td>
        <td><span class="badge ${priorityClass}">${t.priority}</span></td>
        <td>${t.subject}</td>
        <td>${t.dateSubmitted}</td>
        <td><span class="badge ${statusClass}">${t.status}</span></td>
        <td>
          <button class="btn btn-secondary btn-sm" onclick="viewMaintenanceTicket('${t.id}')">Manage</button>
        </td>
      </tr>
    `;
  }).join('');

  // Set action buttons
  const btnContainer = document.getElementById("maintenance-request-btns");
  if (btnContainer) {
    if (r === "club-president") {
      btnContainer.innerHTML = `<button class="btn btn-primary" onclick="openMaintenanceWizard()">Submit Maintenance Ticket</button>`;
    } else {
      btnContainer.innerHTML = "";
    }
  }

  // Training Checklist state
  const checklist = JSON.parse(localStorage.getItem("trainingChecklist")) || {};
  const checklistContainer = document.getElementById("training-checklist-container");
  if (checklistContainer) {
    checklistContainer.innerHTML = `
      <div class="panel-item">
        <div style="display:flex; align-items:center; gap:10px;">
          <span style="font-size:1.2rem;">${checklist["video-orient"] ? "✅" : "❌"}</span>
          <span>Dashboard Orientation Video</span>
        </div>
      </div>
      <div class="panel-item">
        <div style="display:flex; align-items:center; gap:10px;">
          <span style="font-size:1.2rem;">${checklist["pdf-edit"] ? "✅" : "❌"}</span>
          <span>Officer Handover Manual PDF</span>
        </div>
      </div>
      <div class="panel-item">
        <div style="display:flex; align-items:center; gap:10px;">
          <span style="font-size:1.2rem;">${checklist["quiz-pass"] ? "✅" : "❌"}</span>
          <span>Branding Guidelines Quiz</span>
        </div>
      </div>
    `;
  }

  // Render Quiz Question
  renderQuiz();
}

function renderQuiz() {
  const quest = QUIZ_QUESTIONS[state.currentQuizIndex];
  const qText = document.getElementById("quiz-q-text");
  if (qText) qText.textContent = quest.q;
  const optionsList = document.getElementById("quiz-options-list");
  if (optionsList) {
    optionsList.innerHTML = quest.options.map((opt, idx) => `
      <label class="quiz-option-label">
        <input type="radio" name="quiz-ans" value="${idx}">
        <span>${opt}</span>
      </label>
    `).join('');
  }
}

// 5. PR & BRANDING GOVERNANCE VIEW RENDERER
function renderGovernanceAndBranding() {
  const r = state.currentUser.role;
  const clubId = state.currentUser.club;

  // Render Code of Conduct box
  const cocContainer = document.getElementById("coc-box-status");
  const checklist = JSON.parse(localStorage.getItem("trainingChecklist")) || {};
  const isCocSigned = checklist["quiz-pass"];
  
  if (cocContainer) {
    if (isCocSigned) {
      cocContainer.innerHTML = `
        <div style="padding:14px; background:rgba(0, 230, 118, 0.15); border:1px solid var(--success); border-radius:8px; display:flex; align-items:center; justify-content:space-between;">
          <div>
            <strong>Status: Active & Acknowledged</strong>
            <p style="font-size:0.75rem; opacity:0.8; margin-top:2px;">Your club is certified to request websites and publish marketing materials.</p>
          </div>
          <span style="font-size:1.5rem;">🛡️</span>
        </div>
      `;
    } else {
      cocContainer.innerHTML = `
        <div style="padding:14px; background:rgba(255, 23, 68, 0.15); border:1px solid var(--danger); border-radius:8px; display:flex; align-items:center; justify-content:space-between;">
          <div>
            <strong style="color:#FF8A80;">Status: Acknowledgment Pending</strong>
            <p style="font-size:0.75rem; opacity:0.8; margin-top:2px;">The club president must review guidelines and pass the technical quiz first.</p>
          </div>
          <button class="btn btn-secondary btn-sm" onclick="switchView('maintenance')">Pass Quiz</button>
        </div>
      `;
    }
  }

  // Render Branding Library Assets
  const resources = state.getData("resources");
  const resourceList = document.getElementById("pr-resources-list");
  if (resourceList) {
    resourceList.innerHTML = resources.map(res => `
      <div class="resource-card">
        <div class="resource-meta">
          <div class="resource-file-icon">${res.format}</div>
          <div>
            <span class="resource-name">${res.name}</span>
            <p class="resource-desc">${res.desc}</p>
          </div>
        </div>
        <div class="resource-footer">
          <span class="resource-size">${res.size} • ${res.category}</span>
          <button class="btn btn-secondary btn-sm" onclick="downloadAsset('${res.id}', '${res.name}')">Download</button>
        </div>
      </div>
    `).join('');
  }

  // Render Material Reviews Table
  const requests = state.getData("websiteRequests").filter(x => x.type === "Project Website" || x.type === "Club Website");
  const prReviewsTable = document.getElementById("pr-reviews-table");
  if (prReviewsTable) {
    prReviewsTable.innerHTML = requests.map(req => {
      let statusClass = "badge-review";
      if (req.status === "Published" || req.status === "Approved") statusClass = "badge-published";
      if (req.status === "Rejected") statusClass = "badge-rejected";

      return `
        <tr>
          <td><code>${req.id}-PR</code></td>
          <td><strong>${req.clubName}</strong></td>
          <td>Brand Asset Kit</td>
          <td>${req.preferredDomain} Logo Pack</td>
          <td>${req.submissionDate}</td>
          <td><span class="badge ${statusClass}">${req.status}</span></td>
          <td>Sanduni Perera</td>
          <td><button class="btn btn-secondary btn-sm" onclick="viewPRReviewDetails('${req.id}')">Evaluate</button></td>
        </tr>
      `;
    }).join('');
  }

  // Render Compliance cases
  const compliance = state.getData("complianceCases");
  const filteredCompliance = r === "club-president" ? compliance.filter(c => c.clubId === clubId) : compliance;
  const complianceTable = document.getElementById("pr-compliance-table");
  
  if (complianceTable) {
    complianceTable.innerHTML = filteredCompliance.map(c => `
      <tr>
        <td><code>${c.id}</code></td>
        <td><strong>${c.clubName}</strong></td>
        <td>${c.category}</td>
        <td><span class="badge badge-rejected">${c.severity}</span></td>
        <td>${c.deadline}</td>
        <td>${c.assignedOfficer}</td>
        <td><span class="badge badge-warning">${c.status}</span></td>
        <td><button class="btn btn-secondary btn-sm" onclick="manageComplianceCase('${c.id}')">Manage</button></td>
      </tr>
    `).join('');
  }

  // Render Emergency Notices table
  const directives = state.getData("emergencyNotices");
  const filteredDirectives = r === "club-president" ? directives.filter(d => d.clubId === clubId) : directives;
  const directivesTable = document.getElementById("pr-directives-table");

  if (directivesTable) {
    directivesTable.innerHTML = filteredDirectives.map(d => `
      <tr>
        <td><code>${d.id}</code></td>
        <td><strong>${d.clubName}</strong></td>
        <td>${d.headline}</td>
        <td><span class="badge badge-rejected">${d.severity}</span></td>
        <td>${d.dateDispatched}</td>
        <td><span class="badge ${d.acknowledged ? "badge-published" : "badge-warning"}">${d.acknowledged ? "ACKNOWLEDGED" : "PENDING"}</span></td>
        <td><button class="btn btn-secondary btn-sm" onclick="manageEmergencyNotice('${d.id}')">View</button></td>
      </tr>
    `).join('');
  }

  // Setup PR Governance Module Trigger Buttons depending on permissions
  const btns = document.getElementById("governance-actions-btns");
  if (btns) {
    if (r === "district-pr" || r === "super-admin") {
      btns.innerHTML = `
        <button class="btn btn-primary" onclick="document.getElementById('new-compliance-dialog').showModal()">Create Compliance Case</button>
        <button class="btn btn-danger" onclick="document.getElementById('new-emergency-dialog').showModal()">Dispatch Emergency Notice</button>
      `;
    } else if (r === "club-president") {
      btns.innerHTML = `<button class="btn btn-primary" onclick="openPRReviewWizard()">Submit PR Pre-Review</button>`;
    } else {
      btns.innerHTML = "";
    }
  }
}

// 6. VERIFICATION CASES VIEW RENDERER
function renderVerificationCases() {
  const cases = state.getData("verificationCases");
  const r = state.currentUser.role;
  const clubId = state.currentUser.club;
  const table = document.getElementById("verification-cases-table");
  if (!table) return;

  const visibleCases = r === "club-president" ? cases.filter(c => c.clubId === clubId) : cases;

  table.innerHTML = visibleCases.map(c => {
    let statusClass = "badge-review";
    if (c.status === "Resolved" || c.status === "Closed") statusClass = "badge-published";
    if (c.status.includes("Scheduling")) statusClass = "badge-warning";
    if (c.status.includes("Progress")) statusClass = "badge-progress";

    return `
      <tr>
        <td><code>${c.id}</code></td>
        <td><strong>${c.clubName}</strong></td>
        <td>${c.classification}</td>
        <td>${c.subject}</td>
        <td>${c.officerAssigned || "<em>Unassigned</em>"}</td>
        <td>${c.meetingDate || "<em>TBD</em>"}</td>
        <td><span class="badge ${statusClass}">${c.status}</span></td>
        <td><button class="btn btn-secondary btn-sm" onclick="viewVerificationCaseDetails('${c.id}')">Manage</button></td>
      </tr>
    `;
  }).join('');

  const btnContainer = document.getElementById("verification-action-btns");
  if (btnContainer) {
    if (r === "club-president") {
      btnContainer.innerHTML = `<button class="btn btn-primary" onclick="document.getElementById('new-verification-dialog').showModal()">File Verification Request</button>`;
    } else {
      btnContainer.innerHTML = "";
    }
  }
}

// 7. APPOINTMENTS VIEW RENDERER
function renderAppointments() {
  const bookings = state.getData("appointments");
  const r = state.currentUser.role;
  const clubId = state.currentUser.club;
  const table = document.getElementById("appointments-list-table");
  if (!table) return;

  const visibleBookings = r === "club-president" ? bookings.filter(b => b.clubId === clubId) : bookings;

  table.innerHTML = visibleBookings.map(b => {
    let statusClass = "badge-submitted";
    if (b.status === "Approved") statusClass = "badge-published";
    if (b.status === "Completed") statusClass = "badge-assigned";
    if (b.status === "Cancelled" || b.status === "Rejected") statusClass = "badge-rejected";

    return `
      <tr>
        <td><code>${b.id}</code></td>
        <td><strong>${b.clubName}</strong></td>
        <td>${b.officer}<br><span style="font-size:0.7rem; opacity:0.7;">${b.designation}</span></td>
        <td>${b.type}</td>
        <td><code>${b.dateTime}</code></td>
        <td>${b.format}</td>
        <td><span class="badge ${statusClass}">${b.status}</span></td>
        <td>
          <div style="display:flex; gap:6px;">
            ${r !== "club-president" && b.status === "Approved" ? `<button class="btn btn-success btn-sm" onclick="completeAppointment('${b.id}')">Mark Complete</button>` : ""}
            <button class="btn btn-danger btn-sm" onclick="cancelAppointment('${b.id}')">Cancel</button>
          </div>
        </td>
      </tr>
    `;
  }).join('');

  // Setup availability calendar days
  const daysContainer = document.getElementById("calendar-days-container");
  if (daysContainer) {
    daysContainer.innerHTML = "";
    
    // Fill July 2026 dates (Jul 1 is Wed)
    for (let i = 1; i <= 31; i++) {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "calendar-day-btn";
      btn.textContent = i;
      
      // De-activate weekends
      const dayOfWeek = new Date(2026, 6, i).getDay();
      if (dayOfWeek === 0 || dayOfWeek === 6) {
        btn.disabled = true;
      } else {
        btn.addEventListener("click", () => selectCalendarDate(i, btn));
      }
      daysContainer.appendChild(btn);
    }
  }

  const btnContainer = document.getElementById("appointments-action-btns");
  if (btnContainer) {
    if (r === "club-president") {
      btnContainer.innerHTML = `<button class="btn btn-primary" onclick="switchSubTab(event, 'tab-schedule-calendar'); document.querySelector('.tab-btn[onclick*=\\'tab-schedule-calendar\\']').classList.add('active'); document.querySelector('.tab-btn[onclick*=\\'tab-active-bookings\\']').classList.remove('active');">Schedule New Appointment</button>`;
    } else {
      btnContainer.innerHTML = "";
    }
  }
}

let selectedDay = null;
function selectCalendarDate(dayNum, btnElement) {
  selectedDay = dayNum;
  document.querySelectorAll(".calendar-day-btn").forEach(b => b.classList.remove("active"));
  btnElement.classList.add("active");

  // Render mock slots
  const slotsContainer = document.getElementById("calendar-slots-container");
  if (!slotsContainer) return;
  const slots = [
    { time: "09:00 AM", officer: "Sanduni Perera (District PR Team)", status: "Available" },
    { time: "10:30 AM", officer: "Naveen Alwis (District Technical Team)", status: "Available" },
    { time: "02:00 PM", officer: "Dilhara Silva (District Verification Team)", status: "Available" }
  ];

  slotsContainer.innerHTML = slots.map((s, idx) => `
    <div class="slot-item">
      <div>
        <span class="slot-time">${s.time}</span>
        <p class="slot-officer">${s.officer}</p>
      </div>
      <button class="btn btn-primary btn-sm" onclick="bookAppointmentSlot('${s.time}', '${s.officer}')">Book slot</button>
    </div>
  `).join('');
}

function bookAppointmentSlot(timeStr, officerStr) {
  if (state.currentUser.role !== "club-president") {
    showToast("Only Club Presidents are authorized to book appointments.", "danger");
    return;
  }
  
  const appointments = state.getData("appointments");
  const dateStr = `2026-07-${selectedDay < 10 ? '0' + selectedDay : selectedDay}`;
  const dateTime = `${dateStr} ${timeStr.replace(" AM", "").replace(" PM", "")}`;

  // Conflict validation: check double booking
  const conflict = appointments.find(a => a.dateTime === dateTime && a.officer.includes(officerStr.split(" ")[0]));
  if (conflict) {
    showToast("Conflict Warning: The officer is already booked for this slot.", "danger");
    return;
  }

  const newBooking = {
    id: "APT-" + (7000 + appointments.length),
    clubId: state.currentUser.club,
    clubName: state.getData("clubs").find(c => c.id === state.currentUser.club).name,
    officer: officerStr.split(" (")[0],
    designation: officerStr.split(" (")[1].replace(")", ""),
    type: "District Consultation",
    dateTime: dateTime,
    format: "Online Meeting",
    purpose: "Discuss official governance requirements.",
    status: "Approved"
  };

  appointments.unshift(newBooking);
  state.setData("appointments", appointments);
  state.logAction("Appointment Booked", newBooking.id, `Officer: ${newBooking.officer}`);
  state.addNotification(`New appointment APT-6000 scheduled with ${newBooking.officer} on ${dateTime}`);
  showToast("Appointment booked successfully!", "success");
  
  renderAppointments();
  // Switch back to bookings list sub tab
  const activeBookingsTab = document.querySelector(".tab-btn[onclick*='tab-active-bookings']");
  if (activeBookingsTab) activeBookingsTab.click();
}

// 8. INQUIRIES VIEW RENDERER
function renderInquiries() {
  const list = state.getData("inquiries");
  const r = state.currentUser.role;
  const table = document.getElementById("inquiries-inbox-table");
  if (!table) return;
  
  // Rules: Anonymous inquiries visible only to specific authorized officers
  let visibleInq = list;
  if (r === "club-president") {
    visibleInq = list.filter(i => i.sender === state.currentUser.name);
  } else if (r === "individual-leo") {
    // Guest Leo has no inbox access, can only see tab submission
    const tabInbox = document.getElementById("tab-btn-inbox");
    const tabSubmit = document.getElementById("tab-btn-submit-inquiry");
    const tabAnon = document.getElementById("tab-btn-anon-box");
    if (tabInbox) tabInbox.style.display = "none";
    if (tabSubmit) tabSubmit.style.display = "none";
    if (tabAnon) tabAnon.click();
    return;
  } else {
    // District officers can access identified inquiries. Confidential / Anonymous inquiries restricted based on role
    if (r === "district-tech") {
      visibleInq = list.filter(i => i.category === "Website support" || i.category === "General inquiry");
    } else if (r === "district-pr") {
      visibleInq = list.filter(i => i.category === "PR and branding" || i.category === "General inquiry");
    }
  }

  const tabInbox = document.getElementById("tab-btn-inbox");
  const tabSubmit = document.getElementById("tab-btn-submit-inquiry");
  if (tabInbox) tabInbox.style.display = "block";
  if (tabSubmit) tabSubmit.style.display = "block";

  table.innerHTML = visibleInq.map(i => {
    let statusClass = "badge-review";
    if (i.status === "Resolved") statusClass = "badge-published";

    return `
      <tr>
        <td><code>${i.id}</code></td>
        <td><strong>${i.sender}</strong><br><span style="font-size:0.75rem; opacity:0.7;">${i.role || "Leo"}</span></td>
        <td>${i.category}</td>
        <td>${i.subject}</td>
        <td>${i.date}</td>
        <td>${i.visibility}</td>
        <td>${i.assignedTeam}</td>
        <td><span class="badge ${statusClass}">${i.status}</span></td>
        <td>
          <button class="btn btn-secondary btn-sm" onclick="viewInquiryDetails('${i.id}')">Open</button>
        </td>
      </tr>
    `;
  }).join('');
}

// 9. AUDIT LOGS VIEW RENDERER
function renderAuditLogsTable(filterQuery = "") {
  const logs = state.getData("auditLogs");
  const tbody = document.getElementById("audit-logs-table");
  if (!tbody) return;
  
  const filtered = logs.filter(log => {
    const q = filterQuery.toLowerCase();
    return log.user.toLowerCase().includes(q) || 
           log.action.toLowerCase().includes(q) || 
           log.record.toLowerCase().includes(q) ||
           log.role.toLowerCase().includes(q);
  });

  tbody.innerHTML = filtered.map(log => `
    <tr>
      <td><code>${log.timestamp}</code></td>
      <td><strong>${log.user}</strong></td>
      <td><span style="font-size:0.75rem; text-transform:uppercase; opacity:0.8;">${log.role}</span></td>
      <td>${log.action}</td>
      <td><code>${log.record}</code></td>
      <td><span style="font-size:0.8rem; opacity:0.7;">${log.ip}</span></td>
    </tr>
  `).join('');
}

// ==========================================
// NOTIFICATIONS CONTROLLER
// ==========================================

function renderHeaderNotifications() {
  const list = state.getData("notifications");
  const container = document.getElementById("notif-list");
  if (!container) return;
  
  if (list.length === 0) {
    container.innerHTML = `<div style="font-size:0.75rem; text-align:center; padding:10px 0; opacity:0.4;">No new notifications.</div>`;
  } else {
    container.innerHTML = list.map(n => `
      <div class="sidebar-notif-item">
        <div class="sidebar-notif-dot ${n.urgent ? "urgent" : ""}"></div>
        <div class="sidebar-notif-text">
          <span>${n.text}</span>
          <span class="sidebar-notif-time">${n.date}</span>
        </div>
      </div>
    `).join('');
  }
}

function renderRightSidebar() {
  renderHeaderNotifications();
  
  // Render Activities (Audit logs timeline)
  const logs = state.getData("auditLogs").slice(0, 4); // Show top 4 logs
  const activitiesContainer = document.getElementById("sidebar-activities-list");
  if (activitiesContainer) {
    activitiesContainer.innerHTML = logs.map(log => `
      <div class="sidebar-notif-item">
        <div class="sidebar-notif-dot" style="background: var(--hyper-magenta);"></div>
        <div class="sidebar-notif-text">
          <strong style="font-size:0.75rem;">${log.action}</strong>
          <span style="opacity:0.8; font-size:0.72rem;">${log.user} (${log.role}): ${log.record}</span>
          <span class="sidebar-notif-time">${log.timestamp}</span>
        </div>
      </div>
    `).join('');
  }

  // Render Contacts
  const contactsContainer = document.getElementById("sidebar-contacts-list");
  if (contactsContainer) {
    const managers = [
      { name: "Daniel Craig", role: "District President", active: false },
      { name: "Kate Morrison", role: "District Secretary", active: false },
      { name: "Nataniel Donowan", role: "District Tech Lead", active: true },
      { name: "Elisabeth Wayne", role: "District PR Lead", active: false },
      { name: "Felicia Raspet", role: "District Verification Auditor", active: false }
    ];

    contactsContainer.innerHTML = managers.map(m => `
      <div class="contact-item ${m.active ? "active" : ""}">
        <div class="contact-left">
          <div class="contact-avatar" style="background: ${m.active ? "var(--black)" : "rgba(227,217,252,0.1)"}; color: ${m.active ? "#D0BCFC" : "var(--white)"};">${m.name.charAt(0)}</div>
          <div class="contact-info">
            <span class="contact-name">${m.name}</span>
            <span class="contact-sub">${m.role}</span>
          </div>
        </div>
        <div class="contact-actions-row">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" style="width:16px; height:16px; cursor:pointer;" onclick="showToast('Calling ${m.name}...', 'info')">
            <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.1-1.367 1.367A11.977 11.977 0 0 1 12 12c0-1.636-.546-3.146-1.467-4.356l1.367-1.367 1.1-4.423a1.106 1.106 0 0 0-1.09-1.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
          </svg>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" style="width:16px; height:16px; cursor:pointer; margin-left:4px;" onclick="showToast('Messaging ${m.name}...', 'info')">
            <path stroke-linecap="round" stroke-linejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21.75l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v5.77Z" />
          </svg>
        </div>
      </div>
    `).join('');
  }
}
