'use strict'; 

const imgDrop = document.querySelector('.image'),
    typeDrop = document.querySelector('.type'),
    colorChanger = document.querySelector('input[type=\'color\']'),
    darkToggle = document.querySelector('input.darkMode'),

    card = {
    "background": document.querySelector('#card-container'),
    "title": document.querySelector('#card-container .title'),
    "description": document.querySelector('.description'),
    "rarity": document.querySelector('#rarity')
    },
    
    inputs = {
        "bg": document.querySelector('#bgUpload'),
        "type": document.querySelector('#typeUpload'),
        "squish": document.querySelector('#squish'),
        "align": document.querySelector('#align'),
        "alignNumerical": document.querySelector('#alignNumerical'),
        'font': document.querySelector('#font'),
        'satNumerical': document.querySelector('#satNumerical'),
        'saturate': document.querySelector('#saturate')
    };

const rgb = {};

[
    ['r', 'rgbR'],
    ['g', 'rgbG'],
    ['b', 'rgbB']
].forEach(item => {
    rgb[item[0]] = document.querySelector('#' + item[1]);
    rgb[item[0]].setAttribute('data-rgb', item[0]);
});

// https://stackoverflow.com/a/64929732/
const getBase64FromUrl = async (url) => {
    const data = await fetch(url);
    const blob = await data.blob();
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(blob); 
        reader.onloadend = () => {
            const base64data = reader.result;   
            resolve(base64data);
        }
    });
}

function setRGB() {
    card.title.style.backgroundColor = colorChanger.value;
    let rgb = card.title.style.backgroundColor;

    // split value to RGB
    rgb = rgb.substr(4).split(")")[0].split(",");

    let hsl = RGBToHSL(rgb);

    hsl.s *= (inputs.saturate.value / 100)

    if (darkToggle.checked)
        hsl.l += 5;
    else
        hsl.l -= 5;
    
    for (let r in rgb) {
        rgb[r] -= 40;
    }

    card.background.style.backgroundColor = 'hsl(' + hsl.h + ',' + hsl.s +'%,' + hsl.l + '%)';
    card.title.style.borderColor = 'rgba(' + (rgb[0]).toString() + ',' + (rgb[1]).toString() + ',' + (rgb[2]).toString() + ',0.8)'
}

function reAlignImage() {
    if (document.querySelector('#axis').value == 'Y')
        imgDrop.style.backgroundPosition = '50% ' + inputs.align.value + '%';
    else
        imgDrop.style.backgroundPosition = inputs.align.value + '% 50%';
}

// helper funcs

// https://css-tricks.com/converting-color-spaces-in-javascript/
function RGBToHSL(rgb) {
    // Make r, g, and b fractions of 1
    let r = rgb[0] / 255;
    let g = rgb[1] / 255;
    let b = rgb[2] / 255;
  
    // Find greatest and smallest channel values
    let cmin = Math.min(r,g,b),
        cmax = Math.max(r,g,b),
        delta = cmax - cmin,
        h = 0,
        s = 0,
        l = 0;
    // Calculate hue
    // No difference
    if (delta == 0)
        h = 0;
    // Red is max
    else if (cmax == r)
        h = ((g - b) / delta) % 6;
    // Green is max
    else if (cmax == g)
        h = (b - r) / delta + 2;
    // Blue is max
    else
        h = (r - g) / delta + 4;

    h = Math.round(h * 60);
    
    // Make negative hues positive behind 360°
    if (h < 0)
        h += 360;
    // Calculate lightness
    l = (cmax + cmin) / 2;

    // Calculate saturation
    s = delta == 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));
        
    // Multiply l and s by 100
    s = +(s * 100).toFixed(1);
    l = +(l * 100).toFixed(1);

    return {"h":h, "s":s, "l":l};
}

function hexToRGB(h) {
    let r = 0, g = 0, b = 0;
  
    // 3 digits
    if (h.length == 4) {
        r = "0x" + h[1] + h[1];
        g = "0x" + h[2] + h[2];
        b = "0x" + h[3] + h[3];
  
    // 6 digits
    } else if (h.length == 7) {
        r = "0x" + h[1] + h[2];
        g = "0x" + h[3] + h[4];
        b = "0x" + h[5] + h[6];
    }
    
    return {"r": parseInt(r), "g": parseInt(g), "b": parseInt(b)};
}

function RGBToHex(color) {
    let r = color.r.toString(16);
    let g = color.g.toString(16);
    let b = color.b.toString(16);
  
    if (r.length == 1)
        r = "0" + r;
    if (g.length == 1)
        g = "0" + g;
    if (b.length == 1)
        b = "0" + b;
  
    return "#" + r + g + b;
}

// filedrop stuff

// stole this from smashingmagazine and made it look not like shit because
// god they have some weird code style

['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
    [imgDrop, typeDrop].forEach(element => {
        element.addEventListener(eventName, preventDefaults);
    });
});

function preventDefaults (e) {
    e.preventDefault()
    e.stopPropagation()
}

// technically we only need dragenter because we dont have any children but we'll
// do this just in case
['dragenter', 'dragover'].forEach(eventName => {
    [imgDrop, typeDrop].forEach(element => {
        element.addEventListener(eventName, () => { element.classList.add('highlight'); } );
    });
});

['dragleave', 'drop'].forEach(eventName => {
    [imgDrop, typeDrop].forEach(element => {
        element.addEventListener(eventName, () => { element.classList.remove('highlight'); } );
    });
});

for (let img of document.querySelector('.icon_gallery').querySelectorAll('img')) {
    img.addEventListener('click', () => {
        setImages(img.src, typeDrop);
        if (img.alt) {
            document.querySelector('.typetitle').textContent = img.alt.toUpperCase();
        }
    });
}

function resizeImageFromUrl(url, callback) {
    var img = document.createElement("img");
        
    img.onload = (e) => {
        var canvas = document.createElement("canvas");
    
        var height = img.height;
        var width = img.width;

        var max_width = 420
        var max_height = 300

        if (width > height) {
            if (width > max_width) {
                height = height * (max_width / width);
                width = max_width;
            }
        } else {
            if (height > max_height) {
                width = width * (max_height / height);
                height = max_height;
            }
        }

        canvas.width = width;
        canvas.height = height;

        var ctx = canvas.getContext("2d");

        ctx.drawImage(img, 0, 0, width, height);

        let x = canvas.toDataURL('image/jpg');
        if (x == undefined) {
            x = canvas.toDataURL('image/png');
        }

        callback(x);

        img.remove();
        canvas.remove();
    }
    img.src = url;
}

// filedrop handler
function handleImages(images, element) {
    let imageFile = images[0];

    var reader = new FileReader();

    reader.onload = (e) => {
        resizeImageFromUrl(
            e.target.result,
            (result) => {
                element.style.backgroundImage = "url('" + result + "')";
            }
        );
    }

    reader.readAsDataURL(imageFile)
}

function setImages(url, element) {
    getBase64FromUrl(url).then((result) => {
        element.style.backgroundImage = "url('" + result + "')";
    });
}

[imgDrop, typeDrop].forEach(element => {
    element.addEventListener('drop', (e) => {
        let url = e.dataTransfer.getData('text/plain');
        if (url) {
            url;
            setImages(url, element);
        }
        else if (e.dataTransfer.files) {
            handleImages(e.dataTransfer.files, element);
        }
        // fail silently
    });
});

[
    [inputs.bg, imgDrop],
    [inputs.type, typeDrop]
].forEach(element => {
    element[0].addEventListener('change', (e) => {
        if (e.target.files) {
            handleImages(e.target.files, element[1]);
        }
    });
});

// color change stuff

colorChanger.addEventListener('change', setRGB);

['r','g','b'].forEach(e => {
    rgb[e].addEventListener('change', (e) => {
        let color = hexToRGB(colorChanger.value);

        color[e.target.getAttribute('data-rgb')] = parseInt(e.target.value);

        colorChanger.value = RGBToHex(color);
        setRGB();
    })
});

// title squish stuff

inputs.squish.addEventListener('change', () => {
    card.title.childNodes[0].style.transform = "scaleX(" + inputs.squish.value/100 + ")";
})

document.querySelector('#scrollReset').addEventListener('click', () => {
    card.title.scrollLeft = 0;
});

// card image alignment

inputs.align.addEventListener('change', () => {
    inputs.alignNumerical.value = inputs.align.value;
    reAlignImage();
});

inputs.alignNumerical.addEventListener('change', () => {
    inputs.align.value = inputs.alignNumerical.value;
    reAlignImage();
});

// dark mode toggle

function toggleDarkness() {
    if (darkToggle.checked) {
        card.background.classList.add('dark');
    } else {
        card.background.classList.remove('dark');
    }
}

darkToggle.addEventListener('change', () => {
    toggleDarkness();
    setRGB();
});

// saturation

inputs.saturate.addEventListener('change', () => {
    inputs.satNumerical.value = inputs.saturate.value;
    setRGB();
});

inputs.satNumerical.addEventListener('change', () => {
    inputs.saturate.value = inputs.satNumerical.value;
    setRGB();
});

document.querySelector('#typeButton').addEventListener('click', () => {
    document.querySelector('#typeContainer').classList.toggle('hidden');
})

document.querySelector('#render').addEventListener('click', () => {
    card.background.style.margin = '0';
    document.body.style.overflowY = 'hidden';
    document.querySelector("meta[name='viewport']").setAttribute(
        'content',
        'initial-scale=1, minimum-scale=1, maximum-scale=1'
    );
    html2canvas(card.background, {
        // allowTaint: true,
        width: 480,
        height: 672,
        scrollX: 0,
        scrollY: -window.scrollY
    }).then(function(canvas) {
        // document.body.appendChild(canvas); // uncomment to debug canvas
        var image = canvas.toDataURL("image/png");//.replace("image/png", "image/octet-stream");
        download(card.title.innerText + '.png', image, true);
        canvas.remove();
    });
    card.background.style.margin = 'auto';
    document.body.style.overflowY = 'initial';
    document.querySelector("meta[name='viewport']").setAttribute(
        'content',
        'initial-scale=0.6, minimum-scale=0.6, maximum-scale=0.6'
    );
})

inputs.font.addEventListener('change', () => {
    card.description.style.fontSize = inputs.font.value + 'pt';
});

setRGB();