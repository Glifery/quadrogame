import {LineBBox} from "./LineBBox";

export class RectangleBBox extends LineBBox {
    protected depth: number;

    constructor(mass: number = 0, x: number, y: number, x2: number, y2: number, depth: number) {
        super(mass, x, y, x2, y2);

        this.depth = depth;
    }

    getDepth(): number {
        return this.depth;
    }
}