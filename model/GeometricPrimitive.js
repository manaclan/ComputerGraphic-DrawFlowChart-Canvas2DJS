class GeometricPrimitive {
    constructor(xCoordinate, yCoordinate, primitiveType) {
        this.topleft = new ResizeSquare(xCoordinate-34,yCoordinate - 18);
        this.topright = new ResizeSquare(xCoordinate + 34,yCoordinate - 18);
        this.botright = new ResizeSquare(xCoordinate + 34,yCoordinate +18);
        this.botleft = new ResizeSquare(xCoordinate - 34,yCoordinate + 18);
        this.primitiveType = primitiveType; //loại hình học
        this.choose = true;
        this.text = "";
    }
    //  when mouse is clicked, check whether there is a primitive lying under the mouse
    isChosen(xCoordinate, yCoordinate){
        if(this.topleft.x <= xCoordinate && this.topleft.y <= yCoordinate &&
            this.botright.x >= xCoordinate && this.botright.y >= yCoordinate)
            return true;
        return false;
    }
    isOverlappedWith(primitive){
        if(primitive.topleft.x <= this.topleft.x && primitive.topleft.y <= this.topleft.y &&
            primitive.botright.x >= this.topleft.x && primitive.botright.y >= this.topleft.y)
            return true;
        if(primitive.topleft.x <= this.topright.x && primitive.topleft.y <= this.topright.y &&
            primitive.botright.x >= this.topright.x && primitive.botright.y >= this.topright.y)
            return true;
        if(primitive.topleft.x <= this.botright.x && primitive.topleft.y <= this.botright.y &&
            primitive.botright.x >= this.botright.x && primitive.botright.y >= this.botright.y)
            return true;
        if(primitive.topleft.x <= this.botleft.x && primitive.topleft.y <= this.botleft.y &&
            primitive.botright.x >= this.botleft.x && primitive.botright.y >= this.botleft.y)
            return true;
        return false;
    }
    DrawResizeSquare(context){
        if(this.choose){
            this.topleft.visible(context);
            this.topright.visible(context);
            this.botright.visible(context);
            this.botleft.visible(context);
        }
    }
    onWhatSide(primitive){
        var dx = Math.abs(this.topleft.x - primitive.topleft.x);
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
    DrawRectangle(context){
        context.beginPath();
        context.moveTo(this.topleft.x, this.topleft.y);
        context.lineTo(this.topright.x, this.topright.y);
        context.lineTo(this.botright.x, this.botright.y);
        context.lineTo(this.botleft.x, this.botleft.y);
        context.closePath();
        context.stroke();
    }
    DrawTextBox(context){
        context.beginPath();
        context.moveTo(this.topleft.x, this.topleft.y);
        context.lineTo(this.topright.x, this.topright.y);
        context.lineTo(this.botright.x, this.botright.y);
        context.lineTo(this.botleft.x, this.botleft.y);
        context.closePath();
        context.strokeStyle="#ffffff";
        context.stroke();
    }
    
    //  Draw a rhombus for If-else condition
    DrawRhombus(context){
        context.beginPath();
        context.moveTo((this.topleft.x+this.topright.x)/2, this.topleft.y);
        context.lineTo(this.topright.x, (this.topright.y+this.botright.y)/2);
        context.lineTo((this.topleft.x+this.topright.x)/2, this.botright.y);
        context.lineTo(this.botleft.x, (this.topright.y+this.botright.y)/2);
        context.closePath();
        context.stroke();
    }
    isChoosing(){
        return this.choose? true:false;
    }
    Choosing(){
        this.choose = true;
    }
    StopChoosing(){
        this.choose = false;
    }
    GetChosenSquareIndex(x, y){
        if(this.topleft.isChosen(x,y))
            return 0;//top left
        if(this.topright.isChosen(x,y))
            return 1;//top right
        if(this.botright.isChosen(x,y))
            return 2;//bot right
        if(this.botleft.isChosen(x,y))
            return 3;//bot left
        return -1;
    }
    GetChosenSquare(index){
        if(index == 0)
            return this.topleft;
        if(index == 1)
            return this.topright;
        if(index == 2)
            return this.botright;
        if(index == 3)
            return this.botleft;
        return null;
    }
    UpdateCoordinate(xIncrement, yIncrement){
        this.topleft.UpdateCoordinate(xIncrement,yIncrement);
        this.topright.UpdateCoordinate(xIncrement,yIncrement);
        this.botright.UpdateCoordinate(xIncrement,yIncrement);
        this.botleft.UpdateCoordinate(xIncrement,yIncrement);
    }
    AddText(text){
        this.text = text;
    }
    DisplayText(context){
        switch(this.primitiveType){
            case 1:
            {
                context.fillText(this.text,(this.topleft.x + this.topright.x - this.text.length*10)/2,(this.botleft.y+this.topleft.y)/2 + 5);
                break;
            }
            case 2:
            {
                context.fillText(this.text,(this.topleft.x + this.topright.x - this.text.length*10)/2 ,(this.botleft.y+this.topleft.y)/2 + 5);
                break;
            }
            case 4:
            {
                context.fillText(this.text,(this.topleft.x + this.topright.x - this.text.length*10)/2,(this.botleft.y+this.topleft.y)/2 + 5);
                break;
            }
        }
        
    }
}

