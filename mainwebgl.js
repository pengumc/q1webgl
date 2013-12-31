/* webgl main.js*/

var gl;
var t = (new Date()).getTime()
var Q1;
var debuge;

function start() {
    debuge = document.getElementById("debug");
	var cv = document.getElementById("webglcv");
    cv.addEventListener("wheel", scroll);
    cv.addEventListener("mousedown", mousedown);
    cv.addEventListener("mouseup", mouseup);
    cv.addEventListener("mouseleave", mouseleave);
    cv.addEventListener("mousemove", mousemove);
	gl = cv.getContext("webgl");
	
    gl.shader_program1 = build_program1();
    gl.shader_program2 = build_program2();
    gl.shader_program3 = build_program3();
    setup_readback();
    set_R(0,0,0);
    // gl.useProgram(gl.shader_program1);
    // gl.current_program = gl.shader_program1;
	gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.enable(gl.DEPTH_TEST);
    
    Q1 = new Q1Model();
    Q1.configure_default();
    
    window.setInterval(function(){
        Q1.draw();
    }, 1000/30);
}

function setup_readback(){
    //framebuffer
    gl.readbackFB = gl.createFramebuffer();
    gl.readbackTexture = gl.createTexture();
    gl.bindFramebuffer(gl.FRAMEBUFFER, gl.readbackFB);
    //texture
    gl.bindTexture(gl.TEXTURE_2D, gl.readbackTexture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
    //gl.generateMipmap(gl.TEXTURE_2D);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 512, 512, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
    //renderbuffer
    gl.readbackRB = gl.createRenderbuffer();
    gl.bindRenderbuffer(gl.RENDERBUFFER, gl.readbackRB);
    gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, 512, 512);
    //link up
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, gl.readbackTexture, 0);
    gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, gl.readbackRB);
    
    //cleanup
    gl.bindRenderbuffer(gl.RENDERBUFFER, null);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.bindTexture(gl.TEXTURE_2D, null);
    gl.readbackPixels = new Uint8Array(512*512*4);
}

function build_program1(){
	var shader_program = gl.createProgram();
	gl.attachShader(shader_program, create_vertex_shader1());
	gl.attachShader(shader_program, create_fragment_shader1());
	gl.linkProgram(shader_program);

	shader_program.vertex_position_attribute = gl.getAttribLocation(shader_program, "aVertexPosition");
	gl.enableVertexAttribArray(shader_program.vertex_position_attribute);
    
    shader_program.vertex_normal_attribute = gl.getAttribLocation(shader_program, "aVertexNormal")
    gl.enableVertexAttribArray(shader_program.vertex_normal_attribute);
	
	shader_program.p_uniform = gl.getUniformLocation(shader_program, "uPMatrix");
	shader_program.p_matrix = generate_perspective_matrix(45, 0.1, 100.0, 640.0, 480.0 );
    
	shader_program.mvc_uniform = gl.getUniformLocation(shader_program, "uMVCMatrix");
	shader_program.mvc_matrix = new Float32Array([
		1,0,0,0,
		0,1,0,0,
		0,0,1,0,
		0,4,-38,1
	]);

	shader_program.mvo_uniform = gl.getUniformLocation(shader_program, "uMVOMatrix");
	shader_program.ori_uniform = gl.getUniformLocation(shader_program, "uOriMatrix");
    shader_program.color_uniform = gl.getUniformLocation(shader_program, "uColor");
	shader_program.scale_uniform = gl.getUniformLocation(shader_program, "uScaleMatrix");
	shader_program.R_uniform = gl.getUniformLocation(shader_program, "uRMatrix");
    shader_program.R_matrix = new Float32Array(16);
    return(shader_program);
}

function build_program2(){
	var shader_program = gl.createProgram();
	gl.attachShader(shader_program, create_vertex_shader2());
	gl.attachShader(shader_program, create_fragment_shader1());
	gl.linkProgram(shader_program);

	shader_program.vpa = gl.getAttribLocation(shader_program, "aVertexPosition");
	gl.enableVertexAttribArray(shader_program.vpa);
        
	shader_program.mvostart_uniform = gl.getUniformLocation(shader_program, "uMVOMatrixStart");
	shader_program.mvoend_uniform = gl.getUniformLocation(shader_program, "uMVOMatrixEnd");
    shader_program.color_uniform = gl.getUniformLocation(shader_program, "uColor");
    //let's just assume program1 exists
	shader_program.p_uniform = gl.getUniformLocation(shader_program, "uPMatrix");
	shader_program.p_matrix = gl.shader_program1.p_matrix;
	shader_program.R_uniform = gl.getUniformLocation(shader_program, "uRMatrix");
    shader_program.R_matrix = gl.shader_program1.R_matrix; 
	shader_program.mvc_uniform = gl.getUniformLocation(shader_program, "uMVCMatrix");
	shader_program.mvc_matrix = gl.shader_program1.mvc_matrix;
    return(shader_program);
}

function build_program3(){
	var shader_program = gl.createProgram();
	gl.attachShader(shader_program, create_vertex_shader3());
	gl.attachShader(shader_program, create_fragment_shader3());
	gl.linkProgram(shader_program);

	shader_program.vertex_position_attribute = gl.getAttribLocation(shader_program, "aVertexPosition");
	gl.enableVertexAttribArray(shader_program.vertex_position_attribute);
    
	shader_program.mvo_uniform = gl.getUniformLocation(shader_program, "uMVOMatrix");
    shader_program.ori_uniform = gl.getUniformLocation(shader_program, "uOriMatrix");
    shader_program.index_uniform = gl.getUniformLocation(shader_program, "uIndex");
    shader_program.scale_uniform = gl.getUniformLocation(shader_program, "uScaleMatrix");
    //let's just assume program1 exists
	shader_program.p_uniform = gl.getUniformLocation(shader_program, "uPMatrix");
	shader_program.p_matrix = gl.shader_program1.p_matrix;
	shader_program.R_uniform = gl.getUniformLocation(shader_program, "uRMatrix");
    shader_program.R_matrix = gl.shader_program1.R_matrix; 
	shader_program.mvc_uniform = gl.getUniformLocation(shader_program, "uMVCMatrix");
	shader_program.mvc_matrix = gl.shader_program1.mvc_matrix;
    return(shader_program);
}

function create_fragment_shader1(){
	var src = document.getElementById("fragment_shader_src").innerHTML;
	var fragment_shader = gl.createShader(gl.FRAGMENT_SHADER);
	gl.shaderSource(fragment_shader, src);
	gl.compileShader(fragment_shader);
	console.log(gl.getShaderInfoLog(fragment_shader));
	return(fragment_shader);
	 
}

function create_vertex_shader1(){
	var src = document.getElementById("vertex_shader_src").innerHTML;
	var shader = gl.createShader(gl.VERTEX_SHADER);
	gl.shaderSource(shader, src);
	gl.compileShader(shader);
	console.log(gl.getShaderInfoLog(shader));
	return(shader);
}

function create_vertex_shader2(){
	var src = document.getElementById("line_shader").innerHTML;
	var shader = gl.createShader(gl.VERTEX_SHADER);
	gl.shaderSource(shader, src);
	gl.compileShader(shader);
	console.log(gl.getShaderInfoLog(shader));
	return(shader);
}

function create_vertex_shader3(){
	var src = document.getElementById("dumb_vertex_shader").innerHTML;
	var shader = gl.createShader(gl.VERTEX_SHADER);
	gl.shaderSource(shader, src);
	gl.compileShader(shader);
	console.log(gl.getShaderInfoLog(shader));
	return(shader);
}

function create_fragment_shader3(){
	var src = document.getElementById("dumb_fragment_shader").innerHTML;
	var fragment_shader = gl.createShader(gl.FRAGMENT_SHADER);
	gl.shaderSource(fragment_shader, src);
	gl.compileShader(fragment_shader);
	console.log(gl.getShaderInfoLog(fragment_shader));
	return(fragment_shader);
	 
}


function generate_perspective_matrix(fov, near, far, w, h){
	//fov in degrees
	var a = w/h;
	var nf = 1/(near-far);
	var nf1 = nf * (near+far);
	var nf2 = 2.0 * nf * (near*far);
	var f = 1.0/Math.tan(fov*Math.PI/360);
	var m = new Float32Array([
	 	f/a,	0,		0,		0,
	 	0,		f,		0,		0,
	 	0,		0,		nf1,	-1,
	 	0,		0,		nf2,	0
	]);
	return(m);
}

function set_R(theta, psi, phi){
    gl.shader_program1.R_matrix.set(gen_R(theta, psi, phi));
}

function scroll(e){
    if(e.deltaY<0){
        gl.shader_program1.mvc_matrix[14] += 1;
    }else if(e.deltaY>0){
        gl.shader_program1.mvc_matrix[14] -= 1;
    }
    e.preventDefault();
}

var dragging = false;
var draglastx;
var draglasty;
function mouseup(e){
    if(e.button != 0) return
    dragging = false;
}
function mousedown(e){
    if(e.button != 0) return
    dragging = true;
    draglastx = e.clientX;
    draglasty = e.clientY;
}
function mouseleave(e){
    dragging = false;
}
function mousemove(e){
    var x,y,i;
    x = e.clientX - this.offsetLeft;
    y = 512 - (e.clientY - this.offsetTop);
    i = gl.readbackPixels[y*512*4 + x*4+2]-1;
    debuge.innerHTML = i;
    Q1.select(i);
    
    if(e.button != 0) return
    if (dragging){
        x = e.clientX;
        y = e.clientY;
        if (e.ctrlKey){
            gl.shader_program1.R_matrix.set(matrix_mult(
                gen_R((draglasty-y)*0.01, 0.0, (x-draglastx)*0.01),
                gl.shader_program1.R_matrix
            ));
        }else{
            gl.shader_program1.R_matrix.set(matrix_mult(
                gen_R((draglasty-y)*0.01, (x-draglastx)*0.01, 0.0),
                gl.shader_program1.R_matrix
            ));
        }
        gl.uniformMatrix4fv(gl.current_program.R_uniform, false, gl.current_program.R_matrix);
        draglastx=x;
        draglasty=y;
    }
}