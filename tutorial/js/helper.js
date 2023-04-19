'use strict';

export const ALIGN = {
    left: 0,
    right: 1,
    top: 2,
    bottom: 4
}

const main = document.querySelector('main');

export function checkDefaults(check, defaults) {
    for (let item of Object.keys(defaults)) {
        if (!check[item]) {
            check[item] = defaults[item];
        }
    }
    return check;
}

export async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
}

async function clickable(element) {
    return new Promise(resolve =>  element.onclick = () => {
        resolve();
    });
}

export async function makeTooltip(text, pos, click) {
    pos = checkDefaults(pos, {x: 0, y: 0, align: ALIGN.left | ALIGN.top});

    if(pos.align == ALIGN.top || pos.align == ALIGN.left) { pos.align = ALIGN.left | ALIGN.top; }
    if(pos.align == ALIGN.right) { pos.align = ALIGN.top | ALIGN.right; }
    if(pos.align == ALIGN.bottom) { pos.align = ALIGN.left | ALIGN.bottom; }

    let tip = document.createElement('div');
    let p = document.createElement('p');
    p.textContent = text;
    tip.appendChild(p);
    tip.classList.add('tooltip');

    switch(pos.align) {
        case ALIGN.top | ALIGN.left:
            tip.style.left = pos.x + 'px';
            tip.style.top = pos.y + 'px'
            tip.style.borderTopLeftRadius = '0';
            break;
        case ALIGN.bottom | ALIGN.left:
            tip.style.left = pos.x + 'px';
            tip.style.bottom = pos.y + 'px'
            tip.style.borderBottomLeftRadius = '0';
            break;
        case ALIGN.top | ALIGN.right:
            tip.style.right = pos.x + 'px';
            tip.style.top = pos.y + 'px'
            tip.style.borderTopRightRadius = '0';
            break;
        case ALIGN.bottom | ALIGN.right:
            tip.style.right = pos.x + 'px';
            tip.style.bottom = pos.y + 'px'
            tip.style.borderBottomRightRadius = '0';
            break;
    }

    main.appendChild(tip);

    if (typeof(click) == 'function') {
        await click();
        tip.remove();
    } else {
        tip.classList.add('click');
        let e = document.createElement('p');
        e.textContent = 'Click to continue...';
        e.classList.add('tiny');
        tip.appendChild(e);
        await clickable(tip);
        tip.remove();
    }
}