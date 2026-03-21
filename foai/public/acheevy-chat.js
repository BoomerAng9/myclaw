/* ═══════════════════════════════════════════════════════════════
   ACHEEVY — MyClaw Native Chat Logic (The Digital CEO)
   Vanilla JS — serves as a site guide, managing solutions.
   ═══════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  // ── ACHEEVY Capabilities Registry ─────────────────────────────
  // Controlled by the "Circuit Box" backend (simulate permissions here)
  const ACHEEVY_PERMISSIONS = {
    manageMindEdge: true,
    manageOpenClaw: true,
    executeCode: false,
    viewBilling: true
  };

  // ── Sitemap Knowledge Base ──────────────────────────────────
  const SITEMAP = {
    'home':       { path: '/',            desc: 'The MyClaw landing page — your secure entry point.' },
    'features':   { path: '/#features',   desc: 'Overview of capabilities: privacy, models, agents, search.' },
    'sign in':    { path: '/#signin',     desc: 'Authenticate to access OpenClaw and your dashboard.' },
    'dashboard':  { path: '/dashboard/',  desc: 'Your private AI dashboard and main command center.' },
    'kyb':        { path: 'https://myclaw.foai.cloud/v1/kyb-onboard', desc: 'Know Your Boomer_Ang — register a new AI agent.' },
    'billing':    { path: '/luc-calculator.html', desc: 'LEDGER USAGE CALCULATOR (LUC) — track token spend and quotas.' },
    'openclaw':   { path: 'https://openclaw-sop5.srv1492108.hstgr.cloud', desc: 'The OpenClaw platform.' },
    'mind edge':  { path: '/partners/',   desc: 'Management portal for the Mind Edge deployment.' },
    'partners':   { path: '/partners/',   desc: 'Manage external relationships like Mind Edge.' }
  };

  // ── Smart Response Engine ───────────────────────────────────
  function generateResponse(userMsg) {
    const lower = userMsg.toLowerCase().trim();

    // 1. Core Identity & Role
    if (lower.includes('who are you') || lower.includes('what are you')) {
      return "I am ACHEEVY, the Digital CEO and Orchestrator of the AIMS ecosystem. On this site, I am your navigator—I can guide you to OpenClaw, manage your Mind Edge partnership, or explain our features. What do you need to access?";
    }

    // 2. OpenClaw Access
    if (lower.includes('openclaw') || lower.includes('chat') || lower.includes('ai tool')) {
      return "MyClaw is your secure access point to OpenClaw. You can sign in here to access your private LLMs: https://app.myclaw.foai.cloud/login";
    }

    // 3. Mind Edge Partnership Management
    if (lower.includes('mind edge') || lower.includes('mindedge') || lower.includes('partnership') || lower.includes('partner')) {
      if (!ACHEEVY_PERMISSIONS.manageMindEdge) {
        return "I lack the permissions to manage the Mind Edge partnership at this time. Please check the Circuit Box.";
      }
      return "I can navigate you to the Partners portal to manage the Mind Edge relationship. You can manage courses, enrollment, and integrations there: /partners/";
    }

    // 4. Permissions / Circuit Box
    if (lower.includes('circuit box') || lower.includes('permission') || lower.includes('capability') || lower.includes('backend')) {
      return `My current site capabilities are:\n• Manage OpenClaw: ${ACHEEVY_PERMISSIONS.manageOpenClaw ? 'ON' : 'OFF'}\n• Manage Mind Edge: ${ACHEEVY_PERMISSIONS.manageMindEdge ? 'ON' : 'OFF'}\n• Execute Code: ${ACHEEVY_PERMISSIONS.executeCode ? 'ON' : 'OFF'}\n\nYou can adjust these in the management dashboard.`;
    }

    // 5. Code Execution (Permission Check)
    if (lower.includes('execute') || lower.includes('run code') || lower.includes('script')) {
      if (!ACHEEVY_PERMISSIONS.executeCode) {
        return "My 'Execute Code' permission is currently disabled in the Circuit Box. I cannot run scripts from the frontend chat without authorization.";
      }
      return "Code execution capability is authorized. However, please use the OpenClaw platform for complex agent scripting.";
    }

    // 6. Redirect internal capabilities (Cinematic/NotebookLM)
    if (lower.includes('cinematic') || lower.includes('video') || lower.includes('storyboard') || lower.includes('podcast') || lower.includes('notebooklm')) {
      return "Those are internal workflow capabilities executed securely behind the scenes by specialized Boomer_Angs. I don't generate media directly in this site guide chat. Let's stick to navigating your MyClaw setup.";
    }

    // 7. Sitemap routing
    for (const [key, info] of Object.entries(SITEMAP)) {
      if (lower.includes(key)) {
        return `${info.desc} Link: ${info.path}`;
      }
    }

    // 8. Help / Default
    if (lower.includes('help')) {
      return "I'm ACHEEVY. I can route you to OpenClaw, direct you to the Mind Edge partners page, show you the LUC calculator, or display my current permissions. Just ask.";
    }

    return "I am ACHEEVY, your digital CEO. Try asking about OpenClaw, Mind Edge, our features, or say 'permissions' to view what I'm authorized to do on this page.";
  }

  // ── DOM Interaction ─────────────────────────────────────────
  const panel    = document.getElementById('guidePanel');
  const bubble   = document.getElementById('guideBubble');
  const messages = document.getElementById('guideMessages');
  const input    = document.getElementById('guideInput');

  let isOpen = false;

  window.toggleGuide = function () {
    isOpen = !isOpen;
    if (isOpen) {
      panel.classList.add('active');
      bubble.classList.add('hidden');
      input.focus();
    } else {
      panel.classList.remove('active');
      bubble.classList.remove('hidden');
    }
  };

  window.handleGuideInput = function (e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendGuideMessage();
    }
  };

  window.sendGuideMessage = function () {
    const text = input.value.trim();
    if (!text) return;

    // Add user message
    appendMessage(text, 'user');
    input.value = '';
    input.disabled = true;

    // Show typing indicator
    const typingEl = showTyping();

    // Simulate brief processing delay
    setTimeout(() => {
      typingEl.remove();
      const reply = generateResponse(text);
      appendMessage(reply, 'bot');
      input.disabled = false;
      input.focus();
    }, 400 + Math.random() * 600);
  };

  function appendMessage(content, type) {
    const div = document.createElement('div');
    div.className = `guide-message ${type}`;

    if (content.includes('\n')) {
      div.innerHTML = content.replace(/\n/g, '<br>');
    } else {
      div.textContent = content;
    }

    messages.appendChild(div);
    messages.scrollTop = messages.scrollHeight;
  }

  function showTyping() {
    const div = document.createElement('div');
    div.className = 'guide-message bot';
    div.innerHTML = '<div class="typing-indicator"><span class="typing-dot"></span><span class="typing-dot"></span><span class="typing-dot"></span></div>';
    messages.appendChild(div);
    messages.scrollTop = messages.scrollHeight;
    return div;
  }

})();
