'use strict';

let vertexShaderCode = [
	'precision mediump float;',
	'',
	'attribute vec2 vertPosition;',
	'attribute vec3 vertColor;',
	'varying vec3 fragColor;',
	'',
	'void main()',
	'{',
	'	fragColor = vertColor;',
	'	gl_Position = vec4(vertPosition, 0.0, 1.0);',
	'}'
].join('\n');

let fragmentShaderCode = [
	'precision mediump float;',
	'varying vec3 fragColor;',
	'',
	'void main()',
	'{',
	'	gl_FragColor = vec4(fragColor, 1.0);',
	'}'
].join('\n');

let Init = () => {
	const glcanvas = document.getElementById('gl-w');
	const gl = glcanvas.getContext('webgl');

	if(!gl){
		console.log("WebGL not supported, falling back on Experimental-WebGL!");
		gl = glcanvas.getContext('experimental-webgl');
	}

	if (!gl) {
		alert('Your browser does not support WebGL!');
	}

	gl.clearColor(1.0, 1.0, 1.0, 1.0);
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	/*
	 * Create Shaders 
	 */
	let vertexShader = gl.createShader(gl.VERTEX_SHADER);
	let fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);

	gl.shaderSource(vertexShader, vertexShaderCode);
	gl.shaderSource(fragmentShader, fragmentShaderCode);

	gl.compileShader(vertexShader);

	if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
		console.error('ERROR compiling vertex shader!', gl.getShaderInfoLog(vertexShader));
		return;
	}
	gl.compileShader(fragmentShader);

	if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
		console.error('ERROR compiling fragment shader!', gl.getShaderInfoLog(fragmentShader));
		return;
	}

	let program = gl.createProgram();
	gl.attachShader(program, vertexShader);
	gl.attachShader(program, fragmentShader);
	gl.linkProgram(program);

	if ( !gl.getProgramParameter(program, gl.LINK_STATUS) ) {
		console.error('ERROR linking program!', gl.getProgramInfoLog(program));
		return;
	}

	gl.validateProgram(program);
	if ( !gl.getProgramParameter(program, gl.VALIDATE_STATUS) ) {
		console.error('ERROR validating program!', gl.getShaderInfoLog(program));
		return;
	}

	/*
	 * Create Buffer
	 */
	let triangleVertices = [
		// X and Y
		0.0, 0.5,		0.0, 0.0, 1.1,
		-0.5, -0.5,		0.7, 0.0, 0.0,
		0.5, -0.5,		0.0, 1.0, 0.3,
	];

	let tringlesVertexBufferObject = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, tringlesVertexBufferObject);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(triangleVertices), gl.STATIC_DRAW);

	let positionAttribLocation = gl.getAttribLocation(program, 'vertPosition');
	let colorAttribLocation = gl.getAttribLocation(program, 'vertColor');
	gl.vertexAttribPointer(
		positionAttribLocation, //Attribute location
		2,						//Number of element per attribute
		gl.FLOAT, 				//Type of elements
		gl.FALSE,
		5 * Float32Array.BYTES_PER_ELEMENT, //Size of individual vertex
		0 						//Ofset from the begining of a single vertex to this attribute
	);

	gl.vertexAttribPointer(
		colorAttribLocation, //Attribute location
		3,						//Number of element per attribute
		gl.FLOAT, 				//Type of elements
		gl.FALSE,
		5 * Float32Array.BYTES_PER_ELEMENT, //Size of individual vertex
		2 * Float32Array.BYTES_PER_ELEMENT	//Ofset from the begining of a single vertex to this attribute
	);

	gl.enableVertexAttribArray(positionAttribLocation);
	gl.enableVertexAttribArray(colorAttribLocation);

	/*
	 * Main render loop
	 */
	 gl.useProgram(program);
	 gl.drawArrays(gl.TRIANGLES, 0, 3);

};

Init();