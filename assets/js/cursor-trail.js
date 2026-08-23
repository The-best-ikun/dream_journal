// 鼠标粒子彩虹拖尾
(function() {
  'use strict';

  // 尊重系统的“减少动态效果”偏好，直接不启用
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return;
  }

  var canvas = document.createElement('canvas');
  canvas.id = 'cursor-trail';
  document.body.appendChild(canvas);

  var style = document.createElement('style');
  style.textContent = '#cursor-trail{position:fixed;inset:0;pointer-events:none;z-index:2147483000;}';
  document.head.appendChild(style);

  var ctx = canvas.getContext('2d');
  var DPR = Math.min(window.devicePixelRatio || 1, 2);
  var W = 0;
  var H = 0;
  var particles = [];
  var MAX_PARTICLES = 140;
  var rafId = null;
  var running = false;
  var hue = 0;
  var lastX = null;
  var lastY = null;
  var lastTime = 0;

  function resize() {
    W = window.innerWidth;
    H = window.innerHeight;
    canvas.width = W * DPR;
    canvas.height = H * DPR;
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
  }

  resize();
  window.addEventListener('resize', resize);

  function spawn(x, y, vx, vy) {
    if (particles.length >= MAX_PARTICLES) {
      particles.shift();
    }
    particles.push({
      x: x,
      y: y,
      vx: vx,
      vy: vy,
      life: 1,
      decay: 0.02 + Math.random() * 0.02,
      size: 2 + Math.random() * 3,
      hue: hue
    });
    hue = (hue + 6) % 360;
  }

  function onMove(e) {
    var x = e.clientX;
    var y = e.clientY;
    var now = performance.now();
    var dt = Math.max(now - lastTime, 1);
    var dist = 0;

    if (lastX !== null) {
      var dx = x - lastX;
      var dy = y - lastY;
      dist = Math.sqrt(dx * dx + dy * dy);
      var speed = Math.min(dist / dt, 12);
      // 移动距离越大粒子越多，速度越快粒子飞得越散
      var count = Math.min(Math.ceil(dist / 18), 5);
      for (var i = 0; i < count; i++) {
        var angle = Math.atan2(dy, dx) + (Math.random() - 0.5) * 0.8;
        var force = 0.5 + Math.random() * speed * 0.03;
        spawn(x, y, Math.cos(angle) * force, Math.sin(angle) * force + (Math.random() - 0.5));
      }
    }

    lastX = x;
    lastY = y;
    lastTime = now;

    if (!running) {
      running = true;
      loop();
    }
  }

  document.addEventListener('mousemove', onMove);

  function loop() {
    ctx.clearRect(0, 0, W, H);
    ctx.globalCompositeOperation = 'lighter';

    for (var i = particles.length - 1; i >= 0; i--) {
      var p = particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vx *= 0.96;
      p.vy *= 0.96;
      p.vy += 0.02; // 轻微下落，让拖尾更自然
      p.life -= p.decay;

      if (p.life <= 0) {
        particles.splice(i, 1);
        continue;
      }

      ctx.globalAlpha = p.life;
      ctx.fillStyle = 'hsl(' + p.hue + ', 95%, 60%)';
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = 'source-over';

    if (particles.length > 0) {
      rafId = requestAnimationFrame(loop);
    } else {
      running = false;
      rafId = null;
    }
  }

  // 切换标签页时清空，避免回来时补帧产生乱跳
  document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
      particles = [];
      if (rafId) {
        cancelAnimationFrame(rafId);
        rafId = null;
        running = false;
      }
      ctx.clearRect(0, 0, W, H);
    }
  });
})();
