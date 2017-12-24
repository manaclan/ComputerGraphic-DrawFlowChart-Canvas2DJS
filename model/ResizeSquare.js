class ResizeSquare {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    isCoincide(square){
        return (this.x == square.x && this.y == square.y)? 1: 0;
    }
    visible(context){
       
        context.beginPath();
        context.moveTo(this.x-3, this.y-3);
        context.lineTo(this.x+3, this.y-3);
        context.lineTo(this.x+3, this.y+3);
        context.lineTo(this.x-3, this.y+3);
        context.closePath();
        context.stroke();
        context.fillStyle = "white";
        context.fillRect(this.x-3,this.y-3,6,6);
        
    }
}