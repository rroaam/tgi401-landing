/* ============================================
   TGI401 — Custom Code Injection v3 (JS)
   Clean mobile + form fix + accessibility
   ============================================ */
(function() {
  'use strict';

  function ready(fn) {
    if (document.readyState !== 'loading') fn();
    else document.addEventListener('DOMContentLoaded', fn);
  }

  ready(function() {

    /* --- MOBILE: Ensure page is scrollable --- */
    function handleViewport() {
      var isMobile = window.innerWidth < 768;

      // Always hide the rotate blocker
      var blocker = document.querySelector('.horizontal-mobile-block');
      if (blocker) blocker.style.display = 'none';

      if (isMobile) {
        // Force shop popup visible (it's the key content)
        var shop = document.querySelector('.shoppop');
        if (shop) {
          shop.style.transform = 'scale3d(1, 1, 1)';
          shop.style.opacity = '1';
          shop.style.display = 'block';
          shop.style.visibility = 'visible';
        }

        // Force email form visible
        var forms = document.querySelectorAll('.apppop');
        forms.forEach(function(f) {
          // Only show the one inside formwindow (email capture)
          if (f.closest('.formwindow')) {
            f.style.transform = 'scale3d(1, 1, 1)';
            f.style.opacity = '1';
            f.style.display = 'block';
            f.style.visibility = 'visible';
          }
        });

        // Hide desktop cursor
        var cursor = document.querySelector('.cursor-wrapper');
        if (cursor) cursor.style.display = 'none';
      }
    }

    handleViewport();
    window.addEventListener('resize', handleViewport);


    /* --- EMAIL FORM: Fix and wire submission --- */
    var emailForm = document.querySelector('#email-form');
    if (emailForm) {
      emailForm.method = 'post';

      // Fix duplicate field names
      var inputs = emailForm.querySelectorAll('.text-field');
      if (inputs.length >= 2) {
        inputs[0].name = 'instagram';
        inputs[0].id = 'instagram-field';
        inputs[1].name = 'email';
        inputs[1].id = 'email-field';
        inputs[1].type = 'email';
      } else if (inputs.length === 1) {
        inputs[0].name = 'email';
        inputs[0].id = 'email-field';
        inputs[0].type = 'email';
      }

      emailForm.addEventListener('submit', function(e) {
        e.preventDefault();
        var emailInput = emailForm.querySelector('[name="email"]') || emailForm.querySelector('.text-field');
        var igInput = emailForm.querySelector('[name="instagram"]');
        var email = emailInput ? emailInput.value : '';
        if (!email || !email.includes('@')) return;

        var siteEl = document.querySelector('[data-wf-site]');
        var wfPageId = emailForm.getAttribute('data-wf-page-id');
        var wfElementId = emailForm.getAttribute('data-wf-element-id');

        if (siteEl && wfPageId && wfElementId) {
          var params = {
            'name': 'Email Form',
            'source': window.location.href,
            'test': 'false',
            'dolphin': 'false',
            'pageId': wfPageId,
            'elementId': wfElementId,
            'siteId': siteEl.getAttribute('data-wf-site'),
            'fields[Email]': email
          };
          if (igInput && igInput.value) params['fields[Instagram]'] = igInput.value;

          fetch('https://webflow.com/api/v1/form/' + siteEl.getAttribute('data-wf-site'), {
            method: 'POST',
            headers: { 'Accept': 'application/json', 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams(params)
          }).then(function() {
            showSuccess(emailForm, emailInput);
          }).catch(function() {
            showSuccess(emailForm, emailInput);
          });
        } else {
          showSuccess(emailForm, emailInput);
        }
      });
    }

    function showSuccess(form, input) {
      var done = form.parentElement.querySelector('.w-form-done');
      if (done) { done.style.display = 'block'; form.style.display = 'none'; }
      else if (input) {
        var btn = form.querySelector('[type="submit"], .submit-button');
        if (btn) {
          btn.textContent = "YOU'RE IN";
          btn.style.background = '#28c840';
          input.disabled = true;
          btn.disabled = true;
        }
      }
    }


    /* --- SHIZE → SIZE fix (product pages) --- */
    var sizeMap = {
      'Shize': 'Size', 'ShizeSelect': 'Select Size',
      'Shmall': 'XS', 'shmall': 'XS',
      'shMedium': 'S/M', 'shmedium': 'S/M',
      'shLarge': 'L/XL', 'shlarge': 'L/XL'
    };

    document.querySelectorAll('.field-label, .field-label-5, label, option, select option').forEach(function(el) {
      var t = el.textContent.trim();
      if (sizeMap[t]) el.textContent = sizeMap[t];
    });

    document.querySelectorAll('select').forEach(function(sel) {
      Array.from(sel.options).forEach(function(opt) {
        if (sizeMap[opt.textContent.trim()]) opt.textContent = sizeMap[opt.textContent.trim()];
      });
      if ((sel.getAttribute('aria-label') || '').toLowerCase().includes('shize')) {
        sel.setAttribute('aria-label', 'Select Size');
      }
    });

    // Show the real XS/S/M/L button block if hidden
    var sizeBlock = document.querySelector('.size.w-condition-invisible');
    if (sizeBlock) {
      sizeBlock.classList.remove('w-condition-invisible');
      sizeBlock.style.display = 'flex';
    }


    /* --- Z-INDEX: Click-to-focus windows --- */
    var windows = document.querySelectorAll('.shoppop, .apppop, .brandvaluespop, .videowindow, .bagpopup');
    windows.forEach(function(win) {
      function focus() {
        windows.forEach(function(w) { w.classList.remove('tgi-focus'); });
        win.classList.add('tgi-focus');
      }
      win.addEventListener('mousedown', focus);
      win.addEventListener('touchstart', focus, { passive: true });
    });


    /* --- ACCESSIBILITY: Skip link + landmarks --- */
    var skip = document.createElement('a');
    skip.className = 'tgi401-skip-link';
    skip.href = '#main-content';
    skip.textContent = 'Skip to content';
    document.body.insertBefore(skip, document.body.firstChild);

    var main = document.querySelector('.section');
    if (main) { main.setAttribute('role', 'main'); main.id = 'main-content'; }

    var nav = document.querySelector('.nav-bar');
    if (nav) { nav.setAttribute('role', 'navigation'); nav.setAttribute('aria-label', 'Main'); }

  });
})();
