import {Entity} from "../model/Entity";

export class Wall extends Entity {
    private x2: number;
    private y2: number;

    constructor(x: number, y: number, x2: number, y2: number) {
        super(x, y);

        this.x2 = x2;
        this.y2 = y2;
    }
}