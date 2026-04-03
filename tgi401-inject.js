/* ============================================
   TGI401 — Custom Code Injection v7 (JS)
   Mobile: fixed logo + 3-col icons + product modal + Stripe checkout
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

      /* ---- DISABLE TOUCH-DRAG + MAKE ICONS TAPPABLE ---- */
      document.querySelectorAll('.mobiledrag').forEach(function(el) {
        // Kill drag behavior
        el.addEventListener('touchmove', function(e) {
          e.stopPropagation();
        }, { passive: true, capture: true });
        el.style.left = '';
        el.style.top = '';
        el.style.position = '';
      });

      /* Make entire icon cells tappable — route product icons to modal */
      document.querySelectorAll('.mobile-icons .w-layout-cell').forEach(function(cell) {
        cell.style.cursor = 'pointer';

        var trigger = cell.querySelector('[data-w-id]');
        var link = cell.querySelector('a[href]');
        var label = cell.querySelector('.text-block-3');
        var labelText = label ? label.textContent.trim().toLowerCase() : '';

        cell.addEventListener('click', function(e) {
          e.preventDefault();
          e.stopPropagation();

          // Product icons → open product modal
          if (labelText.indexOf('shop') !== -1 || labelText.indexOf('store') !== -1) {
            // "The Shop" icon → show tee by default (first product)
            openProductModal('tee');
            return;
          }

          // Instagram link
          if (link && link.href && link.href.indexOf('instagram') !== -1) {
            window.open(link.href, '_blank');
            return;
          }

          // Otherwise click the Webflow Interaction trigger
          if (trigger) {
            trigger.click();
          }
        });
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


      /* ---- FIXED LOGO (always visible at top, does not scroll) ---- */
      var fixedLogo = document.createElement('div');
      fixedLogo.id = 'tgi401-fixed-logo';
      var logoImg = document.createElement('img');
      logoImg.src = 'https://401files.vercel.app/logo-chrome.webp';
      logoImg.alt = 'The Girls in 401';
      logoImg.onerror = function() { this.src = 'https://401files.vercel.app/logo-chrome-sm.png'; };
      fixedLogo.appendChild(logoImg);
      document.body.appendChild(fixedLogo);


      /* ---- PRODUCT DATA ---- */
      var products = {
        tee: {
          name: 'The Roomie Tee',
          price: '$45',
          image: 'https://401files.vercel.app/shirt-gradient-sm.png',
          sizes: ['XS', 'S/M', 'L/XL'],
          stripeUrl: 'https://buy.stripe.com/bJebJ13uTd9u1aO9d2b7y01'
        },
        hat: {
          name: 'The Roomie Hat',
          price: '$55',
          image: 'https://401files.vercel.app/hat-gradient-sm.png',
          sizes: null, // one size
          stripeUrl: 'https://buy.stripe.com/9B65kD3uT0mI2eS88Yb7y02'
        }
      };


      /* ---- PRODUCT DETAIL MODAL ---- */
      var modal = document.createElement('div');
      modal.id = 'tgi401-product-modal';
      modal.innerHTML = [
        '<button class="modal-close" aria-label="Close">&times;</button>',
        '<img class="modal-image" src="" alt="">',
        '<div class="modal-body">',
        '  <div class="modal-name"></div>',
        '  <div class="modal-price"></div>',
        '  <div class="modal-sizes"></div>',
        '  <button class="modal-buy">BUY NOW</button>',
        '  <div class="modal-switcher"></div>',
        '</div>'
      ].join('');
      document.body.appendChild(modal);

      var modalImg = modal.querySelector('.modal-image');
      var modalName = modal.querySelector('.modal-name');
      var modalPrice = modal.querySelector('.modal-price');
      var modalSizes = modal.querySelector('.modal-sizes');
      var modalBuy = modal.querySelector('.modal-buy');
      var modalSwitcher = modal.querySelector('.modal-switcher');
      var currentProduct = null;
      var currentProductKey = null;
      var selectedSize = null;

      function openProductModal(productKey) {
        var p = products[productKey];
        if (!p) return;
        currentProduct = p;
        currentProductKey = productKey;
        selectedSize = null;

        modalImg.src = p.image;
        modalImg.alt = p.name;
        modalName.textContent = p.name;
        modalPrice.textContent = p.price;

        // Build size selector or "One Size" label
        modalSizes.innerHTML = '';
        if (p.sizes) {
          p.sizes.forEach(function(size) {
            var btn = document.createElement('button');
            btn.className = 'size-btn';
            btn.textContent = size;
            btn.addEventListener('click', function() {
              modalSizes.querySelectorAll('.size-btn').forEach(function(b) { b.classList.remove('selected'); });
              btn.classList.add('selected');
              selectedSize = size;
            });
            modalSizes.appendChild(btn);
          });
        } else {
          var oneSize = document.createElement('div');
          oneSize.className = 'modal-onesize';
          oneSize.textContent = 'One Size';
          modalSizes.appendChild(oneSize);
          selectedSize = 'ONE SIZE';
        }

        // Product switcher — show the OTHER product
        modalSwitcher.innerHTML = '';
        var otherKey = productKey === 'tee' ? 'hat' : 'tee';
        var other = products[otherKey];
        var switchBtn = document.createElement('button');
        switchBtn.className = 'modal-switch-btn';
        switchBtn.innerHTML = '<img src="' + other.image + '" alt="' + other.name + '"><span>' + other.name + ' — ' + other.price + '</span>';
        switchBtn.addEventListener('click', function() {
          openProductModal(otherKey);
        });
        modalSwitcher.appendChild(switchBtn);

        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
      }

      // Close modal
      modal.querySelector('.modal-close').addEventListener('click', function() {
        modal.classList.remove('active');
        document.body.style.overflow = '';
      });

      // Buy button → Stripe
      modalBuy.addEventListener('click', function() {
        if (!currentProduct) return;
        if (currentProduct.sizes && !selectedSize) {
          // Flash size buttons to prompt selection
          modalSizes.querySelectorAll('.size-btn').forEach(function(b) {
            b.style.borderColor = '#e8457a';
            setTimeout(function() { b.style.borderColor = ''; }, 600);
          });
          return;
        }
        window.location.href = currentProduct.stripeUrl;
      });


      /* ---- WIRE PRODUCT ICONS TO MODAL ---- */
      // Intercept icon taps: detect "The Shop" or product-related icons
      // and route them to the product modal instead of Webflow popups


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
      cta.innerHTML = '<button id="tgi401-shop-btn">SHOP DROP 01</button>';

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
        'animation: tgi401-cloud-float 3s ease-in-out infinite'
      ].join(';');

      document.body.appendChild(cta);

      // Tap feedback — pause float, scale down
      btn.addEventListener('touchstart', function() {
        btn.style.animation = 'none';
        btn.style.transform = 'scale(0.96)';
      }, { passive: true });

      btn.addEventListener('touchend', function() {
        btn.style.transform = '';
        btn.style.animation = 'tgi401-cloud-float 3s ease-in-out infinite';
      }, { passive: true });

      // Click handler: open product modal with tee (primary product)
      btn.addEventListener('click', function(e) {
        e.preventDefault();
        openProductModal('tee');
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
