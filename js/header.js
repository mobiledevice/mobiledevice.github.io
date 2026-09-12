/**
 * Header component
 * Injects site navigation into #site-header and wires up the mobile menu toggle.
 * Includes a "Tools" dropdown that works as:
 *   - a floating panel on desktop
 *   - an inline accordion inside the mobile hamburger menu
 */

(function loadHeaderStyles() {
  if (document.getElementById('header-styles')) return;
  const link = document.createElement('link');
  link.id = 'header-styles';
  link.rel = 'stylesheet';
  link.href = '/css/header.css';
  document.head.appendChild(link);
})();


(function () {
  // ---------------------------------------------------------------------------
  // Tool list used for the dropdown menu.
  // Keep in sync with data/tools-data.txt
  // ---------------------------------------------------------------------------
  const TOOLS = [
    { name: 'Camera Test',       url: '/camera-test',       icon: '📷' },
    { name: 'Microphone Test',   url: '/microphone-test',   icon: '🎤' },
    { name: 'Touch Screen Test', url: '/touch-test',        icon: '👆' },
    { name: 'Dead Pixel Test',   url: '/dead-pixel-test',   icon: '🖥️' },
    { name: 'Speaker Test',      url: '/speaker-test',      icon: '🔊' },
    { name: 'Vibration Test',    url: '/vibration-test',    icon: '📳' },
    { name: 'Accelerometer',     url: '/accelerometer-test',icon: '📐' },
    { name: 'Gyroscope Test',    url: '/gyroscope-test',    icon: '🌀' },
    { name: 'Battery Health',    url: '/battery-test',      icon: '🔋' },
    { name: 'GPS Test',          url: '/gps-test',          icon: '📍' },
    { name: 'Bluetooth Test',    url: '/bluetooth-test',    icon: '📶' },
    { name: 'Network Speed',     url: '/network-test',      icon: '⚡' },
    { name: 'Flashlight Test',   url: '/flashlight-test',   icon: '🔦' },
    { name: 'Fingerprint Test',  url: '/fingerprint-test',  icon: '🔐' },
  ];

  const dropdownItems = TOOLS.map(function (tool) {
    return `
      <li>
        <a href="${tool.url}" class="dropdown-link" role="menuitem">
          <span class="dropdown-icon">${tool.icon}</span>
          <span class="dropdown-label">${tool.name}</span>
        </a>
      </li>`;
  }).join('');

  const HEADER_HTML = `
    <div class="container header-inner">
      <a href="/" class="brand" aria-label="Mobile Device Testing Tools home">
        <span class="brand-mark">&lt;/&gt;</span>
        <span>Mobile Device<span style="color:var(--blue)"> Test</span></span>
      </a>

      <ul class="nav-links">
        <li><a href="/">Home</a></li>
        <li><a href="/#how-it-works">How it works</a></li>

        <!-- Tools dropdown (desktop panel / mobile accordion) -->
        <li class="nav-dropdown" id="toolsDropdown">
          <button class="nav-dropdown-toggle" aria-haspopup="true" aria-expanded="false">
            <span>Tools</span>
            <svg class="dropdown-caret" xmlns="http://www.w3.org/2000/svg" width="12" height="12"
                 viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"
                 stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <polyline points="6 9 12 15 18 9"/>
            </svg>
          </button>
          <div class="nav-dropdown-menu" role="menu" aria-label="All testing tools">
            <div class="dropdown-header">
              <span class="mono">// all tools</span>
              <a href="/#tools" class="dropdown-see-all">View all →</a>
            </div>
            <ul class="dropdown-list">
              ${dropdownItems}
            </ul>
          </div>
        </li>

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

  function init() {
    const mount = document.getElementById('site-header');
    if (!mount) return;

    mount.innerHTML = HEADER_HTML;
    mount.classList.add('site-header');

    // ----- Mobile menu toggle -----
    const toggle = document.getElementById('navToggle');
    if (toggle) {
      toggle.addEventListener('click', function () {
        const isOpen = mount.classList.toggle('nav-open');
        toggle.setAttribute('aria-expanded', String(isOpen));
      });
    }

    // ----- Tools dropdown -----
    const dropdown = document.getElementById('toolsDropdown');
    if (dropdown) {
      const dropdownToggle = dropdown.querySelector('.nav-dropdown-toggle');
      const dropdownMenu = dropdown.querySelector('.nav-dropdown-menu');

      dropdownToggle.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        const isOpen = dropdown.classList.toggle('open');
        dropdownToggle.setAttribute('aria-expanded', String(isOpen));
      });

      // Close when clicking outside (desktop only — harmless on mobile)
      document.addEventListener('click', function (e) {
        if (!dropdown.contains(e.target)) {
          dropdown.classList.remove('open');
          dropdownToggle.setAttribute('aria-expanded', 'false');
        }
      });

      // Close on Escape
      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && dropdown.classList.contains('open')) {
          dropdown.classList.remove('open');
          dropdownToggle.setAttribute('aria-expanded', 'false');
          dropdownToggle.focus();
        }
      });

      // Keyboard nav inside the dropdown links
      dropdownMenu.addEventListener('keydown', function (e) {
        const items = Array.from(dropdownMenu.querySelectorAll('.dropdown-link'));
        const currentIndex = items.indexOf(document.activeElement);

        if (e.key === 'ArrowDown') {
          e.preventDefault();
          const next = currentIndex < items.length - 1 ? currentIndex + 1 : 0;
          items[next].focus();
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          const prev = currentIndex > 0 ? currentIndex - 1 : items.length - 1;
          items[prev].focus();
        }
      });
    }

    // ----- Close mobile menu after a nav link is tapped -----
    mount.querySelectorAll('.nav-links a').forEach(function (link) {
      link.addEventListener('click', function () {
        mount.classList.remove('nav-open');
        if (toggle) toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  document.addEventListener('DOMContentLoaded', init);
})();
