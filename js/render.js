// ==========================================
// RENDERERS FOR VIEW DATA
// ==========================================

function renderViewData(viewId) {
  switch (viewId) {
    case "dashboard":
      renderDashboard();
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

  const requests = state.getData("websiteRequests");
  const complianceCases = state.getData("complianceCases");
  const checklist = JSON.parse(localStorage.getItem("trainingChecklist")) || {};

  // Calculate compliance progress percent
  let compliancePercent = 40;
  if (checklist["video-orient"]) compliancePercent += 20;
  if (checklist["pdf-edit"]) compliancePercent += 20;
  if (checklist["quiz-pass"]) compliancePercent += 20;

  // Filter requests based on selection
  let filteredRequests = requests;
  if (currentDashboardFilter === 'Progress') {
    filteredRequests = requests.filter(r => r.status.includes("Progress") || r.status.includes("Dev") || r.status.includes("Review"));
  } else if (currentDashboardFilter === 'Published') {
    filteredRequests = requests.filter(r => r.status === "Published");
  }

  // Draw tasks list
  let html = "";
  
  // Card 1: Dynamic Meeting review for REQ-1001
  const req1 = requests[0];
  if (req1 && (currentDashboardFilter === 'all' || currentDashboardFilter === 'Progress')) {
    html += `
      <div class="task-card-item" onclick="switchView('websites')">
        <div class="task-card-header">
          <div class="task-card-status">
            <span class="dot-blue"></span>
            <span>TODAY</span>
          </div>
          <div class="task-card-actions">
            <span style="font-size:0.75rem; color:var(--slate-blue); opacity:0.6; margin-right:4px;">${req1.id}</span>
            <span>📎</span>
            <span>•••</span>
          </div>
        </div>
        <div class="task-card-title">Staging site review: ${req1.clubName}</div>
        <div class="task-card-desc">Review preferred domain <strong>${req1.preferredDomain}</strong> and complete checklist QA check validations. Target handover: ${req1.targetDate}.</div>
        <div class="task-card-footer">
          <div class="task-card-time">
            <span>⏰ 08:00 AM - 10:00 AM</span>
          </div>
          <div class="task-card-members">
            <div class="members-avatars">
              <div class="members-avatar-circle" style="background:#7B45F0;">D</div>
              <div class="members-avatar-circle" style="background:#D0BCFC;">N</div>
              <div class="members-avatar-circle" style="background:#6631DB;">S</div>
            </div>
            <span class="members-count">+3 People</span>
          </div>
        </div>
      </div>
    `;
  }

  // Card 2: Expanded Blue Card: Main Design System/Compliance goal
  if (currentDashboardFilter === 'all') {
    html += `
      <div class="task-card-item expanded" onclick="switchView('governance')">
        <div class="task-card-header">
          <div class="task-card-status">
            <span class="dot-blue" style="background:#FFF;"></span>
            <span style="color:#FFF;">ACTIVE STANDARD</span>
          </div>
          <div class="task-card-actions" style="color:#FFF;">
            <span>📁</span>
            <span>🔔</span>
            <span>•••</span>
          </div>
        </div>
        <div class="task-card-title">Implement Official Brand Guidelines</div>
        <div class="task-card-desc">Verify that all club websites align with official corporate logo safety space bounds and typography guidelines. Passed training modules enable direct server deployment.</div>
        
        <div class="task-card-tags">
          <span class="task-tag" style="color:#FFF; background:rgba(255,255,255,0.1);">Design team</span>
          <span class="task-tag" style="color:#FFF; background:rgba(255,255,255,0.1);">PR compliance</span>
          <span class="task-tag" style="color:#FFF; background:rgba(255,255,255,0.1);">Technical team</span>
        </div>
        
        <div class="task-card-progress-row">
          <span>Progress :</span>
          <div class="task-progress-bar">
            <div class="task-progress-fill" style="width: ${compliancePercent}%;"></div>
          </div>
          <span style="font-weight:700; color:#FFF;">%${compliancePercent}</span>
        </div>
      </div>
    `;
  }

  // Card 3: Dynamic Compliance or Mediation card
  const activeCase = complianceCases[0];
  if (activeCase && (currentDashboardFilter === 'all' || currentDashboardFilter === 'Progress')) {
    html += `
      <div class="task-card-item" onclick="switchView('governance')">
        <div class="task-card-header">
          <div class="task-card-status">
            <span class="dot-blue" style="background:#EF4444;"></span>
            <span style="color:var(--danger)">URGENT AUDIT</span>
          </div>
          <div class="task-card-actions">
            <span style="font-size:0.75rem; color:var(--slate-blue); opacity:0.6; margin-right:4px;">${activeCase.id}</span>
            <span>🔔</span>
            <span>•••</span>
          </div>
        </div>
        <div class="task-card-title">Resolve branding warning: ${activeCase.clubName}</div>
        <div class="task-card-desc">Audit violation regarding <strong>${activeCase.category}</strong>. Instructed correction: <em>${activeCase.steps}</em>. Deadline: ${activeCase.deadline}.</div>
        <div class="task-card-footer">
          <div class="task-card-time">
            <span>⏰ 11:00 AM - 02:00 PM</span>
          </div>
          <div class="task-card-members">
            <div class="members-avatars">
              <div class="members-avatar-circle" style="background:#7B45F0;">S</div>
              <div class="members-avatar-circle" style="background:#D0BCFC;">D</div>
            </div>
            <span class="members-count">+2 People</span>
          </div>
        </div>
      </div>
    `;
  }

  // Fallback if list is empty
  if (html === "") {
    html = `<div class="card" style="text-align:center; padding:40px; color:var(--slate-blue);">No matching service requests found.</div>`;
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
  const resolvedTicketsCount = state.getData("maintenanceTickets").filter(x => x.status === "Completed" || x.status === "Closed").length;
  const sidebarActivityText = document.getElementById("sidebar-activity-stat-text");
  if (sidebarActivityText) {
    sidebarActivityText.textContent = `${resolvedTicketsCount} Tickets Completed`;
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
        <button class="btn btn-primary" onclick="openWebsiteRequestModal('Club Website')">Request Club Website</button>
        <button class="btn btn-secondary" onclick="openWebsiteRequestModal('Project Website')">Request Project Website</button>
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
      btnContainer.innerHTML = `<button class="btn btn-primary" onclick="document.getElementById('new-maintenance-dialog').showModal()">Submit Maintenance Ticket</button>`;
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
      btns.innerHTML = `<button class="btn btn-primary" onclick="document.getElementById('new-pr-review-dialog').showModal()">Submit PR Pre-Review</button>`;
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
