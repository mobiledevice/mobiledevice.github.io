/**
 * Footer component
 * Injects site footer into #site-footer.
 */
(function () {
  function currentYear() {
    return new Date().getFullYear();
  }

  function html() {
    return `
      <div class="container">
        <div class="footer-grid">
          <div class="footer-brand">
            <a href="/" class="brand" aria-label="Mobile Device Testing Tools home">
              <span class="brand-mark">&lt;/&gt;</span>
              <span>mobiledevice<span style="color:var(--blue)">.tools</span></span>
            </a>
            <p>A free, client-side toolkit for testing how your site behaves on real mobile devices &mdash; viewports, gestures, networks, and more.</p>
          </div>

          <div class="footer-col">
            <h4>Tools</h4>
            <ul>
              <li><a href="#tools">Viewport Simulator</a></li>
              <li><a href="#tools">Touch Event Tester</a></li>
              <li><a href="#tools">Breakpoint Inspector</a></li>
              <li><a href="#tools">All tools</a></li>
            </ul>
          </div>

          <div class="footer-col">
            <h4>Site</h4>
            <ul>
              <li><a href="#how-it-works">How it works</a></li>
              <li><a href="#why">Why this platform</a></li>
              <li><a href="#use-cases">Use cases</a></li>
              <li><a href="#faq">FAQ</a></li>
            </ul>
          </div>

          <div class="footer-col">
            <h4>Resources</h4>
            <ul>
              <li><a href="/blog/">Blog</a></li>
              <li><a href="/about/">About</a></li>
              <li><a href="/privacy/">Privacy</a></li>
              <li><a href="/contact/">Contact</a></li>
            </ul>
          </div>
        </div>

        <div class="footer-bottom">
          <span>&copy; ${currentYear()} mobiledevice.tools &mdash; built for developers, in the browser.</span>
          <span><a href="/sitemap.xml">Sitemap</a> &middot; <a href="/privacy/">Privacy</a></span>
        </div>
      </div>
    `;
  }

  function init() {
    const mount = document.getElementById('site-footer');
    if (!mount) return;
    mount.innerHTML = html();
    mount.classList.add('site-footer');
  }

  document.addEventListener('DOMContentLoaded', init);
})();
