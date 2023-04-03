async function render() {
    let temp = {}
    deferredJobSystem([
        [
            () => {
                document.body.classList.add('rendering');
                if (document.querySelector('.tags').childElementCount == 0) {
                    document.querySelector('.tags').style.display = 'none';
                }
                
                // mobile fix
                document.querySelector("meta[name='viewport']").setAttribute(
                    'content',
                    'initial-scale=1, minimum-scale=1, maximum-scale=1'
                );
            
                // firefox fix
                card.container.parentElement.style.display = 'block';
            
                temp.scrollTop = document.body.scrollTop;
                temp.scrollLeft = document.body.scrollLeft;
            
                document.body.scrollTop = 0;
                document.body.scrollLeft = 0;
            },
            'Getting rid of fancy stuff temporarily...'
        ],
        [
            () => {
                // html2canvas(card.container, {
                //     // allowTaint: true,
                //     width: 480,
                //     height: 672,
                //     scrollX: 0,
                //     scrollY: -window.scrollY
                // }).then(function(canvas) {
                //     // document.body.appendChild(canvas); // uncomment to debug canvas
                //     var image = canvas.toDataURL("image/png");//.replace("image/png", "image/octet-stream");
                //     download(card.title.firstElementChild.textContent + '.png', image, true);
                //     canvas.remove();
                // });
                
                htmlToImage.toPng(card.container)
                .then(function (dataUrl) {
                    download(card.title.firstElementChild.textContent + '.png', dataUrl, true);
                })
                .catch(function (error) {
                    toast(error);
                });
            },
            'Rendering...'
        ],
        [
            () => {
                document.querySelector("meta[name='viewport']").setAttribute(
                    'content',
                    'initial-scale=0.6, minimum-scale=0.6, maximum-scale=0.6'
                );
                document.body.classList.remove('rendering');
                card.container.parentElement.style.display = 'flex';
                document.querySelector('.tags').removeAttribute('style');

                document.body.scrollTop = temp.scrollTop;
                document.body.scrollLeft = temp.scrollLeft;
            },
            'Done! Making everything nice and pretty again...'
        ]
    ]);
}

document.querySelector('#render').addEventListener('click', () => {
    if (document.querySelector('.tags').childElementCount == 0) {
        toast('Warning: You are creating a card with no tags!');
        setTimeout(render, 2000);
    } else {
        render();
    }
})