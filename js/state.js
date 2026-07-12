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
