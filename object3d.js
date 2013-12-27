/*object3d*/

function Object3D(){
    this.bufferV = gl.createBuffer();
    this.bufferI = gl.createBuffer();
    this.bufferN = gl.createBuffer();
    this.vertices;
    this.indices;
    this.normals;
    this.count;
    this.color = new Float32Array([1.0, 1.0, 1.0]);
    this.position = new Float32Array([0,0,0]);
    this.R = new Float32Array(16);
    this.set_R(0,0,0);
    this.mvo_matrix = new Float32Array([
        1,0,0,0,
        0,1,0,0,
        0,0,1,0,
        0,0,0,1
    ]);

    this.scale = new Float32Array([
        .3,0,0,0,
        0,.3,0,0,
        0,0,.3,0,
        0,0,0,1,
    ]);
}

Object3D.prototype.set_position = _setpos;
Object3D.prototype.load_object = _loadobject;
Object3D.prototype.draw = _draw;
Object3D.prototype.set_R = _setR;
Object3D.prototype.load_cube = _loadcube;

function _setpos(x,y,z){
    this.position[0] = x;
    this.position[1] = y;
    this.position[2] = z;
    this.mvo_matrix[12] = this.position[0];
    this.mvo_matrix[13] = this.position[1];
    this.mvo_matrix[14] = this.position[2];
}

function _loadobject(vertices, indices, normals, count){
    this.vertices = vertices; //should be  copies?
    this.normals = normals;
    this.indices = indices;
    this.count = count;
    //vertex buffer
    gl.bindBuffer(gl.ARRAY_BUFFER, this.bufferV);
    gl.bufferData(gl.ARRAY_BUFFER, this.vertices, gl.STATIC_DRAW);
    //index buffer
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.bufferI);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this.indices, gl.STATIC_DRAW);
    //normals buffer
    gl.bindBuffer(gl.ARRAY_BUFFER, this.bufferN);
    gl.bufferData(gl.ARRAY_BUFFER, this.normals, gl.STATIC_DRAW);
}

function _draw(){
    gl.bindBuffer(gl.ARRAY_BUFFER, this.bufferV);
    gl.vertexAttribPointer(gl.shader_program1.vertex_position_attribue, 3, gl.FLOAT, false, 0, 0);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.bufferN);
    gl.vertexAttribPointer(gl.shader_program1.vertex_normal_attribute, 3, gl.FLOAT, false, 0, 0);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.bufferI);
    gl.uniformMatrix4fv(gl.shader_program1.ori_uniform, false, this.R);
    gl.uniformMatrix4fv(gl.shader_program1.mvo_uniform, false, this.mvo_matrix); 
    gl.uniformMatrix4fv(gl.shader_program1.scale_uniform, false, this.scale);
    gl.uniform3fv(gl.shader_program1.color_uniform, this.color);
    //gl.drawArrays(gl.TRIANGLE_STRIP, 0, this.count);
    gl.drawElements(gl.TRIANGLES, this.count, gl.UNSIGNED_SHORT, 0);
}

function _loadcube(){
    this.load_object(base_cube_vertices, base_cube_indices, base_cube_normals, base_cube_count);
}

function _setR(theta, psi, phi){
    //angles are along x y and z axis, in that order
    this.R.set(gen_R(theta, psi, phi));
}

function gen_R(theta, psi, phi){
    var r = new Array(16);
    var ctheta = Math.cos(theta); //x
    var stheta = Math.sin(theta); //x
    var cpsi = Math.cos(psi); //y
    var spsi = Math.sin(psi); //y
    var cphi = Math.cos(phi); //z
    var sphi = Math.sin(phi); //z
	r[0] = cphi * cpsi;	
	r[1] = -cpsi * sphi;	
	r[2] = -spsi;	
	r[3] = 0;	

	r[4] = ctheta * sphi - cphi * stheta * spsi;	
	r[5] = ctheta * cphi + stheta *sphi * spsi;	
	r[6] = -cpsi * stheta;	
	r[7] = 0;	

	r[8] = stheta * sphi + ctheta * cphi * spsi;	
	r[9] = cphi * stheta - ctheta * sphi * spsi;	
	r[10] = ctheta * cpsi;	
	r[11] = 0;	

	r[12] = 0;	
	r[13] = 0;	
	r[14] = 0;	
	r[15] = 1;	
    return(r);
}

function draw_objects(oArray, lArray){
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    //use correct program
    gl.useProgram(gl.shader_program1);
    gl.current_program = gl.shader_program1;
    //set program static uniforms
    gl.uniformMatrix4fv(gl.shader_program1.R_uniform, false, gl.shader_program1.R_matrix);
    gl.uniformMatrix4fv(gl.shader_program1.p_uniform, false, gl.shader_program1.p_matrix);
	gl.uniformMatrix4fv(gl.shader_program1.mvc_uniform, false, gl.shader_program1.mvc_matrix);
    //draw all objects that use that program
    //the o.draw dunctions are responsible for the other uniforms
    for (var o,i=0;o=oArray[i];i++){
        o.draw();
    }
    //load next program
    gl.useProgram(gl.shader_program2);
    gl.current_program = gl.shader_program2;
    //set static uniforms
    gl.uniformMatrix4fv(gl.shader_program2.R_uniform, false, gl.shader_program2.R_matrix);
    gl.uniformMatrix4fv(gl.shader_program2.p_uniform, false, gl.shader_program2.p_matrix);
    gl.uniformMatrix4fv(gl.shader_program2.mvc_uniform, false, gl.shader_program2.mvc_matrix);
    for (var l, i=0;l=lArray[i];i++){
        l.draw();
    }
}

var base_cube_vertices = new Float32Array([
    // Front face
    -1.0, -1.0,  1.0,
     1.0, -1.0,  1.0,
     1.0,  1.0,  1.0,
    -1.0,  1.0,  1.0,
    
    // Back face
    -1.0, -1.0, -1.0,
    -1.0,  1.0, -1.0,
     1.0,  1.0, -1.0,
     1.0, -1.0, -1.0,
    
    // Top face
    -1.0,  1.0, -1.0,
    -1.0,  1.0,  1.0,
     1.0,  1.0,  1.0,
     1.0,  1.0, -1.0,
    
    // Bottom face
    -1.0, -1.0, -1.0,
     1.0, -1.0, -1.0,
     1.0, -1.0,  1.0,
    -1.0, -1.0,  1.0,
    
    // Right face
     1.0, -1.0, -1.0,
     1.0,  1.0, -1.0,
     1.0,  1.0,  1.0,
     1.0, -1.0,  1.0,
    
    // Left face
    -1.0, -1.0, -1.0,
    -1.0, -1.0,  1.0,
    -1.0,  1.0,  1.0,
    -1.0,  1.0, -1.0
]);

var base_cube_count = 36;
var base_cube_indices = new Uint16Array([
    0,1,2,  0,2,3, //front
    4,5,6,  4,6,7, //back
    8,9,10,  8,10,11, //top
    12,13,14,  12,14,15, //bottom
    16,17,18,  16,18,19, //right
    20,21,22,  20,22,23 //left
]);

var base_cube_normals = new Float32Array([
    // Front face
    0.0, 0.0, 1.0,
    0.0, 0.0, 1.0,
    0.0, 0.0, 1.0,
    0.0, 0.0, 1.0,
    
    // Back face
    0.0, 0.0, -1.0,
    0.0, 0.0, -1.0,
    0.0, 0.0, -1.0,
    0.0, 0.0, -1.0,

    // Top face
    0.0, 1.0, 0.0,
    0.0, 1.0, 0.0,
    0.0, 1.0, 0.0,
    0.0, 1.0, 0.0,
    
    // Bottom face
    0.0, -1.0, 0.0,
    0.0, -1.0, 0.0,
    0.0, -1.0, 0.0,
    0.0, -1.0, 0.0,
    
    // Right face
    1.0, 0.0, 0.0,
    1.0, 0.0, 0.0,
    1.0, 0.0, 0.0,
    1.0, 0.0, 0.0,
    
    // Left face
    -1.0, 0.0, 0.0,
    -1.0, 0.0, 0.0,
    -1.0, 0.0, 0.0,
    -1.0, 0.0, 0.0
]);


function matrix_mult(a, b){
    var a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3],
        a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7],
        a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11],
        a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15];
    var out = new Array(16);
    var b0 = b[0], b1 = b[1], b2 = b[2], b3 = b[3];
    out[0] = b0*a00 + b1*a10 + b2*a20 + b3*a30;
    out[1] = b0*a01 + b1*a11 + b2*a21 + b3*a31;
    out[2] = b0*a02 + b1*a12 + b2*a22 + b3*a32;
    out[3] = b0*a03 + b1*a13 + b2*a23 + b3*a33;

    b0 = b[4]; b1 = b[5]; b2 = b[6]; b3 = b[7];
    out[4] = b0*a00 + b1*a10 + b2*a20 + b3*a30;
    out[5] = b0*a01 + b1*a11 + b2*a21 + b3*a31;
    out[6] = b0*a02 + b1*a12 + b2*a22 + b3*a32;
    out[7] = b0*a03 + b1*a13 + b2*a23 + b3*a33;

    b0 = b[8]; b1 = b[9]; b2 = b[10]; b3 = b[11];
    out[8] = b0*a00 + b1*a10 + b2*a20 + b3*a30;
    out[9] = b0*a01 + b1*a11 + b2*a21 + b3*a31;
    out[10] = b0*a02 + b1*a12 + b2*a22 + b3*a32;
    out[11] = b0*a03 + b1*a13 + b2*a23 + b3*a33;

    b0 = b[12]; b1 = b[13]; b2 = b[14]; b3 = b[15];
    out[12] = b0*a00 + b1*a10 + b2*a20 + b3*a30;
    out[13] = b0*a01 + b1*a11 + b2*a21 + b3*a31;
    out[14] = b0*a02 + b1*a12 + b2*a22 + b3*a32;
    out[15] = b0*a03 + b1*a13 + b2*a23 + b3*a33;
    return out;    
}