/**
 * MERCO M. CABARRUBIAS - PORTFOLIO INTERACTIVITY
 * Unique & Minimalist Design System Engine
 */

(function () {
  'use strict';

  // State Management
  const state = {
    theme: localStorage.getItem('merco-theme') || 'dark',
    soundEnabled: localStorage.getItem('merco-sound') === 'true',
    activeModal: null,
    termHistory: [],
    termHistoryIndex: -1
  };

  // Web Audio Micro-feedback Synth
  let audioCtx = null;
  function getAudioContext() {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) audioCtx = new AudioContext();
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    return audioCtx;
  }

  function playMicroClick(freq = 800, type = 'sine', duration = 0.04) {
    if (!state.soundEnabled) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(freq * 0.4, ctx.currentTime + duration);

      gain.gain.setValueAtTime(0.04, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch (e) {
      // Audio autoplay policy fallback
    }
  }

  // Toast Notification System
  function showToast(message, icon = '✓') {
    let toast = document.getElementById('toastNotice');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'toastNotice';
      toast.className = 'toast-notice';
      document.body.appendChild(toast);
    }
    toast.innerHTML = `<span>${icon}</span> <span>${message}</span>`;
    toast.classList.add('show');
    playMicroClick(1200, 'triangle', 0.06);

    setTimeout(() => {
      toast.classList.remove('show');
    }, 2800);
  }

  // Clipboard Helper
  function copyTextToClipboard(text, successMsg = 'Copied to clipboard!') {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(() => {
        showToast(successMsg);
      }).catch(() => {
        fallbackCopy(text, successMsg);
      });
    } else {
      fallbackCopy(text, successMsg);
    }
  }

  function fallbackCopy(text, successMsg) {
    const input = document.createElement('input');
    input.value = text;
    document.body.appendChild(input);
    input.select();
    document.execCommand('copy');
    document.body.removeChild(input);
    showToast(successMsg);
  }

  // Theme Toggle Engine
  function applyTheme(theme) {
    state.theme = theme;
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('merco-theme', theme);

    const themeToggleBtn = document.getElementById('themeToggleBtn');
    if (themeToggleBtn) {
      themeToggleBtn.innerHTML = theme === 'dark' 
        ? `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4"/></svg>`
        : `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`;
      themeToggleBtn.setAttribute('title', `Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode (T)`);
    }
  }

  function toggleTheme() {
    const nextTheme = state.theme === 'dark' ? 'light' : 'dark';
    applyTheme(nextTheme);
    playMicroClick(900, 'sine', 0.05);
    showToast(`Switched to ${nextTheme.toUpperCase()} mode`);
  }

  // Sound Toggle Engine
  function toggleSound() {
    state.soundEnabled = !state.soundEnabled;
    localStorage.setItem('merco-sound', state.soundEnabled);
    updateSoundBtnState();
    if (state.soundEnabled) {
      playMicroClick(1000, 'sine', 0.08);
      showToast('Tactile audio enabled 🔊');
    } else {
      showToast('Tactile audio muted 🔇');
    }
  }

  function updateSoundBtnState() {
    const soundBtn = document.getElementById('soundToggleBtn');
    if (!soundBtn) return;
    soundBtn.innerHTML = state.soundEnabled
      ? `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>`
      : `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/></svg>`;
    soundBtn.setAttribute('title', state.soundEnabled ? 'Mute audio clicks' : 'Enable tactile audio clicks');
  }

  // Philippine Standard Time Clock (UTC+8)
  function initLiveClock() {
    const clockEl = document.getElementById('liveClockPill');
    if (!clockEl) return;

    function update() {
      const now = new Date();
      // Format in Asia/Manila (PHT)
      const options = {
        timeZone: 'Asia/Manila',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
      };
      try {
        const timeStr = new Intl.DateTimeFormat('en-US', options).format(now);
        clockEl.textContent = `${timeStr} PHT (Cebu)`;
      } catch (e) {
        clockEl.textContent = `UTC+8 (Cebu)`;
      }
    }
    update();
    setInterval(update, 1000);
  }

  // Project Filtering
  function initProjectFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        playMicroClick(750, 'sine', 0.03);
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filter = btn.getAttribute('data-filter');
        projectCards.forEach(card => {
          const category = card.getAttribute('data-category');
          if (filter === 'all' || category === filter) {
            card.style.display = 'grid';
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  }

  // Lightweight Standalone Confetti
  function fireConfetti() {
    const canvas = document.createElement('canvas');
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100vw';
    canvas.style.height = '100vh';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '9999';
    document.body.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const pieces = [];
    const colors = ['#10b981', '#3b82f6', '#f59e0b', '#ec4899', '#8b5cf6', '#ffffff'];

    for (let i = 0; i < 90; i++) {
      pieces.push({
        x: canvas.width / 2,
        y: canvas.height / 2,
        w: Math.random() * 8 + 4,
        h: Math.random() * 8 + 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        vx: (Math.random() - 0.5) * 18,
        vy: (Math.random() - 0.8) * 16,
        rot: Math.random() * 360,
        rotSpeed: (Math.random() - 0.5) * 12,
        opacity: 1
      });
    }

    let frame = 0;
    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let alive = false;

      pieces.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.4; // gravity
        p.rot += p.rotSpeed;
        p.opacity -= 0.012;

        if (p.opacity > 0) {
          alive = true;
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate((p.rot * Math.PI) / 180);
          ctx.globalAlpha = Math.max(0, p.opacity);
          ctx.fillStyle = p.color;
          ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
          ctx.restore();
        }
      });

      frame++;
      if (alive && frame < 140) {
        requestAnimationFrame(animate);
      } else {
        document.body.removeChild(canvas);
      }
    }
    animate();
  }

  // Interactive Developer Terminal Engine
  function initTerminal() {
    const termInput = document.getElementById('terminalInput');
    const termBody = document.getElementById('terminalBody');
    if (!termInput || !termBody) return;

    const commands = {
      help: () => `
Available Commands:
  <span class="term-cmd">about</span>       - Read Merco's background, OJT objectives & focus
  <span class="term-cmd">projects</span>    - Detailed project directory (TasteTrack, Roblox, Ocean)
  <span class="term-cmd">skills</span>      - Technical stack, frameworks, tools & competencies
  <span class="term-cmd">education</span>   - Cebu Eastern College, Dean's Lister, academic history
  <span class="term-cmd">contact</span>     - Direct contact channels (Email, Phone, Location)
  <span class="term-cmd">tastetrack</span>  - Deep dive on Django recipe management architecture
  <span class="term-cmd">roblox</span>      - Launch Roblox Disaster Game experience
  <span class="term-cmd">resume</span>      - Open and inspect official resume
  <span class="term-cmd">sudo hire</span>   - Execute hiring evaluation sequence
  <span class="term-cmd">theme</span>       - Toggle interface Dark/Light mode
  <span class="term-cmd">clear</span>       - Clear terminal history
  <span class="term-cmd">help</span>        - Display this menu
      `,
      about: () => `
<span class="term-success">MERCO M. CABARRUBIAS</span>
Information Technology Student @ Cebu Eastern College (CEC)
Location: Cebu City, Philippines (Puntod, Alaska, Mambaling)
Objective: Seeking an internship or On-the-Job Training (OJT) position to apply academic knowledge,
strengthen technical competencies, and gain practical industry experience while contributing
to organizational success.
Specialization: Full-Stack Web Development (Django/Python), Interactive Frontend, and Game Logic (Roblox/Lua).
      `,
      projects: () => `
<span class="term-info">Featured Engineering Works:</span>
1. <span class="term-cmd">TasteTrack</span> (Full-Stack Web App)
   - Stack: Python, Django 5, SQLite, Bootstrap 5, JavaScript
   - Features: Recipe management, social feed, custom reaction engine (👍 ❤️ 😋), notifications, bookmarks.
   - Run: Type <span class="term-cmd">tastetrack</span> to learn more or click 'Case Study' in projects section.

2. <span class="term-cmd">Disaster Survival Challenge</span> (Roblox Experience)
   - Stack: Roblox Studio, Lua, Multiplayer Networking, Physics Engine
   - Features: Dynamic earthquakes, volcanic hazards, round loop, coin economy, player leaderboard.
   - Run: Type <span class="term-cmd">roblox</span> to launch game directly.

3. <span class="term-cmd">Ocean Conservation & Scarborough Shoal</span> (Web Project)
   - Stack: HTML5, CSS3, JavaScript, Video Background API, Remix Icons
   - Features: 4 environmental pillars, geopolitical analysis, responsive UI.
      `,
      skills: () => `
<span class="term-info">Technical Competencies Matrix:</span>
• Programming:     Python, Lua, JavaScript (ES6+), SQL, HTML5, CSS3
• Frameworks/Libs: Django 5, Bootstrap 5, Pillow (PIL), RemixIcon
• Environments:    Roblox Studio, Git/GitHub, VS Code, Virtualenv, SQLite
• Core Domains:    Full-Stack Architecture, Game Loop & Physics, Responsive Design, Networking
• Academic Honors: Dean's Lister (A.Y. 2023 - 2024)
• Languages:       English (Professional), Cebuano (Native), Tagalog (Fluent)
      `,
      education: () => `
<span class="term-success">Academic Journey:</span>
[2023 - Present] Cebu Eastern College (CEC)
                 Bachelor of Science in Information Technology (BSIT)
                 ★ <span class="term-cmd">Dean's Lister (2023 - 2024)</span>

[2021 - 2023]    Senior High School - General Academic Strand (GAS)
[2017 - 2021]    Alaska Night High School
[2008 - 2017]    Alaska National Elementary School

[Certificates]   freeCodeCamp Legacy Responsive Web Design Certificate of Completion
      `,
      contact: () => `
<span class="term-info">Direct Contact Information:</span>
• Email:    <a href="mailto:cabarrubiasmerco@gmail.com" class="term-cmd">cabarrubiasmerco@gmail.com</a> (Click to email)
• Phone:    <a href="tel:09935747851" class="term-cmd">09935747851</a> / +63 993 574 7851
• Location: Puntod, Alaska, Mambaling, Cebu City, Philippines
• Status:   <span class="term-success">● Open for OJT / Internship Opportunities</span>
      `,
      tastetrack: () => {
        openModal('modalTasteTrack');
        return `<span class="term-success">Opened TasteTrack Architecture Modal...</span>`;
      },
      roblox: () => {
        window.open('https://www.roblox.com/games/103655048302039/Disaster-Game', '_blank');
        return `<span class="term-success">Redirecting to Roblox Disaster Game (103655048302039)...</span>`;
      },
      resume: () => {
        openModal('modalResume');
        return `<span class="term-success">Opened Resume Viewer...</span>`;
      },
      'sudo hire': () => {
        fireConfetti();
        showToast('🎉 Excellent choice! Merco is ready for OJT / Internship interview.');
        return `
<span class="term-success">=====================================================</span>
<span class="term-success">PERMISSION GRANTED: HIRE INITIATIVE ACCEPTED!</span>
<span class="term-info">Candidate: Merco M. Cabarrubias</span>
<span class="term-info">Role: Information Technology Intern / OJT Engineer</span>
<span class="term-info">Strengths: Fast Learner, Diligent, Full-Stack Python/Django, Lua Game Dev</span>
<span class="term-cmd">Next Step: Send an email to cabarrubiasmerco@gmail.com to schedule your interview!</span>
<span class="term-success">=====================================================</span>
        `;
      },
      'sudo hire-merco': () => commands['sudo hire'](),
      'hire': () => commands['sudo hire'](),
      theme: () => {
        toggleTheme();
        return `Interface theme toggled to <span class="term-cmd">${state.theme}</span>.`;
      },
      clear: () => {
        termBody.innerHTML = '';
        return null;
      }
    };

    function appendOutput(content, cmd = null) {
      if (cmd) {
        const cmdLine = document.createElement('div');
        cmdLine.className = 'terminal-line';
        cmdLine.innerHTML = `<span class="term-prompt">merco@cebu:~$</span> <span class="term-cmd">${escapeHtml(cmd)}</span>`;
        termBody.appendChild(cmdLine);
      }
      if (content !== null && content !== undefined) {
        const outDiv = document.createElement('div');
        outDiv.className = 'terminal-output';
        outDiv.innerHTML = content.trim();
        termBody.appendChild(outDiv);
      }
      termBody.scrollTop = termBody.scrollHeight;
    }

    function escapeHtml(str) {
      return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    }

    function executeCommand(raw) {
      const clean = raw.trim().toLowerCase();
      if (!clean) return;

      state.termHistory.push(raw);
      state.termHistoryIndex = state.termHistory.length;
      playMicroClick(880, 'sine', 0.04);

      if (commands[clean]) {
        const result = commands[clean]();
        appendOutput(result, raw);
      } else {
        appendOutput(`<span class="term-muted">Command not found: "${escapeHtml(clean)}". Type <span class="term-cmd">help</span> for valid commands.</span>`, raw);
      }
      termInput.value = '';
    }

    termInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        executeCommand(termInput.value);
      } else if (e.key === 'ArrowUp') {
        if (state.termHistory.length > 0 && state.termHistoryIndex > 0) {
          state.termHistoryIndex--;
          termInput.value = state.termHistory[state.termHistoryIndex] || '';
        }
      } else if (e.key === 'ArrowDown') {
        if (state.termHistoryIndex < state.termHistory.length - 1) {
          state.termHistoryIndex++;
          termInput.value = state.termHistory[state.termHistoryIndex] || '';
        } else {
          state.termHistoryIndex = state.termHistory.length;
          termInput.value = '';
        }
      }
    });

    // Quick Command Buttons
    document.querySelectorAll('.quick-cmd-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const cmd = btn.getAttribute('data-cmd');
        if (cmd) {
          termInput.value = cmd;
          executeCommand(cmd);
          termInput.focus();
        }
      });
    });
  }

  // Modal Dialog System
  window.openModal = function (modalId) {
    const backdrop = document.getElementById(modalId);
    if (!backdrop) return;
    backdrop.classList.add('active');
    document.body.style.overflow = 'hidden';
    state.activeModal = backdrop;
    playMicroClick(820, 'sine', 0.05);
  };

  window.closeModal = function () {
    if (state.activeModal) {
      state.activeModal.classList.remove('active');
      document.body.style.overflow = '';
      state.activeModal = null;
      playMicroClick(640, 'sine', 0.04);
    }
  };

  function initModals() {
    // Backdrop clicks & close buttons
    document.querySelectorAll('.modal-backdrop').forEach(backdrop => {
      backdrop.addEventListener('click', (e) => {
        if (e.target === backdrop) closeModal();
      });

      const closeBtn = backdrop.querySelector('.modal-close-btn');
      if (closeBtn) {
        closeBtn.addEventListener('click', closeModal);
      }
    });

    // Escape key
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        if (state.activeModal) closeModal();
        closeCommandPalette();
      }
      // Ctrl+K / Cmd+K Command Palette Shortcut
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        toggleCommandPalette();
      }
      // 'T' key for Theme Toggle (when not inside an input/textarea)
      if (e.key.toLowerCase() === 't' && !['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) {
        toggleTheme();
      }
    });

    // Modal internal tabs
    document.querySelectorAll('.modal-tab-btn').forEach(tabBtn => {
      tabBtn.addEventListener('click', () => {
        const targetId = tabBtn.getAttribute('data-tab');
        const modalBody = tabBtn.closest('.modal-dialog');
        if (!modalBody) return;

        playMicroClick(700, 'sine', 0.03);
        modalBody.querySelectorAll('.modal-tab-btn').forEach(b => b.classList.remove('active'));
        modalBody.querySelectorAll('.modal-tab-pane').forEach(p => p.classList.remove('active'));

        tabBtn.classList.add('active');
        const pane = modalBody.querySelector(`#${targetId}`);
        if (pane) pane.classList.add('active');
      });
    });
  }

  // Command Palette Engine
  function toggleCommandPalette() {
    const cp = document.getElementById('commandPaletteModal');
    if (!cp) return;
    if (cp.classList.contains('active')) {
      closeCommandPalette();
    } else {
      openCommandPalette();
    }
  }

  function openCommandPalette() {
    const cp = document.getElementById('commandPaletteModal');
    if (!cp) return;
    cp.classList.add('active');
    document.body.style.overflow = 'hidden';
    state.activeModal = cp;
    playMicroClick(920, 'sine', 0.05);

    const input = document.getElementById('cmdSearchInput');
    if (input) {
      input.value = '';
      filterCommandItems('');
      setTimeout(() => input.focus(), 80);
    }
  }

  function closeCommandPalette() {
    const cp = document.getElementById('commandPaletteModal');
    if (cp && cp.classList.contains('active')) {
      cp.classList.remove('active');
      document.body.style.overflow = '';
      state.activeModal = null;
    }
  }

  function filterCommandItems(query) {
    const q = query.toLowerCase().trim();
    const items = document.querySelectorAll('.cmd-item');
    items.forEach(item => {
      const text = item.textContent.toLowerCase();
      if (!q || text.includes(q)) {
        item.style.display = 'flex';
      } else {
        item.style.display = 'none';
      }
    });
  }

  function initCommandPalette() {
    const input = document.getElementById('cmdSearchInput');
    if (input) {
      input.addEventListener('input', () => {
        filterCommandItems(input.value);
      });
    }

    document.querySelectorAll('.cmd-item').forEach(item => {
      item.addEventListener('click', () => {
        const action = item.getAttribute('data-action');
        closeCommandPalette();
        executePaletteAction(action);
      });
    });
  }

  function executePaletteAction(action) {
    switch (action) {
      case 'jump-projects':
        document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });
        break;
      case 'jump-terminal':
        document.getElementById('terminal')?.scrollIntoView({ behavior: 'smooth' });
        setTimeout(() => document.getElementById('terminalInput')?.focus(), 400);
        break;
      case 'jump-skills':
        document.getElementById('skills')?.scrollIntoView({ behavior: 'smooth' });
        break;
      case 'jump-education':
        document.getElementById('education')?.scrollIntoView({ behavior: 'smooth' });
        break;
      case 'jump-contact':
        document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
        break;
      case 'open-tastetrack':
        openModal('modalTasteTrack');
        break;
      case 'open-roblox':
        window.open('https://www.roblox.com/games/103655048302039/Disaster-Game', '_blank');
        break;
      case 'open-ocean':
        openModal('modalOcean');
        break;
      case 'view-resume':
        openModal('modalResume');
        break;
      case 'copy-email':
        copyTextToClipboard('cabarrubiasmerco@gmail.com', 'Copied cabarrubiasmerco@gmail.com!');
        break;
      case 'copy-phone':
        copyTextToClipboard('09935747851', 'Copied phone number 09935747851!');
        break;
      case 'toggle-theme':
        toggleTheme();
        break;
      case 'toggle-sound':
        toggleSound();
        break;
      case 'sudo-hire':
        document.getElementById('terminal')?.scrollIntoView({ behavior: 'smooth' });
        const termInput = document.getElementById('terminalInput');
        if (termInput) {
          termInput.value = 'sudo hire';
          termInput.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
        }
        break;
      default:
        break;
    }
  }

  // Contact Form Submission Mockup
  function initContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('senderName')?.value || '';
      const email = document.getElementById('senderEmail')?.value || '';
      const message = document.getElementById('senderMessage')?.value || '';

      if (!email || !message) {
        showToast('Please fill in your email and message', '⚠️');
        return;
      }

      // Generate mailto link
      const subject = encodeURIComponent(`OJT / Internship Opportunity from ${name || 'Recruiter'}`);
      const body = encodeURIComponent(`Hello Merco,\n\n${message}\n\nFrom: ${name} (${email})`);
      const mailtoUrl = `mailto:cabarrubiasmerco@gmail.com?subject=${subject}&body=${body}`;

      window.location.href = mailtoUrl;
      showToast('Opening your email client to send message! 🚀');
      fireConfetti();
      form.reset();
    });
  }

  // Active Navigation Scrollspy
  function initScrollSpy() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
      let current = '';
      const scrollPos = window.scrollY + 180;

      sections.forEach(sec => {
        const top = sec.offsetTop;
        const height = sec.offsetHeight;
        if (scrollPos >= top && scrollPos < top + height) {
          current = sec.getAttribute('id');
        }
      });

      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
          link.classList.add('active');
        }
      });
    }, { passive: true });
  }

  // Document Ready Initialization
  document.addEventListener('DOMContentLoaded', () => {
    applyTheme(state.theme);
    updateSoundBtnState();
    initLiveClock();
    initProjectFilters();
    initTerminal();
    initModals();
    initCommandPalette();
    initContactForm();
    initScrollSpy();

    // Event Delegations
    document.getElementById('themeToggleBtn')?.addEventListener('click', toggleTheme);
    document.getElementById('soundToggleBtn')?.addEventListener('click', toggleSound);
    document.getElementById('cmdPaletteBtn')?.addEventListener('click', openCommandPalette);

    // Global copy buttons
    document.querySelectorAll('[data-copy]').forEach(el => {
      el.addEventListener('click', () => {
        const text = el.getAttribute('data-copy');
        const msg = el.getAttribute('data-copy-msg') || 'Copied to clipboard!';
        copyTextToClipboard(text, msg);
      });
    });

    // Console Easter Egg
    console.log(
      '%c MERCO M. CABARRUBIAS %c Information Technology Student & Developer ',
      'background: #10b981; color: #0a0b0e; font-weight: bold; padding: 4px 8px; border-radius: 4px;',
      'background: #1e293b; color: #94a3b8; padding: 4px 8px; border-radius: 4px;'
    );
    console.log('Seeking OJT / Internship Position. Contact: cabarrubiasmerco@gmail.com');
  });

})();
