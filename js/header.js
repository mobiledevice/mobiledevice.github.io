/**
 * Header component
 * Injects site navigation into #site-header and wires up the mobile menu toggle.
 */
(function () {
  const HEADER_HTML = `
    <div class="container header-inner">
      <a href="/" class="brand" aria-label="Mobile Device Testing Tools home">
        <span class="brand-mark">&lt;/&gt;</span>
        <span>Mobile Device<span style="color:var(--blue)"> Test</span></span>
      </a>

      <ul class="nav-links">
        <li><a href="#tools">Tools</a></li>
        <li><a href="#how-it-works">How it works</a></li>
        <li><a href="#why">Why us</a></li>
        <li><a href="#use-cases">Use cases</a></li>
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

    const toggle = document.getElementById('navToggle');
    if (toggle) {
      toggle.addEventListener('click', function () {
        const isOpen = mount.classList.toggle('nav-open');
        toggle.setAttribute('aria-expanded', String(isOpen));
      });
    }

    // Close mobile menu after a nav link is tapped
    mount.querySelectorAll('.nav-links a').forEach(function (link) {
      link.addEventListener('click', function () {
        mount.classList.remove('nav-open');
        if (toggle) toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  document.addEventListener('DOMContentLoaded', init);
})();
