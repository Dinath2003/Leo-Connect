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
    referenceNumber: "WR-2026-0001",
    clubId: "colombo-centennial",
    club: "Leo Club of Colombo Centennial",
    clubName: "Leo Club of Colombo Centennial",
    type: "Club Website",
    preferredDomain: "colombocentennial.leoclubs.org",
    purpose: "Centralize club updates, membership registration, and showcase project highlights.",
    hosting: "District Shared Hosting",
    targetDate: "2026-08-30",
    status: "Development in Progress",
    assignedTo: "Naveen Alwis",
    assignedDev: "Naveen Alwis",
    priority: "Normal",
    submissionDate: "2026-07-02",
    updatedAt: "2026-07-12T14:30:00",
    logo: "colombo_cent_logo.png",
    comments: [
      { sender: "Dilan Fernando", role: "Club President", text: "Please let us know if the hosting setup is ready.", date: "2026-07-02" },
      { sender: "Naveen Alwis", role: "District Technical Team", text: "Feasibility review completed. Development repository initialized.", date: "2026-07-05" },
      { sender: "Naveen Alwis", role: "District Technical Team", text: "Homepage layout and navigation structure finalized. Moving to inner page development.", date: "2026-07-12" }
    ],
    timeline: [
      { stage: "Submitted", date: "2026-07-02", completedBy: "Dilan Fernando", notes: "Initial request submitted with club branding assets." },
      { stage: "Feasibility Review", date: "2026-07-04", completedBy: "Naveen Alwis", notes: "Technical feasibility confirmed. Shared hosting plan adequate." },
      { stage: "Design in Progress", date: "2026-07-06", completedBy: "Naveen Alwis", notes: "Mockups created and sent to club president for feedback." },
      { stage: "Development in Progress", date: "2026-07-10", completedBy: "Naveen Alwis", notes: "Repository initialized. Homepage under construction." }
    ],
    stagingLink: "https://staging.colombocentennial.temp-url.com",
    qaChecks: { responsive: true, links: true, forms: false, branding: false, speed: false }
  },
  {
    id: "REQ-1002",
    referenceNumber: "WR-2026-0002",
    clubId: "kandy-metro",
    club: "Leo Club of Kandy Metro",
    clubName: "Leo Club of Kandy Metro",
    type: "Project Website",
    preferredDomain: "spark.leokandymetro.org",
    purpose: "Participant registration and sponsor showcase for the Annual Spark 2026 Sports Event.",
    hosting: "District Shared Hosting",
    targetDate: "2026-08-15",
    status: "Published",
    assignedTo: "Naveen Alwis",
    assignedDev: "Naveen Alwis",
    priority: "Normal",
    submissionDate: "2026-06-25",
    updatedAt: "2026-07-08T16:00:00",
    logo: "spark_event_logo.png",
    comments: [
      { sender: "Manuja Bandara", role: "Club President", text: "Staging links look correct, ready to publish.", date: "2026-06-28" },
      { sender: "Sanduni Perera", role: "District PR Team", text: "Branding compliance verified — approved for publication.", date: "2026-07-01" }
    ],
    timeline: [
      { stage: "Submitted", date: "2026-06-25", completedBy: "Manuja Bandara", notes: "Project site request with event branding pack." },
      { stage: "Feasibility Review", date: "2026-06-26", completedBy: "Naveen Alwis", notes: "Simple one-pager. Fast-tracked." },
      { stage: "Design in Progress", date: "2026-06-27", completedBy: "Naveen Alwis", notes: "Event page layout designed." },
      { stage: "Development in Progress", date: "2026-06-28", completedBy: "Naveen Alwis", notes: "Site developed and deployed to staging." },
      { stage: "Internal Testing", date: "2026-06-29", completedBy: "Naveen Alwis", notes: "All QA checks passed." },
      { stage: "PR and Branding Review", date: "2026-07-01", completedBy: "Sanduni Perera", notes: "Branding elements verified compliant." },
      { stage: "Club Content Review", date: "2026-07-03", completedBy: "Manuja Bandara", notes: "Content approved by club president." },
      { stage: "Published", date: "2026-07-08", completedBy: "Naveen Alwis", notes: "Live at spark.leokandymetro.org" }
    ],
    stagingLink: "https://spark-staging.leokandymetro.org",
    qaChecks: { responsive: true, links: true, forms: true, branding: true, speed: true },
    handoverAcknowledge: true
  },
  {
    id: "REQ-1003",
    referenceNumber: "WR-2026-0003",
    clubId: "jaffna-stars",
    club: "Leo Club of Jaffna Stars",
    clubName: "Leo Club of Jaffna Stars",
    type: "Club Website",
    preferredDomain: "jaffnastars.leoclubs.org",
    purpose: "Membership portal and project archive to attract new Leos and showcase community impact.",
    hosting: "District Shared Hosting",
    targetDate: "2026-09-15",
    status: "Submitted",
    assignedTo: "",
    assignedDev: "",
    priority: "Normal",
    submissionDate: "2026-07-13",
    updatedAt: "2026-07-13T09:15:00",
    logo: "jaffna_stars_logo.png",
    comments: [
      { sender: "K. Satheesh", role: "Club President", text: "We need a bilingual website (English and Tamil). Please consider this during feasibility.", date: "2026-07-13" }
    ],
    timeline: [
      { stage: "Submitted", date: "2026-07-13", completedBy: "K. Satheesh", notes: "Bilingual club website request submitted." }
    ],
    stagingLink: "",
    qaChecks: { responsive: false, links: false, forms: false, branding: false, speed: false }
  },
  {
    id: "REQ-1004",
    referenceNumber: "WR-2026-0004",
    clubId: "galle-heritage",
    club: "Leo Club of Galle Heritage",
    clubName: "Leo Club of Galle Heritage",
    type: "Project Website",
    preferredDomain: "greenwave.leogalle.org",
    purpose: "Landing page for the Green Wave 2026 environmental awareness campaign — donation portal and volunteer sign-up.",
    hosting: "District Shared Hosting",
    targetDate: "2026-08-25",
    status: "PR and Branding Review",
    assignedTo: "Naveen Alwis",
    assignedDev: "Naveen Alwis",
    priority: "High",
    submissionDate: "2026-07-01",
    updatedAt: "2026-07-14T11:00:00",
    logo: "greenwave_logo.png",
    comments: [
      { sender: "Ishara Silva", role: "Club President", text: "Urgent — the campaign launches mid-August, we need this site live ASAP.", date: "2026-07-01" },
      { sender: "Naveen Alwis", role: "District Technical Team", text: "Site developed and tested. Forwarding to PR team for branding review.", date: "2026-07-14" }
    ],
    timeline: [
      { stage: "Submitted", date: "2026-07-01", completedBy: "Ishara Silva", notes: "High-priority campaign site request." },
      { stage: "Feasibility Review", date: "2026-07-02", completedBy: "Naveen Alwis", notes: "Approved. Campaign urgency noted." },
      { stage: "Design in Progress", date: "2026-07-04", completedBy: "Naveen Alwis", notes: "Environmental theme with green/earth tones. Club approved mockup." },
      { stage: "Development in Progress", date: "2026-07-07", completedBy: "Naveen Alwis", notes: "Donation portal integrated with payment gateway stub." },
      { stage: "Internal Testing", date: "2026-07-12", completedBy: "Naveen Alwis", notes: "All checks passed except minor branding review pending." },
      { stage: "PR and Branding Review", date: "2026-07-14", completedBy: "", notes: "Awaiting PR team approval." }
    ],
    stagingLink: "https://staging.greenwave.leogalle.org",
    qaChecks: { responsive: true, links: true, forms: true, branding: false, speed: true }
  }
];

const DEFAULT_ACTIVE_SITES = [
  { club: "Leo Club of Kandy Metro", domain: "spark.leokandymetro.org", registrar: "GoDaddy", ssl: "Active (Auto-Renew)", hosting: "District Shared Host", expiry: "2027-06-25", responsibility: "District Council" }
];

const DEFAULT_MAINTENANCE_TICKETS = [
  {
    id: "MNT-2001",
    clubId: "colombo-centennial",
    clubName: "Leo Club of Colombo Centennial",
    category: "Content update",
    priority: "Normal",
    subject: "Officer details swap",
    details: "Need to update Vice President profile photo on the homepage. New officer was installed at the mid-year board change.",
    dateSubmitted: "2026-07-10",
    updatedAt: "2026-07-11T09:00:00",
    status: "Work in Progress",
    assignedTo: "Naveen Alwis",
    comments: [
      { sender: "Naveen Alwis", role: "District Technical Team", text: "Will update the photo and title. Please send the new headshot in 400x400 resolution.", date: "2026-07-11" }
    ]
  },
  {
    id: "MNT-2002",
    clubId: "kandy-metro",
    clubName: "Leo Club of Kandy Metro",
    category: "Bug report",
    priority: "Critical",
    subject: "Registration form not submitting on mobile",
    details: "The participant registration form on spark.leokandymetro.org fails silently on iOS Safari. No error message shown, data not captured. Multiple registrants have reported this issue.",
    dateSubmitted: "2026-07-12",
    updatedAt: "2026-07-12T16:45:00",
    status: "Triage",
    assignedTo: "",
    comments: [
      { sender: "Manuja Bandara", role: "Club President", text: "We are losing event registrations. This is very urgent — the event is in 3 weeks.", date: "2026-07-12" }
    ]
  },
  {
    id: "MNT-2003",
    clubId: "galle-heritage",
    clubName: "Leo Club of Galle Heritage",
    category: "Feature request",
    priority: "Low",
    subject: "Add event photo gallery section",
    details: "Would like a new photo gallery page added to showcase completed community projects. Should support image uploads and captions.",
    dateSubmitted: "2026-07-08",
    updatedAt: "2026-07-09T10:30:00",
    status: "Submitted",
    assignedTo: "",
    comments: []
  }
];

const DEFAULT_COMPLIANCE_CASES = [
  {
    id: "CMP-3001",
    clubId: "galle-heritage",
    club: "Leo Club of Galle Heritage",
    clubName: "Leo Club of Galle Heritage",
    category: "Incorrect logo",
    severity: "Level 2 — Required Change",
    deadline: "2026-07-20",
    channelUrl: "https://instagram.com/p/mock-galle-post",
    steps: "Remove the modified Lions emblem. Replace with the official version in Periwinkle guidelines.",
    assignedOfficer: "Sanduni Perera",
    status: "Under Review",
    dateLogged: "2026-07-08",
    updatedAt: "2026-07-12T14:00:00",
    responseEvidence: "",
    responseExplain: ""
  },
  {
    id: "CMP-3002",
    clubId: "kandy-metro",
    club: "Leo Club of Kandy Metro",
    clubName: "Leo Club of Kandy Metro",
    category: "Non-standard typography",
    severity: "Level 1 — Advisory Notice",
    deadline: "2026-07-25",
    channelUrl: "https://facebook.com/mock-kandy-post",
    steps: "Event poster uses unauthorized font for club name. Replace with approved Montserrat Bold typeface per brand guidelines.",
    assignedOfficer: "Sanduni Perera",
    status: "Action Taken",
    dateLogged: "2026-07-05",
    updatedAt: "2026-07-14T10:00:00",
    responseEvidence: "corrected_poster_v2.png",
    responseExplain: "Updated the poster with Montserrat Bold and reposted to all social channels. Original post has been archived."
  },
  {
    id: "CMP-3003",
    clubId: "colombo-centennial",
    club: "Leo Club of Colombo Centennial",
    clubName: "Leo Club of Colombo Centennial",
    category: "Unauthorized colour scheme",
    severity: "Level 2 — Required Change",
    deadline: "2026-07-18",
    channelUrl: "https://instagram.com/p/mock-colombo-colors",
    steps: "The Instagram story highlight covers use non-standard gradient backgrounds (red/orange). Replace with approved Periwinkle colour palette.",
    assignedOfficer: "Sanduni Perera",
    status: "Issued",
    dateLogged: "2026-07-10",
    updatedAt: "2026-07-10T16:30:00",
    responseEvidence: "",
    responseExplain: ""
  }
];

const DEFAULT_EMERGENCY_NOTICES = [
  { id: "EMG-4001", clubId: "galle-heritage", clubName: "Leo Club of Galle Heritage", headline: "IMMEDIATE TAKEDOWN: Distorted Emblems on Banner", instruction: "A secondary event flyer uses a stretched/distorted Leo emblem and incorrect corporate colors. Take it down immediately and submit correction evidence.", severity: "Level 4 — Emergency", dateDispatched: "2026-07-12", acknowledged: false, evidence: "" }
];

const DEFAULT_VERIFICATION_CASES = [
  {
    id: "VER-5001",
    clubId: "colombo-centennial",
    clubName: "Leo Club of Colombo Centennial",
    classification: "Project approval clarification",
    subject: "Inter-district joint service project validation",
    description: "Requesting district clarification and formal verification for joint project funding distribution with District 306 B2. The project budget exceeds standard thresholds and requires multi-district sign-off.",
    officerAssigned: "Dilhara Silva",
    meetingDate: "2026-07-15",
    status: "Meeting Scheduling",
    updatedAt: "2026-07-13T08:30:00",
    evidence: "proposal_doc.pdf",
    minutes: "",
    outcome: ""
  },
  {
    id: "VER-5002",
    clubId: "kandy-metro",
    clubName: "Leo Club of Kandy Metro",
    classification: "Membership dispute",
    subject: "Contested board election results — Secretary position",
    description: "A formal complaint was filed regarding the club's mid-year board election process for the Secretary position. The complainant alleges insufficient notice period and quorum issues during the election meeting.",
    officerAssigned: "Dilhara Silva",
    meetingDate: "2026-07-20",
    status: "Investigation",
    updatedAt: "2026-07-14T15:00:00",
    evidence: "election_minutes_draft.pdf",
    minutes: "",
    outcome: ""
  }
];

const DEFAULT_APPOINTMENTS = [
  {
    id: "APT-6001",
    clubId: "colombo-centennial",
    clubName: "Leo Club of Colombo Centennial",
    officer: "Sanduni Perera",
    designation: "District PR Team",
    type: "PR consultation",
    dateTime: "2026-07-14 10:30",
    format: "Online Meeting",
    purpose: "Review custom logo alignment guidelines before launching the project.",
    status: "Approved",
    updatedAt: "2026-07-13T08:00:00"
  },
  {
    id: "APT-6002",
    clubId: "galle-heritage",
    clubName: "Leo Club of Galle Heritage",
    officer: "Dilhara Silva",
    designation: "District Verification Committee",
    type: "Compliance discussion",
    dateTime: "2026-07-18 14:00",
    format: "In-Person Meeting",
    purpose: "Discuss the Level 4 emergency compliance notice and remediation plan for distorted emblem usage.",
    status: "Pending",
    updatedAt: "2026-07-15T09:00:00"
  },
  {
    id: "APT-6003",
    clubId: "jaffna-stars",
    clubName: "Leo Club of Jaffna Stars",
    officer: "Naveen Alwis",
    designation: "District Technical Team",
    type: "Technical consultation",
    dateTime: "2026-07-22 11:00",
    format: "Online Meeting",
    purpose: "Discuss bilingual website architecture (English/Tamil) and CMS options for ongoing content management.",
    status: "Approved",
    updatedAt: "2026-07-15T10:00:00"
  }
];

const DEFAULT_INQUIRIES = [
  {
    id: "INQ-7001",
    sender: "Dilan Fernando",
    role: "Club President",
    clubId: "colombo-centennial",
    category: "Finance",
    subject: "District dues invoice delay",
    message: "We haven't received the second quarter invoice for district membership dues yet. Please verify and resend to the club treasurer.",
    date: "2026-07-09",
    updatedAt: "2026-07-10T11:30:00",
    visibility: "Identified",
    assignedTeam: "Treasurer Office",
    status: "Resolved",
    comments: [
      { sender: "District Secretary", text: "Invoice dispatched to your official club email. Let us know if you got it.", date: "2026-07-10" }
    ]
  },
  {
    id: "INQ-7002",
    sender: "Manuja Bandara",
    role: "Club President",
    clubId: "kandy-metro",
    category: "Technical",
    subject: "Email forwarding not working for club domain",
    message: "The email forwarding setup for info@leokandymetro.org has stopped working since last week. All emails are bouncing. This is affecting our event registrations.",
    date: "2026-07-11",
    updatedAt: "2026-07-12T14:00:00",
    visibility: "Identified",
    assignedTeam: "IT Team",
    status: "Work in Progress",
    comments: [
      { sender: "Naveen Alwis", text: "Investigating the DNS MX records. Likely a registrar propagation issue after the recent domain transfer.", date: "2026-07-12" }
    ]
  },
  {
    id: "INQ-7003",
    sender: "K. Satheesh",
    role: "Club President",
    clubId: "jaffna-stars",
    category: "General",
    subject: "District council meeting calendar access",
    message: "Our club officers cannot access the shared Google Calendar for district council meetings. Could you add our new board members' email addresses to the shared calendar?",
    date: "2026-07-14",
    updatedAt: "2026-07-14T16:00:00",
    visibility: "Identified",
    assignedTeam: "Secretary Office",
    status: "Submitted",
    comments: []
  }
];

const DEFAULT_AUDIT_LOGS = [
  { timestamp: "2026-07-12 18:24:12", user: "Dinesh Wijesooriya", role: "Super Admin", action: "User Account Invitation Sent", record: "usr-2 (Dilan Fernando)", ip: "192.168.1.100" },
  { timestamp: "2026-07-12 19:05:00", user: "Sanduni Perera", role: "District PR Team", action: "Compliance notice issued", record: "CMP-3001", ip: "192.168.1.104" },
  { timestamp: "2026-07-13 09:15:00", user: "K. Satheesh", role: "Club President", action: "Website request submitted", record: "REQ-1003", ip: "203.94.12.55" },
  { timestamp: "2026-07-14 11:00:00", user: "Naveen Alwis", role: "District Technical Team", action: "Website forwarded to PR review", record: "REQ-1004", ip: "192.168.1.106" }
];

const DEFAULT_NOTIFICATIONS = [
  { id: "NTF-1", text: "Emergency Notice dispatch: Galle Heritage has been issued a Level 4 Takedown instruction.", date: "2026-07-12 19:10", urgent: true },
  { id: "NTF-2", text: "New website request REQ-1001 submitted by Colombo Centennial.", date: "2026-07-02 14:30", urgent: false },
  { id: "NTF-3", text: "New website request REQ-1003 submitted by Jaffna Stars — bilingual site.", date: "2026-07-13 09:20", urgent: false },
  { id: "NTF-4", text: "Maintenance ticket MNT-2002 flagged as Critical — mobile form failure on Kandy Metro site.", date: "2026-07-12 17:00", urgent: true },
  { id: "NTF-5", text: "Compliance case CMP-3002 (Kandy Metro) has submitted correction evidence for review.", date: "2026-07-14 10:05", urgent: false }
];

const QUIZ_QUESTIONS = [
  { q: "What is the correct background color pairing for the Periwinkle logo?", options: ["Deep Black (#040607) or Velvet Purple (#5B2A62)", "Bright Orange or Red", "White only", "Lime Green"], correct: 0 },
  { q: "When using the Leo logo on social media, what logo safety space rule applies?", options: ["No space, overlap is allowed", "Minimum padding equal to 50% of logo width", "Minimum padding equal to 25% of the logo height around all edges", "Always cover it with a text box"], correct: 2 },
  { q: "Who is authorized to submit a final website service request?", clone: true, options: ["Club Secretary", "Club President only", "PR Officer", "Any individual Leo"], correct: 1 }
];


// ==========================================
// ENHANCED MOCK DATA
// ==========================================

const DEFAULT_WEBSITE_HANDOVERS = [
  {
    id: 'handover-001',
    websiteRequestId: 'wr-002',
    clubId: 'club-001',
    clubName: 'Leo Club of Colombo Centennial',
    websiteUrl: 'https://colombocentennial.leodistrict306d7.org',
    handoverDate: '2026-06-20',
    completedSteps: ['url-info', 'ownership', 'maintenance', 'security'],
    pendingSteps: ['domain-renewal', 'training', 'support'],
    acknowledgements: {
      'ownership': { acknowledged: true, date: '2026-06-20', by: 'Dilan Fernando' },
      'maintenance': { acknowledged: true, date: '2026-06-20', by: 'Dilan Fernando' },
      'security': { acknowledged: false },
    },
    assessmentCompleted: false,
    status: 'In Progress'
  }
];

const DEFAULT_DIGITAL_ASSETS = [
  {
    id: 'asset-001',
    clubId: 'club-001',
    clubName: 'Leo Club of Colombo Centennial',
    type: 'Website',
    name: 'Colombo Centennial Club Website',
    url: 'https://colombocentennial.leodistrict306d7.org',
    status: 'Active',
    domainExpiry: '2027-03-15',
    sslValid: true,
    lastBackup: '2026-07-10',
    hostingStatus: 'Active',
    responsibleOfficer: 'Dilan Fernando',
    healthChecks: { availability: 'good', ssl: 'good', backup: 'good', domain: 'good' }
  }
];

const DEFAULT_FORM_DRAFTS = {};

const DEFAULT_USER_PREFERENCES = {
  quietMode: false,
  reducedMotion: false,
  notificationSummary: 'none',
  focusMode: false,
};


// ==========================================
// HELPER FUNCTIONS
// ==========================================

/**
 * Get next expected action based on process type and current status
 * @param {string} processType - 'website' | 'maintenance' | 'compliance'
 * @param {string} status - Current status label
 * @returns {string}
 */
function getNextAction(processType, status) {
  const actions = {
    website: {
      'Submitted': 'Initial feasibility review by district team',
      'Feasibility Review': 'Technical assessment and assignment',
      'Design in Progress': 'Design mockups creation',
      'Development in Progress': 'Website development and coding',
      'Internal Testing': 'QA testing and bug fixes',
      'PR and Branding Review': 'PR team branding compliance check',
      'Club Content Review': 'Club president content approval',
    },
    maintenance: {
      'Submitted': 'Triage and priority assessment',
      'Triage': 'Assignment to technical team',
      'Assigned': 'Investigation and diagnosis',
      'Work in Progress': 'Fix implementation and testing',
    },
    compliance: {
      'Under Review': 'Club acknowledgement required',
      'Issued': 'Club must submit correction evidence',
      'Action Taken': 'District review of correction',
    },
  };
  return (actions[processType] && actions[processType][status]) || 'Processing...';
}


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
    // Seed new data stores (safe to run every time — only writes if key is absent)
    if (!localStorage.getItem('websiteHandovers')) localStorage.setItem('websiteHandovers', JSON.stringify(DEFAULT_WEBSITE_HANDOVERS));
    if (!localStorage.getItem('digitalAssets')) localStorage.setItem('digitalAssets', JSON.stringify(DEFAULT_DIGITAL_ASSETS));
    if (!localStorage.getItem('formDrafts')) localStorage.setItem('formDrafts', JSON.stringify(DEFAULT_FORM_DRAFTS));
    if (!localStorage.getItem('userPreferences')) localStorage.setItem('userPreferences', JSON.stringify(DEFAULT_USER_PREFERENCES));
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

  // ==========================================
  // FORM DRAFT MANAGEMENT
  // ==========================================

  /**
   * Save form draft to localStorage
   * @param {string} formId - Unique form identifier
   * @param {Object} data - Form data to persist
   */
  saveDraft(formId, data) {
    const drafts = this.getData('formDrafts') || {};
    drafts[formId] = { data, savedAt: new Date().toISOString() };
    this.setData('formDrafts', drafts);
  }

  /**
   * Load form draft from localStorage
   * @param {string} formId - Unique form identifier
   * @returns {Object|null} Draft object with { data, savedAt } or null
   */
  loadDraft(formId) {
    const drafts = this.getData('formDrafts') || {};
    return drafts[formId] || null;
  }

  /**
   * Clear a specific form draft
   * @param {string} formId - Unique form identifier
   */
  clearDraft(formId) {
    const drafts = this.getData('formDrafts') || {};
    delete drafts[formId];
    this.setData('formDrafts', drafts);
  }

  // ==========================================
  // USER PREFERENCES
  // ==========================================

  /**
   * Get all user preferences (with defaults)
   * @returns {Object}
   */
  getPreferences() {
    return this.getData('userPreferences') || DEFAULT_USER_PREFERENCES;
  }

  /**
   * Update a single user preference
   * @param {string} key - Preference key
   * @param {*} value - Preference value
   */
  setPreference(key, value) {
    const prefs = this.getPreferences();
    prefs[key] = value;
    this.setData('userPreferences', prefs);
  }

  // ==========================================
  // ATTENTION ITEMS (ROLE-BASED)
  // ==========================================

  /**
   * Get items requiring the current user's attention, sorted by priority
   * @returns {Array<Object>}
   */
  getAttentionItems() {
    const user = this.currentUser;
    if (!user) return [];
    const items = [];
    const role = user.role;
    const requests = this.getData('websiteRequests') || [];
    const tickets = this.getData('maintenanceTickets') || [];
    const compliance = this.getData('complianceCases') || [];
    const emergencies = this.getData('emergencyNotices') || [];
    const verification = this.getData('verificationCases') || [];
    const appointments = this.getData('appointments') || [];
    const inquiries = this.getData('inquiries') || [];

    if (role === 'super-admin') {
      requests.filter(r => r.status === 'Submitted').forEach(r => {
        items.push({ type: 'website', icon: '🌐', title: r.preferredDomain || r.domain || r.title || 'Website Request', ref: r.id, status: r.status, action: 'Review and assign', priority: 'Normal', module: 'websites' });
      });
      compliance.filter(c => c.status === 'Action Taken').forEach(c => {
        items.push({ type: 'compliance', icon: '🛡️', title: (c.club || c.clubName) + ' — ' + c.category, ref: c.id, status: c.status, action: 'Review correction evidence', priority: 'High', module: 'governance' });
      });
      verification.filter(v => v.status !== 'Closed').forEach(v => {
        items.push({ type: 'verification', icon: '⚖️', title: v.subject, ref: v.id, status: v.status, action: 'Review case progress', priority: 'Normal', module: 'verification' });
      });
    }

    if (role === 'club-president') {
      requests.filter(r => r.status === 'Club Content Review').forEach(r => {
        items.push({ type: 'website', icon: '🌐', title: r.preferredDomain || r.domain || r.title || 'Website Review', ref: r.id, status: r.status, action: 'Review and approve content', priority: 'High', module: 'websites' });
      });
      emergencies.filter(e => !e.acknowledged).forEach(e => {
        items.push({ type: 'emergency', icon: '🚨', title: e.headline, ref: e.id, status: 'Emergency', action: 'Acknowledge and take action immediately', priority: 'Emergency', module: 'governance' });
      });
      compliance.filter(c => c.status === 'Under Review' || c.status === 'Issued').forEach(c => {
        items.push({ type: 'compliance', icon: '⚠️', title: c.category, ref: c.id, status: c.status, action: 'Submit correction evidence', priority: 'High', module: 'governance' });
      });
    }

    if (role === 'district-tech') {
      requests.filter(r => ['Feasibility Review', 'Design in Progress', 'Development in Progress', 'Internal Testing'].includes(r.status)).forEach(r => {
        items.push({ type: 'website', icon: '💻', title: r.preferredDomain || r.domain || r.title || 'Website Request', ref: r.id, status: r.status, action: 'Continue development', priority: 'Normal', module: 'websites' });
      });
      tickets.filter(t => ['Submitted', 'Triage'].includes(t.status)).forEach(t => {
        items.push({ type: 'maintenance', icon: '🔧', title: t.subject, ref: t.id, status: t.status, action: 'Accept and investigate', priority: t.priority === 'Critical' ? 'High' : 'Normal', module: 'maintenance' });
      });
    }

    if (role === 'district-pr') {
      requests.filter(r => r.status === 'PR and Branding Review').forEach(r => {
        items.push({ type: 'website', icon: '🎨', title: r.preferredDomain || r.domain || r.title || 'PR Review', ref: r.id, status: r.status, action: 'Review branding compliance', priority: 'Normal', module: 'websites' });
      });
      compliance.filter(c => c.status === 'Action Taken').forEach(c => {
        items.push({ type: 'compliance', icon: '🛡️', title: (c.club || c.clubName) + ' — ' + c.category, ref: c.id, status: c.status, action: 'Review correction', priority: 'High', module: 'governance' });
      });
    }

    if (role === 'district-verification') {
      verification.filter(v => ['Filed', 'Meeting Scheduling', 'Investigation'].includes(v.status)).forEach(v => {
        items.push({ type: 'verification', icon: '⚖️', title: v.subject, ref: v.id, status: v.status, action: 'Progress case', priority: 'Normal', module: 'verification' });
      });
    }

    // Sort: Emergency first, then High, then Normal
    const priorityOrder = { 'Emergency': 0, 'High': 1, 'Normal': 2 };
    items.sort((a, b) => (priorityOrder[a.priority] || 2) - (priorityOrder[b.priority] || 2));

    return items;
  }

  // ==========================================
  // PROCESS OVERVIEW (DASHBOARD)
  // ==========================================

  /**
   * Get active process overview cards for the dashboard
   * @returns {Array<Object>}
   */
  getProcessOverview() {
    const items = [];
    const requests = this.getData('websiteRequests') || [];
    const tickets = this.getData('maintenanceTickets') || [];
    const compliance = this.getData('complianceCases') || [];
    const verification = this.getData('verificationCases') || [];
    const appointments = this.getData('appointments') || [];

    requests.filter(r => r.status !== 'Published').forEach(r => {
      items.push({ type: 'Website Request', title: r.preferredDomain || r.domain || r.title, status: r.status, lastActivity: r.updatedAt || r.submissionDate, nextAction: getNextAction('website', r.status), id: r.id, module: 'websites' });
    });
    tickets.filter(t => t.status !== 'Closed' && t.status !== 'Resolved').forEach(t => {
      items.push({ type: 'Maintenance', title: t.subject, status: t.status, lastActivity: t.updatedAt || t.dateSubmitted, nextAction: getNextAction('maintenance', t.status), id: t.id, module: 'maintenance' });
    });
    compliance.filter(c => c.status !== 'Closed').forEach(c => {
      items.push({ type: 'Compliance', title: (c.club || c.clubName) + ' — ' + c.category, status: c.status, lastActivity: c.updatedAt || c.dateLogged, nextAction: getNextAction('compliance', c.status), id: c.id, module: 'governance' });
    });

    return items;
  }
}

const state = new StateEngine();
