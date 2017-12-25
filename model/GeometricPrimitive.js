class GeometricPrimitive {
    constructor(xCoordinate, yCoordinate, primitiveType) {
        this.topleft = new ResizeSquare(xCoordinate-34,yCoordinate - 18);
        this.topright = new ResizeSquare(xCoordinate + 34,yCoordinate - 18);
        this.botright = new ResizeSquare(xCoordinate + 34,yCoordinate +18);
        this.botleft = new ResizeSquare(xCoordinate - 34,yCoordinate + 18);
        this.primitiveType = primitiveType; //loại hình học
        this.choose = true;
    }
    //  when mouse is clicked, check whether there is a primitive lying under the mouse
    isChosenOROverlapping(xCoordinate, yCoordinate){
        if(this.topleft.x <= xCoordinate && this.topleft.y <= yCoordinate &&
            this.botright.x >= xCoordinate && this.botright.y >= yCoordinate)
            return true;
        return false;
    }
    beingSelect(context){
        if(this.choose){
            this.topleft.visible(context);
            this.topright.visible(context);
            this.botright.visible(context);
            this.botleft.visible(context);
        }
    }
    onWhatSide(primitive){
        //dx > dy
        var dx = Math.abs(this.topleft.x +34 - primitive.topleft.x);
        var dy = Math.abs(this.topleft.y - primitive.topleft.y);
        if(dx>dy){
            if(this.topright.x<primitive.topleft.x)
                return 1;
            if(this.topleft.x > primitive.topright.x)
                return 0;
        }
        else if(dy > dx){
            if(this.topleft.y >primitive.botleft.y)
                return 2;
            if(this.botleft.y < primitive.topleft.y)
                return 3;
        }
        return -1;
    }
    drawRectangle(context){
        context.beginPath();
        context.moveTo(this.topleft.x, this.topleft.y);
        context.lineTo(this.topright.x, this.topright.y);
        context.lineTo(this.botright.x, this.botright.y);
        context.lineTo(this.botleft.x, this.botleft.y);
        context.closePath();
        context.stroke();
    }
    
    //  Draw a rhombus for If-else condition
    drawRhombus(context){
        context.beginPath();
        context.moveTo((this.topleft.x+this.topright.x)/2, this.topleft.y);
        context.lineTo(this.topright.x, (this.topright.y+this.botright.y)/2);
        context.lineTo((this.topleft.x+this.topright.x)/2, this.botright.y);
        context.lineTo(this.botleft.x, (this.topright.y+this.botright.y)/2);
        context.closePath();
        context.stroke();
    }
    stillChoosing(){
        return this.choose? true:false;
    }
    isChoosing(){
        this.choose = true;
    }
}

