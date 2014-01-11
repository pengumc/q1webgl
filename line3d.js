/*Line3D*/

function Line3D(){
    this.bufferV = gl.createBuffer();
    this.bufferI = gl.createBuffer();
    this.vertices;
    this.indices;
    this.count;
    this.width = 1.0; //no other widths supported?
    this.color = new Float32Array([1.0, 1.0, 1.0]);
    this.start; //any object with a position[3]
    this.end;
}

Line3D.prototype.draw = _line3ddraw;
Line3D.prototype.setup_line = _setupline;

function _line3ddraw(){
    gl.bindBuffer(gl.ARRAY_BUFFER, this.bufferV);
    gl.vertexAttribPointer(gl.shader_program2.vpa, 3, gl.FLOAT, false, 0, 0);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.bufferI);
    gl.uniformMatrix4fv(gl.shader_program2.mvostart_uniform, false, this.start.mvo_matrix);
    gl.uniformMatrix4fv(gl.shader_program2.mvoend_uniform, false, this.end.mvo_matrix);
    gl.uniform3fv(gl.shader_program2.color_uniform, this.color);
    gl.lineWidth(this.width);
    gl.drawElements(gl.LINES, this.count, gl.UNSIGNED_SHORT, 0);
}

function _setupline(start, end){
    this.start = start;
    this.end = end;
    this.vertices = base_line_vertices;
    this.indices = base_line_indices;
    this.count = base_line_count;
    gl.bindBuffer(gl.ARRAY_BUFFER, this.bufferV);
    gl.bufferData(gl.ARRAY_BUFFER, this.vertices, gl.STATIC_DRAW);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.bufferI);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this.indices, gl.STATIC_DRAW);
}

var base_line_vertices = new Float32Array([
    1.0, 0.0, 0.0,
    -1.0, 0.0, 0.0
]);

var base_line_count = 2;
var base_line_indices = new Uint16Array([
    0, 1
]);
