export class Projection {
    private x: number;
    private y: number;
    private rotation: number;
    private scale: number;

    constructor(x: number, y: number, rotation: number, scale: number) {
        this.x = x;
        this.y = y;
        this.rotation = rotation;
        this.scale = scale;
    }

    getX(): number {
        return this.x;
    }

    getY(): number {
        return this.y;
    }

    getRotation(): number {
        return this.rotation;
    }

    getScale(): number {
        return this.scale;
    }
}