'use strict';

const bigCard = document.querySelector('#bigCard');

bigCard.addEventListener('click', () => {
    bigCard.classList.add('hidden');
});

// get data URI from file
function setImageFromFile(images, element) {
    let imageFile = images[0];

    var reader = new FileReader();

    reader.onload = function(e) {
        element.style.backgroundImage = 'url("' + this.result + '")';
        // cardAdder.value = null;
    }

    reader.readAsDataURL(imageFile);
}

function reslot(card) {
    if (card.slot) {
        // Slots are the only space that can hold 1 card.
        if (card.slot.constructor == Slot){
            // this will match slots but not effect slots
            card.slot.card = null;
        } else {
            card.slot.cards.splice(card.slot.cards.indexOf(card), 1)
        }
    }
}

// TODO: inspect button on cards
export class Card {
    constructor(name, img) {
        this.name = name;
        // console.log(name, img);

        this.e = document.createElement('div');
        this.e.classList.add('card');

        this.clicked = false;
        this.moved = false;
        this.origin = [0,0];

        this.reveal(img);

        let inspectButton = document.createElement('div');
        inspectButton.classList.add('inspectButton');
        this.e.appendChild(inspectButton);

        inspectButton.addEventListener('click', (e) => {
            bigCard.style.backgroundImage = this.e.style.backgroundImage;
            bigCard.classList.remove('hidden');
            e.stopPropagation();
        }, {useCapture: true});

        this.slot = null;
    }

    reveal(img){
        if (img.startsWith('./')) {
            img = encodeURI(img);
            this.e.style.backgroundImage = 'url("' + img + '")';
        } else {
            setImageFromFile(img, this.e);
        }
    }

    valueOf() {
        return this.name;
    }

    exhaust(b) {
        if (b === true) {
            this.e.classList.add('tapped');
            return true;
        } else if (b === false) {
            this.e.classList.remove('tapped');
            return false;
        } else {
            return this.e.classList.contains('tapped');
        }
    }

    addToken() {
        if (!this.tokens) {
            this.tokens = document.createElement('div');
            this.tokens.classList.add('tokens');
            this.e.appendChild(this.tokens);
        }

        let token = document.createElement('div');
        token.classList.add('icon', 'token');
        this.tokens.appendChild(token);
    }

    removeToken() {
        if (!this.tokens) { return; }
        this.tokens.firstElementChild.remove();
    }

    remove() {
        reslot(this);
        this.e.remove();
        // and now we pray that the garbage collector gods hear our plea
    }

    attach(card) {
        if (!this.attachments) {
            this.attachments = [];
        }
        reslot(card);
        this.attachments.push(card);
        this.e.append(card.e);
    }
}

class Slot {
    constructor(e) {
        this.e = e;

        this.holder = document.createElement('div');
        this.holder.classList.add('holder');
        e.appendChild(this.holder);
    }

    attach(card) {
        if (this.card) {
            throw new Error('This slot already has a card.');
        }

        reslot(card);
        card.slot = this;

        this.holder.appendChild(card.e);
        this.card = card;
    }

    valueOf() {
        return this.e
    }
}

class EffectSlot extends Slot {
    constructor(e) {
        super(e);
        this.cards = [];
    }

    attach(card) {
        this.holder.appendChild(card.e);
        this.cards.push(card);

        reslot(card);
        card.slot = this;
    }

    valueOf() {
        return this.e
    }
}

class Deck {
    constructor(e) {
        this.e = e;
        this.cards = [];

        this.holder = document.createElement('div');
        this.e.appendChild(this.holder);
        this.holder.classList.add('holder');
    }

    valueOf() {
        return this.e
    }

    attach(card) {
        this.holder.appendChild(card.e);
        this.cards.push(card);

        reslot(card);
        card.slot = this;
    }

    getCard(card) {
        return this.cards.find(c => c.name == card);
    }
}

class Hand {
    constructor(e) {
        this.e = e;
        this.cards = [];
    }

    attach(card) {
        this.cards.push(card);
        this.e.appendChild(card.e);

        reslot(card);
        card.slot = this;
    }
    
    getCard(query) {
        return this.cards.find(c => c.name == query);
    }
}

export const CARDS = [],
       BOARD = {
    player: {
        front: [],
        back: [],
        effects: {
            left: null,
            right: null
        },
        commander: null,
        deck: null,
        discard: null,
        specialDeck: null,
        engine: null,
        hand: null
    },
    opponent: {
        front: [],
        back: [],
        effects: {
            left: null,
            right: null
        },
        commander: null,
        deck: null,
        discard: null,
        specialDeck: null,
        engine: null,
        hand: null
    },
    location: new Slot(document.querySelector('.locationSlot'))
}

for (let p of ['player', 'opponent']) {
    for (let i of ['front', 'back']) {
        for (let e of document.querySelectorAll('#' + p + ' .' + i + ' .slot')) {
            BOARD[p][i].push(new Slot(e));
        }
    }
    let es = document.querySelectorAll('#' + p + ' .effects');

    for (let e = 0; e < es.length; e++) {
        let id = ['left', 'right'][e];
        BOARD[p]['effects'][id] = new EffectSlot(es[e]);
    }

    BOARD[p].commander = new Slot(document.querySelector('#' + p + ' .slot.commanderSlot'));
    BOARD[p].engine = new Slot(document.querySelector('#' + p + ' .slot.engineSlot'));

    BOARD[p].deck = new Deck(document.querySelector('#' + p + ' .deck.normal'));
    BOARD[p].specialDeck = new Deck(document.querySelector('#' + p + ' .deck.tf'));
    BOARD[p].discard = new Deck(document.querySelector('#' + p + ' .deck.discard'));
    BOARD[p].hand = new Hand(document.querySelector('#' + p + ' .hand'));
}