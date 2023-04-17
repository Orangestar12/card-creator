'use strict';

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

class Findable {
    constructor(start, end) {
        this.start = start;
        this.end = end;
    }
}

const findableArray = [
    new Findable('[ATK]'),
    new Findable('[DEF]'),
    new Findable('[ITEM]'),
    new Findable('[INSTANT]'),
    new Findable('[EQUIP]'),
    new Findable('[TURN]'),
    new Findable('[TARGET]'),
    new Findable('[FACTION]'),
    new Findable('[TOKEN]'),
    new Findable('[+]'),
    new Findable('[CHARACTER]'),
    new Findable('[INSTANT]'),
    new Findable('[REACT]'),
    new Findable('[LOCATION]'),
    new Findable('[SEARCH]'),
    new Findable('[COMMANDER]'),
    new Findable('[ENERGY]'),
    new Findable('[ENGINE]'),
    new Findable('[DIE]'),
    new Findable('**', '**'),
    new Findable('((', '))'),
    new Findable('{', '}'),
    new Findable('[', ']')
];

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
};

function findFirstInstanceFrom(item, findables) {
    let findable = undefined;
    let start = undefined;
    let end = undefined;

    for (let f of findables) {
        let s = item.indexOf(f.start);
        if (s != -1 && (start === undefined || s < start)) {
            if (f.end){
                end = item.indexOf(f.end, s + f.start.length);
                if (end !== -1) {
                    findable = f;
                    start = s;
                }
                // no end? then it doesnt match the findable
            } else {
                findable = f;
                start = s;
            }
        }
    }

    return { findable:findable, start:start, end:end };
}

async function processMarkup() {
    let markup = textBox.value.replaceAll('<', '&lt;').replaceAll('>', '&gt;');

    markup = markup.split('\n');

    let container = document.createElement('div');

    for (let line of markup) {
        // wrapper for this line
        let element = document.createElement('div');

        // holds the deepest element
        let currentElement = element;

        // Indents
        while(line.startsWith(' ')) {
            // indent wrapper
            currentElement.classList.add('indented');

            // go one level deeper
            let newElement = document.createElement('div');
            currentElement.append(newElement);
            currentElement = newElement;

            // slice out markup
            line = line.slice(1);
        }

        // Header
        if (line.startsWith('#') && line.indexOf(':') != -1) {
            let end = line.indexOf(':');

            // header detected, slice out text
            let newElement = document.createElement('span')
            newElement.classList.add('bold');
            newElement.textContent = line.slice(1, end + 1);
            
            currentElement.append(newElement);

            line = line.slice(end + 1);
        } else {
            if (line.startsWith('[+]')) {
                // make wrapper a flex
                currentElement.classList.add('flex');
                //add span
                let icon = document.createElement('span');
                icon.classList.add('icon', 'addon');
                currentElement.append(icon);

                // go one level deeper
                let newElement = document.createElement('div');
                currentElement.append(newElement);
                currentElement = newElement;

                // slice out markup
                line = line.slice(3);
            } else if (line.startsWith('&gt;')) {
                //convert wrapper to flavor wrapper 
                currentElement.classList.add('centered', 'flavor');

                // cut text out 
                line = line.slice(4);
            }
        }

        let f = findFirstInstanceFrom(line, findableArray);
        while(f.findable) {
            let l = line.slice(0, f.start);
            currentElement.append(l);

            if (replacements.hasOwnProperty(f.findable.start)) {
                let icon = document.createElement('span');
                icon.classList.add('icon', replacements[f.findable.start]);

                currentElement.append(icon);

                line = line.slice(f.start + f.findable.start.length);
            } else {
                let emphasis = document.createElement('span');
                switch (f.findable.start) {
                    case '**':
                        emphasis.classList.add('bold');
                        break;
                    case '((':
                        emphasis.classList.add('char');
                        break;
                    case '{':
                        emphasis.classList.add('fr');
                        break;
                    case '[':
                        emphasis.classList.add('t');
                }
                emphasis.textContent = line.slice(
                    f.start + f.findable.start.length,
                    f.end
                );

                currentElement.append(emphasis);

                line = line.slice(f.end + f.findable.end.length);
            }

            f = findFirstInstanceFrom(line, findableArray);
            // await new Promise(resolve => {setTimeout(resolve, 1000)});
        }

        currentElement.append(line);
        container.append(element);
    }

    while(description.firstChild) {description.firstChild.remove();}
    description.appendChild(container);

    hideBoxes();
}