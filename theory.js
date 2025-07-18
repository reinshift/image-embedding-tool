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
        // 第1章 - 引言
        'source-image': 'I_s',
        'target-image': 'I_t',
        'source-corners': `
            \\mathbf{p}_1 = (0, 0), \\quad \\mathbf{p}_2 = (w, 0), \\quad \\mathbf{p}_3 = (w, h), \\quad \\mathbf{p}_4 = (0, h)
        `,
        'target-corners': `
            \\mathbf{q}_1 = (x_1, y_1), \\quad \\mathbf{q}_2 = (x_2, y_2), \\quad \\mathbf{q}_3 = (x_3, y_3), \\quad \\mathbf{q}_4 = (x_4, y_4)
        `,
        'transform-T': 'T: \\mathbb{R}^2 \\to \\mathbb{R}^2',
        'transform-mapping': 'T(\\mathbf{p}_i) = \\mathbf{q}_i, \\quad i = 1, 2, 3, 4',
        'point-2d': '(x, y)',
        'point-homogeneous': '[x, y, 1]^T',

        // 第2章 - 单应性变换定义
        'plane1': '\\Pi_1',
        'plane2': '\\Pi_2',
        'homography-map': 'h: \\Pi_1 \\to \\Pi_2',
        'homography-matrix-form': `
            \\begin{bmatrix} x' \\\\ y' \\\\ w' \\end{bmatrix} =
            \\mathbf{H} \\begin{bmatrix} x \\\\ y \\\\ 1 \\end{bmatrix}
        `,
        'H-matrix': '\\mathbf{H}',
        'H-scale': '\\lambda \\mathbf{H}',
        'H-original': '\\mathbf{H}',
        'lambda-nonzero': '\\lambda \\neq 0',
        'H-invertible': '\\det(\\mathbf{H}) \\neq 0',
        'H-inverse': '\\mathbf{H}^{-1}',

        // 第3章 - 数学表达
        'point-p': '\\mathbf{p}',
        'point-p-homo': '[x, y, 1]^T',
        'homography-eq1': `
            \\begin{bmatrix} x' \\\\ y' \\\\ w' \\end{bmatrix} =
            \\mathbf{H} \\begin{bmatrix} x \\\\ y \\\\ 1 \\end{bmatrix}
        `,
        'H-general-form': `
            \\mathbf{H} = \\begin{bmatrix}
            h_{11} & h_{12} & h_{13} \\\\
            h_{21} & h_{22} & h_{23} \\\\
            h_{31} & h_{32} & h_{33}
            \\end{bmatrix}
        `,
        'nonhomogeneous-transform': `
            x' = \\frac{h_{11}x + h_{12}y + h_{13}}{h_{31}x + h_{32}y + h_{33}}, \\quad
            y' = \\frac{h_{21}x + h_{22}y + h_{23}}{h_{31}x + h_{32}y + h_{33}}
        `,
        'denominator': 'h_{31}x + h_{32}y + h_{33}',
        'H-decomposition': `
            \\mathbf{H} = \\begin{bmatrix}
            \\mathbf{A} & \\mathbf{t} \\\\
            \\mathbf{v}^T & v
            \\end{bmatrix}
        `,
        'A-matrix': '\\mathbf{A} \\in \\mathbb{R}^{2 \\times 2}',
        't-vector': '\\mathbf{t} \\in \\mathbb{R}^2',
        'v-vector': '\\mathbf{v} \\in \\mathbb{R}^2',
        'v-scalar': 'v \\in \\mathbb{R}',
        'line-preservation': `
            \\mathbf{l}' = \\mathbf{H}^{-T} \\mathbf{l}
        `,
        'cross-ratio': `
            (A, B; C, D) = (A', B'; C', D')
        `,

        // 第4章 - 单应矩阵结构
        'point-pair': '(\\mathbf{p}_i, \\mathbf{q}_i)',
        'point-correspondence': `
            \\begin{bmatrix} x'_i \\\\ y'_i \\\\ w'_i \\end{bmatrix} =
            \\mathbf{H} \\begin{bmatrix} x_i \\\\ y_i \\\\ 1 \\end{bmatrix}
        `,
        'expanded-correspondence': `
            \\begin{align}
            x'_i &= h_{11}x_i + h_{12}y_i + h_{13} \\\\
            y'_i &= h_{21}x_i + h_{22}y_i + h_{23} \\\\
            w'_i &= h_{31}x_i + h_{32}y_i + h_{33}
            \\end{align}
        `,
        'scale-constraint': '\\mathbf{q}_i \\times \\mathbf{H}\\mathbf{p}_i = \\mathbf{0}',
        'cross-product-constraint': `
            \\begin{bmatrix} x'_i \\\\ y'_i \\\\ 1 \\end{bmatrix} \\times
            \\begin{bmatrix} h_{11}x_i + h_{12}y_i + h_{13} \\\\ h_{21}x_i + h_{22}y_i + h_{23} \\\\ h_{31}x_i + h_{32}y_i + h_{33} \\end{bmatrix} = \\mathbf{0}
        `,
        'dlt-equations': `
            \\begin{align}
            x_i h_{11} + y_i h_{12} + h_{13} - x'_i(x_i h_{31} + y_i h_{32} + h_{33}) &= 0 \\\\
            x_i h_{21} + y_i h_{22} + h_{23} - y'_i(x_i h_{31} + y_i h_{32} + h_{33}) &= 0
            \\end{align}
        `,
        'n-points': 'n',
        '2n-equations': '2n',
        'h-vector': '\\mathbf{h} = [h_{11}, h_{12}, h_{13}, h_{21}, h_{22}, h_{23}, h_{31}, h_{32}, h_{33}]^T',
        'linear-system': '\\mathbf{A}\\mathbf{h} = \\mathbf{0}',
        'A-matrix-size': '\\mathbf{A} \\in \\mathbb{R}^{2n \\times 9}',
        'i-th-row': '(2i-1, 2i)',
        'A-matrix-rows': `
            \\begin{bmatrix}
            x_i & y_i & 1 & 0 & 0 & 0 & -x'_i x_i & -x'_i y_i & -x'_i \\\\
            0 & 0 & 0 & x_i & y_i & 1 & -y'_i x_i & -y'_i y_i & -y'_i
            \\end{bmatrix}
        `,
        'n-equals-4': 'n = 4',
        'homogeneous-system': '\\mathbf{A}\\mathbf{h} = \\mathbf{0}',
        'norm-constraint': '\\|\\mathbf{h}\\| = 1',

        // 第5章 - 广义逆理论
        'matrix-A': '\\mathbf{A} \\in \\mathbb{R}^{m \\times n}',
        'A-pseudoinverse': '\\mathbf{A}^+',
        'mp-conditions': `
            \\begin{align}
            \\mathbf{A}\\mathbf{A}^+\\mathbf{A} &= \\mathbf{A} \\\\
            \\mathbf{A}^+\\mathbf{A}\\mathbf{A}^+ &= \\mathbf{A}^+ \\\\
            (\\mathbf{A}\\mathbf{A}^+)^T &= \\mathbf{A}\\mathbf{A}^+ \\\\
            (\\mathbf{A}^+\\mathbf{A})^T &= \\mathbf{A}^+\\mathbf{A}
            \\end{align}
        `,
        'A-svd-form': '\\mathbf{A} = \\mathbf{U}\\mathbf{\\Sigma}\\mathbf{V}^T',
        'sigma-diagonal': '\\mathbf{\\Sigma} = \\text{diag}(\\sigma_1, \\ldots, \\sigma_r, 0, \\ldots, 0)',
        'svd-pseudoinverse': '\\mathbf{A}^+ = \\mathbf{V}\\mathbf{\\Sigma}^+\\mathbf{U}^T',
        'sigma-plus': '\\mathbf{\\Sigma}^+',
        'sigma-matrix': '\\mathbf{\\Sigma}',
        'pseudoinverse-symmetry': '(\\mathbf{A}^+)^+ = \\mathbf{A}',
        'pseudoinverse-idempotent': '\\mathbf{A}^+\\mathbf{A}\\mathbf{A}^+ = \\mathbf{A}^+',
        'pseudoinverse-norm': '\\|\\mathbf{A}^+\\| = \\frac{1}{\\sigma_{\\min}(\\mathbf{A})}',
        'homogeneous-eq': '\\mathbf{A}\\mathbf{x} = \\mathbf{0}',
        'min-norm-solution': '\\mathbf{x}^* = \\arg\\min_{\\mathbf{A}\\mathbf{x}=\\mathbf{0}} \\|\\mathbf{x}\\|',
        'v-min': '\\mathbf{v}_{\\min}',
        'ATA-matrix': '\\mathbf{A}^T\\mathbf{A}',
        'A-rank': '\\text{rank}(\\mathbf{A}) = r < 9',
        'ATA-eigenvalues': '\\mathbf{A}^T\\mathbf{A}',
        'r-positive': 'r',
        '9-r-zero': '(9-r)',
        'A-nullspace': '\\text{null}(\\mathbf{A})',
        'rank-8': 'r = 8',
        'condition-number': '\\mathbf{A}',
        'cond-formula': '\\text{cond}(\\mathbf{A}) = \\frac{\\sigma_{\\max}}{\\sigma_{\\min}}',
        'sigma-min': '\\sigma_{\\min}',
        'truncated-svd': '\\mathbf{A}^+_k = \\mathbf{V}_k\\mathbf{\\Sigma}_k^+\\mathbf{U}_k^T',

        // 第6章 - 求解方法
        'input-points': '\\{(\\mathbf{p}_i, \\mathbf{q}_i)\\}_{i=1}^4',
        'output-H': '\\mathbf{H} \\in \\mathbb{R}^{3 \\times 3}',
        'A-construction': '\\mathbf{A} \\in \\mathbb{R}^{8 \\times 9}',
        'min-problem': '\\min_{\\|\\mathbf{h}\\|=1} \\|\\mathbf{A}\\mathbf{h}\\|^2',
        'h33-normalize': 'h_{33} = 1',
        'Ah-zero': '\\mathbf{A}\\mathbf{h} = \\mathbf{0}',
        'eigenvalue-method': '\\mathbf{A}^T\\mathbf{A}\\mathbf{v} = \\lambda\\mathbf{v}',
        'ATA-eigen': '\\mathbf{A}^T\\mathbf{A}',
        'svd-method': '\\mathbf{A} = \\mathbf{U}\\mathbf{\\Sigma}\\mathbf{V}^T',
        'A-svd': '\\mathbf{A}',
        'V-last-column': '\\mathbf{v}_9',
        'cond-A': '\\text{cond}(\\mathbf{A})',
        'cond-threshold': '\\text{cond}(\\mathbf{A}) < 10^{12}',
        'normalize-range': '[-1, 1]',
        'normalization-transform': `
            \\mathbf{T} = \\begin{bmatrix}
            \\frac{2}{w} & 0 & -1 \\\\
            0 & \\frac{2}{h} & -1 \\\\
            0 & 0 & 1
            \\end{bmatrix}
        `,
        'tikhonov-regularization': '\\min_{\\mathbf{h}} \\|\\mathbf{A}\\mathbf{h}\\|^2 + \\alpha\\|\\mathbf{h}\\|^2',
        'n-greater-4': 'n > 4',
        'overdetermined-solution': '\\mathbf{h}^* = \\arg\\min_{\\mathbf{h}} \\|\\mathbf{A}\\mathbf{h}\\|^2',

        // 第7章 - 应用实例
        'source-size': 'W \\times H',
        'correspondence-points': '\\{(\\mathbf{p}_i, \\mathbf{q}_i)\\}_{i=1}^4',
        'target-H': '\\mathbf{H}',
        'source-corners-specific': `
            \\mathbf{p}_1 = (0, 0), \\quad \\mathbf{p}_2 = (W, 0), \\quad \\mathbf{p}_3 = (W, H), \\quad \\mathbf{p}_4 = (0, H)
        `,
        'target-corners-specific': `
            \\mathbf{q}_1 = (u_1, v_1), \\quad \\mathbf{q}_2 = (u_2, v_2), \\quad \\mathbf{q}_3 = (u_3, v_3), \\quad \\mathbf{q}_4 = (u_4, v_4)
        `,
        'point-pair-i': '(\\mathbf{p}_i, \\mathbf{q}_i)',
        'constraint-equations': `
            \\begin{align}
            u_i(h_{31}x_i + h_{32}y_i + h_{33}) &= h_{11}x_i + h_{12}y_i + h_{13} \\\\
            v_i(h_{31}x_i + h_{32}y_i + h_{33}) &= h_{21}x_i + h_{22}y_i + h_{23}
            \\end{align}
        `,
        'A-8x9': '\\mathbf{A} \\in \\mathbb{R}^{8 \\times 9}',
        'coefficient-matrix': `
            \\mathbf{A} = \\begin{bmatrix}
            x_1 & y_1 & 1 & 0 & 0 & 0 & -u_1x_1 & -u_1y_1 & -u_1 \\\\
            0 & 0 & 0 & x_1 & y_1 & 1 & -v_1x_1 & -v_1y_1 & -v_1 \\\\
            \\vdots & \\vdots & \\vdots & \\vdots & \\vdots & \\vdots & \\vdots & \\vdots & \\vdots \\\\
            x_4 & y_4 & 1 & 0 & 0 & 0 & -u_4x_4 & -u_4y_4 & -u_4 \\\\
            0 & 0 & 0 & x_4 & y_4 & 1 & -v_4x_4 & -v_4y_4 & -v_4
            \\end{bmatrix}
        `,
        'ATA-computation': '\\mathbf{A}^T\\mathbf{A}',
        'eigendecomposition': '\\mathbf{A}^T\\mathbf{A} = \\mathbf{V}\\mathbf{\\Lambda}\\mathbf{V}^T',
        'lambda-min': '\\lambda_{\\min}',
        'h-solution': '\\mathbf{h}',
        'H-reconstruction': `
            \\mathbf{H} = \\begin{bmatrix}
            h_1 & h_2 & h_3 \\\\
            h_4 & h_5 & h_6 \\\\
            h_7 & h_8 & h_9
            \\end{bmatrix}
        `,
        'h33-one': 'h_{33} = 1',
        'h33-nonzero': 'h_{33} \\neq 0',
        'source-pixel': '(x, y)',
        'forward-transform': `
            \\begin{bmatrix} x' \\\\ y' \\\\ w' \\end{bmatrix} =
            \\mathbf{H} \\begin{bmatrix} x \\\\ y \\\\ 1 \\end{bmatrix}, \\quad
            (x'', y'') = \\left(\\frac{x'}{w'}, \\frac{y'}{w'}\\right)
        `,
        'target-position': '(x'', y'')',
        'bilinear-interpolation': `
            I(x'', y'') = \\sum_{i,j} w_{ij} I(\\lfloor x'' \\rfloor + i, \\lfloor y'' \\rfloor + j)
        `,
        'interpolation-weights': 'w_{ij}',
        'matrix-construction-complexity': 'O(1)',
        'eigen-complexity': 'O(1)',
        'transform-complexity': 'O(WH)',
        'total-complexity': 'O(WH)',
        'matrix-space': 'O(1)',
        'image-space': 'O(WH)',
        'condition-check': '\\text{cond}(\\mathbf{A}) > 10^{12}',
        'reprojection-error': `
            E = \\frac{1}{4}\\sum_{i=1}^4 \\|\\mathbf{q}_i - \\mathbf{H}\\mathbf{p}_i\\|^2
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
