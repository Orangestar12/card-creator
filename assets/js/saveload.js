'use strict';

let rarities = [];
let raritiesElms = document.querySelector('#rarity').options;
for (let i=0; i < raritiesElms.length; i++) {
    rarities.push(raritiesElms[i].value);
};
raritiesElms = undefined;

// https://stackoverflow.com/a/18197341
function download(filename, text, image) {
    var element = document.createElement('a');
    if (image)
        element.setAttribute('href', text);
    else
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
}

function saveFile() {
    let portraitxy = document.querySelector('#portraitXY');
    let bgxy = document.querySelector('#bgXY');

    let savedCard = {
        version: 300, // 3.0.0
        // card text
        title: card.title.firstElementChild.textContent,
        colorText: document.querySelector('.color'),
        type: images.type.title.textContent,
        franchise: document.querySelector('#franchise').textContent,
        description: textBox.value,
        atk: document.querySelector('.stats .a span[contenteditable]').textContent,
        def: document.querySelector('.stats .d span[contenteditable]').textContent,
        quote: card.quote.textContent,
        tags: [],
        rarity: card.rarity.value,
        limit: document.querySelector('.limit').textContent,
        date: document.querySelector('.date').datetime,

        color: colorChanger.value,
        pos: {
            portraitX: portraitxy.firstChild.style.left ? parseInt(portraitxy.firstChild.style.left) : 50,
            portraitY: portraitxy.firstChild.style.top ? parseInt(portraitxy.firstChild.style.top) : 50,
            bgX: bgxy.firstChild.style.left ? parseInt(bgxy.firstChild.style.left) : 50,
            bgY: bgxy.firstChild.style.top ? parseInt(bgxy.firstChild.style.top) : 50,
        },

        // meta
        font: inputs.font.value,
        squish: inputs.squish.value,
        divMinHeight: inputs.divMinHeight.value,
        divMargins: inputs.divMargins.value,
        vpad: inputs.vpad.value,
        hpad: inputs.hpad.value,
        portraitHeight: inputs.portraitHeight.value,

        darkMode: inputs.darkMode.checked,
        noStats: inputs.stats.checked,
        noPortrait: inputs.portrait.checked,

        // images
        images: {
            type: card.type.style.backgroundImage,
            portrait: card.portrait.style.backgroundImage,
            bg: card.container.style.backgroundImage
        }
    }

    for(let tag of card.tags.children) {
        savedCard.tags.push(tag.textContent);
    }

    let saveString = JSON.stringify(savedCard);

    download(savedCard.title + '.card', saveString)
}

function convertHTTPUri(e) {
    return getBase64FromUrl(
        e.slice(
            e.indexOf('http'),
            e.indexOf('")')
        )
    );
}

function modal(text, options, callbacks) {
    // console.log('making modal');
    let m = document.createElement('div');
    m.classList.add('modal');
    m.appendChild(document.createElement('p'))
    m.lastChild.textContent = text;

    m.appendChild(document.createElement('div'));
    m.lastChild.classList.add('flex');

    for (let option in options) {
        // console.log('adding option for', options[option])
        m.lastChild.appendChild(document.createElement('button'));
        m.lastChild.lastChild.textContent = options[option];
        m.lastChild.lastChild.addEventListener('click', () => {
            callbacks[option]();
            m.remove();
        });
    }

    document.body.appendChild(m);
    // console.log(m);
}

function backwardsCompUriCheck(uri) {
    return uri.indexOf('url("http') === 0 || uri.indexOf('url("file') === 0;
}

function backwardsCompUriFix(uri, element) {
    convertHTTPUri(uri).then(
        // data uris wont taint canvases
        (output) => {
            resizeImageFromUrl(output, (y) => {
                element.style.backgroundImage = 'url("' + y + '")';
            });
        }
    );
}

function parseCard(result) {
    let savedCard = JSON.parse(result);

    if (!savedCard.version) {
        // backwards compatibility with REALLY OLD cards: is image a url?

        // typeimg
        if (backwardsCompUriCheck(savedCard.typeImg)) {
            backwardsCompUriFix(savedCard.typeImg, card.type);
        } else {
            // backwards compatibility with old data-uri cards
            let output;
            if (savedCard.typeImg.indexOf('url("data:') === 0) {
                output = savedCard.typeImg.slice(
                    savedCard.typeImg.indexOf('data:'),
                    savedCard.typeImg.indexOf('")')
                )
            }
            resizeImageFromUrl(output, (y) => {
                // load existing data uri
                card.type.style.backgroundImage = 'url("' + y + '")';
            });
        }

        // regular image
        if (backwardsCompUriCheck(savedCard.image)) {
            modal(
                'Detected a V2.0 card! Would you like to import the image as a portrait or a background?',
                ['Portrait', 'Background'],
                [
                    () => {
                        backwardsCompUriFix(savedCard.image, card.portrait);
                    },
                    () => {
                        backwardsCompUriFix(savedCard.image, card.container);
                        inputs.portrait.checked = false;
                        card.container.classList.add('noPortrait')
                    }
                ]
            );
        } else {
            let output;
            if (savedCard.image.indexOf('url("data:') === 0) {
                output = savedCard.image.slice(
                    savedCard.image.indexOf('data:'),
                    savedCard.image.indexOf('")')
                )
            }
            resizeImageFromUrl(output, (y) => {
                modal(
                    'Detected a V2.0 card! Would you like to import the image as a portrait or a background?',
                    ['Portrait', 'Background'],
                    [
                        () => {
                            card.portrait.style.backgroundImage = 'url("' + y + '")';
                        },
                        () => {
                            card.container.style.backgroundImage = 'url("' + y + '")';
                            inputs.portrait.checked = false;
                            card.container.classList.add('noPortrait')
                        }
                    ]
                );  
            });
        }

        savedCard.pos = {
            portraitX: savedCard.alignment,
            portraitY: savedCard.alignment,
            backgroundX: 37,
            backgroundY: 37
        }
        if (['INSTANT', 'REACTION', 'LOCATION', 'ITEM', 'EQUIP'].indexOf(savedCard.type) == -1) {
            let firstnl = savedCard.description.indexOf('\n');
            let line = savedCard.description.slice(0,firstnl);
            let atk = line.slice(5);

            savedCard.description = savedCard.description.slice(firstnl + 1);

            firstnl = savedCard.description.indexOf('\n');
            line = savedCard.description.slice(0, firstnl);
            let def = line.slice(5);

            savedCard.description = savedCard.description.slice(firstnl + 1);
            
            savedCard.atk = atk;
            savedCard.def = def;

            inputs.stats.checked = true;
        } else {
            savedCard.atk = 0;
            savedCard.def = 0;
            inputs.stats.checked = false;
        }
        savedCard.tags = [];

        // dark mode was different between 2.0 and 3.0
        inputs.darkMode.checked = !savedCard.darkMode;
    } else {
        // pics
        card.portrait.style.backgroundImage = savedCard.images.portrait;
        card.type.style.backgroundImage = savedCard.images.type;
        card.container.style.backgroundImage = savedCard.images.bg;
        
        inputs.darkMode.checked = savedCard.darkMode;

        // stuff not in old cards
        // quote
        card.quote.textContent = savedCard.quote;

        // color (written)
        document.querySelector('.color').textContent = savedCard.colorText

        // toggles
        inputs.portrait.checked = savedCard.noPortrait;
        inputs.stats.checked = savedCard.noStats;

        // description margins
        inputs.divMargins.value = savedCard.divMargins;
        inputs.divMinHeight.value = savedCard.divMinHeight;
        inputs.hpad.value = savedCard.hpad;
        inputs.vpad.value = savedCard.dpad;

        // portrait height
        inputs.portraitHeight.value = savedCard.portraitHeight;

        // limit
        document.querySelector('.limit').textContent = savedCard.limit;
    }

    // title
    card.title.firstElementChild.textContent = savedCard.title;

    // type (text)
    document.querySelector('.typeTitle').textContent = savedCard.type;

    // squish
    inputs.squish.value = savedCard.squish;
    card.title.children[0].style.transform = "scaleX(" + inputs.squish.value/100 + ")";

    // color
    colorChanger.value = savedCard.color;
    
    // rarities
    if (
        savedCard.rarity && // card has a rarity
        rarities.find( // card rarity is in list
            (e) => {
                if (e == savedCard.rarity) {
                    return true;
                }
            }
        )
    ) {
        card.rarity.value = savedCard.rarity;
    } else {
        card.rarity.value = "0";
    }
    
    // franchise
    document.querySelector('#franchise').textContent = savedCard.franchise;
    
    // description
    // card.description.value = savedCard.description;
    textBox.value = savedCard.description;

    // atk
    document.querySelector('.stats .a span[contenteditable]').textContent = savedCard.atk;
    // def
    document.querySelector('.stats .d span[contenteditable]').textContent = savedCard.def;

    // inputs.align.value = inputs.alignNumerical.value = savedCard.alignment ? savedCard.alignment : "50";
    // document.querySelector('#axis').value = savedCard.alignmentAxis ? savedCard.alignmentAxis : "Y";

    // inputs.saturate.value = inputs.satNumerical.value = savedCard.saturated ? savedCard.saturated : "50";

    // font size
    inputs.font.value = savedCard.font ? savedCard.font : '14';
    card.description.style.fontSize = inputs.font.value + 'pt';

    while(card.tags.firstChild) { card.tags.firstChild.remove(); }
    
    for (let tag of savedCard.tags) {
        let t = addTag();
        t.textContent = tag;
    }

    let color = hexToRGB(savedCard.color);
    for(let i=0;i<3;i++) {
        document.querySelector('#rgb' + ['R','G','B'][i])
            .value = color[
                ['r','g','b'][i]
            ];
    };

    card.portrait.parentElement.style.height = inputs.portraitHeight.value + 'in';

    updateStyle();
    toggleDarkness();
    setRGB();
    modifyMargins();
    
    for (let element of document.querySelectorAll('.XY')) {
        element.removeAttribute('style');
    }
    card.portrait.style.backgroundPosition = ((savedCard.pos.portraitX / 75) * 100) + '% ' + ((savedCard.pos.portraitY / 75) * 100) + '%';
    card.container.style.backgroundPosition = ((savedCard.pos.bgX / 75) * 100) + '% ' + ((savedCard.pos.bgY / 75) * 100) + '%';;

    processMarkup();

    if (!inputs.portrait.checked) {
        card.container.classList.add('noPortrait')
    }
    if (!inputs.stats.checked) {
        card.container.classList.add('noStats')
    }
}

function loadFile(e) {
    if (e.target.files) {
        let reader = new FileReader();

        reader.addEventListener('load', () => {
            parseCard(reader.result);
            e.target.value = null;
        });
        
        try {
            reader.readAsText(e.target.files[0]);
        } catch(e) {
            if (!(e instanceof TypeError)) {
                toast(e);
                // throw e;
            }
            // TypeError means the import file was cancelled.
        }
    }
}

document.querySelector('#loadUpload').addEventListener('change', loadFile);

document.querySelector('.save').addEventListener('click', saveFile, {'capture': true});