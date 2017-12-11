"use strict";
var scaleFactor = 1.1;// Scacle magnitude use for scale
var primitiveType = 0; //cờ để vẽ hình, 1 là hình chữ nhật, 2 là thoi, 3 là đoạn thẳng
var primitives = []; // mang de luu cac hinh hoc
var lines = []; //  array for storing connect lines between primitives
var firstConnectingPrimitive = null; //    first selected primitive to draw a connect line
var chosingPrimitive;
var dragged;
var dragStart;
// function init(){
// }

function run(){
    //requestAnimationFrame(run);
    context.transform = new Transform(context);
    draw(canvas, context);
}

function draw(canvas, context){
    context.transform.save();
    context.transform.setTransform(1,0,0,1,0,0);
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.transform.restore();
    for(var i=0; i<primitives.length ; i++){
        switch(primitives[i].primitiveType){
            case 1:
            {
                drawRectangle(primitives[i].xCoordinate, primitives[i].yCoordinate);
                break;
            }
            case 2:
            {
                drawRhombus(primitives[i].xCoordinate, primitives[i].yCoordinate);
                break;
            }
        }
        context.transform.restore();
    }
    for(var i = 0; i < lines.length; i++){
        drawLine(lines[i].x1,lines[i].y1,lines[i].x2,lines[i].y2);
        context.transform.restore();
    }
}

//  Draw a rectangle for statement
function drawRectangle(xCoordinate, yCoordinate){
    context.beginPath();
    context.moveTo(xCoordinate-34, yCoordinate-18);
    context.lineTo(xCoordinate+34, yCoordinate-18);
    context.lineTo(xCoordinate+34, yCoordinate+18);
    context.lineTo(xCoordinate-34, yCoordinate+18);
    context.closePath();
    context.stroke();
}

//  Draw a rhombus for If-else condition
function drawRhombus(xCoordinate, yCoordinate){
    context.beginPath();
    context.moveTo(xCoordinate, yCoordinate-18);
    context.lineTo(xCoordinate+34, yCoordinate);
    context.lineTo(xCoordinate, yCoordinate+18);
    context.lineTo(xCoordinate-34, yCoordinate);
    context.closePath();
    context.stroke();
}

function drawLine(x1, y1, x2, y2){
    context.beginPath();
    context.moveTo(x1,y1);
    context.lineTo(x2,y2);
    context.stroke();
}

var prevMousePositionX = 0;
var prevMousePositionY = 0;
function onmousedown_Canvas(event){
    //setting user select on FireFox, Chrome, Safari
    document.body.style.mozUserSelect = document.body.style.webkitUserSelect = document.body.style.userSelect = 'none';
    prevMousePositionX = event.offsetX || (evt.pageX - canvas.offsetLeft);
    prevMousePositionY = event.offsetY || (evt.pageY - canvas.offsetTop);
    if(!SetChosingPrimitive(prevMousePositionX,prevMousePositionY) && primitiveType ==0)
        dragStart = context.transform.transformPoint(prevMousePositionX,prevMousePositionY);//Create a point
    dragged = false;
}

function onmousemove_Canvas(event){
        prevMousePositionX = event.offsetX;
        prevMousePositionY = event.offsetY;
        dragged = true;
        if(dragStart){

            var point = context.transform.transformPoint(prevMousePositionX,prevMousePositionY);//Create a point at current position                                                   
            context.transform.translate(point.x-dragStart.x,point.y-dragStart.y);
            //dragStart = point;
            draw(canvas,context);//redraw
        }
}

function onmouseup_Canvas(event){
    dragStart = null;
    var point = context.transform.transformPoint(prevMousePositionX,prevMousePositionY);
    if(!dragged)
        switch(primitiveType)
        {
            case 0:
            {
                if(!SetChosingPrimitive(prevMousePositionX,prevMousePositionY)){
                    chosingPrimitive = null;
                }
                break;
            }
            case 1:
            {
                var doDraw = 1; //  Temp variable to see whether we draw or not because of overlapping
                
                for(var i=0; i<primitives.length ; i++)
                    if(primitives[i].isChosenOROverlapping(prevMousePositionX,prevMousePositionY))
                    {
                        doDraw =0;
                        break;   
                    }
                if(doDraw==1){
                    primitives.push(new GeometricPrimitive(point.x,point.y,primitiveType));
                }
                    
                primitiveType = 0;
                draw(canvas, context);
                break;
            }
            case 2:
            {
                var doDraw = 1; //  Temp variable to see whether we draw or not because of overlapping
                for(var i=0; i<primitives.length ; i++)
                    if(primitives[i].isChosenOROverlapping(prevMousePositionX,prevMousePositionY))
                    {
                     doDraw =0;
                     break;   
                    }
                if(doDraw==1){
                    primitives.push(new GeometricPrimitive(point.x,point.y,primitiveType));
                }
                    primitiveType = 0;
                    draw(canvas, context);
                break;
            }
            case 3: //store coordinate of 2 primitive
            {
                
                for(var i=0; i<primitives.length ; i++){
                    if(primitives[i].isChosenOROverlapping(point.x,point.y))
                    {
                        // if first primitive wasn't stored then store it
                        if(firstConnectingPrimitive == null)
                            {
                                firstConnectingPrimitive = primitives[i];
                                break;
                            }
                        // if first primitive was stored then store 2 primitive to the line
                        else if(!isSamePrimitive(firstConnectingPrimitive,primitives[i])){
                            switch(firstConnectingPrimitive.onWhatSide(primitives[i]))
                            {
                                case 0://dx>dy
                                {
                                    lines.push(new Line(primitives[i].xCoordinate+34,primitives[i].yCoordinate,
                                        firstConnectingPrimitive.xCoordinate-34,firstConnectingPrimitive.yCoordinate));
                                    primitiveType = 0;
                                    firstConnectingPrimitive = null;
                                    break;
                                }
                                case 1://dx>dy
                                {
                                    lines.push(new Line(primitives[i].xCoordinate-34,primitives[i].yCoordinate,
                                        firstConnectingPrimitive.xCoordinate+34,firstConnectingPrimitive.yCoordinate));
                                    primitiveType = 0;
                                    firstConnectingPrimitive = null;
                                    break;
                                }
                                case 2:
                                {
                                    lines.push(new Line(primitives[i].xCoordinate,primitives[i].yCoordinate+18,
                                        firstConnectingPrimitive.xCoordinate,firstConnectingPrimitive.yCoordinate-18));
                                    primitiveType = 0;
                                    firstConnectingPrimitive = null;
                                    break;
                                }
                                case 3:
                                {
                                    lines.push(new Line(primitives[i].xCoordinate,primitives[i].yCoordinate-18,
                                        firstConnectingPrimitive.xCoordinate,firstConnectingPrimitive.yCoordinate+18));
                                    primitiveType = 0;
                                    firstConnectingPrimitive = null;
                                    break;
                                }
                            }
                        }
                    }
                }
                draw(canvas, context);
                break;
            }
    }
    
}



function isSamePrimitive(primitive1, primitive2){
    return (primitive1.xCoordinate == primitive2.xCoordinate && primitive1.yCoordinate == primitive2.yCoordinate) ?
    true : false;
}

 
function SetChosingPrimitive(x, y){
    for(var i = 0;i<primitives.length;i++){
        if(primitives[i].isChosenOROverlapping(x,y)) {
            chosingPrimitive = new GeometricPrimitive(primitives[i].xCoordinate,
                                                                    primitives[i].yCoordinate,primitives[i].primitiveType);
            return true;
        }
    }
    return false;
}
function Zoom(wheelNumber){
    prevMousePositionX = event.offsetX;
    prevMousePositionY = event.offsetY;
    var point = context.transform.transformPoint(prevMousePositionX,prevMousePositionY);
    context.transform.translate(point.x,point.y);
    var factor = Math.pow(scaleFactor, wheelNumber);
    context.transform.scale(factor,factor);
    context.transform.translate(-point.x,-point.y);
    draw(canvas,context);
}

//  Handle scroll event
function Scroll(event){
    var delta = -event.deltaY/40;
    if(delta) Zoom(delta);
}

//  When click on statement rectangle
function onclick_Statement(event){
    primitiveType = 1;
}

//  When click on If-els rectangle
function onclick_If_Else(event){
    primitiveType = 2;
}

//  When click on Connect rectangle
function onclick_Line(event){
    primitiveType = 3;
}

function Transform(context) {
    this.context = context;
    this.matrix = [1,0,0,1,0,0]; //initialize with the identity matrix
    this.stack = [];
    
    //==========================================
    // Constructor, getter/setter
    //==========================================    
    
    this.setContext = function(context) {
        this.context = context;
    };

    this.getMatrix = function() {
        return this.matrix;
    };
    
    this.setMatrix = function(m) {
        this.matrix = [m[0],m[1],m[2],m[3],m[4],m[5]];
        this.setTransform();
    };
    
    this.cloneMatrix = function(m) {
        return [m[0],m[1],m[2],m[3],m[4],m[5]];
    };
    
    //==========================================
    // Stack
    //==========================================
    
    this.save = function() {
        var matrix = this.cloneMatrix(this.getMatrix());
        this.stack.push(matrix);
        
        if (this.context) this.context.save();
    };

    this.restore = function() {
        if (this.stack.length > 0) {
            var matrix = this.stack.pop();
            this.setMatrix(matrix);
        }
        
        if (this.context) this.context.restore();
    };

    //==========================================
    // Matrix
    //==========================================

    this.setTransform = function() {
        if (this.context) {
            this.context.setTransform(
                this.matrix[0],
                this.matrix[1],
                this.matrix[2],
                this.matrix[3],
                this.matrix[4],
                this.matrix[5]
            );
        }
    };
    
    this.translate = function(x, y) {
        this.matrix[4] += this.matrix[0] * x + this.matrix[2] * y;
        this.matrix[5] += this.matrix[1] * x + this.matrix[3] * y;
        
        this.setTransform();
    };
    
    this.rotate = function(rad) {
        var c = Math.cos(rad);
        var s = Math.sin(rad);
        var m11 = this.matrix[0] * c + this.matrix[2] * s;
        var m12 = this.matrix[1] * c + this.matrix[3] * s;
        var m21 = this.matrix[0] * -s + this.matrix[2] * c;
        var m22 = this.matrix[1] * -s + this.matrix[3] * c;
        this.matrix[0] = m11;
        this.matrix[1] = m12;
        this.matrix[2] = m21;
        this.matrix[3] = m22;
        
        this.setTransform();
    };

    this.scale = function(sx, sy) {
        this.matrix[0] *= sx;
        this.matrix[1] *= sx;
        this.matrix[2] *= sy;
        this.matrix[3] *= sy;
        
        this.setTransform();
    };
    
    //==========================================
    // Matrix extensions
    //==========================================

    this.rotateDegrees = function(deg) {
        var rad = deg * Math.PI / 180;
        this.rotate(rad);
    };

    this.rotateAbout = function(rad, x, y) {
        this.translate(x, y);
        this.rotate(rad);
        this.translate(-x, -y);
        this.setTransform();
    }

    this.rotateDegreesAbout = function(deg, x, y) {
        this.translate(x, y);
        this.rotateDegrees(deg);
        this.translate(-x, -y);
        this.setTransform();
    }
    
    this.identity = function() {
        this.m = [1,0,0,1,0,0];
        this.setTransform();
    };

    this.multiply = function(matrix) {
        var m11 = this.matrix[0] * matrix.m[0] + this.matrix[2] * matrix.m[1];
        var m12 = this.matrix[1] * matrix.m[0] + this.matrix[3] * matrix.m[1];

        var m21 = this.matrix[0] * matrix.m[2] + this.matrix[2] * matrix.m[3];
        var m22 = this.matrix[1] * matrix.m[2] + this.matrix[3] * matrix.m[3];

        var dx = this.matrix[0] * matrix.m[4] + this.matrix[2] * matrix.m[5] + this.matrix[4];
        var dy = this.matrix[1] * matrix.m[4] + this.matrix[3] * matrix.m[5] + this.matrix[5];

        this.matrix[0] = m11;
        this.matrix[1] = m12;
        this.matrix[2] = m21;
        this.matrix[3] = m22;
        this.matrix[4] = dx;
        this.matrix[5] = dy;
        this.setTransform();
    };

    this.invert = function() {
        var d = 1 / (this.matrix[0] * this.matrix[3] - this.matrix[1] * this.matrix[2]);
        var m0 = this.matrix[3] * d;
        var m1 = -this.matrix[1] * d;
        var m2 = -this.matrix[2] * d;
        var m3 = this.matrix[0] * d;
        var m4 = d * (this.matrix[2] * this.matrix[5] - this.matrix[3] * this.matrix[4]);
        var m5 = d * (this.matrix[1] * this.matrix[4] - this.matrix[0] * this.matrix[5]);
        this.matrix[0] = m0;
        this.matrix[1] = m1;
        this.matrix[2] = m2;
        this.matrix[3] = m3;
        this.matrix[4] = m4;
        this.matrix[5] = m5;
        this.setTransform();
        
    };
    
     //==========================================
    // Helpers
    //==========================================

    this.transformPoint = function(x, y) {// This function help map the click position to the original position
        this.invert();
        var point = new Point(x * this.matrix[0] + y * this.matrix[2] + this.matrix[4], 
         x * this.matrix[1] + y * this.matrix[3] + this.matrix[5]);
        this.invert();
        return point;
    };
}