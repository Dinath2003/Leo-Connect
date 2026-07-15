// ==========================================
// PROCESS WORKSPACE CONTROLLER
// ==========================================

let activeWorkspaceRecord = null;
let activeWorkspaceType = null;
let activeWorkspaceTab = 'details';

/**
 * Open workspace for a specific process record
 * @param {'website'|'maintenance'|'compliance'|'verification'|'inquiry'|'appointment'} type
 * @param {string} recordId
 */
function openProcessWorkspace(type, recordId) {
  let record = null;
  
  if (type === 'website') {
    record = (state.getData('websiteRequests') || []).find(r => r.id === recordId);
  } else if (type === 'maintenance') {
    record = (state.getData('maintenanceTickets') || []).find(t => t.id === recordId);
  } else if (type === 'compliance') {
    record = (state.getData('complianceCases') || []).find(c => c.id === recordId);
  } else if (type === 'verification') {
    record = (state.getData('verificationCases') || []).find(c => c.id === recordId);
  } else if (type === 'inquiry') {
    record = (state.getData('inquiries') || []).find(i => i.id === recordId);
  } else if (type === 'appointment') {
    record = (state.getData('appointments') || []).find(a => a.id === recordId);
  }
  
  if (!record) {
    showToast('Record not found', 'danger');
    return;
  }
  
  activeWorkspaceRecord = record;
  activeWorkspaceType = type;
  activeWorkspaceTab = 'details';
  
  // Navigate to workspace view
  switchView('workspace');
}

/** Render workspace contents */
function renderWorkspaceView() {
  const container = document.getElementById('view-workspace');
  if (!container || !activeWorkspaceRecord) return;
  
  const rec = activeWorkspaceRecord;
  const type = activeWorkspaceType;
  const role = state.currentUser?.role;
  
  // 1. Determine timeline stages and status based on process type
  let stages = [];
  let currentStageIndex = 0;
  let statusText = rec.status || 'Active';
  let refNumber = rec.referenceNumber || rec.id;
  let title = rec.title || rec.subject || rec.preferredDomain || (type.toUpperCase() + ' Request');
  let subtitle = '';
  
  if (type === 'website') {
    stages = ['Draft', 'Submitted', 'Feasibility Review', 'Design', 'Development', 'Testing', 'PR Review', 'Club Review', 'Published'];
    // Map current status to stages index
    const stageMap = {
      'Draft': 0, 'Submitted': 1, 'Feasibility Review': 2,
      'Design in Progress': 3, 'Development in Progress': 4,
      'Internal Testing': 5, 'PR and Branding Review': 6,
      'Club Content Review': 7, 'Published': 8
    };
    currentStageIndex = stageMap[rec.status] !== undefined ? stageMap[rec.status] : 1;
    subtitle = `${rec.clubName || rec.club} • Subdomain: ${rec.preferredDomain}`;
  } else if (type === 'maintenance') {
    stages = ['Submitted', 'Triage', 'Assigned', 'Work in Progress', 'Resolved', 'Closed'];
    const stageMap = {
      'Submitted': 0, 'Triage': 1, 'Assigned': 2,
      'Work in Progress': 3, 'Resolved': 4, 'Closed': 5
    };
    currentStageIndex = stageMap[rec.status] !== undefined ? stageMap[rec.status] : 0;
    subtitle = `Site: ${rec.website} • Category: ${rec.category}`;
  } else if (type === 'compliance') {
    stages = ['Issued', 'Acknowledged', 'Action Taken', 'Under Review', 'Closed'];
    const stageMap = {
      'Issued': 0, 'Acknowledged': 1, 'Action Taken': 2, 'Under Review': 3, 'Closed': 4
    };
    currentStageIndex = stageMap[rec.status] !== undefined ? stageMap[rec.status] : 0;
    subtitle = `${rec.clubName || rec.club} • Violation: ${rec.category}`;
  } else if (type === 'verification') {
    stages = ['Filed', 'Team Assigned', 'Evidence Collection', 'Meeting Scheduled', 'Meeting Held', 'Decision', 'Closed'];
    const stageMap = {
      'Filed': 0, 'Team Assigned': 1, 'Evidence Collection': 2,
      'Meeting Scheduled': 3, 'Meeting Held': 4, 'Decision': 5, 'Closed': 6
    };
    currentStageIndex = stageMap[rec.status] !== undefined ? stageMap[rec.status] : 0;
    subtitle = `Classification: ${rec.classification}`;
  } else if (type === 'inquiry') {
    stages = ['Submitted', 'Under Review', 'Action Taken', 'Response Provided', 'Closed'];
    const stageMap = {
      'Submitted': 0, 'Under Review': 1, 'Action Taken': 2, 'Response Provided': 3, 'Closed': 4
    };
    currentStageIndex = stageMap[rec.status] !== undefined ? stageMap[rec.status] : 0;
    subtitle = `Category: ${rec.category} • ${rec.isAnonymous ? '🔒 Anonymous Submission' : '👤 Identified Submission'}`;
  } else if (type === 'appointment') {
    stages = ['Requested', 'Confirmed', 'Rescheduled', 'Completed', 'Cancelled'];
    const stageMap = {
      'Requested': 0, 'Confirmed': 1, 'Rescheduled': 2, 'Completed': 3, 'Cancelled': 4
    };
    currentStageIndex = stageMap[rec.status] !== undefined ? stageMap[rec.status] : 0;
    subtitle = `District Portfolio: ${rec.portfolio} • Format: ${rec.format}`;
  }

  // 2. Build Sticky Process Header HTML
  let headerHTML = `
    <div class="process-header">
      <div class="process-header-top">
        <div>
          <span class="process-header-ref">${refNumber}</span>
          <h1 class="process-header-title">${sanitizeHTML(title)}</h1>
          <p style="font-size:0.75rem; color:var(--slate-blue); margin-top:2px;">${sanitizeHTML(subtitle)}</p>
        </div>
        <div style="display:flex; gap:10px; align-items:center;">
          ${getStatusBadge(statusText)}
          <button class="btn btn-secondary btn-sm" onclick="switchView('${type === 'website' ? 'websites' : type === 'compliance' ? 'governance' : type + 's'}')">← Return</button>
        </div>
      </div>
  `;
  
  // Add Timeline Stages Indicator
  headerHTML += `<div class="process-timeline">`;
  stages.forEach((stage, idx) => {
    let cls = 'upcoming';
    if (idx < currentStageIndex) cls = 'completed';
    else if (idx === currentStageIndex) cls = 'current';
    
    // Check if delayed
    if (rec.timeline && rec.timeline[idx]?.delayed) cls += ' delayed';
    
    const dateStr = rec.timeline && rec.timeline[idx]?.date ? formatDate(rec.timeline[idx].date) : '';
    const delayNote = rec.timeline && rec.timeline[idx]?.delayReason ? `<div class="timeline-delay-note">${sanitizeHTML(rec.timeline[idx].delayReason)}</div>` : '';
    
    headerHTML += `
      <div class="timeline-stage ${cls}" onclick="showStageNotes(${idx})">
        <div class="timeline-dot">${cls === 'completed' ? '✓' : idx + 1}</div>
        <div class="timeline-label">${stage}</div>
        ${dateStr ? `<div class="timeline-date">${dateStr}</div>` : ''}
        ${delayNote}
      </div>
    `;
  });
  headerHTML += `</div></div>`;

  // 3. Build Smart Action Panel HTML
  let actionPanelHTML = renderSmartActionPanel(type, rec, role);

  // 4. Build Workspace Tabs Nav HTML
  const tabs = [
    { id: 'details', label: 'Details & Checkpoints' },
    { id: 'discussion', label: `Discussion (${(rec.comments || []).length})` },
    { id: 'files', label: `Files` },
    { id: 'approvals', label: 'Approvals & Sign-off' },
    { id: 'history', label: 'History Feed' }
  ];
  
  let tabsNavHTML = `<div class="workspace-tabs">`;
  tabs.forEach(t => {
    const activeCls = activeWorkspaceTab === t.id ? 'active' : '';
    tabsNavHTML += `<button class="workspace-tab ${activeCls}" onclick="switchWorkspaceTab('${t.id}')">${t.label}</button>`;
  });
  tabsNavHTML += `</div>`;

  // 5. Build Workspace Tab Content HTML
  let tabContentHTML = '';
  if (activeWorkspaceTab === 'details') {
    tabContentHTML = renderWorkspaceDetailsTab(type, rec);
  } else if (activeWorkspaceTab === 'discussion') {
    tabContentHTML = renderWorkspaceDiscussionTab(rec);
  } else if (activeWorkspaceTab === 'files') {
    tabContentHTML = renderWorkspaceFilesTab(rec);
  } else if (activeWorkspaceTab === 'approvals') {
    tabContentHTML = renderWorkspaceApprovalsTab(type, rec);
  } else if (activeWorkspaceTab === 'history') {
    tabContentHTML = renderWorkspaceHistoryTab(rec);
  }

  // 6. Assemble everything
  container.innerHTML = `
    ${headerHTML}
    ${actionPanelHTML}
    ${tabsNavHTML}
    <div class="workspace-tab-content active">
      ${tabContentHTML}
    </div>
  `;
}

/** Switch active workspace tab */
function switchWorkspaceTab(tabId) {
  activeWorkspaceTab = tabId;
  renderWorkspaceView();
}

/** Render stage details/notes */
function showStageNotes(stageIdx) {
  if (!activeWorkspaceRecord || !activeWorkspaceRecord.timeline) return;
  const stage = activeWorkspaceRecord.timeline[stageIdx];
  if (stage) {
    alert(`Stage: ${stage.stage}\nDate: ${formatDateTime(stage.date)}\nCompleted By: ${stage.completedBy || 'System'}\nNotes: ${stage.notes || 'No extra notes provided.'}`);
  } else {
    showToast('Stage is not completed yet.', 'info');
  }
}

/** Render Smart Action Panel based on role and record status */
function renderSmartActionPanel(type, rec, role) {
  let title = 'Action Required';
  let desc = 'Please perform the next step for this process.';
  let buttons = '';
  let panelCls = '';

  if (type === 'website') {
    if (rec.status === 'Submitted') {
      if (role === 'super-admin' || role === 'district-tech') {
        title = 'Accept Website Request';
        desc = 'Please accept this website request and assign it to a developer to proceed.';
        buttons = `
          <button class="btn btn-primary btn-sm" onclick="assignWebsiteRequest('${rec.id}')">Accept & Assign Me</button>
          <button class="btn btn-secondary btn-sm" onclick="rejectWebsiteRequest('${rec.id}')" style="color:var(--danger);">Reject Request</button>
        `;
        panelCls = 'urgent';
      } else {
        title = 'Awaiting Feasibility Review';
        desc = 'The District Council Technical Team is currently evaluating your domain availability and server hosting resource constraints.';
        panelCls = 'no-action';
      }
    } else if (rec.status === 'Feasibility Review') {
      if (role === 'district-tech') {
        title = 'Feasibility Checklist';
        desc = 'Verify subdomain availability and set up DNS configurations. Once verified, move to design.';
        buttons = `<button class="btn btn-primary btn-sm" onclick="updateWebsiteStatus('${rec.id}', 'Design in Progress')">Approve & Start Design</button>`;
      } else {
        title = 'Feasibility Verification';
        desc = 'District technical team is reviewing hosting requirements.';
        panelCls = 'no-action';
      }
    } else if (rec.status === 'Design in Progress') {
      if (role === 'district-tech') {
        title = 'Upload Site Design Mockup';
        desc = 'Upload visual wireframe mockup of pages and request club feedback.';
        buttons = `<button class="btn btn-primary btn-sm" onclick="updateWebsiteStatus('${rec.id}', 'Development in Progress')">Complete Design & Start Dev</button>`;
      } else {
        title = 'Design Phase';
        desc = 'Mockups are being finalized. Technical team will update when ready for review.';
        panelCls = 'no-action';
      }
    } else if (rec.status === 'Development in Progress') {
      if (role === 'district-tech') {
        title = 'Development in Pipeline';
        desc = 'Develop site structure. Deploy staging link and launch automated tests when completed.';
        buttons = `
          <button class="btn btn-primary btn-sm" onclick="promptStagingLink('${rec.id}')">Set Staging Link</button>
          <button class="btn btn-success btn-sm" onclick="updateWebsiteStatus('${rec.id}', 'Internal Testing')">Send to Testing QA</button>
        `;
      } else {
        title = 'Site Construction';
        desc = 'Developer is coding pages. Staging environment will be ready soon.';
        panelCls = 'no-action';
      }
    } else if (rec.status === 'Internal Testing') {
      if (role === 'district-tech') {
        title = 'Run QA Checklist';
        desc = 'Verify all pages pass browser accessibility and speed metrics before submitting for PR branding review.';
        buttons = `<button class="btn btn-primary btn-sm" onclick="updateWebsiteStatus('${rec.id}', 'PR and Branding Review')">Submit to PR Review</button>`;
      } else {
        title = 'Quality Assurance Tests';
        desc = 'Automated and manual accessibility tests are verifying responsive design compliance.';
        panelCls = 'no-action';
      }
    } else if (rec.status === 'PR and Branding Review') {
      if (role === 'district-pr' || role === 'super-admin') {
        title = 'Audit Branding Compliance';
        desc = 'Review typography, spacing, logo files. Clear for Club Review if compliant.';
        buttons = `
          <button class="btn btn-success btn-sm" onclick="approveBrandingCompliance('${rec.id}')">Approve Branding</button>
          <button class="btn btn-danger btn-sm" onclick="requestBrandingCorrection('${rec.id}')">Request Corrections</button>
        `;
        panelCls = 'urgent';
      } else {
        title = 'PR Branding Audit';
        desc = 'District PR team is checking logo usage and guidelines compliance.';
        panelCls = 'no-action';
      }
    } else if (rec.status === 'Club Content Review') {
      if (role === 'club-president') {
        title = 'Verify Staging & Acknowledge Handover';
        desc = 'Review the staging site layout. If fully satisfied, approve publication and sign off website handover.';
        buttons = `
          <button class="btn btn-primary btn-sm" onclick="acknowledgeWebsiteHandover('${rec.id}')">Approve & Publish</button>
          <button class="btn btn-secondary btn-sm" onclick="requestWebsiteRevision('${rec.id}')">Request Revisions</button>
        `;
        panelCls = 'urgent';
      } else {
        title = 'Club Review Pending';
        desc = 'The Club President is reviewing staging pages and verifying details.';
        panelCls = 'no-action';
      }
    } else if (rec.status === 'Published') {
      title = 'Website Live 🟢';
      desc = 'This website has been launched successfully and handed over to the club.';
      buttons = `<button class="btn btn-secondary btn-sm" onclick="window.open('https://${rec.preferredDomain || rec.domain}', '_blank')">Visit Site 🌐</button>`;
      panelCls = 'no-action';
    }
  } else if (type === 'maintenance') {
    if (rec.status === 'Submitted') {
      if (role === 'district-tech' || role === 'super-admin') {
        title = 'Triage Ticket';
        desc = 'Accept this support ticket and update priority.';
        buttons = `<button class="btn btn-primary btn-sm" onclick="updateMaintenanceStatus('${rec.id}', 'Work in Progress')">Accept & Start Work</button>`;
        panelCls = 'urgent';
      } else {
        title = 'Ticket Triage';
        desc = 'Technical team is evaluating support request priority.';
        panelCls = 'no-action';
      }
    } else if (rec.status === 'Work in Progress') {
      if (role === 'district-tech') {
        title = 'Resolve Support Ticket';
        desc = 'Close ticket once issue is resolved on staging/live server.';
        buttons = `<button class="btn btn-success btn-sm" onclick="updateMaintenanceStatus('${rec.id}', 'Resolved')">Mark Resolved</button>`;
      } else {
        title = 'Resolution in Progress';
        desc = 'Technical developer is fixing the error.';
        panelCls = 'no-action';
      }
    } else if (rec.status === 'Resolved') {
      if (role === 'club-president') {
        title = 'Confirm Resolution';
        desc = 'Verify the issue has been resolved. Close ticket to complete.';
        buttons = `<button class="btn btn-primary btn-sm" onclick="updateMaintenanceStatus('${rec.id}', 'Closed')">Confirm & Close Ticket</button>`;
        panelCls = 'urgent';
      } else {
        title = 'Awaiting Confirmation';
        desc = 'Club president is validating the fix.';
        panelCls = 'no-action';
      }
    } else if (rec.status === 'Closed') {
      title = 'Ticket Closed';
      desc = 'This support request has been completed successfully.';
      panelCls = 'no-action';
    }
  } else if (type === 'compliance') {
    if (rec.status === 'Issued') {
      if (role === 'club-president') {
        title = 'Acknowledge Directive Notice';
        desc = 'Acknowledge receipt of this branding warning directive. Correct the violation before the deadline.';
        buttons = `<button class="btn btn-primary btn-sm" onclick="updateComplianceStatus('${rec.id}', 'Acknowledged')">Acknowledge Notice</button>`;
        panelCls = 'emergency';
      } else {
        title = 'Directive Issued';
        desc = 'Awaiting club president acknowledgment.';
        panelCls = 'no-action';
      }
    } else if (rec.status === 'Acknowledged') {
      if (role === 'club-president') {
        title = 'Submit Proof of Correction';
        desc = 'Submit correction evidence and upload proof (images, links) for PR review.';
        buttons = `<button class="btn btn-success btn-sm" onclick="submitComplianceEvidencePrompt('${rec.id}')">Submit Evidence</button>`;
        panelCls = 'urgent';
      } else {
        title = 'Awaiting Evidence';
        desc = 'Club is correcting branding elements according to instructions.';
        panelCls = 'no-action';
      }
    } else if (rec.status === 'Action Taken') {
      if (role === 'district-pr' || role === 'super-admin') {
        title = 'Review Evidence';
        desc = 'Verify uploaded images align with guidelines and close case.';
        buttons = `
          <button class="btn btn-success btn-sm" onclick="updateComplianceStatus('${rec.id}', 'Closed')">Approve & Close Case</button>
          <button class="btn btn-danger btn-sm" onclick="updateComplianceStatus('${rec.id}', 'Acknowledged')">Reject Evidence</button>
        `;
        panelCls = 'urgent';
      } else {
        title = 'Evidence Under Review';
        desc = 'District PR team is checking the corrected materials.';
        panelCls = 'no-action';
      }
    } else if (rec.status === 'Closed') {
      title = 'Compliance Met';
      desc = 'Branding requirements resolved. Case closed.';
      panelCls = 'no-action';
    }
  } else if (type === 'verification') {
    if (rec.status === 'Filed') {
      if (role === 'super-admin' || role === 'district-verification') {
        title = 'Assign Case Officer';
        desc = 'Assign a verification officer to begin investigation and schedule mediation.';
        buttons = `<button class="btn btn-primary btn-sm" onclick="assignVerificationOfficer('${rec.id}')">Assign Case to Me</button>`;
        panelCls = 'urgent';
      } else {
        title = 'Case Received';
        desc = 'Mediation committee is review case classification.';
        panelCls = 'no-action';
      }
    } else if (rec.status === 'Team Assigned') {
      if (role === 'district-verification') {
        title = 'Collect Evidence';
        desc = 'Request files, statements, or testimonials from parties.';
        buttons = `<button class="btn btn-primary btn-sm" onclick="updateVerificationStatus('${rec.id}', 'Evidence Collection')">Start Evidence Collection</button>`;
      } else {
        title = 'Officer Assigned';
        desc = 'Investigating officer is reviewing filed documentation.';
        panelCls = 'no-action';
      }
    } else if (rec.status === 'Evidence Collection') {
      if (role === 'district-verification') {
        title = 'Schedule Mediation Meeting';
        desc = 'Book calendar appointment slot for mediation discussion.';
        buttons = `<button class="btn btn-primary btn-sm" onclick="promptScheduleMediationMeeting('${rec.id}')">Schedule Mediation</button>`;
      } else {
        title = 'Evidence Collection Phase';
        desc = 'Parties are submitting statements. Confidential logs restricted.';
        panelCls = 'no-action';
      }
    } else if (rec.status === 'Meeting Scheduled') {
      if (role === 'district-verification') {
        title = 'Complete Mediation Meeting';
        desc = 'Log meeting decisions and minutes into case files.';
        buttons = `<button class="btn btn-success btn-sm" onclick="completeMediationMeetingPrompt('${rec.id}')">Mark Meeting Held</button>`;
      } else {
        title = 'Mediation Meeting Scheduled';
        desc = 'Meeting date set. Verify details in calendar.';
        panelCls = 'no-action';
      }
    } else if (rec.status === 'Meeting Held' || rec.status === 'Decision') {
      if (role === 'district-verification') {
        title = 'Issue Decisions & Close';
        desc = 'Submit action decisions and resolve case file.';
        buttons = `<button class="btn btn-primary btn-sm" onclick="updateVerificationStatus('${rec.id}', 'Closed')">Submit Outcome & Close Case</button>`;
      } else {
        title = 'Decision Made';
        desc = 'Outcome decision logged. Awaiting final closure.';
        panelCls = 'no-action';
      }
    } else if (rec.status === 'Closed') {
      title = 'Case Resolved';
      desc = 'Mediation concluded and action implemented.';
      panelCls = 'no-action';
    }
  }

  // Generate container
  let urgencyCls = panelCls ? ` ${panelCls}` : '';
  return `
    <div class="smart-action-panel${urgencyCls}">
      <div class="smart-action-title">✨ ${sanitizeHTML(title)}</div>
      <div class="smart-action-desc">${sanitizeHTML(desc)}</div>
      ${buttons ? `<div class="smart-action-buttons">${buttons}</div>` : ''}
    </div>
  `;
}

/** Render details tab fields */
function renderWorkspaceDetailsTab(type, rec) {
  let html = `<div style="display:grid; grid-template-columns: 1.2fr 0.8fr; gap:20px;">`;
  
  // Left Column - Form Fields
  let fieldsHTML = `<div class="card">`;
  fieldsHTML += `<h3 style="font-family:var(--font-display); font-size:0.95rem; font-weight:700; margin-bottom:16px; border-bottom:1px solid var(--glass-border); padding-bottom:8px;">Process Details</h3>`;
  
  if (type === 'website') {
    fieldsHTML += `
      <div style="display:flex; flex-direction:column; gap:12px; font-size:0.82rem;">
        <div><strong>Requested Subdomain:</strong> <code>${rec.preferredDomain || rec.domain}</code></div>
        <div><strong>Purpose:</strong> ${sanitizeHTML(rec.purpose)}</div>
        <div><strong>Target Launch:</strong> ${formatDate(rec.targetLaunchDate || rec.targetDate)}</div>
        <div><strong>Hosting Plan:</strong> ${rec.hosting || 'District Shared Hosting'}</div>
        <div><strong>Pages:</strong> ${Array.isArray(rec.pages) ? rec.pages.join(', ') : 'Home, About, Projects'}</div>
        <div><strong>Features:</strong> ${Array.isArray(rec.features) ? rec.features.join(', ') : 'Contact form, gallery'}</div>
        ${rec.stagingLink ? `<div><strong>Staging Link:</strong> <a href="${rec.stagingLink}" target="_blank"><code>${rec.stagingLink}</code></a></div>` : ''}
      </div>
    `;
  } else if (type === 'maintenance') {
    fieldsHTML += `
      <div style="display:flex; flex-direction:column; gap:12px; font-size:0.82rem;">
        <div><strong>Website Domain:</strong> <code>${rec.website}</code></div>
        <div><strong>Issue Category:</strong> ${rec.category}</div>
        <div><strong>Priority:</strong> ${getPriorityIndicator(rec.priority)}</div>
        <div><strong>Summary:</strong> ${sanitizeHTML(rec.subject)}</div>
        <div><strong>Details:</strong> ${sanitizeHTML(rec.details)}</div>
        <div><strong>Date Submitted:</strong> ${formatDate(rec.dateSubmitted)}</div>
      </div>
    `;
  } else if (type === 'compliance') {
    const cd = calculateCountdown(rec.deadline);
    const urgencyText = cd.expired ? 'EXPIRED' : `${cd.days}d ${cd.hours}h remaining`;
    fieldsHTML += `
      <div style="display:flex; flex-direction:column; gap:12px; font-size:0.82rem;">
        <div><strong>Violation Category:</strong> ${rec.category}</div>
        <div><strong>Severity:</strong> ${getPriorityIndicator(rec.severity)}</div>
        <div><strong>Correction Directive:</strong> ${sanitizeHTML(rec.steps)}</div>
        <div><strong>Deadline:</strong> ${formatDate(rec.deadline)} (${urgencyText})</div>
        <div><strong>Assigned Officer:</strong> ${rec.assignedOfficer || 'PR Team'}</div>
        ${rec.evidence ? `<div><strong>Correction Evidence Note:</strong> ${sanitizeHTML(rec.evidence)}</div>` : ''}
      </div>
    `;
  } else if (type === 'verification') {
    fieldsHTML += `
      <div style="display:flex; flex-direction:column; gap:12px; font-size:0.82rem;">
        <div><strong>Classification:</strong> ${rec.classification}</div>
        <div><strong>Case Title:</strong> ${sanitizeHTML(rec.subject)}</div>
        <div><strong>Details/Background:</strong> ${sanitizeHTML(rec.description)}</div>
        <div><strong>Assigned Officer:</strong> ${rec.officerAssigned || 'TBD'}</div>
        <div><strong>Mediation Date:</strong> ${rec.meetingDate ? formatDateTime(rec.meetingDate) : 'Not Scheduled'}</div>
      </div>
    `;
  } else if (type === 'inquiry') {
    fieldsHTML += `
      <div style="display:flex; flex-direction:column; gap:12px; font-size:0.82rem;">
        <div><strong>Category:</strong> ${rec.category}</div>
        <div><strong>Subject:</strong> ${sanitizeHTML(rec.subject)}</div>
        <div><strong>Message:</strong> ${sanitizeHTML(rec.message)}</div>
        <div><strong>Related Club:</strong> ${sanitizeHTML(rec.club || 'Not specified')}</div>
      </div>
    `;
  } else if (type === 'appointment') {
    fieldsHTML += `
      <div style="display:flex; flex-direction:column; gap:12px; font-size:0.82rem;">
        <div><strong>Portfolio:</strong> ${rec.portfolio}</div>
        <div><strong>Purpose:</strong> ${sanitizeHTML(rec.purpose)}</div>
        <div><strong>Format:</strong> ${rec.format}</div>
        <div><strong>Scheduled Date:</strong> ${formatDate(rec.date)}</div>
        <div><strong>Scheduled Time:</strong> ${rec.time}</div>
      </div>
    `;
  }
  
  fieldsHTML += `</div>`;

  // Right Column - Checklists / Sitemap previews
  let sideHTML = `<div class="card">`;
  if (type === 'website') {
    sideHTML += `<h3 style="font-family:var(--font-display); font-size:0.95rem; font-weight:700; margin-bottom:16px; border-bottom:1px solid var(--glass-border); padding-bottom:8px;">QA Checkpoints</h3>`;
    const q = rec.qaChecks || { responsive: false, links: false, forms: false, branding: false, speed: false };
    const canToggle = state.currentUser.role === 'district-tech';
    
    sideHTML += `
      <div style="display:flex; flex-direction:column; gap:12px; font-size:0.82rem;">
        <label style="display:flex; align-items:center; gap:8px;">
          <input type="checkbox" ${q.responsive ? 'checked' : ''} ${canToggle ? '' : 'disabled'} onchange="toggleQACheckbox('${rec.id}', 'responsive')" />
          Mobile Responsiveness Test
        </label>
        <label style="display:flex; align-items:center; gap:8px;">
          <input type="checkbox" ${q.links ? 'checked' : ''} ${canToggle ? '' : 'disabled'} onchange="toggleQACheckbox('${rec.id}', 'links')" />
          Broker Links Verification
        </label>
        <label style="display:flex; align-items:center; gap:8px;">
          <input type="checkbox" ${q.forms ? 'checked' : ''} ${canToggle ? '' : 'disabled'} onchange="toggleQACheckbox('${rec.id}', 'forms')" />
          Forms & Inputs Validation
        </label>
        <label style="display:flex; align-items:center; gap:8px;">
          <input type="checkbox" ${q.branding ? 'checked' : ''} ${canToggle ? '' : 'disabled'} onchange="toggleQACheckbox('${rec.id}', 'branding')" />
          PR Logo Safety Bounds check
        </label>
        <label style="display:flex; align-items:center; gap:8px;">
          <input type="checkbox" ${q.speed ? 'checked' : ''} ${canToggle ? '' : 'disabled'} onchange="toggleQACheckbox('${rec.id}', 'speed')" />
          LCP Performance Speed (>90)
        </label>
      </div>
    `;
  } else if (type === 'compliance') {
    sideHTML += `<h3 style="font-family:var(--font-display); font-size:0.95rem; font-weight:700; margin-bottom:16px; border-bottom:1px solid var(--glass-border); padding-bottom:8px;">Directive Countdown</h3>`;
    sideHTML += renderCountdown(rec.deadline);
  } else {
    sideHTML += `<h3 style="font-family:var(--font-display); font-size:0.95rem; font-weight:700; margin-bottom:16px; border-bottom:1px solid var(--glass-border); padding-bottom:8px;">System Checks</h3>`;
    sideHTML += `
      <div style="font-size:0.8rem; color:var(--slate-blue); line-height:1.5;">
        🟢 Verification check complete. Record aligns with district access safety levels. IP logging enabled for transaction transparency.
      </div>
    `;
  }
  sideHTML += `</div>`;

  html += fieldsHTML + sideHTML;
  html += `</div>`;
  return html;
}

/** Render discussion tab */
function renderWorkspaceDiscussionTab(rec) {
  const comments = rec.comments || [];
  
  let html = `<div class="card">`;
  html += `<h3 style="font-family:var(--font-display); font-size:0.95rem; font-weight:700; margin-bottom:20px;">Communication Thread</h3>`;
  
  html += `<div class="comm-thread" style="max-height: 400px; overflow-y: auto; padding-right:8px; margin-bottom:20px;">`;
  if (comments.length === 0) {
    html += `<div style="text-align:center; padding:40px; color:var(--slate-blue); font-size:0.82rem;">No messages in this discussion thread. Start the conversation!</div>`;
  } else {
    comments.forEach(c => {
      // Determine sender style class
      const isOfficial = c.role.includes('District') || c.role.includes('Admin') || c.role.includes('PR') || c.role.includes('Technical');
      const msgCls = isOfficial ? 'official' : 'user';
      
      html += `
        <div class="comm-message ${msgCls}">
          <div class="comm-avatar">${c.sender.charAt(0)}</div>
          <div class="comm-bubble">
            <div class="comm-sender">${sanitizeHTML(c.sender)} <span style="font-size:0.62rem; color:var(--slate-blue); font-weight:400; opacity:0.7;">(${c.role})</span></div>
            <div class="comm-text">${sanitizeHTML(c.text)}</div>
            <div class="comm-time">${c.date ? formatDate(c.date) : ''}</div>
          </div>
        </div>
      `;
    });
  }
  html += `</div>`;
  
  // Discussion input area
  html += `
    <div class="comm-input-area" style="padding:0; border-top:none; margin-top:0;">
      <textarea class="comm-input" id="workspace-comm-text" placeholder="Write a response or note..." rows="3"></textarea>
      <button class="btn btn-primary" onclick="submitWorkspaceComment('${rec.id}')" style="align-self:flex-end; padding: 12px 20px;">Send</button>
    </div>
  `;
  
  html += `</div>`;
  return html;
}

/** Submit comments inside workspace */
function submitWorkspaceComment(recId) {
  const ta = document.getElementById('workspace-comm-text');
  if (!ta || !ta.value.trim()) return;
  
  const text = ta.value.trim();
  const comment = {
    sender: state.currentUser?.name || 'Unknown',
    role: state.currentUser?.role.replace(/-/g, ' ') || 'Leo',
    text: text,
    date: new Date().toISOString().substring(0, 10)
  };
  
  // Save to database depending on process type
  const type = activeWorkspaceType;
  if (type === 'website') {
    const list = state.getData('websiteRequests');
    const rec = list.find(r => r.id === recId);
    if (rec) {
      rec.comments = rec.comments || [];
      rec.comments.push(comment);
      rec.updatedAt = new Date().toISOString();
      state.setData('websiteRequests', list);
    }
  } else if (type === 'maintenance') {
    const list = state.getData('maintenanceTickets');
    const rec = list.find(t => t.id === recId);
    if (rec) {
      rec.comments = rec.comments || [];
      rec.comments.push(comment);
      rec.updatedAt = new Date().toISOString();
      state.setData('maintenanceTickets', list);
    }
  } else if (type === 'verification') {
    const list = state.getData('verificationCases');
    const rec = list.find(c => c.id === recId);
    if (rec) {
      rec.comments = rec.comments || [];
      rec.comments.push(comment);
      rec.updatedAt = new Date().toISOString();
      state.setData('verificationCases', list);
    }
  } else if (type === 'inquiry') {
    const list = state.getData('inquiries');
    const rec = list.find(i => i.id === recId);
    if (rec) {
      rec.comments = rec.comments || [];
      rec.comments.push(comment);
      state.setData('inquiries', list);
    }
  }
  
  showToast('Response submitted', 'success');
  // Reload workspace
  openProcessWorkspace(activeWorkspaceType, recId);
  // Switch to discussion tab directly
  activeWorkspaceTab = 'discussion';
  renderWorkspaceView();
}

/** Render files tab */
function renderWorkspaceFilesTab(rec) {
  let html = `<div class="card">`;
  html += `<h3 style="font-family:var(--font-display); font-size:0.95rem; font-weight:700; margin-bottom:16px;">Files & Graphic Assets</h3>`;
  
  // Upload Zone
  html += `
    <div class="file-upload-zone" onclick="document.getElementById('workspace-file-input').click()">
      <div class="file-upload-zone-icon">📁</div>
      <div class="file-upload-zone-text">Upload new assets, logo PNGs, flyers, or proof documents</div>
      <div class="file-upload-zone-hint">Drag and drop or click here to upload files</div>
      <input type="file" id="workspace-file-input" style="display:none;" onchange="handleWorkspaceFileUpload('${rec.id}')" />
    </div>
  `;
  
  // File List
  html += `<div class="file-list" style="margin-top:20px;">`;
  if (rec.logo || rec.screenshot || rec.file) {
    const files = [];
    if (rec.logo) files.push({ name: rec.logo, type: 'Logo Asset', size: '2.4 MB' });
    if (rec.screenshot) files.push({ name: rec.screenshot, type: 'Screenshot evidence', size: '1.2 MB' });
    if (rec.file && rec.file !== 'material.png') files.push({ name: rec.file, type: 'PR Material document', size: '4.8 MB' });
    
    files.forEach(f => {
      html += `
        <div class="file-item">
          <div class="file-item-icon">📄</div>
          <div class="file-item-name">${sanitizeHTML(f.name)} <span style="font-size:0.68rem; color:var(--slate-blue); opacity:0.6; margin-left:8px;">(${f.type})</span></div>
          <div class="file-item-size">${f.size}</div>
          <button class="file-item-remove" onclick="showToast('Asset deletion requires district technical permissions', 'danger')">✕</button>
        </div>
      `;
    });
  } else {
    html += `<div style="text-align:center; padding:20px; color:var(--slate-blue); font-size:0.82rem;">No file attachments uploaded for this record yet.</div>`;
  }
  html += `</div></div>`;
  return html;
}

function handleWorkspaceFileUpload(recId) {
  const input = document.getElementById('workspace-file-input');
  if (input && input.files[0]) {
    const file = input.files[0];
    showToast(`Uploading ${file.name}...`, 'info');
    
    setTimeout(() => {
      // Add fake file to record
      if (activeWorkspaceType === 'website') {
        const list = state.getData('websiteRequests');
        const rec = list.find(r => r.id === recId);
        if (rec) {
          rec.logo = file.name;
          state.setData('websiteRequests', list);
        }
      }
      showToast('File uploaded successfully', 'success');
      openProcessWorkspace(activeWorkspaceType, recId);
      activeWorkspaceTab = 'files';
      renderWorkspaceView();
    }, 1500);
  }
}

/** Render Approvals tab showing visual approval chain tree */
function renderWorkspaceApprovalsTab(type, rec) {
  let html = `<div class="card">`;
  html += `<h3 style="font-family:var(--font-display); font-size:0.95rem; font-weight:700; margin-bottom:20px; border-bottom:1px solid var(--glass-border); padding-bottom:8px;">Visual Approval Chain</h3>`;
  
  let steps = [];
  if (type === 'website') {
    steps = [
      { name: 'Club President Submission', role: 'Club President', status: 'Approved', date: rec.submissionDate },
      { name: 'Technical Feasibility sign-off', role: 'District Technical Officer', status: rec.status !== 'Submitted' && rec.status !== 'Feasibility Review' ? 'Approved' : 'Pending' },
      { name: 'PR Logo Compliance audit', role: 'District PR Officer', status: ['Club Content Review', 'Published'].includes(rec.status) ? 'Approved' : 'Pending' },
      { name: 'Handover & Publication approval', role: 'Club President & Super-Admin', status: rec.status === 'Published' ? 'Approved' : 'Pending' }
    ];
  } else if (type === 'compliance') {
    steps = [
      { name: 'PR Compliance Directive Issued', role: 'District PR Officer', status: 'Approved', date: rec.dateLogged },
      { name: 'Directive Acknowledged', role: 'Club President', status: rec.status !== 'Issued' ? 'Approved' : 'Pending' },
      { name: 'Correction Evidence Submitted', role: 'Club President', status: ['Action Taken', 'Closed'].includes(rec.status) ? 'Approved' : 'Pending' },
      { name: 'PR Verification & Case Closure', role: 'District PR Officer', status: rec.status === 'Closed' ? 'Approved' : 'Pending' }
    ];
  } else {
    steps = [
      { name: 'Request Submission', role: 'Leo Club', status: 'Approved', date: rec.dateSubmitted || rec.dateRequested },
      { name: 'District Officer Evaluation', role: 'District Council', status: ['Closed', 'Completed', 'Resolved'].includes(rec.status) ? 'Approved' : 'Pending' }
    ];
  }

  html += `<div style="display:flex; flex-direction:column; gap:16px; position:relative; padding-left:24px;">`;
  // Add tree line connector
  html += `<div style="position:absolute; top:8px; bottom:8px; left:9px; width:2px; background:rgba(123, 69, 240, 0.15);"></div>`;
  
  steps.forEach(step => {
    const isApp = step.status === 'Approved';
    const dotColor = isApp ? 'var(--success-green)' : 'var(--black)';
    const dotBorder = isApp ? 'var(--success-green)' : 'var(--glass-border)';
    const textColor = isApp ? 'var(--text-primary)' : 'var(--slate-blue)';
    
    html += `
      <div style="display:flex; gap:16px; align-items:flex-start; position:relative;">
        <div style="width:20px; height:20px; border-radius:50%; background:${dotColor}; border:2.5px solid ${dotBorder}; display:flex; align-items:center; justify-content:center; flex-shrink:0; z-index:2; margin-top:2px;">
          ${isApp ? '<span style="color:white;font-size:0.55rem;font-weight:700;">✓</span>' : ''}
        </div>
        <div>
          <div style="font-size:0.85rem; font-weight:600; color:${textColor};">${step.name}</div>
          <div style="font-size:0.7rem; color:var(--slate-blue); opacity:0.8; margin-top:2px;">Role: ${step.role} ${step.date ? `• Completed on ${formatDate(step.date)}` : ''}</div>
        </div>
      </div>
    `;
  });
  
  html += `</div></div>`;
  return html;
}

/** Render History tab showing audit log list */
function renderWorkspaceHistoryTab(rec) {
  let html = `<div class="card">`;
  html += `<h3 style="font-family:var(--font-display); font-size:0.95rem; font-weight:700; margin-bottom:16px;">Process Audit Logs</h3>`;
  
  let history = rec.timeline || [];
  
  if (history.length === 0) {
    html += `<div style="text-align:center; padding:20px; color:var(--slate-blue); font-size:0.82rem;">No historical logs found for this record.</div>`;
  } else {
    html += `<div style="display:flex; flex-direction:column; gap:12px;">`;
    history.forEach(log => {
      html += `
        <div style="padding:12px; background:var(--black); border:1px solid var(--glass-border); border-radius:8px; display:flex; justify-content:space-between; align-items:center;">
          <div>
            <div style="font-size:0.82rem; font-weight:600; color:var(--text-primary);">${sanitizeHTML(log.stage)}</div>
            <div style="font-size:0.72rem; color:var(--slate-blue); margin-top:3px;">${sanitizeHTML(log.notes || 'Status changed')}</div>
          </div>
          <div style="text-align:right; font-size:0.68rem; color:var(--slate-blue); opacity:0.6;">
            <div>Done by: ${sanitizeHTML(log.completedBy || 'System')}</div>
            <div style="margin-top:2px;">${formatDateTime(log.date)}</div>
          </div>
        </div>
      `;
    });
    html += `</div>`;
  }
  
  html += `</div>`;
  return html;
}

// === ACTION IMPLEMENTATIONS ===

function toggleQACheckbox(reqId, checkType) {
  const list = state.getData('websiteRequests');
  const req = list.find(r => r.id === reqId);
  if (req) {
    req.qaChecks = req.qaChecks || { responsive: false, links: false, forms: false, branding: false, speed: false };
    req.qaChecks[checkType] = !req.qaChecks[checkType];
    req.updatedAt = new Date().toISOString();
    state.setData('websiteRequests', list);
    showToast(`QA Checkpoint "${checkType.toUpperCase()}" updated`, 'info');
    openProcessWorkspace('website', reqId);
  }
}

function assignWebsiteRequest(reqId) {
  const list = state.getData('websiteRequests');
  const req = list.find(r => r.id === reqId);
  if (req) {
    req.assignedDev = state.currentUser?.name || 'Naveen Alwis';
    req.assignedTo = state.currentUser?.name || 'Naveen Alwis';
    req.status = 'Feasibility Review';
    req.updatedAt = new Date().toISOString();
    req.timeline.push({
      stage: 'Feasibility Review',
      date: new Date().toISOString(),
      completedBy: state.currentUser?.name,
      notes: 'Developer assigned. Technical feasibility review initialized.'
    });
    state.setData('websiteRequests', list);
    state.logAction('Website Request Assigned', req.id, `Assigned to ${req.assignedDev}`);
    showToast('Request assigned successfully', 'success');
    openProcessWorkspace('website', reqId);
  }
}

function rejectWebsiteRequest(reqId) {
  const list = state.getData('websiteRequests');
  const req = list.find(r => r.id === reqId);
  if (req) {
    req.status = 'Rejected';
    req.updatedAt = new Date().toISOString();
    req.timeline.push({
      stage: 'Rejected',
      date: new Date().toISOString(),
      completedBy: state.currentUser?.name,
      notes: 'Request rejected.'
    });
    state.setData('websiteRequests', list);
    state.logAction('Website Request Rejected', req.id);
    showToast('Request rejected', 'warning');
    openProcessWorkspace('website', reqId);
  }
}

function updateWebsiteStatus(reqId, newStatus) {
  const list = state.getData('websiteRequests');
  const req = list.find(r => r.id === reqId);
  if (req) {
    req.status = newStatus;
    req.updatedAt = new Date().toISOString();
    req.timeline.push({
      stage: newStatus,
      date: new Date().toISOString(),
      completedBy: state.currentUser?.name,
      notes: `Status updated to ${newStatus}`
    });
    state.setData('websiteRequests', list);
    state.logAction('Website Status Updated', req.id, `New status: ${newStatus}`);
    showToast(`Status updated to ${newStatus}`, 'success');
    openProcessWorkspace('website', reqId);
  }
}

function promptStagingLink(reqId) {
  const link = prompt('Please enter the staging environment site URL:');
  if (!link) return;
  
  const list = state.getData('websiteRequests');
  const req = list.find(r => r.id === reqId);
  if (req) {
    req.stagingLink = link;
    req.updatedAt = new Date().toISOString();
    state.setData('websiteRequests', list);
    showToast('Staging link updated successfully', 'success');
    openProcessWorkspace('website', reqId);
  }
}

function approveBrandingCompliance(reqId) {
  const list = state.getData('websiteRequests');
  const req = list.find(r => r.id === reqId);
  if (req) {
    req.status = 'Club Content Review';
    req.updatedAt = new Date().toISOString();
    req.timeline.push({
      stage: 'Club Content Review',
      date: new Date().toISOString(),
      completedBy: state.currentUser?.name,
      notes: 'Branding audit complete. Logo safety zone rules met.'
    });
    state.setData('websiteRequests', list);
    state.logAction('Website Branding Approved', req.id);
    showToast('Branding compliance verified', 'success');
    openProcessWorkspace('website', reqId);
  }
}

function requestBrandingCorrection(reqId) {
  const note = prompt('Please describe the required branding correction directive:');
  if (!note) return;
  
  const list = state.getData('websiteRequests');
  const req = list.find(r => r.id === reqId);
  if (req) {
    req.status = 'Development in Progress';
    req.updatedAt = new Date().toISOString();
    req.timeline.push({
      stage: 'Development in Progress',
      date: new Date().toISOString(),
      completedBy: state.currentUser?.name,
      notes: `Correction request: ${note}`,
      delayed: true,
      delayReason: 'PR Branding Violation'
    });
    state.setData('websiteRequests', list);
    showToast('Branding correction requested', 'warning');
    openProcessWorkspace('website', reqId);
  }
}

function acknowledgeWebsiteHandover(reqId) {
  const list = state.getData('websiteRequests');
  const req = list.find(r => r.id === reqId);
  if (req) {
    req.status = 'Published';
    req.handoverAcknowledged = true;
    req.updatedAt = new Date().toISOString();
    req.timeline.push({
      stage: 'Published',
      date: new Date().toISOString(),
      completedBy: state.currentUser?.name,
      notes: 'Handover signed off by club president. Domain mapping completed successfully.'
    });
    
    // Add to active sites
    const activeSites = state.getData('activeSites') || [];
    activeSites.push({
      club: req.clubName || req.club,
      domain: req.preferredDomain,
      registrar: 'District DNS Server',
      ssl: 'SSL Secure Active'
    });
    state.setData('activeSites', activeSites);
    
    state.setData('websiteRequests', list);
    state.logAction('Website Published', req.id);
    showToast('Handover signed off! Your club website is now published live!', 'success');
    
    // Render completion screen inside view
    renderHandoverCompletionScreen(req);
  }
}

function requestWebsiteRevision(reqId) {
  const note = prompt('Please specify the revision/corrections required:');
  if (!note) return;
  
  const list = state.getData('websiteRequests');
  const req = list.find(r => r.id === reqId);
  if (req) {
    req.status = 'Development in Progress';
    req.updatedAt = new Date().toISOString();
    req.timeline.push({
      stage: 'Development in Progress',
      date: new Date().toISOString(),
      completedBy: state.currentUser?.name,
      notes: `Revision request: ${note}`
    });
    state.setData('websiteRequests', list);
    showToast('Revision notes sent back to technical developer', 'info');
    openProcessWorkspace('website', reqId);
  }
}

function renderHandoverCompletionScreen(req) {
  const container = document.getElementById('view-workspace');
  if (!container) return;
  
  container.innerHTML = `
    <div class="completion-screen">
      <div class="completion-icon">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z" />
        </svg>
      </div>
      <h1 class="completion-title">Website Published!</h1>
      <p class="completion-desc">The handover checklist is completed and signed off. Your website has been deployed live on the district servers.</p>
      
      <div class="completion-details">
        <div class="completion-detail-row"><span class="completion-detail-label">Reference ID</span><span class="completion-detail-value">${req.id}</span></div>
        <div class="completion-detail-row"><span class="completion-detail-label">Club</span><span class="completion-detail-value">${req.clubName}</span></div>
        <div class="completion-detail-row"><span class="completion-detail-label">Domain</span><span class="completion-detail-value"><code>https://${req.preferredDomain}</code></span></div>
        <div class="completion-detail-row"><span class="completion-detail-label">SSL Encryption</span><span class="completion-detail-value" style="color:var(--success-green);">ACTIVE SECURE</span></div>
      </div>
      
      <div class="completion-actions">
        <button class="btn btn-primary" onclick="window.open('https://${req.preferredDomain}', '_blank')">Visit Website</button>
        <button class="btn btn-secondary" onclick="switchView('websites')">Return to Workspace</button>
      </div>
    </div>
  `;
}

// === MAINTENANCE ACTIONS ===

function updateMaintenanceStatus(ticketId, newStatus) {
  const list = state.getData('maintenanceTickets');
  const t = list.find(ticket => ticket.id === ticketId);
  if (t) {
    t.status = newStatus;
    t.updatedAt = new Date().toISOString();
    state.setData('maintenanceTickets', list);
    state.logAction('Support Ticket Updated', t.id, `Status: ${newStatus}`);
    showToast(`Ticket status updated to ${newStatus}`, 'success');
    openProcessWorkspace('maintenance', ticketId);
  }
}

// === COMPLIANCE ACTIONS ===

function updateComplianceStatus(caseId, newStatus) {
  const list = state.getData('complianceCases');
  const c = list.find(caseItem => caseItem.id === caseId);
  if (c) {
    c.status = newStatus;
    c.updatedAt = new Date().toISOString();
    state.setData('complianceCases', list);
    state.logAction('Compliance Case Updated', c.id, `Status: ${newStatus}`);
    
    // If closed, set club branding status back to Compliant
    if (newStatus === 'Closed') {
      const clubs = state.getData('clubs');
      const club = clubs.find(x => x.id === c.clubId || x.name === c.clubName);
      if (club) {
        club.brandingStatus = 'Compliant';
        state.setData('clubs', clubs);
      }
      // Acknowledge corresponding emergency notice if it matches
      const emergencies = state.getData('emergencyNotices') || [];
      emergencies.forEach(e => {
        if (e.club === c.clubName || e.clubId === c.clubId) e.acknowledged = true;
      });
      state.setData('emergencyNotices', emergencies);
    }
    
    showToast(`Compliance case updated to ${newStatus}`, 'success');
    openProcessWorkspace('compliance', caseId);
  }
}

function submitComplianceEvidencePrompt(caseId) {
  const evidence = prompt('Enter a summary note of the branding correction made (e.g. "Changed font size on header logo flyer to align with standard safety spacing"):');
  if (!evidence) return;
  
  const list = state.getData('complianceCases');
  const c = list.find(caseItem => caseItem.id === caseId);
  if (c) {
    c.evidence = evidence;
    c.status = 'Action Taken';
    c.updatedAt = new Date().toISOString();
    state.setData('complianceCases', list);
    state.logAction('Branding Proof Submitted', c.id, evidence);
    showToast('Correction evidence submitted successfully', 'success');
    openProcessWorkspace('compliance', caseId);
  }
}

// === VERIFICATION ACTIONS ===

function assignVerificationOfficer(caseId) {
  const list = state.getData('verificationCases');
  const c = list.find(caseItem => caseItem.id === caseId);
  if (c) {
    c.officerAssigned = state.currentUser?.name || 'Dilhara Silva';
    c.status = 'Team Assigned';
    c.updatedAt = new Date().toISOString();
    state.setData('verificationCases', list);
    showToast('Case assigned to you', 'success');
    openProcessWorkspace('verification', caseId);
  }
}

function updateVerificationStatus(caseId, newStatus) {
  const list = state.getData('verificationCases');
  const c = list.find(caseItem => caseItem.id === caseId);
  if (c) {
    c.status = newStatus;
    c.updatedAt = new Date().toISOString();
    state.setData('verificationCases', list);
    showToast(`Case status updated: ${newStatus}`, 'success');
    openProcessWorkspace('verification', caseId);
  }
}

function promptScheduleMediationMeeting(caseId) {
  const date = prompt('Enter meeting Date & Time (e.g. "2026-07-28 10:00 AM"):');
  if (!date) return;
  
  const list = state.getData('verificationCases');
  const c = list.find(caseItem => caseItem.id === caseId);
  if (c) {
    c.meetingDate = date;
    c.status = 'Meeting Scheduled';
    c.updatedAt = new Date().toISOString();
    
    // Also create appointment automatically
    const appointments = state.getData('appointments') || [];
    appointments.push({
      id: generateId(),
      referenceNumber: generateReferenceNumber('APT'),
      portfolio: 'Verification Team',
      purpose: `Mediation meeting for Case ${c.id}: ${c.subject}`,
      format: 'Virtual (Zoom)',
      date: date.split(' ')[0],
      time: date.substring(date.indexOf(' ') + 1),
      status: 'Confirmed',
      requestedBy: c.clubName,
      club: c.clubName,
      dateTime: date
    });
    state.setData('appointments', appointments);
    
    state.setData('verificationCases', list);
    showToast('Mediation meeting scheduled and calendar booked', 'success');
    openProcessWorkspace('verification', caseId);
  }
}

function completeMediationMeetingPrompt(caseId) {
  const decision = prompt('Enter mediation outcome decision details:');
  if (!decision) return;
  
  const list = state.getData('verificationCases');
  const c = list.find(caseItem => caseItem.id === caseId);
  if (c) {
    c.status = 'Decision';
    c.decision = decision;
    c.updatedAt = new Date().toISOString();
    
    // Add decision to discussion thread
    c.comments = c.comments || [];
    c.comments.push({
      sender: 'District Verification Officer',
      role: 'Verification Council',
      text: `MEDIATION OUTCOME: ${decision}`,
      date: new Date().toISOString().substring(0, 10)
    });
    
    state.setData('verificationCases', list);
    showToast('Mediation outcomes logged successfully', 'success');
    openProcessWorkspace('verification', caseId);
  }
}
