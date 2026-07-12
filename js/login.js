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
  
  const email = emailInput ? emailInput.value.trim() : "";
  const password = passInput ? passInput.value : "";

  if (password !== "leo123" && password !== "admin123") {
    showLoginError("Incorrect password. Use 'leo123'.");
    return;
  }

  let loggedUser = null;
  const users = state.getData("users") || [];
  const emailLower = email.toLowerCase();
  
  // 1. Match known shortcut emails
  if (emailLower === "admin@leo.org" || emailLower === "dinesh.admin@leodistrict.org") {
    loggedUser = users.find(u => u.role === "super-admin") || users[0];
  } else if (emailLower === "president@leo.org" || emailLower === "dilan.pres@leocolombocentennial.org") {
    loggedUser = users.find(u => u.role === "club-president") || users[1];
  } else if (emailLower === "pr@leo.org" || emailLower === "sanduni.pr@leodistrict.org") {
    loggedUser = users.find(u => u.role === "district-pr") || users[2];
  } else if (emailLower === "tech@leo.org" || emailLower === "naveen.it@leodistrict.org") {
    loggedUser = users.find(u => u.role === "district-tech") || users[3];
  } else if (emailLower === "verif@leo.org" || emailLower === "dilhara.verify@leodistrict.org") {
    loggedUser = users.find(u => u.role === "district-verification") || users[4];
  } else if (emailLower === "guest@leo.org") {
    loggedUser = { name: "Guest Leo / Public", role: "individual-leo", club: "None" };
  } else {
    // 2. Try exact email match
    loggedUser = users.find(u => u.email && u.email.toLowerCase() === emailLower);
  }

  // 3. Fallback: if nothing matched, use the active role button
  if (!loggedUser) {
    const activeRoleBtn = document.querySelector(".role-grid-btn.active");
    const roleKey = activeRoleBtn ? activeRoleBtn.getAttribute("data-role") : "super-admin";
    
    if (roleKey === "individual-leo") {
      loggedUser = { name: "Guest Leo / Public", role: "individual-leo", club: "None" };
    } else {
      loggedUser = users.find(u => u.role === roleKey) || users[0];
    }
  }

  // Safety: if there's still no user, show error
  if (!loggedUser) {
    showLoginError("Unable to log in. Please reload the page.");
    return;
  }

  state.setLoginState(true, loggedUser);
  
  // Set simulator switcher values
  const switcher = document.getElementById("role-switcher");
  if (switcher) switcher.value = loggedUser.role;
  
  // Update sidebar profile details with null guards
  const widgetName = document.getElementById("widget-name");
  const widgetRole = document.getElementById("widget-role");
  const widgetAvatar = document.getElementById("widget-avatar");
  if (widgetName) widgetName.textContent = loggedUser.name;
  if (widgetRole) widgetRole.textContent = loggedUser.role.replace(/-/g, ' ');
  if (widgetAvatar) widgetAvatar.textContent = loggedUser.name.charAt(0);
  
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
