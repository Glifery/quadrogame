import {Entity} from "../model/Entity";
import {Vector} from "../model/Vector";

export class Wall extends Entity {
    private vector: Vector;

    constructor(x: number, y: number, x2: number, y2: number) {
        super(x, y);

        this.vector = new Vector(x2 - x, y2 - y);
    }

    init(): void {
        this.getHandlerMetadata('CollisionEntityInterface').set('reaction', true);
    }

    getVector(): Vector {
        return this.vector;
    }
}