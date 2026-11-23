/* UNNATI ISPAT: shared script (vanilla JS, no dependencies) */
(function () {
  'use strict';

  var WA_NUMBER = '919152535156';
  var EMAIL_TO = 'info@unnatiispat.com';
  var EMAIL_CC = 'unnatiispat@gmail.com';

  /* ---------- Footer year ---------- */
  document.querySelectorAll('[data-year]').forEach(function (el) {
    el.textContent = String(new Date().getFullYear());
  });

  /* ---------- Sticky header shrink ---------- */
  var header = document.querySelector('.site-header');
  function onScroll() {
    if (header) header.classList.toggle('is-scrolled', window.scrollY > 24);
  }
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ---------- Mobile navigation ---------- */
  var navToggle = document.querySelector('.nav-toggle');
  var nav = document.getElementById('site-nav');
  function setNav(open) {
    if (!navToggle || !nav) return;
    navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    navToggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    nav.classList.toggle('is-open', open);
  }
  if (navToggle && nav) {
    navToggle.addEventListener('click', function () {
      setNav(navToggle.getAttribute('aria-expanded') !== 'true');
    });
    nav.addEventListener('click', function (e) {
      if (e.target.closest('a, button')) setNav(false);
    });
    window.addEventListener('resize', function () {
      if (window.innerWidth >= 1536) setNav(false);
    });
  }

  /* ---------- Modals ---------- */
  var lastFocus = null;
  var FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select, textarea, [tabindex]:not([tabindex="-1"])';

  function openModal(name, opts) {
    var modal = document.getElementById('modal-' + name);
    if (!modal) return false;
    lastFocus = document.activeElement;
    modal.hidden = false;
    modal.classList.add('is-open');
    document.body.classList.add('modal-open');
    opts = opts || {};
    if (opts.product) {
      var sel = modal.querySelector('select[name="product"]');
      if (sel) sel.value = opts.product;
    }
    if (opts.calcType) {
      var calc = modal.querySelector('[data-calc]');
      if (calc) setCalcType(calc, opts.calcType);
    }
    var first = modal.querySelector('.modal-body ' + FOCUSABLE) || modal.querySelector('.modal-close');
    if (first) first.focus();
    return true;
  }
  function closeModal(modal) {
    if (!modal) return;
    modal.classList.remove('is-open');
    modal.hidden = true;
    document.body.classList.remove('modal-open');
    if (lastFocus && typeof lastFocus.focus === 'function') lastFocus.focus();
  }

  document.addEventListener('click', function (e) {
    var opener = e.target.closest('[data-open]');
    if (opener) {
      if (openModal(opener.getAttribute('data-open'), {
        product: opener.getAttribute('data-product'),
        calcType: opener.getAttribute('data-calc-type')
      })) e.preventDefault();
      return;
    }
    var closer = e.target.closest('[data-close]');
    if (closer) closeModal(closer.closest('.modal'));
  });

  document.addEventListener('keydown', function (e) {
    var modal = document.querySelector('.modal.is-open');
    if (e.key === 'Escape') {
      if (modal) closeModal(modal);
      else if (nav && nav.classList.contains('is-open')) { setNav(false); navToggle.focus(); }
      return;
    }
    if (e.key === 'Tab' && modal) {
      var items = Array.prototype.filter.call(modal.querySelectorAll(FOCUSABLE), function (el) {
        return el.offsetParent !== null;
      });
      if (!items.length) return;
      var first = items[0], last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });

  /* ---------- Enquiry forms → WhatsApp / e-mail ---------- */
  function val(form, name) {
    var el = form.elements.namedItem(name);
    return el && el.value ? String(el.value).trim() : '';
  }
  document.querySelectorAll('form[data-enquiry]').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var via = (e.submitter && e.submitter.value) || 'whatsapp';
      var name = val(form, 'name');
      var phone = val(form, 'phone');
      var err = form.querySelector('.form-error');
      var ok = form.querySelector('.form-success');
      if (ok) ok.hidden = true;
      if (!name || !phone) {
        if (err) { err.textContent = 'Please enter your name and phone number so that our team can respond.'; err.hidden = false; }
        var miss = form.elements.namedItem(!name ? 'name' : 'phone');
        if (miss) { miss.setAttribute('aria-invalid', 'true'); miss.focus(); }
        return;
      }
      if (err) err.hidden = true;
      ['name', 'phone'].forEach(function (n) { var f = form.elements.namedItem(n); if (f) f.removeAttribute('aria-invalid'); });

      var product = val(form, 'product');
      var lines = ['Steel enquiry via unnatiispat.com', '', 'Name: ' + name];
      if (val(form, 'company')) lines.push('Company: ' + val(form, 'company'));
      lines.push('Phone: ' + phone);
      if (val(form, 'email')) lines.push('Email: ' + val(form, 'email'));
      if (product) lines.push('Product: ' + product);
      if (val(form, 'requirement')) lines.push('Requirement (grade / size / quantity): ' + val(form, 'requirement'));
      var text = lines.join('\n');

      if (via === 'email') {
        var subject = 'Steel enquiry' + (product ? ': ' + product : '') + ' from ' + name;
        window.location.href = 'mailto:' + EMAIL_TO + '?cc=' + encodeURIComponent(EMAIL_CC) +
          '&subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(text);
      } else {
        window.open('https://wa.me/' + WA_NUMBER + '?text=' + encodeURIComponent(text), '_blank', 'noopener');
      }
      if (ok) {
        ok.textContent = via === 'email'
          ? 'Your e-mail app has opened with the enquiry filled in. Please press Send to complete it.'
          : 'WhatsApp has opened with your enquiry filled in. Please press Send to complete it.';
        ok.hidden = false;
      }
    });
  });

  /* ---------- Products: search + category filter ---------- */
  var grid = document.querySelector('[data-product-grid]');
  if (grid) {
    var items = Array.prototype.slice.call(grid.querySelectorAll('[data-cat]'));
    var search = document.getElementById('product-search');
    var chips = Array.prototype.slice.call(document.querySelectorAll('[data-filter]'));
    var status = document.querySelector('[data-filter-status]');
    var empty = document.querySelector('[data-empty]');
    var params = new URLSearchParams(window.location.search);
    var cat = params.get('cat') || 'all';
    if (!chips.some(function (c) { return c.getAttribute('data-filter') === cat; })) cat = 'all';

    var applyProducts = function () {
      var q = search ? search.value.trim().toLowerCase() : '';
      var shown = 0;
      items.forEach(function (li) {
        var ok = (cat === 'all' || li.getAttribute('data-cat') === cat) &&
          (!q || li.getAttribute('data-search').indexOf(q) !== -1);
        li.hidden = !ok;
        if (ok) shown++;
      });
      var label = 'All categories';
      chips.forEach(function (c) {
        var on = c.getAttribute('data-filter') === cat;
        c.setAttribute('aria-pressed', on ? 'true' : 'false');
        if (on) label = c.textContent.trim();
      });
      if (status) status.textContent = 'Showing: ' + label + (q ? ' · matching “' + q + '”' : '');
      if (empty) empty.hidden = shown > 0;
    };
    chips.forEach(function (c) {
      c.addEventListener('click', function () {
        cat = c.getAttribute('data-filter');
        var url = new URL(window.location.href);
        if (cat === 'all') url.searchParams.delete('cat'); else url.searchParams.set('cat', cat);
        window.history.replaceState(null, '', url);
        applyProducts();
      });
    });
    if (search) search.addEventListener('input', applyProducts);
    var reset = document.querySelector('[data-reset]');
    if (reset) reset.addEventListener('click', function () { cat = 'all'; if (search) search.value = ''; applyProducts(); });
    applyProducts();
  }

  /* ---------- Weight reference centre: tabs ---------- */
  var refGrid = document.querySelector('[data-ref-grid]');
  if (refGrid) {
    var refItems = Array.prototype.slice.call(refGrid.querySelectorAll('[data-group]'));
    var tabs = Array.prototype.slice.call(document.querySelectorAll('[data-ref-tab]'));
    tabs.forEach(function (t) {
      t.addEventListener('click', function () {
        var g = t.getAttribute('data-ref-tab');
        tabs.forEach(function (x) { x.setAttribute('aria-pressed', x === t ? 'true' : 'false'); });
        refItems.forEach(function (li) { li.hidden = !(g === 'all' || li.getAttribute('data-group') === g); });
      });
    });
  }

  /* ---------- Weight calculator ---------- */
  var DENSITY = 7850; // kg/m³
  var fmt = function (n, d) {
    return Number(n).toLocaleString('en-IN', { minimumFractionDigits: d, maximumFractionDigits: d });
  };
  var FORMULAS = {
    round: 'kg/m = d² ÷ 162',
    flat: 'kg/m = w × t × 0.00785',
    plate: 'kg = L × W × t × 0.00785 ÷ 1000 (all in mm) · kg/m² = t × 7.85',
    pipe: 'kg/m = (OD − t) × t × 0.02466',
    hollow: 'kg/m = 2 × (A + B − 2t) × t × 0.00785',
    known: 'kg/m as entered from the section table or catalogue'
  };

  function setCalcType(calc, type) {
    var radio = calc.querySelector('input[type="radio"][value="' + type + '"]');
    if (radio) { radio.checked = true; updateCalc(calc); }
  }

  function num(calc, name) {
    var el = calc.querySelector('[name="' + name + '"]');
    var v = el ? parseFloat(el.value) : NaN;
    return isFinite(v) ? v : NaN;
  }

  function updateCalc(calc) {
    var checked = calc.querySelector('input[type="radio"]:checked');
    var type = checked ? checked.value : 'round';
    calc.querySelectorAll('[data-types]').forEach(function (f) {
      f.hidden = f.getAttribute('data-types').split(' ').indexOf(type) === -1;
    });
    var out = function (key, text) { var el = calc.querySelector('[data-out="' + key + '"]'); if (el) el.textContent = text; };
    var msg = calc.querySelector('[data-msg]');
    var per = calc.querySelector('[data-per-label]');
    var pieceLabel = calc.querySelector('[data-piece-label]');
    if (per) per.textContent = type === 'plate' ? 'Weight per m²' : 'Weight per metre';
    if (pieceLabel) pieceLabel.textContent = type === 'plate' ? 'Weight per plate / sheet' : 'Weight per piece';
    var f = calc.querySelector('[data-formula]');
    if (f) f.textContent = FORMULAS[type];

    var qty = num(calc, 'qty');
    var len = num(calc, 'len');
    var unitW = NaN, piece = NaN, problem = '';
    var t;
    switch (type) {
      case 'round':
        var d = num(calc, 'd');
        unitW = d * d / 162; piece = unitW * len; break;
      case 'flat':
        unitW = num(calc, 'fw') * num(calc, 'ft') * 0.00785; piece = unitW * len; break;
      case 'plate':
        t = num(calc, 'pt');
        unitW = t * DENSITY / 1000; // kg/m²
        piece = num(calc, 'pl') * num(calc, 'pw') * t * 0.00785 / 1000; break;
      case 'pipe':
        var od = num(calc, 'od'); t = num(calc, 'pwt');
        if (t * 2 >= od) problem = 'Wall thickness must be less than half the outside diameter.';
        unitW = (od - t) * t * 0.02466; piece = unitW * len; break;
      case 'hollow':
        var a = num(calc, 'ha'), b = num(calc, 'hb'); t = num(calc, 'hwt');
        if (t * 2 >= Math.min(a, b)) problem = 'Wall thickness must be less than half the smaller side.';
        unitW = 2 * (a + b - 2 * t) * t * 0.00785; piece = unitW * len; break;
      case 'known':
        unitW = num(calc, 'kgm'); piece = unitW * len; break;
    }
    var total = piece * qty;
    var valid = !problem && isFinite(unitW) && unitW > 0 && isFinite(total) && total > 0;
    if (msg) {
      msg.textContent = problem || (valid ? '' : 'Enter positive values in every field to see the estimate.');
      msg.hidden = valid;
    }
    out('per', valid ? fmt(unitW, 3) + (type === 'plate' ? ' kg/m²' : ' kg/m') : '-');
    out('piece', valid ? fmt(piece, 2) + ' kg' : '-');
    out('total', valid ? fmt(total, 2) + ' kg' : '-');
    out('tonnes', valid ? fmt(total / 1000, 3) + ' t' : '-');
  }

  document.querySelectorAll('[data-calc]').forEach(function (calc) {
    calc.addEventListener('input', function () { updateCalc(calc); });
    calc.addEventListener('change', function () { updateCalc(calc); });
    updateCalc(calc);
  });

  var preset = new URLSearchParams(window.location.search).get('type');
  var pageCalc = document.querySelector('.calc-page [data-calc]');
  if (preset && pageCalc) setCalcType(pageCalc, preset);

  /* ---------- Gauge Conversion Chart Filter ---------- */
  document.querySelectorAll('.gauge-search-input').forEach(function (input) {
    input.addEventListener('input', function () {
      var q = this.value.trim().toLowerCase();
      var section = this.closest('.pd-section') || this.closest('section');
      if (!section) return;
      var tbody = section.querySelector('.gauge-table tbody');
      if (!tbody) return;
      var rows = Array.prototype.slice.call(tbody.querySelectorAll('tr:not(.gauge-no-match)'));
      var matchCount = 0;
      rows.forEach(function (tr) {
        if (!q) {
          tr.style.display = '';
          matchCount++;
          return;
        }
        var text = tr.textContent.toLowerCase();
        var matches = text.indexOf(q) !== -1;
        tr.style.display = matches ? '' : 'none';
        if (matches) matchCount++;
      });
      var noMatch = tbody.querySelector('.gauge-no-match');
      if (!noMatch) {
        noMatch = document.createElement('tr');
        noMatch.className = 'gauge-no-match';
        noMatch.innerHTML = '<td colspan="9">No matching gauge or thickness found. Try another number (e.g. 16, 20, 1.6).</td>';
        tbody.appendChild(noMatch);
      }
      noMatch.style.display = matchCount === 0 ? '' : 'none';
    });
  });

  /* ---------- Weight Reference Centre: Formula Tabs ---------- */
  var formulaGrid = document.querySelector('[data-formula-grid]');
  if (formulaGrid) {
    var formulaItems = Array.prototype.slice.call(formulaGrid.querySelectorAll('[data-fgroup]'));
    var ftabs = Array.prototype.slice.call(document.querySelectorAll('[data-formula-tab]'));
    ftabs.forEach(function (t) {
      t.addEventListener('click', function () {
        var g = t.getAttribute('data-formula-tab');
        ftabs.forEach(function (x) { x.setAttribute('aria-pressed', x === t ? 'true' : 'false'); });
        formulaItems.forEach(function (item) { item.hidden = !(g === 'all' || item.getAttribute('data-fgroup') === g); });
      });
    });
  }
})();
