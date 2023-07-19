var gl;
var points;    // hold points in fire work
var t;         // time 
var g = 3;     // gravity, of course, suppose to be 9.8
var total;     // total spinkles
var v0;        // initial volocity
var maxHeight = 0.80; // how high the firework goes up
var maxTime;   // how long firework last

var speed = 0.0;  // heigt from the ground, initialy on ground
var speedLoc;

var color = vec4(1.0, 0.0, 0.0, 1.0); // color of drawing
var colorLoc;

var fired = false;
var program;
var fireBuffer;
var vPosition;

window.onload = function init()
{
    var canvas = document.getElementById( "gl-canvas" );
    
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    //
    //  Configure WebGL
    //
    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 0.0, 0.0, 0.0, 1.0 );

    program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );
   
    // Load the data into the GPU    
    
    fireBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, fireBuffer);

    // Associate our shader variables with our data buffer
    
    vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray(vPosition);
    
    speedLoc = gl.getUniformLocation(program, "speed");
    colorLoc = gl.getUniformLocation(program, "color");

    // Initialize event handlers
    document.getElementById("fire").onclick = function () {
        fired = true;
        maxHeight = 0.5 + Math.random() * 0.40;
        speed = 0;
        fire()
    };

    fire();
};

function fire(){
    var vertices = [
        vec2(0.0, 0.0),
        vec2(0.0, 0.1), 
        vec2(0.02, 0.1),
        vec2(0.02, 0.0)
    ];
    color = vec4(1.0, 0.0, 0.0, 1.0);
    //  Load shaders and initialize attribute buffers
    gl.bufferData(gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW);

    drawFireWorkUp();
}

function explore(){
    points = [];
    v0 = 1;
    t = 0.02;
    total = 20 + Math.random() * 10;
    maxTime = 0.4 + Math.random() / 4.0;
    color = vec4(Math.random(), Math.random(), Math.random(), 1.0);
    drawExplore();
}

function drawExplore(){
    //  Load shaders and initialize attribute buffers
    for(n = 1; n <= total; n++){
        points.push(vec2(t*v0*Math.cos(2 * n * Math.PI / total), t*v0*Math.sin(2 * n * Math.PI / total) - 0.5*g*t*t));
    }
    gl.bufferData(gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW);
    gl.clear( gl.COLOR_BUFFER_BIT );
    gl.uniform1f(speedLoc, speed);
    gl.uniform4fv(colorLoc, color);
    gl.drawArrays( gl.POINT, 0, points.length);
    t += 0.02
    if(t <= maxTime){
        setTimeout(
            function () {requestAnimFrame( drawExplore );},
            30
        );
    }
    else {
        speed = 0;
        maxHeight = 1.50 + Math.random() * 0.40;
        fired = true;
        fire();
    }
}

function drawFireWorkUp()
{
    gl.clear( gl.COLOR_BUFFER_BIT );
    gl.uniform1f(speedLoc, speed);
    gl.uniform4fv(colorLoc, color);
    gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);

    if(speed > maxHeight){
        fired = false;
        explore();
    } 
    else if(fired){
        speed = speed + 0.02;
        setTimeout(
            function () {requestAnimFrame( drawFireWorkUp );},
            10
        );
    }
   
}