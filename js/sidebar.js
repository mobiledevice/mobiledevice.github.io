/**
 * Mobile Device Testing Tools — sidebar.js
 * Injects a fixed dynamic sidebar for all hardware testing tools
 * Theme: Clean tech / diagnostic aesthetic (kept similar structure)
 */

(function () {
  // 1. Complete list of tools from mobiledevice.github.io
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
    { name: "Vibration Test", icon: "📳", url: "/vibration-test", desc: "Test device vibration motor." },
    { name: "About", icon: "ℹ️", url: "/about", desc: "Learn more about Mobile Device Testing Tools." },
    { name: "Contact", icon: "✉️", url: "/contact", desc: "Get in touch with the team." },
    { name: "Privacy", icon: "🔒", url: "/privacy", desc: "How we protect your data and privacy." },
    { name: "Terms", icon: "📋", url: "/terms", desc: "Read our terms and conditions." }
  ];

  // 2. Inject CSS Styles (kept original aesthetic but updated header/title)
  const cssStyles = `
    /* Floating Launch Trigger Button */
    .tools-floating-trigger {
      position: fixed;
      bottom: 24px;
      right: 24px;
      z-index: 9999;
      width: 52px;
      height: 52px;
      background: var(--ink, #2c3e50);
      color: var(--paper, #f8f4e9);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.4rem;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      cursor: pointer;
      border: 1px solid var(--paper-edge, #e0d5c5);
      transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), background 0.2s ease, color 0.2s ease;
    }
    body.dark .tools-floating-trigger {
      background: #3498db;
      color: #ffffff;
    }
    .tools-floating-trigger:hover {
      transform: scale(1.08) rotate(15deg);
      background: #3498db;
      color: #ffffff;
    }
    .tools-floating-trigger.active {
      transform: scale(0.9) rotate(-90deg);
      background: #ecf0f1;
      color: #2c3e50;
    }

    /* Fixed Sidebar Layout Container */
    .tools-fixed-sidebar {
      position: fixed;
      top: 0;
      right: -340px;
      width: 320px;
      height: 100vh;
      background: var(--paper, #f8f4e9);
      border-left: 1px solid var(--paper-edge, #e0d5c5);
      box-shadow: -8px 0 24px rgba(0,0,0,0.1);
      z-index: 10000;
      display: flex;
      flex-direction: column;
      transition: right 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    }
    .tools-fixed-sidebar.open {
      right: 0;
    }

    /* Dimmed Background Backdrop Overlay */
    .tools-sidebar-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background: rgba(26, 26, 46, 0.4);
      backdrop-filter: blur(4px);
      z-index: 9999;
      opacity: 0;
      pointer-events: none;
      transition: opacity 0.3s ease;
    }
    body.dark .tools-sidebar-overlay {
      background: rgba(0, 0, 0, 0.6);
    }
    .tools-sidebar-overlay.visible {
      opacity: 1;
      pointer-events: auto;
    }

    /* Sidebar Header Details */
    .tools-sb-header {
      padding: 20px 24px;
      border-bottom: 1px solid var(--paper-edge, #e0d5c5);
      display: flex;
      align-items: center;
      justify-content: space-between;
      background: var(--paper-warm, #f5efe6);
      flex-shrink: 0;
    }
    .tools-sb-header h2 {
      font-family: 'Georgia', serif;
      font-size: 1.25rem;
      font-weight: 700;
      color: var(--ink, #2c3e50);
      margin: 0;
    }
    .tools-sb-header h2 em {
      font-style: italic;
      color: #3498db;
    }
    .tools-sb-close {
      width: 32px;
      height: 32px;
      font-size: 1rem;
      color: #7f8c8d;
      border-radius: 6px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.2s ease;
      background: none;
      border: none;
    }
    .tools-sb-close:hover {
      color: #2c3e50;
      background: #e0d5c5;
    }

    /* Scrollable items menu wrapper */
    .tools-sb-body {
      flex: 1;
      overflow-y: auto;
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    /* Single Tool Items Card Styling & Animation */
    .tools-sb-item {
      display: flex;
      align-items: flex-start;
      gap: 14px;
      padding: 12px 14px;
      border-radius: 8px;
      border: 1px solid transparent;
      background: transparent;
      transition: all 0.2s ease;
      opacity: 0;
      transform: translateX(20px);
      text-decoration: none;
      cursor: pointer;
    }
    .tools-fixed-sidebar.open .tools-sb-item {
      animation: slideInItem 0.4s cubic-bezier(0.4, 0, 0.2, 1) forwards;
    }
    .tools-sb-item:hover {
      background: var(--paper-warm, #f5efe6);
      border-color: var(--paper-edge, #e0d5c5);
      transform: translateY(-2px);
    }
    .tools-sb-item-icon {
      font-size: 1.3rem;
      width: 38px;
      height: 38px;
      background: var(--paper-warm, #f5efe6);
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 1px solid var(--paper-edge, #e0d5c5);
      transition: background 0.2s ease;
      flex-shrink: 0;
    }
    .tools-sb-item:hover .tools-sb-item-icon {
      background: #d6e4f0;
    }
    body.dark .tools-sb-item:hover .tools-sb-item-icon {
      background: rgba(52, 152, 219, 0.15);
    }
    .tools-sb-item-details {
      flex: 1;
      min-width: 0;
    }
    .tools-sb-item-name {
      font-size: 0.92rem;
      font-weight: 600;
      color: var(--ink, #2c3e50);
      margin-bottom: 2px;
    }
    .tools-sb-item-desc {
      font-size: 0.78rem;
      color: #7f8c8d;
      line-height: 1.4;
    }

    /* Keyframe Animations */
    @keyframes slideInItem {
      to {
        opacity: 1;
        transform: translateX(0);
      }
    }

    /* Scrollbar styling */
    .tools-sb-body::-webkit-scrollbar {
      width: 4px;
    }
    .tools-sb-body::-webkit-scrollbar-track {
      background: var(--paper-warm, #f5efe6);
    }
    .tools-sb-body::-webkit-scrollbar-thumb {
      background: #d5c8b8;
      border-radius: 4px;
    }
    .tools-sb-body::-webkit-scrollbar-thumb:hover {
      background: #bfae98;
    }
  `;

  // 3. Inject styles
  const styleEl = document.createElement("style");
  styleEl.textContent = cssStyles;
  document.head.appendChild(styleEl);

  // 4. Render sidebar UI
  const rootContainer = document.getElementById("tools-sidebar-root");
  if (!rootContainer) return;

  rootContainer.innerHTML = `
    <div class="tools-sidebar-overlay" id="toolsSidebarOverlay"></div>
    <div class="tools-floating-trigger" id="toolsSidebarTrigger" title="Explore Testing Tools" aria-label="Toggle toolkit">🛠️</div>
    <aside class="tools-fixed-sidebar" id="toolsFixedSidebar" aria-label="Mobile Device Testing Toolkit">
      <div class="tools-sb-header">
        <h2>Mobile <em>Device</em></h2>
        <button class="tools-sb-close" id="toolsSidebarClose" aria-label="Close toolkit">✕</button>
      </div>
      <div class="tools-sb-body" id="toolsSidebarBody"></div>
    </aside>
  `;

  const sidebarBody = document.getElementById("toolsSidebarBody");
  const sidebar = document.getElementById("toolsFixedSidebar");
  const trigger = document.getElementById("toolsSidebarTrigger");
  const overlay = document.getElementById("toolsSidebarOverlay");
  const closeBtn = document.getElementById("toolsSidebarClose");

  // 5. Populate tools
  toolsList.forEach((tool, idx) => {
    const itemA = document.createElement("a");
    itemA.href = tool.url;
    itemA.className = "tools-sb-item";
    itemA.style.animationDelay = `${idx * 0.03}s`;

    itemA.innerHTML = `
      <div class="tools-sb-item-icon">${tool.icon}</div>
      <div class="tools-sb-item-details">
        <div class="tools-sb-item-name">${tool.name}</div>
        <div class="tools-sb-item-desc">${tool.desc}</div>
      </div>
    `;
    sidebarBody.appendChild(itemA);
  });

  // 6. Controls
  function toggleSidebar() {
    const isOpen = sidebar.classList.toggle("open");
    trigger.classList.toggle("active", isOpen);
    overlay.classList.toggle("visible", isOpen);
    trigger.innerHTML = isOpen ? "✕" : "🛠️";
  }

  function closeSidebar() {
    sidebar.classList.remove("open");
    trigger.classList.remove("active");
    overlay.classList.remove("visible");
    trigger.innerHTML = "🛠️";
  }

  trigger.addEventListener("click", toggleSidebar);
  overlay.addEventListener("click", closeSidebar);
  closeBtn.addEventListener("click", closeSidebar);

  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeSidebar();
  });
})();
