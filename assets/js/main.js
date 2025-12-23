// 主要交互功能
(function() {
  'use strict';
  
  // 等待DOM加载完成
  document.addEventListener('DOMContentLoaded', function() {
    // 初始化访客统计
    initVisitorStats();
    
    // 初始化滚动动画
    initScrollAnimations();
    
    // 初始化导航栏效果
    initNavigationEffects();
    
    // 初始化阅读进度条（文章页面）
    initReadingProgress();
    
    // 初始化动画效果
    initAnimations();
  });
  
  // 访客统计功能
  function initVisitorStats() {
    // 获取网站开始时间（这里使用固定日期，实际可以从配置文件读取）
    const startDate = new Date('2024-01-01');
    const today = new Date();
    
    // 计算运行天数
    const daysRunning = Math.floor((today - startDate) / (1000 * 60 * 60 * 24));
    
    // 更新运行天数
    const daysElement = document.getElementById('daysRunning');
    if (daysElement) {
      // 添加动画效果
      animateNumber(daysElement, 0, daysRunning, 2000);
    }
    
    // 设置默认的博客数量和照片数量（可以从API获取）
    const thoughtsCount = 25;
    const momentsCount = 48;
    
    // 更新统计数字
    const thoughtsElement = document.getElementById('thoughtsCount');
    const momentsElement = document.getElementById('momentsCount');
    
    if (thoughtsElement) {
      animateNumber(thoughtsElement, 0, thoughtsCount, 2500);
    }
    
    if (momentsElement) {
      animateNumber(momentsElement, 0, momentsCount, 3000);
    }
  }
  
  // 数字动画效果
  function animateNumber(element, start, end, duration) {
    const range = end - start;
    const increment = end > start ? 1 : -1;
    const stepTime = Math.abs(Math.floor(duration / range));
    let current = start;
    
    const timer = setInterval(function() {
      current += increment;
      element.textContent = current;
      
      if (current === end) {
        clearInterval(timer);
      }
    }, stepTime);
  }
  
  // 滚动动画
  function initScrollAnimations() {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('fade-in');
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);
    
    // 观察所有卡片和内容区域，但排除首页的hero-card和相册页面的polaroid-photo（它们有CSS动画）
    const elementsToAnimate = document.querySelectorAll('.card, .gallery-item');
    // 只观察非首页的hero-card
    const heroCards = document.querySelectorAll('.hero-card');
    if (heroCards.length > 0 && document.querySelector('.hero-section')) {
      // 首页的hero-card使用CSS动画，不需要JS处理
    } else {
      // 非首页的hero-card使用JS动画
      heroCards.forEach(function(element) {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(element);
      });
    }
    
    // 排除相册页面的polaroid-photo元素，让CSS动画独立工作
    elementsToAnimate.forEach(function(element) {
      // 如果元素是相册页面的一部分，跳过JS动画
      if (element.closest('.gallery-section')) {
        return;
      }
      
      element.style.opacity = '0';
      element.style.transform = 'translateY(30px)';
      element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
      observer.observe(element);
    });
  }
  
  // 导航栏效果
  function initNavigationEffects() {
    const header = document.querySelector('.glass-header');
    let lastScrollY = window.scrollY;
    
    window.addEventListener('scroll', function() {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY > 100) {
        header.style.background = 'var(--bg-secondary)';
        header.style.backdropFilter = 'blur(20px)';
      } else {
        header.style.background = 'var(--bg-card)';
        header.style.backdropFilter = 'blur(12px)';
      }
      
      lastScrollY = currentScrollY;
    });
  }
  
  // 阅读进度条
  function initReadingProgress() {
    // 只在文章页面显示进度条
    if (!document.querySelector('.article-content')) return;
    
    // 创建进度条元素
    const progressBar = document.createElement('div');
    progressBar.className = 'reading-progress';
    progressBar.innerHTML = '<div class="reading-progress-bar"></div>';
    document.body.appendChild(progressBar);
    
    // 添加样式
    const style = document.createElement('style');
    style.textContent = `
      .reading-progress {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 3px;
        background: rgba(255, 255, 255, 0.1);
        z-index: 1001;
      }
      
      .reading-progress-bar {
        height: 100%;
        background: var(--gradient-primary);
        width: 0%;
        transition: width 0.3s ease;
      }
    `;
    document.head.appendChild(style);
    
    // 更新进度
    window.addEventListener('scroll', function() {
      const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = (winScroll / height) * 100;
      
      progressBar.querySelector('.reading-progress-bar').style.width = scrolled + '%';
    });
  }
  
  // 初始化动画效果
  function initAnimations() {
    // 为所有按钮添加点击波纹效果
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(function(button) {
      button.addEventListener('click', function(e) {
        const ripple = document.createElement('span');
        ripple.className = 'ripple';
        
        const rect = button.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        
        button.appendChild(ripple);
        
        setTimeout(function() {
          ripple.remove();
        }, 600);
      });
    });
    
    // 添加波纹效果样式
    const rippleStyle = document.createElement('style');
    rippleStyle.textContent = `
      .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.5);
        transform: scale(0);
        animation: ripple-animation 0.6s ease-out;
        pointer-events: none;
      }
      
      @keyframes ripple-animation {
        to {
          transform: scale(4);
          opacity: 0;
        }
      }
      
      .btn {
        position: relative;
        overflow: hidden;
      }
    `;
    document.head.appendChild(rippleStyle);
  }
  
  // 平滑滚动到顶部
  function scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }
  
  // 公开API
  window.siteUtils = {
    scrollToTop: scrollToTop,
    animateNumber: animateNumber
  };
})();