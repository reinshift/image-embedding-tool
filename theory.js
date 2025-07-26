// 数学表达式定义
const mathExpressions = {
    // 第2章 - 线性变换与单应变换的区别
    'rotation-matrix': `
        \\begin{bmatrix}
        \\cos\\theta & -\\sin\\theta \\\\
        \\sin\\theta & \\cos\\theta
        \\end{bmatrix}
    `,
    'nonlinear-homography': `
        \\begin{cases}
        x' = \\frac{h_{11}x + h_{12}y + h_{13}}{h_{31}x + h_{32}y + h_{33}} \\\\
        y' = \\frac{h_{21}x + h_{22}y + h_{23}}{h_{31}x + h_{32}y + h_{33}}
        \\end{cases}
    `,
    'homography-matrix': `
        \\mathbf{H} = \\begin{bmatrix}
        h_{11} & h_{12} & h_{13} \\\\
        h_{21} & h_{22} & h_{23} \\\\
        h_{31} & h_{32} & h_{33}
        \\end{bmatrix}
    `,
    'homography-transform': `
        \\begin{bmatrix} X' \\\\ Y' \\\\ Z' \\end{bmatrix} =
        \\mathbf{H} \\begin{bmatrix} x \\\\ y \\\\ 1 \\end{bmatrix}
    `,

    // 第3章 - 图像嵌入问题的数学建模
    'homography-equation': `
        \\begin{bmatrix} x_i' \\\\ y_i' \\\\ 1 \\end{bmatrix} = \\lambda_i \\mathbf{H} \\begin{bmatrix} x_i \\\\ y_i \\\\ 1 \\end{bmatrix}
    `,
    'expanded-equations': `
        \\begin{cases}
        \\lambda_i x_i' = h_{11}x_i + h_{12}y_i + h_{13} \\\\
        \\lambda_i y_i' = h_{21}x_i + h_{22}y_i + h_{23} \\\\
        \\lambda_i = h_{31}x_i + h_{32}y_i + h_{33}
        \\end{cases}
    `,
    'constraint-equations': `
        \\begin{cases}
        (h_{31}x_i + h_{32}y_i + h_{33}) \\cdot x_i' = h_{11}x_i + h_{12}y_i + h_{13} \\\\
        (h_{31}x_i + h_{32}y_i + h_{33}) \\cdot y_i' = h_{21}x_i + h_{22}y_i + h_{23}
        \\end{cases}
    `,

    // 第4章 - 求解线性方程组
    'constraint-rearrange': `
        \\begin{cases}
        h_{11}x_i + h_{12}y_i + h_{13} - x_i'(h_{31}x_i + h_{32}y_i + h_{33}) = 0 \\\\
        h_{21}x_i + h_{22}y_i + h_{23} - y_i'(h_{31}x_i + h_{32}y_i + h_{33}) = 0
        \\end{cases}
    `,
    'linear-form': `
        \\begin{cases}
        h_{11}x_i + h_{12}y_i + h_{13} - h_{31}x_i'x_i - h_{32}x_i'y_i - h_{33}x_i' = 0 \\\\
        h_{21}x_i + h_{22}y_i + h_{23} - h_{31}y_i'x_i - h_{32}y_i'y_i - h_{33}y_i' = 0
        \\end{cases}
    `,
    'h-vector-form': `
        \\mathbf{h} = [h_{11}, h_{12}, h_{13}, h_{21}, h_{22}, h_{23}, h_{31}, h_{32}, h_{33}]^T
    `,
    'coefficient-matrix-row': `
        \\begin{bmatrix}
        x_i & y_i & 1 & 0 & 0 & 0 & -x_i'x_i & -x_i'y_i & -x_i' \\\\
        0 & 0 & 0 & x_i & y_i & 1 & -y_i'x_i & -y_i'y_i & -y_i'
        \\end{bmatrix}
    `,
    // 第4章新增的公式
    'normalization-condition': `
        h_{33} = 1
    `,
    'standard-linear-system': `
        \\mathbf{A} = \\begin{bmatrix}
        x_1 & y_1 & 1 & 0 & 0 & 0 & -x_1'x_1 & -x_1'y_1 \\\\
        0 & 0 & 0 & x_1 & y_1 & 1 & -y_1'x_1 & -y_1'y_1 \\\\
        x_2 & y_2 & 1 & 0 & 0 & 0 & -x_2'x_2 & -x_2'y_2 \\\\
        0 & 0 & 0 & x_2 & y_2 & 1 & -y_2'x_2 & -y_2'y_2 \\\\
        x_3 & y_3 & 1 & 0 & 0 & 0 & -x_3'x_3 & -x_3'y_3 \\\\
        0 & 0 & 0 & x_3 & y_3 & 1 & -y_3'x_3 & -y_3'y_3 \\\\
        x_4 & y_4 & 1 & 0 & 0 & 0 & -x_4'x_4 & -x_4'y_4 \\\\
        0 & 0 & 0 & x_4 & y_4 & 1 & -y_4'x_4 & -y_4'y_4
        \\end{bmatrix}, \\quad
        \\mathbf{b} = \\begin{bmatrix}
        x_1' \\\\ y_1' \\\\ x_2' \\\\ y_2' \\\\ x_3' \\\\ y_3' \\\\ x_4' \\\\ y_4'
        \\end{bmatrix}
    `,

    // 第5章 - 广义逆与SVD分解
    'svd-decomposition': `
        \\mathbf{A} = \\mathbf{U} \\mathbf{\\Sigma} \\mathbf{V}^T
    `,
    'pseudoinverse-svd': `
        \\mathbf{A}^+ = \\mathbf{V} \\mathbf{\\Sigma}^+ \\mathbf{U}^T
    `,

    // 第6章 - 图像嵌入的完整Pipeline
    'concrete-coordinates': `
        \\begin{cases}
        (x_1, y_1) = (0, 0) & \\text{左上角} \\\\
        (x_2, y_2) = (w, 0) & \\text{右上角} \\\\
        (x_3, y_3) = (w, h) & \\text{右下角} \\\\
        (x_4, y_4) = (0, h) & \\text{左下角}
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

    // 渲染有ID的display数学公式
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

    // 渲染所有inline-math元素
    const inlineMathElements = document.querySelectorAll('.inline-math');
    inlineMathElements.forEach((element, index) => {
        try {
            const mathText = element.textContent.trim();
            if (mathText) {
                katex.render(mathText, element, {
                    displayMode: false,
                    throwOnError: false,
                    strict: false,
                    trust: true
                });
                console.log(`Successfully rendered inline math ${index + 1}: ${mathText}`);
            }
        } catch (error) {
            console.error(`Failed to render inline math ${index + 1}:`, error);
            element.style.color = '#dc3545';
            element.style.fontStyle = 'italic';
        }
    });

    console.log(`渲染完成: ${renderCount}/${totalCount} display公式 + ${inlineMathElements.length} inline公式`);
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
