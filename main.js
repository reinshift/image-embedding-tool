document.addEventListener('DOMContentLoaded', function() {
    // DOM 元素
    const backgroundInput = document.getElementById('background-image');
    const overlayInput = document.getElementById('overlay-image');
    const backgroundUploadArea = document.getElementById('background-upload-area');
    const overlayUploadArea = document.getElementById('overlay-upload-area');
    const backgroundPreview = document.getElementById('background-preview');
    const overlayPreview = document.getElementById('overlay-preview');
    const nextStepBtn = document.getElementById('next-step-btn');
    
    const step1 = document.getElementById('step-1');
    const step2 = document.getElementById('step-2');
    const step3 = document.getElementById('step-3');
    const backToStep1 = document.getElementById('back-to-step1');
    const backToStep2 = document.getElementById('back-to-step2');
    
    const selectionImage = document.getElementById('selection-image');
    const selectionCanvas = document.getElementById('selection-canvas');
    const pointsCount = document.getElementById('points-count');
    const clearPointsBtn = document.getElementById('clear-points');
    const processBtn = document.getElementById('process-btn');
    
    // 缩放控制元素
    const zoomInBtn = document.getElementById('zoom-in');
    const zoomOutBtn = document.getElementById('zoom-out');
    const zoomResetBtn = document.getElementById('zoom-reset');
    const zoomLevelEl = document.getElementById('zoom-level');
    
    const resultContainer = document.getElementById('result-container');
    const resultImage = document.getElementById('result-image');
    const downloadBtn = document.getElementById('download-btn');
    const loadingOverlay = document.getElementById('loading-overlay');
    
    // 状态变量
    let backgroundImg = null;
    let overlayImg = null;
    let points = [];
    let canvasContext = null;
    let backgroundUploaded = false;
    let overlayUploaded = false;

    // 将状态变量暴露给全局，以便correction.js访问
    window.backgroundUploaded = backgroundUploaded;
    window.overlayUploaded = overlayUploaded;
    
    // 图像缩放状态
    let currentZoom = 1;
    let minZoom = 0.5;
    let maxZoom = 3;
    let zoomStep = 0.1;
    
    // 初始化
    init();

    function init() {
        setupEventListeners();
        setupCanvas();

        // 监听模式切换事件
        window.addEventListener('modeChanged', handleModeChange);
    }

    function handleModeChange() {
        // 重置本地状态变量
        backgroundImg = null;
        overlayImg = null;
        points = [];
        backgroundUploaded = false;
        overlayUploaded = false;

        // 更新全局状态
        window.backgroundUploaded = false;
        window.overlayUploaded = false;

        // 重置文件输入
        if (backgroundInput) backgroundInput.value = '';
        if (overlayInput) overlayInput.value = '';

        // 更新按钮状态
        updateNextButton();
    }
    
    function setupEventListeners() {
        // 文件输入事件
        backgroundInput.addEventListener('change', (e) => handleFileSelect(e, 'background'));
        overlayInput.addEventListener('change', (e) => handleFileSelect(e, 'overlay'));
        
        // 拖拽上传
        setupDragAndDrop(backgroundUploadArea, backgroundInput, 'background');
        setupDragAndDrop(overlayUploadArea, overlayInput, 'overlay');
        
        // 导航按钮
        nextStepBtn.addEventListener('click', goToStep2);
        backToStep1.addEventListener('click', goToStep1);
        backToStep2.addEventListener('click', goToStep2);
        
        // 点选择
        selectionImage.addEventListener('click', handleImageClick);
        clearPointsBtn.addEventListener('click', clearPoints);
        
        // 缩放控制
        zoomInBtn.addEventListener('click', () => adjustZoom(zoomStep));
        zoomOutBtn.addEventListener('click', () => adjustZoom(-zoomStep));
        zoomResetBtn.addEventListener('click', resetZoom);
        
        // 处理按钮
        processBtn.addEventListener('click', processImages);
    }
    
    function setupDragAndDrop(area, input, type) {
        area.addEventListener('dragover', (e) => {
            e.preventDefault();
            area.classList.add('dragover');
        });
        
        area.addEventListener('dragleave', () => {
            area.classList.remove('dragover');
        });
        
        area.addEventListener('drop', (e) => {
            e.preventDefault();
            area.classList.remove('dragover');
            
            const files = e.dataTransfer.files;
            if (files.length > 0) {
                handleFile(files[0], type);
            }
        });
        
        area.addEventListener('click', () => {
            input.click();
        });
    }
    
    function handleFileSelect(event, type) {
        const file = event.target.files[0];
        if (file) {
            handleFile(file, type);
        }
    }
    
    function handleFile(file, type) {
        if (!file.type.startsWith('image/')) {
            alert('请选择图像文件');
            return;
        }
        
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                if (type === 'background') {
                    backgroundImg = img;
                    backgroundPreview.src = e.target.result;
                    backgroundPreview.classList.remove('d-none');
                    backgroundUploadArea.classList.add('has-image');
                    backgroundUploaded = true;
                    window.backgroundUploaded = true; // 更新全局状态
                } else {
                    overlayImg = img;
                    overlayPreview.src = e.target.result;
                    overlayPreview.classList.remove('d-none');
                    overlayUploadArea.classList.add('has-image');
                    overlayUploaded = true;
                    window.overlayUploaded = true; // 更新全局状态
                }

                updateNextButton();
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }
    
    function updateNextButton() {
        // 检查当前模式
        const currentMode = window.imageCorrection ? window.imageCorrection.getCurrentMode() : 'embed';

        if (currentMode === 'embed') {
            nextStepBtn.disabled = !(backgroundUploaded && overlayUploaded);
        } else {
            // 图像矫正模式
            const correctionUploaded = window.imageCorrection ? window.imageCorrection.isCorrectionImageUploaded() : false;
            nextStepBtn.disabled = !correctionUploaded;
        }
    }
    
    function goToStep1() {
        step1.classList.remove('d-none');
        step2.classList.add('d-none');
        step3.classList.add('d-none');
    }
    
    function goToStep2() {
        const currentMode = window.imageCorrection ? window.imageCorrection.getCurrentMode() : 'embed';

        if (currentMode === 'embed') {
            if (!backgroundUploaded || !overlayUploaded) {
                alert('请先上传两张图片');
                return;
            }
            // 设置选择图像为背景图像
            selectionImage.src = backgroundImg.src;
        } else {
            // 图像矫正模式
            const correctionUploaded = window.imageCorrection ? window.imageCorrection.isCorrectionImageUploaded() : false;
            if (!correctionUploaded) {
                alert('请先上传需要矫正的图片');
                return;
            }
            // 设置选择图像为待矫正图像
            const correctionImage = window.imageCorrection.getCorrectionImage();
            selectionImage.src = correctionImage.src;
        }

        step1.classList.add('d-none');
        step2.classList.remove('d-none');
        step3.classList.add('d-none');

        selectionImage.onload = () => {
            setupCanvas();
            resetZoom();
        };

        // 重置点选择
        clearPoints();
    }
    
    function goToStep3() {
        step1.classList.add('d-none');
        step2.classList.add('d-none');
        step3.classList.remove('d-none');
    }
    
    function setupCanvas() {
        if (!selectionImage.complete) return;
        
        const rect = selectionImage.getBoundingClientRect();
        selectionCanvas.width = selectionImage.naturalWidth;
        selectionCanvas.height = selectionImage.naturalHeight;
        selectionCanvas.style.width = selectionImage.offsetWidth + 'px';
        selectionCanvas.style.height = selectionImage.offsetHeight + 'px';
        
        canvasContext = selectionCanvas.getContext('2d');
        drawPoints();
    }
    
    function handleImageClick(event) {
        if (points.length >= 4) return;

        const rect = selectionImage.getBoundingClientRect();

        // 计算基础缩放比例（图像自然尺寸与显示尺寸的比例）
        const baseScaleX = selectionImage.naturalWidth / selectionImage.offsetWidth;
        const baseScaleY = selectionImage.naturalHeight / selectionImage.offsetHeight;

        // 考虑用户缩放因子，计算鼠标点击位置相对于未缩放图像的坐标
        const clickX = (event.clientX - rect.left) / currentZoom;
        const clickY = (event.clientY - rect.top) / currentZoom;

        // 转换为图像的实际像素坐标
        const x = clickX * baseScaleX;
        const y = clickY * baseScaleY;

        points.push([x, y]);
        updatePointsDisplay();
        drawPoints();

        if (points.length === 4) {
            processBtn.disabled = false;
        }
    }
    
    function clearPoints() {
        points = [];
        updatePointsDisplay();
        drawPoints();
        processBtn.disabled = true;
    }
    
    function updatePointsDisplay() {
        pointsCount.textContent = points.length;
    }
    
    function drawPoints() {
        if (!canvasContext) return;
        
        canvasContext.clearRect(0, 0, selectionCanvas.width, selectionCanvas.height);
        
        // 绘制点
        points.forEach((point, index) => {
            const [x, y] = point;
            
            // 绘制点
            canvasContext.fillStyle = '#24d37a';
            canvasContext.beginPath();
            canvasContext.arc(x, y, 8, 0, 2 * Math.PI);
            canvasContext.fill();
            
            // 绘制点的编号
            canvasContext.fillStyle = 'white';
            canvasContext.font = 'bold 12px Arial';
            canvasContext.textAlign = 'center';
            canvasContext.fillText(index + 1, x, y + 4);
        });
        
        // 如果有4个点，绘制连线
        if (points.length === 4) {
            canvasContext.strokeStyle = '#24d37a';
            canvasContext.lineWidth = 2;
            canvasContext.beginPath();
            
            for (let i = 0; i < 4; i++) {
                const [x, y] = points[i];
                if (i === 0) {
                    canvasContext.moveTo(x, y);
                } else {
                    canvasContext.lineTo(x, y);
                }
            }
            canvasContext.closePath();
            canvasContext.stroke();
        }
    }
    
    function adjustZoom(delta) {
        const newZoom = Math.max(minZoom, Math.min(maxZoom, currentZoom + delta));
        if (newZoom !== currentZoom) {
            currentZoom = newZoom;
            applyZoom();
        }
    }
    
    function resetZoom() {
        currentZoom = 1;
        applyZoom();
    }
    
    function applyZoom() {
        const container = selectionImage.parentElement;
        selectionImage.style.transform = `scale(${currentZoom})`;
        selectionCanvas.style.transform = `scale(${currentZoom})`;
        zoomLevelEl.textContent = Math.round(currentZoom * 100) + '%';
    }
    
    async function processImages() {
        if (points.length !== 4) {
            alert('请选择4个点');
            return;
        }

        showLoading(true);

        try {
            const currentMode = window.imageCorrection ? window.imageCorrection.getCurrentMode() : 'embed';
            let resultCanvas;

            if (currentMode === 'embed') {
                // 图像嵌入模式
                resultCanvas = window.homographyProcessor.embedImage(
                    backgroundImg,
                    overlayImg,
                    points
                );
            } else {
                // 图像矫正模式
                const correctionImage = window.imageCorrection.getCorrectionImage();
                resultCanvas = window.homographyProcessor.correctImage(
                    correctionImage,
                    points
                );
            }

            // 显示结果
            resultImage.src = resultCanvas.toDataURL('image/jpeg', 0.9);
            downloadBtn.href = resultCanvas.toDataURL('image/jpeg', 0.9);

            // 更新下载文件名
            const fileName = currentMode === 'embed' ? 'image_embed_result.jpg' : 'image_correction_result.jpg';
            downloadBtn.download = fileName;

            goToStep3();
        } catch (error) {
            console.error('处理图像时出错:', error);
            alert('处理图像时出错: ' + error.message);
        } finally {
            showLoading(false);
        }
    }
    
    function showLoading(show) {
        if (show) {
            loadingOverlay.classList.remove('d-none');
        } else {
            loadingOverlay.classList.add('d-none');
        }
    }
});
