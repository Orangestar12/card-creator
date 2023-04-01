'use strict';

// Look I know what I called it, but this script doesn't upload anything.
// Tricked you, it's Egypt and we're both Phlog Pyros.

// https://stackoverflow.com/a/64929732/
const getBase64FromUrl = async (url) => {
    const data = await fetch(url);
    const blob = await data.blob();
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(blob); 
        reader.onloadend = () => {
            const base64data = reader.result;   
            resolve(base64data);
        }
    });
}

const images = {
    'portrait' : {
        'element' : document.querySelector('.image'), // the actual thing that changes
        'upload' : document.querySelector('#portraitUpload'), // the input element
        'drops' : [ // elements you can drop your image on
            document.querySelector('.image'), 
            document.querySelector('#portraitInForm')
        ]
    },
    'bg' : {
        'element' : document.querySelector('#card-container'),
        'upload' : document.querySelector('#bgUpload'),
        'drops' : [ document.querySelector('#bgInForm') ]
    },
    'type' : {
        'element' : document.querySelector('.type'),
        'upload' : document.querySelector('#typeUpload'),
        'drops' : [
            document.querySelector('.type')
        ],
        'title' : document.querySelector('.typeTitle')
    }
}

// convert image URL to data URI
function setImageFromURL(url, element) {
    getBase64FromUrl(url).then((result) => {
        element.style.backgroundImage = "url('" + result + "')";
    });
}

// stole this from smashingmagazine and made it look not like shit because
// god they have some weird code style

// clickable type images
for (let img of document.querySelector('.icon-gallery').querySelectorAll('img')) {
    img.addEventListener('click', () => {
        setImageFromURL(img.src, images.type.element);
        if (img.alt) {
            images.type.title.textContent = img.alt;
        }
    });
}

// force max size for images
function resizeImageFromUrl(url, callback) {
    var img = document.createElement("img");
        
    img.onload = () => {
        var canvas = document.createElement("canvas");
    
        var height = img.height;
        var width = img.width;

        var max_width = 640
        var max_height = 640

        if (width > height) {
            if (width > max_width) {
                height = height * (max_width / width);
                width = max_width;
            }
        } else {
            if (height > max_height) {
                width = width * (max_height / height);
                height = max_height;
            }
        }

        canvas.width = width;
        canvas.height = height;

        var ctx = canvas.getContext("2d");

        ctx.drawImage(img, 0, 0, width, height);

        let x = canvas.toDataURL('image/jpg');
        if (x == undefined) {
            x = canvas.toDataURL('image/png');
        }

        callback(x);

        img.remove();
        canvas.remove();
    }
    
    img.src = url;
}

// get data URI from file
function setImageFromFile(images, element) {
    console.log('Setting image to', images);
    let imageFile = images[0];

    var reader = new FileReader();

    reader.onload = function(e) {
        resizeImageFromUrl(
            this.result,
            (result) => {
                element.style.backgroundImage = "url('" + result + "')";
            }
        );
    }

    reader.readAsDataURL(imageFile)
}

// determine if dropped item is an image or a URL
function imgUploader(e, image) {
    let url = e.dataTransfer.getData('text/plain');

    if (url) {
        setImageFromURL(url, image.element);
    }
    else if (e.dataTransfer.files) {
        setImageFromFile(e.dataTransfer.files, image.element);
    }

    // fail silently
}

for(let img in images) {
    let image = images[img];
    for (let drop of image.drops) {
        // disable default drag actions
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            drop.addEventListener(eventName, preventDefaults);
        });
    
        // technically we only need dragenter because we dont have any children but
        // we'll do this just in case
        
        // add highlight on drag
        ['dragenter', 'dragover'].forEach(eventName => {
            drop.addEventListener(eventName, () => {
                drop.classList.add('highlight');
            });
        });

        // remove highlight when drag is done
        ['dragleave', 'drop'].forEach(eventName => {
            drop.addEventListener(eventName, () => {
                drop.classList.remove('highlight');
            } );
        });

        // upload image on drop
        drop.addEventListener('drop', function(e) {
            imgUploader(e, image);
        });
    }

    // upload on input element change
    image.upload.addEventListener('change', function() {
        if (this.files) {
            console.log('File found.')
            setImageFromFile(this.files, image.element);
        }
    });
}