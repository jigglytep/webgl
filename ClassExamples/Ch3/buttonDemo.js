var gl;
var program;
var shape = "square"; // default draw is the square
var color = vec4(1.0, 0.0, 0.0, 1.0); // default color is red
var colorLoc;

window.onload = function init(){
    // initialize gl
    var canvas = document.getElementById("gl-canvas");
    gl = WebGLUtils.setupWebGL(canvas);
    if(!gl){
        alert( "WebGL isn't available" );
    }

    // configure webgl
    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );

    //  Load shaders and initialize attribute buffers
    program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    // position buffer
    var bufferId = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);
    // vertices will be determined when button is pressed
    
    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray(vPosition);

    colorLoc = gl.getUniformLocation(program, "color");

    drawSquare(); // default draw a red square

    document.getElementById("square").onclick = function () {
        shape = "square";
        drawSquare();
    };

    document.getElementById("triangle").onclick = function () {
        shape = "triangle";
        drawTriangle();
    };

    document.getElementById("circle").onclick = function () {
        shape = "circle";
        drawCircle();
    };

    document.getElementById("red").onclick = function () {
        color = vec4(1.0, 0.0, 0.0, 1.0);
        redraw();
    };

    document.getElementById("green").onclick = function () {
        color = vec4(0.0, 1.0, 0.0, 1.0);
        redraw();
    };

    document.getElementById("blue").onclick = function () {
        color = vec4(0.0, 0.0, 1.0, 1.0);
        redraw();
    };
};

function redraw(){
    if(shape=="square")
        drawSquare();
    else if (shape=="triangle")
        drawTriangle();
    else if (shape=="circle")
        drawCircle();
}

function drawSquare(){
    var vertices = [
        vec2(-0.5, -0.5),
        vec2(-0.5, 0.5),
        vec2(0.5, 0.5),
        vec2(0.5, -0.5)
    ];

    gl.bufferData( gl.ARRAY_BUFFER, flatten( vertices ), gl.STATIC_DRAW );
    gl.uniform4fv(colorLoc, color);

    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
}

function drawTriangle(){
    var vertices = [
        vec2(0,  1/2),
        vec2(-1/2, -0.732/2), 
        vec2(1/2, -0.732/2)
    ];

    gl.bufferData( gl.ARRAY_BUFFER, flatten( vertices ), gl.STATIC_DRAW );
    gl.uniform4fv(colorLoc, color);

    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 3);
}

function drawCircle(){
    var points = [vec2(0.0, 0.0), vec2(0.0, 0.5)]; // center of circle and one point on circle
    var increment = Math.PI/180;
    for(theta = 0.0; theta <= 2*Math.PI; theta = theta + increment){
        points.push(vec2(0.5*Math.cos(theta), 0.5*Math.sin(theta)));
    }
    points.push(vec2(0.0, 0.5)); // add the beginning points on circle
    gl.bufferData( gl.ARRAY_BUFFER, flatten( points ), gl.STATIC_DRAW );
    gl.uniform4fv(colorLoc, color);

    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLE_FAN, 0, points.length);
}

