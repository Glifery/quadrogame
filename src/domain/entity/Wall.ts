import {Entity} from "../model/Entity";
import {Vector} from "../model/Vector";
import {DynamicLineBBox} from "../model/bbox/DynamicLineBBox";
import {LineBBox} from "../model/bbox/LineBBox";

export class Wall extends Entity {
    private vector: Vector;

    constructor(x: number, y: number, x2: number, y2: number) {
        super(x, y);

        this.vector = new Vector(x2 - x, y2 - y);
    }

    init(): void {
        this.getHandlerMetadata('main').set('mass', 0);

        this.getHandlerMetadata('CollisionEntityInterface').set('reaction', true);

        this.getHandlerMetadata('CollisionBehavior').set('bbox', new LineBBox(
            this.getHandlerMetadata('main').get('mass'),
            0, 0,
            this.vector.getX(), this.vector.getY()
        ));
    }

    getVector(): Vector {
        return this.vector;
    }
}