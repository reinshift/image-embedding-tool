document.addEventListener('DOMContentLoaded', function() {
    // DOM 元素
    const loginForm = document.getElementById('login-form');
    const passwordInput = document.getElementById('password');
    const passwordToggle = document.getElementById('password-toggle');
    const loginBtn = document.getElementById('login-btn');
    const btnText = loginBtn.querySelector('.btn-text');
    const btnLoading = loginBtn.querySelector('.btn-loading');
    const errorMessage = document.getElementById('error-message');
    const errorText = document.getElementById('error-text');
    const logoUploadBtn = document.getElementById('logo-upload-btn');
    const logoUpload = document.getElementById('logo-upload');
    const appLogo = document.getElementById('app-logo');

    // 配置
    const CONFIG = {
        password: 'xdugaodai', // 您的自定义密码
        sessionKey: 'imageEmbedAuth',
        logoKey: 'customLogo'
    };

    // 初始化
    init();

    function init() {
        // 检查是否已登录
        checkAuthStatus();
        
        // 加载自定义logo
        loadCustomLogo();
        
        // 设置事件监听器
        setupEventListeners();
        
        // 添加键盘快捷键
        setupKeyboardShortcuts();
    }

    function setupEventListeners() {
        // 登录表单提交
        loginForm.addEventListener('submit', handleLogin);
        
        // 密码显示/隐藏切换
        passwordToggle.addEventListener('click', togglePasswordVisibility);
        
        // Logo上传
        logoUploadBtn.addEventListener('click', () => logoUpload.click());
        logoUpload.addEventListener('change', handleLogoUpload);
        
        // 输入框焦点效果
        passwordInput.addEventListener('focus', () => {
            errorMessage.classList.add('d-none');
        });
        
        // 实时密码验证（可选）
        passwordInput.addEventListener('input', () => {
            if (errorMessage.classList.contains('d-none') === false) {
                errorMessage.classList.add('d-none');
            }
        });
    }

    function setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Ctrl + L 聚焦到密码输入框
            if (e.ctrlKey && e.key === 'l') {
                e.preventDefault();
                passwordInput.focus();
            }
            
            // ESC 清空密码输入框
            if (e.key === 'Escape') {
                passwordInput.value = '';
                passwordInput.focus();
            }
        });
    }

    function checkAuthStatus() {
        const authToken = sessionStorage.getItem(CONFIG.sessionKey);
        if (authToken === 'authenticated') {
            // 已登录，直接跳转到主应用
            redirectToMainApp();
        }
    }

    function handleLogin(e) {
        e.preventDefault();
        
        const password = passwordInput.value.trim();
        
        if (!password) {
            showError('请输入密码');
            return;
        }

        // 显示加载状态
        setLoadingState(true);

        // 模拟网络延迟
        setTimeout(() => {
            if (validatePassword(password)) {
                // 登录成功
                sessionStorage.setItem(CONFIG.sessionKey, 'authenticated');
                showSuccess();
                
                setTimeout(() => {
                    redirectToMainApp();
                }, 1000);
            } else {
                // 登录失败
                setLoadingState(false);
                showError('密码错误，请重试');
                passwordInput.value = '';
                passwordInput.focus();
            }
        }, 800);
    }

    function validatePassword(password) {
        // 这里可以实现更复杂的密码验证逻辑
        return password === CONFIG.password;
    }

    function setLoadingState(loading) {
        if (loading) {
            loginBtn.disabled = true;
            btnText.classList.add('d-none');
            btnLoading.classList.remove('d-none');
        } else {
            loginBtn.disabled = false;
            btnText.classList.remove('d-none');
            btnLoading.classList.add('d-none');
        }
    }

    function showError(message) {
        errorText.textContent = message;
        errorMessage.classList.remove('d-none');
        
        // 添加震动效果
        passwordInput.style.animation = 'shake 0.5s ease-in-out';
        setTimeout(() => {
            passwordInput.style.animation = '';
        }, 500);
    }

    function showSuccess() {
        btnText.textContent = '登录成功！';
        loginBtn.style.background = 'linear-gradient(135deg, #28a745, #20c997)';
    }

    function togglePasswordVisibility() {
        const type = passwordInput.type === 'password' ? 'text' : 'password';
        passwordInput.type = type;

        // 更新图标
        if (type === 'text') {
            passwordToggle.textContent = '🙈';
            passwordToggle.title = '隐藏密码';
        } else {
            passwordToggle.textContent = '👁️';
            passwordToggle.title = '显示密码';
        }
    }

    function handleLogoUpload(e) {
        const file = e.target.files[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            alert('请选择图像文件');
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            const logoData = e.target.result;
            
            // 保存到本地存储
            localStorage.setItem(CONFIG.logoKey, logoData);
            
            // 更新显示
            appLogo.src = logoData;
            appLogo.style.filter = 'none'; // 移除白色滤镜以显示原始颜色
            
            // 显示成功提示
            showToast('Logo已更新');
        };
        reader.readAsDataURL(file);
    }

    function loadCustomLogo() {
        const customLogo = localStorage.getItem(CONFIG.logoKey);
        if (customLogo) {
            appLogo.src = customLogo;
            appLogo.style.filter = 'none';
        }
    }

    function showToast(message) {
        // 创建简单的提示消息
        const toast = document.createElement('div');
        toast.className = 'toast-message';
        toast.textContent = message;
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: var(--primary-color);
            color: white;
            padding: 0.75rem 1.5rem;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 1000;
            animation: slideIn 0.3s ease-out;
        `;
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.style.animation = 'slideOut 0.3s ease-in forwards';
            setTimeout(() => {
                document.body.removeChild(toast);
            }, 300);
        }, 2000);
    }

    function redirectToMainApp() {
        // 平滑过渡到主应用
        document.body.style.transition = 'opacity 0.5s ease-out';
        document.body.style.opacity = '0';
        
        setTimeout(() => {
            window.location.href = 'app.html';
        }, 500);
    }

    // 添加CSS动画
    const style = document.createElement('style');
    style.textContent = `
        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-5px); }
            75% { transform: translateX(5px); }
        }
        
        @keyframes slideIn {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        @keyframes slideOut {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(100%);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);

    // 开发者工具：在控制台中可以修改密码
    window.setPassword = function(newPassword) {
        CONFIG.password = newPassword;
        console.log('密码已更新为:', newPassword);
    };
    
    // 开发者工具：重置登录状态
    window.resetAuth = function() {
        sessionStorage.removeItem(CONFIG.sessionKey);
        console.log('登录状态已重置');
    };
});
