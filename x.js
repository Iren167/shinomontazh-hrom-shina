(function () {
  var bar = document.querySelector('.s-bar'), burger = document.querySelector('.s-bar__burger');
  if (bar && burger) {
    burger.addEventListener('click', function () { var o = bar.classList.toggle('is-open'); burger.setAttribute('aria-expanded', o ? 'true' : 'false'); });
    bar.querySelectorAll('.s-bar__nav a').forEach(function (a) { a.addEventListener('click', function () { bar.classList.remove('is-open'); burger.setAttribute('aria-expanded', 'false'); }); });
  }

  /* колесо крутится от прокрутки */
  var wheel = document.querySelector('.x-wheel'), still = matchMedia('(prefers-reduced-motion: reduce)').matches, tick = false;
  function frame() {
    tick = false;
    var y = window.scrollY, h = document.documentElement.scrollHeight - innerHeight;
    if (wheel && !still) wheel.style.setProperty('--x-rot', (y * 0.35) + 'deg');
    if (bar) bar.style.setProperty('--sp', h > 0 ? Math.min(y / h, 1).toFixed(4) : 0);
  }
  addEventListener('scroll', function () { if (!tick) { tick = true; requestAnimationFrame(frame); } }, { passive: true });
  frame();

  /* подсветка пункта меню по разделу */
  var links = [].slice.call(document.querySelectorAll('.s-bar__nav a'));
  var map = links.map(function (a) { return { a: a, el: document.querySelector(a.getAttribute('href')) }; }).filter(function (x) { return x.el; });
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { map.forEach(function (m) { m.a.classList.toggle('is-on', m.el === e.target); }); } });
    }, { rootMargin: '-40% 0px -55% 0px' });
    map.forEach(function (m) { io.observe(m.el); });
  }

  /* круговая волна на кнопках */
  document.addEventListener('click', function (e) {
    var b = e.target.closest && e.target.closest('.s-btn'); if (!b) return;
    var r = b.getBoundingClientRect(), s = Math.max(r.width, r.height), x = document.createElement('span');
    x.className = 'x-ripple'; x.style.cssText = 'width:' + s + 'px;height:' + s + 'px;left:' + (e.clientX - r.left - s / 2) + 'px;top:' + (e.clientY - r.top - s / 2) + 'px';
    b.appendChild(x); setTimeout(function () { x.remove(); }, 650);
  });

  /* подбор по радиусу */
  var pick = document.querySelector('[data-x-pick]');
  if (pick) {
    var T = [[13, 2400], [14, 2400], [15, 2400], [16, 2800], [17, 3300], [18, 3300], [19, 3900], [20, 3900], [21, 4600], [22, 4600]];
    var chips = pick.querySelector('.x-pick__chips'), price = pick.querySelector('.x-pick__price'), tire = pick.querySelector('.x-pick__tire');
    T.forEach(function (t) {
      var b = document.createElement('button'); b.type = 'button'; b.textContent = 'R' + t[0]; b.setAttribute('aria-pressed', 'false');
      b.addEventListener('click', function () { set(t, b); }); chips.appendChild(b);
    });
    function fmt(n) { return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ' '); }
    function set(t, b) {
      [].forEach.call(chips.children, function (c) { c.setAttribute('aria-pressed', c === b ? 'true' : 'false'); });
      var from = 'от ' + fmt(t[1]) + ' ₽';
      price.innerHTML = from + '<small>комплект R' + t[0] + ' · балансировка в цене · около 30 мин</small>';
      tire.style.transform = 'scale(' + (0.78 + (t[0] - 13) * 0.026).toFixed(3) + ') rotate(' + ((t[0] - 13) * 40) + 'deg)';
    }
    set(T[4], chips.children[4]);
  }
})();
