/**
 * Main interactions: hero terminal typing loop, device readout cycle,
 * scroll-reveal animations, and FAQ accordion.
 */
(function () {
  /* ---------- Hero terminal typing loop ---------- */
  const commands = [
    { check: 'camera', label: 'Camera', result: 'front OK · rear OK · flash OK' },
    { check: 'microphone', label: 'Microphone', result: 'input level OK · no clipping' },
    { check: 'touchscreen', label: 'Touch Screen', result: 'all zones responsive' },
    { check: 'sensors', label: 'Motion Sensors', result: 'accelerometer OK · gyroscope OK' },
    { check: 'battery', label: 'Battery', result: '94% health · charging normally' }
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
      const text = `run --check=${cmd.check}`;

      out.style.opacity = '0';
      typeLine(line1, text, 28, function () {
        out.innerHTML = '<span class="ok">✓</span> ' + cmd.result;
        out.style.opacity = '1';

        if (readoutDevice) readoutDevice.textContent = cmd.label;
        if (readoutViewport) readoutViewport.textContent = 'Passed';
        if (frameMini) {
          frameMini.style.borderColor = 'var(--green)';
          setTimeout(function () { frameMini.style.borderColor = 'var(--ink)'; }, 900);
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
