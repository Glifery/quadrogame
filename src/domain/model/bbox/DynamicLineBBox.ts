import {Vector} from "../Vector";
import {LineBBox} from "./LineBBox";

export class DynamicLineBBox extends LineBBox {
    setXY(x2: number, y2: number): void {
        this.vector = new Vector(x2 - this.x, y2 - this.y);
    }
}