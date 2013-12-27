/*Q1Model*/
function Q1Model(){
    this.servos = new Array();
    for (var i=0;i<12;i++){
        var c = new Object3D();
        c.load_cube();
        c.color[0] = 1.0;
        c.color[1] = 0.0;
        c.color[2] = 0.0;
        this.servos.push(c);
    }
    this.endpoints = new Array();
    for(var i=0;i<4;i++){
        var c = new Object3D();
        c.load_cube();
        c.color[0] = 0.0;
        c.color[0] = 1.0;
        c.color[0] = 0.0;
        this.endpoints.push(c);
    }
    //lines
    this.lines = new Array();
    var l;
    l = new Line3D();
    l.setup_line(this.servos[0], this.servos[3]);
    this.lines.push(l);
    l = new Line3D();
    l.setup_line(this.servos[3], this.servos[9]);
    this.lines.push(l);
    l = new Line3D();
    l.setup_line(this.servos[6], this.servos[9]);
    this.lines.push(l);
    l = new Line3D();
    l.setup_line(this.servos[6], this.servos[0]);
    this.lines.push(l);

}

Q1Model.prototype.configure_default = function(){
    this.servos[0].set_position(3.4, 3.4, 0.0);
    this.servos[1].set_position(6.8, 3.4, 0.0);
    this.servos[2].set_position(13.6, 3.4, 0.0);
    this.endpoints[0].set_position(3.4+3.4+6.8, 3.4, -10);
    
    this.servos[3].set_position(-3.4, 3.4, 0.0);
    this.servos[4].set_position(-6.8, 3.4, 0.0);
    this.servos[5].set_position(-13.6, 3.4, 0.0);
    this.endpoints[1].set_position(-13.6, 3.4, -10);

    this.servos[6].set_position(3.4, -3.4, 0.0);
    this.servos[7].set_position(6.8, -3.4, 0.0);
    this.servos[8].set_position(13.6, -3.4, 0.0);
    this.endpoints[2].set_position(13.6, -3.4, -10);

    this.servos[9].set_position(-3.4, -3.4, 0.0);
    this.servos[10].set_position(-6.8, -3.4, 0.0);
    this.servos[11].set_position(-13.6, -3.4, 0.0);
    this.endpoints[3].set_position(-13.6, -3.4, -10);
}

Q1Model.prototype.draw = function(){
    draw_objects(this.servos.concat(this.endpoints), this.lines);
}