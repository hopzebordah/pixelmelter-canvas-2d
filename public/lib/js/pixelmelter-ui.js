const CANVAS_DEFAULT_HEIGHT = 700

const openFileButton = document.getElementById("open-file-button")
const fileInput = document.getElementById("file-input")
const outcanvas = document.getElementById("incanvas")
const clearButton = document.getElementById("clear-button")
const resetButton = document.getElementById("reset-button")
const sortButton = document.getElementById("sort-button")
const intensityInputMin = document.getElementById("intensity-input-min")
const intensityInputMax = document.getElementById("intensity-input-max")
const hueInputMin = document.getElementById("hue-input-min")
const hueInputMax = document.getElementById("hue-input-max")
const saturationInputMin = document.getElementById("saturation-input-min")
const saturationInputMax = document.getElementById("saturation-input-max")
const valueInputMin = document.getElementById("value-input-min")
const valueInputMax = document.getElementById("value-input-max")

let imageSelected = false
let prevSelectedImage = null

const resetCanvasToPrevImage = canvas => {
    if (imageSelected) {
        copyToCanvas(canvas, prevSelectedImage)
    }
}

const copyToCanvas = (canvas, img) => {
    clearCanvas(canvas)
    const wrh = img.width / img.height
    let newWidth = canvas.width
    let newHeight = newWidth / wrh
    if (newHeight > canvas.height) {
        newHeight = canvas.height
        newWidth = newHeight * wrh
    }
    canvas.width = newWidth
    canvas.getContext("2d").drawImage(img, 0, 0, newWidth, newHeight)
    imageSelected = true
    prevSelectedImage = img
}

const loadImageFromFile = event => {
    let url = URL.createObjectURL(event.target.files[0])
    const img = new Image();
    img.onload = () => copyToCanvas(outcanvas, img)
    img.src = url
}

const getContext = canvas => canvas.getContext("2d")
const setCanvasToMaxWidth = canvas => canvas.width = canvas.parentNode.clientWidth - 32
const clearCanvas = (canvas) => {
    setCanvasToMaxWidth(canvas)
    canvas.height = window.innerHeight - (.3 * window.innerHeight)
    //canvas.height = CANVAS_DEFAULT_HEIGHT
    getContext(canvas).clearRect(0, 0, canvas.width, canvas.height)
    imageSelected = false
}
const drawHelpTextOnCanvas = (canvas) => {
    const ctx = getContext(canvas)
    ctx.font = "15px sans-serif"
    ctx.fillText("choose an image file to get started...", 15, canvas.height-15)
}
const resetCanvas = (canvas) => {
    clearCanvas(canvas)
    drawHelpTextOnCanvas(canvas)
}

const drawImageDataToCanvas = (canvas, imageData) => {
    const ctx = getContext(canvas)
    ctx.putImageData(imageData, 0, 0)
}
const sortCanvasImage = (canvas) => {
    if (!imageSelected) return
    const ctx = getContext(canvas)
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
    let newImageData = pixelmelter.meltDown(
        { 
            imin: intensityInputMin.value || 0, imax: intensityInputMax.value || canvas.height/10,
            criteria: rgb => {
                const { h, s, v } = rgb2hsv(rgb.r, rgb.g, rgb.b)
                const hCrit = h > (hueInputMin.value || 0) && h < (hueInputMax.value || 100) 
                const sCrit = s > (saturationInputMin.value || 0) && s < (saturationInputMax.value || 100)
                const vCrit = v > (valueInputMin.value || 0) && v < (valueInputMax.value || 100) 
                return hCrit && sCrit && vCrit
            },
        },
        imageData,
    )
    drawImageDataToCanvas(canvas, newImageData)
}

function rgb2hsv(r,g,b) {
    let v=Math.max(r,g,b), c=v-Math.min(r,g,b)
    let h= c && ((v==r) ? (g-b)/c : ((v==g) ? 2+(b-r)/c : 4+(r-g)/c))
    return { h: Math.floor((60*(h<0?h+6:h))/360*100), s: Math.floor((v&&c/v) * 100), v: Math.floor((v/255)*100) }
}

const mounted = () => resetCanvas(outcanvas)

openFileButton.onclick = () => fileInput.click()
fileInput.onchange = loadImageFromFile
clearButton.onclick = () => resetCanvas(outcanvas)
resetButton.onclick = () => resetCanvasToPrevImage(outcanvas)
sortButton.onclick = () => sortCanvasImage(outcanvas)

window.addEventListener("DOMContentLoaded", () => {
    mounted()
})