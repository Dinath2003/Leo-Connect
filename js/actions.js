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
  const dialog = document.getElementById("new-user-dialog");
  if (dialog) dialog.close();
  const form = document.getElementById("create-user-form");
  if (form) form.reset();
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
  if (!dialog) return;
  dialog.querySelector(".dialog-title").textContent = `Submit ${type} Request`;
  
  // Bind type to form element
  const form = document.getElementById("web-request-form");
  if (form) form.dataset.requestType = type;
  
  dialog.showModal();
}

function submitWebsiteRequest(e) {
  e.preventDefault();
  const form = document.getElementById("web-request-form");
  if (!form) return;
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
  const dialog = document.getElementById("website-request-dialog");
  if (dialog) dialog.close();
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
  const dialog = document.getElementById("project-request-dialog");
  if (dialog) dialog.close();
  const form = document.getElementById("proj-request-form");
  if (form) form.reset();
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

  if (detailsTitle) detailsTitle.textContent = `Website Request - ${req.id}`;
  
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

  if (detailsContent) {
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
  }

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

  if (detailsActions) detailsActions.innerHTML = btnsHTML;
  const dialog = document.getElementById("details-view-dialog");
  if (dialog) dialog.showModal();
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
  const dialog = document.getElementById("details-view-dialog");
  if (dialog) dialog.close();
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
  const dialog = document.getElementById("details-view-dialog");
  if (dialog) dialog.close();
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
  const dialog = document.getElementById("details-view-dialog");
  if (dialog) dialog.close();
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
  const dialog = document.getElementById("details-view-dialog");
  if (dialog) dialog.close();
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
  const dialog = document.getElementById("details-view-dialog");
  if (dialog) dialog.close();
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
  const dialog = document.getElementById("new-maintenance-dialog");
  if (dialog) dialog.close();
  const form = document.getElementById("maint-ticket-form");
  if (form) form.reset();
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

  if (detailsTitle) detailsTitle.textContent = `Support Ticket - ${t.id}`;
  if (detailsContent) {
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
  }

  let btnsHTML = `<button type="button" class="btn btn-secondary" onclick="document.getElementById('details-view-dialog').close()">Close</button>`;

  if (r === "district-tech" && t.status !== "Closed") {
    if (t.status === "Submitted") {
      btnsHTML += `<button type="button" class="btn btn-primary" onclick="updateTicketStatus('${t.id}', 'Work in Progress')">Accept Ticket</button>`;
    } else if (t.status === "Work in Progress") {
      btnsHTML += `<button type="button" class="btn btn-success" onclick="updateTicketStatus('${t.id}', 'Completed')">Resolve & Close</button>`;
    }
  }

  if (detailsActions) detailsActions.innerHTML = btnsHTML;
  const dialog = document.getElementById("details-view-dialog");
  if (dialog) dialog.showModal();
}

function updateTicketStatus(tId, newStatus) {
  const tickets = state.getData("maintenanceTickets");
  const t = tickets.find(x => x.id === tId);
  if (!t) return;

  t.status = newStatus;
  state.setData("maintenanceTickets", tickets);
  state.logAction("Updated Ticket Status", t.id, `Status: ${newStatus}`);
  showToast(`Ticket status set to ${newStatus}`, "info");
  const dialog = document.getElementById("details-view-dialog");
  if (dialog) dialog.close();
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
  const dialog = document.getElementById("new-pr-review-dialog");
  if (dialog) dialog.close();
  const form = document.getElementById("pr-review-form");
  if (form) form.reset();
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
  if (targetClub) {
    targetClub.brandingStatus = severity.includes("Advisory") ? "Warning" : "Non-Compliant";
    state.setData("clubs", clubs);
  }

  const newCase = {
    id: "CMP-" + (3000 + cases.length + 1),
    clubId: clubId,
    clubName: club ? club.name : clubId,
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
  const dialog = document.getElementById("new-compliance-dialog");
  if (dialog) dialog.close();
  const form = document.getElementById("compliance-case-form");
  if (form) form.reset();
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

  if (detailsTitle) detailsTitle.textContent = `PR Compliance Case - ${c.id}`;
  
  let actionHTML = "";
  if (r === "club-president" && c.status !== "Closed") {
    actionHTML = `
      <div style="margin-top:14px; padding:10px; background:rgba(123,69,240,0.1); border:1px solid var(--glass-border); border-radius:8px;">
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

  if (detailsContent) {
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
  }

  let btnsHTML = `<button type="button" class="btn btn-secondary" onclick="document.getElementById('details-view-dialog').close()">Close</button>`;

  if ((r === "district-pr" || r === "super-admin") && c.responseEvidence && c.status !== "Closed") {
    btnsHTML += `
      <button type="button" class="btn btn-success" onclick="closeComplianceCase('${c.id}', true)">Approve Correction & Close</button>
      <button type="button" class="btn btn-danger" onclick="closeComplianceCase('${c.id}', false)">Reject Response</button>
    `;
  }

  if (detailsActions) detailsActions.innerHTML = btnsHTML;
  const dialog = document.getElementById("details-view-dialog");
  if (dialog) dialog.showModal();
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
  const dialog = document.getElementById("details-view-dialog");
  if (dialog) dialog.close();
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
    if (targetClub) {
      targetClub.brandingStatus = "Compliant";
      state.setData("clubs", clubs);
    }
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
  const dialog = document.getElementById("details-view-dialog");
  if (dialog) dialog.close();
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
    clubName: club ? club.name : clubId,
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
  state.addNotification(`🚨 EMERGENCY Notice dispatched to ${newNotice.clubName}: ${headline}`, true);

  showToast("Emergency Takedown notice dispatched.", "danger");
  const dialog = document.getElementById("new-emergency-dialog");
  if (dialog) dialog.close();
  const form = document.getElementById("emergency-directive-form");
  if (form) form.reset();
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

  if (detailsTitle) detailsTitle.textContent = `Emergency PR notice - ${n.id}`;
  
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

  if (detailsContent) {
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
  }

  let btnsHTML = `<button type="button" class="btn btn-secondary" onclick="document.getElementById('details-view-dialog').close()">Close</button>`;
  if (detailsActions) detailsActions.innerHTML = btnsHTML;
  const dialog = document.getElementById("details-view-dialog");
  if (dialog) dialog.showModal();
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
  const dialog = document.getElementById("details-view-dialog");
  if (dialog) dialog.close();
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
  const dialog = document.getElementById("new-verification-dialog");
  if (dialog) dialog.close();
  const form = document.getElementById("verif-case-form");
  if (form) form.reset();
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

  if (detailsTitle) detailsTitle.textContent = `Verification Case - ${c.id}`;
  
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

  if (detailsContent) {
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
        ${c.outcome ? `<div style="margin-top:8px;"><strong>Decision Issued Outcome:</strong><p style="font-size:0.8rem; background:rgba(123,69,240,0.1); padding:8px; border-radius:6px; margin-top:2px;">${c.outcome}</p></div>` : ""}
        ${adminInputHTML}
      </div>
    `;
  }

  let btnsHTML = `<button type="button" class="btn btn-secondary" onclick="document.getElementById('details-view-dialog').close()">Close</button>`;
  if (detailsActions) detailsActions.innerHTML = btnsHTML;
  const dialog = document.getElementById("details-view-dialog");
  if (dialog) dialog.showModal();
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
  const dialog = document.getElementById("details-view-dialog");
  if (dialog) dialog.close();
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
  const dialog = document.getElementById("details-view-dialog");
  if (dialog) dialog.close();
  renderVerificationCases();
}

// Support / identified and anonymous inquiries
function submitInquiryForm(e, isAnonymous) {
  e.preventDefault();
  const list = state.getData("inquiries");
  
  let cat, sub, msg;
  if (isAnonymous) {
    cat = document.getElementById("inq-anon-category").value;
    sub = document.getElementById("inq-anon-subject").value;
    msg = document.getElementById("inq-anon-message").value;
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
    alert(`Confidential Inquiry Submitted!\n\nReference ID: ${trackingRef}\nAccess Code: ${accessCode}\n\nIMPORTANT: Save these details. You will need them to track responses anonymously.`);
    const form = document.getElementById("anonymous-inquiry-form");
    if (form) form.reset();
  } else {
    showToast("Identified inquiry dispatched successfully.", "success");
    const form = document.getElementById("identified-inquiry-form");
    if (form) form.reset();
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
  if (!container) return;
  container.style.display = "block";

  if (!inq || inq.accessCode !== code) {
    container.innerHTML = `<div style="color:var(--danger); font-size:0.85rem; font-weight:600; padding:10px; border:1px solid rgba(255,23,68,0.2); border-radius:6px; background:rgba(255,23,68,0.05);">Invalid reference ID or secure access code. Identity authorization failed.</div>`;
    return;
  }

  // Display logs and conversation response
  container.innerHTML = `
    <div style="border:1px solid var(--glass-border); border-radius:10px; padding:12px; background:rgba(123,69,240,0.05); font-size:0.8rem;">
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

  if (detailsTitle) detailsTitle.textContent = `Inquiry - ${inq.id}`;
  if (detailsContent) {
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
  }

  let btnsHTML = `<button type="button" class="btn btn-secondary" onclick="document.getElementById('details-view-dialog').close()">Close</button>`;

  if (r !== "club-president" && r !== "individual-leo" && inq.status !== "Resolved") {
    btnsHTML += `
      <button type="button" class="btn btn-primary" onclick="replyInquiryPrompt('${inq.id}')">Submit Response & Resolve</button>
    `;
  }

  if (detailsActions) detailsActions.innerHTML = btnsHTML;
  const dialog = document.getElementById("details-view-dialog");
  if (dialog) dialog.showModal();
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
  const dialog = document.getElementById("details-view-dialog");
  if (dialog) dialog.close();
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
  const form = document.getElementById("transition-form");
  if (form) form.reset();
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

// === REDIRECTS TO PROCESS WORKSPACE ===
function viewRequestDetails(reqId) { openProcessWorkspace('website', reqId); }
function viewMaintenanceTicket(tId) { openProcessWorkspace('maintenance', tId); }
function manageComplianceCase(caseId) { openProcessWorkspace('compliance', caseId); }
function viewVerificationCaseDetails(caseId) { openProcessWorkspace('verification', caseId); }
function viewInquiryDetails(inqId) { openProcessWorkspace('inquiry', inqId); }
function manageEmergencyNotice(nId) {
  const list = state.getData("emergencyNotices") || [];
  const notice = list.find(x => x.id === nId);
  if (notice) {
    // Find matching compliance case for this club, or default to compliance dashboard
    const compliance = state.getData("complianceCases") || [];
    const matchedCase = compliance.find(c => c.clubId === notice.clubId || c.clubName === notice.clubName);
    if (matchedCase) {
      openProcessWorkspace('compliance', matchedCase.id);
    } else {
      switchView('governance');
      showToast("Compliance case not found, opening Governance module.", "warning");
    }
  }
}

