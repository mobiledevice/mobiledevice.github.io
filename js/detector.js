/**
 * Mobile Device Detector
 * Identifies OS, browser, device model, and hardware-visible features using
 * the User-Agent string, the User-Agent Client Hints API (where available),
 * and standard browser feature-detection APIs. Runs entirely client-side —
 * nothing here is sent to a server.
 */
(function () {

  /* ----------------------------------------------------------------------
   * iPhone model lookup — Apple's UA never reveals the exact iPhone model,
   * so we estimate it from CSS viewport size + device pixel ratio. Several
   * generations share identical screen specs, so results are listed as a
   * likely set, not a single guaranteed answer.
   * -------------------------------------------------------------------- */
  const IPHONE_SCREEN_MAP = [
    { w: 320, h: 568, dpr: 2, models: ['iPhone SE (1st gen)', 'iPhone 5 / 5s / 5c'] },
    { w: 375, h: 667, dpr: 2, models: ['iPhone SE (2nd/3rd gen)', 'iPhone 6 / 7 / 8'] },
    { w: 414, h: 736, dpr: 3, models: ['iPhone 6 / 7 / 8 Plus'] },
    { w: 375, h: 812, dpr: 3, models: ['iPhone 13 mini / 12 mini', 'iPhone X / XS / 11 Pro'] },
    { w: 414, h: 896, dpr: 2, models: ['iPhone 11', 'iPhone XR'] },
    { w: 414, h: 896, dpr: 3, models: ['iPhone 11 Pro Max', 'iPhone XS Max'] },
    { w: 390, h: 844, dpr: 3, models: ['iPhone 14', 'iPhone 13 / 13 Pro', 'iPhone 12 / 12 Pro'] },
    { w: 428, h: 926, dpr: 3, models: ['iPhone 14 Plus', 'iPhone 13 Pro Max', 'iPhone 12 Pro Max'] },
    { w: 393, h: 852, dpr: 3, models: ['iPhone 15 / 15 Pro', 'iPhone 14 Pro'] },
    { w: 430, h: 932, dpr: 3, models: ['iPhone 15 Plus / 15 Pro Max', 'iPhone 14 Pro Max'] },
    { w: 402, h: 874, dpr: 3, models: ['iPhone 16 / 16 Pro'] },
    { w: 440, h: 956, dpr: 3, models: ['iPhone 16 Plus / 16 Pro Max'] }
  ];

  function guessIphoneModels() {
    const w = Math.min(window.screen.width, window.screen.height);
    const h = Math.max(window.screen.width, window.screen.height);
    const dpr = Math.round(window.devicePixelRatio || 2);
    const match = IPHONE_SCREEN_MAP.find(function (m) {
      return m.w === w && m.h === h && m.dpr === dpr;
    });
    return match ? match.models : null;
  }

  /* ----------------------------------------------------------------------
   * Core UA / OS / browser parsing
   * -------------------------------------------------------------------- */
  function parseUA(ua) {
    const u = ua.toLowerCase();
    const result = {
      os: 'Unknown OS',
      osVersion: '',
      browser: 'Unknown browser',
      browserVersion: '',
      deviceType: 'Desktop',
      deviceModel: null,
      confidence: 'estimated'
    };

    // --- OS + base device type ---
    if (/iphone/.test(u)) {
      result.os = 'iOS';
      result.deviceType = 'Phone';
      result.deviceModel = 'iPhone';
      const m = ua.match(/OS (\d+)_(\d+)/);
      if (m) result.osVersion = m[1] + '.' + m[2];
    } else if (/ipad/.test(u) || (/macintosh/.test(u) && navigator.maxTouchPoints > 1)) {
      result.os = 'iPadOS';
      result.deviceType = 'Tablet';
      result.deviceModel = 'iPad';
      const m = ua.match(/OS (\d+)_(\d+)/);
      if (m) result.osVersion = m[1] + '.' + m[2];
    } else if (/android/.test(u)) {
      result.os = 'Android';
      result.deviceType = /mobile/.test(u) ? 'Phone' : 'Tablet';
      const v = ua.match(/Android\s?([\d.]+)/);
      if (v) result.osVersion = v[1];
      const m = ua.match(/Android\s?[\d.]*;\s*([^;)]+?)(?:\sBuild|\))/i);
      if (m && m[1]) {
        const candidate = m[1].trim();
        if (!/^(K|wv|Mobile)$/i.test(candidate)) {
          result.deviceModel = candidate;
        }
      }
    } else if (/windows phone/.test(u)) {
      result.os = 'Windows Phone';
      result.deviceType = 'Phone';
    } else if (/macintosh/.test(u)) {
      result.os = 'macOS';
      result.deviceType = 'Desktop';
      result.deviceModel = 'Mac';
    } else if (/windows/.test(u)) {
      result.os = 'Windows';
      result.deviceType = 'Desktop';
      result.deviceModel = 'Windows PC';
    } else if (/linux/.test(u)) {
      result.os = 'Linux';
      result.deviceType = 'Desktop';
      result.deviceModel = 'Linux PC';
    }

    // --- Browser ---
    if (/edg\//.test(u)) {
      result.browser = 'Edge';
      const m = ua.match(/Edg\/([\d.]+)/);
      if (m) result.browserVersion = m[1];
    } else if (/opr\//.test(u) || /opera/.test(u)) {
      result.browser = 'Opera';
      const m = ua.match(/(?:OPR|Opera)\/([\d.]+)/);
      if (m) result.browserVersion = m[1];
    } else if (/crios\//.test(u)) {
      result.browser = 'Chrome for iOS';
      const m = ua.match(/CriOS\/([\d.]+)/);
      if (m) result.browserVersion = m[1];
    } else if (/fxios\//.test(u)) {
      result.browser = 'Firefox for iOS';
      const m = ua.match(/FxiOS\/([\d.]+)/);
      if (m) result.browserVersion = m[1];
    } else if (/samsungbrowser\//.test(u)) {
      result.browser = 'Samsung Internet';
      const m = ua.match(/SamsungBrowser\/([\d.]+)/);
      if (m) result.browserVersion = m[1];
    } else if (/chrome\//.test(u)) {
      result.browser = 'Chrome';
      const m = ua.match(/Chrome\/([\d.]+)/);
      if (m) result.browserVersion = m[1];
    } else if (/firefox\//.test(u)) {
      result.browser = 'Firefox';
      const m = ua.match(/Firefox\/([\d.]+)/);
      if (m) result.browserVersion = m[1];
    } else if (/version\//.test(u) && /safari\//.test(u)) {
      result.browser = 'Safari';
      const m = ua.match(/Version\/([\d.]+)/);
      if (m) result.browserVersion = m[1];
    }

    return result;
  }

  /* ----------------------------------------------------------------------
   * Client Hints — where supported (Chromium on Android), this can return
   * the exact marketing model name, which is far more reliable than UA
   * parsing alone.
   * -------------------------------------------------------------------- */
  function getHighEntropyModel() {
    if (navigator.userAgentData && navigator.userAgentData.getHighEntropyValues) {
      return navigator.userAgentData.getHighEntropyValues(['model', 'platformVersion'])
        .then(function (data) {
          return data && data.model ? data.model : null;
        })
        .catch(function () { return null; });
    }
    return Promise.resolve(null);
  }

  /* ----------------------------------------------------------------------
   * Feature / hardware signals
   * -------------------------------------------------------------------- */
  function collectSpecs() {
    const dpr = window.devicePixelRatio || 1;
    const touch = ('ontouchstart' in window) || navigator.maxTouchPoints > 0;
    const orientation = (screen.orientation && screen.orientation.type)
      ? screen.orientation.type.split('-')[0]
      : (window.innerWidth > window.innerHeight ? 'landscape' : 'portrait');
    const conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection;

    return [
      { icon: '📐', label: 'Viewport size', value: window.innerWidth + ' × ' + window.innerHeight + ' px' },
      { icon: '🖥️', label: 'Screen resolution', value: Math.round(screen.width * dpr) + ' × ' + Math.round(screen.height * dpr) + ' px' },
      { icon: '🔍', label: 'Pixel ratio', value: dpr + 'x' },
      { icon: '🔄', label: 'Orientation', value: orientation.charAt(0).toUpperCase() + orientation.slice(1) },
      { icon: '👆', label: 'Touch support', value: touch ? 'Yes (' + (navigator.maxTouchPoints || 1) + ' points)' : 'No' },
      { icon: '⚙️', label: 'CPU cores', value: navigator.hardwareConcurrency ? String(navigator.hardwareConcurrency) : 'Not available' },
      { icon: '💾', label: 'Memory (approx.)', value: navigator.deviceMemory ? navigator.deviceMemory + ' GB' : 'Not available' },
      { icon: '📶', label: 'Connection type', value: conn && conn.effectiveType ? conn.effectiveType.toUpperCase() : 'Not available' },
      { icon: '🌐', label: 'Language', value: navigator.language || 'Not available' },
      { icon: '🎨', label: 'Color scheme', value: window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'Dark' : 'Light' },
      { icon: '📲', label: 'Installed as app', value: (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) || window.navigator.standalone ? 'Yes' : 'No' },
      { icon: '🍪', label: 'Cookies enabled', value: navigator.cookieEnabled ? 'Yes' : 'No' }
    ];
  }

  /* ----------------------------------------------------------------------
   * Rendering
   * -------------------------------------------------------------------- */
  function deviceEmoji(deviceType) {
    if (deviceType === 'Phone') return '📱';
    if (deviceType === 'Tablet') return '📱';
    return '💻';
  }

  function renderScanLines(container, cb) {
    const lines = [
      'reading user-agent string',
      'checking screen &amp; pixel data',
      'querying client hints',
      'identifying model'
    ];
    let i = 0;
    const list = document.createElement('div');
    container.appendChild(list);

    function next() {
      if (i >= lines.length) { cb(); return; }
      const row = document.createElement('div');
      row.className = 'terminal-line';
      row.innerHTML = '<span class="terminal-prompt">$</span> ' + lines[i] + ' <span class="scan-dots">...</span>';
      list.appendChild(row);
      setTimeout(function () {
        row.innerHTML = '<span class="ok mono">✓</span> ' + lines[i];
        i++;
        setTimeout(next, 260);
      }, 340);
    }
    next();
  }

  function renderResult(result, iphoneGuess) {
    const card = document.getElementById('resultCard');
    if (!card) return;

    let modelLine = result.deviceModel || 'Unrecognized device';
    let subLine = [result.os, result.osVersion].filter(Boolean).join(' ');
    let badgeClass = result.confidence === 'high' ? 'high' : 'estimated';
    let badgeText = result.confidence === 'high' ? 'High confidence — exact model' : 'Estimated from screen &amp; browser data';

    let guessBlock = '';
    if (iphoneGuess && iphoneGuess.length) {
      guessBlock = `
        <div class="iphone-guess">
          <span class="mono">Likely model${iphoneGuess.length > 1 ? 's' : ''}:</span>
          ${iphoneGuess.map(function (m) { return '<span class="tool-tag">' + m + '</span>'; }).join(' ')}
        </div>`;
    }

    card.innerHTML = `
      <div class="device-emoji-badge">${deviceEmoji(result.deviceType)}</div>
      <h1 class="result-device-name">${modelLine}</h1>
      <p class="result-sub mono">${subLine} &middot; ${result.browser} ${result.browserVersion}</p>
      <span class="confidence-badge ${badgeClass}">${badgeText}</span>
      ${guessBlock}
      <div class="result-actions">
        <button class="btn btn-primary btn-sm" id="copyResultBtn">Copy result</button>
        <button class="btn btn-ghost btn-sm" id="rescanBtn">Scan again</button>
      </div>
    `;

    document.getElementById('copyResultBtn').addEventListener('click', function () {
      const text = `Device: ${modelLine}\nOS: ${subLine}\nBrowser: ${result.browser} ${result.browserVersion}\nType: ${result.deviceType}`;
      copyToClipboard(text);
    });
    document.getElementById('rescanBtn').addEventListener('click', runDetection);
  }

  function renderSpecs() {
    const grid = document.getElementById('specGrid');
    if (!grid) return;
    const specs = collectSpecs();
    grid.innerHTML = specs.map(function (s) {
      return `
        <div class="spec-item">
          <div class="spec-label">${s.icon} ${s.label}</div>
          <div class="spec-value">${s.value}</div>
        </div>
      `;
    }).join('');
  }

  function copyToClipboard(text) {
    const toast = document.getElementById('detectorToast');
    function show() {
      if (!toast) return;
      toast.classList.add('show');
      setTimeout(function () { toast.classList.remove('show'); }, 1800);
    }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(show).catch(show);
    } else {
      const ta = document.createElement('textarea');
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      try { document.execCommand('copy'); } catch (e) {}
      document.body.removeChild(ta);
      show();
    }
  }

  /* ----------------------------------------------------------------------
   * Orchestration
   * -------------------------------------------------------------------- */
  function runDetection() {
    const scanEl = document.getElementById('scanTerminalBody');
    const resultCard = document.getElementById('resultCard');
    const scanWrap = document.getElementById('scanTerminal');
    if (!scanEl || !resultCard || !scanWrap) return;

    scanEl.innerHTML = '';
    resultCard.hidden = true;
    scanWrap.hidden = false;

    renderScanLines(scanEl, function () {
      const baseResult = parseUA(navigator.userAgent);

      getHighEntropyModel().then(function (model) {
        if (model) {
          baseResult.deviceModel = model;
          baseResult.confidence = 'high';
        }

        let iphoneGuess = null;
        if (baseResult.os === 'iOS' && baseResult.confidence !== 'high') {
          iphoneGuess = guessIphoneModels();
        }

        scanWrap.hidden = true;
        resultCard.hidden = false;
        renderResult(baseResult, iphoneGuess);
        renderSpecs();
      });
    });
  }

  document.addEventListener('DOMContentLoaded', runDetection);
})();
