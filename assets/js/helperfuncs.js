function preventDefaults (e) {
    e.preventDefault();
    e.stopPropagation();
}

// https://css-tricks.com/converting-color-spaces-in-javascript/
function RGBToHSL(rgb) {
    // Make r, g, and b fractions of 1
    let r = rgb[0] / 255;
    let g = rgb[1] / 255;
    let b = rgb[2] / 255;
  
    // Find greatest and smallest channel values
    let cmin = Math.min(r,g,b),
        cmax = Math.max(r,g,b),
        delta = cmax - cmin,
        h = 0,
        s = 0,
        l = 0;
    // Calculate hue
    // No difference
    if (delta == 0)
        h = 0;
    // Red is max
    else if (cmax == r)
        h = ((g - b) / delta) % 6;
    // Green is max
    else if (cmax == g)
        h = (b - r) / delta + 2;
    // Blue is max
    else
        h = (r - g) / delta + 4;

    h = Math.round(h * 60);
    
    // Make negative hues positive behind 360°
    if (h < 0)
        h += 360;
    // Calculate lightness
    l = (cmax + cmin) / 2;

    // Calculate saturation
    s = delta == 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));
        
    // Multiply l and s by 100
    s = +(s * 100).toFixed(1);
    l = +(l * 100).toFixed(1);

    return {"h":h, "s":s, "l":l};
}

function hexToRGB(h) {
    let r = 0, g = 0, b = 0;
  
    // 3 digits
    if (h.length == 4) {
        r = "0x" + h[1] + h[1];
        g = "0x" + h[2] + h[2];
        b = "0x" + h[3] + h[3];
  
    // 6 digits
    } else if (h.length == 7) {
        r = "0x" + h[1] + h[2];
        g = "0x" + h[3] + h[4];
        b = "0x" + h[5] + h[6];
    }
    
    return {"r": parseInt(r), "g": parseInt(g), "b": parseInt(b)};
}

function RGBToHex(color) {
    let r = color.r.toString(16);
    let g = color.g.toString(16);
    let b = color.b.toString(16);
  
    if (r.length == 1)
        r = "0" + r;
    if (g.length == 1)
        g = "0" + g;
    if (b.length == 1)
        b = "0" + b;
  
    return "#" + r + g + b;
}

function toast(text) {
    let t = document.createElement('div');
    t.classList.add('toast');
    t.textContent = text;
    document.body.appendChild(t);
    setTimeout(() => {
        t.style.opacity = 0;
        setTimeout(() => {
            t.remove();
        }, 2000);
    }, 6000);
}