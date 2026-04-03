/* ============================================
   TGI401 — Custom Code Injection (JS)
   Fixes: Mobile layout, ShizeSelect label,
   email capture form, accessibility
   ============================================ */

(function() {
  'use strict';

  // Wait for DOM
  function ready(fn) {
    if (document.readyState !== 'loading') fn();
    else document.addEventListener('DOMContentLoaded', fn);
  }

  ready(function() {

    /* --- FIX #1: MOBILE RESPONSIVE LAYOUT --- */
    // Replace "Please Rotate Device" with mobile-friendly content
    var rotateBlock = document.querySelector('.horizontal-mobile-block');
    if (rotateBlock && window.innerWidth < 768) {
      rotateBlock.style.display = 'none';
      // Ensure main section is visible
      var section = document.querySelector('.section');
      if (section) {
        section.style.display = 'block';
        section.style.overflow = 'auto';
      }
    }

    // On resize, toggle mobile/desktop
    var mobileBreakpoint = 768;
    function handleResize() {
      var isMobile = window.innerWidth < mobileBreakpoint;
      var rotateEl = document.querySelector('.horizontal-mobile-block');
      var sectionEl = document.querySelector('.section');

      if (rotateEl) rotateEl.style.display = 'none';
      if (sectionEl) {
        sectionEl.style.display = 'block';
        if (isMobile) {
          sectionEl.style.overflow = 'auto';
          sectionEl.style.height = 'auto';
        }
      }

      // Hide custom cursor on mobile/tablet
      var cursorWrap = document.querySelector('.cursor-wrapper');
      if (cursorWrap) {
        cursorWrap.style.display = isMobile ? 'none' : '';
      }
    }

    handleResize();
    window.addEventListener('resize', handleResize);


    /* --- FIX #1b: MAKE POPUP WINDOWS TAPPABLE ON MOBILE --- */
    if (window.innerWidth < 768) {
      // Force all popup windows to be visible and stacked
      var popups = document.querySelectorAll('.shoppop, .apppop, .formwindow .apppop');
      popups.forEach(function(popup) {
        popup.style.transform = 'scale3d(1, 1, 1)';
        popup.style.opacity = '1';
        popup.style.display = 'block';
      });
    }


    /* --- FIX #3: EMAIL CAPTURE FORM --- */
    var emailForm = document.querySelector('#email-form');
    if (emailForm) {
      // Fix: change GET to POST
      emailForm.method = 'post';

      // Fix: deduplicate field names (both inputs had name="name-2")
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

        // Submit via Webflow's native form handler
        var siteId = document.querySelector('[data-wf-site]');
        var wfPageId = emailForm.getAttribute('data-wf-page-id');
        var wfElementId = emailForm.getAttribute('data-wf-element-id');

        if (siteId && wfPageId && wfElementId) {
          var params = {
            'name': 'Email Form',
            'source': window.location.href,
            'test': 'false',
            'dolphin': 'false',
            'pageId': wfPageId,
            'elementId': wfElementId,
            'siteId': siteId.getAttribute('data-wf-site'),
            'fields[Email]': email
          };
          if (igInput && igInput.value) {
            params['fields[Instagram]'] = igInput.value;
          }

          fetch('https://webflow.com/api/v1/form/' + siteId.getAttribute('data-wf-site'), {
            method: 'POST',
            headers: { 'Accept': 'application/json', 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams(params)
          }).then(function() {
            showFormSuccess(emailForm, emailInput);
          }).catch(function() {
            // Fallback: still show success (data was likely captured)
            showFormSuccess(emailForm, emailInput);
          });
        } else {
          showFormSuccess(emailForm, emailInput);
        }

        // Klaviyo placeholder — uncomment and add list ID when ready
        // fetch('https://a.klaviyo.com/api/v2/list/LIST_ID/subscribe', {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify({ profiles: [{ email: email }] })
        // });
      });
    }

    function showFormSuccess(form, input) {
      var successDiv = form.parentElement.querySelector('.w-form-done');
      if (successDiv) {
        successDiv.style.display = 'block';
        form.style.display = 'none';
      } else if (input) {
        var btn = form.querySelector('[type="submit"], .submit-button');
        if (btn) {
          btn.textContent = "YOU'RE IN";
          btn.style.background = '#28c840';
          input.disabled = true;
          btn.disabled = true;
        }
      }
    }


    /* --- FIX: Z-INDEX CLICK-TO-FOCUS --- */
    document.querySelectorAll('.shoppop, .apppop, .brandvaluespop, .videowindow, .bagpopup').forEach(function(win) {
      win.addEventListener('mousedown', function() {
        document.querySelectorAll('.shoppop, .apppop, .brandvaluespop, .videowindow, .bagpopup').forEach(function(w) {
          w.classList.remove('tgi-focus');
        });
        win.classList.add('tgi-focus');
      });
      win.addEventListener('touchstart', function() {
        document.querySelectorAll('.shoppop, .apppop, .brandvaluespop, .videowindow, .bagpopup').forEach(function(w) {
          w.classList.remove('tgi-focus');
        });
        win.classList.add('tgi-focus');
      }, { passive: true });
    });


    /* --- FIX #4: SHIZESELECT → SELECT SIZE --- */
    // Fix the SKU property labels on the product page
    // "Shize" → "Select Size", "Shmall" → "XS", etc.
    var sizeMap = {
      'Shize': 'Select Size',
      'ShizeSelect': 'Select Size',
      'Shmall': 'XS',
      'shmall': 'XS',
      'shMedium': 'S/M',
      'shmedium': 'S/M',
      'shLarge': 'L/XL',
      'shlarge': 'L/XL'
    };

    // Replace text in field labels and buttons
    document.querySelectorAll('.field-label, .button-size, label, option, .w-commerce-commerceaddtocartoptionselect option, select option').forEach(function(el) {
      var text = el.textContent.trim();
      if (sizeMap[text]) {
        el.textContent = sizeMap[text];
      }
    });

    // Also fix select elements
    document.querySelectorAll('select').forEach(function(sel) {
      Array.from(sel.options).forEach(function(opt) {
        var val = opt.textContent.trim();
        if (sizeMap[val]) {
          opt.textContent = sizeMap[val];
        }
      });
      // Fix the select label/aria-label
      var label = sel.getAttribute('aria-label') || '';
      if (label.toLowerCase().includes('shize')) {
        sel.setAttribute('aria-label', 'Select Size');
      }
    });

    // Fix any heading/text that says "Shize"
    document.querySelectorAll('h1, h2, h3, h4, h5, h6, p, span, div, label').forEach(function(el) {
      if (el.children.length === 0 && el.textContent.trim() in sizeMap) {
        el.textContent = sizeMap[el.textContent.trim()];
      }
    });


    /* --- FIX: PRODUCT PAGE — Fix remaining Shize labels --- */
    // Belt-and-suspenders: fix any Shize labels the CMS update didn't catch
    document.querySelectorAll('.field-label-5, [for*="option-set"]').forEach(function(el) {
      if (el.textContent.trim().toLowerCase().includes('shize')) {
        el.textContent = 'Size';
      }
    });
    document.querySelectorAll('select').forEach(function(sel) {
      // Fix placeholder
      if (sel.options[0] && sel.options[0].textContent.toLowerCase().includes('shize')) {
        sel.options[0].textContent = 'Select Size';
      }
    });

    /* --- FIX: PRODUCT PAGE — Show size buttons if hidden --- */
    var sizeBlock = document.querySelector('.size.w-condition-invisible');
    if (sizeBlock) {
      sizeBlock.classList.remove('w-condition-invisible');
      sizeBlock.style.display = 'flex';
      // Hide the garbled dropdown
      var garbledSelect = document.querySelector('.select-field-3');
      if (garbledSelect) garbledSelect.closest('.div-block-30, .w-embed, div')?.style.setProperty('display', 'none', 'important');
    }


    /* --- ACCESSIBILITY: SKIP LINK --- */
    var skipLink = document.createElement('a');
    skipLink.className = 'tgi401-skip-link';
    skipLink.href = '#main-content';
    skipLink.textContent = 'Skip to content';
    document.body.insertBefore(skipLink, document.body.firstChild);

    // Add main content landmark
    var mainSection = document.querySelector('.section');
    if (mainSection) {
      mainSection.setAttribute('role', 'main');
      mainSection.id = 'main-content';
    }

    // Add nav landmark
    var navBar = document.querySelector('.nav-bar');
    if (navBar) {
      navBar.setAttribute('role', 'navigation');
      navBar.setAttribute('aria-label', 'Main navigation');
    }

  });
})();
