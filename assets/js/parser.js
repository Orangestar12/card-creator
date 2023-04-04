'use strict';

const replacements = {
    '[ATK]' : 'atk',
    '[DEF]' : 'def',
    '[ITEM]' : 'item',
    '[INSTANT]' : 'instant',
    '[EQUIP]' : 'equip',
    '[TURN]' : 'turn',
    '[TARGET]' : 'target',
    '[FACTION]' : 'faction',
    '[TOKEN]' : 'token',
    '[+]' : 'addon',
    '[CHARACTER]' : 'character',
    '[INSTANT]' : 'instant',
    '[REACT]' : 'react',
    '[LOCATION]' : 'location',
    '[SEARCH]' : 'search',
    '[COMMANDER]' : 'commander',
    '[ENERGY]' : 'energy',
    '[ENGINE]' : 'engine',
    '[DIE]' : 'die'
}

const textBox = document.querySelector('#markup');
const cheatSheet = document.querySelector('#cheatsheet');
const description = document.querySelector('.description');

function showBoxes() {
    textBox.classList.remove('hidden');
    cheatSheet.classList.remove('hidden');
}

function hideBoxes() {
    textBox.classList.add('hidden');
    cheatSheet.classList.add('hidden');
}

// show and hide markup on description click

description.addEventListener('click', showBoxes);

textBox.addEventListener('focusout', processMarkup);

function processMarkup() {
    let markup = textBox.value;

    for (let statement in replacements) {
        markup = markup.replaceAll(statement, '<span class="icon ' + replacements[statement] + '"></span>');
    }

    markup = markup.split('\n');
    let newMarkup = []

    for (let line of markup) {
        if (line.startsWith('#')) {
            if (line.indexOf(':') != '-1') {
                line = '<div><span class="bold">' + line.slice(1);
                line = line.replace(':', ':</span>')
            }
        } else {
            if (line.startsWith(' ')) {
                line = '<div class="indented">' + line.slice(1);
            } else if (line.startsWith('*')) {
                line = '<div class="centered flavor">' + line.slice(1);
            } else {
                line = '<div>' + line;
            }
        }
        line += '</div>';
        
        let regs = [
            [ // tags
                /\[.*?\]/d,
                't',
                1
            ],
            [ // franchises
                /\{.*?\}/d,
                'fr',
                1
            ],
            [ // characters
                /\(\(.*?\)\)/d,
                'char',
                2
            ],
            [ // bold
                /\*\*.*?\*\*/d,
                'bold',
                2
            ]
        ]

        for (let reg of regs) {
            let regex = reg[0];
            let cls = reg[1];
            let count = reg[2];

            while(line.match(regex)) {
                let tag = line.match(regex);
                let start = tag.indices[0][0];
                let end = tag.indices[0][1];
                if (start - 1 == '\\') {
                    //escaped
                    continue;
                } else {
                    line = line.slice(0, start) +
                           '<span class="' +
                           cls +
                           '">' +
                           line.slice(start + count, end - count) +
                           '</span>' +
                           line.slice(end, line.length);
                }
            }

        }

        newMarkup.push(line);
    }

    markup = newMarkup.join('');

    description.innerHTML = markup;

    hideBoxes();
}