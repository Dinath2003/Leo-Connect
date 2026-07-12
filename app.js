// ==========================================
// MOCK DATA LAYER & STATE ENGINE
// ==========================================

const DEFAULT_CLUBS = [
  { id: "colombo-centennial", name: "Leo Club of Colombo Centennial", number: "LC-10243", sponsor: "Lions Club of Colombo", type: "Omega", district: "306 A1", president: "Dilan Fernando", brandingStatus: "Compliant" },
  { id: "kandy-metro", name: "Leo Club of Kandy Metro", number: "LC-20412", sponsor: "Lions Club of Kandy", type: "Omega", district: "306 C1", president: "Manuja Bandara", brandingStatus: "Warning" },
  { id: "galle-heritage", name: "Leo Club of Galle Heritage", number: "LC-30511", sponsor: "Lions Club of Galle", type: "Alpha", district: "306 A2", president: "Ishara Silva", brandingStatus: "Non-Compliant" },
  { id: "jaffna-stars", name: "Leo Club of Jaffna Stars", number: "LC-40123", sponsor: "Lions Club of Jaffna", type: "Omega", district: "306 B1", president: "K. Satheesh", brandingStatus: "Compliant" }
];

const DEFAULT_USERS = [
  { id: "usr-1", name: "Dinesh Wijesooriya", email: "dinesh.admin@leodistrict.org", club: "District Council", role: "super-admin", status: "Active" },
  { id: "usr-2", name: "Dilan Fernando", email: "dilan.pres@leocolombocentennial.org", club: "colombo-centennial", role: "club-president", status: "Active" },
  { id: "usr-3", name: "Sanduni Perera", email: "sanduni.pr@leodistrict.org", club: "District Council", role: "district-pr", status: "Active" },
  { id: "usr-4", name: "Naveen Alwis", email: "naveen.it@leodistrict.org", club: "District Council", role: "district-tech", status: "Active" },
  { id: "usr-5", name: "Dilhara Silva", email: "dilhara.verify@leodistrict.org", club: "District Council", role: "district-verification", status: "Active" }
];

const DEFAULT_RESOURCES = [
  { id: "res-1", name: "Official Leo Club Logo Pack", desc: "Approved Leo emblem vectors in PNG, JPG, and SVG format.", format: "ZIP", size: "4.2 MB", category: "Emblems" },
  { id: "res-2", name: "Lions International Brand Book", desc: "Corporate branding typography, colors, and layout guidelines.", format: "PDF", size: "12.8 MB", category: "Guides" },
  { id: "res-3", name: "Social Media Banner Template", desc: "Figma source files for club event covers and profile branding.", format: "FIGMA", size: "1.5 MB", category: "Templates" },
  { id: "res-4", name: "District Official Letterhead", desc: "Word template for official club statements and request forms.", format: "DOCX", size: "520 KB", category: "Templates" }
];

const DEFAULT_WEBSITE_REQUESTS = [
  {
    id: "REQ-1001",
    clubId: "colombo-centennial",
    clubName: "Leo Club of Colombo Centennial",
    type: "Club Website",
    preferredDomain: "colombocentennial.leoclubs.org",
    purpose: "Centralize club updates, membership registration, and showcase project highlights.",
    hosting: "District Shared Hosting",
    targetDate: "2026-08-30",
    status: "Development in Progress",
    assignedDev: "Naveen Alwis",
    submissionDate: "2026-07-02",
    logo: "colombo_cent_logo.png",
    comments: [
      { sender: "Dilan Fernando", role: "Club President", text: "Please let us know if the hosting setup is ready.", date: "2026-07-02" },
      { sender: "Naveen Alwis", role: "District Technical Team", text: "Feasibility review completed. Development repository initialized.", date: "2026-07-05" }
    ],
    stagingLink: "https://staging.colombocentennial.temp-url.com",
    qaChecks: { responsive: true, links: true, forms: false, branding: false, speed: false }
  },
  {
    id: "REQ-1002",
    clubId: "kandy-metro",
    clubName: "Leo Club of Kandy Metro",
    type: "Project Website",
    preferredDomain: "spark.leokandymetro.org",
    purpose: "Participant registration and sponsor showcase for the Annual Spark 2026 Sports Event.",
    hosting: "District Shared Hosting",
    targetDate: "2026-08-15",
    status: "Published",
    assignedDev: "Naveen Alwis",
    submissionDate: "2026-06-25",
    logo: "spark_event_logo.png",
    comments: [
      { sender: "Manuja Bandara", role: "Club President", text: "Staging links look correct, ready to publish.", date: "2026-06-28" }
    ],
    stagingLink: "https://spark-staging.leokandymetro.org",
    qaChecks: { responsive: true, links: true, forms: true, branding: true, speed: true },
    handoverAcknowledge: true
  }
];

const DEFAULT_ACTIVE_SITES = [
  { club: "Leo Club of Kandy Metro", domain: "spark.leokandymetro.org", registrar: "GoDaddy", ssl: "Active (Auto-Renew)", hosting: "District Shared Host", expiry: "2027-06-25", responsibility: "District Council" }
];

const DEFAULT_MAINTENANCE_TICKETS = [
  { id: "MNT-2001", clubId: "colombo-centennial", clubName: "Leo Club of Colombo Centennial", category: "Content update", priority: "Normal", subject: "Officer details swap", details: "Need to update Vice President profile photo on the homepage.", dateSubmitted: "2026-07-10", status: "Work in Progress", comments: [] }
];

const DEFAULT_COMPLIANCE_CASES = [
  { id: "CMP-3001", clubId: "galle-heritage", clubName: "Leo Club of Galle Heritage", category: "Incorrect logo", severity: "Level 2 — Required Change", deadline: "2026-07-20", channelUrl: "https://instagram.com/p/mock-galle-post", steps: "Remove the modified Lions emblem. Replace with the official version in Periwinkle guidelines.", assignedOfficer: "Sanduni Perera", status: "Under Review", dateLogged: "2026-07-08", responseEvidence: "", responseExplain: "" }
];

const DEFAULT_EMERGENCY_NOTICES = [
  { id: "EMG-4001", clubId: "galle-heritage", clubName: "Leo Club of Galle Heritage", headline: "IMMEDIATE TAKEDOWN: Distorted Emblems on Banner", instruction: "A secondary event flyer uses a stretched/distorted Leo emblem and incorrect corporate colors. Take it down immediately and submit correction evidence.", severity: "Level 4 — Emergency", dateDispatched: "2026-07-12", acknowledged: false, evidence: "" }
];

const DEFAULT_VERIFICATION_CASES = [
  { id: "VER-5001", clubId: "colombo-centennial", clubName: "Leo Club of Colombo Centennial", classification: "Project approval clarification", subject: "Inter-district joint service project validation", description: "Requesting district clarification and formal verification for joint project funding distribution with District 306 B2.", officerAssigned: "Dilhara Silva", meetingDate: "2026-07-15", status: "Meeting Scheduling", evidence: "proposal_doc.pdf", minutes: "", outcome: "" }
];

const DEFAULT_APPOINTMENTS = [
  { id: "APT-6001", clubId: "colombo-centennial", clubName: "Leo Club of Colombo Centennial", officer: "Sanduni Perera", designation: "District PR Team", type: "PR consultation", dateTime: "2026-07-14 10:30", format: "Online Meeting", purpose: "Review custom logo alignment guidelines before launching the project.", status: "Approved" }
];

const DEFAULT_INQUIRIES = [
  { id: "INQ-7001", sender: "Dilan Fernando", role: "Club President", category: "Finance", subject: "District dues invoice delay", message: "We haven't received the second quarter invoice for district membership dues yet. Please verify.", date: "2026-07-09", visibility: "Identified", assignedTeam: "Treasurer Office", status: "Resolved", comments: [{ sender: "District Secretary", text: "Invoice dispatched to your official club email. Let us know if you got it.", date: "2026-07-10" }] }
];

const DEFAULT_AUDIT_LOGS = [
  { timestamp: "2026-07-12 18:24:12", user: "Dinesh Wijesooriya", role: "Super Admin", action: "User Account Invitation Sent", record: "usr-2 (Dilan Fernando)", ip: "192.168.1.100" },
  { timestamp: "2026-07-12 19:05:00", user: "Sanduni Perera", role: "District PR Team", action: "Compliance notice issued", record: "CMP-3001", ip: "192.168.1.104" }
];

const DEFAULT_NOTIFICATIONS = [
  { id: "NTF-1", text: "Emergency Notice dispatch: Galle Heritage has been issued a Level 4 Takedown instruction.", date: "2026-07-12 19:10", urgent: true },
  { id: "NTF-2", text: "New website request REQ-1001 submitted by Colombo Centennial.", date: "2026-07-02 14:30", urgent: false }
];

const QUIZ_QUESTIONS = [
  { q: "What is the correct background color pairing for the Periwinkle logo?", options: ["Deep Black (#040607) or Velvet Purple (#5B2A62)", "Bright Orange or Red", "White only", "Lime Green"], correct: 0 },
  { q: "When using the Leo logo on social media, what logo safety space rule applies?", options: ["No space, overlap is allowed", "Minimum padding equal to 50% of logo width", "Minimum padding equal to 25% of the logo height around all edges", "Always cover it with a text box"], correct: 2 },
  { q: "Who is authorized to submit a final website service request?", clone: true, options: ["Club Secretary", "Club President only", "PR Officer", "Any individual Leo"], correct: 1 }
];

// ==========================================
// STATE CONTROLLER CLASS
// ==========================================

class StateEngine {
  constructor() {
    this.initDatabase();
    this.isLoggedIn = localStorage.getItem("leo_logged_in") === "true";
    this.currentUser = JSON.parse(localStorage.getItem("leo_current_user")) || null;
    this.activeView = this.isLoggedIn ? "dashboard" : "login";
    this.activeSubTabs = {};
    this.currentQuizIndex = 0;
  }

  setLoginState(isLoggedIn, userObj = null) {
    this.isLoggedIn = isLoggedIn;
    if (isLoggedIn && userObj) {
      this.currentUser = userObj;
      localStorage.setItem("leo_logged_in", "true");
      localStorage.setItem("leo_current_user", JSON.stringify(userObj));
    } else {
      this.currentUser = null;
      localStorage.removeItem("leo_logged_in");
      localStorage.removeItem("leo_current_user");
    }
  }

  initDatabase() {
    if (!localStorage.getItem("leo_db_seeded")) {
      localStorage.setItem("clubs", JSON.stringify(DEFAULT_CLUBS));
      localStorage.setItem("users", JSON.stringify(DEFAULT_USERS));
      localStorage.setItem("resources", JSON.stringify(DEFAULT_RESOURCES));
      localStorage.setItem("websiteRequests", JSON.stringify(DEFAULT_WEBSITE_REQUESTS));
      localStorage.setItem("activeSites", JSON.stringify(DEFAULT_ACTIVE_SITES));
      localStorage.setItem("maintenanceTickets", JSON.stringify(DEFAULT_MAINTENANCE_TICKETS));
      localStorage.setItem("complianceCases", JSON.stringify(DEFAULT_COMPLIANCE_CASES));
      localStorage.setItem("emergencyNotices", JSON.stringify(DEFAULT_EMERGENCY_NOTICES));
      localStorage.setItem("verificationCases", JSON.stringify(DEFAULT_VERIFICATION_CASES));
      localStorage.setItem("appointments", JSON.stringify(DEFAULT_APPOINTMENTS));
      localStorage.setItem("inquiries", JSON.stringify(DEFAULT_INQUIRIES));
      localStorage.setItem("auditLogs", JSON.stringify(DEFAULT_AUDIT_LOGS));
      localStorage.setItem("notifications", JSON.stringify(DEFAULT_NOTIFICATIONS));
      localStorage.setItem("trainingChecklist", JSON.stringify({ "video-orient": false, "pdf-edit": false, "quiz-pass": false }));
      localStorage.setItem("leo_db_seeded", "true");
    }
  }

  getData(key) {
    return JSON.parse(localStorage.getItem(key)) || [];
  }

  setData(key, val) {
    localStorage.setItem(key, JSON.stringify(val));
  }

  logAction(action, record, details = "") {
    const logs = this.getData("auditLogs");
    const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19);
    logs.unshift({
      timestamp,
      user: this.currentUser ? this.currentUser.name : "Guest/Public",
      role: this.currentUser ? this.currentUser.role : "Guest",
      action,
      record,
      ip: details || "192.168.1.101"
    });
    this.setData("auditLogs", logs);
    if (typeof renderRightSidebar === 'function') renderRightSidebar();
  }

  addNotification(text, urgent = false) {
    const list = this.getData("notifications");
    const date = new Date().toISOString().replace('T', ' ').substring(0, 16);
    list.unshift({ id: "NTF-" + Date.now(), text, date, urgent });
    this.setData("notifications", list);
    if (typeof renderRightSidebar === 'function') renderRightSidebar();
  }
}

const state = new StateEngine();

// ==========================================
// VIEW ROUTER & NAVIGATION
// ==========================================

function setupNavigation() {
  const sidebarItems = document.querySelectorAll(".nav-item");
  sidebarItems.forEach(item => {
    item.addEventListener("click", () => {
      const viewId = item.getAttribute("data-view");
      switchView(viewId);
    });
  });
}

function switchView(viewId) {
  if (!state.isLoggedIn && viewId !== "login") {
    switchView("login");
    return;
  }
  
  state.activeView = viewId;
  
  // Toggle layout sections visibility based on viewId
  const appContainer = document.getElementById("app-container");
  const loginView = document.getElementById("view-login");
  
  if (viewId === "login") {
    if (appContainer) appContainer.style.display = "none";
    if (loginView) loginView.classList.add("active");
    initLoginAnimations();
  } else {
    if (appContainer) appContainer.style.display = "flex";
    if (loginView) loginView.classList.remove("active");
    cleanupLoginAnimations();
  }

  // Update nav UI active class
  document.querySelectorAll(".nav-item").forEach(item => {
    if (item.getAttribute("data-view") === viewId) {
      item.classList.add("active");
    } else {
      item.classList.remove("active");
    }
  });

  // Toggle active view pane
  if (viewId !== "login") {
    document.querySelectorAll(".view-section").forEach(sec => {
      if (sec.id === `view-${viewId}`) {
        sec.classList.add("active");
      } else {
        sec.classList.remove("active");
      }
    });
  }

  // Update header text title
  const viewTitles = {
    dashboard: "Workspace Dashboard",
    admin: "District Administration & Rollover",
    websites: "Website & Project Requests",
    maintenance: "Maintenance Support & Training",
    governance: "PR Standards & Compliance",
    verification: "Verification & Mediation cases",
    appointments: "District Calendar Appointments",
    inquiries: "Communications Box",
    audit: "District Action Audit trail"
  };
  const titleText = document.getElementById("title-text");
  if (titleText) titleText.textContent = viewTitles[viewId] || "Leo District Platform";

  // Trigger render updates for specific views
  if (viewId !== "login") {
    renderViewData(viewId);
  }
}

function switchSubTab(event, tabContentId) {
  const tabContainer = event.currentTarget.parentElement;
  // Clear siblings
  tabContainer.querySelectorAll(".tab-btn").forEach(btn => btn.classList.remove("active"));
  event.currentTarget.classList.add("active");

  const tabContents = tabContainer.parentElement.querySelectorAll(".tab-content");
  tabContents.forEach(content => {
    if (content.id === tabContentId) {
      content.classList.add("active");
    } else {
      content.classList.remove("active");
    }
  });
}

// ==========================================
// ROLE SWITCH ENGINE
// ==========================================

function setupRoleSwitcher() {
  const switcher = document.getElementById("role-switcher");
  
  // Set default current user profile
  setUserRole(switcher.value);

  switcher.addEventListener("change", (e) => {
    setUserRole(e.target.value);
    showToast("Role switched to " + switcher.options[switcher.selectedIndex].text, "info");
  });
}

function setUserRole(roleKey) {
  const users = state.getData("users");
  
  if (roleKey === "individual-leo") {
    state.currentUser = { name: "Guest Leo / Public", role: "individual-leo", club: "None" };
  } else {
    state.currentUser = users.find(u => u.role === roleKey) || users[0];
  }

  // Update Sidebar Profile details
  document.getElementById("widget-name").textContent = state.currentUser.name;
  document.getElementById("widget-role").textContent = state.currentUser.role.replace('-', ' ');
  document.getElementById("widget-avatar").textContent = state.currentUser.name.charAt(0);

  // Update dashboard user name if present
  const dashUser = document.getElementById("dash-user-name");
  if (dashUser) dashUser.textContent = state.currentUser.name;

  // Filter navigation controls based on Role Permissions (Least Privilege Principle)
  filterSidebarItems();

  // Reset viewport to dashboard on switch
  switchView("dashboard");
}

function filterSidebarItems() {
  const navAdmin = document.getElementById("nav-admin");
  const navAudit = document.getElementById("nav-audit");
  const r = state.currentUser.role;

  // Rules: Only Super Admin and District Admin can see Admin panel
  if (r === "super-admin") {
    navAdmin.style.display = "block";
    navAudit.style.display = "block";
  } else {
    navAdmin.style.display = "none";
    navAudit.style.display = "none";
  }
}

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
              <div class="members-avatar-circle" style="background:#0066FF;">S</div>
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
  usersTable.innerHTML = users.map(u => {
    const clubObj = clubs.find(c => c.id === u.club) || { name: u.club };
    const clubName = u.club === "District Council" ? "District Council" : clubObj.name;
    return `
      <tr>
        <td><strong>${u.name}</strong></td>
        <td>${u.email}</td>
        <td>${clubName}</td>
        <td><span style="text-transform: capitalize;">${u.role.replace('-', ' ')}</span></td>
        <td><span class="badge badge-active">${u.status}</span></td>
        <td>
          <button class="btn btn-secondary btn-sm" onclick="toggleUserStatus('${u.id}')">${u.status === "Active" ? "Suspend" : "Activate"}</button>
        </td>
      </tr>
    `;
  }).join('');

  // Render clubs table
  const clubsTable = document.getElementById("admin-clubs-table");
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

  // Populate User Creation Dialog Clubs Select
  const selectClub = document.getElementById("usr-club");
  selectClub.innerHTML = `<option value="District Council">District Council</option>` + 
    clubs.map(c => `<option value="${c.id}">${c.name}</option>`).join('');
}

// 3. WEBSITE SERVICES VIEW RENDERER
function renderWebsiteRequests() {
  const reqs = state.getData("websiteRequests");
  const table = document.getElementById("website-requests-table");
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
  if (r === "club-president") {
    actionBtnsContainer.innerHTML = `
      <button class="btn btn-primary" onclick="openWebsiteRequestModal('Club Website')">Request Club Website</button>
      <button class="btn btn-secondary" onclick="openWebsiteRequestModal('Project Website')">Request Project Website</button>
    `;
  } else {
    actionBtnsContainer.innerHTML = "";
  }

  // Render published websites directory
  const activeSites = state.getData("activeSites");
  const activeTable = document.getElementById("active-sites-table");
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

// 4. MAINTENANCE & SUPPORT VIEW RENDERER
function renderMaintenanceAndTraining() {
  const tickets = state.getData("maintenanceTickets");
  const table = document.getElementById("maintenance-tickets-table");
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
  if (r === "club-president") {
    btnContainer.innerHTML = `<button class="btn btn-primary" onclick="document.getElementById('new-maintenance-dialog').showModal()">Submit Maintenance Ticket</button>`;
  } else {
    btnContainer.innerHTML = "";
  }

  // Training Checklist state
  const checklist = JSON.parse(localStorage.getItem("trainingChecklist")) || {};
  const checklistContainer = document.getElementById("training-checklist-container");
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

  // Render Quiz Question
  renderQuiz();
}

function renderQuiz() {
  const quest = QUIZ_QUESTIONS[state.currentQuizIndex];
  document.getElementById("quiz-q-text").textContent = quest.q;
  const optionsList = document.getElementById("quiz-options-list");
  optionsList.innerHTML = quest.options.map((opt, idx) => `
    <label class="quiz-option-label">
      <input type="radio" name="quiz-ans" value="${idx}">
      <span>${opt}</span>
    </label>
  `).join('');
}

// 5. PR & BRANDING GOVERNANCE VIEW RENDERER
function renderGovernanceAndBranding() {
  const r = state.currentUser.role;
  const clubId = state.currentUser.club;

  // Render Code of Conduct box
  const cocContainer = document.getElementById("coc-box-status");
  const checklist = JSON.parse(localStorage.getItem("trainingChecklist")) || {};
  const isCocSigned = checklist["quiz-pass"];
  
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

  // Render Branding Library Assets
  const resources = state.getData("resources");
  const resourceList = document.getElementById("pr-resources-list");
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

  // Render Material Reviews Table
  const requests = state.getData("websiteRequests").filter(x => x.type === "Project Website" || x.type === "Club Website");
  const prReviewsTable = document.getElementById("pr-reviews-table");
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

  // Render Compliance cases
  const compliance = state.getData("complianceCases");
  const filteredCompliance = r === "club-president" ? compliance.filter(c => c.clubId === clubId) : compliance;
  const complianceTable = document.getElementById("pr-compliance-table");
  
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

  // Render Emergency Notices table
  const directives = state.getData("emergencyNotices");
  const filteredDirectives = r === "club-president" ? directives.filter(d => d.clubId === clubId) : directives;
  const directivesTable = document.getElementById("pr-directives-table");

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

  // Setup PR Governance Module Trigger Buttons depending on permissions
  const btns = document.getElementById("governance-actions-btns");
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

// 6. VERIFICATION CASES VIEW RENDERER
function renderVerificationCases() {
  const cases = state.getData("verificationCases");
  const r = state.currentUser.role;
  const clubId = state.currentUser.club;
  const table = document.getElementById("verification-cases-table");

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
  if (r === "club-president") {
    btnContainer.innerHTML = `<button class="btn btn-primary" onclick="document.getElementById('new-verification-dialog').showModal()">File Verification Request</button>`;
  } else {
    btnContainer.innerHTML = "";
  }
}

// 7. APPOINTMENTS VIEW RENDERER
function renderAppointments() {
  const bookings = state.getData("appointments");
  const r = state.currentUser.role;
  const clubId = state.currentUser.club;
  const table = document.getElementById("appointments-list-table");

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
            ${r !== "club-president" && b.status === "Approved" ? `<button class="btn btn-success btn-sm btn-sm" onclick="completeAppointment('${b.id}')">Mark Complete</button>` : ""}
            <button class="btn btn-danger btn-sm" onclick="cancelAppointment('${b.id}')">Cancel</button>
          </div>
        </td>
      </tr>
    `;
  }).join('');

  // Setup availability calendar days
  const daysContainer = document.getElementById("calendar-days-container");
  daysContainer.innerHTML = "";
  
  // Fill July 2026 dates (Jul 1 is Wed)
  // Let's seed calendar days
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

  const btnContainer = document.getElementById("appointments-action-btns");
  if (r === "club-president") {
    btnContainer.innerHTML = `<button class="btn btn-primary" onclick="switchSubTab(event, 'tab-schedule-calendar'); document.querySelector('.tab-btn[onclick*=\\'tab-schedule-calendar\\']').classList.add('active'); document.querySelector('.tab-btn[onclick*=\\'tab-active-bookings\\']').classList.remove('active');">Schedule New Appointment</button>`;
  } else {
    btnContainer.innerHTML = "";
  }
}

let selectedDay = null;
function selectCalendarDate(dayNum, btnElement) {
  selectedDay = dayNum;
  document.querySelectorAll(".calendar-day-btn").forEach(b => b.classList.remove("active"));
  btnElement.classList.add("active");

  // Render mock slots
  const slotsContainer = document.getElementById("calendar-slots-container");
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
  document.querySelector(".tab-btn[onclick*='tab-active-bookings']").click();
}

// 8. INQUIRIES VIEW RENDERER
function renderInquiries() {
  const list = state.getData("inquiries");
  const r = state.currentUser.role;
  const table = document.getElementById("inquiries-inbox-table");
  
  // Rules: Anonymous inquiries visible only to specific authorized officers
  let visibleInq = list;
  if (r === "club-president") {
    visibleInq = list.filter(i => i.sender === state.currentUser.name);
  } else if (r === "individual-leo") {
    // Guest Leo has no inbox access, can only see tab submission
    document.getElementById("tab-btn-inbox").style.display = "none";
    document.getElementById("tab-btn-submit-inquiry").style.display = "none";
    document.getElementById("tab-btn-anon-box").click();
    return;
  } else {
    // District officers can access identified inquiries. Confidential / Anonymous inquiries restricted based on role
    // For example, Technical Team only sees technical categories unless super-admin
    if (r === "district-tech") {
      visibleInq = list.filter(i => i.category === "Website support" || i.category === "General inquiry");
    } else if (r === "district-pr") {
      visibleInq = list.filter(i => i.category === "PR and branding" || i.category === "General inquiry");
    }
  }

  document.getElementById("tab-btn-inbox").style.display = "block";
  document.getElementById("tab-btn-submit-inquiry").style.display = "block";

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
// FORM ACTION HANDLERS & LIFECYCLES
// ==========================================

// User Creation
function submitNewUser(e) {
  e.preventDefault();
  const name = document.getElementById("usr-name").value;
  const email = document.getElementById("usr-email").value;
  const club = document.getElementById("usr-club").value;
  const role = document.getElementById("usr-role").value;

  const users = state.getData("users");
  const newUser = {
    id: "usr-" + (users.length + 1),
    name,
    email,
    club,
    role,
    status: "Active"
  };

  users.push(newUser);
  state.setData("users", users);
  state.logAction("Created User Account", newUser.id, `Role: ${newUser.role}, Name: ${newUser.name}`);
  state.addNotification(`Account created for ${newUser.name} assigned to club ${newUser.club}.`);

  showToast("Account invitation dispatched successfully to " + email, "success");
  document.getElementById("new-user-dialog").close();
  document.getElementById("create-user-form").reset();
  renderAdminPanel();
}

// Toggle User Suspended status
function toggleUserStatus(userId) {
  const users = state.getData("users");
  const user = users.find(u => u.id === userId);
  if (!user) return;

  user.status = user.status === "Active" ? "Suspended" : "Active";
  state.setData("users", users);
  state.logAction(user.status === "Active" ? "Account Activated" : "Account Suspended", user.id);
  showToast(`Account status updated to ${user.status}`, "warning");
  renderAdminPanel();
}

// Website Request Submission
function openWebsiteRequestModal(type) {
  const dialog = document.getElementById("website-request-dialog");
  dialog.querySelector(".dialog-title").textContent = `Submit ${type} Request`;
  
  // Bind type to form element
  const form = document.getElementById("web-request-form");
  form.dataset.requestType = type;
  
  dialog.showModal();
}

function submitWebsiteRequest(e) {
  e.preventDefault();
  const form = document.getElementById("web-request-form");
  const type = form.dataset.requestType;
  const domain = document.getElementById("web-domain").value;
  const purpose = document.getElementById("web-purpose").value;
  const hosting = document.getElementById("web-hosting").value;
  const targetDate = document.getElementById("web-target-date").value;
  const logo = document.getElementById("web-logo").value;

  const reqs = state.getData("websiteRequests");

  // Business Rule: Prevent duplicate active requests for the same website domain
  const duplicate = reqs.find(r => r.preferredDomain === domain && r.status !== "Published" && r.status !== "Rejected" && r.status !== "Cancelled");
  if (duplicate) {
    showToast("Duplicate Request: An active website request for this domain already exists.", "danger");
    return;
  }

  const newReq = {
    id: "REQ-" + (1000 + reqs.length + 1),
    clubId: state.currentUser.club,
    clubName: state.getData("clubs").find(c => c.id === state.currentUser.club).name,
    type: type,
    preferredDomain: domain,
    purpose: purpose,
    hosting: hosting,
    targetDate: targetDate,
    status: "Submitted",
    assignedDev: "",
    submissionDate: new Date().toISOString().substring(0, 10),
    logo: logo,
    comments: [
      { sender: state.currentUser.name, role: "Club President", text: "Initial request submitted with logo and objectives.", date: new Date().toISOString().substring(0, 10) }
    ],
    stagingLink: "",
    qaChecks: { responsive: false, links: false, forms: false, branding: false, speed: false }
  };

  reqs.unshift(newReq);
  state.setData("websiteRequests", reqs);
  state.logAction("Submitted Website Request", newReq.id, `Domain: ${newReq.preferredDomain}`);
  state.addNotification(`New request ${newReq.id} submitted for ${newReq.preferredDomain}`);

  showToast("Website request submitted successfully for review!", "success");
  document.getElementById("website-request-dialog").close();
  form.reset();
  renderWebsiteRequests();
}

// Project Website Request (Alternate Form Setup)
function submitProjectRequest(e) {
  e.preventDefault();
  const title = document.getElementById("proj-title").value;
  const category = document.getElementById("proj-category").value;
  const desc = document.getElementById("proj-desc").value;
  const chair = document.getElementById("proj-chair").value;
  const subdomain = document.getElementById("proj-subdomain").value;
  const targetDate = document.getElementById("proj-target-date").value;

  const reqs = state.getData("websiteRequests");

  const newReq = {
    id: "REQ-" + (1000 + reqs.length + 1),
    clubId: state.currentUser.club,
    clubName: state.getData("clubs").find(c => c.id === state.currentUser.club).name,
    type: `Project Website (${category})`,
    preferredDomain: subdomain,
    purpose: `Project title: ${title}. Chairperson: ${chair}. Description: ${desc}`,
    hosting: "District Shared Hosting",
    targetDate: targetDate,
    status: "Submitted",
    assignedDev: "",
    submissionDate: new Date().toISOString().substring(0, 10),
    logo: "project_placeholder.png",
    comments: [
      { sender: state.currentUser.name, role: "Club President", text: `Project website request created. Chair: ${chair}.`, date: new Date().toISOString().substring(0, 10) }
    ],
    stagingLink: "",
    qaChecks: { responsive: false, links: false, forms: false, branding: false, speed: false }
  };

  reqs.unshift(newReq);
  state.setData("websiteRequests", reqs);
  state.logAction("Submitted Project Web Request", newReq.id, `Subdomain: ${newReq.preferredDomain}`);
  state.addNotification(`New project website requested: ${newReq.preferredDomain}`);

  showToast("Project website request logged successfully!", "success");
  document.getElementById("project-request-dialog").close();
  document.getElementById("proj-request-form").reset();
  renderWebsiteRequests();
}

// View and Manage Request details
function viewRequestDetails(reqId) {
  const reqs = state.getData("websiteRequests");
  const req = reqs.find(r => r.id === reqId);
  if (!req) return;

  const r = state.currentUser.role;
  const detailsTitle = document.getElementById("details-dialog-title");
  const detailsContent = document.getElementById("details-dialog-content");
  const detailsActions = document.getElementById("details-dialog-actions");

  detailsTitle.textContent = `Website Request - ${req.id}`;
  
  let qaHTML = "";
  if (req.stagingLink) {
    qaHTML = `
      <div style="margin-top:14px; padding:10px; background:rgba(73,40,194,0.1); border:1px solid var(--glass-border); border-radius:8px;">
        <strong>Staging Environment Link:</strong> <a href="${req.stagingLink}" target="_blank"><code>${req.stagingLink}</code></a>
        <div style="margin-top:10px;">
          <strong>QA Checklist Status:</strong>
          <ul style="margin-left: 20px; font-size:0.8rem; list-style-type: square; margin-top:4px;">
            <li>Mobile Responsiveness: ${req.qaChecks.responsive ? "✅ Pass" : "❌ Pending"}</li>
            <li>Browser Compatibility: ${req.qaChecks.links ? "✅ Pass" : "❌ Pending"}</li>
            <li>Forms & Inputs Verification: ${req.qaChecks.forms ? "✅ Pass" : "❌ Pending"}</li>
            <li>PR Logo Compliance: ${req.qaChecks.branding ? "✅ Pass" : "❌ Pending"}</li>
            <li>LCP Speed Optimization: ${req.qaChecks.speed ? "✅ Pass" : "❌ Pending"}</li>
          </ul>
        </div>
      </div>
    `;
  }

  detailsContent.innerHTML = `
    <div style="display:flex; flex-direction:column; gap:10px;">
      <div><strong>Organization Club:</strong> ${req.clubName}</div>
      <div><strong>Request Type:</strong> ${req.type}</div>
      <div><strong>Preferred Domain:</strong> <code>${req.preferredDomain}</code></div>
      <div><strong>Status:</strong> <span class="badge badge-assigned">${req.status}</span></div>
      <div><strong>Purpose:</strong> ${req.purpose}</div>
      <div><strong>Launch Deadline:</strong> ${req.targetDate}</div>
      <div><strong>Logo Graphic:</strong> <code>${req.logo}</code></div>
      <div><strong>Assigned Developer:</strong> ${req.assignedDev || "<em>None</em>"}</div>
      ${qaHTML}
      <div style="margin-top:10px; border-top:1px solid rgba(227,217,252,0.1); padding-top:10px;">
        <strong>History & Notes:</strong>
        <div style="max-height:120px; overflow-y:auto; font-size:0.8rem; margin-top:6px; display:flex; flex-direction:column; gap:6px;">
          ${req.comments.map(c => `
            <div style="padding:6px; background:rgba(227,217,252,0.02); border-left:2px solid var(--hyper-magenta);">
              <strong>${c.sender} (${c.role}):</strong> ${c.text} <span style="opacity:0.6; font-size:0.7rem; float:right;">${c.date}</span>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  `;

  // Action Buttons depending on role permission
  let btnsHTML = `<button type="button" class="btn btn-secondary" onclick="document.getElementById('details-view-dialog').close()">Close</button>`;

  if (r === "district-tech") {
    if (req.status === "Submitted") {
      btnsHTML += `<button type="button" class="btn btn-primary" onclick="changeRequestStatus('${req.id}', 'Feasibility Review')">Move to Feasibility Review</button>`;
    } else if (req.status === "Feasibility Review") {
      btnsHTML += `
        <button type="button" class="btn btn-success" onclick="assignDeveloperPrompt('${req.id}')">Assign to Me & Start Design</button>
      `;
    } else if (req.status === "Design in Progress") {
      btnsHTML += `<button type="button" class="btn btn-primary" onclick="changeRequestStatus('${req.id}', 'Development in Progress')">Move to Development</button>`;
    } else if (req.status === "Development in Progress") {
      btnsHTML += `<button type="button" class="btn btn-primary" onclick="setupStagingPrompt('${req.id}')">Configure Staging Link</button>`;
    } else if (req.status === "Internal Testing") {
      btnsHTML += `<button type="button" class="btn btn-primary" onclick="changeRequestStatus('${req.id}', 'PR and Branding Review')">Send to PR Branding Review</button>`;
    } else if (req.status === "PR and Branding Review") {
      btnsHTML += `<button type="button" class="btn btn-success" onclick="changeRequestStatus('${req.id}', 'Club Content Review')">Pass to Club Content Review</button>`;
    }
  } else if (r === "district-pr" && req.status === "PR and Branding Review") {
    btnsHTML += `
      <button type="button" class="btn btn-success" onclick="changeRequestStatus('${req.id}', 'Club Content Review')">Approve Branding</button>
      <button type="button" class="btn btn-danger" onclick="rejectBrandingPrompt('${req.id}')">Reject Branding</button>
    `;
  } else if (r === "club-president" && req.status === "Club Content Review") {
    btnsHTML += `
      <button type="button" class="btn btn-success" onclick="confirmHandoverPrompt('${req.id}')">Confirm Content & Accept Handover</button>
    `;
  }

  detailsActions.innerHTML = btnsHTML;
  document.getElementById("details-view-dialog").showModal();
}

function changeRequestStatus(reqId, newStatus) {
  const reqs = state.getData("websiteRequests");
  const req = reqs.find(r => r.id === reqId);
  if (!req) return;

  req.status = newStatus;
  req.comments.push({
    sender: state.currentUser.name,
    role: state.currentUser.role,
    text: `Status updated to ${newStatus}`,
    date: new Date().toISOString().substring(0, 10)
  });

  state.setData("websiteRequests", reqs);
  state.logAction("Updated Request Status", req.id, `Status: ${newStatus}`);
  state.addNotification(`Request ${req.id} transitioned to ${newStatus}`);

  showToast(`Request updated to ${newStatus}`, "info");
  document.getElementById("details-view-dialog").close();
  renderWebsiteRequests();
}

function assignDeveloperPrompt(reqId) {
  const reqs = state.getData("websiteRequests");
  const req = reqs.find(r => r.id === reqId);
  if (!req) return;

  req.assignedDev = state.currentUser.name;
  req.status = "Design in Progress";
  req.comments.push({
    sender: state.currentUser.name,
    role: state.currentUser.role,
    text: `Assigned technical development officer. Status set to Design in Progress.`,
    date: new Date().toISOString().substring(0, 10)
  });

  state.setData("websiteRequests", reqs);
  state.logAction("Assigned Developer", req.id);
  showToast("Developer assigned. Status updated.", "success");
  document.getElementById("details-view-dialog").close();
  renderWebsiteRequests();
}

function setupStagingPrompt(reqId) {
  const link = prompt("Enter the Staging Environment Web URL:", "https://colombo-centennial.staging.leoclubs.org");
  if (!link) return;

  const reqs = state.getData("websiteRequests");
  const req = reqs.find(r => r.id === reqId);
  if (!req) return;

  req.stagingLink = link;
  req.status = "Internal Testing";
  req.comments.push({
    sender: state.currentUser.name,
    role: state.currentUser.role,
    text: `Staging configured at ${link}. Initializing QA checklist audits.`,
    date: new Date().toISOString().substring(0, 10)
  });

  // Toggle checks as passed for simulation
  req.qaChecks.responsive = true;
  req.qaChecks.links = true;
  req.qaChecks.forms = true;

  state.setData("websiteRequests", reqs);
  state.logAction("Staging Link Configured", req.id);
  showToast("Staging environment uploaded.", "success");
  document.getElementById("details-view-dialog").close();
  renderWebsiteRequests();
}

function rejectBrandingPrompt(reqId) {
  const reason = prompt("Enter rejection reason and branding guideline violation notes:");
  if (!reason) return;

  const reqs = state.getData("websiteRequests");
  const req = reqs.find(r => r.id === reqId);
  if (!req) return;

  req.status = "Feasibility Review";
  req.comments.push({
    sender: state.currentUser.name,
    role: state.currentUser.role,
    text: `Branding Rejected: ${reason}`,
    date: new Date().toISOString().substring(0, 10)
  });

  state.setData("websiteRequests", reqs);
  state.logAction("PR Branding Rejected", req.id);
  state.addNotification(`PR Team rejected branding assets for request ${req.id}`);
  showToast("Branding revision notice dispatched.", "warning");
  document.getElementById("details-view-dialog").close();
  renderWebsiteRequests();
}

function confirmHandoverPrompt(reqId) {
  const reqs = state.getData("websiteRequests");
  const req = reqs.find(r => r.id === reqId);
  if (!req) return;

  req.status = "Published";
  req.comments.push({
    sender: state.currentUser.name,
    role: state.currentUser.role,
    text: `Digital Handover Acknowledged. Club President confirmed content accuracy.`,
    date: new Date().toISOString().substring(0, 10)
  });

  // Add to active sites
  const active = state.getData("activeSites");
  active.push({
    club: req.clubName,
    domain: req.preferredDomain,
    registrar: "District Registry",
    ssl: "Active (SSL Secured)",
    hosting: "District Shared Host",
    expiry: "2027-07-12",
    responsibility: "Leo Club President"
  });

  state.setData("websiteRequests", reqs);
  state.setData("activeSites", active);
  state.logAction("Handover Completed", req.id);
  state.addNotification(`Website ${req.preferredDomain} is now published and active!`);

  showToast("Congratulations! Website is now published.", "success");
  document.getElementById("details-view-dialog").close();
  renderWebsiteRequests();
}

// Support & Maintenance ticket
function submitMaintenanceTicket(e) {
  e.preventDefault();
  const category = document.getElementById("ticket-category").value;
  const priority = document.getElementById("ticket-priority").value;
  const subject = document.getElementById("ticket-subject").value;
  const details = document.getElementById("ticket-details").value;

  const tickets = state.getData("maintenanceTickets");
  const newTicket = {
    id: "MNT-" + (2000 + tickets.length + 1),
    clubId: state.currentUser.club,
    clubName: state.getData("clubs").find(c => c.id === state.currentUser.club).name,
    category,
    priority,
    subject,
    details,
    dateSubmitted: new Date().toISOString().substring(0, 10),
    status: "Submitted",
    comments: []
  };

  tickets.unshift(newTicket);
  state.setData("maintenanceTickets", tickets);
  state.logAction("Submitted Support Ticket", newTicket.id);
  state.addNotification(`New support ticket ${newTicket.id} filed by ${newTicket.clubName}`);

  showToast("Support ticket queued for review.", "success");
  document.getElementById("new-maintenance-dialog").close();
  document.getElementById("maint-ticket-form").reset();
  renderMaintenanceAndTraining();
}

function viewMaintenanceTicket(tId) {
  const tickets = state.getData("maintenanceTickets");
  const t = tickets.find(x => x.id === tId);
  if (!t) return;

  const r = state.currentUser.role;
  const detailsTitle = document.getElementById("details-dialog-title");
  const detailsContent = document.getElementById("details-dialog-content");
  const detailsActions = document.getElementById("details-dialog-actions");

  detailsTitle.textContent = `Support Ticket - ${t.id}`;
  detailsContent.innerHTML = `
    <div style="display:flex; flex-direction:column; gap:10px;">
      <div><strong>Club:</strong> ${t.clubName}</div>
      <div><strong>Category:</strong> ${t.category}</div>
      <div><strong>Priority:</strong> <span class="badge badge-rejected">${t.priority}</span></div>
      <div><strong>Subject:</strong> ${t.subject}</div>
      <div><strong>Detailed Issue:</strong> ${t.details}</div>
      <div><strong>Date Submitted:</strong> ${t.dateSubmitted}</div>
      <div><strong>Current Status:</strong> <span class="badge badge-warning">${t.status}</span></div>
    </div>
  `;

  let btnsHTML = `<button type="button" class="btn btn-secondary" onclick="document.getElementById('details-view-dialog').close()">Close</button>`;

  if (r === "district-tech" && t.status !== "Closed") {
    if (t.status === "Submitted") {
      btnsHTML += `<button type="button" class="btn btn-primary" onclick="updateTicketStatus('${t.id}', 'Work in Progress')">Accept Ticket</button>`;
    } else if (t.status === "Work in Progress") {
      btnsHTML += `<button type="button" class="btn btn-success" onclick="updateTicketStatus('${t.id}', 'Completed')">Resolve & Close</button>`;
    }
  }

  detailsActions.innerHTML = btnsHTML;
  document.getElementById("details-view-dialog").showModal();
}

function updateTicketStatus(tId, newStatus) {
  const tickets = state.getData("maintenanceTickets");
  const t = tickets.find(x => x.id === tId);
  if (!t) return;

  t.status = newStatus;
  state.setData("maintenanceTickets", tickets);
  state.logAction("Updated Ticket Status", t.id, `Status: ${newStatus}`);
  showToast(`Ticket status set to ${newStatus}`, "info");
  document.getElementById("details-view-dialog").close();
  renderMaintenanceAndTraining();
}

// PR Material Pre-Reviews
function submitPRReview(e) {
  e.preventDefault();
  const type = document.getElementById("pr-rev-type").value;
  const subject = document.getElementById("pr-rev-subject").value;
  const desc = document.getElementById("pr-rev-desc").value;
  const file = document.getElementById("pr-rev-file").value;

  const reqs = state.getData("websiteRequests");
  const newReq = {
    id: "REQ-" + (1000 + reqs.length + 1),
    clubId: state.currentUser.club,
    clubName: state.getData("clubs").find(c => c.id === state.currentUser.club).name,
    type: `Project Website`,
    preferredDomain: `flyer-review-${reqs.length + 1}.leoclubs.org`,
    purpose: `Flyer Pre-Review submission. Type: ${type}. Subject: ${subject}. Context: ${desc}`,
    hosting: "None",
    targetDate: new Date().toISOString().substring(0, 10),
    status: "PR and Branding Review",
    assignedDev: "Sanduni Perera",
    submissionDate: new Date().toISOString().substring(0, 10),
    logo: file,
    comments: [{ sender: state.currentUser.name, role: "Club PR Officer", text: "Please review logo alignment and colors.", date: new Date().toISOString().substring(0, 10) }],
    stagingLink: "",
    qaChecks: { responsive: false, links: false, forms: false, branding: false, speed: false }
  };

  reqs.unshift(newReq);
  state.setData("websiteRequests", reqs);
  state.logAction("Submitted PR Material Pre-Review", newReq.id);
  state.addNotification(`PR Pre-Review flyer requested by ${newReq.clubName}`);
  
  showToast("Flyer submitted for Pre-Review.", "success");
  document.getElementById("new-pr-review-dialog").close();
  document.getElementById("pr-review-form").reset();
  renderGovernanceAndBranding();
}

function viewPRReviewDetails(reqId) {
  viewRequestDetails(reqId);
}

// Compliance Cases Logging
function submitComplianceCase(e) {
  e.preventDefault();
  const clubId = document.getElementById("comp-club").value;
  const category = document.getElementById("comp-category").value;
  const severity = document.getElementById("comp-severity").value;
  const deadline = document.getElementById("comp-deadline").value;
  const url = document.getElementById("comp-url").value;
  const steps = document.getElementById("comp-steps").value;

  const cases = state.getData("complianceCases");
  const club = state.getData("clubs").find(c => c.id === clubId);

  // Set club status to Warning/Non-compliant
  const clubs = state.getData("clubs");
  const targetClub = clubs.find(c => c.id === clubId);
  targetClub.brandingStatus = severity.includes("Advisory") ? "Warning" : "Non-Compliant";
  state.setData("clubs", clubs);

  const newCase = {
    id: "CMP-" + (3000 + cases.length + 1),
    clubId: clubId,
    clubName: club.name,
    category,
    severity,
    deadline,
    channelUrl: url,
    steps,
    assignedOfficer: state.currentUser.name,
    status: "Under Review",
    dateLogged: new Date().toISOString().substring(0, 10),
    responseEvidence: "",
    responseExplain: ""
  };

  cases.unshift(newCase);
  state.setData("complianceCases", cases);
  state.logAction("Logged Branding Violation", newCase.id, `Club: ${newCase.clubName}`);
  state.addNotification(`PR Compliance Case ${newCase.id} opened against ${newCase.clubName}`, true);

  showToast("Compliance case filed and club status updated.", "warning");
  document.getElementById("new-compliance-dialog").close();
  document.getElementById("compliance-case-form").reset();
  renderGovernanceAndBranding();
}

function manageComplianceCase(caseId) {
  const cases = state.getData("complianceCases");
  const c = cases.find(x => x.id === caseId);
  if (!c) return;

  const r = state.currentUser.role;
  const detailsTitle = document.getElementById("details-dialog-title");
  const detailsContent = document.getElementById("details-dialog-content");
  const detailsActions = document.getElementById("details-dialog-actions");

  detailsTitle.textContent = `PR Compliance Case - ${c.id}`;
  
  let actionHTML = "";
  if (r === "club-president" && c.status !== "Closed") {
    actionHTML = `
      <div style="margin-top:14px; padding:10px; background:rgba(191,64,250,0.1); border:1px solid var(--glass-border); border-radius:8px;">
        <strong>President Correction Response Portal:</strong>
        <div class="form-group" style="margin-top:8px;">
          <label for="resp-explain">Explanation & Mitigation</label>
          <textarea id="resp-explain" placeholder="Explain steps taken to correct the violation..." required></textarea>
        </div>
        <div class="form-group">
          <label for="resp-evidence">Proof / Evidence File Name</label>
          <input type="text" id="resp-evidence" placeholder="e.g. corrected_flyer.png" required>
        </div>
        <button type="button" class="btn btn-primary btn-sm" onclick="submitCorrectionPrompt('${c.id}')">Submit Correction Proof</button>
      </div>
    `;
  }

  detailsContent.innerHTML = `
    <div style="display:flex; flex-direction:column; gap:10px;">
      <div><strong>Violating Club:</strong> ${c.clubName}</div>
      <div><strong>Issue Category:</strong> ${c.category}</div>
      <div><strong>Severity Rating:</strong> <span class="badge badge-rejected">${c.severity}</span></div>
      <div><strong>Channel Link:</strong> <a href="${c.channelUrl}" target="_blank"><code>View Publication</code></a></div>
      <div><strong>Deadline:</strong> ${c.deadline}</div>
      <div><strong>Assigned Compliance Auditor:</strong> ${c.assignedOfficer}</div>
      <div><strong>Required Correction Steps:</strong><br><p style="font-size:0.8rem; background:rgba(4,6,7,0.5); padding:8px; border-radius:6px; margin-top:4px;">${c.steps}</p></div>
      <div><strong>Case Status:</strong> <span class="badge badge-warning">${c.status}</span></div>
      ${c.responseEvidence ? `
        <div style="margin-top:10px; padding:8px; background:rgba(0,230,118,0.1); border-radius:6px;">
          <strong>Club Correction response:</strong><br>
          Explanation: ${c.responseExplain}<br>
          Evidence: <code>${c.responseEvidence}</code>
        </div>
      ` : ""}
      ${actionHTML}
    </div>
  `;

  let btnsHTML = `<button type="button" class="btn btn-secondary" onclick="document.getElementById('details-view-dialog').close()">Close</button>`;

  if ((r === "district-pr" || r === "super-admin") && c.responseEvidence && c.status !== "Closed") {
    btnsHTML += `
      <button type="button" class="btn btn-success" onclick="closeComplianceCase('${c.id}', true)">Approve Correction & Close</button>
      <button type="button" class="btn btn-danger" onclick="closeComplianceCase('${c.id}', false)">Reject Response</button>
    `;
  }

  detailsActions.innerHTML = btnsHTML;
  document.getElementById("details-view-dialog").showModal();
}

function submitCorrectionPrompt(caseId) {
  const exp = document.getElementById("resp-explain").value;
  const ev = document.getElementById("resp-evidence").value;
  if (!exp || !ev) {
    showToast("Please fill explanation and proof fields.", "danger");
    return;
  }

  const cases = state.getData("complianceCases");
  const c = cases.find(x => x.id === caseId);
  if (!c) return;

  c.responseExplain = exp;
  c.responseEvidence = ev;
  c.status = "Action Taken";
  state.setData("complianceCases", cases);
  state.logAction("Correction Response Submitted", c.id);
  state.addNotification(`Club ${c.clubName} uploaded correction evidence for case ${c.id}`);

  showToast("Correction response dispatched to PR team.", "success");
  document.getElementById("details-view-dialog").close();
  renderGovernanceAndBranding();
}

function closeComplianceCase(caseId, approved) {
  const cases = state.getData("complianceCases");
  const c = cases.find(x => x.id === caseId);
  if (!c) return;

  if (approved) {
    c.status = "Closed";
    // Restore club compliance
    const clubs = state.getData("clubs");
    const targetClub = clubs.find(cl => cl.id === c.clubId);
    targetClub.brandingStatus = "Compliant";
    state.setData("clubs", clubs);
    state.logAction("Closed Compliance Case", c.id, "Violation resolved");
    showToast("Violation case closed. Club status restored to compliant.", "success");
  } else {
    c.status = "Under Review";
    c.responseEvidence = "";
    c.responseExplain = "";
    state.logAction("Rejected Correction Evidence", c.id);
    showToast("Correction response rejected. Case remains active.", "danger");
  }

  state.setData("complianceCases", cases);
  document.getElementById("details-view-dialog").close();
  renderGovernanceAndBranding();
}

// Emergency Notices dispatch
function submitEmergencyDirective(e) {
  e.preventDefault();
  const clubId = document.getElementById("em-club").value;
  const headline = document.getElementById("em-headline").value;
  const instruction = document.getElementById("em-instruction").value;
  const severity = document.getElementById("em-severity").value;

  const list = state.getData("emergencyNotices");
  const club = state.getData("clubs").find(c => c.id === clubId);

  const newNotice = {
    id: "EMG-" + (4000 + list.length + 1),
    clubId,
    clubName: club.name,
    headline,
    instruction,
    severity,
    dateDispatched: new Date().toISOString().substring(0, 10),
    acknowledged: false,
    evidence: ""
  };

  list.unshift(newNotice);
  state.setData("emergencyNotices", list);
  state.logAction("Dispatched Emergency Notice", newNotice.id, `Headline: ${headline}`);
  state.addNotification(`🚨 EMERGENCY Notice dispatched to ${club.name}: ${headline}`, true);

  showToast("Emergency Takedown notice dispatched.", "danger");
  document.getElementById("new-emergency-dialog").close();
  document.getElementById("emergency-directive-form").reset();
  renderGovernanceAndBranding();
}

function manageEmergencyNotice(nId) {
  const list = state.getData("emergencyNotices");
  const n = list.find(x => x.id === nId);
  if (!n) return;

  const r = state.currentUser.role;
  const detailsTitle = document.getElementById("details-dialog-title");
  const detailsContent = document.getElementById("details-dialog-content");
  const detailsActions = document.getElementById("details-dialog-actions");

  detailsTitle.textContent = `Emergency PR notice - ${n.id}`;
  
  let clubInputHTML = "";
  if (r === "club-president" && !n.acknowledged) {
    clubInputHTML = `
      <div style="margin-top:14px; padding:10px; background:rgba(255,23,68,0.1); border:1px solid var(--danger); border-radius:8px;">
        <strong>Immediate Takedown Response Form:</strong>
        <div class="form-group" style="margin-top:8px;">
          <label for="em-ev-input">Proof File name confirming removal (e.g. screenshot.png)</label>
          <input type="text" id="em-ev-input" placeholder="Takedown proof filename" required>
        </div>
        <button type="button" class="btn btn-danger btn-sm" onclick="acknowledgeEmergencyNotice('${n.id}')">Submit Proof & Acknowledge Notice</button>
      </div>
    `;
  }

  detailsContent.innerHTML = `
    <div style="display:flex; flex-direction:column; gap:10px;">
      <div><strong>Target Club:</strong> ${n.clubName}</div>
      <div><strong>Directive Headline:</strong> <strong style="color:var(--danger);">${n.headline}</strong></div>
      <div><strong>Urgency:</strong> <span class="badge badge-rejected">${n.severity}</span></div>
      <div><strong>Directive instruction:</strong><br><p style="font-size:0.8rem; background:rgba(4,6,7,0.5); padding:8px; border-radius:6px; margin-top:4px;">${n.instruction}</p></div>
      <div><strong>Dispatched Timestamp:</strong> ${n.dateDispatched}</div>
      <div><strong>Acknowledge Status:</strong> ${n.acknowledged ? `✅ Confirmed Acknowledged (Evidence: <code>${n.evidence}</code>)` : "❌ Pending Club Acknowledgment"}</div>
      ${clubInputHTML}
    </div>
  `;

  let btnsHTML = `<button type="button" class="btn btn-secondary" onclick="document.getElementById('details-view-dialog').close()">Close</button>`;
  detailsActions.innerHTML = btnsHTML;
  document.getElementById("details-view-dialog").showModal();
}

function acknowledgeEmergencyNotice(nId) {
  const proof = document.getElementById("em-ev-input").value;
  if (!proof) {
    showToast("Please provide proof confirming content removal.", "danger");
    return;
  }

  const list = state.getData("emergencyNotices");
  const n = list.find(x => x.id === nId);
  if (!n) return;

  n.acknowledged = true;
  n.evidence = proof;
  state.setData("emergencyNotices", list);
  state.logAction("Acknowledged Emergency Notice", n.id);
  state.addNotification(`Club ${n.clubName} acknowledged emergency notice ${n.id}`);

  showToast("Notice acknowledged and proof submitted.", "success");
  document.getElementById("details-view-dialog").close();
  renderGovernanceAndBranding();
}

// Verification cases Requests
function submitVerificationRequest(e) {
  e.preventDefault();
  const cat = document.getElementById("ver-class").value;
  const sub = document.getElementById("ver-subject").value;
  const desc = document.getElementById("ver-desc").value;
  const evidence = document.getElementById("ver-evidence").value;

  const cases = state.getData("verificationCases");
  const newCase = {
    id: "VER-" + (5000 + cases.length + 1),
    clubId: state.currentUser.club,
    clubName: state.getData("clubs").find(c => c.id === state.currentUser.club).name,
    classification: cat,
    subject: sub,
    description: desc,
    officerAssigned: "",
    meetingDate: "",
    status: "Submitted",
    evidence,
    minutes: "",
    outcome: ""
  };

  cases.unshift(newCase);
  state.setData("verificationCases", cases);
  state.logAction("Filed Verification Request", newCase.id);
  state.addNotification(`Verification Case ${newCase.id} filed by ${newCase.clubName}`);

  showToast("Verification case submitted successfully.", "success");
  document.getElementById("new-verification-dialog").close();
  document.getElementById("verif-case-form").reset();
  renderVerificationCases();
}

function viewVerificationCaseDetails(caseId) {
  const cases = state.getData("verificationCases");
  const c = cases.find(x => x.id === caseId);
  if (!c) return;

  const r = state.currentUser.role;
  const detailsTitle = document.getElementById("details-dialog-title");
  const detailsContent = document.getElementById("details-dialog-content");
  const detailsActions = document.getElementById("details-dialog-actions");

  detailsTitle.textContent = `Verification Case - ${c.id}`;
  
  let adminInputHTML = "";
  if (r === "district-verification" && c.status !== "Resolved" && c.status !== "Closed") {
    adminInputHTML = `
      <div style="margin-top:14px; padding:10px; background:rgba(73,40,194,0.1); border:1px solid var(--glass-border); border-radius:8px;">
        <strong>Verification Action Panel:</strong>
        <div class="form-group row" style="margin-top:8px;">
          <div>
            <label for="ver-meeting-input">Schedule Meeting Date</label>
            <input type="date" id="ver-meeting-input" value="${c.meetingDate || ''}">
          </div>
          <div>
            <label for="ver-officer-input">Assign Case Officer</label>
            <input type="text" id="ver-officer-input" value="${c.officerAssigned || state.currentUser.name}">
          </div>
        </div>
        <div class="form-group">
          <label for="ver-minutes-input">Meeting Minutes Log</label>
          <textarea id="ver-minutes-input" placeholder="Type notes here...">${c.minutes || ''}</textarea>
        </div>
        <div class="form-group">
          <label for="ver-outcome-input">Verification Formal Decision Outcome</label>
          <textarea id="ver-outcome-input" placeholder="Enter case resolution decision...">${c.outcome || ''}</textarea>
        </div>
        <button type="button" class="btn btn-primary btn-sm" onclick="saveVerificationProgress('${c.id}')">Save Changes</button>
        <button type="button" class="btn btn-success btn-sm" onclick="resolveVerificationCase('${c.id}')">Resolve & Close Case</button>
      </div>
    `;
  }

  detailsContent.innerHTML = `
    <div style="display:flex; flex-direction:column; gap:10px;">
      <div><strong>Submitting Club:</strong> ${c.clubName}</div>
      <div><strong>Classification:</strong> ${c.classification}</div>
      <div><strong>Subject:</strong> ${c.subject}</div>
      <div><strong>Details:</strong> ${c.description}</div>
      <div><strong>Evidence Attached:</strong> <code>${c.evidence || 'None'}</code></div>
      <div><strong>Case Officer:</strong> ${c.officerAssigned || '<em>Unassigned</em>'}</div>
      <div><strong>Meeting Scheduled:</strong> ${c.meetingDate || '<em>Not Scheduled</em>'}</div>
      <div><strong>Current Case Status:</strong> <span class="badge badge-warning">${c.status}</span></div>
      ${c.minutes ? `<div style="margin-top:8px;"><strong>Minutes Summary:</strong><p style="font-size:0.8rem; background:rgba(4,6,7,0.5); padding:8px; border-radius:6px; margin-top:2px;">${c.minutes}</p></div>` : ""}
      ${c.outcome ? `<div style="margin-top:8px;"><strong>Decision Issued Outcome:</strong><p style="font-size:0.8rem; background:rgba(0,230,118,0.1); padding:8px; border-radius:6px; margin-top:2px;">${c.outcome}</p></div>` : ""}
      ${adminInputHTML}
    </div>
  `;

  let btnsHTML = `<button type="button" class="btn btn-secondary" onclick="document.getElementById('details-view-dialog').close()">Close</button>`;
  detailsActions.innerHTML = btnsHTML;
  document.getElementById("details-view-dialog").showModal();
}

function saveVerificationProgress(caseId) {
  const date = document.getElementById("ver-meeting-input").value;
  const off = document.getElementById("ver-officer-input").value;
  const mins = document.getElementById("ver-minutes-input").value;
  const out = document.getElementById("ver-outcome-input").value;

  const cases = state.getData("verificationCases");
  const c = cases.find(x => x.id === caseId);
  if (!c) return;

  c.meetingDate = date;
  c.officerAssigned = off;
  c.minutes = mins;
  c.outcome = out;
  if (c.status === "Submitted") c.status = "Meeting Scheduling";
  if (date && c.status === "Meeting Scheduling") c.status = "Verification in Progress";

  state.setData("verificationCases", cases);
  state.logAction("Saved Case Progress", c.id);
  showToast("Case notes updated successfully.", "success");
  document.getElementById("details-view-dialog").close();
  renderVerificationCases();
}

function resolveVerificationCase(caseId) {
  const out = document.getElementById("ver-outcome-input").value;
  if (!out) {
    showToast("Business Rule: Formal verification decision outcome must be documented before resolving case.", "danger");
    return;
  }

  const cases = state.getData("verificationCases");
  const c = cases.find(x => x.id === caseId);
  if (!c) return;

  c.outcome = out;
  c.status = "Resolved";
  state.setData("verificationCases", cases);
  state.logAction("Resolved Verification Case", c.id, `Decision: ${out}`);
  state.addNotification(`Verification Case ${c.id} resolved. Decision published.`);

  showToast("Verification case successfully resolved.", "success");
  document.getElementById("details-view-dialog").close();
  renderVerificationCases();
}

// Support / identified and anonymous inquiries
function submitInquiryForm(e, isAnonymous) {
  e.preventDefault();
  const list = state.getData("inquiries");
  
  let cat, sub, msg, club = "";
  if (isAnonymous) {
    cat = document.getElementById("inq-anon-category").value;
    sub = document.getElementById("inq-anon-subject").value;
    msg = document.getElementById("inq-anon-message").value;
    club = document.getElementById("inq-anon-club").value;
  } else {
    cat = document.getElementById("inq-id-category").value;
    sub = document.getElementById("inq-id-subject").value;
    msg = document.getElementById("inq-id-message").value;
  }

  const trackingRef = "INQ-" + (7000 + list.length + 1);
  const accessCode = Math.floor(100000 + Math.random() * 900000).toString(); // Generate secure access code

  const newInq = {
    id: trackingRef,
    sender: isAnonymous ? "Anonymous Guest" : state.currentUser.name,
    role: isAnonymous ? "None" : state.currentUser.role,
    category: cat,
    subject: sub,
    message: msg,
    date: new Date().toISOString().substring(0, 10),
    visibility: isAnonymous ? "Anonymous" : "Identified",
    assignedTeam: cat.includes("Website") ? "Technical Team" : "PR Team",
    status: "Submitted",
    comments: [],
    accessCode: isAnonymous ? accessCode : ""
  };

  list.unshift(newInq);
  state.setData("inquiries", list);
  state.logAction(isAnonymous ? "Anonymous Inquiry Filed" : "Identified Inquiry Filed", trackingRef);
  state.addNotification(`New communication inquiry ${trackingRef} logged in inbox.`);

  if (isAnonymous) {
    // Show user credentials to save!
    alert(`Confidential Inquiry Submitted!\n\nReference ID: ${trackingRef}\nAccess Code: ${accessCode}\n\nIMPORTANT: Save these details. You will need them to track responses anonymously.`);
    document.getElementById("anonymous-inquiry-form").reset();
  } else {
    showToast("Identified inquiry dispatched successfully.", "success");
    document.getElementById("identified-inquiry-form").reset();
  }

  renderInquiries();
}

function trackAnonymousInquiry(e) {
  e.preventDefault();
  const ref = document.getElementById("track-ref-id").value;
  const code = document.getElementById("track-access-code").value;

  const inquiries = state.getData("inquiries");
  const inq = inquiries.find(x => x.id === ref);

  const container = document.getElementById("anon-tracking-result");
  container.style.display = "block";

  if (!inq || inq.accessCode !== code) {
    container.innerHTML = `<div style="color:var(--danger); font-size:0.85rem; font-weight:600; padding:10px; border:1px solid rgba(255,23,68,0.2); border-radius:6px; background:rgba(255,23,68,0.05);">Invalid reference ID or secure access code. Identity authorization failed.</div>`;
    return;
  }

  // Display logs and conversation response
  container.innerHTML = `
    <div style="border:1px solid var(--glass-border); border-radius:10px; padding:12px; background:rgba(73,40,194,0.05); font-size:0.8rem;">
      <div style="display:flex; justify-content:space-between; margin-bottom:8px;">
        <strong>Reference: ${inq.id}</strong>
        <span class="badge badge-warning">${inq.status}</span>
      </div>
      <div><strong>Subject:</strong> ${inq.subject}</div>
      <div><strong>Message:</strong> ${inq.message}</div>
      <div style="margin-top:10px; border-top:1px solid rgba(227,217,252,0.1); padding-top:8px;">
        <strong>Official Response Feed:</strong>
        <div style="margin-top:6px; display:flex; flex-direction:column; gap:6px;">
          ${inq.comments.length === 0 ? "<em>No responses logged by District Officers yet.</em>" : inq.comments.map(c => `
            <div style="padding:6px; background:rgba(4,6,7,0.3); border-left:2px solid var(--hyper-magenta);">
              <strong>Officer response:</strong> ${c.text}
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  `;
}

function viewInquiryDetails(inqId) {
  const list = state.getData("inquiries");
  const inq = list.find(x => x.id === inqId);
  if (!inq) return;

  const r = state.currentUser.role;
  const detailsTitle = document.getElementById("details-dialog-title");
  const detailsContent = document.getElementById("details-dialog-content");
  const detailsActions = document.getElementById("details-dialog-actions");

  detailsTitle.textContent = `Inquiry - ${inq.id}`;
  detailsContent.innerHTML = `
    <div style="display:flex; flex-direction:column; gap:10px;">
      <div><strong>Sender:</strong> ${inq.sender}</div>
      <div><strong>Visibility:</strong> ${inq.visibility}</div>
      <div><strong>Category:</strong> ${inq.category}</div>
      <div><strong>Subject:</strong> ${inq.subject}</div>
      <div><strong>Message details:</strong> ${inq.message}</div>
      <div><strong>Date Submitted:</strong> ${inq.date}</div>
      <div><strong>Current Status:</strong> <span class="badge badge-warning">${inq.status}</span></div>
      <div style="margin-top:10px; border-top:1px solid rgba(227,217,252,0.1); padding-top:10px;">
        <strong>Discussion Log:</strong>
        <div style="max-height:100px; overflow-y:auto; font-size:0.8rem; margin-top:4px; display:flex; flex-direction:column; gap:6px;">
          ${inq.comments.map(c => `
            <div style="padding:6px; background:rgba(227,217,252,0.02); border-left:2px solid var(--hyper-magenta);">
              <strong>Officer response:</strong> ${c.text}
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  `;

  let btnsHTML = `<button type="button" class="btn btn-secondary" onclick="document.getElementById('details-view-dialog').close()">Close</button>`;

  if (r !== "club-president" && r !== "individual-leo" && inq.status !== "Resolved") {
    btnsHTML += `
      <button type="button" class="btn btn-primary" onclick="replyInquiryPrompt('${inq.id}')">Submit Response & Resolve</button>
    `;
  }

  detailsActions.innerHTML = btnsHTML;
  document.getElementById("details-view-dialog").showModal();
}

function replyInquiryPrompt(inqId) {
  const reply = prompt("Enter official response to sender:");
  if (!reply) return;

  const list = state.getData("inquiries");
  const inq = list.find(x => x.id === inqId);
  if (!inq) return;

  inq.comments.push({ sender: state.currentUser.name, text: reply, date: new Date().toISOString().substring(0, 10) });
  inq.status = "Resolved";

  state.setData("inquiries", list);
  state.logAction("Resolved Communication Inquiry", inq.id);
  showToast("Response sent and inquiry marked resolved.", "success");
  document.getElementById("details-view-dialog").close();
  renderInquiries();
}

// Annual Transition rollover
function handleTransitionYear(e) {
  e.preventDefault();
  const val = document.getElementById("transition-confirm").value;
  const targetYear = document.getElementById("new-year-input").value;

  if (val !== "CONFIRM") {
    showToast("Rollback: Type 'CONFIRM' to authorize rollover.", "danger");
    return;
  }

  // rollover users logic
  const users = state.getData("users");
  users.forEach(u => {
    if (u.role === "club-president" || u.role === "district-officer") {
      u.status = "Suspended"; // Outgoing officer deactivation
    }
  });

  // reset acknowledgments
  const checklist = { "video-orient": false, "pdf-edit": false, "quiz-pass": false };
  localStorage.setItem("trainingChecklist", JSON.stringify(checklist));

  state.setData("users", users);
  state.logAction("Leoistic Year Rollover Executed", targetYear, `Deactivated outgoing officer accounts. Rollover target: ${targetYear}`);
  state.addNotification(`Transition rollover completed. Leoistic Year updated to ${targetYear}. Outgoing officers suspended.`);

  showToast("Leoistic Year Rollover Completed successfully!", "success");
  document.getElementById("transition-form").reset();
  renderAdminPanel();
  setUserRole("super-admin"); // Auto login back as super admin
}

// Training checklist controllers
function markTrainingDone(itemKey) {
  const list = JSON.parse(localStorage.getItem("trainingChecklist")) || {};
  list[itemKey] = true;
  localStorage.setItem("trainingChecklist", JSON.stringify(list));
  
  state.logAction("Completed training module", itemKey);
  showToast("Training progress logged.", "success");
  renderMaintenanceAndTraining();
}

function submitQuiz() {
  const options = document.getElementsByName("quiz-ans");
  let selected = -1;
  for (let i = 0; i < options.length; i++) {
    if (options[i].checked) {
      selected = parseInt(options[i].value);
    }
  }

  if (selected === -1) {
    showToast("Please choose an answer option.", "warning");
    return;
  }

  const q = QUIZ_QUESTIONS[state.currentQuizIndex];
  if (selected === q.correct) {
    showToast("Correct Answer!", "success");
    if (state.currentQuizIndex < QUIZ_QUESTIONS.length - 1) {
      state.currentQuizIndex++;
      renderQuiz();
    } else {
      // Quiz complete!
      markTrainingDone("quiz-pass");
      state.currentQuizIndex = 0;
      renderQuiz();
      showToast("Branding Guidelines Quiz Passed successfully!", "success");
    }
  } else {
    showToast("Incorrect Answer. Please try again.", "danger");
  }
}

// Download assets
function downloadAsset(resId, resName) {
  state.logAction("Downloaded branding resource", resId, `Asset: ${resName}`);
  showToast(`Downloading asset: ${resName}`, "info");
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

// Clear all notifications
document.getElementById("notif-clear-btn").addEventListener("click", () => {
  state.setData("notifications", []);
  renderRightSidebar();
  showToast("Notifications cleared", "info");
});

// ==========================================
// TOAST ALERT NOTIFIER
// ==========================================

function showToast(message, type = "info") {
  const container = document.getElementById("toast-container");
  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  toast.textContent = message;
  
  container.appendChild(toast);
  
  // Auto remove
  setTimeout(() => {
    toast.style.animation = "slideInRight 0.3s reverse forwards";
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

// ==========================================
// AUDIT LOG FILTER & EXPORTS
// ==========================================

function filterAuditLogs(val) {
  renderAuditLogsTable(val);
}

function exportAuditLogs() {
  const logs = state.getData("auditLogs");
  let csv = "Timestamp,User,Role,Action,Record Affected,IP\n";
  logs.forEach(l => {
    csv += `"${l.timestamp}","${l.user}","${l.role}","${l.action}","${l.record}","${l.ip}"\n`;
  });

  const blob = new Blob([csv], { type: "text/csv" });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.setAttribute("href", url);
  a.setAttribute("download", `district_audit_logs_${new Date().toISOString().substring(0,10)}.csv`);
  a.click();
  state.logAction("Exported Audit Logs", "csv-file");
  showToast("Audit logs exported to CSV file.", "success");
}

// Cancel booking
function cancelAppointment(aptId) {
  const appointments = state.getData("appointments");
  const apt = appointments.find(a => a.id === aptId);
  if (!apt) return;

  apt.status = "Cancelled";
  state.setData("appointments", appointments);
  state.logAction("Cancelled Appointment", apt.id);
  showToast("Appointment cancelled.", "warning");
  renderAppointments();
}

function completeAppointment(aptId) {
  const appointments = state.getData("appointments");
  const apt = appointments.find(a => a.id === aptId);
  if (!apt) return;

  apt.status = "Completed";
  state.setData("appointments", appointments);
  state.logAction("Completed Appointment Meeting", apt.id);
  showToast("Appointment completed.", "success");
  renderAppointments();
}

// ==========================================
// INITIALIZATION ON LOAD
// ==========================================

window.addEventListener("DOMContentLoaded", () => {
  setupNavigation();
  setupRoleSwitcher();
  renderRightSidebar();
  
  if (state.isLoggedIn) {
    // Set simulator value
    const switcher = document.getElementById("role-switcher");
    if (switcher) switcher.value = state.currentUser.role;
    
    // Set profile widgets
    document.getElementById("widget-name").textContent = state.currentUser.name;
    document.getElementById("widget-role").textContent = state.currentUser.role.replace('-', ' ');
    document.getElementById("widget-avatar").textContent = state.currentUser.name.charAt(0);
    
    filterSidebarItems();
    switchView("dashboard");
  } else {
    switchView("login");
  }
});

// =======================================================
// PROJECT LEO LMS LOGIN VIEW CONTROLS & ANIMATIONS
// =======================================================

let tiltCleanupFn = null;
let particleCleanupFn = null;

function initLoginAnimations() {
  cleanupLoginAnimations();
  initTiltAnimation();
  initParticleAnimation();
  
  const roleButtons = document.querySelectorAll(".role-grid-btn");
  const emailInput = document.getElementById("login-email");
  const passInput = document.getElementById("login-password");
  
  roleButtons.forEach(btn => {
    btn.onclick = () => {
      roleButtons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      
      const email = btn.getAttribute("data-email");
      if (emailInput) emailInput.value = email;
      if (passInput) passInput.value = "leo123";
    };
  });

  const loginForm = document.getElementById("login-form");
  if (loginForm) {
    loginForm.onsubmit = handleLoginSubmit;
  }
}

function cleanupLoginAnimations() {
  if (tiltCleanupFn) {
    tiltCleanupFn();
    tiltCleanupFn = null;
  }
  if (particleCleanupFn) {
    particleCleanupFn();
    particleCleanupFn = null;
  }
}

function initTiltAnimation() {
  const card = document.getElementById("login-card-3d");
  const content = document.getElementById("login-content-3d");
  if (!card || !content) return;
  
  content.style.perspective = "1000px";
  content.style.perspectiveOrigin = "50% 50%";
  
  let targetRX = 0, targetRY = 0;
  let currentRX = 0, currentRY = 0;
  let isHovering = false;
  let rafId = null;

  const onMouseMove = (e) => {
    const rect = card.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) / (rect.width / 2);
    const dy = (e.clientY - cy) / (rect.height / 2);
    targetRY = dx * 14;  // max 14 deg
    targetRX = -dy * 10; // max 10 deg
    isHovering = true;
  };

  const onMouseLeave = () => {
    targetRX = 0;
    targetRY = 0;
    isHovering = false;
  };

  const springLoop = () => {
    currentRX += (targetRX - currentRX) * 0.10;
    currentRY += (targetRY - currentRY) * 0.10;
    const scale = isHovering ? 1.02 : 1.0;
    card.style.transform = `perspective(1000px) rotateX(${currentRX}deg) rotateY(${currentRY}deg) scale(${scale})`;

    const shimmer = card.querySelector(".login-card-shimmer");
    if (shimmer) {
      const shiftX = -currentRY * 3;
      const shiftY = currentRX * 3;
      shimmer.style.background = `radial-gradient(ellipse 80% 60% at ${50 + shiftX}% ${50 + shiftY}%, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0.02) 40%, transparent 70%)`;
    }

    rafId = requestAnimationFrame(springLoop);
  };

  card.addEventListener("mousemove", onMouseMove);
  card.addEventListener("mouseleave", onMouseLeave);
  springLoop();

  tiltCleanupFn = () => {
    card.removeEventListener("mousemove", onMouseMove);
    card.removeEventListener("mouseleave", onMouseLeave);
    cancelAnimationFrame(rafId);
    card.style.transform = "";
  };
}

function initParticleAnimation() {
  const canvas = document.getElementById("login-particle-canvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  let animId = null;
  let targetWind = 0;
  let wind = 0;

  const grav = {
    x: 0, y: 0,
    tx: 0, ty: 0,
    cx: 0, cy: 0,
    t: 0,
    strength: 0.012,
    orbitRX: 0, orbitRY: 0,
    cursorInfluence: 0.25
  };

  const rand = (min, max) => Math.random() * (max - min) + min;
  const randI = (min, max) => Math.floor(rand(min, max));

  const resize = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    grav.orbitRX = canvas.width * 0.32;
    grav.orbitRY = canvas.height * 0.22;
    grav.cx = canvas.width / 2;
    grav.cy = canvas.height / 2;
  };

  window.addEventListener("resize", resize);
  resize();

  const onGlobalMouseMove = (e) => {
    targetWind = ((e.clientX / window.innerWidth) - 0.5) * 2.5;
    grav.cx = e.clientX;
    grav.cy = e.clientY;
  };

  const onGlobalMouseLeave = () => {
    targetWind = 0;
    grav.cx = canvas.width / 2;
    grav.cy = canvas.height / 2;
  };

  window.addEventListener("mousemove", onGlobalMouseMove);
  window.addEventListener("mouseleave", onGlobalMouseLeave);

  class Ember {
    constructor(init = false) { this.reset(init); }
    reset(init = false) {
      const W = canvas.width, H = canvas.height;
      this.baseX = rand(0, W);
      this.x = this.baseX;
      this.y = init ? rand(H * 0.2, H) : rand(H - 40, H);
      this.size = rand(1.2, 3.8);
      this.vy = rand(-1.2, -3.2);
      this.life = 0;
      this.maxLife = randI(150, 320);
      this.alpha = 1;
      this.phase = rand(0, Math.PI * 2);
      this.frequency = rand(0.01, 0.035);
    }
    update() {
      const H = canvas.height;
      this.life++;
      this.y += this.vy;
      this.phase += this.frequency;
      const sway = Math.sin(this.phase) * 12;
      const windPush = wind * (H - this.y) * 0.45;
      this.x = this.baseX + sway + windPush;

      const dx = grav.x - this.x;
      const dy = grav.y - this.y;
      const dist = Math.sqrt(dx * dx + dy * dy) || 1;
      const pull = (grav.strength * 300) / Math.max(dist, 60);
      this.baseX += dx / dist * pull * 1.8;
      this.y += dy / dist * pull * 0.6;

      this.alpha = 1 - (this.life / this.maxLife);
      if (this.life >= this.maxLife || this.y < -10 || this.x < -10 || this.x > canvas.width + 10) this.reset();
    }
    draw() {
      const t = this.life / this.maxLife;
      const hue = t < 0.35 ? 260 : (t < 0.75 ? 275 : 290);
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${hue}, 100%, 65%, ${this.alpha})`;
      ctx.fill();
    }
  }

  class FlameBody {
    constructor(init = false) { this.reset(init); }
    reset(init = false) {
      const W = canvas.width, H = canvas.height;
      this.baseX = rand(0, W);
      this.x = this.baseX;
      this.y = init ? rand(H * 0.6, H) : rand(H - 60, H);
      this.r = rand(30, 85);
      this.vy = rand(-1.0, -2.5);
      this.life = 0;
      this.maxLife = randI(80, 160);
      this.alpha = rand(0.35, 0.65);
      this.phase = rand(0, Math.PI * 2);
      this.frequency = rand(0.01, 0.025);
    }
    update() {
      const H = canvas.height;
      this.life++;
      this.y += this.vy;
      this.phase += this.frequency;
      const sway = Math.sin(this.phase) * 18;
      const windPush = wind * (H - this.y) * 0.5;
      this.x = this.baseX + sway + windPush;

      const dx = grav.x - this.x;
      const dy = grav.y - this.y;
      const dist = Math.sqrt(dx * dx + dy * dy) || 1;
      const pull = (grav.strength * 200) / Math.max(dist, 80);
      this.baseX += dx / dist * pull * 1.2;
      this.y += dy / dist * pull * 0.4;

      const p = this.life / this.maxLife;
      this.currentR = this.r * (1 - p * 0.78);
      this.currentAlpha = this.alpha * (1 - p);
      if (this.life >= this.maxLife || this.y < H - H * 0.6 || this.x < -this.currentR || this.x > canvas.width + this.currentR) this.reset();
    }
    draw() {
      const t = this.life / this.maxLife;
      const hue = t < 0.25 ? 260 : (t < 0.60 ? 275 : 290);
      const sat = t < 0.60 ? 100 : 80;
      const light = t < 0.25 ? 60 : (t < 0.60 ? 45 : 25);
      const g = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.currentR);
      g.addColorStop(0, `hsla(${hue}, ${sat}%, ${light}%, ${this.currentAlpha * 0.55})`);
      g.addColorStop(0.35, `hsla(${hue - 15}, ${sat - 10}%, ${light - 15}%, ${this.currentAlpha * 0.25})`);
      g.addColorStop(1, `hsla(290, 80%, 25%, 0)`);
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.currentR, 0, Math.PI * 2);
      ctx.fillStyle = g;
      ctx.fill();
    }
  }

  class Comet {
    constructor(init = false) { this.reset(init); }
    reset(init = false) {
      const W = canvas.width, H = canvas.height;
      this.x = rand(W * 0.05, W * 0.95);
      this.y = init ? rand(-H, 0) : rand(-120, -20);
      const angle = rand(-0.22, 0.22);
      const speed = rand(4.5, 10);
      this.vx = Math.sin(angle) * speed;
      this.vy = Math.cos(angle) * speed;
      this.tailLen = rand(120, 280);
      this.size = rand(1.5, 3.2);
      this.alpha = rand(0.55, 0.95);
      this.life = 0;
      this.maxLife = randI(60, 140);
      this.hue = rand(255, 280);
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.life++;
      if (this.y > canvas.height + this.tailLen || this.x < -this.tailLen || this.x > canvas.width + this.tailLen || this.life > this.maxLife) {
        this.reset(false);
      }
    }
    draw() {
      const lifeFrac = this.life / this.maxLife;
      const fadeIn = Math.min(this.life / 20, 1);
      const fadeOut = lifeFrac > 0.75 ? 1 - (lifeFrac - 0.75) / 0.25 : 1;
      const opacity = this.alpha * fadeIn * fadeOut;
      if (opacity <= 0.01) return;

      const len = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
      const nx = -this.vx / len;
      const ny = -this.vy / len;
      const tx = this.x + nx * this.tailLen;
      const ty = this.y + ny * this.tailLen;

      const grad = ctx.createLinearGradient(this.x, this.y, tx, ty);
      grad.addColorStop(0, `hsla(${this.hue}, 100%, 90%, ${opacity})`);
      grad.addColorStop(0.05, `hsla(${this.hue}, 100%, 70%, ${opacity * 0.85})`);
      grad.addColorStop(0.25, `hsla(${this.hue}, 95%, 55%, ${opacity * 0.40})`);
      grad.addColorStop(0.6, `hsla(${this.hue + 10}, 80%, 35%, ${opacity * 0.12})`);
      grad.addColorStop(1, `hsla(${this.hue + 15}, 60%, 20%, 0)`);

      ctx.save();
      ctx.strokeStyle = grad;
      ctx.lineWidth = this.size * 2;
      ctx.lineCap = "round";
      ctx.shadowBlur = 14;
      ctx.shadowColor = `hsla(${this.hue}, 100%, 80%, ${opacity * 0.7})`;
      ctx.beginPath();
      ctx.moveTo(this.x, this.y);
      ctx.lineTo(tx, ty);
      ctx.stroke();
      ctx.restore();

      // Nucleus dot
      ctx.save();
      ctx.shadowBlur = 20;
      ctx.shadowColor = `hsla(${this.hue}, 100%, 90%, ${opacity})`;
      const nGrad = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size * 2.5);
      nGrad.addColorStop(0, `hsla(0, 0%, 100%, ${opacity})`);
      nGrad.addColorStop(0.4, `hsla(${this.hue}, 100%, 85%, ${opacity * 0.75})`);
      nGrad.addColorStop(1, `hsla(${this.hue}, 100%, 60%, 0)`);
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size * 2.5, 0, Math.PI * 2);
      ctx.fillStyle = nGrad;
      ctx.fill();
      ctx.restore();
    }
  }

  const embers = Array.from({ length: 90 }, () => new Ember(true));
  const flames = Array.from({ length: 30 }, () => new FlameBody(true));
  const comets = Array.from({ length: 6 }, () => new Comet(true));

  const drawBg = () => {
    const W = canvas.width, H = canvas.height;
    const g = ctx.createRadialGradient(W / 2, H, 0, W / 2, H, Math.max(W, H));
    g.addColorStop(0, "#13092A"); // deep purple core
    g.addColorStop(1, "#05020D"); // matte purple-black abyss
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);
  };

  const drawGroundGlow = () => {
    const W = canvas.width, H = canvas.height;
    const flicker = Math.sin(Date.now() * 0.006) * 0.05 + Math.cos(Date.now() * 0.013) * 0.03 + 0.95;
    const glowH = H * 0.22 * flicker;
    const g = ctx.createLinearGradient(0, H, 0, H - glowH);
    g.addColorStop(0, `hsla(260, 100%, 25%, ${0.48 * flicker})`);
    g.addColorStop(0.4, `hsla(275, 90%, 60%, ${0.16 * flicker})`);
    g.addColorStop(1, `rgba(0, 0, 0, 0)`);
    ctx.fillStyle = g;
    ctx.fillRect(0, H - glowH, W, glowH);
  };

  const drawGravityOrb = () => {
    const pulse = 0.65 + Math.sin(Date.now() * 0.004) * 0.35;
    const r = 24 + Math.sin(Date.now() * 0.007) * 6;
    
    const outer = ctx.createRadialGradient(grav.x, grav.y, 0, grav.x, grav.y, r * 3.5);
    outer.addColorStop(0, `rgba(73, 26, 177, ${0.18 * pulse})`);
    outer.addColorStop(0.5, `rgba(102, 49, 219, ${0.08 * pulse})`);
    outer.addColorStop(1, `rgba(0, 0, 0, 0)`);
    ctx.beginPath();
    ctx.arc(grav.x, grav.y, r * 3.5, 0, Math.PI * 2);
    ctx.fillStyle = outer;
    ctx.fill();

    const core = ctx.createRadialGradient(grav.x, grav.y, 0, grav.x, grav.y, r);
    core.addColorStop(0, `rgba(208, 188, 252, ${0.9 * pulse})`);
    core.addColorStop(0.3, `rgba(169, 129, 255, ${0.7 * pulse})`);
    core.addColorStop(0.7, `rgba(102, 49, 219, ${0.35 * pulse})`);
    core.addColorStop(1, `rgba(0, 0, 0, 0)`);
    ctx.beginPath();
    ctx.arc(grav.x, grav.y, r, 0, Math.PI * 2);
    ctx.fillStyle = core;
    ctx.fill();

    ctx.beginPath();
    ctx.arc(grav.x, grav.y, 3.5, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255, 255, 255, ${0.95 * pulse})`;
    ctx.shadowBlur = 14;
    ctx.shadowColor = "rgba(123, 69, 240, 0.9)";
    ctx.fill();
    ctx.shadowBlur = 0;
  };

  const updateGravityPoint = () => {
    const W = canvas.width, H = canvas.height;
    grav.t += 0.006;
    const orbitX = W / 2 + Math.cos(grav.t * 1.0) * grav.orbitRX;
    const orbitY = H / 2 + Math.sin(grav.t * 1.3) * grav.orbitRY;

    grav.tx = orbitX * (1 - grav.cursorInfluence) + grav.cx * grav.cursorInfluence;
    grav.ty = orbitY * (1 - grav.cursorInfluence) + grav.cy * grav.cursorInfluence;

    grav.x += (grav.tx - grav.x) * 0.04;
    grav.y += (grav.ty - grav.y) * 0.04;
  };

  const render = () => {
    wind += (targetWind - wind) * 0.065;
    updateGravityPoint();
    drawBg();

    ctx.save();
    ctx.globalCompositeOperation = "screen";
    comets.forEach(c => { c.update(); c.draw(); });
    ctx.restore();

    drawGravityOrb();

    ctx.save();
    ctx.globalCompositeOperation = "screen";
    flames.forEach(f => { f.update(); f.draw(); });
    embers.forEach(e => { e.update(); e.draw(); });
    ctx.restore();

    drawGroundGlow();
    animId = requestAnimationFrame(render);
  };

  render();

  particleCleanupFn = () => {
    cancelAnimationFrame(animId);
    window.removeEventListener("resize", resize);
    window.removeEventListener("mousemove", onGlobalMouseMove);
    window.removeEventListener("mouseleave", onGlobalMouseLeave);
  };
}

function handleLoginSubmit(event) {
  event.preventDefault();
  const emailInput = document.getElementById("login-email");
  const passInput = document.getElementById("login-password");
  const errorEl = document.getElementById("login-error");
  
  const email = emailInput.value.trim();
  const password = passInput.value;

  if (password !== "leo123" && password !== "admin123") {
    showLoginError("Incorrect password. Use 'leo123'.");
    return;
  }

  let loggedUser = null;
  const users = state.getData("users");
  
  if (email.toLowerCase() === "guest@leo.org") {
    loggedUser = { name: "Guest Leo / Public", role: "individual-leo", club: "None" };
  } else {
    loggedUser = users.find(u => u.email.toLowerCase() === email.toLowerCase());
  }

  if (!loggedUser) {
    const activeRoleBtn = document.querySelector(".role-grid-btn.active");
    const roleKey = activeRoleBtn ? activeRoleBtn.getAttribute("data-role") : "super-admin";
    
    if (roleKey === "individual-leo") {
      loggedUser = { name: "Guest Leo / Public", role: "individual-leo", club: "None" };
    } else {
      loggedUser = users.find(u => u.role === roleKey) || users[0];
    }
  }

  state.setLoginState(true, loggedUser);
  
  // Set simulator switcher values
  const switcher = document.getElementById("role-switcher");
  if (switcher) switcher.value = loggedUser.role;
  
  // Update sidebar profile details
  document.getElementById("widget-name").textContent = loggedUser.name;
  document.getElementById("widget-role").textContent = loggedUser.role.replace('-', ' ');
  document.getElementById("widget-avatar").textContent = loggedUser.name.charAt(0);
  
  filterSidebarItems();
  showToast(`Welcome back, ${loggedUser.name}!`, "success");
  
  switchView("dashboard");
}

function showLoginError(msg) {
  const errorEl = document.getElementById("login-error");
  if (errorEl) {
    errorEl.textContent = msg;
    errorEl.classList.add("show");
    setTimeout(() => errorEl.classList.remove("show"), 3000);
  }
}

function handleLogout() {
  state.setLoginState(false);
  switchView("login");
  showToast("You have been signed out.", "info");
}
