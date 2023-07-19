"use strict";

var gl;

var start_index = 0;
var numOfPoints = 3;

var theta = 0.0;
var thetaLoc;

var speed = 100;
var direction = true;

//color is used to store as a default color
var color = vec4(1.0, 0.0, 0.0, 1.0);

var colorLoc; //this pass back the color to the shader

var colors = [
    vec4(1.0, 0.0, 0.0, 1.0),  // red
    vec4(0.0, 1.0, 0.0, 1.0 ),  // green
    vec4(0.0, 0.0, 1.0, 1.0),  // blue
    vec4(0.0, 0.0, 0.0, 1.0),  // black
];

var vertices = [
    vec2( -0.5, -Math.sqrt(3)/6 ),
    vec2(  0,  Math.sqrt(3)/3 ),
    vec2(  0.5, -Math.sqrt(3)/6 ),
	vec2( -0.5, -0.5),
	vec2( -0.5, 0.5),
	vec2( 0.5, 0.5),
	vec2( 0.5, -0.5)
];


window.onload = function init()
{
    var canvas = document.getElementById("gl-canvas");

    gl = canvas.getContext('webgl2');
    if (!gl) alert("WebGL 2.0 isn't available");

    //
    //  Configure WebGL
    //
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(1.0, 1.0, 1.0, 1.0);

    //  Load shaders and initialize attribute buffers

    var program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram( program );
	
	// generate data for cirle
	circleData()
	
    // Load the data into the GPU

    var bufferId = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW);

    // Associate out shader variables with our data buffer

    var positionLoc = gl.getAttribLocation( program, "aPosition" );
    gl.vertexAttribPointer( positionLoc, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray(positionLoc);

    thetaLoc = gl.getUniformLocation(program, "uTheta");
	
	//in the shadder there is 
	colorLoc = gl.getUniformLocation(program, "aColor");
	
    // Initialize event handlers

    document.getElementById("slider").onchange = function(event) {
        speed = 100 - event.target.value;
    };
    document.getElementById("Direction").onclick = function (event) {
        direction = !direction;
    };
	//This deals with the list in the program
    document.getElementById("Controls").onclick = function( event) {
        switch(event.target.index) {
          case 0:
            direction = !direction;
            break;

         case 1:
            speed /= 2.0;
            break;

         case 2:
            speed *= 2.0;
            break;
		 case 3:
			color = colors[0];
			break;
		 case 4:
			color = colors[1];
			break;
		 case 5:
			color = colors[2];
			break;
		 case 6:
			color = colors[3];
			break;
       }
    };
	// code for radio button
	document.getElementById("triangle").onclick = function( event) {
		start_index = 0;
		numOfPoints = 3;
	}
	document.getElementById("square").onclick = function( event) {
		start_index = 3;
		numOfPoints = 4;
	}
	document.getElementById("circle").onclick = function( event) {
		start_index = 7;
		numOfPoints = 361;
	}
	
    window.onkeydown = function(event) {
        var key = String.fromCharCode(event.keyCode);
        switch( key ) {
          case '1':
            direction = !direction;
            break;

          case '2':
            speed /= 2.0;
            break;

          case '3':
            speed *= 2.0;
            break;
		 case '4':
		    color = colors[0];
			break;
		 case '5':
			color = colors[1];
			break;
		 case '6':
			color = colors[2];
			break;
		 case '7':
			color = colors[3];
			break;
        }
    };

	

    render();
};

function circleData()
{
	// center of circleData
	vertices.push(vec2(0, 0));
	// points on circle
	for (var i = 0; i < 360; i++){
		vertices.push(vec2(Math.cos(Math.PI * i / 180.0), Math.sin(Math.PI * i / 180)));
	}
}
function render()
{
    gl.clear( gl.COLOR_BUFFER_BIT );

    theta += (direction ? 0.1 : -0.1);
    gl.uniform1f(thetaLoc, theta);

	//This is added for color changing
	gl.uniform4fv(colorLoc, color);

    gl.drawArrays(gl.TRIANGLE_FAN, start_index, numOfPoints); 
	// start_index, numOfPoints will be changed when radio button is selected again

    setTimeout(
        function () {requestAnimationFrame(render);},
        speed
    );
}
