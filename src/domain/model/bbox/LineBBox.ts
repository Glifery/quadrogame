import {BBox} from "./BBox";
import {Vector} from "../Vector";

export class LineBBox extends BBox {
    private x: number;
    private y: number;
    private vector: Vector;

    constructor(mass: number = 0, x: number, y: number, x2: number, y2: number) {
        super(BBox.shapeLine, mass);

        this.x = x;
        this.y = y;
        this.vector = new Vector(x2 - x, y2 - y);
    }

    getX(): number {
        return this.x;
    }

    getY(): number {
        return this.y;
    }

    getVector(): Vector {
        return this.vector;
    }
}