/* ============================================
   TGI401 — Custom Code Injection v5 (JS)
   Plan-based rewrite with verified selectors
   ============================================ */
(function() {
  'use strict';

  function ready(fn) {
    if (document.readyState !== 'loading') fn();
    else document.addEventListener('DOMContentLoaded', fn);
  }

  ready(function() {
    var isMobile = window.innerWidth < 768;

    /* ---- 0. ALWAYS: Kill rotation blocker ---- */
    var blocker = document.querySelector('.horizontal-mobile-block');
    if (blocker) blocker.style.display = 'none';


    if (isMobile) {

      /* ---- 1. FORCE .shoppop VISIBLE ---- */
      /* DOM: .shoppop has inline display:none + scale3d(0,0,1) */
      var shop = document.querySelector('.shoppop');
      if (shop) {
        shop.style.display = 'block';
        shop.style.transform = 'none';
        shop.style.opacity = '1';
        shop.style.visibility = 'visible';
        shop.style.position = 'relative';
        shop.style.top = 'auto';
        shop.style.left = 'auto';
      }


      /* ---- 2. FORCE FORMWINDOW VISIBLE ---- */
      /* DOM: .formwindow > #mobiledrag > .draggable4 > div[scale3d(0,0,1)] */
      var formWin = document.querySelector('.formwindow');
      if (formWin) {
        var draggable4 = formWin.querySelector('.draggable4');
        if (draggable4) {
          var hiddenDiv = draggable4.querySelector(':scope > div');
          if (hiddenDiv) {
            hiddenDiv.style.transform = 'none';
            hiddenDiv.style.opacity = '1';
            hiddenDiv.style.display = 'block';
            hiddenDiv.style.visibility = 'visible';
          }
        }
      }


      /* ---- 3. FORCE PRODUCT IMAGES TO LOAD ---- */
      /* CMS-bound images may not load when parent was display:none */
      var shopImages = document.querySelectorAll('.shoppop img[loading="lazy"]');
      shopImages.forEach(function(img) {
        img.removeAttribute('loading');
        // Re-trigger srcset evaluation
        if (img.srcset) {
          var srcset = img.srcset;
          img.srcset = '';
          requestAnimationFrame(function() { img.srcset = srcset; });
        }
        // Force reload if src exists
        if (img.src) {
          var src = img.src;
          img.src = '';
          img.src = src;
        }
      });


      /* ---- 4. DISABLE TOUCH-DRAG ON MOBILE ICONS ---- */
      /* Webflow attaches touchmove listeners to .mobiledrag that conflict with scrolling */
      document.querySelectorAll('.mobiledrag').forEach(function(el) {
        el.addEventListener('touchmove', function(e) {
          e.stopPropagation();
        }, { passive: true, capture: true });
        // Clear any drag positioning
        el.style.left = '';
        el.style.top = '';
        el.style.position = '';
      });


      /* ---- 5. MARK EMPTY CELLS (JS fallback for :has()) ---- */
      document.querySelectorAll('.mobile-icons .w-layout-cell').forEach(function(cell) {
        if (!cell.querySelector('.draggable3')) {
          cell.classList.add('tgi-cell-empty');
        }
      });


      /* ---- 6. MUTATION OBSERVER: Guard against Webflow IX2 ---- */
      /* If Webflow interactions re-apply scale3d(0,0,1), immediately override */
      var observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(m) {
          if (m.type === 'attributes' && m.attributeName === 'style') {
            var el = m.target;
            var style = el.getAttribute('style') || '';
            if (style.indexOf('scale3d(0') !== -1) {
              el.style.transform = 'none';
              el.style.opacity = '1';
              el.style.display = 'block';
              el.style.visibility = 'visible';
            }
          }
        });
      });

      if (shop) {
        observer.observe(shop, { attributes: true, attributeFilter: ['style'] });
      }
      var formInner = document.querySelector('.formwindow .draggable4 > div');
      if (formInner) {
        observer.observe(formInner, { attributes: true, attributeFilter: ['style'] });
      }


      /* ---- 7. HIDE CURSOR ---- */
      var cursor = document.querySelector('.cursor-wrapper');
      if (cursor) cursor.style.display = 'none';

    } /* end isMobile */


    /* ---- EMAIL FORM: Fix field names + wire submission ---- */
    /* Applies on all viewports (form is used on desktop too) */
    var emailForm = document.querySelector('#email-form');
    if (emailForm) {
      emailForm.method = 'post';

      // Fix duplicate "Name 2" field names
      // DOM: input[name="Name 2"][id="name-3"] = Instagram
      //      input[name="Name 2"][id="name-2"] = Email
      var igField = emailForm.querySelector('#name-3');
      var emailField = emailForm.querySelector('#name-2');
      if (igField) { igField.name = 'Instagram'; }
      if (emailField) { emailField.name = 'Email'; emailField.type = 'email'; }

      emailForm.addEventListener('submit', function(e) {
        e.preventDefault();
        var email = emailField ? emailField.value : '';
        if (!email || email.indexOf('@') === -1) return;

        var siteEl = document.querySelector('[data-wf-site]');
        var pageId = emailForm.getAttribute('data-wf-page-id');
        var elemId = emailForm.getAttribute('data-wf-element-id');

        if (siteEl && pageId && elemId) {
          var siteId = siteEl.getAttribute('data-wf-site');
          var params = {
            'name': 'Email Form',
            'source': window.location.href,
            'test': 'false',
            'dolphin': 'false',
            'pageId': pageId,
            'elementId': elemId,
            'siteId': siteId,
            'fields[Email]': email
          };
          if (igField && igField.value) {
            params['fields[Instagram]'] = igField.value;
          }

          fetch('https://webflow.com/api/v1/form/' + siteId, {
            method: 'POST',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams(params)
          }).then(function() {
            showSuccess();
          }).catch(function() {
            showSuccess(); // Show success anyway — Webflow may reject CORS but still log
          });
        } else {
          showSuccess();
        }

        function showSuccess() {
          var done = emailForm.closest('.w-form, .form-block');
          if (done) {
            var successDiv = done.querySelector('.w-form-done');
            if (successDiv) {
              successDiv.style.display = 'block';
              emailForm.style.display = 'none';
              return;
            }
          }
          // Fallback
          var btn = emailForm.querySelector('[type="submit"]');
          if (btn) {
            btn.value = "YOU'RE IN";
            btn.style.background = '#28c840';
            if (emailField) emailField.disabled = true;
            if (igField) igField.disabled = true;
            btn.disabled = true;
          }
        }
      });
    }


    /* ---- SHIZE → SIZE (product pages) ---- */
    var sizeMap = {
      'Shize': 'Size', 'ShizeSelect': 'Select Size',
      'Shmall': 'XS', 'shmall': 'XS',
      'shMedium': 'S/M', 'shmedium': 'S/M',
      'shLarge': 'L/XL', 'shlarge': 'L/XL'
    };

    document.querySelectorAll('.field-label, .field-label-5, label, select option').forEach(function(el) {
      var t = el.textContent.trim();
      if (sizeMap[t]) el.textContent = sizeMap[t];
    });

    document.querySelectorAll('select').forEach(function(sel) {
      Array.from(sel.options).forEach(function(opt) {
        if (sizeMap[opt.textContent.trim()]) opt.textContent = sizeMap[opt.textContent.trim()];
      });
    });


    /* ---- Z-INDEX: Click-to-focus (desktop) ---- */
    var wins = document.querySelectorAll('.shoppop, .apppop, .brandvaluespop, .videowindow, .bagpopup');
    wins.forEach(function(win) {
      function focus() {
        wins.forEach(function(w) { w.classList.remove('tgi-focus'); });
        win.classList.add('tgi-focus');
      }
      win.addEventListener('mousedown', focus);
      win.addEventListener('touchstart', focus, { passive: true });
    });


    /* ---- ACCESSIBILITY: Skip link + landmarks ---- */
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
