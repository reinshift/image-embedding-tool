document.addEventListener('DOMContentLoaded', function() {
    // 检查登录状态
    checkAuthStatus();
    
    // 加载自定义logo
    loadCustomLogo();
    
    // 设置导航栏事件监听器
    setupNavbarEvents();
});

function checkAuthStatus() {
    const authToken = sessionStorage.getItem('imageEmbedAuth');
    if (authToken !== 'authenticated') {
        // 未登录，重定向到登录页面
        window.location.href = 'index.html';
        return;
    }
}

function loadCustomLogo() {
    const customLogo = localStorage.getItem('customLogo');
    const navbarLogo = document.getElementById('navbar-logo');
    
    if (customLogo && navbarLogo) {
        navbarLogo.src = customLogo;
        navbarLogo.style.filter = 'none';
    }
}

function setupNavbarEvents() {
    // 原理介绍按钮
    const theoryBtn = document.getElementById('theory-btn');
    if (theoryBtn) {
        theoryBtn.addEventListener('click', () => {
            window.open('theory.html', '_blank');
        });
    }
    
    // 退出按钮
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }
}

function handleLogout() {
    // 显示确认对话框
    if (confirm('确定要退出系统吗？')) {
        // 清除登录状态
        sessionStorage.removeItem('imageEmbedAuth');
        
        // 添加退出动画
        document.body.style.transition = 'opacity 0.3s ease-out';
        document.body.style.opacity = '0';
        
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 300);
    }
}

// 添加一些增强功能
document.addEventListener('DOMContentLoaded', function() {
    // 添加键盘快捷键
    document.addEventListener('keydown', (e) => {
        // Ctrl + H 打开原理介绍
        if (e.ctrlKey && e.key === 'h') {
            e.preventDefault();
            window.open('theory.html', '_blank');
        }
        
        // Ctrl + Q 退出
        if (e.ctrlKey && e.key === 'q') {
            e.preventDefault();
            handleLogout();
        }
    });
    
    // 添加页面可见性检测
    document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') {
            // 页面重新可见时检查登录状态
            checkAuthStatus();
        }
    });
    
    // 添加会话超时检测（可选）
    let sessionTimeout;
    const SESSION_DURATION = 30 * 60 * 1000; // 30分钟
    
    function resetSessionTimeout() {
        clearTimeout(sessionTimeout);
        sessionTimeout = setTimeout(() => {
            alert('会话已超时，请重新登录');
            sessionStorage.removeItem('imageEmbedAuth');
            window.location.href = 'index.html';
        }, SESSION_DURATION);
    }
    
    // 监听用户活动
    ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'].forEach(event => {
        document.addEventListener(event, resetSessionTimeout, true);
    });
    
    // 初始化会话超时
    resetSessionTimeout();
});
