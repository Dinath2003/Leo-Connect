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
  if (!switcher) return;
  
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
  const widgetName = document.getElementById("widget-name");
  const widgetRole = document.getElementById("widget-role");
  const widgetAvatar = document.getElementById("widget-avatar");
  if (widgetName) widgetName.textContent = state.currentUser.name;
  if (widgetRole) widgetRole.textContent = state.currentUser.role.replace(/-/g, ' ');
  if (widgetAvatar) widgetAvatar.textContent = state.currentUser.name.charAt(0);

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
  if (!state.currentUser) return;
  const r = state.currentUser.role;

  // Rules: Only Super Admin and District Admin can see Admin panel
  if (r === "super-admin") {
    if (navAdmin) navAdmin.style.display = "block";
    if (navAudit) navAudit.style.display = "block";
  } else {
    if (navAdmin) navAdmin.style.display = "none";
    if (navAudit) navAudit.style.display = "none";
  }
}
