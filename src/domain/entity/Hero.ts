import {Entity} from "../model/Entity";
import {CircleBBox} from "../model/bbox/CircleBBox";

export class Hero extends Entity {
    init(): void {
        this.getHandlerMetadata('main').set('radius', 20);
        this.getHandlerMetadata('main').set('mass', 10);

        this.getHandlerMetadata('CollisionEntityInterface').set('reaction', true);

        this.getHandlerMetadata('CollisionBehavior').set('bbox', new CircleBBox(
            this.getHandlerMetadata('main').get('radius'),
            this.getHandlerMetadata('main').get('mass')
        ));
    }
}