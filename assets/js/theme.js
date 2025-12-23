// 主题切换功能
(function() {
  'use strict';
  
  // 获取主题切换按钮
  const themeToggle = document.getElementById('themeToggle');
  const html = document.documentElement;
  
  // 从localStorage获取保存的主题
  const savedTheme = localStorage.getItem('theme');
  
  // 检查系统主题偏好
  const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  // 确定初始主题
  const currentTheme = savedTheme || (prefersDarkScheme ? 'dark' : 'light');
  
  // 应用初始主题
  if (currentTheme === 'dark') {
    html.setAttribute('data-theme', 'dark');
  } else {
    html.removeAttribute('data-theme');
  }
  
  // 主题切换函数
  function toggleTheme() {
    const isDark = html.getAttribute('data-theme') === 'dark';
    
    if (isDark) {
      html.removeAttribute('data-theme');
      localStorage.setItem('theme', 'light');
    } else {
      html.setAttribute('data-theme', 'dark');
      localStorage.setItem('theme', 'dark');
    }
    
    // 添加切换动画效果
    html.style.transition = 'background-color 0.3s ease, color 0.3s ease';
    
    // 触发自定义事件
    window.dispatchEvent(new CustomEvent('themechange', {
      detail: { theme: isDark ? 'light' : 'dark' }
    }));
  }
  
  // 绑定点击事件
  if (themeToggle) {
    themeToggle.addEventListener('click', toggleTheme);
    
    // 添加键盘支持
    themeToggle.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggleTheme();
      }
    });
  }
  
  // 监听系统主题变化
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    // 如果用户没有手动设置主题，则跟随系统
    if (!localStorage.getItem('theme')) {
      if (e.matches) {
        html.setAttribute('data-theme', 'dark');
      } else {
        html.removeAttribute('data-theme');
      }
    }
  });
  
  // 公开API
  window.themeManager = {
    toggle: toggleTheme,
    getCurrentTheme: () => html.getAttribute('data-theme') === 'dark' ? 'dark' : 'light',
    setTheme: (theme) => {
      if (theme === 'dark') {
        html.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
      } else {
        html.removeAttribute('data-theme');
        localStorage.setItem('theme', 'light');
      }
    }
  };
})();