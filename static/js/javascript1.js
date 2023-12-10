			var myBoard = new DrawingBoard.Board('zbeubeu', {
				controls: [
					'Color',
		
					{ Size: { type: 'dropdown' } },
					{ DrawingMode: { filler: false } },
					'Navigation',
					'Download'
				],
				//background:"{{ url_for('static', filename='images/math_board.png') }}",
				size: 1,
				webStorage: false,
				enlargeYourContainer: true
			});
			var draw = document.getElementById('draw');
			var calculate = document.getElementById('calculate');
			var file = document.getElementById('file');
			var latex = document.getElementById('latex');
			var mf = document.getElementById('mf');
			var lx;
			var loadFile = function(event) {
				var image = document.getElementById('output');
				image.src = URL.createObjectURL(event.target.files[0]);		
			};
			var math = document.getElementById('math');
			document.getElementById("myButton").onclick = function () {
				location.href = "index3";
			};
			function encodeImageFileAsURL(element){
				let file = element.files[0];
				let reader = new FileReader();
				math.innerHTML = "";
				reader.onloadend = function() {
					var img = reader.result;
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
							latex.value = data.latex;
							MathJax.texReset();
							var options = MathJax.getMetricsFor(math);
							options.display = true;
							MathJax.tex2chtmlPromise(data.latex, options).then(function (node) {
								math.appendChild(node);
								MathJax.startup.document.clear();
								MathJax.startup.document.updateDocument();
							}).catch(function (err) {
								math.innerHTML = "Error";
							}).then(function () {
								lx = data.latex;
								sessionStorage.setItem("latex", lx);
							});
						})
						
				}
				reader.readAsDataURL(file);
			}
			function drawing(){
					latex.value = "";
					
					file.classList.remove('--show');
					calculate.classList.remove('--show');
					draw.classList.add('--show');
					myBoard.ev.bind('board:stopDrawing', why);
			
					function why() {
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
							latex.value = data.latex;
							MathJax.texReset();
							var options = MathJax.getMetricsFor(math);
							options.display = true;
							math.innerHTML = "";
							MathJax.tex2chtmlPromise(data.latex, options).then(function (node) {
								math.appendChild(node);
								MathJax.startup.document.clear();
								MathJax.startup.document.updateDocument();
							}).catch(function (err) {
								math.innerHTML = "Error";
							}).then(function () {
								lx = data.latex;
								sessionStorage.setItem("latex", lx);
							});
						})
					}
         	}
			function camera(){
					draw.classList.remove('--show');
					calculate.classList.remove('--show');
					file.classList.add('--show');
					latex.value = "";
					math.innerHTML = "";
         	}
			function calculator(){
					latex.value = "";
					mf.value = "";
					file.classList.remove('--show');
					draw.classList.remove('--show');
					calculate.classList.add('--show');
					mf.addEventListener('input',(ev) => {
						latex.value = mf.value;
						lx = mf.value;
						sessionStorage.setItem("latex",lx.toString());
						
					});
					latex.value = mf.value;
         	}