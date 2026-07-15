// === MULTI-STEP FORM WIZARD ENGINE ===

let activeWizard = null;
let wizardAutoSaveInterval = null;

/** Create and open a wizard */
function openWizard(config) {
  closeWizard(); // Close any existing wizard
  
  activeWizard = {
    id: config.id,
    title: config.title,
    steps: config.steps,
    currentStep: 0,
    data: {},
    onSubmit: config.onSubmit,
    onCancel: config.onCancel,
  };
  
  // Load saved draft
  const draft = state.loadDraft ? state.loadDraft(config.id) : null;
  if (draft && draft.data) {
    activeWizard.data = draft.data;
  }
  
  renderWizard();
  startWizardAutoSave();
}

/** Render the wizard UI */
function renderWizard() {
  if (!activeWizard) return;
  
  // Remove existing
  const existing = document.getElementById('wizard-overlay');
  if (existing) existing.remove();
  
  const overlay = document.createElement('div');
  overlay.id = 'wizard-overlay';
  overlay.className = 'wizard-overlay';
  overlay.setAttribute('role', 'dialog');
  overlay.setAttribute('aria-modal', 'true');
  overlay.setAttribute('aria-label', activeWizard.title);
  
  const stepsCount = activeWizard.steps.length;
  const currentStep = activeWizard.currentStep;
  
  let progressHTML = '<div class="wizard-progress">';
  let labelsHTML = '<div class="wizard-progress-labels">';
  for (let i = 0; i < stepsCount; i++) {
    const cls = i < currentStep ? 'completed' : i === currentStep ? 'current' : '';
    progressHTML += `<div class="wizard-progress-step ${cls}"></div>`;
    labelsHTML += `<div class="wizard-progress-label ${cls}">${activeWizard.steps[i].title}</div>`;
  }
  progressHTML += '</div>';
  labelsHTML += '</div>';
  
  let stepsHTML = '';
  activeWizard.steps.forEach((step, i) => {
    const isActive = i === currentStep;
    stepsHTML += `<div class="wizard-step ${isActive ? 'active' : ''}" data-step="${i}">`;
    stepsHTML += `<div class="wizard-step-title">${step.title}</div>`;
    stepsHTML += `<div class="wizard-step-desc">${step.desc || ''}</div>`;
    stepsHTML += `<div class="wizard-step-fields">${renderWizardFields(step.fields, i)}</div>`;
    stepsHTML += `</div>`;
  });
  
  overlay.innerHTML = `
    <div class="wizard-container">
      <div class="wizard-header">
        <div class="wizard-title">${activeWizard.title}</div>
        <button class="btn btn-secondary btn-sm" onclick="closeWizard()" aria-label="Close">✕</button>
      </div>
      ${progressHTML}
      ${labelsHTML}
      <div class="wizard-body">
        ${stepsHTML}
      </div>
      <div class="wizard-footer">
        <div class="wizard-autosave">
          <div class="dot"></div>
          <span>Auto-saved</span>
        </div>
        <div class="wizard-footer-actions">
          ${currentStep > 0 ? '<button class="btn btn-secondary" onclick="wizardPrev()">← Back</button>' : '<button class="btn btn-secondary" onclick="closeWizard()">Cancel</button>'}
          ${currentStep < stepsCount - 1 
            ? '<button class="btn btn-primary" onclick="wizardNext()">Continue →</button>'
            : '<button class="btn btn-primary" onclick="wizardSubmit()" style="background:linear-gradient(135deg, #10b981, #059669);">Submit Request</button>'
          }
        </div>
      </div>
    </div>
  `;
  
  document.body.appendChild(overlay);
  
  // Restore saved data to fields
  restoreWizardData();
  
  // Focus trap
  trapFocus(overlay.querySelector('.wizard-container'));
}

/** Render fields for a wizard step */
function renderWizardFields(fields, stepIndex) {
  if (!fields || fields.length === 0) return '<div style="color:var(--slate-blue); font-size:0.82rem;">No fields for this step.</div>';
  
  let html = '';
  fields.forEach(field => {
    const value = activeWizard.data[field.id] || field.defaultValue || '';
    const required = field.required ? 'required' : '';
    const ariaDescribed = field.hint ? `aria-describedby="hint-${field.id}"` : '';
    
    html += `<div class="form-group" style="margin-bottom:18px;">`;
    html += `<label class="form-label" for="wizard-${field.id}">${field.label}${field.required ? ' <span style="color:var(--danger);">*</span>' : ''}</label>`;
    
    switch (field.type) {
      case 'text':
      case 'email':
      case 'url':
      case 'date':
      case 'number':
        html += `<input type="${field.type}" class="form-input" id="wizard-${field.id}" name="${field.id}" value="${sanitizeHTML(String(value))}" placeholder="${field.placeholder || ''}" ${required} ${ariaDescribed} ${field.readonly ? 'readonly' : ''} onchange="updateWizardData('${field.id}', this.value)" />`;
        break;
        
      case 'textarea':
        html += `<textarea class="form-input" id="wizard-${field.id}" name="${field.id}" placeholder="${field.placeholder || ''}" rows="${field.rows || 4}" ${required} ${ariaDescribed} onchange="updateWizardData('${field.id}', this.value)" style="min-height:${(field.rows || 4) * 24}px; resize:vertical; width:100%;">${sanitizeHTML(String(value))}</textarea>`;
        break;
        
      case 'select':
        html += `<select class="form-input" id="wizard-${field.id}" name="${field.id}" ${required} ${ariaDescribed} onchange="updateWizardData('${field.id}', this.value)" style="width:100%;">`;
        html += `<option value="">Select...</option>`;
        (field.options || []).forEach(opt => {
          const optVal = typeof opt === 'string' ? opt : opt.value;
          const optLabel = typeof opt === 'string' ? opt : opt.label;
          html += `<option value="${optVal}" ${value === optVal ? 'selected' : ''}>${optLabel}</option>`;
        });
        html += `</select>`;
        break;
        
      case 'checkbox-group':
        html += `<div class="checkbox-group" style="display:grid; grid-template-columns:repeat(auto-fill, minmax(200px,1fr)); gap:8px;">`;
        const selectedValues = Array.isArray(value) ? value : [];
        (field.options || []).forEach(opt => {
          const optVal = typeof opt === 'string' ? opt : opt.value;
          const optLabel = typeof opt === 'string' ? opt : opt.label;
          const checked = selectedValues.includes(optVal) ? 'checked' : '';
          html += `
            <label class="checkbox-label" style="display:flex; align-items:center; gap:8px; padding:10px 14px; background:rgba(19,13,38,0.45); border:1px solid var(--glass-border); border-radius:8px; cursor:pointer; font-size:0.82rem; transition:var(--transition);">
              <input type="checkbox" value="${optVal}" ${checked} onchange="updateWizardCheckboxGroup('${field.id}')" data-group="${field.id}" />
              ${optLabel}
            </label>
          `;
        });
        html += `</div>`;
        break;
        
      case 'file':
        html += `
          <div class="file-upload-zone" onclick="document.getElementById('wizard-file-${field.id}').click()">
            <div class="file-upload-zone-icon">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" style="width:32px;height:32px;">
                <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
              </svg>
            </div>
            <div class="file-upload-zone-text">Click to upload or drag and drop</div>
            <div class="file-upload-zone-hint">${field.accept || 'Any file type'} • Max ${field.maxSize || '10MB'}</div>
            <input type="file" id="wizard-file-${field.id}" style="display:none;" accept="${field.accept || '*'}" onchange="updateWizardData('${field.id}', this.files[0]?.name || '')" />
          </div>
        `;
        break;
        
      case 'info':
        html += `<div style="background:rgba(59,130,246,0.08); border:1px solid rgba(59,130,246,0.2); border-radius:10px; padding:14px 16px; font-size:0.8rem; color:var(--periwinkle); line-height:1.5;">${field.content}</div>`;
        break;
        
      case 'divider':
        html += `<hr style="border:none; border-top:1px solid var(--glass-border); margin:8px 0;" />`;
        break;
    }
    
    if (field.hint) {
      html += `<div class="field-hint" id="hint-${field.id}">${field.hint}</div>`;
    }
    html += `</div>`;
  });
  
  return html;
}

/** Update wizard data */
function updateWizardData(fieldId, value) {
  if (!activeWizard) return;
  activeWizard.data[fieldId] = value;
}

/** Update checkbox group data */
function updateWizardCheckboxGroup(groupId) {
  if (!activeWizard) return;
  const checkboxes = document.querySelectorAll(`input[data-group="${groupId}"]:checked`);
  activeWizard.data[groupId] = Array.from(checkboxes).map(cb => cb.value);
}

/** Restore saved wizard data to form fields */
function restoreWizardData() {
  if (!activeWizard || !activeWizard.data) return;
  Object.entries(activeWizard.data).forEach(([key, value]) => {
    const field = document.getElementById(`wizard-${key}`);
    if (field) {
      if (field.tagName === 'SELECT' || field.tagName === 'INPUT' || field.tagName === 'TEXTAREA') {
        field.value = value;
      }
    }
  });
}

/** Navigate to next wizard step */
function wizardNext() {
  if (!activeWizard) return;
  
  // Validate current step
  const step = activeWizard.steps[activeWizard.currentStep];
  if (!validateWizardStep(step)) return;
  
  // Collect data from current step
  collectWizardStepData();
  
  if (activeWizard.currentStep < activeWizard.steps.length - 1) {
    activeWizard.currentStep++;
    renderWizard();
  }
}

/** Navigate to previous wizard step */
function wizardPrev() {
  if (!activeWizard || activeWizard.currentStep === 0) return;
  collectWizardStepData();
  activeWizard.currentStep--;
  renderWizard();
}

/** Go to specific wizard step */
function wizardGoToStep(stepIndex) {
  if (!activeWizard) return;
  if (stepIndex >= 0 && stepIndex < activeWizard.steps.length) {
    collectWizardStepData();
    activeWizard.currentStep = stepIndex;
    renderWizard();
  }
}

/** Collect data from current step fields */
function collectWizardStepData() {
  if (!activeWizard) return;
  const step = activeWizard.steps[activeWizard.currentStep];
  if (!step || !step.fields) return;
  
  step.fields.forEach(field => {
    if (field.type === 'checkbox-group') {
      const checkboxes = document.querySelectorAll(`input[data-group="${field.id}"]:checked`);
      activeWizard.data[field.id] = Array.from(checkboxes).map(cb => cb.value);
    } else if (field.type === 'info' || field.type === 'divider') {
      // No data to collect
    } else {
      const el = document.getElementById(`wizard-${field.id}`);
      if (el) activeWizard.data[field.id] = el.value;
    }
  });
}

/** Validate current wizard step */
function validateWizardStep(step) {
  if (!step || !step.fields) return true;
  let valid = true;
  
  step.fields.forEach(field => {
    if (!field.required) return;
    if (field.type === 'info' || field.type === 'divider') return;
    
    const el = document.getElementById(`wizard-${field.id}`);
    if (!el) return;
    
    const value = el.value?.trim();
    const errorEl = el.parentElement.querySelector('.field-error');
    
    // Remove existing errors
    if (errorEl) errorEl.remove();
    el.classList.remove('is-invalid');
    
    if (!value || value === '') {
      valid = false;
      el.classList.add('is-invalid');
      const error = document.createElement('div');
      error.className = 'field-error';
      error.setAttribute('role', 'alert');
      error.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" style="width:12px;height:12px;margin-right:4px;"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" /></svg> ${field.label} is required`;
      el.parentElement.appendChild(error);
    }
  });
  
  if (!valid) {
    showToast('Please complete all required fields', 'warning');
  }
  
  return valid;
}

/** Submit wizard */
function wizardSubmit() {
  if (!activeWizard) return;
  
  // Validate final step
  const step = activeWizard.steps[activeWizard.currentStep];
  if (!validateWizardStep(step)) return;
  
  collectWizardStepData();
  
  // Call submit handler
  if (activeWizard.onSubmit) {
    activeWizard.onSubmit(activeWizard.data);
  }
  
  // Clear draft
  if (state.clearDraft) state.clearDraft(activeWizard.id);
  
  closeWizard();
}

/** Close wizard */
function closeWizard() {
  stopWizardAutoSave();
  const overlay = document.getElementById('wizard-overlay');
  if (overlay) overlay.remove();
  activeWizard = null;
}

/** Start auto-save interval */
function startWizardAutoSave() {
  stopWizardAutoSave();
  wizardAutoSaveInterval = setInterval(() => {
    if (activeWizard) {
      collectWizardStepData();
      if (state.saveDraft) state.saveDraft(activeWizard.id, activeWizard.data);
      // Update auto-save indicator
      const indicator = document.querySelector('.wizard-autosave span');
      if (indicator) {
        indicator.textContent = 'Saved just now';
        setTimeout(() => { if (indicator) indicator.textContent = 'Auto-saved'; }, 2000);
      }
    }
  }, 30000); // Every 30 seconds
}

/** Stop auto-save interval */
function stopWizardAutoSave() {
  if (wizardAutoSaveInterval) {
    clearInterval(wizardAutoSaveInterval);
    wizardAutoSaveInterval = null;
  }
}

// === PREDEFINED WIZARD CONFIGURATIONS ===

/** Open Website Request Wizard */
function openWebsiteRequestWizard() {
  const user = state.currentUser;
  const clubs = state.getData('clubs') || [];
  const userClub = clubs.find(c => c.id === (user?.club || '')) || clubs[0] || {};
  
  openWizard({
    id: 'website-request',
    title: 'New Club Website Request',
    steps: [
      {
        title: 'Club Information',
        desc: 'Verify your club details. This information is automatically loaded from your profile.',
        fields: [
          { id: 'clubName', label: 'Club Name', type: 'text', required: true, defaultValue: userClub.name || '', readonly: true },
          { id: 'clubNumber', label: 'Club Number', type: 'text', required: true, defaultValue: userClub.number || '', readonly: true },
          { id: 'sponsoringClub', label: 'Sponsoring Lions Club', type: 'text', defaultValue: userClub.sponsor || '' },
          { id: 'district', label: 'District', type: 'text', required: true, defaultValue: 'District 306 A2', readonly: true },
          { id: 'presidentName', label: 'Club President', type: 'text', required: true, defaultValue: user?.name || '' },
          { id: 'presidentEmail', label: 'President Email', type: 'email', required: true, defaultValue: user?.email || '' },
        ]
      },
      {
        title: 'Website Purpose',
        desc: 'Describe why your club needs a website and who will use it.',
        fields: [
          { id: 'websitePurpose', label: 'Website Purpose', type: 'textarea', required: true, placeholder: 'Describe the main purpose of your club website...', rows: 4 },
          { id: 'targetAudience', label: 'Target Audience', type: 'select', required: true, options: ['Club Members', 'General Public', 'Sponsors & Partners', 'Prospective Members', 'All of the above'] },
          { id: 'proposedDomain', label: 'Proposed Subdomain', type: 'text', required: true, placeholder: 'e.g., colombocentennial', hint: 'Your website will be at [name].leoclubs.org' },
        ]
      },
      {
        title: 'Content & Pages',
        desc: 'Select the pages you want on your website. You can add more later.',
        fields: [
          { id: 'pages', label: 'Select Website Pages', type: 'checkbox-group', required: true, options: [
            'Home', 'About Us', 'Officers', 'Projects', 'Events', 'News', 'Gallery', 'Contact', 'Membership', 'History', 'Partners', 'Awards'
          ]},
          { id: 'additionalPages', label: 'Additional Pages (Optional)', type: 'textarea', placeholder: 'List any other pages you need...', rows: 2 },
        ]
      },
      {
        title: 'Technical Features',
        desc: 'Select any advanced features your website requires.',
        fields: [
          { id: 'features', label: 'Advanced Features', type: 'checkbox-group', options: [
            'Event Registration', 'Member Login', 'Photo Gallery', 'Blog/News', 'Contact Form', 'Social Media Feed', 'Newsletter Signup', 'Donation/Payment', 'Certificate Generation', 'Document Library'
          ]},
          { id: 'featureInfo', label: '', type: 'info', content: '⚠️ Features like payments, member accounts, and certificate generation require additional District approval and may extend the development timeline.' },
        ]
      },
      {
        title: 'Branding Assets',
        desc: 'Upload your club\'s branding materials for the website design.',
        fields: [
          { id: 'clubLogo', label: 'Club Logo', type: 'file', accept: 'image/*', hint: 'PNG or SVG format recommended, minimum 500x500px' },
          { id: 'colorPreference', label: 'Colour Preference', type: 'select', options: ['Use District Default', 'Club Custom Colours', 'No Preference'] },
          { id: 'stylePreference', label: 'Design Style', type: 'select', options: ['Modern & Clean', 'Professional & Corporate', 'Vibrant & Dynamic', 'Minimal & Elegant'] },
          { id: 'brandingNotes', label: 'Additional Branding Notes', type: 'textarea', placeholder: 'Any specific design preferences...', rows: 3 },
        ]
      },
      {
        title: 'Approvals',
        desc: 'Confirm that this request has been authorized by the club.',
        fields: [
          { id: 'targetLaunchDate', label: 'Target Launch Date', type: 'date', required: true },
          { id: 'clubApproval', label: 'Club Board Approval', type: 'select', required: true, options: ['Approved by Club Board', 'Pending Board Approval', 'President Authorization Only'] },
          { id: 'complianceAck', label: '', type: 'info', content: 'By submitting this request, you confirm that the club agrees to follow District branding guidelines and website maintenance responsibilities.' },
        ]
      },
      {
        title: 'Review & Submit',
        desc: 'Review your request before submitting. You can go back to any section to make changes.',
        fields: [
          { id: 'reviewInfo', label: '', type: 'info', content: 'Please review all the information above. Once submitted, your request will receive a reference number and enter the review process. You can track the progress from your dashboard.' },
          { id: 'additionalNotes', label: 'Additional Notes for the District Team', type: 'textarea', placeholder: 'Any additional information the district team should know...', rows: 3 },
        ]
      }
    ],
    onSubmit: (data) => {
      const refNum = generateReferenceNumber('WR');
      const request = {
        id: generateId(),
        referenceNumber: refNum,
        type: 'Club Website',
        domain: data.proposedDomain ? data.proposedDomain + '.leoclubs.org' : '',
        title: data.clubName + ' Website',
        club: data.clubName,
        clubId: data.clubNumber,
        clubNumber: data.clubNumber,
        purpose: data.websitePurpose,
        targetAudience: data.targetAudience,
        pages: data.pages || [],
        features: data.features || [],
        colorPreference: data.colorPreference,
        stylePreference: data.stylePreference,
        targetLaunchDate: data.targetLaunchDate,
        clubApproval: data.clubApproval,
        status: 'Submitted',
        priority: 'Normal',
        dateSubmitted: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        submittedBy: state.currentUser?.name || 'Unknown',
        assignedTo: null,
        comments: [],
        timeline: [
          { stage: 'Draft', date: new Date().toISOString(), completedBy: state.currentUser?.name, notes: 'Request created' },
          { stage: 'Submitted', date: new Date().toISOString(), completedBy: state.currentUser?.name, notes: 'Request submitted for review' }
        ],
        logo: data.clubLogo || null,
        staging: null,
        qaChecks: { responsive: false, links: false, forms: false, branding: false, speed: false },
        handoverAcknowledged: false,
        additionalNotes: data.additionalNotes,
      };
      
      const requests = state.getData('websiteRequests') || [];
      requests.push(request);
      state.setData('websiteRequests', requests);
      state.logAction('Website Request Submitted', refNum, `${data.clubName} submitted club website request`);
      state.addNotification(`New website request ${refNum} submitted by ${data.clubName}`, true);
      showToast(`Website request ${refNum} submitted successfully!`, 'success');
      
      // Navigate to websites view
      switchView('websites');
    }
  });
}

/** Open Maintenance Request Wizard */
function openMaintenanceWizard() {
  const activeSites = state.getData('activeSites') || [];
  const siteOptions = activeSites.map(s => ({ value: s.domain, label: s.domain + ' (' + s.club + ')' }));
  if (siteOptions.length === 0) siteOptions.push({ value: 'general', label: 'General Support Request' });
  
  openWizard({
    id: 'maintenance-request',
    title: 'Submit Maintenance Request',
    steps: [
      {
        title: 'Affected Website',
        desc: 'Select the website that needs maintenance or support.',
        fields: [
          { id: 'website', label: 'Select Website', type: 'select', required: true, options: siteOptions },
          { id: 'statusInfo', label: '', type: 'info', content: '🟢 All district websites are currently operational.' },
        ]
      },
      {
        title: 'Issue Details',
        desc: 'Describe the issue you are experiencing.',
        fields: [
          { id: 'category', label: 'Issue Category', type: 'select', required: true, options: ['Content Update', 'Bug/Error', 'Design Change', 'Feature Request', 'Security Concern', 'Performance Issue', 'Domain/SSL', 'Other'] },
          { id: 'subject', label: 'Issue Summary', type: 'text', required: true, placeholder: 'Brief summary of the issue...' },
          { id: 'details', label: 'Detailed Description', type: 'textarea', required: true, placeholder: 'Describe the issue in detail...', rows: 5 },
          { id: 'screenshot', label: 'Screenshot (Optional)', type: 'file', accept: 'image/*' },
        ]
      },
      {
        title: 'Priority & Submit',
        desc: 'Review priority and submit your request.',
        fields: [
          { id: 'priority', label: 'Suggested Priority', type: 'select', required: true, options: ['Low', 'Normal', 'High', 'Critical'], hint: 'Critical: Website down or security issue. High: Major functionality broken. Normal: Content updates. Low: Enhancements.' },
          { id: 'additionalNotes', label: 'Additional Notes', type: 'textarea', placeholder: 'Any other information...', rows: 3 },
        ]
      }
    ],
    onSubmit: (data) => {
      const refNum = generateReferenceNumber('MT');
      const ticket = {
        id: generateId(),
        referenceNumber: refNum,
        website: data.website,
        category: data.category,
        subject: data.subject,
        details: data.details,
        priority: data.priority || 'Normal',
        status: 'Submitted',
        dateSubmitted: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        submittedBy: state.currentUser?.name || 'Unknown',
        club: state.currentUser?.club || 'Unknown',
        assignedTo: null,
        comments: [],
      };
      
      const tickets = state.getData('maintenanceTickets') || [];
      tickets.push(ticket);
      state.setData('maintenanceTickets', tickets);
      state.logAction('Maintenance Ticket Created', refNum, `${data.subject}`);
      state.addNotification(`New maintenance ticket ${refNum}: ${data.subject}`, false);
      showToast(`Maintenance request ${refNum} submitted!`, 'success');
      switchView('maintenance');
    }
  });
}

/** Open PR Material Review Wizard */
function openPRReviewWizard() {
  openWizard({
    id: 'pr-review',
    title: 'Submit PR Material for Review',
    steps: [
      {
        title: 'Material Details',
        desc: 'Provide information about the material you want reviewed.',
        fields: [
          { id: 'materialType', label: 'Material Type', type: 'select', required: true, options: ['Flyer', 'Poster', 'Social Media Post', 'Video', 'Invitation', 'Banner', 'Certificate', 'Other'] },
          { id: 'subject', label: 'Material Title', type: 'text', required: true, placeholder: 'e.g., Annual Installation Ceremony Invitation' },
          { id: 'description', label: 'Description', type: 'textarea', required: true, placeholder: 'Describe the purpose and intended use of this material...', rows: 3 },
          { id: 'targetAudience', label: 'Target Audience', type: 'select', options: ['Club Members', 'General Public', 'Sponsors', 'District Officials', 'Multiple Audiences'] },
        ]
      },
      {
        title: 'Upload & Submit',
        desc: 'Upload the material and submit for review.',
        fields: [
          { id: 'file', label: 'Upload Material', type: 'file', required: true, accept: 'image/*,.pdf,.psd,.ai', hint: 'Accepted formats: PNG, JPG, PDF, PSD, AI' },
          { id: 'usageContext', label: 'Where will this be used?', type: 'select', options: ['Social Media', 'Print', 'Website', 'Email', 'Event Display', 'Multiple Channels'] },
          { id: 'reviewNotes', label: 'Notes for Reviewer', type: 'textarea', placeholder: 'Any specific areas you want feedback on...', rows: 3 },
        ]
      }
    ],
    onSubmit: (data) => {
      const refNum = generateReferenceNumber('PR');
      const review = {
        id: generateId(),
        referenceNumber: refNum,
        type: data.materialType,
        subject: data.subject,
        description: data.description,
        file: data.file || 'material.png',
        status: 'Submitted',
        dateSubmitted: new Date().toISOString(),
        submittedBy: state.currentUser?.name || 'Unknown',
        club: state.currentUser?.club || 'Unknown',
        feedback: null,
      };
      
      const reviews = state.getData('prReviews') || [];
      reviews.push(review);
      state.setData('prReviews', reviews);
      state.logAction('PR Material Submitted', refNum, `${data.materialType}: ${data.subject}`);
      state.addNotification(`PR material ${refNum} submitted for review`, false);
      showToast(`Material submitted for review as ${refNum}`, 'success');
      switchView('governance');
    }
  });
}

/** Open Inquiry Wizard */
function openInquiryWizard(isAnonymous) {
  const title = isAnonymous ? 'Anonymous Inquiry' : 'District Council Inquiry';
  const steps = [];
  
  if (isAnonymous) {
    steps.push({
      title: 'Privacy Notice',
      desc: 'Please read this important information about anonymous submissions.',
      fields: [
        { id: 'privacyNotice', label: '', type: 'info', content: '🔒 <strong>Your Privacy</strong><br><br>This form does not require an account or personal identification. Your identity will be protected unless disclosure is required by law or district policy.<br><br>⚠️ <strong>Important:</strong> Uploaded files (documents, images) may contain metadata such as author names, creation dates, or GPS coordinates. Consider removing this information before uploading if anonymity is critical.' },
      ]
    });
  }
  
  steps.push({
    title: 'Inquiry Category',
    desc: 'Select the category that best matches your inquiry.',
    fields: [
      { id: 'category', label: 'Select Category', type: 'select', required: true, options: [
        { value: 'Website Support', label: 'Website Support — Technical issues, website requests, hosting' },
        { value: 'PR & Branding', label: 'PR & Branding — Logo usage, compliance, material review' },
        { value: 'Club Governance', label: 'Club Governance — Club operations, officer roles, meetings' },
        { value: 'Verification', label: 'Verification — Disputes, complaints, mediation requests' },
        { value: 'General', label: 'General — Other district matters' },
      ]},
    ]
  });
  
  steps.push({
    title: 'Inquiry Details',
    desc: 'Provide the details of your inquiry.',
    fields: [
      { id: 'subject', label: 'Subject', type: 'text', required: true, placeholder: 'Brief subject of your inquiry...' },
      { id: 'message', label: 'Your Message', type: 'textarea', required: true, placeholder: 'Describe your inquiry in detail...', rows: 6 },
      ...(isAnonymous ? [
        { id: 'club', label: 'Related Club (Optional)', type: 'text', placeholder: 'If this relates to a specific club...' },
      ] : []),
      { id: 'attachment', label: 'Attachment (Optional)', type: 'file', hint: isAnonymous ? '⚠️ Files may contain identifying metadata' : 'Support documents, screenshots, etc.' },
    ]
  });
  
  openWizard({
    id: isAnonymous ? 'anonymous-inquiry' : 'identified-inquiry',
    title: title,
    steps: steps,
    onSubmit: (data) => {
      const refNum = generateReferenceNumber(isAnonymous ? 'AI' : 'INQ');
      const accessCode = isAnonymous ? generateAccessCode() : null;
      
      const inquiry = {
        id: generateId(),
        referenceNumber: refNum,
        accessCode: accessCode,
        category: data.category,
        subject: data.subject,
        message: data.message,
        club: isAnonymous ? (data.club || 'Not specified') : (state.currentUser?.club || 'Unknown'),
        isAnonymous: isAnonymous,
        status: 'Submitted',
        dateSubmitted: new Date().toISOString(),
        submittedBy: isAnonymous ? 'Anonymous' : (state.currentUser?.name || 'Unknown'),
        comments: [],
      };
      
      const inquiries = state.getData('inquiries') || [];
      inquiries.push(inquiry);
      state.setData('inquiries', inquiries);
      state.logAction('Inquiry Submitted', refNum, `${isAnonymous ? 'Anonymous' : 'Identified'}: ${data.category}`);
      
      if (isAnonymous) {
        state.addNotification(`New anonymous inquiry received (${data.category})`, true);
        showToast(`Anonymous inquiry submitted. Reference: ${refNum}`, 'success');
        setTimeout(() => {
          alert(`IMPORTANT — Save These Details\n\nReference Number: ${refNum}\nAccess Code: ${accessCode}\n\nYou will need both to track your inquiry. These will not be shown again.`);
        }, 500);
      } else {
        state.addNotification(`New inquiry ${refNum} from ${state.currentUser?.name}`, false);
        showToast(`Inquiry ${refNum} submitted successfully!`, 'success');
      }
      
      switchView('inquiries');
    }
  });
}

/** Open Appointment Request Wizard */
function openAppointmentWizard() {
  openWizard({
    id: 'appointment-request',
    title: 'Request District Council Appointment',
    steps: [
      {
        title: 'Appointment Details',
        desc: 'Select the portfolio and purpose for your appointment.',
        fields: [
          { id: 'portfolio', label: 'District Portfolio', type: 'select', required: true, options: [
            'District Governor', 'Council Secretary', 'Website Services', 'PR & Branding', 'Verification Team', 'General Council'
          ]},
          { id: 'purpose', label: 'Purpose of Appointment', type: 'textarea', required: true, placeholder: 'Describe why you need this appointment...', rows: 3 },
          { id: 'format', label: 'Meeting Format', type: 'select', required: true, options: ['Virtual (Google Meet/Zoom)', 'In-Person', 'No Preference'] },
        ]
      },
      {
        title: 'Schedule & Submit',
        desc: 'Select your preferred date and time.',
        fields: [
          { id: 'preferredDate', label: 'Preferred Date', type: 'date', required: true },
          { id: 'preferredTime', label: 'Preferred Time', type: 'select', required: true, options: ['09:00 AM', '10:00 AM', '11:00 AM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM'] },
          { id: 'alternateDate', label: 'Alternate Date (Optional)', type: 'date' },
          { id: 'documents', label: 'Supporting Documents (Optional)', type: 'file' },
          { id: 'additionalNotes', label: 'Additional Notes', type: 'textarea', placeholder: 'Any other information...', rows: 2 },
        ]
      }
    ],
    onSubmit: (data) => {
      const refNum = generateReferenceNumber('APT');
      const appointment = {
        id: generateId(),
        referenceNumber: refNum,
        portfolio: data.portfolio,
        purpose: data.purpose,
        format: data.format,
        date: data.preferredDate,
        time: data.preferredTime,
        alternateDate: data.alternateDate,
        status: 'Requested',
        requestedBy: state.currentUser?.name || 'Unknown',
        club: state.currentUser?.club || '',
        dateRequested: new Date().toISOString(),
        officer: null,
        meetingLink: null,
        outcome: null,
        comments: [],
      };
      
      const appointments = state.getData('appointments') || [];
      appointments.push(appointment);
      state.setData('appointments', appointments);
      state.logAction('Appointment Requested', refNum, `${data.portfolio}: ${data.purpose}`);
      state.addNotification(`New appointment request ${refNum} for ${data.portfolio}`, false);
      showToast(`Appointment request ${refNum} submitted!`, 'success');
      switchView('appointments');
    }
  });
}
