'use strict';

const imgDrop = document.querySelector('.image'),
    typeDrop = document.querySelector('.type'),
    colorChanger = document.querySelector('input[type=\'color\']'),
    darkToggle = document.querySelector('input.darkMode'),

    card = {
    "background": document.querySelector('#card-container'),
    "title": document.querySelector('#card-container .title')
    },
    
    inputs = {
        "bg": document.querySelector('#bgUpload'),
        "type": document.querySelector('#typeUpload'),
        "squish": document.querySelector('#squish'),
        "align": document.querySelector('#align'),
        "alignNumerical": document.querySelector('#alignNumerical')
    };

function setRGB() {
    card.title.style.backgroundColor = colorChanger.value;
    let rgb = card.title.style.backgroundColor;

    // split value to RGB
    rgb = rgb.substr(4).split(")")[0].split(",");

    let hsl = RGBToHSL(rgb);
    
    hsl.s /= 2;

    if (darkToggle.checked)
        hsl.l += 5;
    else
        hsl.l -= 5;

    card.background.style.backgroundColor = 'hsl(' + hsl.h + ',' + hsl.s +'%,' + hsl.l + '%)';
    card.title.style.borderColor = 'rgba(' + (rgb[0] - 40).toString() + ',' + (rgb[1] - 40).toString() + ',' + (rgb[2] - 40).toString() + ',0.8)'
}

function reAlignImage() {
    if (document.querySelector('#axis').value == 'Y')
        imgDrop.style.backgroundPosition = '50% ' + inputs.align.value + '%';
    else
        imgDrop.style.backgroundPosition = inputs.align.value + '% 50%';
}

// helper funcs

function getDataURLFromSource(source, callback) {
	let fr = new FileReader();
	fr.addEventListener('load', function () {
        callback(fr.result);
	});
	fr.readAsDataURL(source);
}

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

// filedrop handler
function handleImages(images, element) {
    getDataURLFromSource(
        images[0],
        function(x){
            element.style.backgroundImage = "url('" + x + "')";
        }
    );
}
function setImages(url, element) {
    element.style.backgroundImage = "url('" + url + "')";
}

[imgDrop, typeDrop].forEach(element => {
    element.addEventListener('drop', (e) => {
        let url = e.dataTransfer.getData('text/plain');
        if (url) {
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

setRGB();

document.querySelector('#typeButton').addEventListener('click', () => {
    document.querySelector('#typeContainer').classList.toggle('hidden');
})

document.querySelector('#render').addEventListener('click', () => {
    card.background.style.margin = '0';
    document.body.style.overflowY = 'hidden';
    html2canvas(card.background, {
        allowTaint: true,
        width: 480,
        height: 672,
        scrollX: 0,
        scrollY: -window.scrollY
    }).then(function(canvas) {
        document.body.appendChild(canvas);
    });
    card.background.style.margin = 'auto';
    document.body.style.overflowY = 'initial';
})