import {Entity} from "../model/Entity";
import {CircleBBox} from "../model/bbox/CircleBBox";

export class Hero extends Entity {
    constructor(x: number, y: number, dir: number = 0) {
        super(x, y, dir);

        this.bbox = new CircleBBox(20, 10);
    }
}