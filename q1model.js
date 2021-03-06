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
    //  base
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
    //  leg1
    l = new Line3D();
    l.setup_line(this.servos[0], this.servos[1]);
    this.lines.push(l);
    l = new Line3D();
    l.setup_line(this.servos[1], this.servos[2]);
    this.lines.push(l);
    l = new Line3D();
    l.setup_line(this.servos[2], this.endpoints[0]);
    this.lines.push(l);
    //  leg2
    l = new Line3D();
    l.setup_line(this.servos[3], this.servos[4]);
    this.lines.push(l);
    l = new Line3D();
    l.setup_line(this.servos[4], this.servos[5]);
    this.lines.push(l);
    l = new Line3D();
    l.setup_line(this.servos[5], this.endpoints[1]);
    this.lines.push(l);
    //  leg3
    l = new Line3D();
    l.setup_line(this.servos[6], this.servos[7]);
    this.lines.push(l);
    l = new Line3D();
    l.setup_line(this.servos[7], this.servos[8]);
    this.lines.push(l);
    l = new Line3D();
    l.setup_line(this.servos[8], this.endpoints[2]);
    this.lines.push(l);
    //  leg4
    l = new Line3D();
    l.setup_line(this.servos[9], this.servos[10]);
    this.lines.push(l);
    l = new Line3D();
    l.setup_line(this.servos[10], this.servos[11]);
    this.lines.push(l);
    l = new Line3D();
    l.setup_line(this.servos[11], this.endpoints[3]);
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

Q1Model.prototype.select = function(i){
    if(this.selection_i>=0 && this.selection_i != i){
    //something still highlighted and selection has changed, so unhighlight
        if(this.selection_i < 12){
            this.servos[this.selection_i].color.set([1,0,0]);
        }else if (this.selection_i <16){
            this.endpoints[this.selection_i-12].color.set([0,1,1]);
        }
    }
    if(i>=0){
        if(i<12){
            this.servos[i].color.set([0,1,0]);
        }else if(i<16){
            this.endpoints[i-12].color.set([0,1,0]);
        }
    }
    this.selection_i = i;
}