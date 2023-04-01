'use strict';

const colorChanger = document.querySelector('input[type=\'color\']'),

    card = {
        "container": document.querySelector('#card-container'),
        "title": document.querySelector('#card-container .title'),
        "portrait": document.querySelector('.image'),
        "description": document.querySelector('.description'),
        "rarity": document.querySelector('#rarity'),
        "tags": document.querySelector('.tags'),
        "type": document.querySelector('.type'),
        "quote": document.querySelector('.quote')
    },
    
    inputs = {
        "squish": document.querySelector('#squish'),
        'font': document.querySelector('#font'),
        'divMinHeight': document.querySelector('#divMinHeight'),
        'divMargins': document.querySelector('#divMargins'),
        'darkMode' : document.querySelector('input.darkMode'),
        'stats' : document.querySelector('input.noStats'),
        'portrait' : document.querySelector('input.noPortrait'),
        'vpad' : document.querySelector('#vpad'),
        'hpad' : document.querySelector('#hpad'),
        'portraitHeight': document.querySelector('#portraitHeight')
    };

function setRGB() {
    let rgb = colorChanger.value;
    card.container.style.setProperty('--main-color', rgb);

    // split value to RGB
    rgb = [
        parseInt(rgb.substr(1,2), 16),
        parseInt(rgb.substr(3,2), 16),
        parseInt(rgb.substr(5,2), 16)
    ];

    let hsl = RGBToHSL(rgb);

    let c = document.querySelector('.color')

    const colors = [
        [360, 'RED'],
        [340, 'PINK'],
        [302, 'PURPLE'],
        [265, 'BLUE'],
        [207, 'CYAN'],
        [159, 'GREEN'],
        [75, 'YELLOW'],
        [39, 'ORANGE'],
        [15, 'RED'],
    ]

    for (let color of colors) {
        if (hsl.h < color[0]) {
            c.textContent = color[1];
        }
    }

    // console.log(hsl)

    if (hsl.l >= 80) {
        c.textContent = 'WHITE';
    } else if (hsl.l <= 30) {
        c.textContent = 'BLACK';
    } else if (hsl.s <= 10) {
        c.textContent = 'GRAY';
    }

    if (c.textContent == 'ORANGE' && hsl.l <= 30) {
        c.textContent = 'BROWN';
    }

    // if (inputs.darkMode.checked)
    //     hsl.l -= 30;
    // else
    //     hsl.l += 30;
    
    for (let r in rgb) {
        rgb[r] -= 40;
    }

    card.title.style.borderColor = 'rgba(' + (rgb[0]).toString() + ',' + (rgb[1]).toString() + ',' + (rgb[2]).toString() + ',0.8)'
}

// color change stuff
colorChanger.addEventListener('change', setRGB);

['R','G','B'].forEach(e => {
    document.querySelector('#rgb' + e).addEventListener('change', function(e) {
        let color = hexToRGB(colorChanger.value);

        color[this.getAttribute('data-rgb')] = parseInt(this.value);

        colorChanger.value = RGBToHex(color)

        setRGB();
    })
});

// title squish stuff
inputs.squish.addEventListener('change', () => {
    card.title.children[0].style.transform = "scaleX(" + inputs.squish.value/100 + ")";
})

card.title.addEventListener('focusout', () => {
    card.title.scrollLeft = 0;
});

// toggles
function toggleDarkness() {
    if (inputs.darkMode.checked) {
        card.container.classList.add('light');
    } else {
        card.container.classList.remove('light');
    }
    setRGB();
}
inputs.darkMode.addEventListener('change', toggleDarkness);

inputs.stats.addEventListener('change', () => {
    if (inputs.stats.checked) {
        card.container.classList.remove('noStats');
    } else {
        card.container.classList.add('noStats');
    }
});

inputs.portrait.addEventListener('change', () => {
    if (inputs.portrait.checked) {
        card.container.classList.remove('noPortrait');
    } else {
        card.container.classList.add('noPortrait');
    }
})

inputs.font.addEventListener('change', () => {
    card.description.style.fontSize = inputs.font.value + 'pt';
});

function updateStyle() {
    card.description.children[0].textContent = '.description div{margin-top:' +
                                                inputs.divMargins.value +
                                                'px;min-height:' +
                                                (inputs.divMinHeight.value / 100) +
                                                'em;}'
}

[inputs.divMargins, inputs.divMinHeight].forEach(e => {
    e.addEventListener('change', () => {
        updateStyle();
    });
});

setRGB();

document.querySelector('#defaults').addEventListener('click', () => {
    inputs.font.value = 14;
    inputs.squish.value = 100;
    inputs.divMargins.value = 5;
    inputs.divMinHeight.value = 25;
    inputs.hpad.value = 8;
    inputs.vpad.value = 8;
    inputs.portraitHeight.value = 2.6;
    inputs.darkMode.checked = false;
    inputs.portrait.checked = true;
    inputs.stats.checked = true;

    card.description.style.fontSize = inputs.font.value + 'pt';
    card.title.children[0].style.transform = "scaleX(" + inputs.squish.value/100 + ")";
    card.portrait.parentElement.style.height = '2.6in';
    card.container.classList.remove('light');
    card.container.classList.remove('noStats');
    card.container.classList.remove('noPortrait');
    updateStyle();
    setRGB();
    modifyMargins();
    
    for (let element of document.querySelectorAll('.XY')) {
        element.removeAttribute('style');
    }
    card.portrait.style.backgroundPosition = '50% 50%';
    card.container.style.backgroundPosition = '50% 50%';
})

// tags
function addTag() {
    let tag = document.createElement('div');
    tag.textContent = 'New Tag';
    tag.classList.add('t');
    tag.setAttribute('contenteditable', 'true');

    let tags = document.querySelector('.tags')
    tags.append(tag);
    tag.addEventListener('focusout', removeTag);

    tag.addEventListener('keydown', (e) => {
        if (e.key != 'Enter') { return; }
        let newTag = addTag();
        window.getSelection().setBaseAndExtent(newTag,0,newTag.firstChild,newTag.textContent.length);
        preventDefaults(e);
    });

    return tag;
}

function removeTag() {
    if (this.textContent == '') {
        this.remove();
    }
}

document.querySelector('#addTag').addEventListener('click', addTag);

// tooltips
const tooltip = document.querySelector('#tooltip');

function toolTipiffy() {
    tooltip.textContent = this.getAttribute('data-tooltip');
    if (this.getAttribute('data-tooltip-pos') == 'r'){
        tooltip.style.right = this.getAttribute('data-tooltip-x');
        tooltip.style.left = 'auto';
    } else {
        tooltip.style.left = this.getAttribute('data-tooltip-x');
        tooltip.style.right = 'auto';
    }
    tooltip.style.top = this.getAttribute('data-tooltip-y');
    tooltip.style.width = this.getAttribute('data-tooltip-w') ? this.getAttribute('data-tooltip-w') : 'auto'; 
    tooltip.classList.remove('hidden');
}

function unTooltipiffy() {
    tooltip.classList.add('hidden');
}

for(let element of document.querySelectorAll('[data-tooltip]')) {
    element.addEventListener('pointerover', toolTipiffy);
    element.addEventListener('pointerout', unTooltipiffy);
}

// date
const date = document.querySelector('.date');

function setDate() {
    // https://stackoverflow.com/questions/12413243/javascript-date-format-like-iso-but-local
    let today = new Date(Date.now());
    let offset = today.getTimezoneOffset() * 60 * 1000;
    let localTime = new Date(today - offset);
    date.textContent = localTime.toISOString().split("T")[0]
}

setDate();

// image position
function setPos(e) {
    if (!posing) { return; }

    let r = this.getBoundingClientRect();
    let x = e.clientX - r.left;
    let y = e.clientY - r.top;

    // clamp
    x = Math.max(x, 0);
    x = Math.min(x, 75);
    y = Math.max(y, 0);
    y = Math.min(y, 75);

    let dot = this.children[0];
    
    dot.style.left = x + 'px';
    dot.style.top = y + 'px';

    let bx = (x / 75) * 100;
    let by = (y / 75) * 100;

    if (this.id == 'bgXY') {
        card.container.style.backgroundPosition = bx + '% ' + by + '%';
    } else {
        card.portrait.style.backgroundPosition = bx + '% ' + by + '%';
    }

    preventDefaults(e);
}

let posing = false;

for (let element of document.querySelectorAll('.XY')) {

    element.addEventListener('pointerdown', (e) => {
        posing = true;
        preventDefaults(e);
    });

    element.addEventListener('pointermove', setPos);
}

document.body.addEventListener('pointerup', (e) => {
    posing = false;
});

// open and close options
const options = document.querySelector('#form-container').children;

for (let div of options) {
    div.children[0].addEventListener('click', function() {
        let child = this.parentNode.children[1];

        if (child.classList.contains('hidden')) {
            for (let option of options) {
                if (option.firstElementChild.nodeName != 'H3') { continue; }
                option.children[1].classList.add('hidden');
            }
            child.classList.remove('hidden');
        } else {
            child.classList.add('hidden');
        }
    });
}

function showMargins() {
    let top = document.createElement('div');
    top.style.top = 0; top.style.left = 0; top.style.right = 0;
    top.style.height = inputs.vpad.value + 'px';
    top.classList.add('DOES-THIS-COUNT-AS-A-HACK');
    top.classList.add('v');

    let bottom = document.createElement('div');
    bottom.style.bottom = 0; bottom.style.left = 0; bottom.style.right = 0;
    bottom.style.height = inputs.vpad.value + 'px';
    bottom.classList.add('DOES-THIS-COUNT-AS-A-HACK');
    bottom.classList.add('v');

    let left = document.createElement('div');
    left.style.top = 0; left.style.left = 0; left.style.bottom = 0;
    left.style.width = inputs.hpad.value + 'px';
    left.classList.add('DOES-THIS-COUNT-AS-A-HACK');
    left.classList.add('h');

    let right = document.createElement('div');
    right.style.top = 0; right.style.right = 0; right.style.bottom = 0;
    right.style.width = inputs.hpad.value + 'px';
    right.classList.add('DOES-THIS-COUNT-AS-A-HACK');
    right.classList.add('h')

    card.description.appendChild(top);
    card.description.appendChild(left);
    card.description.appendChild(right);
    card.description.appendChild(bottom);
}

function hideMargins() {
    document.querySelectorAll('.DOES-THIS-COUNT-AS-A-HACK').forEach(e => {
        e.remove();
    });
}

function modifyMargins() {
    card.description.style.padding = inputs.vpad.value + 'px ' + inputs.hpad.value + 'px';
    document.querySelectorAll('.v').forEach(e => {
        e.style.height = inputs.vpad.value + 'px';
    });
    document.querySelectorAll('.h').forEach(e => {
        e.style.width = inputs.hpad.value + 'px';
    });
}

[inputs.vpad, inputs.hpad].forEach(e => {
    e.addEventListener('focus', showMargins);
    e.addEventListener('focusout', hideMargins);
    e.addEventListener('change', modifyMargins);
});

inputs.portraitHeight.addEventListener('change', () => {
    card.portrait.parentElement.style.height = inputs.portraitHeight.value + 'in';
});