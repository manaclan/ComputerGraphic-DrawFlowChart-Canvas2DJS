"use strict";
var scaleFactor = 1.1;// Scacle magnitude use for scale
var primitiveType = 0; //cờ để vẽ hình, 1 là hình chữ nhật, 2 là thoi, 3 là đoạn thẳng
var primitives = []; // mang de luu cac hinh hoc
var lines = []; //  array for storing connect lines between primitives
var choosingPrimitive;
var prevChoosingPrimitive;
var dragStart;
var dragForResize;
var resizesquareIndex = -1; // 0 = top left, 1 = top right, 2 = bot right, 3= bot left
var primitiveText;
// function init(){
// }

function run(){
    //requestAnimationFrame(run);
    context.transform = new Transform(context);
    draw(canvas, context);
}

function draw(canvas, context){
    context.transform.save();
    context.transform.identity();
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.transform.restore();
    context.font="20px Arial";
    for(var i=0; i<primitives.length ; i++){
        switch(primitives[i].primitiveType){
            case 1:
            {
                primitives[i].DrawRectangle(context);
                primitives[i].DrawResizeSquare(context);
                primitives[i].DisplayText(context);
                break;
            }
            case 2:
            {
                primitives[i].DrawRhombus(context);
                primitives[i].DrawResizeSquare(context);
                primitives[i].DisplayText(context);
                break;
            }
            case 4:
            {
                primitives[i].DrawTextBox(context);
                context.strokeStyle="#000000";
                primitives[i].DrawResizeSquare(context);
                primitives[i].DisplayText(context);
                break;
            }
        }
        context.transform.restore();
    }
    for(var i = 0; i < lines.length; i++){
        ConnectTwoPrimitive(primitives[lines[i].index1],primitives[lines[i].index2]);
        context.transform.restore();
    }
}

var prevMousePositionX = 0;
var prevMousePositionY = 0;
function onmousedown_Canvas(event){
    prevChoosingPrimitive = choosingPrimitive;
    //setting user select on FireFox, Chrome, Safari
    document.body.style.mozUserSelect = document.body.style.webkitUserSelect = document.body.style.userSelect = 'none';
    prevMousePositionX = event.offsetX || (event.pageX - canvas.offsetLeft);
    prevMousePositionY = event.offsetY || (event.pageY - canvas.offsetTop);
    var point = context.transform.transformPoint(prevMousePositionX,prevMousePositionY);
    if(!SetChoosingPrimitive(point.x,point.y) && primitiveType ==0  )
        dragStart = context.transform.transformPoint(prevMousePositionX,prevMousePositionY);//Create a point
    else if(choosingPrimitive > -1 && SetChoosingPrimitive(point.x,point.y) && primitiveType ==0 
            && primitives[choosingPrimitive].GetChosenSquareIndex(prevMousePositionX,prevMousePositionY) > -1 ){
        dragStart = context.transform.transformPoint(prevMousePositionX,prevMousePositionY);
        resizesquareIndex = primitives[choosingPrimitive].GetChosenSquareIndex(prevMousePositionX,prevMousePositionY);
    }
    else if(choosingPrimitive > -1 && SetChoosingPrimitive(point.x,point.y) && primitiveType ==0 
    && primitives[choosingPrimitive].GetChosenSquareIndex(prevMousePositionX,prevMousePositionY) == -1 ){
        dragStart = context.transform.transformPoint(prevMousePositionX,prevMousePositionY);
        if(prevChoosingPrimitive>-1){
            primitives[prevChoosingPrimitive].StopChoosing();
            primitives[choosingPrimitive].Choosing();
        }
    }

    draw(canvas,context);
}

function onmousemove_Canvas(event){
    prevMousePositionX = event.offsetX || (event.pageX - canvas.offsetLeft);
    prevMousePositionY = event.offsetY || (event.pageY - canvas.offsetTop);
    var point = context.transform.transformPoint(prevMousePositionX,prevMousePositionY);
    if(dragStart && choosingPrimitive == -1){                                       
        context.transform.translate(point.x-dragStart.x,point.y-dragStart.y);
        draw(canvas,context);//redraw
    }
    else if(dragStart && choosingPrimitive > -1 && resizesquareIndex > -1){
        MouseMove_UpdateResizesquareWhileResizing(point);
        dragStart = point;
        draw(canvas,context);
    }
    else if(dragStart && choosingPrimitive > -1 && resizesquareIndex == -1){
        primitives[choosingPrimitive].UpdateCoordinate(point.x-dragStart.x,point.y-dragStart.y);
        dragStart = point;
        draw(canvas,context);
    }
}

function onmouseup_Canvas(event){
    dragStart = null;
    var point = context.transform.transformPoint(prevMousePositionX,prevMousePositionY);
    switch(primitiveType)
    {
        case 0:
        {
            MouseUp_HandlePrimitiveSelection(point.x,point.y);
            resizesquareIndex = -1;
            break;
        }
        case 1:
        {
            var doDraw = 1; //  Temp variable to see whether we draw or not because of overlapping
            
            if(CheckObscure(point.x,point.y)>-1){
                doDraw =0;
                break;  
            }
            if(doDraw==1){
                primitives.push(new GeometricPrimitive(point.x,point.y,primitiveType));
            }
            primitiveType = 0;
            if(prevChoosingPrimitive>-1) primitives[prevChoosingPrimitive].StopChoosing();
            choosingPrimitive = primitives.length-1;
            draw(canvas, context);
            break;
        }
        case 2:
        {
            var doDraw = 1; //  Temp variable to see whether we draw or not because of ovejrlapping
            if(CheckObscure(point.x,point.y)> -1){
                doDraw =0;
                break;  
            }
            if(doDraw==1){
                primitives.push(new GeometricPrimitive(point.x,point.y,primitiveType));
            }
            primitiveType = 0;
            if(prevChoosingPrimitive>-1) primitives[prevChoosingPrimitive].StopChoosing();
            choosingPrimitive = primitives.length-1;
            draw(canvas, context);
            break;
        }
        case 3: //store coordinate of 2 primitive
        {
            //in case a connect line is used to connect on just one primitive
            if(choosingPrimitive > -1 && prevChoosingPrimitive > -1)
                MouseUp_Line_SelectSamePrimitiveHandle(prevMousePositionX,prevMousePositionY);
            MouseUp_Line_AddLine(point.x, point.y);
            draw(canvas, context);
            break;
        }
        case 4:
        {
            var doDraw = 1; //  Temp variable to see whether we draw or not because of ovejrlapping
            if(CheckObscure(point.x,point.y)> -1){
                doDraw =0;
                break;  
            }
            if(doDraw==1){
                primitives.push(new GeometricPrimitive(point.x,point.y,primitiveType));
            }
            primitiveType = 0;
            if(prevChoosingPrimitive>-1) primitives[prevChoosingPrimitive].StopChoosing();
            choosingPrimitive = primitives.length-1;
            draw(canvas, context);
            break;
        }
    }
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
    if(choosingPrimitive > -1){
        primitives[choosingPrimitive].StopChoosing();
        choosingPrimitive = -1;
    }
    prevChoosingPrimitive = -1;
    draw(canvas,context);
}

function onclick_AddTextButton(event){
    if(choosingPrimitive > -1){
        primitiveText = document.getElementById("text").value;
        primitives[choosingPrimitive].AddText(primitiveText);
        primitiveText = "";
        draw(canvas,context);
    }
    
}

function onclick_DeleteButton(event){
    if(choosingPrimitive > -1){
        for(var i =0 ; i < lines.length; i++){
            if(lines[i].index1 == choosingPrimitive || lines[i].index2 == choosingPrimitive){
                lines.splice(i,1);
                i--;
            }
        }
        primitives.splice(choosingPrimitive,1);
        choosingPrimitive = -1;
        prevChoosingPrimitive = -1;
        draw(canvas,context);
    }
}

function onclick_TextBox(event){
    primitiveType = 4;
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
        this.matrix = [1,0,0,1,0,0];
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
     this.transformOriginalToTransform = function(x,y){
        var point = new Point(x * this.matrix[0] + y * this.matrix[2] + this.matrix[4], 
         x * this.matrix[1] + y * this.matrix[3] + this.matrix[5]);
        return point;
     };
}