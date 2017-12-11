class GeometricPrimitive {
    constructor(xCoordinate, yCoordinate, primitiveType) {
        this.xCoordinate = xCoordinate; //tọa độ x
        this.yCoordinate = yCoordinate; //tọa độ y
        this.primitiveType = primitiveType; //loại hình học
        this.left = xCoordinate-34;
        this.right = xCoordinate + 34;
        this.top = yCoordinate - 18;
        this.bot = yCoordinate +18;
    }
    //  when mouse is clicked, check whether there is a primitive lying under the mouse
    isChosenOROverlapping(xCoordinate, yCoordinate){
        if(this.xCoordinate - 34 <= xCoordinate && this.yCoordinate - 18 <= yCoordinate &&
            this.xCoordinate + 34>=xCoordinate && this.yCoordinate + 18 >= yCoordinate)
            return true;
        return false;
    }

    onWhatSide(primitive){
        //dx > dy
        var dx = Math.abs(this.xCoordinate - primitive.xCoordinate);
        var dy = Math.abs(this.yCoordinate - primitive.yCoordinate);
        if(dx>dy){
            if(this.right<primitive.left)
                return 1;
            if(this.left > primitive.right)
                return 0;
        }
        else if(dy > dx){
            if(this.top >primitive.bot)
                return 2;
            if(this.bot < primitive.top)
                return 3;
        }
        return -1;
    }
}

