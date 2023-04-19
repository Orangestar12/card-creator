'use strict';

import {BOARD, Card} from './structures.js';
import {sleep, makeTooltip, ALIGN} from "./helper.js";

function set(player, meta, value) {
    let x = '#';

    switch (player){
        case 'player':
            x += 'player';
            break;
        case 'opponent':
            x += 'opp';
            break;
    }
    
    switch (meta) {
        case 'hp':
            x += 'HP';
            break;
        case 'energy':
            x += 'Energy';
            break;
    }

    document.querySelector(x).textContent = value;
}

async function modal(text, choices) {
    let modal = document.createElement('div');
    modal.classList.add('modal');
    let p = document.createElement('p');
    p.textContent = text;
    let buttons = document.createElement('div');
    buttons.classList.add('flex');

    modal.appendChild(p);
    modal.appendChild(buttons);
    
    document.body.appendChild(modal);

    return new Promise(resolve => {
        for (let choice of choices) {
            let button = document.createElement('button');
            button.textContent = choice.text;
            buttons.appendChild(button);
            button.addEventListener('click', choice.callback);
            button.addEventListener('click', resolve);
            button.addEventListener('click', ()=>{modal.remove()});
        }
    });
}

async function main() {
    await makeTooltip(
        'Welcome to 3.0! This mock game is intended to teach you the rules.',
        {
            x:28, y:28,
            align: ALIGN.top | ALIGN.left
        }
    );

    BOARD.player.commander.attach(new Card('CEO Nwabudike Morgan', './cards/Sid Meiers/CEO Nwabudike Morgan.png'));
    BOARD.opponent.commander.attach(new Card('The Gray Man', './cards/LSD Dream Emulator/The Gray Man.png'));
    await makeTooltip(
        'Every deck needs a COMMANDER. It\'s separate from your deck,\nand placed in this slot.',
        {
            x:280, y:290,
            align: ALIGN.bottom | ALIGN.right
        }
    );

    BOARD.player.engine.attach(new Card('The Gibson', './cards/Hackers/The Gibson.png'));
    BOARD.opponent.engine.attach(new Card('Arc Reactor', './cards/Marvel/Arc Reactor.png'));
    await makeTooltip(
        'You should also have an ENGINE as a source of constant ENERGY. Technically, your deck doesn\'t NEED an ENGINE, but you have no reason not to have one.',
        {
            x:280, y:290,
            align: ALIGN.bottom | ALIGN.right
        }
    );

    BOARD.player.hand.attach(new Card('Aragorn', './cards/Lord of the Rings/Aragorn.png'));
    BOARD.opponent.hand.attach(new Card('Hidden', './cards/bg.png'));
    await sleep(100);
    BOARD.player.hand.attach(new Card('Kiyotaka Ishimaru', './cards/Danganronpa/Kiyotaka Ishimaru.png'));
    BOARD.opponent.hand.attach( new Card('Hidden','./cards/bg.png'));
    await sleep(100);
    BOARD.player.hand.attach(new Card('Secret Project: The Cloning Vats', './cards/Sid Meiers/Secret Project_ The Cloning Vats.png'));
    BOARD.opponent.hand.attach( new Card('Hidden','./cards/bg.png'));
    await sleep(100);
    BOARD.player.hand.attach(new Card('Dante', './cards/Devil May Cry/Dante.png'));
    BOARD.opponent.hand.attach( new Card('Hidden','./cards/bg.png'));
    await sleep(100);
    BOARD.player.hand.attach(new Card('Crazy Hassan\'s Better-Than-New Used Camels', './cards/Memes/Crazy Hassan\'s Better-Than-New Used Camels.png'));
    BOARD.opponent.hand.attach( new Card('Hidden','./cards/bg.png'));
    await sleep(100);
    await makeTooltip(
        'At the start of each game, both players draw 5 cards.',
        {
            x:150, y:130,
            align: ALIGN.bottom | ALIGN.right
        }
    );

    set('player','hp','8')
    set('opponent','hp','4')
    await makeTooltip(
        'Your COMMANDER\'s DEF is converted into your HP. When this hits zero, you lose. When your opponent\'s reaches zero, you win.',
        {
            x:370, y:170,
            align: ALIGN.bottom | ALIGN.left
        }
    );

    set('player','energy','2')
    await makeTooltip(
        'You\'ll go first. Your ENGINE card will have a constant effect that should generate some ENERGY to start off with.\n\nIn this case, The Gibson gives you 2 ENERGY this turn.',
        {
            x:370, y:170,
            align: ALIGN.bottom | ALIGN.right
        }
    );

    BOARD.player.hand.attach(new Card('Sayaka Maizono', './cards/Danganronpa/Sayaka Maizono.png'));
    await makeTooltip(
        'You also get to draw a card on your turn.',
        {
            x:90, y:120,
            align: ALIGN.bottom | ALIGN.right
        }
    );

    await makeTooltip(
        'The Nwabudike Morgan COMMANDER can swarm the field with many cards in one turn with a bit of luck and spending, which generates more ENERGY for an easy snowball. We\'ll walk you through this game plan.',
        {
            x:0, y:290,
            align: ALIGN.bottom | ALIGN.left
        }
    );

    await makeTooltip(
        'You can play one CHARACTER every turn with no strings attached. This is referred to as playing a CHARACTER "Normally".',
        {
            x:0, y:290,
            align: ALIGN.bottom | ALIGN.left
        }
    );

    await makeTooltip(
        'Cards whose ATTACK and DEFENSE stats are both 5 or less can be played to the Front Lines.',
        {
            x:150, y:730,
            align: ALIGN.top | ALIGN.left
        }
    );

    await makeTooltip(
        'Otherwise, they must be played to your Back Lines.',
        {
            x:210, y:440,
            align: ALIGN.bottom | ALIGN.left
        }
    );

    let choice = null;

    await makeTooltip(
        'Let\'s start with a back lines character. Since these cards are powerful, they make a good starter CHARACTER. Pick either Aragorn or Dante as your normal play card.',
        {
            x:210, y:140,
            align: ALIGN.bottom | ALIGN.left
        },
        () => { return new Promise(resolve => {
            for(let card of ['Aragorn', 'Dante']) {
                let c = BOARD.player.hand.getCard(card)
                c.e.classList.add('clickable');
                c.e.addEventListener('click', () => {
                    if (!choice){choice = c;}
                    resolve();
                });
            }
        })}
    );

    for(let card of ['Aragorn', 'Dante']) {
        let c = BOARD.player.hand.getCard(card)
        c.e.classList.remove('clickable');
    }

    choice.e.classList.add('chosen');

    let slot = null;

    await makeTooltip(
        'Now pick one of the Back Line slots to play it on.',
        {
            x:210, y:870,
            align: ALIGN.top | ALIGN.left
        },
        () => { return new Promise(resolve => {
            for(let s of BOARD.player.back) {
                s.e.classList.add('clickable');
                s.e.addEventListener('click', () => {
                    if(!slot){slot = s;}
                    resolve();
                });
            }
        })}
    );

    for(let slot of BOARD.player.back) {
        slot.e.classList.remove('clickable');
    }

    let cont = false;
    while (!cont){
        if (choice.name == 'Aragorn') {
            await makeTooltip(
                'When you play a CHARACTER normally, you can choose to play it face up, or face down. Face down cards can\'t proc effects (unless explicitly stated), but you can bait your opponent into attacking them.\n\nWe want Anduril to proc on the next turn, so lets put this card face-up.',
                {
                    x:210, y:870,
                    align: ALIGN.top | ALIGN.left
                },
                async () => { 
                    await modal(
                        'Set face up or face down?',
                        [
                            { text: 'Face up.', callback: () => { cont = true; } },
                            { text: 'Face down.', callback: () => {} }
                        ]
                    );
                }
            );
        } else {
            await makeTooltip(
                'When you play a CHARACTER normally, you can choose to play it face up, or face down. Face down cards can\'t proc effects (unless explicitly stated), but you can bait your opponent into attacking them.\n\nFor our first turn, we should declare the effect of Stylish! - Trickster to buff Dante rather than bluffing its strength. Play this card face-up.',
                {
                    x:210, y:870,
                    align: ALIGN.top | ALIGN.left
                },
                async () => { 
                    await modal(
                        'Set face up or face down?',
                        [
                            { text: 'Face up', callback: () => { cont = true; } },
                            { text: 'Face down', callback: () => {} }
                        ]
                    );
                }
            );
        }
    }

    slot.attach(choice);
    choice.e.classList.remove('chosen');

    await makeTooltip(
        'You can spend ENERGY to attack on most turns. However, you can\'t do it on your first turn.',
        {
            x:230, y:155,
            align: ALIGN.bottom | ALIGN.left
        }
    );
    
    if (choice.name == 'Aragorn') {
        choice = BOARD.player.hand.getCard('Dante')
    } else {
        choice = BOARD.player.hand.getCard('Aragorn')
    }

    choice.e.classList.add('clickable');
    await makeTooltip(
        'CEO Morgan has a better use of energy, though. Pick the other back-row card to spend 1 ENERGY to play it.',
        {
            x:280, y:290,
            align: ALIGN.bottom | ALIGN.left
        },
        () => { return new Promise(resolve => {
            choice.e.addEventListener('click', resolve);
        })}
    );

    choice.e.classList.add('chosen');
    choice.e.classList.remove('clickable');
    slot = null;

    await makeTooltip(
        'Play it in the other back slot.',
        {
            x:210, y:870,
            align: ALIGN.top | ALIGN.left
        },
        () => { return new Promise(resolve => {
            for(let s of BOARD.player.back) {
                if (s.card) {
                    continue;
                }

                s.e.classList.add('clickable');
                s.e.addEventListener('click', () => {
                    if(!slot){slot = s;}
                    resolve();
                });
            }
        })}
    );

    for(let s of BOARD.player.back) {
        s.e.classList.remove('clickable');
    }

    slot.attach(choice);
    set('player', 'energy', '1');
    choice.e.classList.remove('chosen');

    await makeTooltip(
        'You don\'t get to play face-down if you\'re not playing normally, so you\'ll need to weigh whether losing the ability to bluff is worth playing the card. (It usually is, but, you know, worth thinking about.)',
        {
            x:210, y:870,
            align: ALIGN.top | ALIGN.left
        }
    );

    choice = BOARD.player.hand.getCard('Sayaka Maizono');
    await makeTooltip(
        'Let\'s spend that last energy to play a front lines card. Play Sayaka.',
        {
            x:120, y:730,
            align: ALIGN.top | ALIGN.left
        },
        () => { return new Promise(resolve => {
            choice.e.classList.add('clickable');
            choice.e.addEventListener('click', resolve);
        })}
    );

    choice.e.classList.remove('clickable');
    choice.e.classList.add('chosen');
    
    slot = null;

    await makeTooltip(
        'Now pick one of the Front Line slots to play it on.',
        {
            x:120, y:730,
            align: ALIGN.top | ALIGN.left
        },
        () => { return new Promise(resolve => {
            for(let s of BOARD.player.front) {
                s.e.classList.add('clickable');
                s.e.addEventListener('click', () => {
                    if(!slot){slot = s;}
                    resolve();
                });
            }
        })}
    );

    for(let slot of BOARD.player.front) {
        slot.e.classList.remove('clickable');
    }
    
    slot.attach(choice);

    choice.e.classList.remove('chosen');

    set('player', 'energy', 0);

    choice = BOARD.player.hand.getCard('Crazy Hassan\'s Better-Than-New Used Camels');
    choice.e.classList.add('clickable');

    await makeTooltip(
        'Your turn\'s not over yet! It\'s time to talk about INSTANTs.\n\nYou can play an INSTANT card on your turn. As the name suggests, the effects occur instantly. let\'s play Crazy Hassan\'s Better-Than-New Used Camels.',
        {
            x:120, y:120,
            align: ALIGN.bottom | ALIGN.left
        },
        () => { return new Promise(resolve => {
            choice.e.addEventListener('click', resolve);
        })}
    );

    choice.e.classList.remove('clickable');
    BOARD.player.effects.left.attach(choice);

    for (let player of ['player', 'opponent']) {
        for (let slot of BOARD[player].front) {
            if (slot.card) { continue; }
            let camel = new Card('Slightly Incontinent Camel', './cards/Memes/Slightly Incontinent Camel.png');
            slot.attach(camel);
        }
    }

    await makeTooltip(
        'Thankfully, your opponent just made a horrific blunder trying to understand the purposefully confusing text of the card, and confidently responded with "No." You both get a full suite of camels!',
        {
            x:120, y:120,
            align: ALIGN.bottom | ALIGN.left
        }
    );

    BOARD.player.discard.attach(choice);

    await makeTooltip(
        'Ok, NOW your turn is over. Its the opponent\'s turn.',
        {
            x:120, y:450,
            align: ALIGN.top | ALIGN.left
        }
    );
    
    set('opponent', 'energy', '1');
    await makeTooltip(
        'Your opponent gets 1 ENERGY from their ENGINE...',
        {
            x:140, y:290,
            align: ALIGN.top | ALIGN.left
        }
    );
    
    BOARD.opponent.hand.attach(new Card('Hidden', './cards/bg.png'));
    await makeTooltip(
        '...and gets to draw a card.',
        {
            x:240, y:115,
            align: ALIGN.top | ALIGN.left
        }
    );

    await makeTooltip(
        'Your opponent has ended their turn with no actions. What are they planning?.',
        {
            x:240, y:115,
            align: ALIGN.top | ALIGN.left
        }
    );

    set('player', 'energy', '2');
    await makeTooltip(
        'Let\'s tally up your ENERGY for this round.\n\n2 from The Gibson...',
        {
            x:250, y:290,
            align: ALIGN.bottom | ALIGN.right
        }
    );

    set('player', 'energy', '4');
    await makeTooltip(
        '...plus two more for Morgan\'s COMMANDER effects.',
        {
            x:370, y:290,
            align: ALIGN.bottom | ALIGN.left
        }
    );

    choice = BOARD.player.back.find(c => c.card.name == 'Aragorn').card;

    choice.addToken();
    await makeTooltip(
        'Aragorn gets a Shard.',
        {
            x:280, y:420,
            align: ALIGN.bottom | ALIGN.left
        }
    );

    BOARD.player.hand.attach(new Card('White Noise', './cards/Danganronpa/White Noise.png'));
    await makeTooltip(
        'And don\'t forget to draw a card.',
        {
            x:200, y:120,
            align: ALIGN.bottom | ALIGN.right
        }
    );

    await makeTooltip(
        'We don\'t need to play any characters, since we don\'t have the space for it. Let\'s move on to the combat phase.',
        {
            x:200, y:120,
            align: ALIGN.bottom | ALIGN.right
        }
    );

    await makeTooltip(
        'If there are cards in your Front Row you cannot attack with cards on your Back Row (unless the card specifies otherwise.) Similarly, you cannot attack cards on your opponent\'s Back Row if their Front Row is occupied.\n\nIn the same vein, normally the Commander can only be attacked if all other cards have been eliminated.',
        {
            x:200, y:880,
            align: ALIGN.top | ALIGN.right
        }
    );

    let energy = 4;
    let needToExplainExhaustion = true;
    let needToExplainTies = true;

    while(BOARD.opponent.front.some(s => s.card)) {
        await makeTooltip(
            'Select a card from your Front Row to attack.',
            {
                x:65, y:740,
                align: ALIGN.top | ALIGN.right
            },
            async () => {
                return new Promise(resolve => {
                    for (let slot of BOARD.player.front) {
                        if (slot.card && !slot.card.exhaust()) {
                            slot.card.e.classList.add('clickable');
                            slot.card.e.addEventListener('click', ()=>{
                                choice = slot.card;
                                resolve();
                            });
                        }
                    }
                })
            }
        );

        for (let slot of BOARD.player.front) {
            if (slot.card){
                slot.card.e.classList.remove('clickable');
            }
        }
        choice.e.classList.add('chosen');
    
        let opponent = null;
    
        await makeTooltip(
            'Now pick a card to attack.',
            {
                x:65, y:740,
                align: ALIGN.top | ALIGN.right
            },
            async () => {
                return new Promise(resolve => {
                    for (let slot of BOARD.opponent.front) {
                        if (slot.card) {
                            slot.card.e.classList.add('clickable');
                            slot.card.e.addEventListener('click', ()=>{
                                opponent = slot.card;
                                resolve();
                            });
                        }
                    }
                });
            }
        );
    
        energy--;
        set('player','energy', energy);
    
        opponent.e.classList.add('chosen');

        if (choice.name == 'Slightly Incontinent Camel'){
            if(needToExplainTies) {
                await makeTooltip(
                    'If a card\'s ATK and its opponent\'s DEF are equal, both cards are discarded.',
                    {
                        x:65, y:740,
                        align: ALIGN.top | ALIGN.right
                    }
                );
                needToExplainTies = false;
            }
            BOARD.player.discard.attach(choice);
        } else {
            choice.exhaust(true);
            if (needToExplainExhaustion) {
                await makeTooltip(
                    'When a card attacks or performs certain abilities, it is EXHAUSTED, visually represented by rotating the card sideways. EXHAUSTED cards cannot perform actions.',
                    {
                        x:65, y:740,
                        align: ALIGN.top | ALIGN.right
                    }
                );
                needToExplainExhaustion = false;
            }
        }
        choice.e.classList.remove('chosen');
        opponent.e.classList.remove('chosen');
        BOARD.opponent.discard.attach(opponent);
    }

    BOARD.opponent.hand.attach(new Card('Hidden', './cards/bg.png'));
    set('opponent','energy', '1');
    await makeTooltip(
        'It\'s your opponent\'s turn now. They draw a card and get 1 energy.',
        {
            x:50, y:440,
            align: ALIGN.top | ALIGN.right
        }
    );

    choice = BOARD.opponent.hand.cards[0];
    BOARD.opponent.front[0].attach(choice);
    choice.reveal('./cards/Spookys/Specimen 10.png');
    choice.name = 'Specimen 10';

    await makeTooltip(
        'They play Specimen 10 to the front lines.',
        {
            x:140, y:730,
            align: ALIGN.bottom | ALIGN.right
        }
    );

    choice = BOARD.opponent.hand.cards[0];
    BOARD.location.attach(choice);
    choice.reveal('./cards/Spookys/Specimen 7.png');
    choice.name = 'Specimen 7';

    await makeTooltip(
        'They also play Specimen 7 to the LOCATION slot.\n\nLOCATIONs effect both players, buffing or nerfing in turn. Specimen 7 works as an anti-negate, increasing the pressure on Front Line soldiers if combat comes up nil.',
        {
            x:110, y:620,
            align: ALIGN.bottom | ALIGN.left
        }
    );
    BOARD.opponent.front[0].card.e.classList.add('chosen');

    BOARD.player.front.find(s => s.card && s.card.name == 'Sayaka Maizono').card.e.classList.add('chosen');

    set('opponent', 'energy', '0');
    await makeTooltip(
        'Your opponent has declared an attack. It\'s not a complete loss, though!',
        {
            x:280, y:590,
            align: ALIGN.bottom | ALIGN.right
        }
    );

    choice = BOARD.player.hand.getCard('White Noise');
    choice.e.classList.add('clickable');
    await makeTooltip(
        'Reaction cards can be played at various points in the game, as described by their first line. Let\'s play White Noise to force an attack on your opponent.',
        {
            x:200, y:120,
            align: ALIGN.bottom | ALIGN.right
        },
        async () => {
            return new Promise(resolve => {
                choice.e.addEventListener('click', ()=>{
                    resolve();
                });
            });
        }
    );

    BOARD.player.effects.left.attach(choice);
    choice.e.classList.remove('clickable');
    
    await makeTooltip(
        'Either back row card can win this fight, so pick one.',
        {
            x:200, y:880,
            align: ALIGN.top | ALIGN.right
        },
        async () => {
            return new Promise(resolve => {
                for (let slot of BOARD.player.back) {
                    slot.card.e.classList.add('clickable');
                    slot.card.e.addEventListener('click', ()=>{
                        choice = slot.card;
                        resolve();
                    });
                }
            });
        }
    );

    for (let slot of BOARD.player.back) {
        slot.card.e.classList.remove('clickable');
    }

    choice.e.classList.add('chosen');

    await makeTooltip(
        'When a CHARACTER declares an attack on another, and the attacked card is not discarded by the end of the combat, this is referred to as a "Successful Defense". You might also see "not discarded as a result of combat" or other such phrases.',
        {
            x:380, y:645,
            align: ALIGN.bottom | ALIGN.right
        }
    );

    choice.e.classList.remove('chosen');
    BOARD.player.front.find(s => s.card && s.card.name == 'Sayaka Maizono').card.e.classList.remove('chosen');
    BOARD.opponent.front[0].card.e.classList.remove('chosen');
    BOARD.opponent.front[0].card.exhaust(true);

    BOARD.opponent.front[1].attach(new Card('Specimen 10 (2nd Form)', './cards/Spookys/Specimen 10 (2nd Form).png'));
    BOARD.location.card.addToken();

    let c = BOARD.player.effects.left.cards[0];
    BOARD.player.discard.attach(c);

    await makeTooltip(
        'Successful defenses can proc abilities. In this case, Specimen 7 gets a "Closing In", and a Specimen 10 (2nd Form) token is created.',
        {
            x:380, y:645,
            align: ALIGN.bottom | ALIGN.right
        }
    );

    set('player', 'energy', '7');
    BOARD.player.hand.attach(new Card('Execute', './cards/Warhammer/Execute.png'));
    BOARD.player.back.find(s => s.card && s.card.name == 'Aragorn').card.addToken();
    await makeTooltip(
        'Your opponent has declared the end of their turn.\nYou get 2 ENERGY from the ENGINE and 1 from your COMMANDER.\nYou also draw a card, and Aragorn gets another shard.',
        {
            x:300, y:300,
            align: ALIGN.bottom | ALIGN.left
        }
    );

    BOARD.player.front.find(s => s.card && s.card.name == 'Sayaka Maizono').card.exhaust(false);
    
    await makeTooltip(
        'Also, any exhausted cards are restored at the start of your turn.',
        {
            x:300, y:700,
            align: ALIGN.top | ALIGN.left
        }
    );

    choice = BOARD.player.hand.getCard('Kiyotaka Ishimaru');
    choice.e.classList.add('clickable');

    await sleep(10);

    await makeTooltip(
        'We\'ve got a spare slot to play Kiyotaka, so let\'s do it.',
        {
            x:210, y:120,
            align: ALIGN.bottom | ALIGN.left
        },
        () => {
            return new Promise(resolve => {
                choice.e.addEventListener('click', resolve);
            });
        }
    );

    choice.e.classList.remove('clickable');
    slot = null;

    await makeTooltip(
        'Pick a Front Lines slot.',
        {
            x:120, y:730,
            align: ALIGN.top | ALIGN.left
        },
        () => {
            return new Promise(resolve => {
                for (let s of BOARD.player.front) {
                    if (s.card) { continue; }
                    s.e.classList.add('clickable');
                    s.e.addEventListener('click', () => {
                        if(!slot){slot = s;}
                        resolve();
                    });
                }
            });
        }
    );

    slot.attach(choice);
    for (slot of BOARD.player.front) { slot.e.classList.remove('clickable'); }

    choice = BOARD.player.front.find(s => s.card && s.card.name == 'Sayaka Maizono').card;
    choice.e.classList.add('clickable');

    await makeTooltip(
        'Let\'s send Sayaka after that token.',
        {
            x:120, y:730,
            align: ALIGN.top | ALIGN.left
        },
        () => {
            return new Promise(resolve => {
                choice.e.addEventListener('click', resolve)
            });
        }
    );
    
    choice.e.classList.remove('clickable');
    choice.e.classList.add('chosen');

    choice = BOARD.opponent.front.find(s => s.card && s.card.name == 'Specimen 10 (2nd Form)').card;
    choice.e.classList.add('clickable');

    await makeTooltip(
        'Let\'s send Sayaka after that token.',
        {
            x:120, y:730,
            align: ALIGN.top | ALIGN.left
        },
        () => {
            return new Promise(resolve => {
                choice.e.addEventListener('click', resolve)
            });
        }
    );

    set('player','energy','6');
    choice.e.classList.remove('clickable');
    choice.e.classList.add('chosen');
    choice = BOARD.opponent.hand.cards[0];
    BOARD.opponent.front[2].attach(choice);
    choice.reveal('./cards/Spookys/Specimen 1.png');
    choice.name = 'Specimen 1';

    await makeTooltip(
        'Looks like your opponent has a card to interrupt the combat.',
        {
            x:140, y:580,
            align: ALIGN.top | ALIGN.left
        }
    );

    choice = BOARD.player.front.find(s => s.card && s.card.name == 'Sayaka Maizono').card;
    choice.e.classList.remove('chosen');
    choice.exhaust(true);
    BOARD.opponent.front.find(s => s.card && s.card.name == 'Specimen 10 (2nd Form)').card.e.classList.remove('chosen');
    BOARD.location.card.addToken();
    await makeTooltip(
        'We\'ll apply a token to Specimen 7 and discard all cards with a DEF lower than 1.',
        {
            x:140, y:580,
            align: ALIGN.top | ALIGN.left
        }
    );

    BOARD.opponent.discard.attach(BOARD.opponent.front[2].card);
    BOARD.opponent.discard.attach(BOARD.opponent.front[1].card);
    await makeTooltip(
        '...That didn\'t seem to work out very well for your opponent, but we can\'t do much in response unfortunately. Your turn is over.',
        {
            x:140, y:580,
            align: ALIGN.top | ALIGN.left
        }
    );

    set('opponent', 'energy', '1');
    BOARD.opponent.front[0].card.exhaust(false);
    BOARD.opponent.hand.attach(new Card('Hidden', './cards/bg.png'));
    await makeTooltip(
        'It\'s your opponent\'s turn. They get 1 ENERGY from their ENGINE and draw a card.',
        {
            x:240, y:155,
            align: ALIGN.top | ALIGN.left
        }
    );

    BOARD.opponent.back[0].attach(BOARD.opponent.hand.cards[0]);
    BOARD.opponent.back[0].card.reveal('./cards/DOOM/Revenant.png');
    BOARD.opponent.back[0].card.name = 'Revenant';
    await makeTooltip(
        'They play Revenant on their Back Line.',
        {
            x:300, y:440,
            align: ALIGN.top | ALIGN.right
        }
    );

    BOARD.opponent.effects.left.attach(BOARD.opponent.hand.cards[0]);
    BOARD.opponent.effects.left.cards[0].reveal('./cards/Warframe/Defense Mission.png');
    BOARD.opponent.effects.left.cards[0].name = 'Defense Mission';
    await makeTooltip(
        'They declare their combat phase, and play Defense Mission.',
        {
            x:50, y:440,
            align: ALIGN.top | ALIGN.right
        }
    );
    await makeTooltip(
        'An important distinction: while you can play INSTANT cards during any part of your turn, you can only play ITEM cards during your Main Phase - that is, the one before the Combat Phase.',
        {
            x:50, y:440,
            align: ALIGN.top | ALIGN.right
        }
    );

    BOARD.opponent.back[0].card.e.classList.add('chosen');
    BOARD.player.front.find(s => s.card && s.card.name == 'Kiyotaka Ishimaru').card.e.classList.add('chosen');
    set('opponent', 'energy', '0');

    choice = BOARD.player.front.find(s => s.card && s.card.name == 'Sayaka Maizono').card;
    choice.e.classList.add('clickable');
    await makeTooltip(
        'Your opponent has declared that they are using Revenant\'s ability to attack Kiyotaka. I\'ve got a better idea.\n\nFirst, declare Sayaka\'s ability.',
        {
            x:380, y:600,
            align: ALIGN.bottom | ALIGN.left
        },
        async () => { return new Promise(resolve => {
            choice.e.addEventListener('click', resolve);
        });}
    );

    choice.e.classList.add('chosen');
    choice.e.classList.remove('clickable');

    let opponent = BOARD.opponent.front.find(s => s.card && s.card.name == 'Specimen 10').card;
    
    opponent.e.classList.add('clickable');

    await makeTooltip(
        'Force Specimen 10 to attack Sayaka.',
        {
            x:250, y:480,
            align: ALIGN.top | ALIGN.right
        },
        async () => { return new Promise(resolve => {
            opponent.e.addEventListener('click', resolve);
        });}
    );

    opponent.e.classList.add('chosen');
    opponent.e.classList.remove('clickable');

    let mc = BOARD.opponent.hand.cards[0];
    BOARD.opponent.effects.right.attach(mc);
    mc.reveal('./cards/DOOM/Monster Closet.png');
    mc.name = 'Monster Closet';

    let spec = BOARD.opponent.hand.cards[0];
    BOARD.opponent.front[2].attach(spec);
    spec.reveal('./cards/Spookys/Specimen 10.png');
    spec.name = 'Specimen 10';

    await makeTooltip(
        'Your opponent interrupts with Monster Closet, allowing them to play another Specimen 10.',
        {
            x:190, y:730,
            align: ALIGN.bottom | ALIGN.left
        }
    );

    BOARD.opponent.discard.attach(mc);
    BOARD.location.card.addToken();
    choice.e.classList.remove('chosen');
    opponent.e.classList.remove('chosen');
    opponent.exhaust(true);
    await makeTooltip(
        'Specimen 10 can\'t defeat Sayaka, so she defends, which adds a token to Specimen 7.',
        {
            x:380, y:600,
            align: ALIGN.top | ALIGN.left
        }
    );
    BOARD.opponent.front[1].attach(new Card('Specimen 10 (2nd Form)', './cards/Spookys/Specimen 10 (2nd Form).png'));
    await makeTooltip(
        'It also creates a 2nd form...',
        {
            x:380, y:600,
            align: ALIGN.top | ALIGN.left
        }
    );
    BOARD.opponent.discard.attach(BOARD.opponent.front[1].card);
    await makeTooltip(
        '...but it is immediately discarded due to the ability of Specimen 7.',
        {
            x:380, y:600,
            align: ALIGN.top | ALIGN.left
        }
    );

    choice = BOARD.player.front.find(s => s.card && s.card.name == 'Kiyotaka Ishimaru').card;
    choice.e.classList.add('clickable');
    await makeTooltip(
        'Revenant\'s attack can finally begin. Negate it with Kiyotaka\'s ability.',
        {
            x:300, y:440,
            align: ALIGN.top | ALIGN.left
        },
        async () => { return new Promise(resolve => {
            choice.e.addEventListener('click', resolve);
        });}
    );
    
    choice.e.classList.remove('clickable');

    opponent = BOARD.opponent.back[0].card;
    opponent.e.classList.remove('chosen');
    opponent.exhaust(true);
    BOARD.player.front.find(s => s.card && s.card.name=='Kiyotaka Ishimaru').card.e.classList.remove('chosen');

    BOARD.location.card.addToken();

    await makeTooltip(
        'This final defense adds one last token to Specimen 7...',
        {
            x:70, y:640,
            align: ALIGN.bottom | ALIGN.left
        }
    );

    choice = BOARD.player.front.find(s => s.card && s.card.name=='Sayaka Maizono').card;
    BOARD.player.discard.attach(choice);
    choice.exhaust(false);
    BOARD.opponent.back[0].card.exhaust(false);
    BOARD.opponent.discard.attach(BOARD.opponent.back[0].card);

    await makeTooltip(
        '...which discards both Sayaka and Revenant as they are consumed by Specimen 7.',
        {
            x:70, y:640,
            align: ALIGN.bottom | ALIGN.left
        }
    );

    await makeTooltip(
        'Your opponent is out of options, and ends their turn.',
        {
            x:70, y:640,
            align: ALIGN.bottom | ALIGN.left
        }
    );

    BOARD.player.hand.attach(new Card('Minas Tirith', './cards/Lord of the Rings/Minas Tirith.png'));
    set('player', 'energy', '9');
    BOARD.player.back.find(s => s.card && s.card.name == 'Aragorn').card.addToken();

    await makeTooltip(
        'You get a card and 3 more energy. Aragorn gets their third token, which procs Anduril.',
        {
            x:70, y:440,
            align: ALIGN.bottom | ALIGN.left
        }
    );

    choice = BOARD.player.hand.getCard('Minas Tirith');
    choice.e.classList.add('clickable');
    await makeTooltip(
        'This hand should be straightforward. Play Minas Tirith.',
        {
            x:70, y:120,
            align: ALIGN.bottom | ALIGN.left
        },
        async () => { return new Promise (resolve => {
            choice.e.addEventListener('click', resolve);
        });}
    );
    choice.e.classList.remove('clickable');
    
    BOARD.location.card.removeToken();
    BOARD.location.card.removeToken();
    BOARD.location.card.removeToken();
    BOARD.location.card.removeToken();
    BOARD.opponent.discard.attach(BOARD.location.card);
    BOARD.location.attach(choice);
    await makeTooltip(
        'When you play a location card after one has already been put in play, the existing location card is put in the discard pile of the person who played it. As with all discards, counters are removed.',
        {
            x:70, y:680,
            align: ALIGN.top | ALIGN.left
        }
    );

    choice = BOARD.player.hand.getCard('Execute');
    choice.e.classList.add('clickable');
    await makeTooltip(
        'We need to get rid of those Specimens, but Kiyotaka is in the way. Thankfully, we have just the cards to solve that issue. Play Execute.',
        {
            x:230, y:130,
            align: ALIGN.bottom | ALIGN.right
        },
        async () => { return new Promise (resolve => {
            choice.e.addEventListener('click', resolve);
        });}
    );
    choice.e.classList.remove('clickable');

    BOARD.player.effects.left.attach(choice);
    
    mc = BOARD.player.front.find(s => s.card && s.card.name == 'Kiyotaka Ishimaru').card;
    mc.e.classList.add('clickable');
    await makeTooltip(
        'Target Kiyotaka for the effect of Execute.',
        {
            x:140, y:730,
            align: ALIGN.top | ALIGN.left
        },
        async () => { return new Promise (resolve => {
            mc.e.addEventListener('click', resolve);
        });}
    );
    mc.e.classList.remove('clickable');
    BOARD.player.discard.attach(choice);
    BOARD.player.discard.attach(mc);
    
    choice = BOARD.player.back.find(s => s.card && s.card.name == 'Dante').card;
    choice.e.classList.add('clickable');
    await makeTooltip(
        'The buffs don\'t matter. We were just using this to get Kiyotaka out of the way.\n\nFirst, We declare that Dante\'s style is Trickster. Next, we start our Combat Phase.\n\nDeclare an attack with Dante.',
        {
            x:70, y:875,
            align: ALIGN.top | ALIGN.left
        },
        async () => { return new Promise (resolve => {
            choice.e.addEventListener('click', resolve);
        });}
    );
    choice.e.classList.remove('clickable');
    choice.e.classList.add('chosen');

    BOARD.opponent.front[0].card.e.classList.add('clickable');
    BOARD.opponent.front[2].card.e.classList.add('clickable');

    opponent = null;

    await makeTooltip(
        'The buffs don\'t matter. We were just using this to get Kiyotaka out of the way.\n\nFirst, We declare that Dante\'s style is Trickster. Next, we start our Combat Phase.\n\nDeclare an attack with Dante.',
        {
            x:70, y:875,
            align: ALIGN.top | ALIGN.left
        },
        async () => { return new Promise (resolve => {
            for (let i of BOARD.opponent.front) {
                if (i.card) {
                    i.card.e.addEventListener('click', () => {
                        if(!opponent){opponent = i.card;}
                        resolve();
                    })
                }
            }
        });}
    );

    set('player', 'energy', '8');

    BOARD.opponent.front[0].card.e.classList.remove('clickable');
    BOARD.opponent.front[2].card.e.classList.remove('clickable');
    choice.e.classList.remove('chosen');
    choice.exhaust(true);
    opponent.exhaust(false);
    BOARD.opponent.discard.attach(opponent);

    choice = BOARD.player.back.find(s => s.card && s.card.name == 'Aragorn').card;
    choice.e.classList.add('clickable');
    await makeTooltip(
        'Target the other Specimen with Aragorn.',
        {
            x:70, y:875,
            align: ALIGN.top | ALIGN.left
        },
        async () => { return new Promise (resolve => {
            choice.e.addEventListener('click', resolve);
        });}
    );
    choice.e.classList.remove('clickable');
    choice.e.classList.add('chosen');

    opponent = BOARD.opponent.front.find(s => s.card && s.card.name == 'Specimen 10').card;
    opponent.e.classList.add('clickable');
    await makeTooltip(
        'Target the other Specimen with Aragorn.',
        {
            x:70, y:875,
            align: ALIGN.top | ALIGN.left
        },
        async () => { return new Promise (resolve => {
            opponent.e.addEventListener('click', resolve);
        });}
    );
    opponent.e.classList.remove('clickable');
    opponent.exhaust(false);
    BOARD.opponent.discard.attach(opponent);
    choice.e.classList.remove('chosen');
    choice.exhaust(true);
    set('player', 'energy', '7');
    set('opponent', 'energy', '1');
    BOARD.opponent.front[1].attach(new Card('Heavy Weapon Dude', './cards/DOOM/Heavy Weapon Dude.png'))
    await makeTooltip(
        'Now our opponent\'s on the run.\n\nWe\'ll run through their turn real quick to speed things up. Your opponent draws, gets 1 ENERGY, and plays Heavy Weapon Dude.',
        {
            x:70, y:585,
            align: ALIGN.top | ALIGN.left
        }
    );
    BOARD.opponent.front[1].card.e.classList.add('chosen');
    choice = BOARD.player.back.find(s => s.card && s.card.name == 'Aragorn');
    choice.card.e.classList.add('chosen');
    await makeTooltip(
        'They target and defeat Aragorn, discarding both cards. This grants them 1 energy, but with no other cards their turn is over.',
        {
            x:190, y:450,
            align: ALIGN.bottom | ALIGN.left
        }
    );
    choice.card.exhaust(false);
    choice.card.removeToken();
    choice.card.removeToken();
    choice.card.removeToken();
    BOARD.opponent.front[1].card.e.classList.remove('chosen');
    choice.card.e.classList.remove('chosen');
    BOARD.player.discard.attach(choice.card);
    BOARD.opponent.discard.attach(BOARD.opponent.front[1].card);
    set ('player', 'energy','9');
    BOARD.player.hand.attach(new Card('Salvage Unity Fusion Core', './cards/Sid Meiers/Salvage Unity Fusion Core.png'));
    choice = BOARD.player.hand.getCard('Secret Project: The Cloning Vats');
    choice.e.classList.add('clickable');
    BOARD.player.back.find(s => s.card && s.card.name == 'Dante').card.exhaust(false);
    await makeTooltip(
        'Your turn. You get 2 energy from your engine and draw a card.\n\nPlay Cloning Vats.',
        {
            x:25, y:290,
            align: ALIGN.bottom | ALIGN.right
        },
        async () => { return new Promise (resolve => {
            choice.e.addEventListener('click', resolve);
        });}
    );
    choice.e.classList.remove('clickable');
    BOARD.player.deck.attach(BOARD.player.discard.getCard('Sayaka Maizono'));
    BOARD.player.deck.attach(BOARD.player.discard.getCard('Aragorn'));
    BOARD.player.deck.attach(BOARD.player.discard.getCard('Kiyotaka Ishimaru'));
    BOARD.player.deck.attach(new Card('Deck Cover', './cards/bg.png'));
    BOARD.player.effects.left.attach(choice);
    mc = BOARD.player.hand.getCard('Salvage Unity Fusion Core');
    mc.e.classList.add('clickable');
    await makeTooltip(
        'Now play Salvage Unity Fusion Core.',
        {
            x:0, y:125,
            align: ALIGN.bottom | ALIGN.left
        },
        async () => { return new Promise (resolve => {
            mc.e.addEventListener('click', resolve);
        });}
    );
    mc.e.classList.remove('clickable');
    BOARD.player.discard.attach(choice);
    BOARD.player.effects.left.attach(mc);
    BOARD.player.deck.getCard('Deck Cover').remove();
    while (BOARD.player.deck.cards[0]) {
        BOARD.player.hand.attach(BOARD.player.deck.cards[0]);
    }

    // dumb hack
    BOARD.player.hand.getCard('Aragorn').remove();
    BOARD.player.hand.attach(new Card('Aragorn', './cards/Lord of the Rings/Aragorn.png'));

    choice = BOARD.player.hand.getCard('Aragorn');
    choice.e.classList.add('clickable');

    await makeTooltip(
        'wow how lucky you drew all your characters back it\'s almost like I didn\'t make enough cards ANYWAY go ahead and play Aragorn.',
        {
            x:0, y:125,
            align: ALIGN.bottom | ALIGN.left
        },
        async () => { return new Promise (resolve => {
            choice.e.addEventListener('click', resolve);
        });}
    );

    choice.e.classList.remove('clickable');
    slot = BOARD.player.back.find(s => s.card == null);
    slot.attach(choice);
    BOARD.player.discard.attach(BOARD.player.effects.left.cards[0]);
    await makeTooltip(
        'I didn\'t bother asking what slot you wanted to play it in because there\'s only one valid slot.\n\nLet\'s move on to your Combat Phase.',
        {
            x:0, y:125,
            align: ALIGN.bottom | ALIGN.left
        }
    );
    choice = null;
    await makeTooltip(
        'Declare an attack with a Back Row card.',
        {
            x:140, y:890,
            align: ALIGN.top | ALIGN.left
        },
        async () => { return new Promise (resolve => {
            for (let slot of BOARD.player.back) {
                slot.card.e.classList.add('clickable');
                slot.card.e.addEventListener('click', () => {
                    if(!choice){choice = slot.card;}
                    resolve();
                });
            }
        });}
    );
    set('player', 'energy', '8');
    choice.e.classList.add('chosen');

    for (let slot of BOARD.player.back) {
        slot.card.e.classList.remove('clickable');
    }

    BOARD.opponent.commander.card.e.classList.add('clickable');
    await makeTooltip(
        'Declare an attack with a Back Row card.',
        {
            x:140, y:890,
            align: ALIGN.top | ALIGN.left
        },
        async () => { return new Promise (resolve => {
            BOARD.opponent.commander.card.e.addEventListener('click', resolve);
        });}
    );
    choice.exhaust(true);
    choice.e.classList.remove('chosen');
    set('opponent','hp','3');
    BOARD.opponent.commander.card.e.classList.remove('clickable');
    await makeTooltip(
        'When you attack your opponent\'s commander, you deal 1 damage to their HP.',
        {
            x:270, y:295,
            align: ALIGN.top | ALIGN.left
        }
    );
    choice = BOARD.player.back.find(s => !s.card.exhaust()).card;
    choice.e.classList.add('clickable');
    await makeTooltip(
        'Declare another attack.',
        {
            x:215, y:440,
            align: ALIGN.bottom | ALIGN.left
        },
        async () => { return new Promise (resolve => {
            choice.e.addEventListener('click', resolve);
        });}
    );
    set('player', 'energy', '7');
    choice.e.classList.add('chosen');
    choice.e.classList.remove('clickable');
    BOARD.opponent.commander.card.e.classList.add('clickable');
    await makeTooltip(
        'Declare another attack.',
        {
            x:215, y:440,
            align: ALIGN.bottom | ALIGN.left
        },
        async () => { return new Promise (resolve => {
            BOARD.opponent.commander.card.e.addEventListener('click', resolve);
        });}
    );
    BOARD.opponent.commander.card.e.classList.remove('clickable');
    choice.exhaust(true);
    choice.e.classList.remove('chosen');
    set('opponent','hp','2');
    BOARD.player.commander.card.e.classList.add('clickable');
    await makeTooltip(
        'Now declare CEO Morgan\'s effect.',
        {
            x:215, y:440,
            align: ALIGN.bottom | ALIGN.left
        },
        async () => { return new Promise (resolve => {
            BOARD.player.commander.card.e.addEventListener('click', resolve);
        });}
    );
    BOARD.player.commander.card.e.classList.remove('clickable');
    choice = BOARD.player.hand.getCard('Kiyotaka Ishimaru');
    choice.e.classList.add('clickable');
    set('player','energy','6');
    await makeTooltip(
        'Play Kiyotaka.',
        {
            x:215, y:440,
            align: ALIGN.bottom | ALIGN.left
        },
        async () => { return new Promise (resolve => {
            choice.e.addEventListener('click', resolve);
        });}
    );
    choice.e.classList.remove('clickable');
    choice.e.classList.add('chosen');
    await makeTooltip(
        'Play Kiyotaka.',
        {
            x:215, y:440,
            align: ALIGN.bottom | ALIGN.left
        },
        async () => { return new Promise (resolve => {
            for (let s of BOARD.player.front) {
                s.e.classList.add('clickable');
                s.e.addEventListener('click', ()=>{
                    slot = s;
                    resolve();
                });
            }
        });}
    );
    for (let s of BOARD.player.front) {
        s.e.classList.remove('clickable');
    }
    choice.e.classList.remove('chosen');
    choice.e.classList.add('clickable');
    slot.attach(choice);
    await makeTooltip(
        'Now attack with Kiyotaka.',
        {
            x:215, y:440,
            align: ALIGN.bottom | ALIGN.left
        },
        async () => { return new Promise (resolve => {
            choice.e.addEventListener('click', resolve);
        });}
    );
    choice.e.classList.add('chosen');
    choice.e.classList.remove('clickable');
    BOARD.opponent.commander.card.e.classList.add('clickable');
    set('player','energy','5');
    await makeTooltip(
        'Now attack with Kiyotaka.',
        {
            x:215, y:440,
            align: ALIGN.bottom | ALIGN.left
        },
        async () => { return new Promise (resolve => {
            BOARD.opponent.commander.card.e.addEventListener('click', resolve);
        });}
    );
    choice.e.classList.remove('chosen');
    BOARD.opponent.commander.card.e.classList.remove('clickable');
    set('opponent','hp','1');
    choice.exhaust(true);

    mc = BOARD.player.commander.card;
    mc.e.classList.add('clickable');
    await makeTooltip(
        'It\'s almost over! Activate Morgan\'s ability one more time, then play Sayaka.',
        {
            x:215, y:440,
            align: ALIGN.bottom | ALIGN.left
        },
        async () => { return new Promise (resolve => {
            mc.e.addEventListener('click', resolve);
        });}
    );
    mc.e.classList.remove('clickable');
    mc.e.classList.add('chosen');

    BOARD.player.hand.getCard('Sayaka Maizono').e.classList.add('clickable');
    await makeTooltip(
        'It\'s almost over! Activate Morgan\'s ability one more time, then play Sayaka.',
        {
            x:215, y:440,
            align: ALIGN.bottom | ALIGN.left
        },
        async () => { return new Promise (resolve => {
            BOARD.player.hand.getCard('Sayaka Maizono').e.addEventListener('click', resolve);
        });}
    );
    
    // dumb hack
    BOARD.player.hand.getCard('Sayaka Maizono').remove();
    choice = new Card('Sayaka Maizono', './cards/Danganronpa/Sayaka Maizono.png');
    BOARD.player.hand.attach(choice);

    set('player','energy','4');
    choice.e.classList.add('chosen');
    slot = null;
    await makeTooltip(
        'It\'s almost over! Activate Morgan\'s ability one more time, then play Sayaka.',
        {
            x:215, y:440,
            align: ALIGN.bottom | ALIGN.left
        },
        async () => { return new Promise (resolve => {
            for (let s of BOARD.player.front) {
                if (s.card) { continue; }
                s.e.classList.add('clickable');
                s.e.addEventListener('click', ()=>{
                    if(!slot){slot = s;}
                    resolve();
                });
            }
        });}
    );
    for (let s of BOARD.player.front) {
        s.e.classList.remove('clickable');
    }
    choice.e.classList.remove('chosen');
    mc.e.classList.remove('chosen');
    slot.attach(choice);
    choice.e.classList.add('clickable');
    await makeTooltip(
        'Deal the final blow!',
        {
            x:215, y:440,
            align: ALIGN.bottom | ALIGN.left
        },
        async () => { return new Promise (resolve => {
            choice.e.addEventListener('click', resolve);
        });}
    );
    choice.e.classList.add('chosen');
    choice.e.classList.remove('clickable');
    BOARD.opponent.commander.card.e.classList.add('clickable');
    set('player','energy','3');
    await makeTooltip(
        'Deal the final blow!',
        {
            x:215, y:440,
            align: ALIGN.bottom | ALIGN.left
        },
        async () => { return new Promise (resolve => {
            BOARD.opponent.commander.card.e.addEventListener('click', resolve);
        });}
    );
    choice.e.classList.remove('chosen');
    BOARD.opponent.commander.card.e.classList.remove('clickable');
    set('opponent','hp','0');
    choice.exhaust(true);

    BOARD.opponent.discard.attach(BOARD.opponent.commander.card);
    
    await makeTooltip(
        'Your opponent is out of HP! You win!\n\nThat\'s how the game works! I\'ve told you everything EXCEPT how to use Transformations and Equip cards. Let me set up a mock scenario and we can discuss that very quick.',
        {
            x:0, y:440,
            align: ALIGN.top | ALIGN.left
        }
    );
    choice = BOARD.player.front.find(s => s.card && s.card.name == 'Kiyotaka Ishimaru').card;
    choice.exhaust(false);
    choice.attach(new Card('Master Sword', './cards/The Legend of Zelda/Master Sword.png'));
    await makeTooltip(
        'Equip cards are simple: you attach them to a card, and the card gets a buff. Any equip cards that have an ATTACK or DEFENSE stat adds those values to the target card\'s ATTACK and DEFENSE. Other buffs are applied based on the card\'s description.',
        {
            x:0, y:440,
            align: ALIGN.top | ALIGN.left
        }
    );
    BOARD.player.specialDeck.attach(new Card('Toko Fukawa (Ultimate Serial Killer)', './cards/Danganronpa/Toko Fukawa (Ultimate Serial Killer).png'));
    BOARD.player.front.find(s => !s.card).attach(new Card('Toko Fukawa', './cards/Danganronpa/Toko Fukawa.png'))
    BOARD.opponent.front[1].attach(new Card('Heavy Weapon Dude', './cards/DOOM/Heavy Weapon Dude.png'));
    await makeTooltip(
        'Transformation cards will explain how they can be played as the first line in their description.',
        {
            x:190, y:300,
            align: ALIGN.bottom | ALIGN.left
        }
    );
    await makeTooltip(
        'In this case, Toko Fukawa (Ultimate Serial Killer) can be played when your opponent defeats a card on the same line as Toko Fukawa.',
        {
            x:190, y:300,
            align: ALIGN.bottom | ALIGN.left
        }
    );
    opponent = BOARD.opponent.front[1].card;
    choice.e.classList.add('chosen');
    opponent.e.classList.add('chosen');
    await makeTooltip(
        'In this situation, your opponent defeats Kiyotaka Ishimaru...',
        {
            x:190, y:730,
            align: ALIGN.top | ALIGN.left
        }
    );
    choice.e.classList.remove('chosen');
    choice.exhaust(false);
    BOARD.player.discard.attach(choice);
    BOARD.player.discard.attach(choice.attachments[0])
    BOARD.opponent.front[1].card.e.classList.remove('chosen');
    BOARD.opponent.discard.attach(BOARD.opponent.front[1].card);
    choice = BOARD.player.specialDeck.cards[0];
    choice.e.classList.add('clickable');
    await makeTooltip(
        '...which allows you to declare Toko\'s effect. Click the card in your Special Deck to do so.',
        {
            x:190, y:300,
            align: ALIGN.bottom | ALIGN.left
        },
        async () => {return new Promise(resolve => {
            choice.e.addEventListener('click', resolve);
        });}
    );
    choice.e.classList.remove('clickable');
    mc = BOARD.player.front.find(s => s.card && s.card.name == 'Toko Fukawa').card;
    mc.attach(choice);
    await makeTooltip(
        'This card is placed on top of the ingredient that\'s required for Transformation. If multiple ingredients are required, they must be stacked together onto one slot (your choice).\n\nThat\'s it! Note that when this card is defeated by combat or card effects, everything attached should be discarded with it - any Equips or Transformations.',
        {
            x:190, y:750,
            align: ALIGN.top | ALIGN.left
        }
    );
    await makeTooltip(
        'Equips that are targeted by card effects can be discarded without having to discard the entire card, but characters that have equips attached must discard everything, like what happened to Kiyotaka there.',
        {
            x:50, y:300,
            align: ALIGN.bottom | ALIGN.right
        }
    );
    await makeTooltip(
        'That\'s everything! I don\'t have anything written for post-game interaction so this is where the tutorial ends. Thanks for playing!',
        {
            x:50, y:300,
            align: ALIGN.bottom | ALIGN.right
        },
        async () => {return new Promise(()=>{});} // Fake promise to stall tooltip system.
    );
};

main();