/* ============================================
   TGI401 — Custom Code Injection v6 (JS)
   Mobile: icon grid + sticky retro shop CTA
   ============================================ */
(function() {
  'use strict';

  function ready(fn) {
    if (document.readyState !== 'loading') fn();
    else document.addEventListener('DOMContentLoaded', fn);
  }

  ready(function() {
    var isMobile = window.innerWidth < 768;

    /* ---- Kill rotation blocker ---- */
    var blocker = document.querySelector('.horizontal-mobile-block');
    if (blocker) blocker.style.display = 'none';


    if (isMobile) {

      /* ---- DISABLE TOUCH-DRAG ---- */
      document.querySelectorAll('.mobiledrag').forEach(function(el) {
        el.addEventListener('touchmove', function(e) {
          e.stopPropagation();
        }, { passive: true, capture: true });
        el.style.left = '';
        el.style.top = '';
        el.style.position = '';
      });


      /* ---- RETRO MAC BROWSER CHROME BAR ---- */
      // Hide the default nav bar via JS too (belt+suspenders)
      var navBar = document.querySelector('.nav-bar');
      if (navBar) navBar.style.display = 'none';

      // Create and insert chrome bar at the very top of body
      var chrome = document.createElement('div');
      chrome.id = 'tgi401-chrome-bar';
      chrome.innerHTML = [
        '<div class="dots">',
        '  <div class="dot dot-red"></div>',
        '  <div class="dot dot-yellow"></div>',
        '  <div class="dot dot-green"></div>',
        '</div>',
        '<div class="title">thegirlsin401.com</div>',
        '<a class="cart-link" href="#" id="tgi401-cart-link">',
        '  <svg viewBox="0 0 17 17" fill="none" width="16" height="16"><path d="M2.6,2L0,2L0,0L4.4,0L4.8,4L16,4L16,9.9L3.8,12.4L2.6,2Z M15.5,17C14.7,17,14,16.3,14,15.5S14.7,14,15.5,14S17,14.7,17,15.5S16.3,17,15.5,17Z M5.5,17C4.7,17,4,16.3,4,15.5S4.7,14,5.5,14S7,14.7,7,15.5S6.3,17,5.5,17Z" fill="currentColor"/></svg>',
        '  Cart',
        '</a>'
      ].join('');

      // Insert at top of body, before everything
      document.body.insertBefore(chrome, document.body.firstChild);

      // Wire cart link
      var cartLink = document.getElementById('tgi401-cart-link');
      if (cartLink) {
        cartLink.addEventListener('click', function(e) {
          e.preventDefault();
          var cartBtn = document.querySelector('.cart-button-2');
          if (cartBtn) cartBtn.click();
        });
      }


      /* ---- CHROME LOGO ---- */
      /* Insert large TGI401 chrome logo above the icon grid */
      var iconGrid = document.querySelector('.mobile-icons');
      if (iconGrid) {
        var logoWrap = document.createElement('div');
        logoWrap.id = 'tgi401-mobile-logo';
        logoWrap.style.cssText = [
          'text-align: center',
          'padding: 8px 32px 0',
          'width: 100%'
        ].join(';');

        var logoImg = document.createElement('img');
        logoImg.src = 'https://401files.vercel.app/logo-chrome.webp';
        logoImg.alt = 'The Girls in 401';
        logoImg.style.cssText = [
          'width: 65%',
          'max-width: 260px',
          'height: auto',
          'filter: drop-shadow(0 4px 12px rgba(0,0,0,0.15))',
          'margin: 0 auto',
          'display: block'
        ].join(';');

        // Add onerror fallback to PNG
        logoImg.onerror = function() { this.src = 'https://401files.vercel.app/logo-chrome-sm.png'; };

        logoWrap.appendChild(logoImg);

        // Insert before the icon grid
        iconGrid.parentNode.insertBefore(logoWrap, iconGrid);
      }


      /* ---- MARK EMPTY CELLS ---- */
      document.querySelectorAll('.mobile-icons .w-layout-cell').forEach(function(cell) {
        if (!cell.querySelector('.draggable3')) {
          cell.classList.add('tgi-cell-empty');
        }
      });


      /* ---- HIDE CURSOR ---- */
      var cursor = document.querySelector('.cursor-wrapper');
      if (cursor) cursor.style.display = 'none';


      /* ---- STICKY SHOP CTA BUTTON ---- */
      /* Retro Mac/iOS style: rounded, Aqua gradient, bold text */
      var cta = document.createElement('div');
      cta.id = 'tgi401-shop-cta';
      cta.innerHTML = '<button id="tgi401-shop-btn">' +
        '<span style="font-size:18px;margin-right:6px;">&#x1F6CD;</span> ' +
        'SHOP DROP 01' +
        '</button>';

      // Style the container
      cta.style.cssText = [
        'position: fixed',
        'bottom: 0',
        'left: 0',
        'right: 0',
        'z-index: 999',
        'padding: 12px 16px',
        'padding-bottom: max(12px, env(safe-area-inset-bottom))',
        'background: linear-gradient(180deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.9) 30%, #fff 100%)',
        'pointer-events: none'
      ].join(';');

      // Style the button — retro Mac Aqua style
      var btn = cta.querySelector('#tgi401-shop-btn');
      btn.style.cssText = [
        'display: block',
        'width: 100%',
        'padding: 16px 24px',
        'border: none',
        'border-radius: 12px',
        // Retro Mac Aqua gradient
        'background: linear-gradient(180deg, #6ec6ff 0%, #3a9eea 45%, #2b7dd4 55%, #4aa3eb 100%)',
        'color: #fff',
        'font-family: HelveticaNeueLTPro, Helvetica Neue, Helvetica, Arial, sans-serif',
        'font-weight: 800',
        'font-size: 16px',
        'letter-spacing: -0.03em',
        'text-align: center',
        'cursor: pointer',
        'pointer-events: auto',
        '-webkit-tap-highlight-color: transparent',
        // Retro depth
        'box-shadow: 0 2px 0 #1a5fa0, 0 4px 12px rgba(42, 125, 212, 0.35), inset 0 1px 0 rgba(255,255,255,0.4)',
        'text-shadow: 0 -1px 0 rgba(0,0,0,0.2)',
        'transition: transform 0.1s ease, box-shadow 0.1s ease'
      ].join(';');

      document.body.appendChild(cta);

      // Tap feedback
      btn.addEventListener('touchstart', function() {
        btn.style.transform = 'scale(0.97)';
        btn.style.boxShadow = '0 1px 0 #1a5fa0, 0 2px 6px rgba(42, 125, 212, 0.3), inset 0 1px 0 rgba(255,255,255,0.4)';
      }, { passive: true });

      btn.addEventListener('touchend', function() {
        btn.style.transform = 'scale(1)';
        btn.style.boxShadow = '0 2px 0 #1a5fa0, 0 4px 12px rgba(42, 125, 212, 0.35), inset 0 1px 0 rgba(255,255,255,0.4)';
      }, { passive: true });

      // Click handler: open the shop popup
      btn.addEventListener('click', function(e) {
        e.preventDefault();

        // Find "The Shop" icon and simulate a click to trigger Webflow Interaction
        var shopIcons = document.querySelectorAll('.text-block-3');
        var shopTrigger = null;
        shopIcons.forEach(function(el) {
          if (el.textContent.trim() === 'The Shop') {
            // Walk up to find the data-w-id trigger element
            shopTrigger = el.closest('[data-w-id]') || el.closest('.draggable3');
          }
        });

        if (shopTrigger) {
          shopTrigger.click();
        } else {
          // Fallback: navigate to product page directly
          window.location.href = '/product/the-roomie-tee-pdf';
        }
      });

    } /* end isMobile */


    /* ---- EMAIL FORM: Fix field names + wire submission ---- */
    var emailForm = document.querySelector('#email-form');
    if (emailForm) {
      emailForm.method = 'post';
      var igField = emailForm.querySelector('#name-3');
      var emailField = emailForm.querySelector('#name-2');
      if (igField) igField.name = 'Instagram';
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
            'name': 'Email Form', 'source': window.location.href,
            'test': 'false', 'dolphin': 'false',
            'pageId': pageId, 'elementId': elemId, 'siteId': siteId,
            'fields[Email]': email
          };
          if (igField && igField.value) params['fields[Instagram]'] = igField.value;

          fetch('https://webflow.com/api/v1/form/' + siteId, {
            method: 'POST',
            headers: { 'Accept': 'application/json', 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams(params)
          }).catch(function() {});
        }

        // Show success
        var done = emailForm.closest('.w-form, .form-block');
        var successDiv = done && done.querySelector('.w-form-done');
        if (successDiv) { successDiv.style.display = 'block'; emailForm.style.display = 'none'; }
        else {
          var submitBtn = emailForm.querySelector('[type="submit"]');
          if (submitBtn) { submitBtn.value = "YOU'RE IN"; submitBtn.style.background = '#28c840'; }
        }
      });
    }


    /* ---- SHIZE → SIZE ---- */
    var sizeMap = { 'Shize':'Size','Shmall':'XS','shmall':'XS','shMedium':'S/M','shmedium':'S/M','shLarge':'L/XL','shlarge':'L/XL' };
    document.querySelectorAll('.field-label, .field-label-5, label, select option').forEach(function(el) {
      var t = el.textContent.trim();
      if (sizeMap[t]) el.textContent = sizeMap[t];
    });


    /* ---- Z-INDEX FOCUS (desktop) ---- */
    var wins = document.querySelectorAll('.shoppop, .apppop, .brandvaluespop, .videowindow, .bagpopup');
    wins.forEach(function(win) {
      function focus() { wins.forEach(function(w) { w.classList.remove('tgi-focus'); }); win.classList.add('tgi-focus'); }
      win.addEventListener('mousedown', focus);
      win.addEventListener('touchstart', focus, { passive: true });
    });


    /* ---- ACCESSIBILITY ---- */
    var skip = document.createElement('a');
    skip.className = 'tgi401-skip-link';
    skip.href = '#main-content';
    skip.textContent = 'Skip to content';
    document.body.insertBefore(skip, document.body.firstChild);

    var main = document.querySelector('.section');
    if (main) { main.setAttribute('role', 'main'); main.id = 'main-content'; }
  });
})();
