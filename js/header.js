/**
 * Header component
 * Injects site navigation into #site-header and wires up the mobile menu toggle
 * and tools dropdown menu populated from the tools list.
 */
(function () {
  // Tools list sourced from sidebar.js
  const toolsList = [
    { name: "Device Detector", icon: "📱", url: "/detector", desc: "Identify your exact phone model, OS, and browser." },
    { name: "Camera Test", icon: "📷", url: "/camera-test", desc: "Test front & rear cameras with live preview." },
    { name: "Microphone Test", icon: "🎤", url: "/mic-test", desc: "Check microphone input and audio levels." },
    { name: "Speaker Test", icon: "🔊", url: "/speaker-test", desc: "Test speakers and audio output." },
    { name: "Battery Test", icon: "🔋", url: "/battery-test", desc: "Detailed battery health and status." },
    { name: "Display Test", icon: "🖥️", url: "/display-test", desc: "Screen resolution, touch, brightness, dead pixels." },
    { name: "Swipe / Touch Test", icon: "👆", url: "/swipe-test", desc: "Test multi-touch and swipe gestures." },
    { name: "Sensor Test", icon: "📡", url: "/sensor-test", desc: "Accelerometer, gyroscope, proximity, etc." },
    { name: "GPS Test", icon: "📍", url: "/gps-test", desc: "Location accuracy and GPS functionality." },
    { name: "Bluetooth Test", icon: "📶", url: "/bluetooth-test", desc: "Bluetooth connectivity and device scanning." },
    { name: "Network Speed Test", icon: "🌐", url: "/network-speed-test", desc: "Internet speed, latency, and connection quality." },
    { name: "Vibration Test", icon: "📳", url: "/vibration-test", desc: "Test device vibration motor." }    
  ];

  // Header Dropdown CSS Styles
  const HEADER_STYLES = `
    .nav-dropdown {
      position: relative;
    }

    .dropdown-toggle {
      background: none;
      border: none;
      font-family: inherit;
      color: var(--ink-soft);
      font-size: 14.5px;
      font-weight: 500;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 4px;
      padding: 0;
    }

    .dropdown-toggle:hover {
      color: var(--ink);
    }

    .dropdown-arrow {
      font-size: 10px;
      transition: transform 0.2s ease;
    }

    .nav-dropdown.is-open .dropdown-arrow {
      transform: rotate(180deg);
    }

    .dropdown-menu {
      position: absolute;
      top: 100%;
      left: 50%;
      transform: translateX(-50%) translateY(8px);
      width: 340px;
      max-height: 420px;
      overflow-y: auto;
      background: var(--surface, #ffffff);
      border: 1px solid var(--border, #d7dce1);
      border-radius: var(--radius, 10px);
      box-shadow: var(--shadow-lg, 0 20px 48px rgba(27, 31, 35, 0.12));
      padding: 8px;
      display: none;
      flex-direction: column;
      gap: 2px;
      z-index: 1000;
    }

    .nav-dropdown.is-open .dropdown-menu {
      display: flex;
    }

    .dropdown-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 8px 10px;
      border-radius: var(--radius-sm, 6px);
      text-decoration: none;
      transition: background 0.15s ease;
    }

    .dropdown-item:hover {
      background: var(--surface-alt, #f6f8fa);
    }

    .dropdown-item-icon {
      font-size: 18px;
      width: 32px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: var(--surface-alt, #f6f8fa);
      border-radius: 6px;
      flex-shrink: 0;
    }

    .dropdown-item-info {
      display: flex;
      flex-direction: column;
      min-width: 0;
    }

    .dropdown-item-title {
      font-size: 13.5px;
      font-weight: 600;
      color: var(--ink, #1b1f23);
      line-height: 1.2;
    }

    .dropdown-item-desc {
      font-size: 11.5px;
      color: var(--muted, #6e7681);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    /* Mobile view adjustments */
    @media (max-width: 720px) {
      .dropdown-menu {
        position: static;
        transform: none;
        width: 100%;
        max-height: 280px;
        box-shadow: none;
        border: 1px solid var(--border-soft);
        margin-top: 8px;
      }
    }
  `;

  const HEADER_HTML = `
    <div class="container header-inner">
      <a href="/" class="brand" aria-label="Mobile Device Testing Tools home">
        <span class="brand-mark">&lt;/&gt;</span>
        <span>Mobile Device<span style="color:var(--blue)"> Test</span></span>
      </a>

      <ul class="nav-links">
        <li><a href="/">Home</a></li>
        <li class="nav-dropdown" id="headerToolsDropdown">
          <button class="dropdown-toggle" id="dropdownToggleBtn" aria-haspopup="true" aria-expanded="false">
            Tools <span class="dropdown-arrow">▼</span>
          </button>
          <div class="dropdown-menu" id="headerToolsMenu" role="menu"></div>
        </li>
        <li><a href="/#how-it-works">How it works</a></li>
        <li><a href="/#why">Why us</a></li>
        <li><a href="/#use-cases">Use cases</a></li>
        <li><a href="/blog">Blog</a></li>
        <li><a href="#faq">FAQ</a></li>
      </ul>

      <div class="nav-actions">
        <a href="/#tools" class="btn btn-ghost btn-sm">Browse tools</a>
        <button class="nav-toggle" id="navToggle" aria-label="Toggle navigation menu" aria-expanded="false">
          <span></span>
        </button>
      </div>
    </div>
  `;

  function injectStyles() {
    if (document.getElementById('header-dropdown-styles')) return;
    const styleEl = document.createElement('style');
    styleEl.id = 'header-dropdown-styles';
    styleEl.textContent = HEADER_STYLES;
    document.head.appendChild(styleEl);
  }

  function init() {
    const mount = document.getElementById('site-header');
    if (!mount) return;

    injectStyles();

    mount.innerHTML = HEADER_HTML;
    mount.classList.add('site-header');

    // Populate dropdown items from toolsList
    const menuContainer = document.getElementById('headerToolsMenu');
    if (menuContainer) {
      toolsList.forEach(function (tool) {
        const item = document.createElement('a');
        item.href = tool.url;
        item.className = 'dropdown-item';
        item.setAttribute('role', 'menuitem');
        item.innerHTML = `
          <span class="dropdown-item-icon">${tool.icon}</span>
          <span class="dropdown-item-info">
            <span class="dropdown-item-title">${tool.name}</span>
            <span class="dropdown-item-desc">${tool.desc}</span>
          </span>
        `;
        menuContainer.appendChild(item);
      });
    }

    // Toggle Dropdown Menu
    const dropdownWrapper = document.getElementById('headerToolsDropdown');
    const dropdownBtn = document.getElementById('dropdownToggleBtn');

    if (dropdownBtn && dropdownWrapper) {
      dropdownBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        const isOpen = dropdownWrapper.classList.toggle('is-open');
        dropdownBtn.setAttribute('aria-expanded', String(isOpen));
      });

      // Close dropdown when clicking outside
      document.addEventListener('click', function (e) {
        if (!dropdownWrapper.contains(e.target)) {
          dropdownWrapper.classList.remove('is-open');
          dropdownBtn.setAttribute('aria-expanded', 'false');
        }
      });
    }

    // Mobile Menu Toggle logic
    const toggle = document.getElementById('navToggle');
    if (toggle) {
      toggle.addEventListener('click', function () {
        const isOpen = mount.classList.toggle('nav-open');
        toggle.setAttribute('aria-expanded', String(isOpen));
      });
    }

    // Close mobile menu after a nav link or dropdown item is tapped
    mount.querySelectorAll('.nav-links a').forEach(function (link) {
      link.addEventListener('click', function () {
        mount.classList.remove('nav-open');
        if (toggle) toggle.setAttribute('aria-expanded', 'false');
        if (dropdownWrapper) dropdownWrapper.classList.remove('is-open');
      });
    });
  }

  document.addEventListener('DOMContentLoaded', init);
})();
