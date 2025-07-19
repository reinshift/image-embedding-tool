// 数学表达式定义
const mathExpressions = {
    // 第1章 - 背景介绍
    'source-size': 'W \\times H',
    'target-vertices': '\\{P_1, P_2, P_3, P_4\\}',
    'source-corners': `
        \\begin{align}
        \\text{左上角：} &\\quad (0, 0) \\\\
        \\text{右上角：} &\\quad (W, 0) \\\\
        \\text{右下角：} &\\quad (W, H) \\\\
        \\text{左下角：} &\\quad (0, H)
        \\end{align}
    `,
    'mapping-requirement': `
        \\begin{cases}
        (0, 0) &\\rightarrow P_1 = (x_1, y_1) \\\\
        (W, 0) &\\rightarrow P_2 = (x_2, y_2) \\\\
        (W, H) &\\rightarrow P_3 = (x_3, y_3) \\\\
        (0, H) &\\rightarrow P_4 = (x_4, y_4)
        \\end{cases}
    `,

    // 第2章 - 单应性变换
    'homography-definition': `
        \\begin{bmatrix} x' \\\\ y' \\\\ w' \\end{bmatrix} = 
        \\mathbf{H} \\begin{bmatrix} x \\\\ y \\\\ 1 \\end{bmatrix}
    `,
    'H-matrix': '\\mathbf{H}',
    'coordinate-conversion': `
        \\begin{cases}
        x_{\\text{new}} = \\frac{x'}{w'} \\\\
        y_{\\text{new}} = \\frac{y'}{w'}
        \\end{cases}
    `,

    // 第3章 - 单应矩阵结构
    'H-general': '\\mathbf{H}',
    'matrix-structure': `
        \\mathbf{H} = \\begin{bmatrix}
        h_{11} & h_{12} & h_{13} \\\\
        h_{21} & h_{22} & h_{23} \\\\
        h_{31} & h_{32} & h_{33}
        \\end{bmatrix}
    `,
    'point-pair': '(\\mathbf{p}_i, \\mathbf{q}_i)',
    'constraint-equation': '\\mathbf{q}_i \\sim \\mathbf{H} \\mathbf{p}_i',
    'cross-product-zero': '\\mathbf{q}_i \\times (\\mathbf{H} \\mathbf{p}_i) = \\mathbf{0}',

    // 第4章 - 求解算法
    'matrix-vectorization': '\\mathbf{h} = [h_{11}, h_{12}, h_{13}, h_{21}, h_{22}, h_{23}, h_{31}, h_{32}, h_{33}]^T',
    'linear-system': '\\mathbf{A} \\mathbf{h} = \\mathbf{0}',
    'A-matrix': '\\mathbf{A}',
    'least-squares': '\\min_{\\mathbf{h}} \\|\\mathbf{A} \\mathbf{h}\\|^2 \\quad \\text{subject to} \\quad \\|\\mathbf{h}\\| = 1',

    // 第5章 - 广义逆与SVD
    'matrix-A': '\\mathbf{A}',
    'pseudoinverse': '\\mathbf{A}^+',
    'pseudoinverse-definition': '\\mathbf{A}^+ = (\\mathbf{A}^T \\mathbf{A})^{-1} \\mathbf{A}^T \\quad \\text{(当 } \\mathbf{A}^T \\mathbf{A} \\text{ 可逆时)}',
    'matrix-A-svd': '\\mathbf{A}',
    'svd-decomposition': '\\mathbf{A} = \\mathbf{U} \\mathbf{\\Sigma} \\mathbf{V}^T',
    'U-matrix': '\\mathbf{U}',
    'V-matrix': '\\mathbf{V}',
    'sigma-matrix': '\\mathbf{\\Sigma}',
    'A-svd': '\\mathbf{A}',
    'svd-solution': '\\mathbf{h} = \\mathbf{v}_{\\text{min}} \\quad \\text{(对应最小奇异值的右奇异向量)}',

    // 第6章 - 项目Pipeline
    'project-correspondence': `
        \\begin{align}
        \\text{源图像角点} &\\quad \\rightarrow \\quad \\text{目标四边形顶点} \\\\
        (0, 0) &\\quad \\rightarrow \\quad (x_1, y_1) \\\\
        (W, 0) &\\quad \\rightarrow \\quad (x_2, y_2) \\\\
        (W, H) &\\quad \\rightarrow \\quad (x_3, y_3) \\\\
        (0, H) &\\quad \\rightarrow \\quad (x_4, y_4)
        \\end{align}
    `,
    'source-pixel': '(x, y)',
    'pixel-transform': `
        \\begin{cases}
        x' = \\frac{h_{11}x + h_{12}y + h_{13}}{h_{31}x + h_{32}y + h_{33}} \\\\
        y' = \\frac{h_{21}x + h_{22}y + h_{23}}{h_{31}x + h_{32}y + h_{33}}
        \\end{cases}
    `
};

let renderCount = 0;
const totalCount = Object.keys(mathExpressions).length;

function showLoading() {
    const indicator = document.getElementById('loading-indicator');
    indicator.classList.add('show');
    updateProgress();
}

function hideLoading() {
    const indicator = document.getElementById('loading-indicator');
    setTimeout(() => indicator.classList.remove('show'), 500);
}

function updateProgress() {
    document.getElementById('progress-text').textContent = `${renderCount}/${totalCount}`;
}

function renderMath() {
    console.log('开始渲染数学公式...');
    showLoading();

    Object.entries(mathExpressions).forEach(([id, expression]) => {
        const element = document.getElementById(id);
        if (!element) {
            console.warn(`Element not found: ${id}`);
            return;
        }

        try {
            const isDisplay = element.classList.contains('katex-display');
            katex.render(expression, element, {
                displayMode: isDisplay,
                throwOnError: false,
                strict: false,
                trust: true
            });
            renderCount++;
            updateProgress();
            console.log(`Successfully rendered: ${id}`);
        } catch (error) {
            console.error(`Failed to render ${id}:`, error);
            element.textContent = `[公式渲染失败: ${id}]`;
            element.style.color = '#dc3545';
            element.style.fontStyle = 'italic';
        }
    });

    console.log(`渲染完成: ${renderCount}/${totalCount}`);
    hideLoading();
}

function goBackToApp() {
    // 检查是否在同一域名下
    if (window.location.protocol === 'file:' || window.location.hostname === 'localhost') {
        window.location.href = 'index.html';
    } else {
        window.history.back();
    }
}

// 页面加载完成后渲染
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM content loaded');
    
    if (typeof katex !== 'undefined') {
        console.log('KaTeX is ready, starting math rendering');
        renderMath();
    } else {
        console.error('KaTeX未加载');
        document.getElementById('loading-indicator').textContent = 'KaTeX加载失败';
        document.getElementById('loading-indicator').classList.add('show');
    }

    // 添加键盘快捷键支持
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            goBackToApp();
        }
    });
});

// 窗口加载完成后的额外检查
window.addEventListener('load', function() {
    console.log('Window fully loaded');
    
    // 如果此时还没有开始渲染，再次尝试
    if (renderCount === 0 && typeof katex !== 'undefined') {
        console.log('Fallback: Starting math rendering on window load');
        renderMath();
    }
});
