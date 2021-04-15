const generateDummyImageData = (width, height) => {
    let data = []
    for (let i=0; i<width*height; i++) {
        for (let z=0; z<4; z++) {
            data.push(z === 3 ? 100 : i % 100)
        }
    }
    return { width: width, height: height, data: data }
}

const random = (min, max) => {
    return Math.floor(Math.random() * (max - min) + min)
}

const getIntensity = (imin, imax) => {
    const intensity = random(imin, imax)
    return intensity
}

const getPixel = (image, x, y) => {
    const idx = (y * image.width + x) * 4
    return { 
        r: image.data[idx], 
        g: image.data[idx+1], 
        b: image.data[idx+2], 
        a: image.data[idx+3] 
    }
}

const setPixel = (image, x, y, rgb) => {
    const idx = (y * image.width + x) * 4
    image.data[idx] = rgb.r
    image.data[idx+1] = rgb.g
    image.data[idx+2] = rgb.b
    image.data[idx+3] = rgb.a
}

const meltImageColumnDown = (config, image, colx) => {
    let intensity = 0
    let rgb = {}
    //let skipInterval = 0
    for (let row=0; row<image.height; row+=intensity+1) {
        //console.log(`row ${row}`)
        intensity = getIntensity(config.imin, config.imax)
        //console.log(`intensity: ${intensity}`)
        rgb = getPixel(image, colx, row)
        if (!config.criteria(rgb)) {
            //console.log('criteria not met! bailing')
            intensity = 1
            continue
        }
        for (let y=row+1; y<row+intensity&&y<image.height; y++) {
            setPixel(image, colx, y, rgb)
        }
        //skipInterval = Math.max(intensity+1, config.interval)
    }
}

const meltDown = (config, image) => {
    //meltImageColumnDown(config, image, 0)
    for (let x=0; x<image.width; x++) {
        meltImageColumnDown(config, image, x)
    }
    return image
}

const pixelmelter = {
    meltDown
}

const main = () => {
    const dummyImage = generateDummyImageData(1, 10)
    meltImageColumn(
        { 
            imin: 0, 
            imax: 5, 
            criteria: rgb => rgb.r % 2 !== 0 // this is definitely temporary
        }, 
        dummyImage, 
        0,
    )
    console.log(dummyImage)
}