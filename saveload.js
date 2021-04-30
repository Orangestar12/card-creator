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
    // fix description due to textcontent shit
    let description = document.querySelector('.description')

    console.log(description);
    description = description.innerHTML
        // remove empty line breaks
        .replace('<div><br></div>','\n')
        // remove div tags
        .replace(/\<div\>(.*?)\<\/div\>/g,'\n$1')
        // remove spans
        .replace(/\<span(.*?)>(.*?)<\/span>/g, '$2')
    console.log(description);

    let savedCard = {
        title: card.title.textContent,
        image: imgDrop.style.backgroundImage,
        color: colorChanger.value,
        typeImg: typeDrop.style.backgroundImage,
        type: document.querySelector('.typetitle').textContent,
        franchise: document.querySelector('.franchise').textContent,
        description: description,
        squish: inputs.squish.value,
        darkMode: darkToggle.checked
    }

    let saveString = JSON.stringify(savedCard);

    download(savedCard.title + '.card', saveString)

}

function loadFile(e) {
    if (e.target.files) {
        let reader = new FileReader();

        reader.addEventListener('load', () => {
            let savedCard = JSON.parse(reader.result);

            card.title.querySelector('span').textContent = savedCard.title;
            imgDrop.style.backgroundImage = savedCard.image;
            colorChanger.value = savedCard.color;
            typeDrop.style.backgroundImage = savedCard.typeImg;
            document.querySelector('.typetitle').textContent = savedCard.type;
            document.querySelector('.franchise').textContent = savedCard.franchise;
            document.querySelector('.description').textContent = savedCard.description;
            inputs.squish.value = savedCard.squish;
            darkToggle.checked = savedCard.darkMode;

            toggleDarkness();
            setRGB();

        });

        reader.readAsText(e.target.files[0]);
    }
}

document.querySelector('#loadUpload').addEventListener('change', loadFile);

for (let button of saveButtons) {
    button.addEventListener('click', saveFile);
}