'use strict';

const portraitxy = document.querySelector('#portraitXY');
const bgxy = document.querySelector('#bgXY');

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

async function deferredJobSystem(actions) {
    let m = document.createElement('div');
    m.classList.add('modal')
    let p = document.createElement('p');
    m.appendChild(p);
    let i = document.createElement('progress');
    i.max = actions.length;
    m.appendChild(i);
    document.body.appendChild(m);
    
    let value = 0;

    for (let action of actions) {
        let promise = new Promise((resolve, reject) => {
            p.textContent = action[1];
            action[0]();
            setTimeout(resolve, 100);
        });
        await promise;
        value++;
        i.value = value;
    }

    m.remove();
}

async function saveFile() {
    let savedCard = {};
    let saveString = '';

    await deferredJobSystem([
        [
            () => {
                savedCard.version = 300; // 3.0.0
                savedCard.title = card.title.firstElementChild.textContent;
                savedCard.colorText = document.querySelector('.color');
                savedCard.type = images.type.title.textContent;
                savedCard.franchise = document.querySelector('#franchise').textContent;
                savedCard.description = textBox.value;
                savedCard.atk = document.querySelector('.stats .a span[contenteditable]').textContent;
                savedCard.def = document.querySelector('.stats .d span[contenteditable]').textContent;
                savedCard.quote = card.quote.textContent;
                savedCard.rarity = card.rarity.value;
                savedCard.limit = document.querySelector('.limit').children[1].textContent;
                savedCard.date = document.querySelector('.date').datetime;
            },
            'Saving card text...'
        ],
        [
            () => {
                savedCard.color = colorChanger.value;
                savedCard.pos = {
                    portraitX: portraitxy.firstChild.style.left ? ((parseInt(portraitxy.firstChild.style.left) / 75) * 100) : 50,
                    portraitY: portraitxy.firstChild.style.top ? ((parseInt(portraitxy.firstChild.style.top) / 75) * 100) : 50,
                    bgX: bgxy.firstChild.style.left ? ((parseInt(bgxy.firstChild.style.left) / 75) * 100) : 50,
                    bgY: bgxy.firstChild.style.top ? ((parseInt(bgxy.firstChild.style.top) / 75) * 100) : 50,
                }
                savedCard.font = inputs.font.value;
                savedCard.tagFont = inputs.tagFont.value;
                savedCard.squish = inputs.squish.value;
                savedCard.divMinHeight = inputs.divMinHeight.value;
                savedCard.divMargins = inputs.divMargins.value;
                savedCard.vpad = inputs.vpad.value;
                savedCard.hpad = inputs.hpad.value;
                savedCard.portraitHeight = inputs.portraitHeight.value;
        
                savedCard.darkMode = inputs.darkMode.checked;
            },
            'Saving card appearance...'
        ],
        [
            () => {
                savedCard.noStats = inputs.stats.checked;
                savedCard.noPortrait = inputs.portrait.checked;
            },
            'Saving meta info...'
        ],
        [
            () => {
                savedCard.tags = [];

                for(let tag of card.tags.children) {
                    savedCard.tags.push(tag.textContent);
                }
            },
            'Saving tags...'
        ],
        [
            () => {
                savedCard.images = {
                    type: card.type.style.backgroundImage,
                    bg: card.container.style.backgroundImage
                };
                if (savedCard.noPortrait) {
                    savedCard.images.portrait = card.portrait.style.backgroundImage;
                }
            },
            'Saving images...'
        ],
        [
            () => {
                saveString = JSON.stringify(savedCard);
            },
            'Processing card into text...'
        ],
        [
            () => {
                download(savedCard.title + '.card', saveString)
            },
            'You should be seeing a download prompt now!'
        ]
    ])
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
    let m = document.createElement('div');
    m.classList.add('modal');
    m.appendChild(document.createElement('p'))
    m.lastChild.textContent = text;

    m.appendChild(document.createElement('div'));
    m.lastChild.classList.add('flex');

    for (let option in options) {
        m.lastChild.appendChild(document.createElement('button'));
        m.lastChild.lastChild.textContent = options[option];
        m.lastChild.lastChild.addEventListener('click', () => {
            callbacks[option]();
            m.remove();
        });
    }

    document.body.appendChild(m);
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

async function parseCard(result) {
    let savedCard = JSON.parse(result);
    
    if (savedCard.description.indexOf('<script') != -1)
    {
        modal(
            'Load aborted. Don\'t panic, but whoever sent you this card just tried to inject a nasty script into it. I\'m bad at code so the description block just reads raw HTML when it parses the input, but I added this quick check on the off-chance someone tried to do something sneaky, malicious, and awful. Sorry about that. Go talk to whoever gave you this .card file and chew them out for literally sending you malware.'
            ['Yikes'],
            [() => {}]
        );
        throw new Error('Script detected in card file.');
    }

    await deferredJobSystem([
        [
            () => {
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
                                    document.body.classList.add('noPortrait')
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
                                        document.body.classList.add('noPortrait');
                                    }
                                ]
                            );  
                        });
                    }
                    savedCard.pos = {
                        portraitX: savedCard.alignment,
                        portraitY: savedCard.alignment,
                        backgroundX: savedCard.alignment,
                        backgroundY: savedCard.alignment
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
                }
            },
            'Applying backwards compatibility...'
        ],
        [
            () => {
                if (savedCard.version >= 300) {
                    // pics
                    if (savedCard.noPortrait) {
                        card.portrait.style.backgroundImage = savedCard.images.portrait;
                    }
                    card.type.style.backgroundImage = savedCard.images.type;
                    card.container.style.backgroundImage = savedCard.images.bg;
                }
            },
            'Importing images...'
        ],
        [
            () => {
                if (savedCard.version >= 300) {
                    inputs.darkMode.checked = savedCard.darkMode;

                    // toggles
                    inputs.portrait.checked = savedCard.noPortrait;
                    inputs.stats.checked = savedCard.noStats;

                    // description margins
                    inputs.divMargins.value = savedCard.divMargins;
                    inputs.divMinHeight.value = savedCard.divMinHeight;
                    inputs.hpad.value = savedCard.hpad;
                    inputs.vpad.value = savedCard.vpad;

                    // portrait height
                    inputs.portraitHeight.value = savedCard.portraitHeight;
                }

                // squish
                inputs.squish.value = savedCard.squish;
                card.title.children[0].style.transform = "scaleX(" + inputs.squish.value/100 + ")";

                // color
                colorChanger.value = savedCard.color;

                // font size
                inputs.font.value = savedCard.font ? savedCard.font : '14';
                inputs.tagFont.value = savedCard.tagFont ? savedCard.tagFont : '14';
                card.description.style.fontSize = inputs.font.value + 'pt';
                card.tags.style.fontSize = inputs.tagFont.value + 'pt';
            },
                'Setting appearance...'
        ],
        [
            () => {
                let color = hexToRGB(savedCard.color);
                for(let i=0;i<3;i++) {
                    document.querySelector('#rgb' + ['R','G','B'][i])
                        .value = color[
                            ['r','g','b'][i]
                        ];
                };
                
                setRGB();
            },
            'Importing color...'
        ],
        [
            () => {
                if (savedCard.version >= 300) {
                    // quote
                    card.quote.textContent = savedCard.quote;

                    // color (written)
                    document.querySelector('.color').textContent = savedCard.colorText;
                    
                    // limit
                    document.querySelector('.limit').children[1].textContent = savedCard.limit;
                }
                // title
                card.title.firstElementChild.textContent = savedCard.title;

                // type (text)
                document.querySelector('.typeTitle').textContent = savedCard.type;

                // franchise
                document.querySelector('#franchise').textContent = savedCard.franchise;
    
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

                // description
                // card.description.value = savedCard.description;
                textBox.value = savedCard.description;
            
                // atk
                document.querySelector('.stats .a span[contenteditable]').textContent = savedCard.atk;

                // def
                document.querySelector('.stats .d span[contenteditable]').textContent = savedCard.def;
            },
            'Setting text...'
        ],
        [
            () => {
                while(card.tags.firstChild) { card.tags.firstChild.remove(); }
            },
            'Cleaning tags field...'
        ],
        [
            () => {         
                for (let tag of savedCard.tags) {
                    let t = addTag();
                    t.textContent = tag;
                }
            },
            'Importing tags...'
        ],
        [
            () => {
                card.portrait.parentElement.style.height = inputs.portraitHeight.value + 'in';

                updateStyle();
                toggleDarkness();
                modifyMargins();
                
                for (let element of document.querySelectorAll('.XY')) {
                    element.removeAttribute('style');
                }
                card.portrait.style.backgroundPosition = savedCard.pos.portraitX + '% ' + savedCard.pos.portraitY + '%';
                card.container.style.backgroundPosition = savedCard.pos.bgX + '% ' + savedCard.pos.bgY + '%';
                
                portraitxy.firstChild.style.left = ((savedCard.pos.portraitX / 100) * 75) + 'px';
                portraitxy.firstChild.style.top = ((savedCard.pos.portraitY / 100) * 75) + 'px';
                bgxy.firstChild.style.left = ((savedCard.pos.bgX / 100) * 75) + 'px';
                bgxy.firstChild.style.top = ((savedCard.pos.bgY / 100) * 75) + 'px';

                processMarkup();

                if (!inputs.portrait.checked) {
                    document.body.classList.add('noPortrait');
                } else {
                    document.body.classList.remove('noPortrait');
                }
                if (!inputs.stats.checked) {
                    card.container.classList.add('noStats')
                } else {
                    card.container.classList.remove('noStats');
                }
            },
            'Processing changes to card...'
        ]
    ]);
}

function loadFile(file) {
    let reader = new FileReader();

    reader.addEventListener('load', () => {
        parseCard(reader.result);
        document.querySelector('#loadUpload').value = null;
    });
    
    try {
        reader.readAsText(file);
    } catch(err) {
        if (!(err instanceof TypeError)) {
            toast(err);
            // throw e;
        }
        // TypeError means the import file was cancelled.
    }
}

document.querySelector('#loadUpload').addEventListener('change', function (e) {
    if (e.target.files) {
        loadFile(e.target.files[0]);
    }
});

document.querySelector('.save').addEventListener('click', saveFile, {'capture': true});

function stupidHackForLoadUploadDragThing() {
    if (preventDefaults) {
        let drop = document.querySelector('#loadUploadButton');

        // disable default drag actions
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            drop.addEventListener(eventName, preventDefaults);
        });

        // technically we only need dragenter because we dont have any children but
        // we'll do this just in case

        // add highlight on drag
        ['dragenter', 'dragover'].forEach(eventName => {
            drop.addEventListener(eventName, () => {
                drop.classList.add('highlight');
            });
        });

        // remove highlight when drag is done
        ['dragleave', 'drop'].forEach(eventName => {
            drop.addEventListener(eventName, () => {
                drop.classList.remove('highlight');
            } );
        });

        // upload image on drop
        drop.addEventListener('drop', (e) => {
            loadFile(e.dataTransfer.files[0]);
        });
    } else {
        setTimeout(stupidHackForLoadUploadDragThing, 100);
    }
}

stupidHackForLoadUploadDragThing();