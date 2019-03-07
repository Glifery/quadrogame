export class Projection {
    private x: number;
    private y: number;
    private scale: number;

    constructor(x: number, y: number, scale: number) {
        this.x = x;
        this.y = y;
        this.scale = scale;
    }

    getX(): number {
        return this.x;
    }

    getY(): number {
        return this.y;
    }

    getScale(): number {
        return this.scale;
    }
}