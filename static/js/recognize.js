/* At validation it was like that:
size: 4,
controls: [
    size.... dropdown
]
*/
var myBoard = new DrawingBoard.Board('zbeubeu', {
	controls: [
		'Color',
		
		{ Size: { type: 'dropdown' } },
		{ DrawingMode: { filler: false } },
		'Navigation',
		'Download'
	],
	size: 1,
	webStorage: false,
	enlargeYourContainer: true
});

var recognize = document.querySelector("#recognize"),
    loading = document.querySelector("#loading"),
    latexElement = document.querySelector("#latex"),
    errorElement = document.querySelector(".quadro__resultado__error"),
    visualLatex = document.querySelector("#visualLatex"),
    normal = document.querySelector("#input"),
    pod = document.querySelector("#pods");

normal.value = "";
pod.innerHTML = "";
recognize.addEventListener("click", function() {
	
    latexElement.classList.remove('--error');
    errorElement.classList.remove('--show');
    loading.classList.add('--show');
    visualLatex.innerHTML = "";
    

    if (!recognize.classList.contains('--disabled')) {

        recognize.classList.add('--disabled');

        var img = myBoard.getImg();

        fetch('ajax/recognize/',{
            method: 'POST',
            headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json' },
            body: JSON.stringify({
                "image": img
            })
        })
        .then(function(response) {
            return response.text()
        })
        .then(function(data) {
            data = JSON.parse(data)
            latexElement.innerText = data.latex;
  	    normal.value = data.normal;

            if(data.error) {
                latexElement.classList.add('--error')
                errorElement.classList.add('--show');
            } else {
                MathJax.texReset();
                var options = MathJax.getMetricsFor(visualLatex);
                options.display = true;

                MathJax.tex2chtmlPromise(data.latex, options).then(function (node) {
                    visualLatex.appendChild(node);
                    MathJax.startup.document.clear();
                    MathJax.startup.document.updateDocument();
                }).catch(function (err) {
                    visualLatex.innerHTML = err.message;
                }).then(function () {
                    // nothing
                });
            }
            
        })
        .finally(function() {
            recognize.classList.remove('--disabled');
            loading.classList.remove('--show')
        });
    }
});
