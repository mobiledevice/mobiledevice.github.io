/**
 * Main interactions: hero terminal typing loop, device readout cycle,
 * scroll-reveal animations, and FAQ accordion.
 */
(function () {
  /* ---------- Hero terminal typing loop ---------- */
  const commands = [
    { device: 'iPhone 15 Pro', viewport: '393 × 852', dpr: '3x' },
    { device: 'Pixel 8', viewport: '412 × 915', dpr: '2.6x' },
    { device: 'Galaxy S24', viewport: '360 × 780', dpr: '3x' },
    { device: 'iPad Mini', viewport: '744 × 1133', dpr: '2x' },
    { device: 'iPhone SE', viewport: '375 × 667', dpr: '2x' }
  ];

  function typeLine(el, text, speed, cb) {
    let i = 0;
    el.textContent = '';
    const cursor = document.createElement('span');
    cursor.className = 'cursor';

    function step() {
      if (i <= text.length) {
        el.textContent = text.slice(0, i);
        el.appendChild(cursor);
        i++;
        setTimeout(step, speed);
      } else if (cb) {
        setTimeout(cb, 500);
      }
    }
    step();
  }

  function runTerminalLoop() {
    const line1 = document.getElementById('termLine1');
    const out = document.getElementById('termOut');
    const readoutDevice = document.getElementById('readoutDevice');
    const readoutViewport = document.getElementById('readoutViewport');
    const frameMini = document.getElementById('frameMini');
    if (!line1 || !out) return;

    let idx = 0;

    function cycle() {
      const cmd = commands[idx % commands.length];
      const text = `test --device="${cmd.device}" --viewport=${cmd.viewport.replace(' ', '')}`;

      out.style.opacity = '0';
      typeLine(line1, text, 28, function () {
        out.innerHTML =
          '<span class="ok">✓</span> viewport ready &nbsp; ' +
          '<span class="ok">✓</span> DPR ' + cmd.dpr + ' &nbsp; ' +
          '<span class="ok">✓</span> touch emulation on';
        out.style.opacity = '1';

        if (readoutDevice) readoutDevice.textContent = cmd.device;
        if (readoutViewport) readoutViewport.textContent = cmd.viewport + ' px';
        if (frameMini) {
          const isTablet = cmd.device.toLowerCase().includes('ipad');
          frameMini.style.width = isTablet ? '40px' : '26px';
          frameMini.style.height = isTablet ? '40px' : '44px';
        }

        idx++;
        setTimeout(cycle, 2600);
      });
    }

    cycle();
  }

  /* ---------- Scroll reveal ---------- */
  function initReveal() {
    const items = document.querySelectorAll('.reveal');
    if (!('IntersectionObserver' in window) || !items.length) {
      items.forEach(function (el) { el.classList.add('is-visible'); });
      return;
    }
    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    items.forEach(function (el) { observer.observe(el); });
  }

  /* ---------- FAQ accordion ---------- */
  function initFaq() {
    document.querySelectorAll('.faq-item').forEach(function (item) {
      const btn = item.querySelector('.faq-question');
      const answer = item.querySelector('.faq-answer');
      if (!btn || !answer) return;

      btn.addEventListener('click', function () {
        const isOpen = item.classList.contains('open');

        document.querySelectorAll('.faq-item.open').forEach(function (openItem) {
          if (openItem !== item) {
            openItem.classList.remove('open');
            openItem.querySelector('.faq-answer').style.maxHeight = null;
            openItem.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
          }
        });

        if (isOpen) {
          item.classList.remove('open');
          answer.style.maxHeight = null;
          btn.setAttribute('aria-expanded', 'false');
        } else {
          item.classList.add('open');
          answer.style.maxHeight = answer.scrollHeight + 'px';
          btn.setAttribute('aria-expanded', 'true');
        }
      });
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    runTerminalLoop();
    initReveal();
    initFaq();
  });
})();
