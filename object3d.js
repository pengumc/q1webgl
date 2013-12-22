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
        3,0,0,1
    ]);

    this.scale = new Float32Array([
        .3,0,0,0,
        0,.3,0,0,
        0,0,.3,0,
        0,0,0,1,
    ]);
}

Object3D.prototype.set_position = function(x, y, z){
    this.position[0] = x;
    this.position[1] = y;
    this.position[2] = z;
    this.mvo_matrix[12] = this.position[0];
    this.mvo_matrix[13] = this.position[1];
    this.mvo_matrix[14] = this.position[2];
}

Object3D.prototype.load_object = function(vertices, indices, normals, count){
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

Object3D.prototype.draw = function(){
    gl.bindBuffer(gl.ARRAY_BUFFER, this.bufferV);
    gl.vertexAttribPointer(vertex_position_attribue, 3, gl.FLOAT, false, 0, 0);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.bufferN);
    gl.vertexAttribPointer(vertex_normal_attribute, 3, gl.FLOAT, false, 0, 0);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.bufferI);
    gl.uniformMatrix4fv(ori_uniform, false, this.R);
    gl.uniformMatrix4fv(mvo_uniform, false, this.mvo_matrix); 
    gl.uniformMatrix4fv(scale_uniform, false, this.scale);
    gl.uniform3fv(color_uniform, this.color);
    //gl.drawArrays(gl.TRIANGLE_STRIP, 0, this.count);
    gl.drawElements(gl.TRIANGLES, this.count, gl.UNSIGNED_SHORT, 0);
}

Object3D.prototype.load_cube = function(){
    this.load_object(base_cube_vertices, base_cube_indices, base_cube_normals, base_cube_count);
}

Object3D.prototype.set_R = function(theta, psi, phi){
    //angles are along x y and z axis, in that order
    var ctheta = Math.cos(theta); //x
    var stheta = Math.sin(theta); //x
    var cpsi = Math.cos(psi); //y
    var spsi = Math.sin(psi); //y
    var cphi = Math.cos(phi); //z
    var sphi = Math.sin(phi); //z
	this.R[0] = cphi * cpsi;	
	this.R[1] = -cpsi * sphi;	
	this.R[2] = -spsi;	
	this.R[3] = 0;	

	this.R[4] = ctheta * sphi - cphi * stheta * spsi;	
	this.R[5] = ctheta * cphi + stheta *sphi * spsi;	
	this.R[6] = -cpsi * stheta;	
	this.R[7] = 0;	

	this.R[8] = stheta * sphi + ctheta * cphi * spsi;	
	this.R[9] = cphi * stheta - ctheta * sphi * spsi;	
	this.R[10] = ctheta * cpsi;	
	this.R[11] = 0;	

	this.R[12] = 0;	
	this.R[13] = 0;	
	this.R[14] = 0;	
	this.R[15] = 1;	

}

function draw_objects(oArray){
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	gl.uniformMatrix4fv(p_uniform, false, p_matrix);
	gl.uniformMatrix4fv(mvc_uniform, false, mvc_matrix);
    for (var o,i=0;o=oArray[i];i++){
        o.draw();
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