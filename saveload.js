'use strict';

const saveButtons = document.querySelectorAll('.save');

// https://stackoverflow.com/a/18197341
function download(filename, text) {
    var element = document.createElement('a');
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
        description: document.querySelector('.description').innerText,
        squish: inputs.squish.value,
        darkMode: darkToggle.checked,
        alignment: inputs.align.value,
        alignmentAxis: document.querySelector('#axis').value
    }

    let saveString = JSON.stringify(savedCard);

    download(savedCard.title + '.card', saveString)

}

function loadFile(e) {
    if (e.target.files) {
        let reader = new FileReader();

        reader.addEventListener('load', () => {
            let savedCard = JSON.parse(reader.result);

            card.title.childNodes[0].textContent = savedCard.title;
            inputs.squish.value = savedCard.squish;
            card.title.childNodes[0].style.transform = "scaleX(" + inputs.squish.value/100 + ")";

            imgDrop.style.backgroundImage = savedCard.image;
            colorChanger.value = savedCard.color;
            typeDrop.style.backgroundImage = savedCard.typeImg;
            document.querySelector('.typetitle').textContent = savedCard.type;
            document.querySelector('.franchise').textContent = savedCard.franchise;
            document.querySelector('.description').textContent = savedCard.description;

            inputs.align.value = savedCard.alignment;
            document.querySelector('#axis').value = savedCard.alignmentAxis;
            
            darkToggle.checked = savedCard.darkMode;

            // document.querySelector('input[data-align=\'' + savedCard.alignment + '\']').checked = true; // doesn't work lol

            toggleDarkness();
            setRGB();
            reAlignImage();

        });

        reader.readAsText(e.target.files[0]);
    }
}

document.querySelector('#loadUpload').addEventListener('change', loadFile);

for (let button of saveButtons) {
    button.addEventListener('click', saveFile);
}