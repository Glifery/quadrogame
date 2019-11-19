import {Body} from "detect-collisions";

export abstract class BBox {
    static shapeCircle: string = 'circle';
    static shapeRectangle: string = 'rectangle';
    static shapeLine: string = 'line';
    static shapePoint: string = 'point';

    protected shape: string;
    protected mass: number;
    protected collider: Body;

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

    getCollider(): Body {
        return this.collider;
    }

    setCollider(collider: Body): BBox {
        this.collider = collider;

        return this;
    }
}