// 图像矫正功能模块
class ImageCorrection {
    constructor() {
        this.currentMode = 'embed'; // 'embed' 或 'correct'
        this.correctImage = null;
        this.correctUploaded = false;
        
        this.initializeCorrection();
    }
    
    initializeCorrection() {
        this.setupModeToggle();
        this.setupCorrectionUpload();
        this.setupExampleImage();
    }
    
    setupModeToggle() {
        const embedModeBtn = document.getElementById('embed-mode-btn');
        const correctModeBtn = document.getElementById('correct-mode-btn');
        
        if (embedModeBtn && correctModeBtn) {
            embedModeBtn.addEventListener('click', () => this.switchMode('embed'));
            correctModeBtn.addEventListener('click', () => this.switchMode('correct'));
        }
    }
    
    switchMode(mode) {
        this.currentMode = mode;
        
        // 更新按钮状态
        const embedModeBtn = document.getElementById('embed-mode-btn');
        const correctModeBtn = document.getElementById('correct-mode-btn');
        
        if (mode === 'embed') {
            embedModeBtn.classList.add('active');
            correctModeBtn.classList.remove('active');
        } else {
            embedModeBtn.classList.remove('active');
            correctModeBtn.classList.add('active');
        }
        
        // 更新界面内容
        this.updateUI();
        
        // 重置状态
        this.resetState();

        // 触发模式切换事件
        window.dispatchEvent(new CustomEvent('modeChanged', { detail: { mode } }));
    }
    
    updateUI() {
        const mainTitle = document.getElementById('main-title');
        const mainDescription = document.getElementById('main-description');
        const step1Title = document.getElementById('step1-title');
        const step2Title = document.getElementById('step2-title');
        const step2Instruction = document.getElementById('step2-instruction');
        const processBtn = document.getElementById('process-btn');
        
        const embedModeContent = document.getElementById('embed-mode-content');
        const correctModeContent = document.getElementById('correct-mode-content');
        
        if (this.currentMode === 'embed') {
            // 图像嵌入模式
            mainTitle.textContent = '图像嵌入工具';
            mainDescription.textContent = '使用单应性矩阵将一幅图像嵌入到另一幅图像的指定区域';
            step1Title.textContent = '选择图像';
            step2Title.textContent = '选择嵌入区域';
            step2Instruction.textContent = '点击图片上的四个点来定义嵌入区域（按顺时针方向从左上角开始）';
            processBtn.textContent = '应用嵌入';
            
            embedModeContent.classList.remove('d-none');
            correctModeContent.classList.add('d-none');
        } else {
            // 图像矫正模式
            mainTitle.textContent = '图像矫正工具';
            mainDescription.textContent = '使用单应性矩阵矫正倾斜或变形的文档图像';
            step1Title.textContent = '选择图像';
            step2Title.textContent = '选择矫正区域';
            step2Instruction.textContent = '点击图片上的四个点来定义需要矫正的区域（按顺时针方向从左上角开始）';
            processBtn.textContent = '应用矫正';
            
            embedModeContent.classList.add('d-none');
            correctModeContent.classList.remove('d-none');
        }
    }
    
    setupCorrectionUpload() {
        const correctInput = document.getElementById('correct-image');
        const correctUploadArea = document.getElementById('correct-upload-area');
        const correctPreview = document.getElementById('correct-preview');
        
        if (correctInput && correctUploadArea) {
            // 文件选择事件
            correctInput.addEventListener('change', (e) => {
                if (e.target.files.length > 0) {
                    this.handleCorrectionFile(e.target.files[0]);
                }
            });
            
            // 点击上传区域
            correctUploadArea.addEventListener('click', () => {
                correctInput.click();
            });
            
            // 拖拽上传
            this.setupDragAndDrop(correctUploadArea, (file) => {
                this.handleCorrectionFile(file);
            });
        }
    }
    
    setupExampleImage() {
        const exampleArea = document.getElementById('example-area');
        if (exampleArea) {
            exampleArea.addEventListener('click', () => {
                this.useExampleImage();
            });
        }
    }
    
    setupDragAndDrop(area, callback) {
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
                callback(files[0]);
            }
        });
    }
    
    handleCorrectionFile(file) {
        if (!file.type.startsWith('image/')) {
            alert('请选择图像文件');
            return;
        }
        
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                this.correctImage = img;
                this.correctUploaded = true;
                this.showCorrectionPreview(e.target.result);
                this.updateNextButton();
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }
    
    useExampleImage() {
        const img = new Image();
        img.onload = () => {
            this.correctImage = img;
            this.correctUploaded = true;
            this.showCorrectionPreview('IDcard.jpg');
            this.updateNextButton();
        };
        img.src = 'IDcard.jpg';
    }
    
    showCorrectionPreview(src) {
        const correctPreview = document.getElementById('correct-preview');
        const correctUploadArea = document.getElementById('correct-upload-area');
        
        if (correctPreview && correctUploadArea) {
            correctPreview.src = src;
            correctPreview.classList.remove('d-none');
            correctUploadArea.classList.add('has-image');
        }
    }
    
    updateNextButton() {
        const nextStepBtn = document.getElementById('next-step-btn');
        if (nextStepBtn) {
            if (this.currentMode === 'embed') {
                // 图像嵌入模式需要两张图片
                const backgroundUploaded = window.backgroundUploaded || false;
                const overlayUploaded = window.overlayUploaded || false;
                nextStepBtn.disabled = !(backgroundUploaded && overlayUploaded);
            } else {
                // 图像矫正模式只需要一张图片
                nextStepBtn.disabled = !this.correctUploaded;
            }
        }
    }
    
    resetState() {
        // 重置上传状态
        this.correctUploaded = false;
        this.correctImage = null;

        // 重置预览
        const correctPreview = document.getElementById('correct-preview');
        const correctUploadArea = document.getElementById('correct-upload-area');
        const backgroundPreview = document.getElementById('background-preview');
        const overlayPreview = document.getElementById('overlay-preview');
        const backgroundUploadArea = document.getElementById('background-upload-area');
        const overlayUploadArea = document.getElementById('overlay-upload-area');

        if (correctPreview && correctUploadArea) {
            correctPreview.classList.add('d-none');
            correctUploadArea.classList.remove('has-image');
        }

        // 重置图像嵌入模式的预览
        if (backgroundPreview && backgroundUploadArea) {
            backgroundPreview.classList.add('d-none');
            backgroundUploadArea.classList.remove('has-image');
        }

        if (overlayPreview && overlayUploadArea) {
            overlayPreview.classList.add('d-none');
            overlayUploadArea.classList.remove('has-image');
        }

        // 重置全局状态
        window.backgroundUploaded = false;
        window.overlayUploaded = false;

        // 重置步骤
        this.goToStep1();

        // 更新按钮状态
        this.updateNextButton();
    }
    
    goToStep1() {
        const step1 = document.getElementById('step-1');
        const step2 = document.getElementById('step-2');
        const step3 = document.getElementById('step-3');
        
        if (step1 && step2 && step3) {
            step1.classList.remove('d-none');
            step2.classList.add('d-none');
            step3.classList.add('d-none');
        }
    }
    
    // 获取当前模式
    getCurrentMode() {
        return this.currentMode;
    }
    
    // 获取矫正图像
    getCorrectionImage() {
        return this.correctImage;
    }
    
    // 检查矫正图像是否已上传
    isCorrectionImageUploaded() {
        return this.correctUploaded;
    }
}

// 创建全局实例
window.imageCorrection = new ImageCorrection();
