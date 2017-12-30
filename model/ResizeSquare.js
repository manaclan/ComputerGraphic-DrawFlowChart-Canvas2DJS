class ResizeSquare {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    isCoincide(square){
        return (this.x == square.x && this.y == square.y)? 1: 0;
    }
    isChosen(x,y){
        var point = context.transform.transformOriginalToTransform(this.x,this.y);
       return (point.x-3 < x && point.x+3 > x && point.y-3 < y && point.y+3 > y)? true:false;
    }
    visible(context){
        var point = context.transform.transformOriginalToTransform(this.x,this.y);
        context.transform.save();
        context.transform.identity();
        context.beginPath();
        context.moveTo(point.x-3, point.y-3);
        context.lineTo(point.x+3, point.y-3);
        context.lineTo(point.x+3, point.y+3);
        context.lineTo(point.x-3, point.y+3);
        context.closePath();
        context.stroke();
        context.fillStyle = "white";
        context.fillRect(point.x-3,point.y-3,6,6);
        context.transform.restore();
    }
    UpdateCoordinate(xIncrement, yIncrement){
        this.x += xIncrement;
        this.y += yIncrement;
    }
    SwapWith(square){
        this.x = square.x;
        this.y = square.y;
    }
}