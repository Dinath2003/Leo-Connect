// === CONTEXTUAL HELP & AI ASSISTANT SYSTEM ===

let helpPanelOpen = false;

// Help content per module
const HELP_CONTENT = {
  dashboard: {
    title: 'Dashboard Help',
    sections: [
      {
        title: 'My Attention Area',
        text: 'The "My Attention" section shows items that require your immediate action. Emergency notices appear first, followed by high-priority items. Click any card to navigate directly to the relevant process.'
      },
      {
        title: 'Process Overview',
        text: 'Active processes across all modules are displayed as cards. Each card shows the current status, recent activity, and what will happen next. Select a card to open its workspace.'
      },
      {
        title: 'Quick Actions',
        text: 'Use the quick action buttons to start common tasks like submitting a website request, filing a maintenance ticket, or scheduling an appointment.'
      }
    ]
  },
  websites: {
    title: 'Website Services Help',
    sections: [
      {
        title: 'Requesting a New Website',
        text: 'Click "New Website Request" to start the guided wizard. You\'ll provide club information, website purpose, content requirements, technical features, and branding assets. The system will auto-fill your club details.'
      },
      {
        title: 'Understanding the Timeline',
        text: 'Each website request follows a defined lifecycle: Draft → Submitted → Feasibility Review → Design → Development → Testing → PR Review → Club Review → Publication → Handover. Click any completed stage to view what happened.'
      },
      {
        title: 'Smart Action Panel',
        text: 'The action panel tells you exactly what is expected from you right now. If no action is needed from you, it will show who is currently handling the request.'
      },
      {
        title: 'Project Websites',
        text: 'Project websites have additional fields based on the project type (conference, service project, fundraiser, etc.). The system will recommend a website structure based on your selection.'
      }
    ]
  },
  maintenance: {
    title: 'Maintenance Centre Help',
    sections: [
      {
        title: 'Submitting a Ticket',
        text: 'Select the affected website, choose an issue category, and describe the problem. The system may suggest common solutions before submission. If the issue persists, submit the ticket for technical review.'
      },
      {
        title: 'Priority Levels',
        text: 'Critical: Website down or security issue. High: Major functionality broken. Normal: Content updates or minor issues. Low: Enhancement requests or cosmetic changes.'
      },
      {
        title: 'Training Resources',
        text: 'The training section provides video tutorials, written guides, and an assessment quiz. Complete all training items to unlock your maintenance skills badge.'
      }
    ]
  },
  governance: {
    title: 'PR Standards & Compliance Help',
    sections: [
      {
        title: 'Branding Library',
        text: 'Download official logos, templates, colour palettes, and brand guidelines. Always use the latest version marked as "Current". Archived resources should not be used in new materials.'
      },
      {
        title: 'Material Review',
        text: 'Submit flyers, invitations, and other PR materials for review before publication. The PR team will check branding compliance and provide feedback.'
      },
      {
        title: 'Compliance Cases',
        text: 'If a branding violation is detected, you\'ll receive a compliance notice. Acknowledge the notice first, then submit correction evidence. The PR team will review and close the case.'
      },
      {
        title: 'Emergency Notices',
        text: 'Emergency notices require immediate action. Acknowledge receipt, then follow the instructions (remove post, correct flyer, etc.). Upload proof of compliance.'
      }
    ]
  },
  verification: {
    title: 'Mediation Cases Help',
    sections: [
      {
        title: 'Filing a Case',
        text: 'Select the classification, provide a detailed description, and upload any supporting evidence. The case will be assigned to the Verification Team for review.'
      },
      {
        title: 'Case Process',
        text: 'Cases follow: Filed → Team Assigned → Evidence Collection → Meeting Scheduled → Meeting Held → Decision → Action Implementation → Closed. Each stage requires specific actions.'
      },
      {
        title: 'Meetings',
        text: 'Verification meetings will be scheduled through the platform. You\'ll receive the date, time, location/link, agenda, and required documents. After the meeting, minutes and decisions will be recorded.'
      }
    ]
  },
  appointments: {
    title: 'Appointments Help',
    sections: [
      {
        title: 'Booking an Appointment',
        text: 'Select the district portfolio, appointment purpose, and preferred format (in-person or virtual). Choose an available date and time from the calendar. Unavailable slots are greyed out.'
      },
      {
        title: 'Rescheduling',
        text: 'If you need to reschedule, use the reschedule option on your appointment card. This updates the existing appointment without creating a duplicate.'
      }
    ]
  },
  inquiries: {
    title: 'Inquiries Help',
    sections: [
      {
        title: 'Identified Inquiries',
        text: 'Submit questions or concerns with your identity visible to the District Council. Your inquiry will be routed to the relevant portfolio. Official responses are clearly marked.'
      },
      {
        title: 'Anonymous Inquiries',
        text: 'Submit concerns without revealing your identity. You\'ll receive a reference number and access code. Use these to track your inquiry and communicate with the Council. Keep these credentials secure — they are shown only once.'
      },
      {
        title: 'Privacy Protection',
        text: 'Be aware that uploaded files may contain metadata (author names, GPS data). Consider removing this information before uploading if anonymity is important.'
      }
    ]
  },
  admin: {
    title: 'Administration Help',
    sections: [
      {
        title: 'User Management',
        text: 'Create, suspend, and manage user accounts. Each user is assigned a role that determines their platform access.'
      },
      {
        title: 'Club Management',
        text: 'View and manage club records, branding compliance status, and officer assignments.'
      },
      {
        title: 'Annual Transition',
        text: 'The Leoistic year transition wizard guides you through creating the new year, transferring active cases, resetting assignments, and archiving historical data. Type CONFIRM to proceed.'
      }
    ]
  },
  audit: {
    title: 'Audit Trail Help',
    sections: [
      {
        title: 'Understanding Audit Logs',
        text: 'Every action in the platform is recorded with timestamp, user, role, action type, and affected record. Use the search bar to filter logs by any field.'
      },
      {
        title: 'Exporting Data',
        text: 'Click "Export CSV" to download the audit trail as a spreadsheet for external review or compliance reporting.'
      }
    ]
  }
};

// AI Assistant suggestions per context
const AI_SUGGESTIONS = {
  websiteRequest: {
    clubWebsite: [
      'Based on similar club websites, consider adding these pages: About Us, Officers, Projects, News, Gallery, Contact',
      'Most clubs benefit from a member registration page for event sign-ups',
      'A social media integration section can increase your club\'s online presence'
    ],
    projectWebsite: {
      conference: [
        'Conference websites typically need: Speakers, Schedule, Registration, Venue, Sponsors, FAQ pages',
        'Consider adding early bird pricing with a countdown timer',
        'An agenda/schedule page with session details improves attendee experience'
      ],
      service: [
        'Service project websites benefit from: Impact Goals, Volunteer Registration, Location Map, Gallery, Sponsor Recognition',
        'Adding a progress tracker showing impact metrics engages stakeholders',
        'Consider a volunteer sign-up form with role preferences'
      ],
      fundraiser: [
        'Fundraiser websites should include: Campaign Goal, Donation Options, Impact Stories, Sponsors, Updates',
        'A live donation progress bar creates urgency and motivation',
        'Consider adding recurring donation options'
      ]
    }
  },
  prReview: [
    'Ensure the Leo emblem is placed according to the District Brand Guidelines',
    'Check that the district logo is not stretched or distorted',
    'Verify that the official colour palette (#7B45F0, #6631DB, #491AB1) is used correctly',
    'Text on the flyer should meet minimum contrast ratios for readability'
  ],
  maintenance: [
    'Before submitting a ticket, try clearing your browser cache and hard-refreshing (Ctrl+Shift+R)',
    'If the website shows a security warning, do not ignore it — submit a Critical priority ticket',
    'For content updates, check the Maintenance training videos first — many updates can be done by the club'
  ]
};

/** Initialize help system */
function initHelp() {
  // Create help panel
  if (!document.getElementById('help-panel')) {
    const panel = document.createElement('div');
    panel.id = 'help-panel';
    panel.className = 'help-panel';
    panel.setAttribute('role', 'complementary');
    panel.setAttribute('aria-label', 'Help');
    panel.innerHTML = `
      <div class="help-panel-header">
        <h2 style="font-family:var(--font-display); font-size:1.1rem; font-weight:700; margin:0;">Help & Guidance</h2>
        <button class="btn btn-secondary btn-sm" onclick="closeHelpPanel()" aria-label="Close help">✕</button>
      </div>
      <div class="help-panel-body" id="help-panel-body"></div>
    `;
    document.body.appendChild(panel);
  }
}

/** Open help panel for current view */
function openHelpPanel(moduleId) {
  const panel = document.getElementById('help-panel');
  if (!panel) return;
  
  // Determine current module if not specified
  if (!moduleId) {
    const activeView = document.querySelector('.view-section.active');
    if (activeView) {
      moduleId = activeView.id.replace('view-', '');
    }
  }
  
  renderHelpContent(moduleId || 'dashboard');
  panel.classList.add('open');
  helpPanelOpen = true;
}

/** Close help panel */
function closeHelpPanel() {
  const panel = document.getElementById('help-panel');
  if (panel) {
    panel.classList.remove('open');
    helpPanelOpen = false;
  }
}

/** Toggle help panel */
function toggleHelpPanel() {
  if (helpPanelOpen) closeHelpPanel();
  else openHelpPanel();
}

/** Render help content for a module */
function renderHelpContent(moduleId) {
  const body = document.getElementById('help-panel-body');
  if (!body) return;
  
  const content = HELP_CONTENT[moduleId];
  if (!content) {
    body.innerHTML = `
      <div style="padding: 40px 20px; text-align: center;">
        <div style="font-size: 2rem; margin-bottom: 12px; opacity: 0.3;">📖</div>
        <div style="font-size: 0.85rem; color: var(--slate-blue);">Help content for this section is coming soon.</div>
      </div>
    `;
    return;
  }
  
  let html = `<div class="help-section">`;
  html += `<h3 style="font-family:var(--font-display); font-size:1rem; font-weight:700; margin-bottom:16px;">${content.title}</h3>`;
  
  content.sections.forEach(section => {
    html += `
      <div class="help-tip">
        <div class="help-tip-title">${section.title}</div>
        <div class="help-tip-text">${section.text}</div>
      </div>
    `;
  });
  html += `</div>`;
  
  // AI suggestions
  html += `
    <div class="help-section" style="margin-top:24px; padding-top:20px; border-top:1px solid var(--glass-border);">
      <h3 style="font-family:var(--font-display); font-size:0.9rem; font-weight:700; margin-bottom:4px; display:flex; align-items:center; gap:8px;">
        ✨ AI Assistant
      </h3>
      <div style="font-size:0.72rem; color:var(--slate-blue); margin-bottom:14px; font-style:italic;">
        Automated guidance — not official approval
      </div>
  `;
  
  const suggestions = getAISuggestions(moduleId);
  if (suggestions.length > 0) {
    suggestions.forEach(tip => {
      html += `
        <div class="help-tip" style="border-left:2px solid var(--hyper-magenta); border-radius:0 10px 10px 0;">
          <div class="help-tip-text">${tip}</div>
        </div>
      `;
    });
  } else {
    html += `<div style="font-size:0.78rem; color:var(--slate-blue); opacity:0.6;">No contextual suggestions available for this section.</div>`;
  }
  
  html += `</div>`;
  body.innerHTML = html;
}

/** Get AI suggestions for current context */
function getAISuggestions(moduleId) {
  switch (moduleId) {
    case 'websites':
      return AI_SUGGESTIONS.websiteRequest.clubWebsite;
    case 'maintenance':
      return AI_SUGGESTIONS.maintenance;
    case 'governance':
      return AI_SUGGESTIONS.prReview;
    default:
      return [
        'Use the "My Attention" area on your dashboard to prioritize your daily tasks',
        'You can use ⌘K (or Ctrl+K) to quickly search across all modules',
        'Emergency notices always appear at the top of your dashboard'
      ];
  }
}
