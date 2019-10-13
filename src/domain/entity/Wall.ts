import {Entity} from "../model/Entity";
import {Vector} from "../model/Vector";
import {CollisionEntityInterface} from "./interface/CollisionEntityInterface";

export class Wall extends Entity implements CollisionEntityInterface {
    _CollisionEntityInterface(): void {};
    private vector: Vector;

    constructor(x: number, y: number, x2: number, y2: number) {
        super(x, y);

        this.vector = new Vector(x2 - x, y2 - y);
    }

    getVector(): Vector {
        return this.vector;
    }
}