(function () {
  'use strict';
  var id = 'G-B17XGTD6EB';
  var key = 'fwv_analytics_choice_v1';
  var loaded = false;
  function getChoice() { try { return localStorage.getItem(key); } catch (e) { return null; } }
  function storeChoice(value) { try { localStorage.setItem(key, value); } catch (e) {} }
  function clearCookies() {
    document.cookie.split(';').forEach(function (part) {
      var name = part.split('=')[0].trim();
      if (/^_ga(?:_|$)|^_gid$|^_gat/.test(name)) {
        ['', '; domain=' + location.hostname, '; domain=.' + location.hostname].forEach(function (domain) {
          document.cookie = name + '=; Max-Age=0; path=/' + domain + '; SameSite=Lax; Secure';
        });
      }
    });
  }
  function enable() {
    window['ga-disable-' + id] = false;
    if (loaded) return;
    loaded = true;
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag('js', new Date());
    window.gtag('set', {page_location: location.origin + location.pathname, page_referrer: document.referrer ? document.referrer.split('?')[0].split('#')[0] : ''});
    window.gtag('config', id, {
      send_page_view: false,
      page_location: location.origin + location.pathname,
      page_referrer: document.referrer ? document.referrer.split('?')[0].split('#')[0] : '',
      allow_google_signals: false,
      allow_ad_personalization_signals: false,
      cookie_flags: 'SameSite=Lax;Secure'
    });
    window.gtag('event', 'page_view', {page_location: location.origin + location.pathname, page_referrer: document.referrer ? document.referrer.split('?')[0].split('#')[0] : ''});
    var script = document.createElement('script');
    script.async = true;
    script.src = 'https://www.googletagmanager.com/gtag/js?id=' + id;
    document.head.appendChild(script);
  }
  function disable() { window['ga-disable-' + id] = true; clearCookies(); }
  function choose(value) {
    storeChoice(value);
    var panel = document.getElementById('fwv-analytics-panel');
    if (panel) panel.remove();
    if (value === 'allow') enable(); else disable();
  }
  function show() {
    if (document.getElementById('fwv-analytics-panel')) return;
    var panel = document.createElement('section');
    panel.id = 'fwv-analytics-panel';
    panel.setAttribute('aria-label', 'Site analytics choice');
    panel.innerHTML = '<strong>Allow site analytics?</strong><p>Google Analytics helps measure visits and page views using cookies. It loads only if you allow it. Declining does not affect access to the site. You can change your choice from Analytics preferences.</p><p><a href="privacy.html">Site analytics and privacy</a></p><div><button type="button" data-choice="allow">Allow analytics</button><button type="button" data-choice="decline">Decline</button></div>';
    panel.querySelectorAll('button').forEach(function (button) { button.addEventListener('click', function () { choose(button.getAttribute('data-choice')); }); });
    document.body.appendChild(panel);
  }
  function init() {
    var style = document.createElement('style');
    style.textContent = '#fwv-analytics-panel{box-sizing:border-box;position:fixed;bottom:16px;right:16px;z-index:900;max-width:420px;width:calc(100% - 32px);padding:20px;background:#fffdf9;color:#33261a;border:1px solid #cbbcab;border-radius:12px;box-shadow:0 6px 28px #33261a26;font:14px/1.55 system-ui,sans-serif}#fwv-analytics-panel p{margin:10px 0;font-size:14px;line-height:1.55}#fwv-analytics-panel a{color:#276140}#fwv-analytics-panel>div{display:flex;gap:10px}#fwv-analytics-panel button{flex:1;background:#fffdf9;color:#276140;border:1px solid #276140;border-radius:6px;padding:10px 12px;font:600 14px system-ui;cursor:pointer}#fwv-analytics-panel button:focus-visible{outline:3px solid #b87b3f;outline-offset:2px}.fwv-analytics-footer{font:13px/1.6 system-ui,sans-serif;margin:12px 0}.fwv-analytics-footer button{background:none;border:0;padding:0;color:inherit;text-decoration:underline;font:inherit;cursor:pointer}';
    document.head.appendChild(style);
    var footer = document.querySelector('footer');
    if (footer) {
      var links = document.createElement('div'); links.className = 'fwv-analytics-footer';
      links.innerHTML = '<a href="privacy.html">Site analytics and privacy</a> · <button type="button">Analytics preferences</button>';
      links.querySelector('button').addEventListener('click', show); footer.appendChild(links);
    }
    var choice = getChoice();
    if (choice === 'allow') enable(); else disable();
    if (!choice) show();
  }
  window.addEventListener('storage', function (event) { if (event.key === key) { if (event.newValue === 'allow') enable(); else disable(); } });
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
