function Control(el, {
    value = 0,
    min = 0,
    max = 100,
    minAngle = 0,
    maxAngle = 360,
    wheelSpeed = 0.05,
    step = 0.1
} = {}) {

    const img = document.createElement('img')
    img.src = '1@3x.png'
    el.append(img)

    const ratio = (maxAngle - minAngle) / (max - min)
    const getAngle = () => (value - min) * ratio + minAngle

    this.setValue = newValue => {
        if (newValue > max)
            newValue = max
        if (newValue < min)
            newValue = min

        if (typeof this.onchange === 'function' && newValue !== value)
            this.onchange(newValue)

        value = newValue

        img.style.transform = `rotate(${getAngle()}deg)`
    }

    img.onmousewheel = (event) => {
        const {
            deltaY
        } = event
        this.setValue(value + deltaY * wheelSpeed)
        event.preventDefault()
    }

    img.onclick = (event) => {
        const {
            layerX
        } = event
        if (layerX < img.width / 2)
            this.setValue(value - step)
        else
            this.setValue(value + step)
        event.preventDefault()
    }

    const event2Deg = event => {
        const {
            layerX,
            layerY
        } = event
        const {
            width,
            height
        } = img
        const x = layerX - width / 2
        const y = height / 2 - layerY

        return ((Math.atan2(y, x) / (2 * Math.PI)) * 360 + 360) % 360
    }

    let prevAngle = null

    img.onmousedown = (event) => {
        prevAngle = event2Deg(event)
    }

    img.onmousemove = (event) => {
        if (prevAngle === null) return 

        const currentAngle = event2Deg(event)
        const deltaValue = (prevAngle - currentAngle) / ratio
        this.setValue(value + deltaValue)
        prevAngle = currentAngle
        event.preventDefault()
    }

    img.onmouseup = (event) => {
        prevAngle = null
    }


    this.setValue(value)
    this.getValue = () => value
}

const audio = document.querySelector('audio');

const red = new Control(root, {
    min: 0,
    max: 255
})

const green = new Control(root, {
    min: 0,
    max: 255
})

const blue = new Control(root, {
    min: 0,
    max: 255
})

blue.onchange = setRGB;
green.onchange = setRGB;
red.onchange = setRGB;


function setRGB() {
    document.body.style.backgroundColor = `rgb(${red.getValue()},${green.getValue()},${blue.getValue()})`  
}




const volumeAdjust = new Control(volume, {
    min: 0,
    max: 1,
    wheelSpeed: 0.0005,
    step: 0.01
    
})

volumeAdjust.onchange = setVolume;
console.log(audio.volume);
function setVolume() { 
    console.log(volumeAdjust.getValue(), audio.volume)
    audio.volume = `${volumeAdjust.getValue()}`
}
   