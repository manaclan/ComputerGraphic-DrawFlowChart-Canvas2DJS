class Line {
    constructor(x1, y1, x2, y2) {
        this.x1 = x1; 
        this.y1 = y1; 
        this.x2 = x2;
        this.y2 = y2;
    }
    isChosen(xCoordinate, yCoordinate){
        if(this.xCoordinate - 2 <= xCoordinate && this.yCoordinate - 1 <= yCoordinate &&
            this.xCoordinate + 2>=xCoordinate && this.yCoordinate + 1 >= yCoordinate)
            return true;
        return false;
    }
}
