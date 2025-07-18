document.addEventListener('DOMContentLoaded', function() {
    // 初始化数学公式渲染
    initMathRendering();
    
    // 初始化可视化演示
    initHomographyDemo();
    
    // 初始化平滑滚动
    initSmoothScrolling();
});

function initMathRendering() {
    // 渲染各种数学公式
    const mathExpressions = {
        'homography-eq1': `
            \\begin{bmatrix}
            x' \\\\ y' \\\\ w'
            \\end{bmatrix} = 
            \\begin{bmatrix}
            h_{11} & h_{12} & h_{13} \\\\
            h_{21} & h_{22} & h_{23} \\\\
            h_{31} & h_{32} & h_{33}
            \\end{bmatrix}
            \\begin{bmatrix}
            x \\\\ y \\\\ 1
            \\end{bmatrix}
        `,
        
        'h-matrix': 'H',
        'point-src': '(x, y, 1)^T',
        'point-dst': "(x', y', w')^T",
        
        'linear-system': `
            \\mathbf{A} \\mathbf{h} = \\mathbf{0}
        `,
        
        'least-squares': `
            \\min_{\\mathbf{h}} \\|\\mathbf{A}\\mathbf{h}\\|^2 \\quad \\text{subject to} \\quad \\|\\mathbf{h}\\| = 1
        `,
        
        'pseudo-inverse-def': `
            \\mathbf{A}^+ = (\\mathbf{A}^T\\mathbf{A})^{-1}\\mathbf{A}^T
        `,
        
        'svd-decomposition': `
            \\mathbf{A} = \\mathbf{U}\\mathbf{\\Sigma}\\mathbf{V}^T \\quad \\Rightarrow \\quad \\mathbf{A}^+ = \\mathbf{V}\\mathbf{\\Sigma}^+\\mathbf{U}^T
        `,
        
        'dlt-equations': `
            \\begin{align}
            x_i h_{11} + y_i h_{12} + h_{13} - x'_i(x_i h_{31} + y_i h_{32} + h_{33}) &= 0 \\\\
            x_i h_{21} + y_i h_{22} + h_{23} - y'_i(x_i h_{31} + y_i h_{32} + h_{33}) &= 0
            \\end{align}
        `
    };
    
    // 渲染所有数学公式
    Object.entries(mathExpressions).forEach(([id, expression]) => {
        const element = document.getElementById(id);
        if (element) {
            try {
                if (element.classList.contains('katex-display')) {
                    katex.render(expression, element, {
                        displayMode: true,
                        throwOnError: false
                    });
                } else {
                    katex.render(expression, element, {
                        displayMode: false,
                        throwOnError: false
                    });
                }
            } catch (error) {
                console.warn(`Failed to render math for ${id}:`, error);
                element.textContent = expression;
            }
        }
    });
}

function initHomographyDemo() {
    const canvas = document.getElementById('homography-demo');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    let animationId = null;
    let animationProgress = 0;
    
    // 原始矩形的四个角点
    const originalPoints = [
        [50, 50],   // 左上
        [150, 50],  // 右上
        [150, 100], // 右下
        [50, 100]   // 左下
    ];
    
    // 变换后的四个角点
    const transformedPoints = [
        [80, 40],   // 左上
        [180, 60],  // 右上
        [170, 120], // 右下
        [60, 110]   // 左下
    ];
    
    function drawDemo(progress = 0) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // 绘制网格
        drawGrid(ctx);
        
        // 计算当前帧的点位置
        const currentPoints = originalPoints.map((point, i) => {
            const [x1, y1] = point;
            const [x2, y2] = transformedPoints[i];
            return [
                x1 + (x2 - x1) * progress,
                y1 + (y2 - y1) * progress
            ];
        });
        
        // 绘制原始矩形（淡化）
        drawQuadrilateral(ctx, originalPoints, 'rgba(200, 200, 200, 0.5)', '原始');
        
        // 绘制当前矩形
        drawQuadrilateral(ctx, currentPoints, '#24d37a', '变换中');
        
        // 绘制目标矩形（虚线）
        drawQuadrilateral(ctx, transformedPoints, 'rgba(36, 211, 122, 0.3)', '目标', true);
        
        // 绘制变换矩阵信息
        drawMatrixInfo(ctx, progress);
    }
    
    function drawGrid(ctx) {
        ctx.strokeStyle = '#f0f0f0';
        ctx.lineWidth = 1;
        
        // 垂直线
        for (let x = 0; x <= canvas.width; x += 20) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, canvas.height);
            ctx.stroke();
        }
        
        // 水平线
        for (let y = 0; y <= canvas.height; y += 20) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(canvas.width, y);
            ctx.stroke();
        }
    }
    
    function drawQuadrilateral(ctx, points, color, label, dashed = false) {
        ctx.strokeStyle = color;
        ctx.fillStyle = color;
        ctx.lineWidth = 2;
        
        if (dashed) {
            ctx.setLineDash([5, 5]);
        } else {
            ctx.setLineDash([]);
        }
        
        // 绘制四边形
        ctx.beginPath();
        ctx.moveTo(points[0][0], points[0][1]);
        for (let i = 1; i < points.length; i++) {
            ctx.lineTo(points[i][0], points[i][1]);
        }
        ctx.closePath();
        ctx.stroke();
        
        // 填充（半透明）
        ctx.globalAlpha = 0.1;
        ctx.fill();
        ctx.globalAlpha = 1;
        
        // 绘制角点
        points.forEach((point, i) => {
            ctx.beginPath();
            ctx.arc(point[0], point[1], 4, 0, 2 * Math.PI);
            ctx.fill();
            
            // 标注点序号
            ctx.fillStyle = '#333';
            ctx.font = '12px Arial';
            ctx.fillText(i + 1, point[0] + 8, point[1] - 8);
            ctx.fillStyle = color;
        });
        
        // 绘制标签
        const centerX = points.reduce((sum, p) => sum + p[0], 0) / points.length;
        const centerY = points.reduce((sum, p) => sum + p[1], 0) / points.length;
        
        ctx.fillStyle = '#333';
        ctx.font = 'bold 12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(label, centerX, centerY);
        ctx.textAlign = 'left';
    }
    
    function drawMatrixInfo(ctx, progress) {
        ctx.fillStyle = '#333';
        ctx.font = '14px Arial';
        
        const info = [
            `变换进度: ${Math.round(progress * 100)}%`,
            `单应性矩阵 H 将原始四边形映射到目标位置`,
            `使用 DLT 算法计算变换参数`
        ];
        
        info.forEach((text, i) => {
            ctx.fillText(text, 220, 50 + i * 20);
        });
    }
    
    // 动画函数
    function animate() {
        animationProgress += 0.02;
        
        if (animationProgress >= 1) {
            animationProgress = 1;
            drawDemo(animationProgress);
            
            // 暂停一下然后重新开始
            setTimeout(() => {
                animationProgress = 0;
                if (animationId) {
                    animate();
                }
            }, 1000);
        } else {
            drawDemo(animationProgress);
            animationId = requestAnimationFrame(animate);
        }
    }
    
    // 全局函数供按钮调用
    window.animateHomography = function() {
        if (animationId) {
            cancelAnimationFrame(animationId);
        }
        animationProgress = 0;
        animate();
    };
    
    window.resetDemo = function() {
        if (animationId) {
            cancelAnimationFrame(animationId);
            animationId = null;
        }
        animationProgress = 0;
        drawDemo(0);
    };
    
    // 初始绘制
    drawDemo(0);
}

function initSmoothScrolling() {
    // 为目录链接添加平滑滚动
    const tocLinks = document.querySelectorAll('.toc-list a');
    
    tocLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                
                // 添加高亮效果
                targetElement.style.transition = 'background-color 0.3s ease';
                targetElement.style.backgroundColor = 'rgba(36, 211, 122, 0.05)';
                
                setTimeout(() => {
                    targetElement.style.backgroundColor = '';
                }, 2000);
            }
        });
    });
}

// 添加一些交互效果
document.addEventListener('DOMContentLoaded', function() {
    // 为内容块添加进入动画
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // 观察所有内容块
    const contentBlocks = document.querySelectorAll('.content-block, .visual-demo, .app-card');
    contentBlocks.forEach(block => {
        block.style.opacity = '0';
        block.style.transform = 'translateY(20px)';
        block.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(block);
    });
});

// 返回主应用函数
function goBackToApp() {
    // 检查是否有历史记录
    if (document.referrer && document.referrer.includes('app.html')) {
        window.history.back();
    } else {
        // 直接跳转到主应用
        window.location.href = 'app.html';
    }
}
