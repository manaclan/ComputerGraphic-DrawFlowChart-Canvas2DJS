class Point {
    constructor(x, y) {
        this.x = x; 
        this.y = y; 
    }
    isCoincide(point){
        return (this.x == point.x && this.y == point.y)? 1: 0;
    }
}