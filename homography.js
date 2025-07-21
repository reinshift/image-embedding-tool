/**
 * 单应性变换JavaScript实现
 * 用于将一个图像透视变换到另一个图像的指定区域
 */

class HomographyProcessor {
    constructor() {
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
    }

    /**
     * 计算单应性矩阵
     * @param {Array} srcPoints - 源图像的四个角点 [[x1,y1], [x2,y2], [x3,y3], [x4,y4]]
     * @param {Array} dstPoints - 目标图像的四个角点 [[x1,y1], [x2,y2], [x3,y3], [x4,y4]]
     * @returns {Array} 3x3单应性矩阵
     */
    calculateHomography(srcPoints, dstPoints) {
        // 构建线性方程组 Ah = 0
        const A = [];
        
        for (let i = 0; i < 4; i++) {
            const [x, y] = srcPoints[i];
            const [u, v] = dstPoints[i];
            
            // 每个点对应两个方程
            A.push([x, y, 1, 0, 0, 0, -u*x, -u*y, -u]);
            A.push([0, 0, 0, x, y, 1, -v*x, -v*y, -v]);
        }
        
        // 使用SVD求解最小二乘解
        const h = this.solveLeastSquares(A);
        
        // 重新组织为3x3矩阵
        return [
            [h[0], h[1], h[2]],
            [h[3], h[4], h[5]],
            [h[6], h[7], h[8]]
        ];
    }

    /**
     * 简化的最小二乘求解（使用正规方程）
     * @param {Array} A - 系数矩阵
     * @returns {Array} 解向量
     */
    solveLeastSquares(A) {
        // 使用DLT (Direct Linear Transform) 方法
        // 这里使用简化的方法，对于4个点的情况
        
        // 构建8x9的矩阵
        const n = A.length; // 8
        const m = A[0].length; // 9
        
        // 计算A^T * A
        const AtA = this.multiplyMatrices(this.transpose(A), A);
        
        // 求解特征值最小的特征向量
        // 这里使用简化的方法：假设h8 = 1，求解前8个参数
        const B = [];
        const b = [];
        
        for (let i = 0; i < n; i++) {
            const row = A[i].slice(0, 8);
            B.push(row);
            b.push(-A[i][8]);
        }
        
        // 使用高斯消元法求解
        const solution = this.gaussianElimination(B, b);
        solution.push(1); // h8 = 1
        
        return solution;
    }

    /**
     * 矩阵转置
     */
    transpose(matrix) {
        const rows = matrix.length;
        const cols = matrix[0].length;
        const result = [];
        
        for (let j = 0; j < cols; j++) {
            result[j] = [];
            for (let i = 0; i < rows; i++) {
                result[j][i] = matrix[i][j];
            }
        }
        
        return result;
    }

    /**
     * 矩阵乘法
     */
    multiplyMatrices(A, B) {
        const rowsA = A.length;
        const colsA = A[0].length;
        const colsB = B[0].length;
        const result = [];
        
        for (let i = 0; i < rowsA; i++) {
            result[i] = [];
            for (let j = 0; j < colsB; j++) {
                let sum = 0;
                for (let k = 0; k < colsA; k++) {
                    sum += A[i][k] * B[k][j];
                }
                result[i][j] = sum;
            }
        }
        
        return result;
    }

    /**
     * 高斯消元法求解线性方程组
     */
    gaussianElimination(A, b) {
        const n = A.length;
        const augmented = [];
        
        // 构建增广矩阵
        for (let i = 0; i < n; i++) {
            augmented[i] = [...A[i], b[i]];
        }
        
        // 前向消元
        for (let i = 0; i < n; i++) {
            // 寻找主元
            let maxRow = i;
            for (let k = i + 1; k < n; k++) {
                if (Math.abs(augmented[k][i]) > Math.abs(augmented[maxRow][i])) {
                    maxRow = k;
                }
            }
            
            // 交换行
            [augmented[i], augmented[maxRow]] = [augmented[maxRow], augmented[i]];
            
            // 消元
            for (let k = i + 1; k < n; k++) {
                const factor = augmented[k][i] / augmented[i][i];
                for (let j = i; j < n + 1; j++) {
                    augmented[k][j] -= factor * augmented[i][j];
                }
            }
        }
        
        // 回代
        const x = new Array(n);
        for (let i = n - 1; i >= 0; i--) {
            x[i] = augmented[i][n];
            for (let j = i + 1; j < n; j++) {
                x[i] -= augmented[i][j] * x[j];
            }
            x[i] /= augmented[i][i];
        }
        
        return x;
    }

    /**
     * 应用单应性变换到点
     * @param {Array} point - [x, y]
     * @param {Array} H - 3x3单应性矩阵
     * @returns {Array} 变换后的点 [x', y']
     */
    transformPoint(point, H) {
        const [x, y] = point;
        const w = H[2][0] * x + H[2][1] * y + H[2][2];
        const newX = (H[0][0] * x + H[0][1] * y + H[0][2]) / w;
        const newY = (H[1][0] * x + H[1][1] * y + H[1][2]) / w;
        return [newX, newY];
    }

    /**
     * 执行图像嵌入
     * @param {HTMLImageElement} backgroundImg - 背景图像
     * @param {HTMLImageElement} overlayImg - 叠加图像
     * @param {Array} dstPoints - 目标区域的四个点
     * @returns {HTMLCanvasElement} 处理后的画布
     */
    embedImage(backgroundImg, overlayImg, dstPoints) {
        // 设置画布大小为背景图像大小
        this.canvas.width = backgroundImg.width;
        this.canvas.height = backgroundImg.height;
        
        // 绘制背景图像
        this.ctx.drawImage(backgroundImg, 0, 0);
        
        // 定义源图像的四个角点
        const srcPoints = [
            [0, 0],                                    // 左上
            [overlayImg.width, 0],                     // 右上
            [overlayImg.width, overlayImg.height],     // 右下
            [0, overlayImg.height]                     // 左下
        ];
        
        // 计算单应性矩阵
        const H = this.calculateHomography(srcPoints, dstPoints);
        
        // 应用透视变换
        this.applyPerspectiveTransform(overlayImg, H, dstPoints);
        
        return this.canvas;
    }

    /**
     * 图像矫正功能
     * @param {HTMLImageElement} sourceImg - 需要矫正的图像
     * @param {Array} srcPoints - 源图像中需要矫正的四个点（倾斜的四边形）
     * @returns {HTMLCanvasElement} 矫正后的画布
     */
    correctImage(sourceImg, srcPoints) {
        // 计算矫正后的矩形尺寸
        const correctedSize = this.calculateCorrectedSize(srcPoints);

        // 设置画布大小为矫正后的尺寸
        this.canvas.width = correctedSize.width;
        this.canvas.height = correctedSize.height;

        // 清空画布
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // 定义目标矩形的四个角点（标准矩形）
        const dstPoints = [
            [0, 0],                                    // 左上
            [correctedSize.width, 0],                  // 右上
            [correctedSize.width, correctedSize.height], // 右下
            [0, correctedSize.height]                  // 左下
        ];

        // 计算从倾斜四边形到标准矩形的单应性矩阵
        const H = this.calculateHomography(srcPoints, dstPoints);

        // 应用矫正变换
        this.applyCorrectionTransform(sourceImg, H, srcPoints, dstPoints);

        return this.canvas;
    }

    /**
     * 计算矫正后的矩形尺寸
     */
    calculateCorrectedSize(srcPoints) {
        // 计算四边形的边长
        const topWidth = this.distance(srcPoints[0], srcPoints[1]);
        const bottomWidth = this.distance(srcPoints[3], srcPoints[2]);
        const leftHeight = this.distance(srcPoints[0], srcPoints[3]);
        const rightHeight = this.distance(srcPoints[1], srcPoints[2]);

        // 使用平均值作为矫正后的尺寸
        const width = Math.round((topWidth + bottomWidth) / 2);
        const height = Math.round((leftHeight + rightHeight) / 2);

        return { width, height };
    }

    /**
     * 计算两点间距离
     */
    distance(p1, p2) {
        const dx = p2[0] - p1[0];
        const dy = p2[1] - p1[1];
        return Math.sqrt(dx * dx + dy * dy);
    }

    /**
     * 应用矫正变换
     */
    applyCorrectionTransform(sourceImg, H, srcPoints, dstPoints) {
        // 创建源图像的画布
        const sourceCanvas = document.createElement('canvas');
        const sourceCtx = sourceCanvas.getContext('2d');
        sourceCanvas.width = sourceImg.width;
        sourceCanvas.height = sourceImg.height;
        sourceCtx.drawImage(sourceImg, 0, 0);
        const sourceData = sourceCtx.getImageData(0, 0, sourceImg.width, sourceImg.height);

        // 计算逆变换矩阵（从目标矩形映射回源四边形）
        const HInv = this.invertMatrix3x3(H);

        // 创建输出图像数据
        const outputData = this.ctx.createImageData(this.canvas.width, this.canvas.height);

        // 对目标矩形的每个像素进行反向映射
        for (let y = 0; y < this.canvas.height; y++) {
            for (let x = 0; x < this.canvas.width; x++) {
                // 反向映射到源图像
                const [srcX, srcY] = this.transformPoint([x, y], HInv);

                // 双线性插值获取像素值
                const pixel = this.bilinearInterpolation(sourceData, srcX, srcY);
                if (pixel) {
                    const idx = (y * this.canvas.width + x) * 4;
                    outputData.data[idx] = pixel[0];     // R
                    outputData.data[idx + 1] = pixel[1]; // G
                    outputData.data[idx + 2] = pixel[2]; // B
                    outputData.data[idx + 3] = pixel[3]; // A
                } else {
                    // 如果超出边界，设置为白色
                    const idx = (y * this.canvas.width + x) * 4;
                    outputData.data[idx] = 255;     // R
                    outputData.data[idx + 1] = 255; // G
                    outputData.data[idx + 2] = 255; // B
                    outputData.data[idx + 3] = 255; // A
                }
            }
        }

        // 将处理后的图像数据绘制到画布
        this.ctx.putImageData(outputData, 0, 0);
    }

    /**
     * 应用透视变换
     */
    applyPerspectiveTransform(overlayImg, H, dstPoints) {
        // 创建临时画布用于变换
        const tempCanvas = document.createElement('canvas');
        const tempCtx = tempCanvas.getContext('2d');
        tempCanvas.width = this.canvas.width;
        tempCanvas.height = this.canvas.height;
        
        // 获取目标区域的边界框
        const minX = Math.min(...dstPoints.map(p => p[0]));
        const maxX = Math.max(...dstPoints.map(p => p[0]));
        const minY = Math.min(...dstPoints.map(p => p[1]));
        const maxY = Math.max(...dstPoints.map(p => p[1]));
        
        // 计算逆变换矩阵
        const HInv = this.invertMatrix3x3(H);
        
        // 对目标区域的每个像素进行反向映射
        const imageData = tempCtx.createImageData(this.canvas.width, this.canvas.height);
        const overlayCanvas = document.createElement('canvas');
        const overlayCtx = overlayCanvas.getContext('2d');
        overlayCanvas.width = overlayImg.width;
        overlayCanvas.height = overlayImg.height;
        overlayCtx.drawImage(overlayImg, 0, 0);
        const overlayData = overlayCtx.getImageData(0, 0, overlayImg.width, overlayImg.height);
        
        for (let y = Math.floor(minY); y <= Math.ceil(maxY); y++) {
            for (let x = Math.floor(minX); x <= Math.ceil(maxX); x++) {
                if (x >= 0 && x < this.canvas.width && y >= 0 && y < this.canvas.height) {
                    // 检查点是否在四边形内
                    if (this.isPointInQuadrilateral([x, y], dstPoints)) {
                        // 反向映射到源图像
                        const [srcX, srcY] = this.transformPoint([x, y], HInv);
                        
                        // 双线性插值获取像素值
                        const pixel = this.bilinearInterpolation(overlayData, srcX, srcY);
                        if (pixel) {
                            const idx = (y * this.canvas.width + x) * 4;
                            imageData.data[idx] = pixel[0];     // R
                            imageData.data[idx + 1] = pixel[1]; // G
                            imageData.data[idx + 2] = pixel[2]; // B
                            imageData.data[idx + 3] = pixel[3]; // A
                        }
                    }
                }
            }
        }
        
        tempCtx.putImageData(imageData, 0, 0);
        
        // 将变换后的图像合成到主画布
        this.ctx.globalCompositeOperation = 'source-over';
        this.ctx.drawImage(tempCanvas, 0, 0);
    }

    /**
     * 3x3矩阵求逆
     */
    invertMatrix3x3(matrix) {
        const [[a, b, c], [d, e, f], [g, h, i]] = matrix;

        const det = a*(e*i - f*h) - b*(d*i - f*g) + c*(d*h - e*g);

        if (Math.abs(det) < 1e-10) {
            throw new Error('Matrix is singular');
        }

        const invDet = 1 / det;

        return [
            [(e*i - f*h) * invDet, (c*h - b*i) * invDet, (b*f - c*e) * invDet],
            [(f*g - d*i) * invDet, (a*i - c*g) * invDet, (c*d - a*f) * invDet],
            [(d*h - e*g) * invDet, (b*g - a*h) * invDet, (a*e - b*d) * invDet]
        ];
    }

    /**
     * 检查点是否在四边形内（使用叉积方法）
     */
    isPointInQuadrilateral(point, quad) {
        const [x, y] = point;

        // 检查点是否在四边形的每条边的同一侧
        for (let i = 0; i < 4; i++) {
            const [x1, y1] = quad[i];
            const [x2, y2] = quad[(i + 1) % 4];

            // 计算叉积
            const cross = (x2 - x1) * (y - y1) - (y2 - y1) * (x - x1);

            // 如果叉积符号不一致，点在四边形外
            if (i === 0) {
                var sign = cross > 0;
            } else if ((cross > 0) !== sign) {
                return false;
            }
        }

        return true;
    }

    /**
     * 双线性插值
     */
    bilinearInterpolation(imageData, x, y) {
        const width = imageData.width;
        const height = imageData.height;

        if (x < 0 || x >= width || y < 0 || y >= height) {
            return null;
        }

        const x1 = Math.floor(x);
        const y1 = Math.floor(y);
        const x2 = Math.min(x1 + 1, width - 1);
        const y2 = Math.min(y1 + 1, height - 1);

        const dx = x - x1;
        const dy = y - y1;

        const getPixel = (px, py) => {
            const idx = (py * width + px) * 4;
            return [
                imageData.data[idx],
                imageData.data[idx + 1],
                imageData.data[idx + 2],
                imageData.data[idx + 3]
            ];
        };

        const p11 = getPixel(x1, y1);
        const p12 = getPixel(x1, y2);
        const p21 = getPixel(x2, y1);
        const p22 = getPixel(x2, y2);

        const result = [];
        for (let i = 0; i < 4; i++) {
            const val = p11[i] * (1 - dx) * (1 - dy) +
                       p21[i] * dx * (1 - dy) +
                       p12[i] * (1 - dx) * dy +
                       p22[i] * dx * dy;
            result[i] = Math.round(val);
        }

        return result;
    }
}

// 创建全局实例
window.homographyProcessor = new HomographyProcessor();
