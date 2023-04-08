'use strict';

const cards = [],
      carde = document.querySelector('#cards'),
      cardAdder = document.querySelector('#newCard'),
      bigCard = document.querySelector('#bigCard');

// get data URI from file
function setImageFromFile(images, element) {
    let imageFile = images[0];

    var reader = new FileReader();

    reader.onload = function(e) {
        element.style.backgroundImage = 'url("' + this.result + '")';
        cardAdder.value = null;
    }

    reader.readAsDataURL(imageFile);
}

function onCardPointerDown(e) {

    let card = cards[this.getAttribute('data-index')];

    card.clicked = true;

    let r = card.e.getBoundingClientRect();

    card.origin = [
        e.clientX - r.left,
        e.clientY - r.top
    ];

    carde.appendChild(card.e);

    e.preventDefault();
}

function onCardPointerUp(e) {
    for (let card of cards) {
        if (card.clicked) {
            if (!card.moved) {
                card.e.classList.toggle('hidden');
            }

            card.clicked = false;
            card.moved = false;
        }
    }
}

function onCardPointerMove(e) {
    for (let card of cards) {
        if (card.clicked) {
            card.moved = true;
    
            let x = e.clientX + document.querySelector(':root').scrollLeft - card.origin[0];
            let y = e.clientY + document.querySelector(':root').scrollTop - card.origin[1];
    
            card.e.style.left = x + 'px';
            card.e.style.top = y + 'px';
        }
    }

    e.preventDefault();
}

function onCardPointerOver(e) {
    let card = cards[this.getAttribute('data-index')];
    if (card.e.classList.contains('hidden')) { return; }

    bigCard.style.backgroundImage = card.e.style.backgroundImage;
}

function onCardPointerOut(e) {
    bigCard.style.backgroundImage = '';
}

function createCard() {
    let card = {
        e: document.createElement('div'),
        clicked: false,
        moved: false,
        origin: [0,0]
    }

    card.e.classList.add('card');

    carde.appendChild(card.e);
    cards.push(card);

    card.e.setAttribute('data-index', cards.indexOf(card));

    card.e.addEventListener('pointerdown', onCardPointerDown);
    card.e.addEventListener('pointerover', onCardPointerOver);
    card.e.addEventListener('pointerout', onCardPointerOut);

    return card;
}

cardAdder.addEventListener('change', async (e) => {
    let card = createCard();
    setImageFromFile(cardAdder.files, card.e);
});

document.body.addEventListener('pointermove', onCardPointerMove);
document.body.addEventListener('pointerup', onCardPointerUp);