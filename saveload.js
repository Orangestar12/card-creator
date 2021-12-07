'use strict';

let rarities = [];
let raritiesElms = document.querySelector('#rarity').options;
for (let i=0; i < raritiesElms.length; i++) {
    rarities.push(raritiesElms.value);
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
    let savedCard = {
        title: card.title.textContent,
        image: imgDrop.style.backgroundImage,
        color: colorChanger.value,
        typeImg: typeDrop.style.backgroundImage,
        type: document.querySelector('.typetitle').innerText,
        franchise: document.querySelector('.franchise').innerText,
        description: card.description.value.trimEnd(),
        rarity: card.rarity.value,
        squish: inputs.squish.value,
        darkMode: darkToggle.checked,
        alignment: inputs.align.value,
        alignmentAxis: document.querySelector('#axis').value,
        font: inputs.font.value,
        saturated: inputs.saturate.checked
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

function loadFile(e) {
    if (e.target.files) {
        let reader = new FileReader();

        reader.addEventListener('load', () => {
            let savedCard = JSON.parse(reader.result);

            // backwards compatibility: is image a url?
            if (savedCard.image.indexOf('url("http') === 0 || savedCard.image.indexOf('url("file') === 0) {
                console.log('Converting ugly HTTP urls to data URI! (Background)');
                // data uris wont taint canvases

                convertHTTPUri(savedCard.image).then(
                    (result) => {
                        imgDrop.style.backgroundImage = 'url("' + result + '")';
                    }
                );

            } else {
                // load existing data uri
                imgDrop.style.backgroundImage = savedCard.image;
            }

            if (savedCard.typeImg.indexOf('url("http') === 0 || savedCard.typeImg.indexOf('url("file') === 0) {
                console.log('Converting ugly HTTP urls to data URI! (Type)');
                
                convertHTTPUri(savedCard.typeImg).then(
                    (result) => {
                        typeDrop.style.backgroundImage = 'url("' + result + '")';
                    }
                )
            } else {
                typeDrop.style.backgroundImage = savedCard.typeImg;
            }

            // if (savedCard.description.trim('\n') === savedCard.description.length) {
            //     savedCard.description = savedCard.description.slice(0, savedCard.description.length - 1);
            // }

            card.title.childNodes[0].textContent = savedCard.title;
            inputs.squish.value = savedCard.squish;
            card.title.childNodes[0].style.transform = "scaleX(" + inputs.squish.value/100 + ")";

            colorChanger.value = savedCard.color;
            

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
                card.rarity.value = "0"
            }

            document.querySelector('.typetitle').textContent = savedCard.type;
            document.querySelector('.franchise').textContent = savedCard.franchise;
            card.description.value = savedCard.description;

            inputs.align.value = inputs.alignNumerical.value = savedCard.alignment ? savedCard.alignment : "50";
            document.querySelector('#axis').value = savedCard.alignmentAxis ? savedCard.alignmentAxis : "Y";

            darkToggle.checked = savedCard.darkMode;
            inputs.saturate.value = inputs.satNumerical.value = savedCard.saturated ? savedCard.saturated : "50";

            inputs.font.value = savedCard.font ? savedCard.font : '14';
            card.description.style.fontSize = inputs.font.value + 'pt';

            let color = hexToRGB(savedCard.color);
            for(let i=0;i<3;i++) {
                document.querySelector('#rgb' + ['R','G','B'][i])
                    .value = color[
                        ['r','g','b'][i]
                    ];
            };

            toggleDarkness();
            setRGB();
            reAlignImage();

        });

        reader.readAsText(e.target.files[0]);
    }
}

document.querySelector('#loadUpload').addEventListener('change', loadFile);

document.querySelector('.save').addEventListener('click', saveFile, {'capture': true});