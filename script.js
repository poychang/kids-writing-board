const backgroundCanvas = document.getElementById('backgroundCanvas');
const drawingCanvas = document.getElementById('drawingCanvas');
const backgroundCtx = backgroundCanvas.getContext('2d');
const drawingCtx = drawingCanvas.getContext('2d');
let painting = false;
let offsetX, offsetY;

function updateCanvasOffsets() {
    const rect = drawingCanvas.getBoundingClientRect();
    offsetX = rect.left;
    offsetY = rect.top;
}

drawingCanvas.addEventListener('mousedown', startPosition);
drawingCanvas.addEventListener('mouseup', endPosition);
drawingCanvas.addEventListener('mousemove', draw);
drawingCanvas.addEventListener('touchstart', startPosition, false);
drawingCanvas.addEventListener('touchend', endPosition, false);
drawingCanvas.addEventListener('touchmove', draw, false);

const upload = document.getElementById('upload');
const loadImageButton = document.getElementById('loadImage');
const clearCanvasButton = document.getElementById('clearCanvas');

// 預設底圖的URL
const defaultImageURL = 'default-image.png';

function startPosition(e) {
    if (e.type === 'touchstart' && (e.touches.length > 1 || e.touches[0].force === 0)) {
        // 如果是多點觸控或是 Apple Pencil 未接觸時的信號，不處理
        return;
    }
    painting = true;
    updateCanvasOffsets();
    draw(e);
}

function endPosition(e) {
    if (e.type === 'touchend' && e.touches.length > 0) {
        // 如果還有其他觸點，不結束繪畫
        return;
    }
    painting = false;
    drawingCtx.beginPath();
}

function draw(e) {
    if (!painting) return;
    e.preventDefault();

    let x, y;
    if (e.type === 'touchmove') {
        if (e.touches.length > 1 || e.touches[0].force === 0) {
            // 如果是多點觸控或是 Apple Pencil 未接觸時的信號，不處理
            return;
        }
        x = e.touches[0].clientX - offsetX;
        y = e.touches[0].clientY - offsetY;
    } else {
        x = e.clientX - offsetX;
        y = e.clientY - offsetY;
    }

    drawingCtx.lineWidth = 5;
    drawingCtx.lineCap = 'round';

    drawingCtx.lineTo(x, y);
    drawingCtx.stroke();
    drawingCtx.beginPath();
    drawingCtx.moveTo(x, y);
}

function loadImage(url) {
    const img = new Image();
    img.onload = () => {
        const maxWidth = window.innerWidth * 0.8; // 讓圖框寬度最多佔視窗的80%
        const maxHeight = window.innerHeight * 0.8; // 讓圖框高度最多佔視窗的80%
        let width = img.width;
        let height = img.height;

        if (width > maxWidth || height > maxHeight) {
            const widthRatio = maxWidth / width;
            const heightRatio = maxHeight / height;
            const ratio = Math.min(widthRatio, heightRatio);
            width = width * ratio;
            height = height * ratio;
        }

        backgroundCanvas.width = width;
        backgroundCanvas.height = height;
        drawingCanvas.width = width;
        drawingCanvas.height = height;
        backgroundCtx.drawImage(img, 0, 0, width, height);
        updateCanvasOffsets();
    }
    img.src = url;
}

loadImageButton.addEventListener('click', () => {
    const file = upload.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            loadImage(e.target.result);
        }
        reader.readAsDataURL(file);
    }
});

clearCanvasButton.addEventListener('click', () => {
    drawingCtx.clearRect(0, 0, drawingCanvas.width, drawingCanvas.height);
});

// 改變筆跡顏色的按鈕事件
document.getElementById('black').addEventListener('click', () => {
    drawingCtx.strokeStyle = 'black';
    console.log('black');
});

document.getElementById('blue').addEventListener('click', () => {
    drawingCtx.strokeStyle = 'blue';
    console.log('blue');
});

document.getElementById('red').addEventListener('click', () => {
    drawingCtx.strokeStyle = 'red';
    console.log('red');
});

// 在頁面載入完成後載入預設的底圖
window.onload = () => {
    loadImage(defaultImageURL);
}
