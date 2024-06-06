const backgroundCanvas = document.getElementById('backgroundCanvas');
const drawingCanvas = document.getElementById('drawingCanvas');
const backgroundCtx = backgroundCanvas.getContext('2d');
const drawingCtx = drawingCanvas.getContext('2d');
let painting = false;

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
    painting = true;
    draw(e);
}

function endPosition() {
    painting = false;
    drawingCtx.beginPath();
}

function draw(e) {
    if (!painting) return;

    e.preventDefault();

    let x, y;
    if (e.touches) {
        x = e.touches[0].clientX - drawingCanvas.offsetLeft;
        y = e.touches[0].clientY - drawingCanvas.offsetTop;
    } else {
        x = e.clientX - drawingCanvas.offsetLeft;
        y = e.clientY - drawingCanvas.offsetTop;
    }

    drawingCtx.lineWidth = 5;
    drawingCtx.lineCap = 'round';
    drawingCtx.strokeStyle = 'black';

    drawingCtx.lineTo(x, y);
    drawingCtx.stroke();
    drawingCtx.beginPath();
    drawingCtx.moveTo(x, y);
}

function loadImage(url) {
    const img = new Image();
    img.onload = () => {
        backgroundCanvas.width = img.width;
        backgroundCanvas.height = img.height;
        drawingCanvas.width = img.width;
        drawingCanvas.height = img.height;
        backgroundCtx.drawImage(img, 0, 0, backgroundCanvas.width, backgroundCanvas.height);
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

// 在頁面載入完成後載入預設的底圖
window.onload = () => {
    loadImage(defaultImageURL);
}
