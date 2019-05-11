import {BBox} from "./BBox";

export class CircleBBox extends BBox {
    private radius;
    private offsetX;
    private offsetY;

    constructor(radius: number, mass: number = 0, offsetX: number = 0, offsetY: number = 0) {
        super(BBox.shapeCircle, mass);

        this.radius = radius;
        this.offsetX = offsetX;
        this.offsetY = offsetY;
    }

    getRadius(): number {
        return this.radius;
    }

    getOffsetX(): number {
        return this.offsetX;
    }

    getOffsetY(): number {
        return this.offsetY;
    }
}