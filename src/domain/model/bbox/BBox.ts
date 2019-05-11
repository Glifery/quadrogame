export abstract class BBox {
    static shapeCircle: string = 'circle';
    static shapeRectangle: string = 'rectangle';

    protected shape: string;
    protected mass: number;

    protected constructor(shape: string, mass: number = 0) {
        this.shape = shape;
        this.mass = mass;
    }

    getShape(): string {
        return this.shape;
    };

    getMass(): number {
        return this.mass
    }
}