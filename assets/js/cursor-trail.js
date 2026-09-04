(function () {
  'use strict';

  if (
    window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
    typeof window.requestAnimationFrame !== 'function' ||
    !document.createElement('canvas').getContext
  ) {
    return;
  }

  var canvas = document.createElement('canvas');
  canvas.style.position = 'fixed';
  canvas.style.inset = '0';
  canvas.style.pointerEvents = 'none';
  canvas.style.zIndex = '2147483000';
  document.body.appendChild(canvas);

  var ctx = canvas.getContext('2d');
  var particles = [];
  var MAX_PARTICLES = 140;
  var mouse = { x: -100, y: -100, moved: false };

  function resize() {
    var dpr = window.devicePixelRatio || 1;
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  resize();
  window.addEventListener('resize', resize);

  window.addEventListener('mousemove', function (e) {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
    mouse.moved = true;
  });

  function spawn() {
    if (!mouse.moved) return;
    particles.push({
      x: mouse.x,
      y: mouse.y,
      vx: (Math.random() - 0.5) * 1.6,
      vy: (Math.random() - 0.5) * 1.6,
      life: 1,
      decay: 0.016 + Math.random() * 0.018,
      size: 2 + Math.random() * 3.5,
      hue: (Date.now() / 6) % 360
    });
    if (particles.length > MAX_PARTICLES) {
      particles.splice(0, particles.length - MAX_PARTICLES);
    }
  }

  function tick() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (var i = particles.length - 1; i >= 0; i--) {
      var p = particles[i];
      p.vy += 0.02;
      p.vx *= 0.99;
      p.vy *= 0.99;
      p.x += p.vx;
      p.y += p.vy;
      p.life -= p.decay;

      if (p.life <= 0) {
        particles.splice(i, 1);
        continue;
      }

      ctx.globalCompositeOperation = 'lighter';
      ctx.globalAlpha = p.life * 0.55;
      ctx.fillStyle = 'hsla(' + p.hue + ', 90%, 65%, 1)';
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalCompositeOperation = 'source-over';
    }
    ctx.globalAlpha = 1;

    window.requestAnimationFrame(tick);
  }

  window.setInterval(spawn, 16);
  window.requestAnimationFrame(tick);

  document.addEventListener('visibilitychange', function () {
    if (document.hidden) {
      particles.length = 0;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  });
})();
