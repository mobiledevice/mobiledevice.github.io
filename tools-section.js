/**
 * Mobile Testing Tools component
 * Fetches /data/tools-data.txt (pipe-delimited), parses it, and renders
 * filterable tool cards into #tools-container.
 *
 * Row format: id|name|icon|category|description|url|status
 * Lines starting with # are treated as comments and skipped.
 *
 * Note: fetch() requires the page to be served over http(s), not opened
 * directly as a file:// URL. This works out of the box on GitHub Pages,
 * and locally via any static server (e.g. `npx serve`).
 */
(function () {
  const DATA_URL = 'data/tools-data.txt';
  let allTools = [];
  let activeCategory = 'All';

  const ARROW_SVG = `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M7 17L17 7M17 7H9M17 7V15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`;

  function parseLine(line) {
    const parts = line.split('|').map(function (s) { return s.trim(); });
    if (parts.length < 7) return null;
    const [id, name, icon, category, description, url, status] = parts;
    return { id, name, icon, category, description, url, status };
  }

  function parseData(text) {
    return text
      .split('\n')
      .map(function (l) { return l.trim(); })
      .filter(function (l) { return l && !l.startsWith('#'); })
      .map(parseLine)
      .filter(Boolean);
  }

  function categoriesFrom(tools) {
    const set = new Set(tools.map(function (t) { return t.category; }));
    return ['All'].concat(Array.from(set).sort());
  }

  function statusLabel(status) {
    return status === 'live' ? 'Live' : 'Coming soon';
  }

  function toolCard(tool) {
    const statusClass = tool.status === 'live' ? 'tool-status live' : 'tool-status';
    return `
      <article class="tool-card" data-category="${tool.category}">
        <div class="tool-card-chrome">
          <span class="dot"></span><span class="dot"></span><span class="dot"></span>
          <span class="path mono">${tool.url}</span>
        </div>
        <div class="tool-card-body">
          <div class="tool-icon">${tool.icon}</div>
          <h3>${tool.name}</h3>
          <p>${tool.description}</p>
          <div class="tool-card-footer">
            <span class="tool-tag">${tool.category}</span>
            <span class="${statusClass}">${statusLabel(tool.status)}</span>
          </div>
          <a href="${tool.url}" class="tool-link" style="margin-top:14px;" aria-label="Open ${tool.name}">
            Open tool ${ARROW_SVG}
          </a>
        </div>
      </article>
    `;
  }

  function renderPills(categories) {
    const wrap = document.getElementById('toolsFilters');
    if (!wrap) return;
    wrap.innerHTML = categories
      .map(function (cat) {
        const active = cat === activeCategory ? ' active' : '';
        return `<button class="filter-pill${active}" data-category="${cat}">${cat}</button>`;
      })
      .join('');

    wrap.querySelectorAll('.filter-pill').forEach(function (btn) {
      btn.addEventListener('click', function () {
        activeCategory = btn.getAttribute('data-category');
        wrap.querySelectorAll('.filter-pill').forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');
        renderGrid();
      });
    });
  }

  function renderGrid() {
    const grid = document.getElementById('toolsGrid');
    if (!grid) return;
    const filtered = activeCategory === 'All'
      ? allTools
      : allTools.filter(function (t) { return t.category === activeCategory; });

    grid.innerHTML = filtered.length
      ? filtered.map(toolCard).join('')
      : '<div class="tools-empty">No tools in this category yet.</div>';
  }

  function renderCount() {
    const el = document.getElementById('toolsCount');
    if (el) el.textContent = String(allTools.length);
  }

  function renderError() {
    const grid = document.getElementById('toolsGrid');
    if (grid) {
      grid.innerHTML = '<div class="tools-empty">Couldn\'t load the tools list. If you\'re viewing this file directly, serve the folder with a local server so fetch() can reach data/tools-data.txt.</div>';
    }
  }

  function init() {
    const container = document.getElementById('tools-container');
    if (!container) return;

    fetch(DATA_URL)
      .then(function (res) {
        if (!res.ok) throw new Error('Failed to load tools data');
        return res.text();
      })
      .then(function (text) {
        allTools = parseData(text);
        renderPills(categoriesFrom(allTools));
        renderGrid();
        renderCount();
      })
      .catch(function () {
        renderError();
      });
  }

  document.addEventListener('DOMContentLoaded', init);
})();
